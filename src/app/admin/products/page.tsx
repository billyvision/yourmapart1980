'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, PackageOpen, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  productType: string;
  name: string;
  description: string;
  basePrice: number | null;
  isActive: boolean;
  displayOrder: number;
  sizes: { id: number; sizeValue: string; price: number | null }[];
  variations: { id: number; variationType: string; variationValue: string }[];
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/');
          return;
        }
        throw new Error('Failed to load products');
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all sizes and variations.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadProducts();
      } else {
        const data = await response.json();
        alert(`Failed to delete: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Loading products...</div>
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Product Management</h1>
          <p className="text-muted-foreground">
            Manage products, pricing, sizes, and variations
          </p>
        </div>
        <Button onClick={() => router.push('/admin/products/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Product
        </Button>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  {!product.isActive && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  <Badge variant="outline">{product.productType}</Badge>
                </div>

                {product.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Base Price */}
                  {product.basePrice && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm">
                        <span className="font-medium">Base Price:</span> ${product.basePrice.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Sizes Count */}
                  <div className="flex items-center gap-2">
                    <PackageOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">
                      <span className="font-medium">Sizes:</span> {product.sizes.length}
                      {product.sizes.length > 0 && (
                        <span className="text-muted-foreground ml-1">
                          ({product.sizes.map(s => s.sizeValue).join(', ')})
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Variations Count */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {product.variations.length} Variations
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(product.id, product.name)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <PackageOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first product to get started
            </p>
            <Button onClick={() => router.push('/admin/products/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
