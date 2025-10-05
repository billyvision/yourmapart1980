// Filter utilities for converting CSS filters to Konva filters
import Konva from 'konva';
import { MPG_KONVA_FILTERS } from './MPG-konva-constants';

/**
 * Apply filters to a Konva node based on the style preset
 */
export function applyStyleFilters(node: any, style: string): void {
  // Avocado style uses custom canvas processing, no Konva filters needed
  if (style === 'avocado') {
    node.filters([]);
    return;
  }
  
  const filterConfig = MPG_KONVA_FILTERS[style as keyof typeof MPG_KONVA_FILTERS];
  
  if (!filterConfig) {
    // No filters for this style or unknown style
    node.filters([]);
    return;
  }
  
  // Apply the filters
  node.filters(filterConfig.filters);
  
  // Apply filter-specific configurations
  const config = filterConfig.config as any;

  if (config.contrast !== undefined) {
    node.contrast(config.contrast);
  }

  if (config.brightness !== undefined) {
    node.brightness(config.brightness);
  }

  if (config.hue !== undefined) {
    node.hue(config.hue);
  }

  if (config.saturation !== undefined) {
    node.saturation(config.saturation);
  }

  if (config.luminance !== undefined) {
    node.luminance(config.luminance);
  }
  
  // Cache the node for better performance
  node.cache();
}

/**
 * Create a custom filter function for complex effects
 */
export function createCustomFilter(filterName: string) {
  switch (filterName) {
    case 'vintage':
      return function(imageData: ImageData) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Apply vintage effect
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189)); // Red
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // Green
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // Blue
        }
      };
      
    case 'polaroid':
      return function(imageData: ImageData) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          // Increase contrast and add slight yellow tint
          data[i] = Math.min(255, data[i] * 1.2 + 10); // Red
          data[i + 1] = Math.min(255, data[i + 1] * 1.2 + 10); // Green
          data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
        }
      };
      
    default:
      return null;
  }
}

/**
 * Apply a grayscale filter with custom intensity
 */
export function applyGrayscale(node: any, intensity: number = 1): void {
  node.filters([Konva.Filters.Grayscale]);
  node.cache();
}

/**
 * Apply sepia tone filter
 */
export function applySepia(node: any, intensity: number = 1): void {
  node.filters([Konva.Filters.Sepia]);
  node.cache();
}

/**
 * Apply blur filter
 */
export function applyBlur(node: any, blurRadius: number = 5): void {
  node.filters([Konva.Filters.Blur]);
  node.blurRadius(blurRadius);
  node.cache();
}

/**
 * Apply multiple filters in sequence
 */
export function applyFilterChain(node: any, filters: Array<{type: string, config?: any}>): void {
  const konvaFilters: any[] = [];
  
  filters.forEach(filter => {
    switch (filter.type) {
      case 'grayscale':
        konvaFilters.push(Konva.Filters.Grayscale);
        break;
      case 'sepia':
        konvaFilters.push(Konva.Filters.Sepia);
        break;
      case 'blur':
        konvaFilters.push(Konva.Filters.Blur);
        if (filter.config?.blurRadius) {
          node.blurRadius(filter.config.blurRadius);
        }
        break;
      case 'brighten':
        konvaFilters.push(Konva.Filters.Brighten);
        if (filter.config?.brightness) {
          node.brightness(filter.config.brightness);
        }
        break;
      case 'contrast':
        konvaFilters.push(Konva.Filters.Contrast);
        if (filter.config?.contrast) {
          node.contrast(filter.config.contrast);
        }
        break;
      case 'hsl':
        konvaFilters.push(Konva.Filters.HSL);
        if (filter.config?.hue) node.hue(filter.config.hue);
        if (filter.config?.saturation) node.saturation(filter.config.saturation);
        if (filter.config?.luminance) node.luminance(filter.config.luminance);
        break;
      case 'invert':
        konvaFilters.push(Konva.Filters.Invert);
        break;
      case 'pixelate':
        konvaFilters.push(Konva.Filters.Pixelate);
        if (filter.config?.pixelSize) {
          node.pixelSize(filter.config.pixelSize);
        }
        break;
    }
  });
  
  node.filters(konvaFilters);
  node.cache();
}

/**
 * Remove all filters from a node
 */
export function clearFilters(node: any): void {
  node.filters([]);
  node.clearCache();
}

/**
 * Get filter configuration for a style
 */
export function getFilterConfig(style: string): any {
  return MPG_KONVA_FILTERS[style as keyof typeof MPG_KONVA_FILTERS] || null;
}

/**
 * Create a preview of filter effect
 */
export function createFilterPreview(
  imageUrl: string, 
  style: string, 
  width: number = 100, 
  height: number = 100
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stage = new Konva.Stage({
      container: document.createElement('div'),
      width,
      height
    });
    
    const layer = new Konva.Layer();
    stage.add(layer);
    
    const imageObj = new Image();
    imageObj.onload = () => {
      const image = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width,
        height
      });
      
      layer.add(image);
      applyStyleFilters(image, style);
      layer.draw();
      
      // Convert to data URL
      const dataURL = stage.toDataURL({
        mimeType: 'image/png',
        width,
        height,
        pixelRatio: 1
      });
      
      resolve(dataURL);
      
      // Clean up
      stage.destroy();
    };
    
    imageObj.onerror = reject;
    imageObj.src = imageUrl;
  });
}

/**
 * Batch apply filters to multiple nodes
 */
export function batchApplyFilters(nodes: any[], style: string): void {
  nodes.forEach(node => {
    applyStyleFilters(node, style);
  });
}