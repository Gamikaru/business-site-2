// src/app/home/components/HomeHeroBackground.tsx
'use client'

import React, { memo, useEffect, useState } from 'react'
import { motion, MotionValue, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

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

interface HomeHeroBackgroundProps {
  imageSrc: string
  imageAlt: string
  backgroundY: MotionValue<string>
  backgroundScale: MotionValue<number>
  gridX: MotionValue<number>
  gridY: MotionValue<number>
  mousePosition: { x: number; y: number }
  glitchActive: boolean
  intensiveGlitch: boolean
  glitchOffsets: number[]
  accentColors: AccentColors
  heroAnimationComplete?: boolean
}

// Animation variants
const gridLineVariants = {
  hidden: { pathLength: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    transition: { duration: 1.8, delay }
  })
}

const pathVariants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: { duration: 2.3, ease: 'easeInOut' }
  }
}

const accentShapeVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1,
    opacity: delay < 0.5 ? 0.3 : 0.2,
    transition: { duration: 2, delay, ease: 'easeOut' }
  })
}

const HomeHeroBackground: React.FC<HomeHeroBackgroundProps> = ({
  imageSrc,
  imageAlt,
  backgroundY,
  backgroundScale,
  gridX,
  gridY,
  mousePosition,
  glitchActive,
  intensiveGlitch,
  glitchOffsets,
  accentColors,
  heroAnimationComplete = false
}) => {
  const [showElements, setShowElements] = useState(false);
  const [pixelDensity, setPixelDensity] = useState(4); // Lower value for more subtle pixelation
  const [glowIntensity, setGlowIntensity] = useState(0.2); // Controls glow effect intensity

  // Control when background elements appear
  useEffect(() => {
    if (heroAnimationComplete) {
      const timer = setTimeout(() => {
        setShowElements(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [heroAnimationComplete]);

  // Subtle buzzing glow effect and occasional subtle pixelation shifts
  useEffect(() => {
    const buzzInterval = setInterval(() => {
      // Very subtle random changes to glow intensity
      setGlowIntensity(0.2 + Math.random() * 0.15);

      // Only occasionally change pixelation when active glitch
      if (glitchActive || Math.random() > 0.85) {
        setPixelDensity(3 + Math.random() * 2); // 3-5px - more subtle
      }
    }, 800);

    return () => clearInterval(buzzInterval);
  }, [glitchActive]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base layer - enhanced gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: backgroundY,
          scale: backgroundScale,
          background: `linear-gradient(135deg, var(--color-primary-bg), var(--color-tertiary-bg), var(--color-secondary-bg))`
        }}
      />

      {/* Subtle animated particle overlay */}
      <div className="absolute inset-0 opacity-10 mix-blend-soft-light overflow-hidden">
        <AnimatePresence>
          {showElements && [...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: 1 + Math.random() * 3,
                height: 1 + Math.random() * 3,
                backgroundColor: i % 3 === 0 ? accentColors.primary :
                                i % 3 === 1 ? accentColors.secondary :
                                accentColors.tertiary,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.2 + Math.random() * 0.5
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* More subtle scanlines effect */}
      <div className="absolute inset-0 pointer-events-none scanlines" />

      {/* Subtle grid lines */}
      <motion.div
        className="absolute inset-0 opacity-20 mix-blend-soft-light"
        style={{ x: gridX, y: gridY }}
      >
        <div className="h-full w-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Horizontal lines - enhanced pattern */}
            {[15, 30, 50, 70, 85].map((position, i) => (
              <motion.line
                key={`h-${position}`}
                x1="0" y1={position} x2="100" y2={position}
                stroke="var(--color-grid-lines)"
                strokeWidth={i === 2 ? "0.3" : "0.15"}
                strokeDasharray={i % 2 ? "1 3" : undefined}
                variants={gridLineVariants}
                initial="hidden"
                animate={showElements ? "visible" : "hidden"}
                custom={position / 150}
              />
            ))}

            {/* Vertical lines - enhanced pattern */}
            {[15, 30, 50, 70, 85].map((position, i) => (
              <motion.line
                key={`v-${position}`}
                x1={position} y1="0" x2={position} y2="100"
                stroke="var(--color-grid-lines)"
                strokeWidth={i === 2 ? "0.3" : "0.15"}
                strokeDasharray={i % 2 ? "1 3" : undefined}
                variants={gridLineVariants}
                initial="hidden"
                animate={showElements ? "visible" : "hidden"}
                custom={position / 150}
              />
            ))}

            {/* Dynamic accent curves that respond to mouse movement */}
            <motion.path
              d={`M0,${50 - mousePosition.y * 15} C${20 + mousePosition.x * 20},${30 + mousePosition.y * 40},${80 - mousePosition.x * 15},${70 - mousePosition.y * 40},100,${50 + mousePosition.y * 15}`}
              stroke={accentColors.primary}
              strokeWidth="0.4"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate={showElements ? "visible" : "hidden"}
              transition={{ delay: 0.5 }}
            />

            <motion.path
              d={`M0,${80 - mousePosition.y * 10} Q${50 + mousePosition.x * 15},${100 - mousePosition.y * 50},100,${20 + mousePosition.y * 25}`}
              stroke={accentColors.brand}
              strokeWidth="0.3"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate={showElements ? "visible" : "hidden"}
              transition={{ delay: 0.7 }}
            />

            {/* Additional decorative paths */}
            <motion.path
              d={`M${mousePosition.x * 30},0 Q${50 - mousePosition.x * 15},${40 + mousePosition.y * 20},${70 + mousePosition.x * 20},100`}
              stroke={accentColors.secondary}
              strokeWidth="0.25"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate={showElements ? "visible" : "hidden"}
              transition={{ delay: 0.9 }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Image treatment - more subtle pixelation */}
      <div className="absolute inset-0">
        <motion.div
          className={`absolute inset-0 transition-all duration-100 overflow-hidden ${
            glitchActive ? "glitch-filter" : ""
          } ${intensiveGlitch ? "intensive-glitch" : ""}`}
          style={{ y: backgroundY, scale: backgroundScale }}
        >
          {/* Base image with more subtle pixelation and blend mode */}
          <div className="absolute inset-0 mix-blend-luminosity opacity-65">
            <div className="pixelated-container" style={{
              filter: glitchActive ? `url('#pixelate-filter')` : `url('#subtle-pixelate-filter')`
            }}>
              <Image
                src={imageSrc}
                alt=""
                fill
                sizes="100vw"
                priority
                className="w-full h-full object-cover object-center pixelated"
                quality={90}
                style={{
                  imageRendering: "pixelated",
                  imageRendering: "-moz-crisp-edges",
                  imageRendering: "crisp-edges"
                }}
              />
            </div>
          </div>

          {/* More subtle glitch image copies */}
          <div
            className="absolute inset-0 glitch-image-r opacity-40 hidden md:block"
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translate3d(${glitchActive ? '3px' : '0'}, 0, 0)`,
              mixBlendMode: 'screen',
              filter: glitchActive ? `url('#pixelate-filter')` : `url('#subtle-pixelate-filter')`
            }}
          />

          <div
            className="absolute inset-0 glitch-image-g opacity-40 hidden md:block"
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translate3d(${glitchActive ? '-2px' : '0'}, 0, 0)`,
              mixBlendMode: 'screen',
              filter: glitchActive ? `url('#pixelate-filter')` : `url('#subtle-pixelate-filter')`
            }}
          />

          {/* Random vertical shift/glitch for retro effect - more subtle */}
          {glitchActive && (
            <div className="absolute inset-0 vertical-shift-subtle"></div>
          )}
        </motion.div>

        {/* Moving gradient overlay with subtle animation */}
        <motion.div
          className="absolute inset-0 mix-blend-color"
          animate={{
            background: [
              `linear-gradient(135deg, ${accentColors.secondary}30 10%, transparent 50%, ${accentColors.primary}30 90%)`,
              `linear-gradient(145deg, ${accentColors.secondary}30 15%, transparent 55%, ${accentColors.primary}30 85%)`,
              `linear-gradient(135deg, ${accentColors.secondary}30 10%, transparent 50%, ${accentColors.primary}30 90%)`
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        {/* Subtle darkening overlay */}
        <div className="absolute inset-0 bg-black opacity-35 mix-blend-multiply dark-mode-overlay" />

        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-dots-dense opacity-20 mix-blend-overlay" />

        {/* Subtle CRT glow effect with animated buzz */}
        <motion.div
          className="absolute inset-0 crt-glow"
          animate={{
            opacity: [glowIntensity - 0.05, glowIntensity, glowIntensity - 0.05],
            filter: [
              `blur(${8 + Math.sin(Date.now() * 0.001) * 2}px)`,
              `blur(${10 + Math.sin(Date.now() * 0.002) * 2}px)`,
              `blur(${8 + Math.sin(Date.now() * 0.001) * 2}px)`
            ]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />

        {/* Horizontal scan glow line - very subtle */}
        <motion.div
          className="absolute h-[2px] w-full left-0 scan-line-glow"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColors.primary}70, transparent)`,
            boxShadow: `0 0 15px 2px ${accentColors.primary}50`
          }}
          animate={{
            top: ["0%", "100%", "0%"],
            opacity: [0, 0.4, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
        />
      </div>

      {/* Elegant geometric accents with improved animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-right accent shape */}
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${accentColors.primary} 0%, transparent 70%)`,
            mixBlendMode: 'screen'
          }}
          variants={accentShapeVariants}
          initial="hidden"
          animate={showElements ? "visible" : "hidden"}
          custom={0.2}
        />

        {/* Bottom-left accent shape */}
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 opacity-15"
          style={{
            background: `radial-gradient(circle at bottom left, ${accentColors.secondary} 0%, transparent 70%)`,
            mixBlendMode: 'overlay'
          }}
          variants={accentShapeVariants}
          initial="hidden"
          animate={showElements ? "visible" : "hidden"}
          custom={0.6}
        />

        {/* Additional accent shapes for more visual interest */}
        <motion.div
          className="absolute top-1/3 -left-10 w-40 h-40 opacity-10"
          style={{
            background: `radial-gradient(circle, ${accentColors.tertiary} 0%, transparent 70%)`,
            mixBlendMode: 'screen'
          }}
          variants={accentShapeVariants}
          initial="hidden"
          animate={showElements ? "visible" : "hidden"}
          custom={0.8}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-32 h-32 opacity-10"
          style={{
            background: `radial-gradient(circle, ${accentColors.brand} 0%, transparent 70%)`,
            mixBlendMode: 'screen'
          }}
          variants={accentShapeVariants}
          initial="hidden"
          animate={showElements ? "visible" : "hidden"}
          custom={1.0}
        />
      </div>

      {/* SVG filters for pixelation effects */}
      <svg width="0" height="0" className="absolute">
        {/* Standard pixelation filter (more intense) */}
        <filter id="pixelate-filter">
          <feFlood x="4" y="4" height="2" width="2"/>
          <feComposite width="8" height="8"/>
          <feTile result="a"/>
          <feComposite in="SourceGraphic" in2="a" operator="in"/>
          <feMorphology operator="dilate" radius="1.5"/>
        </filter>

        {/* Subtle pixelation filter */}
        <filter id="subtle-pixelate-filter">
          <feFlood x="2" y="2" height="1" width="1"/>
          <feComposite width="4" height="4"/>
          <feTile result="a"/>
          <feComposite in="SourceGraphic" in2="a" operator="in"/>
          <feMorphology operator="dilate" radius="0.8"/>
        </filter>

        {/* Glow filter */}
        <filter id="glow-filter">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </svg>

      {/* Custom styles for more subtle retro effects */}
      <style jsx>{`
        .scanlines {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.15) 50%
          );
          background-size: 100% 6px;
          opacity: 0.15;
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        .dark-mode-overlay {
          opacity: 0.35;
          mix-blend-mode: multiply;
        }

        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }

        .pixelated-container {
          width: 100%;
          height: 100%;
        }

        .vertical-shift-subtle {
          background-image: inherit;
          background-size: 100% 100%;
          animation: verticalShiftSubtle 0.8s steps(6) infinite alternate;
        }

        .crt-glow {
          background: radial-gradient(
            ellipse at center,
            ${accentColors.primary}20 0%,
            ${accentColors.secondary}15 50%,
            ${accentColors.tertiary}10 100%
          );
          pointer-events: none;
          mix-blend-mode: screen;
        }

        @keyframes verticalShiftSubtle {
          0% { transform: translateY(0); }
          25% { transform: translateY(-1px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(1px); }
          100% { transform: translateY(0); }
        }

        .scan-line-glow {
          pointer-events: none;
          mix-blend-mode: screen;
        }
      `}</style>
    </div>
  )
}

export default memo(HomeHeroBackground)