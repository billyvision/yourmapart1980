# Stripe Integration Plan – YourMapArt1980

Last updated: 2025-10-11
**Status:** ✅ Finalized and ready for implementation

This document proposes a complete, non-breaking Stripe integration for YourMapArt1980. It is tailored to the current stack and code layout:

- Next.js App Router (`src/app/...`)
- Drizzle ORM + Postgres (`src/lib/db.ts`, `src/lib/schema.ts`)
- Better Auth for authentication (`src/lib/auth.ts`, `src/lib/auth-client.ts`)
- Existing product catalog endpoints (`src/app/api/products/route.ts`)

Goals:

- One-time purchases with “Add to Cart” and “Buy Now”.
- Guest checkout with optional account creation, plus normal logged-in checkout.
- Order history for customers; order management for admins/superadmins.
- Digital assets uploaded to AWS S3; secure download links in customer history; admin/superadmin access from backend.
- Physical fulfillment support (shipping address/rates, taxes) now, print-on-demand later.
- First-class Stripe UX (Apple Pay, Google Pay, Link), promo codes, taxes, shipping.
- Reliable webhooks and idempotent order creation, with human-friendly order numbers.

Recommendation summary:

- Use Stripe Checkout for primary flows (fastest setup, best conversion, Apple Pay/Google Pay/Link out of the box, Stripe Tax, Shipping, Promotion Codes, Address Autocomplete).
- Keep server authoritative: create an internal Order before redirecting to Checkout; finalize via webhook.
- Use S3 for post-payment digital outputs with pre-signed, expiring download URLs.
- Introduce minimal schema for orders and items; extend later for shipping/fulfillment.

---

## ✅ Implementation Decisions (Finalized)

The following decisions have been confirmed and locked in for implementation:

### Cart & Orders
- **Cart Storage:** ✅ **Server-side cart table** (persistent across devices, enables abandoned cart tracking)
- **Abandoned Orders:** ✅ **Auto-cancel after 48 hours** (prevents DB clutter from unpaid orders)
- **Order Number Format:** ✅ **`YMA-2025-8H3K9C2D`** (prefix + year + 8-char random, human-friendly, collision-resistant)

### Admin MVP Features (Must-Have)
- ✅ View all orders (list with filters: status, date)
- ✅ Order detail page (items, customer info, totals, Stripe links)
- ✅ Mark as fulfilled / add tracking number
- ✅ View/download customer's design files (pre-signed S3 URLs)
- ✅ Issue refunds (full/partial via Stripe API)
- ✅ Order search (by email, order number)

### User Management Features (Extended)
Existing:
- ✅ User roles (user, admin, superadmin)
- ✅ View all users (read-only for admin, full for superadmin)
- ✅ Promote/demote users (superadmin only)

NEW:
- ✅ **Order history per user** (link orders to user profile, show in dashboard)
- ✅ **Customer stats** (lifetime value, total order count, last order date)
- ✅ **Block/suspend users** (spam prevention, abuse protection)

### Digital Delivery Workflow
- ✅ **Async generation** (webhook triggers → generate PNG + PDF → upload to S3 → notify customer)
- ✅ **Customer UX:** "Your download is ready! Visit your dashboard to download your digital files"
- ✅ **Download area:** Dedicated section in user dashboard with pre-signed S3 URLs (24-48h expiry)
- ✅ **No instant download at checkout** (prevents "lost download" issues, cleaner UX)

### Physical Fulfillment (Gelato)
- ✅ **Manual process** (team of assistants handles Gelato orders manually)
- ✅ **No API integration** (defer automation until volume increases)
- ✅ **Admin workflow:** View order → Create in Gelato portal → Add tracking → Email customer

### Tax & Compliance
- ✅ **Start WITHOUT tax collection** (absorb liability initially, okay for MVP)
- ⚠️ **Add Stripe Tax later** (when hitting 50-100 orders/month or $100k/year)
- ✅ **Track tax status:** Add `taxCollected: boolean` field to Orders for future auditing

### Shipping Strategy
- ✅ **Tiered shipping rates:**
  - Under $50: **$9.99 shipping**
  - $50-$149.99: **$9.99 shipping**
  - $150+: **FREE shipping**
- ✅ Configure in Stripe Dashboard as shipping rates
- ✅ Apply automatically in Checkout Session

### Promo Codes
- ✅ **Admin UI for creation** (create/manage promo codes in admin panel)
- ✅ **Stripe integration** (sync with Stripe Promotion Codes API)
- ✅ **Checkout support** (`allow_promotion_codes: true` in Stripe Checkout)
- ✅ **Usage tracking** (view redemption stats in admin)

