'use client'
import React, { useState, useRef } from 'react';
import { Download, FileImage, FileText, Loader2, FileType, Ruler, Info, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { exportMapPosterKonva } from '@/lib/mpg/MPG-konva-export';
import { downloadMapJSON, generateMapSnapshot } from '@/lib/mpg/MPG-json-export';
import { MPGKonvaPreview } from './MPG-konva-preview';
import { MPG_CANVAS_SIZES } from '@/lib/mpg/MPG-constants';
import { MPG_BASE_CANVAS } from '@/lib/mpg/MPG-konva-constants';
import { MPGAccordionSection } from './ui/MPG-accordion-section';
import { MPGAccordionManager } from './ui/MPG-accordion-manager';
import { MPGSaveTemplateButton } from './MPG-save-template-button';

export function MPGKonvaExportOptions() {
  const [isExporting, setIsExporting] = useState(false);
  const hiddenPreviewRef = useRef<HTMLDivElement>(null);
  
  const {
    exportFormat,
    exportSize,
    setExportFormat,
    setExportSize,
    city
  } = useMPGStore();

  const handleExport = async () => {
    setIsExporting(true);
    
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
            exportSize={exportSize as any}
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

      // Export with the stage using the base canvas approach
      // The high resolution comes from pixelRatio in toDataURL/toBlob
      await exportMapPosterKonva({
        stage: exportStage,
        format: exportFormat,
        size: exportSize as any,
        fileName: `${city.toLowerCase().replace(/\s+/g, '-')}-map`,
        quality: exportFormat === 'jpg' ? 0.95 : 1
      });

      // Cleanup
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
    <div className="space-y-2">
      {/* Step Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage-green text-white">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-charcoal">
            Export & Download
          </h3>
          <p className="text-medium-gray text-sm mt-1">
            Download your map poster in high resolution
          </p>
        </div>
      </div>

      <MPGAccordionManager>
        {/* File Format Section */}
        <MPGAccordionSection
          id="file-format"
          letter="A"
          title="File Format"
          description="Choose your preferred export format"
          icon={FileType}
          colorTheme="purple"
        >
        <div className="space-y-3">
          <RadioGroup
            value={exportFormat}
            onValueChange={(value: any) => setExportFormat(value)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <div className="relative">
              <RadioGroupItem
                value="png"
                id="format-png"
                className="peer sr-only"
              />
              <Label
                htmlFor="format-png"
                className="flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-sage-green peer-checked:border-sage-green peer-checked:bg-sage-green/10"
              >
                <FileImage className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-sage-green" />
                <span className="font-medium text-sm">PNG</span>
                <span className="text-xs text-medium-gray">Best quality</span>
              </Label>
            </div>

            <div className="relative">
              <RadioGroupItem
                value="jpg"
                id="format-jpg"
                className="peer sr-only"
              />
              <Label
                htmlFor="format-jpg"
                className="flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-sage-green peer-checked:border-sage-green peer-checked:bg-sage-green/10"
              >
                <FileImage className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-sage-green" />
                <span className="font-medium text-sm">JPG</span>
                <span className="text-xs text-medium-gray">Smaller size</span>
              </Label>
            </div>

            <div className="relative">
              <RadioGroupItem
                value="pdf"
                id="format-pdf"
                className="peer sr-only"
              />
              <Label
                htmlFor="format-pdf"
                className="flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-sage-green peer-checked:border-sage-green peer-checked:bg-sage-green/10"
              >
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-sage-green" />
                <span className="font-medium text-sm">PDF</span>
                <span className="text-xs text-medium-gray">For printing</span>
              </Label>
            </div>
          </RadioGroup>
          
          <div className="p-3 bg-warm-cream/50 rounded-lg">
            <p className="text-xs text-medium-gray">
              <span className="font-semibold text-charcoal">Selected: </span>
              {exportFormat.toUpperCase()} format
            </p>
          </div>
        </div>
        </MPGAccordionSection>

        {/* Paper Size Section */}
        <MPGAccordionSection
          id="paper-size"
          letter="B"
          title="Paper Size"
          description="Select your print dimensions"
          icon={Ruler}
          colorTheme="orange"
        >
        <div className="space-y-3">
          <Select value={exportSize} onValueChange={setExportSize}>
            <SelectTrigger id="export-size" className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4 (210×297mm)</SelectItem>
              <SelectItem value="Letter">Letter (8.5×11")</SelectItem>
              <SelectItem value="Square">Square (12×12")</SelectItem>
              <SelectItem value="Portrait">Portrait (16×20")</SelectItem>
              <SelectItem value="Landscape">Landscape (20×16")</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Size Guide */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-charcoal mb-2">Size Guide</h4>
            <ul className="space-y-1 text-xs text-medium-gray">
              <li>• <span className="font-medium">A4:</span> Standard paper (210×297mm)</li>
              <li>• <span className="font-medium">Letter:</span> US standard (8.5×11")</li>
              <li>• <span className="font-medium">Square:</span> Instagram ready (12×12")</li>
              <li>• <span className="font-medium">Portrait/Landscape:</span> Wall art sizes</li>
            </ul>
          </div>
        </div>
        </MPGAccordionSection>

        {/* Export Information Section */}
        <MPGAccordionSection
          id="export-info"
          letter="C"
          title="Export Information"
          description="Review your export settings"
          icon={Info}
          colorTheme="green"
        >
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong className="block mb-1">Current Settings:</strong>
              • Format: {exportFormat.toUpperCase()}<br />
              • Size: {exportSize}<br />
              • Resolution: High-quality print ready<br />
              • WYSIWYG accuracy guaranteed
            </p>
          </div>
          
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-xs text-amber-700">
              💡 <span className="font-medium">Tip:</span> Use PNG for best quality, JPG for smaller file size, PDF for professional printing
            </p>
          </div>
        </div>
        </MPGAccordionSection>

        {/* Data Export Section */}
        <MPGAccordionSection
          id="data-export"
          letter="D"
          title="Data Export"
          description="Save your map design as JSON data"
          icon={FileJson}
          colorTheme="blue"
        >
        <div className="space-y-3">
          {/* JSON Export Info */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">JSON Snapshot</h4>
            <p className="text-xs text-blue-800 mb-3">
              Export your complete map design configuration as a JSON file. This includes all your settings:
              location, text, styles, colors, and preferences.
            </p>
            <div className="bg-white p-2 rounded border border-blue-200 mb-3">
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
            className="w-full border-sage-green text-sage-green hover:bg-sage-green hover:text-white transition-colors"
          >
            <FileJson className="w-4 h-4 mr-2" />
            Download JSON Snapshot
          </Button>
          
          {/* Future Import Hint */}
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-xs text-amber-700">
              <span className="font-medium">💾 Save for Later:</span> Keep this JSON file to recreate your exact design in the future. 
              Import functionality coming soon!
            </p>
          </div>
        </div>
        </MPGAccordionSection>
      </MPGAccordionManager>

      {/* Export Button - Always visible */}
      <div className="mt-4 space-y-3">
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-sage-green hover:bg-sage-green-dark text-charcoal font-semibold py-3 rounded-lg transition-all duration-200 shadow-md"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Export Map Poster
            </>
          )}
        </Button>

        {/* Save Template Button */}
        <MPGSaveTemplateButton
          variant="outline"
          className="w-full py-3"
        />
      </div>
    </div>
  );
}