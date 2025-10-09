import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgProductVariations } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

interface RouteContext {
  params: Promise<{ id: string; variationId: string }>;
}

// PATCH /api/admin/products/[id]/variations/[variationId] - Update a variation
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req.headers);
    const { variationId } = await context.params;
    const variationIdNum = parseInt(variationId);

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

    const [updatedVariation] = await db
      .update(mpgProductVariations)
      .set({
        ...(variationType && { variationType }),
        ...(variationValue && { variationValue }),
        ...(variationLabel && { variationLabel }),
        ...(variationDescription !== undefined && { variationDescription }),
        ...(priceModifier !== undefined && { priceModifier }),
        ...(isActive !== undefined && { isActive }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(metadata !== undefined && { metadata }),
        updatedAt: new Date(),
      })
      .where(eq(mpgProductVariations.id, variationIdNum))
      .returning();

    if (!updatedVariation) {
      return NextResponse.json({ error: 'Variation not found' }, { status: 404 });
    }

    return NextResponse.json(updatedVariation);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/admin/products/[id]/variations/[variationId] - Delete a variation
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req.headers);
    const { variationId } = await context.params;
    const variationIdNum = parseInt(variationId);

    const [deletedVariation] = await db
      .delete(mpgProductVariations)
      .where(eq(mpgProductVariations.id, variationIdNum))
      .returning();

    if (!deletedVariation) {
      return NextResponse.json({ error: 'Variation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Variation deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
