# Map Poster Generator - Technical Summary

## Recent Technical Updates (January 2025)

### UI/UX Consistency Updates (January 7, 2025)
- **Navigation Scrolling Fix**: Unified scrolling behavior across all navigation methods
  - Added consistent 132px offset for wizard stepper visibility
  - Fixed Previous button scrolling in steps 2→1 and 4→3
  - Applied 50ms delay for DOM updates before scrolling
  - Updated both Basic and Advanced editors
- **Elliptical Shape Removal**: Replaced pill shapes with rounded rectangles
  - Changed `blob-shape` and `organic-shape` CSS classes
  - Updated "Recommended" badge to `rounded-md`
  - Fixed filter buttons to use `rounded-lg`
  - Preserved circular elements (wizard steps, badges)
- **Visual Consistency**: Established clear shape hierarchy
  - Circles: For steps, states, and progress indicators
  - Rounded rectangles: For badges, buttons, and labels

### Basic Editor Implementation (January 27-28, 2025)
- **New Components**: Created simplified editing experience
  - `MPG-basic-editor.tsx`: Container component with 2-page navigation
  - `MPG-basic-personalize.tsx`: Text-only personalization fields with accordion UI
  - `MPG-basic-download.tsx`: Simplified size selection and download
- **Shared State Management**: Both editors use same Zustand store
  - Added `editorMode: 'basic' | 'advanced'` to MPGState
  - State preserved when switching between editors
- **Smart Location Handling**: Matches advanced editor logic
  - Full address display for specific locations (house number + street)
  - City-only display for general locations
  - Address truncation for long street names (>30 chars)
  - Fixed auto-opening dropdown with `hasUserInteracted` flag
- **Route Architecture**:
  - `/personalize-map?template={id}` → Basic editor
  - `/map-poster-generator` → Advanced editor
  - Templates default to basic editor via "Personalize This" button
- **UI Enhancements (January 28)**:
  - Added colorful accordion sections (Pink, Yellow, Purple themes)
  - Integrated `MPGAccordionSection` and `MPGAccordionManager` components
  - Added prominent "Advanced Editor" button with animations
  - Removed redundant tip boxes and duplicate navigation links
- **Text Spacing Optimization (January 28)**:
  - Improved multi-line address line height (1.2x → 1.4x)
  - Optimized gap between text elements (40px → 30px base)
  - Enhanced default textSpacing (1.0 → 1.2)
  - Better dynamic line height formula for responsive spacing

### Template Gallery Optimization
- **Compact Card Layout**: 50% size reduction using responsive grid
  - Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
  - Reduced padding from `p-6` to `p-3`
  - Smaller shadows and border radius
- **Simplified Cards**: Removed template name, kept only button
- **Updated Routing**: Direct to basic editor instead of advanced

### Server Logging Enhancement
- **Conditional Logging**: Smart filtering based on context
  - Errors: Always logged (status >= 400)
  - Slow Requests: Logged if > 1000ms
  - Verbose Mode: `VERBOSE_LOGGING=true` environment variable
- **Cleaner Output**: Removed response body from standard logs

### UI/UX Improvements
- **Compact Style Grid**: New glossy button design for map style selection
  - **Space Efficient**: 60-70% space reduction, scalable to 50+ styles
  - **Glassmorphism Design**: Premium gradient buttons with backdrop-blur effects
  - **Smart Organization**: Automatic dark/light theme separation with section headers
  - **Auto-Contrast Text**: Brightness calculation for optimal text readability
- **Centered Preview**: Live preview now centered in right panel for better visual balance
- **Multi-line Text Fix**: Improved spacing for wrapped city names and address handling

### Enhanced Typography System
- **36 Custom Fonts Available**: Expanded from 5 to 36 fonts across 6 categories
  - Modern Sans-Serif (5): Montserrat, Raleway, Roboto, Lato, Oswald
  - Display & Impact (9): Bebas Neue, Anton, Archivo Black, Ultra, etc.
  - Tech & Gaming (3): Orbitron, Russo One, Press Start 2P
  - Elegant Serif (1): Playfair Display
  - Script & Handwritten (16): Pacifico, Lobster, Dancing Script, etc.
  - Fun & Playful (2): Amatic SC, Kalam
