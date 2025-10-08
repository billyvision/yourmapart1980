'use client'
import React, { useState, useRef } from 'react';
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

// Variation pricing modifiers
const VARIATION_PRICING = {
  posterFinish: {
    matte: 0,
    'semi-gloss': 2
  },
  paperWeight: {
    '170gsm': -5,
    '200gsm': 0,
    '250gsm': 8
  },
  frameColor: {
    black: 0,
    natural: 0,
    'dark-brown': 0,
    oak: 5,
    ash: 5
  },
  canvasThickness: {
    slim: -10,
    thick: 0
  }
};

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
    description: 'Premium matte or semi-gloss finish',
    icon: Package,
    image: '/mpg/product-types/poster.png',
    basePrice: 34.99,
    sizes: [
      { value: '8x10', label: '8×10"', price: 24.99 },
      { value: '11x14', label: '11×14"', price: 34.99, popular: true },
      { value: '12x16', label: '12×16"', price: 39.99 },
      { value: '16x20', label: '16×20"', price: 49.99, popular: true },
      { value: '18x24', label: '18×24"', price: 59.99 },
      { value: '24x36', label: '24×36"', price: 79.99 },
    ],
    features: ['Museum-quality paper (170-250 GSM)', 'Acid-free, pH above 7', 'Matte or semi-gloss finish', 'FSC-certified sustainable paper'],
  },
  'canvas-wrap': {
    name: 'Canvas Print',
    description: 'Gallery-wrapped, ready to hang',
    icon: Package,
    image: '/mpg/product-types/canvas.png',
    basePrice: 89.99,
    sizes: [
      { value: '12x16', label: '12×16"', price: 74.99 },
      { value: '16x20', label: '16×20"', price: 89.99, popular: true },
      { value: '18x24', label: '18×24"', price: 109.99, popular: true },
      { value: '20x24', label: '20×24"', price: 129.99 },
      { value: '24x36', label: '24×36"', price: 159.99 },
    ],
    features: ['FSC-certified wood stretcher bars', 'Cotton-polyester blend (300-350gsm)', 'Slim (2cm) or Thick (4cm) options', 'Hanging kit included'],
  },
  'floating-canvas': {
    name: 'Floating Canvas',
    description: 'Framed canvas with depth effect',
    icon: Package,
    image: '/mpg/product-types/floating-canvas.png',
    basePrice: 119.99,
    sizes: [
      { value: '12x16', label: '12×16"', price: 99.99 },
      { value: '16x20', label: '16×20"', price: 119.99, popular: true },
      { value: '18x24', label: '18×24"', price: 139.99, popular: true },
      { value: '20x24', label: '20×24"', price: 159.99 },
    ],
    features: ['FSC-certified poplar/pine frames', 'Frame colors: Black, Natural, Dark Brown', '12mm gap between canvas and frame', 'Hanging kit included'],
  },
  framed: {
    name: 'Framed Print',
    description: 'Premium wooden frame included',
    icon: Package,
    image: '/mpg/product-types/framed.png',
    image2: '/mpg/product-types/framed-2.webp',
    basePrice: 119.99,
    sizes: [
      { value: '8x10', label: '8×10"', price: 69.99 },
      { value: '11x14', label: '11×14"', price: 89.99 },
      { value: '12x16', label: '12×16"', price: 99.99 },
      { value: '16x20', label: '16×20"', price: 119.99, popular: true },
      { value: '18x24', label: '18×24"', price: 149.99 },
    ],
    features: ['Responsibly sourced oak/ash wood', '20mm thick frame (wider profile)', 'Shatterproof plexiglass protection', 'Ready-to-hang kit included'],
  },
  acrylic: {
    name: 'Acrylic Print',
    description: 'Crystal-clear, ultra-modern',
    icon: Sparkles,
    image: '/mpg/product-types/acrylic.png',
    basePrice: 179.99,
    sizes: [
      { value: '12x16', label: '12×16"', price: 139.99 },
      { value: '16x20', label: '16×20"', price: 179.99, popular: true },
      { value: '20x24', label: '20×24"', price: 229.99 },
      { value: '24x32', label: '24×32"', price: 289.99 },
    ],
    features: ['4mm crystal-clear acrylic', 'Glossy glass-like finish', 'Straight-cut corners', 'Corner mounting hardware included'],
  },
  metal: {
    name: 'Aluminum Print',
    description: 'Sleek aluminum DIBOND® finish',
    icon: Sparkles,
    image: '/mpg/product-types/metal.png',
    basePrice: 169.99,
    sizes: [
      { value: '12x16', label: '12×16"', price: 129.99 },
      { value: '16x20', label: '16×20"', price: 169.99, popular: true },
      { value: '18x24', label: '18×24"', price: 199.99 },
      { value: '20x24', label: '20×24"', price: 229.99 },
      { value: '24x36', label: '24×36"', price: 289.99 },
    ],
    features: ['Premium aluminum DIBOND®', '3mm thickness, rigid base', 'Matte, glare-free finish', 'White-coated with silky gloss'],
  },
};

