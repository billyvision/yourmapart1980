'use client'
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface MapStyle {
  id: string;
  name: string;
  description?: string;
  preview?: {
    bg: string;
    border?: string;
    water?: string;
  };
}

interface MPGCompactStyleGridProps {
  styles: MapStyle[];
  selectedStyle: string;
  onStyleSelect: (styleId: string) => void;
  columns?: 'compact' | 'normal';
}

// Calculate text color based on background brightness for optimal contrast
const getTextColor = (backgroundColor: string): string => {
  // Remove # if present
  const color = backgroundColor.replace('#', '');
  
  // Parse RGB values
  const rgb = parseInt(color, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  
  // Calculate brightness using standard luminance formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return white text for dark backgrounds, dark text for light backgrounds
  return brightness > 128 ? '#333333' : '#FFFFFF';
};

// Check if a style is dark-themed based on background brightness
const isDarkTheme = (backgroundColor: string): boolean => {
  const color = backgroundColor.replace('#', '');
  const rgb = parseInt(color, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness <= 128;
};

// Sort styles by theme (dark first, then light) and then alphabetically
const sortStylesByTheme = (styles: MapStyle[]): MapStyle[] => {
  return [...styles].sort((a, b) => {
    const aBg = a.preview?.bg || '#ffffff';
    const bBg = b.preview?.bg || '#ffffff';
    const aIsDark = isDarkTheme(aBg);
    const bIsDark = isDarkTheme(bBg);

    // Dark themes first
    if (aIsDark && !bIsDark) return -1;
    if (!aIsDark && bIsDark) return 1;

    // If both are same theme type, sort alphabetically
    return a.name.localeCompare(b.name);
  });
};

// Generate a subtle gradient for glossy effect
const getGradient = (baseColor: string): string => {
  const color = baseColor.replace('#', '');
  const rgb = parseInt(color, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  
  // Create a lighter version for gradient top
  const lighten = 0.15;
  const newR = Math.min(255, Math.round(r + (255 - r) * lighten));
  const newG = Math.min(255, Math.round(g + (255 - g) * lighten));
  const newB = Math.min(255, Math.round(b + (255 - b) * lighten));
  
  const lighterColor = `rgb(${newR}, ${newG}, ${newB})`;
  const originalColor = `rgb(${r}, ${g}, ${b})`;
  
  return `linear-gradient(135deg, ${lighterColor} 0%, ${originalColor} 100%)`;
};

export function MPGCompactStyleGrid({
  styles,
  selectedStyle,
  onStyleSelect,
  columns = 'normal'
}: MPGCompactStyleGridProps) {
  // Grid layout adjusted for larger buttons
  const gridCols = columns === 'compact' 
    ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5'
    : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5';

  // Sort styles by theme for better organization
  const sortedStyles = sortStylesByTheme(styles);
  
  // Separate styles into dark and light themes
  const darkStyles = sortedStyles.filter(style => isDarkTheme(style.preview?.bg || '#ffffff'));
  const lightStyles = sortedStyles.filter(style => !isDarkTheme(style.preview?.bg || '#ffffff'));

  const renderStyleGrid = (themeStyles: MapStyle[], title: string) => {
    if (themeStyles.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-medium-gray uppercase tracking-wider px-1">
          {title}
        </h4>
        <div className={cn("grid gap-2", gridCols)}>
          {themeStyles.map((style) => {
            const bg = style.preview?.bg || '#ffffff';
            const textColor = getTextColor(bg);
            const gradient = getGradient(bg);
            const isSelected = selectedStyle === style.id;
            
            return (
              <button
                key={style.id}
                onClick={() => onStyleSelect(style.id)}
                className={cn(
                  "relative h-20 px-4 py-3 rounded-xl transition-all duration-200",
                  "hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
                  "backdrop-blur-sm border border-white/20",
                  "text-base font-medium tracking-wide",
                  "focus:outline-none focus:ring-2 focus:ring-sage-green/50",
                  "flex items-center justify-center min-w-0",
                  isSelected && "ring-2 ring-sage-green shadow-lg scale-[1.02]"
                )}
                style={{
                  background: gradient,
                  color: textColor,
                  boxShadow: isSelected 
                    ? '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 2px #8FBC8F' 
                    : '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                title={style.name} // Tooltip for long names
              >
                {/* Glassmorphism overlay */}
                <div 
                  className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`
                  }}
                />
                
                {/* Style name - better text layout with word wrapping */}
                <span className="relative z-10 text-center leading-tight px-1 break-words hyphens-auto">
                  {style.name}
                </span>
                
                {/* Selected indicator */}
                {isSelected && (
                  <div 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #8FBC8F 0%, #6B8E6B 100%)'
                    }}
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
                
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div 
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderStyleGrid(darkStyles, 'Dark Themes')}
      {renderStyleGrid(lightStyles, 'Light Themes')}
    </div>
  );
}