/**
 * Comprehensive Font Loading Configuration for MPG
 * Maps font families to their local files and Google Fonts fallbacks
 */

export interface FontConfig {
  family: string;
  localFile?: string; // Path to local font file (relative to public/)
  googleFont?: string; // Google Fonts URL
  weights?: number[]; // Available weights
  format?: 'woff2' | 'truetype'; // Font format
}

/**
 * Complete font configuration mapping
 * - Uses local files first for better performance
 * - Falls back to Google Fonts if local file is missing/empty
 */
export const MPG_FONT_CONFIG: Record<string, FontConfig> = {
  // Modern Sans-Serif
  'Montserrat': {
    family: 'Montserrat',
    localFile: '/mpg/fonts/Montserrat-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
    weights: [400, 500, 600, 700],
    format: 'truetype'
  },
  'Raleway': {
    family: 'Raleway',
    googleFont: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap',
    weights: [300, 400, 500, 600, 700]
  },
  'Roboto': {
    family: 'Roboto',
    localFile: '/mpg/fonts/roboto-400.woff2',
    googleFont: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
    weights: [400, 500, 700],
    format: 'woff2'
  },
  'Lato': {
    family: 'Lato',
    googleFont: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap',
    weights: [400, 700, 900]
  },
  'Oswald': {
    family: 'Oswald',
    googleFont: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap',
    weights: [400, 500, 600, 700]
  },

  // Display & Impact
  'Bebas Neue': {
    family: 'Bebas Neue',
    localFile: '/mpg/fonts/BebasNeue-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    format: 'truetype'
  },
  'Anton': {
    family: 'Anton',
    localFile: '/mpg/fonts/Anton-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Anton&display=swap',
    format: 'truetype'
  },
  'Archivo Black': {
    family: 'Archivo Black',
    localFile: '/mpg/fonts/ArchivoBlack-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap',
    format: 'truetype'
  },
  'Ultra': {
    family: 'Ultra',
    localFile: '/mpg/fonts/Ultra-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Ultra&display=swap',
    format: 'truetype'
  },
  'Titan One': {
    family: 'Titan One',
    localFile: '/mpg/fonts/TitanOne-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Titan+One&display=swap',
    format: 'truetype'
  },
  'Fredoka One': {
    family: 'Fredoka One',
    localFile: '/mpg/fonts/FredokaOne-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap',
    format: 'truetype'
  },
  'Righteous': {
    family: 'Righteous',
    localFile: '/mpg/fonts/Righteous-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap',
    format: 'truetype'
  },
  'Bungee': {
    family: 'Bungee',
    localFile: '/mpg/fonts/Bungee-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Bungee&display=swap',
    format: 'truetype'
  },
  'Black Ops One': {
    family: 'Black Ops One',
    localFile: '/mpg/fonts/BlackOpsOne-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap',
    format: 'truetype'
  },

  // Tech & Gaming
  'Orbitron': {
    family: 'Orbitron',
    localFile: '/mpg/fonts/Orbitron-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap',
    format: 'truetype'
  },
  'Russo One': {
    family: 'Russo One',
    localFile: '/mpg/fonts/RussoOne-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Russo+One&display=swap',
    format: 'truetype'
  },
  'Press Start 2P': {
    family: 'Press Start 2P',
    localFile: '/mpg/fonts/PressStart2P-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
    format: 'truetype'
  },

  // Elegant Serif
  'Playfair Display': {
    family: 'Playfair Display',
    localFile: '/mpg/fonts/playfair-display-400.woff2',
    googleFont: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
    weights: [400, 500, 600, 700],
    format: 'woff2'
  },

  // Script & Handwritten
  'Pacifico': {
    family: 'Pacifico',
    localFile: '/mpg/fonts/Pacifico-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
    format: 'truetype'
  },
  'Lobster': {
    family: 'Lobster',
    localFile: '/mpg/fonts/Lobster-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Lobster&display=swap',
    format: 'truetype'
  },
  'Dancing Script': {
    family: 'Dancing Script',
    localFile: '/mpg/fonts/DancingScript-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap',
    format: 'truetype'
  },
  'Kaushan Script': {
    family: 'Kaushan Script',
    localFile: '/mpg/fonts/KaushanScript-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap',
    format: 'truetype'
  },
  'Satisfy': {
    family: 'Satisfy',
    localFile: '/mpg/fonts/satisfy-400.woff2',
    googleFont: 'https://fonts.googleapis.com/css2?family=Satisfy&display=swap',
    format: 'woff2'
  },
  'Caveat': {
    family: 'Caveat',
    localFile: '/mpg/fonts/Caveat-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap',
    format: 'truetype'
  },
  'Courgette': {
    family: 'Courgette',
    localFile: '/mpg/fonts/Courgette-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Courgette&display=swap',
    format: 'truetype'
  },
  'Yellowtail': {
    family: 'Yellowtail',
    localFile: '/mpg/fonts/Yellowtail-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Yellowtail&display=swap',
    format: 'truetype'
  },
  'Alex Brush': {
    family: 'Alex Brush',
    localFile: '/mpg/fonts/AlexBrush-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap',
    format: 'truetype'
  },
  'Sacramento': {
    family: 'Sacramento',
    localFile: '/mpg/fonts/Sacramento-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Sacramento&display=swap',
    format: 'truetype'
  },
  'Cookie': {
    family: 'Cookie',
    localFile: '/mpg/fonts/Cookie-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Cookie&display=swap',
    format: 'truetype'
  },
  'Tangerine': {
    family: 'Tangerine',
    localFile: '/mpg/fonts/TangeriNE-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap',
    format: 'truetype'
  },
  'Pinyon Script': {
    family: 'Pinyon Script',
    localFile: '/mpg/fonts/PinyonScript-Regular.ttf',
    googleFont: 'https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap',
    format: 'truetype'
  },
  'Great Vibes': {
    family: 'Great Vibes',
    localFile: '/mpg/fonts/great-vibes-400.woff2',
    googleFont: 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
    format: 'woff2'
  },
  'Allura': {
    family: 'Allura',
    localFile: '/mpg/fonts/allura-400.woff2',
    googleFont: 'https://fonts.googleapis.com/css2?family=Allura&display=swap',
    format: 'woff2'
  },

  // Fun & Playful
  'Amatic SC': {
    family: 'Amatic SC',
    localFile: '/mpg/fonts/amatic-sc-400.woff2',
    googleFont: 'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap',
    weights: [400, 700],
    format: 'woff2'
  },
  'Kalam': {
    family: 'Kalam',
    localFile: '/mpg/fonts/kalam-400.woff2',
    googleFont: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap',
    weights: [300, 400, 700],
    format: 'woff2'
  },

  // Additional fonts used in wizard
  'Open Sans': {
    family: 'Open Sans',
    googleFont: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap',
    weights: [400, 600]
  }
};

