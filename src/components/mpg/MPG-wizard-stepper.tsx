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
        <div className="relative">
          {/* Progress Line Background */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200" />
          
          {/* Progress Line Fill - Animated */}
          <div 
            className="absolute top-8 left-0 h-0.5 bg-sage-green transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={`
                    relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200
                    ${currentStep === step.id 
                      ? 'bg-sage-green text-white shadow-lg scale-110' 
                      : step.id < currentStep
                        ? 'bg-sage-green text-white'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }
                    cursor-pointer hover:scale-105
                  `}
                >
                  <span className="text-xl font-bold">{step.id}</span>
                </button>
                <span className={`
                  mt-3 text-sm font-medium text-center whitespace-nowrap
                  ${currentStep === step.id 
                    ? 'text-sage-green' 
                    : step.id < currentStep
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }
                `}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPGWizardStepper;