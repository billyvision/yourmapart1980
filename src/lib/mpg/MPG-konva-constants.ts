// Konva-specific constants for Map Poster Generator
import Konva from 'konva';

// BASE CANVAS SIZE - All layout calculations use this fixed size
// This ensures perfect WYSIWYG between preview and export
export const MPG_BASE_CANVAS = {
  width: 1200,  // Base width
  height: 1600, // Base height (3:4 ratio)
};

// Map size relative to base canvas - always consistent
export const MPG_BASE_MAP = {
  width: 720,  // 60% of base width (visible area)
  height: 720, // Square aspect ratio (visible area)
  x: 240,      // Centered horizontally: (1200 - 720) / 2
  y: 320,      // Positioned with more padding from top for square frame
};

// Square frame specific dimensions with proper padding
export const MPG_SQUARE_FRAME = {
  // Default (no headline) - MUCH larger square
  default: {
    width: 1050,  // Much bigger square for prominent display
    height: 1050, // Square aspect
    x: 75,        // Centered: (1200 - 1050) / 2
    y: 80,        // Positioned near top
    padding: 15,  // Minimal padding for maximum map visibility
  },
  // With headline - still large but leaves room for text
  withHeadline: {
    width: 900,   // Larger than before
    height: 900,  // Square aspect
    x: 150,       // Centered: (1200 - 900) / 2
    y: 220,       // Lower to make room for headline
    padding: 25,  // Minimal padding
  }
};

// Circle frame dimensions - 17% larger when no headline (was 30%, reduced by 10%)
export const MPG_CIRCLE_FRAME = {
  // Default (no headline) - 17% larger (10% smaller than the 30% increase)
  default: {
    width: 842,   // 720 * 1.17 (17% bigger, which is 10% less than 30%)
    height: 842,  // Square aspect for circle
    x: 179,       // Centered: (1200 - 842) / 2
    y: 220,       // Positioned slightly lower than before
  },
  // With headline - standard size
  withHeadline: {
    width: 720,   // Current standard size
    height: 720,  // Square aspect for circle
    x: 240,       // Current position: (1200 - 720) / 2
    y: 320,       // Current position with room for headline
  }
};

// Heart frame dimensions - 30% larger when no headline
export const MPG_HEART_FRAME = {
  // Default (no headline) - 30% larger
  default: {
    width: 936,   // 720 * 1.3 (30% bigger)
    height: 936,  // Square aspect for heart
    x: 132,       // Centered: (1200 - 936) / 2
    y: 200,       // Positioned higher when no headline
  },
  // With headline - standard size
  withHeadline: {
    width: 720,   // Current standard size
    height: 720,  // Square aspect for heart
    x: 240,       // Current position: (1200 - 720) / 2
    y: 320,       // Current position with room for headline
  }
};

// House frame dimensions - 30% larger when no headline
export const MPG_HOUSE_FRAME = {
  // Default (no headline) - 30% larger
  default: {
    width: 936,   // 720 * 1.3 (30% bigger)
    height: 936,  // Square aspect for house
    x: 132,       // Centered: (1200 - 936) / 2
    y: 200,       // Positioned higher when no headline
  },
  // With headline - standard size
  withHeadline: {
    width: 720,   // Current standard size
    height: 720,  // Square aspect for house
    x: 240,       // Current position: (1200 - 720) / 2
    y: 320,       // Current position with room for headline
  }
};

// Actual map image size (larger for panning)
export const MPG_MAP_IMAGE = {
  width: 1440,  // 2x visible area for better quality and panning room
  height: 1440, // 2x visible area for better quality and panning room
  maxOffset: 360 // Maximum pan distance ((1440 - 720) / 2)
};

// Canvas sizes for different export formats (deprecated - kept for reference)
export const MPG_KONVA_CANVAS_SIZES = {
  preview: MPG_BASE_CANVAS, // Always use base for preview
  export: {
    A4: { width: 2480, height: 3508 },
    Letter: { width: 2550, height: 3300 },
    Square: { width: 3000, height: 3000 },
    Portrait: { width: 2400, height: 3200 },
    Landscape: { width: 3200, height: 2400 }
  }
};