- **Hybrid Font Loading**: Smart system using local files with CDN fallback
- **Individual Font Controls**: Separate font selection for each text element (city, coordinates, country, custom)
- **Dynamic Text Spacing**: Automatic gap calculation based on actual font sizes
- **Dual Spacing Controls**: Letter spacing (0-5) and text line spacing (0.5x-2x)
- **Frame-Aware Positioning**: Reduced gaps for non-square frames (circle, heart, house)
- **Size Options**: S/M/L for all text elements with proper multipliers
- **Multi-line Support**: Proper handling of long addresses with consistent line spacing
- **Unified Font System**: All 36 fonts available across all text sections

### Pin Feature Improvements
- **Visual Pin Icons**: Created SVG components for pin selection UI
- **5 Pin Styles**: Basic, Fave, Lollipop, Heart, Home with proper preview
- **Dynamic Scaling**: Size multipliers (S=0.8, M=1.0, L=1.3)
- **Color Integration**: Real-time color updates in preview icons

### Glow Effects Updates
- **Frame Restrictions**: Glow disabled for square frames (UI shows info message)
- **Auto-disable**: Glow automatically turns off when switching to square
- **16 Premium Colors**: Silver Grey through Silver Gradient
- **Intensity Control**: Real-time strength adjustment (0.1-1.0)

### Map Style Enhancements
- **Compact Style Selection**: New glossy button grid with 4-5 columns vs previous 6-8
- **Theme Organization**: Styles automatically sorted into "Dark Themes" and "Light Themes"
- **Midnight Theme Update**: All features enabled by default except street names/labels
- **Smart Defaults**: Each style now has optimized feature toggles
- **Noir Minimalism**: Roads-only default for ultra-clean aesthetic
- **Performance**: Improved style caching and conversion

## Architecture Overview

The Map Poster Generator (MPG) features a **sophisticated style system** with 40+ professional map styles converted from Snazzy Maps (Google Maps format) to MapLibre GL. Built with Konva.js for perfect WYSIWYG rendering, it uses a fixed base canvas system to ensure exact preview-to-export fidelity. Recent updates include 8 new styles, enhanced wizard navigation, and improved frame border handling.

## Core Technical Stack

### Frontend Technologies
- **Konva.js**: Canvas-based rendering with Stage/Layer architecture
- **React-Konva**: React bindings for Konva components
- **MapLibre GL**: Vector map renderer with Maptiler API integration
- **Snazzy Maps**: Source for 20 professional map styles
- **Zustand**: State management for user settings
- **TypeScript**: Full type safety across components
- **Google Fonts**: Typography integration

### Key Design Decisions

#### Fixed Base Canvas System
```typescript
// All layout calculations use these fixed dimensions
export const MPG_BASE_CANVAS = {
  width: 1200,   // Base width
  height: 1600,  // Base height (3:4 ratio)
};

export const MPG_BASE_MAP = {
  width: 720,   // 60% of base width
  height: 720,  // Square aspect ratio
  x: 240,       // Centered horizontally
  y: 280,       // Upper portion positioning
};
```

#### WYSIWYG Implementation
1. **Preview**: Renders at base dimensions, then scales to fit container
2. **Export**: Uses same base dimensions with higher pixelRatio
3. **Result**: Pixel-perfect match between preview and export

## Component Architecture

### 4-Step Wizard Implementation
The Map Poster Generator uses a wizard-based interface with 4 steps:
1. **Location** - City search, presets, map controls
2. **Text** - Headlines, coordinates, custom messages
3. **Style & Settings** - Map style, frame, glow effects, feature toggles
4. **Export & Download** - Format and size selection

### Naming Convention: MPG- Prefix
All Map Poster Generator files use the `MPG-` prefix for clear separation:

**Components:**
```
MPG-builder.tsx              # Main orchestrator component
MPG-wizard-stepper.tsx       # 4-step wizard navigation
MPG-location-form.tsx        # Step 1: Location selection
MPG-text.tsx                 # Step 2: Enhanced text customization
MPG-style-and-settings.tsx   # Step 3: Style & settings
MPG-konva-export-options.tsx # Step 4: Export options
MPG-konva-preview.tsx        # WYSIWYG canvas with dynamic text
MPG-konva-mobile-preview.tsx # Mobile PiP view
MPG-pin-icons.tsx            # SVG pin icon components
```

