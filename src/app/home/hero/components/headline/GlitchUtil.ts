// src/app/home/components/GlitchUtil.ts
/**
 * Utility for creating and managing optimized glitch effects
 * Integrated with animation management system for better coordination and performance
 */
import { useAnimationPreferences } from '@/components/core/Animations';

// Generate glitch offsets with lower memory impact
export const generateGlitchOffsets = (
    count: number,
    intensity: number = 1,
    reducedMotion: boolean = false
): number[] => {
    // Return empty array for reduced motion users
    if (reducedMotion) {
        return new Array(count).fill(0);
    }

    // Create smaller array for better performance
    const offsets = new Float32Array(count);

    // Fill with random numbers in a more efficient way
    for (let i = 0; i < count; i++) {
        // Use smaller offset values for better performance
        offsets[i] = (Math.random() - 0.5) * 6 * intensity;
    }

    return Array.from(offsets);
};

// Update glitch offsets efficiently without creating a new array
export const updateGlitchOffsets = (
    existingOffsets: number[],
    intensity: number = 1,
    updatePercentage: number = 0.3, // Only update some values for better performance
    reducedMotion: boolean = false
): number[] => {
    // Return existing offsets for reduced motion users (this should be zeros)
    if (reducedMotion) {
        return existingOffsets;
    }

    // Create a copy to avoid mutating the original
    const newOffsets = [...existingOffsets];

    // Only update a percentage of the values for performance
    const updateCount = Math.floor(existingOffsets.length * updatePercentage);
    const startIndex = Math.floor(Math.random() * (existingOffsets.length - updateCount));

    for (let i = 0; i < updateCount; i++) {
        const index = (startIndex + i) % existingOffsets.length;
        newOffsets[index] = (Math.random() - 0.5) * 6 * intensity;
    }

    return newOffsets;
};

// Calculate glitch CSS properties efficiently
export const getGlitchStyles = (
    index: number,
    glitchActive: boolean,
    glitchOffsets: number[],
    reducedMotion: boolean = false
): { transform: string; filter: string; textShadow: string } => {
    if (!glitchActive || reducedMotion) {
        return { transform: '', filter: '', textShadow: '' };
    }

    // Calculate transforms only when needed based on index patterns
    let transform = '';
    if (index % 5 === 0) transform += 'translateY(5px) ';
    if (index % 3 === 0) transform += 'rotate(-3deg) ';
    if (index % 4 === 0) transform += 'rotate(3deg) translateX(3px) ';

    // Apply offset transforms if available
    const xOffset = glitchOffsets[index] || 0;
    const yOffset = glitchOffsets[index + 1] || 0;
    if (xOffset !== 0 || yOffset !== 0) {
        transform += `translate3d(${xOffset}px, ${yOffset}px, 0)`;
    }

    // Add filters and shadows conditionally for better performance
    const filter = index % 6 === 0 ? 'brightness(2)' : '';

    let textShadow = '';
    if (index % 5 === 0) {
        const shadowColor = index % 10 === 0
            ? 'var(--color-accent-secondary)'
            : 'var(--color-accent-primary)';
        textShadow = `0 0 5px ${shadowColor}`;
    }

    return { transform, filter, textShadow };
};

// Optimize glitch animation performance based on device capabilities
export const optimizeGlitchForDevice = (
    performanceMode: 'low' | 'medium' | 'high' = 'medium'
) => {
    // Set parameters based on performance mode from animation system
    return {
        // Reduce update frequency on low-power devices
        updateFrequency: performanceMode === 'low' ? 500 : performanceMode === 'medium' ? 250 : 150,
        // Use fewer effects on low-power devices
        updatePercentage: performanceMode === 'low' ? 0.1 : performanceMode === 'medium' ? 0.2 : 0.3,
        // Reduced array size for low-power devices
        offsetArraySize: performanceMode === 'low' ? 30 : performanceMode === 'medium' ? 60 : 100
    };
};

// Hook to integrate glitch effects with animation system
export const useGlitchEffects = (count: number, intensity: number = 1) => {
    const { shouldAnimate, reducedMotion, performance } = useAnimationPreferences();

    // Get optimized parameters based on device performance
    const { updateFrequency, updatePercentage, offsetArraySize } =
        optimizeGlitchForDevice(performance);

    // Generate initial offsets respecting animation preferences
    const initialOffsets = generateGlitchOffsets(
        Math.min(count, offsetArraySize),
        intensity,
        reducedMotion
    );

    // Helper function for updates that respects preferences
    const updateOffsets = (currentOffsets: number[]): number[] => {
        if (!shouldAnimate() || reducedMotion) {
            return currentOffsets;
        }

        return updateGlitchOffsets(
            currentOffsets,
            intensity,
            updatePercentage,
            reducedMotion
        );
    };

    return {
        initialOffsets,
        updateOffsets,
        getStyles: (index: number, isActive: boolean, offsets: number[]) =>
            getGlitchStyles(index, isActive && shouldAnimate(), offsets, reducedMotion),
        updateFrequency,
        shouldAnimate: shouldAnimate() && !reducedMotion
    };
};