// src/app/home/components/HomeHeroHeadline.tsx
'use client'

import React, { memo, useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/classNames'

interface AccentColors {
  primary: string
  secondary: string
  tertiary: string
  warm?: string
  contrast?: string
  oceanic?: string
  cosmic?: string
  brand: string
}

interface HomeHeroHeadlineProps {
  headline: string
  glitchActive: boolean
  intensiveGlitch: boolean
  glitchOffsets: number[]
  accentColors?: AccentColors
  heroAnimationComplete?: boolean
}

// Enhanced animation variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.2
    }
  },
}

const charVariants = {
  initial: { opacity: 0, y: 60, rotateX: 90 },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1] // Improved easing curve
    }
  },
}

const decorativeVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.3 } }
}

const HomeHeroHeadline: React.FC<HomeHeroHeadlineProps> = ({
  headline,
  glitchActive,
  intensiveGlitch,
  glitchOffsets,
  accentColors = {
    primary: 'var(--color-accent-primary)',
    secondary: 'var(--color-accent-secondary)',
    tertiary: 'var(--color-accent-tertiary)',
    brand: 'var(--color-brand-primary)'
  },
  heroAnimationComplete = false
}) => {
  // Split headline into words and characters for animation
  const words = useMemo(() => headline.split(' '), [headline])
  const characters = useMemo(() => headline.split(''), [headline])

  // State to control whether animation has started
  const [hasAnimated, setHasAnimated] = useState(false);

  // Start animation when hero is ready
  useEffect(() => {
    if (heroAnimationComplete && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [heroAnimationComplete, hasAnimated]);

  // Function to get varied text colors from semantic variables with improved distribution
  const getTextColor = (wordIndex: number, globalIndex: number): string => {
    // Create a more intentional pattern rather than random distribution
    // This creates a more cohesive visual rhythm
    if (globalIndex % 12 === 0) return 'var(--color-accent-primary)'
    if (globalIndex % 9 === 0) return 'var(--color-accent-secondary)'
    if (globalIndex % 7 === 0) return 'var(--color-accent-tertiary)'
    if (globalIndex % 11 === 0) return 'var(--color-text-emphasis)'
    if (globalIndex % 10 === 0) return 'var(--color-heading-accent)'
    if (globalIndex % 8 === 0) return 'var(--color-brand-primary)'

    return wordIndex % 3 === 0 ? 'var(--color-primary-text)' :
           wordIndex % 3 === 1 ? 'var(--color-accent-primary)' :
                                 'var(--color-primary-text)'
  }

  return (
    <div className="col-span-12 mb-12 relative">
      {/* Technical frame decoration - enhanced with more precise positioning */}
      <motion.div
        className="absolute -left-8 top-2 bottom-2 w-6"
        style={{
          borderLeft: `4px solid ${accentColors.secondary}`,
          borderTop: `2px solid ${accentColors.secondary}`,
          borderBottom: `2px solid ${accentColors.secondary}`
        }}
        variants={decorativeVariants}
        initial="initial"
        animate={hasAnimated ? "animate" : "initial"}
      />

      <div className="relative">
        {/* Main headline with individual character animations */}
        <motion.div
          className="flex flex-wrap gap-2 md:gap-4 items-baseline relative"
          variants={containerVariants}
          initial="initial"
          animate={hasAnimated ? "animate" : "initial"}
        >
          {words.map((word, wordIndex) => (
            <div
              key={`word-${wordIndex}`}
              className="relative perspective-effect"
            >
              {/* Word container with enhanced 3D effect */}
              <div className="relative inline-block translate-z-0">
                {word.split('').map((char, charIndex) => {
                  // Calculate global character index
                  const globalIndex = characters.findIndex((_, i) =>
                    i === words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0) + charIndex
                  )

                  return (
                    <motion.span
                      key={`char-${wordIndex}-${charIndex}`}
                      className={cn(
                        "inline-block text-[clamp(2.5rem,8vw,7.5rem)] font-black leading-[0.85]",
                        globalIndex % 9 === 0 && "italic",
                        globalIndex % 13 === 0 && "font-medium", // Add some font variation
                        glitchActive && globalIndex % 5 === 0 && "translate-y-[5px]",
                        glitchActive && globalIndex % 3 === 0 && "-rotate-3",
                        glitchActive && globalIndex % 4 === 0 && "rotate-3 translate-x-[3px]",
                        intensiveGlitch && globalIndex % 2 === 0 && "opacity-0"
                      )}
                      style={{
                        color: getTextColor(wordIndex, globalIndex),
                        ...(glitchActive ? {
                          transform: `translate3d(${glitchOffsets[globalIndex] || 0}px, ${glitchOffsets[globalIndex + 1] || 0}px, 0)`,
                          filter: globalIndex % 6 === 0 ? 'brightness(2)' : 'none',
                          textShadow: globalIndex % 5 === 0
                            ? `0 0 5px var(--color-${globalIndex % 10 === 0 ? 'accent-secondary' : 'accent-primary'})`
                            : 'none'
                        } : {})
                      }}
                      variants={charVariants}
                      aria-hidden={wordIndex !== 0 && charIndex !== 0 ? "true" : undefined}
                    >
                      {char}
                    </motion.span>
                  )
                })}
              </div>

              {/* Technical annotations for specific words - enhanced with better positioning */}
              {wordIndex === 1 && (
                <svg
                  className="absolute -left-6 top-full mt-2 hidden md:block"
                  width="80" height="40"
                  viewBox="0 0 80 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <motion.line
                    x1="0" y1="0" x2="40" y2="40"
                    stroke={accentColors.secondary}
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    initial={{ pathLength: 0 }}
                    animate={hasAnimated ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                  <motion.circle
                    cx="42" cy="40" r="3"
                    fill="none"
                    stroke={accentColors.primary}
                    strokeWidth="1"
                    initial={{ scale: 0 }}
                    animate={hasAnimated ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.3, delay: 1.5 }}
                  />
                </svg>
              )}

              {wordIndex === 2 && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 -top-5 text-[8px] font-mono hidden md:block"
                  style={{ color: accentColors.tertiary }}
                  initial={{ opacity: 0 }}
                  animate={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.7 }}
                  aria-hidden="true"
                >
                  VARIANT_C.08
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Technical accent lines - enhanced with animation */}
      <motion.div
        className="absolute -bottom-6 left-[15%] right-20 flex justify-between items-center h-px"
        initial={{ opacity: 0, width: "30%" }}
        animate={hasAnimated ? { opacity: 1, width: "70%" } : { opacity: 0, width: "30%" }}
        transition={{ delay: 1.4, duration: 0.8 }}
        aria-hidden="true"
      >
        <div
          className="h-px w-[80%]"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColors.secondary}, transparent)`
          }}
        ></div>
        <div
          className="h-3 w-3 border rotate-45"
          style={{ borderColor: accentColors.primary }}
        ></div>
      </motion.div>

      {/* Additional decorative element */}
      <motion.div
        className="absolute -right-4 top-0 w-8 h-8 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={hasAnimated ? { opacity: 0.7, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        aria-hidden="true"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <motion.circle
            cx="16" cy="16" r="12"
            stroke={accentColors.brand}
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={hasAnimated ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.2, delay: 1.3 }}
          />
          <motion.path
            d="M16,4 L16,28 M4,16 L28,16"
            stroke={accentColors.primary}
            strokeWidth="0.5"
            strokeDasharray="2 2"
            initial={{ opacity: 0 }}
            animate={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          />
        </svg>
      </motion.div>
    </div>
  )
}

export default memo(HomeHeroHeadline)