### Database Migration Strategy
- ✅ **All-at-once migration** (add all tables in single migration for interconnected schema)
- ✅ **Tables to add:**
  - `carts` (server-side cart with auto-cancel)
  - `orders` (order management)
  - `order_items` (line items)
  - `downloads` (S3 digital assets)
  - `webhook_events` (idempotency)
  - `promo_codes` (promo code management)
- ✅ **User table updates:**
  - `isBlocked: boolean` (suspend users)
  - `totalSpent: integer` (lifetime value in cents)
  - `orderCount: integer` (total orders)

### Testing & Tools
- ✅ **Stripe CLI** (for local webhook testing)
- ✅ **Test mode flows:**
  - Successful payment (digital + physical)
  - Declined card
  - 3D Secure (SCA)
  - Refunds (full/partial)
  - Promo code application
  - Guest vs. logged-in checkout

---

## Customer Experience

- Add to Cart: Users assemble a cart and proceed to Stripe Checkout. Works for guests or logged-in users.
- Buy Now: Single-product quick purchase, skips cart.
- Guest Checkout: Stripe collects email; we match or create a user record post-payment and optionally invite them to set a password.
- Digital Orders: Immediately after payment succeeds, the system prepares high-res assets, uploads to S3, and shows secure downloads in the order confirmation and in account history.
- Physical Orders: Stripe collects shipping address and shipping rate. Admins track fulfillment; customers see status in order history.

Notes:

- Stripe Checkout supports multi-line items, shipping address collection, taxes, promo codes, and wallets.
- For embedded checkout look-and-feel later, we can add Payment Element with a compatible backend. Start with Checkout for speed and reliability.

---

## Data Model (Finalized Schema)

These are finalized Drizzle models ready for implementation. Field types follow existing schema conventions.

### Carts (Server-side Persistent)

- id (PK, serial)
- userId (text, nullable for guest carts; references user.id, cascade delete)
- sessionToken (text, unique for guest carts)
- email (text, nullable - captured if guest enters email)
- items (json) – array of cart items with productId, sizeId, variations, quantity, templateId
- status (text: active, checked_out, abandoned)
- lastActivityAt (timestamp) – updated on any cart modification
- expiresAt (timestamp) – auto-cancel if not checked out (48 hours after creation)
- createdAt / updatedAt (timestamp)

**Indexes:**
- `userId` - User cart lookup
- `sessionToken` - Guest cart lookup
- `expiresAt` - Auto-cancel job queries
- `lastActivityAt` - Abandoned cart detection

**Auto-cancel Logic:**
- Scheduled job runs hourly
- Sets `status = 'abandoned'` for carts where `expiresAt < NOW()` and `status = 'active'`

---

### Orders

- id (PK, serial)
- orderNumber (text, unique, human-friendly, e.g., YMA-2025-8H3K9C2D)
- userId (text, nullable for guest orders; references user.id)
- email (text, captured from Stripe; source of truth for guests)
- status (text: pending, paid, processing, fulfilled, partially_refunded, refunded, canceled)
- currency (text, default 'usd')
- amountSubtotal (integer, cents)
- amountDiscount (integer, cents)
- amountTax (integer, cents)
- amountShipping (integer, cents)
- amountTotal (integer, cents)
- taxCollected (boolean, default false) - track if tax was collected (for future tax compliance)
- fulfillmentType (text: digital, physical, mixed)
- shippingAddress (json) – { name, line1, line2, city, state, postal_code, country, phone }
- trackingNumber (text, nullable)
- trackingCarrier (text, nullable) – 'USPS', 'UPS', 'FedEx', 'Gelato'
- trackingUrl (text, nullable)
- stripeCustomerId (text)
- stripePaymentIntentId (text)
- stripeCheckoutSessionId (text)
- stripePromoCode (text, nullable) – promo code applied at checkout
- clientReferenceId (text) – for Stripe metadata mapping
- notes (text, nullable) – admin notes
- metadata (json) – flexible additional data
- canceledAt (timestamp, nullable)
- fulfilledAt (timestamp, nullable)
- createdAt / updatedAt (timestamp)

**Indexes:**
- `orderNumber` (unique) - Human-friendly lookup
- `userId` - User order history
- `email` - Guest order lookup
- `status` - Filter orders by status
- `createdAt` - Sort by date
- `stripePaymentIntentId` - Webhook lookups

OrderItems

- id (PK, serial)
- orderId (FK → Orders)
- productId (int, FK → mpgProducts.id)
- productType (text) – snapshot of product at time of purchase
- sizeId (int, FK → mpgProductSizes.id, nullable)
- variationSelections (json) – e.g., frameColor, finish, canvasDepth
- quantity (int)
- unitAmount (integer, cents)
- currency (text)
- title/descriptionSnapshot (text) – optional snapshot for historical accuracy
- templateRef (json) – if the item is a custom map, reference templateId or saved JSON
- metadata (json)

