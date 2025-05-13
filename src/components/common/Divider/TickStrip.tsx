"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/classNames";

interface TickStripProps {
  /** Number of tick marks across 100% width. Default 21 */
  segments?: number;
  /** Render a numeric label on every N-th tick (0 = none) */
  labelEvery?: number;
  /** Additional classes - tailwind utilities etc. */
  className?: string;
  /** Height of measurement strip */
  height?: number;
  /** Whether to animate on hover */
  animate?: boolean;
  /** Whether to use black background for labels */
  darkLabels?: boolean;
  /** Whether to show coordinate lines */
  showCoordinateLines?: boolean;
  /** Whether to add brutalist glitch effect */
  glitchEffect?: boolean;
}

/**
 * Blueprint measurement ticks with brutalist flavor.
 * Uses semantic tokens:
 *   --divider-stroke      (tick + baseline color)
 *   --text-tertiary       (small label color)
 *   --accent-primary      (highlight color)
 */
export const TickStrip: React.FC<TickStripProps> = ({
  segments = 21,
  labelEvery = 5,
  className = "",
  height = 30,
  animate = true,
  darkLabels = true,
  showCoordinateLines = true,
  glitchEffect = false,
}) => {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        { "hover:scale-y-150 transition-transform": animate },
        className
      )}
      style={{ height: `${height}px` }}
    >
      {/* Baseline */}
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-[2px] bg-divider",
          { "before:absolute before:content-[''] before:top-0 before:left-0 before:w-full before:h-full before:animate-pulse": glitchEffect }
        )}
      />

      {/* Ticks */}
      {Array.from({ length: segments }).map((_, i) => {
        const left = (i / (segments - 1)) * 100;
        const isLabelTick = labelEvery > 0 && i % labelEvery === 0;
        const isMidPoint = i === Math.floor(segments / 2);

        return (
          <div
            key={i}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${left}%`, transform: 'translateX(-50%)' }}
          >
            <div
              className={cn(
                "w-[2px] bg-divider",
                isLabelTick ? "h-6" : "h-3",
                isMidPoint ? "bg-accent-primary" : ""
              )}
            />

            {isLabelTick && (
              <motion.span
                className={cn(
                  "text-xs font-mono mt-1 px-1",
                  darkLabels ? "bg-black/70 text-white" : "text-text-tertiary",
                  isMidPoint ? "text-accent-primary font-bold" : "",
                  glitchEffect && i % 10 === 0 ? "animate-pulse" : ""
                )}
                style={{
                  transform: `rotate(${(Math.random() * 6) - 3}deg)`,
                  clipPath: glitchEffect && i % 15 === 0 ? "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" : "none"
                }}
                whileHover={animate ? { scale: 1.2, y: -2 } : {}}
              >
                {left.toFixed(0)}
              </motion.span>
            )}
          </div>
        );
      })}

      {/* Coordinate lines - visible at specific points */}
      {showCoordinateLines && (
        <>
          <div className="absolute top-2 left-[25%] w-px h-[calc(100%-2px)] border-l border-dashed border-accent-primary/30" />
          <div className="absolute top-2 left-[50%] w-px h-[calc(100%-2px)] border-l border-dashed border-accent-primary/60" />
          <div className="absolute top-2 left-[75%] w-px h-[calc(100%-2px)] border-l border-dashed border-accent-primary/30" />
        </>
      )}

      {/* Brutalist technical annotations */}
      {segments > 10 && (
        <div className="absolute bottom-1 right-2 font-mono text-[10px] text-text-tertiary rotate-[-2deg] opacity-80">
          unit: % width
        </div>
      )}
    </div>
  );
};