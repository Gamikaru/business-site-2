// src/components/common/Animations/variants/page.ts
import { Variants } from 'framer-motion';

// Page transitions
export const pageTransitionVariants: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Fade-up page transition
export const fadeUpPageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        y: 10,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Slide-in page transition
export const slidePageVariants: Variants = {
    initial: {
        opacity: 0,
        x: 50
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        x: -50,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// For transitions that have content fading in after the page loads
export const contentAfterPageLoadVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.3, // Wait for page to load first
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1]
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// For mobile-friendly page transitions
export const mobilePageTransitionVariants: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.4, // Faster on mobile
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2, // Even faster exit on mobile
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// SVG path following animation
export const pathFollowVariants: Variants = {
    hidden: {
        pathLength: 0,
        opacity: 0
    },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: {
                duration: 1.5,
                ease: "easeInOut"
            },
            opacity: {
                duration: 0.6,
                ease: "easeInOut"
            }
        }
    }
};

// SVG drawing animation
export const drawSVGVariants: Variants = {
    hidden: {
        pathLength: 0,
        opacity: 0
    },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: {
                duration: 2,
                ease: "easeInOut"
            },
            opacity: {
                duration: 0.8,
                ease: "easeInOut"
            }
        }
    }
};

// Elastic bounce animation
export const elasticVariants: Variants = {
    hidden: {
        scale: 0,
        opacity: 0
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            damping: 8,
            stiffness: 100,
            duration: 1
        }
    }
};

// Counter animation (for number counters)
export const counterVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

// Rotation animation
export const rotateVariants: Variants = {
    hidden: {
        rotate: -180,
        opacity: 0
    },
    visible: {
        rotate: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 60,
            damping: 12
        }
    }
};

// Flip animation
export const flipVariants: Variants = {
    hidden: {
        rotateY: 180,
        opacity: 0
    },
    visible: {
        rotateY: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

// Tilt animation for hover effects
export const tiltVariants: Variants = {
    initial: {
        rotateX: 0,
        rotateY: 0
    },
    hover: {
        rotateX: 10,
        rotateY: 15,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};