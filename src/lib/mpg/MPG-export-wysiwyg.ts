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

// Pre-load fonts to ensure they're available for canvas rendering
async function preloadFonts(fonts: string[]): Promise<void> {
  const fontPromises = fonts.map(font => {
    const fontFamilies = getFontFamily(font).split(',').map(f => f.trim());
    const promises = [];
    
    for (const family of fontFamilies) {
      // Load different weights and styles
      promises.push(
        document.fonts.load(`300 72px ${family}`).catch(() => {}),
        document.fonts.load(`400 36px ${family}`).catch(() => {}),
        document.fonts.load(`400 32px ${family}`).catch(() => {}),
        document.fonts.load(`italic 36px ${family}`).catch(() => {})
      );
    }
    
    return Promise.all(promises);
  });
  
  await Promise.all(fontPromises);
  // Wait a bit more to ensure fonts are ready
  await new Promise(resolve => setTimeout(resolve, 100));
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

// Create and render map to canvas with proper tile loading
async function renderMapToCanvas(mapData: any, width: number, height: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    // Create container for map
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    document.body.appendChild(container);

    // Initialize Leaflet map
    const map = L.map(container, {
      center: [mapData.lat, mapData.lng],
      zoom: mapData.zoom,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
      renderer: L.canvas()
    });

    // Get tile provider
    const tileProvider = mapData.style?.tileProvider || 'osm';
    const tileConfig = MPG_TILE_PROVIDERS[tileProvider as keyof typeof MPG_TILE_PROVIDERS] || MPG_TILE_PROVIDERS.osm;

    // Track tile loading
    let tilesLoading = 0;
    let tilesLoaded = 0;
    let allTilesLoaded = false;

    // Add tile layer with proper event handling
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: '',
      crossOrigin: true,
      tileSize: 256,
      maxZoom: 19
    });

    // Set up tile loading events
    tileLayer.on('tileloadstart', () => {
      tilesLoading++;
    });

    tileLayer.on('tileload', () => {
      tilesLoaded++;
      checkAllTilesLoaded();
    });

    tileLayer.on('tileerror', () => {
      tilesLoaded++;
      checkAllTilesLoaded();
    });

    const checkAllTilesLoaded = () => {
      if (!allTilesLoaded && tilesLoaded >= tilesLoading && tilesLoading > 0) {
        allTilesLoaded = true;
        // All tiles loaded, convert to canvas
        setTimeout(() => convertMapToCanvas(), 500);
      }
    };

    const convertMapToCanvas = () => {
      try {
        // Get the map container element
        const mapElement = container.querySelector('.leaflet-container') as HTMLElement;
        if (!mapElement) {
          throw new Error('Map element not found');
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Fill background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, width, height);

        // Get all tile images
        const tiles = mapElement.querySelectorAll('.leaflet-tile');
        const tileContainer = mapElement.querySelector('.leaflet-tile-container') as HTMLElement;
        
        if (tileContainer) {
          const containerTransform = tileContainer.style.transform;
          const translateMatch = containerTransform.match(/translate3d\(([^,]+)px,\s*([^,]+)px/);
          const offsetX = translateMatch ? parseFloat(translateMatch[1]) : 0;
          const offsetY = translateMatch ? parseFloat(translateMatch[2]) : 0;

          // Draw each tile to canvas
          tiles.forEach(tile => {
            if (tile instanceof HTMLImageElement) {
              const tileStyle = tile.style;
              const tileTransform = tileStyle.transform;
              const tileMatch = tileTransform.match(/translate3d\(([^,]+)px,\s*([^,]+)px/);
              
              if (tileMatch) {
                const x = parseFloat(tileMatch[1]) + offsetX;
                const y = parseFloat(tileMatch[2]) + offsetY;
                
                ctx.drawImage(tile, x, y, 256, 256);
              }
            }
          });
        }

        // Apply style filter if needed
        if (mapData.style?.filter) {
          ctx.filter = mapData.style.filter;
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = width;
          tempCanvas.height = height;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(canvas, 0, 0);
            ctx.filter = mapData.style.filter;
            ctx.drawImage(tempCanvas, 0, 0);
          }
        }

        // Clean up
        map.remove();
        document.body.removeChild(container);
        
        resolve(canvas);
      } catch (error) {
        map.remove();
        document.body.removeChild(container);
        reject(error);
      }
    };

    tileLayer.addTo(map);

    // Force map to render
    map.invalidateSize();

    // Timeout fallback
    setTimeout(() => {
      if (!allTilesLoaded) {
        console.warn('Tile loading timeout, proceeding with export');
        convertMapToCanvas();
      }
    }, 8000);
  });
}

