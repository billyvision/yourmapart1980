# MPG Migration Plan: YourMapArt → Next.js Boilerplate

## 🎯 Migration Strategy
Import the Map Poster Generator (MPG) from the Vite/Express project into the Next.js 15 boilerplate, containerizing all MPG files with proper prefixes and adapting from client-side routing (Wouter) to Next.js App Router.

---

## 📦 PHASE 1: Dependencies & Configuration

### Step 1.1: Install MPG-Specific Dependencies
**Action**: Add map/canvas rendering packages
```bash
npm install konva react-konva maplibre-gl leaflet react-leaflet d3 jspdf html2canvas zustand
npm install -D @types/leaflet @types/d3
```

**Packages Needed**:
- `konva` + `react-konva`: Canvas rendering for WYSIWYG preview
- `maplibre-gl`: Vector map rendering (50+ styles)
- `leaflet` + `react-leaflet`: Raster map support
- `d3`: SVG map manipulation
- `jspdf`: PDF export
- `html2canvas`: Image export fallback
- `zustand`: MPG state management (isolated from main app)

### Step 1.2: Update next.config.ts
**Action**: Add external packages for server-side compatibility
```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ['konva', 'react-konva'],
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas'];
    return config;
  }
}
```

### Step 1.3: Create Environment Variables
**Action**: Add to `.env`
```
# MapTiler API (for vector maps)
NEXT_PUBLIC_MAPTILER_API_KEY=your_key_here

# Optional: Astronomy API (if adding sky features later)
ASTRONOMY_API_ID=
ASTRONOMY_API_SECRET=
```

---

## 📁 PHASE 2: File Structure Setup

### Step 2.1: Create MPG Directory Structure
**Action**: Create Next.js-compatible folder structure
```
src/
├── app/
│   ├── mpg/                          # NEW
│   │   ├── page.tsx                  # /mpg route (Advanced Editor)
│   │   └── personalize/              # NEW
│   │       └── page.tsx              # /mpg/personalize route (Basic Editor)
│   └── mpg-templates/                # NEW
│       └── page.tsx                  # /mpg-templates route
├── components/
│   └── mpg/                          # NEW - All MPG components (23 files)
│       ├── MPG-builder.tsx
│       ├── MPG-basic-editor.tsx
│       ├── MPG-location-form.tsx
│       ├── MPG-text.tsx
│       ├── MPG-style-and-settings.tsx
│       ├── MPG-konva-preview.tsx
│       ├── MPG-wizard-stepper.tsx
│       └── ui/                       # MPG-specific UI components
│           ├── MPG-accordion-manager.tsx
│           ├── MPG-compact-style-grid.tsx
│           └── ...
├── lib/
│   └── mpg/                          # NEW - MPG business logic (21 files)
│       ├── MPG-store.ts              # Zustand state
│       ├── MPG-constants.ts
│       ├── MPG-snazzy-styles.ts      # 50+ map styles
│       ├── MPG-style-converter.ts
│       ├── MPG-maplibre-service.ts
│       ├── MPG-konva-export.ts
│       └── MPG-templates.ts          # Template definitions
└── public/
    └── mpg/                          # NEW - MPG assets
        ├── fonts/                    # 36 custom fonts
        ├── frames/                   # Frame images
        ├── templates/                # Template previews
        └── template-previews/        # Gallery thumbnails
```

---

## 📥 PHASE 3: Component Migration

### Step 3.1: Copy Core MPG Components (23 files)
**Source**: `/mnt/c/Bilal-Files/Websites/YourMapArt/yourmapart/client/src/components/mpg/`
**Destination**: `./src/components/mpg/`

**Files to Copy**:
1. `MPG-builder.tsx` - Main orchestrator ✅
2. `MPG-basic-editor.tsx` - Simple editor ✅
3. `MPG-basic-personalize.tsx` - Basic form ✅
4. `MPG-basic-download.tsx` - Basic download ✅
5. `MPG-wizard-stepper.tsx` - Step navigation ✅
6. `MPG-location-form.tsx` - Step 1 ✅
7. `MPG-text.tsx` - Step 2 ✅
8. `MPG-style-and-settings.tsx` - Step 3 ✅
9. `MPG-konva-export-options.tsx` - Step 4 ✅
10. `MPG-konva-preview.tsx` - Live preview ✅
11. `MPG-konva-mobile-preview.tsx` - Mobile PiP ✅
12. `MPG-pin-icons.tsx` - Pin SVGs ✅
13. `MPG-controls.tsx` - Map controls ✅
14. **UI Components** (in `ui/` subfolder):
    - `MPG-accordion-manager.tsx`
    - `MPG-accordion-section.tsx`
    - `MPG-compact-style-grid.tsx`
    - `MPG-compact-toggle.tsx`

