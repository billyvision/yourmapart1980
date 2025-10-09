import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgProductSizes } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

interface RouteContext {
  params: Promise<{ id: string; sizeId: string }>;
}

// PATCH /api/admin/products/[id]/sizes/[sizeId] - Update a size
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req.headers);
    const { sizeId } = await context.params;
    const sizeIdNum = parseInt(sizeId);

    const body = await req.json();
    const { sizeValue, sizeLabel, dimensions, price, isPopular, displayOrder } = body;

    const [updatedSize] = await db
      .update(mpgProductSizes)
      .set({
        ...(sizeValue && { sizeValue }),
        ...(sizeLabel && { sizeLabel }),
        ...(dimensions !== undefined && { dimensions }),
        ...(price !== undefined && { price }),
        ...(isPopular !== undefined && { isPopular }),
        ...(displayOrder !== undefined && { displayOrder }),
        updatedAt: new Date(),
      })
      .where(eq(mpgProductSizes.id, sizeIdNum))
      .returning();

    if (!updatedSize) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    }

    return NextResponse.json(updatedSize);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/admin/products/[id]/sizes/[sizeId] - Delete a size
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req.headers);
    const { sizeId } = await context.params;
    const sizeIdNum = parseInt(sizeId);

    const [deletedSize] = await db
      .delete(mpgProductSizes)
      .where(eq(mpgProductSizes.id, sizeIdNum))
      .returning();

    if (!deletedSize) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Size deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
