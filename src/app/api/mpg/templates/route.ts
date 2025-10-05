import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgUserTemplates } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/mpg/templates - List user's templates
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const isPublic = searchParams.get('isPublic') === 'true';

    let query = db
      .select()
      .from(mpgUserTemplates)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(mpgUserTemplates.updatedAt));

    // If requesting public templates, filter by isPublic
    // Otherwise, show user's own templates
    if (isPublic) {
      query = query.where(eq(mpgUserTemplates.isPublic, true)) as typeof query;
    } else {
      query = query.where(eq(mpgUserTemplates.userId, session.user.id)) as typeof query;
    }

    const templates = await query;

    return NextResponse.json({
      templates,
      total: templates.length,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/mpg/templates - Save new template
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { templateName, baseTemplateId, templateData, thumbnailUrl, isPublic, isPremium } = body;

    if (!templateName || !templateData) {
      return NextResponse.json(
        { error: 'Missing required fields: templateName, templateData' },
        { status: 400 }
      );
    }

    const [newTemplate] = await db
      .insert(mpgUserTemplates)
      .values({
        userId: session.user.id,
        templateName,
        baseTemplateId: baseTemplateId || null,
        templateData,
        thumbnailUrl: thumbnailUrl || null,
        isPublic: isPublic || false,
        isPremium: isPremium || false,
      })
      .returning();

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
