'use client'
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Palette, Building2, Trees, Droplets, Route, MapPin, 
  Sparkles, Frame, ZoomIn, Map, Layers, Navigation2, Type,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw,
  Plus, Minus
} from 'lucide-react';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { 
  MPG_FRAME_STYLES,
  MPG_ZOOM_LEVELS,
  MPG_PIN_STYLES,
  MPG_PIN_COLORS 
} from '@/lib/mpg/MPG-constants';
import { MPG_KONVA_GLOW_EFFECTS } from '@/lib/mpg/MPG-konva-constants';
import { getStyleList } from '@/lib/mpg/MPG-maplibre-styles';
import { getStyleDefaultFeatures } from '@/lib/mpg/MPG-maplibre-snazzy-adapter';
import { getSnazzyStyle } from '@/lib/mpg/MPG-snazzy-styles';
import { MPGAccordionSection } from './ui/MPG-accordion-section';
import { MPGCompactToggle } from './ui/MPG-compact-toggle';
import { MPGStyleGrid } from './ui/MPG-style-grid';
import { MPGCompactStyleGrid } from './ui/MPG-compact-style-grid';
import { MPGAccordionManager } from './ui/MPG-accordion-manager';
import { MPGSaveTemplateButton } from './MPG-save-template-button';
import { getPinIcon } from './MPG-pin-icons';
import '@/styles/mpg-glow-buttons.css';

