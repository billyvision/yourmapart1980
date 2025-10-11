import { pgTable, text, timestamp, boolean, serial, json, integer, index, real } from "drizzle-orm/pg-core";

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
  // Stripe Integration Extensions
  isBlocked: boolean("is_blocked").default(false).notNull(),
  totalSpent: integer("total_spent").default(0).notNull(), // lifetime value in cents
  orderCount: integer("order_count").default(0).notNull(),
  lastOrderAt: timestamp("last_order_at"),
  blockedAt: timestamp("blocked_at"),
  blockedReason: text("blocked_reason"),
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

// ============================================
// MPG Product Management Tables
// ============================================

export const mpgProducts = pgTable("mpg_products", {
  id: serial("id").primaryKey(),
  productType: text("product_type").notNull().unique(), // digital, poster, canvas-wrap, etc.
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"), // lucide icon name
  image: text("image"), // product reference image URL
  image2: text("image_2"), // optional second image
  basePrice: real("base_price"), // base price for products without size-specific pricing
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  features: json("features").$type<string[]>(), // array of feature strings
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  productTypeIdx: index("mpg_products_product_type_idx").on(table.productType),
  isActiveIdx: index("mpg_products_is_active_idx").on(table.isActive),
  displayOrderIdx: index("mpg_products_display_order_idx").on(table.displayOrder),
}));

export const mpgProductSizes = pgTable("mpg_product_sizes", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => mpgProducts.id, { onDelete: "cascade" }),
  sizeValue: text("size_value").notNull(), // 8x10, 11x14, etc.
  sizeLabel: text("size_label").notNull(), // Display label
  dimensions: text("dimensions"), // e.g., "8×10\""
  price: real("price"), // size-specific price (overrides base price if set)
  isPopular: boolean("is_popular").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  productIdIdx: index("mpg_product_sizes_product_id_idx").on(table.productId),
  displayOrderIdx: index("mpg_product_sizes_display_order_idx").on(table.displayOrder),
}));

export const mpgProductVariations = pgTable("mpg_product_variations", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => mpgProducts.id, { onDelete: "cascade" }),
  variationType: text("variation_type").notNull(), // posterFinish, frameColor, canvasThickness, paperWeight
  variationValue: text("variation_value").notNull(), // matte, black, slim, 170gsm
  variationLabel: text("variation_label").notNull(), // Display label
  variationDescription: text("variation_description"), // Optional description
  priceModifier: real("price_modifier").default(0).notNull(), // Price adjustment (+ or -)
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  metadata: json("metadata").$type<Record<string, unknown>>(), // For extra data like color codes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  productIdIdx: index("mpg_product_variations_product_id_idx").on(table.productId),
  variationTypeIdx: index("mpg_product_variations_variation_type_idx").on(table.variationType),
  isActiveIdx: index("mpg_product_variations_is_active_idx").on(table.isActive),
}));

// ============================================
// Stripe Integration Tables
// ============================================

// Cart item type for type safety
export type CartItem = {
  productId: number;
  sizeId?: number;
  variations?: Record<string, string>;
  quantity: number;
  templateId?: number;
  templateData?: MPGTemplateData;
};

// Carts - Server-side persistent carts
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").unique(),
  email: text("email"),
  items: json("items").$type<CartItem[]>().notNull(),
  status: text("status").notNull().default("active"), // active, checked_out, abandoned
  lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("carts_user_id_idx").on(table.userId),
  sessionTokenIdx: index("carts_session_token_idx").on(table.sessionToken),
  expiresAtIdx: index("carts_expires_at_idx").on(table.expiresAt),
  lastActivityAtIdx: index("carts_last_activity_at_idx").on(table.lastActivityAt),
}));

