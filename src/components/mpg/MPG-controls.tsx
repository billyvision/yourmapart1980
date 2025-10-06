'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Search, MapPin, Type, Settings } from 'lucide-react';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { 
  MPG_PRESET_CITIES, 
  MPG_FONTS, 
  MPG_FRAME_STYLES,
  MPG_ZOOM_LEVELS 
} from '@/lib/mpg/MPG-constants';

export function MPGControls() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const {
    city,
    zoom,
    frameStyle,
    glowEffect,
    showCoordinates,
    showCountry,
    customText,
    titleFont,
    subtitleFont,
    letterSpacing,
    setCity,
    setZoom,
    setFrameStyle,
    setGlowEffect,
    setShowCoordinates,
    setShowCountry,
    setCustomText,
    setTitleFont,
    setSubtitleFont,
    setLetterSpacing
  } = useMPGStore();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const cityName = result.display_name.split(',')[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        // Extract country from display_name
        const parts = result.display_name.split(',');
        const country = parts[parts.length - 1].trim();
        
        setCity(cityName, lat, lng, country);
        setSearchQuery('');
      } else {
        alert('City not found. Please try another search.');
      }
    } catch (error) {
      console.error('Error searching for city:', error);
      alert('Error searching for city. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const loadPresetCity = (preset: typeof MPG_PRESET_CITIES[0]) => {
    setCity(preset.name, preset.lat, preset.lng, preset.country);
  };

  return (
    <div className="space-y-6">
      {/* City Search Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage-green text-white">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold text-charcoal">
              Location
            </h3>
            <p className="text-medium-gray text-sm mt-1">
              Search for a city or choose from presets
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for a city..."
              className="flex-1 bg-white border-2 border-sage-green/20 text-charcoal placeholder-medium-gray h-11 text-base rounded-xl focus:border-sage-green transition-colors"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-sage-green hover:bg-sage-green-dark text-white h-11 px-6 rounded-xl"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Current City Display */}
          <div className="bg-warm-cream/30 rounded-xl p-3">
            <p className="text-sm text-medium-gray">Current Location:</p>
            <p className="text-lg font-semibold text-charcoal">{city}</p>
          </div>

          {/* Preset Cities */}
          <div>
            <Label className="text-sm font-semibold text-charcoal mb-3 block">
              Popular Cities
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {MPG_PRESET_CITIES.slice(0, 6).map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => loadPresetCity(preset)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    city === preset.name
                      ? 'bg-sage-green text-white'
                      : 'bg-gray-50 hover:bg-sage-green/10 text-charcoal border-2 border-gray-200'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Settings Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage-green text-white">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold text-charcoal">
              Map Settings
            </h3>
            <p className="text-medium-gray text-sm mt-1">
              Adjust map zoom and frame style
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Zoom Level */}
          <div>
            <Label className="text-sm font-semibold text-charcoal mb-2 block">
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
            <div className="flex justify-between text-xs text-medium-gray mt-1">
              <span>City View</span>
              <span>Neighborhood</span>
              <span>Street View</span>
            </div>
          </div>

          {/* Frame Style */}
          <div>
            <Label className="text-sm font-semibold text-charcoal mb-3 block">
              Frame Style
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {MPG_FRAME_STYLES.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => {
                    setFrameStyle(frame.id as any);
                    // Disable glow effect when switching to square frame
                    if (frame.id === 'square' && glowEffect) {
                      setGlowEffect(false);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    frameStyle === frame.id
                      ? 'bg-sage-green text-white'
                      : 'bg-gray-50 hover:bg-sage-green/10 text-charcoal border-2 border-gray-200'
                  }`}
                >
                  {frame.name}
                </button>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-charcoal">
                Show Coordinates
              </Label>
              <Switch
                checked={showCoordinates}
                onCheckedChange={setShowCoordinates}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-charcoal">
                Show Country
              </Label>
              <Switch
                checked={showCountry}
                onCheckedChange={setShowCountry}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage-green text-white">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold text-charcoal">
              Typography
            </h3>
            <p className="text-medium-gray text-sm mt-1">
              Customize text and fonts
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Title Font */}
          <div>
            <Label className="text-sm font-semibold text-charcoal mb-2 block">
              Title Font
            </Label>
            <select
              value={titleFont}
              onChange={(e) => setTitleFont(e.target.value)}
              className="w-full px-4 py-2 bg-white border-2 border-sage-green/20 rounded-xl text-charcoal focus:border-sage-green transition-colors"
            >
              {MPG_FONTS.title.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {/* Letter Spacing */}
          <div>
            <Label className="text-sm font-semibold text-charcoal mb-2 block">
              Letter Spacing: {letterSpacing}px
            </Label>
            <Slider
              value={[letterSpacing]}
              onValueChange={(value) => setLetterSpacing(value[0])}
              min={0}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          {/* Custom Text */}
          <div>
            <Label className="text-sm font-semibold text-charcoal mb-2 block">
              Custom Text (Optional)
            </Label>
            <Input
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g., Where we first met"
              className="bg-white border-2 border-sage-green/20 text-charcoal placeholder-medium-gray h-11 text-base rounded-xl focus:border-sage-green transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}