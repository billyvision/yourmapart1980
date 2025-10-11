import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems, downloads } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { queryWithRetry } from '@/lib/db-retry';
import { generatePresignedUrls, EXPIRY_PRESETS } from '@/lib/s3-presigned-url';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: orderId } = await params;

    // Parse query params for guest access
    const searchParams = req.nextUrl.searchParams;
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    // Get current user if authenticated
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    // Validate order ID
    const orderIdNum = parseInt(orderId, 10);
    if (isNaN(orderIdNum)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Fetch order with items
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

    // Check if order is paid
    if (order.status !== 'paid' && order.status !== 'fulfilled') {
      return NextResponse.json(
        {
          error: 'Order payment not completed',
          status: order.status,
          message: 'Downloads are only available for paid orders',
        },
        { status: 402 }
      );
    }

    // Check fulfillment type - only digital or both
    if (order.fulfillmentType === 'physical') {
      return NextResponse.json(
        {
          error: 'No digital downloads for this order',
          message: 'This order contains only physical products',
        },
        { status: 400 }
      );
    }

    // Fetch order items
    const items = await queryWithRetry(
      async () =>
        db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id)),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    // Fetch download records by orderId
    const downloadRecords = await queryWithRetry(
      async () =>
        db
          .select()
          .from(downloads)
          .where(eq(downloads.orderId, order.id)),
      { maxRetries: 2, initialDelay: 500, timeout: 10000 }
    );

    // Check if files are ready
    const allFilesReady = items.every((item) => {
      const itemDownloads = downloadRecords.filter(
        (d) => d.orderItemId === item.id
      );
      return itemDownloads.length > 0 && itemDownloads.every((d) => d.status === 'ready');
    });

    if (!allFilesReady) {
      return NextResponse.json(
        {
          error: 'Files not ready',
          status: 'processing',
          message: 'Your files are being generated. Please check back in a few minutes.',
          order: {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
          },
        },
        { status: 202 } // 202 Accepted - processing
      );
    }

    // Generate pre-signed URLs for all ready downloads
    const readyDownloads = downloadRecords.filter((d) => d.status === 'ready');

    if (readyDownloads.length === 0) {
      return NextResponse.json(
        {
          error: 'No files available',
          message: 'No downloadable files found for this order',
        },
        { status: 404 }
      );
    }

    // Generate pre-signed URLs (48-hour expiry)
    const presignedUrls = await generatePresignedUrls(
      readyDownloads.map((download) => ({
        s3Key: download.s3Key,
        expiresIn: EXPIRY_PRESETS.TWO_DAYS,
        fileName: download.fileName,
      }))
    );

    // Map downloads with their URLs
    const downloadLinks = readyDownloads.map((download, index) => {
      const item = items.find((i) => i.id === download.orderItemId);
      const presignedUrl = presignedUrls[index];

      return {
        id: download.id,
        orderItemId: download.orderItemId,
        fileName: download.fileName,
        fileSize: download.fileSize,
        mimeType: download.mimeType,
        downloadUrl: presignedUrl.url,
        expiresAt: presignedUrl.expiresAt,
        productName: item?.titleSnapshot || `Product ${item?.productId}` || 'Unknown Product',
        format: download.format,
      };
    });

    // Return success response
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
        email: order.email,
      },
      downloads: downloadLinks,
      expiryNotice: 'Download links expire in 48 hours',
    });
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch downloads',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
