import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgProducts, mpgProductSizes, mpgProductVariations } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { queryWithRetry } from '@/lib/db-retry';

// GET /api/products - Public endpoint to list active products with sizes and variations
export async function GET() {
  try {
    // Fetch products with retry logic
    const products = await queryWithRetry(
      async () =>
        db
          .select()
          .from(mpgProducts)
          .where(eq(mpgProducts.isActive, true))
          .orderBy(mpgProducts.displayOrder),
      {
        maxRetries: 2,
        initialDelay: 500,
        timeout: 15000, // 15 second timeout
      }
    );

    // Fetch sizes and variations for each product with retry
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        try {
          const [sizes, variations] = await Promise.all([
            queryWithRetry(
              async () =>
                db
                  .select()
                  .from(mpgProductSizes)
                  .where(eq(mpgProductSizes.productId, product.id))
                  .orderBy(mpgProductSizes.displayOrder),
              { maxRetries: 2, initialDelay: 500, timeout: 10000 }
            ),
            queryWithRetry(
              async () =>
                db
                  .select()
                  .from(mpgProductVariations)
                  .where(
                    and(
                      eq(mpgProductVariations.productId, product.id),
                      eq(mpgProductVariations.isActive, true)
                    )
                  )
                  .orderBy(mpgProductVariations.displayOrder),
              { maxRetries: 2, initialDelay: 500, timeout: 10000 }
            ),
          ]);

          return {
            ...product,
            sizes,
            variations,
          };
        } catch (err) {
          console.error(`Error fetching details for product ${product.id}:`, err);
          // Return product with empty arrays if details fetch fails
          return {
            ...product,
            sizes: [],
            variations: [],
          };
        }
      })
    );

    return NextResponse.json({ products: productsWithDetails });
  } catch (error) {
    console.error('Error fetching products:', error);

    // Return empty products array instead of error to prevent UI breaking
    return NextResponse.json({
      products: [],
      error: 'Database connection issue. Please try again.',
      retryable: true
    }, { status: 200 }); // Return 200 with empty array
  }
}
