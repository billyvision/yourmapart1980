import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgProducts, mpgProductSizes, mpgProductVariations } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/admin/products/[id] - Get single product with sizes and variations
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req.headers);
    const { id } = await context.params;
    const productId = parseInt(id);

    const [product] = await db
      .select()
      .from(mpgProducts)
      .where(eq(mpgProducts.id, productId));

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const sizes = await db
      .select()
      .from(mpgProductSizes)
      .where(eq(mpgProductSizes.productId, productId))
      .orderBy(mpgProductSizes.displayOrder);

    const variations = await db
      .select()
      .from(mpgProductVariations)
      .where(eq(mpgProductVariations.productId, productId))
      .orderBy(mpgProductVariations.displayOrder);

    return NextResponse.json({ ...product, sizes, variations });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// PATCH /api/admin/products/[id] - Update product
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req.headers);
    const { id } = await context.params;
    const productId = parseInt(id);

    const body = await req.json();
    const {
      productType,
      name,
      description,
      icon,
      image,
      image2,
      basePrice,
      isActive,
      displayOrder,
      features,
    } = body;

    const [updatedProduct] = await db
      .update(mpgProducts)
      .set({
        ...(productType && { productType }),
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(image !== undefined && { image }),
        ...(image2 !== undefined && { image2 }),
        ...(basePrice !== undefined && { basePrice }),
        ...(isActive !== undefined && { isActive }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(features !== undefined && { features }),
        updatedAt: new Date(),
      })
      .where(eq(mpgProducts.id, productId))
      .returning();

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/admin/products/[id] - Delete product (cascade deletes sizes and variations)
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req.headers);
    const { id } = await context.params;
    const productId = parseInt(id);

    const [deletedProduct] = await db
      .delete(mpgProducts)
      .where(eq(mpgProducts.id, productId))
      .returning();

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
