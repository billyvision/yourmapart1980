"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AdminStatus {
  configured: boolean;
  adminEmail?: string;
  userExists: boolean;
  isAdmin: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export default function AdminSetupPage() {
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/promote");
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError("Failed to check admin status");
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async () => {
    try {
      setPromoting(true);
      setError(null);
      const response = await fetch("/api/admin/promote", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        await checkAdminStatus();
        alert("Successfully promoted to admin! Please refresh the page.");
      } else {
        setError(data.error || "Failed to promote user");
      }
    } catch (err) {
      setError("Failed to promote user");
    } finally {
      setPromoting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Loading admin setup...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="mb-8 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">Admin Setup</h1>
        <p className="text-muted-foreground">Configure admin access for YourMapArt</p>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-500 bg-red-50 dark:bg-red-950 rounded-lg flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Admin Configuration Status</CardTitle>
          <CardDescription>Current admin setup configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Environment Config */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              {status?.configured ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">ADMIN_EMAIL Configured</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {status?.adminEmail || "Not set"}
            </span>
          </div>

          {/* User Exists */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              {status?.userExists ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="font-medium">Admin User Exists</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {status?.userExists ? "Yes" : "Not signed in yet"}
            </span>
          </div>

          {/* Admin Role */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              {status?.isAdmin ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">Admin Role Assigned</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {status?.isAdmin ? "Yes" : "No"}
            </span>
          </div>

          {/* User Details */}
          {status?.user && (
            <div className="mt-4 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Admin User Details</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Name:</dt>
                  <dd className="font-medium">{status.user.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Email:</dt>
                  <dd className="font-medium">{status.user.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Current Role:</dt>
                  <dd className="font-medium capitalize">{status.user.role}</dd>
                </div>
              </dl>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {status?.userExists && !status?.isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Promote to Admin</CardTitle>
            <CardDescription>Grant admin privileges to {status.adminEmail}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={promoteToAdmin}
              disabled={promoting}
              className="w-full"
            >
              {promoting ? "Promoting..." : "Promote to Admin"}
            </Button>
          </CardContent>
        </Card>
      )}

      {!status?.userExists && (
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Sign in with {status?.adminEmail} using Google OAuth</li>
              <li>Return to this page</li>
              <li>Click "Promote to Admin" button</li>
            </ol>
          </CardContent>
        </Card>
      )}

      {status?.isAdmin && (
        <Card className="border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Admin setup complete! You have full admin access.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