Payments (optional, can be folded into Orders initially)

- id (PK, serial)
- orderId (FK)
- stripePaymentIntentId (text)
- amount (integer, cents)
- currency (text)
- status (text)
- chargeId (text)
- receiptUrl (text)
- createdAt (timestamp)

Downloads (Digital Delivery)

- id (PK, serial)
- orderItemId (FK)
- s3Key (text)
- fileName (text)
- mimeType (text)
- fileSize (int, bytes)
- expiresAt (timestamp) – last time a pre-signed URL was requested/valid until
- createdAt / updatedAt (timestamp)

WebhookEvents (Idempotency)

- id (PK, serial)
- stripeEventId (text, unique)
- type (text)
- payload (json)
- processedAt (timestamp)
- createdAt (timestamp)

**Indexes:**
- `stripeEventId` (unique) - Prevent duplicate processing
- `type` - Filter by event type
- `createdAt` - Cleanup old events

---

### PromoCodes (Admin-managed)

- id (PK, serial)
- code (text, unique) – e.g., 'WELCOME10', 'SUMMER25'
- stripePromotionCodeId (text) – Stripe Promotion Code ID
- stripeCouponId (text) – Stripe Coupon ID
- discountType (text: percentage, fixed_amount)
- discountValue (integer) – percentage (0-100) or amount in cents
- currency (text, nullable) – required if fixed_amount
- description (text, nullable)
- maxRedemptions (integer, nullable) – null = unlimited
- redemptionCount (integer, default 0)
- expiresAt (timestamp, nullable)
- isActive (boolean, default true)
- createdBy (text, references user.id) – admin who created it
- createdAt / updatedAt (timestamp)

**Indexes:**
- `code` (unique) - Code lookup
- `isActive` - Filter active codes
- `expiresAt` - Auto-disable expired codes

---

### User Table Updates (Extend existing `user` table)

Add these fields to the existing `user` table:

- **isBlocked** (boolean, default false) – suspend user account
- **totalSpent** (integer, default 0) – lifetime value in cents
- **orderCount** (integer, default 0) – total completed orders
- **lastOrderAt** (timestamp, nullable) – last order date
- **blockedAt** (timestamp, nullable) – when user was blocked
- **blockedReason** (text, nullable) – why user was blocked

**Note:** These fields will be automatically updated via triggers or application logic when orders are completed or users are blocked/unblocked.

---

## Stripe Objects and Mapping

- Customer: Create or reuse Stripe Customers for logged-in users (store `stripeCustomerId` on user). For guests, create ad-hoc customers using checkout email; later auto-link if they create an account with the same email.
- Checkout Session: Single source for payments, shipping, tax, and promo codes. Use `metadata` and `client_reference_id` to tie back to our order.
- Payment Intent: Primary payment state; store `stripePaymentIntentId` on Order.
- Line Items: Use `price_data` dynamically for our products + options. Put product snapshot and `templateRef` in `metadata` for traceability.
- Promotion Codes: Enable in Stripe Dashboard and in Checkout Sessions.
- Stripe Tax: Recommended. Configure in Dashboard; enable in Checkout Session creation.

Metadata we set on Checkout Session / Payment Intent:

- orderId or orderNumber
- userId (if logged-in)
- productType / size / variations
- templateId or template JSON storage reference
- fulfillmentType (digital/physical/mixed)

---

## API Surface (App Router)

All routes finalized and ready for implementation. Follow existing conventions in `src/app/api/`.

### Cart Management (Server-side Persistent)

- **GET** `src/app/api/cart/route.ts` - Get current cart (user or guest via session token)
- **POST** `src/app/api/cart/route.ts` - Create/update cart (add/remove items)
- **DELETE** `src/app/api/cart/route.ts` - Clear cart
- **POST** `src/app/api/cart/merge/route.ts` - Merge guest cart into user cart after login

### Checkout & Orders

- **POST** `src/app/api/checkout/session/route.ts` - Creates pending Order + Stripe Checkout Session; returns `sessionUrl`
- **GET** `src/app/checkout/success/page.tsx` - Thank-you page (reads `session_id`, shows order summary)
- **POST** `src/app/api/stripe/webhook/route.ts` - Webhook handler (Node runtime, signature verification, idempotent processing)

### Customer Order Management

- **GET** `src/app/api/orders/route.ts` - List user's orders
- **GET** `src/app/api/orders/[id]/route.ts` - Get order details (auth-gated)
- **GET** `src/app/api/orders/[id]/downloads/route.ts` - Pre-signed S3 URLs for digital downloads (24-48h expiry)

