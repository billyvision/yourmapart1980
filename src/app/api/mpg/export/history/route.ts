import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgExportHistory } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/mpg/export/history - Get user's export history
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

    const exports = await db
      .select()
      .from(mpgExportHistory)
      .where(eq(mpgExportHistory.userId, session.user.id))
      .orderBy(desc(mpgExportHistory.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      exports,
      total: exports.length,
    });
  } catch (error) {
    console.error('Error fetching export history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch export history', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
