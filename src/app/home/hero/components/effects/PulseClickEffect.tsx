import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { PulseClick, FieldEffect } from '../../hooks/useMouseInteraction';
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences';

interface PulseClickEffectProps {
  pulseClicks: PulseClick[];
  getColorByIndex: (index: number) => string;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    [key: string]: string | undefined;
  };
  intensity?: number;
  fieldEffects?: FieldEffect[];
}

const PulseClickEffect: React.FC<PulseClickEffectProps> = ({
  pulseClicks,
  getColorByIndex,
  accentColors,
  intensity = 1
}) => {
  const { reducedMotion } = useAnimationPreferences();

  // Don't render any pulses if reduced motion is preferred or no pulses exist
  if (reducedMotion || pulseClicks.length === 0) return null;

  // Only show the most recent pulse for simplicity
  const recentPulse = pulseClicks[pulseClicks.length - 1];

  // Scale effect size based on intensity prop, but keep it modest
  const effectScale = Math.min(0.8, intensity * 0.6);

  // Get the color for this pulse
  const colorKey = getColorByIndex(recentPulse.colorIndex);
  const pulseColor =
    colorKey === "accent-primary"
      ? accentColors.primary
      : colorKey === "accent-secondary"
        ? accentColors.secondary
        : colorKey === "accent-warm" && accentColors.warm
          ? accentColors.warm
          : colorKey === "accent-contrast" && accentColors.contrast
            ? accentColors.contrast
            : accentColors.primary; // Fallback to primary

  return (
    <motion.div
      key={`pulse-${recentPulse.id}`}
      className="absolute pointer-events-none"
      style={{
        left: `${recentPulse.x * 100}%`,
        top: `${recentPulse.y * 100}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 20,
      }}
      initial={{ opacity: 0.5, scale: 0 }}
      animate={{
        opacity: [0.5, 0.4, 0.3, 0.2, 0],
        scale: [0, 0.4, 0.8, 1.2, 1.5 * effectScale], // Reduced scale
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 1.2, // Slightly slower for smoother effect
        ease: [0.19, 1, 0.22, 1],
        times: [0, 0.2, 0.5, 0.8, 1]
      }}
    >
      {/* Simplified pulse effect - just a single element */}
      <div
        className="w-16 h-16 rounded-full" // Smaller size
        style={{
          background: `radial-gradient(circle, ${pulseColor}30 0%, ${pulseColor}10 50%, transparent 80%)`,
          boxShadow: `0 0 8px 0 ${pulseColor}20`, // Subtle glow
          opacity: 0.4 // Lower opacity
        }}
      />
    </motion.div>
  );
};

// Optimize with memo to prevent unnecessary renders
export default memo(PulseClickEffect, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  if (prevProps.pulseClicks.length !== nextProps.pulseClicks.length) {
    return false; // Re-render when number of pulses changes
  }

  // Check if intensity changed significantly
  if (Math.abs((prevProps.intensity || 1) - (nextProps.intensity || 1)) > 0.1) {
    return false;
  }

  // For small arrays, check if the last pulse ID is the same
  if (prevProps.pulseClicks.length > 0 && nextProps.pulseClicks.length > 0) {
    const prevLast = prevProps.pulseClicks[prevProps.pulseClicks.length - 1];
    const nextLast = nextProps.pulseClicks[nextProps.pulseClicks.length - 1];
    return prevLast.id === nextLast.id;
  }

  return true; // Default to equality
});