"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CTATextEffectProps {
  initialText: string;
  hoverText: string;
  isHovered: boolean;
}

export const letterVariants = {
  initial: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.1,
    }
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: -20 + (i * 2),
    rotateX: 90,
    scale: 1.2,
    filter: "blur(4px)",
    transition: {
      duration: 0.1,
      delay: i * 0.04,
    }
  }),
  glitch: (i: number) => ({
    opacity: [0.5, 1, 0.5],
    y: [0, -5, 5, -3, 0],
    x: [0, 3, -3, 2, 0],
    rotateZ: [0, 10, -10, 5, 0],
    filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
    scale: [1, 1.1, 0.9, 1],
    transition: {
      duration: 0.2,
      delay: i * 0.03,
    }
  }),
  enter: (i: number) => ({
    opacity: 0,
    y: 20 - (i * 2),
    rotateX: -90,
    scale: 0.8,
    filter: "blur(4px)",
    transition: {
      duration: 0.1,
    }
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 20,
      delay: i * 0.04,
    }
  })
};

export const CTATextEffect: React.FC<CTATextEffectProps> = ({
  initialText,
  hoverText,
  isHovered
}) => {
  const initialChars = initialText.split("");
  const hoverChars = hoverText.split("");

  return (
    <div className="relative h-6 overflow-hidden perspective-distant">
      <div className="flex relative">
        <AnimatePresence mode="wait">
          {!isHovered ? (
            // Initial text animation
            <div className="flex">
              {initialChars.map((char, i) => (
                <motion.span
                  key={`initial-${i}`}
                  className="inline-block origin-center"
                  custom={i}
                  variants={letterVariants}
                  initial="initial"
                  animate="initial"
                  exit="exit"
                  style={{
                    display: 'inline-block',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          ) : (
            // Hover text animation
            <div className="flex">
              {hoverChars.map((char, i) => (
                <motion.span
                  key={`hover-${i}`}
                  className="inline-block origin-center"
                  custom={i}
                  variants={letterVariants}
                  initial="enter"
                  animate="visible"
                  exit="exit"
                  style={{
                    display: 'inline-block',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CTATextEffect;
