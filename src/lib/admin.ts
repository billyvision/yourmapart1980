import { auth } from './auth';
import { db } from './db';
import { user } from './schema';
import { eq } from 'drizzle-orm';

export type UserRole = 'user' | 'admin' | 'superadmin';

export async function getUserRole(headers: Headers): Promise<UserRole | null> {
  try {
    const session = await auth.api.getSession({ headers });

    if (!session?.user?.id) {
      return null;
    }

    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    return (userData?.role as UserRole) || 'user';
  } catch {
    return null;
  }
}

export async function isAdmin(headers: Headers): Promise<boolean> {
  const role = await getUserRole(headers);
  return role === 'admin' || role === 'superadmin';
}

export async function isSuperAdmin(headers: Headers): Promise<boolean> {
  const role = await getUserRole(headers);
  return role === 'superadmin';
}

export async function requireAdmin(headers: Headers): Promise<string> {
  const session = await auth.api.getSession({ headers });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  const role = (userData?.role as UserRole) || 'user';

  if (role !== 'admin' && role !== 'superadmin') {
    throw new Error('Forbidden: Admin access required');
  }

  return session.user.id;
}

export async function requireSuperAdmin(headers: Headers): Promise<string> {
  const session = await auth.api.getSession({ headers });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (userData?.role !== 'superadmin') {
    throw new Error('Forbidden: Super Admin access required');
  }

  return session.user.id;
}
