// src/app/home/components/headline/HeadlineAnimations.ts
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences';

// Enhanced animation variants with performance optimizations
export const containerVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.025,
            delayChildren: 0.2,
            ease: [0.25, 0.1, 0.25, 1] // Custom cubic bezier for smoother entrance
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] }
    }
};

export const charVariants = {
    initial: {
        opacity: 0,
        y: 60,
        rotateX: 90,
        scale: 0.95
    },
    animate: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.19, 1, 0.22, 1], // Improved easing curve
            opacity: { duration: 0.4 } // Faster opacity for better visual perception
        }
    }
};

export const decorativeVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1] // Custom ease for decoration elements
        }
    }
};

// Performance-optimized variants for reduced motion
export const reducedMotionVariants = {
    container: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.4 }
        },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    },
    char: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.3 }
        }
    },
    decoration: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.3, delay: 0.2 }
        }
    }
};

// Implement our own getTransitionSettings function using the system's
export const getTransitionSettings = (
    type: 'default' | 'fast' | 'slow' | 'elastic' = 'default',
    customDuration?: number
) => {
    // Since the imported function isn't available, we'll just use our fallback implementation
    // Base durations (in seconds)
    const baseDurations = {
        fast: 0.2,
        default: 0.4,
        slow: 0.7,
        elastic: 0.6
    };

    // Base easings - using arrays for cubic bezier
    const baseEasings = {
        fast: [0.4, 0, 0.2, 1], // Material Design standard easing
        default: [0.4, 0, 0.2, 1],
        slow: [0.4, 0, 0.2, 1],
        elastic: [0.68, -0.6, 0.32, 1.6] // Elastic-like easing
    };

    return {
        duration: customDuration || baseDurations[type],
        ease: baseEasings[type]
    };
};

// Helper to get the right variants based on animation preferences from the system
export const getHeadlineVariants = () => {
    const { reducedMotion, getIntensity } = useAnimationPreferences();
    const { duration, ease } = getTransitionSettings('default');
    const intensity = getIntensity();

    if (reducedMotion) {
        return reducedMotionVariants;
    }

    // Create variants with system-consistent timing
    return {
        container: {
            ...containerVariants,
            animate: {
                ...containerVariants.animate,
                transition: {
                    ...containerVariants.animate.transition,
                    staggerChildren: 0.025 * duration,
                    delayChildren: 0.2 * duration
                }
            }
        },
        char: {
            initial: {
                ...charVariants.initial,
                y: 60 * intensity, // Scale movement based on intensity
            },
            animate: {
                ...charVariants.animate,
                transition: {
                    ...charVariants.animate.transition,
                    duration: duration * 0.6,
                    opacity: { duration: duration * 0.4 }
                }
            }
        },
        decoration: {
            initial: {
                ...decorativeVariants.initial,
                x: -20 * intensity, // Scale movement based on intensity
            },
            animate: {
                ...decorativeVariants.animate,
                transition: {
                    ...decorativeVariants.animate.transition,
                    duration: duration * 0.5,
                    delay: 0.3 * duration
                }
            }
        }
    };
};