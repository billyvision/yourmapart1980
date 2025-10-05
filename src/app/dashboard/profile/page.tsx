'use client';

import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return <div className="container mx-auto py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

      <div className="max-w-2xl space-y-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{session.user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{new Date(session.user.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Update Email
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
