# WYSIWYG Font Implementation Guide for D3/Canvas Projects

## Overview
This guide explains how to achieve true WYSIWYG (What You See Is What You Get) font rendering when exporting D3.js SVG designs to PNG/JPG images. This is crucial for projects like Melody Ring, Vinyl Song, Map Poster Generator, and other text-heavy designs where custom fonts are essential.

## The Challenge
When converting SVG to Canvas/PNG, browsers block external resources (including Google Fonts) for security reasons. This causes fonts to fall back to default system fonts in exported images, breaking the WYSIWYG experience.

## Solution Architecture

### 1. Centralized Font Management
Create a centralized font system that all projects can share:

```
client/public/fonts/
├── Font1-Regular.ttf
├── Font2-Bold.woff2
└── ... (all project fonts)
```

### 2. Font Registry System
Create a font registry (`client/src/lib/fonts/font-registry.ts`):

```typescript
export interface FontInfo {
  file: string;
  format: 'woff2' | 'woff' | 'truetype' | 'opentype';
  weight?: string;
  style?: 'normal' | 'italic';
  project?: string[]; // Which projects use this font
}

export const FONT_REGISTRY: Record<string, FontFamily> = {
  'Font Name': {
    '400': { file: 'font-name.ttf', format: 'truetype', project: ['project1'] }
  }
};
```

### 3. Font Embedding for Export
For true WYSIWYG, fonts must be embedded as base64 data URLs in the SVG:

```typescript
// Convert font file to base64
async function fetchFontAsBase64(fontPath: string): Promise<string> {
  const response = await fetch(fontPath);
  const blob = await response.blob();
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}

// Embed in SVG
const fontFaceRule = `
@font-face {
  font-family: 'FontName';
  src: url(${base64Data}) format('truetype');
}`;
```

## Implementation Steps

### Step 1: Download and Store Fonts Locally

1. **Download fonts** from Google Fonts or other sources
2. **Support multiple formats**: TTF, WOFF2, WOFF, OTF
3. **Place in centralized location**: `client/public/fonts/`

**Important**: WOFF2 files are preferred (30-50% smaller), but TTF files are more universally compatible.

### Step 2: Create Font Embedder Utility

```typescript
// client/src/lib/[project]/font-embedder.ts
import { FONT_REGISTRY, getFontsForProject } from '@/lib/fonts/font-registry';

const FONT_FILE_MAP = getFontsForProject('your-project');

export async function generateEmbeddedFontCSS(fontFamilies: string[]): Promise<string> {
  const fontFaceRules: string[] = [];
  
  for (const fontFamily of fontFamilies) {
    const fontInfo = FONT_FILE_MAP[fontFamily];
    if (!fontInfo) continue;
    
    const base64Font = await fetchFontAsBase64(fontFamily);
    if (base64Font) {
      fontFaceRules.push(createFontFaceRule(fontFamily, base64Font));
    }
  }
  
  return fontFaceRules.join('\n');
}
```

### Step 3: Modify SVG Export Process

```typescript
// In your D3 preview component
exportSVG: async () => {
  const exportSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  
  // Set SVG attributes
  exportSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
  // Create style element with embedded fonts
  const defsElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  
  // Get fonts used in design
  const fontsToEmbed = [...new Set(getAllUsedFonts())];
  
  // Generate embedded font CSS
  const embeddedFontCSS = await generateEmbeddedFontCSS(fontsToEmbed);
  styleElement.textContent = embeddedFontCSS;
  
  defsElement.appendChild(styleElement);
  exportSvg.appendChild(defsElement);
  
  // Add SVG content
  // ... copy your D3 elements ...
  
  return new XMLSerializer().serializeToString(exportSvg);
}
```

### Step 4: Convert SVG to PNG with Proper Timing

```typescript
const handleExport = async () => {
  // Get SVG with embedded fonts
  const svgContent = await exportSVG();
  
  // Convert to base64 data URL (important for font security)
  const base64 = btoa(unescape(encodeURIComponent(svgContent)));
  const url = `data:image/svg+xml;base64,${base64}`;
  
  // Create image
  const img = new Image();
  img.onload = async () => {
    // Wait for fonts to render
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Draw to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // Convert to PNG
    canvas.toBlob((blob) => {
      // Download the image
    }, 'image/png');
  };
  
  img.src = url;
};
```

## Best Practices

### 1. Font Format Support
```typescript
function getMimeType(format: string): string {
  switch (format) {
    case 'woff2': return 'font/woff2';
    case 'woff': return 'font/woff';
    case 'truetype': return 'font/ttf';
    case 'opentype': return 'font/otf';
    default: return 'font/woff2';
  }
}
```

### 2. Font Loading Verification
- Always log font loading status
- Check if base64 conversion succeeded
- Verify font file sizes (corrupted fonts are often < 1KB)

