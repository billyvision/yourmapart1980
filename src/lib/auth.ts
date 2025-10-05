import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import { user } from "./schema"
import { eq } from "drizzle-orm"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  async onRequest(request: any) {
    // Auto-promote admin email to admin role
    const adminEmail = process.env.ADMIN_EMAIL;

    if (adminEmail && request.body) {
      try {
        const body = request.body as any;
        const email = body.email;

        if (email === adminEmail) {
          // Check if user exists and promote to admin
          const existingUser = await db.query.user.findFirst({
            where: eq(user.email, email),
          });

          if (existingUser && existingUser.role !== "admin") {
            await db
              .update(user)
              .set({ role: "admin" })
              .where(eq(user.id, existingUser.id));
          }
        }
      } catch (error) {
        console.error("Error in admin promotion:", error);
      }
    }

    return request;
  },
})