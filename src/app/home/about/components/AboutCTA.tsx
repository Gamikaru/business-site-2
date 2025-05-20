"use client";

import React, { memo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAnimationPreferences } from '@/components/core/Animations';

interface AboutCTAProps {
  ctaText: string;
  ctaLink: string;
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

const AboutCTA: React.FC<AboutCTAProps> = ({
  ctaText,
  ctaLink,
  isRevealed,
  accentColors
}) => {
  const { reducedMotion, shouldAnimate } = useAnimationPreferences();
  const [isHovered, setIsHovered] = useState(false);

  // Button text content
  const staticText = ctaText;
  const hoverText = "VIEW MORE";

  // Animation variants
  const ctaVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
        delay: 0.4,
        duration: 0.6,
      }
    }
  };

  // Simplified variants for reduced motion
  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: 0.2,
      }
    }
  };

  // Determine if we should animate or just show the content
  const shouldPerformAnimation = isRevealed && shouldAnimate();
  const variants = reducedMotion ? reducedMotionVariants : ctaVariants;

  return (
    <motion.div
      initial={shouldPerformAnimation ? "hidden" : "visible"}
      animate="visible"
      variants={variants}
      className="relative z-10"
    >
      <div className="relative inline-block">
        {/* The neo-brutalist button with distinct styling from AboutCard */}
        <Link href={ctaLink} legacyBehavior>
          <a
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="block relative"
          >
            <motion.div
              className="relative inline-flex items-center justify-center h-14 px-8 rounded-full border-2 font-semibold text-sm tracking-widest uppercase cursor-pointer overflow-hidden z-10"
              animate={{
                borderColor: isHovered ? "transparent" : "var(--color-text-primary)",
                transform: isHovered ? "translateY(-2px)" : "translateY(0px)",
                boxShadow: isHovered ? "4px 4px 0px white" : "0px 0px 0px transparent",
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              {/* Gradient border */}
              <motion.div
                className="absolute inset-[-2px] rounded-full -z-10"
                style={{
                  background: `linear-gradient(90deg,
                    ${accentColors.primary},
                    ${accentColors.secondary},
                    ${accentColors.brand})`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />

              {/* Background fill layers */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                {[accentColors.primary, accentColors.secondary, accentColors.tertiary].map((color, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-[100%] -top-[60%] left-1/2 -translate-x-1/2 aspect-square"
                    style={{
                      width: "max(200%, 10rem)",
                      backgroundColor: color,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: isHovered ? 1 : 0 }}
                    transition={{
                      delay: isHovered ? i * 0.12 : 0,
                      duration: 1.3,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                  />
                ))}
              </div>

              {/* Text container with flip animation */}
              <div className="relative h-6 overflow-hidden min-w-[12rem] text-center">
                {/* Static text */}
                <motion.div
                  className="flex justify-center items-center"
                  animate={{
                    opacity: isHovered ? 0 : 1,
                    y: isHovered ? "-100%" : "0%",
                  }}
                  transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                >
                  <span className="text-text-primary">{staticText}</span>
                </motion.div>

                {/* Hover text with arrow */}
                <motion.div
                  className="absolute top-0 left-0 w-full flex justify-center items-center"
                  initial={{ opacity: 0, y: "100%" }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? "0%" : "100%",
                  }}
                  transition={{
                    duration: 0.7,
                    ease: [0.19, 1, 0.22, 1],
                    opacity: { delay: isHovered ? 0.1 : 0 }
                  }}
                >
                  <span className="text-white mr-1">{hoverText}</span>
                  <motion.span
                    className="text-white inline-block"
                    initial={{ x: 0 }}
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          </a>
        </Link>

        {/* Neo-brutalist shadow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-bg-primary opacity-0 -z-20"
          style={{ filter: "blur(2px)" }}
          animate={{
            opacity: isHovered ? 0.7 : 0,
            transform: isHovered ? "translate(4px, 4px)" : "translate(0px, 0px)",
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default memo(AboutCTA);
