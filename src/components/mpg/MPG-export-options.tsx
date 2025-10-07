'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, FileImage, Loader2 } from 'lucide-react';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { MPG_CANVAS_SIZES, MPG_EXPORT_FORMATS } from '@/lib/mpg/MPG-constants';
import { exportMapPosterClone } from '@/lib/mpg/MPG-export-clone';

interface MPGExportOptionsProps {
  previewRef: React.RefObject<HTMLDivElement>;
}

export function MPGExportOptions({ previewRef }: MPGExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    city,
    country,
    exportFormat,
    exportSize,
    exportQuality,
    setExportFormat,
    setExportSize,
    setExportQuality
  } = useMPGStore();

  const handleExport = async () => {
    if (!previewRef.current) {
      alert('Preview not ready. Please wait and try again.');
      return;
    }

    setIsExporting(true);
    
    try {
      // Export by cloning the actual preview element
      await exportMapPosterClone({
        format: exportFormat,
        size: exportSize,
        quality: exportQuality,
        fileName: `${city.toLowerCase().replace(/\s+/g, '-')}-map-poster`,
        previewElement: previewRef.current
      });
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export map poster. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage-green text-white">
          <FileImage className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-charcoal">
            Export Options
          </h3>
          <p className="text-medium-gray text-sm mt-1">
            Download your map poster
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Export Size */}
        <div>
          <Label className="text-sm font-semibold text-charcoal mb-3 block">
            Size
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MPG_CANVAS_SIZES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setExportSize(key)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  exportSize === key
                    ? 'bg-sage-green text-white'
                    : 'bg-gray-50 hover:bg-sage-green/10 text-charcoal border-2 border-gray-200'
                }`}
              >
                <div>{value.label}</div>
                <div className="text-xs opacity-80 mt-1">
                  {value.width}×{value.height}px
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Format */}
        <div>
          <Label className="text-sm font-semibold text-charcoal mb-3 block">
            Format
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {MPG_EXPORT_FORMATS.filter(f => f.id !== 'pdf').map((format) => (
              <button
                key={format.id}
                onClick={() => setExportFormat(format.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  exportFormat === format.id
                    ? 'bg-sage-green text-white'
                    : 'bg-gray-50 hover:bg-sage-green/10 text-charcoal border-2 border-gray-200'
                }`}
              >
                {format.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Slider (for JPG) */}
        {exportFormat === 'jpg' && (
          <div>
            <Label className="text-sm font-semibold text-charcoal mb-2 block">
              Quality: {Math.round(exportQuality * 100)}%
            </Label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={exportQuality}
              onChange={(e) => setExportQuality(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* Export Information */}
        <div className="bg-warm-cream/30 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-charcoal mb-2">Export Details</h4>
          <ul className="space-y-1 text-xs text-medium-gray">
            <li>• High resolution output for printing</li>
            <li>• No watermarks on exported images</li>
            <li>• Optimized for {exportSize === 'A4' ? 'standard printing' : exportSize.toLowerCase()}</li>
            <li>• File format: {exportFormat.toUpperCase()}</li>
          </ul>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-sage-green hover:bg-sage-green-dark text-white h-12 rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download Design
            </>
          )}
        </Button>

        {/* Tips */}
        <div className="text-xs text-medium-gray text-center mt-4">
          <p>Tip: For best print quality, use PNG format</p>
        </div>
      </div>
    </div>
  );
}