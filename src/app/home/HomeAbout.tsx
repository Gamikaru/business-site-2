// src/app/home/HomeAbout.tsx
'use client'

import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  AnimatePresence
} from 'framer-motion'
import { cn } from '@/utils/classNames'

// Component imports
import HomeAboutContent from './components/HomeAboutContent'
import HomeAboutImage from './components/HomeAboutImage'
import HomeAboutDivider from './components/HomeAboutDivider'

// Types
interface HomeAboutProps {
  heading: string
  content: string  // Contains HTML/rich formatting
  ctaText: string
  ctaLink: string
  imageSrc: string
  imageAlt: string
  className?: string
}

interface TechValues {
  sectionRatio: number
  contentWidth: number
  imageScale: string
  gridDensity: number
  renderQuality: number
}

interface MousePosition {
  x: number
  y: number
}

// Constants
const THROTTLE_LIMIT = 16 // ~60fps
const ACTIVE_DELAY = 500

const HomeAbout: React.FC<HomeAboutProps> = ({
  heading,
  content,
  ctaText,
  ctaLink,
  imageSrc,
  imageAlt,
  className,
}) => {
  // Check for reduced motion preference
  const prefersReducedMotion = useReducedMotion()

  // Refs for scroll tracking and element visibility
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const lastMoveRef = useRef(0)

  // Motion values (outside React render cycle)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Component state
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [techValues, setTechValues] = useState<TechValues>({
    sectionRatio: Math.floor(Math.random() * 100),
    contentWidth: Math.floor(Math.random() * 1000) + 400,
    imageScale: (Math.random() * 0.5 + 0.8).toFixed(2),
    gridDensity: Math.floor(Math.random() * 20) + 30,
    renderQuality: Math.floor(Math.random() * 10) + 90
  })
  const [uniqueId] = useState(`about-${Math.floor(Math.random() * 10000)}`)
  const [isActive, setIsActive] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchOffsets] = useState(() => Array.from({ length: 30 }, () => Math.random() * 5 - 2.5))

  // Create memoized accent colors object
  const accentColors = useMemo(() => ({
    primary: 'var(--color-accent-primary)',
    secondary: 'var(--color-accent-secondary)',
    tertiary: 'var(--color-accent-tertiary)',
    warm: 'var(--color-accent-warm, var(--color-warning))',
    contrast: 'var(--color-accent-contrast, var(--color-heading-accent))',
    oceanic: 'var(--color-accent-oceanic, var(--color-info))',
    cosmic: 'var(--color-accent-cosmic, var(--color-success))',
    brand: 'var(--color-brand-primary)'
  }), [])

  // Optimize tracking with useInView
  const isImageInView = useInView(imageRef, {
    once: false,
    margin: "-10% 0px",
    amount: 0.1
  })

  const isHeadingInView = useInView(headingRef, {
    once: false,
    margin: "-10% 0px",
    amount: 0.1
  })

  const isSectionInView = useInView(sectionRef, {
    once: false,
    margin: "-10% 0px"
  })

  // Scroll animation values - outside React render cycle
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Enhanced transform values for parallax effects
  const imageTranslateY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const contentTranslateY = useTransform(scrollYProgress, [0, 1], [25, -25])
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.15, 0.05])
  const rotateValue = useTransform(scrollYProgress, [0, 1], [2, -2])
  const scaleValue = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1.02, 0.98])
  const gridTranslateX = useTransform(scrollYProgress, [0, 1], ['0%', '3%'])
  const gridTranslateY = useTransform(scrollYProgress, [0, 1], ['0%', '-3%'])

  // Set active after a delay when section is in view
  useEffect(() => {
    if (!isSectionInView) return

    const activeTimer = setTimeout(() => {
      setIsActive(true)
    }, ACTIVE_DELAY)

    return () => {
      clearTimeout(activeTimer)
    }
  }, [isSectionInView])

  // Occasional glitch effect
  useEffect(() => {
    if (!isActive) return

    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.05) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 150 + Math.random() * 200)
      }
    }, 8000)

    return () => clearInterval(glitchInterval)
  }, [isActive])

  // Update mouse position and tech values with rate limiting
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = Date.now()
    // Throttle to ~60fps
    if (now - lastMoveRef.current < THROTTLE_LIMIT) return
    lastMoveRef.current = now

    if (!sectionRef.current) return

    const rect = sectionRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    // Update motion values directly (no re-render)
    mouseX.set(x)
    mouseY.set(y)

    // Batch state updates with startTransition
    React.startTransition(() => {
      setMousePosition({ x, y })
      setTechValues(prev => ({
        ...prev,
        sectionRatio: Math.floor(y * 100),
        imageScale: (0.8 + x * 0.4).toFixed(2)
      }))
    })

    if (!hasInteracted) {
      setHasInteracted(true)
    }
  }, [mouseX, mouseY, hasInteracted])

  // Handle mouse clicks
  const handleMouseClick = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true)
    }
  }, [hasInteracted])

  return (
    <motion.section
      ref={sectionRef}
      className={cn("relative bg-bg-primary overflow-hidden py-20 md:py-32", className)}
      onMouseMove={handleMouseMove}
      onClick={handleMouseClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      role="region"
      aria-label="About section"
    >
      {/* Enhanced background element */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-bg-primary via-bg-tertiary to-bg-secondary opacity-30"
          style={{
            scale: scaleValue,
            rotate: rotateValue,
          }}
        />

        {/* Subtle grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: backgroundOpacity,
            x: gridTranslateX,
            y: gridTranslateY,
          }}
          aria-hidden="true"
        >
          <svg width="100%" height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="opacity-20"
          >
            <defs>
              <pattern id={`${uniqueId}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="var(--color-grid-lines)"
                  strokeWidth="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${uniqueId}-grid)`} />

            {/* Center crosshairs */}
            <motion.path
              d="M50,10 L50,90 M10,50 L90,50"
              stroke="var(--color-grid-lines)"
              strokeWidth="0.5"
              strokeDasharray="2 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isActive ? 1 : 0 }}
              transition={{ duration: 1.8, delay: 0.5 }}
            />

            {/* Enhanced circular grid element */}
            <motion.circle
              cx="50" cy="50" r="30"
              stroke="var(--color-grid-lines)"
              strokeWidth="0.4"
              fill="none"
              strokeDasharray="1 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isActive ? 1 : 0 }}
              transition={{ duration: 2, delay: 0.7 }}
            />
          </svg>
        </motion.div>

        {/* Parallax accent elements - enhanced with better blending */}
        <motion.div
          className="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full"
          style={{
            background: `radial-gradient(circle, ${accentColors.primary}10 0%, transparent 70%)`,
            y: useTransform(scrollYProgress, [0, 1], ['-10%', '10%']),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.1, 0.9]),
            opacity: 0.2,
            mixBlendMode: "screen"
          }}
        />

        <motion.div
          className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full"
          style={{
            background: `radial-gradient(circle, ${accentColors.secondary}10 0%, transparent 70%)`,
            y: useTransform(scrollYProgress, [0, 1], ['10%', '-10%']),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 0.9, 1.1]),
            opacity: 0.2,
            mixBlendMode: "screen"
          }}
        />
      </div>

      <motion.div
        className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [20, -20])
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left column (image) */}
          <motion.div
            ref={imageRef}
            className="md:col-span-5 relative"
            style={{
              y: imageTranslateY
            }}
          >
            <HomeAboutImage
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              isImageInView={isImageInView}
              imageTranslateY={imageTranslateY}
              rotateValue={rotateValue}
              techValues={techValues}
              uniqueId={uniqueId}
              isFlashing={isGlitching}
              accentColors={accentColors}
            />
          </motion.div>

          {/* Right column (content) */}
          <motion.div
            ref={headingRef}
            className="md:col-span-6 md:col-start-7 relative z-10"
            style={{
              y: contentTranslateY
            }}
          >
            <HomeAboutContent
              heading={heading}
              content={content}
              ctaText={ctaText}
              ctaLink={ctaLink}
              isHeadingInView={isHeadingInView}
              techValues={techValues}
              mousePosition={mousePosition}
              uniqueId={uniqueId}
              isActive={isActive}
              accentColors={accentColors}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Animated divider */}
      <HomeAboutDivider accentColors={accentColors} />

      {/* Glitch overlay - only visible during glitch state */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="absolute inset-0 bg-accent-primary opacity-10"></div>

            {/* Horizontal glitch lines */}
            {[...Array(5)].map((_, i) => {
              const randomY = 10 + (i * 20) + (Math.random() * 10 - 5);
              const randomHeight = 1 + Math.random() * 5;
              return (
                <motion.div
                  key={`h-glitch-${i}`}
                  className="absolute left-0 right-0"
                  style={{
                    top: `${randomY}%`,
                    height: `${randomHeight}px`,
                    backgroundColor: i % 2 === 0 ? accentColors.primary : accentColors.secondary,
                    opacity: 0.3 + (Math.random() * 0.5),
                    transform: `translateX(${glitchOffsets[i]}px)`
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle interactive effects - only if animations are allowed */}
      {!prefersReducedMotion && (
        <>
          {/* Subtle scan line effect */}
          <motion.div
            className="absolute left-0 right-0 h-[1px] pointer-events-none z-10"
            style={{
              background: `linear-gradient(to right,
                transparent,
                ${accentColors.primary}60,
                ${accentColors.secondary}60,
                transparent
              )`,
              opacity: 0.3,
              mixBlendMode: "screen"
            }}
            animate={{
              top: ['0%', '100%'],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 3
            }}
            aria-hidden="true"
          />

          {/* Enhanced floating particles system */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => {
              // More variety in particle properties
              const particleShape = i % 4 === 0 ? "rounded-full" :
                                  i % 4 === 1 ? "rounded-sm" :
                                  i % 4 === 2 ? "rounded" : "rotate-45";

              const particleSize = (1 + Math.random() * 2) * (i % 3 === 0 ? 1.5 : 1);

              // Color cycling through the accent colors
              const colorOptions = [
                accentColors.primary,
                accentColors.secondary,
                accentColors.tertiary,
                accentColors.brand,
                accentColors.warm || accentColors.secondary,
                accentColors.cosmic || accentColors.tertiary
              ];

              const particleColor = colorOptions[i % colorOptions.length];

              return (
                <motion.div
                  key={`particle-${i}`}
                  className={`absolute ${particleShape}`}
                  style={{
                    width: particleSize,
                    height: particleSize,
                    backgroundColor: particleColor,
                    opacity: 0.5,
                    top: `${20 + Math.random() * 60}%`,
                    left: `${Math.random() * 100}%`,
                    filter: i % 5 === 0 ? `blur(1px)` : 'none',
                    mixBlendMode: i % 3 === 0 ? "screen" : "normal"
                  }}
                  animate={{
                    y: [0, -30 - (i * 10), 0],
                    x: [0, i % 2 ? 30 : -30, 0],
                    opacity: [0.2, 0.7, 0.2],
                    rotate: i % 4 === 3 ? [0, 180, 360] : [0, 0, 0]
                  }}
                  transition={{
                    duration: 8 + Math.random() * 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                />
              );
            })}
          </div>
        </>
      )}

      {/* Custom styles for section */}
      <style jsx global>{`
        .glitch-animation {
          animation: glitch 150ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          25% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 2px); }
          75% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </motion.section>
  )
}

export default HomeAbout