// src/components/common/Animations/variants/containers.ts
import { Variants } from 'framer-motion';

// Stagger children animations
export const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// For elements within a stagger container
export const staggerItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        y: 20,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Grid reveal animation
export const gridContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2,
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Grid item animation
export const gridItemVariants: Variants = {
    hidden: {
        scale: 0.9,
        opacity: 0
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        scale: 0.9,
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Card animations with subtle 3D effect
export const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
        rotateX: 5,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1]
        }
    },
    hover: {
        y: -10,
        scale: 1.03,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1]
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        scale: 0.95,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// For hero sections with multiple elements
export const heroContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.2,
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        transition: {
            when: "afterChildren",
            staggerChildren: 0.1,
            staggerDirection: -1,
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

export const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};