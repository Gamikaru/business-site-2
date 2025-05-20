// src/components/core/Animations/hooks/useFramerAnimations.ts
"use client"

import { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import {
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useAnimate,
  useInView,
  MotionValue,
  Transition,
  Variants,
  AnimationControls
} from 'framer-motion'
import { useAnimationPreferences } from './useAnimationPreferences'
import { animationManager } from '../utils/AnimationManager'
import { useMotionContext } from '../providers/MotionProvider'

// Types
interface ScrollRangeOptions {
  inputRange?: [number, number] // Default [0, 1]
  outputRange: [number, number]
  easing?: (t: number) => number // Custom easing function
  smooth?: boolean // Apply spring physics
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
}

interface CustomScrollOptions {
  target?: React.RefObject<HTMLElement>
  container?: React.RefObject<HTMLElement>
  offset?: [string | number, string | number]
  layoutEffect?: boolean
  smooth?: boolean
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
}

interface UseRevealOptions {
  variants?: Variants
  threshold?: number
  margin?: string
  once?: boolean
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'opacity'
  distance?: number
  duration?: number
  id?: string
  transitionType?: 'tween' | 'spring'
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
}

/**
 * Hook to create scroll-linked animation values with full control
 */
export function useScrollAnimation<T = number>({
  inputRange = [0, 1],
  outputRange,
  easing,
  smooth = false,
  springConfig = {
    stiffness: 100,
    damping: 30,
    mass: 0.5
  }
}: ScrollRangeOptions): MotionValue<T> {
  const { shouldAnimate } = useAnimationPreferences()
  const { scrollYProgress } = useMotionContext()

  // Apply optional easing to the scroll progress
  const easedScrollProgress = easing
    ? useTransform(scrollYProgress, [0, 1], [0, 1], { ease: easing })
    : scrollYProgress

  // Create the transformed value
  const transformedValue = useTransform(
    easedScrollProgress,
    inputRange,
    outputRange as [T, T]
  )

  // Apply optional spring physics
  const outputValue = smooth
    ? useSpring(transformedValue, springConfig)
    : transformedValue

  return outputValue
}

/**
 * Hook to create scroll-linked opacity animations
 */
export function useScrollOpacity({
  inputRange = [0, 1],
  outputRange = [1, 0],
  ...options
}: Partial<ScrollRangeOptions> = {}): MotionValue<number> {
  return useScrollAnimation({
    inputRange,
    outputRange,
    ...options
  })
}

/**
 * Hook to create scroll-linked transform animations (scale, translate, etc.)
 */
export function useScrollTransform({
  property,
  inputRange = [0, 1],
  outputRange,
  unit = 'px',
  ...options
}: {
  property: 'translateY' | 'translateX' | 'scale' | 'rotate' | 'skew'
  inputRange?: [number, number]
  outputRange: [number, number]
  unit?: string
} & Partial<ScrollRangeOptions>): MotionValue<string> {
  // Get the transformed value
  const value = useScrollAnimation({
    inputRange,
    outputRange,
    ...options
  })

  // Create the CSS transform string
  let template: MotionValue<string>

  switch(property) {
    case 'translateY':
      template = useMotionTemplate`translateY(${value}${unit})`
      break
    case 'translateX':
      template = useMotionTemplate`translateX(${value}${unit})`
      break
    case 'scale':
      template = useMotionTemplate`scale(${value})`
      break
    case 'rotate':
      template = useMotionTemplate`rotate(${value}deg)`
      break
    case 'skew':
      template = useMotionTemplate`skew(${value}deg)`
      break
    default:
      template = useMotionTemplate`${value}${unit}`
  }

  return template
}

/**
 * Hook to create custom scroll-triggered animations
 */
export function useCustomScroll(options: CustomScrollOptions = {}) {
  const { shouldAnimate } = useAnimationPreferences()
  const {
    target,
    container,
    offset = ["start end", "end start"],
    layoutEffect = false,
    smooth = false,
    springConfig = {
      stiffness: 100,
      damping: 30,
      mass: 0.5
    }
  } = options

  // Get scroll progress
  const { scrollYProgress, scrollXProgress } = useScroll({
    target,
    container,
    offset,
    layoutEffect
  })

  // Apply spring physics if requested
  const smoothScrollY = smooth ? useSpring(scrollYProgress, springConfig) : scrollYProgress
  const smoothScrollX = smooth ? useSpring(scrollXProgress, springConfig) : scrollXProgress

  // Create a unique ID for this scroll instance
  const uniqueId = useRef(`custom-scroll-${Math.random().toString(36).substring(2, 9)}`)

  // Track with animation manager
  useEffect(() => {
    if (!shouldAnimate()) return

    const id = uniqueId.current
    animationManager.trackAnimation(id, 'custom-scroll')

    return () => {
      animationManager.untrackAnimation(id)
    }
  }, [shouldAnimate])

  // Helper to create transformed values
  const createTransform = useCallback(<T>(
    progress: MotionValue<number>,
    inputRange: number[],
    outputRange: T[],
    easing?: (t: number) => number
  ) => {
    return useTransform(
      progress,
      inputRange,
      outputRange,
      easing ? { ease: easing } : undefined
    )
  }, [])

  return {
    scrollYProgress: smoothScrollY,
    scrollXProgress: smoothScrollX,
    createTransform,
    getY: <T>(inputRange: number[], outputRange: T[], easing?: (t: number) => number) =>
      createTransform(smoothScrollY, inputRange, outputRange, easing),
    getX: <T>(inputRange: number[], outputRange: T[], easing?: (t: number) => number) =>
      createTransform(smoothScrollX, inputRange, outputRange, easing)
  }
}

/**
 * Hook for reveal-on-scroll animations using Framer Motion's capabilities
 * but managed through our animation system
 */
export function useRevealAnimation({
  variants,
  threshold = 0.2,
  margin = "0px",
  once = true,
  delay = 0,
  direction = 'up',
  distance = 50,
  duration,
  id: providedId,
  transitionType = 'tween',
  springConfig = {
    stiffness: 300,
    damping: 30,
    mass: 1
  }
}: UseRevealOptions = {}) {
  const { shouldAnimate, getTransitionSettings, getIntensity } = useAnimationPreferences()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView({
    root: null,
    threshold,
    margin,
    once
  })

  // Create a unique ID for tracking
  const uniqueId = useRef<string>(
    providedId || `reveal-${Math.random().toString(36).substring(2, 9)}`
  )

  // Track if animation has been triggered
  const [hasAnimated, setHasAnimated] = useState(false)

  // Apply intensity to distance
  const effectiveDistance = distance * getIntensity()

  // Get transition settings
  const { duration: calculatedDuration, ease } = getTransitionSettings(
    "default",
    duration
  )

  // Create transition based on type
  const transition = useMemo(() => {
    if (transitionType === 'spring') {
      return {
        type: 'spring',
        ...springConfig,
        delay
      }
    }

    return {
      type: 'tween',
      duration: calculatedDuration,
      ease,
      delay
    }
  }, [transitionType, calculatedDuration, ease, delay, springConfig])

  // Create initial and animate states based on direction
  const initialStyles = useMemo(() => {
    switch (direction) {
      case 'up':
        return { y: effectiveDistance, opacity: 0 }
      case 'down':
        return { y: -effectiveDistance, opacity: 0 }
      case 'left':
        return { x: effectiveDistance, opacity: 0 }
      case 'right':
        return { x: -effectiveDistance, opacity: 0 }
      case 'scale':
        return { scale: 0.92, opacity: 0 }
      case 'opacity':
      default:
        return { opacity: 0 }
    }
  }, [direction, effectiveDistance])

  const animateStyles = useMemo(() => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 }
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 }
      case 'scale':
        return { scale: 1, opacity: 1 }
      case 'opacity':
      default:
        return { opacity: 1 }
    }
  }, [direction])

  // Track animation with animation manager
  useEffect(() => {
    if (!shouldAnimate()) return

    const id = uniqueId.current

    if (isInView && !hasAnimated) {
      animationManager.trackAnimation(id, `reveal-${direction}`)
      setHasAnimated(true)
    }

    return () => {
      if (hasAnimated) {
        animationManager.untrackAnimation(id)
      }
    }
  }, [shouldAnimate, isInView, hasAnimated, direction])

  // Combine with provided variants if any
  const defaultVariants: Variants = {
    hidden: initialStyles,
    visible: {
      ...animateStyles,
      transition
    }
  }

  const finalVariants = variants || defaultVariants

  return {
    ref,
    isInView,
    variants: finalVariants,
    initial: 'hidden',
    animate: isInView ? 'visible' : 'hidden',
    transition,
    initialStyles,
    animateStyles
  }
}

