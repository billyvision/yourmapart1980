'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import HowItWorks from "@/components/how-it-works";
import FAQ from "@/components/faq";

export default function Home() {
  const router = useRouter();

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

      {/* FAQ Section */}
      <FAQ />
    </main>
  );
}
