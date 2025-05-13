// src/components/common/Divider/SectionDivider.tsx
"use client";

import React from "react";
import { Divider, DividerType } from "@/components/common/Divider";
import { cn } from "@/utils/classNames";
import { motion, useScroll, useTransform } from "framer-motion";

interface SectionDividerProps {
  type?: DividerType;
  height?: number;
  invert?: boolean;
  color?: string;
  animate?: boolean;
  bgTop?: string;
  bgBottom?: string;
  contrast?: "high" | "medium" | "low";
  noiseTexture?: boolean;
  className?: string;
  withTechMarkers?: boolean; // New prop for enhanced technical look
}

/**
 * Enhanced section divider component for use between major page sections.
 * Now with improved technical styling, animations, and performance.
 */
const SectionDivider: React.FC<SectionDividerProps> = ({
  type = "parallax-wave",
  height = 180, // Increased height for better visibility
  invert = false,
  color,
  animate = true,
  bgBottom,
  contrast = "high", // Default to high contrast
  noiseTexture = true, // Default to having noise texture
  className,
  withTechMarkers = true, // Enable by default
}) => {
  // Scroll-based effects for parallax enhancement
  const { scrollYProgress } = useScroll();
  const markerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Custom technical markup for the enhanced divider
  const TechnicalMarkers = () => {
    if (!withTechMarkers) return null;

    return (
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ opacity: markerOpacity }}
      >
        {/* Measurement markers for technical effect */}
        <div className="absolute top-0 left-0 w-full flex justify-between px-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`marker-${i}`} className="relative">
              <div className="absolute top-0 h-4 border-l border-accent-oceanic/60" />
              <div className="absolute top-4 -translate-x-1/2 text-[10px] text-accent-oceanic/70 font-mono">
                {i * 25}
              </div>
            </div>
          ))}
        </div>

        {/* Technical labels */}
        <div className="absolute top-8 left-8 px-2 py-1 bg-bg-primary/80 border border-accent-oceanic/50 text-xs font-mono text-accent-oceanic/80">
          {invert ? "SECTION.END" : "SECTION.START"}
        </div>

        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-8 h-8">
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent-oceanic/40"></div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={cn("relative", className)}>
      {/* The base divider component */}
      <Divider
        type={type}
        height={height}
        invert={invert}
        color={color}
        animate={animate}
        bgBottom={bgBottom}
        contrast={contrast}
        noiseTexture={noiseTexture}
        className="relative z-10"
      />

      {/* Technical markup overlay */}
      <TechnicalMarkers />

      {/* Enhance wave effect with secondary wave when using parallax-wave */}
      {type === "parallax-wave" && (
        <motion.div
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40"
          aria-hidden="true"
        >
          <svg
            className="absolute top-0 left-0 w-full"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
            style={{
              height: `${height * 0.7}px`,
              transform: `translateY(${height * 0.3}px)`
            }}
          >
            {/* Secondary accent wave */}
            <motion.path
              d="M0,100 C250,30 750,170 1000,100 L1000,0 L0,0 Z"
              fill="var(--color-accent-oceanic)"
              fillOpacity="0.1"
              animate={{
                d: [
                  "M0,100 C250,30 750,170 1000,100 L1000,0 L0,0 Z",
                  "M0,100 C250,170 750,30 1000,100 L1000,0 L0,0 Z",
                  "M0,100 C250,30 750,170 1000,100 L1000,0 L0,0 Z"
                ]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>
      )}

      {/* Add subtle noise texture for depth */}
      {noiseTexture && (
        <div
          className="absolute inset-0 mix-blend-overlay opacity-10 pointer-events-none z-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        ></div>
      )}
    </div>
  );
};

export default SectionDivider;