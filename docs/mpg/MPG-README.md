# Map Poster Generator (MPG) - YourMapArt

## Overview
The Map Poster Generator is a sophisticated web application that allows users to create beautiful, customizable map posters of any location worldwide. Built with React, TypeScript, and modern web technologies, it offers a seamless design experience with real-time preview and high-quality exports.

## Recent Updates (January 2025)

### Latest Enhancements (January 6, 2025)
- **Font System Overhaul**: Expanded headline fonts from 5 to 36 (620% increase)
  - Organized into 6 categories: Modern, Display, Tech, Serif, Script, Playful
  - Hybrid loading system with local files and CDN fallback
  - Fixed empty font file issues with smart fallback mechanism
  - **All 36 fonts now available across all text sections** (Headlines, Location Details, Custom Message)
  - Unified font loading system with proper scope management
- **Dynamic Frame Sizing**: Non-square frames now 17-30% larger without headlines
  - Circle: 17% larger (user-requested adjustment)
  - Heart & House: 30% larger for better visual balance
- **Automatic Frame Borders**: Smart border management for different frame types
  - Square frames: No border option
  - Other frames: Auto-enable with manual toggle option
- **Consolidated Map Controls**: Unified pan/zoom interface
  - Compact button layout saves 40% UI space
  - Added zoom slider with City/District/Neighborhood/Street labels
  - Consistent controls across all editor stages
- **Enhanced Font Controls**: Streamlined UI for all text sections
  - Arrow navigation buttons (< >) for font selection
  - Single-line controls with All Caps toggle and S/M/L size buttons
  - Consistent design across Headlines, Location Details, and Custom Message

### NEW: Simplified Basic Editor (January 27, 2025)
- **2-Page Wizard**: Ultra-simple personalization flow for non-technical users
  - **Page 1**: Text personalization only (location, headline, message)
  - **Page 2**: Size selection and download
- **Zero Design Decisions**: All styling comes from the template
- **4 Input Fields Total**: Reduced from 30+ options
- **Smart Address Display**: Full address for specific locations, city for general
- **State Preservation**: Seamless transition to advanced editor when needed
- **Template Integration**: "Personalize This" button opens basic editor by default

### Template Gallery Updates
- **Compact Cards**: 50% smaller template cards for better browsing
- **Cleaner Design**: Removed template name from cards
- **Updated CTA**: "Personalize This" replaces "Quick Start with Template"
- **Grid Layout**: 2-5 columns responsive grid (was 1-3)

### Developer Experience
- **Reduced Server Logging**: Only errors and slow requests logged by default
- **Optional Verbose Mode**: VERBOSE_LOGGING=true for detailed API logs
- **Environment Config**: Added .env.example with documentation

### UI/UX Major Improvements
- **Compact Style Grid**: Revolutionary new design for map style selection
  - **Glossy Buttons**: Premium gradient buttons with glassmorphism effects
  - **Smart Organization**: Automatic dark/light theme separation
  - **Space Efficient**: 60-70% space reduction, scalable to 50+ styles
  - **Auto-Contrast Text**: Intelligent text color for optimal readability
- **Centered Live Preview**: Preview now perfectly centered in right panel
- **Frame Border Toggle**: Optional border on/off control for all frame types
- **Multi-line Text Fixes**: Improved spacing for long addresses and city names

### Typography System Overhaul
- **Individual Font Controls**: Separate font selection for city, coordinates, country, and custom text
- **Size Options for All**: S/M/L sizing for every text element
- **Dynamic Text Spacing**: Automatic gap calculation based on actual font sizes
- **Dual Spacing Controls**: Letter spacing (0-5) and text line spacing (0.5x-2x)
- **Frame-Aware Positioning**: Reduced text gaps for circle, heart, and house frames
- **Multi-line Support**: Proper handling of wrapped text with consistent spacing
- **25+ Headline Fonts**: Extensive font selection for headlines
- **15+ Custom Message Fonts**: Script and display fonts for personal messages

### Pin Feature Enhancements
- **Visual Pin Icons**: Proper SVG preview icons in selection UI
- **5 Pin Styles**: Basic, Fave, Lollipop, Heart, and Home with accurate previews
- **Dynamic Colors**: Real-time color updates in preview icons
- **Size Options**: Small, Medium, Large with proper scaling

### Glow Effects Updates
- **Frame Restrictions**: Glow now disabled for square frames (shows info message)
- **Auto-disable**: Glow automatically turns off when switching to square
- **16 Glow Styles**: Premium colors from Silver Grey to Silver Gradient
- **Intensity Control**: Adjustable strength from subtle to dramatic