**Migration Changes Required**:
- Replace `wouter` imports (`useLocation`, `useSearch`) with Next.js `useRouter`, `useSearchParams`
- Change `@/` path alias references (already compatible)
- Convert any client-side only code to use `'use client'` directive

### Step 3.2: Copy MPG Library Files (21 files)
**Source**: `/mnt/c/Bilal-Files/Websites/YourMapArt/yourmapart/client/src/lib/mpg/`
**Destination**: `./src/lib/mpg/`

**Files to Copy**:
1. `MPG-store.ts` - Zustand state management ✅
2. `MPG-constants.ts` - Configuration constants ✅
3. `MPG-konva-constants.ts` - Canvas constants ✅
4. `MPG-konva-glow-effects.ts` - 16 glow effects ✅
5. `MPG-snazzy-styles.ts` - 50+ map styles ✅
6. `MPG-style-converter.ts` - Google Maps → MapLibre ✅
7. `MPG-maplibre-snazzy-adapter.ts` - Style integration ✅
8. `MPG-maplibre-service.ts` - MapLibre GL service ✅
9. `MPG-maplibre-renderer.tsx` - Map rendering hook ✅
10. `MPG-maplibre-styles.ts` - Style definitions ✅
11. `MPG-map-service.ts` - Map utilities ✅
12. `MPG-templates.ts` - Template loader ✅
13. `MPG-konva-filters.ts` - Canvas filters ✅
14. **Export Strategies** (6 files):
    - `MPG-konva-export.ts` (primary)
    - `MPG-export-wysiwyg.ts`
    - `MPG-export-final.ts`
    - `MPG-export-reliable.ts`
    - `MPG-export-enhanced.ts`
    - `MPG-export-exact.ts`

**Migration Changes Required**:
- All files should work as-is (pure TypeScript/React)
- Add `'use client'` to any files using browser APIs

### Step 3.3: Copy Font Registry
**Source**: `/mnt/c/Bilal-Files/Websites/YourMapArt/yourmapart/client/src/lib/fonts/font-registry.ts`
**Destination**: `./src/lib/mpg/MPG-font-registry.ts`

**Contains**: 36 font definitions with local files + CDN fallback

---

## 🎨 PHASE 4: Asset Migration

### Step 4.1: Copy Public Assets
**Source**: `/mnt/c/Bilal-Files/Websites/YourMapArt/yourmapart/client/public/`
**Destination**: `./public/mpg/`

**Folders to Copy**:
1. `fonts/` - 36 custom font files (local loading)
2. `frames/` - Frame images (circle, heart, house, square)
3. `templates/` - Template JSON files
4. `template-previews/` - Gallery thumbnails
5. `Textures/` - Background textures (if used)

**Action**: Create `/public/mpg/` and copy all subdirectories

### Step 4.2: Update Asset Paths
**Action**: Update all `public/` references to `/mpg/`
- In components: `/fonts/` → `/mpg/fonts/`
- In templates: `/template-previews/` → `/mpg/template-previews/`

---

## 🛣️ PHASE 5: Route Creation (Next.js App Router)

### Step 5.1: Create Advanced Editor Page
**File**: `./src/app/mpg/page.tsx`
```tsx
'use client'
import { MPGBuilder } from '@/components/mpg/MPG-builder'
import { useSearchParams } from 'next/navigation'

export default function MPGPage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')

  return <MPGBuilder templateId={templateId} />
}
```

### Step 5.2: Create Basic Editor Page
**File**: `./src/app/mpg/personalize/page.tsx`
```tsx
'use client'
import { MPGBasicEditor } from '@/components/mpg/MPG-basic-editor'
import { useSearchParams } from 'next/navigation'

export default function PersonalizePage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')

  return <MPGBasicEditor templateId={templateId} />
}
```