export function MPGKonvaExportOptions() {
  const [isExporting, setIsExporting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { data: session } = useSession();

  const {
    exportFormat,
    productType,
    productSize,
    posterFinish,
    frameColor,
    canvasThickness,
    paperWeight,
    setProductType,
    setProductSize,
    setPosterFinish,
    setFrameColor,
    setCanvasThickness,
    setPaperWeight,
    city
  } = useMPGStore();

  // Check if user is superadmin
  const userRole = (session?.user as any)?.role;
  const isSuperAdmin = userRole === 'superadmin';

  // Handle escape key to close lightbox
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxImage) {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [lightboxImage]);

  const currentProduct = PRODUCT_CONFIGS[productType];
  const currentSize = currentProduct.sizes.find(s => s.value === productSize);

  // Calculate dynamic price with variations
  const calculatePrice = () => {
    let basePrice = (currentSize && 'price' in currentSize ? currentSize.price : undefined) ||
                    ('basePrice' in currentProduct ? currentProduct.basePrice : undefined) ||
                    ('price' in currentProduct ? currentProduct.price : 0);

    // Add variation modifiers
    if (productType === 'poster') {
      basePrice += VARIATION_PRICING.posterFinish[posterFinish];
      basePrice += VARIATION_PRICING.paperWeight[paperWeight];
    }

    if (productType === 'framed' || productType === 'floating-canvas') {
      basePrice += VARIATION_PRICING.frameColor[frameColor];
    }

    if (productType === 'canvas-wrap') {
      basePrice += VARIATION_PRICING.canvasThickness[canvasThickness];
    }

    return basePrice;
  };

  const currentPrice = calculatePrice();

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

        {/* Product Variations */}
        {productType === 'poster' && (
          <div className="space-y-4 bg-blue-50/30 border border-blue-100 rounded-lg p-4">
            {/* Poster Finish */}
            <div>
              <Label className="text-sm font-semibold text-charcoal mb-3 block">Paper Finish</Label>
              <div className="grid grid-cols-2 gap-3">
                {['matte', 'semi-gloss'].map((finish) => (
                  <button
                    key={finish}
                    onClick={() => setPosterFinish(finish as 'matte' | 'semi-gloss')}
                    className={cn(
                      "relative px-4 py-3 rounded-lg border-2 transition-all duration-300 text-left",
                      posterFinish === finish
                        ? "border-charcoal bg-gray-50 shadow-md"
                        : "border-gray-200 hover:border-gray-400 bg-white/50"
                    )}
                  >
                    {posterFinish === finish && (
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-300">
                        <Check className="w-3.5 h-3.5 text-white animate-in fade-in duration-200" strokeWidth={3} />
                      </div>
                    )}
                    <div className="text-sm font-medium text-charcoal capitalize">{finish}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {finish === 'matte' ? 'Natural, uncoated finish' : 'Subtle silk shine'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Weight */}
            <div>
              <Label className="text-sm font-semibold text-charcoal mb-3 block">Paper Weight</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: '170gsm', label: '170 GSM', desc: 'Classic' },
                  { value: '200gsm', label: '200 GSM', desc: 'Premium' },
                  { value: '250gsm', label: '250 GSM', desc: 'Museum', badge: true }
                ].map((weight) => (
                  <button
                    key={weight.value}
                    onClick={() => setPaperWeight(weight.value as '170gsm' | '200gsm' | '250gsm')}
                    className={cn(
                      "relative px-3 py-2.5 rounded-lg border-2 transition-all duration-300",
                      paperWeight === weight.value
                        ? "border-charcoal bg-gray-50 shadow-md"
                        : "border-gray-200 hover:border-gray-400 bg-white/50"
                    )}
                  >
                    {paperWeight === weight.value && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-300">
                        <Check className="w-3 h-3 text-white animate-in fade-in duration-200" strokeWidth={3} />
                      </div>
                    )}
                    {weight.badge && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm whitespace-nowrap">
                        Museum
                      </div>
                    )}
                    <div className="text-xs font-semibold text-charcoal">{weight.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{weight.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Frame Color Selector for Framed and Floating Canvas */}
        {(productType === 'framed' || productType === 'floating-canvas') && (
          <div className="space-y-4 bg-amber-50/30 border border-amber-100 rounded-lg p-4">
            <div>
              <Label className="text-sm font-semibold text-charcoal mb-3 block">Frame Color</Label>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { value: 'black', label: 'Black', color: '#1a1a1a' },
                  { value: 'natural', label: 'Natural Wood', color: '#d4a574' },
                  { value: 'dark-brown', label: 'Dark Brown', color: '#3e2723' },
                  { value: 'oak', label: 'Oak', color: '#c19a6b' },
                  { value: 'ash', label: 'Ash', color: '#e8d5c4' }
                ].map((frame) => (
                  <button
                    key={frame.value}
                    onClick={() => setFrameColor(frame.value as any)}
                    className={cn(
                      "relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300",
                      frameColor === frame.value
                        ? "border-charcoal bg-gray-50 shadow-md"
                        : "border-gray-200 hover:border-gray-400 bg-white/50"
                    )}
                  >
                    {frameColor === frame.value && (
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-300">
                        <Check className="w-3.5 h-3.5 text-white animate-in fade-in duration-200" strokeWidth={3} />
                      </div>
                    )}
                    <div
                      className="w-10 h-10 rounded-full mb-2 border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: frame.color }}
                    />
                    <div className="text-xs font-medium text-charcoal text-center">{frame.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Canvas Thickness Selector */}
        {productType === 'canvas-wrap' && (
          <div className="space-y-4 bg-green-50/30 border border-green-100 rounded-lg p-4">
            <div>
              <Label className="text-sm font-semibold text-charcoal mb-3 block">Canvas Thickness</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'slim', label: 'Slim (2cm)', desc: 'Modern, lightweight profile' },
                  { value: 'thick', label: 'Thick (4cm)', desc: 'Gallery depth, bold presence' }
                ].map((thickness) => (
                  <button
                    key={thickness.value}
                    onClick={() => setCanvasThickness(thickness.value as 'slim' | 'thick')}
                    className={cn(
                      "relative px-4 py-3 rounded-lg border-2 transition-all duration-300 text-left",
                      canvasThickness === thickness.value
                        ? "border-charcoal bg-gray-50 shadow-md"
                        : "border-gray-200 hover:border-gray-400 bg-white/50"
                    )}
                  >
                    {canvasThickness === thickness.value && (
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-300">
                        <Check className="w-3.5 h-3.5 text-white animate-in fade-in duration-200" strokeWidth={3} />
                      </div>
                    )}
                    <div className="text-sm font-medium text-charcoal">{thickness.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{thickness.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

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
                  {currentProduct.features.map((feature, idx) => (
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
                  {currentProduct.features.map((feature, idx) => (
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
                {currentProduct.features.map((feature, idx) => (
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
            const isPopular = 'popular' in size && size.popular;
            const sizePrice = 'price' in size ? size.price : ('price' in currentProduct ? currentProduct.price : undefined);

            const isSelected = productSize === size.value;

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

          {/* Poster Variations */}
          {productType === 'poster' && (
            <>
              <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-200">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 block">Finish</span>
                  <span className="text-sm font-medium text-charcoal capitalize">{posterFinish}</span>
                </div>
                {VARIATION_PRICING.posterFinish[posterFinish] > 0 && (
                  <span className="text-xs font-semibold text-green-600">+${VARIATION_PRICING.posterFinish[posterFinish]}</span>
                )}
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-200">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 block">Paper Weight</span>
                  <span className="text-sm font-medium text-charcoal">{paperWeight.toUpperCase()}</span>
                </div>
                {VARIATION_PRICING.paperWeight[paperWeight] !== 0 && (
                  <span className={cn(
                    "text-xs font-semibold",
                    VARIATION_PRICING.paperWeight[paperWeight] > 0 ? "text-green-600" : "text-blue-600"
                  )}>
                    {VARIATION_PRICING.paperWeight[paperWeight] > 0 ? '+' : ''}${VARIATION_PRICING.paperWeight[paperWeight]}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Frame Color for Framed & Floating Canvas */}
          {(productType === 'framed' || productType === 'floating-canvas') && (
            <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-200">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500 block">Frame Color</span>
                <span className="text-sm font-medium text-charcoal capitalize">{frameColor.replace('-', ' ')}</span>
              </div>
              {VARIATION_PRICING.frameColor[frameColor] > 0 && (
                <span className="text-xs font-semibold text-green-600">+${VARIATION_PRICING.frameColor[frameColor]}</span>
              )}
            </div>
          )}

          {/* Canvas Thickness */}
          {productType === 'canvas-wrap' && (
            <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-200">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500 block">Canvas Thickness</span>
                <span className="text-sm font-medium text-charcoal capitalize">{canvasThickness}</span>
              </div>
              {VARIATION_PRICING.canvasThickness[canvasThickness] !== 0 && (
                <span className={cn(
                  "text-xs font-semibold",
                  VARIATION_PRICING.canvasThickness[canvasThickness] > 0 ? "text-green-600" : "text-blue-600"
                )}>
                  {VARIATION_PRICING.canvasThickness[canvasThickness] > 0 ? '+' : ''}${VARIATION_PRICING.canvasThickness[canvasThickness]}
                </span>
              )}
            </div>
          )}

          {/* Size */}
          <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-200">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <span className="text-xs text-gray-500 block">Size</span>
              <span className="text-sm font-medium text-charcoal">{currentSize?.label || productSize}</span>
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
