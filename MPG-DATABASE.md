# MPG Database Architecture

## 📊 Overview

Complete database schema and integration guide for the Map Poster Generator (MPG) system. This document covers all database tables, relationships, API endpoints, and migration procedures.

---

## 🗄️ Database Provider

- **Service**: Neon Postgres (Vercel-optimized)
- **Connection**: `POSTGRES_URL` environment variable
- **ORM**: Drizzle ORM
- **Location**: `.env` file (already configured)

---

## 📐 Schema Overview

### Current Tables (Better Auth)
- ✅ `user` - User accounts
- ✅ `session` - Active sessions
- ✅ `account` - OAuth providers
- ✅ `verification` - Email verification

### New MPG Tables (Phase 9)
- 🆕 `mpg_user_templates` - User-saved map templates
- 🆕 `mpg_export_history` - Export tracking & analytics

---

## 📋 Table Definitions

### 1. mpg_user_templates

**Purpose**: Store user-created map poster templates with full configuration

```typescript
export const mpgUserTemplates = pgTable("mpg_user_templates", {
  // Primary Key
  id: serial("id").primaryKey(),

  // Foreign Key - User Relationship
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Template Metadata
  templateName: text("template_name").notNull(),
  baseTemplateId: text("base_template_id"), // Which starter template (template-1, template-2, etc.)

  // Full Template Configuration (MPG Store State)
  templateData: json("template_data").$type<{
    location: {
      lat: number;
      lng: number;
      zoom: number;
      title: string;
      country?: string;
      city?: string;
    };
    text: {
      title: string;
      subtitle?: string;
      coordinates: string;
      country?: string;
      customText?: string;
    };
    style: {
      mapStyle: string;           // midnight, apple-maps-esque, etc.
      colorScheme?: string;
      tileProvider?: string;
    };
    settings: {
      frameStyle: string;         // square, circle, heart, house
      showPin: boolean;
      pinStyle?: string;
      glowEffect?: string;        // none, subtle, medium, intense
      showLabels?: boolean;
      showRoads?: boolean;
      showBuildings?: boolean;
    };
    fonts: {
      titleFont?: string;
      subtitleFont?: string;
      coordinatesFont?: string;
      customTextFont?: string;
    };
  }>().notNull(),

  // Preview & Sharing
  thumbnailUrl: text("thumbnail_url"),      // S3/Blob storage URL
  isPublic: boolean("is_public").default(false),
  isPremium: boolean("is_premium").default(false), // High-res export flag

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

**Indexes**:
```typescript
// For fast user queries
createIndex("mpg_user_templates_user_id_idx").on(mpgUserTemplates.userId)

