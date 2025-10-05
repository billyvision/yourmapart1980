'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface AdminTemplate {
  id: number;
  templateName: string;
  category: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/admin/mpg/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (err) {
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;

    try {
      const response = await fetch(`/api/admin/mpg/templates/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        loadTemplates();
      }
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  if (loading) return <div className="container mx-auto py-12">Loading...</div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Templates</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{template.templateName}</h3>
              <p className="text-sm text-muted-foreground">
                {template.category} • {template.isFeatured ? 'Featured' : 'Regular'} • Order: {template.displayOrder}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(template.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