### Step 5.3: Create Templates Gallery Page
**File**: `./src/app/mpg-templates/page.tsx`
```tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadTemplates, type MapTemplate } from '@/lib/mpg/MPG-templates'
import { Button } from '@/components/ui/button'

export default function MPGTemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<MapTemplate[]>([])

  useEffect(() => {
    loadTemplates().then(setTemplates)
  }, [])

  const handleTemplateClick = (templateId: string) => {
    router.push(`/mpg/personalize?template=${templateId}`)
  }

  return (
    // ... template gallery UI
  )
}
```

### Step 5.4: Update Home Page CTA
**File**: `./src/app/page.tsx`
```tsx
// Change button to link to MPG
<Button size="lg" onClick={() => router.push('/mpg')}>
  Create Your Map Art
</Button>
```

---

## 🔌 PHASE 6: API Routes (Next.js API Routes)

### Step 6.1: Create Map Proxy Route
**File**: `./src/app/api/mpg/overpass/route.ts`
```ts
// Copy logic from server/routes/map-proxy.ts
export async function POST(req: Request) {
  const { query } = await req.json()

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`
  })

  const data = await response.json()
  return Response.json(data)
}
```

### Step 6.2: Create Template Save Route (Future)
**File**: `./src/app/api/mpg/templates/route.ts`
```ts
// For saving user templates to database (Phase 7)
export async function POST(req: Request) {
  // Save template logic here
}
```

**Note**: Skip Supabase/auth routes - will connect to Drizzle later

---

## 📝 PHASE 7: Documentation Migration

### Step 7.1: Copy MPG Documentation
**Source**: `/mnt/c/Bilal-Files/Websites/YourMapArt/yourmapart/Documents/MPG-MapPoster/`
**Destination**: `./docs/mpg/`

**Files to Copy**:
1. `MPG-README.md` - Main documentation ✅
2. `MPG-TECHNICAL-SUMMARY.md` - Architecture docs ✅
3. `MPG-MAP-POSTER-GUIDE.md` - User guide ✅
4. `MPG-STYLE-GENERATION-GUIDE.md` - Style creation ✅
5. `TEMPLATE-SYSTEM-DOCUMENTATION.md` - Templates ✅
6. `RECENT-UPDATES-JAN-2025.md` - Changelog ✅

**Also Copy**:
7. `../WYSIWYG-Fonts.md` - Font system docs ✅
8. `../Export-WYSIWYG-Konvajs.md` - Export guide ✅

### Step 7.2: Create Main MPG.md
**File**: `./docs/MPG.md`
```md
# Map Poster Generator (MPG)

## Overview
Imported from YourMapArt project. See `/docs/mpg/` for detailed documentation.

## Quick Links
- [Technical Summary](./mpg/MPG-TECHNICAL-SUMMARY.md)
- [User Guide](./mpg/MPG-MAP-POSTER-GUIDE.md)
- [API Documentation](./mpg/MPG-README.md)

