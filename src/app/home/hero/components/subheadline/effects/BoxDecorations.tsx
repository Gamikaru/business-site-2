// src/app/home/components/subheadline/effects/BoxDecorations.tsx
'use client'

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAnimationPreferences } from '@/components/core/Animations';

interface BoxDecorationsProps {
  accentColor: string;
  animationProgress: number;
  isFinalBox: boolean;
}

const BoxDecorations: React.FC<BoxDecorationsProps> = ({
  accentColor,
  animationProgress,
  isFinalBox
}) => {
  const { getTransitionSettings } = useAnimationPreferences();
  const { duration } = getTransitionSettings('default');

  // Pre-calculate animation timings based on system duration
  const timings = useMemo(() => ({
    diagonalDelay: duration * 1.5,
    diagonalDuration: duration * 0.3,
    lineDelay: duration * 1.6,
    lineDuration: duration * 0.8,
    cornerDelay: duration * 1.7,
    cornerDuration: duration * 0.3,
    cornerPathDelay: duration * 1.8,
    cornerPathDuration: duration * 0.5
  }), [duration]);

  // Only show decorations for final box
  if (!isFinalBox || animationProgress <= 0.8) {
    return null;
  }

  return (
    <>
      {/* Diagonal accent line with container */}
      <motion.div
        className="absolute right-0 top-0 w-24 h-24 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: animationProgress > 0.8 ? 1 : 0
        }}
        transition={{
          delay: timings.diagonalDelay,
          duration: timings.diagonalDuration
        }}
      >
        <motion.div
          className="absolute right-0 top-0 w-48 h-1"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor})`,
            transformOrigin: "right top",
            rotate: "135deg",
            translateX: "50%",
            willChange: 'transform'
          }}
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: animationProgress > 0.9 ? 1 : 0
          }}
          transition={{
            delay: timings.lineDelay,
            duration: timings.lineDuration,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        />
      </motion.div>

      {/* Corner accent using SVG for better performance */}
      <motion.div
        className="absolute -right-2 -bottom-2 w-20 h-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: animationProgress > 0.95 ? 1 : 0
        }}
        transition={{
          delay: timings.cornerDelay,
          duration: timings.cornerDuration
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <motion.path
            d="M80,80 L60,80 L80,60 Z"
            fill={accentColor}
            initial={{ scale: 0 }}
            animate={{
              scale: animationProgress > 0.98 ? 1 : 0
            }}
            transition={{
              delay: timings.cornerPathDelay,
              duration: timings.cornerPathDuration,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            style={{
              transformOrigin: 'bottom right',
              willChange: 'transform'
            }}
          />
        </svg>
      </motion.div>
    </>
  );
};

export default memo(BoxDecorations);