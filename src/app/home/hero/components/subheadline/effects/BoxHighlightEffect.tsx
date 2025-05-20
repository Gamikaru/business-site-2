// src/app/home/components/subheadline/effects/BoxHighlightEffect.tsx
'use client'

import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface BoxHighlightEffectProps {
  gradientColor: string;
  isHovered: boolean;
  isFinalBox: boolean;
  index: number;
}

/**
 * Component that renders a highlight effect when a box is hovered
 */
const BoxHighlightEffect: React.FC<BoxHighlightEffectProps> = ({
  gradientColor,
  isHovered,
  isFinalBox,
  index
}) => {
  // Skip rendering if not hovered
  if (!isHovered) return null;

  // Different effects based on box type
  const gradientDirection = isFinalBox
    ? 'linear-gradient(135deg, transparent 30%, rgba(var(--rgb-glass-bg, 15, 15, 22), 0.1) 60%, rgba(var(--rgb-glass-bg, 15, 15, 22), 0.2) 70%, rgba(var(--rgb-glass-bg, 15, 15, 22), 0.3) 80%)'
    : 'linear-gradient(135deg, transparent 40%, rgba(var(--rgb-glass-bg, 15, 15, 22), 0.1) 70%, rgba(var(--rgb-glass-bg, 15, 15, 22), 0.15) 80%)';

  // Glow effect sizes based on box type
  const glowSize = isFinalBox ? '25%' : '35%';
  const glowOffset = isFinalBox ? '10%' : '15%';

  return (
    <>
      {/* Ambient light effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
        style={{
          background: gradientDirection,
          zIndex: 1
        }}
      />

      {/* Glow position calculation based on box index */}
      <motion.div
        className="absolute pointer-events-none rounded-full opacity-40"
        style={{
          width: glowSize,
          height: glowSize,
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 70%)`,
          top: index === 0 ? '25%' : index === 1 ? '15%' : '60%',
          right: index === 0 ? glowOffset : index === 1 ? '20%' : '10%',
          zIndex: 0
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        aria-hidden="true"
      />
    </>
  );
};

export default memo(BoxHighlightEffect);