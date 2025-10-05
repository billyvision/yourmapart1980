CREATE TABLE "mpg_export_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"template_id" integer,
	"export_format" text NOT NULL,
	"export_size" text NOT NULL,
	"export_quality" text NOT NULL,
	"export_dpi" integer DEFAULT 96,
	"file_url" text,
	"file_name" text NOT NULL,
	"file_size" integer,
	"is_premium_export" boolean DEFAULT false,
	"payment_id" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mpg_user_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"template_name" text NOT NULL,
	"base_template_id" text,
	"template_data" json NOT NULL,
	"thumbnail_url" text,
	"is_public" boolean DEFAULT false,
	"is_premium" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mpg_export_history" ADD CONSTRAINT "mpg_export_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mpg_export_history" ADD CONSTRAINT "mpg_export_history_template_id_mpg_user_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."mpg_user_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mpg_user_templates" ADD CONSTRAINT "mpg_user_templates_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mpg_export_history_user_id_idx" ON "mpg_export_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "mpg_export_history_created_at_idx" ON "mpg_export_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "mpg_user_templates_user_id_idx" ON "mpg_user_templates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "mpg_user_templates_is_public_idx" ON "mpg_user_templates" USING btree ("is_public");