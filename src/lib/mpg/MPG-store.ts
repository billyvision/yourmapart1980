'use client'
import { create } from 'zustand';
import { MPG_DEFAULT_CONFIG, MPG_MAP_STYLES } from './MPG-constants';
import { MPG_MAP_IMAGE } from './MPG-konva-constants';
import { isMaptilerConfigured } from './MPG-maplibre-service';

// Product database types
interface ProductSize {
  id: number;
  sizeValue: string;
  sizeLabel: string;
  dimensions?: string | null;
  price?: number | null;
  isPopular: boolean;
  displayOrder: number;
}

interface ProductVariation {
  id: number;
  variationType: string;
  variationValue: string;
  variationLabel: string;
  variationDescription?: string | null;
  priceModifier: number;
  isActive: boolean;
  displayOrder: number;
  metadata?: Record<string, unknown> | null;
}

interface Product {
  id: number;
  productType: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  image2?: string | null;
  basePrice?: number | null;
  isActive: boolean;
  displayOrder: number;
  features?: string[] | null;
  sizes: ProductSize[];
  variations: ProductVariation[];
}

interface MPGState {
  // Wizard state
  currentStep: 1 | 2 | 3 | 4;

  // Editor mode
  editorMode: 'basic' | 'advanced';

  // Location data
  city: string;
  lat: number;
  lng: number;
  country: string;
  zoom: number;

  // Map offset for fine-tuning position
  mapOffsetX: number;
  mapOffsetY: number;

  // Style settings
  style: string;
  frameStyle: 'square' | 'circle' | 'heart' | 'house';
  showFrameBorder: boolean;
  glowEffect: boolean;
  glowStyle: 'silverGrey' | 'turquoise' | 'lavender' | 'royalBlue' | 'forestGreen' | 'amber' | 'rosePink' | 'coral' | 'deepViolet' | 'teal' | 'emerald' | 'crimson' | 'sunsetOrange' | 'electricBlue' | 'limeGreen' | 'silverGradient';
  glowIntensity: number;
  backgroundColor: string;
  backgroundImage: 'none' | 'vintage-paper' | 'linen-dark' | 'marble-white' | 'canvas-cream' | 'chalkboard' | 'concrete-blue' | 'paper-gray' | 'crumpled-white';
  backgroundImageOpacity: number;
  textColor: string;
  useCustomBackground: boolean;

  // Text settings
  showCityName: boolean;
  showCoordinates: boolean;
  showCountry: boolean;
  customText: string;
  customTextFont: string;
  customTextSize: 'S' | 'M' | 'L';
  customTextFontWeight: '400' | '700';
  headlineText: string;
  headlineFont: string;
  headlineSize: 'S' | 'M' | 'L';
  headlineAllCaps: boolean;
  headlineFontWeight: '400' | '700';
  titleFont: string;
  titleSize: 'S' | 'M' | 'L';
  coordinatesFont: string;
  coordinatesSize: 'S' | 'M' | 'L';
  countryFont: string;
  countrySize: 'S' | 'M' | 'L';
  subtitleFont: string;
  letterSpacing: number;
  textSpacing: number;

  // Export settings
  exportFormat: 'png' | 'jpg' | 'pdf';
  exportSize: string;
  exportQuality: number;
  isExporting: boolean;

  // Product database state
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;

  // Product selection
  productType: string;
  productSize: string;

  // Product variations (dynamic based on selected variations)
  selectedVariations: Record<string, string>;

  // Map instance reference
  mapInstance: any | null;

  // Map rendering mode
  useVectorMaps: boolean;

  // Vector map feature toggles
  showMapLabels: boolean;
  showMapBuildings: boolean;
  showMapParks: boolean;
  showMapWater: boolean;
  showMapRoads: boolean;

  // Pin settings
  showPin: boolean;
  pinStyle: 'basic' | 'fave' | 'lolli' | 'heart' | 'home';
  pinColor: string;
  pinSize: 'S' | 'M' | 'L';

  // Font color override settings
  useCustomFontColor: boolean;
  customFontColor: string;
  
