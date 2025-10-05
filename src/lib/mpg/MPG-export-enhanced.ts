import html2canvas from 'html2canvas';
import L from 'leaflet';
import { MPG_CANVAS_SIZES, MPG_TILE_PROVIDERS } from './MPG-constants';

interface ExportOptions {
  format: 'png' | 'jpg';
  size: string;
  quality: number;
  fileName?: string;
  mapData: {
    lat: number;
    lng: number;
    zoom: number;
    style: any;
    frameStyle: string;
    city: string;
    country: string;
    showCoordinates: boolean;
    showCountry: boolean;
    customText: string;
    letterSpacing: number;
    titleFont: string;
  };
}

// Create a hidden container for export rendering
function createExportContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.id = 'mpg-export-container';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.backgroundColor = '#ffffff';
  container.style.zIndex = '-1';
  document.body.appendChild(container);
  return container;
}

// Render map specifically for export
async function renderMapForExport(options: ExportOptions): Promise<HTMLElement> {
  const { mapData, size } = options;
  const dimensions = MPG_CANVAS_SIZES[size as keyof typeof MPG_CANVAS_SIZES] || MPG_CANVAS_SIZES.A4;
  
  // Create export container
  const exportContainer = createExportContainer();
  exportContainer.style.width = `${dimensions.width}px`;
  exportContainer.style.height = `${dimensions.height}px`;
  
  // Create poster wrapper
  const posterWrapper = document.createElement('div');
  posterWrapper.style.width = '100%';
  posterWrapper.style.height = '100%';
  posterWrapper.style.backgroundColor = '#ffffff';
  posterWrapper.style.display = 'flex';
  posterWrapper.style.flexDirection = 'column';
  posterWrapper.style.alignItems = 'center';
  posterWrapper.style.justifyContent = 'center';
  posterWrapper.style.padding = '100px';
  posterWrapper.style.boxSizing = 'border-box';
  
  // Calculate map size (60% of the smaller dimension)
  const mapSize = Math.min(dimensions.width, dimensions.height) * 0.5;
  
  // Create map container with proper dimensions
  const mapWrapper = document.createElement('div');
  mapWrapper.style.width = `${mapSize}px`;
  mapWrapper.style.height = `${mapSize}px`;
  mapWrapper.style.position = 'relative';
  mapWrapper.style.marginBottom = '80px';
  
  // Apply frame style
  if (mapData.frameStyle === 'circle') {
    mapWrapper.style.borderRadius = '50%';
    mapWrapper.style.overflow = 'hidden';
  } else if (mapData.frameStyle === 'rounded') {
    mapWrapper.style.borderRadius = '32px';
    mapWrapper.style.overflow = 'hidden';
  } else {
    mapWrapper.style.borderRadius = '0';
    mapWrapper.style.overflow = 'hidden';
  }
  
  // Create the actual map container
  const mapContainer = document.createElement('div');
  mapContainer.id = 'export-map';
  mapContainer.style.width = '100%';
  mapContainer.style.height = '100%';
  mapContainer.style.position = 'relative';
  
  mapWrapper.appendChild(mapContainer);
  posterWrapper.appendChild(mapWrapper);
  
  // Create text container
  const textContainer = document.createElement('div');
  textContainer.style.textAlign = 'center';
  textContainer.style.width = '100%';
  
  // Add city name
  const cityTitle = document.createElement('h2');
  cityTitle.textContent = mapData.city.toUpperCase();
  cityTitle.style.fontSize = '120px';
  cityTitle.style.fontFamily = getFontFamily(mapData.titleFont);
  cityTitle.style.fontWeight = '300';
  cityTitle.style.letterSpacing = `${mapData.letterSpacing * 2}px`;
  cityTitle.style.textTransform = 'uppercase';
  cityTitle.style.color = '#333333';
  cityTitle.style.margin = '0 0 30px 0';
  cityTitle.style.lineHeight = '1';
  textContainer.appendChild(cityTitle);
  
  // Add coordinates
  if (mapData.showCoordinates) {
    const coords = document.createElement('p');
    const latText = `${Math.abs(mapData.lat).toFixed(4)}°${mapData.lat >= 0 ? 'N' : 'S'}`;
    const lngText = `${Math.abs(mapData.lng).toFixed(4)}°${mapData.lng >= 0 ? 'E' : 'W'}`;
    coords.textContent = `${latText} / ${lngText}`;
    coords.style.fontSize = '32px';
    coords.style.fontFamily = 'Roboto, sans-serif';
    coords.style.letterSpacing = '4px';
    coords.style.color = '#888888';
    coords.style.margin = '0 0 20px 0';
    textContainer.appendChild(coords);
  }
  
  // Add country
  if (mapData.showCountry) {
    const country = document.createElement('p');
    country.textContent = mapData.country.toUpperCase();
    country.style.fontSize = '36px';
    country.style.fontFamily = 'Roboto, sans-serif';
    country.style.letterSpacing = '8px';
    country.style.textTransform = 'uppercase';
    country.style.color = '#666666';
    country.style.margin = '0';
    textContainer.appendChild(country);
  }
  
  // Add custom text
  if (mapData.customText) {
    const customText = document.createElement('p');
    customText.textContent = mapData.customText;
    customText.style.fontSize = '36px';
    customText.style.fontFamily = 'Roboto, sans-serif';
    customText.style.fontStyle = 'italic';
    customText.style.color = '#666666';
    customText.style.marginTop = '40px';
    textContainer.appendChild(customText);
  }
  
  posterWrapper.appendChild(textContainer);
  exportContainer.appendChild(posterWrapper);
  
  // Initialize Leaflet map
  const map = L.map(mapContainer, {
    center: [mapData.lat, mapData.lng],
    zoom: mapData.zoom,
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    dragging: false,
    doubleClickZoom: false,
    touchZoom: false,
    keyboard: false,
    boxZoom: false
  });
  
  // Get tile provider
  const tileProvider = mapData.style?.tileProvider || 'osm';
  const tileConfig = MPG_TILE_PROVIDERS[tileProvider as keyof typeof MPG_TILE_PROVIDERS] || MPG_TILE_PROVIDERS.osm;
  
  // Add tile layer
  const tileLayer = L.tileLayer(tileConfig.url, {
    attribution: '',
    crossOrigin: 'anonymous'
  });
  
  tileLayer.addTo(map);
  
  // Apply style filter
  if (mapData.style?.filter) {
    mapContainer.style.filter = mapData.style.filter;
  }
  
  // Wait for tiles to load
  return new Promise((resolve) => {
    let tilesLoaded = 0;
    let totalTiles = 0;
    
    tileLayer.on('tileloadstart', () => {
      totalTiles++;
    });
    
    tileLayer.on('tileload', () => {
      tilesLoaded++;
      if (tilesLoaded === totalTiles && totalTiles > 0) {
        // All tiles loaded, wait a bit more for rendering
        setTimeout(() => {
          resolve(exportContainer);
        }, 1000);
      }
    });
    
    tileLayer.on('tileerror', () => {
      tilesLoaded++;
      if (tilesLoaded === totalTiles && totalTiles > 0) {
        setTimeout(() => {
          resolve(exportContainer);
        }, 1000);
      }
    });
    
    // Force map to load tiles
    map.invalidateSize();
    
    // Fallback timeout
    setTimeout(() => {
      resolve(exportContainer);
    }, 5000);
  });
}

