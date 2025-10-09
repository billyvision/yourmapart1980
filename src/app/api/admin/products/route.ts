import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgProducts, mpgProductSizes, mpgProductVariations } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

// GET /api/admin/products - List all products with their sizes and variations
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req.headers);

    const products = await db.select().from(mpgProducts).orderBy(desc(mpgProducts.displayOrder));

    // Fetch sizes and variations for all products
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
          .where(eq(mpgProductVariations.productId, product.id))
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// POST /api/admin/products - Create new product
export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req.headers);

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

    if (!productType || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: productType, name' },
        { status: 400 }
      );
    }

    const [newProduct] = await db
      .insert(mpgProducts)
      .values({
        productType,
        name,
        description: description || null,
        icon: icon || null,
        image: image || null,
        image2: image2 || null,
        basePrice: basePrice || null,
        isActive: isActive !== false,
        displayOrder: displayOrder || 0,
        features: features || null,
      })
      .returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