### Map Style Updates
- **NEW: 50+ Total Styles**: Massive expansion with city-inspired and nature themes
- **City-Inspired Collection**: Rome, Rio de Janeiro, New York Style, San Francisco
- **Nature & Coastal Series**: 9 new styles including Salmon Sky, Emerald Coast, Terra
- **Architectural Print Series**: Complete set of 10 technical drawing styles
- **Dramatic Two-Tone**: Crimson Tide and Emerald Night with minimal features
- **Updated Styles**: Sage Garden with mint roads, Figure Ground with proper colors
- **Removed Styles**: Cleaned up deprecated styles (cleanGray, forest, neonUrban, liverpool)
- **Compact Style Selection**: New glossy button interface with theme organization
- **Smart Feature Toggles**: Each style has optimized default feature settings
- **Enhanced Color Accuracy**: Fixed color issues across multiple styles
- **Style Families**: Organized into cohesive collections for easier browsing
- **Performance**: Improved rendering for all 50+ map styles

### UI/UX Improvements
- **Reorganized Accordions**: Better logical flow with separated Frame and Glow sections
- **Section Lettering**: Updated A-F organization in Style & Settings
- **Mobile Experience**: Enhanced touch controls and responsive design
- **Accessibility**: Improved keyboard navigation and screen reader support

### Branding Update
- **Company Name**: YourMapArt (formerly Puzzle Wall Art)
- **Domain**: yourmapart.com
- **Watermark**: Updated to "YOURMAPART"

## Editor Modes

### Basic Editor (Default)
The basic editor is designed for users who want a quick, simple personalization experience:
- **Route**: `/personalize-map?template={id}`
- **Target Users**: Non-technical users, gift buyers, casual users
- **Features**:
  - Location search with full address support and smart dropdown
  - Headline text (optional)
  - Personal message (optional)
  - 3 size options (8x10", 11x14", 16x20")
  - One-click PNG download
- **UI Design**:
  - Colorful accordion sections (Pink, Yellow, Purple)
  - Clean 2-step wizard interface
  - Live preview alongside form
  - Prominent "Advanced Editor" button for power users
- **Complexity**: 4 input fields total
- **Time to Complete**: ~1 minute

### Advanced Editor
The advanced editor provides full customization control for power users:
- **Route**: `/map-poster-generator`
- **Target Users**: Designers, artists, users wanting full control
- **Features**: All 30+ customization options across 4 steps
- **Access**: Link at bottom of basic editor "Open Advanced Editor →"
- **State Preservation**: All changes from basic editor carry over

## Key Features

### 1. Location Selection (Step 1)
**3 Accordion Sections:**
- **A) Search Location** (Pink) - Global search with autocomplete
- **B) Map Controls** (Yellow) - Pan and zoom controls
- **C) Popular Cities** (Blue) - Quick-select trending locations

### 2. Text Customization (Step 2)
**4 Accordion Sections:**
- **A) Headline Text** (Green) - 25+ fonts, S/M/L sizes, all-caps toggle
- **B) Location Details** (Purple) - Individual fonts and sizes for city, coordinates, country
- **C) Custom Message** (Orange) - 15+ fonts with S/M/L size options
- **D) Typography Settings** (Teal) - Letter spacing and text line spacing controls

### 3. Style & Settings (Step 3)
**6 Accordion Sections:**
- **A) Map Style** (Indigo) - 22+ map styles with new compact glossy button interface
- **B) Map Features** (Pink) - Toggle buildings, parks, water, roads, labels
- **C) Frame Style** (Yellow) - Square, Circle, Heart, House shapes with border toggle
- **D) Glow Effects** (Blue) - 16 glow styles with intensity control (disabled for square frames)
- **E) Background Color** (Green) - 30 custom background colors with auto-contrast
- **F) Location Pin** (Purple) - 5 pin styles with color and size options

### 4. Export Options (Step 4)
**3 Accordion Sections:**
- **A) File Format** (Purple) - PNG, JPG, PDF options
- **B) Paper Size** (Orange) - Multiple print sizes
- **C) Export Information** (Green) - Review settings

## Technical Architecture

### Core Technologies
- **React 18**: Component-based architecture
- **TypeScript**: Type-safe development
- **Vite**: Fast build tooling
- **Konva.js**: Canvas rendering for WYSIWYG preview
- **MapLibre GL**: Vector map rendering
- **Zustand**: State management
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Accessible UI components
- **Radix UI**: Primitive components for accordions

