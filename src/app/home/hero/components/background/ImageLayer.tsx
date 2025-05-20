// src/app/home/components/background/ImageLayer.tsx
'use client'

import React, { memo, useEffect, useState, useRef } from 'react'
import { motion, MotionValue } from 'framer-motion'
import Image from 'next/image'
import { BackgroundBaseProps } from './BackgroundTypes'
import {
  useAnimationPreferences,
  ScrollLinkedAnimation,
} from '@/components/core/Animations'
import { animationManager } from '@/components/core/Animations/utils/AnimationManager'

interface ImageLayerProps extends BackgroundBaseProps {
  imageSrc: string
  imageAlt: string
  backgroundY: MotionValue<string>
  backgroundScale: MotionValue<number>
}

const ImageLayer: React.FC<ImageLayerProps> = ({
  imageSrc,
  imageAlt,
  backgroundY,
  backgroundScale,
  accentColors,
  mousePosition,
  animationControls
}) => {
  // Animation system hooks
  const { shouldAnimate, getTransitionSettings, reducedMotion } = useAnimationPreferences()
  const animationId = useRef(`image-layer-${Math.random().toString(36).substring(2, 9)}`)

  // State for image loading
  const [imageLoaded, setImageLoaded] = useState(false)

  // Fixed values for stable aesthetics
  const scanlineOpacity = 0.12
  const glowIntensity = 0.15

  // Register animation with AnimationManager
  useEffect(() => {
    if (!shouldAnimate()) return

    animationManager.trackAnimation(animationId.current, 'image-layer')

    return () => {
      animationManager.untrackAnimation(animationId.current)
    }
  }, [shouldAnimate])

  // Get pixelation filter for CRT effect - but now stable without glitching
  const getPixelationFilter = () => {
    if (reducedMotion) return ''
    return 'url(#subtle-pixelate-filter)' // Use only the subtle pixelation
  }

  // Get system transition settings
  const { duration, ease } = getTransitionSettings('default')

  // Calculate animation progress for coordinated reveals
  const entryProgress = animationControls.progress
  const imageOpacity = imageLoaded ? Math.min(1, entryProgress * 2) : 0

  return (
    <>
      {/* Stable scanlines overlay with fixed properties */}
      <motion.div
        className="absolute inset-0 pointer-events-none scanlines"
        style={{
          opacity: reducedMotion ? 0.1 : scanlineOpacity,
          backgroundSize: `100% 4px`, // Fixed size, no animation
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: reducedMotion ? 0.1 : scanlineOpacity }}
        transition={{ duration: 1.2 }}
      />

      <ScrollLinkedAnimation
        scrubRange={[0, 0.5]}
        translateYRange={reducedMotion ? [0, 0] : [-10, 15]}
        scaleRange={reducedMotion ? [1, 1] : [0.98, 1.02]}
        className={`absolute inset-0 transition-all duration-100 overflow-visible`}
      >
        {/* Image container with pixelation but no glitch effects */}
        <motion.div
          className="absolute inset-0"
          style={{
            perspective: '1000px'
          }}
        >
          {/* Base image with stable pixelation */}
          <motion.div
            className="absolute inset-0 mix-blend-luminosity base-image"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: imageOpacity * 0.7,
              scale: imageLoaded ? 1 : 1.05
            }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <div
              className="pixelated-container"
              style={{
                filter: getPixelationFilter(),
              }}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="100vw"
                priority
                className="w-full h-full object-cover object-center pixelated"
                quality={90}
                style={{
                  objectFit: "cover",
                  transform: `translate3d(0, 0, 0)`
                }}
                onLoadingComplete={() => setImageLoaded(true)}
              />
            </div>
          </motion.div>
        </motion.div>
      </ScrollLinkedAnimation>

      {/* Stable CRT glow effect without animation */}
      {!reducedMotion && (
        <motion.div
          className="absolute inset-0 crt-glow pointer-events-none"
          style={{
            opacity: 0
          }}
          animate={{
            opacity: imageLoaded ? glowIntensity : 0,
          }}
          transition={{
            duration: duration * 1.5,
            ease,
            delay: 0.2
          }}
        />
      )}

      {/* Subtle vignette effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            circle at 50% 50%,
            transparent 55%,
            rgba(0, 0, 0, 0.3) 95%
          )`,
          opacity: imageOpacity * 0.5,
          mixBlendMode: 'multiply',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: imageOpacity * 0.5 }}
        transition={{ duration: 1.5 }}
      />

      <style jsx>{`
        .scanlines {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.3) 50%
          );
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }

        .pixelated-container {
          width: 100%;
          height: 100%;
          transform: translate3d(0, 0, 0); /* Hardware acceleration */
        }

        .crt-glow {
          background: radial-gradient(
            ellipse at center,
            ${accentColors.primary}15 0%,
            ${accentColors.secondary}10 50%,
            ${accentColors.tertiary}05 100%
          );
          pointer-events: none;
          mix-blend-mode: screen;
          transform: translate3d(0, 0, 0);
          filter: blur(12px);
        }
      `}</style>
    </>
  )
}

export default memo(ImageLayer)