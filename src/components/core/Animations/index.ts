// src/components/core/Animations/index.ts
/**
 * Animation System
 *
 * A comprehensive, performance-optimized animation system built on Framer Motion
 * with support for scroll-based animations, staggered sequences, and interactive elements.
 *
 * Features:
 * - Optimized scroll-linked animations using Framer Motion hooks
 * - Centralized animation tracking and performance monitoring
 * - Respect for user preferences including reduced motion
 * - Hardware-accelerated animations for better performance
 * - Layout and shared element transitions
 */

// Core animation manager and Framer Motion provider
export { animationManager, AnimationManager } from './utils/AnimationManager'
export { MotionProvider, useMotionContext, useMotion, Motion } from './providers/MotionProvider'

// -------------- Components --------------

/**
 * Reveals elements as they scroll into view with configurable animations.
 */
export { default as ScrollReveal } from './components/ScrollReveal'

/**
 * Visual effect components for creative animations
 */
export { default as GlitchEffect } from './components/GlitchEffect'
export { default as RetroCRT } from './components/RetroCRT'

/**
 * Creates staggered animations for multiple child elements.
 */
export {
  default as StaggerContainer,
  staggerContainerVariants,
  staggerItemVariants
} from './components/StaggerContainer'

/**
 * Animated text reveals with optional character/word staggering.
 */
export { default as TextReveal } from './components/TextReveal'

/**
 * Creates a parallax scrolling effect for elements.
 */
export { default as ParallaxSection } from './components/ParallaxSection'

/**
 * Interactive elements with gesture animations (hover, tap, drag, tilt).
 */
export { default as GestureElement } from './components/GestureElements'

/**
 * Animates SVG paths with drawing effects.
 */
export { default as AnimatedPath } from './components/AnimatedPath'

/**
 * Runs a sequence of animations with precise timing control.
 */
export { default as AnimationSequence } from './components/AnimationSequence'

/**
 * Creates animations that progress based on scroll position.
 */
export { default as ScrollLinkedAnimation } from './components/ScrollLinkedAnimation'

/**
 * Facilitates layout transitions and shared element animations
 */
export { default as LayoutTransition } from './components/LayoutTransition'

// -------------- Hooks --------------

/**
 * Provides animation settings based on device and user preferences.
 */
export { useAnimationPreferences } from './hooks/useAnimationPreferences'

/**
 * Creates customized parallax effects.
 */
export { useParallax } from './hooks/useParallax'

/**
 * Hooks for detecting element visibility in viewport.
 */
export {
  useIntersectionObserver,
  useIsVisible,
  useRevealEffect
} from './hooks/useIntersectionObserver'

/**
 * Enhanced Framer Motion animation hooks
 */
export {
  useScrollAnimation,
  useScrollOpacity,
  useScrollTransform,
  useCustomScroll,
  useRevealAnimation,
  useTimelineAnimation,
  useTiltEffect,
  framerAnimations
} from './hooks/useFramerAnimations'

// -------------- Context --------------

/**
 * Provider for animation preferences and settings.
 */
export {
  AnimationProvider,
  useAnimationContext
} from './context/AnimationContext'

// -------------- Variants --------------
// Basic animation variants

/**
 * Simple fade animations.
 */
export { fadeVariants } from './variants/basics'

/**
 * Slide-in animations from different directions.
 */
export {
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants
} from './variants/basics'

/**
 * Scale animations.
 */
export {
  scaleVariants,
  popUpVariants
} from './variants/basics'

/**
 * Hover state animations.
 */
export { hoverScaleVariants } from './variants/basics'

// Text animation variants

/**
 * Text reveal and staggering animations.
 */
export {
  textRevealVariants,
  charStaggerVariants,
  charVariants,
  wordStaggerVariants,
  wordVariants,
  lineRevealVariants,
  cursorVariants
} from './variants/text'

// Container animation variants

/**
 * Animations for container elements.
 */
export {
  // Renamed to avoid naming collisions
  staggerContainerVariants as containerStaggerVariants,
  staggerItemVariants as containerStaggerItemVariants,
  gridContainerVariants,
  gridItemVariants,
  cardVariants
} from './variants/containers'

/**
 * Hero section animations.
 */
export {
  heroContainerVariants,
  heroItemVariants
} from './variants/containers'

// Page transition variants

/**
 * Animations for page transitions.
 */
export {
  pageTransitionVariants,
  fadeUpPageVariants,
  slidePageVariants,
  contentAfterPageLoadVariants,
  mobilePageTransitionVariants
} from './variants/page'

// Complex animation variants

/**
 * Advanced animation effects.
 */
export {
  pathFollowVariants,
  drawSVGVariants,
  elasticVariants,
  counterVariants,
  rotateVariants,
  flipVariants,
  tiltVariants
} from './variants/complex'

// -------------- Utilities --------------

/**
 * Animation utility functions for timing, device adaptation, etc.
 */
export {
  createDelaySequence,
  adaptVariantsForDevice,
  createTransition,
  shouldEnableAnimations,
  isInViewport
} from './utils/animationHelpers'

/**
 * Device-specific animation utilities.
 */
export {
  useDeviceVariants,
  useDeviceAnimation,
  useShouldEnableEffect
} from './utils/deviceAnimations'