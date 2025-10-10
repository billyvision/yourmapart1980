/**
 * Snazzy Maps style definitions for Map Poster Generator
 * These styles are in Google Maps JSON format and will be converted to MapLibre format
 * Source: https://snazzymaps.com/
 */

export interface GoogleMapsStyle {
  featureType?: string;
  elementType?: string;
  stylers: Array<{
    color?: string;
    lightness?: number;
    saturation?: number;
    weight?: number;
    visibility?: string;
    hue?: string;
    gamma?: number;
  }>;
}

export interface MapFeatures {
  showMapLabels?: boolean;  // Street names and labels
  showBuildings?: boolean;
  showParks?: boolean;
  showWater?: boolean;
  showRoads?: boolean;
}

export interface SnazzyMapStyle {
  name: string;
  description?: string;
  tags?: string[];
  style: GoogleMapsStyle[];
  background?: string;  // Optimal background color for this style
  textColor?: string;   // Optimal text color for this style
  defaultFeatures?: MapFeatures;  // Default feature toggles for this style
}

/**
 * Collection of Snazzy Maps styles
 * Add new styles here by pasting the JSON from Snazzy Maps
 */
export const SNAZZY_MAP_STYLES: Record<string, SnazzyMapStyle> = {
  
  avocado: {
    name: 'Avocado',
    description: 'A fresh, vibrant green theme inspired by nature and modern design',
    tags: ['green', 'fresh', 'nature', 'modern', 'vibrant'],
    background: '#f4f7ea',  // Soft, light green-tinted background for harmony
    textColor: '#3a4a2e',    // Deep forest green for excellent contrast
    defaultFeatures: {
      showMapLabels: true,    // ON - show all labels
      showBuildings: true,    // ON - show buildings
      showParks: true,        // ON - show parks (fits nature theme)
      showWater: true,        // ON - show water
      showRoads: true         // ON - show roads
    },
    style: [
      {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#7f2200'
          },
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'on'
          },
          {
            color: '#87ae79'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#495421'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            visibility: 'on'
          },
          {
            weight: 4.1
          }
        ]
      },
      {
        featureType: 'administrative.neighborhood',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#abce83'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#769E72'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#7B8758'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#EBF4A4'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'simplified'
          },
          {
            color: '#8dab68'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#5B5B3F'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ABCE83'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#EBF4A4'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#9BBF72'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#A4C67D'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'on'
          },
          {
            color: '#aee2e0'
          }
        ]
      }
    ]
  },


  maritime: {
    name: 'Maritime',
    description: 'Inverted nautical theme with navy blue land and white roads',
    tags: ['nautical', 'blue', 'clean', 'minimalist', 'inverted'],
    background: '#1a2b3d',  // Dark navy background to match land
    textColor: '#ffffff',   // White text for dark background
    defaultFeatures: {
      showMapLabels: false,   // OFF - ultra minimal
      showBuildings: false,   // OFF - roads only
      showParks: false,       // OFF - roads only
      showWater: false,       // OFF - roads only
      showRoads: true         // ON - only feature visible
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1e3a5f'
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#1e3a5f'
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#1e3a5f'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2a4a6f'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1e3a5f'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#f8f8f8'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#f0f0f0'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#87ceeb'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#87ceeb'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#5a9fc4'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#87ceeb'
          }
        ]
      }
    ]
  },


  storm: {
    name: 'Urban Shadow',
    description: 'Dark charcoal with light beige roads for dramatic urban contrast',
    tags: ['dark', 'gray', 'dramatic', 'modern', 'contrast', 'urban'],
    background: '#1a1a1a',  // Very dark background
    textColor: '#ffffff',   // White text for dark background
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean look
      showBuildings: false,  // OFF - minimal design
      showParks: false,      // OFF - focus on infrastructure
      showWater: true,       // ON - show water bodies
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#3a3a3a'
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#2d2d2d'
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#1a1a1a'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2d2d2d'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#242424'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#d4c4a0'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#3a3a3a'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#e8d7b3'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#d4c4a0'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#c0b090'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#3a3a3a'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#3a3a3a'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#808080'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#4a4a4a'
          }
        ]
      }
    ]
  },

  blueprint: {
    name: 'Blueprint',
    description: 'Clean architectural blueprint style with blue lines on white',
    tags: ['minimal', 'blue', 'clean', 'architectural', 'technical'],
    background: '#ffffff',  // Pure white background
    textColor: '#0047ab',   // Royal blue text
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean technical look
      showBuildings: true,   // ON - important for architectural style
      showParks: false,      // OFF - focus on built environment
      showWater: true,       // ON - show water bodies
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#0047ab'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 3
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#f0f4ff'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#4d7fff'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#4d7fff'
          },
          {
            weight: 0.5
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#0047ab'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#5b8fff'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#4d7fff'
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#4d7fff'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#6b9fff'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#4d7fff'
          },
          {
            weight: 0.3
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#e6f2ff'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#e6f2ff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#0047ab'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      }
    ]
  },

  blueprint2: {
    name: 'Blueprint 2',
    description: 'Architectural blueprint style focused on buildings and roads, no water',
    tags: ['minimal', 'blue', 'clean', 'architectural', 'technical', 'dry'],
    background: '#ffffff',  // Pure white background
    textColor: '#0047ab',   // Royal blue text
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean technical look
      showBuildings: true,   // ON - important for architectural style
      showParks: false,      // OFF - focus on built environment
      showWater: false,      // OFF - no water in this version
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#0047ab'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#0047ab'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#0066cc'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#0052a3'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#4d79a4'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#cce7ff'
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#0047ab'
          }
        ]
      }
    ]
  },

  goldenrod: {
    name: 'Goldenrod',
    description: 'Bold golden yellow land with deep teal water for striking contrast',
    tags: ['yellow', 'gold', 'teal', 'bold', 'contrast'],
    background: '#f4e4a1',  // Soft golden background
    textColor: '#2a5f5e',   // Deep teal text
    defaultFeatures: {
      showMapLabels: false,   // OFF - no street names
      showBuildings: true,    // ON - show buildings
      showParks: true,        // ON - show parks
      showWater: true,        // ON - show water bodies
      showRoads: true         // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#1a3d3c'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#f5d547'
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#f5d547'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#f5d547'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#e8c83a'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#4a7c7e'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#2a5f5e'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#f5d547'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#4a7c7e'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#3d6b6d'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#5a8a8c'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#4a7c7e'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#4a7c7e'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8fb3b5'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#4a7c7e'
          }
        ]
      }
    ]
  },

  noir: {
    name: 'Noir',
    description: 'Stark black and white with maximum contrast',
    tags: ['black', 'white', 'minimal', 'contrast', 'monochrome'],
    background: '#000000',  // Pure black background
    textColor: '#ffffff',   // Pure white text
    defaultFeatures: {
      showMapLabels: false,   // OFF - ultra minimal
      showBuildings: false,   // OFF - roads only for noir style
      showParks: false,       // OFF - minimal design
      showWater: false,       // OFF - roads only
      showRoads: true         // ON - show road network only
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000'
          },
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#000000'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ]
  },

  coral: {
    name: 'Coral',
    description: 'Soft cream with coral red roads and water for a warm aesthetic',
    tags: ['red', 'coral', 'cream', 'warm', 'monochrome'],
    background: '#f5e6d3',  // Cream poster background
    textColor: '#c74545',   // Coral red text to match roads
    defaultFeatures: {
      showMapLabels: false,   // OFF - clean minimal look
      showBuildings: true,    // ON - show buildings
      showParks: false,       // OFF - minimal design
      showWater: false,       // OFF - buildings and roads only
      showRoads: true         // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8b2f2f'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#faf5f0'
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#faf5f0'
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#faf5f0'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#faf5f0'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#f5ebe0'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#e85d5d'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#c74545'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#faf5f0'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#e85d5d'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#e05555'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ea6b6b'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#e85d5d'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#e85d5d'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#e85d5d'
          }
        ]
      }
    ]
  },

  neon: {
    name: 'Neon',
    description: 'Electric yellow and hot magenta for a bold, vibrant aesthetic',
    tags: ['yellow', 'magenta', 'bright', 'bold', 'vibrant'],
    background: '#f7e98e',  // Soft yellow background
    textColor: '#d6006f',   // Deep magenta text
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean look
      showBuildings: true,   // ON - show buildings
      showParks: false,      // OFF - minimal design
      showWater: true,       // ON - show water bodies
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffeb3b'
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffeb3b'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffeb3b'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#f9e033'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff0090'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#d6006f'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffeb3b'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff0090'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#f50087'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff1493'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#ff0090'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff0090'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ff0090'
          }
        ]
      }
    ]
  },


  neonPink: {
    name: 'Neon Pink',
    description: 'Electric hot pink colors with all map features - vibrant and complete',
    tags: ['pink', 'magenta', 'bright', 'bold', 'vibrant', 'complete', 'detailed'],
    background: '#fde6f3',  // Soft pink background
    textColor: '#d6006f',   // Deep magenta text
    defaultFeatures: {
      showMapLabels: false,  // OFF - cleaner look without street names
      showBuildings: true,   // ON - show buildings
      showParks: true,       // ON - show parks
      showWater: true,       // ON - show water
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 3
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffb3d9'  // Lighter pink background for contrast
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff66b3'  // Darker pink for buildings to stand out
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ff1493'  // Deep pink stroke for definition
          },
          {
            weight: 0.5
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White roads for maximum contrast
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ff1493'  // Pink stroke around roads
          },
          {
            weight: 0.3
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ff0080'
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffe6f2'  // Very light pink for arterial roads
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#fff0f7'  // Almost white with pink tint
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ff4da6'  // Vibrant pink for POI buildings
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff66b3'  // Lighter pink fill for variety
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ff1493'  // Deep pink stroke for definition
          },
          {
            weight: 0.5
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffb3d9'  // Soft pink for parks
          }
        ]
      },
      {
        featureType: 'poi.business',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ff3399'  // Bold pink for business buildings
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ffb6c1'
          },
          {
            weight: 1
          }
        ]
      }
    ]
  },

  sandstone: {
    name: 'Sandstone',
    description: 'Soft beige land with serene blue water for a calm, natural look',
    tags: ['beige', 'tan', 'blue', 'calm', 'natural'],
    background: '#f5efe6',  // Warm off-white background
    textColor: '#5d4e37',   // Warm brown text
    defaultFeatures: {
      showMapLabels: true,    // ON - show all labels
      showBuildings: true,    // ON - show buildings
      showParks: true,        // ON - show parks
      showWater: true,        // ON - show water bodies
      showRoads: true         // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#806b5a'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#f5e6d3'
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#e8d4b8'
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#e8d4b8'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#e8d4b8'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#c5d5a4'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#d4c3b0'
          },
          {
            weight: 0.5
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#806b5a'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#d4c3b0'
          },
          {
            weight: 0.8
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#fdfcfb'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#f9f7f5'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#a4c4e8'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#a4c4e8'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#6b8db5'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#a4c4e8'
          }
        ]
      }
    ]
  },

  mondrian: {
    name: 'Mondrian',
    description: 'Artistic style inspired by Piet Mondrian with primary colors and black lines',
    tags: ['artistic', 'colorful', 'primary', 'modern', 'abstract'],
    background: '#f5f5f0',  // Off-white background
    textColor: '#000000',   // Black text
    defaultFeatures: {
      showMapLabels: false,   // OFF - no street names for clean artistic look
      showBuildings: true,    // ON - show buildings
      showParks: true,        // ON - show parks
      showWater: true,        // ON - show water bodies
      showRoads: true         // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 3
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#e8f4f0'
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#e8f4f0'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#e8f4f0'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#c5e3d0'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'poi.attraction',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffd400'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'poi.business',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff0000'
          },
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'poi.government',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#0055ff'
          },
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2a2a2a'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#3d3d3d'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff0000'
          },
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#d4e8f7'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#d4e8f7'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#6b8db5'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#d4e8f7'
          }
        ]
      }
    ]
  },


  crimsonSteel: {
    name: 'Crimson Steel',
    description: 'Industrial crimson design focused on urban infrastructure - buildings and roads only',
    tags: ['bold', 'contrast', 'red', 'navy', 'dramatic', 'urban', 'industrial'],
    background: '#8b1a1a',  // Deep crimson background
    textColor: '#ffffff',   // White text for contrast
    defaultFeatures: {
      showMapLabels: false,   // OFF - ultra minimal
      showBuildings: false,   // OFF - hide buildings
      showParks: false,       // OFF - urban focus
      showWater: false,       // OFF - buildings and roads only
      showRoads: true         // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#2c1810'
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#c73e3a'  // Deep crimson red for land
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White roads
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#e0e0e0'
          },
          {
            weight: 0.5
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f5f5f5'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f0f0f0'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [
          {
            color: '#e8e8e8'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 1.5
          }
        ]
      }
    ]
  },

  nothingButRoads: {
    name: 'Road Network',
    description: 'Dark purple background with bright magenta roads - pure road network visualization',
    tags: ['dark', 'purple', 'magenta', 'minimal', 'roads-only', 'network'],
    background: '#FFF9F0',  // Cream poster background for text
    textColor: '#2d1b4e',   // Dark purple text for contrast on cream
    defaultFeatures: {
      showMapLabels: false,   // OFF - pure road visualization
      showBuildings: false,   // OFF - roads only
      showParks: false,       // OFF - roads only
      showWater: false,       // OFF - roads only
      showRoads: true         // ON - only feature visible
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#2d1b4e'  // Dark purple background
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ff3366'  // Bright magenta roads
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ff1a4d'  // Slightly brighter for highways
          },
          {
            weight: 3
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ff3366'  // Standard magenta for arterials
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ff4d7a'  // Slightly lighter for local roads
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ]
  },

  purpleCoast: {
    name: 'Purple Coast',
    description: 'Elegant purple background with white roads - pure road network only',
    tags: ['purple', 'white', 'minimal', 'elegant', 'contrast', 'roads-only'],
    background: '#6b4c7a',  // Deep purple background matching the poster
    textColor: '#ffffff',   // White text for contrast
    defaultFeatures: {
      showMapLabels: false,   // OFF - clean elegant look
      showBuildings: false,   // OFF - roads only
      showParks: false,       // OFF - minimal design
      showWater: false,       // OFF - roads only
      showRoads: true         // ON - show road network only
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#6b4c7a'  // Deep purple background
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'  // White water
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White roads
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White highways
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White arterials
          },
          {
            weight: 1.5
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White local roads
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            color: '#8d7a9b'  // Lighter purple for POIs
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#5a4065'  // Darker purple for parks
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'  // White transit
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ffffff'  // White boundaries
          },
          {
            weight: 1
          }
        ]
      }
    ]
  },

  chalkboard: {
    name: 'Chalkboard',
    description: 'Classic academic chalkboard style with white lines on dark gray - minimal and scholarly',
    tags: ['dark', 'white', 'academic', 'minimal', 'classic', 'scholarly', 'chalkboard'],
    background: '#3a3a3a',  // Dark charcoal gray background like a chalkboard
    textColor: '#f0f0f0',   // Light gray text for readability
    defaultFeatures: {
      showMapLabels: false,   // OFF - clean academic look
      showBuildings: false,   // OFF - minimal design
      showParks: false,       // OFF - focus on road network
      showWater: true,        // ON - water bodies important
      showRoads: true         // ON - main focus on road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#2d2d2d'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#1a1a1a'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#e0e0e0'
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#e8e8e8'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 3
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f0f0f0'
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#e0e0e0'
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#cccccc'
          },
          {
            weight: 0.5
          }
        ]
      },
      {
        featureType: 'administrative.country',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ]
  },

  teal: {
    name: 'Teal',
    description: 'Rich teal background with crisp white roads - elegant and sophisticated',
    tags: ['teal', 'white', 'elegant', 'sophisticated', 'classic', 'minimal'],
    background: '#f5f2e8',  // Warm cream background like the poster frame
    textColor: '#2c5f5f',   // Deep teal text for contrast
    defaultFeatures: {
      showMapLabels: false,   // OFF - clean elegant look
      showBuildings: false,   // OFF - minimal design  
      showParks: false,       // OFF - focus on road network
      showWater: true,        // ON - water complements teal
      showRoads: true         // ON - main focus on road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#2d5a5a'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#1a4040'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 3
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f8f8f8'
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f0f0f0'
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#cccccc'
          },
          {
            weight: 0.5
          }
        ]
      }
    ]
  },

  blueGold: {
    name: 'Blue Gold',
    description: 'Luxurious deep navy blue background with elegant gold roads - sophisticated and premium',
    tags: ['blue', 'gold', 'luxury', 'elegant', 'sophisticated', 'premium'],
    background: '#1a365d',  // Deep navy blue background
    textColor: '#d4af37',   // Gold text to match roads
    defaultFeatures: {
      showMapLabels: false,   // OFF - clean luxury look
      showBuildings: false,   // OFF - default settings
      showParks: false,       // OFF - default settings
      showWater: true,        // ON - default settings
      showRoads: true         // ON - default settings
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#1a365d'  // Deep navy blue background
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#0f2137'  // Darker blue for water
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#d4af37'  // Gold roads
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f4d03f'  // Brighter gold for highways
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#d4af37'  // Standard gold for arterials
          },
          {
            weight: 1.5
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#b8941f'  // Slightly darker gold for local roads
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            color: '#2c5282'  // Medium blue for POIs
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#153e75'  // Darker blue for parks
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            color: '#d4af37'  // Gold transit lines
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#d4af37'  // Gold boundaries
          },
          {
            weight: 1
          }
        ]
      }
    ]
  },

  purpleNight: {
    name: 'Purple Night',
    description: 'Deep purple and violet theme with vibrant magenta roads for a mystical nighttime feel',
    tags: ['purple', 'violet', 'night', 'dark', 'mystical', 'dramatic'],
    background: '#3e114e',  // Deep purple background matching landscape
    textColor: '#e8b8f9',   // Light purple/pink text for contrast
    defaultFeatures: {
      showMapLabels: false,   // OFF by default
      showBuildings: false,   // OFF - only roads visible
      showParks: false,       // OFF - only roads visible
      showWater: false,       // OFF - only roads visible
      showRoads: true         // ON - only roads visible
    },
    style: [
      {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "hue": "#bc00ff"
          },
          {
            "saturation": 0
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#e8b8f9"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels",
        "stylers": [
          {
            "color": "#ff0000"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#3e114e"
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          },
          {
            "color": "#a02aca"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "all",
        "stylers": [
          {
            "color": "#2e093b"
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "labels.text",
        "stylers": [
          {
            "color": "#9e1010"
          },
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ff0000"
          }
        ]
      },
      {
        "featureType": "landscape.natural.landcover",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "color": "#58176e"
          }
        ]
      },
      {
        "featureType": "landscape.natural.landcover",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 45
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "color": "#a02aca"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d180ee"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "color": "#a02aca"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          },
          {
            "color": "#ff0000"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
          {
            "color": "#a02aca"
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#cc81e7"
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "hue": "#bc00ff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#6d2388"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#c46ce3"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#b7918f"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#280b33"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "color": "#a02aca"
          }
        ]
      }
    ]
  },

  mintFresh: {
    name: 'Mint Fresh',
    description: 'Clean and refreshing style with soft mint green water and minimal details',
    tags: ['green', 'mint', 'clean', 'light', 'fresh', 'minimal'],
    background: '#E8F5E8',  // Soft mint background
    textColor: '#2d5a3d',   // Dark green text for contrast
    defaultFeatures: {
      showMapLabels: true,    // ON - all features enabled
      showBuildings: true,    // ON by default
      showParks: true,        // ON - parks enabled
      showWater: true,        // ON by default
      showRoads: true         // ON by default
    },
    style: [
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#444444"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#f2f2f2"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#66bb6a",
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#4caf50"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 45
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#91d0a5"
          },
          {
            "visibility": "on"
          }
        ]
      }
    ]
  },

  electricDreams: {
    name: 'Electric Dreams',
    description: 'Bold and vibrant style with electric cyan water, neon roads, and high contrast colors',
    tags: ['vibrant', 'electric', 'neon', 'colorful', 'bright', 'bold'],
    background: '#00ffff',  // Cyan background matching water
    textColor: '#0066cc',   // Deep blue text for contrast
    defaultFeatures: {
      showMapLabels: false,   // OFF - labels off by default
      showBuildings: true,    // ON by default
      showParks: false,       // OFF by default
      showWater: true,        // ON by default
      showRoads: true         // ON by default
    },
    style: [
      {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#ff9600"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#00ff00"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#0000ff"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ff00ff"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#00ffff"
          }
        ]
      }
    ]
  },

  vintagePaper: {
    name: 'Vintage Paper',
    description: 'Classic old map style with beige and muted tones, reminiscent of aged paper maps',
    tags: ['vintage', 'classic', 'old', 'paper', 'beige', 'muted'],
    background: '#f5f1e8',  // Warm off-white/paper background
    textColor: '#4a4a4a',   // Soft dark gray text
    defaultFeatures: {
      showMapLabels: true,    // ON by default for classic map feel
      showBuildings: true,    // ON by default
      showParks: true,        // ON by default
      showWater: true,        // ON by default
      showRoads: true         // ON by default
    },
    style: [
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "saturation": -100
          }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ff0000"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#bfc6a5"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#e4e4e4"
          },
          {
            "lightness": 0
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#bfc6a5"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#e4d7c6"
          }
        ]
      },
      {
        "featureType": "poi.attraction",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#e4d7c6"
          }
        ]
      },
      {
        "featureType": "poi.attraction",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#e4d7c6"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.government",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#e4d7c6"
          }
        ]
      },
      {
        "featureType": "poi.government",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.medical",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#e4d7c6"
          }
        ]
      },
      {
        "featureType": "poi.medical",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#bfc6a5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.place_of_worship",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.school",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e4d7c6"
          }
        ]
      },
      {
        "featureType": "poi.school",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.sports_complex",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e4d7c6"
          }
        ]
      },
      {
        "featureType": "poi.sports_complex",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "weight": 0.33
          },
          {
            "visibility": "on"
          },
          {
            "color": "#333333"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          },
          {
            "hue": "#ff0000"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#ced6d7"
          }
        ]
      }
    ]
  },

  softPeach: {
    name: 'Soft Peach',
    description: 'Elegant designer style with soft peach roads and mint water for a calming aesthetic',
    tags: ['soft', 'peach', 'mint', 'designer', 'elegant', 'pastel'],
    background: '#fdf8f4',  // Very soft warm white
    textColor: '#237f85',   // Teal text matching the admin labels
    defaultFeatures: {
      showMapLabels: true,    // ON by default
      showBuildings: true,    // ON by default
      showParks: false,       // OFF by default for cleaner look
      showWater: true,        // ON by default
      showRoads: true         // ON by default
    },
    style: [
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#237f85"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#f2f2f2"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 45
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#eeaf89"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#add8d4"
          },
          {
            "visibility": "on"
          }
        ]
      }
    ]
  },

  oceanBlue: {
    name: 'Ocean Blue',
    description: 'Bold cyan blue theme with high contrast white land and turquoise water',
    tags: ['ocean', 'blue', 'cyan', 'turquoise', 'marine', 'bold'],
    background: '#E6F3FF',  // Light blue background
    textColor: '#0066cc',   // Deep blue text for contrast
    defaultFeatures: {
      showMapLabels: true,    // ON by default
      showBuildings: true,    // ON by default
      showParks: false,       // OFF by default for cleaner look
      showWater: true,        // ON by default
      showRoads: true         // ON by default
    },
    style: [
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#0096aa"
          },
          {
            "weight": 0.30
          },
          {
            "saturation": -75
          },
          {
            "lightness": 5
          },
          {
            "gamma": 1
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#0096aa"
          },
          {
            "saturation": -75
          },
          {
            "lightness": 5
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "visibility": "on"
          },
          {
            "weight": 6
          },
          {
            "saturation": -28
          },
          {
            "lightness": 0
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#e6007e"
          },
          {
            "weight": 1
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "saturation": -28
          },
          {
            "lightness": 0
          }
        ]
      },
      {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#1eb7c5"
          },
          {
            "saturation": 40
          }
        ]
      },
      {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "saturation": 64
          },
          {
            "color": "#ca0909"
          }
        ]
      },
      {
        "featureType": "landscape.natural.terrain",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "saturation": 45
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "color": "#008eb1"
          },
          {
            "visibility": "simplified"
          },
          {
            "saturation": 0
          },
          {
            "lightness": 5
          },
          {
            "gamma": 1
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#ffffff"
          },
          {
            "weight": 8
          },
          {
            "saturation": -28
          },
          {
            "lightness": 0
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#008eb1"
          },
          {
            "weight": 8
          },
          {
            "lightness": 5
          },
          {
            "gamma": 1
          },
          {
            "saturation": 0
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "color": "#008eb1"
          },
          {
            "saturation": 0
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#008eb1"
          },
          {
            "saturation": 0
          },
          {
            "lightness": 5
          },
          {
            "gamma": 1
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "color": "#ffffff"
          },
          {
            "saturation": -28
          },
          {
            "lightness": 0
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ]
  },

  goldenGlow: {
    name: 'Golden Glow',
    description: 'Warm golden yellow theme with vibrant yellow roads for a sunny, energetic feel',
    tags: ['golden', 'yellow', 'warm', 'bright', 'sunny', 'vibrant'],
    background: '#fffc9e',  // Golden yellow background as requested
    textColor: '#6b6a00',   // Dark golden text for contrast
    defaultFeatures: {
      showMapLabels: true,    // ON - all features enabled
      showBuildings: true,    // ON by default
      showParks: true,        // ON - all features enabled
      showWater: true,        // ON by default
      showRoads: true         // ON by default
    },
    style: [
      {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "hue": "#ffeb00"
          },
          {
            "saturation": 0
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9c9a00"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels",
        "stylers": [
          {
            "color": "#ff9500"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#fff8dc"
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          },
          {
            "color": "#ffd700"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "all",
        "stylers": [
          {
            "color": "#fffacd"
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "labels.text",
        "stylers": [
          {
            "color": "#9c9a00"
          },
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ff9500"
          }
        ]
      },
      {
        "featureType": "landscape.natural.landcover",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "color": "#ffe066"
          }
        ]
      },
      {
        "featureType": "landscape.natural.landcover",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 45
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "color": "#ffd700"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ffeb3b"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "color": "#ffc107"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          },
          {
            "color": "#ff9500"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
          {
            "color": "#ffd700"
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ffeb3b"
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "hue": "#ffeb00"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f0e68c"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#daa520"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#87ceeb"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#87ceeb"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "color": "#4682b4"
          }
        ]
      }
    ]
  },

  navyBlue: {
    name: 'Navy Blue',
    description: 'Deep navy blue monochrome theme with sophisticated dark tones for an elegant look',
    tags: ['navy', 'blue', 'dark', 'monochrome', 'elegant', 'sophisticated'],
    background: '#1a2842',  // Deep navy background
    textColor: '#F5F5F5',   // Off-white text for contrast
    defaultFeatures: {
      showMapLabels: false,   // OFF - no labels
      showBuildings: true,    // ON - buildings visible
      showParks: false,       // OFF - no parks
      showWater: true,        // ON - water visible
      showRoads: true         // ON - roads visible
    },
    style: [
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8190ab"
          },
          {
            "lightness": -39
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "off"
          },
          {
            "color": "#142a49"
          },
          {
            "gamma": 1
          },
          {
            "lightness": -4
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#b8cae5"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#213555"
          },
          {
            "weight": 1.2
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text",
        "stylers": [
          {
            "color": "#506e95"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#6f84ab"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#213555"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#213555"
          },
          {
            "lightness": -10
          },
          {
            "gamma": 1
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#3a6896"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#172844"
          },
          {
            "lightness": -2
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#152b4a"
          },
          {
            "weight": 0.2
          },
          {
            "lightness": -22
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#6293da"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#1b304f"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#1b304f"
          },
          {
            "lightness": -5
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#1b304f"
          },
          {
            "lightness": -14
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#1b304f"
          },
          {
            "lightness": -17
          }
        ]
      }
    ]
  },
  
  rosePetal: {
    name: 'Rose Petal',
    description: 'A soft pink theme with romantic hues, perfect for feminine and elegant map posters',
    tags: ['pink', 'romantic', 'soft', 'feminine', 'elegant'],
    background: '#fff5f7',  // Very soft pink background
    textColor: '#a31645',    // Deep rose text color
    defaultFeatures: {
      showMapLabels: true,    // ON - show street names as in image
      showBuildings: true,    // ON - show buildings
      showParks: true,        // ON - show parks
      showWater: true,        // ON - show water
      showRoads: true         // ON - show roads
    },
    style: [
      {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffd4dc"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#a31645"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "weight": 2
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffecf0"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffe4e9"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffe9ee"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffb3c1"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#ff99b3"
          },
          {
            "weight": 0.5
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ff99b3"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#ff8099"
          },
          {
            "weight": 1
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffccdb"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#fedce3"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ]
  },

  neonRed: {
    name: 'Neon Red',
    description: 'Electric red roads on bright yellow background - high contrast urban infrastructure',
    tags: ['red', 'yellow', 'bright', 'bold', 'vibrant', 'urban', 'minimal'],
    background: '#fffacd',  // Light yellow background like neon urban
    textColor: '#333333',   // Dark gray text
    defaultFeatures: {
      showMapLabels: false,  // OFF - ultra minimal
      showBuildings: true,   // ON - show buildings
      showParks: false,      // OFF - urban focus
      showWater: false,      // OFF - buildings and roads only
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#333333'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 3
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffff00'  // Bright yellow like neon urban
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ff0000'  // Pure red for roads
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#cc0000'  // Darker red for highways
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ff3333'  // Medium red for arterial roads
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ff6666'  // Lighter red for local roads
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#cccccc'
          },
          {
            weight: 1
          }
        ]
      }
    ]
  },

  neonDark: {
    name: 'Neon Dark',
    description: 'Dark slate background with vibrant neon colors - magenta roads, cyan water, green parks',
    tags: ['black', 'neon', 'dark', 'vibrant', 'cyberpunk', 'contrast'],
    background: '#203138',  // Dark slate background
    textColor: '#ffffff',   // White text for contrast
    defaultFeatures: {
      showMapLabels: false,  // OFF - no street names as per image
      showBuildings: false,  // OFF - not visible in style
      showParks: false,      // OFF - only roads visible by default
      showWater: false,      // OFF - only roads visible by default
      showRoads: true        // ON - only roads visible
    },
    style: [
      {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "saturation": 36
          },
          {
            "color": "#000000"
          },
          {
            "lightness": 40
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#000000"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "lightness": 17
          },
          {
            "weight": 1.2
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#ff0000"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "all",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "lightness": 21
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ff00b4"
          },
          {
            "lightness": 17
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "lightness": 29
          },
          {
            "weight": 0.2
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "lightness": 18
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#00ff00"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ff0000"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "lightness": 19
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#ffaf00"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "color": "#ff8f00"
          },
          {
            "lightness": 3
          },
          {
            "saturation": -1
          },
          {
            "gamma": 0.95
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#1b2a30"
          },
          {
            "lightness": 17
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#00d9ff"
          }
        ]
      }
    ]
  },

  redprint: {
    name: 'Redprint',
    description: 'Architectural schematic style in crimson - focused on buildings and roads, no water',
    tags: ['minimal', 'red', 'clean', 'architectural', 'technical', 'dry'],
    background: '#ffffff',  // Pure white background
    textColor: '#8b0000',   // Dark red text
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean technical look
      showBuildings: true,   // ON - important for architectural style
      showParks: false,      // OFF - focus on built environment
      showWater: false,      // OFF - no water in this version
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8b0000'  // Dark red (was royal blue #0047ab)
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#8b0000'  // Dark red (was #0047ab)
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#cc0000'  // Bright red (was #0066cc)
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#a30000'  // Medium red (was #0052a3)
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#d97979'  // Light red (was #4d79a4)
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ffcccc'  // Light pink (was #cce7ff)
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8b0000'  // Dark red (was #0047ab)
          }
        ]
      }
    ]
  },

  greenprint: {
    name: 'Greenprint',
    description: 'Architectural schematic style in forest green - focused on buildings and roads, no water',
    tags: ['minimal', 'green', 'clean', 'architectural', 'technical', 'dry'],
    background: '#ffffff',  // Pure white background
    textColor: '#0b4d0b',   // Dark forest green text
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean technical look
      showBuildings: true,   // ON - important for architectural style
      showParks: false,      // OFF - focus on built environment
      showWater: false,      // OFF - no water in this version
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#0b4d0b'  // Dark forest green (was dark red #8b0000)
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#0b4d0b'  // Dark forest green (was #8b0000)
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#00a300'  // Bright green (was #cc0000)
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#1a7d1a'  // Medium green (was #a30000)
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#7dc97d'  // Light green (was #d97979)
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ccffcc'  // Light mint green (was #ffcccc)
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#0b4d0b'  // Dark forest green (was #8b0000)
          }
        ]
      }
    ]
  },

  blackprint: {
    name: 'Blackprint',
    description: 'Architectural schematic style in pure black - focused on buildings and roads, no water',
    tags: ['minimal', 'black', 'clean', 'architectural', 'technical', 'dry', 'monochrome'],
    background: '#ffffff',  // Pure white background
    textColor: '#000000',   // Pure black text
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean technical look
      showBuildings: true,   // ON - important for architectural style
      showParks: false,      // OFF - focus on built environment
      showWater: false,      // OFF - no water in this version
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#000000'  // Pure black
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#000000'  // Pure black
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#1a1a1a'  // Very dark gray for highways
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#333333'  // Dark gray for arterial roads
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#666666'  // Medium gray for local roads
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#e0e0e0'  // Light gray borders
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#000000'  // Pure black
          }
        ]
      }
    ]
  },

  orangeprint: {
    name: 'Orangeprint',
    description: 'Architectural schematic style in vibrant orange - focused on buildings and roads, no water',
    tags: ['minimal', 'orange', 'clean', 'architectural', 'technical', 'dry', 'warm'],
    background: '#ffffff',  // Pure white background
    textColor: '#cc5500',   // Burnt orange text
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean technical look
      showBuildings: true,   // ON - important for architectural style
      showParks: false,      // OFF - focus on built environment
      showWater: false,      // OFF - no water in this version
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#cc5500'  // Burnt orange
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#cc5500'  // Burnt orange
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ff6600'  // Bright orange for highways
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#e65c00'  // Medium orange for arterial roads
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffb380'  // Light orange for local roads
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ffe6d5'  // Light peach borders
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#cc5500'  // Burnt orange
          }
        ]
      }
    ]
  },

  purpleprint: {
    name: 'Purpleprint',
    description: 'Architectural schematic style in royal purple - focused on buildings and roads, no water',
    tags: ['minimal', 'purple', 'clean', 'architectural', 'technical', 'dry', 'royal'],
    background: '#ffffff',  // Pure white background
    textColor: '#6b2c91',   // Deep purple text
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean technical look
      showBuildings: true,   // ON - important for architectural style
      showParks: false,      // OFF - focus on built environment
      showWater: false,      // OFF - no water in this version
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#6b2c91'  // Deep purple
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#6b2c91'  // Deep purple
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#9933cc'  // Bright purple for highways
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#7d3ca3'  // Medium purple for arterial roads
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#c99fe6'  // Light purple for local roads
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#f0e6ff'  // Light lavender borders
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#6b2c91'  // Deep purple
          }
        ]
      }
    ]
  },

  cyanprint: {
    name: 'Cyanprint',
    description: 'Architectural schematic style in cyan blue - focused on buildings and roads, no water',
    tags: ['minimal', 'cyan', 'clean', 'architectural', 'technical', 'dry', 'modern'],
    background: '#ffffff',  // Pure white background
    textColor: '#006b8f',   // Deep cyan text
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean technical look
      showBuildings: true,   // ON - important for architectural style
      showParks: false,      // OFF - focus on built environment
      showWater: false,      // OFF - no water in this version
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#006b8f'  // Deep cyan
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#006b8f'  // Deep cyan
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#00bfff'  // Bright cyan for highways
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#0099cc'  // Medium cyan for arterial roads
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#99d9ea'  // Light cyan for local roads
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#e0f7ff'  // Light ice blue borders
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#006b8f'  // Deep cyan
          }
        ]
      }
    ]
  },

  pinkprint: {
    name: 'Pinkprint',
    description: 'Architectural schematic style in hot pink - focused on buildings and roads, no water',
    tags: ['minimal', 'pink', 'clean', 'architectural', 'technical', 'dry', 'bold'],
    background: '#ffffff',  // Pure white background
    textColor: '#c71585',   // Medium violet red
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean technical look
      showBuildings: true,   // ON - important for architectural style
      showParks: false,      // OFF - focus on built environment
      showWater: false,      // OFF - no water in this version
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#c71585'  // Medium violet red
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#c71585'  // Medium violet red
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ff1493'  // Deep pink for highways
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#db7093'  // Pale violet red for arterial roads
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffb6c1'  // Light pink for local roads
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ffe0ec'  // Very light pink borders
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#c71585'  // Medium violet red
          }
        ]
      }
    ]
  },


  brownprint: {
    name: 'Brownprint',
    description: 'Architectural schematic style in earth brown - focused on buildings and roads, no water',
    tags: ['minimal', 'brown', 'clean', 'architectural', 'technical', 'dry', 'earth'],
    background: '#ffffff',  // Pure white background
    textColor: '#6b4226',   // Dark brown
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean technical look
      showBuildings: true,   // ON - important for architectural style
      showParks: false,      // OFF - focus on built environment
      showWater: false,      // OFF - no water in this version
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#6b4226'  // Dark brown
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#6b4226'  // Dark brown
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#8b4513'  // Saddle brown for highways
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#a0522d'  // Sienna for arterial roads
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#d2b48c'  // Tan for local roads
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#f5e6d3'  // Light beige borders
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#6b4226'  // Dark brown
          }
        ]
      }
    ]
  },


  indigoprint: {
    name: 'Indigoprint',
    description: 'Architectural schematic style in deep indigo - focused on buildings and roads, no water',
    tags: ['minimal', 'indigo', 'clean', 'architectural', 'technical', 'dry', 'deep'],
    background: '#ffffff',  // Pure white background
    textColor: '#4b0082',   // Indigo
    defaultFeatures: {
      showMapLabels: false,  // OFF - clean technical look
      showBuildings: true,   // ON - important for architectural style
      showParks: false,      // OFF - focus on built environment
      showWater: false,      // OFF - no water in this version
      showRoads: true        // ON - show road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#4b0082'  // Indigo
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#4b0082'  // Indigo
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#6a0dad'  // Blue violet for highways
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#7b68ee'  // Medium slate blue for arterial roads
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#b19cd9'  // Light purple for local roads
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#e6e6fa'  // Lavender borders
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#4b0082'  // Indigo
          }
        ]
      }
    ]
  },

  orangeNoir: {
    name: 'Orange Noir',
    description: 'Stark orange and black with maximum contrast - an energetic twist on noir',
    tags: ['orange', 'black', 'minimal', 'contrast', 'bold', 'vibrant'],
    background: '#000000',  // Pure black background
    textColor: '#F5F5F5',   // Off-white text for better readability
    defaultFeatures: {
      showMapLabels: false,   // OFF - ultra minimal
      showBuildings: false,   // OFF - roads only for noir style
      showParks: false,       // OFF - minimal design
      showWater: false,       // OFF - roads only
      showRoads: true         // ON - show road network only
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ff6600'
          },
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000'
          },
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff6600'  // Bright orange roads
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff6600'  // Bright orange highways
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff6600'  // Bright orange arterial roads
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ff6600'  // Bright orange local roads
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#000000'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ]
  },

  figureGround: {
    name: 'Figure Ground',
    description: 'Classic architectural figure-ground diagram - black land, white water and roads',
    tags: ['black', 'white', 'architectural', 'diagram', 'minimal', 'figure-ground'],
    background: '#ffffff',  // White background to match the voids
    textColor: '#000000',   // Black text
    defaultFeatures: {
      showMapLabels: false,   // OFF - no labels for clean diagram
      showBuildings: false,   // OFF - merged with landscape
      showParks: false,       // OFF - merged with landscape
      showWater: true,        // ON - water shown as white voids
      showRoads: true         // ON - roads shown in white
    },
    style: [
      {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#000000"  // BLACK land mass
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "color": "#000000"  // BLACK POIs
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"  // BLACK parks
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"  // WHITE roads
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"  // WHITE highways
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"  // WHITE arterials
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"  // WHITE local roads
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"  // WHITE water (voids)
          }
        ]
      }
    ]
  },

  forestGreen: {
    name: 'Forest Green',
    description: 'Rich forest green background with crisp white roads - natural and sophisticated',
    tags: ['green', 'white', 'elegant', 'sophisticated', 'natural', 'minimal'],
    background: '#f5f2e8',  // Warm cream background (same as teal)
    textColor: '#1b4d1b',   // Deep forest green text for contrast
    defaultFeatures: {
      showMapLabels: false,   // OFF - clean elegant look
      showBuildings: false,   // OFF - minimal design  
      showParks: false,       // OFF - focus on road network
      showWater: true,        // ON - water complements green
      showRoads: true         // ON - main focus on road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#2d5a2d'  // Forest green (was teal #2d5a5a)
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#1a401a'  // Dark green water (was dark teal #1a4040)
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'
          },
          {
            weight: 3
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f8f8f8'
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f0f0f0'
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#cccccc'
          },
          {
            weight: 0.5
          }
        ]
      }
    ]
  },

  salmonSky: {
    name: 'Salmon Sky',
    description: 'Soft salmon pink land with cyan water and white roads - inspired by modern city maps',
    tags: ['salmon', 'pink', 'cyan', 'blue', 'white', 'modern', 'soft'],
    background: '#ffffff',  // Clean white background
    textColor: '#333333',   // Dark gray text for contrast
    defaultFeatures: {
      showMapLabels: false,   // OFF - clean minimal look
      showBuildings: false,   // OFF - focus on roads and water
      showParks: false,       // OFF - minimal design
      showWater: true,        // ON - beautiful cyan water
      showRoads: true         // ON - white road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#f4a8a3'  // Soft salmon pink for land
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            color: '#f4a8a3'  // Same salmon pink for POIs
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f4a8a3'  // Parks in salmon pink too
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White roads
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White highways
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White arterials
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White local roads
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#a8d5e2'  // Light cyan/blue water
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ]
  },

  classic: {
    name: 'Classic',
    description: 'Soft lavender land with periwinkle water and crisp white roads - serene and elegant',
    tags: ['lavender', 'purple', 'periwinkle', 'indigo', 'white', 'soft', 'elegant'],
    background: '#f8f8ff',  // Very light lavender background
    textColor: '#0a0a5c',   // Deep indigo text (from the JSON)
    defaultFeatures: {
      showMapLabels: true,    // ON - includes neighborhood names as shown
      showBuildings: false,   // OFF - clean minimal look
      showParks: false,       // OFF - minimal design
      showWater: true,        // ON - beautiful periwinkle water
      showRoads: true         // ON - white road network
    },
    style: [
      {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f0f0ff"
            }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f0f0ff"
            }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f0f0ff"
            },
            {
                "visibility": "off"
            }
        ]
      },
      {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f0f0ff"
            }
        ]
      },
      {
        "featureType": "administrative.province",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f0f0ff"
            }
        ]
      },
      {
        "featureType": "administrative.province",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#0a0a5c"
            }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f0f0ff"
            }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#0a0a5c"
            }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f0f0ff"
            }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#0a0a5c"
            }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f0f0ff"
            }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#0a0a5c"
            }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f0f0ff"
            }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f0f0ff"
            }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#333399"
            }
        ]
      },
      {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f0f0ff"
            }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            },
            {
                "color": "#ffffff"
            }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#333399"
            }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#333399"
            }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#c1c1ff"
            }
        ]
      }
    ]
  },

  lavenders: {
    name: 'Lavenders',
    description: 'Dreamy lavender palette with soft purple water and white roads - modern and calming',
    tags: ['lavender', 'purple', 'soft', 'modern', 'pastel', 'dreamy'],
    background: '#f5f0ff',  // Soft lavender background matching the image
    textColor: '#4a3d8a',   // Medium purple text for good contrast
    defaultFeatures: {
      showMapLabels: false,   // OFF - clean minimal look
      showBuildings: false,   // OFF - focus on roads and water
      showParks: false,       // OFF - minimal design
      showWater: true,        // ON - lavender water bodies
      showRoads: true         // ON - white road network
    },
    style: [
      {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#e8e0f5"  // Lighter lavender for land
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "color": "#e8e0f5"  // Same lavender for POIs
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#d8ccf0"  // Slightly darker lavender for parks
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"  // Pure white roads
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"  // White highways
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"  // White arterials
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"  // White local roads
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#b8b3e8"  // Soft periwinkle/lavender water matching image
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ]
  },

  emeraldCoast: {
    name: 'Emerald Coast',
    description: 'Rich emerald green with warm brown land and white roads - Mediterranean inspired',
    tags: ['emerald', 'teal', 'green', 'brown', 'mediterranean', 'coastal'],
    background: '#ffffff',  // Clean white background
    textColor: '#1a5952',   // Deep teal text for contrast
    defaultFeatures: {
      showMapLabels: false,   // OFF - clean minimal look
      showBuildings: false,   // OFF - focus on roads and water
      showParks: false,       // OFF - minimal design
      showWater: true,        // ON - emerald water
      showRoads: true         // ON - white road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#c4a57b'  // Warm tan/brown for land
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            color: '#c4a57b'  // Same brown for POIs
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#b89968'  // Slightly darker brown for parks
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White roads
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White highways
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White arterials
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffffff'  // White local roads
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#2b8b7f'  // Rich emerald/teal water
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ]
  },

  terra: {
    name: 'Terra',
    description: 'Warm terracotta land with deep teal water and light roads - earthy and sophisticated',
    tags: ['terracotta', 'earth', 'teal', 'brown', 'warm', 'sophisticated'],
    background: '#faf5f0',  // Warm off-white background
    textColor: '#5c4033',   // Dark brown text
    defaultFeatures: {
      showMapLabels: false,   // OFF - clean minimal look
      showBuildings: false,   // OFF - focus on roads and water
      showParks: false,       // OFF - minimal design
      showWater: true,        // ON - teal water
      showRoads: true         // ON - light road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#d4a373'  // Warm terracotta/sienna for land
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            color: '#d4a373'  // Same terracotta for POIs
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#c89660'  // Slightly darker terracotta for parks
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f5e6d3'  // Light cream roads
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f5e6d3'  // Light cream highways
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f5e6d3'  // Light cream arterials
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f5e6d3'  // Light cream local roads
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#1e5f5b'  // Deep teal water (like Seoul Han River)
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ]
  },

  blushCoast: {
    name: 'Blush Coast',
    description: 'Soft blush pink land with turquoise water and delicate roads - romantic and coastal',
    tags: ['pink', 'blush', 'turquoise', 'coastal', 'romantic', 'soft'],
    background: '#ffffff',  // Clean white background
    textColor: '#4a5568',   // Soft gray text
    defaultFeatures: {
      showMapLabels: false,   // OFF - clean minimal look
      showBuildings: false,   // OFF - focus on roads and water
      showParks: false,       // OFF - minimal design
      showWater: true,        // ON - turquoise water
      showRoads: true         // ON - delicate road network
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ color: '#ffd4d4' }]  // Soft blush pink land
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{ color: '#ffd4d4' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#e57373' }]  // Soft red roads
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#e57373' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#e57373' }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#e57373' }]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#b3e5e1' }]  // Soft turquoise water
      }
    ]
  },

  sageGarden: {
    name: 'Sage Garden',
    description: 'Soft beige land with olive green roads and teal water - Ottawa inspired',
    tags: ['beige', 'olive', 'green', 'teal', 'natural', 'ottawa'],
    background: '#f9f7f4',  // Warm off-white
    textColor: '#4a5c4a',   // Olive green text
    defaultFeatures: {
      showMapLabels: true,      // ON - show street names
      showBuildings: true,     // ON - visible darker green buildings
      showParks: true,        // ON - complements green theme
      showWater: true,
      showRoads: true
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ color: '#e8dcc8' }]  // Soft beige/tan land
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{ color: '#e8dcc8' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#d4c8b4' }]  // Slightly darker beige for parks
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry',
        stylers: [{ color: '#7a9b8e' }]  // Darker green for buildings
      },
      {
        featureType: 'poi.business',
        elementType: 'geometry',
        stylers: [{ color: '#7a9b8e' }]  // Darker green for business buildings
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#b8e6d3' }]  // Light mint green roads
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#b8e6d3' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#b8e6d3' }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#b8e6d3' }]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#5a8088' }]  // Teal/blue-gray water
      }
    ]
  },

  peachSunset: {
    name: 'Peach Sunset',
    description: 'Light peach land with dark roads and deeper orange water - Perth inspired',
    tags: ['peach', 'coral', 'sunset', 'warm', 'orange', 'soft'],
    background: '#fff9f5',  // Very soft peach white
    textColor: '#8b5a3c',   // Warm brown text
    defaultFeatures: {
      showMapLabels: false,
      showBuildings: false,
      showParks: false,
      showWater: true,
      showRoads: true
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ color: '#ffd4c4' }]  // Lighter peach land
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{ color: '#ffd4c4' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]  // White roads
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#ff9980' }]  // Darker orange/coral water
      }
    ]
  },

  coralDusk: {
    name: 'Coral Dusk',
    description: 'Soft coral land with navy blue water and light cream roads - sophisticated sunset',
    tags: ['coral', 'navy', 'sunset', 'sophisticated', 'los angeles', 'dusk'],
    background: '#fff5f0',  // Soft coral-tinted white
    textColor: '#2c3e50',   // Deep navy text
    defaultFeatures: {
      showMapLabels: false,
      showBuildings: false,
      showParks: false,
      showWater: true,        // ON - dramatic purple water
      showRoads: true
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ color: '#ffaa95' }]  // Softer coral land
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{ color: '#ffaa95' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#ffe4dc' }]  // Light cream/peachy roads
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#ffe4dc' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#ffe4dc' }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#ffe4dc' }]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#34495e' }]  // Sophisticated navy blue water
      }
    ]
  },

  crimsonTide: {
    name: 'Crimson Tide',
    description: 'Bold red land with dark navy water - dramatic minimalist contrast',
    tags: ['red', 'navy', 'dark', 'two-tone', 'colorful', 'dramatic'],
    background: '#FFF9F0',  // Warm cream background
    textColor: '#1a1a2e',   // Dark navy text
    defaultFeatures: {
      showMapLabels: false,   // OFF
      showBuildings: true,    // ON - only buildings
      showParks: false,       // OFF
      showWater: true,        // ON - only water
      showRoads: false        // OFF
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#ffffff' }]  // White text labels
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ color: '#e74c3c' }]  // Bright red land
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{ color: '#c0392b' }]  // Darker red for POIs
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#c0392b' }]  // Darker red for parks
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#2c3e50' }]  // Dark navy roads
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#2c3e50' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#2c3e50' }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#34495e' }]  // Slightly lighter for local roads
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ visibility: 'simplified' }]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{ color: '#2c3e50' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#1a1a2e' }]  // Dark navy/black water
      }
    ]
  },

  emeraldNight: {
    name: 'Emerald Night',
    description: 'Vibrant green land with dark water on midnight background - neon minimalist',
    tags: ['green', 'dark', 'neon', 'night', 'modern', 'minimalist'],
    background: '#1d1f33',  // Dark midnight blue background
    textColor: '#F5F5F5',   // Off-white text for better readability
    defaultFeatures: {
      showMapLabels: false,   // OFF
      showBuildings: true,    // ON - only buildings
      showParks: false,       // OFF
      showWater: true,        // ON - only water
      showRoads: false        // OFF
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#ffffff' }]  // White text labels
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ color: '#27ae60' }]  // Bright green land
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{ color: '#229954' }]  // Darker green for POIs
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#229954' }]  // Darker green for parks
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#2c3e50' }]  // Dark gray roads
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#2c3e50' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#2c3e50' }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#34495e' }]  // Slightly lighter for local roads
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ visibility: 'simplified' }]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{ color: '#2c3e50' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#1a1a2e' }]  // Dark navy/black water
      }
    ]
  },


  rome: {
    name: 'Rome',
    description: 'Warm cream and golden tones - classic Italian elegance',
    tags: ['cream', 'golden', 'rome', 'italian', 'warm', 'classic'],
    background: '#fffef9',  // Warm off-white
    textColor: '#6b5d4f',   // Warm brown text
    defaultFeatures: {
      showMapLabels: false,
      showBuildings: true,     // ON
      showParks: false,        // OFF
      showWater: true,         // ON
      showRoads: true          // ON
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ color: '#f5e6d3' }]  // Warm cream land
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{ color: '#f5e6d3' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#d4b896' }]  // Golden tan roads
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#d4b896' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#d4b896' }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#d4b896' }]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#e8d4bc' }]  // Light tan water
      }
    ]
  },

  rioDeJaneiro: {
    name: 'Rio de Janeiro',
    description: 'Tropical mint and yellow with turquoise water - beach paradise',
    tags: ['mint', 'yellow', 'turquoise', 'rio', 'tropical', 'beach'],
    background: '#ffffff',
    textColor: '#2a5f5e',   // Teal text
    defaultFeatures: {
      showMapLabels: false,
      showBuildings: false,
      showParks: true,        // ON to show yellow areas
      showWater: true,
      showRoads: true
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ color: '#7fb798' }]  // Darker mint green land
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{ color: '#7fb798' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#f4d03f' }]  // Yellow for beaches/parks
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{ color: '#f4d03f' }]  // Yellow natural areas
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]  // White roads
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#5dade2' }]  // Turquoise water
      }
    ]
  },

  newYorkStyle: {
    name: 'New York Style',
    description: 'Soft coral pink with teal water - modern metropolitan',
    tags: ['coral', 'pink', 'teal', 'new york', 'metropolitan', 'modern'],
    background: '#ffffff',
    textColor: '#2c5f5f',   // Dark teal text
    defaultFeatures: {
      showMapLabels: false,
      showBuildings: false,
      showParks: false,
      showWater: true,
      showRoads: true
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ color: '#ffccc5' }]  // Soft coral pink land
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{ color: '#ffccc5' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#ff9a8d' }]  // Darker coral roads
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#ff9a8d' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#ff9a8d' }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#ff9a8d' }]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#5f9ea0' }]  // Teal water
      }
    ]
  },

  sanFrancisco: {
    name: 'San Francisco',
    description: 'Dark navy with golden yellow water - California sunset',
    tags: ['golden', 'yellow', 'navy', 'san francisco', 'california', 'bold'],
    background: '#1a1a2e',  // Dark navy background
    textColor: '#ffc000',   // Golden yellow text
    defaultFeatures: {
      showMapLabels: false,
      showBuildings: false,
      showParks: false,
      showWater: true,
      showRoads: true
    },
    style: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ color: '#1a1a2e' }]  // Dark navy land
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{ color: '#1a1a2e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]  // White roads
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#ffc000' }]  // Golden yellow water
      }
    ]
  },

  butter: {
    name: 'Butter',
    description: 'Warm creamy palette with soft yellow tones and white roads',
    tags: ['light', 'warm', 'minimal', 'soft', 'yellow', 'cream'],
    background: '#fffcf0',  // Very light warm cream
    textColor: '#4a4a3a',   // Dark olive-brown for contrast
    defaultFeatures: {
      showMapLabels: true,    // ON - show all street names and labels
      showBuildings: true,    // ON
      showParks: true,        // ON - show parks
      showWater: true,        // ON - nice contrast with blue
      showRoads: true         // ON - white roads are key feature
    },
    style: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [
          {
            color: '#fff8af'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            gamma: 0.01
          },
          {
            lightness: 20
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            saturation: -31
          },
          {
            lightness: -33
          },
          {
            weight: 2
          },
          {
            gamma: 0.8
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [
          {
            lightness: 30
          },
          {
            saturation: 30
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            saturation: 20
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            lightness: 20
          },
          {
            saturation: -20
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#efebc1'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            lightness: 10
          },
          {
            saturation: -30
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            saturation: 25
          },
          {
            lightness: 25
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#d2d1ce'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            lightness: -20
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#87ceeb'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ]
  },

  sunshine: {
    name: 'Sunshine',
    description: 'Vibrant bright yellow with blue water and black road outlines',
    tags: ['yellow', 'bright', 'bold', 'vibrant', 'blue', 'energetic'],
    background: '#ffe631',  // Vibrant yellow canvas background
    textColor: '#000000',   // Black text for strong contrast on yellow
    defaultFeatures: {
      showMapLabels: false,   // OFF
      showBuildings: false,   // OFF
      showParks: false,       // OFF
      showWater: true,        // ON - blue water is key feature
      showRoads: true         // ON - black road outlines
    },
    style: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [
          {
            color: '#ffe52c'
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            gamma: 0.01
          },
          {
            lightness: 20
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            saturation: -31
          },
          {
            lightness: -33
          },
          {
            weight: 2
          },
          {
            gamma: 0.8
          }
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [
          {
            hue: '#ffe000'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            weight: 0.01
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'labels.text',
        stylers: [
          {
            weight: 0.01
          },
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'landscape',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            saturation: 20
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            lightness: 20
          },
          {
            saturation: -20
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            lightness: 10
          },
          {
            saturation: -30
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            visibility: 'off'
          },
          {
            weight: 0.01
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'simplified'
          },
          {
            weight: 0.01
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'simplified'
          },
          {
            hue: '#ffc900'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            lightness: -20
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#0096d7'
          },
          {
            visibility: 'simplified'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ]
  }

  // More styles can be added here
};

/**
 * Get a list of available Snazzy Map styles
 */
export function getSnazzyStyleList(): Array<{ id: string; name: string; description?: string; tags?: string[] }> {
  return Object.entries(SNAZZY_MAP_STYLES).map(([id, style]) => ({
    id,
    name: style.name,
    description: style.description,
    tags: style.tags
  }));
}

/**
 * Get a specific Snazzy Map style by ID
 */
export function getSnazzyStyle(styleId: string): SnazzyMapStyle | undefined {
  return SNAZZY_MAP_STYLES[styleId];
}

/**
 * Add a new Snazzy Map style dynamically
 */
export function addSnazzyStyle(id: string, style: SnazzyMapStyle): void {
  SNAZZY_MAP_STYLES[id] = style;
}