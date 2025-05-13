// src/components/common/Animations/utils/deviceAnimations.ts
import { useDevice } from '../../../../context/DeviceContext';
import { useAnimationPreferences } from '../hooks/useAnimationPreferences';
import { Variants } from 'framer-motion';

/**
 * Get device-appropriate animation variants
 *
 * @param desktopVariants Variants for desktop devices
 * @param mobileVariants Variants for mobile devices
 * @returns The appropriate variants for the current device
 */
export const useDeviceVariants = (
    desktopVariants: Variants,
    mobileVariants?: Variants
): Variants => {
    const { isMobile } = useDevice();

    if (isMobile && mobileVariants) {
        return mobileVariants;
    }

    return desktopVariants;
};

/**
 * Calculate device-appropriate animation settings
 *
 * @param property Animation property like distance or duration
 * @param options Customization options
 * @returns An adjusted value based on device type
 */
export const useDeviceAnimation = (
    property: 'distance' | 'duration' | 'delay' | 'stagger',
    options: {
        desktopValue: number;
        mobileValue?: number;
        tabletValue?: number;
        scaleWithIntensity?: boolean;
    }
): number => {
    const { isMobile, isTablet } = useDevice();
    const { getIntensity, reducedMotion } = useAnimationPreferences();

    const {
        desktopValue,
        mobileValue = desktopValue * 0.6,
        tabletValue = desktopValue * 0.8,
        scaleWithIntensity = true
    } = options;

    // Start with the appropriate base value for the device
    let value = desktopValue;
    if (isMobile) value = mobileValue;
    else if (isTablet) value = tabletValue;

    // Apply intensity scaling if needed
    if (scaleWithIntensity) {
        value *= getIntensity(1);
    }

    // Handle reduced motion
    if (reducedMotion) {
        switch (property) {
            case 'distance':
                return Math.min(value, 10); // Minimal distance for reduced motion
            case 'duration':
            case 'delay':
                return Math.min(value, 0.2); // Very quick for reduced motion
            case 'stagger':
                return Math.min(value, 0.05); // Minimal stagger for reduced motion
            default:
                return value;
        }
    }

    return value;
};

/**
 * Determine if an animation effect should be enabled based on device
 *
 * @param effect The animation effect to check
 * @returns Whether the effect should be enabled
 */
export const useShouldEnableEffect = (
    effect: 'parallax' | 'blur' | 'transform3d' | 'stagger' | 'path' | 'complex'
): boolean => {
    const { isMobile, isTablet } = useDevice();
    const { performance, reducedMotion, enabled } = useAnimationPreferences();

    // General checks
    if (!enabled || reducedMotion) return false;

    // Effect-specific checks
    switch (effect) {
        case 'parallax':
            // Disable parallax on mobile and low performance devices
            return !(isMobile || performance === 'low');

        case 'blur':
            // Blur effects can be heavy, especially on mobile
            return !(isMobile || (isTablet && performance === 'low'));

        case 'transform3d':
            // 3D transforms can be heavy on some devices
            return !(isMobile && performance === 'low');

        case 'stagger':
            // Stagger is generally fine, but might want to disable on very low performance
            return !(performance === 'low' && isMobile);

        case 'path':
            // SVG path animations can be heavy
            return !(isMobile && performance === 'low');

        case 'complex':
            // Complex animations with many moving parts
            return performance === 'high' || (!isMobile && performance !== 'low');

        default:
            return true;
    }
};