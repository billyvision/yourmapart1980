# Map Poster Generator - Product Requirements Document (PRD)

## Executive Summary

The Map Poster Generator (MPG) is a web-based tool that transforms city maps into beautiful, personalized wall art. Users can create custom map posters of any location worldwide with 20 professional map styles, advanced typography options, and high-resolution export capabilities. The system uses Snazzy Maps styles converted to MapLibre GL format, rendered through Konva.js to achieve perfect WYSIWYG (What You See Is What You Get) output.

## Problem Statement

### User Needs
- People want to commemorate special places (homes, travel destinations, meaningful locations)
- Existing map poster services are expensive ($50-$150 per poster)
- Generic map prints lack personalization options
- Users need instant preview and download without waiting for shipping

### Market Opportunity
- Growing trend in personalized home decor
- Map art is popular for gifts (weddings, housewarmings, anniversaries)
- Digital-first generation values instant gratification
- Global market with location-agnostic appeal

## Solution Overview

### Core Value Proposition
Create stunning, personalized map posters instantly with:
- **Real map data** from OpenStreetMap
- **Artistic styles** that transform maps into art
- **Perfect WYSIWYG** preview matching export exactly
- **Instant download** in print-ready formats
- **Global coverage** for any location worldwide

### Key Differentiators
1. **20 Professional Styles**: Converted from Snazzy Maps with smart default features
2. **Style System**: Google Maps to MapLibre GL conversion with feature controls
3. **4-Step Wizard**: Intuitive guided process for poster creation
4. **Real-time Preview**: See changes instantly as you customize
5. **Perfect WYSIWYG**: Preview matches download pixel-for-pixel
6. **Smart Feature Defaults**: Each style has optimized feature toggles
7. **Advanced Frame Options**: Square, circle, heart, and house shapes
8. **16 Glow Effects**: Premium atmospheric lighting options
9. **Mobile Responsive**: Full functionality on all devices with PiP preview

## Technical Architecture

### System Design

#### Frontend Architecture
```
┌─────────────────────────────────────────────────────┐
│                User Interface                       │
├─────────────────────────────────────────────────────┤
│           MPG-builder (4-Step Wizard)               │
├─────────────┬─────────────┬────────┬────────────────┤
│ Step 1:     │ Step 2:     │ Step 3:│ Step 4:       │
│ Location    │ Text &      │ Style &│ Export        │
│             │ Typography  │Settings│               │
├─────────────┴─────────────┴────────┴────────────────┤
│              Konva.js Rendering Engine              │
├─────────────────────────────────────────────────────┤
│     MapLibre GL with Snazzy Maps Conversion        │
│                                                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │  20 Professional Styles from Snazzy Maps        │ │
│  │  - Smart Default Features per Style             │ │
│  │  - Google Maps → MapLibre GL Converter          │ │
│  │  - 7 Text Label Layer Types                     │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

#### Component Hierarchy
```
map-poster-generator.tsx (Page with site layout)
└── MPG-builder.tsx (4-Step Wizard Controller)
    ├── MPG-wizard-stepper.tsx (Step Navigation)
    ├── Step 1: MPG-location-form.tsx
    │   ├── City Search (Maptiler autocomplete)
    │   ├── Preset Cities (12 options)
    │   ├── Zoom Controls (10-18 range)
    │   └── Map Position Fine-tuning (±180px)
    ├── Step 2: MPG-text.tsx
    │   ├── Headline Toggle & Text
    │   ├── Coordinates Display
    │   ├── Country Display
    │   ├── Custom Text Options
    │   ├── Typography Controls (15+ fonts)
    │   ├── Letter Spacing (0-20px)
    │   └── All-Caps Toggle
    ├── Step 3: MPG-style-and-settings.tsx
    │   ├── Style Picker (20 Snazzy styles)
    │   ├── Frame Style (square, circle, heart, house)
    │   ├── Glow Effects (16 colors + intensity)
    │   ├── Map Feature Toggles with Defaults
    │   └── Smart Style Selection Handler
    ├── Step 4: MPG-konva-export-options.tsx
    │   ├── Format Selection (PNG, JPG, PDF)
    │   ├── Size Selection (5 options)
    │   └── Export Quality Settings
    └── MPG-konva-preview.tsx (Real-time Preview)
        ├── MapLibre GL Rendering
        ├── Typography Rendering
        ├── Frame Clipping
        ├── Glow Effect Layers
        └── WYSIWYG Export
