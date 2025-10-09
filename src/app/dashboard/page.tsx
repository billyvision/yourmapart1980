"use client";

import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { Lock, BarChart3, FileText, Download, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OverviewStats {
  totalTemplates: number;
  totalExports: number;
  totalEvents: number;
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user is admin or superadmin
  const userRole = (session?.user as any)?.role;
  const isAdminOrSuperAdmin = userRole === 'admin' || userRole === 'superadmin';

  // Load admin stats if user is admin
  useEffect(() => {
    if (isAdminOrSuperAdmin) {
      setLoading(true);
      fetch('/api/admin/mpg/analytics?type=overview')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Failed to load stats');
        })
        .then(data => {
          setStats(data.stats);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isAdminOrSuperAdmin]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Protected Page</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to access the dashboard
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (isAdminOrSuperAdmin) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage templates, view analytics, and monitor system performance
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-8">Loading stats...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-muted-foreground">Total Templates</h3>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold">{stats?.totalTemplates || 0}</p>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-muted-foreground">Total Exports</h3>
                <Download className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold">{stats?.totalExports || 0}</p>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-muted-foreground">Total Events</h3>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold">{stats?.totalEvents || 0}</p>
            </div>
          </div>
        )}

        {/* Admin Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Template Generator</h3>
            <p className="text-muted-foreground mb-4">
              Create, edit, and manage map poster templates with JSON import
            </p>
            <Button onClick={() => router.push('/admin/mpg/template-generator')} className="w-full">
              Template Generator
            </Button>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Product Management</h3>
            <p className="text-muted-foreground mb-4">
              Manage products, pricing, sizes, and variations
            </p>
            <Button onClick={() => router.push('/admin/products')} variant="outline" className="w-full">
              Manage Products
            </Button>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Analytics & Insights</h3>
            <p className="text-muted-foreground mb-4">
              View detailed analytics, popular templates, and export statistics
            </p>
            <Button onClick={() => router.push('/admin/mpg/analytics')} variant="outline" className="w-full">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <p className="text-muted-foreground mb-4">
              View and manage all users, roles, and permissions
            </p>
            <Button onClick={() => router.push('/admin/users')} variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Regular User Dashboard
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* My Templates */}
        <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">My Templates</h2>
          <p className="text-muted-foreground mb-4">
            View and manage your saved map templates
          </p>
          <Button asChild className="w-full">
            <Link href="/dashboard/my-templates">My Templates</Link>
          </Button>
        </div>

        {/* My Orders (Export History) */}
        <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">My Orders</h2>
          <p className="text-muted-foreground mb-4">
            View your order history and downloads
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/exports">View Orders</Link>
          </Button>
        </div>

        {/* Profile */}
        <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p className="text-muted-foreground mb-4">
            Manage your account settings
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/profile">Manage Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
