# Map Poster Generator (MPG)

## Overview

The Map Poster Generator (MPG) is a comprehensive, feature-rich system for creating customizable map posters. It was successfully migrated from the YourMapArt Vite/Express project to this Next.js 15 boilerplate in January 2025.

## Features

- **50+ Map Styles**: From minimalist to vintage, including custom Snazzy Maps integration
- **WYSIWYG Canvas Preview**: Real-time Konva.js rendering with pixel-perfect export
- **Advanced Customization**:
  - Location search with MapTiler integration
  - 36+ fonts with local files + CDN fallback
  - Multiple frame styles (square, circle, heart, house)
  - 16 glow effects
  - Custom text, headlines, coordinates
  - Map feature toggles (labels, buildings, parks, water, roads)
- **Template System**: Pre-configured templates for popular cities
- **Export Formats**: PNG, JPG, PDF with high-DPI support
- **Dual Editors**:
  - **Basic Editor** (`/mpg/personalize`): Simplified 2-page flow for quick customization
  - **Advanced Editor** (`/mpg`): Full 4-step wizard with all features

## Routes

| Route | Description | Component |
|-------|-------------|-----------|
| `/mpg-templates` | Template gallery | Template selection page |
| `/mpg/personalize?template=X` | Basic editor | Simple customization flow |
| `/mpg?template=X` | Advanced editor | Full feature 4-step wizard |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/get-templates` | GET | Returns all template metadata |
| `/api/mpg/overpass` | POST | Proxies OpenStreetMap data requests |

## Architecture

### Client-Side Components
- **Location**: `src/components/mpg/`
- **Count**: 18 main components + 5 UI components
- **Key Components**:
  - `MPG-builder.tsx` - Advanced editor orchestrator
  - `MPG-basic-editor.tsx` - Simple editor
  - `MPG-konva-preview.tsx` - WYSIWYG canvas preview
  - `MPG-wizard-stepper.tsx` - 4-step navigation

### Libraries & Services
- **Location**: `src/lib/mpg/`
- **Count**: 22 library files
- **Key Services**:
  - `MPG-store.ts` - Zustand state management
  - `MPG-maplibre-service.ts` - Vector map rendering
  - `MPG-snazzy-styles.ts` - 50+ style definitions
  - `MPG-konva-export.ts` - Canvas export with 7 strategies
  - `MPG-templates.ts` - Template management

### Assets
- **Location**: `public/mpg/`
- **Contents**:
  - `fonts/` - 49 font files (TTF, WOFF2)
  - `frames/` - Frame SVG files
  - `templates/json/` - 10 template JSON files
  - `template-previews/` - Gallery thumbnails
  - `Textures/` - Background textures

## Documentation

Detailed documentation is available in the `/docs/mpg/` directory:

### Core Documentation
- **[MPG-README.md](./mpg/MPG-README.md)** - Main API documentation and component reference
- **[MPG-TECHNICAL-SUMMARY.md](./mpg/MPG-TECHNICAL-SUMMARY.md)** - Architecture overview and technical details
- **[MPG-MAP-POSTER-GUIDE.md](./mpg/MPG-MAP-POSTER-GUIDE.md)** - User guide for creating map posters

### Feature Guides
- **[MPG-STYLE-GENERATION-GUIDE.md](./mpg/MPG-STYLE-GENERATION-GUIDE.md)** - How to create and add new map styles
- **[TEMPLATE-SYSTEM-DOCUMENTATION.md](./mpg/TEMPLATE-SYSTEM-DOCUMENTATION.md)** - Template system architecture
- **[WYSIWYG-Fonts.md](./mpg/WYSIWYG-Fonts.md)** - Font system and loading strategy
- **[Export-WYSIWYG-Konvajs.md](./mpg/Export-WYSIWYG-Konvajs.md)** - Canvas export implementation

### Changelog
- **[RECENT-UPDATES-JAN-2025.md](./mpg/RECENT-UPDATES-JAN-2025.md)** - Latest updates and improvements
- **[UPDATES-JANUARY-2025-06.md](./mpg/UPDATES-JANUARY-2025-06.md)** - Update log (Jan 6, 2025)
- **[UPDATES-JANUARY-2025-07.md](./mpg/UPDATES-JANUARY-2025-07.md)** - Update log (Jan 7, 2025)

### Migration Documentation
- **[MPG-MIGRATION-PLAN.md](../MPG-MIGRATION-PLAN.md)** - Complete 11-phase migration plan
- **[MPG-MIGRATION-PHASE1-4.md](../MPG-MIGRATION-PHASE1-4.md)** - Phases 1-4 completion report

## Technology Stack

### Core Dependencies
- **konva** (v10.0.2) - Canvas rendering engine
- **react-konva** (v19.0.10) - React bindings for Konva
- **maplibre-gl** (v5.8.0) - Vector map rendering
- **leaflet** (v1.9.4) - Raster map support
- **d3** (v7.9.0) - SVG map manipulation
- **jspdf** (v3.0.3) - PDF export
- **zustand** (v5.0.8) - State management

### External Services
- **MapTiler API** - Vector map tiles, location search (Required)
- **Overpass API** - OpenStreetMap data (via proxy)

## Configuration

### Environment Variables
```env
# MapTiler API Key (REQUIRED)
NEXT_PUBLIC_MAPTILER_API_KEY=your_key_here

