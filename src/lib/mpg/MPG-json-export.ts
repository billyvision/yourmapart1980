import { useMPGStore } from './MPG-store';

// JSON schema version for future compatibility
const JSON_SCHEMA_VERSION = '1.0';

export interface MapPosterSnapshot {
  version: string;
  created: string;
  application: string;
  snapshot: {
    location: {
      city: string;
      lat: number;
      lng: number;
      country: string;
      zoom: number;
      mapOffsetX: number;
      mapOffsetY: number;
    };
    text: {
      headline: {
        text: string;
        font: string;
        size: 'S' | 'M' | 'L';
        allCaps: boolean;
      };
      city: {
        show: boolean;
        font: string;
        size: 'S' | 'M' | 'L';
      };
      coordinates: {
        show: boolean;
        font: string;
        size: 'S' | 'M' | 'L';
      };
      country: {
        show: boolean;
        font: string;
        size: 'S' | 'M' | 'L';
      };
      custom: {
        text: string;
        font: string;
        size: 'S' | 'M' | 'L';
      };
      typography: {
        letterSpacing: number;
        textSpacing: number;
      };
    };
    style: {
      mapStyle: string;
      frame: {
        style: 'square' | 'circle' | 'heart' | 'house';
        showBorder: boolean;
      };
      glow: {
        enabled: boolean;
        style: string;
        intensity: number;
      };
      background: {
        color: string;
        useCustom: boolean;
        textColor: string;
      };
      features: {
        labels: boolean;
        buildings: boolean;
        parks: boolean;
        water: boolean;
        roads: boolean;
      };
      pin: {
        show: boolean;
        style: 'basic' | 'fave' | 'lolli' | 'heart' | 'home';
        color: string;
        size: 'S' | 'M' | 'L';
      };
      fontColor?: {  // Optional for backward compatibility
        useCustom: boolean;
        color: string;
      };
    };
    export: {
      format: 'png' | 'jpg' | 'pdf';
      size: string;
      quality: number;
    };
  };
}

/**
 * Generate a complete snapshot of the current map poster configuration
 */
export function generateMapSnapshot(): MapPosterSnapshot {
  const state = useMPGStore.getState();
  
  return {
    version: JSON_SCHEMA_VERSION,
    created: new Date().toISOString(),
    application: 'YourMapArt',
    snapshot: {
      location: {
        city: state.city,
        lat: state.lat,
        lng: state.lng,
        country: state.country,
        zoom: state.zoom,
        mapOffsetX: state.mapOffsetX,
        mapOffsetY: state.mapOffsetY
      },
      text: {
        headline: {
          text: state.headlineText,
          font: state.headlineFont,
          size: state.headlineSize,
          allCaps: state.headlineAllCaps
        },
        city: {
          show: state.showCityName,
          font: state.titleFont,
          size: state.titleSize
        },
        coordinates: {
          show: state.showCoordinates,
          font: state.coordinatesFont,
          size: state.coordinatesSize
        },
        country: {
          show: state.showCountry,
          font: state.countryFont,
          size: state.countrySize
        },
        custom: {
          text: state.customText,
          font: state.customTextFont,
          size: state.customTextSize
        },
        typography: {
          letterSpacing: state.letterSpacing,
          textSpacing: state.textSpacing
        }
      },
      style: {
        mapStyle: state.style,
        frame: {
          style: state.frameStyle,
          showBorder: state.showFrameBorder
        },
        glow: {
          enabled: state.glowEffect,
          style: state.glowStyle,
          intensity: state.glowIntensity
        },
        background: {
          color: state.backgroundColor,
          useCustom: state.useCustomBackground,
          textColor: state.textColor
        },
        features: {
          labels: state.showMapLabels,
          buildings: state.showMapBuildings,
          parks: state.showMapParks,
          water: state.showMapWater,
          roads: state.showMapRoads
        },
        pin: {
          show: state.showPin,
          style: state.pinStyle,
          color: state.pinColor,
          size: state.pinSize
        },
        fontColor: {
          useCustom: state.useCustomFontColor,
          color: state.customFontColor
        }
      },
      export: {
        format: state.exportFormat,
        size: state.exportSize,
        quality: state.exportQuality
      }
    }
  };
}

