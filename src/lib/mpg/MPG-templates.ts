import { MapPosterSnapshot } from './MPG-json-export';

// Template metadata structure
export interface MapTemplate {
  id: string;
  name: string;
  description: string;
  city: string;
  style: string;
  featured?: boolean;
  popular?: boolean;
  hidden?: boolean;
  tags: string[];
  thumbnail?: string;
  jsonData?: MapPosterSnapshot;
}

// Templates are now loaded dynamically from /public/templates/json/
// This array will be populated from the server
export let mapTemplateConfigs: MapTemplate[] = [];

/**
 * Load templates from the server
 */
export async function loadTemplates(): Promise<MapTemplate[]> {
  try {
    const response = await fetch('/api/get-templates');
    if (response.ok) {
      const data = await response.json();
      mapTemplateConfigs = data.templates || [];
      return mapTemplateConfigs;
    }
  } catch (error) {
    console.error('Failed to load templates:', error);
  }
  return [];
}

/**
 * Get a template by ID
 */
export function getTemplateById(templateId: string): MapTemplate | undefined {
  return mapTemplateConfigs.find(template => template.id === templateId);
}

/**
 * Get template JSON data
 */
export async function getTemplateData(templateId: string): Promise<MapPosterSnapshot | null> {
  try {
    // Ensure templates are loaded first
    if (mapTemplateConfigs.length === 0) {
      await loadTemplates();
    }

    // Check if template is already loaded
    const template = getTemplateById(templateId);
    if (template?.jsonData) {
      return template.jsonData;
    }

    // Try loading from both possible locations
    const paths = [
      `/templates/json/${templateId}.json`,
      `/mpg/templates/json/${templateId}.json`
    ];

    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          return data.jsonData;
        }
      } catch (error) {
        // Try next path
        continue;
      }
    }
  } catch (error) {
    console.error(`Failed to load template ${templateId}:`, error);
  }
  return null;
}

/**
 * Create a basic template from metadata
 */
function createBasicTemplate(template: MapTemplate): MapPosterSnapshot {
  const cityCoordinates: Record<string, { lat: number; lng: number; country: string }> = {
    "New York": { lat: 40.7128, lng: -74.0060, country: "United States" },
    "Paris": { lat: 48.8566, lng: 2.3522, country: "France" },
    "Tokyo": { lat: 35.6762, lng: 139.6503, country: "Japan" },
    "London": { lat: 51.5074, lng: -0.1278, country: "United Kingdom" },
    "Barcelona": { lat: 41.3851, lng: 2.1734, country: "Spain" },
    "Amsterdam": { lat: 52.3676, lng: 4.9041, country: "Netherlands" },
  };
  
  const coords = cityCoordinates[template.city] || { lat: 0, lng: 0, country: "" };
  
  return {
    version: "1.0",
    created: new Date().toISOString(),
    application: "YourMapArt",
    snapshot: {
      location: {
        city: template.city,
        lat: coords.lat,
        lng: coords.lng,
        country: coords.country,
        zoom: 13,
        mapOffsetX: 0,
        mapOffsetY: 0,
      },
      text: {
        headline: {
          text: template.city.toUpperCase(),
          font: "Montserrat",
          size: "L",
          allCaps: true,
        },
        city: {
          show: true,
          font: "playfair",
          size: "M",
        },
        coordinates: {
          show: true,
          font: "roboto",
          size: "M",
        },
        country: {
          show: true,
          font: "roboto",
          size: "M",
        },
        custom: {
          text: "",
          font: "Montserrat",
          size: "M",
        },
        typography: {
          letterSpacing: 8,
          textSpacing: 1.2,
        },
      },
      style: {
        mapStyle: template.style,
        frame: {
          style: "square",
          showBorder: true,
        },
        glow: {
          enabled: false,
          style: "silverGrey",
          intensity: 0.4,
        },
        background: {
          color: "#ffffff",
          useCustom: false,
          textColor: "#333333",
        },
        features: {
          labels: false,
          buildings: true,
          parks: true,
          water: true,
          roads: true,
        },
        pin: {
          show: true,
          style: "heart",
          color: "#FF6B6B",
          size: "M",
        },
      },
      export: {
        format: "png",
        size: "A4",
        quality: 0.95,
      },
    },
  };
}

/**
 * Load template JSON data from file
 */
export async function loadTemplateFromFile(templateId: string): Promise<MapPosterSnapshot | null> {
  return getTemplateData(templateId);
}

/**
 * Update a template with new JSON data (client-side only, won't persist)
 */
export function updateTemplateData(templateId: string, jsonData: MapPosterSnapshot): boolean {
  const template = mapTemplateConfigs.find(t => t.id === templateId);
  if (template) {
    template.jsonData = jsonData;
    return true;
  }
  return false;
}

// Initialize templates on module load
if (typeof window !== 'undefined') {
  loadTemplates();
}