'use client'
import React, { useState, useEffect, useRef } from 'react';
import { MPGPreview } from './MPG-preview';
import { MPG_PREVIEW_SIZES } from '@/lib/mpg/MPG-constants';

interface MPGMobilePreviewProps {
  onExpand: () => void;
}

export function MPGMobilePreview({ onExpand }: MPGMobilePreviewProps) {
  const [position, setPosition] = useState({ x: 20, y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - 150, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        const newX = Math.max(0, Math.min(window.innerWidth - 150, touch.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 200, touch.clientY - dragOffset.y));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div 
      ref={containerRef}
      className="fixed z-40 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'scale(1.05) rotate(2deg)' : 'scale(1) rotate(0deg)',
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: isDragging ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
      }}
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl p-2 cursor-move transition-all duration-200 ${
          isDragging 
            ? 'border-2 border-sage-green ring-2 ring-sage-green/30' 
            : 'border-2 border-sage-green/20 hover:border-sage-green/40'
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={(e) => {
          if (!isDragging) {
            e.stopPropagation();
            onExpand();
          }
        }}
        style={{ 
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        {/* Mini Preview Header */}
        <div className="flex items-center justify-center mb-1">
          <div className="w-8 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="text-center mb-1">
          <span className="text-xs font-medium text-gray-700">Map Preview</span>
        </div>
        
        {/* Scaled Content Container */}
        <div 
          className="overflow-hidden rounded"
          style={{ 
            width: `${MPG_PREVIEW_SIZES.miniPreview.width}px`, 
            height: `${MPG_PREVIEW_SIZES.miniPreview.height}px` 
          }}
        >
          <div 
            className="origin-top-left pointer-events-none"
            style={{
              transform: `scale(${MPG_PREVIEW_SIZES.miniPreview.scale})`,
              width: `${MPG_PREVIEW_SIZES.mobile.width}px`,
              height: `${MPG_PREVIEW_SIZES.mobile.height}px`
            }}
          >
            <MPGPreview />
          </div>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-2" style={{ fontSize: '10px' }}>
          Tap to expand • Drag to move
        </p>
      </div>
    </div>
  );
}