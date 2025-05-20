import { useRef, useEffect, useCallback } from 'react';
import { animationManager, useAnimationPreferences, useRevealEffect } from '@/components/core/Animations';

/**
 * Custom hook to manage animation states and controls for SubheadlineBox
 */
export const useBoxAnimations = (
  index: number,
  isInView: boolean = false,
  animationComplete: boolean = false
) => {
  // Use animation system
  const { shouldAnimate, reducedMotion, getTransitionSettings } = useAnimationPreferences();

  // Create unique ID for animation tracking
  const animationId = useRef(
    `subheadline-box-${index}-${Math.random().toString(36).substring(2, 9)}`
  );

  // Use reveal effect from animation system
  const revealData = useRevealEffect({
    triggerOnce: true,
    threshold: 0.2,
    id: animationId.current,
  });

  // Safely extract isRevealed value
  const isRevealed = Boolean(
    revealData && Array.isArray(revealData) ? revealData[1] : false
  );

  // Track animations with animation manager
  useEffect(() => {
    if (!shouldAnimate()) return;

    if (isRevealed || animationComplete || isInView) {
      animationManager.trackAnimation(
        animationId.current,
        `subheadline-box-${index}`
      );
    }

    return () => {
      animationManager.untrackAnimation(animationId.current);
    };
  }, [shouldAnimate, isRevealed, index, animationComplete, isInView]);

  // Create a spring animation config that's more responsive to scroll position
  const springConfig = {
    type: "spring",
    stiffness: 120 - index * 10,
    damping: 18,
    mass: 1 + index * 0.15,
    delay: index * 0.12,
    restDelta: 0.001,
    restSpeed: 0.001,
  };

  const isFinalBox = index === 3;

  // Determine which variants to use based on final box status
  const variants = isFinalBox
    ? {
        hidden: {
          opacity: 0,
          y: 20,
          x: 80,
          scale: 0.92,
          rotateX: 20,
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotateX: 0,
        },
      }
    : {
        hidden: {
          opacity: 0,
          y: -50 + index * 15,
          x: 50 - index * 20,
          scale: 0.9,
          rotateX: 15,
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotateX: 0,
        },
      };

  return {
    animationId: animationId.current,
    isRevealed,
    revealData,
    springConfig,
    variants,
    reducedMotion,
    shouldAnimate: shouldAnimate()
  };
};
