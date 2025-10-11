import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { carts } from '@/lib/schema';
import { eq, and, or } from 'drizzle-orm';
import { queryWithRetry } from '@/lib/db-retry';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Helper to get or create cart
async function getOrCreateCart(userId: string | null, sessionToken: string) {
  // Calculate expiry time (48 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  // Try to find existing cart
  const whereClause = userId
    ? eq(carts.userId, userId)
    : eq(carts.sessionToken, sessionToken);

  const existingCarts = await queryWithRetry(
    async () => db.select().from(carts).where(whereClause).limit(1),
    { maxRetries: 2, initialDelay: 500, timeout: 10000 }
  );

  if (existingCarts.length > 0) {
    return existingCarts[0];
  }

  // Create new cart
  const newCart = await queryWithRetry(
    async () =>
      db
        .insert(carts)
        .values({
          userId,
          sessionToken: userId ? null : sessionToken,
          items: [],
          status: 'active',
          expiresAt,
        })
        .returning(),
    { maxRetries: 2, initialDelay: 500, timeout: 10000 }
  );

  return newCart[0];
}

// GET /api/cart - Get current cart
export async function GET(req: NextRequest) {
  try {
    // Get session token from cookie or generate new one
    const sessionToken = req.cookies.get('cart_session')?.value || crypto.randomUUID();

    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id || null;

    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionToken);

    // Set session cookie if not authenticated
    const response = NextResponse.json({ cart });
    if (!userId) {
      response.cookies.set('cart_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 48, // 48 hours
      });
    }

    return response;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add/update cart items
export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    // Get session token from cookie or generate new one
    const sessionToken = req.cookies.get('cart_session')?.value || crypto.randomUUID();

    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id || null;

    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionToken);

    // Update cart items
    const updatedCart = await queryWithRetry(
      async () =>
        db
          .update(carts)
          .set({
            items,
            lastActivityAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(carts.id, cart.id))
          .returning(),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    // Set session cookie if not authenticated
    const response = NextResponse.json({ cart: updatedCart[0] });
    if (!userId) {
      response.cookies.set('cart_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 48, // 48 hours
      });
    }

    return response;
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(req: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = req.cookies.get('cart_session')?.value;

    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id || null;

    if (!userId && !sessionToken) {
      return NextResponse.json(
        { error: 'No cart found' },
        { status: 404 }
      );
    }

    // Find and delete cart
    const whereClause = userId
      ? eq(carts.userId, userId)
      : eq(carts.sessionToken, sessionToken!);

    await queryWithRetry(
      async () => db.delete(carts).where(whereClause),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    // Clear session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('cart_session');

    return response;
  } catch (error) {
    console.error('Error deleting cart:', error);
    return NextResponse.json(
      { error: 'Failed to delete cart' },
      { status: 500 }
    );
  }
}