// Shipping address type for type safety
export type ShippingAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
};

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id").references(() => user.id),
  email: text("email").notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, processing, fulfilled, partially_refunded, refunded, canceled
  currency: text("currency").notNull().default("usd"),
  amountSubtotal: integer("amount_subtotal").notNull(), // cents
  amountDiscount: integer("amount_discount").default(0).notNull(), // cents
  amountTax: integer("amount_tax").default(0).notNull(), // cents
  amountShipping: integer("amount_shipping").default(0).notNull(), // cents
  amountTotal: integer("amount_total").notNull(), // cents
  taxCollected: boolean("tax_collected").default(false).notNull(),
  fulfillmentType: text("fulfillment_type").notNull(), // digital, physical, mixed
  shippingAddress: json("shipping_address").$type<ShippingAddress>(),
  trackingNumber: text("tracking_number"),
  trackingCarrier: text("tracking_carrier"), // USPS, UPS, FedEx, Gelato
  trackingUrl: text("tracking_url"),
  stripeCustomerId: text("stripe_customer_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  stripePromoCode: text("stripe_promo_code"),
  clientReferenceId: text("client_reference_id"),
  notes: text("notes"),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  canceledAt: timestamp("canceled_at"),
  fulfilledAt: timestamp("fulfilled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orderNumberIdx: index("orders_order_number_idx").on(table.orderNumber),
  userIdIdx: index("orders_user_id_idx").on(table.userId),
  emailIdx: index("orders_email_idx").on(table.email),
  statusIdx: index("orders_status_idx").on(table.status),
  createdAtIdx: index("orders_created_at_idx").on(table.createdAt),
  stripePaymentIntentIdIdx: index("orders_stripe_payment_intent_id_idx").on(table.stripePaymentIntentId),
}));

// Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => mpgProducts.id),
  productType: text("product_type").notNull(),
  sizeId: integer("size_id").references(() => mpgProductSizes.id),
  variationSelections: json("variation_selections").$type<Record<string, string>>(),
  quantity: integer("quantity").notNull(),
  unitAmount: integer("unit_amount").notNull(), // cents
  currency: text("currency").notNull().default("usd"),
  titleSnapshot: text("title_snapshot"),
  descriptionSnapshot: text("description_snapshot"),
  templateRef: json("template_ref").$type<{ templateId?: number; templateData?: MPGTemplateData }>(),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orderIdIdx: index("order_items_order_id_idx").on(table.orderId),
  productIdIdx: index("order_items_product_id_idx").on(table.productId),
}));

// Downloads - Digital delivery
export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  orderItemId: integer("order_item_id")
    .notNull()
    .references(() => orderItems.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"), // pending, processing, ready, failed
  format: text("format").notNull(), // pdf, png, jpg
  s3Key: text("s3_key").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size"), // bytes
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orderIdIdx: index("downloads_order_id_idx").on(table.orderId),
  orderItemIdIdx: index("downloads_order_item_id_idx").on(table.orderItemId),
  statusIdx: index("downloads_status_idx").on(table.status),
}));

// Webhook Events - Idempotency
export const webhookEvents = pgTable("webhook_events", {
  id: serial("id").primaryKey(),
  stripeEventId: text("stripe_event_id").notNull().unique(),
  type: text("type").notNull(),
  payload: json("payload").$type<Record<string, unknown>>().notNull(),
  processedAt: timestamp("processed_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  stripeEventIdIdx: index("webhook_events_stripe_event_id_idx").on(table.stripeEventId),
  typeIdx: index("webhook_events_type_idx").on(table.type),
  createdAtIdx: index("webhook_events_created_at_idx").on(table.createdAt),
}));

// Promo Codes - Admin-managed
export const promoCodes = pgTable("promo_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  stripePromotionCodeId: text("stripe_promotion_code_id"),
  stripeCouponId: text("stripe_coupon_id"),
  discountType: text("discount_type").notNull(), // percentage, fixed_amount
  discountValue: integer("discount_value").notNull(), // percentage (0-100) or amount in cents
  currency: text("currency"), // required if fixed_amount
  description: text("description"),
  maxRedemptions: integer("max_redemptions"),
  redemptionCount: integer("redemption_count").default(0).notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true).notNull(),
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  codeIdx: index("promo_codes_code_idx").on(table.code),
  isActiveIdx: index("promo_codes_is_active_idx").on(table.isActive),
  expiresAtIdx: index("promo_codes_expires_at_idx").on(table.expiresAt),
}));
