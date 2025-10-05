import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { requireSuperAdmin } from '@/lib/admin';

// PATCH /api/admin/users/[id]/role - Update user role (Super Admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Only super admins can change user roles
    await requireSuperAdmin(req.headers);
    const { id } = await params;

    const body = await req.json();
    const { role } = body;

    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "user" or "admin"' },
        { status: 400 }
      );
    }

    // Find the target user
    const targetUser = await db.query.user.findFirst({
      where: eq(user.id, id),
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent changing super admin role
    if (targetUser.role === 'superadmin') {
      return NextResponse.json(
        { error: 'Cannot change Super Admin role' },
        { status: 403 }
      );
    }

    // Update the role
    await db
      .update(user)
      .set({ role, updatedAt: new Date() })
      .where(eq(user.id, id));

    return NextResponse.json({
      message: `User role updated to ${role}`,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