```

### Data Models

#### MPG State (Zustand Store)
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
  style: string; // One of 20 Snazzy styles
  frameStyle: 'square' | 'circle' | 'heart' | 'house';
  
  // Glow effects
  glowEffect: boolean;
  glowStyle: string; // One of 16 glow colors
  glowIntensity: number; // 0.1 - 1.0
  
  // Text settings
  showHeadline: boolean;
  showCoordinates: boolean;
  showCountry: boolean;
  customText: string;
  customTextFont: string;
  customTextSize: 'S' | 'M' | 'L';
  titleFont: string;
  subtitleFont: string;
  letterSpacing: number; // 0-20px
  isAllCaps: boolean;
  
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
  
  // Actions
  setStyleWithDefaults: (styleId: string) => void;
  panMap: (deltaX: number, deltaY: number) => void;
  resetMapPosition: () => void;
}
```

#### Export Configuration
```typescript
interface ExportConfig {
  format: 'png' | 'jpg' | 'pdf';
  size: 'A4' | 'Letter' | 'Square' | 'Portrait' | 'Landscape';
  quality: number;      // 0.8-1.0 for JPG
  pixelRatio: number;   // 2 for high-res
}
```

### Fixed Base Canvas System

#### Dimensions Strategy
```typescript
// All layouts calculated on fixed base
const BASE_CANVAS = {
  width: 1200,
  height: 1600  // 3:4 aspect ratio
};

// Map always same size, same position
const BASE_MAP = {
  width: 720,
  height: 720,
  x: 240,
  y: 280
};

// Text positions are absolute
const TEXT_LAYOUT = {
  titleY: 1200,
  coordinatesY: 1312,
  countryY: 1376,
  customTextY: 1440
};
```

#### WYSIWYG Implementation
1. **Preview Stage**: Renders at base dimensions, scales to container
2. **Export Stage**: Same base dimensions, higher pixelRatio
3. **Result**: Identical layout, perfect match

## Feature Specifications

### 4-Step Wizard Implementation

#### Step 1: Location Selection

##### City Search
- **Input**: Autocomplete search box
- **API**: Maptiler Geocoding API
- **Response**: City name, coordinates, country, address details
- **Smart suggestions**: Real-time city suggestions as user types
- **Instant map updates**: Map centers on selected location

##### Preset Cities (12 options)
Quick access buttons for popular destinations:
- New York (40.7128°N, 74.0060°W)
- London (51.5074°N, 0.1278°W)  
- Paris (48.8566°N, 2.3522°E)
- Tokyo (35.6762°N, 139.6503°E)
- Sydney (33.8688°S, 151.2093°E)
- Barcelona (41.3851°N, 2.1734°E)
- Dubai (25.2048°N, 55.2708°E)
- Singapore (1.3521°N, 103.8198°E)
- Amsterdam (52.3676°N, 4.9041°E)
- Rome (41.9028°N, 12.4964°E)
- Berlin (52.5200°N, 13.4050°E)
- Toronto (43.6532°N, 79.3832°E)

##### Map Controls
- **Zoom slider**: Range 10-18 with optimal defaults
- **Fine positioning**: Map offset controls (±180px range)
- **Reset position**: Return to default centered view

#### Step 2: Text & Typography

##### Text Options
- **Headline**: City name display toggle
- **Coordinates**: Latitude/longitude display
- **Country**: Country name display
- **Custom Text**: Personal message up to 100 characters

##### Typography Controls
- **Title fonts**: 15+ Google Fonts including script and display
- **Subtitle fonts**: Separate font for coordinates/country
- **Letter spacing**: Adjustable 0-20px range
- **Text sizes**: S/M/L options for custom text
- **All-caps toggle**: Transform headlines to uppercase

#### Step 3: Style & Settings

##### Style Selection
- **20 Professional Styles**: Converted from Snazzy Maps
- **Smart Defaults**: Each style has optimized feature toggles
- **Real-time switching**: Instant preview updates
- **Background colors**: Coordinated with map style

##### Frame Options
- **Square**: Clean rectangular frame
- **Circle**: Classic circular crop
- **Heart**: Romantic heart-shaped frame
- **House**: Architectural house silhouette

##### Glow Effects
- **16 Premium Colors**: From silver to neon
- **Intensity Control**: 10-100% strength
- **Multi-layer rendering**: Creates depth and atmosphere

