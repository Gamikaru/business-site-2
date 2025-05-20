// src/components/core/Animations/providers/MotionProvider.tsx
"use client"

import React, { createContext, useContext, useRef, useEffect, useMemo } from 'react'
import { LazyMotion, domAnimation, useScroll, useMotionValue, useTransform, m, MotionValue } from 'framer-motion'
import { AnimationProvider } from '../context/AnimationContext'
import { animationManager } from '../utils/AnimationManager'

interface MotionContextType {
  // Global scroll progress values (0-1)
  scrollYProgress: MotionValue<number>
  scrollXProgress: MotionValue<number>

  // Transformed values for common animations
  opacityOnScroll: MotionValue<number>
  scaleOnScroll: MotionValue<number>

  // Utility values
  viewportHeight: number
  viewportWidth: number
}

const defaultContext: MotionContextType = {
  scrollYProgress: null!,
  scrollXProgress: null!,
  opacityOnScroll: null!,
  scaleOnScroll: null!,
  viewportHeight: 0,
  viewportWidth: 0
}

const MotionContext = createContext<MotionContextType>(defaultContext)

export const useMotionContext = () => useContext(MotionContext)

interface MotionProviderProps {
  children: React.ReactNode
  initialAnimationsEnabled?: boolean
  features?: any // The Framer Motion features to use
}

export const MotionProvider: React.FC<MotionProviderProps> = ({
  children,
  initialAnimationsEnabled = true,
  features = domAnimation
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewportHeight, setViewportHeight] = React.useState(0)
  const [viewportWidth, setViewportWidth] = React.useState(0)

  // Set up global scroll tracking
  const { scrollYProgress, scrollXProgress } = useScroll({
    // Defaults to document scroll
    layoutEffect: false // Important for SSR
  })

  // Create some common transforms from the scroll progress
  const opacityOnScroll = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scaleOnScroll = useTransform(scrollYProgress, [0, 1], [1, 0.9])

  // Update viewport dimensions
  useEffect(() => {
    const updateViewportDimensions = () => {
      setViewportHeight(window.innerHeight)
      setViewportWidth(window.innerWidth)
    }

    updateViewportDimensions()

    // Register with animation manager
    const id = 'motion-provider'
    animationManager.subscribeToResize(id, (width, height) => {
      setViewportWidth(width)
      setViewportHeight(height)
    })

    // Configure animation manager to use Framer Motion
    animationManager.configure({
      useFramerMotion: true
    })

    return () => {
      animationManager.unsubscribeFromResize(id)
    }
  }, [])

  // Memoize context value to prevent unnecessary renders
  const contextValue = useMemo<MotionContextType>(() => ({
    scrollYProgress,
    scrollXProgress,
    opacityOnScroll,
    scaleOnScroll,
    viewportHeight,
    viewportWidth
  }), [
    scrollYProgress,
    scrollXProgress,
    opacityOnScroll,
    scaleOnScroll,
    viewportHeight,
    viewportWidth
  ])

  return (
    <LazyMotion features={features}>
      <AnimationProvider initialPreferences={{ enabled: initialAnimationsEnabled }}>
        <MotionContext.Provider value={contextValue}>
          <div ref={containerRef} style={{ isolation: 'isolate' }}>
            {children}
          </div>
        </MotionContext.Provider>
      </AnimationProvider>
    </LazyMotion>
  )
}

// Aliased component from Framer Motion's m namespace
// This helps with tree shaking and explicit imports
export const Motion = {
  div: m.div,
  span: m.span,
  section: m.section,
  article: m.article,
  header: m.header,
  footer: m.footer,
  nav: m.nav,
  ul: m.ul,
  li: m.li,
  button: m.button,
  a: m.a,
  p: m.p,
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
  h4: m.h4,
  h5: m.h5,
  h6: m.h6,
  img: m.img,
  svg: m.svg,
  path: m.path
}

// Export a hook that gets the properly typed motion components
export const useMotion = () => Motion