### Admin Order Management

- **GET** `src/app/api/admin/orders/route.ts` - List all orders (with filters: status, date, search by email/order number)
- **GET** `src/app/api/admin/orders/[id]/route.ts` - Order detail (full access)
- **PATCH** `src/app/api/admin/orders/[id]/route.ts` - Update order (add tracking, mark fulfilled, add notes)
- **POST** `src/app/api/admin/orders/[id]/refund/route.ts` - Issue full/partial refund via Stripe
- **GET** `src/app/api/admin/orders/[id]/files/route.ts` - Pre-signed S3 URLs for admin file review

### Admin Promo Codes

- **GET** `src/app/api/admin/promo-codes/route.ts` - List all promo codes
- **POST** `src/app/api/admin/promo-codes/route.ts` - Create promo code (creates in Stripe + local DB)
- **GET** `src/app/api/admin/promo-codes/[id]/route.ts` - Get promo code details
- **PATCH** `src/app/api/admin/promo-codes/[id]/route.ts` - Update promo code (toggle active, update description)
- **DELETE** `src/app/api/admin/promo-codes/[id]/route.ts` - Delete promo code (soft delete, keep for historical records)
- **GET** `src/app/api/admin/promo-codes/[id]/usage/route.ts` - View usage stats (redemption count, orders)

### Admin User Management (Extended)

- **GET** `src/app/api/admin/users/route.ts` - List all users (already exists, extend with filters)
- **GET** `src/app/api/admin/users/[id]/route.ts` - Get user profile (extend with order history, stats)
- **PATCH** `src/app/api/admin/users/[id]/block/route.ts` - Block/unblock user (toggle `isBlocked`)
- **GET** `src/app/api/admin/users/[id]/orders/route.ts` - User's order history
- **GET** `src/app/api/admin/users/[id]/stats/route.ts` - Customer stats (LTV, order count, last order)

Runtime notes:

- Webhooks must run in Node.js runtime, not Edge: `export const runtime = 'nodejs'` in the route file.
- Use `NextResponse` and follow existing `queryWithRetry` patterns where DB access is needed.

---

## Checkout Flow Details

1) Create Pending Order before redirect

- Server receives cart payload (validated against DB for prices, stock/options).
- Generates unique `orderNumber` (human-friendly; e.g., `YMA-2025-ABC123`).
- Inserts Order + OrderItems with status `pending`.
- Calls Stripe to create Checkout Session with:
  - `mode: 'payment'`
  - `customer` if known, else omit (Stripe will create)
  - `client_reference_id: <orderId or orderNumber>`
  - `metadata` with `orderId`, `userId` (if any)
  - `line_items` using `price_data` for each item (dynamic)
  - `allow_promotion_codes: true`
  - `automatic_tax: { enabled: true }` (if Stripe Tax enabled)
  - Shipping collection for physical items
  - `success_url` and `cancel_url` (point to our pages)
- Returns `sessionUrl` to the client for redirect.

2) Webhook Finalizes Order (source of truth)

- Handle at least:
  - `checkout.session.completed` → mark Order as `paid`, store `stripePaymentIntentId`, totals, tax, shipping, promo breakdown, and `stripeCustomerId`.
  - `payment_intent.succeeded` → backup signal for payment success.
  - `payment_intent.payment_failed` → mark Order as `canceled` or `requires_action` as appropriate.
  - `charge.refunded` / `charge.refund.updated` → update Order status and amounts.
- Use `WebhookEvents` table to ensure idempotent processing.
- Post-payment, if Order contains digital items, kick off generation and S3 upload; then create `Downloads` rows and notify the customer.

3) Thank-you Page

- Reads `session_id` (client) and shows immediate confirmation UI.
- Polls our backend for Order status if needed; final authoritative state comes from webhook.

4) Guest to Account Flow

- If no `userId` on Order, but email exists, allow “claim your order” by creating an account. We match by email and attach any existing Orders.

---

## Digital Asset Pipeline (S3)

Goal: Paid orders should result in durable assets in S3, accessible via short-lived links.

Proposed steps for digital items on `checkout.session.completed`:

- Identify cart items requiring digital export. There are existing export utilities for MapLibre/Konva in `src/lib/mpg/*`. For high-res, run server-side export if feasible, or orchestrate a background job to render using a headless renderer.
- Upload finished files to S3 with keys like `orders/<orderNumber>/<orderItemId>/<filename>`. Store `s3Key`, `fileName`, `mimeType`, `fileSize` in `Downloads`.
- Email the purchaser with download links that call our API to mint pre-signed URLs (e.g., valid 24–48h). In account history, regenerate links on demand.
- Admin/Superadmin can fetch files via pre-signed URLs from their dashboard.