// For public gallery
createIndex("mpg_user_templates_is_public_idx").on(mpgUserTemplates.isPublic)
```

**Sample Data**:
```json
{
  "id": 1,
  "userId": "user_abc123",
  "templateName": "My Paris Vacation",
  "baseTemplateId": "template-3",
  "templateData": {
    "location": {
      "lat": 48.8566,
      "lng": 2.3522,
      "zoom": 13,
      "title": "Paris, France"
    },
    "text": {
      "title": "PARIS",
      "subtitle": "Where we met",
      "coordinates": "48.8566° N, 2.3522° E",
      "country": "France"
    },
    "style": {
      "mapStyle": "midnight"
    },
    "settings": {
      "frameStyle": "heart",
      "showPin": true,
      "glowEffect": "medium"
    }
  },
  "thumbnailUrl": "https://blob.vercel-storage.com/paris-preview.png",
  "isPublic": false,
  "isPremium": true,
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T11:45:00Z"
}
```

---

### 2. mpg_export_history

**Purpose**: Track exports for analytics, premium feature enforcement, and user history

```typescript
export const mpgExportHistory = pgTable("mpg_export_history", {
  // Primary Key
  id: serial("id").primaryKey(),

  // Foreign Keys
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  templateId: integer("template_id")
    .references(() => mpgUserTemplates.id, { onDelete: "set null" }),

  // Export Configuration
  exportFormat: text("export_format").notNull(),   // png, jpg, pdf
  exportSize: text("export_size").notNull(),       // A4, A3, Square, etc.
  exportQuality: text("export_quality").notNull(), // standard, premium
  exportDpi: integer("export_dpi").default(96),    // 96 (web), 300 (print)

  // File Information
  fileUrl: text("file_url"),                       // If storing exports
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),                  // Bytes

  // Premium Features
  isPremiumExport: boolean("is_premium_export").default(false),
  paymentId: text("payment_id"),                   // Stripe payment ID

  // Metadata
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  // Timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Indexes**:
```typescript
// For user export history
createIndex("mpg_export_history_user_id_idx").on(mpgExportHistory.userId)

// For analytics
createIndex("mpg_export_history_created_at_idx").on(mpgExportHistory.createdAt)
```

**Sample Data**:
```json
{
  "id": 42,
  "userId": "user_abc123",
  "templateId": 1,
  "exportFormat": "pdf",
  "exportSize": "A3",
  "exportQuality": "premium",
  "exportDpi": 300,
  "fileUrl": "https://blob.vercel-storage.com/exports/paris-vacation-a3.pdf",
  "fileName": "paris-vacation-a3.pdf",
  "fileSize": 2458624,
  "isPremiumExport": true,
  "paymentId": "pi_3AbC123xyz",
  "createdAt": "2025-01-15T12:00:00Z"
}
```

---

## 🔗 Relationships

```
user (Better Auth)
  ↓ 1:N
mpg_user_templates
  ↓ 1:N
mpg_export_history
```

**Cascade Rules**:
- Delete user → Delete all templates → Set template_id to null in exports
- Delete template → Set template_id to null in exports (keep export history)

---

## 🛣️ API Endpoints

### Template Management

#### POST /api/mpg/templates
**Save New Template**

Request:
```typescript
{
  templateName: string;
  baseTemplateId?: string;
  templateData: TemplateData;
  thumbnailUrl?: string;
  isPublic?: boolean;
}
```

Response:
```typescript
{
  id: number;
  templateName: string;
  createdAt: string;
}
```

---

#### GET /api/mpg/templates
**List User Templates**

Query Params:
- `?userId={id}` - Filter by user (auth required)
- `?isPublic=true` - Get public gallery
- `?limit=10&offset=0` - Pagination

Response:
```typescript
{
  templates: Template[];
  total: number;
}
```

---

#### GET /api/mpg/templates/[id]
**Get Single Template**

Response:
```typescript
{
  id: number;
  userId: string;
  templateName: string;
  templateData: TemplateData;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

#### PATCH /api/mpg/templates/[id]
**Update Template**

Request:
```typescript
{
  templateName?: string;
  templateData?: TemplateData;
  thumbnailUrl?: string;
  isPublic?: boolean;
}
```

---

#### DELETE /api/mpg/templates/[id]
**Delete Template**

Response:
```typescript
{
  success: boolean;
  message: string;
}
```

---

### Export Tracking

#### POST /api/mpg/export
**Track Export**

Request:
```typescript
{
  templateId?: number;
  exportFormat: 'png' | 'jpg' | 'pdf';
  exportSize: string;
  exportQuality: 'standard' | 'premium';
  fileName: string;
  fileUrl?: string;
  isPremiumExport?: boolean;
  paymentId?: string;
}
```

Response:
```typescript
{
  id: number;
  createdAt: string;
}
```

---

#### GET /api/mpg/export/history
**Get User Export History**

Query Params:
- `?userId={id}` - Filter by user
- `?limit=20&offset=0` - Pagination

Response:
```typescript
{
  exports: ExportHistory[];
  total: number;
}
```

---

## 📊 Data Flow Diagram

```
User Login (Better Auth)
    ↓
Select Template (/mpg-templates)
    ↓
Customize in Editor (/mpg or /mpg/personalize)
    ↓
[Save Template] → POST /api/mpg/templates → mpg_user_templates
    ↓
[Export] → POST /api/mpg/export → mpg_export_history
    ↓
[Download File] ← Blob Storage / Direct Download
```

---

## 🔄 Migration Guide

### Step 1: Update Schema
Add to `src/lib/schema.ts`:

```typescript
import { pgTable, serial, text, timestamp, boolean, json, integer } from "drizzle-orm/pg-core";

// ... existing tables ...

export const mpgUserTemplates = pgTable("mpg_user_templates", {
  // ... (see Table Definitions above)
});

export const mpgExportHistory = pgTable("mpg_export_history", {
  // ... (see Table Definitions above)
});
```

### Step 2: Generate Migration
```bash
npm run db:generate
# Creates: drizzle/0001_add_mpg_tables.sql
```

### Step 3: Review Migration SQL
Check `drizzle/0001_add_mpg_tables.sql`:
```sql
CREATE TABLE IF NOT EXISTS "mpg_user_templates" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "template_name" text NOT NULL,
  ...
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "mpg_export_history" (
  ...
);

CREATE INDEX IF NOT EXISTS "mpg_user_templates_user_id_idx"
  ON "mpg_user_templates" ("user_id");
```

### Step 4: Apply Migration
```bash
npm run db:migrate
# Pushes to Neon database
```

### Step 5: Verify Tables
```bash
npm run db:studio
# Opens Drizzle Studio to inspect tables
```

---

## 🔍 Common Queries

### Get User's Templates
```typescript
import { db } from '@/lib/db';
import { mpgUserTemplates } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const templates = await db
  .select()
  .from(mpgUserTemplates)
  .where(eq(mpgUserTemplates.userId, userId))
  .orderBy(desc(mpgUserTemplates.updatedAt));
```

### Get Public Gallery
```typescript
const publicTemplates = await db
  .select()
  .from(mpgUserTemplates)
  .where(eq(mpgUserTemplates.isPublic, true))
  .limit(20);
```

### Get Template with User Info
```typescript
const templateWithUser = await db
  .select({
    template: mpgUserTemplates,
    user: {
      name: user.name,
      image: user.image,
    }
  })
  .from(mpgUserTemplates)
  .leftJoin(user, eq(mpgUserTemplates.userId, user.id))
  .where(eq(mpgUserTemplates.id, templateId));
```

### Get Export History
```typescript
const exports = await db
  .select()
  .from(mpgExportHistory)
  .where(eq(mpgExportHistory.userId, userId))
  .orderBy(desc(mpgExportHistory.createdAt))
  .limit(50);
```

### Analytics: Most Popular Styles
```typescript
const popularStyles = await db
  .select({
    style: mpgUserTemplates.templateData.style.mapStyle,
    count: count()
  })
  .from(mpgUserTemplates)
  .groupBy(mpgUserTemplates.templateData.style.mapStyle)
  .orderBy(desc(count()))
  .limit(10);
```

---

## 🔐 Security Considerations

### Row-Level Security (RLS)
While Neon doesn't have built-in RLS, enforce in API routes:

```typescript
// api/mpg/templates/[id]/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const template = await db.query.mpgUserTemplates.findFirst({
    where: eq(mpgUserTemplates.id, parseInt(params.id))
  });

  // Check ownership or public status
  if (template.userId !== session.user.id && !template.isPublic) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  return Response.json(template);
}
```

### Data Validation
Use Zod for input validation:

```typescript
import { z } from 'zod';

