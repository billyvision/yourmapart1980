'use client'
import React from 'react';

interface PinIconProps {
  color: string;
  size?: number;
}

export const BasicPin: React.FC<PinIconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 6.38 8.5 15.5 8.5 15.5s8.5-9.12 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 11.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
      fill={color}
    />
  </svg>
);

export const FavePin: React.FC<PinIconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 3C7.58 3 4 6.58 4 11c0 5.5 8 13 8 13s8-7.5 8-13c0-4.42-3.58-8-8-8z"
      fill={color}
    />
    <path 
      d="M12 8.5c-.51-.42-1.24-.5-1.85-.2-.61.3-1 .95-1 1.65 0 1.2 1.4 2.3 2.85 3.8 1.45-1.5 2.85-2.6 2.85-3.8 0-.7-.39-1.35-1-1.65-.61-.3-1.34-.22-1.85.2z"
      fill="white"
    />
  </svg>
);

export const LolliPin: React.FC<PinIconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="9" r="7" fill={color} />
    <rect x="11" y="16" width="2" height="12" fill={color} />
    <circle cx="12" cy="9" r="3" fill="white" />
  </svg>
);

export const HeartPin: React.FC<PinIconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
    />
  </svg>
);

export const HomePin: React.FC<PinIconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 2L2 9v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9l-10-7z"
      fill={color}
    />
    <path 
      d="M9 20v-6h6v6h4v-9L12 6 5 11v9h4z"
      fill="white"
    />
  </svg>
);

export const getPinIcon = (pinStyle: string, color: string, size?: number) => {
  switch (pinStyle) {
    case 'basic':
      return <BasicPin color={color} size={size} />;
    case 'fave':
      return <FavePin color={color} size={size} />;
    case 'lolli':
      return <LolliPin color={color} size={size} />;
    case 'heart':
      return <HeartPin color={color} size={size} />;
    case 'home':
      return <HomePin color={color} size={size} />;
    default:
      return <BasicPin color={color} size={size} />;
  }
};