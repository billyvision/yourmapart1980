import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// POST /api/admin/promote - Promote admin email to admin role
export async function POST(req: NextRequest) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      return NextResponse.json(
        { error: 'ADMIN_EMAIL not configured' },
        { status: 500 }
      );
    }

    // Find user by admin email
    const adminUser = await db.query.user.findFirst({
      where: eq(user.email, adminEmail),
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: `User with email ${adminEmail} not found. Please sign in first.` },
        { status: 404 }
      );
    }

    // Check if already admin
    if (adminUser.role === 'admin') {
      return NextResponse.json({
        message: 'User is already an admin',
        user: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    }

    // Promote to admin
    await db
      .update(user)
      .set({ role: 'admin', updatedAt: new Date() })
      .where(eq(user.id, adminUser.id));

    return NextResponse.json({
      message: 'User successfully promoted to admin',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Error promoting admin:', error);
    return NextResponse.json(
      { error: 'Failed to promote user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/admin/promote - Check admin status
export async function GET(req: NextRequest) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      return NextResponse.json(
        { error: 'ADMIN_EMAIL not configured' },
        { status: 500 }
      );
    }

    const adminUser = await db.query.user.findFirst({
      where: eq(user.email, adminEmail),
    });

    if (!adminUser) {
      return NextResponse.json({
        configured: true,
        adminEmail,
        userExists: false,
        isAdmin: false,
        message: 'Admin user has not signed in yet',
      });
    }

    return NextResponse.json({
      configured: true,
      adminEmail,
      userExists: true,
      isAdmin: adminUser.role === 'admin',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
}