// Map container sizes within the poster (deprecated - use MPG_BASE_MAP)
export const MPG_KONVA_MAP_SIZES = {
  preview: MPG_BASE_MAP,
  export: {
    A4: { width: 1488, height: 1488 }, // 60% of 2480
    Letter: { width: 1530, height: 1530 }, // 60% of 2550
    Square: { width: 1800, height: 1800 }, // 60% of 3000
    Portrait: { width: 1440, height: 1440 }, // 60% of 2400
    Landscape: { width: 1440, height: 1440 } // 60% of smaller dimension
  }
};

// Text layout configuration - absolute positions based on base canvas
export const MPG_KONVA_TEXT_LAYOUT = {
  // Y positions as absolute values on base canvas - moved 10-15% lower
  titleY: 1280,     // Moved down significantly for better spacing
  coordinatesY: 1392, // Moved down proportionally
  countryY: 1456,    // Moved down proportionally
  customTextY: 1520, // Moved down proportionally
  
  // Font sizes based on base canvas dimensions
  fontSize: {
    title: 72,       // Single size for base canvas
    coordinates: 28, // Single size for base canvas
    country: 32,     // Single size for base canvas
    customText: 36   // Single size for base canvas
  }
};

// Watermark configuration - based on base canvas
export const MPG_KONVA_WATERMARK = {
  text: 'YOURMARTART',
  opacity: 0.15,
  rotation: -30,
  fontSize: 40, // Single size for base canvas
  positions: [400, 800, 1200] // Y positions as absolute values on base canvas
};

// Filter configurations for Konva
export const MPG_KONVA_FILTERS = {
  minimal: {
    filters: [Konva.Filters.Grayscale, Konva.Filters.Contrast, Konva.Filters.Brighten],
    config: {
      contrast: 0.3,
      brightness: 0.1
    }
  },
  'vintage-pink': {
    filters: [Konva.Filters.Sepia, Konva.Filters.HSL],
    config: {
      hue: -40, // Shift toward pink
      saturation: 0.5,
      luminance: 0
    }
  },
  'middle-blue': {
    filters: [Konva.Filters.HSL],
    config: {
      hue: 200,
      saturation: -0.2,
      luminance: 0.1
    }
  },
  sandstone: {
    filters: [Konva.Filters.Sepia, Konva.Filters.HSL, Konva.Filters.Brighten],
    config: {
      hue: 20,
      saturation: 0.8,
      luminance: 0.05,
      brightness: 0.05
    }
  },
  'vintage-blue': {
    filters: [Konva.Filters.HSL, Konva.Filters.Contrast],
    config: {
      hue: 190,
      saturation: 0.3,
      luminance: -0.05,
      contrast: 0.2
    }
  },
  atlas: {
    filters: [Konva.Filters.Sepia, Konva.Filters.Contrast, Konva.Filters.Brighten],
    config: {
      contrast: 0.1,
      brightness: 0.05
    }
  },
  'vintage-mint': {
    filters: [Konva.Filters.HSL, Konva.Filters.Contrast],
    config: {
      hue: 140,
      saturation: -0.4,
      luminance: 0.1,
      contrast: 0.1
    }
  },
  midnight: {
    filters: [Konva.Filters.Invert, Konva.Filters.HSL, Konva.Filters.Contrast],
    config: {
      hue: 180,
      saturation: 0,
      luminance: -0.1,
      contrast: 0.3
    }
  },
  ocean: {
    filters: [Konva.Filters.HSL, Konva.Filters.Contrast],
    config: {
      hue: 180,
      saturation: 0.5,
      luminance: 0.1,
      contrast: 0.1
    }
  },
  forest: {
    filters: [Konva.Filters.HSL, Konva.Filters.Contrast],
    config: {
      hue: 80,
      saturation: 0.2,
      luminance: 0,
      contrast: 0.05
    }
  },
  sunset: {
    filters: [Konva.Filters.Sepia, Konva.Filters.HSL, Konva.Filters.Contrast],
    config: {
      hue: -20,
      saturation: 0.8,
      luminance: 0,
      contrast: 0.1
    }
  },
  arctic: {
    filters: [Konva.Filters.HSL, Konva.Filters.Brighten, Konva.Filters.Contrast],
    config: {
      hue: 190,
      saturation: -0.2,
      luminance: 0.2,
      brightness: 0.2,
      contrast: 0.1
    }
  },
  avocado: {
    filters: [Konva.Filters.HSL, Konva.Filters.Sepia, Konva.Filters.Contrast, Konva.Filters.Brighten],
    config: {
      hue: 60,
      saturation: 0.4,
      luminance: 0.15,
      contrast: 0.1,
      brightness: 0.15
    }
  }
};