/**
 * Download the map configuration as a JSON file
 */
export function downloadMapJSON() {
  const snapshot = generateMapSnapshot();
  
  // Create filename with city and date
  const city = snapshot.snapshot.location.city.toLowerCase().replace(/\s+/g, '-');
  const date = new Date().toISOString().split('T')[0];
  const filename = `yourmapart-${city}-${date}.json`;
  
  // Convert to JSON string with pretty formatting
  const jsonString = JSON.stringify(snapshot, null, 2);
  
  // Create blob and download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Load map configuration from a JSON snapshot (for future use)
 */
export function loadMapSnapshot(snapshot: MapPosterSnapshot): boolean {
  try {
    // Validate version compatibility
    if (snapshot.version !== JSON_SCHEMA_VERSION) {
      console.warn(`JSON version mismatch: expected ${JSON_SCHEMA_VERSION}, got ${snapshot.version}`);
    }
    
    const store = useMPGStore.getState();
    const data = snapshot.snapshot;
    
    // Load location data
    store.setCity(data.location.city, data.location.lat, data.location.lng, data.location.country);
    store.setZoom(data.location.zoom);
    store.panMap(data.location.mapOffsetX, data.location.mapOffsetY);
    
    // Load text settings
    store.setHeadlineText(data.text.headline.text);
    store.setHeadlineFont(data.text.headline.font);
    store.setHeadlineSize(data.text.headline.size);
    store.setHeadlineAllCaps(data.text.headline.allCaps);
    
    store.setShowCityName(data.text.city.show);
    store.setTitleFont(data.text.city.font);
    store.setTitleSize(data.text.city.size);
    
    store.setShowCoordinates(data.text.coordinates.show);
    store.setCoordinatesFont(data.text.coordinates.font);
    store.setCoordinatesSize(data.text.coordinates.size);
    
    store.setShowCountry(data.text.country.show);
    store.setCountryFont(data.text.country.font);
    store.setCountrySize(data.text.country.size);
    
    store.setCustomText(data.text.custom.text);
    store.setCustomTextFont(data.text.custom.font);
    store.setCustomTextSize(data.text.custom.size);
    
    store.setLetterSpacing(data.text.typography.letterSpacing);
    store.setTextSpacing(data.text.typography.textSpacing);
    
    // Load style settings
    store.setStyle(data.style.mapStyle);
    store.setFrameStyle(data.style.frame.style);
    store.setShowFrameBorder(data.style.frame.showBorder);
    
    store.setGlowEffect(data.style.glow.enabled);
    store.setGlowStyle(data.style.glow.style as any);
    store.setGlowIntensity(data.style.glow.intensity);
    
    store.setBackgroundColor(data.style.background.color);
    store.setUseCustomBackground(data.style.background.useCustom);
    store.setTextColor(data.style.background.textColor);
    
    store.setShowMapLabels(data.style.features.labels);
    store.setShowMapBuildings(data.style.features.buildings);
    store.setShowMapParks(data.style.features.parks);
    store.setShowMapWater(data.style.features.water);
    store.setShowMapRoads(data.style.features.roads);
    
    store.setShowPin(data.style.pin.show);
    store.setPinStyle(data.style.pin.style);
    store.setPinColor(data.style.pin.color);
    store.setPinSize(data.style.pin.size);
    
    // Load font color settings (with backward compatibility)
    if (data.style.fontColor) {
      store.setUseCustomFontColor(data.style.fontColor.useCustom);
      store.setCustomFontColor(data.style.fontColor.color);
    } else {
      // Default values for old templates
      store.setUseCustomFontColor(false);
      store.setCustomFontColor('#333333');
    }
    
    // Load export settings
    store.setExportFormat(data.export.format);
    store.setExportSize(data.export.size);
    store.setExportQuality(data.export.quality);
    
    return true;
  } catch (error) {
    console.error('Failed to load map snapshot:', error);
    return false;
  }
}

/**
 * Validate a JSON snapshot structure
 */
export function validateSnapshot(data: any): data is MapPosterSnapshot {
  return (
    data &&
    typeof data === 'object' &&
    data.version &&
    data.snapshot &&
    data.snapshot.location &&
    data.snapshot.text &&
    data.snapshot.style &&
    data.snapshot.export
  );
}