### 3. Fallback Strategies
```typescript
// Hybrid approach: embed local fonts, import missing ones
if (localFontAvailable) {
  // Embed as base64
} else {
  // Add Google Fonts @import as fallback
  fontFaceRules.push(`@import url('https://fonts.googleapis.com/css2?family=${font}');`);
}
```

### 4. Performance Optimization
- Cache converted base64 fonts
- Preload commonly used fonts
- Only embed fonts actually used in the design

## Debugging Checklist

1. **Font Not Rendering in Export?**
   - Check browser console for font loading errors
   - Verify font file exists and is valid: `file /path/to/font.ttf`
   - Check if base64 conversion succeeded (log the length)
   - Ensure proper MIME type in data URL

2. **Font Not Showing in Live Preview?**
   - **TTF Font Issue**: TTF fonts need explicit `@font-face` CSS declarations
   - **Solution**: Add font declarations to `client/src/styles/fonts.css`:
     ```css
     @font-face {
       font-family: 'Font Name';
       src: url('/fonts/FontName-Regular.ttf') format('truetype');
       font-weight: 400;
       font-style: normal;
       font-display: swap;
     }
     ```
   - **Preloading Issue**: Ensure font is included in font preloading list
   - **Fallback Issue**: Check `getFontFallback()` function includes the font

3. **WOFF2 vs TTF Issues?**
   - Some WOFF2 files may have compatibility issues
   - Try downloading the TTF version as fallback
   - TTF files are larger but more compatible
   - **Critical**: TTF fonts MUST have CSS `@font-face` declarations to work in browsers

4. **Timing Issues?**
   - Increase wait time before canvas rendering
   - Use `document.fonts.load()` to ensure fonts are ready
   - Add multiple timing checkpoints

5. **Common Font Loading Problems:**
   - **Missing CSS Declaration**: Most TTF fonts need explicit CSS
   - **Incorrect Font Name**: Ensure font-family name matches exactly
   - **Missing from Preload**: Font not included in page font preloading
   - **Missing from Fallback**: Font not categorized in fallback function

## Testing Tools

### 1. Font Manager Page (`/font-manager`)
A comprehensive visual interface to manage and monitor fonts:

**Features:**
- Shows all fonts and their current status (available/missing)
- Displays font formats and file sizes
- Indicates which projects use each font
- Can generate download scripts for missing fonts
- Real-time font availability checking

**Usage:**
Visit `/font-manager` to:
- See all fonts in the registry and their status
- Check which fonts are missing and need to be downloaded
- Generate download scripts for batch font installation
- Verify font availability across all projects

### 2. Font Test Page (`/font-test`)
Test font rendering before export:
- Renders all project fonts to verify they load correctly
- Shows sample text in each font for visual verification
- Helps identify fonts that aren't loading properly
- Tests fonts specific to each project (e.g., Melody Ring fonts)

## Common Pitfalls to Avoid

1. **Don't use external font URLs in SVG** - They will be blocked
2. **Don't assume font names match filenames** - "Pinyon Script" vs "PinyonScript-Regular.ttf"
3. **Don't skip MIME type correction** - Wrong MIME types can cause silent failures
4. **Don't embed fonts synchronously** - Always use async/await for file operations

## Project-Specific Implementation

For each new project:

1. **Add fonts to registry** with project tags
2. **Create project-specific font embedder** if needed
3. **Test with Font Manager** to verify availability
4. **Export test images** with each font to confirm WYSIWYG

## Current Implementation Status (Updated January 6, 2025)

### Map Poster Generator Font System
The Map Poster Generator now features an extensive font system with 36 custom fonts:

**Font Categories:**
- **Modern Sans-Serif (5)**: Montserrat, Raleway, Roboto, Lato, Oswald
- **Display & Impact (9)**: Bebas Neue, Anton, Archivo Black, Ultra, Titan One, Fredoka One, Righteous, Bungee, Black Ops One
- **Tech & Gaming (3)**: Orbitron, Russo One, Press Start 2P
- **Elegant Serif (1)**: Playfair Display
- **Script & Handwritten (16)**: Pacifico, Lobster, Dancing Script, Kaushan Script, Satisfy, Caveat, Courgette, Yellowtail, Alex Brush, Sacramento, Cookie, Tangerine, Pinyon Script, Great Vibes, Allura
- **Fun & Playful (2)**: Amatic SC, Kalam

**Hybrid Loading System:**
- Local font files stored in `/client/public/fonts/`
- Automatic CDN fallback for empty or missing files
- Smart detection of file format (TTF, WOFF2)
- Unified loading function for all text sections

**Font Availability:**
- All 36 fonts available in Headlines, Location Details, and Custom Message sections
- Consistent font rendering across Konva canvas
- Proper font family mapping with fallback to 'Roboto'

