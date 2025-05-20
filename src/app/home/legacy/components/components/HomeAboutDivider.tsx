// src/app/home/components/HomeAboutDivider.tsx
'use client'

import React, { memo, useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useAnimationControls } from 'framer-motion'

interface AccentColors {
  primary: string
  secondary: string
  tertiary: string
  brand: string
  warm?: string
  contrast?: string
  oceanic?: string
  cosmic?: string
}

interface HomeAboutDividerProps {
  accentColors: AccentColors
}

const HomeAboutDivider: React.FC<HomeAboutDividerProps> = ({ accentColors }) => {
  const dividerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [uniqueId] = useState(() => `divider-${Math.floor(Math.random() * 10000)}`)
  const waveControls = useAnimationControls()

  // Enhanced animated values based on scroll
  const { scrollYProgress } = useScroll({
    target: dividerRef,
    offset: ["start end", "end start"]
  })

  // More expressive transform values for scroll parallax
  const translateY = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [8, 0])
  const wavePathOffset = useTransform(scrollYProgress, [0, 0.5], [0, 0.5])
  const waveAmplitude = useTransform(scrollYProgress, [0, 0.3], [1, 0.7])

  // Detect when divider is in view
  useEffect(() => {
    if (!dividerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        if (entry.isIntersecting) {
          waveControls.start("animate")
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(dividerRef.current)
    return () => observer.disconnect()
  }, [waveControls])

  // Generate dynamic wave path based on scroll position
  const getWavePath = () => {
    const amplitude = waveAmplitude.get() * 25
    return `M0,60
      C200,${60 + amplitude} 400,${60 - amplitude} 600,${60}
      C800,${60 + amplitude} 1000,${60 - amplitude} 1200,${60}
      L1200,160 L0,160 Z`
  }

  // Particles animation variants
  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    animate: (i: number) => ({
      opacity: [0.2, 0.7, 0.2],
      y: [0, -(i % 2 ? 15 : 25), 0],
      scale: [0.8, 1, 0.8],
      transition: {
        duration: 3 + (i % 3),
        repeat: Infinity,
        delay: i * 0.3,
      }
    })
  }

  return (
    <div
      ref={dividerRef}
      className="relative w-full overflow-hidden transform-gpu"
      style={{
        height: '180px',
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      aria-hidden="true"
    >
      {/* Background gradient with 3D transform */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: translateY,
          opacity,
          rotateX,
          background: `linear-gradient(to bottom,
            var(--color-primary-bg) 0%,
            var(--color-tertiary-bg) 50%,
            var(--color-secondary-bg) 100%
          )`,
          transformStyle: 'preserve-3d'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Technical grid overlay - more complex grid pattern */}
        <svg
          className="absolute inset-0 opacity-10"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <pattern
              id={`${uniqueId}-grid-pattern`}
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="var(--color-grid-lines)"
                strokeWidth="0.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${uniqueId}-grid-pattern)`} />

          {/* Enhanced central measurement grid */}
          <motion.path
            d="M20,50 L80,50"
            stroke="var(--color-grid-lines)"
            strokeWidth="0.4"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          />
          <motion.path
            d="M50,20 L50,80"
            stroke="var(--color-grid-lines)"
            strokeWidth="0.4"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          />

          {/* Add tick marks */}
          {[30, 40, 60, 70].map((pos) => (
            <React.Fragment key={`h-tick-${pos}`}>
              <motion.path
                d={`M${pos},48 L${pos},52`}
                stroke="var(--color-grid-lines)"
                strokeWidth="0.3"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
              <motion.path
                d={`M48,${pos} L52,${pos}`}
                stroke="var(--color-grid-lines)"
                strokeWidth="0.3"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </React.Fragment>
          ))}
        </svg>

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence baseFrequency=%270.85%27 type=%27fractalNoise%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E')",
            mixBlendMode: "overlay"
          }}
        />

        {/* SVG definitions for gradients and filters */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id={`${uniqueId}-wave-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColors.tertiary} stopOpacity="0.3" />
              <stop offset="50%" stopColor={accentColors.primary} stopOpacity="0.5" />
              <stop offset="100%" stopColor={accentColors.secondary} stopOpacity="0.3" />
            </linearGradient>

            <filter id={`${uniqueId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <linearGradient id={`${uniqueId}-data-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColors.cosmic || accentColors.brand} stopOpacity="0.8" />
              <stop offset="100%" stopColor={accentColors.warm || accentColors.tertiary} stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Main wave SVG with enhanced effects */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
        >
          {/* Base wave with enhanced shadow */}
          <motion.path
            d={getWavePath()}
            fill="var(--color-secondary-bg)"
            style={{
              filter: 'drop-shadow(0 -8px 12px rgba(0,0,0,0.07))'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 30
            }}
            transition={{ duration: 0.8 }}
          />

          {/* Enhanced accent line with gradient and animation */}
          <motion.path
            d="M0,60 C200,100 400,30 600,60 C800,90 1000,20 1200,60"
            fill="none"
            stroke={`url(#${uniqueId}-wave-gradient)`}
            strokeWidth="1.5"
            strokeDasharray="1 2"
            style={{
              pathOffset: wavePathOffset
            }}
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: isInView ? 1 : 0
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Secondary accent wave - more complex pattern */}
          <motion.path
            d="M0,65 C120,35 240,85 360,55 C480,25 600,75 720,45 C840,15 960,65 1080,35 C1120,25 1160,45 1200,30"
            fill="none"
            stroke={accentColors.brand}
            strokeWidth="0.5"
            strokeOpacity="0.3"
            strokeDasharray="4 4"
            style={{
              pathOffset: useTransform(wavePathOffset, v => 1 - v).get()
            }}
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: isInView ? 1 : 0
            }}
            transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Enhanced particle system with more variation */}
          {isInView && [...Array(10)].map((_, i) => {
            // More varied styling for particles
            const size = 1 + (i % 3) * 0.6;
            const shape = i % 5 === 0 ? "circle" : i % 5 === 1 ? "rect" : i % 5 === 2 ? "rect" : "circle";

            // More interesting positions
            const positionPatterns = [
              { x: 200 + (i * 100), y: 30 + (Math.sin(i) * 20) },
              { x: 150 + (i * 110), y: 80 - (Math.cos(i) * 15) },
              { x: 300 + (i * 90), y: 50 + (Math.sin(i * 2) * 25) }
            ];

            const pos = positionPatterns[i % 3];

            // Color cycling through the accent colors
            const colorOptions = [
              accentColors.primary,
              accentColors.secondary,
              accentColors.tertiary,
              accentColors.brand,
              accentColors.warm || accentColors.secondary
            ];

            const particleColor = colorOptions[i % colorOptions.length];

            // Render different shapes based on the pattern
            return shape === "circle" ? (
              <motion.circle
                key={`particle-${i}`}
                cx={pos.x}
                cy={pos.y}
                r={size}
                fill={particleColor}
                variants={particleVariants}
                custom={i}
                initial="hidden"
                animate="animate"
              />
            ) : (
              <motion.rect
                key={`particle-${i}`}
                x={pos.x - size}
                y={pos.y - size}
                width={size * 2}
                height={size * 2}
                fill={particleColor}
                variants={particleVariants}
                custom={i}
                initial="hidden"
                animate="animate"
              />
            );
          })}

          {/* Dynamic accent dots along the wave with enhanced visuals */}
          {[0.15, 0.3, 0.5, 0.7, 0.85].map((position, i) => {
            // Use different semantic colors for dots based on position
            const dotColor = i % 3 === 0 ? accentColors.primary :
                           i % 3 === 1 ? accentColors.secondary : accentColors.tertiary;

            const dotSize = i === 2 ? 3.5 : 2;
            const yPos = i % 2 === 0 ? 55 : 65;

            return (
              <motion.g key={`accent-dot-${i}`}>
                <motion.circle
                  cx={1200 * position}
                  cy={yPos}
                  r={dotSize}
                  fill={dotColor}
                  fillOpacity="0.7"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: isInView ? 1 : 0
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.7 + (i * 0.1)
                  }}
                />

                {/* Add data visualization lines from central dots */}
                {i !== 0 && i !== 4 && (
                  <motion.line
                    x1={1200 * position}
                    y1={yPos + dotSize + 2}
                    x2={1200 * position}
                    y2={yPos + 20 + (i * 5)}
                    stroke={dotColor}
                    strokeWidth="0.5"
                    strokeDasharray="2 1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isInView ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 1 + (i * 0.1) }}
                  />
                )}

                {/* Pulse effect for main dot */}
                {i === 2 && (
                  <motion.circle
                    cx={1200 * position}
                    cy={yPos}
                    r={dotSize + 3}
                    fill="none"
                    stroke={dotColor}
                    strokeWidth="0.5"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [0, 1.5, 2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1.2
                    }}
                  />
                )}
              </motion.g>
            );
          })}

          {/* Data visualization elements */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 0.8 : 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            {/* Data curve visualization */}
            <motion.path
              d="M300,110 C350,85 400,125 450,95 C500,65 550,105 600,75"
              stroke={`url(#${uniqueId}-data-gradient)`}
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isInView ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 1.4 }}
            />

            {/* Data points along the curve */}
            {[
              { x: 300, y: 110 },
              { x: 400, y: 125 },
              { x: 500, y: 65 },
              { x: 600, y: 75 }
            ].map((point, i) => (
              <motion.circle
                key={`data-point-${i}`}
                cx={point.x}
                cy={point.y}
                r="2"
                fill={i % 2 === 0 ? accentColors.cosmic || accentColors.brand : accentColors.warm || accentColors.tertiary}
                initial={{ scale: 0 }}
                animate={{ scale: isInView ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 1.6 + (i * 0.1) }}
              />
            ))}

            {/* Value labels */}
            <motion.text
              x="300" y="105"
              fontSize="6"
              fill={accentColors.cosmic || accentColors.brand}
              textAnchor="middle"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 0.8 : 0 }}
              transition={{ duration: 0.4, delay: 1.8 }}
            >
              125
            </motion.text>
            <motion.text
              x="600" y="70"
              fontSize="6"
              fill={accentColors.warm || accentColors.tertiary}
              textAnchor="middle"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 0.8 : 0 }}
              transition={{ duration: 0.4, delay: 2 }}
            >
              142
            </motion.text>
          </motion.g>
        </svg>

        {/* Enhanced gradient overlay with semantic color variables */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[100px]"
          style={{
            background: `linear-gradient(to bottom,
              transparent,
              var(--color-secondary-bg) 80%,
              var(--color-secondary-bg)
            )`
          }}
        />

        {/* Multiple decorative accent lines with varying opacity */}
        <div className="absolute left-0 right-0 bottom-0 flex flex-col items-center">
          {/* Primary divider line with gradient */}
          <motion.div
            className="h-[1px] w-[85%] max-w-[900px]"
            style={{
              background: `linear-gradient(to right,
                transparent, var(--color-divider) 20%,
                var(--color-border) 50%,
                var(--color-divider) 80%, transparent
              )`
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: isInView ? 1 : 0,
              opacity: isInView ? 0.7 : 0
            }}
            transition={{
              duration: 1.2,
              delay: 0.3
            }}
          />

          {/* Secondary thinner line */}
          <motion.div
            className="h-[1px] w-[60%] max-w-[700px] mt-6"
            style={{
              background: `linear-gradient(to right,
                transparent, var(--color-divider-light) 20%,
                var(--color-divider) 50%,
                var(--color-divider-light) 80%, transparent
              )`
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: isInView ? 1 : 0,
              opacity: isInView ? 0.5 : 0
            }}
            transition={{
              duration: 1,
              delay: 0.5
            }}
          />

          {/* Enhanced corner accents - geometric markers */}
          <motion.div
            className="absolute bottom-[30px] left-[15%] opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 0.7 : 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="relative">
              <div
                className="w-4 h-4"
                style={{
                  borderLeft: `1px solid ${accentColors.primary}`,
                  borderBottom: `1px solid ${accentColors.primary}`
                }}
              />
              {/* Measurement label */}
              <div
                className="absolute -left-2 -bottom-6 text-[6px] font-mono"
                style={{ color: accentColors.primary }}
              >
                x:0
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-[30px] right-[15%] opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 0.7 : 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="relative">
              <div
                className="w-4 h-4"
                style={{
                  borderRight: `1px solid ${accentColors.primary}`,
                  borderBottom: `1px solid ${accentColors.primary}`
                }}
              />
              {/* Measurement label */}
              <div
                className="absolute -right-6 -bottom-6 text-[6px] font-mono"
                style={{ color: accentColors.primary }}
              >
                x:100%
              </div>
            </div>
          </motion.div>
        </div>

        {/* Central accent glow */}
        <motion.div
          className="absolute left-1/2 top-1/4 w-[10px] h-[10px] rounded-full blur-[8px]"
          style={{
            background: `radial-gradient(
              circle at center,
              ${accentColors.primary} 0%,
              ${accentColors.primary}80 40%,
              transparent 80%
            )`,
            transform: 'translateX(-50%)',
            filter: `drop-shadow(0 0 8px ${accentColors.primary}50)`
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isInView ? [0.4, 0.8, 0.4] : 0
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.8
          }}
        />

        {/* Animated scan line effect */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background: `linear-gradient(to right,
              transparent, ${accentColors.primary} 50%, transparent
            )`,
            opacity: 0.3,
          }}
          animate={{
            y: [0, 160, 0],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Section marker with technical aesthetics */}
        <motion.div
          className="absolute top-2 left-4 flex items-center opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 0.7 : 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <div
            className="h-3 w-3 rounded-sm mr-2"
            style={{ backgroundColor: accentColors.primary }}
          ></div>
          <div className="text-xs font-mono opacity-80 tracking-wider">SECTION_BREAK</div>
        </motion.div>

        {/* Technical coordinates with more details */}
        <motion.div
          className="absolute bottom-2 right-4 text-[8px] font-mono opacity-0 pointer-events-none"
          style={{ color: 'var(--color-tertiary-text)' }}
          animate={{
            opacity: isInView ? 0.7 : 0
          }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-col items-end">
            <div>width: 100%</div>
            <div>height: 180px</div>
            <div>perspective: 1000px</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default memo(HomeAboutDivider)