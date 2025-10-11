CREATE TABLE "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"session_token" text,
	"email" text,
	"items" json NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"last_activity_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "carts_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_item_id" integer NOT NULL,
	"s3_key" text NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"product_type" text NOT NULL,
	"size_id" integer,
	"variation_selections" json,
	"quantity" integer NOT NULL,
	"unit_amount" integer NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"title_snapshot" text,
	"description_snapshot" text,
	"template_ref" json,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"user_id" text,
	"email" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"amount_subtotal" integer NOT NULL,
	"amount_discount" integer DEFAULT 0 NOT NULL,
	"amount_tax" integer DEFAULT 0 NOT NULL,
	"amount_shipping" integer DEFAULT 0 NOT NULL,
	"amount_total" integer NOT NULL,
	"tax_collected" boolean DEFAULT false NOT NULL,
	"fulfillment_type" text NOT NULL,
	"shipping_address" json,
	"tracking_number" text,
	"tracking_carrier" text,
	"tracking_url" text,
	"stripe_customer_id" text,
	"stripe_payment_intent_id" text,
	"stripe_checkout_session_id" text,
	"stripe_promo_code" text,
	"client_reference_id" text,
	"notes" text,
	"metadata" json,
	"canceled_at" timestamp,
	"fulfilled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"stripe_promotion_code_id" text,
	"stripe_coupon_id" text,
	"discount_type" text NOT NULL,
	"discount_value" integer NOT NULL,
	"currency" text,
	"description" text,
	"max_redemptions" integer,
	"redemption_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "promo_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"stripe_event_id" text NOT NULL,
	"type" text NOT NULL,
	"payload" json NOT NULL,
	"processed_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_events_stripe_event_id_unique" UNIQUE("stripe_event_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_blocked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "total_spent" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "order_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_order_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "blocked_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "blocked_reason" text;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_mpg_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."mpg_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_size_id_mpg_product_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."mpg_product_sizes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promo_codes" ADD CONSTRAINT "promo_codes_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "carts_user_id_idx" ON "carts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "carts_session_token_idx" ON "carts" USING btree ("session_token");--> statement-breakpoint
CREATE INDEX "carts_expires_at_idx" ON "carts" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "carts_last_activity_at_idx" ON "carts" USING btree ("last_activity_at");--> statement-breakpoint
CREATE INDEX "downloads_order_item_id_idx" ON "downloads" USING btree ("order_item_id");--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_product_id_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_email_idx" ON "orders" USING btree ("email");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_stripe_payment_intent_id_idx" ON "orders" USING btree ("stripe_payment_intent_id");--> statement-breakpoint
CREATE INDEX "promo_codes_code_idx" ON "promo_codes" USING btree ("code");--> statement-breakpoint
CREATE INDEX "promo_codes_is_active_idx" ON "promo_codes" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "promo_codes_expires_at_idx" ON "promo_codes" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "webhook_events_stripe_event_id_idx" ON "webhook_events" USING btree ("stripe_event_id");--> statement-breakpoint
CREATE INDEX "webhook_events_type_idx" ON "webhook_events" USING btree ("type");--> statement-breakpoint
CREATE INDEX "webhook_events_created_at_idx" ON "webhook_events" USING btree ("created_at");