import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgProductVariations } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/admin/products/[id]/variations - Get all variations for a product
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req.headers);
    const { id } = await context.params;
    const productId = parseInt(id);

    const variations = await db
      .select()
      .from(mpgProductVariations)
      .where(eq(mpgProductVariations.productId, productId))
      .orderBy(mpgProductVariations.displayOrder);

    return NextResponse.json({ variations });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// POST /api/admin/products/[id]/variations - Create new variation for a product
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req.headers);
    const { id } = await context.params;
    const productId = parseInt(id);

    const body = await req.json();
    const {
      variationType,
      variationValue,
      variationLabel,
      variationDescription,
      priceModifier,
      isActive,
      displayOrder,
      metadata,
    } = body;

    if (!variationType || !variationValue || !variationLabel) {
      return NextResponse.json(
        { error: 'Missing required fields: variationType, variationValue, variationLabel' },
        { status: 400 }
      );
    }

    const [newVariation] = await db
      .insert(mpgProductVariations)
      .values({
        productId,
        variationType,
        variationValue,
        variationLabel,
        variationDescription: variationDescription || null,
        priceModifier: priceModifier || 0,
        isActive: isActive !== false,
        displayOrder: displayOrder || 0,
        metadata: metadata || null,
      })
      .returning();

    return NextResponse.json(newVariation, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
