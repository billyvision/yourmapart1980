'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapTemplate, loadTemplates } from '@/lib/mpg/MPG-templates'
import { Button } from '@/components/ui/button'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'

export default function FeaturedTemplates() {
  const router = useRouter()
  const [featuredTemplates, setFeaturedTemplates] = useState<MapTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Load templates and select 4 random ones
  useEffect(() => {
    loadTemplates()
      .then(allTemplates => {
        // Filter non-hidden templates and select 4 random ones
        const visibleTemplates = allTemplates.filter(t => !t.hidden)
        const shuffled = [...visibleTemplates].sort(() => 0.5 - Math.random())
        const selected = shuffled.slice(0, 4)

        setFeaturedTemplates(selected)
        setIsLoading(false)
      })
  }, [])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return

    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentIndex < featuredTemplates.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }

    // Reset
    setTouchStartX(0)
    setTouchEndX(0)
  }

  const handleNext = () => {
    if (currentIndex < featuredTemplates.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleTemplateClick = (templateId: string) => {
    router.push(`/mpg/personalize?template=${templateId}`)
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-muted-foreground">Loading templates...</div>
          </div>
        </div>
      </section>
    )
  }

  if (featuredTemplates.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4 font-playfair">
            Featured Designs
          </h2>
          <p className="text-xl text-medium-gray max-w-2xl mx-auto">
            Discover our beautifully crafted map templates. Choose one and make it your own.
          </p>
        </div>

        {/* Desktop Grid - 4 columns */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleTemplateClick(template.id)}
            >
              {/* Template Preview */}
              <div
                className="aspect-[3/4] relative overflow-hidden"
                style={{
                  background: template.style === 'chalkboard'
                    ? '#2C3E50'
                    : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)'
                }}
              >
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement
                      if (fallback) fallback.classList.remove('hidden')
                    }}
                  />
                ) : null}

                {/* Fallback content if no thumbnail */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 ${template.thumbnail ? 'hidden' : ''}`}>
                  <MapPin
                    className={`w-16 h-16 mb-3 ${
                      template.style === 'chalkboard'
                        ? 'text-white/30'
                        : 'text-gray-400'
                    }`}
                  />
                  <div className={`text-xl font-bold mb-1 font-playfair ${
                    template.style === 'chalkboard'
                      ? 'text-white'
                      : 'text-charcoal'
                  }`}>
                    {template.city}
                  </div>
                  <div className={`text-sm ${
                    template.style === 'chalkboard'
                      ? 'text-white/70'
                      : 'text-medium-gray'
                  }`}>
                    {template.style.charAt(0).toUpperCase() + template.style.slice(1)} Style
                  </div>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                  <h3 className="text-white font-bold text-lg mb-2 font-playfair text-center">
                    {template.name}
                  </h3>
                  {template.description && (
                    <p className="text-white/90 text-sm text-center mb-3 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                  <Button
                    className="bg-white text-black hover:bg-gray-100 text-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTemplateClick(template.id)
                    }}
                  >
                    Customize This
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden mb-8 relative">
          <div
            ref={scrollContainerRef}
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                    onClick={() => handleTemplateClick(template.id)}
                  >
                    {/* Template Preview */}
                    <div
                      className="aspect-[3/4] relative overflow-hidden"
                      style={{
                        background: template.style === 'chalkboard'
                          ? '#2C3E50'
                          : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)'
                      }}
                    >
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement
                            if (fallback) fallback.classList.remove('hidden')
                          }}
                        />
                      ) : null}

                      {/* Fallback content */}
                      <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 ${template.thumbnail ? 'hidden' : ''}`}>
                        <MapPin
                          className={`w-20 h-20 mb-4 ${
                            template.style === 'chalkboard'
                              ? 'text-white/30'
                              : 'text-gray-400'
                          }`}
                        />
                        <div className={`text-2xl font-bold mb-2 font-playfair ${
                          template.style === 'chalkboard'
                            ? 'text-white'
                            : 'text-charcoal'
                        }`}>
                          {template.city}
                        </div>
                        <div className={`text-sm ${
                          template.style === 'chalkboard'
                            ? 'text-white/70'
                            : 'text-medium-gray'
                        }`}>
                          {template.style.charAt(0).toUpperCase() + template.style.slice(1)} Style
                        </div>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-bold text-charcoal mb-1 font-playfair">
                        {template.name}
                      </h3>
                      {template.description && (
                        <p className="text-sm text-medium-gray mb-3 line-clamp-2">
                          {template.description}
                        </p>
                      )}
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTemplateClick(template.id)
                        }}
                      >
                        Customize This
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows for Mobile */}
          {featuredTemplates.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2 shadow-md disabled:opacity-30 disabled:cursor-not-allowed z-10"
                aria-label="Previous template"
              >
                <ChevronLeft className="w-5 h-5 text-black" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === featuredTemplates.length - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2 shadow-md disabled:opacity-30 disabled:cursor-not-allowed z-10"
                aria-label="Next template"
              >
                <ChevronRight className="w-5 h-5 text-black" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {featuredTemplates.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-200 ${
                  index === currentIndex
                    ? 'w-8 h-2 rounded-full bg-black'
                    : 'w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to template ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => router.push('/mpg-templates')}
            className="text-lg px-8 py-6 bg-black hover:bg-gray-800 text-white"
          >
            Explore All Templates
          </Button>
        </div>
      </div>
    </section>
  )
}
