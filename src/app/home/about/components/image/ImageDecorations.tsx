"use client";

import React from "react";
import { motion } from "framer-motion";

interface ImageDecorationsProps {
  isHovered: boolean;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
}

const ImageDecorations: React.FC<ImageDecorationsProps> = ({
  isHovered,
  accentColors,
}) => {
  return (
    <>
      {/* Geometric underlay elements */}

      {/* Top-right triangle */}
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 -z-10"
        initial={{ rotate: 0, scale: 0.9 }}
        animate={{
          rotate: isHovered ? 15 : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon
            points="50,0 100,100 0,100"
            fill="none"
            stroke={`${accentColors.secondary}40`}
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>
      </motion.div>

      {/* Bottom-left square */}
      <motion.div
        className="absolute -bottom-8 -left-8 w-24 h-24 -z-10"
        initial={{ rotate: 0 }}
        animate={{ rotate: isHovered ? -10 : 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            fill="none"
            stroke={`${accentColors.primary}40`}
            strokeWidth="1"
          />
          <rect
            x="25"
            y="25"
            width="50"
            height="50"
            fill="none"
            stroke={`${accentColors.primary}20`}
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      {/* Left-side circle */}
      <motion.div
        className="absolute -left-12 top-1/3 w-16 h-16 -z-10"
        animate={{
          x: isHovered ? 5 : 0,
          opacity: isHovered ? 0.8 : 0.5
        }}
        transition={{ duration: 0.4 }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={`${accentColors.tertiary}30`}
            strokeWidth="1"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke={`${accentColors.tertiary}20`}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </svg>
      </motion.div>

      {/* Right-side dots pattern */}
      <motion.div
        className="absolute -right-10 top-1/2 -translate-y-1/2 w-10 h-20 -z-10"
        animate={{
          x: isHovered ? -5 : 0,
          opacity: isHovered ? 0.8 : 0.5
        }}
        transition={{ duration: 0.4 }}
      >
        <svg viewBox="0 0 50 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0, 1, 2, 3, 4].map((row) => (
            [0, 1, 2].map((col) => (
              <circle
                key={`dot-${row}-${col}`}
                cx={10 + col * 15}
                cy={10 + row * 20}
                r="2"
                fill={`${accentColors.brand}40`}
              />
            ))
          ))}
        </svg>
      </motion.div>

      {/* Canvas for hidden image processing */}
      <canvas
        className="absolute top-0 left-0 opacity-0 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
};

export default ImageDecorations;
