import L from 'leaflet';
import leafletImage from 'leaflet-image';
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

async function createMapImage(mapData: any, mapSize: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    // Create a temporary container for the map
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = `${mapSize}px`;
    tempContainer.style.height = `${mapSize}px`;
    document.body.appendChild(tempContainer);

    // Initialize map
    const map = L.map(tempContainer, {
      center: [mapData.lat, mapData.lng],
      zoom: mapData.zoom,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true
    });

    // Get tile provider
    const tileProvider = mapData.style?.tileProvider || 'osm';
    const tileConfig = MPG_TILE_PROVIDERS[tileProvider as keyof typeof MPG_TILE_PROVIDERS] || MPG_TILE_PROVIDERS.osm;

    // Add tile layer
    L.tileLayer(tileConfig.url, {
      attribution: '',
      crossOrigin: true
    }).addTo(map);

    // Wait for tiles to load and then export
    setTimeout(() => {
      leafletImage(map, (err: any, canvas: HTMLCanvasElement) => {
        // Clean up
        map.remove();
        document.body.removeChild(tempContainer);
        
        if (err) {
          reject(err);
        } else {
          // Apply style filter to canvas
          if (mapData.style?.filter) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.filter = mapData.style.filter;
              ctx.drawImage(canvas, 0, 0);
            }
          }
          resolve(canvas);
        }
      });
    }, 3000); // Give time for tiles to load
  });
}

export async function exportMapPosterFinal(options: ExportOptions): Promise<void> {
  const { format, size, quality, fileName, mapData } = options;
  const dimensions = MPG_CANVAS_SIZES[size as keyof typeof MPG_CANVAS_SIZES] || MPG_CANVAS_SIZES.A4;
  
  try {
    // Calculate sizes
    const mapSize = Math.min(dimensions.width, dimensions.height) * 0.6;
    const padding = 100;
    
    // Create main canvas
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Get map image
    const mapCanvas = await createMapImage(mapData, mapSize);
    
    // Calculate position for centered map
    const mapX = (dimensions.width - mapSize) / 2;
    const mapY = padding + 100; // Extra space at top
    
    // Save context state
    ctx.save();
    
    // Apply frame clipping
    if (mapData.frameStyle === 'circle') {
      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(mapX + mapSize / 2, mapY + mapSize / 2, mapSize / 2, 0, Math.PI * 2);
      ctx.clip();
    } else if (mapData.frameStyle === 'rounded') {
      // Create rounded rectangle clipping path
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
    
    // Draw the map with proper scaling
    ctx.drawImage(mapCanvas, mapX, mapY, mapSize, mapSize);
    
    // Restore context (remove clipping)
    ctx.restore();
    
    // Add text below map
    const textY = mapY + mapSize + 120;
    
    // City name
    ctx.font = `300 ${dimensions.width * 0.048}px ${getFontFamily(mapData.titleFont)}`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.letterSpacing = `${mapData.letterSpacing * 3}px`;
    
    // Draw city name with letter spacing
    const cityText = mapData.city.toUpperCase();
    const cityWidth = ctx.measureText(cityText).width;
    const startX = dimensions.width / 2 - cityWidth / 2;
    
    for (let i = 0; i < cityText.length; i++) {
      const char = cityText[i];
      const charX = startX + (i * (cityWidth / cityText.length)) + (i * mapData.letterSpacing * 2);
      ctx.fillText(char, charX, textY);
    }
    
    // Coordinates
    if (mapData.showCoordinates) {
      ctx.font = `400 ${dimensions.width * 0.013}px Roboto, sans-serif`;
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'center';
      const latText = `${Math.abs(mapData.lat).toFixed(4)}°${mapData.lat >= 0 ? 'N' : 'S'}`;
      const lngText = `${Math.abs(mapData.lng).toFixed(4)}°${mapData.lng >= 0 ? 'E' : 'W'}`;
      ctx.fillText(`${latText} / ${lngText}`, dimensions.width / 2, textY + 60);
    }
    
    // Country
    if (mapData.showCountry) {
      ctx.font = `400 ${dimensions.width * 0.014}px Roboto, sans-serif`;
      ctx.fillStyle = '#666666';
      ctx.textAlign = 'center';
      ctx.letterSpacing = `${8}px`;
      ctx.fillText(mapData.country.toUpperCase(), dimensions.width / 2, textY + 110);
    }
    
    // Custom text
    if (mapData.customText) {
      ctx.font = `italic 400 ${dimensions.width * 0.014}px Roboto, sans-serif`;
      ctx.fillStyle = '#666666';
      ctx.textAlign = 'center';
      ctx.fillText(mapData.customText, dimensions.width / 2, textY + 180);
    }
    
    // Convert canvas to blob and download
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