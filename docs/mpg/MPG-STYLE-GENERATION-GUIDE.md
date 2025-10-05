# Map Poster Style Generation Guide

## Overview

The Map Poster Generator uses a sophisticated style conversion system that transforms Google Maps styles (from Snazzy Maps) into MapLibre GL compatible styles. This guide explains how to add new styles and how the conversion process works.

## Architecture

### Style Pipeline
```
Snazzy Maps JSON → Style Converter → MapLibre GL Style → Rendered Map
     (Google)         (Transform)        (Vector)         (Display)
```

### Key Files

1. **`MPG-snazzy-styles.ts`** - Stores all style definitions
2. **`MPG-style-converter.ts`** - Converts Google Maps → MapLibre GL
3. **`MPG-maplibre-snazzy-adapter.ts`** - Integration and caching layer
4. **`MPG-konva-preview.tsx`** - Applies background/text colors to preview

## LLM Workflow for Adding Styles

When an LLM is asked to add a new map style, follow this workflow:

1. **Request Input**: Ask the user for EITHER:
   - A screenshot of the desired map style, OR
   - The Snazzy Maps JSON code

2. **Create Style**: Generate the style with default features:
   ```typescript
   defaultFeatures: {
     showMapLabels: false,  // OFF by default
     showBuildings: true,   // ON by default
     showParks: false,      // OFF by default
     showWater: true,       // ON by default
     showRoads: true        // ON by default
   }
   ```

3. **Confirm Features**: After adding the style, ask:
   > "The style has been added with default features (Buildings, Water, Roads ON; Parks, Street Names OFF). Would you like to customize which features are visible for this style?"

4. **Customize if Requested**: If yes, update the `defaultFeatures` based on user preferences

## Adding New Styles

### Step 1: Get Style from Snazzy Maps

