// src/app/home/hooks/useAnimationSequence.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { animationManager } from "@/components/core/Animations/utils/AnimationManager";

// Enhanced animation phases for better storytelling
export type AnimationPhase =
  | "initial"
  | "background"
  | "headline"
  | "subheadline"
  | "complete"
  | "exit";

// Refined timing constants with better pacing (in ms)
export const BACKGROUND_PHASE_DURATION = 900;
export const HEADLINE_PHASE_DURATION = 1400;
export const SUBHEADLINE_PHASE_DURATION = 1000;
export const EXIT_PHASE_DURATION = 600;

// Animation intensity levels for more dynamic control
export type AnimationIntensity = "subtle" | "moderate" | "energetic";

export interface AnimationControls {
  isInitializing: boolean;
  isAnimating: boolean;
  isComplete: boolean;
  sequenceId: string;
  progress: number;
  intensity: AnimationIntensity;
  timestamp: number;
}

/**
 * Enhanced hook to orchestrate sophisticated animation sequences
 */
export function useAnimationSequence() {
  // Check for reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  // Track animation phase for sequenced animations
  const [animationPhase, setAnimationPhase] =
    useState<AnimationPhase>("initial");

  // Animation progress for each phase (0-1)
  const [phaseProgress, setPhaseProgress] = useState(0);

  // Animation intensity that can change based on user interaction
  const [intensity, setIntensity] = useState<AnimationIntensity>("moderate");

  // Timestamp to help coordinate animations
  const timestampRef = useRef(Date.now());

  // Unique ID for tracking with animation manager
  const animationIdRef = useRef(
    `animation-sequence-${Math.random().toString(36).substring(2, 9)}`
  );

  // Helper to update animation intensity based on interaction
  const updateIntensity = useCallback((newIntensity: AnimationIntensity) => {
    setIntensity(newIntensity);
  }, []);

  // Start the animation sequence with smoother coordination
  const startAnimationSequence = useCallback(() => {
    // For reduced motion users, skip to complete state with simple fade
    if (prefersReducedMotion) {
      setAnimationPhase("complete");
      setPhaseProgress(1);
      return;
    }

    // Register with animation manager
    animationManager.trackAnimation(animationIdRef.current, "hero-sequence");

    // Reset timestamp for fresh sequence
    timestampRef.current = Date.now();

    // Start with background phase
    setAnimationPhase("background");

    // Orchestrated animation sequence with proper timing
    // Background animation
    const backgroundTimer = setTimeout(() => {
      setAnimationPhase("headline");

      // Headline animation
      const headlineTimer = setTimeout(() => {
        setAnimationPhase("subheadline");

        // Subheadline animation
        const subheadlineTimer = setTimeout(() => {
          setAnimationPhase("complete");

          // Untrack animation once complete
          animationManager.untrackAnimation(animationIdRef.current);
        }, SUBHEADLINE_PHASE_DURATION);

        return () => clearTimeout(subheadlineTimer);
      }, HEADLINE_PHASE_DURATION);

      return () => clearTimeout(headlineTimer);
    }, BACKGROUND_PHASE_DURATION);

    return () => {
      clearTimeout(backgroundTimer);
      animationManager.untrackAnimation(animationIdRef.current);
    };
  }, [prefersReducedMotion]);

  // Exit animation sequence for page transitions
  const exitAnimationSequence = useCallback(() => {
    if (prefersReducedMotion) {
      setAnimationPhase("exit");
      setPhaseProgress(1);
      return;
    }

    setAnimationPhase("exit");

    // Register exit animation
    animationManager.trackAnimation(
      `${animationIdRef.current}-exit`,
      "hero-exit"
    );

    // Clean up after exit animation
    const exitTimer = setTimeout(() => {
      animationManager.untrackAnimation(`${animationIdRef.current}-exit`);
    }, EXIT_PHASE_DURATION);

    return () => clearTimeout(exitTimer);
  }, [prefersReducedMotion]);

  // Update phase progress for smooth transitions using RAF
  useEffect(() => {
    if (animationPhase === "initial") {
      setPhaseProgress(0);
      return;
    }

    if (animationPhase === "complete") {
      setPhaseProgress(1);
      return;
    }

    // Reset progress for new phase
    setPhaseProgress(0);

    // Animate progress from 0 to 1
    const startTime = Date.now();
    const duration =
      animationPhase === "background"
        ? BACKGROUND_PHASE_DURATION
        : animationPhase === "headline"
          ? HEADLINE_PHASE_DURATION
          : animationPhase === "subheadline"
            ? SUBHEADLINE_PHASE_DURATION
            : animationPhase === "exit"
              ? EXIT_PHASE_DURATION
              : 1000; // fallback

    // Smooth progress animation using optimized RAF
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Use cubic-bezier easing for more natural movement
      const easedProgress = cubicBezier(progress, 0.25, 0.1, 0.25, 1);
      setPhaseProgress(easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateProgress);
      }
    };

    requestAnimationFrame(animateProgress);
  }, [animationPhase]);

  // Create enhanced animation controls object for child components
  const animationControls: AnimationControls = {
    isInitializing: animationPhase === "initial",
    isAnimating: ["background", "headline", "subheadline", "exit"].includes(
      animationPhase
    ),
    isComplete: animationPhase === "complete",
    sequenceId: animationPhase,
    progress: phaseProgress,
    intensity,
    timestamp: timestampRef.current,
  };

  // Check if component should be visible based on animation phase
  const isBackgroundVisible = animationPhase !== "initial";
  const isHeadlineVisible =
    animationPhase === "headline" ||
    animationPhase === "subheadline" ||
    animationPhase === "complete";
  const isSubheadlineVisible =
    animationPhase === "subheadline" || animationPhase === "complete";
  const isExiting = animationPhase === "exit";

  return {
    animationPhase,
    phaseProgress,
    animationControls,
    isBackgroundVisible,
    isHeadlineVisible,
    isSubheadlineVisible,
    isExiting,
    startAnimationSequence,
    exitAnimationSequence,
    updateIntensity,
  };
}

// Cubic bezier easing function for smoother animations
function cubicBezier(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
}
