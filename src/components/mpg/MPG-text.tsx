'use client'
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Type, MapPin, Globe, MessageSquare, Heading, 
  Settings2, Hash, Navigation, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { MPG_HEADLINE_FONTS } from '@/lib/mpg/MPG-constants';
import { MPGAccordionSection } from './ui/MPG-accordion-section';
import { MPGCompactToggle } from './ui/MPG-compact-toggle';
import { MPGAccordionManager } from './ui/MPG-accordion-manager';

export function MPGText() {
  const {
    city,
    frameStyle,
    showCityName,
    showCoordinates,
    showCountry,
    customText,
    customTextFont,
    customTextSize,
    headlineText,
    headlineFont,
    headlineSize,
    headlineAllCaps,
    titleFont,
    titleSize,
    coordinatesFont,
    coordinatesSize,
    countryFont,
    countrySize,
    letterSpacing,
    textSpacing,
    setShowCityName,
    setShowCoordinates,
    setShowCountry,
    setCustomText,
    setCustomTextFont,
    setCustomTextSize,
    setHeadlineText,
    setHeadlineFont,
    setHeadlineSize,
    setHeadlineAllCaps,
    setTitleFont,
    setTitleSize,
    setCoordinatesFont,
    setCoordinatesSize,
    setCountryFont,
    setCountrySize,
    setLetterSpacing,
    setTextSpacing,
  } = useMPGStore();

  // Available fonts for each text element
  // Use all 36 fonts from MPG_HEADLINE_FONTS for all sections
  const allFonts = MPG_HEADLINE_FONTS;
  
  // For headline - uses family property
  const headlineFonts = allFonts;
  
  // For location details - convert to use id property format
  const availableFonts = allFonts.map(font => ({
    id: font.family,
    name: font.name
  }));
  
  // For custom message - same as location details
  const customFonts = availableFonts;

  const sizeOptions = [
    { id: 'S', label: 'Small' },
    { id: 'M', label: 'Medium' },
    { id: 'L', label: 'Large' }
  ];

  return (
    <div className="space-y-2">
      {/* Step Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage-green text-white">
          <Type className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-charcoal">
            Text & Typography
          </h3>
          <p className="text-medium-gray text-sm mt-1">
            Customize text elements
          </p>
        </div>
      </div>

      <MPGAccordionManager>
        {/* Headline Text Section */}
        <MPGAccordionSection
          id="headline-text"
          letter="A"
          title="Headline Text"
          description="Add a custom headline above the map"
          icon={Heading}
          colorTheme="green"
        >
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-charcoal mb-2 block">
              Headline (Optional)
            </Label>
            <div className="relative">
              <Input
                value={headlineText || ''}
                onChange={(e) => setHeadlineText(e.target.value)}
                placeholder="e.g., Our Adventure Begins"
                className="w-full pr-8"
              />
              {headlineText && (
                <button
                  onClick={() => setHeadlineText('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear headline"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {headlineText && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <Label className="text-xs font-medium text-medium-gray mb-2 block">
                Headline Settings
              </Label>
              <div className="flex items-center gap-3">
                {/* All Caps Toggle */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="all-caps" className="text-xs text-medium-gray cursor-pointer">
                    All Caps
                  </Label>
                  <Switch
                    id="all-caps"
                    checked={headlineAllCaps}
                    onCheckedChange={setHeadlineAllCaps}
                    className="data-[state=checked]:bg-sage-green"
                  />
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-200" />
                
                {/* Font Selector with Arrows */}
                <div className="flex-1 flex items-center gap-1">
                  <button
                    onClick={() => {
                      const currentIndex = headlineFonts.findIndex(f => f.family === headlineFont);
                      const prevIndex = currentIndex > 0 ? currentIndex - 1 : headlineFonts.length - 1;
                      setHeadlineFont(headlineFonts[prevIndex].family);
                    }}
                    className="p-1.5 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 transition-colors"
                    title="Previous font"
                  >
                    <ChevronLeft className="w-4 h-4 text-charcoal" />
                  </button>
                  
                  <select
                    value={headlineFont}
                    onChange={(e) => setHeadlineFont(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
                  >
                    {headlineFonts.map(font => (
                      <option key={font.id} value={font.family}>{font.name}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => {
                      const currentIndex = headlineFonts.findIndex(f => f.family === headlineFont);
                      const nextIndex = currentIndex < headlineFonts.length - 1 ? currentIndex + 1 : 0;
                      setHeadlineFont(headlineFonts[nextIndex].family);
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
                      onClick={() => setHeadlineSize(size)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        headlineSize === size
                          ? 'bg-sage-green text-white'
                          : 'bg-gray-50 hover:bg-sage-green/10 text-charcoal border border-gray-200'
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

        {/* Location Details Section */}
        <MPGAccordionSection
          id="location-details"
          letter="B"
          title="Location Details"
          description="Toggle location information display"
          icon={MapPin}
          colorTheme="purple"
        >
        <div className="space-y-3">
          {/* City Name Controls */}
          <div className="flex items-center gap-3">
            {/* Show/Hide Toggle */}
            <div className="flex items-center gap-2">
              <Label htmlFor="show-city" className="text-xs text-medium-gray cursor-pointer whitespace-nowrap">
                Show City
              </Label>
              <Switch
                id="show-city"
                checked={showCityName}
                onCheckedChange={setShowCityName}
                className="data-[state=checked]:bg-sage-green"
              />
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200" />
            
            {/* Font Selector with Arrows */}
            <div className="flex-1 flex items-center gap-1">
              <button
                onClick={() => {
                  const currentIndex = availableFonts.findIndex(f => f.id === titleFont);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableFonts.length - 1;
                  setTitleFont(availableFonts[prevIndex].id);
                }}
                className="p-1.5 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 transition-colors disabled:opacity-50"
                title="Previous font"
                disabled={!showCityName}
              >
                <ChevronLeft className="w-4 h-4 text-charcoal" />
              </button>
              
              <select
                value={titleFont}
                onChange={(e) => setTitleFont(e.target.value as any)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green disabled:opacity-50"
                disabled={!showCityName}
              >
                {availableFonts.map(font => (
                  <option key={font.id} value={font.id}>{font.name}</option>
                ))}
              </select>
              
              <button
                onClick={() => {
                  const currentIndex = availableFonts.findIndex(f => f.id === titleFont);
                  const nextIndex = currentIndex < availableFonts.length - 1 ? currentIndex + 1 : 0;
                  setTitleFont(availableFonts[nextIndex].id);
                }}
                className="p-1.5 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 transition-colors disabled:opacity-50"
                title="Next font"
                disabled={!showCityName}
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
                  onClick={() => setTitleSize(size)}
                  disabled={!showCityName}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 ${
                    titleSize === size
                      ? 'bg-sage-green text-white'
                      : 'bg-gray-50 hover:bg-sage-green/10 text-charcoal border border-gray-200'
                  }`}
                  title={`${size === 'S' ? 'Small' : size === 'M' ? 'Medium' : 'Large'} size`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Coordinates Controls */}
          <div className="flex items-center gap-3">
            {/* Show/Hide Toggle */}
            <div className="flex items-center gap-2">
              <Label htmlFor="show-coords" className="text-xs text-medium-gray cursor-pointer whitespace-nowrap">
                Show Coords
              </Label>
              <Switch
                id="show-coords"
                checked={showCoordinates}
                onCheckedChange={setShowCoordinates}
                className="data-[state=checked]:bg-sage-green"
              />
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200" />
            
            {/* Font Selector with Arrows */}
            <div className="flex-1 flex items-center gap-1">
              <button
                onClick={() => {
                  const currentIndex = availableFonts.findIndex(f => f.id === coordinatesFont);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableFonts.length - 1;
                  setCoordinatesFont(availableFonts[prevIndex].id);
                }}
                className="p-1.5 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 transition-colors disabled:opacity-50"
                title="Previous font"
                disabled={!showCoordinates}
              >
                <ChevronLeft className="w-4 h-4 text-charcoal" />
              </button>
              
              <select
                value={coordinatesFont}
                onChange={(e) => setCoordinatesFont(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green disabled:opacity-50"
                disabled={!showCoordinates}
              >
                {availableFonts.map(font => (
                  <option key={font.id} value={font.id}>{font.name}</option>
                ))}
              </select>
              
              <button
                onClick={() => {
                  const currentIndex = availableFonts.findIndex(f => f.id === coordinatesFont);
                  const nextIndex = currentIndex < availableFonts.length - 1 ? currentIndex + 1 : 0;
                  setCoordinatesFont(availableFonts[nextIndex].id);
                }}
                className="p-1.5 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 transition-colors disabled:opacity-50"
                title="Next font"
                disabled={!showCoordinates}
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
                  onClick={() => setCoordinatesSize(size)}
                  disabled={!showCoordinates}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 ${
                    coordinatesSize === size
                      ? 'bg-sage-green text-white'
                      : 'bg-gray-50 hover:bg-sage-green/10 text-charcoal border border-gray-200'
                  }`}
                  title={`${size === 'S' ? 'Small' : size === 'M' ? 'Medium' : 'Large'} size`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Country Controls */}
          <div className="flex items-center gap-3">
            {/* Show/Hide Toggle */}
            <div className="flex items-center gap-2">
              <Label htmlFor="show-country" className="text-xs text-medium-gray cursor-pointer whitespace-nowrap">
                Show Country
              </Label>
              <Switch
                id="show-country"
                checked={showCountry}
                onCheckedChange={setShowCountry}
                className="data-[state=checked]:bg-sage-green"
              />
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200" />
            
            {/* Font Selector with Arrows */}
            <div className="flex-1 flex items-center gap-1">
              <button
                onClick={() => {
                  const currentIndex = availableFonts.findIndex(f => f.id === countryFont);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableFonts.length - 1;
                  setCountryFont(availableFonts[prevIndex].id);
                }}
                className="p-1.5 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 transition-colors disabled:opacity-50"
                title="Previous font"
                disabled={!showCountry}
              >
                <ChevronLeft className="w-4 h-4 text-charcoal" />
              </button>
              
              <select
                value={countryFont}
                onChange={(e) => setCountryFont(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green disabled:opacity-50"
                disabled={!showCountry}
              >
                {availableFonts.map(font => (
                  <option key={font.id} value={font.id}>{font.name}</option>
                ))}
              </select>
              
              <button
                onClick={() => {
                  const currentIndex = availableFonts.findIndex(f => f.id === countryFont);
                  const nextIndex = currentIndex < availableFonts.length - 1 ? currentIndex + 1 : 0;
                  setCountryFont(availableFonts[nextIndex].id);
                }}
                className="p-1.5 rounded-md bg-gray-50 hover:bg-sage-green/10 border border-gray-200 transition-colors disabled:opacity-50"
                title="Next font"
                disabled={!showCountry}
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
                  onClick={() => setCountrySize(size)}
                  disabled={!showCountry}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 ${
                    countrySize === size
                      ? 'bg-sage-green text-white'
                      : 'bg-gray-50 hover:bg-sage-green/10 text-charcoal border border-gray-200'
                  }`}
                  title={`${size === 'S' ? 'Small' : size === 'M' ? 'Medium' : 'Large'} size`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
        </MPGAccordionSection>

        {/* Custom Message Section */}
        <MPGAccordionSection
          id="custom-message"
          letter="C"
          title="Custom Message"
          description="Add a personal message below the map"
          icon={MessageSquare}
          colorTheme="orange"
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

          {customText && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <Label className="text-xs font-medium text-medium-gray mb-2 block">
                Message Settings
              </Label>
              <div className="flex items-center gap-3">
                {/* Font Style Label */}
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-medium-gray whitespace-nowrap">
                    Font Style
                  </Label>
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
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        customTextSize === size
                          ? 'bg-sage-green text-white'
                          : 'bg-gray-50 hover:bg-sage-green/10 text-charcoal border border-gray-200'
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

        {/* Typography Settings Section */}
        <MPGAccordionSection
          id="typography-settings"
          letter="D"
          title="Typography Settings"
          description="Fine-tune text appearance and spacing"
          icon={Settings2}
          colorTheme="teal"
        >
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-charcoal mb-2 block">
              Letter Spacing: {letterSpacing.toFixed(1)}
            </Label>
            <Slider
              value={[letterSpacing]}
              onValueChange={(value) => setLetterSpacing(value[0])}
              min={0}
              max={5}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-medium-gray mt-1">
              <span>Tight</span>
              <span>Normal</span>
              <span>Wide</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-charcoal mb-2 block">
              Text Line Spacing: {textSpacing.toFixed(1)}x
            </Label>
            <Slider
              value={[textSpacing]}
              onValueChange={(value) => setTextSpacing(value[0])}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-medium-gray mt-1">
              <span>Compact</span>
              <span>Normal</span>
              <span>Spacious</span>
            </div>
            <p className="text-xs text-medium-gray mt-2">
              Adjusts vertical spacing between city, coordinates, and other text elements
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-xs text-amber-700">
              💡 <span className="font-medium">Tips:</span><br/>
              • Use wider letter spacing for headlines and all-caps text<br/>
              • Increase line spacing for better readability with multiple text elements
            </p>
          </div>
        </div>
        </MPGAccordionSection>
      </MPGAccordionManager>
    </div>
  );
}