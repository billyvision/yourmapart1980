'use client'
import React, { useState, useRef } from 'react';
import { Download, Loader2, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { exportMapPosterKonva } from '@/lib/mpg/MPG-konva-export';
import { MPGKonvaPreview } from './MPG-konva-preview';
import { MPGSaveTemplateButton } from './MPG-save-template-button';
import { MPG_BASE_CANVAS } from '@/lib/mpg/MPG-konva-constants';

export function MPGBasicDownload() {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedSize, setSelectedSize] = useState('11x14');
  const [downloadComplete, setDownloadComplete] = useState(false);
  
  const { city } = useMPGStore();

  const sizeOptions = [
    { 
      id: '8x10', 
      label: 'Small', 
      dimensions: '8" × 10"',
      description: 'Perfect for desks and shelves'
    },
    { 
      id: '11x14', 
      label: 'Medium', 
      dimensions: '11" × 14"',
      description: 'Great for living rooms',
      recommended: true
    },
    { 
      id: '16x20', 
      label: 'Large', 
      dimensions: '16" × 20"',
      description: 'Statement piece for walls'
    }
  ];

  const handleDownload = async () => {
    setIsExporting(true);
    setDownloadComplete(false);
    
    try {
      // Create a temporary container for the export canvas
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.top = '-9999px';
      exportContainer.style.width = `${MPG_BASE_CANVAS.width}px`;
      exportContainer.style.height = `${MPG_BASE_CANVAS.height}px`;
      document.body.appendChild(exportContainer);

      // Create React root for the export canvas
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(exportContainer);

      // Create a promise to wait for export readiness
      let exportStage: any = null;
      const stageReady = new Promise<void>((resolve) => {
        root.render(
          <MPGKonvaPreview
            isExportMode={true}
            exportSize={selectedSize as any}
            showWatermark={false}
            onExportReady={(stage: any) => {
              exportStage = stage;
              resolve();
            }}
          />
        );
      });

      // Wait for stage to be ready
      await stageReady;
      
      if (!exportStage) {
        throw new Error('Failed to get canvas stage');
      }

      // Additional wait to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Export with the stage
      await exportMapPosterKonva({
        stage: exportStage,
        format: 'png',
        size: selectedSize as any,
        fileName: `${city.toLowerCase().replace(/\s+/g, '-')}-map`,
        quality: 1
      });

      // Cleanup
      root.unmount();
      document.body.removeChild(exportContainer);
      
      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 3000);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to download your map. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-heading font-semibold text-charcoal mb-2">
          Download Your Map
        </h2>
        <p className="text-medium-gray">
          Choose your preferred size and download your personalized map
        </p>
      </div>

      {/* Size Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-charcoal">
          Select Print Size
        </Label>
        
        <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
          <div className="space-y-3">
            {sizeOptions.map((size) => (
              <div
                key={size.id}
                className={`relative flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedSize === size.id
                    ? 'border-sage-green bg-sage-green/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <RadioGroupItem value={size.id} id={size.id} className="mt-1" />
                <label
                  htmlFor={size.id}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-charcoal">
                          {size.label}
                        </span>
                        <span className="text-sm font-semibold text-sage-green">
                          {size.dimensions}
                        </span>
                        {size.recommended && (
                          <span className="px-2 py-0.5 text-xs bg-sage-green text-white rounded-md">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {size.description}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Quality Info */}
      <div className="bg-warm-cream/50 border border-warm-cream rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-sage-green mt-0.5" />
          <div>
            <h4 className="font-medium text-charcoal mb-1">
              High-Resolution Export
            </h4>
            <p className="text-sm text-gray-600">
              Your map will be exported at 300 DPI for crisp, professional printing
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="space-y-4">
        <Button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full h-12 bg-sage-green hover:bg-sage-green-dark text-white text-base font-medium"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Preparing Your Map...
            </>
          ) : downloadComplete ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Download Complete!
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download Your Map
            </>
          )}
        </Button>

        {/* Save Template Button */}
        <MPGSaveTemplateButton
          variant="outline"
          className="w-full h-12"
        />

        <p className="text-xs text-center text-gray-500">
          Your map will be saved as a PNG image file
        </p>
      </div>

      {/* Additional Info */}
      <div className="border-t pt-6 space-y-3">
        <h4 className="font-medium text-charcoal">What's Next?</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-sage-green mt-0.5" />
            <span>Print at home or at your favorite print shop</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-sage-green mt-0.5" />
            <span>Frame it to match your decor</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-sage-green mt-0.5" />
            <span>Makes a perfect gift for loved ones</span>
          </li>
        </ul>
      </div>
    </div>
  );
}