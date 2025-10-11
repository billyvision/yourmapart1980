import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { carts, orders, orderItems, mpgProducts, mpgProductSizes, mpgProductVariations, type CartItem } from '@/lib/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { queryWithRetry } from '@/lib/db-retry';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { generateOrderNumber, dollarsToCents } from '@/lib/order-utils';

// POST /api/checkout/session - Create Stripe Checkout Session
export async function POST(req: NextRequest) {
  try {
    const { cartId } = await req.json();

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id || null;
    const userEmail = session?.user?.email || null;

    // Get cart
    const cartData = await queryWithRetry(
      async () =>
        db.select().from(carts).where(eq(carts.id, cartId)).limit(1),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    if (cartData.length === 0) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const cart = cartData[0];
    const cartItems = cart.items as CartItem[];

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate cart items against database and calculate totals
    const productIds = [...new Set(cartItems.map(item => item.productId))];
    const sizeIds = [...new Set(cartItems.map(item => item.sizeId).filter(Boolean))];

    // Fetch all products
    const products = await queryWithRetry(
      async () =>
        db.select().from(mpgProducts).where(inArray(mpgProducts.id, productIds)),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    // Fetch all sizes if applicable
    const sizes = sizeIds.length > 0
      ? await queryWithRetry(
          async () =>
            db.select().from(mpgProductSizes).where(inArray(mpgProductSizes.id, sizeIds as number[])),
          { maxRetries: 2, initialDelay: 500, timeout: 10000 }
        )
      : [];

    // Validate and calculate line items
    const lineItems: any[] = [];
    const orderItemsData: any[] = [];
    let subtotal = 0;
    let hasDigital = false;
    let hasPhysical = false;

    for (const item of cartItems) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      // Determine if product is digital or physical
      const isDigital = product.productType === 'digital';
      if (isDigital) {
        hasDigital = true;
      } else {
        hasPhysical = true;
      }

      // Get price
      let price = product.basePrice || 0;
      if (item.sizeId) {
        const size = sizes.find(s => s.id === item.sizeId);
        if (size && size.price) {
          price = size.price;
        }
      }

      // Convert to cents
      const unitAmountCents = dollarsToCents(price);
      const itemTotal = unitAmountCents * item.quantity;
      subtotal += itemTotal;

      // Add to Stripe line items
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description || undefined,
            images: product.image ? [product.image] : undefined,
          },
          unit_amount: unitAmountCents,
        },
        quantity: item.quantity,
      });

      // Prepare order item data
      orderItemsData.push({
        productId: item.productId,
        productType: product.productType,
        sizeId: item.sizeId || null,
        variationSelections: item.variations || null,
        quantity: item.quantity,
        unitAmount: unitAmountCents,
        currency: 'usd',
        titleSnapshot: product.name,
        descriptionSnapshot: product.description,
        templateRef: item.templateId
          ? { templateId: item.templateId, templateData: item.templateData }
          : null,
      });
    }

    // Determine fulfillment type
    const fulfillmentType = hasDigital && hasPhysical
      ? 'mixed'
      : hasDigital
      ? 'digital'
      : 'physical';

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create pending order
    const newOrder = await queryWithRetry(
      async () =>
        db
          .insert(orders)
          .values({
            orderNumber,
            userId,
            email: userEmail || 'guest@temp.com', // Will be updated from Stripe
            status: 'pending',
            currency: 'usd',
            amountSubtotal: subtotal,
            amountDiscount: 0,
            amountTax: 0,
            amountShipping: 0,
            amountTotal: subtotal, // Will be updated after Stripe session
            fulfillmentType,
          })
          .returning(),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    const order = newOrder[0];

    // Create order items
    const orderItemsWithOrderId = orderItemsData.map(item => ({
      ...item,
      orderId: order.id,
    }));

    await queryWithRetry(
      async () => db.insert(orderItems).values(orderItemsWithOrderId),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    // Create Stripe Checkout Session
    const sessionConfig: any = {
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: {
        orderId: order.id.toString(),
        orderNumber,
        userId: userId || 'guest',
        fulfillmentType,
      },
      client_reference_id: orderNumber,
      allow_promotion_codes: true,
    };

    // Add customer email if available
    if (userEmail) {
      sessionConfig.customer_email = userEmail;
    }

    // Add shipping for physical items
    if (hasPhysical) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], // Add more as needed
      };

      // Note: Shipping rates must be configured in Stripe Dashboard
      // For now, we'll let Stripe calculate shipping
    }

    const stripeSession = await stripe.checkout.sessions.create(sessionConfig);

    // Update order with Stripe session ID
    await queryWithRetry(
      async () =>
        db
          .update(orders)
          .set({
            stripeCheckoutSessionId: stripeSession.id,
            clientReferenceId: orderNumber,
          })
          .where(eq(orders.id, order.id)),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    // Mark cart as checked out
    await queryWithRetry(
      async () =>
        db
          .update(carts)
          .set({
            status: 'checked_out',
            updatedAt: new Date(),
          })
          .where(eq(carts.id, cartId)),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    return NextResponse.json({
      sessionUrl: stripeSession.url,
      orderNumber,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
