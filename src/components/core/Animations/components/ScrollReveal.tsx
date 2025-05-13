// src/components/common/Animations/components/ScrollReveal.tsx
"use client";

import React, { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useAnimationPreferences } from '../hooks/useAnimationPreferences';

interface ScrollRevealProps extends Omit<MotionProps, 'transition' | 'initial' | 'whileInView' | 'viewport'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'opacity';
  distance?: number;
  once?: boolean;
  className?: string;
  threshold?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration,
  direction = 'up',
  distance = 50,
  once = true,
  className = "",
  threshold = 0.2,
  ...motionProps
}) => {
  const { shouldAnimate, getTransitionSettings, getIntensity } = useAnimationPreferences();

  // Apply intensity to distance
  const effectiveDistance = distance * getIntensity();

  // If animations are disabled, just render children
  if (!shouldAnimate()) {
    return <div className={className}>{children}</div>;
  }

  // Get transition settings
  const { duration: calculatedDuration, ease } = getTransitionSettings(
    'default',
    duration
  );

  // Create initial and animate states based on direction
  let initial = {};

  switch (direction) {
    case 'up':
      initial = { y: effectiveDistance, opacity: 0 };
      break;
    case 'down':
      initial = { y: -effectiveDistance, opacity: 0 };
      break;
    case 'left':
      initial = { x: effectiveDistance, opacity: 0 };
      break;
    case 'right':
      initial = { x: -effectiveDistance, opacity: 0 };
      break;
    case 'scale':
      initial = { scale: 0.92, opacity: 0 };
      break;
    case 'opacity':
    default:
      initial = { opacity: 0 };
      break;
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: `-${Math.round(threshold * 100)}px` }}
      transition={{
        duration: calculatedDuration,
        delay,
        ease
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;