Environment variables (add to `.env` file):

- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Security & robustness:

- Never expose raw S3 keys; only return pre-signed URLs.
- Consider a `downloadsRemaining` policy or just time-limited links.
- For large renders, use background jobs and mark the OrderItem as `processing` until files are ready.

---

## Physical Fulfillment (Manual Gelato Process)

### Shipping Configuration
- **Tiered Shipping Rates** (configured in Stripe Dashboard):
  - Under $50: **$9.99**
  - $50-$149.99: **$9.99**
  - $150+: **FREE**
- Stripe Checkout collects shipping address automatically for physical items
- Address stored in `orders.shippingAddress` JSON field

### Manual Gelato Workflow
1. **Order Received** → Admin gets email alert
2. **Admin reviews order** → `/admin/orders/[id]` page
3. **Download customer files** → Pre-signed S3 URL for design
4. **Create order in Gelato portal** (manual process by team)
5. **Get tracking from Gelato** → Copy tracking number
6. **Update order in admin panel** → Add tracking number, mark as fulfilled
7. **System emails customer** → Shipping notification with tracking link

### Order Status Flow
- `pending` → Awaiting payment
- `paid` → Payment confirmed, awaiting fulfillment
- `processing` → Order being fulfilled (digital rendering or Gelato submission)
- `fulfilled` → Shipped/delivered (tracking added)
- `canceled` → Order canceled (payment failed or admin action)
- `refunded` / `partially_refunded` → Refund issued

### Future Automation (Phase 2+)
- Gelato API integration for auto-order submission
- Auto-fetch tracking updates from Gelato
- Auto-email customers on status changes

**Note:** Manual process is intentional for MVP. Team of assistants will handle Gelato orders. API integration deferred until volume justifies automation costs.

---

## Order Numbers

Use a distinct, human-friendly `orderNumber` separate from DB primary keys. Recommended format:

- `YMA-YYYY-ULID8` (e.g., `YMA-2025-8H3K9C2D`)

Implementation detail (later): Generate server-side with a collision-resistant, short, uppercase ID. Store as unique.

---

## Admin and Superadmin Views

- Orders List: filter by status/date; search by order number/email.
- Order Detail: items, amounts, tax, shipping address, Stripe links (Payment Intent/Charge), downloads, activity log.
- Actions: refund (full/partial), resend receipt, generate new download links, update fulfillment and tracking.
- Files: buttons to fetch pre-signed S3 URLs; visibility restricted to admin/superadmin.

RBAC alignment:

- user: can view only their orders and downloads.
- admin: can view all orders and files; no role changes.
- superadmin: all admin capabilities plus user role management (already present in app).

---

## Environment Variables

**All variables are configured in `.env` file** (not `.env.local`):

**Stripe (Phase 1 - Week 2):**
- `STRIPE_SECRET_KEY` - Get from https://dashboard.stripe.com/test/apikeys
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Get from https://dashboard.stripe.com/test/apikeys
- `STRIPE_WEBHOOK_SECRET` - Generated after creating webhook endpoint

**AWS S3 (Phase 2 - Week 3):**
- `AWS_REGION` - e.g., `us-east-1`
- `AWS_S3_BUCKET` - Your S3 bucket name
- `AWS_ACCESS_KEY_ID` - IAM user access key
- `AWS_SECRET_ACCESS_KEY` - IAM user secret key

**Brevo Email (Phase 6 - Week 7):**
- `BREVO_API_KEY` - Get from https://app.brevo.com/settings/keys/api

**Already Configured:**
- `NEXT_PUBLIC_APP_URL` - Already in `.env`, used for redirect URLs

Configuration notes:

- In Next.js App Router, Stripe webhooks must run in Node runtime (`export const runtime = 'nodejs'`).
- Ensure server URLs in Checkout success/cancel return to correct domain.

---

## Security and Compliance

- Webhook verification mandatory: reject requests failing signature verification.
- Idempotency: store `stripeEventId` and short-circuit duplicates.
- Amount verification: compute server-side totals from DB before creating Checkout Sessions; never trust client totals.
- PII minimization: store only necessary customer info; avoid storing full card data (Stripe manages that). Keep last4/brand only if needed (via Stripe objects).
- 3DS support handled automatically by Stripe.
- GDPR: provide data export/delete paths via Stripe customer linkage.

---

## Emails and Notifications (later phase)

- Provider: Postmark/Resend/SendGrid.
- Triggers:
  - Order confirmation (payment succeeded)
  - Digital files ready (if rendering async)
  - Fulfillment updates (shipped, delivered)
  - Refund issued