export async function exportMapPosterWYSIWYG(options: ExportOptions): Promise<void> {
  const { format, size, quality, fileName, mapData } = options;
  const dimensions = MPG_CANVAS_SIZES[size as keyof typeof MPG_CANVAS_SIZES] || MPG_CANVAS_SIZES.A4;
  
  try {
    // Pre-load fonts
    await preloadFonts([mapData.titleFont, 'roboto']);
    
    // Calculate sizes
    const mapSize = Math.min(dimensions.width, dimensions.height) * 0.6;
    const padding = dimensions.width * 0.08;
    
    // Create main canvas for final poster
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Render map to canvas
    const mapCanvas = await renderMapToCanvas(mapData, mapSize, mapSize);
    
    // Calculate centered position
    const mapX = (dimensions.width - mapSize) / 2;
    const mapY = padding * 1.5;
    
    // Save context state for clipping
    ctx.save();
    
    // Apply frame clipping
    if (mapData.frameStyle === 'circle') {
      ctx.beginPath();
      ctx.arc(mapX + mapSize / 2, mapY + mapSize / 2, mapSize / 2, 0, Math.PI * 2);
      ctx.clip();
    } else if (mapData.frameStyle === 'rounded') {
      const radius = 32;
      ctx.beginPath();
      ctx.moveTo(mapX + radius, mapY);
      ctx.lineTo(mapX + mapSize - radius, mapY);
      ctx.quadraticCurveTo(mapX + mapSize, mapY, mapX + mapSize, mapY + radius);
      ctx.lineTo(mapX + mapSize, mapY + mapSize - radius);
      ctx.quadraticCurveTo(mapX + mapSize, mapY + mapSize, mapX + mapSize - radius, mapY + mapSize);
      ctx.lineTo(mapX + radius, mapY + mapSize);
      ctx.quadraticCurveTo(mapX, mapY + mapSize, mapX, mapY + mapSize - radius);
      ctx.lineTo(mapX, mapY + radius);
      ctx.quadraticCurveTo(mapX, mapY, mapX + radius, mapY);
      ctx.closePath();
      ctx.clip();
    }
    
    // Draw the map
    ctx.drawImage(mapCanvas, mapX, mapY, mapSize, mapSize);
    
    // Restore context (remove clipping)
    ctx.restore();
    
    // Text positioning
    const textY = mapY + mapSize + padding * 1.2;
    
    // Draw city name with proper letter spacing
    const fontSize = dimensions.width * 0.048;
    ctx.font = `300 ${fontSize}px ${getFontFamily(mapData.titleFont)}`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    
    // Draw city text with letter spacing
    const cityText = mapData.city.toUpperCase();
    if (mapData.letterSpacing > 0) {
      // Draw each character with spacing
      const charMetrics = [];
      let totalWidth = 0;
      
      for (let i = 0; i < cityText.length; i++) {
        const metrics = ctx.measureText(cityText[i]);
        charMetrics.push(metrics);
        totalWidth += metrics.width + (i < cityText.length - 1 ? mapData.letterSpacing * 2 : 0);
      }
      
      let currentX = (dimensions.width - totalWidth) / 2;
      for (let i = 0; i < cityText.length; i++) {
        ctx.fillText(cityText[i], currentX + charMetrics[i].width / 2, textY);
        currentX += charMetrics[i].width + mapData.letterSpacing * 2;
      }
    } else {
      ctx.fillText(cityText, dimensions.width / 2, textY);
    }
    
    // Draw coordinates
    if (mapData.showCoordinates) {
      ctx.font = `400 ${dimensions.width * 0.013}px Roboto, sans-serif`;
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'center';
      const latText = `${Math.abs(mapData.lat).toFixed(4)}°${mapData.lat >= 0 ? 'N' : 'S'}`;
      const lngText = `${Math.abs(mapData.lng).toFixed(4)}°${mapData.lng >= 0 ? 'E' : 'W'}`;
      ctx.fillText(`${latText} / ${lngText}`, dimensions.width / 2, textY + fontSize * 0.8);
    }
    
    // Draw country
    if (mapData.showCountry) {
      ctx.font = `400 ${dimensions.width * 0.014}px Roboto, sans-serif`;
      ctx.fillStyle = '#666666';
      ctx.textAlign = 'center';
      
      const countryText = mapData.country.toUpperCase();
      const countryY = textY + fontSize * 1.4;
      
      if (mapData.letterSpacing > 0) {
        // Draw with letter spacing
        const charMetrics = [];
        let totalWidth = 0;
        
        for (let i = 0; i < countryText.length; i++) {
          const metrics = ctx.measureText(countryText[i]);
          charMetrics.push(metrics);
          totalWidth += metrics.width + (i < countryText.length - 1 ? 8 : 0);
        }
        
        let currentX = (dimensions.width - totalWidth) / 2;
        for (let i = 0; i < countryText.length; i++) {
          ctx.fillText(countryText[i], currentX + charMetrics[i].width / 2, countryY);
          currentX += charMetrics[i].width + 8;
        }
      } else {
        ctx.fillText(countryText, dimensions.width / 2, countryY);
      }
    }
    
    // Draw custom text
    if (mapData.customText) {
      ctx.font = `italic 400 ${dimensions.width * 0.014}px Roboto, sans-serif`;
      ctx.fillStyle = '#666666';
      ctx.textAlign = 'center';
      ctx.fillText(mapData.customText, dimensions.width / 2, textY + fontSize * 2.2);
    }
    
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
      },
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      quality
    );
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}