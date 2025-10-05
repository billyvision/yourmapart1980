'use client'

import { useEffect, useState, useRef } from 'react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  const steps = [
    {
      number: "1",
      title: "CREATE DESIGN",
      description: "Add your title and meaningful words to personalize"
    },
    {
      number: "2",
      title: "CHOOSE STYLE",
      description: "Select from beautiful tile designs and colors"
    },
    {
      number: "3",
      title: "DOWNLOAD",
      description: "Get instant downloads or order prints"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || hasAnimated.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;

      if (isVisible) {
        hasAnimated.current = true;
        // Start the carousel animation
        const interval = setInterval(() => {
          if (!isPaused) {
            setActiveStep(prev => (prev + 1) % steps.length);
          }
        }, 4000);

        return () => clearInterval(interval);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPaused, steps.length]);

  useEffect(() => {
    if (hasAnimated.current && !isPaused) {
      const interval = setInterval(() => {
        setActiveStep(prev => (prev + 1) % steps.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPaused, steps.length]);

  return (
    <section ref={sectionRef} className="py-12 bg-how-it-works-gradient overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal font-playfair">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-medium-gray">
            Create your personalized crossword in three simple steps
          </p>
        </div>

        <div className="relative">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                onMouseEnter={() => {
                  setIsPaused(true);
                  setActiveStep(index);
                }}
                onMouseLeave={() => setIsPaused(false)}
                className={`relative transition-all duration-700 cursor-pointer ${
                  activeStep === index
                    ? 'transform scale-105'
                    : 'transform scale-100 opacity-60'
                }`}
              >
                {/* Container for number and circle */}
                <div className="relative w-56 h-56 flex items-center">
                  {/* White circle positioned first (behind) */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
                    <div className={`bg-white rounded-full w-40 h-40 md:w-44 md:h-44 lg:w-52 lg:h-52 flex flex-col items-center justify-center shadow-xl transition-all duration-700 ${
                      activeStep === index
                        ? 'shadow-2xl transform scale-105'
                        : 'shadow-lg'
                    }`}>
                      <h3 className={`text-sm md:text-base lg:text-lg font-bold tracking-wider transition-colors duration-700 mb-2 ${
                        activeStep === index
                          ? 'text-black'
                          : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs md:text-sm text-center px-6 leading-tight transition-colors duration-700 ${
                        activeStep === index
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Number positioned at 9 o'clock of circle */}
                  <div className="absolute -left-[13%] top-1/2 -translate-y-1/2 z-20">
                    <span
                      className={`text-[90px] md:text-[105px] lg:text-[120px] font-black leading-none select-none transition-all duration-700 ${
                        activeStep === index
                          ? 'text-black'
                          : 'text-gray-200'
                      }`}
                      style={{
                        textShadow: activeStep === index
                          ? '0 4px 12px rgba(0,0,0,0.15)'
                          : 'none'
                      }}
                    >
                      {step.number}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress indicator dots */}
          <div className="flex justify-center mt-8 gap-3">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveStep(index);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 5000);
                }}
                className={`transition-all duration-500 ${
                  activeStep === index
                    ? 'w-3 h-3 rounded-full bg-black ring-2 ring-black ring-offset-2'
                    : 'w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
