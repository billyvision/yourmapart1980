# Email Integration Plan — Brevo (Sendinblue)

Last updated: 2025-10-11

This document proposes a complete, non-breaking email integration using Brevo (Sendinblue) for YourMapArt1980. It is designed to work with the existing Next.js App Router, Drizzle/Postgres, and Better Auth setup, and to align with the Stripe integration plan in `stripe-integration.md`.

Goals

- Transactional emails for orders, digital delivery, shipping, refunds, and account events.
- Marketing emails for abandoned carts, review requests, and winbacks — with compliant unsubscribe handling.
- Admin alerts for new orders and daily summaries.
- Event logging, idempotency, and deliverability best practices (SPF/DKIM/DMARC).
- Use Brevo Transactional API + Dynamic Templates, and Brevo Webhooks for delivery analytics.

---

## Why Brevo

- All-in-one: transactional + marketing + automations.
- Cost-effective and reliable inboxing; supports Apple Mail Privacy edge cases.
- Dynamic templates, contact lists, segments, and webhooks.
- SMTP or HTTP API; we will use HTTP API (v3) for control and logging.

---

## Email Categories and Templates

Transactional (no unsubscribe)

- Order Confirmation
  - Trigger: `checkout.session.completed` webhook.
  - Data: `orderNumber`, items, subtotal/tax/shipping/total, billing email, shipping address (if physical), fulfillment type.
- Digital Files Ready
  - Trigger: when digital exports finish and are uploaded to S3.
  - Data: download links (pre-signed URLs via our API), expiration notice, support link.
- Shipping Update / Tracking
  - Trigger: when admin marks fulfilled or tracking added.
  - Data: carrier, tracking number/link, items summary, orderNumber.
- Delivery Confirmation
  - Trigger: optional, after delivery date/confirmation or a time delay.
  - Data: short confirmation + support CTA.
- Refund Issued
  - Trigger: on refund webhook or admin-initiated refund.
  - Data: amount, items affected, orderNumber.
- Account Emails (if/when wired to Better Auth)
  - Welcome, password reset, login alerts; can be phased later.

Marketing (with unsubscribe)

- Abandoned Cart Reminder(s)
  - Trigger: abandoned detection job (schedule) if cart is inactive and email present.
  - Sequence: 1st reminder (after 2–4h), 2nd reminder (after 24–48h, optional incentive).
- Review Request (Google Review)
  - Trigger: 7–10 days after fulfilled/delivered for physical; immediately or 2 days later for digital.
  - Data: direct review link with UTM; polite ask + incentive (optional).
- Winback / “Complete Your Design” (optional)
  - Trigger: after 30+ days of inactivity.

Admin Alerts

- New Paid Order Alert (instant)
  - Trigger: `checkout.session.completed` / order finalized.
  - Data: orderNumber, items, totals.
- Daily Order Summary (digest)
  - Trigger: scheduled (Vercel Cron) — previous 24h stats.

Templates

- Use Brevo dynamic templates (Handlebars-like variables).
- Shared footer/header with brand colors and logo.
- Light/dark-safe palette, ALT text, preheader text, and mobile-first layout.
- Maintain separate templates for transactional and marketing (for compliance and analytics separation).

---

## Data Model Additions (Proposed)

These are conceptual Drizzle tables; do not implement yet. Names/types may be adjusted during migration.

EmailQueue

- id (PK, serial)
- toEmail (text)
- templateKey (text; e.g., `order_confirmation`, `digital_ready`, `abandoned_cart_1`)
- subject (text)
- payload (json) — dynamic variables for the template
- category (text: transactional | marketing | admin)
- status (text: pending | sending | sent | failed | canceled)
- attemptCount (int)
- scheduledAt (timestamp, nullable)
- sentAt / failedAt (timestamp, nullable)
- relatedEntity (json) — e.g., `{ orderId, orderItemId, userId, cartId }`
- idempotencyKey (text, unique, nullable) — to prevent dupes
- createdAt / updatedAt (timestamp)

