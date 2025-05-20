"use client"

import React, { ReactNode, useEffect, useRef, useMemo, memo } from "react"
import {
  MotionProps,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  useSpring,
} from "framer-motion"
import { useAnimationPreferences } from "../hooks/useAnimationPreferences"
import { animationManager } from "../utils/AnimationManager"
import { Motion } from "../providers/MotionProvider"

interface GestureElementProps extends Omit<MotionProps, "style"> {
  children: ReactNode
  className?: string
  dragEnabled?: boolean
  dragConstraints?:
    | { top?: number; right?: number; bottom?: number; left?: number }
    | React.RefObject<Element>
  tiltEnabled?: boolean
  tiltFactor?: number
  scaleOnHover?: boolean
  scaleAmount?: number
  hoverTransitionDuration?: number
  tapTransitionDuration?: number
  restTransitionDuration?: number
  onClick?: () => void
  onHoverStart?: () => void // Explicitly added to interface
  onHoverEnd?: () => void   // Explicitly added to interface
  id?: string
  perspective?: number // Add explicit perspective control
  transformOrigin?: string // Control transform origin
  layout?: boolean | string // Support for layout animations
  layoutId?: string // Support for shared element transitions
  magneticTilt?: boolean // Enable/disable magnetic tilt effect
  smooth?: boolean // Apply spring physics to animations
  springConfig?: { // Optional spring configuration
    stiffness?: number
    damping?: number
    mass?: number
  }
  resetOnExit?: boolean // Reset transforms when pointer leaves
}

