'use client'
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Type, MapPin, Globe, MessageSquare, Heading } from 'lucide-react';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { MPG_FONTS, MPG_HEADLINE_FONTS } from '@/lib/mpg/MPG-constants';

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
  } = useMPGStore();

  // Available fonts for each text element
  const availableFonts = [
    { id: 'playfair', name: 'Playfair Display' },
    { id: 'montserrat', name: 'Montserrat' },
    { id: 'bebas', name: 'Bebas Neue' },
    { id: 'roboto', name: 'Roboto' },
    { id: 'lato', name: 'Lato' },
    { id: 'oswald', name: 'Oswald' },
    { id: 'opensans', name: 'Open Sans' }
  ];

  // Use the 25 fonts from MPG_HEADLINE_FONTS for headline
  const headlineFonts = MPG_HEADLINE_FONTS;

  // Custom text fonts (including script fonts)
  const customFonts = [
    { id: 'Roboto', name: 'Roboto' },
    { id: 'Montserrat', name: 'Montserrat' },
    { id: 'Playfair Display', name: 'Playfair Display' },
    { id: 'Dancing Script', name: 'Dancing Script' },
    { id: 'Bebas Neue', name: 'Bebas Neue' },
    { id: 'Alex Brush', name: 'Alex Brush' },
    { id: 'Kaushan Script', name: 'Kaushan Script' },
    { id: 'Pacifico', name: 'Pacifico' },
    { id: 'Sacramento', name: 'Sacramento' },
    { id: 'Yellowtail', name: 'Yellowtail' },
    { id: 'Cookie', name: 'Cookie' },
    { id: 'Satisfy', name: 'Satisfy' },
    { id: 'Great Vibes', name: 'Great Vibes' },
    { id: 'Allura', name: 'Allura' },
    { id: 'Tangerine', name: 'Tangerine' }
  ];

  const sizeOptions = [
    { id: 'S', label: 'Small' },
    { id: 'M', label: 'Medium' },
    { id: 'L', label: 'Large' }
  ];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage-green text-white">
          <Type className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-charcoal">
            Text & Typography
          </h3>
          <p className="text-medium-gray text-sm mt-1">
            Customize text elements and their fonts
          </p>
        </div>
      </div>

      {/* Headline Section - Above Frame */}
      {frameStyle !== 'square' && (
        <div className="space-y-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Heading className="w-4 h-4 text-sage-green" />
            <h4 className="text-base font-semibold text-charcoal">Headline (Above Frame)</h4>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="space-y-4">
              {/* Text Input */}
              <div>
                <Label className="text-xs font-medium text-medium-gray mb-2 block">
                  Headline Text (Optional)
                </Label>
                <input
                  type="text"
                  value={headlineText}
                  onChange={(e) => setHeadlineText(e.target.value)}
                  placeholder="e.g., Our Special Place, Home Sweet Home"
                  className="w-full px-3 py-2 bg-white border border-sage-green/20 rounded-lg text-sm text-charcoal placeholder:text-light-gray focus:border-sage-green transition-colors"
                  maxLength={30}
                />
                <p className="text-xs text-medium-gray mt-1">
                  {headlineText.length}/30 characters • Appears above the map frame
                </p>
              </div>
              
              {headlineText && (
                <>
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                    {/* Font Selection */}
                    <div>
                      <Label className="text-xs font-medium text-medium-gray mb-2 block">
                        Font Style
                      </Label>
                    <select
                      value={headlineFont}
                      onChange={(e) => setHeadlineFont(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-sage-green/20 rounded-lg text-sm text-charcoal focus:border-sage-green transition-colors"
                    >
                      {headlineFonts.map((font) => (
                        <option key={font.id} value={font.family}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Size Selection */}
                  <div>
                    <Label className="text-xs font-medium text-medium-gray mb-2 block">
                      Text Size
                    </Label>
                    <div className="flex gap-1">
                      {sizeOptions.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setHeadlineSize(size.id as 'S' | 'M' | 'L')}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            headlineSize === size.id
                              ? 'bg-sage-green text-white'
                              : 'bg-white hover:bg-sage-green/10 text-charcoal border border-gray-200'
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  </div>
                  
                  {/* ALL CAPS Toggle */}
                  <div className="flex items-center justify-between bg-warm-cream/50 p-3 rounded-lg animate-in slide-in-from-top-2 duration-300">
                    <Label className="text-sm font-medium text-charcoal">Text Style</Label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Switch
                        checked={headlineAllCaps}
                        onCheckedChange={setHeadlineAllCaps}
                        className="data-[state=checked]:bg-sage-green"
                      />
                      <span className="text-sm text-medium-gray">ALL CAPS</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <p className="text-xs text-blue-600 bg-blue-50 rounded-lg p-2">
            💡 Not available for square frames as they use full space
          </p>
        </div>
      )}

      {/* City Name Section */}
      <div className="space-y-4 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sage-green" />
            <h4 className="text-base font-semibold text-charcoal">City Name</h4>
          </div>
          <Switch
            checked={showCityName}
            onCheckedChange={setShowCityName}
            className="data-[state=checked]:bg-sage-green"
          />
        </div>
        
        {showCityName && (
          <div className="bg-sage-green/5 rounded-lg p-4 border border-sage-green/20 animate-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-charcoal mb-3">
              Currently showing: <span className="font-semibold">{city || 'No location selected'}</span>
            </p>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Font Selection */}
            <div>
              <Label className="text-xs font-medium text-medium-gray mb-2 block">
                Font Style
              </Label>
              <select
                value={titleFont}
                onChange={(e) => setTitleFont(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-sage-green/20 rounded-lg text-sm text-charcoal focus:border-sage-green transition-colors"
              >
                {availableFonts.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Size Selection */}
            <div>
              <Label className="text-xs font-medium text-medium-gray mb-2 block">
                Text Size
              </Label>
              <div className="flex gap-1">
                {sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setTitleSize(size.id as 'S' | 'M' | 'L')}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      titleSize === size.id
                        ? 'bg-sage-green text-white'
                        : 'bg-white hover:bg-sage-green/10 text-charcoal border border-gray-200'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Coordinates Section */}
      <div className="space-y-4 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sage-green" />
            <h4 className="text-base font-semibold text-charcoal">Coordinates</h4>
          </div>
          <Switch
            checked={showCoordinates}
            onCheckedChange={setShowCoordinates}
            className="data-[state=checked]:bg-sage-green"
          />
        </div>
        
        {showCoordinates && (
          <div className="bg-gray-50 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              {/* Font Selection */}
              <div>
                <Label className="text-xs font-medium text-medium-gray mb-2 block">
                  Font Style
                </Label>
                <select
                  value={coordinatesFont}
                  onChange={(e) => setCoordinatesFont(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-sage-green/20 rounded-lg text-sm text-charcoal focus:border-sage-green transition-colors"
                >
                  {availableFonts.map((font) => (
                    <option key={font.id} value={font.id}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Size Selection */}
              <div>
                <Label className="text-xs font-medium text-medium-gray mb-2 block">
                  Text Size
                </Label>
                <div className="flex gap-1">
                  {sizeOptions.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setCoordinatesSize(size.id as 'S' | 'M' | 'L')}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        coordinatesSize === size.id
                          ? 'bg-sage-green text-white'
                          : 'bg-white hover:bg-sage-green/10 text-charcoal border border-gray-200'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Country/City Section */}
      <div className="space-y-4 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-sage-green" />
            <h4 className="text-base font-semibold text-charcoal">Country/City</h4>
          </div>
          <Switch
            checked={showCountry}
            onCheckedChange={setShowCountry}
            className="data-[state=checked]:bg-sage-green"
          />
        </div>
        
        {showCountry && (
          <div className="bg-gray-50 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              {/* Font Selection */}
              <div>
                <Label className="text-xs font-medium text-medium-gray mb-2 block">
                  Font Style
                </Label>
                <select
                  value={countryFont}
                  onChange={(e) => setCountryFont(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-sage-green/20 rounded-lg text-sm text-charcoal focus:border-sage-green transition-colors"
                >
                  {availableFonts.map((font) => (
                    <option key={font.id} value={font.id}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Size Selection */}
              <div>
                <Label className="text-xs font-medium text-medium-gray mb-2 block">
                  Text Size
                </Label>
                <div className="flex gap-1">
                  {sizeOptions.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setCountrySize(size.id as 'S' | 'M' | 'L')}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        countrySize === size.id
                          ? 'bg-sage-green text-white'
                          : 'bg-white hover:bg-sage-green/10 text-charcoal border border-gray-200'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Text Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-sage-green" />
          <h4 className="text-base font-semibold text-charcoal">Custom Text</h4>
        </div>
        
        <div className="bg-warm-cream/30 rounded-lg p-4 border border-warm-cream">
          <div className="space-y-4">
            {/* Text Input */}
            <div>
              <Label className="text-xs font-medium text-medium-gray mb-2 block">
                Your Custom Message (Optional)
              </Label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g., Home Sweet Home, Est. 2024, Our First Adventure"
                className="w-full px-3 py-2 bg-white border border-sage-green/20 rounded-lg text-sm text-charcoal placeholder:text-light-gray focus:border-sage-green transition-colors"
                maxLength={50}
              />
              <p className="text-xs text-medium-gray mt-1">
                {customText.length}/50 characters
              </p>
            </div>
            
            {customText && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                {/* Font Selection */}
                <div>
                  <Label className="text-xs font-medium text-medium-gray mb-2 block">
                    Font Style
                  </Label>
                  <select
                    value={customTextFont}
                    onChange={(e) => setCustomTextFont(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-sage-green/20 rounded-lg text-sm text-charcoal focus:border-sage-green transition-colors"
                  >
                    {customFonts.map((font) => (
                      <option key={font.id} value={font.id}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Size Selection */}
                <div>
                  <Label className="text-xs font-medium text-medium-gray mb-2 block">
                    Text Size
                  </Label>
                  <div className="flex gap-1">
                    {sizeOptions.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setCustomTextSize(size.id as 'S' | 'M' | 'L')}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          customTextSize === size.id
                            ? 'bg-sage-green text-white'
                            : 'bg-white hover:bg-sage-green/10 text-charcoal border border-gray-200'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Letter Spacing Control */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
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
          <div className="flex justify-between text-xs text-medium-gray mt-1">
            <span>Normal</span>
            <span>Wide</span>
            <span>Very Wide</span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">💡 Tip:</span> Toggle text elements on/off to customize your poster. 
          When elements are toggled off, remaining text will automatically adjust spacing (magnet effect) to maintain visual balance.
        </p>
      </div>
    </div>
  );
}