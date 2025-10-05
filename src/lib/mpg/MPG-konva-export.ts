// Export utilities for MPG Konva implementation
import { MPG_KONVA_EXPORT_SETTINGS } from './MPG-konva-constants';

interface ExportOptions {
  stage: any; // Konva Stage instance
  format: 'png' | 'jpg' | 'pdf';
  size: 'A4' | 'Letter' | 'Square' | 'Portrait' | 'Landscape';
  fileName?: string;
  quality?: number;
}

/**
 * Export the Konva stage as an image
 */
export async function exportMapPosterKonva(options: ExportOptions): Promise<void> {
  const {
    stage,
    format,
    fileName = 'map-poster',
    quality = format === 'pdf' ? 0.95 : (MPG_KONVA_EXPORT_SETTINGS.quality[format as keyof typeof MPG_KONVA_EXPORT_SETTINGS.quality] || 0.95)
  } = options;
  
  if (!stage) {
    throw new Error('Stage is not available for export');
  }
  
  try {
    // Set pixel ratio for high-quality export
    const pixelRatio = MPG_KONVA_EXPORT_SETTINGS.pixelRatio;
    
    // Get data URL from stage
    const mimeType = format === 'pdf' ? 'image/png' : (MPG_KONVA_EXPORT_SETTINGS.mimeType[format as keyof typeof MPG_KONVA_EXPORT_SETTINGS.mimeType]);
    const dataURL = stage.toDataURL({
      mimeType,
      quality: quality,
      pixelRatio: pixelRatio
    });
    
    // Convert data URL to blob
    const blob = await dataURLToBlob(dataURL);
    
    // Handle PDF export separately
    if (format === 'pdf') {
      await exportAsPDF(stage, fileName);
    } else {
      // Download as image
      downloadBlob(blob, `${fileName}.${format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * Convert data URL to Blob
 */
async function dataURLToBlob(dataURL: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      resolve(new Blob([u8arr], { type: mime }));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Download a blob as a file
 */
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

/**
 * Export as PDF using jsPDF
 */
async function exportAsPDF(stage: any, fileName: string): Promise<void> {
  // Dynamic import to avoid loading jsPDF unless needed
  const { jsPDF } = await import('jspdf');
  
  // Get stage as image
  const dataURL = stage.toDataURL({
    mimeType: 'image/png',
    quality: 1,
    pixelRatio: 2
  });
  
  // Create PDF with appropriate dimensions
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add image to PDF
  const imgWidth = 210; // A4 width in mm
  const imgHeight = 297; // A4 height in mm
  
  pdf.addImage(dataURL, 'PNG', 0, 0, imgWidth, imgHeight);
  
  // Save PDF
  pdf.save(`${fileName}.pdf`);
}

/**
 * Create a high-resolution export
 */
export async function exportHighResolution(
  stage: any,
  scaleFactor: number = 4
): Promise<string> {
  // Store original size
  const originalWidth = stage.width();
  const originalHeight = stage.height();
  
  // Scale up for high resolution
  stage.width(originalWidth * scaleFactor);
  stage.height(originalHeight * scaleFactor);
  stage.scale({ x: scaleFactor, y: scaleFactor });
  stage.batchDraw();
  
  // Get high-res data URL
  const dataURL = stage.toDataURL({
    mimeType: 'image/png',
    quality: 1,
    pixelRatio: 1 // Already scaled, so use 1
  });
  
  // Restore original size
  stage.width(originalWidth);
  stage.height(originalHeight);
  stage.scale({ x: 1, y: 1 });
  stage.batchDraw();
  
  return dataURL;
}

/**
 * Export with custom dimensions
 */
export async function exportWithDimensions(
  stage: any,
  width: number,
  height: number,
  format: 'png' | 'jpg' = 'png'
): Promise<Blob> {
  // Clone the stage to avoid modifying the original
  const clonedStage = stage.clone();
  
  // Set new dimensions
  clonedStage.width(width);
  clonedStage.height(height);
  
  // Calculate scale to fit content
  const scaleX = width / stage.width();
  const scaleY = height / stage.height();
  const scale = Math.min(scaleX, scaleY);
  
  clonedStage.scale({ x: scale, y: scale });
  
  // Get data URL
  const dataURL = clonedStage.toDataURL({
    mimeType: format === 'jpg' ? 'image/jpeg' : 'image/png',
    quality: format === 'jpg' ? 0.95 : 1,
    pixelRatio: 1
  });
  
  // Convert to blob
  return dataURLToBlob(dataURL);
}

/**
 * Export multiple formats at once
 */
export async function exportMultipleFormats(
  stage: any,
  formats: Array<'png' | 'jpg' | 'pdf'>,
  fileName: string = 'map-poster'
): Promise<void> {
  for (const format of formats) {
    await exportMapPosterKonva({
      stage,
      format,
      size: 'A4',
      fileName: `${fileName}-${format}`
    });
    
    // Small delay between exports
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Generate thumbnail from stage
 */
export async function generateThumbnail(
  stage: any,
  maxWidth: number = 200,
  maxHeight: number = 200
): Promise<string> {
  // Calculate scale to fit within max dimensions
  const scale = Math.min(
    maxWidth / stage.width(),
    maxHeight / stage.height()
  );
  
  // Get thumbnail data URL
  return stage.toDataURL({
    mimeType: 'image/jpeg',
    quality: 0.8,
    pixelRatio: scale
  });
}

/**
 * Export with watermark removed
 */
export async function exportWithoutWatermark(
  stage: any,
  format: 'png' | 'jpg' = 'png'
): Promise<void> {
  // Find and hide watermark layer/group
  const watermarks = stage.find('.watermark');
  watermarks.forEach((node: any) => {
    node.hide();
  });
  
  stage.batchDraw();
  
  // Export
  const dataURL = stage.toDataURL({
    mimeType: format === 'jpg' ? 'image/jpeg' : 'image/png',
    quality: format === 'jpg' ? 0.95 : 1,
    pixelRatio: 2
  });
  
  // Restore watermarks
  watermarks.forEach((node: any) => {
    node.show();
  });
  
  stage.batchDraw();
  
  // Download
  const blob = await dataURLToBlob(dataURL);
  downloadBlob(blob, `map-poster.${format}`);
}