EmailLog

- id (PK, serial)
- queueId (FK → EmailQueue)
- brevoMessageId (text)
- event (text: requested | sent | delivered | opened | clicked | bounced | complained | unsubscribed)
- metadata (json) — raw webhook event payload
- createdAt (timestamp)

EmailPreferences

- id (PK, serial)
- userId (text, nullable) — link if known
- email (text) — primary identifier for guests
- marketingOptIn (boolean, default true)
- reviewRequestsOptIn (boolean, default true)
- createdAt / updatedAt (timestamp)

Notes

- Transactional emails bypass preferences (critical service messages).
- Marketing emails check `marketingOptIn` and specific toggles.

---

## API Surface (Proposed)

- POST `src/app/api/emails/send/route.ts`
  - Internal-only (auth gate / admin key). Enqueue/send transactional/admin emails.
- POST `src/app/api/emails/webhooks/brevo/route.ts`
  - Node runtime. Verifies Brevo signature (if enabled), records delivery/open/click/bounce/spam/unsubscribe events in `EmailLog` and updates `EmailPreferences` for unsubscribes.
- POST `src/app/api/emails/abandoned/run/route.ts`
  - Node runtime. Scheduled by Vercel Cron to scan for abandoned carts and enqueue emails.
- POST `src/app/api/emails/review-requests/run/route.ts`
  - Node runtime. Scheduled to send review requests based on fulfilled/delivered timings.

Runtime Notes

- Declare `export const runtime = 'nodejs'` for webhook/scheduled routes.
- Rate-limit endpoints and require internal auth for scheduled jobs.

---

## Triggers and Flow

Order-Related (Stripe + Orders)

1) Order Created (pending) → No email yet.
2) Payment Succeeded (`checkout.session.completed`) → enqueue Transactional: Order Confirmation (immediate).
3) Digital Items Ready → enqueue Transactional: Digital Files Ready (with secure links via our API that mint pre-signed S3 URLs).
4) Fulfillment Update → enqueue Transactional: Shipping Update (with tracking); later Delivery Confirmation.
5) Refund → enqueue Transactional: Refund Issued.

Abandoned Cart

- Persist carts server-side (guest carts keyed by temporary token + email if captured; logged-in carts keyed by userId).
- A cart is “abandoned” if:
  - Contains at least 1 item
  - Has no successful order within N hours
  - Last activity older than threshold (e.g., 2 hours for reminder 1; 24 hours for reminder 2)
- Job scans carts and `EmailQueue` to avoid duplicates via `idempotencyKey`.
- Only send if we have consent or a clear expectation (e.g., email entered during checkout stage with consent checkbox; configure per jurisdiction).

Review Request (Google Review)

- Trigger: X days after order marked delivered/fulfilled.
- Email includes direct review URL, UTM params, and orderNumber reference.
- Respect marketing preferences; one reminder max.

Admin Alerts

- New Order Alert: immediate email to configured admin list on payment success.
- Daily Summary: aggregates count, revenue, top products, refunds, and sends once daily via Vercel Cron.

---

## Template Variables (Examples)

Common

- `siteName`, `siteUrl`, `supportEmail`, `supportUrl`, `brandColor`, `logoUrl`, `preheader`

Order Confirmation

- `orderNumber`, `orderDate`, `customerName`, `email`, `billingAddress`, `shippingAddress`, `items[] { name, size, options, qty, unitAmount, lineAmount }`, `subtotal`, `discount`, `tax`, `shipping`, `total`

Digital Files Ready

- `orderNumber`, `items[] { name, downloadLinks[] }`, `linkExpiresAt`, `tips`

Shipping Update

- `orderNumber`, `carrier`, `trackingNumber`, `trackingUrl`, `items[]`

Refund Issued

- `orderNumber`, `refundedAmount`, `items[]`, `notes`

