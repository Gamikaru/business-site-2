// src/components/core/Animations/hooks/useParallax.ts
"use client"

import { useRef, useState, useEffect, useMemo } from 'react'
import { useScroll, useTransform, useSpring, MotionValue, useMotionValue } from 'framer-motion'
import { useAnimationPreferences } from './useAnimationPreferences'
import { animationManager } from '../utils/AnimationManager'
import { useMotionContext } from '../providers/MotionProvider'

interface ParallaxOptions {
  offset?: number        // Movement amount in pixels
  direction?: 'up' | 'down' | 'left' | 'right'
  speed?: number         // Speed factor (1 is normal, higher is faster)
  easing?: [number, number, number, number] // Cubic bezier easing
  id?: string            // Optional ID for tracking
  containerRef?: React.RefObject<HTMLElement> // Optional container for scroll container
  smooth?: boolean       // Whether to apply spring physics to the parallax
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const {
    offset = 100,
    direction = 'up',
    speed = 1,
    easing = [0.42, 0, 0.58, 1], // Ease-in-out
    id: providedId,
    containerRef,
    smooth = false
  } = options

  const { shouldEnableParallax, getIntensity } = useAnimationPreferences()
  const ref = useRef<HTMLElement>(null)
  const globalMotion = useMotionContext()

  // Create a unique ID for this parallax instance
  const uniqueIdRef = useRef<string>(
    providedId || `parallax-${Math.random().toString(36).substring(2, 9)}`
  )

  // Determine the final direction and effective offset based on preferences
  const [finalDirection, setFinalDirection] = useState(direction)
  const [effectiveOffset, setEffectiveOffset] = useState(0)
  const [canUseFramer, setCanUseFramer] = useState(false)

  // Calculate parallax settings based on preferences
  useEffect(() => {
    const canAnimate = shouldEnableParallax()
    const calculatedOffset = canAnimate ? offset * getIntensity() * speed : 0

    setEffectiveOffset(calculatedOffset)
    setFinalDirection(direction)

    // Check if we can use Framer's hooks
    setCanUseFramer(animationManager.canUseFramerMotion() && canAnimate)
  }, [shouldEnableParallax, getIntensity, offset, speed, direction])

  // Using Framer Motion's useScroll to efficiently track scroll position
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef, // Fix: pass the RefObject directly, not .current
    offset: ["start end", "end start"],
    layoutEffect: false // Important for SSR compatibility
  })

  // Default motion value to use when effectiveScrollProgress is null
  const defaultScrollProgress = useMotionValue(0);

  // Use global scroll progress as fallback for elements not in viewport
  const effectiveScrollProgress = useMemo(() => {
    // If we have our own scroll progress from useScroll, use that
    if (scrollYProgress) return scrollYProgress;

    // If we have global scroll progress from context, use that
    if (globalMotion?.scrollYProgress) return globalMotion.scrollYProgress;

    // Fallback - use default motion value
    return defaultScrollProgress;
  }, [scrollYProgress, globalMotion?.scrollYProgress, defaultScrollProgress]);

  // Create transform range based on direction
  const outputRange = useMemo<[number, number]>(() => {
    // Direction-based calculations
    switch (finalDirection) {
      case 'up':
        return [effectiveOffset, -effectiveOffset]
      case 'down':
        return [-effectiveOffset, effectiveOffset]
      case 'left':
        return [effectiveOffset, -effectiveOffset]
      case 'right':
        return [-effectiveOffset, effectiveOffset]
      default:
        return [0, 0]
    }
  }, [finalDirection, effectiveOffset])

  // Create transform value using Framer Motion's useTransform
  const rawTransformValue = useTransform(
    effectiveScrollProgress, // Now always a MotionValue<number>
    [0, 1],
    outputRange,
    { ease: cubicBezierEase(easing) }
  )

  // Optionally add spring physics for smoother motion
  const transformValue = smooth
    ? useSpring(rawTransformValue, { stiffness: 100, damping: 30, mass: 0.5 })
    : rawTransformValue

  // For non-Framer fallback, use our existing animation manager
  useEffect(() => {
    if (canUseFramer || !ref.current) return // Skip if we're using Framer Motion

    const id = uniqueIdRef.current

    updateMeasurements()

    // Subscribe to resize events
    animationManager.subscribeToResize(id, updateMeasurements)

    // Track animation
    animationManager.trackAnimation(id, `parallax-${finalDirection}`)

    return () => {
      animationManager.unsubscribeFromResize(id)
      animationManager.untrackAnimation(id)
    }
  }, [canUseFramer, finalDirection])

  // Manual implementation for non-Framer fallback
  const measurementsRef = useRef({
    elementTop: 0,
    elementHeight: 0,
    windowHeight: 0,
    inputRange: [0, 1],
    outputRange: [0, 0],
  })

  // Update measurements function for non-Framer fallback
  const updateMeasurements = () => {
    if (!ref.current || canUseFramer) return

    const rect = ref.current.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // Store measurements
    measurementsRef.current.elementTop = rect.top + window.scrollY
    measurementsRef.current.elementHeight = rect.height
    measurementsRef.current.windowHeight = windowHeight

    // Calculate input range (scroll positions where the effect should happen)
    const start = measurementsRef.current.elementTop - windowHeight
    const end = measurementsRef.current.elementTop + rect.height
    measurementsRef.current.inputRange = [start, end]
    measurementsRef.current.outputRange = outputRange
  }

  // Update parallax effect on scroll - fallback for non-Framer
  useEffect(() => {
    if (canUseFramer || !ref.current) return // Skip if we're using Framer Motion

    const id = uniqueIdRef.current

    // Function to update transform value based on scroll position
    const updateTransform = (scrollY: number) => {
      const { inputRange, outputRange } = measurementsRef.current

      // Calculate progress (0 to 1)
      let progress = (scrollY - inputRange[0]) / (inputRange[1] - inputRange[0])

      // Apply easing
      progress = cubicBezier(progress, ...easing)

      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress))

      // Calculate new transform value
      const newValue =
        outputRange[0] + (outputRange[1] - outputRange[0]) * progress

      // If we have a transformValue from Framer, use it
      if (transformValue && typeof transformValue.set === 'function') {
        transformValue.set(newValue)
      }
    }

    // Subscribe to scroll events
    animationManager.subscribeToScroll(id, updateTransform)

    return () => {
      animationManager.unsubscribeFromScroll(id)
    }
  }, [canUseFramer, easing, transformValue])

  return {
    ref,
    transformValue,
    direction: finalDirection,
    scrollProgress: effectiveScrollProgress as MotionValue<number>,
    usingFramer: canUseFramer
  }
}

// Utility function to convert cubic bezier array to easing function
function cubicBezierEase(
  easing: [number, number, number, number]
): (t: number) => number {
  return (t: number) => cubicBezier(t, ...easing)
}

// Cubic bezier function for custom easing
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  if (t <= 0) return 0
  if (t >= 1) return 1

  const u = 1 - t
  const tt = t * t
  const uu = u * u
  const uuu = uu * u
  const ttt = tt * t

  return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3
}