## Routes
- `/mpg` - Advanced Editor
- `/mpg/personalize` - Basic Editor
- `/mpg-templates` - Template Gallery
```

---

## 🚫 PHASE 8: Exclusions (DO NOT COPY)

### Files to Skip
**Reason**: Not related to MPG or using different tech

#### Components (Skip NSK, SKY, NSD):
- ❌ `/components/nsk/` - Night sky feature (different product)
- ❌ `/components/sky/` - Under This Sky feature (different product)
- ❌ `/components/nsd/` - Night sky designs (different product)
- ❌ `/components/auth/` - Using Better Auth instead
- ❌ `/components/dashboard/` - Will build new with boilerplate auth
- ❌ `/components/landing/` - Will use boilerplate homepage
- ❌ `/components/shared/` - (header, footer, nav) - Will use boilerplate layout

#### Pages (Skip non-MPG):
- ❌ `sky-night-poster.tsx`
- ❌ `nsk-poster.tsx`
- ❌ `night-sky-designs.tsx`
- ❌ `create-design.tsx` (word cloud feature)
- ❌ `template-generator.tsx` (word cloud templates)
- ❌ `home.tsx` - Using boilerplate home
- ❌ `templates.tsx` - Non-MPG templates
- ❌ All test pages (`test-*.tsx`, `admin-login-test.tsx`)

#### Server Routes (Skip):
- ❌ `server/routes/sky.ts` - Astronomy API (different feature)
- ❌ `server/routes/auth-log.ts` - Old auth system
- ❌ `server/routes/save-template.ts` - Will rewrite for Drizzle

#### Libraries (Skip):
- ❌ `/lib/nsk/` - Night sky library
- ❌ `/lib/sky/` - Sky library
- ❌ Anything with Supabase references

#### Documentation (Skip):
- ❌ `/Documents/NSK-NightSky/`
- ❌ `/Documents/SKY-UnderThisSky/`
- ❌ `/Documents/Backend-Docs/` (Supabase-specific)
- ❌ `/Documents/MCPs/supabase-mcp.md`
- ❌ `Backend.md` (outdated architecture)

#### Assets (Skip):
- ❌ `myLogo.png` - Will use boilerplate branding
- ❌ `testimonials/` - Not MPG-related

---

## ⚙️ PHASE 9: Configuration & Adaptation

### Step 9.1: Update Import Paths
**Action**: Find & replace in all MPG files
- `wouter` → Next.js navigation hooks:
  ```ts
  // OLD (Wouter)
  import { useLocation, useSearch } from 'wouter'
  const [, setLocation] = useLocation()
  const search = useSearch()

  // NEW (Next.js)
  import { useRouter, useSearchParams } from 'next/navigation'
  const router = useRouter()
  const searchParams = useSearchParams()
  ```

**Files Affected**:
- `MPG-builder.tsx`
- `MPG-basic-editor.tsx`
- Any component using routing

### Step 9.2: Add Client Directives
**Action**: Add `'use client'` to components using:
- `useState`, `useEffect`, `useRef`
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers (`onClick`, `onChange`)

**Files Needing 'use client'**:
- All MPG components (`/components/mpg/*.tsx`)
- All MPG pages (`/app/mpg/**/page.tsx`)
- Store files (`MPG-store.ts`)
- Any component using Konva/canvas APIs

### Step 9.3: Update API Calls
**Action**: Update fetch URLs in components
```ts
// OLD
fetch('/api/overpass', { ... })

// NEW
fetch('/api/mpg/overpass', { ... })
```

### Step 9.4: Configure Tailwind for MPG
**File**: `./tailwind.config.ts`
```ts
// MPG uses default Tailwind
// Add custom colors from YourMapArt if needed
extend: {
  colors: {
    'sage-green': {
      DEFAULT: '#8FA98E',
      dark: '#7A9479',
      light: '#A4BEA3',
    },
    'warm-cream': '#F5F1E8',
    // ... other custom colors from YourMapArt
  }
}
```

---

## 🧪 PHASE 10: Testing & Validation

### Step 10.1: Build Test
```bash
npm run build
```
**Expected**: No TypeScript errors, successful build

### Step 10.2: Runtime Test Checklist
- [ ] Navigate to `/mpg` - Advanced editor loads
- [ ] Navigate to `/mpg-templates` - Template gallery displays
- [ ] Click template → redirects to `/mpg/personalize?template=X`
- [ ] Basic editor shows template data
- [ ] Location search works (MapTiler API)
- [ ] Map renders with selected style
- [ ] Text customization updates preview
- [ ] Style selection changes map
- [ ] Export PNG downloads correctly
- [ ] All 50+ styles load without errors
- [ ] Fonts load correctly (36 fonts)
- [ ] Glow effects render
- [ ] Frame styles work (square, circle, heart, house)

### Step 10.3: Verify Asset Loading
```bash
# Check fonts load
curl http://localhost:3000/mpg/fonts/Montserrat-Bold.ttf