// Frame clipping paths for different styles
export const MPG_KONVA_FRAME_CLIPS = {
  circle: (width: number, height: number) => {
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    
    return {
      x: centerX - radius,
      y: centerY - radius,
      width: radius * 2,
      height: radius * 2,
      clipFunc: (ctx: any) => {
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
      }
    };
  },
  square: (width: number, height: number) => {
    return {
      x: 0,
      y: 0,
      width,
      height,
      clipFunc: null // No clipping needed for square
    };
  },
  heart: (width: number, height: number) => {
    const size = Math.min(width, height);
    const scale = size / 375; // Original SVG viewBox is 375x375
    const offsetX = (width - size) / 2;
    const offsetY = (height - size) / 2;
    
    return {
      x: 0,
      y: 0,
      width,
      height,
      clipFunc: (ctx: any) => {
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        
        // Heart path based on the SVG - simplified version for better rendering
        ctx.beginPath();
        
        // Start from bottom point
        ctx.moveTo(187.5, 337);
        
        // Left side of heart
        ctx.bezierCurveTo(
          70, 280,  // control point 1
          22, 200,  // control point 2
          22, 133   // end point
        );
        
        // Left lobe
        ctx.bezierCurveTo(
          22, 80,    // control point 1
          65, 44,    // control point 2
          113, 44    // end point
        );
        
        ctx.bezierCurveTo(
          140, 44,   // control point 1
          165, 55,   // control point 2
          187.5, 88  // end point (center dip)
        );
        
        // Right lobe from center
        ctx.bezierCurveTo(
          210, 55,   // control point 1
          235, 44,   // control point 2
          262, 44    // end point
        );
        
        ctx.bezierCurveTo(
          310, 44,   // control point 1
          353, 80,   // control point 2
          353, 133   // end point
        );
        
        // Right side down to bottom
        ctx.bezierCurveTo(
          353, 200,  // control point 1
          305, 280,  // control point 2
          187.5, 337 // end point (bottom)
        );
        
        ctx.closePath();
        ctx.restore();
      }
    };
  },
  house: (width: number, height: number) => {
    const size = Math.min(width, height);
    const scale = (size / 375) * 1.3; // Original SVG viewBox is 375x375, scaled up by 30%
    const scaledSize = 375 * scale;
    const offsetX = (width - scaledSize) / 2;
    const offsetY = (height - scaledSize) / 2;
    
    return {
      x: 0,
      y: 0,
      width,
      height,
      clipFunc: (ctx: any) => {
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        
        // House path based on the SVG
        ctx.beginPath();
        
        // Start from bottom left
        ctx.moveTo(59.57, 317.63);
        
        // Bottom right
        ctx.lineTo(315.66, 317.63);
        
        // Right wall up to roof start
        ctx.lineTo(315.66, 141.57);
        
        // Right roof edge
        ctx.lineTo(332.43, 152.27);
        ctx.lineTo(344.30, 133.71);
        
        // Roof peak (with chimney cutout)
        ctx.lineTo(266, 82);  // Before chimney
        
        // Chimney
        ctx.lineTo(266, 65);   // Chimney left
        ctx.lineTo(290, 65);   // Chimney top
        ctx.lineTo(290, 90);   // Chimney right
        
        // Continue roof to peak
        ctx.lineTo(189.34, 34.87);
        
        // Down the left side of roof
        ctx.lineTo(108.79, 84.04);
        
        // Small left wall section (garage/extension)
        ctx.lineTo(108.79, 67.89);
        ctx.lineTo(68.98, 67.89);
        ctx.lineTo(68.98, 109.43);
        
        // Left roof edge
        ctx.lineTo(30.93, 133.71);
        ctx.lineTo(42.80, 152.27);
        ctx.lineTo(59.57, 141.57);
        
        // Back to start
        ctx.closePath();
        
        ctx.restore();
      }
    };
  }
};

