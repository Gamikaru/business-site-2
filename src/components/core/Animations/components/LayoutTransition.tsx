// src/components/core/Animations/components/LayoutTransition.tsx
"use client"

import React, { ReactNode, useState, useEffect, useRef, memo, useMemo } from "react"
import {
  Variants,
  MotionProps,
  AnimatePresence,
  usePresence,
  useIsPresent
} from "framer-motion"
import { useAnimationPreferences } from "../hooks/useAnimationPreferences"
import { animationManager } from "../utils/AnimationManager"
import { Motion } from "../providers/MotionProvider"

type PresenceMode = "sync" | "crossfade" | "sequential" | "syncOnEnter" | "syncOnExit"

interface SharedLayoutProps extends Omit<MotionProps, "initial" | "animate" | "exit" | "transition"> {
  children: ReactNode
  className?: string
  layoutId?: string
  presenceId?: string | number // Unique ID for AnimatePresence
  mode?: PresenceMode
  duration?: number
  crossfadeDuration?: number
  exitBeforeEnter?: boolean
  onExitComplete?: () => void
  isVisible?: boolean
  id?: string
  transitionType?: "tween" | "spring"
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
  enterVariants?: Variants
  exitVariants?: Variants
  as?: keyof typeof Motion
}

/**
 * A component that handles smooth layout transitions and shared element animations
 */
const LayoutTransition: React.FC<SharedLayoutProps> = ({
  children,
  className = "",
  layoutId,
  presenceId,
  mode = "sync",
  duration,
  crossfadeDuration,
  exitBeforeEnter = false,
  onExitComplete,
  isVisible = true,
  id: providedId,
  transitionType = "tween",
  springConfig = {
    stiffness: 300,
    damping: 30,
    mass: 1
  },
  enterVariants,
  exitVariants,
  as = "div",
  ...motionProps
}) => {
  const { getTransitionSettings, shouldAnimate } = useAnimationPreferences()
  const [isPresent, safeToRemove] = usePresence()

  // Create unique ID for tracking
  const uniqueIdRef = useRef<string>(
    providedId || `layout-transition-${Math.random().toString(36).substring(2, 9)}`
  )

  // Get adjusted duration from animation preferences
  const { duration: calculatedDuration, ease } = getTransitionSettings(
    "default",
    duration
  )

  // Use custom crossfade duration or fallback to main duration
  const effectiveCrossfadeDuration = crossfadeDuration || calculatedDuration * 0.6

  // Create transition configuration based on type
  const transition = useMemo(() => {
    if (transitionType === "spring") {
      return {
        type: "spring",
        ...springConfig
      }
    }

    return {
      type: "tween",
      duration: calculatedDuration,
      ease
    }
  }, [transitionType, calculatedDuration, ease, springConfig])

  // Create default variants if not provided
  const defaultEnterVariants: Variants = useMemo(() => ({
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1, transition },
    exit: { opacity: 0, scale: 0.96, transition: { ...transition, duration: effectiveCrossfadeDuration } }
  }), [transition, effectiveCrossfadeDuration])

  const defaultExitVariants: Variants = useMemo(() => ({
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 1, scale: 1, transition },
    exit: { opacity: 0, scale: 0.96, transition: { ...transition, duration: effectiveCrossfadeDuration } }
  }), [transition, effectiveCrossfadeDuration])

  // Use provided variants or fallback to defaults
  const effectiveEnterVariants = enterVariants || defaultEnterVariants
  const effectiveExitVariants = exitVariants || defaultExitVariants

  // Track when element leaves
  useEffect(() => {
    if (!isPresent && safeToRemove) {
      const timeout = setTimeout(() => {
        safeToRemove()
      }, calculatedDuration * 1000)

      return () => clearTimeout(timeout)
    }
  }, [isPresent, safeToRemove, calculatedDuration])

  // Track animation with AnimationManager
  useEffect(() => {
    if (shouldAnimate() && isVisible) {
      const id = uniqueIdRef.current
      animationManager.trackAnimation(id, `layout-transition-${layoutId || 'default'}`)

      return () => {
        animationManager.untrackAnimation(id)
      }
    }
  }, [shouldAnimate, isVisible, layoutId])

  // Determine which variants to use based on presence mode
  const getVariants = () => {
    if (!isVisible) return effectiveExitVariants

    // If we're visible, return enter variants
    return effectiveEnterVariants
  }

  // If animations are disabled, render without motion
  if (!shouldAnimate()) {
    const Component = as === "div" ? "div" : as
    return (
      <div className={className}>
        {isVisible && (
          <Component {...motionProps as any}>
            {children}
          </Component>
        )}
      </div>
    )
  }

  // Get the appropriate Motion component
  const MotionComponent = Motion[as] || Motion.div

  // For crossfade mode, we need to use AnimatePresence
  if (mode === "crossfade") {
    return (
      <AnimatePresence mode={exitBeforeEnter ? "wait" : "sync"} onExitComplete={onExitComplete}>
        {isVisible && (
          <MotionComponent
            key={presenceId}
            layoutId={layoutId}
            className={className}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={getVariants()}
            layout={!layoutId}
            {...motionProps}
          >
            {children}
          </MotionComponent>
        )}
      </AnimatePresence>
    )
  }

  // For other modes, we rely on layout animations
  return (
    <MotionComponent
      layoutId={layoutId}
      layout={!layoutId}
      className={className}
      transition={transition}
      style={{
        visibility: isVisible ? "visible" : "hidden",
        opacity: isVisible ? 1 : 0,
      }}
      {...motionProps}
    >
      {children}
    </MotionComponent>
  )
}

export default memo(LayoutTransition)