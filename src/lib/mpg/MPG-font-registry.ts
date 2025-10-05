/**
 * Centralized Font Registry
 * Manages fonts across all projects in the application
 */

export type FontFormat = 'woff2' | 'woff' | 'truetype' | 'opentype';

export interface FontInfo {
  file: string;
  format: FontFormat;
  weight?: string;
  style?: 'normal' | 'italic';
  project?: string[]; // Which projects use this font
}

export interface FontFamily {
  [weight: string]: FontInfo;
}

// Centralized font registry - all fonts available in the application
export const FONT_REGISTRY: Record<string, FontFamily> = {
  // Script/Decorative Fonts
  'Pinyon Script': {
    '400': { file: 'PinyonScript-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Great Vibes': {
    '400': { file: 'great-vibes-400.woff2', format: 'woff2', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Dancing Script': {
    '400': { file: 'DancingScript-Regular.ttf', format: 'truetype', project: ['melody-ring', 'family-name', 'vinyl-song', 'lyrical-poster'] },
    '700': { file: 'dancing-script-700.woff2', format: 'woff2', project: ['family-name'] }
  },
  'Pacifico': {
    '400': { file: 'Pacifico-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Allura': {
    '400': { file: 'allura-400.woff2', format: 'woff2', project: ['melody-ring', 'vinyl-song', 'lyrical-poster', 'heart-calendar'] }
  },
  'Cookie': {
    '400': { file: 'Cookie-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Satisfy': {
    '400': { file: 'satisfy-400.woff2', format: 'woff2', project: ['melody-ring', 'family-name', 'vinyl-song', 'lyrical-poster'] }
  },
  'Sacramento': {
    '400': { file: 'Sacramento-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Tangerine': {
    '400': { file: 'TangeriNE-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] },
    '700': { file: 'TangeriNE-Bold.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Alex Brush': {
    '400': { file: 'AlexBrush-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Amatic SC': {
    '400': { file: 'amatic-sc-400.woff2', format: 'woff2', project: ['melody-ring'] },
    '700': { file: 'AmaticSC-Bold.ttf', format: 'truetype', project: ['melody-ring'] }
  },
  'Kalam': {
    '400': { file: 'kalam-400.woff2', format: 'woff2', project: ['melody-ring', 'vinyl-song'] }
  },
  
  // Sans-serif Fonts
  'Roboto': {
    '400': { file: 'roboto-400.woff2', format: 'woff2', project: ['melody-ring', 'vinyl-song'] },
    '500': { file: 'roboto-500.woff2', format: 'woff2', project: ['melody-ring', 'vinyl-song'] },
    '700': { file: 'roboto-700.woff2', format: 'woff2', project: ['melody-ring', 'vinyl-song'] },
    '400italic': { file: 'roboto-400-italic.woff2', format: 'woff2', style: 'italic', project: ['melody-ring'] }
  },
  'Raleway': {
    '300': { file: 'raleway-300.woff2', format: 'woff2', project: ['vinyl-song'] },
    '400': { file: 'raleway-400.woff2', format: 'woff2', project: ['vinyl-song'] },
    '500': { file: 'raleway-500.woff2', format: 'woff2', project: ['vinyl-song'] },
    '700': { file: 'raleway-700.woff2', format: 'woff2', project: ['vinyl-song'] }
  },
  'Lato': {
    '500': { file: 'lato-500.woff2', format: 'woff2', project: ['vinyl-song'] }
  },
  'Lora': {
    '400': { file: 'lora-400.woff2', format: 'woff2', project: ['heart-calendar'] },
    '700': { file: 'lora-700.woff2', format: 'woff2', project: ['heart-calendar'] }
  },
  'Oswald': {
    '700': { file: 'oswald-700.woff2', format: 'woff2', project: ['vinyl-song'] },
    '800': { file: 'oswald-800.woff2', format: 'woff2', project: ['family-name'] }
  },
  'Anton': {
    '400': { file: 'Anton-Regular.ttf', format: 'truetype', project: ['family-name', 'melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Bebas Neue': {
    '400': { file: 'BebasNeue-Regular.ttf', format: 'truetype', project: ['family-name', 'melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Ultra': {
    '400': { file: 'Ultra-Regular.ttf', format: 'truetype', project: ['family-name', 'melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  
  // Serif Fonts
  'Playfair Display': {
    '400': { file: 'playfair-display-400.woff2', format: 'woff2', project: ['melody-ring', 'vinyl-song', 'lyrical-poster', 'heart-calendar'] },
    '500': { file: 'playfair-display-500.woff2', format: 'woff2', project: ['vinyl-song'] },
    '700': { file: 'playfair-display-700.woff2', format: 'woff2', project: ['melody-ring', 'lyrical-poster', 'heart-calendar'] }
  },
  'Georgia': {
    '400': { file: 'playfair-display-400.woff2', format: 'woff2', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }, // Using Playfair as fallback
    '700': { file: 'playfair-display-700.woff2', format: 'woff2', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  
  // Display Fonts
  'Archivo Black': {
    '400': { file: 'ArchivoBlack-Regular.ttf', format: 'truetype', project: ['vinyl-song', 'melody-ring'] }
  },
  'Caveat': {
    '400': { file: 'Caveat-Regular.ttf', format: 'truetype', project: ['vinyl-song'] }
  },
  
  // New Headline Fonts for Melody Ring
  'Righteous': {
    '400': { file: 'Righteous-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Fredoka One': {
    '400': { file: 'FredokaOne-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Bungee': {
    '400': { file: 'Bungee-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Russo One': {
    '400': { file: 'RussoOne-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Black Ops One': {
    '400': { file: 'BlackOpsOne-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Titan One': {
    '400': { file: 'TitanOne-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  
  // New Script Fonts for Melody Ring
  'Kaushan Script': {
    '400': { file: 'KaushanScript-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Courgette': {
    '400': { file: 'Courgette-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Lobster': {
    '400': { file: 'Lobster-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  'Yellowtail': {
    '400': { file: 'Yellowtail-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster'] }
  },
  
  // Additional Sans-serif
  'Montserrat': {
    '400': { file: 'Montserrat-Regular.ttf', format: 'truetype', project: ['melody-ring', 'vinyl-song', 'lyrical-poster', 'heart-calendar'] },
    '500': { file: 'Montserrat-500.woff2', format: 'woff2', project: ['vinyl-song', 'lyrical-poster'] },
    '700': { file: 'Montserrat-700.woff2', format: 'woff2', project: ['heart-calendar'] }
  }
};

/**
 * Get fonts for a specific project
 */
export function getFontsForProject(projectName: string): Record<string, FontFamily> {
  const projectFonts: Record<string, FontFamily> = {};
  
  Object.entries(FONT_REGISTRY).forEach(([fontFamily, weights]) => {
    const projectWeights: FontFamily = {};
    
    Object.entries(weights).forEach(([weight, info]) => {
      if (!info.project || info.project.includes(projectName)) {
        projectWeights[weight] = info;
      }
    });
    
    if (Object.keys(projectWeights).length > 0) {
      projectFonts[fontFamily] = projectWeights;
    }
  });
  
  return projectFonts;
}

/**
 * Check if a font file exists
 */
export async function fontFileExists(fontInfo: FontInfo): Promise<boolean> {
  try {
    const response = await fetch(`/fonts/${fontInfo.file}`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get all missing fonts
 */
export async function getMissingFonts(): Promise<string[]> {
  const missing: string[] = [];
  
  for (const [fontFamily, weights] of Object.entries(FONT_REGISTRY)) {
    for (const [weight, info] of Object.entries(weights)) {
      if (!await fontFileExists(info)) {
        missing.push(`${fontFamily} (${weight}): ${info.file}`);
      }
    }
  }
  
  return missing;
}