**UI Components:**
```
ui/MPG-style-grid.tsx        # Legacy style grid (deprecated)
ui/MPG-compact-style-grid.tsx # New glossy button style grid
ui/MPG-accordion-section.tsx # Collapsible sections
ui/MPG-compact-toggle.tsx    # Feature toggle switches
```

**Services & Libraries:**
```
MPG-store.ts                    # Zustand state management
MPG-constants.ts                # Configuration constants
MPG-konva-constants.ts          # Konva-specific constants
MPG-konva-glow-effects.ts       # 16 glow effect definitions
MPG-snazzy-styles.ts            # 20 map style definitions
MPG-style-converter.ts          # Google Maps → MapLibre converter
MPG-maplibre-snazzy-adapter.ts  # Style integration & caching
MPG-maplibre-service.ts         # MapLibre GL service
MPG-maplibre-renderer.tsx       # MapLibre rendering hook
MPG-konva-export-*.ts           # 6 export strategies
```

### State Management (MPG-store.ts)
```typescript
interface MPGState {
  // Wizard state
  currentStep: 1 | 2 | 3 | 4;
  
  // Location data
  city: string;
  lat: number;
  lng: number;
  country: string;
  zoom: number;
  
  // Map offset for fine-tuning position
  mapOffsetX: number; // ±180px max
  mapOffsetY: number; // ±180px max
  
  // Style settings
  style: string; // One of 20 styles
  frameStyle: 'square' | 'circle' | 'heart' | 'house';
  showFrameBorder: boolean; // Frame border toggle
  
  // Glow effects
  glowEffect: boolean;
  glowStyle: string; // 16 styles available
  glowIntensity: number; // 0.1 to 1.0
  
  // Pin settings
  showPin: boolean;
  pinStyle: 'basic' | 'fave' | 'lolli' | 'heart' | 'home';
  pinColor: string;
  pinSize: 'S' | 'M' | 'L';
  
  // Text settings
  showCityName: boolean;
  showCoordinates: boolean;
  showCountry: boolean;
  customText: string;
  customTextFont: string;
  customTextSize: 'S' | 'M' | 'L';
  headlineText: string;
  headlineFont: string;
  headlineSize: 'S' | 'M' | 'L';
  headlineAllCaps: boolean;
  titleFont: string;
  titleSize: 'S' | 'M' | 'L';
  coordinatesFont: string;
  coordinatesSize: 'S' | 'M' | 'L';
  countryFont: string;
  countrySize: 'S' | 'M' | 'L';
  letterSpacing: number; // 0-5
  textSpacing: number; // 0.5-2x multiplier
  
  // Export settings
  exportFormat: 'png' | 'jpg' | 'pdf';
  exportSize: string;
  exportQuality: number; // 1-95
  isExporting: boolean;
  
  // Map feature toggles (with style defaults)
  showMapLabels: boolean;
  showMapBuildings: boolean;
  showMapParks: boolean;
  showMapWater: boolean;
  showMapRoads: boolean;
  
  // Actions & computed values
  panMap: (deltaX: number, deltaY: number) => void;
  resetMapPosition: () => void;
  setStyleWithDefaults: (styleId: string) => void;
  // ... other actions
}
```

## Style System Architecture

### Compact Style Grid Implementation
**New in January 2025** - Replaced large preview boxes with compact glossy buttons:

```typescript
// MPG-compact-style-grid.tsx
export function MPGCompactStyleGrid({
  styles,
  selectedStyle,
  onStyleSelect,
  columns = 'normal'
}) {
  // Auto-sort styles by theme (dark first, then light)
  const sortedStyles = sortStylesByTheme(styles);
  const darkStyles = sortedStyles.filter(style => isDarkTheme(style.preview.bg));
  const lightStyles = sortedStyles.filter(style => !isDarkTheme(style.preview.bg));
  
  return (
    <div className="space-y-4">
      {renderStyleGrid(darkStyles, 'Dark Themes')}
      {renderStyleGrid(lightStyles, 'Light Themes')}
    </div>
  );
}
```

