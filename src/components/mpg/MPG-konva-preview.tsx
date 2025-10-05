'use client'
import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage, Shape, Circle, Path } from 'react-konva';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { fetchStaticMapImage } from '@/lib/mpg/MPG-map-service';
import { applyStyleFilters } from '@/lib/mpg/MPG-konva-filters';
import { useMapLibreImage, isMapLibreAvailable } from '@/lib/mpg/MPG-maplibre-renderer';
import { getSnazzyStyle } from '@/lib/mpg/MPG-snazzy-styles';
import {
  MPG_BASE_CANVAS,
  MPG_BASE_MAP,
  MPG_SQUARE_FRAME,
  MPG_CIRCLE_FRAME,
  MPG_HEART_FRAME,
  MPG_HOUSE_FRAME,
  MPG_MAP_IMAGE,
  MPG_KONVA_TEXT_LAYOUT,
  MPG_KONVA_WATERMARK,
  MPG_KONVA_FONTS,
  MPG_KONVA_COLOR_SCHEMES,
  MPG_KONVA_FRAME_CLIPS,
  MPG_KONVA_EXPORT_SETTINGS,
  MPG_KONVA_GLOW_EFFECTS
} from '@/lib/mpg/MPG-konva-constants';
import Konva from 'konva';

interface MPGKonvaPreviewProps {
  containerRef?: React.RefObject<HTMLDivElement>;
  isExportMode?: boolean;
  exportSize?: 'A4' | 'Letter' | 'Square' | 'Portrait' | 'Landscape';
  showWatermark?: boolean;
  onExportReady?: (stage: any) => void;
}

