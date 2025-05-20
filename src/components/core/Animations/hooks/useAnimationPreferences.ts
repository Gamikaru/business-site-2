// src/components/core/Animations/hooks/useAnimationPreferences.ts
"use client";

import { useMemo, useCallback } from 'react';
import { useAnimationContext } from '../context/AnimationContext';

/**
 * A hook that provides animation settings based on device and user preferences.
 * Optimized for performance with memoized return values.
 */
export const useAnimationPreferences = () => {
  const {
    isMobile,
    getPreferenceValue
  } = useAnimationContext();

  // Calculate appropriate transition settings based on preferences and device
  const getTransitionSettings = useCallback(
    (
      type: 'default' | 'fast' | 'slow' | 'elastic' = 'default',
      customDuration?: number
    ) => {
      // Base durations (in seconds)
      const baseDurations = {
        fast: 0.2,
        default: 0.4,
        slow: 0.7,
        elastic: 0.6
      };

      // Base easings - using arrays for better performance
      const baseEasings = {
        fast: [0.4, 0, 0.2, 1], // Material Design standard easing
        default: [0.4, 0, 0.2, 1],
        slow: [0.4, 0, 0.2, 1],
        elastic: [0.68, -0.6, 0.32, 1.6] // Elastic-like easing
      };

      // Calculate modified duration based on user preferences
      const baseDuration = customDuration || baseDurations[type];
      let duration = baseDuration * getPreferenceValue('duration');

      // Adjust for reduced motion
      if (getPreferenceValue('reducedMotion')) {
        duration = Math.min(duration, 0.2); // Cap at 0.2s for reduced motion
      }

      // Reduce duration on mobile slightly for better perceived performance
      if (isMobile && !getPreferenceValue('reducedMotion')) {
        duration *= 0.85;
      }

      return {
        duration,
        ease: baseEasings[type]
      };
    },
    [getPreferenceValue, isMobile]
  );

  // Should we enable animations based on preferences?
  const shouldAnimate = useCallback((): boolean => {
    if (!getPreferenceValue('enabled')) return false;
    if (getPreferenceValue('reducedMotion')) return false;
    if (isMobile && getPreferenceValue('disableOnMobile')) return false;
    return true;
  }, [getPreferenceValue, isMobile]);

  // Calculate animation intensity based on preferences
  const getIntensity = useCallback(
    (defaultValue: number = 1): number => {
      let intensity = defaultValue * getPreferenceValue('intensity');

      // Reduce on lower performance settings
      const performanceLevel = getPreferenceValue('performance');
      if (performanceLevel === 'low') {
        intensity *= 0.5;
      } else if (performanceLevel === 'medium') {
        intensity *= 0.8;
      }

      return intensity;
    },
    [getPreferenceValue]
  );

  // Determine if parallax should be enabled
  const shouldEnableParallax = useCallback((): boolean => {
    if (!shouldAnimate()) return false;
    if (!getPreferenceValue('enableParallax')) return false;
    if (getPreferenceValue('performance') === 'low') return false;
    return true;
  }, [shouldAnimate, getPreferenceValue]);

  // Only recompute this object when the dependencies change
  return useMemo(() => ({
    getTransitionSettings,
    shouldAnimate,
    getIntensity,
    shouldEnableParallax,
    reducedMotion: getPreferenceValue('reducedMotion'),
    performance: getPreferenceValue('performance'),
    enabled: getPreferenceValue('enabled')
  }), [
    getTransitionSettings,
    shouldAnimate,
    getIntensity,
    shouldEnableParallax,
    getPreferenceValue
  ]);
};