**Key Features:**
- **Auto-Contrast**: Text color calculated via `(r*299 + g*587 + b*114) / 1000`
- **Glassmorphism**: `backdrop-blur-sm` + gradient overlays
- **Theme Sorting**: Dark themes first, then light themes, alphabetically
- **Space Efficient**: 80px tall buttons in 3-5 column grid
- **Scalable**: Designed for 50+ future styles

### Snazzy Maps Integration
**40+ Professional Styles** stored in `MPG-snazzy-styles.ts`:
```typescript
export interface SnazzyMapStyle {
  name: string;
  description?: string;
  tags?: string[];
  background?: string;  // Poster background color
  textColor?: string;   // Text color for contrast
  defaultFeatures?: {   // Default feature toggles
    showMapLabels?: boolean;
    showBuildings?: boolean;
    showParks?: boolean;
    showWater?: boolean;
    showMapRoads?: boolean;
  };
  style: GoogleMapsStyle[]; // Snazzy Maps JSON
}

// Example: Midnight theme with comprehensive defaults
midnight: {
  name: 'Midnight',
  background: '#0a1929',
  textColor: '#ffffff',
  defaultFeatures: {
    showMapLabels: false,   // OFF - no street names
    showBuildings: true,    // ON - show buildings
    showParks: true,        // ON - show parks
    showWater: true,        // ON - show water
    showRoads: true         // ON - show roads
  },
  // ... style definition
}
}
```

### Style Conversion Pipeline
```typescript
// MPG-style-converter.ts
export function convertSnazzyToMapLibre(
  snazzyStyle: SnazzyMapStyle,
  features?: MapFeatures
): MapLibreStyle {
  // 1. Extract colors from Google Maps format
  // 2. Map features to MapLibre layers
  // 3. Apply feature toggles
  // 4. Generate text label layers
  // 5. Return MapLibre GL style
}
```

### Feature Mapping
| Google Maps Feature | MapLibre Layer | Notes |
|-------------------|----------------|--------|
| `landscape` | Background color | Main canvas |
| `water` | water layer | Lakes, rivers |
| `road.highway` | highways layer | Major roads |
| `road.arterial` | arterial roads | Secondary |
| `road.local` | local roads | Residential |
| `poi` | POI fill layer | Points of interest |
| `poi.park` | Parks layer | Green spaces |

### Text Label Layers (7 Types)
```typescript
// Generated for each style when showMapLabels is true
const labelLayers = [
  'place-city-labels',      // 20-36px
  'place-suburb-labels',     // 18px
  'street-labels-highway',   // 17px
  'street-labels-major',     // 15px
  'street-labels-minor',     // 13px
  'poi-labels',             // 14px
  'water-name-labels'       // 16px
];
```

## Glow Effects System

### 16 Premium Glow Colors
```typescript
export const MPG_KONVA_GLOW_EFFECTS = {
  silverGrey: { name: 'Silver Grey', color: '#C0C0C0' },
  turquoise: { name: 'Turquoise', color: '#40E0D0' },
  lavender: { name: 'Lavender', color: '#E6E6FA' },
  royalBlue: { name: 'Royal Blue', color: '#4169E1' },
  roseGold: { name: 'Rose Gold', color: '#B76E79' },
  sunsetOrange: { name: 'Sunset Orange', color: '#FD5E53' },
  deepPurple: { name: 'Deep Purple', color: '#673AB7' },
  neonGreen: { name: 'Neon Green', color: '#39FF14' },
  electricBlue: { name: 'Electric Blue', color: '#7DF9FF' },
  goldenYellow: { name: 'Golden Yellow', color: '#FFD700' },
  hotPink: { name: 'Hot Pink', color: '#FF69B4' },
  emeraldGreen: { name: 'Emerald Green', color: '#50C878' },
  crimsonRed: { name: 'Crimson Red', color: '#DC143C' },
  pearlWhite: { name: 'Pearl White', color: '#FDEEF4' },
  midnightBlue: { name: 'Midnight Blue', color: '#191970' },
  copperBronze: { name: 'Copper Bronze', color: '#B87333' }
};
```