const templateSchema = z.object({
  templateName: z.string().min(1).max(100),
  templateData: z.object({
    location: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      zoom: z.number().min(1).max(20),
      title: z.string(),
    }),
    // ... rest of schema
  }),
  isPublic: z.boolean().optional(),
});
```

---

## 📈 Future Enhancements

### Phase 10: Admin Features
```typescript
export const mpgAdminTemplates = pgTable("mpg_admin_templates", {
  id: serial("id").primaryKey(),
  templateName: text("template_name").notNull(),
  category: text("category").notNull(), // wedding, travel, birthday, etc.
  isFeatured: boolean("is_featured").default(false),
  displayOrder: integer("display_order"),
  // ... similar to user templates but curated
});
```

### Phase 11: Analytics
```typescript
export const mpgAnalytics = pgTable("mpg_analytics", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // template_view, export_start, export_complete
  templateId: integer("template_id"),
  userId: text("user_id"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Phase 11: Stripe Integration
```typescript
export const mpgPurchases = pgTable("mpg_purchases", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  stripePaymentId: text("stripe_payment_id").notNull(),
  productType: text("product_type").notNull(), // premium_export, commercial_license
  amount: integer("amount").notNull(), // cents
  currency: text("currency").default("usd"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

---

## 🧪 Testing Database Locally

### 1. Seed Test Data
```bash
npm run db:seed
```

`src/lib/db/seed.ts`:
```typescript
import { db } from './index';
import { mpgUserTemplates } from '../schema';

await db.insert(mpgUserTemplates).values([
  {
    userId: 'test-user-1',
    templateName: 'Test Paris Map',
    baseTemplateId: 'template-1',
    templateData: {
      location: { lat: 48.8566, lng: 2.3522, zoom: 13, title: 'Paris' },
      text: { title: 'PARIS', coordinates: '48.8566° N, 2.3522° E' },
      style: { mapStyle: 'midnight' },
      settings: { frameStyle: 'square', showPin: true },
    },
  },
]);
```

### 2. Reset Database
```bash
npm run db:reset  # Drop all tables and re-migrate
```

---

## 📚 Related Documentation

- [MPG Migration Plan](./MPG-MIGRATION-PLAN.md) - Full migration strategy
- [MPG Migration Summary](./MPG-MIGRATION-SUMMARY.md) - What's been completed
- [MPG Technical Summary](./docs/mpg/MPG-TECHNICAL-SUMMARY.md) - Architecture details
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview) - ORM reference
- [Neon Postgres](https://neon.tech/docs) - Database provider

---

## ✅ Checklist

### Schema Setup
- [ ] Add `mpgUserTemplates` table to schema
- [ ] Add `mpgExportHistory` table to schema
- [ ] Add indexes for performance
- [ ] Generate migration with `npm run db:generate`
- [ ] Review migration SQL
- [ ] Apply migration with `npm run db:migrate`
- [ ] Verify in Drizzle Studio

### API Routes
- [ ] Create `POST /api/mpg/templates`
- [ ] Create `GET /api/mpg/templates`
- [ ] Create `GET /api/mpg/templates/[id]`
- [ ] Create `PATCH /api/mpg/templates/[id]`
- [ ] Create `DELETE /api/mpg/templates/[id]`
- [ ] Create `POST /api/mpg/export`
- [ ] Create `GET /api/mpg/export/history`

### Integration
- [ ] Update MPG store with save/load methods
- [ ] Add "Save Template" button to editors
- [ ] Create `/dashboard/my-templates` page
- [ ] Add template loading to gallery
- [ ] Test end-to-end workflow

---

**Document Created**: January 2025
**Database**: Neon Postgres via `POSTGRES_URL`
**ORM**: Drizzle ORM
**Status**: Ready for Phase 9 Implementation ✅
