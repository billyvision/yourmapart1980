ALTER TABLE "downloads" ADD COLUMN "order_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "downloads" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "downloads" ADD COLUMN "format" text NOT NULL;--> statement-breakpoint
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "downloads_order_id_idx" ON "downloads" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "downloads_status_idx" ON "downloads" USING btree ("status");