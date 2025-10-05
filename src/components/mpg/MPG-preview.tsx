'use client'
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMPGStore } from '@/lib/mpg/MPG-store';
import { MPG_TILE_PROVIDERS, MPG_TEXT_STYLES } from '@/lib/mpg/MPG-constants';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

// Map controller component to handle zoom and center changes
function MapController() {
  const map = useMap();
  const { lat, lng, zoom, setMapInstance } = useMPGStore();

  useEffect(() => {
    setMapInstance(map);
  }, [map, setMapInstance]);

  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [map, lat, lng, zoom]);

  return null;
}

interface MPGPreviewProps {
  containerRef?: React.RefObject<HTMLDivElement>;
  isExportMode?: boolean;
}

export function MPGPreview({ containerRef, isExportMode = false }: MPGPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapKey, setMapKey] = useState(0);
  
  const {
    city,
    lat,
    lng,
    country,
    zoom,
    style,
    frameStyle,
    showCoordinates,
    showCountry,
    customText,
    titleFont,
    letterSpacing,
    getCurrentStyle,
    getCoordinatesText
  } = useMPGStore();

  const currentStyle = getCurrentStyle();
  const tileProvider = currentStyle?.tileProvider || 'osm';
  const tileConfig = MPG_TILE_PROVIDERS[tileProvider as keyof typeof MPG_TILE_PROVIDERS] || MPG_TILE_PROVIDERS.osm;

  // Force map re-render when style changes
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [style]);

  // Apply filter to map container
  useEffect(() => {
    if (mapContainerRef.current && currentStyle) {
      const mapElement = mapContainerRef.current.querySelector('.leaflet-container');
      if (mapElement) {
        (mapElement as HTMLElement).style.filter = currentStyle.filter;
      }
    }
  }, [currentStyle, mapKey]);

  const getFrameClasses = () => {
    switch (frameStyle) {
      case 'circle':
        return 'rounded-full';
      case 'square':
        return 'rounded-none';
      case 'heart':
      case 'house':
        return 'rounded-2xl';
      default:
        return 'rounded-full';
    }
  };

  const getFontFamily = (fontId: string) => {
    const fontMap: Record<string, string> = {
      'playfair': 'Playfair Display',
      'montserrat': 'Montserrat',
      'bebas': 'Bebas Neue',
      'roboto': 'Roboto',
      'lato': 'Lato',
      'oswald': 'Oswald',
      'opensans': 'Open Sans'
    };
    return fontMap[fontId] || 'Roboto';
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-white ${isExportMode ? '' : 'rounded-2xl shadow-lg'} p-8`}
      style={isExportMode ? { width: '100%', height: '100%' } : {}}
    >
      {/* Map Container */}
      <div className="relative mb-8">
        <div 
          ref={mapContainerRef}
          className={`relative ${getFrameClasses()}`}
          style={{
            width: isExportMode ? '100%' : '500px',
            height: isExportMode ? '100%' : '500px',
            maxWidth: '100%',
            margin: '0 auto',
            overflow: 'hidden',
            backgroundColor: '#f0f0f0'
          }}
        >
          <MapContainer
            key={mapKey}
            center={[lat, lng]}
            zoom={zoom}
            style={{ 
              width: '100%', 
              height: '100%',
              position: 'relative'
            }}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={!isExportMode}
            dragging={!isExportMode}
            doubleClickZoom={!isExportMode}
            touchZoom={!isExportMode}
          >
            <TileLayer
              url={tileConfig.url}
              attribution={tileConfig.attribution}
              crossOrigin="anonymous"
            />
            <MapController />
          </MapContainer>
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center space-y-2">
        {/* City Name */}
        <h2 
          className="text-charcoal"
          style={{
            fontFamily: getFontFamily(titleFont),
            fontSize: `${MPG_TEXT_STYLES.title.fontSize}px`,
            fontWeight: MPG_TEXT_STYLES.title.fontWeight,
            letterSpacing: `${letterSpacing}px`,
            textTransform: MPG_TEXT_STYLES.title.textTransform,
            lineHeight: 1.2
          }}
        >
          {city.toUpperCase()}
        </h2>

        {/* Coordinates */}
        {showCoordinates && (
          <p 
            className="text-medium-gray"
            style={{
              fontSize: `${MPG_TEXT_STYLES.coordinates.fontSize}px`,
              fontWeight: MPG_TEXT_STYLES.coordinates.fontWeight,
              letterSpacing: `${MPG_TEXT_STYLES.coordinates.letterSpacing}px`
            }}
          >
            {getCoordinatesText()}
          </p>
        )}

        {/* Country */}
        {showCountry && (
          <p 
            className="text-gray-600"
            style={{
              fontSize: `${MPG_TEXT_STYLES.country.fontSize}px`,
              fontWeight: MPG_TEXT_STYLES.country.fontWeight,
              letterSpacing: `${MPG_TEXT_STYLES.country.letterSpacing}px`,
              textTransform: MPG_TEXT_STYLES.country.textTransform
            }}
          >
            {country.toUpperCase()}
          </p>
        )}

        {/* Custom Text */}
        {customText && (
          <p 
            className="text-gray-600 mt-4"
            style={{
              fontSize: `${MPG_TEXT_STYLES.customText.fontSize}px`,
              fontWeight: MPG_TEXT_STYLES.customText.fontWeight,
              fontStyle: MPG_TEXT_STYLES.customText.fontStyle
            }}
          >
            {customText}
          </p>
        )}
      </div>
    </div>
  );
}