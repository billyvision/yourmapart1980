import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgProductSizes } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/admin/products/[id]/sizes - Get all sizes for a product
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req.headers);
    const { id } = await context.params;
    const productId = parseInt(id);

    const sizes = await db
      .select()
      .from(mpgProductSizes)
      .where(eq(mpgProductSizes.productId, productId))
      .orderBy(mpgProductSizes.displayOrder);

    return NextResponse.json({ sizes });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// POST /api/admin/products/[id]/sizes - Create new size for a product
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req.headers);
    const { id } = await context.params;
    const productId = parseInt(id);

    const body = await req.json();
    const { sizeValue, sizeLabel, dimensions, price, isPopular, displayOrder } = body;

    if (!sizeValue || !sizeLabel) {
      return NextResponse.json(
        { error: 'Missing required fields: sizeValue, sizeLabel' },
        { status: 400 }
      );
    }

    const [newSize] = await db
      .insert(mpgProductSizes)
      .values({
        productId,
        sizeValue,
        sizeLabel,
        dimensions: dimensions || null,
        price: price || null,
        isPopular: isPopular || false,
        displayOrder: displayOrder || 0,
      })
      .returning();

    return NextResponse.json(newSize, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
