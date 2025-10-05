/**
 * Adapter for integrating Snazzy Maps styles with MapLibre GL
 * Provides a unified interface for style management
 */

import { SNAZZY_MAP_STYLES, getSnazzyStyle } from './MPG-snazzy-styles';
import { convertSnazzyToMapLibre, applyFeatureTogglesToSnazzyStyle } from './MPG-style-converter';
import { getMaptilerApiKey } from './MPG-maplibre-service';

// Cache for converted styles to improve performance
const convertedStyleCache: Map<string, any> = new Map();

/**
 * Get a Snazzy-based MapLibre style with optional feature toggles
 */
export function getSnazzyMapLibreStyle(
  styleId: string,
  features?: {
    showLabels?: boolean;
    showBuildings?: boolean;
    showParks?: boolean;
    showWater?: boolean;
    showRoads?: boolean;
  }
): any {
  // Get the Snazzy style
  const snazzyStyle = getSnazzyStyle(styleId);
  if (!snazzyStyle) {
    console.warn(`Snazzy style '${styleId}' not found, using default`);
    return getDefaultMapLibreStyle(features);
  }
  
  // Merge provided features with style's default features
  // Provided features take precedence over defaults
  const mergedFeatures = {
    ...snazzyStyle.defaultFeatures,  // Start with style's defaults
    ...features  // Override with any explicitly provided features
  };
  
  // Check cache with merged features
  const cacheKey = `${styleId}-${JSON.stringify(mergedFeatures)}`;
  if (convertedStyleCache.has(cacheKey)) {
    return convertedStyleCache.get(cacheKey);
  }
  
  // Convert to MapLibre format
  let maplibreStyle = convertSnazzyToMapLibre(snazzyStyle);
  
  // Apply merged feature toggles
  if (mergedFeatures && Object.keys(mergedFeatures).length > 0) {
    maplibreStyle = applyFeatureTogglesToSnazzyStyle(maplibreStyle, mergedFeatures);
  }
  
  // Cache the result
  convertedStyleCache.set(cacheKey, maplibreStyle);
  
  return maplibreStyle;
}

/**
 * Get a list of available Snazzy styles with preview information
 */
export function getSnazzyStylesList(): Array<{
  id: string;
  name: string;
  description?: string;
  preview?: {
    bg: string;
    water: string;
    roads: string;
  };
}> {
  const styles = [];
  
  for (const [id, style] of Object.entries(SNAZZY_MAP_STYLES)) {
    // Use the defined background or extract preview colors from the style
    const extractedColors = extractPreviewColors(style.style);
    const preview = {
      bg: style.background || extractedColors.bg,
      water: extractedColors.water,
      roads: extractedColors.roads
    };
    
    styles.push({
      id,
      name: style.name,
      description: style.description,
      preview
    });
  }
  
  return styles;
}

/**
 * Extract preview colors from Google Maps style
 */
function extractPreviewColors(googleStyle: any[]): {
  bg: string;
  water: string;
  roads: string;
} {
  let bg = '#f8f8f8';
  let water = '#beecff';
  let roads = '#ffffff';
  
  googleStyle.forEach(rule => {
    const colorStyler = rule.stylers?.find((s: any) => s.color);
    if (colorStyler) {
      const color = colorStyler.color;
      
      if (rule.featureType === 'landscape' || 
          (rule.featureType === 'all' && rule.elementType === 'geometry')) {
        bg = color;
      } else if (rule.featureType === 'water') {
        water = color;
      } else if (rule.featureType?.includes('road') && 
                 (rule.elementType === 'geometry' || rule.elementType === 'geometry.fill')) {
        roads = color;
      }
    }
  });
  
  return { bg, water, roads };
}

/**
 * Get default MapLibre style (fallback)
 */
function getDefaultMapLibreStyle(features?: {
  showLabels?: boolean;
  showBuildings?: boolean;
  showParks?: boolean;
  showWater?: boolean;
  showRoads?: boolean;
}): any {
  const API_KEY = getMaptilerApiKey();
  const layers = [];
  
  // Background
  layers.push({
    id: 'background',
    type: 'background',
    paint: {
      'background-color': '#f8f8f8'
    }
  });
  
  // Water
  if (features?.showWater !== false) {
    layers.push({
      id: 'water',
      type: 'fill',
      source: 'maptiler',
      'source-layer': 'water',
      paint: {
        'fill-color': '#beecff'
      }
    });
  }
  
  // Parks
  if (features?.showParks !== false) {
    layers.push({
      id: 'parks',
      type: 'fill',
      source: 'maptiler',
      'source-layer': 'park',
      paint: {
        'fill-color': '#e6f3e6',
        'fill-opacity': 0.5
      }
    });
  }
  
  // Buildings
  if (features?.showBuildings !== false) {
    layers.push({
      id: 'buildings',
      type: 'fill',
      source: 'maptiler',
      'source-layer': 'building',
      paint: {
        'fill-color': '#f2f2f2',
        'fill-opacity': 0.3
      }
    });
  }
  
  // Roads
  if (features?.showRoads !== false) {
    layers.push({
      id: 'roads',
      type: 'line',
      source: 'maptiler',
      'source-layer': 'transportation',
      paint: {
        'line-color': '#ffffff',
        'line-width': {
          base: 1.4,
          stops: [[6, 0.5], [20, 20]]
        }
      }
    });
  }
  
  return {
    version: 8,
    name: 'Default',
    sources: {
      maptiler: {
        type: 'vector',
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${API_KEY}`
      }
    },
    glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${API_KEY}`,
    layers
  };
}

/**
 * Get the default feature toggles for a specific style
 */
export function getStyleDefaultFeatures(styleId: string): {
  showMapLabels?: boolean;
  showBuildings?: boolean;
  showParks?: boolean;
  showWater?: boolean;
  showRoads?: boolean;
} | undefined {
  const snazzyStyle = getSnazzyStyle(styleId);
  return snazzyStyle?.defaultFeatures;
}

/**
 * Clear the style cache (useful when styles are updated)
 */
export function clearStyleCache(): void {
  convertedStyleCache.clear();
}

/**
 * Check if a style exists
 */
export function hasSnazzyStyle(styleId: string): boolean {
  return styleId in SNAZZY_MAP_STYLES;
}

/**
 * Get all available style IDs
 */
export function getSnazzyStyleIds(): string[] {
  return Object.keys(SNAZZY_MAP_STYLES);
}