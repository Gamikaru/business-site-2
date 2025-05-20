// src/app/home/components/subheadline/BoxVariants.ts
import { Variants } from 'framer-motion';
import { useAnimationPreferences } from '@/components/core/Animations';

// Enhanced base animation variants with improved physics
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.4,
            ease: [0.25, 0.1, 0.25, 1], // Custom cubic easing for smoother motion
            duration: 0.5
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1] // Material-style easing for exit
        }
    }
};

// Optimized box variants with refined spring physics and custom animations per box
export const boxVariants = {
    hidden: (index: number) => ({
        opacity: 0,
        y: -40 + (index * 10), // More subtle initial offset with progression
        x: 30 - (index * 15),  // More subtle x-offset with progression
        scale: 0.95,           // Less dramatic initial scale
        rotateX: 8,            // Subtle rotation for depth
        transformPerspective: 1000, // Add perspective for better 3D effect
    }),
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotateX: 0,
        transition: {
            type: "spring",
            // Improved spring physics for more natural motion
            stiffness: 120 - (index * 10), // Progressive stiffness reduction
            damping: 16 + (index * 2),     // Progressive damping increase
            mass: 0.9 + (index * 0.1),     // Progressive mass increase
            delay: 0.2 + (index * 0.12),   // Progressive delay
            restDelta: 0.001,
            restSpeed: 0.001
        }
    }),
    hover: {
        y: -8,                // More subtle lift on hover
        scale: 1.02,          // More subtle scale on hover
        transition: {
            type: "spring",
            stiffness: 400,     // Snappier response on hover
            damping: 25,        // Controlled dampening
            mass: 0.8,          // Lighter mass for faster response
            duration: 0.3,      // Shorter duration for responsiveness
        }
    },
    // Tap effect for better interaction feedback
    tap: {
        scale: 0.98,          // Slight press-down effect
        y: 2,                 // Small downward movement
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.6,
            duration: 0.2
        }
    },
    // New focused state for keyboard navigation accessibility
    focus: {
        scale: 1.01,          // Subtle scale for focus state
        boxShadow: "0 0 0 2px var(--color-accent-primary)",  // Focus ring
        transition: {
            duration: 0.2
        }
    }
};

// Special variant for the final box with improved animations
export const finalBoxVariants = {
    hidden: {
        opacity: 0,
        y: 15,                // Less dramatic y-offset
        x: 30,                // Less dramatic x-offset
        scale: 0.96,          // Less dramatic scale
        rotateX: 6,           // Subtle rotation
        transformPerspective: 1000, // Add perspective for better 3D effect
    },
    visible: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotateX: 0,
        transition: {
            type: "spring",
            stiffness: 80,       // Softer spring for larger content
            damping: 20,         // More damping for smoother appearance
            mass: 1.2,           // Higher mass for more substantial feel
            delay: 0.6,          // Appears after smaller boxes
            restDelta: 0.001,
            restSpeed: 0.001
        }
    },
    hover: {
        y: -10,               // Slightly larger movement for emphasis
        scale: 1.03,          // Slightly larger scale for emphasis
        transition: {
            type: "spring",
            stiffness: 350,     // Responsive but controlled
            damping: 22,        // Controlled dampening
            mass: 1.0,          // Standard mass
            duration: 0.35,     // Slightly longer for more presence
        }
    },
    tap: {
        scale: 0.99,          // Less dramatic scale change for larger element
        y: 1,                 // Smaller movement for larger element
        transition: {
            type: "spring",
            stiffness: 450,
            damping: 30,
            mass: 0.8,
            duration: 0.25
        }
    },
    focus: {
        scale: 1.02,          // Slightly more noticeable for the primary element
        boxShadow: "0 0 0 3px var(--color-brand-primary)",  // Branded focus ring
        transition: {
            duration: 0.25
        }
    }
};