// Font configurations
export const MPG_KONVA_FONTS = {
  title: {
    playfair: { family: 'Playfair Display', weight: 400, googleFont: true },
    montserrat: { family: 'Montserrat', weight: 700, googleFont: true },
    bebas: { family: 'Bebas Neue', weight: 400, googleFont: true },
    roboto: { family: 'Roboto', weight: 700, googleFont: true },
    lato: { family: 'Lato', weight: 700, googleFont: true },
    oswald: { family: 'Oswald', weight: 600, googleFont: true }
  },
  body: {
    roboto: { family: 'Roboto', weight: 400, googleFont: true },
    montserrat: { family: 'Montserrat', weight: 400, googleFont: true },
    lato: { family: 'Lato', weight: 400, googleFont: true },
    opensans: { family: 'Open Sans', weight: 400, googleFont: true }
  }
};

// Background color presets
export const MPG_LIGHT_BACKGROUNDS = {
  'pure-white': { bg: '#FFFFFF', text: '#333333', name: 'Pure White' },
  'soft-cream': { bg: '#FFF8F0', text: '#333333', name: 'Soft Cream' },
  'pearl-gray': { bg: '#F8F8F8', text: '#333333', name: 'Pearl Gray' },
  'vanilla': { bg: '#FFF5E6', text: '#333333', name: 'Vanilla' },
  'sky-blue': { bg: '#E6F3FF', text: '#333333', name: 'Sky Blue' },
  'mint-green': { bg: '#F0FFF0', text: '#333333', name: 'Mint Green' },
  'blush-pink': { bg: '#FFE4E1', text: '#333333', name: 'Blush Pink' },
  'lavender': { bg: '#F8F0FF', text: '#333333', name: 'Lavender' },
  'lemon': { bg: '#FFFACD', text: '#333333', name: 'Lemon' },
  'sage': { bg: '#F0F8F0', text: '#333333', name: 'Sage' }
};

export const MPG_DARK_BACKGROUNDS = {
  'midnight-black': { bg: '#000000', text: '#FFFFFF', name: 'Midnight Black' },
  'charcoal': { bg: '#1A1A1A', text: '#FFFFFF', name: 'Charcoal' },
  'navy-blue': { bg: '#000033', text: '#FFFFFF', name: 'Navy Blue' },
  'forest-green': { bg: '#0D2818', text: '#FFFFFF', name: 'Forest Green' },
  'deep-purple': { bg: '#1A0033', text: '#FFFFFF', name: 'Deep Purple' },
  'wine': { bg: '#4B0000', text: '#FFFFFF', name: 'Wine' },
  'slate-gray': { bg: '#2F2F2F', text: '#FFFFFF', name: 'Slate Gray' },
  'ocean-deep': { bg: '#003366', text: '#FFFFFF', name: 'Ocean Deep' },
  'coffee': { bg: '#3B2F2F', text: '#FFFFFF', name: 'Coffee' },
  'ink-blue': { bg: '#191970', text: '#FFFFFF', name: 'Ink Blue' }
};

// Combined backgrounds for easy access
export const MPG_BACKGROUND_PRESETS = {
  ...MPG_LIGHT_BACKGROUNDS,
  ...MPG_DARK_BACKGROUNDS
};

// Helper function to determine if a color is light or dark
export function isLightColor(hex: string): boolean {
  // Remove # if present
  const color = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
}

