# YourMapArt1980 - Website Documentation

## Table of Contents
- [Overview](#overview)
- [User Roles & Permissions](#user-roles--permissions)
- [User Flow](#user-flow)
- [Key Features](#key-features)
- [Page Structure](#page-structure)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Tech Stack](#tech-stack)
- [Business Model](#business-model)

---

## Overview

**YourMapArt1980** is a Map Poster Generator (MPG) web application that enables users to create personalized, artistic map posters of meaningful locations. The platform transforms special places into beautiful wall art with extensive customization options.

### Core Value Proposition
- Transform meaningful locations into stunning artistic map posters
- Instant digital downloads with print-ready quality (300 DPI)
- 35+ artistic color themes and multiple frame styles
- Fully customizable: map styles, text, coordinates, colors, fonts, and more

### Use Cases
- Anniversary gifts (where you met, got engaged, married)
- New home celebrations
- Travel memories and favorite vacation spots
- Graduation milestones and hometown pride
- Family heritage and roots
- Business locations and corporate gifts

---

## User Roles & Permissions

### 1. Regular User (`role: "user"`)

**Default role** for all new sign-ups via Google OAuth.

#### Access & Capabilities:
- ✅ Browse admin-curated templates
- ✅ Create custom map designs in Map Studio
- ✅ Save templates to personal account
- ✅ Export maps (tracked in export history)
- ✅ View personal templates and order history
- ✅ Manage profile settings

#### Available Pages:
- `/dashboard` - Personal dashboard
- `/dashboard/my-templates` - Saved templates
- `/dashboard/exports` - Order/export history
- `/dashboard/profile` - Profile settings
- `/mpg` - Map Studio (builder)
- `/mpg/personalize` - Template customization
- `/mpg-templates` - Browse templates

#### Restrictions:
- ❌ Cannot access admin pages
- ❌ Cannot create admin templates
- ❌ Cannot view analytics
- ❌ Cannot manage users

---

### 2. Admin (`role: "admin"`)

**Elevated privileges** for content management and curation.

#### Access & Capabilities:
All User permissions **PLUS**:
- ✅ Create and manage admin templates
- ✅ Access Template Generator with JSON import
- ✅ View and manage all admin templates
- ✅ Access analytics dashboard (views, exports, popular templates)
- ✅ View all users (read-only)
- ✅ Toggle template visibility and featured status
- ✅ Delete templates

#### Available Pages:
All User pages **PLUS**:
- `/dashboard` - Shows admin dashboard with stats
- `/admin/mpg/template-generator` - Create/edit/manage templates
- `/admin/mpg/analytics` - Usage analytics
- `/admin/users` - View all users (read-only)

#### API Access:
- ✅ GET `/api/admin/users` - View all users
- ✅ All `/api/admin/mpg/*` endpoints
- ❌ Cannot change user roles

#### Restrictions:
- ❌ Cannot promote or demote users
- ❌ Cannot change user roles
- ❌ Cannot access super admin features

---

### 3. Super Admin (`role: "superadmin"`)

**Highest level of access** with full system control.

#### Access & Capabilities:
All Admin permissions **PLUS**:
- ✅ Promote regular users to admin role
- ✅ Demote admins back to user role
- ✅ Full user management capabilities
- ✅ Complete control over user roles and permissions

#### Available Pages:
All Admin pages with **full management capabilities**.

#### API Access:
All Admin endpoints **PLUS**:
- ✅ PATCH `/api/admin/users/[id]/role` - Change user roles

#### Special Rules:
- 🔒 Super Admin role is **protected** - cannot be modified
- 🔒 Cannot change other Super Admin accounts
- 🔒 Super Admins cannot demote themselves

#### How to Become Super Admin:
1. Set `ADMIN_EMAIL` environment variable to your email
2. Sign in with Google OAuth
3. System automatically promotes that email to admin role
4. Manually update database role to `superadmin` (one-time setup)

---

## User Flow

### 🎨 Regular User Journey

```
Landing Page (/)
    ↓
Browse Templates (/mpg-templates)
    ↓
Select Template
    ↓
Personalize (/mpg/personalize?template=X)
    ↓
Customize (location, text, colors, frames)
    ↓
Export (Download high-res PNG)
    ↓
Dashboard (/dashboard)
    ↓
View Templates & Order History
```

**Detailed Steps:**
1. **Discover** - Land on homepage, see testimonials and value props
2. **Browse** - View curated template gallery
3. **Personalize** - Add location and custom text
4. **Customize** - Choose map style, colors, frames, glow effects
5. **Preview** - See real-time changes
6. **Export** - Download print-ready files
7. **Manage** - Access saved templates and order history

---

### 👔 Admin Journey

```
Admin Dashboard (/dashboard)
    ↓
View Stats (templates, exports, events)
    ↓
┌─────────────┬──────────────┬─────────────┐
↓             ↓              ↓
Template      Analytics     User
Generator                   Management
    ↓             ↓              ↓
Create/Edit   View Stats    View Users
Browse/Delete & Trends      (Read-only)
Templates
```

**Admin Capabilities:**
1. **Dashboard** - Overview of system stats
2. **Template Generator** - Create, edit, browse, toggle visibility, and delete templates with JSON import
3. **Product Management** - Manage products, pricing, sizes, and variations
4. **Analytics** - Track usage patterns and popular designs
5. **User Management** - View all users (read-only)

---

### 👑 Super Admin Journey

Same as Admin **PLUS**:

```
User Management (/admin/users)
    ↓
View All Users
    ↓
Select User
    ↓
┌──────────────┬───────────────┐
↓              ↓
Promote        Demote
User → Admin   Admin → User
```

**Super Admin Powers:**
- Promote any user to admin
- Demote any admin to user
- Full control over user roles
- Protected from role changes

---

## Key Features

### 🔐 Authentication System

**Provider:** Better Auth with Google OAuth

#### Features:
- Session-based authentication
- Secure token management
- Auto-promotion via `ADMIN_EMAIL` environment variable
- Password-less authentication (OAuth only)

#### Database Tables:
- `user` - User profiles with roles
- `session` - Active user sessions
- `account` - OAuth account linking
- `verification` - Email verification (if needed)

#### Configuration:
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
BETTER_AUTH_SECRET="your-random-32-character-secret"
ADMIN_EMAIL="admin@yourdomain.com" # Auto-promoted to admin
```

---

### 🗺️ Map Customization Features

#### Location:
- Any address or coordinate worldwide
- Adjustable zoom levels
- Precise map positioning

#### Text Customization:
- Custom title (e.g., "Where We Met")
- Subtitle
- Coordinates display
- Country name
- Custom messages
- Multiple font options

#### Visual Styles:
- **35+ Color Themes**: Minimalist, vintage, bold, monochrome, etc.
- **Frame Shapes**: Circle, Heart, Square, House
- **Glow Effects**: 16 different colors
- **Map Features Toggle**: Buildings, roads, water, parks, labels

#### Export Options:
- Format: PNG (high-resolution)
- DPI: 300 (print-ready)
- Sizes: 8x10, 11x14, 16x20, 24x36
- Instant download

---

### 📊 Analytics & Tracking

**Event Types Tracked:**
- `template_view` - User views a template
- `template_select` - User selects a template
- `export_start` - User initiates export
- `export_complete` - Export successfully completed
- `style_change` - User changes map style

**Metadata Captured:**
- Template ID
- User ID (if authenticated)
- Session ID
- IP Address
- User Agent
- Custom event metadata

---

## Page Structure

### 🌐 Public Pages (No Auth Required)

| Page | Route | Description |
|------|-------|-------------|
| Landing Page | `/` | Hero section, testimonials, value props, trust badges |
| How It Works | `/how-it-works` | 3-step process, features, use cases, FAQs |
| Template Gallery | `/mpg-templates` | Browse curated templates (personalization requires auth) |

---

### 🔒 Protected Pages (Auth Required)

| Page | Route | Description |
|------|-------|-------------|
| User Dashboard | `/dashboard` | Personal dashboard with quick links |
| My Templates | `/dashboard/my-templates` | User's saved templates |
| Export History | `/dashboard/exports` | Order history and downloads |
| Profile | `/dashboard/profile` | Account settings |
| Map Studio | `/mpg` | Full builder interface |
| Personalize | `/mpg/personalize?template=X` | Template customization |

---

### 👔 Admin Pages (Admin/SuperAdmin Only)

| Page | Route | Description | Access |
|------|-------|-------------|--------|
| Admin Dashboard | `/dashboard` | Stats overview, quick actions | Admin, SuperAdmin |
| Template Generator | `/admin/mpg/template-generator` | Create/edit/manage templates with JSON | Admin, SuperAdmin |
| Product Management | `/admin/products` | Manage products, pricing, sizes, variations | Admin, SuperAdmin |
| Product Edit | `/admin/products/[id]` | Edit product details with size/variation management | Admin, SuperAdmin |
| Analytics | `/admin/mpg/analytics` | Usage stats and trends | Admin, SuperAdmin |
| User Management | `/admin/users` | View/manage users | Admin (read), SuperAdmin (full) |

---

## API Routes

### 🌐 Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| ALL | `/api/auth/[...all]` | Better Auth endpoints (login, logout, session) |

---

### 🔒 Authenticated Endpoints

#### User Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mpg/templates` | Get user's templates |
| POST | `/api/mpg/templates` | Create new template |
| GET | `/api/mpg/templates/[id]` | Get specific template |
| PUT | `/api/mpg/templates/[id]` | Update template |
| DELETE | `/api/mpg/templates/[id]` | Delete template |

#### Exports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/mpg/export` | Track export (create record) |
| GET | `/api/mpg/export/history` | Get user's export history |

#### Map Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mpg/overpass` | Fetch OpenStreetMap data |

---

### 👔 Admin Endpoints (Admin/SuperAdmin)

#### Admin Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/mpg/templates/save` | Save/create admin template with JSON |
| DELETE | `/api/admin/mpg/templates/delete` | Delete admin template |
| POST | `/api/admin/mpg/templates/toggle-visibility` | Toggle template visibility |

#### Product Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/products` | List all products with sizes and variations |
| POST | `/api/admin/products` | Create new product |
| GET | `/api/admin/products/[id]` | Get product details with sizes/variations |
| PATCH | `/api/admin/products/[id]` | Update product |
| DELETE | `/api/admin/products/[id]` | Delete product (cascade deletes sizes/variations) |
| GET | `/api/admin/products/[id]/sizes` | List product sizes |
| POST | `/api/admin/products/[id]/sizes` | Add product size |
| PATCH | `/api/admin/products/[id]/sizes/[sizeId]` | Update product size |
| DELETE | `/api/admin/products/[id]/sizes/[sizeId]` | Delete product size |
| GET | `/api/admin/products/[id]/variations` | List product variations |
| POST | `/api/admin/products/[id]/variations` | Add product variation |
| PATCH | `/api/admin/products/[id]/variations/[variationId]` | Update product variation |
| DELETE | `/api/admin/products/[id]/variations/[variationId]` | Delete product variation |

#### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/mpg/analytics` | Get analytics data |

#### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/users` | List all users | Admin, SuperAdmin |

---

### 👑 Super Admin Endpoints (SuperAdmin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/api/admin/users/[id]/role` | Change user role (promote/demote) |

---

## Database Schema

### Core Tables (Better Auth)

#### `user`
```typescript
{
  id: text (PK)
  name: text
  email: text (unique)
  emailVerified: boolean
  image: text
  role: text // "user", "admin", "superadmin"
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `session`
```typescript
{
  id: text (PK)
  expiresAt: timestamp
  token: text (unique)
  userId: text (FK → user.id, cascade delete)
  ipAddress: text
  userAgent: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `account`
```typescript
{
  id: text (PK)
  accountId: text
  providerId: text // "google"
  userId: text (FK → user.id, cascade delete)
  accessToken: text
  refreshToken: text
  idToken: text
  accessTokenExpiresAt: timestamp
  refreshTokenExpiresAt: timestamp
  scope: text
  password: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `verification`
```typescript
{
  id: text (PK)
  identifier: text
  value: text
  expiresAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

### MPG Application Tables

#### `mpg_user_templates`
User-saved templates with customization data.

```typescript
{
  id: serial (PK)
  userId: text (FK → user.id, cascade delete)
  templateName: text
  baseTemplateId: text
  templateData: json (MPGTemplateData)
  thumbnailUrl: text
  isPublic: boolean (default: false)
  isPremium: boolean (default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes:**
- `user_id` - Fast user template lookup
- `is_public` - Filter public templates

**Template Data Structure:**
```typescript
type MPGTemplateData = {
  location: {
    lat: number
    lng: number
    zoom: number
    title: string
    country?: string
    city?: string
  }
  text: {
    title: string
    subtitle?: string
    coordinates: string
    country?: string
    customText?: string
  }
  style: {
    mapStyle: string
    colorScheme?: string
    tileProvider?: string
  }
  settings: {
    frameStyle: string
    showPin: boolean
    pinStyle?: string
    glowEffect?: string
    showLabels?: boolean
    showRoads?: boolean
    showBuildings?: boolean
  }
  fonts?: {
    titleFont?: string
    subtitleFont?: string
    coordinatesFont?: string
    customTextFont?: string
  }
}
```

---

#### `mpg_export_history`
Tracks all user exports for analytics and order history.

```typescript
{
  id: serial (PK)
  userId: text (FK → user.id, cascade delete)
  templateId: integer (FK → mpg_user_templates.id, set null)
  exportFormat: text // "png", "pdf" (future)
  exportSize: text // "8x10", "11x14", "16x20", "24x36"
  exportQuality: text // "standard", "high", "premium"
  exportDpi: integer (default: 96)
  fileUrl: text
  fileName: text
  fileSize: integer
  isPremiumExport: boolean (default: false)
  paymentId: text
  ipAddress: text
  userAgent: text
  createdAt: timestamp
}
```

**Indexes:**
- `user_id` - User export history
- `created_at` - Time-based queries

---

#### `mpg_admin_templates`
Curated templates created by admins for users to browse.

```typescript
{
  id: serial (PK)
  templateName: text
  category: text // "wedding", "travel", "birthday", "anniversary"
  description: text
  templateData: json (MPGTemplateData)
  thumbnailUrl: text
  isFeatured: boolean (default: false)
  isActive: boolean (default: true)
  displayOrder: integer (default: 0)
  createdById: text (FK → user.id)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes:**
- `category` - Filter by category
- `is_featured` - Featured templates
- `display_order` - Sorting

---

#### `mpg_analytics`
Event tracking for user behavior and usage patterns.

```typescript
{
  id: serial (PK)
  eventType: text // "template_view", "template_select", "export_start", etc.
  templateId: integer
  userId: text (FK → user.id)
  sessionId: text
  metadata: json
  ipAddress: text
  userAgent: text
  createdAt: timestamp
}
```

**Indexes:**
- `event_type` - Filter by event
- `template_id` - Template analytics
- `created_at` - Time-based queries

---

#### `mpg_categories`
Template categories for organization.

```typescript
{
  id: serial (PK)
  name: text (unique)
  slug: text (unique)
  description: text
  displayOrder: integer (default: 0)
  isActive: boolean (default: true)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes:**
- `slug` - URL-friendly lookup
- `display_order` - Sorting

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **React:** Version 19
- **UI Library:** shadcn/ui components
- **Styling:** Tailwind CSS v4
- **Fonts:** Playfair Display (custom Google Font)
- **Icons:** Lucide React
- **State Management:** Zustand

### Backend
- **Runtime:** Node.js 20+
- **API Routes:** Next.js API Routes
- **Authentication:** Better Auth with Google OAuth
- **Database ORM:** Drizzle ORM
- **Database:** PostgreSQL

### Maps & Visualization
- **Map Libraries:** MapLibre GL, Leaflet
- **Canvas Manipulation:** Konva, React-Konva
- **Data Visualization:** D3.js

### AI & Chat (Optional)
- **AI SDK:** Vercel AI SDK
- **Provider:** OpenAI (GPT-4o-mini)

### Development Tools
- **Package Manager:** pnpm
- **TypeScript:** Version 5
- **Linting:** ESLint
- **Build Tool:** Next.js with Turbopack

### Database Tools
- **Migration Tool:** Drizzle Kit
- **Database GUI:** Drizzle Studio

### Deployment
- **Platform:** Vercel (recommended)
- **Database:** Vercel Postgres or any PostgreSQL provider

---

## Business Model

### Current Features
- ✅ Free map creation and customization
- ✅ Instant digital downloads
- ✅ Export tracking system
- ✅ User account management

### Monetization Indicators (Future)

#### 1. Premium Exports
- `isPremiumExport` field in export history
- Higher resolution options
- Additional formats (PDF, SVG)
- Commercial use licenses

#### 2. Premium Templates
- `isPremium` field in user templates
- Exclusive designs
- Advanced customization options

#### 3. Print Services (Coming Soon)
- Direct print ordering
- Professional framing options
- Multiple size options
- `paymentId` field ready for payment integration

#### 4. Subscription Tiers
- Free: Basic exports, limited templates
- Pro: Unlimited exports, premium templates, higher DPI
- Business: Commercial licenses, bulk exports, API access

---

## Environment Variables

### Required
```env
# Database
POSTGRES_URL="postgresql://user:password@host:5432/database"

# Authentication
BETTER_AUTH_SECRET="your-random-32-character-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000" # or production URL
```

### Optional
```env
# AI Integration
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_MODEL="gpt-4o-mini"

# Admin Setup
ADMIN_EMAIL="admin@yourdomain.com" # Auto-promoted to admin role
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google OAuth credentials
- pnpm package manager

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd yourmapart1980
pnpm install
```

2. **Configure Environment**
```bash
cp env.example .env
# Edit .env with your credentials
```

3. **Setup Database**
```bash
pnpm run db:generate  # Generate migrations
pnpm run db:migrate   # Run migrations
```

4. **Start Development Server**
```bash
pnpm run dev
```

5. **Create Super Admin** (One-time)
- Set `ADMIN_EMAIL` in `.env`
- Sign in with that email
- Manually update database:
```sql
UPDATE "user" SET role = 'superadmin' WHERE email = 'your@email.com';
```

---

## Development Scripts

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run typecheck    # TypeScript type checking
pnpm run db:generate  # Generate DB migrations
pnpm run db:migrate   # Run DB migrations
pnpm run db:push      # Push schema changes
pnpm run db:studio    # Open Drizzle Studio
pnpm run db:dev       # Push schema for development
pnpm run db:reset     # Reset database (drop all)
```

---

## Security Considerations

### Authentication
- ✅ Session-based with secure tokens
- ✅ HTTPS required in production
- ✅ OAuth 2.0 for Google authentication
- ✅ No password storage (OAuth only)

### Authorization
- ✅ Role-based access control (RBAC)
- ✅ Server-side role verification
- ✅ Protected API routes
- ✅ Super Admin role protection

### Data Privacy
- ✅ User data isolated by user ID
- ✅ Cascade deletes on user deletion
- ✅ IP and User Agent tracking for security
- ✅ Session expiration

### Best Practices
- ✅ Environment variables for secrets
- ✅ Database connection pooling
- ✅ SQL injection protection (ORM)
- ✅ XSS protection (React)

---

## Support & Documentation

### Resources
- **Main Website:** [YourMapArt1980]
- **How It Works:** `/how-it-works` page
- **Template Gallery:** `/mpg-templates`

### Admin Resources
- **Template Generator:** `/admin/mpg/template-generator`
- **Analytics Dashboard:** `/admin/mpg/analytics`
- **User Management:** `/admin/users`

---

## Future Enhancements

### Planned Features
- 📷 Upload custom map images
- 🖨️ Professional print ordering
- 💳 Payment integration (Stripe)
- 📱 Mobile app
- 🌍 Multiple language support
- 🎨 AI-powered design suggestions
- 📊 Advanced analytics
- 🏢 B2B/Enterprise plans

### Technical Improvements
- Server-side rendering optimization
- Progressive Web App (PWA)
- Offline mode support
- Real-time collaboration
- Template marketplace
- API for third-party integrations

---

**Last Updated:** 2025-01-07
**Version:** 1.0.0