### Font Management System
Our application now has a fully implemented centralized font management system with the following features:

**Multi-Format Support:**
- TTF (TrueType) - Most compatible format
- WOFF2 (Web Open Font Format 2) - Smallest file size
- WOFF (Web Open Font Format) - Good compatibility
- OTF (OpenType) - Advanced typography features

**Automatic MIME Type Detection:**
- Proper format handling for all supported font types
- Correct @font-face generation with appropriate format declarations
- Fallback handling for unsupported formats

**Project Integration:**

### Recent Font System Improvements (January 6, 2025)

#### 1. Major Font Expansion for Map Poster Generator
- **Increased headline fonts from 5 to 36** (620% increase)
- Organized fonts into 6 categories for better selection
- Categories include: Modern Sans-Serif, Display & Impact, Tech & Gaming, Elegant Serif, Script & Handwritten, Fun & Playful

#### 2. Hybrid Font Loading System
Implemented a smart hybrid approach for font loading:
- **Local files first**: Uses local font files when available
- **CDN fallback**: Falls back to Google Fonts CDN for empty/missing files
- **Example implementation**:
  ```typescript
  const headlineFontFiles: Record<string, string | null> = {
    'Montserrat': '/fonts/Montserrat-Regular.ttf',  // Local file
    'Raleway': null,  // Use Google Fonts (local file is empty)
    // ... more fonts
  };
  ```

#### 3. Font File Consolidation
- Moved all font files from root directory to `/client/public/fonts/`
- Cleaned up redundant Google Font links in `index.html`
- Reduced HTTP requests by eliminating duplicate font loading

#### 4. Handling Empty Font Files
Discovered and resolved issue with 0-byte .woff2 files:
- Identified empty files: Lato, Oswald, Raleway, and others
- Solution: Mark these as `null` in font registry to use CDN
- Ensures all fonts display with correct characteristics

#### 5. Font Categories for MPG Headlines
```typescript
// Modern Sans-Serif (Clean & Professional)
Montserrat, Raleway, Roboto, Lato, Oswald

// Display & Impact (Bold Statements)
Bebas Neue, Anton, Archivo Black, Ultra, Titan One, etc.

// Tech & Gaming (Modern Digital)
Orbitron, Russo One, Press Start 2P

// Elegant Serif (Classic & Sophisticated)
Playfair Display

// Script & Handwritten (Personal Touch) - 16 fonts
Pacifico, Lobster, Dancing Script, Kaushan Script, etc.

// Fun & Playful (Creative)
Amatic SC, Kalam
```

**Original Project Integration:**
- Font registry tracks which projects use which fonts
- Easy to add new fonts for existing or new projects
- Centralized location prevents font duplication

### Current Font Inventory

**Available Fonts (Ready to Use):**
- Great Vibes, Allura, Satisfy, Sacramento (Script fonts)
- Amatic SC, Kalam, Tangerine (Display fonts)
- Roboto (400, 500, 700 weights), Playfair Display (Sans/Serif)
- Pinyon Script, Cookie, Pacifico, Dancing Script, Alex Brush (Script fonts)
- Bebas Neue, Anton, Ultra, Righteous, Fredoka One (Headline fonts)
- Bungee, Russo One, Black Ops One, Titan One (Display fonts)
- Kaushan Script, Courgette, Lobster, Yellowtail (Script fonts)
- Montserrat (Sans-serif)

### Management Benefits

1. **Centralized Control**: All fonts in `client/public/fonts/`
2. **Multi-Project Support**: Share fonts across Melody Ring, Vinyl Song, etc.
3. **Format Flexibility**: Use the best format for each use case
4. **Development Tools**: Visual interfaces for font management and testing
5. **Easy Expansion**: Simple process to add new fonts or projects
6. **Performance Optimized**: Only embed fonts actually used in designs

## Adding New Fonts

### Quick Start Process:
1. **Download font file** (preferably TTF for maximum compatibility)
2. **Place in** `client/public/fonts/`
3. **Update registry** in `client/src/lib/fonts/font-registry.ts`:
   ```typescript
   'Font Name': {
     '400': { file: 'FontName-Regular.ttf', format: 'truetype', project: ['melody-ring'] }
   }
   ```
4. **Test with Font Manager** at `/font-manager`
5. **Verify rendering** at `/font-test`

## Conclusion

True WYSIWYG font rendering in D3/Canvas exports requires:
- Local font files (TTF/WOFF2/WOFF/OTF)
- Base64 embedding in SVG for exports
- Proper timing and error handling
- Centralized font management system

Our implementation provides a robust, scalable font system that ensures exported images match the live preview exactly, maintaining design integrity across all projects. The visual management tools make it easy to monitor font status and debug rendering issues.