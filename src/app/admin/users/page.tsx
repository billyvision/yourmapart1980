'use client';

import { useEffect, useState } from 'react';
import { Shield, User as UserIcon, Crown, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { data: session } = useSession();
  const currentUserRole = (session?.user as any)?.role;
  const isSuperAdmin = currentUserRole === 'superadmin';

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const promoteUser = async (userId: string, targetRole: 'admin' | 'user') => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole }),
      });

      if (response.ok) {
        await loadUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update role');
      }
    } catch (err) {
      alert('Failed to update role');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          {isSuperAdmin ? 'Manage user roles and permissions' : 'View all users (Super Admin can manage roles)'}
        </p>
      </div>

      {!isSuperAdmin && (
        <div className="mb-6 p-4 border border-yellow-500 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ℹ️ Only Super Admins can promote or demote users. You have read-only access.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {users.map((user) => {
          const isCurrentUser = user.email === session?.user?.email;
          const isSuperAdminUser = user.role === 'superadmin';
          const isAdminUser = user.role === 'admin';
          const isRegularUser = user.role === 'user';

          return (
            <div key={user.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {isSuperAdminUser ? (
                      <Crown className="w-5 h-5 text-yellow-500" />
                    ) : isAdminUser ? (
                      <Shield className="w-5 h-5 text-blue-500" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      {isCurrentUser && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">You</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Role: <span className="font-medium capitalize">{user.role}</span> •
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions - Only for SuperAdmin */}
                {isSuperAdmin && !isSuperAdminUser && !isCurrentUser && (
                  <div className="flex gap-2">
                    {isRegularUser && (
                      <Button
                        size="sm"
                        onClick={() => promoteUser(user.id, 'admin')}
                        disabled={actionLoading === user.id}
                      >
                        <ChevronUp className="w-4 h-4 mr-1" />
                        {actionLoading === user.id ? 'Promoting...' : 'Promote to Admin'}
                      </Button>
                    )}
                    {isAdminUser && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => promoteUser(user.id, 'user')}
                        disabled={actionLoading === user.id}
                      >
                        <ChevronDown className="w-4 h-4 mr-1" />
                        {actionLoading === user.id ? 'Demoting...' : 'Demote to User'}
                      </Button>
                    )}
                  </div>
                )}

                {/* Show locked icon for super admins */}
                {isSuperAdminUser && (
                  <div className="text-xs text-muted-foreground italic">
                    Super Admin (Protected)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
