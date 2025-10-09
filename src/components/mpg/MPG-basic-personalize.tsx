'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Search, MapPin, Type, MessageSquare, X, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { useDebounce } from '@/hooks/useDebounce';
import { MPGAccordionSection } from './ui/MPG-accordion-section';
import { MPGAccordionManager } from './ui/MPG-accordion-manager';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { MPG_HEADLINE_FONTS } from '@/lib/mpg/MPG-constants';

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    neighbourhood?: string;
    state?: string;
    country?: string;
  };
}

export function MPGBasicPersonalize() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const router = useRouter();
  
  const {
    city,
    headlineText,
    customText,
    customTextFont,
    customTextSize,
    customTextFontWeight,
    setCity,
    setHeadlineText,
    setCustomText,
    setCustomTextFont,
    setCustomTextSize,
    setCustomTextFontWeight,
    setCurrentStep,
  } = useMPGStore();

  // Available fonts for custom message - same as full editor
  const customFonts = MPG_HEADLINE_FONTS.map(font => ({
    id: font.family,
    name: font.name
  }));

  // Initialize search with current city
  useEffect(() => {
    if (city && !searchQuery) {
      setSearchQuery(city);
    }
  }, [city]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch location suggestions
  useEffect(() => {
    if (debouncedSearchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedSearchQuery
          )}&limit=5&addressdetails=1`
        );
        const data: SearchResult[] = await response.json();
        
        if (data && data.length > 0) {
          setSuggestions(data);
          // Only show suggestions if user has interacted with the input
          if (hasUserInteracted) {
            setShowSuggestions(true);
          }
          setSelectedIndex(-1);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchQuery, hasUserInteracted]);

  const handleLocationSelect = (result: SearchResult) => {
    const parts = result.display_name.split(',');
    
    // Determine if it's a specific address or a general location
    const isSpecificAddress = !!(result.address?.house_number && result.address?.road);
    
    // For addresses, use a more descriptive name (matching main editor logic)
    let locationName = '';
    if (isSpecificAddress && result.address) {
      // It's a specific address - format professionally
      const streetPart = `${result.address.house_number} ${result.address.road}`;
      const cityPart = result.address?.city || result.address?.town || result.address?.village || '';
      
      // Keep it concise for display
      if (streetPart.length > 30) {
        // Truncate long street names
        locationName = streetPart.substring(0, 27) + '...';
      } else {
        locationName = streetPart;
      }
      
      if (cityPart) {
        locationName = `${locationName}, ${cityPart}`;
      }
    } else {
      // It's a city/place
      locationName = result.address?.city || 
                     result.address?.town || 
                     result.address?.village || 
                     result.address?.suburb ||
                     result.address?.neighbourhood ||
                     parts[0].trim();
    }
    
    const country = result.address?.country || parts[parts.length - 1].trim();
    
    setCity(
      locationName,
      parseFloat(result.lat),
      parseFloat(result.lon),
      country
    );
    
    setSearchQuery(locationName);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleLocationSelect(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleOpenAdvancedEditor = () => {
    // Reset to step 1 so user always starts at the beginning of the full wizard
    setCurrentStep(1);
    router.push('/mpg');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-heading font-semibold text-charcoal mb-2">
          Personalize Your Map
        </h2>
        <p className="text-medium-gray">
          Add your location and personal text to make it uniquely yours
        </p>
      </div>

      <MPGAccordionManager defaultOpen={['location']}>
        {/* Location Search Section */}
        <MPGAccordionSection
          id="location"
          letter="A"
          title="Location"
          description="Find any city or address worldwide"
          icon={MapPin}
          colorTheme="pink"
        >
          <div className="space-y-2">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setHasUserInteracted(true);
            }}
            onFocus={() => setHasUserInteracted(true)}
            onKeyDown={handleKeyDown}
            placeholder="Enter city or address"
            className="pl-10 pr-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {suggestions.map((result, index) => (
              <button
                key={result.place_id}
                onClick={() => handleLocationSelect(result)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {result.address?.city || result.address?.town || result.address?.village || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.display_name}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
          </div>
        </MPGAccordionSection>

        {/* Headline Text Section */}
        <MPGAccordionSection
          id="headline"
          letter="B"
          title="Headline"
          description="Add a meaningful title above your map"
          icon={Type}
          colorTheme="yellow"
        >
          <div className="space-y-2">
        <Input
          value={headlineText || ''}
          onChange={(e) => setHeadlineText(e.target.value)}
          placeholder="e.g., Our First Home, Where It All Began"
          className="w-full"
        />
        <p className="text-xs text-gray-500">
          Add a meaningful title above your map
        </p>
          </div>
        </MPGAccordionSection>

        {/* Personal Message Section */}
        <MPGAccordionSection
          id="personal-message"
          letter="C"
          title="Personal Message"
          description="Add a special date, quote, or message"
          icon={MessageSquare}
          colorTheme="purple"
        >
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-charcoal mb-2 block">
                Custom Text (Optional)
              </Label>
              <Textarea
                value={customText || ''}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g., Where our story began..."
                className="w-full min-h-[80px] resize-none"
                maxLength={100}
              />
              <p className="text-xs text-medium-gray mt-1">
                {customText?.length || 0}/100 characters
              </p>
            </div>

            {/* Emoji Picker */}
            <div>
              <Label className="text-xs font-medium text-medium-gray mb-2 block">
                Quick Emojis
              </Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { emoji: '❤️', label: 'Heart' },
                  { emoji: '🏠', label: 'House' },
                  { emoji: '⭐', label: 'Star' },
                  { emoji: '📍', label: 'Pin' },
                  { emoji: '✈️', label: 'Plane' },
                  { emoji: '🌍', label: 'Globe' }
                ].map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      const newText = (customText || '') + emoji;
                      if (newText.length <= 100) {
                        setCustomText(newText);
                      }
                    }}
                    className="px-3 py-2 text-xl bg-gray-50 hover:bg-sage-green/10 border border-gray-200 rounded-lg transition-colors"
                    title={`Add ${label}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {customText && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <Label className="text-xs font-medium text-medium-gray mb-2 block">
                  Message Settings
                </Label>
                <div className="flex items-center gap-3">
                  {/* Bold Toggle */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor="custom-bold-weight" className="text-xs text-medium-gray cursor-pointer">
                      Bold
                    </Label>
                    <Switch
                      id="custom-bold-weight"
                      checked={customTextFontWeight === '700'}
                      onCheckedChange={(checked) => setCustomTextFontWeight(checked ? '700' : '400')}
                      className="data-[state=checked]:bg-sage-green"
                    />
                  </div>

                  {/* Divider */}
                  <div className="w-px h-6 bg-gray-200" />

                  {/* Font Selector with Arrows */}
                  <div className="flex-1 flex items-center gap-1">
                    <button
                      onClick={() => {
                        const currentIndex = customFonts.findIndex(f => f.id === customTextFont);
                        const prevIndex = currentIndex > 0 ? currentIndex - 1 : customFonts.length - 1;
                        setCustomTextFont(customFonts[prevIndex].id);
                      }}
                      className="p-1.5 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 transition-colors"
                      title="Previous font"
                    >
                      <ChevronLeft className="w-4 h-4 text-charcoal" />
                    </button>

                    <select
                      value={customTextFont}
                      onChange={(e) => setCustomTextFont(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
                    >
                      {customFonts.map(font => (
                        <option key={font.id} value={font.id}>{font.name}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        const currentIndex = customFonts.findIndex(f => f.id === customTextFont);
                        const nextIndex = currentIndex < customFonts.length - 1 ? currentIndex + 1 : 0;
                        setCustomTextFont(customFonts[nextIndex].id);
                      }}
                      className="p-1.5 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 transition-colors"
                      title="Next font"
                    >
                      <ChevronRight className="w-4 h-4 text-charcoal" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-6 bg-gray-200" />

                  {/* Size Buttons */}
                  <div className="flex items-center gap-1">
                    {(['S', 'M', 'L'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setCustomTextSize(size)}
                        className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                          customTextSize === size
                            ? 'bg-gray-200 text-charcoal font-bold italic border-2 border-charcoal'
                            : 'bg-gray-50 hover:bg-gray-100 text-charcoal font-medium border border-gray-200'
                        }`}
                        title={`${size === 'S' ? 'Small' : size === 'M' ? 'Medium' : 'Large'} size`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </MPGAccordionSection>
      </MPGAccordionManager>

      {/* Advanced Editor Button */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={handleOpenAdvancedEditor}
          variant="outline"
          className="group flex items-center gap-2 px-6 py-2 border-2 border-sage-green text-sage-green hover:bg-sage-green/10 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          <span>Need more customization? Open Map Studio</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

    </div>
  );
}