Abandoned Cart

- `firstName` (if available), `cartItems[] { name, size, options, qty, price }`, `cartUrl`, `discountCode` (optional)

Review Request

- `firstName`, `orderNumber`, `reviewUrl`

Admin Alerts

- `orderNumber`, `customerEmail`, `items[]`, `total`, `adminOrderUrl`

---

## Deliverability and Compliance

- Authenticate domain (mandatory):
  - SPF: include `spf.brevo.com` in your SPF TXT
  - DKIM: add Brevo DKIM CNAMEs
  - DMARC: publish a DMARC TXT (p=none → quarantine → reject as you gain confidence)
- From/Reply-To:
  - Dedicated sender like `orders@yourmapart1980.com` (transactional)
  - Marketing sender like `hello@yourmapart1980.com` (marketing)
- Unsubscribe:
  - Marketing emails must include unsubscribe link (Brevo handles list/unsubscribe by default). Store preference in `EmailPreferences`.
  - Transactional emails must NOT include unsubscribe (service-critical).
- Content:
  - Accessible HTML, meaningful ALT text, concise preheaders, low image-to-text ratio, and clear CTAs.
  - Avoid spammy phrases and excessive punctuation/emoji. Test with seed accounts across providers.

---

## Webhooks and Analytics

- Configure Brevo webhook to `POST /api/emails/webhooks/brevo` for: delivered, opened, clicked, bounced, spam, unsubscribed.
- Store events in `EmailLog` with `brevoMessageId` and raw payload.
- Update `EmailPreferences` on unsubscribe events.
- Use events to power simple analytics dashboards later (open rate, CTR, bounce rate per template).

---

## Scheduling and Retry

- Use Vercel Cron to call:
  - `/api/emails/abandoned/run` hourly (or more frequently)
  - `/api/emails/review-requests/run` daily
  - `/api/admin/orders/digest` daily (if you prefer a distinct endpoint)
- Sending retries:
  - `EmailQueue.status = failed` with `attemptCount` < 3 → re-enqueue with exponential backoff (e.g., 5m, 30m, 2h)
  - Hard bounces: do not retry; mark address as invalid

---

## Environment Variables (to add later)

- `BREVO_API_KEY`
- `EMAIL_SENDER_NAME` (e.g., "YourMapArt1980")
- `EMAIL_SENDER_ADDRESS` (e.g., `orders@yourmapart1980.com`)
- `EMAIL_MARKETING_SENDER_ADDRESS` (e.g., `hello@yourmapart1980.com`)
- `EMAIL_ADMIN_ALERTS` (comma-separated list)
- `NEXT_PUBLIC_APP_URL` (already present; used for links)

Optional

- `EMAIL_REVIEW_URL` (Google review link base) — or compute per locale
- `EMAIL_SUPPORT_ADDRESS` / `EMAIL_SUPPORT_URL`

---

## Integration Points in Repo

- Stripe Webhook → transactional triggers
  - `src/app/api/stripe/webhook/route.ts` (proposed in Stripe plan) will enqueue: order confirmation, admin alert.
- Digital Export Completion → digital files ready
  - After S3 upload (see `src/lib/mpg/*` utilities), enqueue “files ready”.
- Admin Fulfillment Actions → shipping/delivery updates
  - When updating order status/tracking via admin routes, enqueue shipment emails.
- Abandoned Cart → scheduled job endpoint
  - New routes under `src/app/api/emails/abandoned/run/route.ts` (Node runtime) to scan carts and enqueue marketing reminders.

Related Files

- Products API: `src/app/api/products/route.ts`
- Auth: `src/lib/auth.ts`, `src/lib/auth-client.ts`
- DB: `src/lib/db.ts`, `src/lib/schema.ts`
- Business plan: `products-lineup.md`
- Stripe plan: `stripe-integration.md`

---

## Phased Implementation Plan

Phase 1 — Transactional Core

- Set up Brevo domain authentication (SPF/DKIM/DMARC) and API key.
- Create transactional templates (Order Confirmation, Digital Ready, Shipping Update, Refund Issued, Admin New Order).
- Add `EmailQueue` + `EmailLog` tables and sending utility.
- Hook Stripe webhook to enqueue Order Confirmation + Admin Alert.

Phase 2 — Marketing + Scheduling

- Add `EmailPreferences` and unsubscribe handling.
- Implement abandoned cart detection job and reminders.
- Implement review request scheduler and template.
- Add daily admin summary.

Phase 3 — Analytics & UX Polish

- Dashboard for email metrics (deliveries, opens, clicks, bounces per template).
- A/B testing subject lines/CTAs for marketing emails.
- Localized templates and time-zone aware sends.

---

## Open Decisions (please confirm)

- Abandoned cart timing: Reminder 1 at 2–4 hours, Reminder 2 at 24–48 hours?
- Include incentive (e.g., 10% off) in Reminder 2?
- Review request delay: 7–10 days post-fulfillment (physical) and 2 days (digital)?
- Sender addresses/names for transactional vs marketing?
- Single admin inbox vs multiple recipients for alerts/digests?

---

## Minimal End-to-End Sequence (Transactional)

1) Customer pays → Stripe webhook fires → enqueue Order Confirmation to `EmailQueue`.
2) Worker/sender sends via Brevo API → `EmailLog` records `requested/sent`.
3) Brevo webhook posts delivery/open/click → `EmailLog` updates; failures retried.
4) Digital renders finish → enqueue Digital Files Ready with secure links.
5) Admin marks shipped → enqueue Shipping Update; later Delivery Confirmation.

This plan integrates Brevo cleanly with your current stack, supports both transactional and marketing needs, and aligns with the proposed Stripe order lifecycle and S3 delivery pipeline.

---

## Template Catalog + Example Payloads

Below are concrete templates with suggested subjects/preheaders, required params, and example payloads for the Brevo API `params` object.

1) order_confirmation

- Subject: YourMapArt1980 · Order {{orderNumber}} confirmed
- Preheader: Thanks for your purchase — here are your order details.
- Required params: `orderNumber`, `orderDate`, `email`, `items[]`, `subtotal`, `discount`, `tax`, `shipping`, `total`, `billingAddress?`, `shippingAddress?`
- Example `params`:
  ```json
  {
    "siteName": "YourMapArt1980",
    "siteUrl": "https://yourmapart1980.com",
    "orderNumber": "YMA-2025-8H3K9C2D",
    "orderDate": "2025-10-11T10:30:00Z",
    "email": "jane@example.com",
    "items": [
      {"name": "Framed Print", "size": "16x20", "options": "Black Frame, Matte", "qty": 1, "unitAmount": 11999, "lineAmount": 11999, "currency": "USD"}
    ],
    "subtotal": 11999,
    "discount": 0,
    "tax": 1080,
    "shipping": 1299,
    "total": 14378,
    "currency": "USD",
    "supportEmail": "support@yourmapart1980.com",
    "brandColor": "#0f766e",
    "logoUrl": "https://yourmapart1980.com/logo.png",
    "preheader": "Thanks for your purchase — here are your order details."
  }
  ```

2) digital_ready

- Subject: YourMapArt1980 · Your digital files are ready
- Preheader: Download your high‑resolution files now.
- Required params: `orderNumber`, `items[] { name, downloadLinks[] }`, `linkExpiresAt?`
- Example `params`:
  ```json
  {
    "orderNumber": "YMA-2025-8H3K9C2D",
    "items": [
      {
        "name": "Digital Download",
        "downloadLinks": [
          {"label": "PNG (300 DPI)", "url": "https://yourmapart1980.com/api/orders/123/downloads/456"},
          {"label": "PDF (A4)", "url": "https://yourmapart1980.com/api/orders/123/downloads/789"}
        ]
      }
    ],
    "linkExpiresAt": "2025-10-18T00:00:00Z",
    "tips": "Keep a local backup of your files."
  }
  ```

