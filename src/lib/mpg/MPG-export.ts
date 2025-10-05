import html2canvas from 'html2canvas';
import { MPG_CANVAS_SIZES, MPG_EXPORT_FORMATS } from './MPG-constants';

interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf';
  size: string;
  quality: number;
  element: HTMLElement;
  fileName?: string;
}

export async function exportMapPoster(options: ExportOptions): Promise<void> {
  const { format, size, quality, element, fileName } = options;
  
  // Get canvas dimensions based on size
  const dimensions = MPG_CANVAS_SIZES[size as keyof typeof MPG_CANVAS_SIZES] || MPG_CANVAS_SIZES.A4;
  
  try {
    // Create a canvas from the element
    const canvas = await html2canvas(element, {
      width: dimensions.width,
      height: dimensions.height,
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure map tiles are loaded in the cloned document
        const clonedElement = clonedDoc.getElementById('mpg-export-container');
        if (clonedElement) {
          clonedElement.style.width = `${dimensions.width}px`;
          clonedElement.style.height = `${dimensions.height}px`;
        }
      }
    });

    // Convert canvas to blob based on format
    if (format === 'pdf') {
      // For PDF, we'd need a library like jsPDF
      // For now, we'll export as PNG
      await exportAsPNG(canvas, fileName || 'map-poster', quality);
    } else if (format === 'jpg') {
      await exportAsJPG(canvas, fileName || 'map-poster', quality);
    } else {
      await exportAsPNG(canvas, fileName || 'map-poster', quality);
    }
  } catch (error) {
    console.error('Error exporting map poster:', error);
    throw error;
  }
}

async function exportAsPNG(canvas: HTMLCanvasElement, fileName: string, quality: number): Promise<void> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          downloadBlob(blob, `${fileName}.png`);
          resolve();
        }
      },
      'image/png',
      quality
    );
  });
}

async function exportAsJPG(canvas: HTMLCanvasElement, fileName: string, quality: number): Promise<void> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          downloadBlob(blob, `${fileName}.jpg`);
          resolve();
        }
      },
      'image/jpeg',
      quality
    );
  });
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper function to prepare the element for export
export async function prepareForExport(element: HTMLElement): Promise<void> {
  // Remove any interactive elements or overlays
  const interactiveElements = element.querySelectorAll('.leaflet-control, .leaflet-popup');
  interactiveElements.forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Ensure all images and tiles are loaded
  const images = element.querySelectorAll('img');
  const promises: Promise<void>[] = [];
  
  images.forEach(img => {
    if (!img.complete) {
      promises.push(
        new Promise((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
      );
    }
  });

  await Promise.all(promises);
}

// Function to generate a high-quality render of the map
export async function generateHighQualityRender(
  mapContainer: HTMLElement,
  options: {
    width: number;
    height: number;
    zoom?: number;
  }
): Promise<HTMLCanvasElement> {
  // Create an offscreen container
  const offscreenContainer = document.createElement('div');
  offscreenContainer.style.position = 'absolute';
  offscreenContainer.style.left = '-9999px';
  offscreenContainer.style.width = `${options.width}px`;
  offscreenContainer.style.height = `${options.height}px`;
  document.body.appendChild(offscreenContainer);
  
  // Clone the map container
  const clonedMap = mapContainer.cloneNode(true) as HTMLElement;
  offscreenContainer.appendChild(clonedMap);
  
  // Wait for rendering
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate canvas
  const canvas = await html2canvas(offscreenContainer, {
    width: options.width,
    height: options.height,
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });
  
  // Cleanup
  document.body.removeChild(offscreenContainer);
  
  return canvas;
}