  // Actions
  setCity: (city: string, lat: number, lng: number, country: string) => void;
  setZoom: (zoom: number) => void;
  adjustZoom: (delta: number) => void;
  panMap: (deltaX: number, deltaY: number) => void;
  resetMapPosition: () => void;
  setStyle: (style: string) => void;
  setFrameStyle: (frameStyle: 'square' | 'circle' | 'heart' | 'house') => void;
  setShowFrameBorder: (show: boolean) => void;
  setGlowEffect: (enabled: boolean) => void;
  setGlowStyle: (style: 'silverGrey' | 'turquoise' | 'lavender' | 'royalBlue' | 'forestGreen' | 'amber' | 'rosePink' | 'coral' | 'deepViolet' | 'teal' | 'emerald' | 'crimson' | 'sunsetOrange' | 'electricBlue' | 'limeGreen' | 'silverGradient') => void;
  setGlowIntensity: (intensity: number) => void;
  setBackgroundColor: (color: string) => void;
  setBackgroundImage: (image: 'none' | 'vintage-paper' | 'linen-dark' | 'marble-white' | 'canvas-cream' | 'chalkboard' | 'concrete-blue' | 'paper-gray' | 'crumpled-white') => void;
  setBackgroundImageOpacity: (opacity: number) => void;
  setTextColor: (color: string) => void;
  setUseCustomBackground: (use: boolean) => void;
  setShowCityName: (show: boolean) => void;
  setShowCoordinates: (show: boolean) => void;
  setShowCountry: (show: boolean) => void;
  setCustomText: (text: string) => void;
  setCustomTextFont: (font: string) => void;
  setCustomTextSize: (size: 'S' | 'M' | 'L') => void;
  setCustomTextFontWeight: (weight: '400' | '700') => void;
  setHeadlineText: (text: string) => void;
  setHeadlineFont: (font: string) => void;
  setHeadlineSize: (size: 'S' | 'M' | 'L') => void;
  setHeadlineAllCaps: (allCaps: boolean) => void;
  setHeadlineFontWeight: (weight: '400' | '700') => void;
  setTitleFont: (font: string) => void;
  setTitleSize: (size: 'S' | 'M' | 'L') => void;
  setCoordinatesFont: (font: string) => void;
  setCoordinatesSize: (size: 'S' | 'M' | 'L') => void;
  setCountryFont: (font: string) => void;
  setCountrySize: (size: 'S' | 'M' | 'L') => void;
  setSubtitleFont: (font: string) => void;
  setLetterSpacing: (spacing: number) => void;
  setTextSpacing: (spacing: number) => void;
  setExportFormat: (format: 'png' | 'jpg' | 'pdf') => void;
  setExportSize: (size: string) => void;
  setExportQuality: (quality: number) => void;
  setIsExporting: (isExporting: boolean) => void;
  // Product actions
  fetchProducts: () => Promise<void>;
  setProductType: (type: string) => void;
  setProductSize: (size: string) => void;
  setVariation: (variationType: string, variationValue: string) => void;
  getSelectedProduct: () => Product | undefined;
  getSelectedSize: () => ProductSize | undefined;
  getCurrentPrice: () => number;
  setMapInstance: (instance: any) => void;
  setUseVectorMaps: (use: boolean) => void;
  setShowMapLabels: (show: boolean) => void;
  setShowMapBuildings: (show: boolean) => void;
  setShowMapParks: (show: boolean) => void;
  setShowMapWater: (show: boolean) => void;
  setShowMapRoads: (show: boolean) => void;
  setShowPin: (show: boolean) => void;
  setPinStyle: (style: 'basic' | 'fave' | 'lolli' | 'heart' | 'home') => void;
  setPinColor: (color: string) => void;
  setPinSize: (size: 'S' | 'M' | 'L') => void;
  setUseCustomFontColor: (use: boolean) => void;
  setCustomFontColor: (color: string) => void;
  resetToDefaults: () => void;
  
  // Editor mode actions
  setEditorMode: (mode: 'basic' | 'advanced') => void;
  
  // Wizard actions
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  previousStep: () => void;
  canProceed: () => boolean;
  
  // Computed values
  getCurrentStyle: () => typeof MPG_MAP_STYLES[0] | undefined;
  getCoordinatesText: () => string;

  // Database persistence
  saveTemplate: (templateName: string, thumbnailUrl?: string) => Promise<number | null>;
  loadTemplate: (templateId: number) => Promise<void>;
  updateTemplate: (templateId: number, templateName?: string) => Promise<void>;
  deleteTemplate: (templateId: number) => Promise<void>;
  getTemplateData: () => any;
  loadFromTemplateData: (data: any) => void;
}