- Admin alerts: new paid order, daily digest.

---

## Testing & Ops

- Use Stripe CLI to forward webhooks in local dev.
- Cover flows: happy path, 3DS, failure, partial refund, promotion codes, multiple currencies.
- Seed data: continue using `scripts/seed-products.ts` for catalog; add test carts.
- Monitoring: log webhook processing, failures, and idempotency decisions. Consider alerting for stuck `processing` orders.

---

## 🚀 Phased Implementation Plan (Finalized)

### Phase 1: Database & Core Checkout (Week 1-2)

**Database Schema**
- [ ] Create migration file for all new tables:
  - `carts` (server-side with auto-cancel logic)
  - `orders` (with all fields including tracking, tax tracking)
  - `order_items` (with product snapshots, template refs)
  - `downloads` (S3 digital assets)
  - `webhook_events` (idempotency)
  - `promo_codes` (admin-managed)
- [ ] Extend `user` table with: `isBlocked`, `totalSpent`, `orderCount`, `lastOrderAt`, `blockedAt`, `blockedReason`
- [ ] Run migration: `pnpm run db:generate && pnpm run db:migrate`

**Cart System**
- [ ] Create cart API routes (GET/POST/DELETE `/api/cart`)
- [ ] Cart merge endpoint (`POST /api/cart/merge`) for guest-to-user
- [ ] Auto-cancel job for abandoned carts (48-hour expiry via cron)
- [ ] Frontend cart UI (add to cart, view cart, update quantities)

**Stripe Setup**
- [ ] Install Stripe SDK: `npm install stripe @stripe/stripe-js`
- [ ] Add environment variables: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- [ ] Configure Stripe Dashboard:
  - Create tiered shipping rates ($9.99, free at $150+)
  - Enable promo codes feature
  - Set up webhook endpoint URL

**Checkout Flow**
- [ ] Create `POST /api/checkout/session` endpoint:
  - Validate cart items against DB
  - Generate order number (`YMA-2025-8H3K9C2D`)
  - Create pending `Order` + `OrderItems`
  - Create Stripe Checkout Session
  - Return `sessionUrl`
- [ ] Create webhook handler `POST /api/stripe/webhook`:
  - Signature verification
  - Idempotency check (`webhook_events` table)
  - Handle `checkout.session.completed`
  - Handle `payment_intent.payment_failed`
  - Handle `charge.refunded`
- [ ] Create success page `src/app/checkout/success/page.tsx`
- [ ] Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

**Deliverables:**
- ✅ Working checkout flow (cart → Stripe → webhook → order created)
- ✅ Order number generation working
- ✅ Webhook processing idempotent
- ✅ Basic order confirmation page

---

### Phase 2: Digital Delivery & S3 (Week 3)

**AWS S3 Setup**
- [ ] Create S3 bucket (or use existing)
- [ ] Configure IAM user/role with S3 permissions
- [ ] Add environment variables: `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- [ ] Install AWS SDK: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`

**Digital Rendering Pipeline**
- [ ] Create utility function for S3 upload (`src/lib/s3-upload.ts`)
- [ ] Create utility for pre-signed URL generation (`src/lib/s3-presigned-url.ts`)
- [ ] Extend webhook handler to trigger digital rendering:
  - Detect digital products in order
  - Generate PNG + PDF (reuse existing MPG export logic)
  - Upload to S3 with keys: `orders/YMA-2025-8H3K9C2D/item-123/map-poster.png`
  - Create `downloads` table entries
- [ ] Handle rendering errors gracefully (retry logic, admin alerts)

**Customer Download Area**
- [ ] Create `GET /api/orders/[id]/downloads` endpoint:
  - Auth check (user owns order)
  - Generate pre-signed S3 URLs (24-48h expiry)
  - Return download links
- [ ] Create downloads UI in user dashboard:
  - List orders with download-ready status
  - Download buttons for each file
  - Show expiry notice
- [ ] Update success page to show "Processing files... Check dashboard in 1-2 minutes"

**Deliverables:**
- ✅ Digital files automatically uploaded to S3 after payment
- ✅ Customer can download from dashboard
- ✅ Pre-signed URLs expire after 48 hours
- ✅ Clean UX (no instant download at checkout)

---

### Phase 3: Admin Order Management (Week 4)

**Admin Orders List**
- [ ] Create `GET /api/admin/orders` with filters:
  - Status filter (pending, paid, fulfilled, canceled)
  - Date range filter
  - Search by email
  - Search by order number
- [ ] Create admin orders list page (`/admin/orders/page.tsx`):
  - Table with: Order#, Date, Customer, Total, Status, Actions
  - Pagination
  - Export to CSV button