# Optional: Astronomy API (for future sky features)
ASTRONOMY_API_ID=
ASTRONOMY_API_SECRET=
```

### Next.js Config
The following configuration is required in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  transpilePackages: ['konva', 'react-konva'],
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'canvas'];
    return config;
  }
};
```

## Quick Start

1. **Get MapTiler API Key**: Sign up at https://maptiler.com
2. **Add to `.env`**: `NEXT_PUBLIC_MAPTILER_API_KEY=your_key_here`
3. **Navigate to Templates**: http://localhost:3000/mpg-templates
4. **Choose a Template**: Click any template to personalize
5. **Customize**: Use the basic or advanced editor
6. **Export**: Download as PNG, JPG, or PDF

## Development

### Adding New Map Styles
See [MPG-STYLE-GENERATION-GUIDE.md](./mpg/MPG-STYLE-GENERATION-GUIDE.md) for detailed instructions on:
- Creating Snazzy Maps styles
- Converting to MapLibre format
- Adding to the style registry

### Creating New Templates
See [TEMPLATE-SYSTEM-DOCUMENTATION.md](./mpg/TEMPLATE-SYSTEM-DOCUMENTATION.md) for:
- Template JSON structure
- Creating template snapshots
- Adding thumbnails

### Modifying Export Behavior
See [Export-WYSIWYG-Konvajs.md](./mpg/Export-WYSIWYG-Konvajs.md) for:
- Export strategy architecture
- Fixed base canvas system
- High-DPI rendering

## State Management

MPG uses an isolated Zustand store (`MPG-store.ts`) that manages:
- Location data (lat, lng, zoom, offsets)
- Text configurations (headline, city, coordinates, custom)
- Style settings (map style, frame, glow, background)
- Map features (labels, buildings, parks, water, roads)
- Export options (format, size, quality)

## Migration Notes

The MPG system was containerized with the `MPG-` prefix to:
- Avoid naming conflicts with the main application
- Enable easy identification of MPG-specific files
- Maintain clear separation of concerns

All MPG assets are stored under `/public/mpg/` for the same reasons.

## Future Integration

### Database Integration (Phase 9)
- Save user templates to Drizzle ORM
- User template gallery
- Template sharing

### Authentication Integration (Phase 10)
- Connect to Better Auth
- User-specific template management
- Premium features

### Payment Integration (Phase 11)
- Stripe checkout for premium exports
- High-resolution downloads
- Commercial licensing

## Troubleshooting

### Konva not rendering
- Ensure `'use client'` directive is present
- Check `next.config.ts` has Konva transpilation

### Map tiles not loading
- Verify `NEXT_PUBLIC_MAPTILER_API_KEY` is set correctly
- Check browser console for API errors

### Fonts not loading
- Verify `/public/mpg/fonts/` directory exists
- Check font files are present and accessible

### Build errors
- Ensure all dependencies are installed
- Run `npm run build` to check for TypeScript errors

## Support

For issues or questions:
- Review detailed documentation in `/docs/mpg/`
- Check migration documentation for known issues
- Review the original YourMapArt project for reference

---

**Migration Status**: ✅ Complete (Phases 1-7)
**Last Updated**: January 2025
**Framework**: Next.js 15 + React 19
**Source Project**: YourMapArt (Vite + Express)
