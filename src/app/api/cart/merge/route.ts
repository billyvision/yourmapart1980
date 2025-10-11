import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { carts, type CartItem } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { queryWithRetry } from '@/lib/db-retry';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// POST /api/cart/merge - Merge guest cart into user cart after login
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get guest session token from cookie
    const guestSessionToken = req.cookies.get('cart_session')?.value;

    if (!guestSessionToken) {
      return NextResponse.json(
        { error: 'No guest cart found' },
        { status: 404 }
      );
    }

    // Find guest cart
    const guestCarts = await queryWithRetry(
      async () =>
        db
          .select()
          .from(carts)
          .where(eq(carts.sessionToken, guestSessionToken))
          .limit(1),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    if (guestCarts.length === 0) {
      // No guest cart to merge
      const response = NextResponse.json({ success: true, merged: false });
      response.cookies.delete('cart_session');
      return response;
    }

    const guestCart = guestCarts[0];

    // Find user cart
    const userCarts = await queryWithRetry(
      async () =>
        db
          .select()
          .from(carts)
          .where(eq(carts.userId, userId))
          .limit(1),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    if (userCarts.length === 0) {
      // User has no cart, just assign guest cart to user
      await queryWithRetry(
        async () =>
          db
            .update(carts)
            .set({
              userId,
              sessionToken: null,
              lastActivityAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(carts.id, guestCart.id)),
        { maxRetries: 2, initialDelay: 500, timeout: 10000 }
      );

      const response = NextResponse.json({ success: true, merged: true });
      response.cookies.delete('cart_session');
      return response;
    }

    // Merge items from guest cart into user cart
    const userCart = userCarts[0];
    const guestItems = guestCart.items as CartItem[];
    const userItems = userCart.items as CartItem[];

    // Merge logic: combine items, add quantities for duplicate products
    const mergedItems = [...userItems];

    for (const guestItem of guestItems) {
      const existingIndex = mergedItems.findIndex(
        (item) =>
          item.productId === guestItem.productId &&
          item.sizeId === guestItem.sizeId &&
          JSON.stringify(item.variations) === JSON.stringify(guestItem.variations)
      );

      if (existingIndex >= 0) {
        // Item exists, add quantities
        mergedItems[existingIndex].quantity += guestItem.quantity;
      } else {
        // New item, add to cart
        mergedItems.push(guestItem);
      }
    }

    // Update user cart with merged items
    await queryWithRetry(
      async () =>
        db
          .update(carts)
          .set({
            items: mergedItems,
            lastActivityAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(carts.id, userCart.id)),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    // Delete guest cart
    await queryWithRetry(
      async () => db.delete(carts).where(eq(carts.id, guestCart.id)),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    // Clear guest session cookie
    const response = NextResponse.json({ success: true, merged: true });
    response.cookies.delete('cart_session');

    return response;
  } catch (error) {
    console.error('Error merging carts:', error);
    return NextResponse.json(
      { error: 'Failed to merge carts' },
      { status: 500 }
    );
  }
}