// Scroll-triggered variants for when boxes appear during scrolling
export const scrollRevealVariants = {
    hidden: (index: number) => ({
        opacity: 0,
        y: 30 + (index * 10),
        scale: 0.95,
        rotateX: 5
    }),
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
            type: "spring",
            stiffness: 100 - (index * 10),
            damping: 18 + (index * 1.5),
            mass: 0.8 + (index * 0.15),
            delay: 0.1 + (index * 0.08),
            restDelta: 0.001,
            restSpeed: 0.001
        }
    })
};

// Simplified variants for reduced motion
export const reducedMotionVariants = {
    container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    },
    box: {
        hidden: { opacity: 0 },
        visible: (index: number) => ({
            opacity: 1,
            transition: { delay: 0.05 * index, duration: 0.3 }
        }),
        hover: { opacity: 0.9 },
        tap: { opacity: 0.8 },
        focus: { boxShadow: "0 0 0 2px var(--color-accent-primary)" }
    }
};

// New mouse-follow effect variants
export const mouseFollowVariants = {
    default: { x: 0, y: 0 },
    follow: (coords: { x: number, y: number }) => ({
        x: coords.x * 5, // Subtle movement
        y: coords.y * 5,
        transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 }
    })
};

// Content reveal variants for text within boxes
export const contentRevealVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
};

/**
 * Hook to get animation variants based on animation system preferences
 *
 * @returns Custom animation variants adjusted for system preferences
 */
export const useBoxAnimationVariants = () => {
    const { reducedMotion, getTransitionSettings, getIntensity } = useAnimationPreferences();

    // Get system-consistent transition settings
    const { duration, ease } = getTransitionSettings('default');
    const intensity = getIntensity();

    if (reducedMotion) {
        return reducedMotionVariants;
    }

    // Apply animation system's settings to box variants
    const createCustomBoxVariants = (index: number) => ({
        hidden: {
            opacity: 0,
            y: (-40 + (index * 10)) * intensity,
            x: (30 - (index * 15)) * intensity,
            scale: 0.95,
            rotateX: 8 * intensity,
            transformPerspective: 1000,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: (120 - (index * 10)) * intensity,
                damping: 16 + (index * 2),
                mass: 0.9 + (index * 0.1),
                delay: (0.2 + (index * 0.12)) * duration,
                restDelta: 0.001,
                restSpeed: 0.001
            }
        },
        hover: {
            y: -8 * intensity,
            scale: 1 + (0.02 * intensity),
            transition: {
                duration: 0.3 * duration,
                ease
            }
        },
        tap: {
            scale: 1 - (0.02 * intensity),
            y: 2 * intensity,
            transition: {
                duration: 0.2 * duration,
                ease
            }
        },
        focus: {
            scale: 1 + (0.01 * intensity),
            boxShadow: "0 0 0 2px var(--color-accent-primary)",
            transition: {
                duration: 0.2 * duration,
                ease
            }
        }
    });

    // Create a custom final box variant with system settings
    const createCustomFinalBoxVariants = () => ({
        hidden: {
            opacity: 0,
            y: 15 * intensity,
            x: 30 * intensity,
            scale: 0.96,
            rotateX: 6 * intensity
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 80 * intensity,
                damping: 20,
                mass: 1.2,
                delay: 0.6 * duration,
                restDelta: 0.001,
                restSpeed: 0.001
            }
        },
        hover: {
            y: -10 * intensity,
            scale: 1 + (0.03 * intensity),
            transition: {
                duration: 0.35 * duration,
                ease
            }
        },
        tap: {
            scale: 1 - (0.01 * intensity),
            y: 1 * intensity,
            transition: {
                duration: 0.25 * duration,
                ease
            }
        },
        focus: {
            scale: 1 + (0.02 * intensity),
            boxShadow: "0 0 0 3px var(--color-brand-primary)",
            transition: {
                duration: 0.25 * duration,
                ease
            }
        }
    });

    return {
        createBoxVariants: createCustomBoxVariants,
        createFinalBoxVariants: createCustomFinalBoxVariants,
        container: containerVariants,
        mouseFollow: mouseFollowVariants,
        contentReveal: contentRevealVariants
    };
};