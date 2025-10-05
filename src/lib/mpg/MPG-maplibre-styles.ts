// MapLibre style definitions for Map Poster Generator
import { getMaptilerApiKey } from './MPG-maplibre-service';
import { getSnazzyMapLibreStyle, getSnazzyStylesList, hasSnazzyStyle } from './MPG-maplibre-snazzy-adapter';

const API_KEY = getMaptilerApiKey();

// Base Maptiler tile source
const MAPTILER_SOURCE = {
  type: 'vector' as const,
  url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${API_KEY}`
};

// Style definitions - removed all old styles, now using only Snazzy Maps styles
export const MAPLIBRE_STYLES = {};

// Style with labels (for reference/future use)
export const MAPLIBRE_STYLES_WITH_LABELS = {
  'standard': `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
  'satellite': `https://api.maptiler.com/maps/hybrid/style.json?key=${API_KEY}`,
  'outdoor': `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${API_KEY}`,
  'basic': `https://api.maptiler.com/maps/basic-v2/style.json?key=${API_KEY}`
};

/**
 * Apply feature toggles to a style
 */
export function applyFeatureToggles(style: any, features: {
  showLabels?: boolean;
  showBuildings?: boolean;
  showParks?: boolean;
  showWater?: boolean;
  showRoads?: boolean;
}): any {
  // Clone the style to avoid mutations
  const modifiedStyle = JSON.parse(JSON.stringify(style));
  
  // Filter layers based on feature toggles
  modifiedStyle.layers = modifiedStyle.layers.filter((layer: any) => {
    // Remove label layers if showLabels is false
    if (!features.showLabels && layer.id.includes('label')) {
      return false;
    }
    
    // Remove building layers if showBuildings is false
    if (!features.showBuildings && (layer.id.includes('building') || layer['source-layer'] === 'building')) {
      return false;
    }
    
    // Remove park layers if showParks is false
    if (!features.showParks && (layer.id.includes('park') || layer['source-layer'] === 'park')) {
      return false;
    }
    
    // Remove water layers if showWater is false
    if (!features.showWater && (layer.id.includes('water') || layer['source-layer'] === 'water')) {
      return false;
    }
    
    // Remove road layers if showRoads is false
    if (!features.showRoads && (
      layer.id.includes('road') || 
      layer.id.includes('transportation') || 
      layer['source-layer'] === 'transportation'
    )) {
      return false;
    }
    
    return true;
  });
  
  return modifiedStyle;
}

/**
 * Get a map style by ID
 */
export function getMapStyle(styleId: string, features?: {
  showLabels?: boolean;
  showBuildings?: boolean;
  showParks?: boolean;
  showWater?: boolean;
  showRoads?: boolean;
}): any {
  // Always use Snazzy Map styles, default to midnight if not found
  return getSnazzyMapLibreStyle(styleId || 'midnight', features);
}

/**
 * Get list of available styles
 */
export function getStyleList(): Array<{id: string, name: string, description?: string, preview?: {bg: string, border?: string, water?: string}}> {
  // Only return Snazzy Map styles
  return getSnazzyStylesList();
}

/**
 * Create a custom style from parameters
 */
export function createCustomStyle(params: {
  backgroundColor?: string;
  waterColor?: string;
  roadColor?: string;
  parkColor?: string;
  buildingColor?: string;
  showLabels?: boolean;
  showBuildings?: boolean;
  showParks?: boolean;
}): any {
  const {
    backgroundColor = '#f8f8f8',
    waterColor = '#beecff',
    roadColor = '#ffffff',
    parkColor = '#e6f3e6',
    buildingColor = '#f2f2f2',
    showLabels = false,
    showBuildings = true,
    showParks = true
  } = params;
  
  const layers: any[] = [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': backgroundColor
      }
    },
    {
      id: 'water',
      type: 'fill',
      source: 'maptiler',
      'source-layer': 'water',
      paint: {
        'fill-color': waterColor
      }
    }
  ];
  
  if (showParks) {
    layers.push({
      id: 'parks',
      type: 'fill',
      source: 'maptiler',
      'source-layer': 'park',
      paint: {
        'fill-color': parkColor,
        'fill-opacity': 0.5
      }
    });
  }
  
  if (showBuildings) {
    layers.push({
      id: 'buildings',
      type: 'fill',
      source: 'maptiler',
      'source-layer': 'building',
      paint: {
        'fill-color': buildingColor,
        'fill-opacity': 0.3
      }
    });
  }
  
  layers.push({
    id: 'roads',
    type: 'line',
    source: 'maptiler',
    'source-layer': 'transportation',
    paint: {
      'line-color': roadColor,
      'line-width': {
        base: 1.4,
        stops: [[6, 0.5], [20, 20]]
      }
    }
  });
  
  if (showLabels) {
    // Add label layers here if needed
  }
  
  return {
    version: 8,
    sources: {
      maptiler: MAPTILER_SOURCE
    },
    glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${API_KEY}`,
    layers
  };
}

/**
 * Preload styles (for performance)
 */
export async function preloadStyles(): Promise<void> {
  // This could preload style definitions if needed
  console.log('Styles ready');
}