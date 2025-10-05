import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgAdminTemplates } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

// GET /api/admin/mpg/templates/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req.headers);
    const { id } = await params;

    const template = await db.query.mpgAdminTemplates.findFirst({
      where: eq(mpgAdminTemplates.id, parseInt(id)),
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// PATCH /api/admin/mpg/templates/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req.headers);
    const { id } = await params;

    const body = await req.json();
    const {
      templateName,
      category,
      description,
      templateData,
      thumbnailUrl,
      isFeatured,
      isActive,
      displayOrder,
    } = body;

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (templateName !== undefined) updateData.templateName = templateName;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (templateData !== undefined) updateData.templateData = templateData;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const [updated] = await db
      .update(mpgAdminTemplates)
      .set(updateData)
      .where(eq(mpgAdminTemplates.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/admin/mpg/templates/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req.headers);
    const { id } = await params;

    await db.delete(mpgAdminTemplates).where(eq(mpgAdminTemplates.id, parseInt(id)));

    return NextResponse.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
