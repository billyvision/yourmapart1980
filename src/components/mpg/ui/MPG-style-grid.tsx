'use client'
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface MapStyle {
  id: string;
  name: string;
  preview: {
    bg: string;
    border?: string;
    water?: string;
  };
}

interface MPGStyleGridProps {
  styles: MapStyle[];
  selectedStyle: string;
  onStyleSelect: (styleId: string) => void;
  columns?: 'compact' | 'normal';
}

export function MPGStyleGrid({
  styles,
  selectedStyle,
  onStyleSelect,
  columns = 'normal'
}: MPGStyleGridProps) {
  const gridCols = columns === 'compact' 
    ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5'
    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={cn("grid gap-2", gridCols)}>
      {styles.map((style) => (
        <button
          key={style.id}
          onClick={() => onStyleSelect(style.id)}
          className={cn(
            "group relative rounded-lg overflow-hidden transition-all duration-200",
            "hover:scale-105 hover:shadow-lg",
            selectedStyle === style.id && "ring-2 ring-sage-green shadow-md"
          )}
        >
          {/* Style Preview */}
          <div className="aspect-[4/3] relative">
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: style.preview.bg }}
            />
            {/* Simple pattern overlay for visual interest */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5 opacity-20">
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: style.preview.border || '#000' }}
                />
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: style.preview.water || style.preview.border || '#000' }}
                />
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: style.preview.water || style.preview.border || '#000' }}
                />
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: style.preview.border || '#000' }}
                />
              </div>
            </div>
          </div>
          
          {/* Style Name */}
          <div className={cn(
            "px-2 py-1.5 text-center transition-colors duration-200",
            selectedStyle === style.id
              ? "bg-sage-green-dark text-white"
              : "bg-gray-50 text-charcoal"
          )}>
            <p className="text-xs font-medium truncate">{style.name}</p>
          </div>
          
          {/* Selected Indicator */}
          {selectedStyle === style.id && (
            <div className="absolute top-1 right-1 w-5 h-5 bg-sage-green-dark rounded-full flex items-center justify-center shadow-md">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}