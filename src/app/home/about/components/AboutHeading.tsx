"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { useAnimationPreferences } from "@/components/core/Animations";

interface AboutHeadingProps {
  heading: string;
  isRevealed: boolean;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
}

const AboutHeading: React.FC<AboutHeadingProps> = ({
  heading,
  isRevealed,
  accentColors,
}) => {
  const { reducedMotion, shouldAnimate } = useAnimationPreferences();

  // Split heading into characters for animated reveal
  const characters = heading.split("");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  // Simplified variants for reduced motion
  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  // Determine if we should animate or just show the content
  const shouldPerformAnimation = isRevealed && shouldAnimate();

  // Use appropriate variants based on reduced motion preference
  const variants = reducedMotion ? reducedMotionVariants : containerVariants;
  const characterVariants = reducedMotion
    ? reducedMotionVariants
    : charVariants;

  // Style for the underline effect
  const underlineStyle = {
    background: `linear-gradient(90deg,
                ${accentColors.secondary} 0%,
                ${accentColors.brand} 50%,
                ${accentColors.primary} 100%)`,
    height: "4px",
    width: "60px",
    borderRadius: "2px",
    marginTop: "16px",
  };

  return (
    <div className="relative">
      {/* Technical indicator */}
      <motion.div
        className="text-xs font-mono tracking-tight text-text-tertiary mb-2 flex items-center"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 0.7, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span className="mr-2">01</span>
        <span className="w-6 h-px bg-border-primary mr-2"></span>
        <span>ABOUT</span>
      </motion.div>

      <motion.div
        initial={shouldPerformAnimation ? "hidden" : "visible"}
        animate="visible"
        variants={variants}
        className="relative"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold flex flex-wrap">
          {!reducedMotion && shouldPerformAnimation ? (
            characters.map((char, index) => (
              <motion.span
                key={index}
                variants={characterVariants}
                className="inline-block"
                style={{
                  transformOrigin: "bottom",
                  whiteSpace: char === " " ? "pre" : "normal",
                }}
              >
                {char}
              </motion.span>
            ))
          ) : (
            <span>{heading}</span>
          )}
        </h2>

        <motion.div
          style={underlineStyle}
          initial={
            shouldPerformAnimation
              ? { width: 0, opacity: 0 }
              : { width: "60px", opacity: 1 }
          }
          animate={{ width: "60px", opacity: 1 }}
          transition={{
            delay: 0.4,
            duration: 0.6,
            ease: [0.19, 1, 0.22, 1],
          }}
        />

        {/* Decorative element */}
        <motion.div
          className="absolute -right-6 -bottom-6 w-12 h-12 pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="24"
              cy="24"
              r="12"
              stroke={accentColors.secondary}
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx="24"
              cy="24"
              r="24"
              stroke={accentColors.primary}
              strokeWidth="1"
              strokeOpacity="0.3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default memo(AboutHeading);
