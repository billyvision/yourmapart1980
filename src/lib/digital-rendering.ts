import { db } from './db';
import { orders, orderItems } from './schema';
import { eq } from 'drizzle-orm';
import { queryWithRetry } from './db-retry';

export type RenderFormat = 'pdf' | 'png' | 'jpg';

/**
 * Determine which formats to render based on order item variations
 * This helper is used by both client-side rendering and API validation
 */
export function getFormatsForItem(item: typeof orderItems.$inferSelect): RenderFormat[] {
  const variations = (item.variationSelections as Record<string, string>) || {};

  // Check for format variation (e.g., "PDF", "PNG", "Both")
  const formatVariation = variations.format || variations.fileFormat;

  if (formatVariation) {
    const formatLower = formatVariation.toLowerCase();
    if (formatLower === 'pdf') return ['pdf'];
    if (formatLower === 'png') return ['png'];
    if (formatLower === 'jpg' || formatLower === 'jpeg') return ['jpg'];
    if (formatLower === 'both' || formatLower === 'pdf+png') return ['pdf', 'png'];
  }

  // Default: PDF for digital products
  return ['pdf'];
}

/**
 * Get MIME type for format
 */
export function getMimeType(format: RenderFormat): string {
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
export function generateFileName(params: {
  orderNumber: string;
  itemId: number;
  productName: string;
  format: RenderFormat;
}): string {
  const { orderNumber, itemId, productName, format } = params;

  // Clean product name for filename
  const cleanName = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${orderNumber}-${itemId}-${cleanName}.${format}`;
}

/**
 * Check if an order needs digital rendering
 */
export async function orderNeedsDigitalRendering(orderId: number): Promise<boolean> {
  const order = await queryWithRetry(
    async () => db.select().from(orders).where(eq(orders.id, orderId)).limit(1),
    { maxRetries: 2, initialDelay: 500, timeout: 10000 }
  );

  if (order.length === 0) return false;

  const fulfillmentType = order[0].fulfillmentType;
  return fulfillmentType === 'digital' || fulfillmentType === 'both';
}

/**
 * Fetch order items for rendering
 * Used by client-side rendering to know what needs to be rendered
 */
export async function getOrderItemsForRendering(orderId: number) {
  const items = await queryWithRetry(
    async () =>
      db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId)),
    { maxRetries: 2, initialDelay: 500, timeout: 10000 }
  );

  return items.filter((item) => {
    // Only include items with template data (MPG posters)
    const templateRef = item.templateRef as { templateData?: Record<string, unknown> } | null;
    return templateRef?.templateData != null;
  });
}
