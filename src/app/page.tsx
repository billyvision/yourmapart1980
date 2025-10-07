'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import HowItWorks from "@/components/how-it-works";
import FAQ from "@/components/faq";
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, Palette, Heart } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const wallsVideoRef = useRef<HTMLVideoElement>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const testimonials = [
    {
      name: "Sarah Mitchell",
      title: "Perfect Anniversary Gift",
      review: "Created a beautiful map poster of where we got engaged. The quality is outstanding and it's now the centerpiece of our living room. Everyone asks about it!",
      imageBase: "/testimonials/testimonial4.jpg"
    },
    {
      name: "Marcus Johnson",
      title: "Cherished Memories",
      review: "Used this to commemorate our family's journey - from where we were born to where we live now. The map detail is incredible and the customization options made it truly personal.",
      imageBase: "/testimonials/testimonial2.png"
    },
    {
      name: "Maria Thompson",
      title: "Amazing Quality",
      review: "Ordered a map of our first home together. The print quality exceeded my expectations and arrived beautifully packaged. The design is so elegant and meaningful.",
      imageBase: "/testimonials/testimonial3.png"
    },
    {
      name: "David Chen",
      title: "Easy to Use",
      review: "I'm not tech-savvy but this tool made it incredibly easy to create something special. The map preview feature is fantastic - I could see exactly how it would look before ordering.",
      imageBase: "/testimonials/testimonial5.jpeg"
    },
    {
      name: "Lisa Parker",
      title: "Unique Wall Art",
      review: "Love how I could customize every aspect - from the map style to the colors and text. The minimalist black and white design looks stunning in our modern home. Fast shipping too!",
      imageBase: "/testimonials/testimonial1.png"
    }
  ];

  useEffect(() => {
    if (wallsVideoRef.current) {
      wallsVideoRef.current.playbackRate = 0.5;
    }
  }, []);

  // Testimonials auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Testimonial navigation functions
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Touch handlers for testimonials
  const handleTestimonialTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTestimonialTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTestimonialTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextTestimonial();
    }
    if (isRightSwipe) {
      prevTestimonial();
    }
  };

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left Content */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-center flex flex-col justify-center">
              <h1 className="text-4xl tracking-tight font-bold text-charcoal sm:text-5xl md:text-6xl font-playfair">
                Create Beautiful
              </h1>
              <h2 className="text-4xl tracking-tight font-bold sm:text-5xl md:text-6xl mt-2 font-playfair">
                <span className="text-black">Map Art</span>
              </h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl mt-2 text-charcoal/80 font-playfair-italic">
                that tells your story
              </h3>
              <p className="mt-4 text-base text-medium-gray sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Transform your most meaningful locations into stunning personalized posters. Perfect for anniversaries, new homes, or celebrating where your journey began.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 sm:max-w-lg sm:mx-auto flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => router.push('/mpg-templates')}
                  className="text-lg"
                >
                  Create Your Design
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/how-it-works')}
                  className="text-lg"
                >
                  See How It Works
                </Button>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex items-center gap-6 justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">10,000+</div>
                  <div className="text-sm text-medium-gray">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">4.9/5</div>
                  <div className="text-sm text-medium-gray">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">100%</div>
                  <div className="text-sm text-medium-gray">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Video */}
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full">
                <div className="bg-white/10 p-8 lg:p-12 rounded-3xl">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <video
                      className="w-full h-auto"
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      controlsList="nodownload nofullscreen noremoteplayback"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src="/videos/hero-video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex justify-center py-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Maps that Matter Section */}
      <section className="mt-12 py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content - Text */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-charcoal/80 font-playfair-italic mb-4 leading-tight">
                maps that matter
              </h2>
              <p className="text-lg text-medium-gray mb-4 leading-relaxed">
                Transform your most meaningful locations into stunning personalized map art. Whether it's where you met, your first home, favorite vacation spot, or any place that holds special memories - create unique wall décor that tells your geographical story.
              </p>
              <p className="text-lg text-medium-gray mb-6 leading-relaxed">
                Each piece is carefully crafted to showcase the places that matter most to you, creating a conversation starter that's both beautiful and deeply personal.
              </p>
              <Button
                size="lg"
                onClick={() => router.push('/mpg-templates')}
                className="text-lg px-8 py-3"
              >
                Start Creating Your Map Story
              </Button>
            </div>

            {/* Right content - Video */}
            <div className="order-1 lg:order-2">
              <div className="relative max-w-2xl mx-auto">
                <div className="bg-gray-100/50 p-6 rounded-3xl">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                    <video
                      ref={wallsVideoRef}
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

                {/* Floating accent elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gray-300/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gray-200/30 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {/* Instant Digital Download */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <Zap className="w-10 h-10 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-4 font-playfair">
                Instant Digital Download
              </h3>
              <p className="text-medium-gray leading-relaxed">
                Get your personalized map art immediately after creation. High-resolution files ready for printing or sharing, delivered straight to your device in seconds.
              </p>
            </div>

            {/* Completely Customizable */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <Palette className="w-10 h-10 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-4 font-playfair">
                Completely Customizable
              </h3>
              <p className="text-medium-gray leading-relaxed">
                Every element is in your control. From map styles and colors to frames and text, create exactly what you envision with our powerful customization tools.
              </p>
            </div>

            {/* Uniquely Personal */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <Heart className="w-10 h-10 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-4 font-playfair">
                Uniquely Personal
              </h3>
              <p className="text-medium-gray leading-relaxed">
                Transform meaningful locations into one-of-a-kind art pieces. Each creation tells your unique story, making perfect gifts that celebrate life&apos;s special moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Hero Section (Reversed Layout) */}
      <section className="relative overflow-hidden bg-hero-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left Video */}
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center lg:order-1">
              <div className="relative mx-auto w-full">
                <div className="bg-white/10 p-8 lg:p-12 rounded-3xl">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <video
                      className="w-full h-auto"
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      controlsList="nodownload nofullscreen noremoteplayback"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src="/videos/hero-video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-center flex flex-col justify-center lg:order-2">
              <h1 className="text-4xl tracking-tight font-bold text-charcoal sm:text-5xl md:text-6xl font-playfair">
                Create Beautiful
              </h1>
              <h2 className="text-4xl tracking-tight font-bold sm:text-5xl md:text-6xl mt-2 font-playfair">
                <span className="text-black">Map Art</span>
              </h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl mt-2 text-charcoal/80 font-playfair-italic">
                that tells your story
              </h3>
              <p className="mt-4 text-base text-medium-gray sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Transform your most meaningful locations into stunning personalized posters. Perfect for anniversaries, new homes, or celebrating where your journey began.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 sm:max-w-lg sm:mx-auto flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => router.push('/mpg-templates')}
                  className="text-lg"
                >
                  Create Your Design
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/how-it-works')}
                  className="text-lg"
                >
                  See How It Works
                </Button>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex items-center gap-6 justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">10,000+</div>
                  <div className="text-sm text-medium-gray">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">4.9/5</div>
                  <div className="text-sm text-medium-gray">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">100%</div>
                  <div className="text-sm text-medium-gray">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex justify-center py-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mt-12 py-16 bg-gradient-to-b from-transparent via-gray-50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2 font-playfair">What Our Customers Say</h2>
            <p className="text-lg text-medium-gray max-w-2xl mx-auto">Join thousands of happy customers who've created meaningful map art</p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Desktop View - 3 Cards */}
            <div className="hidden md:block">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[0, 1, 2].map((index) => {
                  const testimonialIndex = (currentTestimonial + index) % testimonials.length;
                  const testimonial = testimonials[testimonialIndex];
                  return (
                    <div key={testimonialIndex} className="bg-white rounded-2xl shadow-sm hover:shadow-xl p-6 transition-all duration-300 border border-gray-100">
                      {/* Name and Picture at Top */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-200 bg-gray-100 relative">
                          <img
                            src={testimonial.imageBase}
                            alt={`${testimonial.name} headshot`}
                            className="w-full h-full object-cover grayscale"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.fallback-initial') as HTMLElement;
                              if (fallback) {
                                fallback.style.display = 'flex';
                                fallback.style.opacity = '1';
                              }
                            }}
                          />
                          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold fallback-initial absolute inset-0 opacity-0">
                            {testimonial.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal font-playfair">{testimonial.name}</p>
                        </div>
                      </div>

                      {/* 5 Stars Below Name/Picture */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-6 h-4 bg-gradient-to-r from-gray-800 to-black rounded-sm flex items-center justify-center shadow-sm">
                            <span className="text-white text-xs font-bold">★</span>
                          </div>
                        ))}
                      </div>

                      {/* Title */}
                      <p className="text-sm text-medium-gray font-medium mb-4">{testimonial.title}</p>

                      {/* Testimonial Text */}
                      <p className="text-medium-gray leading-relaxed italic">"{testimonial.review}"</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile View - 1 Card with Swipe */}
            <div className="md:hidden">
              <div
                className="overflow-hidden"
                onTouchStart={handleTestimonialTouchStart}
                onTouchMove={handleTestimonialTouchMove}
                onTouchEnd={handleTestimonialTouchEnd}
              >
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        {/* Name and Picture at Top */}
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-200 bg-gray-100 relative">
                            <img
                              src={testimonial.imageBase}
                              alt={`${testimonial.name} headshot`}
                              className="w-full h-full object-cover grayscale"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.querySelector('.fallback-initial') as HTMLElement;
                                if (fallback) {
                                  fallback.style.display = 'flex';
                                  fallback.style.opacity = '1';
                                }
                              }}
                            />
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold fallback-initial absolute inset-0 opacity-0">
                              {testimonial.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-charcoal font-playfair">{testimonial.name}</p>
                          </div>
                        </div>

                        {/* 5 Stars Below Name/Picture */}
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-6 h-4 bg-gradient-to-r from-gray-800 to-black rounded-sm flex items-center justify-center shadow-sm">
                              <span className="text-white text-xs font-bold">★</span>
                            </div>
                          ))}
                        </div>

                        {/* Title */}
                        <p className="text-sm text-medium-gray font-medium mb-4">{testimonial.title}</p>

                        {/* Testimonial Text */}
                        <p className="text-medium-gray leading-relaxed italic">"{testimonial.review}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentTestimonial
                    ? 'bg-black w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
    </main>
  );
}