export function MPGStyleAndSettings() {
  const [mapLibreStyles] = useState(() => getStyleList());
  
  const {
    style,
    zoom,
    frameStyle,
    showFrameBorder,
    glowEffect,
    glowStyle,
    glowIntensity,
    showMapLabels,
    showMapBuildings,
    showMapParks,
    showMapWater,
    showMapRoads,
    showPin,
    pinStyle,
    pinColor,
    pinSize,
    backgroundColor,
    backgroundImage,
    backgroundImageOpacity,
    textColor,
    useCustomBackground,
    useCustomFontColor,
    customFontColor,
    setStyle,
    setZoom,
    adjustZoom,
    panMap,
    resetMapPosition,
    setFrameStyle,
    setShowFrameBorder,
    setGlowEffect,
    setGlowStyle,
    setGlowIntensity,
    setBackgroundColor,
    setBackgroundImage,
    setBackgroundImageOpacity,
    setTextColor,
    setUseCustomBackground,
    setShowMapLabels,
    setShowMapBuildings,
    setShowMapParks,
    setShowMapWater,
    setShowMapRoads,
    setShowPin,
    setPinStyle,
    setPinColor,
    setPinSize,
    setUseCustomFontColor,
    setCustomFontColor
  } = useMPGStore();

  // Apply default features on initial load for blueprint2
  useEffect(() => {
    // Only apply defaults on mount if style is blueprint2 (the default)
    if (style === 'blueprint2') {
      const defaultFeatures = getStyleDefaultFeatures('blueprint2');
      if (defaultFeatures) {
        if (defaultFeatures.showMapLabels !== undefined) {
          setShowMapLabels(defaultFeatures.showMapLabels);
        }
        if (defaultFeatures.showBuildings !== undefined) {
          setShowMapBuildings(defaultFeatures.showBuildings);
        }
        if (defaultFeatures.showParks !== undefined) {
          setShowMapParks(defaultFeatures.showParks);
        }
        if (defaultFeatures.showWater !== undefined) {
          setShowMapWater(defaultFeatures.showWater);
        }
        if (defaultFeatures.showRoads !== undefined) {
          setShowMapRoads(defaultFeatures.showRoads);
        }
      }
    }
  }, []); // Only run once on mount

  // Handle style selection with default features and colors
  const handleStyleSelect = (styleId: string) => {
    setStyle(styleId);
    
    // Apply default features for the style
    const defaultFeatures = getStyleDefaultFeatures(styleId);
    if (defaultFeatures) {
      if (defaultFeatures.showMapLabels !== undefined) {
        setShowMapLabels(defaultFeatures.showMapLabels);
      }
      if (defaultFeatures.showBuildings !== undefined) {
        setShowMapBuildings(defaultFeatures.showBuildings);
      }
      if (defaultFeatures.showParks !== undefined) {
        setShowMapParks(defaultFeatures.showParks);
      }
      if (defaultFeatures.showWater !== undefined) {
        setShowMapWater(defaultFeatures.showWater);
      }
      if (defaultFeatures.showRoads !== undefined) {
        setShowMapRoads(defaultFeatures.showRoads);
      }
    }
    
    // Apply default background and text colors for the style
    const snazzyStyle = getSnazzyStyle(styleId);
    if (snazzyStyle && snazzyStyle.background && snazzyStyle.textColor) {
      setUseCustomBackground(false); // Reset to theme default
      setBackgroundColor(snazzyStyle.background);
      setTextColor(snazzyStyle.textColor);
    }
  };

  return (
    <div className="space-y-2">
      {/* Step Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage-green-dark text-white">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-charcoal">
            Style & Settings
          </h3>
          <p className="text-medium-gray text-sm mt-1">
            Customize your map's appearance
          </p>
        </div>
      </div>

      <MPGAccordionManager>
        {/* Map Style Section */}
        <MPGAccordionSection
          id="map-style"
          letter="A"
          title="Map Style"
          description="Choose your preferred map design"
          icon={Map}
          colorTheme="indigo"
        >
        <div className="space-y-3">
          <MPGCompactStyleGrid
            styles={mapLibreStyles}
            selectedStyle={style}
            onStyleSelect={handleStyleSelect}
            columns="compact"
          />
          <div className="p-3 bg-warm-cream/50 rounded-lg">
            <p className="text-xs text-medium-gray">
              <span className="font-semibold text-charcoal">Current: </span>
              {mapLibreStyles.find(s => s.id === style)?.name || 'Minimal'}
            </p>
          </div>
        </div>
        </MPGAccordionSection>

        {/* Map Features Section */}
        <MPGAccordionSection
          id="map-features"
          letter="B"
          title="Map Features"
          description="Toggle map elements visibility"
          icon={Layers}
          colorTheme="pink"
        >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <MPGCompactToggle
            icon={MapPin}
            label="Street Names"
            checked={showMapLabels}
            onCheckedChange={setShowMapLabels}
          />
          <MPGCompactToggle
            icon={Building2}
            label="Buildings"
            checked={showMapBuildings}
            onCheckedChange={setShowMapBuildings}
          />
          <MPGCompactToggle
            icon={Trees}
            label="Parks"
            checked={showMapParks}
            onCheckedChange={setShowMapParks}
          />
          <MPGCompactToggle
            icon={Droplets}
            label="Water"
            checked={showMapWater}
            onCheckedChange={setShowMapWater}
          />
          <MPGCompactToggle
            icon={Route}
            label="Roads"
            checked={showMapRoads}
            onCheckedChange={setShowMapRoads}
          />
        </div>
        </MPGAccordionSection>

        {/* Frame Style Section */}
        <MPGAccordionSection
          id="frame-style"
          letter="C"
          title="Frame Style"
          description="Choose your frame shape"
          icon={Frame}
          colorTheme="yellow"
        >
        <div className="space-y-4">
          {/* Frame Style */}
          <div>
            <Label className="text-sm font-medium text-charcoal mb-2 block">
              Select Frame Shape
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MPG_FRAME_STYLES.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => {
                    setFrameStyle(frame.id as any);
                    // Disable glow effect when switching to square frame
                    if (frame.id === 'square' && glowEffect) {
                      setGlowEffect(false);
                    }
                    // Auto-disable frame border when switching to square frame
                    if (frame.id === 'square') {
                      setShowFrameBorder(false);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    frameStyle === frame.id
                      ? 'bg-yellow-100 text-charcoal shadow-md border border-yellow-200'
                      : 'bg-white hover:bg-yellow-50 text-charcoal border border-gray-200'
                  }`}
                >
                  {frame.name}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Border Toggle - Disabled for square frames */}
          {frameStyle !== 'square' && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Label htmlFor="frame-border" className="text-sm font-medium text-charcoal cursor-pointer">
                Show Frame Border
              </Label>
              <Switch
                id="frame-border"
                checked={showFrameBorder}
                onCheckedChange={setShowFrameBorder}
                className="data-[state=checked]:bg-sage-green"
              />
            </div>
          )}
          
          {/* Info message for square frame */}
          {frameStyle === 'square' && (
            <div className="text-xs text-medium-gray italic bg-gray-50 p-2 rounded-md">
              Frame border is not available for square frames.
            </div>
          )}
        </div>
        </MPGAccordionSection>

        {/* Glow Effects Section */}
        <MPGAccordionSection
          id="glow-effects"
          letter="D"
          title="Glow Effects"
          description="Add magical glow to your frame"
          icon={Sparkles}
          colorTheme="purple"
        >
        <div className="space-y-4">
          {/* Glow Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-charcoal flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sage-green" />
              Enable Glow Effect
            </Label>
            <Switch
              checked={glowEffect}
              onCheckedChange={setGlowEffect}
              disabled={frameStyle === 'square'}
            />
          </div>
          
          {/* Info message for square frame */}
          {frameStyle === 'square' && (
            <div className="text-xs text-medium-gray italic bg-gray-50 p-2 rounded-md">
              Glow effect is only available for circle, heart, and house frame styles.
            </div>
          )}
          
          {glowEffect && frameStyle !== 'square' && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              {/* Glow Color Selection */}
              <div>
                <Label className="text-xs font-medium text-medium-gray mb-2 block">
                  GLOW COLOR
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(MPG_KONVA_GLOW_EFFECTS).slice(0, 9).map(([key, config]) => {
                    const isSelected = glowStyle === key;
                    // Calculate brightness to determine text color
                    const rgb = parseInt(config.color.slice(1), 16);
                    const r = (rgb >> 16) & 0xff;
                    const g = (rgb >> 8) & 0xff;
                    const b = rgb & 0xff;
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    const textColor = brightness > 155 ? '#1a1a1a' : '#ffffff';

                    return (
                      <button
                        key={key}
                        onClick={() => setGlowStyle(key as any)}
                        className={`relative px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          isSelected
                            ? 'shadow-lg scale-105'
                            : 'hover:scale-102 hover:shadow-md'
                        }`}
                        style={{
                          backgroundColor: isSelected ? config.color : '#ffffff',
                          borderColor: isSelected ? config.color : config.color + '40',
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          color: isSelected ? textColor : '#1a1a1a',
                          boxShadow: isSelected
                            ? `0 0 20px ${config.color}66, 0 0 40px ${config.color}33`
                            : `0 0 10px ${config.color}20`,
                        }}
                      >
                        <span className="font-medium">
                          {config.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* More Glow Colors */}
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(MPG_KONVA_GLOW_EFFECTS).slice(9).map(([key, config]) => {
                    const isSelected = glowStyle === key;
                    // Calculate brightness to determine text color
                    const rgb = parseInt(config.color.slice(1), 16);
                    const r = (rgb >> 16) & 0xff;
                    const g = (rgb >> 8) & 0xff;
                    const b = rgb & 0xff;
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    const textColor = brightness > 155 ? '#1a1a1a' : '#ffffff';

                    return (
                      <button
                        key={key}
                        onClick={() => setGlowStyle(key as any)}
                        className={`relative px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          isSelected
                            ? 'shadow-lg scale-105'
                            : 'hover:scale-102 hover:shadow-md'
                        }`}
                        style={{
                          backgroundColor: isSelected ? config.color : '#ffffff',
                          borderColor: isSelected ? config.color : config.color + '40',
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          color: isSelected ? textColor : '#1a1a1a',
                          boxShadow: isSelected
                            ? `0 0 20px ${config.color}66, 0 0 40px ${config.color}33`
                            : `0 0 10px ${config.color}20`,
                        }}
                      >
                        <span className="font-medium">
                          {config.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Intensity slider */}
              <div>
                <Label className="text-xs font-medium text-medium-gray mb-2 block">
                  GLOW INTENSITY: {Math.round(glowIntensity * 100)}%
                </Label>
                <Slider
                  value={[glowIntensity]}
                  onValueChange={(value) => setGlowIntensity(value[0])}
                  min={0.1}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-medium-gray mt-1">
                  <span>Subtle</span>
                  <span>Medium</span>
                  <span>Strong</span>
                </div>
              </div>
              
              {/* Glow Tip */}
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700">
                  ✨ <span className="font-medium">Pro Tip:</span> Glow effects look best with darker map styles
                </p>
              </div>
            </div>
          )}
        </div>
        </MPGAccordionSection>

        {/* Background Color Section - Separate Accordion */}
        <MPGAccordionSection
          id="background-color"
          letter="E"
          title="Background Color"
          description="Customize canvas background"
          icon={Palette}
          colorTheme="orange"
        >
        <div className="space-y-4">
            
            {/* Set to Default Button */}
            <Button
              onClick={() => {
                setUseCustomBackground(false);
                // Get the current style's default colors from Snazzy styles
                const snazzyStyle = getSnazzyStyle(style);
                if (snazzyStyle) {
                  setBackgroundColor(snazzyStyle.background || '#ffffff');
                  setTextColor(snazzyStyle.textColor || '#333333');
                }
              }}
              className="w-full mb-3 bg-white hover:bg-gray-50 text-charcoal border border-gray-200"
              size="sm"
            >
              Set to Default
            </Button>
            
            {/* Light Colors */}
            <div className="mb-3">
              <Label className="text-xs font-medium text-medium-gray mb-2 block">
                LIGHT COLORS
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  '#FFFFFF', // Pure White
                  '#F5F5F5', // Light Gray
                  '#FFF9F0', // Cream
                  '#FFE4E1', // Misty Rose
                  '#FFE4B5', // Moccasin
                  '#E6F3FF', // Alice Blue
                  '#E8F5E8', // Honeydew
                  '#FFF0F5', // Lavender Blush
                  '#FFFACD', // Lemon Chiffon
                  '#F0E6FF', // Light Purple
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setUseCustomBackground(true);
                      setBackgroundColor(color);
                      setTextColor('#333333'); // Dark text for light backgrounds
                    }}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      useCustomBackground && backgroundColor === color
                        ? 'border-sage-green ring-2 ring-sage-green/30 scale-110'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            
            {/* Dark Colors */}
            <div className="mb-3">
              <Label className="text-xs font-medium text-medium-gray mb-2 block">
                RICH COLORS
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  '#2C3E50', // Midnight Blue
                  '#8B4513', // Saddle Brown
                  '#2F4F4F', // Dark Slate Gray
                  '#4B0082', // Indigo
                  '#800020', // Burgundy
                  '#355E3B', // Hunter Green
                  '#483D8B', // Dark Slate Blue
                  '#8B008B', // Dark Magenta
                  '#B8860B', // Dark Goldenrod
                  '#4A4A4A', // Charcoal
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setUseCustomBackground(true);
                      setBackgroundColor(color);
                      setTextColor('#FFFFFF'); // Light text for dark backgrounds
                    }}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      useCustomBackground && backgroundColor === color
                        ? 'border-sage-green ring-2 ring-sage-green/30 scale-110'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            
            {/* Vibrant Colors */}
            <div className="mb-3">
              <Label className="text-xs font-medium text-medium-gray mb-2 block">
                VIBRANT COLORS
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  '#FF6B6B', // Coral Red
                  '#4ECDC4', // Turquoise
                  '#45B7D1', // Sky Blue
                  '#96CEB4', // Sage Green
                  '#FFEAA7', // Pastel Yellow
                  '#DDA0DD', // Plum
                  '#98D8C8', // Mint
                  '#F7B731', // Orange Yellow
                  '#5F9EA0', // Cadet Blue
                  '#FFB6C1', // Light Pink
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setUseCustomBackground(true);
                      setBackgroundColor(color);
                      // Auto-detect contrast
                      const rgb = parseInt(color.slice(1), 16);
                      const r = (rgb >> 16) & 0xff;
                      const g = (rgb >> 8) & 0xff;
                      const b = rgb & 0xff;
                      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                      setTextColor(brightness > 128 ? '#333333' : '#FFFFFF');
                    }}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      useCustomBackground && backgroundColor === color
                        ? 'border-sage-green ring-2 ring-sage-green/30 scale-110'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            
            {/* Custom Color Picker */}
            <div>
              <Label className="text-xs font-medium text-medium-gray mb-1 block">
                CUSTOM COLOR
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={useCustomBackground ? backgroundColor : ''}
                    onChange={(e) => {
                      const color = e.target.value;
                      if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
                        setUseCustomBackground(true);
                        setBackgroundColor(color);
                        // Auto-detect contrast
                        const rgb = parseInt(color.slice(1), 16);
                        const r = (rgb >> 16) & 0xff;
                        const g = (rgb >> 8) & 0xff;
                        const b = rgb & 0xff;
                        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                        setTextColor(brightness > 128 ? '#333333' : '#FFFFFF');
                      }
                    }}
                    placeholder="#FFFFFF"
                    className="pr-10 text-xs"
                  />
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => {
                      const color = e.target.value;
                      setUseCustomBackground(true);
                      setBackgroundColor(color);
                      // Auto-detect contrast
                      const rgb = parseInt(color.slice(1), 16);
                      const r = (rgb >> 16) & 0xff;
                      const g = (rgb >> 8) & 0xff;
                      const b = rgb & 0xff;
                      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                      setTextColor(brightness > 128 ? '#333333' : '#FFFFFF');
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 border border-gray-200 rounded cursor-pointer"
                  />
                </div>
              </div>
              {useCustomBackground && (
                <p className="text-xs text-medium-gray mt-1">
                  Text color: {textColor === '#FFFFFF' ? 'White' : 'Dark'}
                </p>
              )}
            </div>

            {/* Background Image/Texture Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Label className="text-xs font-medium text-medium-gray mb-2 block">
                BACKGROUND IMAGE / TEXTURE
              </Label>
              <select
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value as 'none' | 'vintage-paper' | 'torn-paper' | 'marble')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green bg-white"
              >
                <option value="none">None (Solid Color Only)</option>
                <option value="vintage-paper">Vintage Paper Texture</option>
                <option value="torn-paper" disabled>Torn Paper (Coming Soon)</option>
                <option value="marble" disabled>Marble Texture (Coming Soon)</option>
              </select>

              {backgroundImage !== 'none' && (
                <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label className="text-xs font-medium text-medium-gray block">
                    TEXTURE OPACITY: {backgroundImageOpacity}%
                  </Label>
                  <Slider
                    value={[backgroundImageOpacity]}
                    onValueChange={(value) => setBackgroundImageOpacity(value[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-medium-gray">
                    <span>Transparent</span>
                    <span>50%</span>
                    <span>Solid</span>
                  </div>
                  <div className="p-2 bg-orange-50 rounded-lg mt-2">
                    <p className="text-xs text-orange-700">
                      🎨 <span className="font-medium">Tip:</span> Lower opacity lets your background color show through the texture
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Background Tip */}
            <div className="p-2 bg-gray-50 rounded-lg mt-3">
              <p className="text-xs text-gray-600">
                🎨 Background color only affects the canvas, not the map style itself
              </p>
            </div>
        </div>
        </MPGAccordionSection>

        {/* Font Colors Section - NEW */}
        <MPGAccordionSection
          id="font-colors"
          letter="F"
          title="Font Colors"
          description="Override all text colors"
          icon={Type}
          colorTheme="green"
        >
        <div className="space-y-4">
            {/* Enable Custom Font Color Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Label htmlFor="custom-font-color" className="text-sm font-medium text-charcoal cursor-pointer">
                Use Custom Font Color
              </Label>
              <Switch
                id="custom-font-color"
                checked={useCustomFontColor}
                onCheckedChange={setUseCustomFontColor}
                className="data-[state=checked]:bg-sage-green"
              />
            </div>
            
            {useCustomFontColor && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                {/* Set to Default Button */}
                <Button
                  onClick={() => {
                    setUseCustomFontColor(false);
                  }}
                  className="w-full mb-3 bg-white hover:bg-gray-50 text-charcoal border border-gray-200"
                  size="sm"
                >
                  Use Automatic Text Color
                </Button>
                
                {/* Light Colors (for light backgrounds) */}
                <div className="mb-3">
                  <Label className="text-xs font-medium text-medium-gray mb-2 block">
                    DARK COLORS (FOR LIGHT BACKGROUNDS)
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { color: '#333333', name: 'Dark Gray' },
                      { color: '#555555', name: 'Medium Gray' },
                      { color: '#666666', name: 'Light Gray' },
                    ].map(({ color, name }) => (
                      <button
                        key={color}
                        onClick={() => setCustomFontColor(color)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                          customFontColor === color
                            ? 'border-sage-green ring-2 ring-sage-green/30'
                            : 'border-gray-200 hover:border-gray-400'
                        } bg-white`}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-sm border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-charcoal">{name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Dark Colors (for dark backgrounds) */}
                <div className="mb-3">
                  <Label className="text-xs font-medium text-medium-gray mb-2 block">
                    LIGHT COLORS (FOR DARK BACKGROUNDS)
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { color: '#FFFFFF', name: 'Pure White' },
                      { color: '#F5F5F5', name: 'Off White' },
                      { color: '#E0E0E0', name: 'Light Silver' },
                    ].map(({ color, name }) => (
                      <button
                        key={color}
                        onClick={() => setCustomFontColor(color)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                          customFontColor === color
                            ? 'border-sage-green ring-2 ring-sage-green/30'
                            : 'border-gray-200 hover:border-gray-400'
                        } bg-white`}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-sm border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-charcoal">{name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Custom Color Picker */}
                <div>
                  <Label className="text-xs font-medium text-medium-gray mb-1 block">
                    CUSTOM COLOR
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        value={customFontColor}
                        onChange={(e) => {
                          const color = e.target.value;
                          if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
                            setCustomFontColor(color);
                          }
                        }}
                        placeholder="#333333"
                        className="pr-10 text-xs"
                      />
                      <input
                        type="color"
                        value={customFontColor}
                        onChange={(e) => setCustomFontColor(e.target.value)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 border border-gray-200 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Info Tip */}
                <div className="p-2 bg-green-50 rounded-lg mt-3">
                  <p className="text-xs text-green-700">
                    ✏️ This color will override all text elements: headline, city, coordinates, country, and custom text
                  </p>
                </div>
              </div>
            )}
            
            {!useCustomFontColor && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  Text colors are automatically set based on your background color for optimal contrast
                </p>
              </div>
            )}
        </div>
        </MPGAccordionSection>

        {/* Zoom & Position Section */}
        <MPGAccordionSection
          id="zoom-position"
          letter="G"
          title="Zoom & Position"
          description="Adjust map view and position"
          icon={ZoomIn}
          colorTheme="blue"
        >
        <div className="space-y-4">
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
                  className="w-8 h-8 rounded-md bg-sage-green hover:bg-sage-green-dark text-white flex items-center justify-center transition-colors shadow-sm"
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

        {/* Location Pin Section */}
        <MPGAccordionSection
          id="location-pin"
          letter="H"
          title="Location Pin"
          description="Add a custom pin to mark your location"
          icon={Navigation2}
          colorTheme="orange"
        >
        <div className="space-y-4">
          {/* Pin Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-charcoal flex items-center gap-2">
              <Navigation2 className="w-4 h-4 text-sage-green" />
              Show Location Pin
            </Label>
            <Switch
              checked={showPin}
              onCheckedChange={setShowPin}
            />
          </div>

          {showPin && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              {/* Pin Style Selection */}
              <div>
                <Label className="text-xs font-medium text-medium-gray mb-2 block">
                  SELECT YOUR PIN
                </Label>
                <div className="grid grid-cols-5 gap-2">
                  {MPG_PIN_STYLES.map((pin) => (
                    <button
                      key={pin.id}
                      onClick={() => setPinStyle(pin.id as any)}
                      className={`relative p-2 rounded-lg transition-all ${
                        pinStyle === pin.id
                          ? 'bg-sage-green/10 ring-2 ring-sage-green'
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                      }`}
                      title={pin.description}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {/* Actual Pin Icon */}
                        <div className="h-8 flex items-center justify-center">
                          {getPinIcon(pin.id, pinColor, 20)}
                        </div>
                        <span className="text-xs font-medium">
                          {pin.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin Size Selection */}
              <div>
                <Label className="text-xs font-medium text-medium-gray mb-2 block">
                  PIN SIZE
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['S', 'M', 'L'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setPinSize(size)}
                      className={`px-3 py-2 rounded-lg text-xs transition-all ${
                        pinSize === size
                          ? 'bg-gray-200 text-charcoal font-bold italic border-2 border-charcoal shadow-md'
                          : 'bg-white hover:bg-gray-100 text-charcoal font-medium border border-gray-200'
                      }`}
                    >
                      {size === 'S' ? 'Small' : size === 'M' ? 'Medium' : 'Large'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin Color Selection */}
              <div>
                <Label className="text-xs font-medium text-medium-gray mb-2 block">
                  AVAILABLE IN ANY COLOR OF YOUR CHOICE
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {MPG_PIN_COLORS.map((colorOption) => (
                    <button
                      key={colorOption.id}
                      onClick={() => setPinColor(colorOption.color)}
                      className={`relative p-2 rounded-lg transition-all ${
                        pinColor === colorOption.color
                          ? 'ring-2 ring-sage-green'
                          : 'hover:ring-1 hover:ring-gray-300'
                      } bg-white border border-gray-200`}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: colorOption.color }}
                        />
                        <span className="text-xs">{colorOption.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom color input */}
              <div>
                <Label className="text-xs font-medium text-medium-gray mb-1 block">
                  Custom Color
                </Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={pinColor}
                    onChange={(e) => setPinColor(e.target.value)}
                    className="w-12 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={pinColor}
                    onChange={(e) => setPinColor(e.target.value)}
                    placeholder="#FF6B6B"
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Footer Note */}
              <div className="p-3 bg-warm-cream/50 rounded-lg">
                <p className="text-xs text-medium-gray text-center">
                  HAVE A UNIQUE PIN YOU'D LIKE TO USE? LET US KNOW!
                </p>
              </div>
            </div>
          )}
        </div>
        </MPGAccordionSection>
      </MPGAccordionManager>

      {/* Save Draft Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <MPGSaveTemplateButton
          variant="outline"
          className="w-full py-3"
        />
        <p className="text-xs text-center text-gray-500 mt-2">
          Save as draft to continue editing later
        </p>
      </div>
    </div>
  );
}