3) shipping_update

- Subject: YourMapArt1980 · Your order {{orderNumber}} has shipped
- Preheader: Tracking details are included below.
- Required params: `orderNumber`, `carrier`, `trackingNumber`, `trackingUrl`, `items[]`
- Example `params`:
  ```json
  {
    "orderNumber": "YMA-2025-8H3K9C2D",
    "carrier": "UPS",
    "trackingNumber": "1Z999AA10123456784",
    "trackingUrl": "https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=1Z999AA10123456784",
    "items": [
      {"name": "Framed Print", "size": "16x20", "qty": 1}
    ]
  }
  ```

4) delivery_confirmation

- Subject: YourMapArt1980 · Order {{orderNumber}} delivered
- Preheader: We hope you love it — need help? We’re here.
- Required params: `orderNumber`, `items[]`, `supportUrl?`
- Example `params`:
  ```json
  {
    "orderNumber": "YMA-2025-8H3K9C2D",
    "items": [
      {"name": "Canvas Print", "size": "18x24", "qty": 1}
    ],
    "supportUrl": "https://yourmapart1980.com/support"
  }
  ```

5) refund_issued

- Subject: YourMapArt1980 · Refund processed for {{orderNumber}}
- Preheader: We’ve issued your refund; details inside.
- Required params: `orderNumber`, `refundedAmount`, `currency`, `items[]?`, `notes?`
- Example `params`:
  ```json
  {
    "orderNumber": "YMA-2025-8H3K9C2D",
    "refundedAmount": 4999,
    "currency": "USD",
    "items": [{"name": "Poster", "size": "11x14", "qty": 1}],
    "notes": "Refund processed to your original payment method."
  }
  ```

6) abandoned_cart_1

- Subject: Your design is waiting — complete your order
- Preheader: Pick up where you left off in Map Studio.
- Required params: `cartUrl`, `cartItems[] { name, size?, options?, qty, price }`, `firstName?`, `discountCode?`
- Example `params`:
  ```json
  {
    "firstName": "Jane",
    "cartUrl": "https://yourmapart1980.com/cart?token=abc123",
    "cartItems": [
      {"name": "Digital Download", "qty": 1, "price": 999},
      {"name": "Poster", "size": "16x20", "qty": 1, "price": 4999}
    ],
    "discountCode": null
  }
  ```

7) abandoned_cart_2

- Subject: A little thank‑you — 10% off to finish your order
- Preheader: Your map is almost ready; claim your discount.
- Required params: same as `abandoned_cart_1` plus `discountCode`
- Example `params`:
  ```json
  {
    "firstName": "Jane",
    "cartUrl": "https://yourmapart1980.com/cart?token=abc123",
    "cartItems": [
      {"name": "Poster", "size": "16x20", "qty": 1, "price": 4999}
    ],
    "discountCode": "THANKYOU10"
  }
  ```

8) review_request

- Subject: How did we do? Leave a quick review
- Preheader: Your feedback helps us improve.
- Required params: `firstName?`, `orderNumber`, `reviewUrl`
- Example `params`:
  ```json
  {
    "firstName": "Jane",
    "orderNumber": "YMA-2025-8H3K9C2D",
    "reviewUrl": "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID&source=YMA_email"
  }
  ```

9) admin_new_order

- Subject: New paid order · {{orderNumber}}
- Preheader: Quick summary and link to admin detail.
- Required params: `orderNumber`, `customerEmail`, `items[]`, `total`, `adminOrderUrl`
- Example `params`:
  ```json
  {
    "orderNumber": "YMA-2025-8H3K9C2D",
    "customerEmail": "jane@example.com",
    "items": [
      {"name": "Framed Print", "size": "16x20", "qty": 1}
    ],
    "total": 14378,
    "currency": "USD",
    "adminOrderUrl": "https://yourmapart1980.com/admin/orders/123"
  }
  ```

