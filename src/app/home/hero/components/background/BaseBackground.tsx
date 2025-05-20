// src/app/home/components/background/BaseBackground.tsx
'use client'

import React, { memo, useEffect, useRef, useState, useMemo } from 'react'
import { motion, MotionValue, useTransform, useSpring } from 'framer-motion'
import { BackgroundBaseProps } from './BackgroundTypes'
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences'
import { animationManager } from '@/components/core/Animations/utils/AnimationManager'

interface BaseBackgroundProps extends BackgroundBaseProps {
  backgroundY: MotionValue<string>
  backgroundScale: MotionValue<number>
}

const BaseBackground: React.FC<BaseBackgroundProps> = ({
  backgroundY,
  backgroundScale,
  accentColors,
  mousePosition,
  animationControls
}) => {
  // Get animation preferences from the system
  const { shouldAnimate, getTransitionSettings, reducedMotion } = useAnimationPreferences()

  // Generate unique ID for this animation
  const animationId = useRef(`base-background-${Math.random().toString(36).substring(2, 9)}`)

  // Predefine initial styles for stability
  const initialStyle = {
    opacity: 0,
    background: 'var(--color-primary-bg)', // Ensure we have a base color from the start
    transform: 'translate3d(0,0,0)', // Force GPU acceleration
    backfaceVisibility: 'hidden', // Prevent flickering
    WebkitBackfaceVisibility: 'hidden', // For Safari
  }

  // Create a more stable gradient background that doesn't change
  const backgroundGradient = useMemo(() => {
    return `radial-gradient(
      circle at 50%,
      var(--color-tertiary-bg) 0%,
      var(--color-secondary-bg) 50%,
      var(--color-primary-bg) 100%
    )`;
  }, []);

  // Single stable gradient overlay for a subtle accent effect
  const accentGradient = useMemo(() => {
    return `linear-gradient(165deg,
      ${accentColors.secondary}15 10%,
      transparent 60%,
      ${accentColors.primary}15 90%
    )`;
  }, [accentColors.primary, accentColors.secondary]);

  // Register animation with AnimationManager
  useEffect(() => {
    if (!shouldAnimate()) return

    // Track this animation instance with the manager
    animationManager.trackAnimation(animationId.current, 'hero-background')

    return () => {
      animationManager.untrackAnimation(animationId.current)
    }
  }, [shouldAnimate])

  // Get system-appropriate transition settings
  const { duration, ease } = getTransitionSettings('slow')

  // Calculate animation phase based on sequence progress
  const entryProgress = animationControls.progress
  const activeBlend = animationControls.isComplete ? 1 : entryProgress

  return (
    <>
      {/* Base layer - hardware accelerated and respecting reduced motion */}
      <motion.div
        className="absolute inset-0 overflow-hidden bg-primary-bg"
        style={{
          y: reducedMotion ? 0 : backgroundY,
          scale: reducedMotion ? 1 : backgroundScale,
          willChange: reducedMotion ? 'auto' : 'transform',
          isolation: 'isolate', // Create a new stacking context
        }}
      >
        {/* Deep background layer - static, no movement */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: backgroundGradient,
            opacity: 0, // Start invisible
            transform: 'translate3d(0,0,0)', // Force GPU acceleration
            backfaceVisibility: 'hidden', // Prevent flickering
          }}
          initial={initialStyle}
          animate={{
            opacity: 0.7 + activeBlend * 0.3,
            transition: {
              duration: 1.6, // Increased duration for smoother transition
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1 // Small delay to ensure CSS is applied first
            }
          }}
        />

        {/* Single accent layer with very subtle blend */}
        <motion.div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background: accentGradient,
            opacity: 0,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: activeBlend * 0.8,
            transition: {
              duration: 1,
              ease,
              delay: 0.1 // Staggered animation
            }
          }}
        />
      </motion.div>

      {/* Subtle darkening overlay for better contrast */}
      <motion.div
        className="absolute inset-0 bg-black dark-mode-overlay"
        style={{
          opacity: 0,
          mixBlendMode: 'multiply',
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.2 + (0.1 * activeBlend),
          transition: {
            duration: 1,
            ease,
            delay: 0.15
          }
        }}
      />

      {/* Subtle noise texture */}
      <motion.div
        className="absolute inset-0 bg-dots-dense mix-blend-overlay"
        style={{
          opacity: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.05 + (0.1 * activeBlend),
          transition: {
            duration: 1.2,
            ease,
            delay: 0.2
          }
        }}
      />

      {/* Subtle vignette effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            circle at 50% 50%,
            transparent 40%,
            rgba(0, 0, 0, 0.15) 100%
          )`,
          opacity: 0,
          mixBlendMode: 'multiply'
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.4 * activeBlend,
          transition: {
            duration: 2,
            ease,
            delay: 0.25
          }
        }}
      />
    </>
  )
}

export default memo(BaseBackground)