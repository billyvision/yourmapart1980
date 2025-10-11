import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems, downloads } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { queryWithRetry } from '@/lib/db-retry';
import { uploadFileToS3 } from '@/lib/s3-upload';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: orderId } = await params;

    // Validate order ID
    const orderIdNum = parseInt(orderId, 10);
    if (isNaN(orderIdNum)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Get current user if authenticated
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    // Fetch order
    const orderData = await queryWithRetry(
      async () =>
        db
          .select()
          .from(orders)
          .where(eq(orders.id, orderIdNum))
          .limit(1),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    if (orderData.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderData[0];

    // Parse body for guest credentials
    const formData = await req.formData();
    const orderNumber = formData.get('orderNumber') as string | null;
    const email = formData.get('email') as string | null;

    // Authorization check
    const isOwner = session?.user?.id === order.userId;
    const isGuestWithCredentials =
      !session?.user &&
      orderNumber === order.orderNumber &&
      email?.toLowerCase() === order.email.toLowerCase();

    if (!isOwner && !isGuestWithCredentials) {
      return NextResponse.json(
        { error: 'Unauthorized access to this order' },
        { status: 403 }
      );
    }

    // SECURITY: Check if order is paid - THIS IS CRITICAL
    if (order.status !== 'paid' && order.status !== 'fulfilled') {
      return NextResponse.json(
        {
          error: 'Order payment not completed',
          status: order.status,
          message: 'File upload is only allowed for paid orders',
        },
        { status: 402 }
      );
    }

    // Check fulfillment type - only digital or both
    if (order.fulfillmentType === 'physical') {
      return NextResponse.json(
        {
          error: 'Invalid order type',
          message: 'This order does not include digital products',
        },
        { status: 400 }
      );
    }

    // Get uploaded files
    const orderItemId = formData.get('orderItemId') as string | null;
    const format = formData.get('format') as string | null;
    const file = formData.get('file') as File | null;

    if (!orderItemId || !format || !file) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'orderItemId, format, and file are required',
        },
        { status: 400 }
      );
    }

    // Validate format
    const validFormats = ['pdf', 'png', 'jpg'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format', message: 'Format must be pdf, png, or jpg' },
        { status: 400 }
      );
    }

    // Validate orderItemId belongs to this order
    const orderItemIdNum = parseInt(orderItemId, 10);
    if (isNaN(orderItemIdNum)) {
      return NextResponse.json(
        { error: 'Invalid orderItemId' },
        { status: 400 }
      );
    }

    const items = await queryWithRetry(
      async () =>
        db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id)),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    const item = items.find((i) => i.id === orderItemIdNum);
    if (!item) {
      return NextResponse.json(
        { error: 'Order item not found in this order' },
        { status: 404 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Determine MIME type
    const mimeType = getMimeType(format);

    // Generate filename
    const fileName = generateFileName({
      orderNumber: order.orderNumber,
      itemId: item.id,
      productName: item.titleSnapshot || `product-${item.productId}`,
      format,
    });

    // Create pending download record
    const [downloadRecord] = await queryWithRetry(
      async () =>
        db
          .insert(downloads)
          .values({
            orderId: order.id,
            orderItemId: item.id,
            status: 'processing',
            format,
            s3Key: '', // Will be updated after upload
            fileName: '', // Will be updated after upload
            fileSize: 0, // Will be updated after upload
            mimeType,
          })
          .returning(),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    try {
      // Upload to S3
      const uploadResult = await uploadFileToS3({
        fileBuffer,
        fileName,
        mimeType,
        orderNumber: order.orderNumber,
        orderItemId: item.id,
        metadata: {
          orderId: order.id.toString(),
          orderNumber: order.orderNumber,
          productName: item.titleSnapshot || `product-${item.productId}`,
          format,
        },
      });

      // Update download record with S3 info
      await queryWithRetry(
        async () =>
          db
            .update(downloads)
            .set({
              status: 'ready',
              s3Key: uploadResult.s3Key,
              fileName: uploadResult.fileName,
              fileSize: uploadResult.fileSize,
              mimeType: uploadResult.mimeType,
              updatedAt: new Date(),
            })
            .where(eq(downloads.id, downloadRecord.id)),
        { maxRetries: 2, initialDelay: 500, timeout: 10000 }
      );

      return NextResponse.json({
        success: true,
        downloadId: downloadRecord.id,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        format,
      });
    } catch (uploadError) {
      // Mark download as failed
      await queryWithRetry(
        async () =>
          db
            .update(downloads)
            .set({
              status: 'failed',
              updatedAt: new Date(),
            })
            .where(eq(downloads.id, downloadRecord.id)),
        { maxRetries: 2, initialDelay: 500, timeout: 10000 }
      );

      throw uploadError;
    }
  } catch (error) {
    console.error('Error uploading rendered file:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Get MIME type for format
 */
function getMimeType(format: string): string {
  switch (format) {
    case 'pdf':
      return 'application/pdf';
    case 'png':
      return 'image/png';
    case 'jpg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Generate a clean filename for the rendered file
 */
function generateFileName(params: {
  orderNumber: string;
  itemId: number;
  productName: string;
  format: string;
}): string {
  const { orderNumber, itemId, productName, format } = params;

  // Clean product name for filename
  const cleanName = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${orderNumber}-${itemId}-${cleanName}.${format}`;
}
