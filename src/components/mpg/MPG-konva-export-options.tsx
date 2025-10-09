'use client'
import React, { useState, useEffect } from 'react';
import { Download, FileImage, Loader2, Package, Check, Sparkles, ShoppingCart, FileJson, ZoomIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { exportMapPosterKonva } from '@/lib/mpg/MPG-konva-export';
import { downloadMapJSON } from '@/lib/mpg/MPG-json-export';
import { MPGKonvaPreview } from './MPG-konva-preview';
import { MPG_BASE_CANVAS } from '@/lib/mpg/MPG-konva-constants';
import { MPGSaveTemplateButton } from './MPG-save-template-button';
import { MPGProductDetailsAccordion } from './MPG-product-details-accordion';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

// Icon mapping for dynamic products
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileImage,
  Package,
  Sparkles,
};

export function MPGKonvaExportOptions() {
  const [isExporting, setIsExporting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { data: session } = useSession();

  const {
    products,
    productsLoading,
    fetchProducts,
    productType,
    productSize,
    selectedVariations,
    setProductType,
    setProductSize,
    setVariation,
    getSelectedProduct,
    getSelectedSize,
    getCurrentPrice,
    city
  } = useMPGStore();

  // Get current product info
  const currentProduct = getSelectedProduct();
  const currentSize = getSelectedSize();
  const currentPrice = getCurrentPrice();

  // Check if user is superadmin
  const userRole = (session?.user as any)?.role;
  const isSuperAdmin = userRole === 'superadmin';

  // Fetch products on mount
  useEffect(() => {
    if (products.length === 0 && !productsLoading) {
      fetchProducts();
    }
  }, [products.length, productsLoading, fetchProducts]);

  // Initialize default variations when product changes
  useEffect(() => {
    if (!currentProduct || !currentProduct.variations) return;

    // Group variations by type to set defaults
    const variationsByType = currentProduct.variations.reduce((acc, variation) => {
      if (!acc[variation.variationType]) {
        acc[variation.variationType] = [];
      }
      acc[variation.variationType].push(variation);
      return acc;
    }, {} as Record<string, typeof currentProduct.variations>);

    // Set default (first) variation for each type if not already selected
    Object.entries(variationsByType).forEach(([variationType, variations]) => {
      if (!selectedVariations[variationType] && variations.length > 0) {
        // Sort by displayOrder and pick first
        const sortedVariations = [...variations].sort((a, b) => a.displayOrder - b.displayOrder);
        setVariation(variationType, sortedVariations[0].variationValue);
      }
    });
  }, [productType, currentProduct, selectedVariations, setVariation]);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxImage) {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [lightboxImage]);

  // Show loading state while products are being fetched
  if (productsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  // Show error if products failed to load
  if (!currentProduct || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products available. Please contact support.</p>
      </div>
    );
  }

  const handleExport = async () => {
    if (productType !== 'digital') {
      // For physical products, show "Add to Cart" or redirect to checkout
      alert(`Add to Cart: ${currentProduct.name} - ${currentSize?.sizeLabel || productSize} - $${currentPrice.toFixed(2)}`);
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
          {products.map((product) => {
            const IconComponent = product.icon ? ICON_MAP[product.icon] || Package : Package;
            const isSelected = productType === product.productType;

            return (
              <button
                key={product.productType}
                onClick={() => setProductType(product.productType)}
                className={cn(
                  "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md group",
                  isSelected
                    ? "border-charcoal bg-gray-50 shadow-lg ring-2 ring-charcoal ring-offset-2"
                    : "border-gray-200 hover:border-gray-400 bg-white"
                )}
              >
                {/* Selection Indicator - Enhanced with animation */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg z-10 animate-in zoom-in-50 duration-300">
                    <Check className="w-4 h-4 text-white animate-in fade-in duration-200" strokeWidth={3} />
                  </div>
                )}

                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all",
                  "bg-gray-100 group-hover:bg-gray-200"
                )}>
                  <IconComponent className={cn(
                    "w-6 h-6 transition-colors",
                    isSelected ? "text-charcoal" : "text-gray-600 group-hover:text-charcoal"
                  )} />
                </div>

                <span className={cn(
                  "text-xs font-semibold text-center transition-colors",
                  isSelected ? "text-charcoal" : "text-gray-700"
                )}>
                  {product.name}
                </span>

                {product.basePrice && (
                  <span className="text-xs text-gray-500 mt-1">${product.basePrice}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Product Variations */}
        {currentProduct.variations && currentProduct.variations.length > 0 && (() => {
          // Group variations by type
          const variationsByType = currentProduct.variations.reduce((acc, variation) => {
            if (!acc[variation.variationType]) {
              acc[variation.variationType] = [];
            }
            acc[variation.variationType].push(variation);
            return acc;
          }, {} as Record<string, typeof currentProduct.variations>);

          return Object.entries(variationsByType).map(([variationType, variations]) => {
            const variationTypeLabel = variations[0]?.variationType === 'posterFinish' ? 'Paper Finish'
              : variations[0]?.variationType === 'paperWeight' ? 'Paper Weight'
              : variations[0]?.variationType === 'frameColor' ? 'Frame Color'
              : variations[0]?.variationType === 'canvasThickness' ? 'Canvas Thickness'
              : variationType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

            const hasColorMetadata = variations.some(v => v.metadata && 'color' in v.metadata);
            const gridCols = hasColorMetadata ? 'grid-cols-5' : variations.length <= 2 ? 'grid-cols-2' : 'grid-cols-3';

            return (
              <div key={variationType} className="space-y-4 bg-blue-50/30 border border-blue-100 rounded-lg p-4">
                <div>
                  <Label className="text-sm font-semibold text-charcoal mb-3 block">{variationTypeLabel}</Label>
                  <div className={cn("grid gap-3", gridCols)}>
                    {variations.map((variation) => {
                      const isSelected = selectedVariations[variationType] === variation.variationValue;
                      const hasColor = variation.metadata && 'color' in variation.metadata;

                      return (
                        <button
                          key={variation.id}
                          onClick={() => setVariation(variationType, variation.variationValue)}
                          className={cn(
                            "relative rounded-lg border-2 transition-all duration-300",
                            hasColor ? "flex flex-col items-center p-3" : "px-4 py-3 text-left",
                            isSelected
                              ? "border-charcoal bg-gray-50 shadow-md"
                              : "border-gray-200 hover:border-gray-400 bg-white/50"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-300">
                              <Check className="w-3.5 h-3.5 text-white animate-in fade-in duration-200" strokeWidth={3} />
                            </div>
                          )}

                          {hasColor && (
                            <div
                              className="w-10 h-10 rounded-full mb-2 border-2 border-gray-300 shadow-sm"
                              style={{ backgroundColor: (variation.metadata as any).color }}
                            />
                          )}

                          <div className={cn(
                            "font-medium text-charcoal",
                            hasColor ? "text-xs text-center" : "text-sm"
                          )}>
                            {variation.variationLabel}
                          </div>

                          {variation.variationDescription && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {variation.variationDescription}
                            </div>
                          )}

                          {variation.priceModifier !== 0 && (
                            <div className={cn(
                              "text-xs font-semibold mt-1",
                              variation.priceModifier > 0 ? "text-green-600" : "text-blue-600"
                            )}>
                              {variation.priceModifier > 0 ? '+' : ''}${Math.abs(variation.priceModifier)}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          });
        })()}

        {/* Product Description */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          {'image2' in currentProduct && currentProduct.image2 ? (
            // Framed product with two images - flanking layout
            <div className="flex gap-4 items-center">
              {/* Left: First Product Image */}
              <div className="relative flex-shrink-0 w-48 h-48 rounded-lg overflow-hidden bg-white shadow-sm group cursor-pointer">
                <img
                  src={currentProduct.image!}
                  alt={`${currentProduct.name} - View 1`}
                  className="w-full h-full object-cover"
                />
                {/* Zoom overlay */}
                <div
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                  onClick={() => setLightboxImage(currentProduct.image!)}
                >
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <ZoomIn className="w-5 h-5 text-charcoal" />
                  </div>
                </div>
              </div>

              {/* Center: Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-charcoal mb-1">{currentProduct.name}</h4>
                <p className="text-xs text-medium-gray mb-3">{currentProduct.description}</p>
                <ul className="space-y-1.5">
                  {(currentProduct.features || []).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className="w-3 h-3 text-charcoal mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Second Product Image */}
              <div className="relative flex-shrink-0 w-48 h-48 rounded-lg overflow-hidden bg-white shadow-sm group cursor-pointer">
                <img
                  src={currentProduct.image2}
                  alt={`${currentProduct.name} - View 2`}
                  className="w-full h-full object-cover"
                />
                {/* Zoom overlay */}
                <div
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                  onClick={() => setLightboxImage(currentProduct.image2!)}
                >
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <ZoomIn className="w-5 h-5 text-charcoal" />
                  </div>
                </div>
              </div>
            </div>
          ) : 'image' in currentProduct && currentProduct.image ? (
            // Physical product with single image - split layout
            <div className="flex gap-4">
              {/* Left: Product Image */}
              <div className="relative flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden bg-white shadow-sm group cursor-pointer">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
                {/* Zoom overlay */}
                <div
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                  onClick={() => setLightboxImage(currentProduct.image!)}
                >
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <ZoomIn className="w-6 h-6 text-charcoal" />
                  </div>
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-charcoal mb-1">{currentProduct.name}</h4>
                <p className="text-xs text-medium-gray mb-3">{currentProduct.description}</p>
                <ul className="space-y-1.5">
                  {(currentProduct.features || []).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className="w-3 h-3 text-charcoal mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            // Digital download - no image
            <>
              <h4 className="text-sm font-semibold text-charcoal mb-2">{currentProduct.name}</h4>
              <p className="text-xs text-medium-gray mb-3">{currentProduct.description}</p>
              <ul className="grid grid-cols-2 gap-2">
                {(currentProduct.features || []).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-charcoal mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
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
            const isPopular = size.isPopular;
            const sizePrice = size.price || currentProduct.basePrice;
            const isSelected = productSize === size.sizeValue;

            return (
              <div key={size.sizeValue} className="relative">
                <RadioGroupItem
                  value={size.sizeValue}
                  id={`size-${size.sizeValue}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`size-${size.sizeValue}`}
                  className={cn(
                    "relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:border-gray-400",
                    isSelected
                      ? "border-charcoal bg-gray-50 shadow-md"
                      : isPopular
                        ? "border-orange-300 bg-orange-50/50"
                        : "border-gray-200"
                  )}
                >
                  {/* Check mark indicator for selected size */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-300">
                      <Check className="w-3.5 h-3.5 text-white animate-in fade-in duration-200" strokeWidth={3} />
                    </div>
                  )}

                  {/* Popular Badge */}
                  {isPopular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                      Popular
                    </span>
                  )}

                  <span className="font-semibold text-charcoal text-sm">{size.sizeLabel}</span>

                  {size.dimensions && (
                    <span className="text-xs text-gray-500 mt-1">{size.dimensions}</span>
                  )}

                  {sizePrice && (
                    <span className="text-charcoal font-bold text-base mt-2">
                      ${sizePrice.toFixed(2)}
                    </span>
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {/* Selection Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-base font-semibold text-charcoal">Your Selections</h4>
        </div>

        <div className="space-y-2.5">
          {/* Product Type */}
          <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-200">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <span className="text-xs text-gray-500 block">Product Type</span>
              <span className="text-sm font-medium text-charcoal">{currentProduct.name}</span>
            </div>
          </div>

          {/* Dynamic Variations Display */}
          {currentProduct.variations && currentProduct.variations.length > 0 && Object.entries(selectedVariations).map(([variationType, selectedValue]) => {
            const variation = currentProduct.variations.find(
              v => v.variationType === variationType && v.variationValue === selectedValue
            );

            if (!variation) return null;

            const variationTypeLabel = variationType === 'posterFinish' ? 'Finish'
              : variationType === 'paperWeight' ? 'Paper Weight'
              : variationType === 'frameColor' ? 'Frame Color'
              : variationType === 'canvasThickness' ? 'Canvas Thickness'
              : variationType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

            return (
              <div key={variationType} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-200">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 block">{variationTypeLabel}</span>
                  <span className="text-sm font-medium text-charcoal">{variation.variationLabel}</span>
                </div>
                {variation.priceModifier !== 0 && (
                  <span className={cn(
                    "text-xs font-semibold",
                    variation.priceModifier > 0 ? "text-green-600" : "text-blue-600"
                  )}>
                    {variation.priceModifier > 0 ? '+' : ''}${Math.abs(variation.priceModifier)}
                  </span>
                )}
              </div>
            );
          })}

          {/* Size */}
          <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-200">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <span className="text-xs text-gray-500 block">Size</span>
              <span className="text-sm font-medium text-charcoal">{currentSize?.sizeLabel || productSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-charcoal">
              {currentProduct.name}
            </h4>
            <p className="text-sm text-medium-gray">
              {currentSize?.sizeLabel || productSize}
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

      {/* Product Details Accordion */}
      <MPGProductDetailsAccordion
        productType={productType}
        productName={currentProduct.name}
      />

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

      {/* JSON Export - Superadmin Only */}
      {isSuperAdmin && (
        <div className="pt-4 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <FileJson className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-semibold text-charcoal">Data Export (Admin)</h4>
            </div>

            {/* JSON Export Info */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-xs text-blue-800 mb-2">
                Export your complete map design configuration as a JSON file. This includes all settings:
                location, text, styles, colors, and preferences.
              </p>
              <div className="bg-white p-2 rounded border border-blue-200 mb-2">
                <code className="text-xs text-gray-700">
                  <span className="text-blue-600">{"{"}</span><br />
                  <span className="ml-2 text-green-600">"version"</span>: "1.0",<br />
                  <span className="ml-2 text-green-600">"location"</span>: {"{ city, coordinates... }"},<br />
                  <span className="ml-2 text-green-600">"text"</span>: {"{ headline, custom... }"},<br />
                  <span className="ml-2 text-green-600">"style"</span>: {"{ map, frame, glow... }"},<br />
                  <span className="ml-2">...</span><br />
                  <span className="text-blue-600">{"}"}</span>
                </code>
              </div>
            </div>

            {/* Download Button */}
            <Button
              onClick={downloadMapJSON}
              variant="outline"
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <FileJson className="w-4 h-4 mr-2" />
              Download JSON Snapshot
            </Button>

            {/* Info Note */}
            <div className="p-2 bg-amber-50 rounded-lg">
              <p className="text-xs text-amber-700">
                <span className="font-medium">💾 Save for Later:</span> Keep this JSON file to recreate your exact design in the future.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-charcoal" />
          </button>

          {/* Image container */}
          <div
            className="relative max-w-5xl max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Product preview"
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
