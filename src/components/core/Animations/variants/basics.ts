// src/components/common/Animations/variants/basics.ts
import { Variants } from 'framer-motion';

// Basic fade animations
export const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Slide animations from different directions
export const slideUpVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        y: 20,
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

export const slideDownVariants: Variants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        y: -20,
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

export const slideLeftVariants: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        x: 20,
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

export const slideRightVariants: Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        x: -20,
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Scale animations
export const scaleVariants: Variants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Hover animations for interactive elements
export const hoverScaleVariants: Variants = {
    initial: {
        scale: 1
    },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    tap: {
        scale: 0.98,
        transition: {
            duration: 0.1,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Combined animations (scale + slide)
export const popUpVariants: Variants = {
    hidden: { scale: 0.9, y: 20, opacity: 0 },
    visible: {
        scale: 1,
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1] // Spring-like easing
        }
    },
    exit: {
        scale: 0.9,
        y: 20,
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};