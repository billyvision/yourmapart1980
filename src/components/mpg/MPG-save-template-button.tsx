'use client';

import { useState } from 'react';
import { Save, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { useRouter } from 'next/navigation';

interface MPGSaveTemplateButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function MPGSaveTemplateButton({
  variant = 'outline',
  size = 'default',
  className
}: MPGSaveTemplateButtonProps) {
  const router = useRouter();
  const { city, saveTemplate } = useMPGStore();
  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!templateName.trim()) return;

    setSaving(true);
    try {
      const templateId = await saveTemplate(templateName.trim());

      setSaved(true);

      // Show success for 1 second, then close
      setTimeout(() => {
        setOpen(false);
        setSaved(false);
        setTemplateName('');

        // Optionally redirect to my templates
        if (confirm('Template saved! Would you like to view your templates?')) {
          router.push('/dashboard/my-templates');
        }
      }, 1000);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Pre-fill with city name
      setTemplateName(city ? `${city} Map` : 'My Map');
    } else {
      // Reset state when closing
      setTemplateName('');
      setSaved(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Draft</DialogTitle>
          <DialogDescription>
            Save your map design as a draft to access it later from your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Paris Vacation Map"
              className="col-span-3"
              disabled={saving || saved}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!templateName.trim() || saving || saved}
          >
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {saved && <Check className="w-4 h-4 mr-2" />}
            {!saving && !saved && 'Save'}
            {saving && 'Saving...'}
            {saved && 'Saved!'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