/**
 * Hook for creating timeline animations with Framer Motion
 */
export function useTimelineAnimation(id?: string) {
  const { shouldAnimate, getTransitionSettings } = useAnimationPreferences()
  const [scope, animate] = useAnimate()

  // Create a unique ID for tracking
  const uniqueId = useRef<string>(
    id || `timeline-${Math.random().toString(36).substring(2, 9)}`
  )

  // Track animation completion
  const [isComplete, setIsComplete] = useState(false)

  // Helper to create a timeline
  const createTimeline = useCallback((
    keyframes: Array<[string | Element | React.RefObject<Element>, any, any?]>,
    options?: {
      defaultTransition?: Transition,
      onComplete?: () => void
    }
  ) => {
    if (!shouldAnimate()) {
      if (options?.onComplete) {
        options.onComplete()
      }
      setIsComplete(true)
      return null
    }

    // Track with animation manager
    const id = uniqueId.current
    animationManager.trackAnimation(id, 'timeline-animation')

    // Create transition settings
    const { duration, ease } = getTransitionSettings('default')
    const defaultTransition = options?.defaultTransition || {
      duration,
      ease
    }

    // Play the timeline
    const controls = animate(keyframes, {
      defaultTransition,
      onComplete: () => {
        setIsComplete(true)
        animationManager.untrackAnimation(id)

        if (options?.onComplete) {
          options.onComplete()
        }
      }
    })

    return controls
  }, [shouldAnimate, animate, getTransitionSettings])

  return {
    scope,
    animate: createTimeline,
    isComplete
  }
}

