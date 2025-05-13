// src/components/common/Animations/hooks/useAnimationPreferences.ts
"use client";

import { useAnimationContext } from '../context/AnimationContext';
import { useDevice } from '../../../../context/DeviceContext';

/**
 * A hook that provides animation settings based on device and user preferences
 */
export const useAnimationPreferences = () => {
    const { preferences } = useAnimationContext();
    const device = useDevice();

    // Calculate appropriate transition settings based on preferences and device
    const getTransitionSettings = (
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

        // Base easings
        const baseEasings = {
            fast: [0.4, 0, 0.2, 1], // Material Design standard easing
            default: [0.4, 0, 0.2, 1],
            slow: [0.4, 0, 0.2, 1],
            elastic: [0.68, -0.6, 0.32, 1.6] // Elastic-like easing
        };

        // Calculate modified duration based on user preferences
        const baseDuration = customDuration || baseDurations[type];
        let duration = baseDuration * preferences.duration;

        // Adjust for reduced motion
        if (preferences.reducedMotion) {
            duration = Math.min(duration, 0.2); // Cap at 0.2s for reduced motion
        }

        // Reduce duration on mobile slightly for better perceived performance
        if (device.isMobile && !preferences.reducedMotion) {
            duration *= 0.85;
        }

        return {
            duration,
            ease: baseEasings[type]
        };
    };

    // Should we enable animations based on preferences?
    const shouldAnimate = (): boolean => {
        if (!preferences.enabled) return false;
        if (preferences.reducedMotion) return false;
        if (device.isMobile && preferences.disableOnMobile) return false;
        return true;
    };

    // Calculate animation intensity based on preferences
    const getIntensity = (defaultValue: number = 1): number => {
        let intensity = defaultValue * preferences.intensity;

        // Reduce on lower performance settings
        if (preferences.performance === 'low') {
            intensity *= 0.5;
        } else if (preferences.performance === 'medium') {
            intensity *= 0.8;
        }

        return intensity;
    };

    // Determine if parallax should be enabled
    const shouldEnableParallax = (): boolean => {
        if (!shouldAnimate()) return false;
        if (!preferences.enableParallax) return false;
        if (preferences.performance === 'low') return false;
        return true;
    };

    return {
        getTransitionSettings,
        shouldAnimate,
        getIntensity,
        shouldEnableParallax,
        reducedMotion: preferences.reducedMotion,
        performance: preferences.performance,
        enabled: preferences.enabled
    };
};