### Multi-layer Glow Rendering
```typescript
// Creates depth with multiple blur layers
function renderGlow(konvaNode: Konva.Node) {
  const glowLayers = [
    { blur: 40, opacity: 0.3 },  // Outer glow
    { blur: 20, opacity: 0.5 },  // Middle glow
    { blur: 10, opacity: 0.7 }   // Inner glow
  ];
  // Apply to create atmospheric effect
}
```

## Export System

### 6 Export Strategies
Multiple export methods ensure reliability across browsers:
```typescript
// MPG-konva-export.ts - Primary Konva export
// MPG-export-wysiwyg.ts - WYSIWYG preservation
// MPG-export-final.ts - Final enhanced export
// MPG-export-reliable.ts - Fallback export
// MPG-export-enhanced.ts - Quality optimization
// MPG-export-exact.ts - Exact reproduction
```

### High-Resolution Export
```typescript
// Export uses pixelRatio for quality
const pixelRatio = MPG_KONVA_EXPORT_SETTINGS.pixelRatio; // 2

stage.toDataURL({
  mimeType: format === 'jpg' ? 'image/jpeg' : 'image/png',
  quality: quality / 100, // User-selectable 1-95
  pixelRatio: pixelRatio  // 2x for print quality
});
```

### PDF Generation
```typescript
// Dynamic import for code splitting
const { jsPDF } = await import('jspdf');

// Create PDF with proper dimensions
const pdf = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: exportSize // A4, Letter, etc.
});
```

## Performance Optimizations

### Style Caching System
```typescript
// MPG-maplibre-snazzy-adapter.ts
const convertedStyleCache: Map<string, any> = new Map();

function getCacheKey(styleId: string, features: MapFeatures): string {
  return `${styleId}-${JSON.stringify(features)}`;
}

// Cache converted styles for instant switching
if (convertedStyleCache.has(cacheKey)) {
  return convertedStyleCache.get(cacheKey);
}
```

### Font Loading Strategy
```typescript
// Load fonts once, cache for reuse
useEffect(() => {
  const loadFonts = async () => {
    // Add Google Font links
    await document.fonts.ready;
    // Force-load specific weights
    setFontsLoaded(true);
  };
}, [titleFont]);
```

### Render Optimization
- **perfectDrawEnabled**: false on Text nodes
- **listening**: false on non-interactive elements
- **batchDraw**: for grouped updates
- **Scaling**: Preview scales base canvas rather than re-rendering
- **Debounced Search**: 300ms delay for location autocomplete

## Mobile Support

### Picture-in-Picture Preview
```typescript
// Floating preview for mobile devices
<MPGKonvaMobilePreview 
  onExpand={() => setShowMobilePreview(true)} 
/>
```

### Responsive Scaling
```typescript
const scaleX = containerWidth / baseDimensions.width;
const scaleY = containerHeight / baseDimensions.height;
const scale = Math.min(scaleX, scaleY);
```

## Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build
```

## File Structure

```
/client/src/
├── components/mpg/          # UI Components (12 files)
│   ├── MPG-builder.tsx
│   ├── MPG-wizard-stepper.tsx
│   ├── MPG-location-form.tsx
│   ├── MPG-text.tsx
│   ├── MPG-style-and-settings.tsx
│   ├── MPG-konva-export-options.tsx
│   ├── MPG-konva-preview.tsx
│   ├── MPG-konva-mobile-preview.tsx
│   └── [4 legacy components]
├── lib/mpg/                # Business Logic (20+ files)
│   ├── MPG-store.ts
│   ├── MPG-constants.ts
│   ├── MPG-konva-constants.ts
│   ├── MPG-konva-glow-effects.ts
│   ├── MPG-snazzy-styles.ts          # 40+ styles
│   ├── MPG-style-converter.ts
│   ├── MPG-maplibre-snazzy-adapter.ts
│   ├── MPG-maplibre-service.ts
│   ├── MPG-maplibre-renderer.tsx
│   └── MPG-konva-export-*.ts         # 6 export strategies
└── pages/
    └── map-poster-generator.tsx
