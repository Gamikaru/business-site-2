// src/components/common/Animations/components/StaggerContainer.tsx
"use client";

import React, { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { useAnimationPreferences } from '../hooks/useAnimationPreferences';

// Add these exports for use in other components
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0,
      staggerDirection: 1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
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
    y: 20,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

interface StaggerContainerProps extends Omit<HTMLMotionProps<"div">, 'variants'> {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  direction?: 'forward' | 'reverse' | 'center';
  duration?: number;
  childVariants?: Variants;
  onAnimationComplete?: () => void;
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.1,
  direction = 'forward',
  duration,
  childVariants,
  onAnimationComplete,
  ...motionProps
}) => {
  const { shouldAnimate, getTransitionSettings, getIntensity } = useAnimationPreferences();

  // Get transition settings
  const { duration: calculatedDuration, ease } = getTransitionSettings(
    'default',
    duration
  );

  // Apply intensity to stagger delay
  const effectiveStaggerDelay = staggerDelay * (1 / getIntensity());

  // If animations are disabled, just render children
  if (!shouldAnimate()) {
    return <div className={className}>{children}</div>;
  }

  // Create container variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: effectiveStaggerDelay,
        delayChildren: delay,
        staggerDirection: direction === 'reverse' ? -1 : 1,
        duration: calculatedDuration,
        ease
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: effectiveStaggerDelay / 2,
        staggerDirection: direction === 'reverse' ? 1 : -1,
        duration: calculatedDuration * 0.7,
        ease
      }
    }
  };

  // Default child variants if not provided
  const defaultChildVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: calculatedDuration,
        ease
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: calculatedDuration * 0.7,
        ease
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onAnimationComplete={onAnimationComplete}
      {...motionProps}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        // Use a generic type for ReactElement to avoid 'any'
        return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
          ...(child.props || {}),
          variants: childVariants || defaultChildVariants
        });
      })}
    </motion.div>
  );
};

export default StaggerContainer;