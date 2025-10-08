'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Palette,
  Download,
  Check,
  Sparkles,
  Globe,
  Heart,
  Circle,
  Layers,
  Type,
  Zap
} from 'lucide-react';

export default function HowItWorksPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const steps = [
    {
      number: "1",
      title: "CREATE DESIGN",
      description: "Add your location and personalize with text",
      icon: MapPin,
      details: [
        "Enter any city, address, or location worldwide",
        "Add custom title text (e.g., 'Where We Met', 'Our First Home')",
        "Include coordinates, country, or custom messages",
        "Choose from 11+ stunning template designs",
        "See real-time preview as you customize"
      ]
    },
    {
      number: "2",
      title: "CHOOSE STYLE",
      description: "Customize colors, frames, and map details",
      icon: Palette,
      details: [
        "Select from 35+ artistic color themes and styles",
        "Choose frame shapes: Circle, Heart, Square, or House",
        "Add magical glow effects in 16 different colors",
        "Toggle map features: buildings, roads, water, parks, labels",
        "Adjust zoom level and map position perfectly",
        "Pick fonts and text styles for your labels"
      ]
    },
    {
      number: "3",
      title: "DOWNLOAD",
      description: "Get high-quality files instantly",
      icon: Download,
      details: [
        "Download high-resolution PNG files instantly",
        "Multiple size options for printing or digital use",
        "Print-ready quality at 300 DPI",
        "Perfect for framing (8x10, 11x14, 16x20, 24x36)",
        "Order professional prints directly (coming soon)"
      ]
    }
  ];

  const features = [
    {
      icon: Globe,
      title: "Any Location Worldwide",
      description: "Map any place on Earth - from major cities to small neighborhoods, we&apos;ve got you covered."
    },
    {
      icon: Palette,
      title: "35+ Artistic Styles",
      description: "Choose from minimalist, vintage, bold, monochrome, and many more beautiful map styles."
    },
    {
      icon: Sparkles,
      title: "Magical Glow Effects",
      description: "Add enchanting glow effects in 16 colors to make your map art truly stand out."
    },
    {
      icon: Type,
      title: "Custom Text & Fonts",
      description: "Personalize with custom titles, coordinates, dates, or any meaningful text in various fonts."
    },
    {
      icon: Layers,
      title: "Full Customization",
      description: "Control every detail - from map features to colors, frames, and finishing touches."
    },
    {
      icon: Zap,
      title: "Instant Preview",
      description: "See your design in real-time as you make changes. What you see is what you get."
    }
  ];

  const useCases = [
    {
      title: "Anniversary Gifts",
      description: "Commemorate where you met, got engaged, or married with a beautiful map."
    },
    {
      title: "New Home Celebrations",
      description: "Mark your first home, dream house, or special neighborhood with custom map art."
    },
    {
      title: "Travel Memories",
      description: "Preserve favorite vacation spots, bucket list destinations, or meaningful journeys."
    },
    {
      title: "Graduation & Milestones",
      description: "Celebrate college towns, hometown pride, or life-changing locations."
    },
    {
      title: "Family Heritage",
      description: "Honor where you grew up, family roots, or multigenerational stories."
    },
    {
      title: "Business & Office",
      description: "Showcase your business location or create meaningful corporate gifts."
    }
  ];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setActiveStep(prev => (prev + 1) % steps.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isPaused, steps.length]);

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 text-base px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Simple Process, Beautiful Results
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal mb-6 font-playfair">
              How It Works
            </h1>
            <p className="text-xl md:text-2xl text-medium-gray mb-8 leading-relaxed">
              Create stunning personalized map art in just three simple steps.
              No design skills needed - our intuitive tool guides you every step of the way.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/mpg-templates')}
              className="text-lg px-8 py-6"
            >
              Start Creating Now
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-gray-200/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-tl from-gray-200/40 to-transparent rounded-full blur-3xl"></div>
      </section>

      {/* Three Steps Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4 font-playfair">
              Three Simple Steps
            </h2>
            <p className="text-xl text-medium-gray">
              From concept to creation in minutes
            </p>
          </div>

          {/* Visual Steps */}
          <div className="relative mb-16">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-16">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
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
                    <div className="relative w-56 h-56 flex items-center">
                      {/* White circle */}
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
                        <div className={`bg-white rounded-full w-40 h-40 md:w-44 md:h-44 lg:w-52 lg:h-52 flex flex-col items-center justify-center shadow-xl transition-all duration-700 border-2 ${
                          activeStep === index
                            ? 'shadow-2xl transform scale-105 border-black'
                            : 'shadow-lg border-gray-200'
                        }`}>
                          <StepIcon className={`w-8 h-8 mb-3 transition-colors duration-700 ${
                            activeStep === index ? 'text-black' : 'text-gray-400'
                          }`} />
                          <h3 className={`text-sm md:text-base lg:text-lg font-bold tracking-wider transition-colors duration-700 ${
                            activeStep === index
                              ? 'text-black'
                              : 'text-gray-500'
                          }`}>
                            {step.title}
                          </h3>
                          <p className={`text-xs md:text-sm text-center px-6 leading-tight transition-colors duration-700 mt-1 ${
                            activeStep === index
                              ? 'text-gray-700'
                              : 'text-gray-400'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Number */}
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
                );
              })}
            </div>

            {/* Progress dots */}
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

          {/* Detailed Step Information */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4">
                      <StepIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Step {step.number}</div>
                      <h3 className="text-xl font-bold text-charcoal">{step.title}</h3>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-medium-gray">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4 font-playfair">
              Powerful Features
            </h2>
            <p className="text-xl text-medium-gray max-w-2xl mx-auto">
              Everything you need to create stunning personalized map art
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                    <FeatureIcon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">{feature.title}</h3>
                  <p className="text-medium-gray leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customization Options Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6 font-playfair">
                Endless Customization
              </h2>
              <p className="text-xl text-medium-gray mb-8 leading-relaxed">
                Make it uniquely yours with our comprehensive customization options.
                Every element is adjustable to match your vision perfectly.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Circle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-charcoal mb-2">Frame Styles</h3>
                    <p className="text-medium-gray">Choose from Circle, Heart, Square, or House frames to match your aesthetic.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-charcoal mb-2">Glow Effects</h3>
                    <p className="text-medium-gray">Add magical glow effects in 16 stunning colors for that extra special touch.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-charcoal mb-2">Color Themes</h3>
                    <p className="text-medium-gray">Select from 35+ artistic color themes - from minimalist to bold and vibrant.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Type className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-charcoal mb-2">Text Customization</h3>
                    <p className="text-medium-gray">Add custom titles, coordinates, dates, or any meaningful text in various fonts.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-100/50 p-6 rounded-3xl">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <source src="/videos/walls-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-gray-300/50 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tl from-gray-300/50 to-transparent rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4 font-playfair">
              Perfect For Every Occasion
            </h2>
            <p className="text-xl text-medium-gray max-w-2xl mx-auto">
              Create meaningful map art for life&apos;s special moments and memorable places
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal">{useCase.title}</h3>
                </div>
                <p className="text-medium-gray">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-playfair">
            Ready to Create Your Map Art?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Start creating beautiful personalized map art in minutes.
            Join thousands of happy customers who&apos;ve transformed their special places into stunning wall art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/mpg-templates')}
              className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-100"
            >
              Browse Templates
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/mpg')}
              className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white hover:text-black"
            >
              Open Map Studio
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
