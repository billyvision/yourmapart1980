'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, FileText, Download, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OverviewStats {
  totalTemplates: number;
  totalExports: number;
  totalEvents: number;
}

export default function AdminMPGDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/mpg/analytics?type=overview');

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/');
          return;
        }
        throw new Error('Failed to load stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">MPG Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage templates, view analytics, and monitor system performance
        </p>
      </div>

      {/* Stats Grid */}
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

      {/* Quick Actions */}
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