/**
 * Load a font dynamically - tries local file first, falls back to Google Fonts
 */
export async function loadFont(fontFamily: string): Promise<boolean> {
  const config = MPG_FONT_CONFIG[fontFamily];

  if (!config) {
    console.warn(`Font configuration not found for: ${fontFamily}`);
    return false;
  }

  const fontId = fontFamily.replace(/ /g, '-').toLowerCase();
  const linkId = `mpg-font-${fontId}`;

  // Check if already loaded
  if (document.getElementById(linkId)) {
    return true;
  }

  try {
    // Try local file first
    if (config.localFile) {
      const style = document.createElement('style');
      style.id = linkId;
      style.textContent = `
        @font-face {
          font-family: '${config.family}';
          src: url('${config.localFile}') format('${config.format || 'woff2'}');
          font-weight: ${config.weights?.[0] || 400};
          font-style: normal;
          font-display: swap;
        }
      `;
      document.head.appendChild(style);

      // Try to load the font to verify it exists
      try {
        await document.fonts.load(`${config.weights?.[0] || 400} 16px "${config.family}"`);
        return true;
      } catch (e) {
        // Local file failed, remove style and try Google Fonts
        console.warn(`Local font file failed for ${fontFamily}, trying Google Fonts`);
        style.remove();
      }
    }

    // Use Google Fonts as fallback
    if (config.googleFont) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = config.googleFont;
      document.head.appendChild(link);

      // Wait for font to load
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Failed to load font ${fontFamily}:`, error);
    return false;
  }
}

/**
 * Load multiple fonts in parallel
 */
export async function loadFonts(fontFamilies: string[]): Promise<void> {
  const uniqueFonts = Array.from(new Set(fontFamilies)).filter(Boolean);
  await Promise.all(uniqueFonts.map(font => loadFont(font)));
}

/**
 * Get font family with fallbacks for Konva rendering
 */
export function getFontFamilyWithFallback(fontFamily: string): string {
  const config = MPG_FONT_CONFIG[fontFamily];

  if (!config) {
    return `${fontFamily}, sans-serif`;
  }

  // Determine appropriate fallback based on font type
  const family = config.family;

  // Script fonts
  if (['Pacifico', 'Lobster', 'Dancing Script', 'Kaushan Script', 'Sacramento',
       'Yellowtail', 'Alex Brush', 'Cookie', 'Pinyon Script', 'Great Vibes',
       'Allura', 'Satisfy', 'Caveat', 'Courgette'].includes(family)) {
    return `${family}, cursive, serif`;
  }

  // Serif fonts
  if (['Playfair Display'].includes(family)) {
    return `${family}, serif`;
  }

  // Monospace fonts
  if (['Press Start 2P'].includes(family)) {
    return `${family}, monospace`;
  }

  // Default to sans-serif
  return `${family}, sans-serif`;
}
