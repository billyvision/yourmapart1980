'use client'
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MPGCompactToggleProps {
  icon: LucideIcon;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function MPGCompactToggle({
  icon: Icon,
  label,
  checked,
  onCheckedChange,
  className,
  disabled = false
}: MPGCompactToggleProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 bg-white rounded-lg border transition-all",
      checked ? "border-sage-green bg-sage-green/5" : "border-gray-200",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}>
      <div className="flex items-center gap-2.5">
        <Icon className={cn(
          "w-4 h-4 transition-colors",
          checked ? "text-sage-green" : "text-gray-400"
        )} />
        <Label className={cn(
          "text-sm font-medium cursor-pointer select-none",
          checked ? "text-charcoal" : "text-gray-600"
        )}>
          {label}
        </Label>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="data-[state=checked]:bg-sage-green"
      />
    </div>
  );
}