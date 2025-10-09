'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Wand2, Sparkles } from 'lucide-react';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { getTemplateData } from '@/lib/mpg/MPG-templates';
import { loadMapSnapshot } from '@/lib/mpg/MPG-json-export';
import { useToast } from '@/hooks/use-toast';
import { MPGBasicPersonalize } from './MPG-basic-personalize';
import { MPGKonvaExportOptions } from './MPG-konva-export-options';
import { MPGKonvaPreview } from './MPG-konva-preview';

interface MPGBasicEditorProps {
  templateId?: string | null;
}

export function MPGBasicEditor({ templateId }: MPGBasicEditorProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const previewRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const progressIndicatorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Get searchParams to check for templateId from URL
  const searchParams = useSearchParams();
  const savedTemplateId = searchParams.get('templateId');
  const { loadTemplate, loadFromTemplateData, setCurrentStep, fetchProducts } = useMPGStore();

  // Preload products in background when editor loads
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Load template if provided (from static templates or saved templates)
  useEffect(() => {
    // Priority 1: Load from saved template ID
    if (savedTemplateId) {
      loadTemplate(parseInt(savedTemplateId))
        .then(() => {
          toast({
            title: "Template Loaded",
            description: "Your saved template has been loaded.",
          });
        })
        .catch(() => {
          toast({
            title: "Template Load Failed",
            description: "Could not load the saved template.",
            variant: "destructive",
          });
        });
    }
    // Priority 2: Load from static template ID
    else if (templateId) {
      getTemplateData(templateId).then(templateData => {
        if (templateData) {
          const success = loadMapSnapshot(templateData);
          if (success) {
            toast({
              title: "Template Loaded",
              description: "Your template is ready for personalization.",
            });
          } else {
            toast({
              title: "Template Load Failed",
              description: "Could not load the selected template. Starting with defaults.",
              variant: "destructive",
            });
          }
        }
      });
    }
  }, [templateId, savedTemplateId, toast, loadTemplate]);

  const handleStepChange = (step: 1 | 2) => {
    setCurrentPage(step);

    // Scroll to show progress indicator with buffer after page change
    setTimeout(() => {
      const progressElement = progressIndicatorRef.current;
      if (progressElement) {
        const rect = progressElement.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top - 132;
        window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' });
      }
    }, 50);
  };

  const handleNext = () => {
    if (currentPage === 1) {
      handleStepChange(2);
    }
  };

  const handlePrevious = () => {
    if (currentPage === 2) {
      handleStepChange(1);
    }
  };

  const handleOpenAdvancedEditor = () => {
    // Reset to step 1 so user starts at the beginning of the full wizard
    setCurrentStep(1);
    // Navigate to the advanced editor WITHOUT template ID to preserve current state
    // Both editors share the same store, so all changes are preserved
    router.push('/mpg');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wand2 className="w-8 h-8 text-black" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal">
              Personalize Your Map
            </h1>
          </div>
          <p className="text-medium-gray">
            Add your personal touch in just a few steps
          </p>
        </div>

        {/* Progress Indicator */}
        <div ref={progressIndicatorRef} className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center group">
                <button
                  onClick={() => handleStepChange(1)}
                  className={`
                    relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 backdrop-blur-md border-2
                    ${currentPage >= 1
                      ? 'bg-gradient-to-br from-gray-900 to-black text-white border-black shadow-xl scale-110 animate-in zoom-in-50 duration-300'
                      : 'bg-white/70 border-gray-300 text-gray-500 shadow-md'
                    }
                    cursor-pointer hover:scale-105 hover:shadow-2xl transform-gpu
                  `}
                >
                  <span className="text-lg font-bold relative z-10">1</span>
                  {currentPage === 1 && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
                  )}
                </button>
                <span className={`mt-2 text-xs font-semibold text-center whitespace-nowrap transition-all duration-300 ${
                  currentPage >= 1 ? 'text-black scale-105' : 'text-gray-400'
                }`}>
                  Personalize
                </span>
              </div>

              <div className={`w-24 h-1 rounded-full transition-all duration-500 ease-out ${
                currentPage >= 2
                  ? 'bg-gradient-to-r from-gray-900 to-black shadow-md'
                  : 'bg-gray-200'
              }`} />

              <div className="flex flex-col items-center group">
                <button
                  onClick={() => handleStepChange(2)}
                  className={`
                    relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 backdrop-blur-md border-2
                    ${currentPage >= 2
                      ? 'bg-gradient-to-br from-gray-900 to-black text-white border-black shadow-xl scale-110 animate-in zoom-in-50 duration-300'
                      : 'bg-white/70 border-gray-300 text-gray-500 shadow-md'
                    }
                    cursor-pointer hover:scale-105 hover:shadow-2xl transform-gpu
                  `}
                >
                  <span className="text-lg font-bold relative z-10">2</span>
                  {currentPage === 2 && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
                  )}
                </button>
                <span className={`mt-2 text-xs font-semibold text-center whitespace-nowrap transition-all duration-300 ${
                  currentPage >= 2 ? 'text-black scale-105' : 'text-gray-400'
                }`}>
                  Download
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          {/* Left Panel - Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
              {currentPage === 1 ? (
                <MPGBasicPersonalize />
              ) : (
                <MPGKonvaExportOptions />
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>

                <div className="text-sm text-medium-gray">
                  Step {currentPage} of 2
                </div>

                {currentPage === 1 ? (
                  <Button
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading font-semibold text-charcoal">
                    Live Preview
                  </h3>
                  <span className="text-xs text-medium-gray bg-warm-cream px-3 py-1 rounded-full">
                    Updates as you type
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 flex justify-center items-center">
                  <MPGKonvaPreview containerRef={previewRef} showWatermark={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}