const GestureElement: React.FC<GestureElementProps> = ({
  children,
  className = "",
  dragEnabled = false,
  dragConstraints,
  tiltEnabled = true,
  tiltFactor = 15,
  scaleOnHover = true,
  scaleAmount = 1.03,
  hoverTransitionDuration = 0.2,
  tapTransitionDuration = 0.1,
  restTransitionDuration = 0.3,
  onClick,
  onHoverStart, // Now properly received from props
  onHoverEnd,   // Now properly received from props
  id: providedId,
  perspective = 800, // Default perspective
  transformOrigin = "center", // Default to center transform origin
  layout = false,
  layoutId,
  magneticTilt = true, // Default to magnetic tilt on
  smooth = false, // Default to no spring physics
  springConfig = {
    stiffness: 300,
    damping: 20,
    mass: 0.5
  },
  resetOnExit = true, // Default to resetting on exit
  ...motionProps
}) => {
  const { shouldAnimate, reducedMotion, getIntensity } = useAnimationPreferences()

  // Create a unique ID for tracking
  const uniqueIdRef = useRef<string>(
    providedId || `gesture-element-${Math.random().toString(36).substring(2, 9)}`
  )

  // Element ref for measurements
  const elementRef = useRef<HTMLDivElement>(null)

  // Track whether we're currently being interacted with
  const isInteractingRef = useRef(false)

  // Motion values for the tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Apply spring physics to motion values if smooth is enabled
  const springX = smooth ? useSpring(x, springConfig) : x
  const springY = smooth ? useSpring(y, springConfig) : y

  // Adjust tilt factor based on animation intensity
  const effectiveTiltFactor = useMemo(() =>
    tiltFactor * getIntensity(),
    [tiltFactor, getIntensity]
  )

  // Transform mouse motion into rotation with dampening
  const rotateX = useTransform(
    springY,
    [-100, 100],
    [effectiveTiltFactor, -effectiveTiltFactor],
    { clamp: true }
  )

  const rotateY = useTransform(
    springX,
    [-100, 100],
    [-effectiveTiltFactor, effectiveTiltFactor],
    { clamp: true }
  )

  // Use motion template for combining transforms
  const transform = useMotionTemplate`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

  // Determine if animation features should be enabled
  const enableTilt = tiltEnabled && shouldAnimate() && !reducedMotion
  const enableDrag = dragEnabled && shouldAnimate() && !reducedMotion
  const enableHoverScale = scaleOnHover && shouldAnimate() && !reducedMotion

  // Track this element with AnimationManager
  useEffect(() => {
    if (!shouldAnimate()) return

    const id = uniqueIdRef.current

    // Register for resize events to update measurements
    animationManager.subscribeToResize(id, () => {
      // Reset transform on resize to avoid stale positions
      if (!isInteractingRef.current && resetOnExit) {
        x.set(0)
        y.set(0)
      }
    })

    return () => {
      animationManager.unsubscribeFromResize(id)
    }
  }, [shouldAnimate, x, y, resetOnExit])

  // Event handlers for tilt effect - memoized to prevent recreations
  const handleMouseMove = useMemo(() => (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !elementRef.current) return

    isInteractingRef.current = true

    // Track this gesture animation
    const id = uniqueIdRef.current
    animationManager.trackAnimation(id, "gesture-tilt")

    const rect = elementRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY

    if (magneticTilt) {
      // Apply smoothing to the motion for a more natural feel
      // Lower damping = more responsive/faster movement
      const damping = 5
      const targetX = mouseX
      const targetY = mouseY

      // Calculate the interpolated value for smoother movement
      // This creates a "magnetic" effect where the tilt follows the mouse
      const currentX = x.get()
      const currentY = y.get()

      x.set(currentX + (targetX - currentX) / damping)
      y.set(currentY + (targetY - currentY) / damping)
    } else {
      // Direct setting without magnetic effect
      x.set(mouseX)
      y.set(mouseY)
    }
  }, [enableTilt, x, y, magneticTilt])

  const handleMouseLeave = useMemo(() => () => {
    isInteractingRef.current = false

    if (resetOnExit) {
      // Reset values to zero
      x.set(0)
      y.set(0)
    }

    // Untrack this animation
    animationManager.untrackAnimation(uniqueIdRef.current)
  }, [x, y, resetOnExit])

  // Calculate transition settings
  const transitions = useMemo(() => ({
    hover: {
      type: smooth ? "spring" : "tween",
      ...springConfig,
      duration: !smooth ? hoverTransitionDuration : undefined,
    },
    tap: {
      type: smooth ? "spring" : "tween",
      ...springConfig,
      duration: !smooth ? tapTransitionDuration : undefined,
    },
    rest: {
      type: smooth ? "spring" : "tween",
      ...springConfig,
      duration: !smooth ? restTransitionDuration : undefined,
    }
  }), [
    hoverTransitionDuration,
    tapTransitionDuration,
    restTransitionDuration,
    smooth,
    springConfig
  ])

  // Define hover and tap animations
  const hoverAnimation = useMemo(() => ({
    scale: enableHoverScale ? scaleAmount : 1,
    transition: transitions.hover
  }), [enableHoverScale, scaleAmount, transitions.hover])

  const tapAnimation = useMemo(() => ({
    scale: shouldAnimate() ? 0.98 : 1,
    transition: transitions.tap
  }), [shouldAnimate, transitions.tap])

  // Create style object based on enabled features
  const motionStyle = useMemo(() => {
    const style: Record<string, unknown> = {
      transformStyle: "preserve-3d",
      willChange: enableTilt || enableHoverScale ?
        'transform, opacity' : 'auto',
      transformOrigin,
    }

    if (enableTilt) {
      style.transform = transform
    }

    return style
  }, [enableTilt, enableHoverScale, transform, transformOrigin])

  // Handle automatic animation tracking on interaction - FIXED to forward events
  const handleInteractionStart = useMemo(() => () => {
    if (!shouldAnimate()) return

    const id = uniqueIdRef.current
    animationManager.trackAnimation(id, "gesture-interaction")

    // Call the provided onHoverStart prop if it exists
    if (onHoverStart) {
      onHoverStart();
    }
  }, [shouldAnimate, onHoverStart])

  const handleInteractionEnd = useMemo(() => () => {
    const id = uniqueIdRef.current
    animationManager.untrackAnimation(id)

    // Call the provided onHoverEnd prop if it exists
    if (onHoverEnd) {
      onHoverEnd();
    }
  }, [onHoverEnd])

  return (
    <AnimatePresence>
      <Motion.div
        ref={elementRef}
        className={className}
        style={motionStyle}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        drag={enableDrag}
        dragConstraints={enableDrag ? dragConstraints : false}
        onMouseMove={enableTilt ? handleMouseMove : undefined}
        onMouseLeave={enableTilt ? handleMouseLeave : undefined}
        onHoverStart={handleInteractionStart}
        onHoverEnd={handleInteractionEnd}
        onClick={onClick}
        transition={transitions.rest}
        layout={layout}
        layoutId={layoutId}
        {...motionProps}
      >
        {children}
      </Motion.div>
    </AnimatePresence>
  )
}

export default memo(GestureElement)