// src/components/common/Animations/variants/text.ts
import { Variants } from 'framer-motion';

// Text reveal animation for headings
export const textRevealVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20
    },
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
        y: 10,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Character staggering for text
export const charStaggerVariants: Variants = {
    hidden: {
        opacity: 1
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0.2
        }
    },
    exit: {
        opacity: 1,
        transition: {
            staggerChildren: 0.02,
            staggerDirection: -1
        }
    }
};

// Individual character animation
export const charVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        y: 10,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Word staggering for text
export const wordStaggerVariants: Variants = {
    hidden: {
        opacity: 1
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1
        }
    },
    exit: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            staggerDirection: -1
        }
    }
};

// Individual word animation
export const wordVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        y: 10,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Line reveal for paragraphs
export const lineRevealVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1]
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

// Typing effect variables
export const cursorVariants: Variants = {
    blinking: {
        opacity: [0, 1, 0],
        transition: {
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0,
            ease: "linear",
            times: [0, 0.5, 1]
        }
    }
};