function getFontFamily(fontId: string): string {
  const fontMap: Record<string, string> = {
    'playfair': 'Playfair Display, serif',
    'montserrat': 'Montserrat, sans-serif',
    'bebas': 'Bebas Neue, sans-serif',
    'roboto': 'Roboto, sans-serif',
    'lato': 'Lato, sans-serif',
    'oswald': 'Oswald, sans-serif',
    'opensans': 'Open Sans, sans-serif'
  };
  return fontMap[fontId] || 'Roboto, sans-serif';
}

export async function exportMapPosterEnhanced(options: ExportOptions): Promise<void> {
  const { format, size, quality, fileName } = options;
  const dimensions = MPG_CANVAS_SIZES[size as keyof typeof MPG_CANVAS_SIZES] || MPG_CANVAS_SIZES.A4;
  
  try {
    // Render the map for export
    const exportElement = await renderMapForExport(options);
    
    // Wait a bit more to ensure everything is rendered
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create canvas with html2canvas
    const canvas = await html2canvas(exportElement, {
      width: dimensions.width,
      height: dimensions.height,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    // Convert to blob and download
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${fileName || 'map-poster'}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        
        // Cleanup
        const exportContainer = document.getElementById('mpg-export-container');
        if (exportContainer) {
          document.body.removeChild(exportContainer);
        }
      },
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      quality
    );
  } catch (error) {
    console.error('Export failed:', error);
    // Cleanup on error
    const exportContainer = document.getElementById('mpg-export-container');
    if (exportContainer) {
      document.body.removeChild(exportContainer);
    }
    throw error;
  }
}