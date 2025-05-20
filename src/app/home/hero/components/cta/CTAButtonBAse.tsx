// src/app/home/components/cta/CTAButtonBase.tsx
"use client";

import React, { memo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AccentColors } from "../HomeHeroCTA";

export interface CTAButtonBaseProps {
  ctaLink: string;
  as: "a" | "button";
  accentColors: AccentColors;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  children: React.ReactNode;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  prefersReducedMotion?: boolean;
  className?: string;
}

// Animation variants for the container
const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y:
    0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: [0.87, 0, 0.13, 1]
    }
  },
  tap: {
    scale: 0.97,
    transition: {
      duration: 0.1,
      ease: [0.87, 0, 0.13, 1]
    }
  }
};

// Simplified variants for reduced motion
const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

export const CTAButtonBase: React.FC<CTAButtonBaseProps> = ({
  ctaLink,
  as,
  accentColors,
  buttonProps,
  children,
  isHovered,
  onHoverStart,
  onHoverEnd,
  prefersReducedMotion = false,
  className = "",
}) => {
  const preferReducedMotion = useReducedMotion() || prefersReducedMotion;

  // Choose appropriate variants based on motion preference
  const variants = preferReducedMotion ? reducedMotionVariants : containerVariants;

  // Common button styling
  const buttonStyles = {
    backgroundColor: "transparent",
    border: `1px solid ${accentColors.primary}`,
    color: "var(--color-text-on-accent)",
    clipPath: "polygon(0 4%, 96% 0, 100% 94%, 4% 100%)", // Angled edges to match your design
    maskImage: "-webkit-radial-gradient(#000, #fff)", // For Safari
    overflow: "hidden",
    position: "relative",
    textTransform: "uppercase",
    fontWeight: 600,
    letterSpacing: "0.05em",
  };

  // Common button classes
  const buttonClasses = `relative py-4 px-6 font-bold text-lg overflow-hidden ${className}`;

  return (
    <motion.div
      className="relative z-10"
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {as === "button" ? (
        <button
          type="button"
          onClick={() => (window.location.href = ctaLink)}
          className={buttonClasses}
          style={buttonStyles}
          aria-label={typeof buttonProps?.children === 'string' ? buttonProps?.children : undefined}
          {...buttonProps}
        >
          {children}
        </button>
      ) : (
        <Link
          href={ctaLink}
          className={buttonClasses}
          style={buttonStyles}
          aria-label={ctaLink ? `Navigate to ${ctaLink}` : undefined}
        >
          {children}
        </Link>
      )}
    </motion.div>
  );
};

export default memo(CTAButtonBase);