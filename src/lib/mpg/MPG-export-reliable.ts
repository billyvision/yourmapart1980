import L from 'leaflet';
import html2canvas from 'html2canvas';
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

// Pre-load fonts
async function preloadFonts(fonts: string[]): Promise<void> {
  const promises = [];
  for (const font of fonts) {
    const family = getFontFamily(font).split(',')[0].trim();
    promises.push(
      document.fonts.load(`300 120px "${family}"`).catch(() => {}),
      document.fonts.load(`400 36px "${family}"`).catch(() => {}),
      document.fonts.load(`400 32px "Roboto"`).catch(() => {})
    );
  }
  await Promise.all(promises);
  await new Promise(resolve => setTimeout(resolve, 200));
}

export async function exportMapPosterReliable(options: ExportOptions): Promise<void> {
  const { format, size, quality, fileName, mapData } = options;
  const dimensions = MPG_CANVAS_SIZES[size as keyof typeof MPG_CANVAS_SIZES] || MPG_CANVAS_SIZES.A4;
  
  try {
    // Pre-load fonts
    await preloadFonts([mapData.titleFont]);
    
    // Create export container
    const exportContainer = document.createElement('div');
    exportContainer.id = 'mpg-export-container';
    exportContainer.style.position = 'fixed';
    exportContainer.style.left = '-99999px';
    exportContainer.style.top = '0';
    exportContainer.style.width = `${dimensions.width}px`;
    exportContainer.style.height = `${dimensions.height}px`;
    exportContainer.style.backgroundColor = '#ffffff';
    exportContainer.style.padding = '100px';
    exportContainer.style.boxSizing = 'border-box';
    exportContainer.style.display = 'flex';
    exportContainer.style.flexDirection = 'column';
    exportContainer.style.alignItems = 'center';
    exportContainer.style.fontFamily = 'Roboto, sans-serif';
    document.body.appendChild(exportContainer);

    // Calculate map size
    const mapSize = Math.min(dimensions.width - 200, dimensions.height - 400) * 0.7;
    
    // Create map wrapper
    const mapWrapper = document.createElement('div');
    mapWrapper.style.width = `${mapSize}px`;
    mapWrapper.style.height = `${mapSize}px`;
    mapWrapper.style.marginBottom = '80px';
    mapWrapper.style.position = 'relative';
    mapWrapper.style.backgroundColor = '#f0f0f0';
    
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
    
    exportContainer.appendChild(mapWrapper);
    
    // Initialize Leaflet map
    const map = L.map(mapWrapper, {
      center: [mapData.lat, mapData.lng],
      zoom: mapData.zoom,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false
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
      const mapContainer = mapWrapper.querySelector('.leaflet-container') as HTMLElement;
      if (mapContainer) {
        mapContainer.style.filter = mapData.style.filter;
      }
    }
    
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
      coords.style.fontWeight = '400';
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
      country.style.fontWeight = '400';
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
    
    exportContainer.appendChild(textContainer);
    
    // Wait for tiles to load
    await new Promise<void>((resolve) => {
      let tilesLoaded = false;
      
      // Check if tiles are loaded
      const checkTiles = () => {
        const tiles = mapWrapper.querySelectorAll('.leaflet-tile');
        const loadedTiles = Array.from(tiles).filter(tile => {
          if (tile instanceof HTMLImageElement) {
            return tile.complete && tile.naturalHeight !== 0;
          }
          return false;
        });
        
        if (loadedTiles.length > 0 && !tilesLoaded) {
          tilesLoaded = true;
          setTimeout(() => resolve(), 1000); // Extra wait for rendering
        }
      };
      
      // Check periodically
      const interval = setInterval(checkTiles, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        resolve();
      }, 10000);
    });
    
    // Use html2canvas to capture the container
    const canvas = await html2canvas(exportContainer, {
      width: dimensions.width,
      height: dimensions.height,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure fonts are loaded in cloned document
        const clonedContainer = clonedDoc.getElementById('mpg-export-container');
        if (clonedContainer) {
          clonedContainer.style.left = '0';
        }
      }
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
        
        // Clean up
        map.remove();
        document.body.removeChild(exportContainer);
      },
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      quality
    );
    
  } catch (error) {
    console.error('Export failed:', error);
    // Clean up on error
    const container = document.getElementById('mpg-export-container');
    if (container) {
      document.body.removeChild(container);
    }
    throw error;
  }
}