1. Visit [Snazzy Maps](https://snazzymaps.com/)
2. Find a style you like
3. Click "Expand Code" and copy the JavaScript Style Array
4. **IMPORTANT**: Take a screenshot of the style preview for color reference

### Step 2: Analyze Colors from Screenshot

When provided with a screenshot:
1. **Identify key colors**:
   - Background/landscape color (main map background)
   - Water color (rivers, lakes, oceans)
   - Road colors (highways, arterials, local streets)
   - Park/green space colors
   - POI (Points of Interest) colors

2. **Verify color accuracy**:
   - Compare the JSON color values with the screenshot
   - Ensure the converter properly maps each feature type
   - Check that `elementType: 'all'` is handled correctly

### Step 3: Add to Style Definition

Edit `/client/src/lib/mpg/MPG-snazzy-styles.ts`:

```typescript
styleName: {
  name: 'Style Display Name',
  description: 'A brief description of the style',
  tags: ['tag1', 'tag2', 'tag3'],
  background: '#hexcolor',  // REQUIRED: Choose optimal background color
  textColor: '#hexcolor',    // REQUIRED: Choose contrasting text color
  defaultFeatures: {         // REQUIRED: Default feature toggles
    showMapLabels: false,     // Street names OFF by default
    showBuildings: true,      // Buildings ON by default
    showParks: false,         // Parks OFF by default
    showWater: true,          // Water ON by default
    showRoads: true          // Roads ON by default
  },
  style: [
    // Paste Snazzy Maps JSON here
  ]
}
```

**CRITICAL**: Every style MUST include:
- `background`: A carefully chosen background color that complements the map
- `textColor`: A high-contrast text color for readability
- `defaultFeatures`: Feature toggle settings that load when style is selected

**DEFAULT FEATURE SETTINGS** for all new styles:
- ✅ Buildings: ON
- ✅ Water: ON
- ✅ Roads: ON
- ❌ Parks: OFF
- ❌ Street Names: OFF

These defaults create a clean, minimal look focusing on essential map elements.

### Step 4: Choose Background & Text Colors

#### Background Color Selection
- **Light styles**: Use off-white or very light tinted backgrounds
  - Example: `#faf8f6` (warm off-white) for Subtle style
- **Dark styles**: Use deep, rich backgrounds
  - Example: `#0a1929` (deep blue-black) for Midnight style
- **Colorful styles**: Use complementary light tints
  - Example: `#f4f7ea` (light green tint) for Avocado style

#### Text Color Selection
- **For light backgrounds**: Use dark colors (`#333333` to `#4a4a4a`)
- **For dark backgrounds**: Use white or off-white (`#ffffff` to `#f0f0f0`)
- **For colorful styles**: Use deeper versions of the theme color

## Style Conversion Process

### 1. Color Extraction

The converter extracts colors from Google Maps style rules:

```javascript
// Google Maps format
{
  "featureType": "water",
  "elementType": "geometry",
  "stylers": [
    { "color": "#aee2e0" }
  ]
}
```

### 2. Feature Mapping

Google Maps features are mapped to MapLibre layers:

| Google Maps Feature | MapLibre Layer | Notes |
|-------------------|----------------|-------|
| `landscape` | Background color | Main canvas background |
| `water` | water layer | Lakes, rivers, oceans |
| `road.highway` | highways layer | Motorways, major roads |
| `road.arterial` | arterial roads | Secondary roads |
| `road.local` | local roads | Residential streets |
| `poi` | POI fill layer | Points of interest |
| `poi.park` | Parks layer | Green spaces |
| `administrative` | Boundaries | City/state lines |

### 3. Element Type Handling

| Element Type | MapLibre Property | Usage |
|-------------|------------------|-------|
| `all` | varies | Applies to all sub-elements of feature |
| `geometry` | fill-color | Main feature color |
| `geometry.fill` | fill-color | Fill color specifically |
| `geometry.stroke` | line-color | Border/outline color |
| `labels.text.fill` | text-color | Label text color |
| `labels.text.stroke` | text-halo-color | Label outline |

**Important**: When `elementType` is `'all'`, the style applies to all aspects of that feature. The converter must handle this properly, especially for `landscape` and `water` features.

### 3.1 Text Label Layers (NEW)

The converter now creates symbol layers for displaying text labels:

| Label Type | Source Layer | Description | Text Size |
|------------|--------------|-------------|-----------|
| `place-city-labels` | place | City/town names | 20-36px |
| `place-suburb-labels` | place | Neighborhood names | 18px |
| `street-labels-highway` | transportation_name | Highway names | 17px |
| `street-labels-major` | transportation_name | Major street names | 15px |
| `street-labels-minor` | transportation_name | Minor street names | 13px |
| `poi-labels` | poi | Points of interest | 14px |
| `water-name-labels` | water_name | Water body names | 16px |

**Label Configuration**:
- Font: Open Sans (Regular/Semibold/Bold based on hierarchy)
- Text halos: 2-3px width for contrast
- Placement: Line-aligned for streets, centered for places
- Visibility controlled by `showMapLabels` toggle

### 4. Special Conversions

#### Visibility
```javascript
// Google: { "visibility": "off" }
// MapLibre: Exclude layer entirely or set opacity to 0
```

#### Lightness Adjustment
```javascript
// Google: { "lightness": 20 }
// Converter: Adjusts color brightness by percentage
```

## Color Conversion Logic

### Road Hierarchy
The converter maintains separate colors for road types:
- **Highways**: `highwayColor` - Usually brightest/most prominent
- **Arterial Roads**: `arterialColor` - Medium prominence
- **Local Roads**: `localRoadColor` - Least prominent

### Example: Avocado Style
```javascript
// Input (Google Maps)
"road.highway": { "color": "#EBF4A4" }  // Light yellow-green
"road.arterial": { "color": "#9BBF72" } // Medium green
"road.local": { "color": "#A4C67D" }    // Soft green

// Output (MapLibre)
highways: { 'line-color': '#EBF4A4' }
arterials: { 'line-color': '#9BBF72' }
local: { 'line-color': '#A4C67D' }
```

## Best Practices

### 1. Color Harmony
- Ensure background complements the map colors
- Avoid backgrounds that clash with water/land colors
- Test with different cities to ensure universal appeal

### 2. Contrast Guidelines
- Minimum contrast ratio of 4.5:1 for text
- Test readability with city names of different lengths
- Consider both coordinates and custom text visibility

### 3. Style Testing
Test each new style with:
- Coastal city (to see water)
- Inland city (to see roads/parks)
- Dense urban area (to see all road types)
- Different zoom levels (10-16)

### 4. Performance
- Styles are cached after first conversion
- Keep style rules concise
- Avoid redundant rules that don't affect appearance

## Common Issues & Solutions

### Issue: Colors Don't Match Snazzy Maps Screenshot
**Cause**: Incomplete feature mapping or incorrect element type handling
**Solution**: 
1. Check that `elementType: 'all'` is properly handled in the converter
2. Ensure all road types (highway, arterial, local) have separate color variables
3. Verify POI and park colors are handled distinctly
4. Compare the screenshot with the rendered map to identify mismatched features

### Issue: Background Color Not Specified
**Cause**: Missing required background color in style definition
**Solution**: Every style MUST include a background color that:
- Complements the map's color scheme
- Provides sufficient contrast with map elements
- Creates an aesthetically pleasing poster

### Issue: Text Not Readable
**Cause**: Missing or poor text color choice
**Solution**: Every style MUST include a text color that:
- Has minimum 4.5:1 contrast ratio with background
- Remains readable for both city names and coordinates
- Works well with the overall color scheme

### Issue: Missing Features
**Cause**: MapLibre data source differences
**Solution**: Some Google features may not exist in OpenStreetMap data

## Style Families

### Architectural Print Series
A collection of technical drawing-inspired styles with clean white backgrounds and single-color roads:
- **Blueprint 2**: Classic blue architectural style (Buildings & Roads only)
- **Redprint**: Red architectural schematic
- **Greenprint**: Forest green technical drawing
- **Blackprint**: Monochrome black and white
- **Orangeprint**: Vibrant orange schematic
- **Purpleprint**: Royal purple technical style
- **Cyanprint**: Modern cyan blue
- **Pinkprint**: Hot pink architectural
- **Brownprint**: Earth brown technical
- **Indigoprint**: Deep indigo schematic

### City-Inspired Collection
Styles inspired by iconic cities around the world:
- **Rome**: Warm cream and golden tones - classic Italian elegance
- **Rio de Janeiro**: Tropical mint and yellow with turquoise water
- **New York Style**: Soft coral pink with teal water - metropolitan
- **San Francisco**: Dark navy land with golden yellow water - California sunset

### Nature & Coastal Styles
- **Salmon Sky**: Soft salmon pink with cyan water and white roads
- **Lavenders**: Dreamy lavender palette with periwinkle water
- **Classic**: Soft lavender land with periwinkle water (enhanced version)
- **Emerald Coast**: Rich emerald green water with warm brown land
- **Terra**: Warm terracotta land with deep teal water
- **Blush Coast**: Soft blush pink land with turquoise water
- **Sage Garden**: Beige land with mint green roads and teal water
- **Peach Sunset**: Light peach land with white roads
- **Coral Dusk**: Soft coral land with navy water

### Dramatic Two-Tone Series
High-contrast styles with bold color combinations:
- **Crimson Tide**: Bold red land with dark navy water (buildings & water only)
- **Emerald Night**: Vibrant green land on midnight background (buildings & water only)
- **Neon Pink**: Complete map with electric pink colors
- **Neon Red**: Red roads on yellow background
- **Neon Dark**: Black background with vibrant neon roads
- **Orange Noir**: Orange roads on black background

### Monochrome & Minimal
- **Noir**: Pure black and white contrast
- **Figure Ground**: Classic architectural diagram (black land, white water/roads)
- **Rose Petal**: Soft pink monochrome theme
- **Avocado**: Fresh green palette

## Style Examples

### Dark Style Template
```typescript
darkStyle: {
  name: 'Dark Style Name',
  background: '#1a1a1a',  // Very dark
  textColor: '#ffffff',    // White text
  defaultFeatures: {
    showMapLabels: false,
    showBuildings: true,
    showParks: false,
    showWater: true,
    showRoads: true
  },
  style: [...]
}
```

### Light Style Template
```typescript
lightStyle: {
  name: 'Light Style Name',
  background: '#fafafa',  // Off-white
  textColor: '#333333',   // Dark gray text
  defaultFeatures: {
    showMapLabels: false,
    showBuildings: true,
    showParks: false,
    showWater: true,
    showRoads: true
  },
  style: [...]
}
```

### Colorful Style Template
```typescript
colorfulStyle: {
  name: 'Colorful Style Name',
  background: '#f0f8ff',  // Light tinted
  textColor: '#2c3e50',   // Complementary dark
  defaultFeatures: {
    showMapLabels: false,
    showBuildings: true,
    showParks: false,
    showWater: true,
    showRoads: true
  },
  style: [...]
}
```

### Custom Feature Settings Example
```typescript
natureStyle: {
  name: 'Nature Focus',
  background: '#f0f8e8',
  textColor: '#2d5a2d',
  defaultFeatures: {
    showMapLabels: true,   // Show labels for nature areas
    showBuildings: false,  // Hide buildings
    showParks: true,       // Emphasize parks
    showWater: true,       // Show water bodies
    showRoads: false       // Minimize road visibility
  },
  style: [...]
}
```

## Testing Checklist

When adding a new style, verify:

- [ ] **Screenshot comparison**: Colors match the Snazzy Maps preview
- [ ] **Background color**: Specified and complements the map style
- [ ] **Text color**: Specified with sufficient contrast (≥4.5:1 ratio)
- [ ] **Default features**: `defaultFeatures` object is included with all 5 toggles
- [ ] **Feature toggles work**: Selecting style updates UI toggles correctly
- [ ] **Color accuracy**: All features render with correct colors from JSON
- [ ] Roads show proper hierarchy (highway > arterial > local)
- [ ] Water features match the screenshot color
- [ ] Parks/green spaces render correctly (if enabled)
- [ ] POI colors are accurate
- [ ] Buildings display correctly (if enabled)
- [ ] Street names appear/hide based on toggle
- [ ] Style works at different zoom levels
- [ ] Preview matches export quality
- [ ] Style name and description are clear

## Future Improvements

1. **Dynamic Background Generation**: Automatically calculate optimal background from map colors
2. **Style Variants**: Light/dark versions of each style
3. **Custom Style Builder**: UI for creating custom color schemes
4. **Style Presets**: Time-based (day/night) or season-based variations
5. **AI Color Suggestions**: ML-based optimal color selection

## Resources

- [Snazzy Maps](https://snazzymaps.com/) - Source for Google Maps styles
- [MapLibre Style Spec](https://maplibre.org/maplibre-gl-js-docs/style-spec/) - MapLibre documentation
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/) - Accessibility tool
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/) - Understanding map features

---

**Last Updated**: January 2025
**Version**: 1.4
**Maintainer**: Development Team

## Changelog

### Version 1.4 (January 2025 - Latest)
- Added 9 new city-inspired styles (Rome, Rio de Janeiro, New York Style, San Francisco, and more)
- Added nature-inspired styles (Salmon Sky, Lavenders, Classic, Emerald Coast, Terra)
- Added vibrant styles (Blush Coast, Sage Garden, Peach Sunset, Coral Dusk)
- Added dramatic two-tone styles (Crimson Tide, Emerald Night)
- Removed deprecated styles (cleanGray, forest, neonUrban, liverpool)
- Updated Sage Garden with mint green roads and darker green buildings
- Fixed color accuracy issues in multiple styles
- Total styles now: 50+

### Version 1.3 (January 2025)
- Added 15+ new map styles including architectural print series
- Created specialized style families (Print series, Neon series)
- Updated default feature toggles for multiple existing styles
- Removed deprecated styles (midnight, yellowprint, tealprint)
- Enhanced color consistency across style families
- Improved text color contrast ratios for better readability

### Version 1.2 (December 2024)
- Added `defaultFeatures` configuration for automatic feature toggle settings
- Documented LLM workflow for adding new styles
- Established default feature settings (Buildings, Water, Roads ON; Parks, Street Names OFF)
- Updated all style templates to include defaultFeatures
- Added feature toggle testing to checklist

### Version 1.1 (December 2024)
- Added screenshot analysis process for color verification
- Emphasized requirement for background and text colors
- Added handling for `elementType: 'all'` in converter
- Improved troubleshooting for color mismatch issues