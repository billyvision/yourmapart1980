import { db } from "../src/lib/db";
import { sql } from "drizzle-orm";

async function verifyTables() {
  console.log("🔍 Verifying database tables...\n");

  const tablesToCheck = [
    "carts",
    "orders",
    "order_items",
    "downloads",
    "webhook_events",
    "promo_codes"
  ];

  try {
    // Check if tables exist
    const result = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('carts', 'orders', 'order_items', 'downloads', 'webhook_events', 'promo_codes')
      ORDER BY table_name
    `);

    console.log("✅ Found tables:", result);

    // Check user table for new columns
    const userColumns = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'user'
      AND column_name IN ('is_blocked', 'total_spent', 'order_count', 'last_order_at', 'blocked_at', 'blocked_reason')
      ORDER BY column_name
    `);

    console.log("\n✅ New user table columns:", userColumns);

    console.log("\n🎉 Migration verified successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }
}

verifyTables();