# Check templates load
curl http://localhost:3000/mpg/templates/template-1.json
```

### Step 10.4: Performance Check
- [ ] Map renders < 3 seconds
- [ ] Style switching < 100ms
- [ ] Export PNG < 5 seconds
- [ ] No console errors
- [ ] No missing asset warnings

---

## 🔗 PHASE 11: Integration Points (Future)

### Step 11.1: Connect to Better Auth (Later)
**When**: After auth is set up
```ts
// In MPG-builder.tsx
const { user } = useAuth() // Better Auth hook
// Save template to user account
```

### Step 11.2: Connect to Drizzle DB (Later)
**Schema Addition**:
```ts
// In src/lib/schema.ts
export const mpgTemplates = pgTable("mpg_templates", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  templateName: text("template_name").notNull(),
  templateData: json("template_data").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
})
```

### Step 11.3: Add Payment Integration (Later)
**Route**: `./src/app/api/mpg/checkout/route.ts`
```ts
// Stripe integration for premium exports
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  // Create checkout session for MPG premium features
}
```

---

## 📊 Migration Summary

### Files to Copy: ~70 files
- **Components**: 23 files (`/components/mpg/`)
- **Libraries**: 21 files (`/lib/mpg/`)
- **Assets**: ~100+ files (fonts, frames, templates)
- **Documentation**: 8 markdown files
- **API Routes**: 1 route (`/api/mpg/overpass/`)
- **App Routes**: 3 pages (`/mpg`, `/mpg/personalize`, `/mpg-templates`)

### Files to Skip: ~50 files
- NSK/SKY/NSD components (30+ files)
- Test pages (8 files)
- Supabase/auth files (10+ files)
- Outdated docs (2 files)
- Landing/shared components (5 files)

### Dependencies to Install: 10 packages
- Map/Canvas: `konva`, `react-konva`, `maplibre-gl`, `leaflet`, `react-leaflet`, `d3`
- Export: `jspdf`, `html2canvas`
- State: `zustand`

### API Keys Required:
1. **MapTiler API Key** (required) - Get from https://maptiler.com
   - Used for: Vector map tiles, location search
2. **Astronomy API** (optional - skip for now) - Only if adding sky features later

---

## ✅ Success Criteria

### Phase 1-9 Complete When:
- [ ] All MPG dependencies installed
- [ ] MPG folder structure created
- [ ] All 44 MPG files copied and adapted
- [ ] All 100+ assets migrated to `/public/mpg/`
- [ ] Routes working (`/mpg`, `/mpg/personalize`, `/mpg-templates`)
- [ ] No build errors
- [ ] Documentation copied to `/docs/mpg/`

### Phase 10 Complete When:
- [ ] Can create map poster end-to-end
- [ ] All 50+ styles render correctly
- [ ] Export PNG/JPG/PDF works
- [ ] Template system functional
- [ ] Mobile preview works

### Ready for Phase 11 When:
- User authentication working (Better Auth)
- Database migrations run (Drizzle)
- Ready to save user templates

---

## 🚀 Execution Order

1. **PHASE 1**: Install dependencies (5 min)
2. **PHASE 2**: Create folder structure (2 min)
3. **PHASE 3**: Copy components & libraries (10 min)
4. **PHASE 4**: Copy assets (5 min)
5. **PHASE 5**: Create routes (10 min)
6. **PHASE 6**: Create API routes (5 min)
7. **PHASE 7**: Copy documentation (3 min)
8. **PHASE 9**: Adapt imports & add 'use client' (15 min)
9. **PHASE 10**: Test & validate (20 min)

**Total Estimated Time**: ~75 minutes

---

## ⚠️ Important Notes

1. **No Database Changes Yet**: MPG will work without auth/database. We'll connect later.
2. **API Key Required**: Get MapTiler key before testing map rendering
3. **Client-Side Only**: All MPG components are client-side (`'use client'`)
4. **Isolated State**: MPG uses its own Zustand store, won't conflict with main app
5. **Next.js Compatibility**: All Vite/Express code will be adapted to Next.js patterns
6. **Prefix Convention**: All MPG files maintain `MPG-` prefix for easy identification
7. **Shared UI Components**: MPG can use boilerplate's shadcn/ui components (already compatible)

---

## 🔍 Troubleshooting Guide

### Issue: Konva not rendering
**Solution**: Ensure `'use client'` directive is added to components using Konva

### Issue: Map tiles not loading
**Solution**: Check `NEXT_PUBLIC_MAPTILER_API_KEY` is set correctly

### Issue: Fonts not loading
**Solution**: Verify `/public/mpg/fonts/` directory exists and fonts are copied

### Issue: Import errors for 'wouter'
**Solution**: Replace all wouter imports with Next.js navigation hooks

### Issue: Build fails on Konva
**Solution**: Add Konva to `transpilePackages` in `next.config.ts`

---

**Migration Plan Created**: January 2025
**Target Framework**: Next.js 15 + React 19
**Source Project**: YourMapArt (Vite + Express)
**Status**: Ready for execution ✅
