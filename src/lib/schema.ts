import { pgTable, text, timestamp, boolean, serial, json, integer, index } from "drizzle-orm/pg-core";

// ============================================
// Better Auth Tables
// ============================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified"),
  image: text("image"),
  role: text("role").default("user"), // user, admin, superadmin
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// ============================================
// MPG (Map Poster Generator) Tables
// ============================================

// Template data type definition for type safety
export type MPGTemplateData = {
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
    mapStyle: string;
    colorScheme?: string;
    tileProvider?: string;
  };
  settings: {
    frameStyle: string;
    showPin: boolean;
    pinStyle?: string;
    glowEffect?: string;
    showLabels?: boolean;
    showRoads?: boolean;
    showBuildings?: boolean;
  };
  fonts?: {
    titleFont?: string;
    subtitleFont?: string;
    coordinatesFont?: string;
    customTextFont?: string;
  };
};

export const mpgUserTemplates = pgTable("mpg_user_templates", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  templateName: text("template_name").notNull(),
  baseTemplateId: text("base_template_id"),
  templateData: json("template_data").$type<MPGTemplateData>().notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isPublic: boolean("is_public").default(false),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("mpg_user_templates_user_id_idx").on(table.userId),
  isPublicIdx: index("mpg_user_templates_is_public_idx").on(table.isPublic),
}));

export const mpgExportHistory = pgTable("mpg_export_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  templateId: integer("template_id")
    .references(() => mpgUserTemplates.id, { onDelete: "set null" }),
  exportFormat: text("export_format").notNull(),
  exportSize: text("export_size").notNull(),
  exportQuality: text("export_quality").notNull(),
  exportDpi: integer("export_dpi").default(96),
  fileUrl: text("file_url"),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  isPremiumExport: boolean("is_premium_export").default(false),
  paymentId: text("payment_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("mpg_export_history_user_id_idx").on(table.userId),
  createdAtIdx: index("mpg_export_history_created_at_idx").on(table.createdAt),
}));

// ============================================
// MPG Admin Tables (Phase 10)
// ============================================

export const mpgAdminTemplates = pgTable("mpg_admin_templates", {
  id: serial("id").primaryKey(),
  templateName: text("template_name").notNull(),
  category: text("category").notNull(), // wedding, travel, birthday, anniversary, etc.
  description: text("description"),
  templateData: json("template_data").$type<MPGTemplateData>().notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdById: text("created_by_id").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index("mpg_admin_templates_category_idx").on(table.category),
  isFeaturedIdx: index("mpg_admin_templates_is_featured_idx").on(table.isFeatured),
  displayOrderIdx: index("mpg_admin_templates_display_order_idx").on(table.displayOrder),
}));

export const mpgAnalytics = pgTable("mpg_analytics", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // template_view, template_select, export_start, export_complete, style_change
  templateId: integer("template_id"),
  userId: text("user_id").references(() => user.id),
  sessionId: text("session_id"),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  eventTypeIdx: index("mpg_analytics_event_type_idx").on(table.eventType),
  templateIdIdx: index("mpg_analytics_template_id_idx").on(table.templateId),
  createdAtIdx: index("mpg_analytics_created_at_idx").on(table.createdAt),
}));

export const mpgCategories = pgTable("mpg_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("mpg_categories_slug_idx").on(table.slug),
  displayOrderIdx: index("mpg_categories_display_order_idx").on(table.displayOrder),
}));
