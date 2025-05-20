import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { useAnimationPreferences } from '@/components/core/Animations';
import { animationManager } from '@/components/core/Animations/utils/AnimationManager';

export const useAboutAnimations = (componentId: string, threshold: number = 0.3) => {
  // Generate a unique animation ID if one isn't provided
  const animationId = useRef(
    componentId || `about-section-${Math.random().toString(36).substring(2, 9)}`
  );

  // Get animation system preferences
  const { shouldAnimate, reducedMotion } = useAnimationPreferences();

  // Create a reference to be observed
  const ref = useRef<HTMLElement>(null);

  // Check if element is in view
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
  });

  // Register animation with the animation manager
  useEffect(() => {
    if (shouldAnimate() && !reducedMotion) {
      animationManager.trackAnimation(animationId.current, 'about-section');

      return () => {
        animationManager.untrackAnimation(animationId.current);
      };
    }
  }, [shouldAnimate, reducedMotion]);

  return {
    ref,
    isInView,
    shouldAnimate: shouldAnimate() && !reducedMotion,
    reducedMotion,
    animationId: animationId.current,
  };
};
