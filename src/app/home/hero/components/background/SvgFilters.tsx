// src/app/home/components/background/SvgFilters.tsx
"use client";

import React, { memo } from 'react';

interface SvgFiltersProps {
  useHighQuality?: boolean;
}

const SvgFilters: React.FC<SvgFiltersProps> = ({
  useHighQuality = true
}) => {
  return (
    <svg width="0" height="0" className="absolute" style={{ visibility: 'hidden' }}>
      {/* Simplified pixelation filter for CRT aesthetic */}
      <filter id="subtle-pixelate-filter" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feFlood x="2" y="2" height="1" width="1"/>
        <feComposite width="4" height="4"/>
        <feTile result="a"/>
        <feComposite in="SourceGraphic" in2="a" operator="in"/>
        <feMorphology operator="dilate" radius="0.8"/>
      </filter>

      {/* Enhanced glow filter with better light diffusion */}
      <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="2.5" result="blur1"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur2"/>
        <feBlend in="blur1" in2="blur2" mode="screen" result="blended"/>
        <feComposite in="SourceGraphic" in2="blended" operator="over"/>
      </filter>

      {/* Depth-of-field blur filter for background effects */}
      <filter id="depth-blur-filter" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 0.8 0"
          in="blur"
          result="adjustedBlur"
        />
        <feBlend in="SourceGraphic" in2="adjustedBlur" mode="normal"/>
      </filter>

      {/* High-quality noise texture filter for CRT grain */}
      {useHighQuality && (
        <filter id="noise-texture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.05 0"
            in="noise"
            result="adjusted-noise"
          />
          <feBlend in="SourceGraphic" in2="adjusted-noise" mode="overlay"/>
        </filter>
      )}
    </svg>
  );
};

export default memo(SvgFilters);