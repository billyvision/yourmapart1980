import html2canvas from 'html2canvas';
import { MPG_CANVAS_SIZES } from './MPG-constants';

interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf';
  size: string;
  quality: number;
  fileName?: string;
  previewElement: HTMLElement;
}

export async function exportMapPosterClone(options: ExportOptions): Promise<void> {
  const { format, size, quality, fileName, previewElement } = options;
  const dimensions = MPG_CANVAS_SIZES[size as keyof typeof MPG_CANVAS_SIZES] || MPG_CANVAS_SIZES.A4;
  
  try {
    // Clone the preview element
    const clonedPreview = previewElement.cloneNode(true) as HTMLElement;
    
    // Create export container
    const exportContainer = document.createElement('div');
    exportContainer.style.position = 'fixed';
    exportContainer.style.left = '-99999px';
    exportContainer.style.top = '0';
    exportContainer.style.width = `${dimensions.width}px`;
    exportContainer.style.height = `${dimensions.height}px`;
    exportContainer.style.backgroundColor = '#ffffff';
    exportContainer.style.display = 'flex';
    exportContainer.style.alignItems = 'center';
    exportContainer.style.justifyContent = 'center';
    exportContainer.style.padding = '100px';
    exportContainer.style.boxSizing = 'border-box';
    document.body.appendChild(exportContainer);
    
    // Scale the preview to fit export dimensions
    const scale = Math.min(
      (dimensions.width - 200) / 600,
      (dimensions.height - 400) / 800
    );
    
    clonedPreview.style.transform = `scale(${scale})`;
    clonedPreview.style.transformOrigin = 'center center';
    
    // Ensure all styles are preserved
    const originalMap = previewElement.querySelector('.leaflet-container') as HTMLElement;
    const clonedMap = clonedPreview.querySelector('.leaflet-container') as HTMLElement;
    
    if (originalMap && clonedMap) {
      // Copy computed styles including filter
      const computedStyle = window.getComputedStyle(originalMap);
      clonedMap.style.filter = computedStyle.filter;
      clonedMap.style.backgroundColor = computedStyle.backgroundColor;
      
      // Copy all inline styles
      clonedMap.setAttribute('style', originalMap.getAttribute('style') || '');
      if (computedStyle.filter && computedStyle.filter !== 'none') {
        clonedMap.style.filter = computedStyle.filter;
      }
    }
    
    // Fix text sizes for export
    const texts = clonedPreview.querySelectorAll('h2, p');
    texts.forEach(text => {
      const el = text as HTMLElement;
      const currentSize = parseInt(window.getComputedStyle(el).fontSize);
      el.style.fontSize = `${currentSize * scale * 2}px`;
      
      // Preserve letter spacing
      const letterSpacing = window.getComputedStyle(el).letterSpacing;
      if (letterSpacing && letterSpacing !== 'normal') {
        el.style.letterSpacing = `${parseInt(letterSpacing) * scale * 2}px`;
      }
    });
    
    exportContainer.appendChild(clonedPreview);
    
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Force re-render of tiles
    const tiles = clonedPreview.querySelectorAll('.leaflet-tile');
    await Promise.all(
      Array.from(tiles).map(tile => {
        if (tile instanceof HTMLImageElement && !tile.complete) {
          return new Promise(resolve => {
            tile.onload = resolve;
            tile.onerror = resolve;
          });
        }
        return Promise.resolve();
      })
    );
    
    // Additional wait
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use html2canvas
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
        document.body.removeChild(exportContainer);
      },
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      quality
    );
    
  } catch (error) {
    console.error('Export failed:', error);
    // Clean up on error
    const containers = document.querySelectorAll('[style*="left: -99999px"]');
    containers.forEach(c => c.remove());
    throw error;
  }
}