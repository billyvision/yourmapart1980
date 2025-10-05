import React from 'react';
import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas';
import { MPGPreview } from '@/components/mpg/MPG-preview';
import { MPG_CANVAS_SIZES } from './MPG-constants';

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

// Pre-load fonts
async function preloadFonts(): Promise<void> {
  const fonts = [
    'Playfair Display',
    'Montserrat',
    'Bebas Neue',
    'Roboto',
    'Lato',
    'Oswald',
    'Open Sans'
  ];
  
  const promises = [];
  for (const font of fonts) {
    promises.push(
      document.fonts.load(`300 120px "${font}"`).catch(() => {}),
      document.fonts.load(`400 36px "${font}"`).catch(() => {}),
      document.fonts.load(`700 36px "${font}"`).catch(() => {})
    );
  }
  
  await Promise.all(promises);
  await new Promise(resolve => setTimeout(resolve, 500));
}

export async function exportMapPosterExact(options: ExportOptions): Promise<void> {
  const { format, size, quality, fileName } = options;
  const dimensions = MPG_CANVAS_SIZES[size as keyof typeof MPG_CANVAS_SIZES] || MPG_CANVAS_SIZES.A4;
  
  try {
    // Pre-load all fonts
    await preloadFonts();
    
    // Create export container
    const exportContainer = document.createElement('div');
    exportContainer.id = 'mpg-exact-export';
    exportContainer.style.position = 'fixed';
    exportContainer.style.left = '-99999px';
    exportContainer.style.top = '0';
    exportContainer.style.width = `${dimensions.width}px`;
    exportContainer.style.height = `${dimensions.height}px`;
    exportContainer.style.backgroundColor = '#ffffff';
    document.body.appendChild(exportContainer);
    
    // Create React root and render the actual preview component
    const root = ReactDOM.createRoot(exportContainer);
    
    // Render the SAME preview component used in live preview
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement('div', { 
          style: { 
            width: dimensions.width, 
            height: dimensions.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff'
          }
        },
          React.createElement('div', { 
            style: { 
              transform: `scale(${dimensions.width / 800})`,
              transformOrigin: 'center center'
            }
          },
            React.createElement(MPGPreview, { isExportMode: true })
          )
        )
      );
      
      // Wait for component to render and tiles to load
      setTimeout(() => resolve(), 5000);
    });
    
    // Additional wait to ensure all tiles are loaded
    await new Promise<void>((resolve) => {
      const checkTiles = () => {
        const tiles = exportContainer.querySelectorAll('.leaflet-tile');
        const loadedTiles = Array.from(tiles).filter(tile => {
          if (tile instanceof HTMLImageElement) {
            return tile.complete && tile.naturalHeight !== 0;
          }
          return false;
        });
        
        if (loadedTiles.length > 4) { // At least some tiles loaded
          setTimeout(() => resolve(), 1000);
        } else {
          setTimeout(checkTiles, 500);
        }
      };
      
      checkTiles();
      
      // Maximum wait time
      setTimeout(() => resolve(), 10000);
    });
    
    // Use html2canvas to capture
    const canvas = await html2canvas(exportContainer, {
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
        
        // Clean up
        root.unmount();
        document.body.removeChild(exportContainer);
      },
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      quality
    );
    
  } catch (error) {
    console.error('Export failed:', error);
    // Clean up on error
    const container = document.getElementById('mpg-exact-export');
    if (container) {
      document.body.removeChild(container);
    }
    throw error;
  }
}