export const useMPGStore = create<MPGState>((set, get) => ({
  // Initial state from defaults
  ...MPG_DEFAULT_CONFIG,
  currentStep: 1,
  editorMode: 'basic' as 'basic' | 'advanced',
  isExporting: false,
  mapInstance: null,
  mapOffsetX: 0,
  mapOffsetY: 0,

  // Product database state
  products: [],
  productsLoading: false,
  productsError: null,
  productType: 'digital',
  productSize: '8x10',
  selectedVariations: {},

  frameStyle: 'square' as 'square' | 'circle' | 'heart' | 'house', // Explicitly set square as default
  showFrameBorder: false, // Default to false for square frame (default frame style)
  useVectorMaps: true, // Default to vector maps (better quality)
  showMapLabels: false, // Blueprint 2 default: OFF
  showMapBuildings: true,  // Blueprint 2 default: ON
  showMapParks: false,     // Blueprint 2 default: OFF
  showMapWater: false,     // Blueprint 2 default: OFF
  showMapRoads: true,      // Blueprint 2 default: ON
  showCityName: true, // Show city name by default
  showPin: true,           // Pin ON by default
  pinStyle: 'heart' as 'basic' | 'fave' | 'lolli' | 'heart' | 'home', // Heart by default
  pinColor: '#FF6B6B',     // Coral red default like in reference
  pinSize: 'M' as 'S' | 'M' | 'L', // Medium size by default
  glowEffect: false,
  glowStyle: 'silverGrey' as 'silverGrey' | 'turquoise' | 'lavender' | 'royalBlue' | 'forestGreen' | 'amber' | 'rosePink' | 'coral' | 'deepViolet' | 'teal' | 'emerald' | 'crimson' | 'sunsetOrange' | 'electricBlue' | 'limeGreen' | 'silverGradient',
  glowIntensity: 0.4, // Default to 40% intensity
  backgroundColor: '#ffffff',
  backgroundImage: 'none' as 'none' | 'vintage-paper' | 'linen-dark' | 'marble-white' | 'canvas-cream' | 'chalkboard' | 'concrete-blue' | 'paper-gray' | 'crumpled-white',
  backgroundImageOpacity: 100, // Default to full opacity
  textColor: '#333333',
  useCustomBackground: false,
  titleSize: 'M' as 'S' | 'M' | 'L',
  coordinatesFont: 'roboto',
  coordinatesSize: 'M' as 'S' | 'M' | 'L',
  countryFont: 'roboto',
  countrySize: 'M' as 'S' | 'M' | 'L',
  headlineText: '',
  headlineFont: 'Montserrat', // Modern, clean default font
  headlineSize: 'M' as 'S' | 'M' | 'L',
  headlineAllCaps: true,
  headlineFontWeight: '400' as '400' | '700', // Default to normal weight for better appearance
  useCustomFontColor: false, // Default to using automatic text color
  customFontColor: '#333333', // Default font color when custom is enabled
  
  // Actions
  setCity: (city, lat, lng, country) => set({ city, lat, lng, country, mapOffsetX: 0, mapOffsetY: 0 }),
  setZoom: (zoom) => set({ zoom: Math.max(1, Math.min(20, zoom)) }),
  
  adjustZoom: (delta) => {
    const { zoom } = get();
    set({ zoom: Math.max(1, Math.min(20, zoom + delta)) });
  },
  
  panMap: (deltaX, deltaY) => {
    const { mapOffsetX, mapOffsetY } = get();
    const maxOffset = MPG_MAP_IMAGE.maxOffset || 180;
    
    // Clamp the offsets to prevent excessive panning
    const newOffsetX = Math.max(-maxOffset, Math.min(maxOffset, mapOffsetX + deltaX));
    const newOffsetY = Math.max(-maxOffset, Math.min(maxOffset, mapOffsetY + deltaY));
    
    set({ 
      mapOffsetX: newOffsetX,
      mapOffsetY: newOffsetY
    });
  },
  
  resetMapPosition: () => set({ mapOffsetX: 0, mapOffsetY: 0 }),
  setStyle: (style) => set({ style }),
  setFrameStyle: (frameStyle) => set({ 
    frameStyle,
    // Automatically enable border for non-square frames
    showFrameBorder: frameStyle !== 'square' ? true : get().showFrameBorder
  }),
  setShowFrameBorder: (showFrameBorder) => set({ showFrameBorder }),
  setGlowEffect: (glowEffect) => set({ glowEffect }),
  setGlowStyle: (glowStyle) => set({ glowStyle }),
  setGlowIntensity: (glowIntensity) => set({ glowIntensity }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setBackgroundImage: (backgroundImage) => set({ backgroundImage }),
  setBackgroundImageOpacity: (backgroundImageOpacity) => set({ backgroundImageOpacity }),
  setTextColor: (textColor) => set({ textColor }),
  setUseCustomBackground: (useCustomBackground) => set({ useCustomBackground }),
  setShowCityName: (showCityName) => set({ showCityName }),
  setShowCoordinates: (showCoordinates) => set({ showCoordinates }),
  setShowCountry: (showCountry) => set({ showCountry }),
  setCustomText: (customText) => set({ customText }),
  setCustomTextFont: (customTextFont) => set({ customTextFont }),
  setCustomTextSize: (customTextSize) => set({ customTextSize }),
  setCustomTextFontWeight: (customTextFontWeight) => set({ customTextFontWeight }),
  setHeadlineText: (headlineText) => set({ headlineText }),
  setHeadlineFont: (headlineFont) => set({ headlineFont }),
  setHeadlineSize: (headlineSize) => set({ headlineSize }),
  setHeadlineAllCaps: (headlineAllCaps) => set({ headlineAllCaps }),
  setHeadlineFontWeight: (headlineFontWeight) => set({ headlineFontWeight }),
  setTitleFont: (titleFont) => set({ titleFont }),
  setTitleSize: (titleSize) => set({ titleSize }),
  setCoordinatesFont: (coordinatesFont) => set({ coordinatesFont }),
  setCoordinatesSize: (coordinatesSize) => set({ coordinatesSize }),
  setCountryFont: (countryFont) => set({ countryFont }),
  setCountrySize: (countrySize) => set({ countrySize }),
  setSubtitleFont: (subtitleFont) => set({ subtitleFont }),
  setLetterSpacing: (letterSpacing) => set({ letterSpacing }),
  setTextSpacing: (textSpacing) => set({ textSpacing }),
  setExportFormat: (exportFormat) => set({ exportFormat }),
  setExportSize: (exportSize) => set({ exportSize }),
  setExportQuality: (exportQuality) => set({ exportQuality }),
  setIsExporting: (isExporting) => set({ isExporting }),

  // Product actions
  fetchProducts: async () => {
    set({ productsLoading: true, productsError: null });
    try {
      const response = await fetch('/api/products', {
        signal: AbortSignal.timeout(20000) // 20 second timeout
      });

      const data = await response.json();
      const products = data.products || [];

      // Check if there was a retryable error
      if (data.error && data.retryable) {
        console.warn('Database connection issue:', data.error);
        set({
          products: [], // Empty array for now
          productsLoading: false,
          productsError: data.error
        });
        return;
      }

      set({ products, productsLoading: false });

      // Set first product and size as defaults if available
      if (products.length > 0) {
        const firstProduct = products[0];
        const firstSize = firstProduct.sizes[0]?.sizeValue || '8x10';
        set({
          productType: firstProduct.productType,
          productSize: firstSize
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      const errorMessage = error instanceof Error ? error.message : 'Connection timeout';
      set({
        products: [], // Return empty array instead of failing
        productsError: `${errorMessage}. Using default options.`,
        productsLoading: false
      });
    }
  },

  setProductType: (productType) => {
    const { products } = get();
    const product = products.find(p => p.productType === productType);
    if (product && product.sizes.length > 0) {
      const firstSize = product.sizes[0].sizeValue;
      set({ productType, productSize: firstSize, selectedVariations: {} });
    } else {
      set({ productType, selectedVariations: {} });
    }
  },

  setProductSize: (productSize) => set({ productSize }),

  setVariation: (variationType, variationValue) => {
    const { selectedVariations } = get();
    set({
      selectedVariations: {
        ...selectedVariations,
        [variationType]: variationValue
      }
    });
  },

  getSelectedProduct: () => {
    const { products, productType } = get();
    return products.find(p => p.productType === productType);
  },

  getSelectedSize: () => {
    const product = get().getSelectedProduct();
    const { productSize } = get();
    return product?.sizes.find(s => s.sizeValue === productSize);
  },

  getCurrentPrice: () => {
    const product = get().getSelectedProduct();
    const size = get().getSelectedSize();
    const { selectedVariations } = get();

    if (!product || !size) return 0;

    // Start with size price or base price
    let price = size.price || product.basePrice || 0;

    // Add variation price modifiers
    if (product.variations) {
      Object.entries(selectedVariations).forEach(([type, value]) => {
        const variation = product.variations.find(
          v => v.variationType === type && v.variationValue === value
        );
        if (variation) {
          price += variation.priceModifier;
        }
      });
    }

    return price;
  },

  setMapInstance: (mapInstance) => set({ mapInstance }),
  setUseVectorMaps: (useVectorMaps) => set({ useVectorMaps }),
  setShowMapLabels: (showMapLabels) => set({ showMapLabels }),
  setShowMapBuildings: (showMapBuildings) => set({ showMapBuildings }),
  setShowMapParks: (showMapParks) => set({ showMapParks }),
  setShowMapWater: (showMapWater) => set({ showMapWater }),
  setShowMapRoads: (showMapRoads) => set({ showMapRoads }),
  setShowPin: (showPin) => set({ showPin }),
  setPinStyle: (pinStyle) => set({ pinStyle }),
  setPinColor: (pinColor) => set({ pinColor }),
  setPinSize: (pinSize) => set({ pinSize }),
  setUseCustomFontColor: (useCustomFontColor) => set({ useCustomFontColor }),
  setCustomFontColor: (customFontColor) => set({ customFontColor }),
  
  resetToDefaults: () => set({ 
    ...MPG_DEFAULT_CONFIG, 
    currentStep: 1, 
    mapOffsetX: 0, 
    mapOffsetY: 0, 
    frameStyle: 'square' as 'square' | 'circle' | 'heart' | 'house', // Default to square
    useVectorMaps: true,
    showMapLabels: false,    // Blueprint 2 default: OFF
    showMapBuildings: true,  // Blueprint 2 default: ON
    showMapParks: false,     // Blueprint 2 default: OFF  
    showMapWater: false,     // Blueprint 2 default: OFF
    showMapRoads: true,      // Blueprint 2 default: ON
    showCityName: true,
    showPin: true,  // Pin ON by default
    pinStyle: 'heart' as 'basic' | 'fave' | 'lolli' | 'heart' | 'home', // Heart by default
    pinColor: '#FF6B6B',
    pinSize: 'M' as 'S' | 'M' | 'L',
    backgroundColor: '#ffffff',
    backgroundImage: 'none' as 'none' | 'vintage-paper' | 'linen-dark' | 'marble-white' | 'canvas-cream' | 'chalkboard' | 'concrete-blue' | 'paper-gray' | 'crumpled-white',
    backgroundImageOpacity: 100,
    textColor: '#333333',
    useCustomBackground: false,
    glowEffect: false,
    glowStyle: 'silverGrey' as 'silverGrey' | 'turquoise' | 'lavender' | 'royalBlue' | 'forestGreen' | 'amber' | 'rosePink' | 'coral' | 'deepViolet' | 'teal' | 'emerald' | 'crimson' | 'sunsetOrange' | 'electricBlue' | 'limeGreen' | 'silverGradient',
    glowIntensity: 0.4, // Default to 40% intensity
    headlineText: '',
    headlineFont: 'Montserrat',
    headlineSize: 'M' as 'S' | 'M' | 'L',
    headlineAllCaps: true,
    headlineFontWeight: '400' as '400' | '700'
  }),
  
  // Editor mode actions
  setEditorMode: (editorMode) => set({ editorMode }),
  
  // Wizard actions
  setCurrentStep: (currentStep) => set({ currentStep }),
  
  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 4) {
      set({ currentStep: (currentStep + 1) as 1 | 2 | 3 | 4 });
    }
  },
  
  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as 1 | 2 | 3 | 4 });
    }
  },
  
  canProceed: () => {
    const state = get();
    switch (state.currentStep) {
      case 1:
        // Step 1: Must have a city selected
        return state.city !== '';
      case 2:
        // Step 2: Always can proceed (text has defaults)
        return true;
      case 3:
        // Step 3: Always can proceed (style has default)
        return true;
      case 4:
        // Step 4: Final step, no next
        return false;
      default:
        return false;
    }
  },
  
  // Computed values
  getCurrentStyle: () => {
    const state = get();
    return MPG_MAP_STYLES.find(s => s.id === state.style);
  },
  
  getCoordinatesText: () => {
    const { lat, lng } = get();
    const latText = `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'N' : 'S'}`;
    const lngText = `${Math.abs(lng).toFixed(4)}°${lng >= 0 ? 'E' : 'W'}`;
    return `${latText} / ${lngText}`;
  },

  // Database persistence methods
  getTemplateData: () => {
    const state = get();
    return {
      location: {
        lat: state.lat,
        lng: state.lng,
        zoom: state.zoom,
        title: state.city,
        country: state.country,
        city: state.city,
      },
      text: {
        title: state.headlineText || state.city,
        subtitle: state.customText,
        coordinates: state.getCoordinatesText(),
        country: state.showCountry ? state.country : undefined,
        customText: state.customText,
      },
      style: {
        mapStyle: state.style,
        colorScheme: state.backgroundColor,
        backgroundImage: state.backgroundImage,
        backgroundImageOpacity: state.backgroundImageOpacity,
        tileProvider: state.useVectorMaps ? 'maptiler' : 'osm',
      },
      settings: {
        frameStyle: state.frameStyle,
        showPin: state.showPin,
        pinStyle: state.pinStyle,
        glowEffect: state.glowEffect ? state.glowStyle : 'none',
        showLabels: state.showMapLabels,
        showRoads: state.showMapRoads,
        showBuildings: state.showMapBuildings,
      },
      fonts: {
        titleFont: state.titleFont,
        subtitleFont: state.subtitleFont,
        coordinatesFont: state.coordinatesFont,
        customTextFont: state.customTextFont,
        customTextSize: state.customTextSize,
        customTextFontWeight: state.customTextFontWeight,
        headlineFont: state.headlineFont,
        headlineSize: state.headlineSize,
        headlineAllCaps: state.headlineAllCaps,
        headlineFontWeight: state.headlineFontWeight,
      },
    };
  },

  loadFromTemplateData: (data: any) => {
    if (!data) return;

    set({
      // Location
      lat: data.location?.lat || 0,
      lng: data.location?.lng || 0,
      zoom: data.location?.zoom || 13,
      city: data.location?.title || data.location?.city || '',
      country: data.location?.country || '',

      // Text
      headlineText: data.text?.title || '',
      customText: data.text?.subtitle || data.text?.customText || '',
      showCountry: !!data.text?.country,

      // Style
      style: data.style?.mapStyle || 'midnight',
      backgroundColor: data.style?.colorScheme || '#ffffff',
      backgroundImage: data.style?.backgroundImage || 'none',
      backgroundImageOpacity: data.style?.backgroundImageOpacity !== undefined ? data.style.backgroundImageOpacity : 100,
      useVectorMaps: data.style?.tileProvider === 'maptiler',

      // Settings
      frameStyle: data.settings?.frameStyle || 'square',
      showPin: data.settings?.showPin !== false,
      pinStyle: data.settings?.pinStyle || 'heart',
      glowEffect: data.settings?.glowEffect !== 'none',
      glowStyle: data.settings?.glowEffect !== 'none' ? data.settings?.glowEffect : 'silverGrey',
      showMapLabels: data.settings?.showLabels || false,
      showMapRoads: data.settings?.showRoads !== false,
      showMapBuildings: data.settings?.showBuildings !== false,

      // Fonts
      titleFont: data.fonts?.titleFont || 'Montserrat',
      subtitleFont: data.fonts?.subtitleFont || 'roboto',
      coordinatesFont: data.fonts?.coordinatesFont || 'roboto',
      customTextFont: data.fonts?.customTextFont || 'roboto',
      customTextSize: data.fonts?.customTextSize || 'M',
      // Backward compatibility: default to '400' for better appearance if not specified
      customTextFontWeight: data.fonts?.customTextFontWeight || '400',
      headlineFont: data.fonts?.headlineFont || 'Montserrat',
      headlineSize: data.fonts?.headlineSize || 'M',
      headlineAllCaps: data.fonts?.headlineAllCaps !== undefined ? data.fonts.headlineAllCaps : true,
      // Backward compatibility: default to '400' for better appearance if not specified
      headlineFontWeight: data.fonts?.headlineFontWeight || '400',
    });
  },

  saveTemplate: async (templateName: string, thumbnailUrl?: string) => {
    try {
      const templateData = get().getTemplateData();

      const response = await fetch('/api/mpg/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateName,
          templateData,
          thumbnailUrl,
          isPublic: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save template');
      }

      const saved = await response.json();
      return saved.id;
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  },

  loadTemplate: async (templateId: number) => {
    try {
      const response = await fetch(`/api/mpg/templates/${templateId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load template');
      }

      const template = await response.json();
      get().loadFromTemplateData(template.templateData);
    } catch (error) {
      console.error('Error loading template:', error);
      throw error;
    }
  },

  updateTemplate: async (templateId: number, templateName?: string) => {
    try {
      const templateData = get().getTemplateData();

      const response = await fetch(`/api/mpg/templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateName,
          templateData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  deleteTemplate: async (templateId: number) => {
    try {
      const response = await fetch(`/api/mpg/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },
}));