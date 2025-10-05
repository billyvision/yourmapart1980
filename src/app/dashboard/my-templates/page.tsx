'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Template {
  id: number;
  templateName: string;
  templateData: {
    location?: {
      title?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/mpg/templates');

      if (!response.ok) {
        throw new Error('Failed to load templates');
      }

      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (templateId: number) => {
    router.push(`/mpg?templateId=${templateId}`);
  };

  const handleDuplicate = async (template: Template) => {
    try {
      const response = await fetch('/api/mpg/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateName: `${template.templateName} (Copy)`,
          templateData: template.templateData,
          thumbnailUrl: template.thumbnailUrl,
        }),
      });

      if (response.ok) {
        loadTemplates(); // Refresh list
      }
    } catch (err) {
      console.error('Error duplicating template:', err);
    }
  };

  const handleDelete = async (templateId: number) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const response = await fetch(`/api/mpg/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadTemplates(); // Refresh list
      }
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Loading your templates...</div>
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
        <h1 className="text-4xl font-bold mb-2">My Templates</h1>
        <p className="text-muted-foreground">
          Manage your saved map poster templates
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You haven&apos;t saved any templates yet
          </p>
          <Button onClick={() => router.push('/mpg-templates')}>
            Browse Templates
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                {template.thumbnailUrl ? (
                  <img
                    src={template.thumbnailUrl}
                    alt={template.templateName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    <span className="text-sm">No preview</span>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <h3 className="font-semibold mb-1 truncate">
                  {template.templateName}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {template.templateData?.location?.title || 'No location'}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Updated: {new Date(template.updatedAt).toLocaleDateString()}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(template.id)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicate(template)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
