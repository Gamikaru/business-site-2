// src/app/home/components/CircuitLines.tsx
'use client'

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AccentColors } from './SubheadlineTypes';
import { useAnimationPreferences } from '@/components/core/Animations';
import { animationManager } from '@/components/core/Animations/utils/AnimationManager';

interface CircuitLinesProps {
  index: number;
  accentColors: AccentColors;
  animationProgress?: number;
  animationId?: string;
}

// Pre-calculate line configurations with typed return value
const useLineConfigs = (index: number, accentColors: AccentColors, duration: number) => {
  return useMemo(() => {
    const lineCount = index === 3 ? 4 : 2;
    const baseLength = 30 + (index * 10);
    const colorKey =
      index === 0 ? 'primary' :
      index === 1 ? 'secondary' :
      index === 2 ? 'tertiary' : 'brand';
    const baseColor = accentColors[colorKey as keyof AccentColors];

    return Array.from({ length: lineCount }).map((_, i) => ({
      id: `circuit-${index}-${i}`,
      width: baseLength + (i * 25),
      delay: (1.2 + (index * 0.15) + (i * 0.12)) * duration,
      color: baseColor,
      style: i % 2 ? 'dashed' : 'solid',
      strokeWidth: i % 2 ? 0.75 : 1,
      opacity: 0.8 - (i * 0.1),
    }));
  }, [index, accentColors, duration]);
};

const CircuitLines: React.FC<CircuitLinesProps> = ({
  index,
  accentColors,
  animationProgress = 1,
  animationId
}) => {
  // Use animation system preferences
  const { shouldAnimate, reducedMotion, getTransitionSettings } = useAnimationPreferences();

  // Get system-consistent transition settings
  const { duration } = getTransitionSettings('default');

  // Memoize line configurations with proper typing
  const lines = useLineConfigs(index, accentColors, duration);

  // Animation threshold for circuit lines
  const ANIMATION_THRESHOLD = 0.8;

  // Register with animation manager if animationId provided
  React.useEffect(() => {
    if (!animationId || !shouldAnimate()) return;

    animationManager.trackAnimation(animationId, 'circuit-lines');

    return () => {
      animationManager.untrackAnimation(animationId);
    };
  }, [animationId, shouldAnimate]);

  // Skip rendering if reduced motion is preferred or animation is not far enough
  if (reducedMotion || animationProgress <= ANIMATION_THRESHOLD) {
    return null;
  }

  return (
    <div className="absolute -bottom-4 left-5 h-4 pointer-events-none" aria-hidden="true">
      <svg width="100%" height="16" viewBox="0 0 200 16" fill="none">
        {lines.map((line) => {
          const pathDef = `M0,0 L${line.width},0 L${line.width},16`;

          return (
            <motion.path
              key={line.id}
              d={pathDef}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              strokeDasharray={line.style === 'dashed' ? "2 2" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: line.opacity
              }}
              transition={{
                pathLength: {
                  delay: line.delay,
                  duration: duration * 0.7,
                  ease: "easeInOut"
                },
                opacity: {
                  delay: line.delay,
                  duration: duration * 0.4
                }
              }}
              fill="none"
              style={{ willChange: 'opacity, stroke-dashoffset' }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default memo(CircuitLines);