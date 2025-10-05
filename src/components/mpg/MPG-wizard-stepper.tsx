'use client'
import React from 'react';
import { useMPGStore } from '@/lib/mpg/MPG-store';

interface Step {
  id: 1 | 2 | 3 | 4;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Location",
    description: "Choose your location"
  },
  {
    id: 2,
    title: "Text",
    description: "Customize text & fonts"
  },
  {
    id: 3,
    title: "Style & Settings", 
    description: "Customize style and design"
  },
  {
    id: 4,
    title: "Export & Download",
    description: "Download your map poster"
  }
];

interface MPGWizardStepperProps {
  currentStep: 1 | 2 | 3 | 4;
  onStepChange: (step: 1 | 2 | 3 | 4) => void;
}

const MPGWizardStepper: React.FC<MPGWizardStepperProps> = ({ currentStep, onStepChange }) => {
  const handleStepClick = (stepId: 1 | 2 | 3 | 4) => {
    // Allow direct navigation to any step
    onStepChange(stepId);
  };

  return (
    <div className="mb-12">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg overflow-hidden">
          <div className="relative max-w-4xl mx-auto">
            {/* Progress Line Background */}
            <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 rounded-full" />

            {/* Progress Line Fill - Animated with Gradient */}
            <div
              className="absolute top-8 left-8 h-1 bg-gradient-to-r from-gray-900 to-black rounded-full transition-all duration-500 ease-out shadow-md"
              style={{
                width: `calc((100% - 4rem) * ${(currentStep - 1) / (steps.length - 1)})`
              }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center group">
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={`
                    relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300
                    backdrop-blur-md border-2
                    ${currentStep === step.id
                      ? 'bg-gradient-to-br from-gray-900 to-black text-white border-black shadow-xl scale-110 animate-in zoom-in-50 duration-300'
                      : step.id < currentStep
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white border-gray-800 shadow-lg'
                        : 'bg-white/70 border-gray-300 text-gray-500 shadow-md'
                    }
                    cursor-pointer hover:scale-105 hover:shadow-2xl
                    transform-gpu
                  `}
                >
                  <span className="text-xl font-bold relative z-10">{step.id}</span>
                  {currentStep === step.id && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
                  )}
                </button>
                <span className={`
                  mt-3 text-sm font-semibold text-center whitespace-nowrap transition-all duration-300
                  ${currentStep === step.id
                    ? 'text-black scale-105'
                    : step.id < currentStep
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }
                `}>
                  {step.title}
                </span>
                <span className={`
                  mt-1 text-xs text-center whitespace-nowrap transition-all duration-300
                  ${currentStep === step.id
                    ? 'text-gray-600 opacity-100'
                    : 'text-gray-400 opacity-0 group-hover:opacity-100'
                  }
                `}>
                  {step.description}
                </span>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPGWizardStepper;