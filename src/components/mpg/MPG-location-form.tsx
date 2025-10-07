'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Search, MapPin, ChevronRight, ChevronUp, ChevronDown, ChevronLeft, 
  RotateCcw, Plus, Minus, Globe, Navigation, Sparkles 
} from 'lucide-react';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { MPG_PRESET_CITIES, MPG_ZOOM_LEVELS } from '@/lib/mpg/MPG-constants';
import { Slider } from '@/components/ui/slider';
import { useDebounce } from '@/hooks/useDebounce';
import { MPGAccordionSection } from './ui/MPG-accordion-section';
import { MPGAccordionManager } from './ui/MPG-accordion-manager';

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export function MPGLocationForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    city,
    zoom,
    setCity,
    setZoom,
    adjustZoom,
    panMap,
    resetMapPosition
  } = useMPGStore();
  

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
          )}&limit=8&addressdetails=1`
        );
        const data: SearchResult[] = await response.json();
        
        if (data && data.length > 0) {
          setSuggestions(data);
          setShowSuggestions(true);
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
  }, [debouncedSearchQuery]);

  const handleSelectSuggestion = (result: SearchResult) => {
    const parts = result.display_name.split(',');
    
    // Determine if it's a specific address or a general location
    const isSpecificAddress = !!(result.address?.house_number && result.address?.road);
    
    // For addresses, use a more descriptive name
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
    
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const country = result.address?.country || parts[parts.length - 1].trim();
    
    // Auto-zoom to street level (15) for specific addresses, normal zoom for cities
    const zoomLevel = isSpecificAddress ? 15 : zoom;
    
    setCity(locationName, lat, lng, country);
    if (zoomLevel !== zoom) {
      setZoom(zoomLevel);
    }
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const formatSuggestionDisplay = (result: SearchResult) => {
    const parts = result.display_name.split(',');
    
    // Check if it's a specific address
    if (result.address?.house_number && result.address?.road) {
      const addressParts = [];
      addressParts.push(`${result.address.house_number} ${result.address.road}`);
      
      if (result.address?.city || result.address?.town || result.address?.village) {
        addressParts.push(result.address?.city || result.address?.town || result.address?.village);
      }
      
      if (result.address?.state) {
        addressParts.push(result.address.state);
      }
      
      if (result.address?.country) {
        addressParts.push(result.address.country);
      }
      
      return addressParts.join(', ');
    }
    
    // It's a place/city
    const mainName = result.address?.city || 
                     result.address?.town || 
                     result.address?.village || 
                     result.address?.suburb ||
                     result.address?.neighbourhood ||
                     parts[0].trim();
    
    const state = result.address?.state;
    const country = result.address?.country || parts[parts.length - 1].trim();
    
    let display = mainName;
    if (state && country?.toLowerCase() === 'united states') {
      display += `, ${state}`;
    }
    if (country && country !== mainName) {
      display += `, ${country}`;
    }
    
    return display;
  };

  const loadPresetCity = (preset: typeof MPG_PRESET_CITIES[0]) => {
    setCity(preset.name, preset.lat, preset.lng, preset.country);
  };

  return (
    <div className="space-y-2">
      {/* Step Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage-green-dark text-white">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-charcoal">
            Location
          </h3>
          <p className="text-medium-gray text-sm mt-1">
            Choose your location on the map
          </p>
        </div>
      </div>

      <MPGAccordionManager>
        {/* Search Location Section */}
        <MPGAccordionSection
          id="search-location"
          letter="A"
          title="Search Location"
          description="Find any city or address worldwide"
          icon={Search}
          colorTheme="pink"
        >
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-charcoal mb-2 block">
              Enter Location or Full Address
            </Label>
            <div className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search city or full address (e.g., 123 Main St, New York)..."
                    autoComplete="off"
                    className="w-full bg-white border-2 border-sage-green/20 text-charcoal placeholder-medium-gray h-11 text-base rounded-xl focus:border-sage-green transition-colors pr-10"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sage-green" />
                    </div>
                  )}
                </div>
              </div>
              
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 w-full mt-2 bg-white border-2 border-sage-green/20 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="max-h-80 overflow-y-auto">
                    {suggestions.map((result, index) => (
                      <button
                        key={result.place_id}
                        onClick={() => handleSelectSuggestion(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full px-4 py-3 text-left hover:bg-sage-green/10 transition-colors border-b border-gray-100 last:border-b-0 ${
                          selectedIndex === index ? 'bg-sage-green/10' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-charcoal">
                              {formatSuggestionDisplay(result).split(',')[0]}
                            </div>
                            <div className="text-sm text-medium-gray">
                              {formatSuggestionDisplay(result).split(',').slice(1).join(',')}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-medium-gray" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Current City Display */}
          {city && (
            <div className="bg-warm-cream/30 rounded-lg p-3 animate-in slide-in-from-top-2 duration-300">
              <p className="text-xs text-medium-gray">Current Location:</p>
              <p className="text-base font-semibold text-charcoal">{city}</p>
            </div>
          )}
        </div>
        </MPGAccordionSection>

        {/* Map Controls Section - Show only when city is selected */}
        {city && (
          <MPGAccordionSection
            id="map-controls"
            letter="B"
            title="Map Controls"
            description="Fine-tune position and zoom"
            icon={Navigation}
            colorTheme="yellow"
          >
          <div className="space-y-4">
            {/* Zoom Level Slider */}
            <div>
              <Label className="text-sm font-medium text-charcoal mb-2 block">
                Zoom Level: {zoom}
              </Label>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={MPG_ZOOM_LEVELS.min}
                max={MPG_ZOOM_LEVELS.max}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-medium-gray mt-2">
                <span>City</span>
                <span>District</span>
                <span>Neighborhood</span>
                <span>Street</span>
              </div>
            </div>

            {/* Map Controls - Consolidated */}
            <div>
              <Label className="text-sm font-medium text-charcoal mb-2 block">
                Map Controls
              </Label>
              <div className="flex gap-2 items-center justify-center">
                {/* Pan Controls */}
                <div className="grid grid-cols-3 gap-1">
                  <div />
                  <button
                    onClick={() => panMap(0, -10)}
                    className="w-8 h-8 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 flex items-center justify-center transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="w-5 h-5 text-charcoal stroke-[2.5]" />
                  </button>
                  <div />
                  
                  <button
                    onClick={() => panMap(-10, 0)}
                    className="w-8 h-8 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 flex items-center justify-center transition-colors"
                    title="Move Left"
                  >
                    <ChevronLeft className="w-5 h-5 text-charcoal stroke-[2.5]" />
                  </button>
                  <button
                    onClick={resetMapPosition}
                    className="w-8 h-8 rounded-md bg-sage-green-dark hover:bg-sage-green-dark/90 text-white flex items-center justify-center transition-colors shadow-sm"
                    title="Reset Position"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => panMap(10, 0)}
                    className="w-8 h-8 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 flex items-center justify-center transition-colors"
                    title="Move Right"
                  >
                    <ChevronRight className="w-5 h-5 text-charcoal stroke-[2.5]" />
                  </button>
                  
                  <div />
                  <button
                    onClick={() => panMap(0, 10)}
                    className="w-8 h-8 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 flex items-center justify-center transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown className="w-5 h-5 text-charcoal stroke-[2.5]" />
                  </button>
                  <div />
                </div>

                {/* Divider */}
                <div className="w-px h-16 bg-gray-200 mx-2" />

                {/* Zoom Controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => adjustZoom(1)}
                    className="w-8 h-8 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 flex items-center justify-center transition-colors"
                    title="Zoom In"
                  >
                    <Plus className="w-5 h-5 text-charcoal stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => adjustZoom(-1)}
                    className="w-8 h-8 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 flex items-center justify-center transition-colors"
                    title="Zoom Out"
                  >
                    <Minus className="w-5 h-5 text-charcoal stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 <span className="font-medium">Tip:</span> Use arrow buttons to pan the map, reset button to center
              </p>
            </div>
          </div>
          </MPGAccordionSection>
        )}

        {/* Popular Cities Section */}
        <MPGAccordionSection
          id="popular-cities"
          letter="C"
          title="Popular Cities"
          description="Quick select from trending locations"
          icon={Sparkles}
          colorTheme="blue"
        >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MPG_PRESET_CITIES.slice(0, 9).map((preset) => (
            <button
              key={preset.name}
              onClick={() => loadPresetCity(preset)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                city === preset.name
                  ? 'bg-blue-100 text-charcoal shadow-md border border-blue-200'
                  : 'bg-white hover:bg-blue-50 text-charcoal border border-gray-200'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
        
        <div className="mt-3 p-3 bg-amber-50 rounded-lg">
          <p className="text-xs text-amber-700">
            💡 <span className="font-medium">Tip:</span> Can't find your city? Use the search above
          </p>
        </div>
        </MPGAccordionSection>
      </MPGAccordionManager>
    </div>
  );
}