'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadTemplates, type MapTemplate } from '@/lib/mpg/MPG-templates'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Globe } from 'lucide-react'

export default function MPGTemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<MapTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
      .then(setTemplates)
      .finally(() => setIsLoading(false))
  }, [])

  const handleTemplateClick = (templateId: string) => {
    router.push(`/mpg/personalize?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4">
              <Globe className="w-3 h-3 mr-1" />
              Map Templates
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Start with a Professional Design
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our collection of beautifully crafted map templates.
              Each design is fully customizable - just pick a template and make it your own.
            </p>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {templates.filter(t => !t.hidden).map((template) => (
              <div
                key={template.id}
                className="bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Template Preview */}
                <div
                  className="aspect-[3/4] relative overflow-hidden cursor-pointer"
                  onClick={() => handleTemplateClick(template.id)}
                  style={{
                    background: template.style === 'chalkboard'
                      ? '#2C3E50'
                      : 'linear-gradient(to bottom right, hsl(var(--muted)), hsl(var(--muted-foreground) / 0.1))'
                  }}
                >
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 ${template.thumbnail ? 'hidden' : ''}`}>
                    <MapPin
                      className={`w-24 h-24 mb-4 ${
                        template.style === 'chalkboard'
                          ? 'text-white/30'
                          : 'text-primary/20'
                      }`}
                    />
                    <div className={`text-2xl font-bold mb-2 ${
                      template.style === 'chalkboard'
                        ? 'text-white'
                        : 'text-foreground'
                    }`}>
                      {template.city}
                    </div>
                    <div className={`text-sm mb-3 ${
                      template.style === 'chalkboard'
                        ? 'text-white/70'
                        : 'text-muted-foreground'
                    }`}>
                      {template.style.charAt(0).toUpperCase() + template.style.slice(1)} Style
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full ${
                      template.style === 'chalkboard'
                        ? 'bg-white/10 text-white/50'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      Preview Coming Soon
                    </div>
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateClick(template.id);
                      }}
                      className="bg-background text-primary hover:bg-background/90 text-sm pointer-events-auto"
                    >
                      Personalize This
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">Loading templates...</div>
            </div>
          ) : templates.filter(t => !t.hidden).length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <div className="text-muted-foreground text-lg">
                No templates available yet. Check back soon!
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