10) admin_daily_summary

- Subject: Daily summary · {{date}} — {{ordersCount}} orders, {{revenue}}
- Preheader: Top products, refunds, and quick stats.
- Required params: `date`, `ordersCount`, `revenue`, `currency`, `topProducts[]?`, `refundsCount`, `newCustomers`
- Example `params`:
  ```json
  {
    "date": "2025-10-11",
    "ordersCount": 17,
    "revenue": 152300,
    "currency": "USD",
    "refundsCount": 1,
    "newCustomers": 9,
    "topProducts": [
      {"name": "Poster 16x20", "orders": 6, "revenue": 29994},
      {"name": "Framed 16x20", "orders": 4, "revenue": 47996}
    ]
  }
  ```

---

## Template Keys ↔ Brevo Template IDs

Assign template IDs in Brevo and keep a mapping. Recommended: store these in environment variables or a small config object.

- `order_confirmation` → `TPL_ORDER_CONFIRMATION` (e.g., 101)
- `digital_ready` → `TPL_DIGITAL_READY` (e.g., 102)
- `shipping_update` → `TPL_SHIPPING_UPDATE` (e.g., 103)
- `delivery_confirmation` → `TPL_DELIVERY_CONFIRMATION` (e.g., 104)
- `refund_issued` → `TPL_REFUND_ISSUED` (e.g., 105)
- `abandoned_cart_1` → `TPL_ABANDONED_CART_1` (e.g., 201)
- `abandoned_cart_2` → `TPL_ABANDONED_CART_2` (e.g., 202)
- `review_request` → `TPL_REVIEW_REQUEST` (e.g., 301)
- `admin_new_order` → `TPL_ADMIN_NEW_ORDER` (e.g., 401)
- `admin_daily_summary` → `TPL_ADMIN_DAILY_SUMMARY` (e.g., 402)

---

## Brevo API Request Examples

Send transactional/admin email via HTTP API:

Request

```http
POST https://api.brevo.com/v3/smtp/email
Content-Type: application/json
api-key: <BREVO_API_KEY>

{
  "sender": {"name": "YourMapArt1980", "email": "orders@yourmapart1980.com"},
  "to": [{"email": "jane@example.com", "name": "Jane Doe"}],
  "templateId": 101,
  "params": { "orderNumber": "YMA-2025-8H3K9C2D", "total": 14378, "currency": "USD" },
  "tags": ["order_confirmation", "yma"],
  "headers": {"X-Entity": "order", "X-Order-Number": "YMA-2025-8H3K9C2D"}
}
```

Response (truncated)

```json
{ "messageId": "<20251011.abcdef@mail.yourmapart1980.com>" }
```

Idempotency suggestions

- Use a deterministic `idempotencyKey` in `EmailQueue`, e.g.:
  - `email:order_confirmation:orderId=<id>`
  - `email:digital_ready:orderItemId=<id>`
  - `email:abandoned_cart_1:cartId=<id>`
- Before enqueue/send, check if a row with the same key already exists with `sent|sending`.

Unsubscribe handling

- Marketing templates should include Brevo’s unsubscribe placeholders or link and also update `EmailPreferences` on webhook `unsubscribed`.
- Transactional templates must not include unsubscribe links.

---

## Copy Guidelines (Brief)

- Voice: friendly, concise, and clear; emphasize next steps (CTA-first).
- Subjects: 45–60 chars; preheaders ~80 chars; avoid spammy terms.
- Layout: mobile-first; large CTAs; accessible contrast; clear hierarchy.
- Branding: consistent logo, colors, and iconography; keep text-forward for inboxing.

---

## Review Links

- Preferred Google URL pattern: `https://search.google.com/local/writereview?placeid=<PLACE_ID>`
- Store `PLACE_ID` in an env variable; add UTM parameters to track email influence.
