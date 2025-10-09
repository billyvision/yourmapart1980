'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, Save, ArrowLeft, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Size {
  id?: number;
  sizeValue: string;
  sizeLabel: string;
  dimensions?: string;
  price?: number | null;
  isPopular: boolean;
  displayOrder: number;
}

interface Variation {
  id?: number;
  variationType: string;
  variationValue: string;
  variationLabel: string;
  variationDescription?: string;
  priceModifier: number;
  isActive: boolean;
  displayOrder: number;
}

interface Product {
  id?: number;
  productType: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  image2?: string;
  basePrice?: number | null;
  isActive: boolean;
  displayOrder: number;
  features?: string[];
  sizes?: Size[];
  variations?: Variation[];
}

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const productId = isNew ? null : parseInt(resolvedParams.id);

  const [product, setProduct] = useState<Product>({
    productType: '',
    name: '',
    description: '',
    icon: '',
    image: '',
    image2: '',
    basePrice: null,
    isActive: true,
    displayOrder: 0,
    features: [],
    sizes: [],
    variations: [],
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [editingSize, setEditingSize] = useState<number | null>(null);
  const [editingVariation, setEditingVariation] = useState<number | null>(null);
  const [sizeFormData, setSizeFormData] = useState<Partial<Size>>({});
  const [variationFormData, setVariationFormData] = useState<Partial<Variation>>({});
  const [showNewSizeForm, setShowNewSizeForm] = useState(false);
  const [showNewVariationForm, setShowNewVariationForm] = useState(false);
  const [newSize, setNewSize] = useState<Partial<Size>>({
    sizeValue: '',
    sizeLabel: '',
    dimensions: '',
    price: null,
    isPopular: false,
    displayOrder: 0,
  });
  const [newVariation, setNewVariation] = useState<Partial<Variation>>({
    variationType: '',
    variationValue: '',
    variationLabel: '',
    variationDescription: '',
    priceModifier: 0,
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    if (!isNew && productId) {
      loadProduct();
    }
  }, [isNew, productId]);

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!product.productType || !product.name) {
      alert('Please fill in required fields: Product Type and Name');
      return;
    }

    setSaving(true);
    try {
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${productId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const saved = await response.json();
        if (isNew) {
          router.push(`/admin/products/${saved.id}`);
        } else {
          alert('Product updated successfully');
          loadProduct();
        }
      } else {
        const error = await response.json();
        alert(`Failed to save: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const startEditSize = (size: Size) => {
    setEditingSize(size.id!);
    setSizeFormData(size);
  };

  const cancelEditSize = () => {
    setEditingSize(null);
    setSizeFormData({});
  };

  const saveSize = async (sizeId: number) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/sizes/${sizeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sizeFormData),
      });

      if (response.ok) {
        setEditingSize(null);
        setSizeFormData({});
        loadProduct();
      } else {
        const error = await response.json();
        alert(`Failed to save: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error saving size');
    }
  };

  const createSize = async () => {
    if (!newSize.sizeValue || !newSize.sizeLabel) {
      alert('Please fill in Size Value and Size Label');
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}/sizes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSize,
          displayOrder: product.sizes?.length || 0,
        }),
      });

      if (response.ok) {
        setNewSize({
          sizeValue: '',
          sizeLabel: '',
          dimensions: '',
          price: null,
          isPopular: false,
          displayOrder: 0,
        });
        setShowNewSizeForm(false);
        loadProduct();
      } else {
        const error = await response.json();
        alert(`Failed to create: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error creating size');
    }
  };

  const deleteSize = async (sizeId: number) => {
    if (!confirm('Delete this size?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}/sizes/${sizeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadProduct();
      }
    } catch (error) {
      console.error('Error deleting size:', error);
    }
  };

  const startEditVariation = (variation: Variation) => {
    setEditingVariation(variation.id!);
    setVariationFormData(variation);
  };

  const cancelEditVariation = () => {
    setEditingVariation(null);
    setVariationFormData({});
  };

  const saveVariation = async (variationId: number) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/variations/${variationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variationFormData),
      });

      if (response.ok) {
        setEditingVariation(null);
        setVariationFormData({});
        loadProduct();
      } else {
        const error = await response.json();
        alert(`Failed to save: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error saving variation');
    }
  };

  const createVariation = async () => {
    if (!newVariation.variationType || !newVariation.variationValue || !newVariation.variationLabel) {
      alert('Please fill in Type, Value, and Label');
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}/variations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newVariation,
          displayOrder: product.variations?.length || 0,
        }),
      });

      if (response.ok) {
        setNewVariation({
          variationType: '',
          variationValue: '',
          variationLabel: '',
          variationDescription: '',
          priceModifier: 0,
          isActive: true,
          displayOrder: 0,
        });
        setShowNewVariationForm(false);
        loadProduct();
      } else {
        const error = await response.json();
        alert(`Failed to create: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error creating variation');
    }
  };

  const deleteVariation = async (variationId: number) => {
    if (!confirm('Delete this variation?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}/variations/${variationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadProduct();
      }
    } catch (error) {
      console.error('Error deleting variation:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/admin/products')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{isNew ? 'New Product' : 'Edit Product'}</h1>
            <p className="text-muted-foreground">Configure product details, sizes, and variations</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Product'}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="sizes" disabled={isNew}>Sizes ({product.sizes?.length || 0})</TabsTrigger>
          <TabsTrigger value="variations" disabled={isNew}>Variations ({product.variations?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              {/* Product Type */}
              <div className="grid gap-2">
                <Label htmlFor="productType">Product Type * (unique identifier)</Label>
                <Input
                  id="productType"
                  value={product.productType}
                  onChange={(e) => setProduct({ ...product, productType: e.target.value })}
                  placeholder="e.g., digital, poster, canvas-wrap"
                  disabled={!isNew}
                />
              </div>

              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  placeholder="e.g., Digital Download"
                />
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={product.description || ''}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              {/* Base Price */}
              <div className="grid gap-2">
                <Label htmlFor="basePrice">Base Price (leave empty for size-specific pricing)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={product.basePrice || ''}
                  onChange={(e) => setProduct({ ...product, basePrice: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="9.99"
                />
              </div>

              {/* Icon & Images */}
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon (Lucide name)</Label>
                  <Input
                    id="icon"
                    value={product.icon || ''}
                    onChange={(e) => setProduct({ ...product, icon: e.target.value })}
                    placeholder="FileImage"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={product.image || ''}
                    onChange={(e) => setProduct({ ...product, image: e.target.value })}
                    placeholder="/product.png"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image2">Image 2 URL</Label>
                  <Input
                    id="image2"
                    value={product.image2 || ''}
                    onChange={(e) => setProduct({ ...product, image2: e.target.value })}
                    placeholder="/product-2.png"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active Status</Label>
                  <p className="text-sm text-muted-foreground">Product is visible to customers</p>
                </div>
                <Switch
                  checked={product.isActive}
                  onCheckedChange={(checked) => setProduct({ ...product, isActive: checked })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={product.displayOrder}
                  onChange={(e) => setProduct({ ...product, displayOrder: parseInt(e.target.value) || 0 })}
                />
              </div>

              {/* Features */}
              <div className="grid gap-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add feature"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && featureInput.trim()) {
                        e.preventDefault();
                        setProduct({ ...product, features: [...(product.features || []), featureInput.trim()] });
                        setFeatureInput('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (featureInput.trim()) {
                        setProduct({ ...product, features: [...(product.features || []), featureInput.trim()] });
                        setFeatureInput('');
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.features?.map((feature, idx) => (
                    <Badge key={idx} variant="secondary">
                      {feature}
                      <button
                        className="ml-2 hover:text-destructive"
                        onClick={() => {
                          const newFeatures = [...(product.features || [])];
                          newFeatures.splice(idx, 1);
                          setProduct({ ...product, features: newFeatures });
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sizes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Product Sizes</h3>
            <Button onClick={() => setShowNewSizeForm(!showNewSizeForm)}>
              <Plus className="w-4 h-4 mr-2" />
              {showNewSizeForm ? 'Cancel' : 'Add Size'}
            </Button>
          </div>

          {showNewSizeForm && (
            <Card className="p-4 bg-muted/50 border-dashed">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="newSizeValue">Size Value *</Label>
                    <Input
                      id="newSizeValue"
                      value={newSize.sizeValue}
                      onChange={(e) => setNewSize({ ...newSize, sizeValue: e.target.value })}
                      placeholder="e.g., 8x10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newSizeLabel">Size Label *</Label>
                    <Input
                      id="newSizeLabel"
                      value={newSize.sizeLabel}
                      onChange={(e) => setNewSize({ ...newSize, sizeLabel: e.target.value })}
                      placeholder="e.g., 8×10 inches"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="newDimensions">Dimensions</Label>
                    <Input
                      id="newDimensions"
                      value={newSize.dimensions || ''}
                      onChange={(e) => setNewSize({ ...newSize, dimensions: e.target.value })}
                      placeholder="e.g., 8×10 inches"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPrice">Price</Label>
                    <Input
                      id="newPrice"
                      type="number"
                      step="0.01"
                      value={newSize.price || ''}
                      onChange={(e) => setNewSize({ ...newSize, price: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="24.99"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Switch
                        checked={newSize.isPopular}
                        onCheckedChange={(checked) => setNewSize({ ...newSize, isPopular: checked })}
                      />
                      <span className="text-sm">Popular</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createSize} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Create Size
                  </Button>
                  <Button onClick={() => setShowNewSizeForm(false)} size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {product.sizes && product.sizes.length > 0 ? (
            <div className="space-y-3">
              {product.sizes.map((size) => (
                <Card key={size.id} className="p-4">
                  {editingSize === size.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="editSizeValue">Size Value *</Label>
                          <Input
                            id="editSizeValue"
                            value={sizeFormData.sizeValue}
                            onChange={(e) => setSizeFormData({ ...sizeFormData, sizeValue: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editSizeLabel">Size Label *</Label>
                          <Input
                            id="editSizeLabel"
                            value={sizeFormData.sizeLabel}
                            onChange={(e) => setSizeFormData({ ...sizeFormData, sizeLabel: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="editDimensions">Dimensions</Label>
                          <Input
                            id="editDimensions"
                            value={sizeFormData.dimensions || ''}
                            onChange={(e) => setSizeFormData({ ...sizeFormData, dimensions: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editPrice">Price</Label>
                          <Input
                            id="editPrice"
                            type="number"
                            step="0.01"
                            value={sizeFormData.price || ''}
                            onChange={(e) => setSizeFormData({ ...sizeFormData, price: e.target.value ? parseFloat(e.target.value) : null })}
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Switch
                              checked={sizeFormData.isPopular}
                              onCheckedChange={(checked) => setSizeFormData({ ...sizeFormData, isPopular: checked })}
                            />
                            <span className="text-sm">Popular</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => size.id && saveSize(size.id)} size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={cancelEditSize} size="sm" variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Display mode
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-5 gap-3">
                        <div>
                          <Label className="text-xs">Size Value</Label>
                          <p className="font-medium">{size.sizeValue}</p>
                        </div>
                        <div>
                          <Label className="text-xs">Label</Label>
                          <p className="font-medium">{size.sizeLabel}</p>
                        </div>
                        <div>
                          <Label className="text-xs">Dimensions</Label>
                          <p>{size.dimensions || '—'}</p>
                        </div>
                        <div>
                          <Label className="text-xs">Price</Label>
                          <p className="font-medium">{size.price ? `$${size.price.toFixed(2)}` : '—'}</p>
                        </div>
                        <div>
                          <Label className="text-xs">Status</Label>
                          <div className="flex gap-1">
                            {size.isPopular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditSize(size)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => size.id && deleteSize(size.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              No sizes added yet. Click &ldquo;Add Size&rdquo; to get started.
            </Card>
          )}
        </TabsContent>

        <TabsContent value="variations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Product Variations</h3>
            <Button onClick={() => setShowNewVariationForm(!showNewVariationForm)}>
              <Plus className="w-4 h-4 mr-2" />
              {showNewVariationForm ? 'Cancel' : 'Add Variation'}
            </Button>
          </div>

          {showNewVariationForm && (
            <Card className="p-4 bg-muted/50 border-dashed">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="newVariationType">Type *</Label>
                    <Input
                      id="newVariationType"
                      value={newVariation.variationType}
                      onChange={(e) => setNewVariation({ ...newVariation, variationType: e.target.value })}
                      placeholder="e.g., frameColor, posterFinish"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newVariationValue">Value *</Label>
                    <Input
                      id="newVariationValue"
                      value={newVariation.variationValue}
                      onChange={(e) => setNewVariation({ ...newVariation, variationValue: e.target.value })}
                      placeholder="e.g., black, matte"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newVariationLabel">Label *</Label>
                    <Input
                      id="newVariationLabel"
                      value={newVariation.variationLabel}
                      onChange={(e) => setNewVariation({ ...newVariation, variationLabel: e.target.value })}
                      placeholder="e.g., Black, Matte"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="newVariationDescription">Description</Label>
                    <Input
                      id="newVariationDescription"
                      value={newVariation.variationDescription || ''}
                      onChange={(e) => setNewVariation({ ...newVariation, variationDescription: e.target.value })}
                      placeholder="e.g., Natural, uncoated finish"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPriceModifier">Price Modifier</Label>
                    <Input
                      id="newPriceModifier"
                      type="number"
                      step="0.01"
                      value={newVariation.priceModifier}
                      onChange={(e) => setNewVariation({ ...newVariation, priceModifier: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Switch
                        checked={newVariation.isActive}
                        onCheckedChange={(checked) => setNewVariation({ ...newVariation, isActive: checked })}
                      />
                      <span className="text-sm">Active</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createVariation} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Create Variation
                  </Button>
                  <Button onClick={() => setShowNewVariationForm(false)} size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {product.variations && product.variations.length > 0 ? (
            <div className="space-y-3">
              {product.variations.map((variation) => (
                <Card key={variation.id} className="p-4">
                  {editingVariation === variation.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="editVariationType">Type *</Label>
                          <Input
                            id="editVariationType"
                            value={variationFormData.variationType}
                            onChange={(e) => setVariationFormData({ ...variationFormData, variationType: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editVariationValue">Value *</Label>
                          <Input
                            id="editVariationValue"
                            value={variationFormData.variationValue}
                            onChange={(e) => setVariationFormData({ ...variationFormData, variationValue: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editVariationLabel">Label *</Label>
                          <Input
                            id="editVariationLabel"
                            value={variationFormData.variationLabel}
                            onChange={(e) => setVariationFormData({ ...variationFormData, variationLabel: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="editVariationDescription">Description</Label>
                          <Input
                            id="editVariationDescription"
                            value={variationFormData.variationDescription || ''}
                            onChange={(e) => setVariationFormData({ ...variationFormData, variationDescription: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editPriceModifier">Price Modifier</Label>
                          <Input
                            id="editPriceModifier"
                            type="number"
                            step="0.01"
                            value={variationFormData.priceModifier}
                            onChange={(e) => setVariationFormData({ ...variationFormData, priceModifier: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Switch
                              checked={variationFormData.isActive}
                              onCheckedChange={(checked) => setVariationFormData({ ...variationFormData, isActive: checked })}
                            />
                            <span className="text-sm">Active</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => variation.id && saveVariation(variation.id)} size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={cancelEditVariation} size="sm" variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Display mode
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-5 gap-3">
                        <div>
                          <Label className="text-xs">Type</Label>
                          <p className="font-medium">{variation.variationType}</p>
                        </div>
                        <div>
                          <Label className="text-xs">Value</Label>
                          <p>{variation.variationValue}</p>
                        </div>
                        <div>
                          <Label className="text-xs">Label</Label>
                          <p className="font-medium">{variation.variationLabel}</p>
                        </div>
                        <div>
                          <Label className="text-xs">Price Modifier</Label>
                          <p className={variation.priceModifier > 0 ? 'text-green-600' : variation.priceModifier < 0 ? 'text-blue-600' : ''}>
                            {variation.priceModifier > 0 ? '+' : ''}${variation.priceModifier.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs">Status</Label>
                          <Badge variant={variation.isActive ? 'default' : 'secondary'} className="text-xs">
                            {variation.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditVariation(variation)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => variation.id && deleteVariation(variation.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              No variations added yet. Click &ldquo;Add Variation&rdquo; to get started.
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
