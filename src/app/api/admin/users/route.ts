import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user } from '@/lib/schema';
import { desc, like } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin';

// GET /api/admin/users - List all users
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req.headers);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    let query = db.select().from(user).orderBy(desc(user.createdAt));

    if (search) {
      query = query.where(like(user.email, `%${search}%`)) as typeof query;
    }

    const users = await query;

    return NextResponse.json({ users, total: users.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
