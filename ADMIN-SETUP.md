# Admin Setup Guide

## 🛡️ Administrator Configuration

This guide explains how to set up and manage admin access for YourMapArt.

---

## ✅ Admin Already Configured

### Current Admin User

**Email**: `info@skypopdesigns.com`
**Name**: SKYPOP DESIGNS
**Role**: `admin` ✅

The admin account has been **pre-configured and is ready to use**.

### What This Means

When `info@skypopdesigns.com` logs in:
- ✅ Admin role is already set in the database
- ✅ Admin menu automatically appears in navigation
- ✅ Full access to all admin pages immediately
- ✅ No setup or promotion needed

### Admin Access

Simply **sign in with Google** using `info@skypopdesigns.com` and you'll see:
- 🛡️ **Admin** menu item in navigation
- Full access to admin dashboard at `/admin/mpg`

---

## 📍 Admin Access Points

### Admin Dashboard
- **URL**: `/admin/mpg`
- **Features**:
  - Overview stats (templates, exports, analytics)
  - Quick actions for template management, analytics, and user management

### Template Management
- **URL**: `/admin/mpg/templates`
- **Features**:
  - Create/edit/delete curated admin templates
  - Set featured templates
  - Manage display order
  - Categorize templates

### Analytics Dashboard
- **URL**: `/admin/mpg/analytics`
- **Features**:
  - Export statistics by format and size
  - Popular template analysis
  - Event tracking
  - Real-time analytics

### User Management
- **URL**: `/admin/users`
- **Features**:
  - View all users
  - Manage user roles
  - Monitor user activity

### Admin Setup (diagnostic)
- **URL**: `/admin/setup`
- **Features**:
  - Check admin configuration status
  - Manually promote admin user
  - View admin user details

---

## 🔐 Security

### Role-Based Access Control

The system uses role-based access with two roles:
- **`user`** (default): Regular users with access to public features
- **`admin`**: Full system access including admin dashboard

### Admin Protection

All admin routes are protected with `requireAdmin()` middleware:

```typescript
// Automatic check in all /api/admin/* routes
const adminId = await requireAdmin(req.headers);
```

**Unauthorized access results in**:
- 401 (Unauthorized) if not logged in
- 403 (Forbidden) if logged in but not admin

---

## 🔧 Admin Management

### Promote Additional Admins

To promote additional users to admin role, use the promotion script:

```bash
# Edit the email in scripts/promote-admin.ts
npx tsx scripts/promote-admin.ts
```

Or manually update the database:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'newadmin@example.com';
```

### Check Admin Status API
```bash
GET /api/admin/promote
```

**Response**:
```json
{
  "configured": true,
  "adminEmail": "info@skypopdesigns.com",
  "userExists": true,
  "isAdmin": true,
  "user": {
    "id": "user_id",
    "email": "info@skypopdesigns.com",
    "name": "SKYPOP DESIGNS",
    "role": "admin"
  }
}
```

---

## 🚨 Troubleshooting

### Issue: Admin menu not showing after login
**Solution**:
1. Log out completely
2. Clear browser cache/cookies
3. Log back in with `info@skypopdesigns.com`
4. The admin menu should appear automatically

### Issue: Getting 403 Forbidden on admin pages
**Possible Causes**:
- Not logged in with admin account
- Session needs refresh

**Solution**:
1. Ensure you're logged in as `info@skypopdesigns.com`
2. Log out and log back in to refresh session
3. Verify admin status at `/admin/setup`

### Issue: Need to verify admin status
**Solution**: Run the promotion script to check:
```bash
npx tsx scripts/promote-admin.ts
```

Expected output:
```
✅ Found user: SKYPOP DESIGNS (info@skypopdesigns.com)
   Current role: admin
✅ User is already an admin!
```

---

## 🔄 Adding More Admins

### Option 1: Environment Variable (Comma-separated)
Update `.env` to support multiple admins:
```env
ADMIN_EMAIL=info@skypopdesigns.com,admin@example.com
```

### Option 2: Database Table
Create an `admin_users` table for dynamic admin management.

### Option 3: Manual Database Update
Using Drizzle Studio or direct SQL:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'newadmin@example.com';
```

---

## 📊 Admin Capabilities

### ✅ What Admins Can Do
- Create and manage curated templates
- View analytics and usage statistics
- Manage user accounts and roles
- Access all user templates (for moderation)
- Track export history across all users
- Configure template categories
- Set featured templates
- Monitor system performance

### ❌ What Admins Cannot Do (Future Features)
- Delete user accounts (requires implementation)
- Export user data (GDPR - requires implementation)
- Configure pricing (requires Stripe integration)

---

## 🔗 Related Documentation

- [MPG Database Architecture](./MPG-DATABASE.md)
- [MPG Migration Summary](./MPG-MIGRATION-SUMMARY.md)
- [Main Navigation](./src/components/main-nav.tsx)
- [Admin Middleware](./src/lib/admin.ts)

---

**Admin Email**: `info@skypopdesigns.com`
**Setup Page**: `/admin/setup`
**Admin Dashboard**: `/admin/mpg`
**Last Updated**: October 2025
