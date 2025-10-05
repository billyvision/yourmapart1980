import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgUserTemplates } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/mpg/templates/[id] - Get single template
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const template = await db.query.mpgUserTemplates.findFirst({
      where: eq(mpgUserTemplates.id, parseInt(id)),
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Check if user can access this template (owner or public)
    if (template.userId !== session?.user?.id && !template.isPublic) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH /api/mpg/templates/[id] - Update template
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { templateName, templateData, thumbnailUrl, isPublic, isPremium } = body;

    // Verify ownership
    const existing = await db.query.mpgUserTemplates.findFirst({
      where: eq(mpgUserTemplates.id, parseInt(id)),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Build update object (only include provided fields)
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (templateName !== undefined) updateData.templateName = templateName;
    if (templateData !== undefined) updateData.templateData = templateData;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (isPremium !== undefined) updateData.isPremium = isPremium;

    const [updated] = await db
      .update(mpgUserTemplates)
      .set(updateData)
      .where(eq(mpgUserTemplates.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/mpg/templates/[id] - Delete template
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existing = await db.query.mpgUserTemplates.findFirst({
      where: eq(mpgUserTemplates.id, parseInt(id)),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.delete(mpgUserTemplates).where(eq(mpgUserTemplates.id, parseInt(id)));

    return NextResponse.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
