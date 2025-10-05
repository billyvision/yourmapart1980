import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgAnalytics, mpgUserTemplates, mpgExportHistory } from '@/lib/schema';
import { desc, eq, count, sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

// GET /api/admin/mpg/analytics - Get analytics data
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req.headers);

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'overview';

    switch (type) {
      case 'overview':
        return getOverviewStats();
      case 'templates':
        return getTemplateStats();
      case 'exports':
        return getExportStats();
      case 'events':
        return getRecentEvents(req);
      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

async function getOverviewStats() {
  const [templateCount] = await db
    .select({ count: count() })
    .from(mpgUserTemplates);

  const [exportCount] = await db
    .select({ count: count() })
    .from(mpgExportHistory);

  const [analyticsCount] = await db
    .select({ count: count() })
    .from(mpgAnalytics);

  const recentExports = await db
    .select()
    .from(mpgExportHistory)
    .orderBy(desc(mpgExportHistory.createdAt))
    .limit(10);

  return NextResponse.json({
    stats: {
      totalTemplates: templateCount.count,
      totalExports: exportCount.count,
      totalEvents: analyticsCount.count,
    },
    recentExports,
  });
}

async function getTemplateStats() {
  const popularTemplates = await db
    .select({
      templateId: mpgAnalytics.templateId,
      eventCount: count(),
    })
    .from(mpgAnalytics)
    .where(eq(mpgAnalytics.eventType, 'template_select'))
    .groupBy(mpgAnalytics.templateId)
    .orderBy(desc(count()))
    .limit(10);

  return NextResponse.json({ popularTemplates });
}

async function getExportStats() {
  const exportsByFormat = await db
    .select({
      format: mpgExportHistory.exportFormat,
      count: count(),
    })
    .from(mpgExportHistory)
    .groupBy(mpgExportHistory.exportFormat);

  const exportsBySize = await db
    .select({
      size: mpgExportHistory.exportSize,
      count: count(),
    })
    .from(mpgExportHistory)
    .groupBy(mpgExportHistory.exportSize);

  return NextResponse.json({
    byFormat: exportsByFormat,
    bySize: exportsBySize,
  });
}

async function getRecentEvents(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50');

  const events = await db
    .select()
    .from(mpgAnalytics)
    .orderBy(desc(mpgAnalytics.createdAt))
    .limit(limit);

  return NextResponse.json({ events });
}

// POST /api/admin/mpg/analytics - Track analytics event (can be called from client)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, templateId, sessionId, metadata } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'Missing required field: eventType' }, { status: 400 });
    }

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
    const userAgent = req.headers.get('user-agent') || null;

    const [event] = await db
      .insert(mpgAnalytics)
      .values({
        eventType,
        templateId: templateId || null,
        userId: null, // Will be set by session if available
        sessionId: sessionId || null,
        metadata: metadata || null,
        ipAddress,
        userAgent,
      })
      .returning();

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to track event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
