// MapLibre GL JS service for Map Poster Generator
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Get API key from environment
const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || '';

if (!MAPTILER_API_KEY) {
  console.warn('Maptiler API key not found. Maps may not load properly.');
}

// Cache for map instances to avoid recreating
const mapInstanceCache = new Map<string, maplibregl.Map>();

export interface MapLibreOptions {
  lat: number;
  lng: number;
  zoom: number;
  width: number;
  height: number;
  style: string | any; // Can be style ID or custom style object
  bearing?: number;
  pitch?: number;
  interactive?: boolean;
}

/**
 * Create a hidden container for rendering maps
 */
function createHiddenContainer(width: number, height: number): HTMLDivElement {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.visibility = 'hidden';
  container.style.pointerEvents = 'none';
  
  // Add to body temporarily
  document.body.appendChild(container);
  
  return container;
}

/**
 * Initialize a MapLibre map instance
 */
export async function createMapLibreInstance(
  options: MapLibreOptions
): Promise<maplibregl.Map> {
  const { lat, lng, zoom, width, height, style, bearing = 0, pitch = 0, interactive = false } = options;
  
  // Create container
  const container = createHiddenContainer(width, height);
  
  // Determine style URL or object
  let mapStyle: string | any;
  
  if (typeof style === 'string') {
    // Check if it's a predefined style ID or a full URL
    if (style.startsWith('http') || style.startsWith('/')) {
      mapStyle = style;
    } else {
      // It's a style ID, we'll handle this in the styles module
      mapStyle = await import('./MPG-maplibre-styles').then(m => m.getMapStyle(style));
    }
  } else {
    // It's already a style object
    mapStyle = style;
  }
  
  // Create map instance
  const map = new maplibregl.Map({
    container,
    style: mapStyle,
    center: [lng, lat],
    zoom,
    bearing,
    pitch,
    interactive,
    attributionControl: false,
    trackResize: false,
    fadeDuration: 0, // Disable fade for instant rendering
    antialias: true,
    refreshExpiredTiles: false
  } as any);
  
  // Wait for map to load
  return new Promise((resolve, reject) => {
    map.on('load', () => {
      // Wait for all tiles to load
      map.once('idle', () => {
        resolve(map);
      });
    });
    
    map.on('error', (e) => {
      console.error('MapLibre error:', e);
      reject(e);
    });

    // Timeout after 30 seconds (increased to handle slower connections)
    setTimeout(() => {
      reject(new Error('Map loading timeout - please check your internet connection and try again'));
    }, 30000);
  });
}

/**
 * Render a MapLibre map to an image
 */
export async function renderMapToImage(
  options: MapLibreOptions
): Promise<string> {
  let map: maplibregl.Map | null = null;
  
  try {
    // Create map instance
    map = await createMapLibreInstance(options);
    
    // Get canvas and convert to data URL
    const canvas = map.getCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    
    // Clean up
    const container = map.getContainer();
    map.remove();
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    
    return dataUrl;
  } catch (error) {
    console.error('Error rendering map:', error);
    
    // Clean up on error
    if (map) {
      const container = map.getContainer();
      map.remove();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }
    
    throw error;
  }
}

/**
 * Render a MapLibre map to a HTMLImageElement
 */
export async function renderMapToImageElement(
  options: MapLibreOptions
): Promise<HTMLImageElement> {
  const dataUrl = await renderMapToImage(options);
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Create a cache key for map options
 */
function getCacheKey(options: MapLibreOptions): string {
  const { lat, lng, zoom, width, height, style } = options;
  const styleId = typeof style === 'string' ? style : 'custom';
  return `${lat}_${lng}_${zoom}_${width}_${height}_${styleId}`;
}

/**
 * Render map with caching
 */
const imageCache = new Map<string, string>();

export async function renderMapCached(
  options: MapLibreOptions,
  forceRefresh = false
): Promise<string> {
  const cacheKey = getCacheKey(options);
  
  if (!forceRefresh && imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }
  
  const dataUrl = await renderMapToImage(options);
  imageCache.set(cacheKey, dataUrl);
  
  // Limit cache size
  if (imageCache.size > 20) {
    const firstKey = imageCache.keys().next().value;
    if (firstKey) {
      imageCache.delete(firstKey);
    }
  }
  
  return dataUrl;
}

/**
 * Clear the image cache
 */
export function clearMapCache(): void {
  imageCache.clear();
}

/**
 * Get Maptiler API key
 */
export function getMaptilerApiKey(): string {
  return MAPTILER_API_KEY;
}

/**
 * Check if Maptiler is configured
 */
export function isMaptilerConfigured(): boolean {
  return !!MAPTILER_API_KEY;
}

/**
 * Preload map styles
 */
export async function preloadMapStyles(): Promise<void> {
  const { preloadStyles } = await import('./MPG-maplibre-styles');
  await preloadStyles();
}

/**
 * Get available map styles
 */
export async function getAvailableStyles(): Promise<Array<{id: string, name: string, preview?: any}>> {
  const { getStyleList } = await import('./MPG-maplibre-styles');
  return getStyleList();
}

/**
 * Create a map for export with higher DPI
 */
export async function renderMapForExport(
  options: MapLibreOptions,
  dpi: number = 300
): Promise<string> {
  // Calculate size based on DPI (300 DPI for print quality)
  const scale = dpi / 96; // 96 is standard screen DPI
  const exportOptions = {
    ...options,
    width: options.width * scale,
    height: options.height * scale
  };
  
  return renderMapToImage(exportOptions);
}

/**
 * Test connection to Maptiler
 */
export async function testMaptilerConnection(): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_API_KEY}`
    );
    return response.ok;
  } catch (error) {
    console.error('Failed to connect to Maptiler:', error);
    return false;
  }
}