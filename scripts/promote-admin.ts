import 'dotenv/config';
import { db } from '../src/lib/db';
import { user } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function promoteAdmin() {
  const superAdminEmail = 'info@skypopdesigns.com';
  const targetRole = 'superadmin';

  try {
    // Find user
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, superAdminEmail),
    });

    if (!existingUser) {
      console.log(`❌ User ${superAdminEmail} not found in database.`);
      console.log('⚠️  User must sign in at least once before being promoted.');
      process.exit(1);
    }

    console.log(`✅ Found user: ${existingUser.name} (${existingUser.email})`);
    console.log(`   Current role: ${existingUser.role || 'user'}`);

    if (existingUser.role === targetRole) {
      console.log(`✅ User is already a ${targetRole}!`);
      process.exit(0);
    }

    // Promote to superadmin
    await db
      .update(user)
      .set({ role: targetRole, updatedAt: new Date() })
      .where(eq(user.id, existingUser.id));

    console.log(`\n✅ Successfully promoted ${superAdminEmail} to ${targetRole}!`);
    console.log(`   New role: ${targetRole}`);
    console.log(`\n🎯 Super Admin Privileges:`);
    console.log(`   - Full access to all admin tools`);
    console.log(`   - Can promote/demote users to admin role`);
    console.log(`   - Exclusive access to user management`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error promoting admin:', error);
    process.exit(1);
  }
}

promoteAdmin();
