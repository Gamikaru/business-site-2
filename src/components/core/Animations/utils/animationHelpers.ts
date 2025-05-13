// src/components/core/Animations/utils/animationHelpers.ts
import { Transition, Variants } from 'framer-motion';

// Create a more specific type to replace 'any'
type VariantProperty = number | string | boolean | object | null | undefined;

/**
 * Create a delay sequence for staggered animations
 *
 * @param itemCount Number of items to create delays for
 * @param baseDelay Starting delay
 * @param increment Delay increment between items
 * @returns Array of delay values
 */
export const createDelaySequence = (
    itemCount: number,
    baseDelay: number = 0.1,
    increment: number = 0.1
): number[] => {
    return Array.from({ length: itemCount }, (_, i) => baseDelay + i * increment);
};

/**
 * Customize animation variants based on device type
 *
 * @param variants Base animation variants
 * @param isMobile Whether the current device is mobile
 * @param mobileAdjustments Adjustments to make for mobile
 * @returns Modified variants object
 */
export const adaptVariantsForDevice = (
    variants: Variants,
    isMobile: boolean,
    mobileAdjustments: {
        durationFactor?: number;
        distanceFactor?: number;
        delayFactor?: number;
    } = {}
): Variants => {
    if (!isMobile) return variants;

    const {
        durationFactor = 0.8,  // Slightly faster animations on mobile
        distanceFactor = 0.7,  // Shorter distances on mobile
        delayFactor = 0.7,     // Shorter delays on mobile
    } = mobileAdjustments;

    // Create a deep copy of variants
    const mobileVariants = JSON.parse(JSON.stringify(variants));

    // Adjust properties in the variants
    Object.keys(mobileVariants).forEach(key => {
        const variant = mobileVariants[key] as Record<string, VariantProperty>;

        // Adjust transition durations if they exist
        if (variant.transition && typeof variant.transition === 'object') {
            if ('duration' in variant.transition) {
                variant.transition.duration = (variant.transition.duration as number) * durationFactor;
            }
        }

        // Adjust transition delays if they exist
        if (variant.transition && typeof variant.transition === 'object') {
            if ('delay' in variant.transition) {
                variant.transition.delay = (variant.transition.delay as number) * delayFactor;
            }
        }

        // Adjust animation distances
        ['x', 'y'].forEach(prop => {
            if (typeof variant[prop] === 'number') {
                variant[prop] = variant[prop] as number * distanceFactor;
            }
        });
    });

    return mobileVariants;
};

/**
 * Create transition properties with easing based on type
 *
 * @param type The type of transition
 * @param duration Optional custom duration
 * @returns Transition object for Framer Motion
 */
export const createTransition = (
    type: 'default' | 'spring' | 'elastic' | 'bounce' | 'gentle' | 'quick' = 'default',
    duration?: number
): Transition => {
    switch (type) {
        case 'spring':
            return {
                type: 'spring',
                damping: 20,
                stiffness: 300,
                duration: duration
            };
        case 'elastic':
            return {
                type: 'spring',
                damping: 10,
                stiffness: 100,
                mass: 1.2,
                duration: duration
            };
        case 'bounce':
            return {
                type: 'spring',
                damping: 7,
                stiffness: 200,
                mass: 1,
                duration: duration
            };
        case 'gentle':
            return {
                duration: duration || 0.8,
                ease: [0.25, 0.1, 0.25, 1] // Cubic bezier
            };
        case 'quick':
            return {
                duration: duration || 0.3,
                ease: [0.4, 0, 0.2, 1] // Material UI easing
            };
        case 'default':
        default:
            return {
                duration: duration || 0.5,
                ease: [0.4, 0, 0.2, 1]
            };
    }
};

/**
 * Check if we should enable animations based on device/preferences
 *
 * @param isMobile Whether the device is mobile
 * @param reducedMotion Whether the user prefers reduced motion
 * @param performanceMode Performance setting ('low', 'medium', 'high')
 * @returns Whether animations should be enabled
 */
export const shouldEnableAnimations = (
    isMobile: boolean,
    reducedMotion: boolean,
    performanceMode: 'low' | 'medium' | 'high' = 'medium'
): boolean => {
    // Always disable if user prefers reduced motion
    if (reducedMotion) return false;

    // On low performance + mobile, disable animations
    if (performanceMode === 'low' && isMobile) return false;

    return true;
};

/**
 * Check if an element is in the viewport
 *
 * @param element The element to check
 * @param offset Optional offset to consider element in viewport earlier
 * @returns Whether the element is in viewport
 */
export const isInViewport = (
    element: HTMLElement,
    offset: number = 0
): boolean => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();

    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.bottom >= 0 - offset &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) + offset &&
        rect.right >= 0 - offset
    );
};