```

## Testing Approach

### Manual Testing Checklist
**Core Functionality:**
- [ ] 4-step wizard navigation works correctly
- [ ] Can't proceed without required fields
- [ ] Location search with Maptiler autocomplete
- [ ] 12 preset cities load correctly
- [ ] All 40+ map styles render properly
- [ ] Feature toggles apply immediately
- [ ] Style defaults load when style selected
- [ ] Zoom levels update map (10-18 range)
- [ ] Map panning with offset controls (±180px)
- [ ] Map position reset functionality

**UI & Styling:**
- [ ] 4 Frame styles: Square, Circle, Heart, House
- [ ] 16 Glow effects with intensity control
- [ ] Typography settings (15+ fonts)
- [ ] Custom text with size control (S/M/L)
- [ ] Letter spacing (0-20px)
- [ ] All-caps toggle for headlines
- [ ] Export produces matching image
- [ ] Mobile PiP preview works

**Style-Specific Features:**
- [ ] Each style loads its default features
- [ ] User can override any default
- [ ] Text labels toggle correctly
- [ ] Building layer toggle works
- [ ] Parks/water/roads toggles work
- [ ] Background/text colors apply

### Browser Compatibility
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

## Common Issues & Solutions

### Issue: Style defaults not applying
**Solution**: Use handleStyleSelect() which calls getStyleDefaultFeatures()

### Issue: Fonts not loading
**Solution**: Wait for document.fonts.ready and add delay for Konva

### Issue: Export doesn't match preview
**Solution**: Use fixed base canvas dimensions for both preview and export

### Issue: Performance on mobile
**Solution**: Scale preview rather than re-render, use PiP mode

### Issue: Text labels not showing
**Solution**: Check showMapLabels toggle and ensure style converter generates label layers

## Recent Updates (December 2024)

### Version 4.0 - Complete Style System
- **40+ Professional Styles**: From Snazzy Maps with conversion
- **Default Features System**: Each style has optimized toggles
- **Style Converter**: Google Maps → MapLibre GL conversion
- **7 Label Layer Types**: Proper text hierarchy (13-36px)
- **Feature Toggle UI**: Updates when style selected
- **Smart Adapter**: Merges style defaults with user overrides

### New Styles Added (January 2025)
- **Architectural Print Series (10 styles)**: Blueprint 2, Redprint, Greenprint, Blackprint, Orangeprint, Purpleprint, Cyanprint, Pinkprint, Brownprint, Indigoprint
- **Neon Series (5 styles)**: Neon Urban, Neon Pink, Neon Red, Neon Dark, Orange Noir  
- **Nature & Organic**: Rose Petal, Forest Green
- **Architectural**: Figure Ground (diagram style)
- **All with Defaults**: Each has optimized feature settings with smart toggles
- **Removed Styles**: midnight, yellowprint, tealprint (replaced with better alternatives)

### Architecture Improvements
- **4-Step Wizard**: Free navigation between steps
- **Glow Effects**: 16 colors with multi-layer rendering
- **6 Export Strategies**: Maximum reliability
- **Typography System**: Google Fonts with advanced controls
- **Caching System**: Converted styles cached for performance

## Performance Metrics

- **Style Switch**: < 100ms (cached)
- **Map Load**: 1-3 seconds (depends on zoom)
- **Export PNG**: 2-5 seconds
- **Export PDF**: 3-7 seconds
- **Style Conversion**: < 50ms
- **Cache Size**: 20 items max

## Future Enhancements

**Map Features:**
- [ ] Custom marker placement
- [ ] Multiple location support
- [ ] Route highlighting
- [ ] Satellite imagery
- [ ] 3D terrain rendering
- [ ] Custom color schemes

**Export & Frames:**
- [ ] Animation support
- [ ] SVG export
- [ ] More frame shapes
- [ ] Social media presets
- [ ] Batch export

**Performance:**
- [ ] Service Worker caching
- [ ] Progressive loading
- [ ] WebGL acceleration
- [ ] Lazy style loading

---

**Last Updated**: January 7, 2025  
**Version**: 4.1.1 (UI Consistency & Navigation Improvements)  
**Status**: Production Ready  
**Total Styles**: 50+ (Including new Print and Neon series)  
**Export Methods**: 6  
**Glow Effects**: 16  
**UI Features**: Compact style grid, centered preview, frame border toggle, consistent navigation scrolling