### Component Structure
```
/components/mpg/
├── MPG-builder.tsx              # Main builder component
├── MPG-location-form.tsx        # Location selection (3 sections)
├── MPG-text.tsx                 # Text customization (4 sections)
├── MPG-style-and-settings.tsx   # Style settings (4 sections)
├── MPG-konva-export-options.tsx # Export options (3 sections)
├── MPG-konva-preview.tsx        # Live preview with dynamic text
├── MPG-wizard-stepper.tsx       # 1-2-3-4 step navigation
├── MPG-pin-icons.tsx            # SVG pin icon components
└── ui/
    ├── MPG-accordion-manager.tsx # Centralized accordion state
    ├── MPG-accordion-section.tsx # Color-coded sections with letters
    ├── MPG-compact-toggle.tsx    # Mobile-friendly toggles
    ├── MPG-style-grid.tsx        # Legacy style grid (deprecated)
    └── MPG-compact-style-grid.tsx # New compact glossy style grid
```

### Map Styles Collection (50+)
**Architectural Print Series**: Blueprint 2, Redprint, Greenprint, Blackprint, Orangeprint, Purpleprint, Cyanprint, Pinkprint, Brownprint, Indigoprint
**City-Inspired**: Rome, Rio de Janeiro, New York Style, San Francisco
**Nature & Coastal**: Salmon Sky, Lavenders, Classic, Emerald Coast, Terra, Blush Coast, Sage Garden, Peach Sunset, Coral Dusk
**Dramatic Two-Tone**: Crimson Tide, Emerald Night, Neon Pink, Neon Red, Neon Dark, Orange Noir
**Classic Styles**: Maritime, Desert, Vintage Paper, Figure Ground
**Modern Themes**: Avocado, Ocean Depth, Coral Reef, Urban Night, Soft Peach, Rose Petal, Forest Green
**Vibrant Styles**: Purple Night, Electric Dreams, Golden Glow
**Ocean Themes**: Ocean Blue, Navy Blue, Mint Fresh
**Artistic Variants**: Watercolor, Vintage Atlas, Chalkboard
**Premium Styles**: Gold Coast, Rose Gold, Copper Tone, Silver Lining
**Monochrome**: Noir, Arctic Ice, Pearl White, Graphite, Blue Gold

### State Management
```typescript
// MPG Store Structure
interface MPGState {
  // Location
  city: string
  lat: number
  lng: number
  country: string
  
  // Text
  headlineText: string
  headlineFont: string
  customText: string
  showCityName: boolean
  showCoordinates: boolean
  showCountry: boolean
  
  // Style
  style: string
  zoom: number
  frameStyle: 'square' | 'circle' | 'heart' | 'house'
  glowEffect: boolean
  glowStyle: string
  glowIntensity: number
  
  // Map Features
  showMapLabels: boolean
  showMapBuildings: boolean
  showMapParks: boolean
  showMapWater: boolean
  showMapRoads: boolean
  
  // Pin Settings
  showPin: boolean
  pinStyle: 'basic' | 'fave' | 'lolli' | 'heart' | 'home'
  pinColor: string
  pinSize: 'S' | 'M' | 'L'
  
  // Export
  exportFormat: 'png' | 'jpg' | 'pdf'
  exportSize: string
}
```

## UI/UX Improvements

### Accordion System Benefits
1. **Reduced Cognitive Load**: Only see relevant options
2. **Better Mobile Experience**: Single column layout
3. **Visual Organization**: Color coding for quick identification
4. **Clear Progress**: Letter badges show section order
5. **Smooth Animations**: Polished expand/collapse transitions

### Accessibility Features
- ARIA labels on all interactive elements
- Keyboard navigation support
- High contrast mode compatible
- Screen reader friendly
- Focus indicators

## Performance Optimizations
- **Lazy Component Loading**: Reduces initial bundle size
- **Canvas Hardware Acceleration**: Smooth 60fps rendering
- **Font Preloading**: Background font loading
- **Debounced Search**: 300ms delay reduces API calls
- **Memoized Renders**: React.memo prevents unnecessary updates
- **Optimized Images**: WebP format for map tiles
- **Text Layout Optimization**: Improved line heights and spacing for better readability

## Export Quality
- **High Resolution**: 300 DPI for print quality
- **WYSIWYG Accuracy**: Exact preview matching
- **Font Embedding**: Ensures text renders correctly
- **Color Profiles**: sRGB for web, CMYK ready for print

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## API Integrations
- **OpenStreetMap Nominatim**: Geocoding and search
- **MapLibre GL**: Vector tile rendering
- **Custom Tile Servers**: Multiple style providers

## Future Roadmap
- [ ] Save/Load designs
- [ ] Social sharing features
- [ ] Custom color picker for map styles
- [ ] Multi-language support
- [ ] Batch export functionality
- [ ] User accounts and saved designs

## Support & Maintenance
For technical support or feature requests, contact the YourMapArt development team.

---
*Last Updated: January 2025*