**Admin Order Detail**
- [ ] Create `GET /api/admin/orders/[id]` (full order data)
- [ ] Create order detail page (`/admin/orders/[id]/page.tsx`):
  - Order summary (items, pricing, customer info)
  - Shipping address (if physical)
  - Stripe links (Payment Intent, Customer)
  - Order timeline/activity log
  - Admin actions section

**Admin Order Actions**
- [ ] **Mark as Fulfilled:**
  - `PATCH /api/admin/orders/[id]` endpoint
  - Add tracking number + carrier
  - Set `fulfilledAt` timestamp
  - Trigger shipping email
- [ ] **Download Customer Files:**
  - `GET /api/admin/orders/[id]/files` endpoint
  - Generate pre-signed S3 URLs for admin
  - Show download buttons in admin UI
- [ ] **Issue Refund:**
  - `POST /api/admin/orders/[id]/refund` endpoint
  - Call Stripe Refund API
  - Update order status
  - Trigger refund email
- [ ] **Add Admin Notes:**
  - Update `orders.notes` field
  - Show in order detail page

**Deliverables:**
- ✅ Admin can view all orders with search/filter
- ✅ Admin can view full order details
- ✅ Admin can mark orders fulfilled + add tracking
- ✅ Admin can download customer files
- ✅ Admin can issue refunds

---

### Phase 4: Admin User Management (Week 5)

**User Profile Extensions**
- [ ] Update `GET /api/admin/users` to include stats:
  - Order count
  - Total spent (lifetime value)
  - Last order date
  - Blocked status