export function MPGKonvaPreview({
  containerRef,
  isExportMode = false,
  exportSize = 'A4',
  showWatermark = true,
  onExportReady
}: MPGKonvaPreviewProps) {
  const stageRef = useRef<any>(null);
  const containerDivRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  // Always use base canvas dimensions for layout
  const baseDimensions = MPG_BASE_CANVAS;
  
  // Calculate scaled dimensions for display
  const scaledWidth = baseDimensions.width * scale;
  const scaledHeight = baseDimensions.height * scale;
  
  const {
    city,
    lat,
    lng,
    country,
    zoom,
    mapOffsetX,
    mapOffsetY,
    style,
    frameStyle,
    showFrameBorder,
    glowEffect,
    glowStyle,
    glowIntensity,
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
    showPin,
    pinStyle,
    pinColor,
    pinSize,
    backgroundColor,
    textColor,
    useCustomBackground,
    useCustomFontColor,
    customFontColor,
    getCoordinatesText
  } = useMPGStore();
  
  // Get color scheme from Snazzy style or use custom colors
  const snazzyStyle = getSnazzyStyle(style);
  // Determine text colors based on font color override or background settings
  const baseTextColor = useCustomBackground ? textColor : (snazzyStyle?.textColor || '#333333');
  const finalTextColor = useCustomFontColor ? customFontColor : baseTextColor;
  
  const colorScheme = {
    background: useCustomBackground ? backgroundColor : (snazzyStyle?.background || '#ffffff'),
    text: finalTextColor,
    coordinates: finalTextColor,
    country: finalTextColor,
    customText: finalTextColor
  };
  
  // Always use MapLibre for vector maps
  const mapLibreResult = isMapLibreAvailable() ? useMapLibreImage(
    MPG_MAP_IMAGE.width,
    MPG_MAP_IMAGE.height,
    { isExport: isExportMode, dpi: 96 }
  ) : { image: null, isLoading: false, error: null, refresh: () => {} };
  
  // Load map image - use MapLibre, fallback to raster tiles if not available
  useEffect(() => {
    if (isMapLibreAvailable()) {
      // MapLibre handles loading via the hook
      if (mapLibreResult.image) {
        setMapImage(mapLibreResult.image);
        setMapLoading(false);
      } else if (mapLibreResult.isLoading) {
        setMapLoading(true);
      } else if (mapLibreResult.error) {
        console.error('MapLibre error, falling back to raster:', mapLibreResult.error);
        // Fallback to raster on error
        loadRasterMap();
      }
    } else {
      // Use raster tiles as fallback
      loadRasterMap();
    }
    
    async function loadRasterMap() {
      try {
        setMapLoading(true);
        const img = await fetchStaticMapImage({
          lat,
          lng,
          zoom,
          width: MPG_MAP_IMAGE.width,
          height: MPG_MAP_IMAGE.height,
          style
        });
        setMapImage(img);
        setMapLoading(false);
      } catch (error) {
        console.error('Failed to load map image:', error);
        setMapLoading(false);
      }
    }
  }, [lat, lng, zoom, style, mapLibreResult.image, mapLibreResult.isLoading, mapLibreResult.error]);
  
  
  // Load fonts
  useEffect(() => {
    const loadFonts = async () => {
      setShowContent(false);
      setFontsLoaded(false);
      
      // Comprehensive font mapping for all headline fonts (moved to top level)
      const headlineFontFiles: Record<string, string | null> = {
        // Modern Sans-Serif
        'Montserrat': '/mpg/fonts/Montserrat-Regular.ttf',  // Using TTF (woff2 is empty)
        'Raleway': null,  // Use Google Fonts (local file is empty)
        'Roboto': '/mpg/fonts/roboto-400.woff2',
        'Lato': null,  // Use Google Fonts (local file is empty)
        'Oswald': null,  // Use Google Fonts (local file is empty)
        
        // Display & Impact
        'Bebas Neue': '/mpg/fonts/BebasNeue-Regular.ttf',
        'Anton': '/mpg/fonts/Anton-Regular.ttf',
        'Archivo Black': '/mpg/fonts/ArchivoBlack-Regular.ttf',
        'Ultra': '/mpg/fonts/Ultra-Regular.ttf',
        'Titan One': '/mpg/fonts/TitanOne-Regular.ttf',
        'Fredoka One': '/mpg/fonts/FredokaOne-Regular.ttf',
        'Righteous': '/mpg/fonts/Righteous-Regular.ttf',
        'Bungee': '/mpg/fonts/Bungee-Regular.ttf',
        'Black Ops One': '/mpg/fonts/BlackOpsOne-Regular.ttf',
        
        // Tech & Gaming
        'Orbitron': '/mpg/fonts/Orbitron-Regular.ttf',
        'Russo One': '/mpg/fonts/RussoOne-Regular.ttf',
        'Press Start 2P': '/mpg/fonts/PressStart2P-Regular.ttf',
        
        // Elegant Serif
        'Playfair Display': '/mpg/fonts/playfair-display-400.woff2',
        
        // Script & Handwritten
        'Pacifico': '/mpg/fonts/Pacifico-Regular.ttf',
        'Lobster': '/mpg/fonts/Lobster-Regular.ttf',
        'Dancing Script': '/mpg/fonts/DancingScript-Regular.ttf',
        'Kaushan Script': '/mpg/fonts/KaushanScript-Regular.ttf',
        'Satisfy': '/mpg/fonts/satisfy-400.woff2',
        'Caveat': '/mpg/fonts/Caveat-Regular.ttf',
        'Courgette': '/mpg/fonts/Courgette-Regular.ttf',
        'Yellowtail': '/mpg/fonts/Yellowtail-Regular.ttf',
        'Alex Brush': '/mpg/fonts/AlexBrush-Regular.ttf',
        'Sacramento': '/mpg/fonts/Sacramento-Regular.ttf',
        'Cookie': '/mpg/fonts/Cookie-Regular.ttf',
        'Tangerine': '/mpg/fonts/TangeriNE-Regular.ttf',
        'Pinyon Script': '/mpg/fonts/PinyonScript-Regular.ttf',
        'Great Vibes': '/mpg/fonts/great-vibes-400.woff2',
        'Allura': '/mpg/fonts/allura-400.woff2',
        
        // Fun & Playful
        'Amatic SC': '/mpg/fonts/AmaticSC-Bold.ttf',
        'Kalam': '/mpg/fonts/kalam-400.woff2'
      };
      
      // Load title font
      const titleFontDef = MPG_KONVA_FONTS.title[titleFont as keyof typeof MPG_KONVA_FONTS.title];
      if (titleFontDef && titleFontDef.googleFont) {
        const linkId = `mpg-font-${titleFontDef.family.replace(/ /g, '-')}-${titleFontDef.weight}`;
        if (!document.getElementById(linkId)) {
          const link = document.createElement('link');
          link.id = linkId;
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${titleFontDef.family.replace(/ /g, '+')}:wght@${titleFontDef.weight}&display=swap`;
          document.head.appendChild(link);
        }
      }
      
      // Load headline font if headline text exists
      if (headlineText && headlineFont) {
        const headlineFontLinkId = `mpg-headline-font-${headlineFont.replace(/ /g, '-')}`;
        
        if (!document.getElementById(headlineFontLinkId)) {
          const localFontFile = headlineFontFiles[headlineFont];
          
          if (localFontFile) {
            // Use local font file
            const style = document.createElement('style');
            style.id = headlineFontLinkId;
            const isWoff2 = localFontFile.endsWith('.woff2');
            style.textContent = `
              @font-face {
                font-family: '${headlineFont}';
                src: url('${localFontFile}') format('${isWoff2 ? 'woff2' : 'truetype'}');
                font-weight: normal;
                font-style: normal;
                font-display: swap;
              }
            `;
            document.head.appendChild(style);
          } else {
            // Use Google Fonts for fonts with empty local files
            const link = document.createElement('link');
            link.id = headlineFontLinkId;
            link.rel = 'stylesheet';
            
            // Map fonts to their Google Fonts URLs with appropriate weights
            const googleFontUrls: Record<string, string> = {
              'Raleway': 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap',
              'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap',
              'Oswald': 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap'
            };
            
            if (googleFontUrls[headlineFont]) {
              link.href = googleFontUrls[headlineFont];
              document.head.appendChild(link);
            }
          }
        }
      }
      
      // Helper function to load any font
      const loadFont = (fontName: string, fontType: 'title' | 'body' = 'title') => {
        if (!fontName) return;
        
        const fontLinkId = `mpg-font-link-${fontName.replace(/ /g, '-')}`;
        
        // Skip if already loaded
        if (document.getElementById(fontLinkId)) return;
        
        // First check if it's a local font file
        const localFontFile = headlineFontFiles[fontName];
        
        if (localFontFile) {
          // Use local font file
          const style = document.createElement('style');
          style.id = fontLinkId;
          const isWoff2 = localFontFile.endsWith('.woff2');
          style.textContent = `
            @font-face {
              font-family: '${fontName}';
              src: url('${localFontFile}') format('${isWoff2 ? 'woff2' : 'truetype'}');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
          `;
          document.head.appendChild(style);
        } else {
          // Use Google Fonts
          const link = document.createElement('link');
          link.id = fontLinkId;
          link.rel = 'stylesheet';
          
          // Map fonts to their Google Fonts URLs
          const googleFontUrls: Record<string, string> = {
            'Raleway': 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap',
            'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap',
            'Oswald': 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap',
            'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
            'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap'
          };
          
          if (googleFontUrls[fontName]) {
            link.href = googleFontUrls[fontName];
            document.head.appendChild(link);
          } else {
            // For any other Google Font not explicitly mapped
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
            document.head.appendChild(link);
          }
        }
      };
      
      // Load all fonts being used
      loadFont(titleFont);
      loadFont(coordinatesFont);
      loadFont(countryFont);
      loadFont(customTextFont);
      
      // Wait for fonts to load
      await document.fonts.ready;
      
      // Try to load specific fonts
      const loadPromises = [];
      if (titleFontDef) {
        const fontWeight = titleFontDef.weight === 400 ? 'normal' : titleFontDef.weight === 700 ? 'bold' : titleFontDef.weight.toString();
        loadPromises.push(document.fonts.load(`${fontWeight} 1px "${titleFontDef.family}"`).catch(() => {}));
      }
      if (headlineText && headlineFont) {
        loadPromises.push(document.fonts.load(`700 1px "${headlineFont}"`).catch(() => {}));
      }
      if (titleFont) {
        loadPromises.push(document.fonts.load(`400 1px "${titleFont}"`).catch(() => {}));
      }
      if (coordinatesFont) {
        loadPromises.push(document.fonts.load(`400 1px "${coordinatesFont}"`).catch(() => {}));
      }
      if (countryFont) {
        loadPromises.push(document.fonts.load(`400 1px "${countryFont}"`).catch(() => {}));
      }
      if (customText && customTextFont) {
        loadPromises.push(document.fonts.load(`italic 1px "${customTextFont}"`).catch(() => {}));
      }
      
      await Promise.all(loadPromises);
      
      // Small delay to ensure proper rendering
      await new Promise(resolve => setTimeout(resolve, 300));
      setFontsLoaded(true);
      setShowContent(true);
      
      // Force redraw after fonts loaded
      if (stageRef.current) {
        stageRef.current.batchDraw();
      }
    };
    
    loadFonts();
  }, [titleFont, coordinatesFont, countryFont, customTextFont, customText, headlineFont, headlineText, headlineAllCaps]);
  
  // Update scale based on container size
  useEffect(() => {
    if (isExportMode) {
      // For export mode, no scaling needed - use base dimensions
      setScale(1);
      return;
    }
    
    const updateScale = () => {
      const container = containerRef?.current || containerDivRef.current;
      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight || (containerWidth * baseDimensions.height / baseDimensions.width);
        
        setContainerDimensions({ 
          width: containerWidth, 
          height: containerHeight 
        });
        
        // Calculate scale to fit container while maintaining aspect ratio
        const scaleX = containerWidth / baseDimensions.width;
        const scaleY = containerHeight / baseDimensions.height;
        const newScale = Math.min(scaleX, scaleY);
        
        setScale(newScale);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    
    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, [isExportMode, containerRef, baseDimensions]);
  
  // Get font family
  const getFontFamily = (fontType: 'title' | 'body', fontId: string) => {
    // First check if it's one of the original MPG_KONVA_FONTS
    if (fontType === 'title') {
      const fontDef = MPG_KONVA_FONTS.title[fontId as keyof typeof MPG_KONVA_FONTS.title];
      if (fontDef) return fontDef.family;
    } else {
      const fontDef = MPG_KONVA_FONTS.body[fontId as keyof typeof MPG_KONVA_FONTS.body];
      if (fontDef) return fontDef.family;
    }
    
    // If not found in MPG_KONVA_FONTS, use the fontId directly as the font family name
    // This allows all 36 fonts to work properly
    return fontId || 'Roboto';
  };
  
  // Get the appropriate square frame dimensions based on headline presence
  const getSquareFrameDimensions = () => {
    return headlineText ? MPG_SQUARE_FRAME.withHeadline : MPG_SQUARE_FRAME.default;
  };

  // Get the appropriate circle frame dimensions based on headline presence
  const getCircleFrameDimensions = () => {
    return headlineText ? MPG_CIRCLE_FRAME.withHeadline : MPG_CIRCLE_FRAME.default;
  };

  // Get the appropriate heart frame dimensions based on headline presence
  const getHeartFrameDimensions = () => {
    return headlineText ? MPG_HEART_FRAME.withHeadline : MPG_HEART_FRAME.default;
  };

  // Get the appropriate house frame dimensions based on headline presence
  const getHouseFrameDimensions = () => {
    return headlineText ? MPG_HOUSE_FRAME.withHeadline : MPG_HOUSE_FRAME.default;
  };

  // Generic helper to get frame dimensions based on frame style
  const getFrameDimensions = () => {
    switch(frameStyle) {
      case 'square': return getSquareFrameDimensions();
      case 'circle': return getCircleFrameDimensions();
      case 'heart': return getHeartFrameDimensions();
      case 'house': return getHouseFrameDimensions();
      default: return MPG_BASE_MAP; // Fallback to base map dimensions
    }
  };

  // Get frame clipping configuration
  const getFrameClip = () => {
    // For square frame, use the specific square frame dimensions for clipping
    if (frameStyle === 'square') {
      const squareFrame = getSquareFrameDimensions();
      const innerPadding = 15; // Minimal inner padding for clean look
      const mapSize = squareFrame.width - squareFrame.padding * 2;
      return {
        x: innerPadding,
        y: innerPadding,
        width: mapSize - innerPadding * 2,
        height: mapSize - innerPadding * 2,
        clipFunc: (ctx: any) => {
          // Create a square clip with slight inset for clean edges
          ctx.rect(innerPadding, innerPadding, mapSize - innerPadding * 2, mapSize - innerPadding * 2);
        }
      };
    }
    // Get dynamic frame dimensions for clipping
    const frameDimensions = getFrameDimensions();
    const clipFunction = MPG_KONVA_FRAME_CLIPS[frameStyle as keyof typeof MPG_KONVA_FRAME_CLIPS];
    return clipFunction(frameDimensions.width, frameDimensions.height);
  };
  
  // Notify when export is ready
  useEffect(() => {
    if (isExportMode && onExportReady && stageRef.current && fontsLoaded && mapImage) {
      // Wait for everything to render properly
      setTimeout(() => {
        if (stageRef.current) {
          stageRef.current.batchDraw();
          // Force another redraw to ensure text alignment
          setTimeout(() => {
            if (stageRef.current) {
              stageRef.current.batchDraw();
              onExportReady(stageRef.current);
            }
          }, 200);
        }
      }, 500);
    }
  }, [isExportMode, onExportReady, fontsLoaded, mapImage]);
  
  if (!showContent) {
    return (
      <div 
        ref={containerDivRef}
        style={{ width: '100%', height: containerDimensions.height || 400 }}
        className="bg-gray-50 rounded-xl flex items-center justify-center"
      >
        <div className="text-medium-gray">Loading map...</div>
      </div>
    );
  }
  
  // Use higher pixel ratio for both export and preview for better clarity
  // This ensures crisp text and map rendering on all displays
  const pixelRatio = isExportMode ? MPG_KONVA_EXPORT_SETTINGS.pixelRatio : 2;
  
  return (
    <div ref={containerDivRef} className="w-full flex justify-center">
      <Stage
        width={scaledWidth}
        height={scaledHeight}
        ref={stageRef}
        scaleX={scale}
        scaleY={scale}
        pixelRatio={pixelRatio}
      >
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={baseDimensions.width}
            height={baseDimensions.height}
            fill={colorScheme.background}
          />
          
          {/* Glow effect BEHIND the map - using Konva's native shadow */}
          {glowEffect && frameStyle !== 'square' && (() => {
            const glowConfig = MPG_KONVA_GLOW_EFFECTS[glowStyle];
            // Use the main layer for the strongest shadow effect
            const mainLayer = glowConfig.layers[2] || glowConfig.layers[0];
            
            if (frameStyle === 'circle') {
              const circleFrame = getCircleFrameDimensions();
              return (
                <Circle
                  x={circleFrame.x + circleFrame.width / 2}
                  y={circleFrame.y + circleFrame.height / 2}
                  radius={circleFrame.width / 2}
                  fill={colorScheme.background}
                  shadowBlur={mainLayer.blur * glowIntensity * 3}
                  shadowColor={mainLayer.color}
                  shadowOpacity={1}
                  shadowOffsetX={0}
                  shadowOffsetY={0}
                />
              );
            } else if (frameStyle === 'heart') {
              const heartFrame = getHeartFrameDimensions();
              return (
                <Shape
                  x={heartFrame.x}
                  y={heartFrame.y}
                  fill={colorScheme.background}
                  shadowBlur={mainLayer.blur * glowIntensity * 3}
                  shadowColor={mainLayer.color}
                  shadowOpacity={1}
                  shadowOffsetX={0}
                  shadowOffsetY={0}
                  sceneFunc={(ctx, shape) => {
                    const width = heartFrame.width;
                    const height = heartFrame.height;
                    const size = Math.min(width, height);
                    const scale = size / 375;
                    const offsetX = (width - size) / 2;
                    const offsetY = (height - size) / 2;
                    
                    ctx.translate(offsetX, offsetY);
                    ctx.scale(scale, scale);
                    
                    ctx.beginPath();
                    ctx.moveTo(187.5, 337);
                    ctx.bezierCurveTo(70, 280, 22, 200, 22, 133);
                    ctx.bezierCurveTo(22, 80, 65, 44, 113, 44);
                    ctx.bezierCurveTo(140, 44, 165, 55, 187.5, 88);
                    ctx.bezierCurveTo(210, 55, 235, 44, 262, 44);
                    ctx.bezierCurveTo(310, 44, 353, 80, 353, 133);
                    ctx.bezierCurveTo(353, 200, 305, 280, 187.5, 337);
                    ctx.closePath();
                    ctx.fillShape(shape);
                  }}
                />
              );
            } else if (frameStyle === 'house') {
              const houseFrame = getHouseFrameDimensions();
              return (
                <Shape
                  x={houseFrame.x}
                  y={houseFrame.y}
                  fill={colorScheme.background}
                  shadowBlur={mainLayer.blur * glowIntensity * 3}
                  shadowColor={mainLayer.color}
                  shadowOpacity={1}
                  shadowOffsetX={0}
                  shadowOffsetY={0}
                  sceneFunc={(ctx, shape) => {
                    const width = houseFrame.width;
                    const height = houseFrame.height;
                    const size = Math.min(width, height);
                    const scale = (size / 375) * 1.3;
                    const scaledSize = 375 * scale;
                    const offsetX = (width - scaledSize) / 2;
                    const offsetY = (height - scaledSize) / 2;
                    
                    ctx.translate(offsetX, offsetY);
                    ctx.scale(scale, scale);
                    
                    ctx.beginPath();
                    ctx.moveTo(59.57, 317.63);
                    ctx.lineTo(315.66, 317.63);
                    ctx.lineTo(315.66, 141.57);
                    ctx.lineTo(332.43, 152.27);
                    ctx.lineTo(344.30, 133.71);
                    ctx.lineTo(266, 82);
                    ctx.lineTo(266, 65);
                    ctx.lineTo(290, 65);
                    ctx.lineTo(290, 90);
                    ctx.lineTo(189.34, 34.87);
                    ctx.lineTo(108.79, 84.04);
                    ctx.lineTo(108.79, 67.89);
                    ctx.lineTo(68.98, 67.89);
                    ctx.lineTo(68.98, 109.43);
                    ctx.lineTo(30.93, 133.71);
                    ctx.lineTo(42.80, 152.27);
                    ctx.lineTo(59.57, 141.57);
                    ctx.closePath();
                    ctx.fillShape(shape);
                  }}
                />
              );
            }
          })()}
          
          {/* Headline Text - Above Frame */}
          {headlineText && fontsLoaded && (() => {
            const sizeMultipliers = { S: 1.04, M: 1.3, L: 1.56 }; // Increased by 30%: S: 0.8*1.3, M: 1.0*1.3, L: 1.2*1.3
            const baseFontSize = 62; // Increased base by 30% (was 48, now 62)
            const fontSize = baseFontSize * sizeMultipliers[headlineSize];
            
            // Position above the frame - different positioning for square
            const squareFrame = getSquareFrameDimensions();
            const yPosition = frameStyle === 'square' 
              ? squareFrame.y - 100  // Above square frame with proper spacing
              : MPG_BASE_MAP.y - 138; // Standard position for other frames
            
            // Apply all caps if toggle is on
            const displayText = headlineAllCaps ? headlineText.toUpperCase() : headlineText;
            
            return (
              <Text
                x={baseDimensions.width / 2}
                y={yPosition}
                text={displayText}
                fontSize={fontSize}
                fontFamily={`${headlineFont}, cursive, serif`}
                fontStyle="700"
                fill={colorScheme.text}
                letterSpacing={4}
                listening={false}
                perfectDrawEnabled={false}
                align="center"
                offsetX={baseDimensions.width / 2}
                width={baseDimensions.width}
              />
            );
          })()}
          
          {/* Map Container - adjusted position for all frame types */}
          <Group
            x={(() => {
              if (frameStyle === 'square') {
                const squareFrame = getSquareFrameDimensions();
                return squareFrame.x + squareFrame.padding;
              }
              const frameDimensions = getFrameDimensions();
              return frameDimensions.x;
            })()}
            y={(() => {
              if (frameStyle === 'square') {
                const squareFrame = getSquareFrameDimensions();
                return squareFrame.y + squareFrame.padding;
              }
              const frameDimensions = getFrameDimensions();
              return frameDimensions.y;
            })()}
            clipFunc={frameStyle === 'square' ? (ctx: any) => {
              const squareFrame = getSquareFrameDimensions();
              const mapSize = squareFrame.width - squareFrame.padding * 2;
              ctx.rect(0, 0, mapSize, mapSize);
            } : getFrameClip().clipFunc || undefined}
          >
            {mapImage && !mapLoading && (
              <KonvaImage
                image={mapImage}
                x={(() => {
                  if (frameStyle === 'square') {
                    const squareFrame = getSquareFrameDimensions();
                    const mapSize = squareFrame.width - squareFrame.padding * 2;
                    return isMapLibreAvailable() ? -(MPG_MAP_IMAGE.width - mapSize) / 2 : mapOffsetX - (MPG_MAP_IMAGE.width - mapSize) / 2;
                  }
                  const frameDimensions = getFrameDimensions();
                  return isMapLibreAvailable() ? -(MPG_MAP_IMAGE.width - frameDimensions.width) / 2 : mapOffsetX - (MPG_MAP_IMAGE.width - frameDimensions.width) / 2;
                })()}
                y={(() => {
                  if (frameStyle === 'square') {
                    const squareFrame = getSquareFrameDimensions();
                    const mapSize = squareFrame.height - squareFrame.padding * 2;
                    return isMapLibreAvailable() ? -(MPG_MAP_IMAGE.height - mapSize) / 2 : mapOffsetY - (MPG_MAP_IMAGE.height - mapSize) / 2;
                  }
                  const frameDimensions = getFrameDimensions();
                  return isMapLibreAvailable() ? -(MPG_MAP_IMAGE.height - frameDimensions.height) / 2 : mapOffsetY - (MPG_MAP_IMAGE.height - frameDimensions.height) / 2;
                })()}
                width={MPG_MAP_IMAGE.width}
                height={MPG_MAP_IMAGE.height}
                ref={(node) => {
                  // Only apply filters for raster tiles, MapLibre handles its own styling
                  if (node && !isMapLibreAvailable() && style !== 'minimal') {
                    applyStyleFilters(node, style);
                  }
                }}
              />
            )}
            
            {/* Loading indicator */}
            {mapLoading && (
              <>
                <Rect
                  x={0}
                  y={0}
                  width={(() => {
                    if (frameStyle === 'square') {
                      const squareFrame = getSquareFrameDimensions();
                      return squareFrame.width - squareFrame.padding * 2;
                    }
                    const frameDimensions = getFrameDimensions();
                    return frameDimensions.width;
                  })()}
                  height={(() => {
                    if (frameStyle === 'square') {
                      const squareFrame = getSquareFrameDimensions();
                      return squareFrame.height - squareFrame.padding * 2;
                    }
                    const frameDimensions = getFrameDimensions();
                    return frameDimensions.height;
                  })()}
                  fill="#f5f5f5"
                />
                <Text
                  x={(() => {
                    if (frameStyle === 'square') {
                      const squareFrame = getSquareFrameDimensions();
                      return (squareFrame.width - squareFrame.padding * 2) / 2;
                    }
                    const frameDimensions = getFrameDimensions();
                    return frameDimensions.width / 2;
                  })()}
                  y={(() => {
                    if (frameStyle === 'square') {
                      const squareFrame = getSquareFrameDimensions();
                      return (squareFrame.height - squareFrame.padding * 2) / 2;
                    }
                    const frameDimensions = getFrameDimensions();
                    return frameDimensions.height / 2;
                  })()}
                  text="Loading map..."
                  fontSize={24}
                  fontFamily="Roboto"
                  fill="#999999"
                  align="center"
                  offsetX={60}
                  offsetY={12}
                />
              </>
            )}
            
            {/* Frame border for circle */}
            {frameStyle === 'circle' && !glowEffect && showFrameBorder && (() => {
              const circleFrame = getCircleFrameDimensions();
              return (
                <Rect
                  x={0}
                  y={0}
                  width={circleFrame.width}
                  height={circleFrame.height}
                  stroke={colorScheme.text}
                  strokeWidth={3}
                  cornerRadius={circleFrame.width / 2}
                  fill="transparent"
                />
              );
            })()}
            
            {/* Frame border for heart */}
            {frameStyle === 'heart' && !glowEffect && showFrameBorder && (() => {
              const heartFrame = getHeartFrameDimensions();
              return (
                <Shape
                  sceneFunc={(ctx, shape) => {
                    const width = heartFrame.width;
                    const height = heartFrame.height;
                  const size = Math.min(width, height);
                  const scale = size / 375;
                  const offsetX = (width - size) / 2;
                  const offsetY = (height - size) / 2;
                  
                  ctx.save();
                  ctx.translate(offsetX, offsetY);
                  ctx.scale(scale, scale);
                  
                  ctx.beginPath();
                  ctx.moveTo(187.5, 337);
                  ctx.bezierCurveTo(70, 280, 22, 200, 22, 133);
                  ctx.bezierCurveTo(22, 80, 65, 44, 113, 44);
                  ctx.bezierCurveTo(140, 44, 165, 55, 187.5, 88);
                  ctx.bezierCurveTo(210, 55, 235, 44, 262, 44);
                    ctx.bezierCurveTo(310, 44, 353, 80, 353, 133);
                    ctx.bezierCurveTo(353, 200, 305, 280, 187.5, 337);
                    ctx.closePath();
                    
                    ctx.restore();
                    ctx.fillStrokeShape(shape);
                  }}
                  stroke={colorScheme.text}
                  strokeWidth={3}
                  fill="transparent"
                />
              );
            })()}
            
            {/* Frame border for house */}
            {frameStyle === 'house' && !glowEffect && showFrameBorder && (() => {
              const houseFrame = getHouseFrameDimensions();
              return (
                <Shape
                  sceneFunc={(ctx, shape) => {
                    const width = houseFrame.width;
                    const height = houseFrame.height;
                  const size = Math.min(width, height);
                  const scale = (size / 375) * 1.3;
                  const scaledSize = 375 * scale;
                  const offsetX = (width - scaledSize) / 2;
                  const offsetY = (height - scaledSize) / 2;
                  
                  ctx.save();
                  ctx.translate(offsetX, offsetY);
                  ctx.scale(scale, scale);
                  
                  ctx.beginPath();
                  ctx.moveTo(59.57, 317.63);
                  ctx.lineTo(315.66, 317.63);
                  ctx.lineTo(315.66, 141.57);
                  ctx.lineTo(332.43, 152.27);
                  ctx.lineTo(344.30, 133.71);
                  ctx.lineTo(266, 82);
                  ctx.lineTo(266, 65);
                  ctx.lineTo(290, 65);
                  ctx.lineTo(290, 90);
                  ctx.lineTo(189.34, 34.87);
                  ctx.lineTo(108.79, 84.04);
                  ctx.lineTo(108.79, 67.89);
                  ctx.lineTo(68.98, 67.89);
                  ctx.lineTo(68.98, 109.43);
                  ctx.lineTo(30.93, 133.71);
                  ctx.lineTo(42.80, 152.27);
                    ctx.lineTo(59.57, 141.57);
                    ctx.closePath();
                    
                    ctx.restore();
                    ctx.fillStrokeShape(shape);
                  }}
                  stroke={colorScheme.text}
                  strokeWidth={3}
                  fill="transparent"
                />
              );
            })()}
            
            {/* Frame border for square - REMOVED (not available for square frames) */}
            
            {/* Location Pin - rendered on top of map */}
            {showPin && (
              <Group
                x={(() => {
                  if (frameStyle === 'square') {
                    const squareFrame = getSquareFrameDimensions();
                    return (squareFrame.width - squareFrame.padding * 2) / 2;
                  }
                  const frameDimensions = getFrameDimensions();
                  return frameDimensions.width / 2;
                })()}
                y={(() => {
                  if (frameStyle === 'square') {
                    const squareFrame = getSquareFrameDimensions();
                    return (squareFrame.height - squareFrame.padding * 2) / 2;
                  }
                  const frameDimensions = getFrameDimensions();
                  return frameDimensions.height / 2;
                })()}
              >
                {(() => {
                  // Size multipliers: S=0.8, M=1.0, L=1.3
                  const sizeMultiplier = pinSize === 'S' ? 0.8 : pinSize === 'L' ? 1.3 : 1.0;
                  
                  // Base scales increased by 30%
                  const baseScaleSmall = 1.95; // Was 1.5, now 30% larger
                  const baseScaleLarge = 2.34; // Was 1.8, now 30% larger
                  
                  // Different pin styles
                  switch (pinStyle) {
                    case 'basic':
                      return (
                        <>
                          <Path
                            data="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 6.38 8.5 15.5 8.5 15.5s8.5-9.12 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 11.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                            fill={pinColor}
                            scale={{ x: baseScaleSmall * sizeMultiplier, y: baseScaleSmall * sizeMultiplier }}
                            offset={{ x: 12, y: 24 }}
                            shadowBlur={5}
                            shadowOpacity={0.3}
                            shadowOffsetY={2}
                          />
                          <Circle
                            x={0}
                            y={-9}
                            radius={4}
                            fill="white"
                          />
                        </>
                      );
                    case 'fave':
                      return (
                        <>
                          <Path
                            data="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 6.38 8.5 15.5 8.5 15.5s8.5-9.12 8.5-15.5C20.5 3.81 16.69 0 12 0z"
                            fill={pinColor}
                            scale={{ x: baseScaleSmall * sizeMultiplier, y: baseScaleSmall * sizeMultiplier }}
                            offset={{ x: 12, y: 24 }}
                            shadowBlur={5}
                            shadowOpacity={0.3}
                            shadowOffsetY={2}
                          />
                          <Path
                            data="M12 7.5c-1.1 0-2 .9-2 2 0 1.8 2 3.5 2 3.5s2-1.7 2-3.5c0-1.1-.9-2-2-2z"
                            fill="white"
                            scale={{ x: baseScaleSmall * sizeMultiplier, y: baseScaleSmall * sizeMultiplier }}
                            offset={{ x: 12, y: 10 }}
                          />
                        </>
                      );
                    case 'lolli':
                      return (
                        <>
                          <Rect
                            x={-1 * sizeMultiplier}
                            y={0}
                            width={2 * sizeMultiplier}
                            height={26 * sizeMultiplier}
                            fill={pinColor}
                            shadowBlur={3}
                            shadowOpacity={0.2}
                            shadowOffsetY={2}
                          />
                          <Circle
                            x={0}
                            y={-15.6 * sizeMultiplier}
                            radius={15.6 * sizeMultiplier}
                            fill={pinColor}
                            shadowBlur={5}
                            shadowOpacity={0.3}
                            shadowOffsetY={2}
                          />
                        </>
                      );
                    case 'heart':
                      return (
                        <Path
                          data="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          fill={pinColor}
                          scale={{ x: baseScaleLarge * sizeMultiplier, y: baseScaleLarge * sizeMultiplier }}
                          offset={{ x: 12, y: 12 }}
                          shadowBlur={5}
                          shadowOpacity={0.3}
                          shadowOffsetY={2}
                        />
                      );
                    case 'home':
                      return (
                        <Path
                          data="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
                          fill={pinColor}
                          scale={{ x: baseScaleLarge * sizeMultiplier, y: baseScaleLarge * sizeMultiplier }}
                          offset={{ x: 12, y: 12 }}
                          shadowBlur={5}
                          shadowOpacity={0.3}
                          shadowOffsetY={2}
                        />
                      );
                    default:
                      return null;
                  }
                })()}
              </Group>
            )}
          </Group>
          
          {/* Dynamic Text Positioning with Magnet Effect */}
          {(() => {
            // Calculate dynamic Y positions based on visible elements
            const calculateTextPositions = () => {
              // Adjust base Y position based on frame style
              const squareFrame = frameStyle === 'square' ? getSquareFrameDimensions() : null;
              
              // Calculate appropriate base Y position for each frame type
              let baseY: number;
              if (frameStyle === 'square' && squareFrame) {
                // Square frame: position below the frame
                baseY = squareFrame.y + squareFrame.height + 70;
              } else {
                // Other frames (circle, heart, house): position closer to the frame (reduced gap)
                // Get dynamic frame dimensions
                const frameDimensions = getFrameDimensions();
                baseY = frameDimensions.y + frameDimensions.height + 100;
              }
              
              // Calculate actual text heights based on font sizes and size selections
              const getTextHeight = (type: string, sizeSelection: 'S' | 'M' | 'L') => {
                const sizeMultipliers = { S: 0.8, M: 1.0, L: 1.2 };
                const baseSizes: Record<string, number> = {
                  title: MPG_KONVA_TEXT_LAYOUT.fontSize.title || 60,
                  coordinates: MPG_KONVA_TEXT_LAYOUT.fontSize.coordinates || 20,
                  country: MPG_KONVA_TEXT_LAYOUT.fontSize.country || 24,
                  customText: MPG_KONVA_TEXT_LAYOUT.fontSize.customText || 20
                };

                const fontSize = (baseSizes[type] || 20) * sizeMultipliers[sizeSelection];
                // Approximate text height as 1.2x font size (accounting for line height)
                return fontSize * 1.2;
              };
              
              // Fixed visual gap that scales with textSpacing
              const baseGap = 30; // Base gap between text elements
              const gap = baseGap * (textSpacing || 1);
              
              const positions: Record<string, number> = {};
              let currentY = baseY;
              
              // City Name
              if (showCityName) {
                positions.cityName = currentY;
                // Check if city name is multi-line
                const isAddress = /\d/.test(city) && city.includes(',');
                const streetPart = isAddress && city.includes(',') ? city.split(',')[0].trim() : city;
                const isMultiLine = streetPart.length > 20 && streetPart.split(' ').length > 2;
                
                // For L size title, use special multiplier
                const titleSizeMultiplier = titleSize === 'L' ? 1.25 : (titleSize === 'S' ? 0.75 : 1.0);
                const titleFontSize = (MPG_KONVA_TEXT_LAYOUT.fontSize.title || 60) * titleSizeMultiplier;
                
                // When multi-line, account for the actual line height used (1.2) plus the gap between lines
                // Single line: fontSize * 1.2, Multi-line: fontSize * 1.2 * 2 (two lines with 1.2 line height)
                const titleHeight = isMultiLine ? titleFontSize * 1.2 * 2 : titleFontSize * 1.2;
                
                currentY += titleHeight;
                currentY += gap; // Apply consistent gap
              }
              
              // Coordinates
              if (showCoordinates) {
                positions.coordinates = currentY;
                const coordHeight = getTextHeight('coordinates', coordinatesSize);
                currentY += coordHeight;
                currentY += gap;
              }
              
              // Country
              if (showCountry) {
                positions.country = currentY;
                const countryHeight = getTextHeight('country', countrySize);
                currentY += countryHeight;
                currentY += gap;
              }
              
              // Custom Text
              if (customText) {
                positions.customText = currentY;
                // Custom text L size has special 1.56x multiplier
                const customSizeMultiplier = customTextSize === 'L' ? 1.56 : (customTextSize === 'S' ? 0.8 : 1.0);
                const customFontSize = (MPG_KONVA_TEXT_LAYOUT.fontSize.customText || 20) * customSizeMultiplier;
                const customHeight = customFontSize * 1.2;
                // No need to add gap after last element
              }
              
              // If no text elements are visible below city name, adjust city position
              if (showCityName && !showCoordinates && !showCountry && !customText) {
                positions.cityName = baseY + 60; // Center it better when alone
              }
              
              return positions;
            };
            
            const textPositions = calculateTextPositions();
            
            // Store positions in window for access by text components
            (window as any).__mpgTextPositions = textPositions;
            
            return null;
          })()}
          
          {/* City Name - dynamic position with smart formatting */}
          {showCityName && fontsLoaded && (() => {
            // Format the city name for display
            let displayText = city.toUpperCase();
            const sizeMultipliers = { S: 0.75, M: 1.0, L: 1.25 };
            let fontSize = MPG_KONVA_TEXT_LAYOUT.fontSize.title * sizeMultipliers[titleSize];
            let useMultiLine = false;
            let lineHeight = fontSize * 1.4;
            
            // Check if it's a street address (contains numbers and commas)
            const isAddress = /\d/.test(city) && city.includes(',');
            
            if (isAddress) {
              // Split address into parts
              const parts = city.split(',');
              if (parts.length >= 2) {
                // Show just the street part
                const streetPart = parts[0].trim().toUpperCase();
                
                // Split long addresses into two lines
                const words = streetPart.split(' ');
                if (streetPart.length > 20 && words.length > 2) {
                  // Find a good breaking point
                  const midPoint = Math.floor(words.length / 2);
                  const line1 = words.slice(0, midPoint).join(' ');
                  const line2 = words.slice(midPoint).join(' ');
                  displayText = `${line1}\n${line2}`;
                  useMultiLine = true;
                  fontSize = Math.max(36, fontSize * 0.85);
                } else {
                  displayText = streetPart;
                  if (displayText.length > 25) {
                    fontSize = Math.max(32, fontSize * 0.8);
                  }
                }
              }
            } else if (displayText.length > 20) {
              // For long city names, adjust font size
              fontSize = Math.max(36, fontSize * (20 / displayText.length));
            }
            
            // Use dynamic position from magnet effect calculation
            const textPositions = (window as any).__mpgTextPositions || {};
            const baseYPosition = textPositions.cityName || MPG_KONVA_TEXT_LAYOUT.titleY;
            
            // For multi-line text, we don't need to adjust the Y position
            // The text will naturally expand downward from the baseline
            const yPosition = baseYPosition;
            
            return (
              <Text
                x={baseDimensions.width / 2}
                y={yPosition}
                text={displayText}
                fontSize={fontSize}
                fontFamily={getFontFamily('title', titleFont)}
                fontStyle="300"
                fill={colorScheme.text}
                letterSpacing={letterSpacing}
                listening={false}
                perfectDrawEnabled={false}
                align="center"
                offsetX={baseDimensions.width / 2}
                width={baseDimensions.width}
                lineHeight={useMultiLine ? (1.3 + (textSpacing - 1) * 0.3) : 1.2}
              />
            );
          })()}
          
          {/* Coordinates - dynamic position */}
          {showCoordinates && fontsLoaded && (() => {
            const sizeMultipliers = { S: 0.8, M: 1.0, L: 1.2 };
            const fontSize = MPG_KONVA_TEXT_LAYOUT.fontSize.coordinates * sizeMultipliers[coordinatesSize];
            const textPositions = (window as any).__mpgTextPositions || {};
            const yPosition = textPositions.coordinates || MPG_KONVA_TEXT_LAYOUT.coordinatesY;
            
            return (
              <Text
                x={baseDimensions.width / 2}
                y={yPosition}
                text={getCoordinatesText()}
                fontSize={fontSize}
                fontFamily={getFontFamily('body', coordinatesFont)}
                fill={colorScheme.coordinates}
                letterSpacing={2}
                listening={false}
                perfectDrawEnabled={false}
                align="center"
                offsetX={baseDimensions.width / 2}
                width={baseDimensions.width}
              />
            );
          })()}
          
          {/* Country or City (for addresses) - dynamic position */}
          {showCountry && fontsLoaded && (() => {
            // For addresses, show the city part instead of just country
            const isAddress = /\d/.test(city) && city.includes(',');
            let displayText = country.toUpperCase();
            
            if (isAddress && city.includes(',')) {
              const parts = city.split(',');
              if (parts.length >= 2) {
                // Show city/state for addresses
                const cityPart = parts[1].trim().toUpperCase();
                displayText = cityPart.length > 30 
                  ? country.toUpperCase() 
                  : cityPart;
              }
            }
            
            return (
              (() => {
                const sizeMultipliers = { S: 0.8, M: 1.0, L: 1.2 };
                const fontSize = MPG_KONVA_TEXT_LAYOUT.fontSize.country * sizeMultipliers[countrySize];
                const textPositions = (window as any).__mpgTextPositions || {};
                const yPosition = textPositions.country || MPG_KONVA_TEXT_LAYOUT.countryY;
                
                return (
                  <Text
                    x={baseDimensions.width / 2}
                    y={yPosition}
                    text={displayText}
                    fontSize={fontSize}
                    fontFamily={getFontFamily('body', countryFont)}
                    fill={colorScheme.country}
                    letterSpacing={4}
                    listening={false}
                    perfectDrawEnabled={false}
                    align="center"
                    offsetX={baseDimensions.width / 2}
                    width={baseDimensions.width}
                  />
                );
              })()
            );
          })()}
          
          {/* Custom Text - dynamic position */}
          {customText && fontsLoaded && (() => {
            // Size multiplier based on S/M/L selection - L increased by 30%
            const sizeMultipliers = { S: 0.8, M: 1.0, L: 1.56 }; // L was 1.2, now 1.56 (30% more)
            const baseFontSize = MPG_KONVA_TEXT_LAYOUT.fontSize.customText || 20;
            const fontSize = baseFontSize * sizeMultipliers[customTextSize];
            const textPositions = (window as any).__mpgTextPositions || {};
            const yPosition = textPositions.customText || MPG_KONVA_TEXT_LAYOUT.customTextY;
            
            // Get the font family
            const getCustomFontFamily = () => {
              const fontMap: Record<string, string> = {
                'Montserrat': 'Montserrat, sans-serif',
                'Playfair Display': 'Playfair Display, serif',
                'Roboto': 'Roboto, sans-serif',
                'Dancing Script': 'Dancing Script, cursive',
                'Bebas Neue': 'Bebas Neue, cursive',
                'Alex Brush': 'Alex Brush, cursive',
                'Kaushan Script': 'Kaushan Script, cursive',
                'Pacifico': 'Pacifico, cursive',
                'Sacramento': 'Sacramento, cursive',
                'Yellowtail': 'Yellowtail, cursive',
                'Cookie': 'Cookie, cursive',
                'Satisfy': 'Satisfy, cursive',
                'Great Vibes': 'Great Vibes, cursive',
                'Allura': 'Allura, cursive',
                'Tangerine': 'Tangerine, cursive'
              };
              return fontMap[customTextFont] || 'Roboto, sans-serif';
            };
            
            return (
              <Text
                x={baseDimensions.width / 2}
                y={yPosition}
                text={customText}
                fontSize={fontSize}
                fontFamily={getCustomFontFamily()}
                fill={colorScheme.customText || colorScheme.country}
                listening={false}
                perfectDrawEnabled={false}
                align="center"
                offsetX={baseDimensions.width / 2}
                width={baseDimensions.width}
              />
            );
          })()}
          
          {/* Watermark - fixed positions */}
          {showWatermark && !isExportMode && (
            <Group opacity={MPG_KONVA_WATERMARK.opacity}>
              {MPG_KONVA_WATERMARK.positions.map((yPos, index) => (
                <Text
                  key={`watermark-${index}`}
                  x={baseDimensions.width / 2}
                  y={yPos}
                  text={MPG_KONVA_WATERMARK.text}
                  fontSize={MPG_KONVA_WATERMARK.fontSize}
                  fontFamily="Arial"
                  fill="#000000"
                  rotation={MPG_KONVA_WATERMARK.rotation}
                  offsetX={120}
                  align="center"
                  listening={false}
                  perfectDrawEnabled={false}
                />
              ))}
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  );
}