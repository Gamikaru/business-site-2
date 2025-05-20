// src/app/home/components/subheadline/TechnicalMarkers.tsx
'use client'

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AccentColors } from './SubheadlineTypes';
import { useAnimationPreferences } from '@/components/core/Animations';

// Technical symbols to replace numbers - moved outside component
const technicalSymbols = [
  { symbol: "<div>", type: "html" },
  { symbol: "{ }", type: "code" },
  { symbol: "=>", type: "function" },
  { symbol: "&&", type: "logic" },
  { symbol: "API", type: "data" },
  { symbol: "()", type: "method" },
  { symbol: "[]", type: "array" },
  { symbol: ".tsx", type: "file" },
  { symbol: "$_", type: "var" },
  { symbol: "</>", type: "component" },
  { symbol: "fn()", type: "function" },
  { symbol: "||", type: "or" },
];

// Color keys for consistent color assignment
const COLOR_KEYS = ['accent-primary', 'accent-secondary', 'accent-tertiary', 'brand', 'oceanic'];

// Animation variant for markers - optimized for performance
const markerVariants = {
  hidden: { opacity: 0, x: -5 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay,
      ease: [0.25, 0.1, 0.25, 1] // Custom cubic easing
    }
  })
};

interface TechnicalMarkersProps {
  index: number;
  isLarge?: boolean;
  accentColors: AccentColors;
  animationProgress?: number;
}

const TechnicalMarkers: React.FC<TechnicalMarkersProps> = ({
  index,
  isLarge = false,
  accentColors,
  animationProgress = 1
}) => {
  // Use animation system preferences
  const { reducedMotion, getTransitionSettings } = useAnimationPreferences();
  const { duration } = getTransitionSettings('default');

  const count = isLarge ? 6 : 3;
  const startIndex = index * 3; // Start from different parts of the array

  // Pre-calculate markers to prevent recalculation on each render
  const markers = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const isLast = i === count - 1;
      const symbolIndex = (startIndex + i) % technicalSymbols.length;
      const { symbol, type } = technicalSymbols[symbolIndex];

      // Alternate colors based on box index and position
      const colorKey = COLOR_KEYS[(index + i) % COLOR_KEYS.length];
      const accentColorKey = colorKey === 'accent-primary' ? 'primary' :
                            colorKey === 'accent-secondary' ? 'secondary' :
                            colorKey === 'accent-tertiary' ? 'tertiary' :
                            colorKey === 'oceanic' ? 'oceanic' : 'brand';

      return {
        id: `marker-${index}-${i}`,
        symbol,
        type,
        isLast,
        accentColor: accentColors[accentColorKey as keyof AccentColors] || accentColors.primary,
        delay: (1.0 + (index * 0.15) + (i * 0.08)) * duration,
        // Each marker appears at a specific progress threshold
        progressThreshold: 0.7 + (i / count) * 0.3
      };
    });
  }, [index, count, startIndex, accentColors, duration]);

  // Skip rendering for reduced motion
  if (reducedMotion) {
    return null;
  }

  // Only show markers that should be visible based on animation progress
  const visibleMarkers = markers.filter(marker =>
    animationProgress >= marker.progressThreshold
  );

  return (
    <>
      {visibleMarkers.map(marker => (
        <motion.span
          key={marker.id}
          className="px-1 pt-1 text-[9px] tracking-tight font-mono"
          style={{
            borderLeft: `1px solid ${marker.accentColor}`,
            borderTop: `1px solid ${marker.accentColor}`,
            borderRight: marker.isLast ? `1px solid ${marker.accentColor}` : undefined,
            color: marker.accentColor,
            willChange: 'transform, opacity' // Hardware acceleration hint
          }}
          variants={markerVariants}
          initial="hidden"
          animate="visible"
          custom={marker.delay}
          title={`Technical element: ${marker.type}`}
        >
          {marker.symbol}
        </motion.span>
      ))}
    </>
  );
};

export default memo(TechnicalMarkers);