'use client'
import React from 'react';
import { cn } from '@/lib/utils';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LucideIcon } from 'lucide-react';

// Color theme configurations
const colorThemes = {
  pink: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    letterBg: 'bg-pink-100',
    letterText: 'text-pink-700',
    letterBorder: 'border-pink-300',
    iconBg: 'bg-pink-100',
    iconText: 'text-pink-600',
    hover: 'hover:bg-pink-100/50'
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    letterBg: 'bg-yellow-100',
    letterText: 'text-yellow-700',
    letterBorder: 'border-yellow-300',
    iconBg: 'bg-yellow-100',
    iconText: 'text-yellow-600',
    hover: 'hover:bg-yellow-100/50'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    letterBg: 'bg-blue-100',
    letterText: 'text-blue-700',
    letterBorder: 'border-blue-300',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    hover: 'hover:bg-blue-100/50'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    letterBg: 'bg-green-100',
    letterText: 'text-green-700',
    letterBorder: 'border-green-300',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
    hover: 'hover:bg-green-100/50'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    letterBg: 'bg-purple-100',
    letterText: 'text-purple-700',
    letterBorder: 'border-purple-300',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
    hover: 'hover:bg-purple-100/50'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    letterBg: 'bg-orange-100',
    letterText: 'text-orange-700',
    letterBorder: 'border-orange-300',
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600',
    hover: 'hover:bg-orange-100/50'
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    letterBg: 'bg-teal-100',
    letterText: 'text-teal-700',
    letterBorder: 'border-teal-300',
    iconBg: 'bg-teal-100',
    iconText: 'text-teal-600',
    hover: 'hover:bg-teal-100/50'
  },
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    letterBg: 'bg-indigo-100',
    letterText: 'text-indigo-700',
    letterBorder: 'border-indigo-300',
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-600',
    hover: 'hover:bg-indigo-100/50'
  }
};

export type ColorTheme = keyof typeof colorThemes;

interface MPGAccordionSectionProps {
  id: string;
  letter: string; // A, B, C, D, etc.
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
  colorTheme?: ColorTheme;
  className?: string;
  badge?: React.ReactNode;
}

export function MPGAccordionSection({
  id,
  letter,
  title,
  description,
  icon: Icon,
  children,
  colorTheme = 'blue',
  className,
  badge
}: MPGAccordionSectionProps) {
  const theme = colorThemes[colorTheme];
  
  return (
    <AccordionItem 
      value={id} 
      className={cn(
        "border-2 rounded-lg mb-3 shadow-sm hover:shadow-md transition-all duration-200",
        theme.bg,
        theme.border,
        className
      )}
    >
      <AccordionTrigger 
        className={cn(
          "px-4 py-3 hover:no-underline rounded-t-lg transition-colors",
          theme.hover
        )}
      >
        <div className="flex items-center justify-between w-full pr-2">
          <div className="flex items-center gap-3">
            {/* Letter Badge */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border",
              theme.letterBg,
              theme.letterText,
              theme.letterBorder
            )}>
              {letter}
            </div>
            
            {/* Icon */}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              theme.iconBg
            )}>
              <Icon className={cn("w-4 h-4", theme.iconText)} />
            </div>
            
            {/* Title and Description */}
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-charcoal">{title}</h4>
                {badge}
              </div>
              {description && (
                <p className="text-xs text-medium-gray mt-0.5">{description}</p>
              )}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 pt-2">
        <div className="pt-2 pl-11"> {/* Indent content to align with title */}
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}