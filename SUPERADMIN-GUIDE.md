# Super Admin Guide

## 👑 Super Admin System

YourMapArt uses a hierarchical role system with three levels:
1. **User** - Regular users with access to public features
2. **Admin** - Full access to admin tools (templates, analytics)
3. **Super Admin** - All admin privileges + ability to manage user roles

---

## ✅ Current Super Admin

**Email**: `info@skypopdesigns.com`
**Name**: SKYPOP DESIGNS
**Role**: `superadmin` ✅

---

## 🎯 Role Hierarchy & Permissions

### User (Default)
- Create and save map templates
- Export maps (standard quality)
- Access personal dashboard
- View public templates

### Admin
- ✅ All user privileges
- ✅ Create curated admin templates
- ✅ Access template management (`/admin/mpg/templates`)
- ✅ View analytics dashboard (`/admin/mpg/analytics`)
- ✅ **View** all users (`/admin/users`)
- ❌ **Cannot** promote/demote users
- ❌ **Cannot** become super admin

### Super Admin
- ✅ All admin privileges
- ✅ **Promote users to admin**
- ✅ **Demote admins to user**
- ✅ Full user management capabilities
- 🔒 Protected role (cannot be changed by anyone)

---

## 📍 Super Admin Features

### User Management (`/admin/users`)

As a Super Admin, you can:

**Promote Users to Admin**:
1. Go to `/admin/users`
2. Find the user you want to promote
3. Click "Promote to Admin" button
4. User immediately gets admin access

**Demote Admins to User**:
1. Go to `/admin/users`
2. Find the admin you want to demote
3. Click "Demote to User" button
4. User loses admin privileges

**Visual Indicators**:
- 👑 **Crown icon** = Super Admin (protected)
- 🛡️ **Shield icon** = Admin
- 👤 **User icon** = Regular User

---

## 🔐 Security & Restrictions

### Protected Roles

**Super Admin**:
- ✅ Cannot be demoted by anyone
- ✅ Role shown as "Super Admin (Protected)"
- ✅ Only one super admin configured

**Self-Protection**:
- You cannot change your own role
- Your account is marked with "You" badge

**Regular Admins**:
- Cannot see promotion buttons (read-only access)
- Warning message: "Only Super Admins can promote or demote users"

---

## 🛠️ API Endpoints

### Update User Role (Super Admin Only)
```bash
PATCH /api/admin/users/{userId}/role
```

**Headers**: Requires super admin session

**Body**:
```json
{
  "role": "admin"  // or "user"
}
```

**Response**:
```json
{
  "message": "User role updated to admin",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin"
  }
}
```

**Restrictions**:
- Only super admin can call this endpoint
- Cannot change super admin role
- Only accepts `user` or `admin` as target roles

---

## 🔄 Promoting Additional Super Admins

### Method 1: Database Script
```bash
# Edit scripts/promote-admin.ts to change email
# Then run:
npx tsx scripts/promote-admin.ts
```

### Method 2: Direct Database Update
```sql
UPDATE "user"
SET role = 'superadmin', "updatedAt" = NOW()
WHERE email = 'newemail@example.com';
```

### Method 3: Environment Variable
Update `.env`:
```env
SUPERADMIN_EMAIL=info@skypopdesigns.com,second@example.com
```

---

## 📊 User Role Statistics

You can view all users and their roles at `/admin/users`:

- Total users
- Admin count
- Super admin (always 1)
- Recent user activity
- Role distribution

---

## 🚨 Troubleshooting

### Issue: Cannot promote users
**Check**:
1. Verify you're logged in as super admin
2. Check role at `/admin/setup`
3. Verify email is `info@skypopdesigns.com`

**Verify super admin status**:
```bash
npx tsx scripts/promote-admin.ts
```

Expected output:
```
✅ Found user: SKYPOP DESIGNS (info@skypopdesigns.com)
   Current role: superadmin
✅ User is already a superadmin!
```

### Issue: Regular admins see promotion buttons
**This should not happen**. If it does:
1. Clear browser cache
2. Log out and log back in
3. The UI checks `currentUserRole === 'superadmin'`

### Issue: Need to verify role hierarchy
**Role checking logic**:
- `requireSuperAdmin()` - Super admin only
- `requireAdmin()` - Admin OR Super admin
- `isAdmin()` - Returns true for both admin and superadmin
- `isSuperAdmin()` - Returns true only for superadmin

---

## 📈 Best Practices

### Promoting Users to Admin

**Before promoting**:
- ✅ Verify user's identity
- ✅ Ensure they need admin access
- ✅ Understand they get full admin tool access

**After promoting**:
- ℹ️ User must log out and log back in to see admin menu
- ℹ️ They'll see 🛡️ **Admin** in navigation
- ℹ️ They get access to `/admin/mpg`, `/admin/mpg/templates`, `/admin/mpg/analytics`

### Managing Admin Team

**Keep track of**:
- Who has admin access
- Why they were granted access
- Review admin list periodically
- Demote inactive admins

**Communication**:
- Inform users when they're promoted
- Explain their new privileges
- Provide admin documentation

---

## 🔗 Related Documentation

- [Admin Setup Guide](./ADMIN-SETUP.md)
- [MPG Database Architecture](./MPG-DATABASE.md)
- [User Management Page](./src/app/admin/users/page.tsx)
- [Admin Middleware](./src/lib/admin.ts)

---

## 📋 Quick Reference

| Role | Icon | Can Do |
|------|------|--------|
| User | 👤 | Use app features |
| Admin | 🛡️ | Manage templates, view analytics |
| Super Admin | 👑 | Everything + manage user roles |

**Super Admin Email**: `info@skypopdesigns.com`
**User Management**: `/admin/users`
**Promotion API**: `PATCH /api/admin/users/{id}/role`
**Last Updated**: October 2025
