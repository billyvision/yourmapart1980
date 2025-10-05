/**
 * Converter for Google Maps styles (Snazzy Maps) to MapLibre GL style specification
 */

import { GoogleMapsStyle, SnazzyMapStyle } from './MPG-snazzy-styles';
import { getMaptilerApiKey } from './MPG-maplibre-service';

interface MapLibreLayer {
  id: string;
  type: string;
  source?: string;
  'source-layer'?: string;
  minzoom?: number;
  maxzoom?: number;
  paint?: any;
  layout?: any;
  filter?: any[];
}

/**
 * Apply lightness adjustment to a hex color
 */
function adjustColorLightness(color: string, lightness: number): string {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Apply lightness adjustment (simplified HSL adjustment)
  const factor = 1 + (lightness / 100);
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
  
  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

/**
 * Extract color from Google Maps stylers
 */
function extractColor(stylers: any[]): string | null {
  const colorStyler = stylers.find(s => s.color);
  if (!colorStyler) return null;
  
  let color = colorStyler.color;
  
  // Apply lightness if present
  const lightnessStyler = stylers.find(s => s.lightness !== undefined);
  if (lightnessStyler && color) {
    color = adjustColorLightness(color, lightnessStyler.lightness);
  }
  
  return color;
}

/**
 * Extract weight from Google Maps stylers
 */
function extractWeight(stylers: any[]): number | null {
  const weightStyler = stylers.find(s => s.weight !== undefined);
  return weightStyler ? weightStyler.weight : null;
}

/**
 * Convert Google Maps style to MapLibre GL style
 */
export function convertSnazzyToMapLibre(snazzyStyle: SnazzyMapStyle): any {
  const API_KEY = getMaptilerApiKey();
  const layers: MapLibreLayer[] = [];
  
  // Default colors
  let backgroundColor = '#f8f8f8';
  let waterColor = '#beecff';
  let parkColor = '#e6f3e6';
  let buildingColor = '#f2f2f2';
  let roadFillColor = '#ffffff';
  let roadStrokeColor = '#e0e0e0';
  let highwayColor = '#ffffff';      // Specific highway color
  let arterialColor = '#f0f0f0';     // Specific arterial road color
  let localRoadColor = '#ffffff';    // Specific local road color
  let highwayStrokeColor = '#d0d0d0';
  let poiColor = '#f0f0f0';
  let poiParkColor = '#e6f3e6';      // Specific POI park color
  let transitColor = '#e8e8e8';
  let adminStrokeColor = '#cccccc';
  let labelTextFill = '#333333';
  let labelTextStroke = '#ffffff';
  
  // Process each Google Maps style rule
  snazzyStyle.style.forEach(rule => {
    const color = extractColor(rule.stylers);
    const weight = extractWeight(rule.stylers);
    
    switch (rule.featureType) {
      case 'landscape':
        // Landscape with 'all' or no element type should set the background
        if (rule.elementType === 'all' || rule.elementType === 'geometry.fill' || rule.elementType === 'geometry' || !rule.elementType) {
          if (color) backgroundColor = color;
        }
        break;
        
      case 'all':
        if (rule.elementType === 'all' || rule.elementType === 'geometry' || !rule.elementType) {
          if (color) backgroundColor = color;
        }
        if (rule.elementType === 'labels.text.fill' && color) {
          labelTextFill = color;
        }
        if (rule.elementType === 'labels.text.stroke' && color) {
          labelTextStroke = color;
        }
        break;
        
      case 'water':
        if (rule.elementType === 'all' || rule.elementType === 'geometry' || !rule.elementType) {
          if (color) waterColor = color;
        }
        break;
        
      case 'poi':
        if ((rule.elementType === 'geometry.fill' || rule.elementType === 'geometry' || !rule.elementType) && color) {
          poiColor = color;
        }
        break;
        
      case 'poi.park':
        if ((rule.elementType === 'geometry' || !rule.elementType) && color) {
          poiParkColor = color;
        }
        break;
        
      case 'road':
        // Generic road rules (fallback for unspecified road types)
        if (rule.elementType === 'geometry' || rule.elementType === 'geometry.fill' || !rule.elementType) {
          if (color) roadFillColor = color;
        }
        if (rule.elementType === 'geometry.stroke' && color) {
          roadStrokeColor = color;
        }
        break;
        
      case 'road.highway':
        // Highway specific color
        if (rule.elementType === 'geometry' || rule.elementType === 'geometry.fill' || !rule.elementType) {
          if (color) highwayColor = color;
        }
        if (rule.elementType === 'geometry.stroke' && color) {
          highwayStrokeColor = color;
        }
        break;
        
      case 'road.arterial':
        // Arterial road specific color
        if (rule.elementType === 'geometry' || rule.elementType === 'geometry.fill' || !rule.elementType) {
          if (color) arterialColor = color;
        }
        if (rule.elementType === 'geometry.stroke' && color) {
          roadStrokeColor = color;
        }
        break;
        
      case 'road.local':
        // Local road specific color
        if (rule.elementType === 'geometry' || rule.elementType === 'geometry.fill' || !rule.elementType) {
          if (color) localRoadColor = color;
        }
        if (rule.elementType === 'geometry.stroke' && color) {
          roadStrokeColor = color;
        }
        break;
        
      case 'transit':
        if (color) transitColor = color;
        break;
        
      case 'administrative':
        if (rule.elementType === 'geometry.stroke' && color) {
          adminStrokeColor = color;
        }
        break;
        
      case 'park':
        if (color) parkColor = color;
        break;
    }
  });
  
  // Build MapLibre layers
  layers.push({
    id: 'background',
    type: 'background',
    paint: {
      'background-color': backgroundColor
    }
  });
  
  layers.push({
    id: 'water',
    type: 'fill',
    source: 'maptiler',
    'source-layer': 'water',
    paint: {
      'fill-color': waterColor,
      'fill-opacity': 1
    }
  });
  
  layers.push({
    id: 'parks',
    type: 'fill',
    source: 'maptiler',
    'source-layer': 'park',
    paint: {
      'fill-color': parkColor,
      'fill-opacity': 0.8
    }
  });
  
  layers.push({
    id: 'buildings',
    type: 'fill',
    source: 'maptiler',
    'source-layer': 'building',
    paint: {
      'fill-color': buildingColor,
      'fill-opacity': 0.5
    }
  });
  
  // POI areas
  layers.push({
    id: 'poi',
    type: 'fill',
    source: 'maptiler',
    'source-layer': 'poi',
    paint: {
      'fill-color': poiColor,
      'fill-opacity': 0.8
    }
  });
  
  // POI Parks specifically (overlay on regular parks for extra definition)
  layers.push({
    id: 'poi-parks',
    type: 'fill',
    source: 'maptiler',
    'source-layer': 'poi',
    filter: ['==', 'class', 'park'],
    paint: {
      'fill-color': poiParkColor,
      'fill-opacity': 0.9
    }
  });
  
  // Administrative boundaries
  layers.push({
    id: 'admin-boundaries',
    type: 'line',
    source: 'maptiler',
    'source-layer': 'boundary',
    paint: {
      'line-color': adminStrokeColor,
      'line-width': 1.5,
      'line-opacity': 0.5
    }
  });
  
  // Highways - stroke (outline)
  layers.push({
    id: 'highways-stroke',
    type: 'line',
    source: 'maptiler',
    'source-layer': 'transportation',
    filter: ['in', 'class', 'motorway', 'trunk', 'primary'],
    paint: {
      'line-color': highwayStrokeColor,
      'line-width': {
        base: 1.4,
        stops: [[6, 3], [20, 40]]
      }
    }
  });
  
  // Highways - fill (use specific highway color)
  layers.push({
    id: 'highways-fill',
    type: 'line',
    source: 'maptiler',
    'source-layer': 'transportation',
    filter: ['in', 'class', 'motorway', 'trunk', 'primary'],
    paint: {
      'line-color': highwayColor,
      'line-width': {
        base: 1.4,
        stops: [[6, 2], [20, 30]]
      }
    }
  });
  
  // Major roads - stroke
  layers.push({
    id: 'roads-major-stroke',
    type: 'line',
    source: 'maptiler',
    'source-layer': 'transportation',
    filter: ['in', 'class', 'secondary', 'tertiary'],
    paint: {
      'line-color': roadStrokeColor,
      'line-width': {
        base: 1.4,
        stops: [[6, 2], [20, 30]]
      }
    }
  });
  
  // Arterial roads (secondary/tertiary) - use specific arterial color
  layers.push({
    id: 'roads-arterial',
    type: 'line',
    source: 'maptiler',
    'source-layer': 'transportation',
    filter: ['in', 'class', 'secondary', 'tertiary'],
    paint: {
      'line-color': arterialColor,
      'line-width': {
        base: 1.4,
        stops: [[6, 1], [20, 20]]
      }
    }
  });
  
  // Local/minor roads - use specific local road color
  layers.push({
    id: 'roads-local',
    type: 'line',
    source: 'maptiler',
    'source-layer': 'transportation',
    filter: ['!in', 'class', 'motorway', 'trunk', 'primary', 'secondary', 'tertiary'],
    paint: {
      'line-color': localRoadColor,
      'line-width': {
        base: 1.4,
        stops: [[6, 0.5], [20, 15]]
      }
    }
  });
  
  // Transit/Railway
  layers.push({
    id: 'transit',
    type: 'line',
    source: 'maptiler',
    'source-layer': 'transportation',
    filter: ['==', 'class', 'rail'],
    paint: {
      'line-color': transitColor,
      'line-width': 2,
      'line-dasharray': [2, 2]
    }
  });
  
  // Text/Label layers for street names, place names, etc.
  // Water labels
  layers.push({
    id: 'water-name-labels',
    type: 'symbol',
    source: 'maptiler',
    'source-layer': 'water_name',
    layout: {
      'text-field': '{name}',
      'text-font': ['Open Sans Semibold'],
      'text-size': 16,
      'text-letter-spacing': 0.3,
      'text-transform': 'uppercase'
    },
    paint: {
      'text-color': labelTextFill,
      'text-halo-color': labelTextStroke,
      'text-halo-width': 2.5,
      'text-opacity': 1
    }
  });

  // POI labels
  layers.push({
    id: 'poi-labels',
    type: 'symbol',
    source: 'maptiler',
    'source-layer': 'poi',
    filter: ['>', 'rank', 0],
    layout: {
      'text-field': '{name}',
      'text-font': ['Open Sans Semibold'],
      'text-size': 14,
      'text-anchor': 'center',
      'icon-image': '',
      'text-offset': [0, 0.6],
      'text-optional': true
    },
    paint: {
      'text-color': labelTextFill,
      'text-halo-color': labelTextStroke,
      'text-halo-width': 2,
      'text-opacity': 1
    }
  });

  // Place labels - neighborhoods and districts
  layers.push({
    id: 'place-suburb-labels',
    type: 'symbol',
    source: 'maptiler',
    'source-layer': 'place',
    filter: ['in', 'class', 'suburb', 'neighbourhood', 'quarter'],
    layout: {
      'text-field': '{name}',
      'text-font': ['Open Sans Bold'],
      'text-size': 18,
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.2
    },
    paint: {
      'text-color': labelTextFill,
      'text-halo-color': labelTextStroke,
      'text-halo-width': 2.5,
      'text-opacity': 1
    }
  });

  // Street labels - minor streets
  layers.push({
    id: 'street-labels-minor',
    type: 'symbol',
    source: 'maptiler',
    'source-layer': 'transportation_name',
    filter: ['!in', 'class', 'motorway', 'trunk', 'primary', 'secondary', 'tertiary'],
    minzoom: 13,
    layout: {
      'text-field': '{name}',
      'text-font': ['Open Sans Semibold'],
      'text-size': 13,
      'symbol-placement': 'line',
      'text-rotation-alignment': 'map',
      'text-pitch-alignment': 'viewport',
      'text-keep-upright': true
    },
    paint: {
      'text-color': labelTextFill,
      'text-halo-color': labelTextStroke,
      'text-halo-width': 2,
      'text-halo-blur': 0.5
    }
  });

  // Street labels - major streets
  layers.push({
    id: 'street-labels-major',
    type: 'symbol',
    source: 'maptiler',
    'source-layer': 'transportation_name',
    filter: ['in', 'class', 'secondary', 'tertiary'],
    minzoom: 11,
    layout: {
      'text-field': '{name}',
      'text-font': ['Open Sans Semibold'],
      'text-size': 15,
      'symbol-placement': 'line',
      'text-rotation-alignment': 'map',
      'text-pitch-alignment': 'viewport',
      'text-keep-upright': true
    },
    paint: {
      'text-color': labelTextFill,
      'text-halo-color': labelTextStroke,
      'text-halo-width': 2.5,
      'text-halo-blur': 0.5
    }
  });

  // Street labels - highways
  layers.push({
    id: 'street-labels-highway',
    type: 'symbol',
    source: 'maptiler',
    'source-layer': 'transportation_name',
    filter: ['in', 'class', 'motorway', 'trunk', 'primary'],
    minzoom: 9,
    layout: {
      'text-field': '{name}',
      'text-font': ['Open Sans Bold'],
      'text-size': 17,
      'symbol-placement': 'line',
      'text-rotation-alignment': 'map',
      'text-pitch-alignment': 'viewport',
      'text-keep-upright': true
    },
    paint: {
      'text-color': labelTextFill,
      'text-halo-color': labelTextStroke,
      'text-halo-width': 3,
      'text-halo-blur': 0.5
    }
  });

  // Place labels - cities and towns
  layers.push({
    id: 'place-city-labels',
    type: 'symbol',
    source: 'maptiler',
    'source-layer': 'place',
    filter: ['in', 'class', 'city', 'town', 'village'],
    layout: {
      'text-field': '{name}',
      'text-font': ['Open Sans Bold'],
      'text-size': {
        'stops': [[8, 20], [12, 28], [16, 36]]
      },
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.3,
      'text-anchor': 'center'
    },
    paint: {
      'text-color': labelTextFill,
      'text-halo-color': labelTextStroke,
      'text-halo-width': 3,
      'text-halo-blur': 1,
      'text-opacity': 1
    }
  });

  // Return complete MapLibre style with background and text colors
  return {
    version: 8,
    name: snazzyStyle.name,
    background: snazzyStyle.background,  // Pass through the optimal background
    textColor: snazzyStyle.textColor,    // Pass through the optimal text color
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
 * Convert multiple Snazzy styles to MapLibre format
 */
export function convertAllSnazzyStyles(styles: Record<string, SnazzyMapStyle>): Record<string, any> {
  const converted: Record<string, any> = {};
  
  for (const [id, style] of Object.entries(styles)) {
    converted[id] = convertSnazzyToMapLibre(style);
  }
  
  return converted;
}

/**
 * Apply feature toggles to converted style
 */
export function applyFeatureTogglesToSnazzyStyle(
  maplibreStyle: any,
  features: {
    showLabels?: boolean;
    showBuildings?: boolean;
    showParks?: boolean;
    showWater?: boolean;
    showRoads?: boolean;
  }
): any {
  // Clone the style
  const modifiedStyle = JSON.parse(JSON.stringify(maplibreStyle));
  
  // Filter layers based on feature toggles
  modifiedStyle.layers = modifiedStyle.layers.filter((layer: any) => {
    // Remove building layers if showBuildings is false
    if (!features.showBuildings && layer.id === 'buildings') {
      return false;
    }
    
    // Remove park layers if showParks is false
    if (!features.showParks && layer.id === 'parks') {
      return false;
    }
    
    // Remove water layers if showWater is false
    if (!features.showWater && layer.id === 'water') {
      return false;
    }
    
    // Remove road layers if showRoads is false
    if (!features.showRoads && (
      layer.id.includes('road') ||
      layer.id.includes('highway') ||
      layer.id === 'transit'
    )) {
      return false;
    }
    
    // Remove label/text layers if showLabels is false
    if (!features.showLabels && (
      layer.id.includes('label') ||
      layer.type === 'symbol'
    )) {
      return false;
    }
    
    return true;
  });
  
  return modifiedStyle;
}