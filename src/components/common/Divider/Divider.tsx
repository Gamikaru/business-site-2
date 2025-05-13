"use client";

import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/utils/classNames";

export type DividerType = "plane" | "wave" | "tick" | "glitch" | "steps" | "stripes";

interface DividerProps {
  type?: DividerType;
  className?: string;
  height?: number;
  invert?: boolean;
  color?: string;
  animate?: boolean;
  bgTop?: string;
  bgBottom?: string;
  contrast?: "high" | "medium" | "low";
  noiseTexture?: boolean;
}

const Divider: React.FC<DividerProps> = ({
  type = "plane",
  className = "",
  height = 96,
  invert = false,
  color,
  animate = true,
  bgBottom,
  contrast = "medium",
  noiseTexture = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;
  const dividerRef = useRef<HTMLDivElement>(null);

  // Motion values for parallax and hover effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const offsetX = useTransform(mouseX, [-100, 100], [-5, 5]);
  const offsetY = useTransform(mouseY, [-100, 100], [-5, 5]);

  // For jittery/glitchy animations
  useEffect(() => {
    if (!shouldAnimate || type !== "glitch" || !dividerRef.current) return;

    let animationFrame: number;
    let lastTime = 0;
    const glitchInterval = 3000; // ms between glitches
    const glitchDuration = 500; // ms glitch lasts

    const applyGlitch = (timestamp: number) => {
      if (!dividerRef.current) return;

      const elapsed = timestamp - lastTime;

      if (elapsed > glitchInterval) {
        // Start glitch
        dividerRef.current.style.setProperty('--glitch-offset', `${Math.random() * 10 - 5}px`);
        lastTime = timestamp;

        // End glitch after duration
        setTimeout(() => {
          if (dividerRef.current) {
            dividerRef.current.style.setProperty('--glitch-offset', '0px');
          }
        }, glitchDuration);
      }

      animationFrame = requestAnimationFrame(applyGlitch);
    };

    animationFrame = requestAnimationFrame(applyGlitch);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [shouldAnimate, type]);

  // Handle mouse move for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!shouldAnimate || !dividerRef.current) return;

    const rect = dividerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  // Get contrast classes
  const getContrastClass = () => {
    switch (contrast) {
      case "high": return "opacity-100";
      case "medium": return "opacity-80";
      case "low": return "opacity-60";
      default: return "opacity-80";
    }
  };

  // Choose the appropriate divider based on type
  const renderDivider = () => {
    switch (type) {
      case "plane":
        // Brutalist angled plane with more dramatic angle and exposure lines
        return (
          <div
            ref={dividerRef}
            className={cn(
              "relative w-full transition-colors overflow-hidden",
              className
            )}
            style={{
              height: `${height}px`,
              clipPath: invert
                ? "polygon(0 0, 100% 0, 100% 85%, 0 100%)" // Invert with more dramatic angle
                : "polygon(0 0, 100% 15%, 100% 100%, 0 100%)", // More dramatic angle
              backgroundColor: color || "var(--color-bg-secondary)"
            }}
            aria-hidden="true"
            onMouseMove={handleMouseMove}
          >
            {/* Background color */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: bgBottom ? bgBottom : "var(--color-bg-secondary)",
                x: shouldAnimate ? offsetX : 0,
                y: shouldAnimate ? offsetY : 0,
              }}
            />

            {/* Brutalist grid lines */}
            <div className={cn("absolute inset-0 pointer-events-none", getContrastClass())}>
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Primary diagonal */}
                <line
                  x1="0"
                  y1={invert ? height : "0"}
                  x2="100%"
                  y2={invert ? "0" : height}
                  stroke="var(--color-accent-primary)"
                  strokeWidth="1.5"
                  strokeDasharray="5,8"
                  strokeOpacity="0.6"
                />

                {/* Background grid lines */}
                <pattern id="brutalistGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="var(--color-accent-oceanic)" strokeWidth="0.5" strokeOpacity="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#brutalistGrid)" fillOpacity="0.1" />

                {/* Highlight points at edges */}
                <circle cx="0" cy={invert ? height : "0"} r="4" fill="var(--color-accent-primary)" fillOpacity="0.7" />
                <circle cx="100%" cy={invert ? "0" : height} r="4" fill="var(--color-accent-contrast)" fillOpacity="0.7" />
              </svg>
            </div>

            {/* Noise texture overlay */}
            {noiseTexture && (
              <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
              </div>
            )}

            {/* Brutalist code annotations */}
            <div className="absolute top-1/2 left-6 transform -translate-y-1/2 font-mono text-xs text-white bg-accent-primary px-2 py-1 rotate-90 opacity-90">
              {invert ? "SECTION.END" : "SECTION.START"}
            </div>
          </div>
        );

      case "wave":
        // Brutalist wave with more angular, polygonal look
        return (
          <div
            ref={dividerRef}
            className={cn("relative w-full overflow-hidden", className)}
            style={{ height: `${height}px` }}
            aria-hidden="true"
            onMouseMove={handleMouseMove}
          >
            <svg
              className="absolute bottom-0 w-full"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: `${height}px` }}
            >
              {/* Brutalist broken-line wave */}
              <motion.path
                d="M0,100 L0,50 L100,60 L200,30 L300,70 L400,40 L500,60 L600,20 L700,50 L800,30 L900,60 L1000,40 L1000,100 Z"
                fill={color || "var(--wave-primary)"}
                initial={shouldAnimate ? { d: "M0,100 L0,50 L100,60 L200,30 L300,70 L400,40 L500,60 L600,20 L700,50 L800,30 L900,60 L1000,40 L1000,100 Z" } : {}}
                animate={shouldAnimate ? {
                  d: "M0,100 L0,55 L100,50 L200,40 L300,60 L400,30 L500,70 L600,30 L700,60 L800,40 L900,50 L1000,45 L1000,100 Z"
                } : {}}
                transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                style={{
                  x: shouldAnimate ? offsetX : 0,
                  y: shouldAnimate ? offsetY : 0,
                }}
              />

              {/* Highlight lines */}
              <motion.path
                d="M0,100 L0,55 L100,60 L200,30 L300,70 L400,40 L500,60 L600,20 L700,50 L800,30 L900,60 L1000,40 L1000,100 Z"
                fill="none"
                stroke="var(--color-accent-oceanic)"
                strokeWidth="1.5"
                strokeOpacity="0.7"
                initial={shouldAnimate ? { d: "M0,100 L0,55 L100,60 L200,30 L300,70 L400,40 L500,60 L600,20 L700,50 L800,30 L900,60 L1000,40 L1000,100 Z" } : {}}
                animate={shouldAnimate ? {
                  d: "M0,100 L0,60 L100,50 L200,40 L300,60 L400,30 L500,70 L600,30 L700,60 L800,40 L900,50 L1000,45 L1000,100 Z"
                } : {}}
                transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                style={{
                  x: shouldAnimate ? offsetX : 0,
                  y: shouldAnimate ? offsetY : 0,
                }}
              />

              {/* Points at key vertices */}
              {[100, 300, 500, 700, 900].map((x, i) => (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={i % 2 === 0 ? 50 : 60}
                  r="4"
                  fill="var(--color-accent-primary)"
                  initial={shouldAnimate ? { cy: i % 2 === 0 ? 50 : 60 } : {}}
                  animate={shouldAnimate ? { cy: i % 2 === 0 ? 60 : 50 } : {}}
                  transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                />
              ))}
            </svg>

            {/* Background color */}
            <div className="absolute inset-0 -z-10"
                style={{
                  background: bgBottom ? bgBottom : "var(--color-bg-tertiary)",
                }}
            />

            {/* Coordinate markers - brutalist touch */}
            <div className="absolute left-6 bottom-6 bg-black/70 text-white font-mono text-xs px-2 py-1">
              x: 0, y: 0
            </div>
            <div className="absolute right-6 bottom-6 bg-black/70 text-white font-mono text-xs px-2 py-1">
              x: 100%, y: 0
            </div>
          </div>
        );

      case "glitch":
        // New glitch divider - digital, noisy, distorted
        return (
          <div
            ref={dividerRef}
            className={cn(
              "relative w-full overflow-hidden transition-all",
              "before:content-[''] before:absolute before:inset-0 before:bg-[length:4px_4px] before:opacity-20 before:bg-noise",
              className
            )}
            style={{
              height: `${height}px`,
              backgroundColor: color || "var(--color-bg-secondary)",
              "--glitch-offset": "0px"
            } as React.CSSProperties}
            aria-hidden="true"
          >
            {/* Glitch layers */}
            <div className="absolute inset-0 flex flex-col">
              {/* Top glitch line */}
              <div
                className="h-[1px] w-full bg-accent-primary opacity-90 mb-[3px]"
                style={{ transform: 'translateX(var(--glitch-offset))' }}
              />

              {/* Middle distorted area */}
              <div className="flex-grow relative overflow-hidden">
                {/* Horizontal scan lines */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-[1px] bg-white/20"
                    style={{
                      top: `${(i + 1) * 10}%`,
                      transform: i % 2 === 0 ? 'translateX(var(--glitch-offset))' : 'translateX(calc(var(--glitch-offset) * -1))',
                    }}
                  />
                ))}

                {/* Vertical glitches */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-full w-[2px] bg-accent-contrast/30"
                    style={{
                      left: `${(i + 1) * 20}%`,
                      transform: 'translateY(var(--glitch-offset))',
                    }}
                  />
                ))}

                {/* Glitch text */}
                <div
                  className="absolute top-1/2 left-0 w-full text-center font-mono text-xs text-white/70 tracking-widest"
                  style={{ transform: 'translateY(-50%) translateX(var(--glitch-offset))' }}
                >
                  SIGNAL_INTERRUPTED
                </div>
              </div>

              {/* Bottom glitch line */}
              <div
                className="h-[1px] w-full bg-accent-primary opacity-90 mt-[3px]"
                style={{ transform: 'translateX(calc(var(--glitch-offset) * -1))' }}
              />
            </div>

            {/* Background */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: bgBottom ? bgBottom : "var(--color-bg-secondary)",
              }}
            />
          </div>
        );

      case "steps":
        // New stepped/pixelated divider
        return (
          <div
            ref={dividerRef}
            className={cn("relative w-full overflow-hidden", className)}
            style={{ height: `${height}px` }}
            aria-hidden="true"
            onMouseMove={handleMouseMove}
          >
            <svg
              className="absolute bottom-0 w-full"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: `${height}px` }}
            >
              {/* Stepped path */}
              <path
                d="M0,100 L0,80 L100,80 L100,60 L200,60 L200,80 L300,80 L300,40 L400,40 L400,60 L500,60 L500,20 L600,20 L600,40 L700,40 L700,60 L800,60 L800,40 L900,40 L900,60 L1000,60 L1000,100 Z"
                fill={color || "var(--color-bg-secondary)"}
                stroke="var(--color-accent-primary)"
                strokeWidth="2"
                strokeOpacity="0.9"
              />

              {/* Dot markers at corners */}
              {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((x, i) => {
                const y = [80, 80, 60, 80, 40, 60, 20, 40, 60, 40, 60][i];
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="var(--color-accent-oceanic)"
                  />
                );
              })}

              {/* Coordinates on steps */}
              {[0, 200, 400, 600, 800, 1000].map((x, i) => (
                <text
                  key={i}
                  x={x + 10}
                  y={i % 2 === 0 ? 75 : 35}
                  fill="var(--color-accent-contrast)"
                  fontFamily="monospace"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {(x / 10).toFixed(0)}
                </text>
              ))}
            </svg>

            {/* Background */}
            <div className="absolute inset-0 -z-10"
                style={{
                  background: bgBottom ? bgBottom : "var(--color-bg-tertiary)",
                }}
            />
          </div>
        );

      case "stripes":
        // New diagonal striped divider
        return (
          <div
            ref={dividerRef}
            className={cn("relative w-full overflow-hidden", className)}
            style={{ height: `${height}px` }}
            aria-hidden="true"
          >
            {/* Main background */}
            <div className="absolute inset-0"
                style={{
                  background: bgBottom ? bgBottom : "var(--color-bg-secondary)",
                }}
            />

            {/* Stripes pattern */}
            <div className="absolute inset-0">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern
                  id="diagonalStripes"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <rect width="10" height="20" fill="var(--color-accent-primary)" fillOpacity="0.1" />
                  <rect x="10" width="10" height="20" fill="var(--color-accent-oceanic)" fillOpacity="0.1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#diagonalStripes)" />

                {/* Top border line */}
                <line x1="0" y1="0" x2="100%" y2="0" stroke="var(--color-accent-primary)" strokeWidth="2" />

                {/* Bottom border line */}
                <line x1="0" y1="100%" x2="100%" y2="100%" stroke="var(--color-accent-primary)" strokeWidth="2" />

                {/* Accent diagonal line */}
                <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--color-accent-contrast)" strokeWidth="2" strokeDasharray="5,15" />
              </svg>
            </div>

            {/* Brutalist label */}
            <div className="absolute bottom-2 right-2 font-mono text-xs bg-black text-white px-2 py-1 rotate-[-2deg]">
              [ SECTION BREAK ]
            </div>
          </div>
        );

      case "tick":
        // Reimagined tick with brutalist flavor
        return (
          <div
            ref={dividerRef}
            className={cn(
              "relative w-full border-t-2 border-divider overflow-hidden",
              className
            )}
            style={{ height: `${height}px` }}
            aria-hidden="true"
          >
            {/* Upper measurement markers */}
            <div className="absolute top-0 w-full flex justify-between px-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${(i / 11) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className={cn(
                    "w-px bg-divider",
                    i % 3 === 0 ? "h-6" : "h-3"
                  )} />

                  {i % 3 === 0 && (
                    <span
                      className="text-xs text-text-tertiary font-mono mt-1 bg-black/70 px-1 rotate-[-2deg]"
                    >
                      {i * 10}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Brutalist markers at key points */}
            <div className="absolute top-8 left-[25%] font-mono text-xs transform -translate-x-1/2 bg-accent-primary text-white px-2 py-1">
              25%
            </div>

            <div className="absolute top-8 left-[50%] font-mono text-xs transform -translate-x-1/2 bg-accent-oceanic text-white px-2 py-1">
              50%
            </div>

            <div className="absolute top-8 left-[75%] font-mono text-xs transform -translate-x-1/2 bg-accent-primary text-white px-2 py-1">
              75%
            </div>

            {/* Background color */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: bgBottom || "inherit"
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return renderDivider();
};

export { Divider };