/**
 * Hook for creating tilt effects with better performance
 */
export function useTiltEffect({
  tiltFactor = 15,
  perspective = 800,
  smooth = false,
  springConfig = {
    stiffness: 300,
    damping: 30,
    mass: 0.5
  },
  reset = true
} = {}) {
  const { shouldAnimate, getIntensity, reducedMotion } = useAnimationPreferences()
  const ref = useRef<HTMLElement>(null)

  // Create motion values for tilt
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Apply spring physics if requested
  const tiltX = smooth ? useSpring(x, springConfig) : x
  const tiltY = smooth ? useSpring(y, springConfig) : y

  // Adjust tilt factor based on animation intensity
  const effectiveTiltFactor = useMemo(() =>
    tiltFactor * getIntensity(),
    [tiltFactor, getIntensity]
  )

  // Create transforms
  const rotateX = useTransform(
    tiltY,
    [-100, 100],
    [effectiveTiltFactor, -effectiveTiltFactor],
    { clamp: true }
  )

  const rotateY = useTransform(
    tiltX,
    [-100, 100],
    [-effectiveTiltFactor, effectiveTiltFactor],
    { clamp: true }
  )

  // Create a combined transform
  const transform = useMotionTemplate`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

  // Create handlers
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!shouldAnimate() || reducedMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY

    x.set(mouseX)
    y.set(mouseY)
  }, [shouldAnimate, reducedMotion, x, y])

  const handleMouseLeave = useCallback(() => {
    if (reset) {
      x.set(0)
      y.set(0)
    }
  }, [reset, x, y])

  // Determine if tilt should be enabled
  const enabled = shouldAnimate() && !reducedMotion

  return {
    ref,
    style: { transform },
    x: tiltX,
    y: tiltY,
    rotateX,
    rotateY,
    transform,
    handleMouseMove: enabled ? handleMouseMove : undefined,
    handleMouseLeave: enabled ? handleMouseLeave : undefined,
    enabled
  }
}

/**
 * Export combined object with all hooks for easier imports
 */
export const framerAnimations = {
  useScrollAnimation,
  useScrollOpacity,
  useScrollTransform,
  useCustomScroll,
  useRevealAnimation,
  useTimelineAnimation,
  useTiltEffect
}

export default framerAnimations