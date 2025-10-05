CREATE TABLE "mpg_admin_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_name" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"template_data" json NOT NULL,
	"thumbnail_url" text,
	"is_featured" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_by_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mpg_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"template_id" integer,
	"user_id" text,
	"session_id" text,
	"metadata" json,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mpg_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mpg_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "mpg_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "mpg_admin_templates" ADD CONSTRAINT "mpg_admin_templates_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mpg_analytics" ADD CONSTRAINT "mpg_analytics_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mpg_admin_templates_category_idx" ON "mpg_admin_templates" USING btree ("category");--> statement-breakpoint
CREATE INDEX "mpg_admin_templates_is_featured_idx" ON "mpg_admin_templates" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "mpg_admin_templates_display_order_idx" ON "mpg_admin_templates" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "mpg_analytics_event_type_idx" ON "mpg_analytics" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "mpg_analytics_template_id_idx" ON "mpg_analytics" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "mpg_analytics_created_at_idx" ON "mpg_analytics" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "mpg_categories_slug_idx" ON "mpg_categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "mpg_categories_display_order_idx" ON "mpg_categories" USING btree ("display_order");