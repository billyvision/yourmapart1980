'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight, MapPin, Type, Palette, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Switch to Konva preview
import { MPGKonvaPreview } from './MPG-konva-preview';
import { MPGKonvaMobilePreview } from './MPG-konva-mobile-preview';
import { MPGLocationForm } from './MPG-location-form';
import { MPGText } from './MPG-text';
import { MPGStyleAndSettings } from './MPG-style-and-settings';
import { MPGKonvaExportOptions } from './MPG-konva-export-options';
import MPGWizardStepper from './MPG-wizard-stepper';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { getTemplateData } from '@/lib/mpg/MPG-templates';
import { loadMapSnapshot } from '@/lib/mpg/MPG-json-export';
import { useToast } from '@/hooks/use-toast';

interface MPGBuilderProps {
  templateId?: string | null;
}

export function MPGBuilder({ templateId }: MPGBuilderProps) {
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const stepIndicatorRef = useRef<HTMLDivElement>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const isMobile = useIsMobile();
  
  // Wizard state
  const currentStep = useMPGStore(state => state.currentStep);
  const setCurrentStep = useMPGStore(state => state.setCurrentStep);
  const nextStep = useMPGStore(state => state.nextStep);
  const previousStep = useMPGStore(state => state.previousStep);
  const canProceed = useMPGStore(state => state.canProceed);
  const fetchProducts = useMPGStore(state => state.fetchProducts);
  
  // Load template if provided
  useEffect(() => {
    if (templateId) {
      getTemplateData(templateId).then(templateData => {
        if (templateData) {
          const success = loadMapSnapshot(templateData);
          if (success) {
            toast({
              title: "Template Loaded",
              description: "Your selected template has been applied successfully.",
            });
          } else {
            toast({
              title: "Template Load Failed",
              description: "Could not load the selected template. Starting with defaults.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Template Load Failed",
            description: "Could not load the selected template. Starting with defaults.",
            variant: "destructive",
          });
        }
      });
    }
  }, [templateId, toast]);

  // Preload products in background when wizard loads
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Step definitions
  const steps = [
    {
      id: 1,
      title: 'Location',
      icon: MapPin,
      component: MPGLocationForm
    },
    {
      id: 2,
      title: 'Text',
      icon: Type,
      component: MPGText
    },
    {
      id: 3,
      title: 'Style & Settings',
      icon: Palette,
      component: MPGStyleAndSettings
    },
    {
      id: 4,
      title: 'Export & Download',
      icon: Download,
      component: MPGKonvaExportOptions
    }
  ];
  
  const handleStepChange = (step: 1 | 2 | 3 | 4) => {
    setCurrentStep(step);
    
    // Scroll to show step indicator with buffer
    setTimeout(() => {
      const stepElement = stepIndicatorRef.current;
      if (stepElement) {
        const rect = stepElement.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top - 132;
        window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' });
      }
    }, 50);
  };
  
  const handleNext = () => {
    if (currentStep < 4 && canProceed()) {
      nextStep();
      
      // Scroll to show step indicator with buffer after step change
      setTimeout(() => {
        const stepElement = stepIndicatorRef.current;
        if (stepElement) {
          const rect = stepElement.getBoundingClientRect();
          const offsetTop = window.pageYOffset + rect.top - 132;
          window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' });
        }
      }, 50);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      previousStep();
      
      // Scroll to show step indicator with buffer after step change
      setTimeout(() => {
        const stepElement = stepIndicatorRef.current;
        if (stepElement) {
          const rect = stepElement.getBoundingClientRect();
          const offsetTop = window.pageYOffset + rect.top - 132;
          window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' });
        }
      }, 50);
    }
  };
  
  const CurrentComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            Design Your Map
          </h1>
          <p className="text-lg text-medium-gray max-w-2xl mx-auto">
            Follow these simple steps to create your personalized map wall art
          </p>
        </div>
        
        {/* Wizard Stepper */}
        <div ref={stepIndicatorRef}>
          <MPGWizardStepper currentStep={currentStep} onStepChange={handleStepChange} />
        </div>

        {/* Two-Panel Layout */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-8">
          {/* Left Panel - Step Content */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
              <CurrentComponent />
            </div>
            
            {/* Step Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center gap-2 text-sm text-medium-gray">
                <span>Step {currentStep} of 4</span>
              </div>

              <Button
                onClick={handleNext}
                disabled={currentStep === 4 || !canProceed()}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white shadow-md hover:shadow-lg transition-all"
              >
                <span>{currentStep === 4 ? 'Complete' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Panel - Preview (Desktop) */}
          <div className="order-1 lg:order-2 hidden lg:block">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading font-semibold text-charcoal">
                    Live Preview
                  </h3>
                  <span className="text-xs text-medium-gray bg-warm-cream px-3 py-1 rounded-md">
                    Updates in real-time
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 flex justify-center items-center">
                  <MPGKonvaPreview containerRef={previewRef} showWatermark={true} />
                </div>
                
                <p className="text-xs text-light-gray text-center mt-4">
                  <span className="block">High-resolution export</span>
                  <span className="block">No watermarks</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview Toggle Button */}
        {isMobile && (
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <Button
              onClick={() => setShowMobilePreview(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
            >
              <Eye className="w-6 h-6" />
            </Button>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-900 rounded-full animate-pulse" />
          </div>
        )}

        {/* Mobile Preview Modal */}
        {showMobilePreview && isMobile && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 animate-fade-in">
            {/* Backdrop */}
            <div 
              className="absolute inset-0"
              onClick={() => setShowMobilePreview(false)}
            />
            
            {/* Modal Content */}
            <div 
              className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out animate-slide-up"
              style={{
                height: '90vh',
                maxHeight: '90vh'
              }}
            >
              {/* Visual Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 rounded-full bg-gray-300" />
              </div>
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold text-gray-900">Map Preview</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    Live View
                  </span>
                </div>
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 p-6 overflow-y-auto overscroll-contain">
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <MPGKonvaPreview showWatermark={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Picture-in-Picture Preview */}
        {isMobile && !showMobilePreview && (
          <MPGKonvaMobilePreview onExpand={() => setShowMobilePreview(true)} />
        )}
      </div>
    </div>
  );
}