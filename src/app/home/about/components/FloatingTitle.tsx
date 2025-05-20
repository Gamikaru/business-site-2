"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationPreferences } from '@/components/core/Animations';

interface FloatingTitleProps {
  title: string;
  index: number;
  alignment: 'left' | 'right';
  isVisible: boolean;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
}

export const FloatingTitle: React.FC<FloatingTitleProps> = ({
  title,
  index,
  alignment,
  isVisible,
  accentColors
}) => {
  const { reducedMotion } = useAnimationPreferences();

  // Position based on alignment and index
  const getPosition = () => {
    if (alignment === 'left') {
      return { right: '-5rem', top: '1rem' };
    } else {
      return { left: '-5rem', top: '1rem' };
    }
  };

  // Animation for floating effect
  const floatingAnimation = {
    hidden: {
      opacity: 0,
      x: alignment === 'left' ? 40 : -40,
      rotateZ: alignment === 'left' ? -5 : 5
    },
    visible: {
      opacity: 0.08,
      x: 0,
      rotateZ: 0,
      transition: {
        delay: 0.4 + (index * 0.1),
        duration: 1,
        ease: [0.25, 1, 0.5, 1]
      }
    }
  };

  // Color based on index for variety
  const getColor = () => {
    switch (index % 3) {
      case 0: return accentColors.primary;
      case 1: return accentColors.secondary;
      case 2: return accentColors.tertiary;
      default: return accentColors.brand;
    }
  };

  // Don't show floating text in reduced motion mode
  if (reducedMotion) {
    return null;
  }

  return (
    <motion.div
      className="absolute pointer-events-none select-none z-0 font-heading font-extrabold tracking-tight"
      style={{
        ...getPosition(),
        color: getColor(),
        writingMode: alignment === 'left' ? 'vertical-rl' : 'vertical-lr',
        textOrientation: 'mixed',
        fontSize: '7rem',
        lineHeight: '1'
      }}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={floatingAnimation}
    >
      {title}
    </motion.div>
  );
};