// Color schemes for different styles
export const MPG_KONVA_COLOR_SCHEMES = {
  minimal: {
    background: '#ffffff',
    text: '#333333',
    coordinates: '#888888',
    country: '#666666'
  },
  'vintage-pink': {
    background: '#fff5f5',
    text: '#8b3a3a',
    coordinates: '#cd5c5c',
    country: '#bc8f8f'
  },
  'middle-blue': {
    background: '#f0f8ff',
    text: '#1e3a5f',
    coordinates: '#4682b4',
    country: '#5f9ea0'
  },
  sandstone: {
    background: '#fdf5e6',
    text: '#8b7355',
    coordinates: '#a0826d',
    country: '#bc9a6a'
  },
  'vintage-blue': {
    background: '#f0f8ff',
    text: '#2c3e50',
    coordinates: '#34495e',
    country: '#5d6d7e'
  },
  atlas: {
    background: '#fafaf0',
    text: '#4a4a4a',
    coordinates: '#6a6a6a',
    country: '#7a7a7a'
  },
  'vintage-mint': {
    background: '#f0fff0',
    text: '#2e7d32',
    coordinates: '#388e3c',
    country: '#43a047'
  },
  midnight: {
    background: '#1a1a1a',
    text: '#ffffff',
    coordinates: '#cccccc',
    country: '#aaaaaa'
  },
  ocean: {
    background: '#e6f3ff',
    text: '#0066cc',
    coordinates: '#0088ff',
    country: '#3399ff'
  },
  forest: {
    background: '#f0fff0',
    text: '#2d5016',
    coordinates: '#3d6826',
    country: '#4d7c36'
  },
  sunset: {
    background: '#fff5ee',
    text: '#ff6b35',
    coordinates: '#ff8c42',
    country: '#ffa500'
  },
  arctic: {
    background: '#f0ffff',
    text: '#4682b4',
    coordinates: '#5f9ea0',
    country: '#87ceeb'
  },
  avocado: {
    background: '#f5f9f0',
    text: '#495421',
    coordinates: '#769E72',
    country: '#5B5B3F'
  }
};

// Animation settings
export const MPG_KONVA_ANIMATIONS = {
  fadeIn: {
    duration: 0.3,
    easing: Konva.Easings.EaseInOut
  },
  scaleIn: {
    duration: 0.4,
    easing: Konva.Easings.ElasticEaseOut
  }
};

