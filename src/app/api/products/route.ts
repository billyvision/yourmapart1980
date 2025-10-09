import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgProducts, mpgProductSizes, mpgProductVariations } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/products - Public endpoint to list active products with sizes and variations
export async function GET() {
  try {
    const products = await db
      .select()
      .from(mpgProducts)
      .where(eq(mpgProducts.isActive, true))
      .orderBy(mpgProducts.displayOrder);

    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        const sizes = await db
          .select()
          .from(mpgProductSizes)
          .where(eq(mpgProductSizes.productId, product.id))
          .orderBy(mpgProductSizes.displayOrder);

        const variations = await db
          .select()
          .from(mpgProductVariations)
          .where(
            and(
              eq(mpgProductVariations.productId, product.id),
              eq(mpgProductVariations.isActive, true)
            )
          )
          .orderBy(mpgProductVariations.displayOrder);

        return {
          ...product,
          sizes,
          variations,
        };
      })
    );

    return NextResponse.json({ products: productsWithDetails });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
