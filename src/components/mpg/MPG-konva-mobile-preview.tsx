'use client'
import React, { useState, useEffect } from 'react';
import { MPGKonvaPreview } from './MPG-konva-preview';

interface MPGKonvaMobilePreviewProps {
  onExpand: () => void;
}

export function MPGKonvaMobilePreview({ onExpand }: MPGKonvaMobilePreviewProps) {
  const [previewPosition, setPreviewPosition] = useState({ x: 20, y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPreviewPosition({
          x: Math.max(0, Math.min(window.innerWidth - 150, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        setPreviewPosition({
          x: Math.max(0, Math.min(window.innerWidth - 150, touch.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 200, touch.clientY - dragOffset.y))
        });
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
      className="fixed z-40 select-none"
      style={{
        left: `${previewPosition.x}px`,
        top: `${previewPosition.y}px`,
        transform: isDragging ? 'scale(1.05) rotate(2deg)' : 'scale(1) rotate(0deg)',
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: isDragging ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
      }}
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl p-2 cursor-move transition-all duration-200 ${
          isDragging 
            ? 'border-2 border-sage-green ring-2 ring-sage-green/20' 
            : 'border-2 border-sage-green/20 hover:border-sage-green/40'
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={(e) => {
          if (!isDragging) {
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
          <span className="text-xs font-medium text-gray-700">Map Preview</span>
        </div>
        
        {/* Scaled Content Container */}
        <div className="w-32 overflow-hidden rounded" style={{ height: '171px' }}>
          <div 
            className="origin-top-left"
            style={{
              transform: 'scale(0.25)',
              width: '500px',
              height: '667px'
            }}
          >
            <MPGKonvaPreview showWatermark={false} />
          </div>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-2" style={{ fontSize: '10px' }}>
          Tap to expand
        </p>
      </div>
    </div>
  );
}