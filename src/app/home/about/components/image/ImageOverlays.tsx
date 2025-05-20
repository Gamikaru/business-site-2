"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";

interface ImageOverlaysProps {
  isHovered: boolean;
  isLoaded: boolean;
  scanActive: boolean;
  scanComplete: boolean;
  scanProgress: number;
  revealProgress: number;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
  reducedMotion: boolean;
  highlightX: string | MotionValue<string>;
  highlightY: string | MotionValue<string>;
  dimensions: {
    width: number;
    height: number;
    ratio: number;
  };
  pointsOfInterest: Array<{
    x: number;
    y: number;
    label?: string;
  }>;
  colorData: Array<{
    x: number;
    y: number;
    color: string;
  }>;
  activeColorPoint: number | null;
}

const ImageOverlays: React.FC<ImageOverlaysProps> = ({
  isHovered,
  isLoaded,
  accentColors,
  reducedMotion,
  highlightX,
  highlightY,
  dimensions,
}) => {
  return (
    <>
      {/* Image overlay with gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-bg-primary/30 via-transparent to-transparent mix-blend-overlay z-10"
        animate={{
          opacity: isHovered ? 0.2 : 0.4,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Dynamic highlight effect based on mouse position */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-11"
        style={{
          background: `radial-gradient(circle at ${highlightX} ${highlightY},
            ${accentColors.primary}20 0%,
            transparent 70%)`,
          opacity: 0,
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Interactive reference frame */}
      {isLoaded && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        >
          {/* Center crosshair */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="15" cy="15" r="1" fill={accentColors.tertiary} />
              <line
                x1="15"
                y1="0"
                x2="15"
                y2="30"
                stroke={accentColors.tertiary}
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
              <line
                x1="0"
                y1="15"
                x2="30"
                y2="15"
                stroke={accentColors.tertiary}
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
            </svg>
          </div>

          {/* Rule of thirds grid */}
          <div
            className="absolute left-0 w-px h-full bg-border-primary/20"
            style={{ left: "33.33%" }}
          />
          <div
            className="absolute left-0 w-px h-full bg-border-primary/20"
            style={{ left: "66.66%" }}
          />
          <div
            className="absolute top-0 h-px w-full bg-border-primary/20"
            style={{ top: "33.33%" }}
          />
          <div
            className="absolute top-0 h-px w-full bg-border-primary/20"
            style={{ top: "66.66%" }}
          />

          {/* Aspect ratio indicator */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[6px] font-mono text-text-tertiary/80 bg-bg-card/60 backdrop-blur-sm px-1 rounded">
            {dimensions.ratio.toFixed(2)}:1
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ImageOverlays;
