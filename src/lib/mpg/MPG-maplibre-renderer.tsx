'use client'
import React, { useEffect, useState, useRef } from 'react';
import { renderMapToImageElement, renderMapForExport, isMaptilerConfigured } from './MPG-maplibre-service';
import { getMapStyle } from './MPG-maplibre-styles';
import { useMPGStore } from './MPG-store';

interface MapLibreRendererProps {
  width: number;
  height: number;
  isExport?: boolean;
  dpi?: number;
  onImageReady: (image: HTMLImageElement) => void;
  onError?: (error: Error) => void;
}

/**
 * Component that renders a MapLibre map and returns it as an image
 */
export function MapLibreRenderer({
  width,
  height,
  isExport = false,
  dpi = 96,
  onImageReady,
  onError
}: MapLibreRendererProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const renderCount = useRef(0);
  
  const {
    lat,
    lng,
    zoom,
    style,
    mapOffsetX,
    mapOffsetY,
    showMapLabels,
    showMapBuildings,
    showMapParks,
    showMapWater,
    showMapRoads
  } = useMPGStore();
  
  useEffect(() => {
    // Check if Maptiler is configured
    if (!isMaptilerConfigured()) {
      const err = new Error('Maptiler API key not configured');
      setError(err);
      if (onError) onError(err);
      return;
    }
    
    // Prevent multiple simultaneous renders
    const currentRender = ++renderCount.current;
    
    const renderMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Calculate adjusted center based on offset
        // Convert pixel offset to lat/lng offset
        const metersPerPixel = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
        const deltaLat = (mapOffsetY * metersPerPixel) / 111111; // 111111 meters per degree latitude
        const deltaLng = (mapOffsetX * metersPerPixel) / (111111 * Math.cos(lat * Math.PI / 180));
        
        const adjustedLat = lat - deltaLat; // Negative because Y increases downward
        const adjustedLng = lng + deltaLng;
        
        // Render the map
        const mapOptions = {
          lat: adjustedLat,
          lng: adjustedLng,
          zoom,
          width,
          height,
          style: getMapStyle(style, {
            showLabels: showMapLabels,
            showBuildings: showMapBuildings,
            showParks: showMapParks,
            showWater: showMapWater,
            showRoads: showMapRoads
          })
        };
        
        // Check if this render is still current
        if (currentRender !== renderCount.current) {
          return;
        }
        
        const image = isExport
          ? await renderMapForExport(mapOptions, dpi)
            .then(dataUrl => {
              const img = new Image();
              return new Promise<HTMLImageElement>((resolve, reject) => {
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = dataUrl;
              });
            })
          : await renderMapToImageElement(mapOptions);
        
        // Check again if this render is still current
        if (currentRender === renderCount.current) {
          onImageReady(image);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error rendering map:', err);
        if (currentRender === renderCount.current) {
          const error = err instanceof Error ? err : new Error('Failed to render map');
          setError(error);
          setIsLoading(false);
          if (onError) onError(error);
        }
      }
    };
    
    renderMap();
  }, [lat, lng, zoom, style, mapOffsetX, mapOffsetY, width, height, isExport, dpi, showMapLabels, showMapBuildings, showMapParks, showMapWater, showMapRoads]);
  
  if (error) {
    return null; // Let parent handle error display
  }
  
  if (isLoading) {
    return null; // Let parent show loading state
  }
  
  return null; // This component doesn't render anything visible
}

/**
 * Hook to get a MapLibre map as an image
 */
export function useMapLibreImage(
  width: number,
  height: number,
  options?: {
    isExport?: boolean;
    dpi?: number;
  }
): {
  image: HTMLImageElement | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
} {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const {
    lat,
    lng,
    zoom,
    style,
    mapOffsetX,
    mapOffsetY,
    showMapLabels,
    showMapBuildings,
    showMapParks,
    showMapWater,
    showMapRoads
  } = useMPGStore();
  
  useEffect(() => {
    if (!isMaptilerConfigured()) {
      setError(new Error('Maptiler API key not configured'));
      setIsLoading(false);
      return;
    }
    
    const renderMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Calculate adjusted center based on offset
        const metersPerPixel = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
        const deltaLat = (mapOffsetY * metersPerPixel) / 111111;
        const deltaLng = (mapOffsetX * metersPerPixel) / (111111 * Math.cos(lat * Math.PI / 180));
        
        const mapOptions = {
          lat: lat - deltaLat,
          lng: lng + deltaLng,
          zoom,
          width,
          height,
          style: getMapStyle(style, {
            showLabels: showMapLabels,
            showBuildings: showMapBuildings,
            showParks: showMapParks,
            showWater: showMapWater,
            showRoads: showMapRoads
          })
        };
        
        const img = options?.isExport
          ? await renderMapForExport(mapOptions, options.dpi || 96)
            .then(dataUrl => {
              const image = new Image();
              return new Promise<HTMLImageElement>((resolve, reject) => {
                image.onload = () => resolve(image);
                image.onerror = reject;
                image.src = dataUrl;
              });
            })
          : await renderMapToImageElement(mapOptions);
        
        setImage(img);
        setIsLoading(false);
      } catch (err) {
        console.error('Error rendering map:', err);
        setError(err instanceof Error ? err : new Error('Failed to render map'));
        setIsLoading(false);
      }
    };
    
    renderMap();
  }, [lat, lng, zoom, style, mapOffsetX, mapOffsetY, width, height, refreshTrigger, options?.isExport, options?.dpi, showMapLabels, showMapBuildings, showMapParks, showMapWater, showMapRoads]);
  
  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return { image, isLoading, error, refresh };
}

/**
 * Check if MapLibre is available and configured
 */
export function isMapLibreAvailable(): boolean {
  return isMaptilerConfigured();
}

/**
 * Fallback to raster tiles if MapLibre is not available
 */
export async function getFallbackMapImage(options: {
  lat: number;
  lng: number;
  zoom: number;
  width: number;
  height: number;
  style: string;
}): Promise<HTMLImageElement> {
  // Import the old map service as fallback
  const { fetchStaticMapImage } = await import('./MPG-map-service');
  return fetchStaticMapImage(options);
}