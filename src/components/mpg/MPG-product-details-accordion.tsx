'use client'
import React from 'react';
import { ChevronDown, Package, Truck, Sparkles, Shield } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ProductDetailsAccordionProps {
  productType: 'digital' | 'poster' | 'canvas-wrap' | 'floating-canvas' | 'framed' | 'acrylic' | 'metal';
  productName: string;
}

export function MPGProductDetailsAccordion({ productType, productName }: ProductDetailsAccordionProps) {
  // Product-specific specifications
  const getProductSpecs = () => {
    switch (productType) {
      case 'digital':
        return {
          title: 'File Specifications',
          specs: [
            { label: 'Format', value: 'PNG + PDF' },
            { label: 'Resolution', value: '300 DPI' },
            { label: 'Color Space', value: 'RGB' },
            { label: 'File Size', value: 'High-resolution (print-ready)' },
            { label: 'Watermark', value: 'None' }
          ]
        };

      case 'poster':
        return {
          title: 'Paper Specifications',
          specs: [
            { label: 'Paper Type', value: 'Museum-quality archival paper' },
            { label: 'Weight Options', value: '170, 200, or 250 GSM' },
            { label: 'Finish', value: 'Matte or Semi-Gloss' },
            { label: 'Acid-Free', value: 'Yes, pH above 7' },
            { label: 'Certification', value: 'FSC-certified sustainable paper' },
            { label: 'Technology', value: 'Alkaline papermaking (prevents yellowing)' },
            { label: 'OBA Content', value: 'OBA-free or low-OBA for natural tones' }
          ]
        };

      case 'canvas-wrap':
        return {
          title: 'Canvas Specifications',
          specs: [
            { label: 'Material', value: 'Cotton-polyester blend canvas' },
            { label: 'Weight', value: '300-350 GSM' },
            { label: 'Thickness Options', value: 'Slim (2cm) or Thick (4cm)' },
            { label: 'Frame', value: 'FSC-certified wood stretcher bars' },
            { label: 'Mounting Kit', value: 'Included (varies by region)' },
            { label: 'Certification', value: 'FSC-certified sustainable wood' },
            { label: 'Smallest Size', value: '8×8 inches' },
            { label: 'Largest Size', value: '28×40 inches' }
          ]
        };

      case 'floating-canvas':
        return {
          title: 'Framed Canvas Specifications',
          specs: [
            { label: 'Canvas', value: 'Premium cotton-polyester blend' },
            { label: 'Frame Material', value: 'Poplar or pine wood' },
            { label: 'Frame Certification', value: 'FSC, EU, or APCA certified' },
            { label: 'Frame Colors', value: 'Black, Natural Wood, Dark Brown' },
            { label: 'Gap Design', value: '12mm between canvas and frame' },
            { label: 'Mounting Kit', value: 'Included (varies by region)' },
            { label: 'Available Sizes', value: '13 different formats' }
          ]
        };

      case 'framed':
        return {
          title: 'Frame Specifications',
          specs: [
            { label: 'Frame Material', value: 'Responsibly sourced oak or ash wood' },
            { label: 'Frame Thickness', value: '20mm (0.79") - wider than standard' },
            { label: 'Standard Frame', value: '14mm (0.55") for comparison' },
            { label: 'Protection', value: 'Shatterproof plexiglass' },
            { label: 'Paper', value: '250 GSM museum-quality archival paper' },
            { label: 'Paper Finish', value: 'Matte, uncoated, natural white' },
            { label: 'Mounting', value: 'Ready-to-hang kit included' },
            { label: 'Available Sizes', value: '15 sizes in inches/cm' }
          ]
        };

      case 'acrylic':
        return {
          title: 'Acrylic Specifications',
          specs: [
            { label: 'Material', value: '4mm (0.15") crystal-clear acrylic' },
            { label: 'Finish', value: 'Glossy, glass-like finish' },
            { label: 'Design', value: 'Straight-cut corners' },
            { label: 'Mounting', value: 'Corner mounting hardware' },
            { label: 'Screw Holes', value: '8mm (0.31") diameter, 14mm from edge' },
            { label: 'Screw Head Size', value: '15mm (0.6")' },
            { label: 'Transparent BG', value: 'Defaults to white backing' },
            { label: 'Available Sizes', value: '18 sizes in inches/cm' }
          ]
        };

      case 'metal':
        return {
          title: 'Aluminum DIBOND® Specifications',
          specs: [
            { label: 'Material', value: 'Aluminum DIBOND®' },
            { label: 'Construction', value: 'Two white aluminum layers + black core' },
            { label: 'Core Material', value: 'Black polyethylene' },
            { label: 'Thickness', value: '3mm (0.12")' },
            { label: 'Finish', value: 'Matte, glare-free' },
            { label: 'Coating', value: 'White with subtle silky gloss' },
            { label: 'Printing', value: 'Direct print on DIBOND®' },
            { label: 'Mounting Kit', value: 'Included (varies by region)' },
            { label: 'Available Sizes', value: '18 sizes in inches/cm' }
          ]
        };

      default:
        return { title: 'Specifications', specs: [] };
    }
  };

  const productSpecs = getProductSpecs();

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <h3 className="text-lg font-semibold text-charcoal mb-4">Product Information</h3>

      <Accordion type="single" collapsible className="w-full">
        {/* Product Specifications */}
        <AccordionItem value="specifications">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-charcoal" />
              <span className="font-medium">{productSpecs.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {productSpecs.specs.map((spec, idx) => (
                <div key={idx} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-600">{spec.label}</span>
                  <span className="text-sm text-charcoal text-right ml-4">{spec.value}</span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-800">
                  <strong>🌱 Sustainability:</strong> {productType === 'digital'
                    ? 'Digital products have zero carbon footprint for production and shipping.'
                    : 'Gelato sources materials responsibly with FSC certification and eco-friendly practices.'}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Shipping & Delivery - Only for physical products */}
        {productType !== 'digital' && (
          <AccordionItem value="shipping">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-charcoal" />
                <span className="font-medium">Shipping & Delivery</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">Production Time</p>
                    <p className="text-xs text-gray-600 mt-1">3-5 business days for production</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">Global Fulfillment</p>
                    <p className="text-xs text-gray-600 mt-1">Printed and shipped from one of 24+ locations worldwide for faster delivery</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">Eco-Friendly Packaging</p>
                    <p className="text-xs text-gray-600 mt-1">Protective packaging with minimal environmental impact</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">Free Shipping</p>
                    <p className="text-xs text-gray-600 mt-1">On orders over $75</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Care Instructions */}
        <AccordionItem value="care">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-charcoal" />
              <span className="font-medium">Care Instructions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {productType === 'digital' ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                    <p className="text-sm text-gray-600">Store your files in a secure cloud backup</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                    <p className="text-sm text-gray-600">Print on high-quality paper for best results</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                    <p className="text-sm text-gray-600">Use professional printing services for large formats</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                    <p className="text-sm text-gray-600">Keep away from direct sunlight to prevent fading</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                    <p className="text-sm text-gray-600">Clean gently with a soft, dry cloth</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                    <p className="text-sm text-gray-600">Display in a climate-controlled environment for longevity</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                    <p className="text-sm text-gray-600">Avoid hanging in high-humidity areas (bathrooms, kitchens)</p>
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Quality Guarantee */}
        <AccordionItem value="guarantee">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-charcoal" />
              <span className="font-medium">Quality Guarantee</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Print Quality Standards</p>
                  <p className="text-xs text-gray-600 mt-1">Every product is printed to museum-quality standards with archival inks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-charcoal">100% Satisfaction Promise</p>
                  <p className="text-xs text-gray-600 mt-1">If you're not completely satisfied, we'll make it right</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-charcoal rounded-full mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Handcrafted with Care</p>
                  <p className="text-xs text-gray-600 mt-1">Each piece is made-to-order by skilled professionals</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>📧 Support:</strong> Questions about your order? Contact us at support@yourmapart.com
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
