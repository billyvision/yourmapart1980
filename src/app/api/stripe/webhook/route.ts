import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, type Stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { orders, webhookEvents, user } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { queryWithRetry } from '@/lib/db-retry';
import { orderNeedsDigitalRendering } from '@/lib/digital-rendering';

// IMPORTANT: Must run in Node.js runtime for webhook signature verification
export const runtime = 'nodejs';

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const orderNumber = session.client_reference_id;
  if (!orderNumber) {
    console.error('No order number in checkout session');
    return;
  }

  // Find order by order number
  const orderData = await queryWithRetry(
    async () =>
      db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1),
    { maxRetries: 2, initialDelay: 500, timeout: 10000 }
  );

  if (orderData.length === 0) {
    console.error(`Order ${orderNumber} not found`);
    return;
  }

  const order = orderData[0];

  // Extract payment details
  const paymentIntentId = session.payment_intent as string;
  const customerId = session.customer as string;
  const customerEmail = session.customer_details?.email || order.email;

  // Get amounts from session
  const amountTotal = session.amount_total || 0;
  const amountSubtotal = session.amount_subtotal || 0;
  const totalDiscount = session.total_details?.amount_discount || 0;
  const totalTax = session.total_details?.amount_tax || 0;
  const totalShipping = session.total_details?.amount_shipping || 0;

  // Get shipping address if physical
  const shipping = (session as any).shipping_details;
  const shippingAddress = shipping?.address
    ? {
        name: shipping.name || '',
        line1: shipping.address.line1 || '',
        line2: shipping.address.line2 || undefined,
        city: shipping.address.city || '',
        state: shipping.address.state || '',
        postal_code: shipping.address.postal_code || '',
        country: shipping.address.country || '',
        phone: session.customer_details?.phone || undefined,
      }
    : null;

  // Update order
  await queryWithRetry(
    async () =>
      db
        .update(orders)
        .set({
          status: 'paid',
          email: customerEmail,
          stripeCustomerId: customerId,
          stripePaymentIntentId: paymentIntentId,
          amountSubtotal,
          amountTotal,
          amountDiscount: totalDiscount,
          amountTax: totalTax,
          amountShipping: totalShipping,
          taxCollected: totalTax > 0,
          shippingAddress: shippingAddress ? shippingAddress : undefined,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id)),
    { maxRetries: 2, initialDelay: 500, timeout: 10000 }
  );

  // Update user stats if user is associated
  if (order.userId) {
    // Fetch current user to update stats
    const userData = await queryWithRetry(
      async () =>
        db.select().from(user).where(eq(user.id, order.userId!)).limit(1),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    if (userData.length > 0) {
      const currentUser = userData[0];
      await queryWithRetry(
        async () =>
          db
            .update(user)
            .set({
              totalSpent: currentUser.totalSpent + amountTotal,
              orderCount: currentUser.orderCount + 1,
              lastOrderAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(user.id, order.userId!)),
        { maxRetries: 2, initialDelay: 500, timeout: 10000 }
      );
    }
  }

  console.log(`Order ${orderNumber} marked as paid`);

  // Check if order needs digital rendering (client-side will handle actual rendering)
  try {
    const needsRendering = await orderNeedsDigitalRendering(order.id);

    if (needsRendering) {
      console.log(`Order ${orderNumber} ready for client-side rendering`);
      // Client will trigger rendering via checkout success page
      // Files will be uploaded to S3 via /api/orders/[id]/render-upload
    } else {
      console.log(`Order ${orderNumber} does not require digital rendering`);
    }
  } catch (renderError) {
    // Log but don't fail the webhook
    console.error(`Error checking rendering requirements for order ${orderNumber}:`, renderError);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const paymentIntentId = paymentIntent.id;

  // Find order by payment intent
  const orderData = await queryWithRetry(
    async () =>
      db
        .select()
        .from(orders)
        .where(eq(orders.stripePaymentIntentId, paymentIntentId))
        .limit(1),
    { maxRetries: 2, initialDelay: 500, timeout: 10000 }
  );

  if (orderData.length === 0) {
    console.error(`Order with payment intent ${paymentIntentId} not found`);
    return;
  }

  const order = orderData[0];

  // Update order status
  await queryWithRetry(
    async () =>
      db
        .update(orders)
        .set({
          status: 'canceled',
          canceledAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id)),
    { maxRetries: 2, initialDelay: 500, timeout: 10000 }
  );

  console.log(`Order ${order.orderNumber} marked as canceled due to payment failure`);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string;

  // Find order by payment intent
  const orderData = await queryWithRetry(
    async () =>
      db
        .select()
        .from(orders)
        .where(eq(orders.stripePaymentIntentId, paymentIntentId))
        .limit(1),
    { maxRetries: 2, initialDelay: 500, timeout: 10000 }
  );

  if (orderData.length === 0) {
    console.error(`Order with payment intent ${paymentIntentId} not found`);
    return;
  }

  const order = orderData[0];

  // Determine refund status
  const isFullyRefunded = charge.amount_refunded === charge.amount;
  const newStatus = isFullyRefunded ? 'refunded' : 'partially_refunded';

  // Update order status
  await queryWithRetry(
    async () =>
      db
        .update(orders)
        .set({
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id)),
    { maxRetries: 2, initialDelay: 500, timeout: 10000 }
  );

  console.log(`Order ${order.orderNumber} marked as ${newStatus}`);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Check for idempotency (prevent duplicate processing)
    const existingEvent = await queryWithRetry(
      async () =>
        db
          .select()
          .from(webhookEvents)
          .where(eq(webhookEvents.stripeEventId, event.id))
          .limit(1),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    if (existingEvent.length > 0) {
      console.log(`Event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true });
    }

    // Store event for idempotency
    await queryWithRetry(
      async () =>
        db.insert(webhookEvents).values({
          stripeEventId: event.id,
          type: event.type,
          payload: event.data.object as any,
          processedAt: new Date(),
        }),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