- [ ] Create `GET /api/admin/users/[id]` endpoint (extended profile)
- [ ] Create `GET /api/admin/users/[id]/orders` (user's order history)
- [ ] Create `GET /api/admin/users/[id]/stats` (detailed customer stats)

**User Blocking Feature**
- [ ] Create `PATCH /api/admin/users/[id]/block` endpoint:
  - Toggle `isBlocked` field
  - Set `blockedAt` timestamp
  - Set `blockedReason` (admin input)
  - Prevent blocked users from:
    - Creating orders
    - Logging in (optional - show message)
- [ ] Create block/unblock UI in admin user detail page

**Order History Integration**
- [ ] Update webhook to increment `user.orderCount` and `user.totalSpent`
- [ ] Set `user.lastOrderAt` on order completion
- [ ] Show order history in user profile (admin view)

**User Detail Page**
- [ ] Create `/admin/users/[id]/page.tsx`:
  - User info (name, email, role, joined date)
  - Customer stats card (LTV, order count, last order)
  - Order history table
  - Block/unblock button (with reason input)
  - Activity log

**Deliverables:**
- ✅ Admin can view detailed customer stats
- ✅ Admin can see order history per user
- ✅ Admin can block/unblock users
- ✅ Blocked users cannot place orders

---

### Phase 5: Promo Codes (Week 6)

**Stripe Promo Code Integration**
- [ ] Create `POST /api/admin/promo-codes` endpoint:
  - Create Stripe Coupon via API
  - Create Stripe Promotion Code via API
  - Save to local `promo_codes` table
  - Support: percentage off, fixed amount off
- [ ] Create `GET /api/admin/promo-codes` (list all codes)
- [ ] Create `PATCH /api/admin/promo-codes/[id]` (toggle active/inactive)
- [ ] Create `DELETE /api/admin/promo-codes/[id]` (soft delete)
- [ ] Create `GET /api/admin/promo-codes/[id]/usage` (redemption stats)

**Admin Promo Codes UI**
- [ ] Create `/admin/promo-codes/page.tsx`:
  - List all promo codes
  - Show: Code, Type, Value, Uses, Expires, Status
  - Create button
  - Toggle active/inactive
- [ ] Create promo code creation modal/form:
  - Code input (uppercase, no spaces)
  - Discount type (percentage/fixed)
  - Discount value
  - Max redemptions (optional)
  - Expiry date (optional)
  - Description

**Checkout Integration**
- [ ] Update `POST /api/checkout/session`:
  - Enable `allow_promotion_codes: true` in Stripe Checkout
- [ ] Update webhook to store `stripePromoCode` on order
- [ ] Increment `redemptionCount` when promo code used

**Deliverables:**
- ✅ Admin can create/manage promo codes
- ✅ Promo codes work in Stripe Checkout
- ✅ Usage stats tracked
- ✅ Codes can be disabled/expired

---

### Phase 6: Customer Experience Polish (Week 7)

**Customer Order Dashboard**
- [ ] Create `/dashboard/orders/page.tsx`:
  - List user's orders
  - Show: Order#, Date, Items, Total, Status
  - View details button
  - Download files button (if digital & ready)
- [ ] Create `/dashboard/orders/[id]/page.tsx`:
  - Order detail view for customers
  - Items list
  - Shipping tracking (if physical)
  - Download section (if digital)

**Order Status Updates**
- [ ] Email notifications (integrate with Brevo plan):
  - Order confirmation
  - Digital files ready
  - Shipping notification
- [ ] Real-time status badges in UI

**Guest Order Lookup**
- [ ] Create `/orders/lookup/page.tsx`:
  - Input: Order# + Email
  - Show order status without login
  - Download files (if digital)

**Deliverables:**
- ✅ Customers can view order history
- ✅ Customers can download digital files
- ✅ Customers can track shipments
- ✅ Guests can look up orders

---

### Phase 7: Testing & Launch Prep (Week 8)

**Comprehensive Testing**
- [ ] Test all flows with Stripe test cards:
  - Successful payment (digital product)
  - Successful payment (physical product)
  - Declined card
  - 3D Secure / SCA
  - Guest checkout
  - Logged-in checkout
  - Promo code application
  - Full refund
  - Partial refund
- [ ] Test webhook idempotency (replay events)
- [ ] Test S3 upload/download flows
- [ ] Test admin order management
- [ ] Test user blocking
- [ ] Test cart abandonment (48-hour expiry)

**Production Setup**
- [ ] Switch to Stripe live mode
- [ ] Update webhook endpoint in Stripe Dashboard
- [ ] Add production environment variables
- [ ] Configure Stripe shipping rates (live mode)
- [ ] Create initial promo codes for launch
- [ ] Seed test orders in production

**Documentation**
- [ ] Admin user guide (how to fulfill orders)
- [ ] Customer support docs (order issues, downloads)
- [ ] Gelato workflow documentation (for team)

**Launch Checklist**
- [ ] All tests passing
- [ ] Production environment configured
- [ ] Backup strategy for database
- [ ] Monitoring/alerts set up (failed webhooks, stuck orders)
- [ ] Customer support email ready
- [ ] Launch promo code created (e.g., LAUNCH25)

**Deliverables:**
- ✅ All flows tested end-to-end
- ✅ Production environment ready
- ✅ Documentation complete
- ✅ Ready for first real order

---

## 📅 Timeline Summary

- **Week 1-2:** Database + Core Checkout
- **Week 3:** Digital Delivery + S3
- **Week 4:** Admin Order Management
- **Week 5:** Admin User Management
- **Week 6:** Promo Codes
- **Week 7:** Customer Experience Polish
- **Week 8:** Testing & Launch

**Total: 8 weeks to MVP launch**

**Milestone 1 (Week 2):** First test order complete
**Milestone 2 (Week 4):** Admin can manage orders
**Milestone 3 (Week 6):** All features complete
**Milestone 4 (Week 8):** Production launch ready

---

## ✅ Decisions Confirmed (No Open Items)

All critical decisions have been finalized:

- ✅ **Stripe Checkout** as primary UX
- ✅ **Start WITHOUT Stripe Tax** (add later when volume increases)
- ✅ **Tiered shipping** ($9.99 under $150, FREE $150+)
- ✅ **Async digital rendering** (webhook triggers, fast generation, S3 upload)
- ✅ **Email provider:** Brevo (plan in `emails.md`)
- ✅ **Server-side cart** with 48-hour auto-cancel
- ✅ **Manual Gelato fulfillment** (no API integration for MVP)
- ✅ **Promo codes** with admin UI
- ✅ **User blocking/suspension** feature
- ✅ **Customer stats tracking** (LTV, order count)

---

## References in Repo

- Products API: `src/app/api/products/route.ts`
- Auth: `src/lib/auth.ts`, `src/lib/auth-client.ts`
- DB connection: `src/lib/db.ts`
- Product schema: `src/lib/schema.ts`
- Product seed: `scripts/seed-products.ts`
- Business doc (fulfillment ideas): `products-lineup.md`

---

## Minimal End-to-End Sequence (MVP)

1) Frontend builds a cart and POSTs to `/api/checkout/session`.
2) Server validates items, creates pending Order, and creates Stripe Checkout Session.
3) Client redirects to `session.url`.
4) Payment completes; Stripe calls our webhook; we mark Order as `paid` and store Stripe IDs and totals.
5) If digital: enqueue render → upload to S3 → create Download entries → email customer.
6) Customer lands on success page and sees the order; downloads become available when ready.
7) Admin sees the order and download files; may refund if needed.

This plan keeps the experience simple for customers, robust for admins, and aligns with the current Next.js + Drizzle + Better Auth stack while leaving room to grow into physical fulfillment and advanced features.

