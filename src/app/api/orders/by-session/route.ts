import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { queryWithRetry } from '@/lib/db-retry';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    // Find order by Stripe session ID
    const orderData = await queryWithRetry(
      async () =>
        db
          .select()
          .from(orders)
          .where(eq(orders.stripeCheckoutSessionId, sessionId))
          .limit(1),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    if (orderData.length === 0) {
      return NextResponse.json(
        { error: 'Order not found for this session' },
        { status: 404 }
      );
    }

    const order = orderData[0];

    // Fetch order items
    const items = await queryWithRetry(
      async () =>
        db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id)),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    // Determine if order has digital items
    const hasDigitalItems =
      order.fulfillmentType === 'digital' || order.fulfillmentType === 'both';

    // Return order details
    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      email: order.email,
      status: order.status,
      fulfillmentType: order.fulfillmentType,
      hasDigitalItems,
      items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.titleSnapshot || `Product ${item.productId}`,
        variationSelections: item.variationSelections,
        templateRef: item.templateRef,
      })),
    });
  } catch (error) {
    console.error('Error fetching order by session:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
