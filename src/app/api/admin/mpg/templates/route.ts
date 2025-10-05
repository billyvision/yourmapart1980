import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgAdminTemplates } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

// GET /api/admin/mpg/templates - List all admin templates
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req.headers);

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');

    let query = db.select().from(mpgAdminTemplates).orderBy(desc(mpgAdminTemplates.displayOrder));

    if (category) {
      query = query.where(eq(mpgAdminTemplates.category, category)) as typeof query;
    }

    if (featured === 'true') {
      query = query.where(eq(mpgAdminTemplates.isFeatured, true)) as typeof query;
    }

    if (active !== null && active !== undefined) {
      query = query.where(eq(mpgAdminTemplates.isActive, active === 'true')) as typeof query;
    }

    const templates = await query;

    return NextResponse.json({ templates, total: templates.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// POST /api/admin/mpg/templates - Create admin template
export async function POST(req: NextRequest) {
  try {
    const adminId = await requireAdmin(req.headers);

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

    if (!templateName || !category || !templateData) {
      return NextResponse.json(
        { error: 'Missing required fields: templateName, category, templateData' },
        { status: 400 }
      );
    }

    const [newTemplate] = await db
      .insert(mpgAdminTemplates)
      .values({
        templateName,
        category,
        description: description || null,
        templateData,
        thumbnailUrl: thumbnailUrl || null,
        isFeatured: isFeatured || false,
        isActive: isActive !== false,
        displayOrder: displayOrder || 0,
        createdById: adminId,
      })
      .returning();

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
