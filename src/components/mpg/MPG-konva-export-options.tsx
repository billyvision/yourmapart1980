'use client'
import React, { useState, useRef } from 'react';
import { Download, FileImage, Loader2, Package, Check, Sparkles, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { exportMapPosterKonva } from '@/lib/mpg/MPG-konva-export';
import { MPGKonvaPreview } from './MPG-konva-preview';
import { MPG_BASE_CANVAS } from '@/lib/mpg/MPG-konva-constants';
import { MPGSaveTemplateButton } from './MPG-save-template-button';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

// Product configurations with sizes and pricing
const PRODUCT_CONFIGS = {
  digital: {
    name: 'Digital Download',
    description: 'Instant high-resolution PNG + PDF',
    icon: FileImage,
    price: 9.99,
    sizes: [
      { value: '8x10', label: '8×10"', dimensions: '8×10"', popular: true },
      { value: '11x14', label: '11×14"', dimensions: '11×14"', popular: true },
      { value: '12x16', label: '12×16"', dimensions: '12×16"' },
      { value: '16x20', label: '16×20"', dimensions: '16×20"', popular: true },
      { value: '18x24', label: '18×24"', dimensions: '18×24"' },
      { value: '24x36', label: '24×36"', dimensions: '24×36"' },
    ],
    features: ['300 DPI PNG + PDF', 'Print-ready files', 'Instant download', 'No watermark'],
  },
  poster: {
    name: 'Paper Poster',
    description: 'Premium matte or glossy finish',
    icon: Package,
    basePrice: 34.99,
    sizes: [
      { value: '8x10', label: '8×10"', price: 24.99 },
      { value: '11x14', label: '11×14"', price: 34.99, popular: true },
      { value: '12x16', label: '12×16"', price: 39.99 },
      { value: '16x20', label: '16×20"', price: 49.99, popular: true },
      { value: '18x24', label: '18×24"', price: 59.99 },
      { value: '24x36', label: '24×36"', price: 79.99 },
    ],
    features: ['Premium paper (200-250 GSM)', 'Vibrant archival inks', 'Matte or glossy finish', 'Ships in protective tube'],
  },
  canvas: {
    name: 'Canvas Print',
    description: 'Gallery-wrapped, ready to hang',
    icon: Package,
    basePrice: 89.99,
    sizes: [
      { value: '12x16', label: '12×16"', price: 74.99 },
      { value: '16x20', label: '16×20"', price: 89.99, popular: true },
      { value: '18x24', label: '18×24"', price: 109.99, popular: true },
      { value: '20x24', label: '20×24"', price: 129.99 },
      { value: '24x36', label: '24×36"', price: 159.99 },
    ],
    features: ['Museum-quality canvas', 'Solid wood stretcher bars', 'Ready to hang', 'Fade-resistant inks'],
  },
  framed: {
    name: 'Framed Print',
    description: 'Professional frame included',
    icon: Package,
    basePrice: 119.99,
    sizes: [
      { value: '8x10', label: '8×10"', price: 69.99 },
      { value: '11x14', label: '11×14"', price: 89.99 },
      { value: '12x16', label: '12×16"', price: 99.99 },
      { value: '16x20', label: '16×20"', price: 119.99, popular: true },
      { value: '18x24', label: '18×24"', price: 149.99 },
    ],
    features: ['Sustainably-sourced timber', 'Protective glazing', 'Hanging hardware included', 'Ready to display'],
  },
  acrylic: {
    name: 'Acrylic Print',
    description: 'Crystal-clear, ultra-modern',
    icon: Sparkles,
    basePrice: 179.99,
    sizes: [
      { value: '12x16', label: '12×16"', price: 139.99 },
      { value: '16x20', label: '16×20"', price: 179.99, popular: true },
      { value: '20x24', label: '20×24"', price: 229.99 },
      { value: '24x32', label: '24×32"', price: 289.99 },
    ],
    features: ['4mm crystal-clear acrylic', 'Floating mount system', 'Depth and dimension effect', 'Diamond polished edges'],
  },
  metal: {
    name: 'Metal Print',
    description: 'Sleek aluminum finish',
    icon: Sparkles,
    basePrice: 169.99,
    sizes: [
      { value: '12x16', label: '12×16"', price: 129.99 },
      { value: '16x20', label: '16×20"', price: 169.99, popular: true },
      { value: '18x24', label: '18×24"', price: 199.99 },
      { value: '20x24', label: '20×24"', price: 229.99 },
      { value: '24x36', label: '24×36"', price: 289.99 },
    ],
    features: ['Premium aluminum di-bond', 'Vivid color reproduction', 'Scratch-resistant', 'Lightweight & durable'],
  },
};

export function MPGKonvaExportOptions() {
  const [isExporting, setIsExporting] = useState(false);
  const { data: session } = useSession();

  const {
    exportFormat,
    productType,
    productSize,
    setProductType,
    setProductSize,
    city
  } = useMPGStore();

  const currentProduct = PRODUCT_CONFIGS[productType];
  const currentSize = currentProduct.sizes.find(s => s.value === productSize);
  const currentPrice = (currentSize && 'price' in currentSize ? currentSize.price : undefined) ||
                       ('basePrice' in currentProduct ? currentProduct.basePrice : undefined) ||
                       ('price' in currentProduct ? currentProduct.price : 0);

  // Auto-set first size when product type changes
  React.useEffect(() => {
    const firstSize = currentProduct.sizes[0]?.value;
    if (firstSize && !currentProduct.sizes.find(s => s.value === productSize)) {
      setProductSize(firstSize);
    }
  }, [productType, currentProduct.sizes, productSize, setProductSize]);

  const handleExport = async () => {
    if (productType !== 'digital') {
      // For physical products, show "Add to Cart" or redirect to checkout
      alert(`Add to Cart: ${currentProduct.name} - ${currentSize?.label || productSize} - $${currentPrice.toFixed(2)}`);
      return;
    }

    // Digital download export - Both PNG and PDF
    setIsExporting(true);

    try {
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.top = '-9999px';
      exportContainer.style.width = `${MPG_BASE_CANVAS.width}px`;
      exportContainer.style.height = `${MPG_BASE_CANVAS.height}px`;
      document.body.appendChild(exportContainer);

      const { createRoot } = await import('react-dom/client');
      const root = createRoot(exportContainer);

      let exportStage: any = null;
      const stageReady = new Promise<void>((resolve) => {
        root.render(
          <MPGKonvaPreview
            isExportMode={true}
            exportSize={productSize as any}
            showWatermark={false}
            onExportReady={(stage: any) => {
              exportStage = stage;
              resolve();
            }}
          />
        );
      });

      await stageReady;

      if (!exportStage) {
        throw new Error('Failed to get canvas stage');
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const fileName = `${city.toLowerCase().replace(/\s+/g, '-')}-map`;

      // Export PNG
      await exportMapPosterKonva({
        stage: exportStage,
        format: 'png',
        size: productSize as any,
        fileName: fileName,
        quality: 1
      });

      // Wait a moment between exports
      await new Promise(resolve => setTimeout(resolve, 300));

      // Export PDF
      await exportMapPosterKonva({
        stage: exportStage,
        format: 'pdf',
        size: productSize as any,
        fileName: fileName,
        quality: 1
      });

      root.unmount();
      document.body.removeChild(exportContainer);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export map poster. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-charcoal">
            Choose Your Product
          </h3>
          <p className="text-medium-gray text-sm mt-1">
            Select format and size for your custom map
          </p>
        </div>
      </div>

      {/* Product Type Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-charcoal">Product Type</Label>
          {productType === 'digital' && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              Instant Download
            </span>
          )}
          {productType !== 'digital' && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
              Physical Product
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(Object.keys(PRODUCT_CONFIGS) as Array<keyof typeof PRODUCT_CONFIGS>).map((type) => {
            const config = PRODUCT_CONFIGS[type];
            const Icon = config.icon;
            const isSelected = productType === type;

            return (
              <button
                key={type}
                onClick={() => setProductType(type)}
                className={cn(
                  "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md group",
                  isSelected
                    ? "border-charcoal bg-gray-50 shadow-md ring-2 ring-charcoal ring-offset-2"
                    : "border-gray-200 hover:border-gray-400 bg-white"
                )}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-charcoal rounded-full flex items-center justify-center shadow-md z-10">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all",
                  "bg-gray-100 group-hover:bg-gray-200"
                )}>
                  <Icon className={cn(
                    "w-6 h-6 transition-colors",
                    isSelected ? "text-charcoal" : "text-gray-600 group-hover:text-charcoal"
                  )} />
                </div>

                <span className={cn(
                  "text-xs font-semibold text-center transition-colors",
                  isSelected ? "text-charcoal" : "text-gray-700"
                )}>
                  {config.name}
                </span>

                {type === 'digital' && 'price' in config && (
                  <span className="text-xs text-gray-500 mt-1">${config.price}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Product Description */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-charcoal mb-2">{currentProduct.name}</h4>
          <p className="text-xs text-medium-gray mb-3">{currentProduct.description}</p>
          <ul className="grid grid-cols-2 gap-2">
            {currentProduct.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                <Check className="w-3 h-3 text-charcoal mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-charcoal">Select Size</Label>

        <RadioGroup
          value={productSize}
          onValueChange={setProductSize}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {currentProduct.sizes.map((size) => {
            const isPopular = 'popular' in size && size.popular;
            const sizePrice = 'price' in size ? size.price : ('price' in currentProduct ? currentProduct.price : undefined);

            return (
              <div key={size.value} className="relative">
                <RadioGroupItem
                  value={size.value}
                  id={`size-${size.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`size-${size.value}`}
                  className={cn(
                    "flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-400 peer-checked:border-charcoal peer-checked:bg-gray-50 peer-checked:shadow-sm",
                    isPopular && "border-orange-300 bg-orange-50/50"
                  )}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                      Popular
                    </span>
                  )}

                  <span className="font-semibold text-charcoal text-sm">{size.label}</span>

                  {'dimensions' in size && (
                    <span className="text-xs text-gray-500 mt-1">{size.dimensions}</span>
                  )}

                  {sizePrice && (
                    <span className="text-charcoal font-bold text-base mt-2">
                      ${sizePrice}
                    </span>
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {/* Price Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-charcoal">
              {currentProduct.name}
            </h4>
            <p className="text-sm text-medium-gray">
              {currentSize?.label || productSize}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-charcoal">
              ${currentPrice.toFixed(2)}
            </div>
            {productType === 'digital' && (
              <div className="text-xs text-medium-gray mt-1">
                One-time payment
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-base"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : productType === 'digital' ? (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download Now - ${currentPrice.toFixed(2)}
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart - ${currentPrice.toFixed(2)}
            </>
          )}
        </Button>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-300">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Check className="w-4 h-4 text-charcoal mt-0.5 flex-shrink-0" />
            <p>
              {productType === 'digital'
                ? 'Instant download after payment. 300 DPI print-ready files with no watermark.'
                : 'Handcrafted with care. Ships within 3-5 business days. Free shipping on orders over $75.'}
            </p>
          </div>
        </div>
      </div>

      {/* Save Draft Button */}
      <div className="pt-4 border-t border-gray-200">
        <MPGSaveTemplateButton
          variant="outline"
          className="w-full py-3"
        />
        <p className="text-xs text-center text-gray-500 mt-2">
          Save as draft to continue editing later or create variations
        </p>
      </div>
    </div>
  );
}