##### Map Features (with Style Defaults)
- **Street Names**: All text labels (7 layer types)
- **Buildings**: Architectural footprints
- **Parks**: Green spaces and recreation
- **Water**: Lakes, rivers, oceans
- **Roads**: Full road network

#### Step 4: Export & Download

##### Format Options
- **PNG**: Lossless, best for printing
- **JPG**: Compressed, web-optimized
- **PDF**: Professional printing format

##### Size Presets
- **A4**: 2480×3508px (210×297mm at 300 DPI)
- **Letter**: 2550×3300px (8.5×11" at 300 DPI)
- **Square**: 3000×3000px (12×12" at 250 DPI)
- **Portrait**: 2400×3200px (3:4 aspect ratio)
- **Landscape**: 3200×2400px (4:3 aspect ratio)

### Map Rendering

#### Tile Fetching Service
```typescript
// Fetch OpenStreetMap tiles
async function fetchStaticMapImage({
  lat, lng, zoom, width, height, style
}): Promise<HTMLImageElement>

// Tile calculation
const n = Math.pow(2, zoom);
const tileX = Math.floor((lng + 180) / 360 * n);
const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) 
  + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
```

#### Caching Strategy
- In-memory cache for fetched tiles
- Cache key: `${lat}_${lng}_${zoom}_${width}_${height}_${style}`
- Prevents redundant network requests

### Dual Rendering System

#### MapLibre GL Integration
The Map Poster Generator uses a sophisticated dual rendering system:

1. **Primary**: MapLibre GL JS with vector tiles from Maptiler
2. **Fallback**: OpenStreetMap raster tiles for compatibility

#### Vector Map Features
- **High-quality rendering** with infinite zoom capability
- **Feature toggles**: Control roads, buildings, parks, water, labels
- **9 custom vector styles** optimized for poster aesthetics
- **Real-time style switching** without re-downloading data

#### API Integration
- **Maptiler API**: Vector tiles and custom style definitions
- **Environment-based configuration**: `VITE_MAPTILER_API_KEY`
- **Automatic fallback**: Graceful degradation to raster tiles
- **Caching strategy**: Client-side map image caching

### Style System

#### Available Styles (20 Professional Snazzy Maps)

##### Modern & Minimal
| Style | Description | Default Features |
|-------|-------------|------------------|
| Midnight | Dark theme with deep blues | Buildings only |
| Clean Gray | Minimalist light theme | All features on |
| Noir | Stark black and white | Buildings & roads |
| Blueprint | Technical architectural | Buildings, water, roads |
| Blueprint 2 | Architectural without water | Buildings & roads |

##### Colorful & Vibrant
| Style | Description | Default Features |
|-------|-------------|------------------|
| Avocado | Fresh vibrant green | All features on |
| Coral | Soft cream with coral | Buildings & roads |
| Neon | Electric yellow & magenta | Buildings, water, roads |
| Neon Urban | Urban neon without water | Buildings & roads |
| Goldenrod | Bold golden yellow | All except labels |

##### Nature & Earth Tones
| Style | Description | Default Features |
|-------|-------------|------------------|
| Forest | Classic forest green | Water & roads |
| Sandstone | Soft beige with blue | All features on |
| Maritime | Navy land, white roads | Roads only |

##### Artistic & Unique
| Style | Description | Default Features |
|-------|-------------|------------------|
| Mondrian | Primary colors art | All except labels |
| Crimson Tide | Bold crimson land | Buildings, water, roads |
| Crimson Steel | Industrial crimson | Buildings & roads |
| Urban Shadow | Dark charcoal theme | Water & roads |
| Nothing but Roads | Pure road network | Roads only |
| Purple Coast | Elegant purple theme | Parks, water, roads |
| Blue Gold | Luxurious navy & gold | Buildings, parks, water |

#### Style Conversion Pipeline
```typescript
// Snazzy Maps (Google) → Style Converter → MapLibre GL
export function convertSnazzyToMapLibre(
  snazzyStyle: SnazzyMapStyle,
  features?: MapFeatures
): MapLibreStyle {
  // 1. Extract colors from Google Maps format
  // 2. Map features to MapLibre layers
  // 3. Apply feature toggles
  // 4. Generate 7 text label layer types
  // 5. Return MapLibre GL style
}
```

#### Text Label Layers (7 Types)
- **place-city-labels**: 20-36px for cities
- **place-suburb-labels**: 18px for suburbs
- **street-labels-highway**: 17px for highways
- **street-labels-major**: 15px for major roads
- **street-labels-minor**: 13px for minor streets
- **poi-labels**: 14px for points of interest
- **water-name-labels**: 16px for water bodies

### Typography System

#### Font Options
- Playfair Display (Serif)
- Montserrat (Sans-serif)
- Bebas Neue (Display)
- Roboto (Universal)
- Lato (Humanist)
- Oswald (Condensed)

#### Text Hierarchy
1. **City Name**: 72px (6% of canvas width)
2. **Coordinates**: 28px (2.3% of canvas width)
3. **Country**: 32px (2.7% of canvas width)
4. **Custom Text**: 36px (3% of canvas width)

#### Letter Spacing
- Range: 0-20px
- Default: 2px for city, 4px for country
- Applied via Konva letterSpacing property

### Export System

#### Format Specifications

##### PNG Export
- **Mime Type**: image/png
- **Quality**: Lossless
- **Transparency**: No
- **File Size**: 5-15 MB
- **Use Case**: Printing, archival

##### JPG Export
- **Mime Type**: image/jpeg
- **Quality**: 0.95
- **Transparency**: No
- **File Size**: 2-8 MB
- **Use Case**: Web, email

##### PDF Export
- **Library**: jsPDF
- **Image Format**: PNG embedded
- **Orientation**: Portrait
- **Use Case**: Professional printing

#### Size Options
- **A4**: 2480×3508px (210×297mm at 300 DPI)
- **Letter**: 2550×3300px (8.5×11" at 300 DPI)
- **Square**: 3000×3000px (12×12" at 250 DPI)
- **Portrait**: 2400×3200px (16×20" at 150 DPI)
- **Landscape**: 3200×2400px (20×16" at 160 DPI)

## User Interface Design

### Layout Structure
```
┌────────────────────────────────────┐
│          Header & Navigation        │
├────────────────┬───────────────────┤
│                │                   │
│   Controls     │    Live Preview   │
│   (Left 60%)   │    (Right 40%)    │
│                │                   │
│  - Location    │   ┌───────────┐   │
│  - Settings    │   │           │   │
│  - Styles      │   │    Map    │   │
│  - Export      │   │           │   │
│                │   └───────────┘   │
│                │    CITY NAME      │
│                │   coordinates     │
│                │     COUNTRY       │
├────────────────┴───────────────────┤
│             Footer                  │
└────────────────────────────────────┘
```

### Mobile Experience
- **Responsive Grid**: Stacks vertically on mobile
- **Picture-in-Picture**: Floating preview button
- **Modal Preview**: Full-screen map view
- **Touch Optimized**: Large tap targets

### Interaction Patterns
- **Instant Updates**: Real-time preview changes
- **Loading States**: "Loading map..." during fetch
- **Visual Feedback**: Button states, hover effects
- **Smooth Transitions**: Animated style changes

## Performance Requirements

### Loading Performance
- **Initial Load**: < 3 seconds
- **Map Update**: < 2 seconds (vector), < 3 seconds (raster)
- **Style Change**: < 100ms (vector), < 1 second (raster)
- **Export Generation**: < 5 seconds
- **Font Loading**: < 500ms per font

### Optimization Strategies
- **Dual Caching**: Vector tiles + raster tile caching
- **Font Preloading**: Google Fonts + local font loading
- **Lazy Loading**: Dynamic imports for PDF library and MapLibre
- **Canvas Scaling**: Scale preview vs re-render for performance
- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Map Image Caching**: Client-side cache with 20-item limit
- **Feature Toggle Optimization**: Real-time style filtering without re-download

### Browser Support
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Success Metrics

### User Engagement
- **Poster Creation Rate**: Users who export a poster
- **Style Usage**: Distribution across 13 styles
- **Location Diversity**: Geographic spread of maps
- **Return Usage**: Users creating multiple posters

### Technical Metrics
- **Export Success Rate**: Successful downloads
- **Performance**: Page load and interaction times
- **Error Rate**: Failed map loads or exports
- **Browser Compatibility**: Usage across browsers

## Implementation Timeline

### Phase 1: Migration to Konva.js ✅ (Completed)
- Replace Leaflet with Konva.js
- Implement fixed base canvas system
- Achieve perfect WYSIWYG export
- Initial map rendering implementation

### Phase 2: 4-Step Wizard ✅ (Completed)
- Reorganize UI into guided 4-step process
- Implement wizard state management
- Add step validation and navigation
- Mobile responsive design with PiP preview

### Phase 3: Snazzy Maps Integration ✅ (Completed)
- Add MapLibre GL JS for vector maps
- 20 professional styles from Snazzy Maps
- Google Maps to MapLibre conversion system
- Smart default features per style
- Maptiler API integration

### Phase 4: Enhanced Features ✅ (Completed)
- Maptiler autocomplete search
- 12 preset city options
- Map fine-positioning controls (±180px)
- Advanced frame shapes (heart, house)
- 16 glow effects with intensity control
- 15+ Google Fonts integration

### Phase 5: Current Production Features ✅
- 20 professional map styles with defaults
- 4 frame styles (square, circle, heart, house)
- 16 glow effects with multi-layer rendering
- 7 text label layer types with proper sizing
- Smart feature toggle system
- 6 export strategies for reliability

### Phase 6: Future Enhancements
- [ ] Custom color scheme builder
- [ ] Multiple markers/locations on single map
- [ ] Route highlighting and path drawing
- [ ] Drag-and-drop text positioning
- [ ] Save/load design templates
- [ ] Social media sharing integration
- [ ] Batch export functionality
- [ ] Map style favorites/bookmarks
- [ ] Advanced typography effects
- [ ] Custom frame shape upload

## Risk Mitigation

### Technical Risks
- **OSM/Maptiler Rate Limits**: Implement aggressive caching, graceful fallbacks
- **MapLibre Compatibility**: Automatic fallback to raster tiles on error
- **Large File Sizes**: Optimize exports, offer quality options, progressive loading
- **Browser Memory**: Limit canvas size, cleanup resources, map instance management
- **API Key Security**: Environment-based configuration, client-side validation

### User Experience Risks
- **Slow Map Loading**: Show loading states, cache aggressively, fallback system
- **Vector Map Failures**: Seamless fallback to raster tiles
- **Export Failures**: Provide retry, alternative formats, quality adjustments
- **Mobile Limitations**: Picture-in-picture preview, modal interface
- **Font Loading**: Local font fallbacks, progressive enhancement

## Compliance & Legal

### Map Data License
- **OpenStreetMap**: ODbL license for raster tiles
- **Maptiler**: Commercial license for vector tiles and API
- **Attribution**: Required for both data sources
- **Fair Use**: Rate limiting and caching compliance

### Privacy
- No user data stored
- No cookies required
- Anonymous usage only

## Maintenance & Support

### Regular Updates
- **Monitor service health**: OSM tile servers + Maptiler API status
- **Update dependencies**: MapLibre GL, font libraries, styling frameworks  
- **Add new styles**: Both vector and raster based on user feedback
- **Performance monitoring**: Loading times, cache hit rates, API usage
- **Security updates**: API key rotation, dependency vulnerabilities

### User Support
- **In-app guidance**: Step-by-step wizard with contextual help
- **FAQ section**: Common issues with vector vs raster maps
- **Export format explanations**: PNG vs JPG vs PDF recommendations
- **Browser compatibility**: WebGL support requirements for vector maps
- **Fallback explanations**: When/why raster tiles are used

## Conclusion

The Map Poster Generator has evolved into a sophisticated, professional map art creation system that delivers exceptional value through its Snazzy Maps integration and smart defaults system.

### Technical Achievements
- **20 Professional Styles**: Converted from Snazzy Maps with Google Maps → MapLibre GL pipeline
- **Perfect WYSIWYG**: Konva.js-based architecture ensuring preview matches export exactly
- **Smart Default Features**: Each style has optimized toggle settings for best appearance
- **4-Step Wizard**: Intuitive user experience with guided poster creation
- **Advanced Customization**: 16 glow effects, 4 frame shapes, 15+ fonts, letter spacing

### User Experience Excellence  
- **Instant Feedback**: Real-time preview updates as users customize
- **Mobile Optimized**: Picture-in-picture preview with responsive design
- **Smart Style Selection**: Automatic feature toggles when style selected
- **Professional Typography**: 7 text label layers with proper size hierarchy (13-36px)

### Production Ready
The system successfully converts Google Maps styles to MapLibre GL format while maintaining the original aesthetic intent. The smart default features system ensures each style looks its best out of the box while still allowing full user customization. With 6 export strategies, 16 glow effects, and comprehensive feature controls, the Map Poster Generator provides professional-quality output suitable for printing and display.

---

**Document Version**: 3.0  
**Last Updated**: December 2024  
**Status**: Production Implementation - Complete Style System  
**Owner**: Product Team