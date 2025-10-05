'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileJson, Image, Check, Eye, Loader2, Edit, X, Plus, Trash2, EyeOff } from 'lucide-react';
import { MapPosterSnapshot } from '@/lib/mpg/MPG-json-export';

interface MapTemplate {
  id: string;
  name: string;
  city: string;
  style: string;
  hidden: boolean;
  thumbnail: string;
  jsonData: MapPosterSnapshot;
}

export default function TemplateGeneratorPage() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [templates, setTemplates] = useState<MapTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [templateId, setTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedJson, setParsedJson] = useState<MapPosterSnapshot | null>(null);

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Include hidden templates and JSON data for admin template generator
      const response = await fetch('/api/get-templates?includeHidden=true&includeJsonData=true');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast({
        title: 'Failed to load templates',
        description: 'Please refresh the page',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate next available template ID
  const getNextTemplateId = () => {
    const existingIds = templates.map(t => {
      const match = t.id.match(/template-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return `template-${maxId + 1}`;
  };

  const handleJsonInput = (value: string) => {
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value) as MapPosterSnapshot;
      setParsedJson(parsed);

      // Auto-fill fields from JSON
      if (parsed.snapshot) {
        const city = parsed.snapshot.location.city;

        // Auto-generate ID if not editing
        if (!editingTemplate) {
          setTemplateId(getNextTemplateId());
        }

        // Generate name from headline and city
        if (parsed.snapshot.text.headline.text) {
          const headline = parsed.snapshot.text.headline.text;
          setTemplateName(`${headline.charAt(0).toUpperCase() + headline.slice(1)} - ${city}`);
        }

        toast({
          title: 'JSON Parsed Successfully',
          description: `Template for ${city} loaded`,
        });
      }
    } catch (error) {
      setParsedJson(null);
      if (value.trim()) {
        toast({
          title: 'Invalid JSON',
          description: 'Please check your JSON format',
          variant: 'destructive',
        });
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Image Uploaded',
        description: `${file.name} (${(file.size / 1024).toFixed(2)}KB)`,
      });
    }
  };

  const optimizeImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set target dimensions (600x800 for 3:4 ratio)
          const targetWidth = 600;
          const targetHeight = 800;

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Calculate scaling to cover entire canvas
          const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          // Center the image
          const x = (targetWidth - scaledWidth) / 2;
          const y = (targetHeight - scaledHeight) / 2;

          ctx?.drawImage(img, x, y, scaledWidth, scaledHeight);

          // Convert to JPEG with quality compression
          const optimized = canvas.toDataURL('image/jpeg', 0.85);
          resolve(optimized);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePublish = async () => {
    // Validate inputs
    if (!templateName || !parsedJson) {
      toast({
        title: 'Missing Information',
        description: 'Please fill required fields',
        variant: 'destructive',
      });
      return;
    }

    // For new templates, image is required
    if (viewMode === 'create' && !imageFile) {
      toast({
        title: 'Missing Image',
        description: 'Please upload a preview image for new templates',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Auto-generate ID if needed
      const finalId = templateId || getNextTemplateId();

      // Optimize image only if provided
      let optimized = null;
      if (imageFile) {
        optimized = await optimizeImage(imageFile);
      }

      // Prepare template data
      const templateData = {
        id: finalId,
        name: templateName,
        city: parsedJson.snapshot.location.city,
        style: parsedJson.snapshot.style.mapStyle,
        thumbnail: `/template-previews/${finalId}.jpg`,
        jsonData: parsedJson,
        hidden: false,
      };

      // Send request to save template
      const response = await fetch('/api/admin/mpg/templates/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: templateData,
          imageData: optimized,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      toast({
        title: editingTemplate ? 'Template Updated!' : 'Template Added Successfully!',
        description: `${templateName} has been ${editingTemplate ? 'updated' : 'added to the templates page'}.`,
      });

      // Clear form and go back to list
      resetForm();
      setViewMode('list');

      // Reload templates
      await loadTemplates();

    } catch (error) {
      toast({
        title: 'Processing Failed',
        description: error instanceof Error ? error.message : 'Failed to process template',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleVisibility = async (template: MapTemplate) => {
    try {
      const response = await fetch('/api/admin/mpg/templates/toggle-visibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          hidden: !template.hidden,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle visibility');
      }

      toast({
        title: template.hidden ? 'Template Shown' : 'Template Hidden',
        description: `${template.name} is now ${template.hidden ? 'visible' : 'hidden'}`,
      });

      // Reload templates
      await loadTemplates();

    } catch (error) {
      toast({
        title: 'Failed to toggle visibility',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string, templateName: string) => {
    if (!confirm(`Are you sure you want to delete "${templateName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/mpg/templates/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      toast({
        title: 'Template Deleted',
        description: `${templateName} has been removed`,
      });

      // Reload templates
      await loadTemplates();

    } catch (error) {
      toast({
        title: 'Failed to delete template',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const startEditTemplate = (template: MapTemplate) => {
    setEditingTemplate(template.id);
    setTemplateId(template.id);
    setTemplateName(template.name);
    if (template.jsonData) {
      setJsonInput(JSON.stringify(template.jsonData, null, 2));
      setParsedJson(template.jsonData);
    }
    setViewMode('edit');
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setTemplateId('');
    setTemplateName('');
    setJsonInput('');
    setParsedJson(null);
    setImageFile(null);
    setImagePreview('');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Template Generator</h1>
        <p className="text-muted-foreground">
          Create and manage map poster templates
        </p>
      </div>

      {/* View Mode: List Templates */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Existing Templates</h2>
              <Button
                onClick={() => {
                  resetForm();
                  setViewMode('create');
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Template
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading templates...
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No templates yet. Create your first template!
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 bg-card border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      {template.thumbnail && (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-16 h-20 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-semibold">{template.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {template.id} | City: {template.city} | Style: {template.style}
                        </div>
                        {template.hidden && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                            Hidden
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditTemplate(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleVisibility(template)}
                      >
                        {template.hidden ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteTemplate(template.id, template.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* View Mode: Create/Edit Template */}
      {(viewMode === 'create' || viewMode === 'edit') && (
        <Card className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {viewMode === 'edit' ? 'Edit Template' : 'Create New Template'}
            </h2>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setViewMode('list');
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

          <div className="space-y-6">
            {/* Template Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-id">Template ID (Auto-generated)</Label>
                <Input
                  id="template-id"
                  value={templateId || getNextTemplateId()}
                  disabled
                  className="mt-1 bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="template-name">Template Name *</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Paris Romantic"
                  className="mt-1"
                />
              </div>
            </div>

            {/* JSON Input */}
            <div>
              <Label htmlFor="json-input" className="flex items-center gap-2">
                <FileJson className="w-4 h-4" />
                Template JSON Data *
              </Label>
              <Textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => handleJsonInput(e.target.value)}
                placeholder="Paste your template JSON here..."
                className="mt-1 font-mono text-sm h-48"
              />
              {parsedJson && (
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Valid JSON - {parsedJson.snapshot.location.city}</span>
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image-upload" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Preview Image {viewMode === 'create' ? '*' : '(optional - leave blank to keep existing)'}
              </Label>
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                  {imageFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imageFile && (
                  <div className="text-sm text-muted-foreground">
                    Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)}KB)
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            {imagePreview && (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview (will be optimized to 600x800px)
                </h3>
                <img
                  src={imagePreview}
                  alt="Template preview"
                  className="max-w-full h-48 object-cover rounded"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handlePublish}
                disabled={!parsedJson || (viewMode === 'create' && !imageFile) || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : viewMode === 'edit' ? (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Template
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Add Template
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