// Glow effect configurations - Premium color glows with strong intensity
export const MPG_KONVA_GLOW_EFFECTS = {
  silverGrey: {
    name: 'Silver Grey',
    color: '#c0c0c0',
    cssGlow: '0 0 25px #c0c0c0, 0 0 50px #a8a8a8, 0 0 75px rgba(192, 192, 192, 0.8)',
    layers: [
      { blur: 25, color: '#c0c0c0' },
      { blur: 50, color: '#a8a8a8' },
      { blur: 75, color: 'rgba(192, 192, 192, 0.8)' },
      { blur: 100, color: 'rgba(168, 168, 168, 0.6)' },
      { blur: 125, color: 'rgba(128, 128, 128, 0.4)' },
      { blur: 150, color: 'rgba(128, 128, 128, 0.2)' }
    ]
  },
  turquoise: {
    name: 'Turquoise',
    color: '#40e0d0',
    cssGlow: '0 0 20px #40e0d0, 0 0 40px #40e0d0, 0 0 60px #48d1cc',
    layers: [
      { blur: 20, color: '#40e0d0' },
      { blur: 40, color: '#40e0d0' },
      { blur: 60, color: '#48d1cc' },
      { blur: 80, color: 'rgba(64, 224, 208, 0.7)' },
      { blur: 110, color: 'rgba(72, 209, 204, 0.5)' },
      { blur: 140, color: 'rgba(64, 224, 208, 0.3)' }
    ]
  },
  lavender: {
    name: 'Lavender',
    color: '#e6e6fa',
    cssGlow: '0 0 25px #e6e6fa, 0 0 50px #dda0dd, 0 0 75px #b19cd9',
    layers: [
      { blur: 25, color: '#e6e6fa' },
      { blur: 50, color: '#dda0dd' },
      { blur: 75, color: '#b19cd9' },
      { blur: 100, color: 'rgba(230, 230, 250, 0.7)' },
      { blur: 125, color: 'rgba(177, 156, 217, 0.5)' },
      { blur: 150, color: 'rgba(221, 160, 221, 0.3)' }
    ]
  },
  royalBlue: {
    name: 'Royal Blue',
    color: '#4169e1',
    cssGlow: '0 0 30px #4169e1, 0 0 60px #4169e1, 0 0 90px rgba(65, 105, 225, 0.8)',
    layers: [
      { blur: 30, color: '#4169e1' },
      { blur: 60, color: '#4169e1' },
      { blur: 90, color: 'rgba(65, 105, 225, 0.8)' },
      { blur: 120, color: 'rgba(65, 105, 225, 0.6)' },
      { blur: 150, color: 'rgba(65, 105, 225, 0.4)' },
      { blur: 180, color: 'rgba(65, 105, 225, 0.2)' }
    ]
  },
  forestGreen: {
    name: 'Forest Green',
    color: '#228b22',
    cssGlow: '0 0 25px #228b22, 0 0 50px #228b22, 0 0 75px #2e8b57',
    layers: [
      { blur: 25, color: '#228b22' },
      { blur: 50, color: '#228b22' },
      { blur: 75, color: '#2e8b57' },
      { blur: 100, color: 'rgba(34, 139, 34, 0.7)' },
      { blur: 130, color: 'rgba(46, 139, 87, 0.5)' },
      { blur: 160, color: 'rgba(34, 139, 34, 0.3)' }
    ]
  },
  amber: {
    name: 'Amber',
    color: '#ffbf00',
    cssGlow: '0 0 20px #ffbf00, 0 0 40px #ffc107, 0 0 60px #ffb300',
    layers: [
      { blur: 20, color: '#ffbf00' },
      { blur: 40, color: '#ffc107' },
      { blur: 60, color: '#ffb300' },
      { blur: 80, color: 'rgba(255, 191, 0, 0.7)' },
      { blur: 110, color: 'rgba(255, 193, 7, 0.5)' },
      { blur: 140, color: 'rgba(255, 179, 0, 0.3)' }
    ]
  },
  rosePink: {
    name: 'Rose Pink',
    color: '#ff69b4',
    cssGlow: '0 0 30px #ff69b4, 0 0 60px #ff1493, 0 0 90px rgba(255, 105, 180, 0.8)',
    layers: [
      { blur: 30, color: '#ff69b4' },
      { blur: 60, color: '#ff1493' },
      { blur: 90, color: 'rgba(255, 105, 180, 0.8)' },
      { blur: 120, color: 'rgba(255, 20, 147, 0.6)' },
      { blur: 150, color: 'rgba(255, 105, 180, 0.4)' },
      { blur: 180, color: 'rgba(255, 20, 147, 0.2)' }
    ]
  },
  coral: {
    name: 'Coral',
    color: '#ff7f50',
    cssGlow: '0 0 25px #ff7f50, 0 0 50px #ff6347, 0 0 75px rgba(255, 127, 80, 0.8)',
    layers: [
      { blur: 25, color: '#ff7f50' },
      { blur: 50, color: '#ff6347' },
      { blur: 75, color: 'rgba(255, 127, 80, 0.8)' },
      { blur: 100, color: 'rgba(255, 99, 71, 0.6)' },
      { blur: 125, color: 'rgba(255, 127, 80, 0.4)' },
      { blur: 150, color: 'rgba(255, 99, 71, 0.2)' }
    ]
  },
  deepViolet: {
    name: 'Deep Violet',
    color: '#9400d3',
    cssGlow: '0 0 30px #9400d3, 0 0 60px #8b008b, 0 0 90px rgba(148, 0, 211, 0.8)',
    layers: [
      { blur: 30, color: '#9400d3' },
      { blur: 60, color: '#8b008b' },
      { blur: 90, color: 'rgba(148, 0, 211, 0.8)' },
      { blur: 120, color: 'rgba(139, 0, 139, 0.6)' },
      { blur: 150, color: 'rgba(148, 0, 211, 0.4)' },
      { blur: 180, color: 'rgba(139, 0, 139, 0.2)' }
    ]
  },
  teal: {
    name: 'Teal',
    color: '#008080',
    cssGlow: '0 0 25px #008080, 0 0 50px #20b2aa, 0 0 75px rgba(0, 128, 128, 0.8)',
    layers: [
      { blur: 25, color: '#008080' },
      { blur: 50, color: '#20b2aa' },
      { blur: 75, color: 'rgba(0, 128, 128, 0.8)' },
      { blur: 100, color: 'rgba(32, 178, 170, 0.6)' },
      { blur: 130, color: 'rgba(0, 128, 128, 0.4)' },
      { blur: 160, color: 'rgba(32, 178, 170, 0.2)' }
    ]
  },
  emerald: {
    name: 'Emerald',
    color: '#50C878',
    cssGlow: '0 0 25px #50C878, 0 0 50px #3CB371, 0 0 75px rgba(80, 200, 120, 0.8)',
    layers: [
      { blur: 25, color: '#50C878' },
      { blur: 50, color: '#3CB371' },
      { blur: 75, color: 'rgba(80, 200, 120, 0.8)' },
      { blur: 100, color: 'rgba(60, 179, 113, 0.6)' },
      { blur: 130, color: 'rgba(80, 200, 120, 0.4)' },
      { blur: 160, color: 'rgba(60, 179, 113, 0.2)' }
    ]
  },
  crimson: {
    name: 'Crimson',
    color: '#DC143C',
    cssGlow: '0 0 30px #DC143C, 0 0 60px #B22222, 0 0 90px rgba(220, 20, 60, 0.8)',
    layers: [
      { blur: 30, color: '#DC143C' },
      { blur: 60, color: '#B22222' },
      { blur: 90, color: 'rgba(220, 20, 60, 0.8)' },
      { blur: 120, color: 'rgba(178, 34, 34, 0.6)' },
      { blur: 150, color: 'rgba(220, 20, 60, 0.4)' },
      { blur: 180, color: 'rgba(178, 34, 34, 0.2)' }
    ]
  },
  sunsetOrange: {
    name: 'Sunset',
    color: '#FF8C00',
    cssGlow: '0 0 25px #FF8C00, 0 0 50px #FF7F50, 0 0 75px rgba(255, 140, 0, 0.8)',
    layers: [
      { blur: 25, color: '#FF8C00' },
      { blur: 50, color: '#FF7F50' },
      { blur: 75, color: 'rgba(255, 140, 0, 0.8)' },
      { blur: 100, color: 'rgba(255, 127, 80, 0.6)' },
      { blur: 130, color: 'rgba(255, 140, 0, 0.4)' },
      { blur: 160, color: 'rgba(255, 127, 80, 0.2)' }
    ]
  },
  electricBlue: {
    name: 'Electric',
    color: '#00BFFF',
    cssGlow: '0 0 30px #00BFFF, 0 0 60px #00CED1, 0 0 90px rgba(0, 191, 255, 0.8)',
    layers: [
      { blur: 30, color: '#00BFFF' },
      { blur: 60, color: '#00CED1' },
      { blur: 90, color: 'rgba(0, 191, 255, 0.8)' },
      { blur: 120, color: 'rgba(0, 206, 209, 0.6)' },
      { blur: 150, color: 'rgba(0, 191, 255, 0.4)' },
      { blur: 180, color: 'rgba(0, 206, 209, 0.2)' }
    ]
  },
  limeGreen: {
    name: 'Lime',
    color: '#32CD32',
    cssGlow: '0 0 25px #32CD32, 0 0 50px #00FF00, 0 0 75px rgba(50, 205, 50, 0.8)',
    layers: [
      { blur: 25, color: '#32CD32' },
      { blur: 50, color: '#00FF00' },
      { blur: 75, color: 'rgba(50, 205, 50, 0.8)' },
      { blur: 100, color: 'rgba(0, 255, 0, 0.6)' },
      { blur: 130, color: 'rgba(50, 205, 50, 0.4)' },
      { blur: 160, color: 'rgba(0, 255, 0, 0.2)' }
    ]
  },
  silverGradient: {
    name: 'Silver Glow',
    color: '#C0C0C0',
    cssGlow: '0 0 30px #E5E5E5, 0 0 60px #C0C0C0, 0 0 90px #808080',
    layers: [
      { blur: 30, color: '#E5E5E5' },
      { blur: 60, color: '#C0C0C0' },
      { blur: 90, color: '#808080' },
      { blur: 120, color: 'rgba(192, 192, 192, 0.6)' },
      { blur: 150, color: 'rgba(128, 128, 128, 0.4)' },
      { blur: 180, color: 'rgba(169, 169, 169, 0.2)' }
    ]
  }
};

// Export quality settings
export const MPG_KONVA_EXPORT_SETTINGS = {
  pixelRatio: 2, // For high-DPI exports
  mimeType: {
    png: 'image/png',
    jpg: 'image/jpeg'
  },
  quality: {
    png: 1,
    jpg: 0.95
  }
};