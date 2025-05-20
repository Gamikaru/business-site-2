// src/components/core/Animations/components/RetroCRT.tsx
'use client'

import React, { memo, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAnimationPreferences } from '../hooks/useAnimationPreferences'
import { animationManager } from '../utils/AnimationManager'

interface RetroCRTProps {
  children: React.ReactNode
  scanlineOpacity?: number
  glowColor?: string
  glowIntensity?: number
  noiseOpacity?: number
  className?: string
  id?: string
}

const RetroCRT: React.FC<RetroCRTProps> = ({
  children,
  scanlineOpacity = 0.15,
  glowColor = 'var(--color-accent-primary)',
  glowIntensity = 0.2,
  noiseOpacity = 0.05,
  className = '',
  id: providedId
}) => {
  const { shouldAnimate, reducedMotion, getTransitionSettings } = useAnimationPreferences()
  const uniqueId = useRef(`retro-crt-${providedId || Math.random().toString(36).substring(2, 9)}`)
  const [currentGlowIntensity, setCurrentGlowIntensity] = useState(glowIntensity)

  // Animation loop for subtle CRT effects
  useEffect(() => {
    if (!shouldAnimate() || reducedMotion) return

    let lastUpdate = 0
    const updateInterval = 800 // ms

    const animateLoop = (timestamp: number) => {
      if (timestamp - lastUpdate >= updateInterval) {
        lastUpdate = timestamp

        // Subtle random changes to glow intensity
        setCurrentGlowIntensity(glowIntensity + Math.random() * 0.1)
      }
    }

    animationManager.subscribeToAnimationTick(uniqueId.current, animateLoop)
    animationManager.trackAnimation(uniqueId.current, 'retro-crt')

    return () => {
      animationManager.unsubscribeFromAnimationTick(uniqueId.current)
      animationManager.untrackAnimation(uniqueId.current)
    }
  }, [shouldAnimate, reducedMotion, glowIntensity])

  // Get system transition settings
  const { duration, ease } = getTransitionSettings('slow')

  // If animations disabled or reduced motion, just render children
  if (reducedMotion || !shouldAnimate()) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main content */}
      {children}

      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none scanlines"
        style={{ opacity: scanlineOpacity }}
      />

      {/* CRT glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none crt-glow"
        style={{ willChange: 'opacity, filter' }}
        animate={{
          opacity: [currentGlowIntensity - 0.05, currentGlowIntensity, currentGlowIntensity - 0.05],
        }}
        transition={{
          duration: duration * 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease
        }}
      />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none noise"
        style={{ opacity: noiseOpacity }}
      />

      <style jsx>{`
        .scanlines {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.3) 50%
          );
          background-size: 100% 4px;
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        .crt-glow {
          background: radial-gradient(
            ellipse at center,
            ${glowColor}30 0%,
            ${glowColor}15 50%,
            transparent 80%
          );
          mix-blend-mode: screen;
          filter: blur(${8 + Math.sin(Date.now() * 0.001) * 2}px);
          transform: translate3d(0, 0, 0);
        }

        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          mix-blend-mode: overlay;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

export default memo(RetroCRT)