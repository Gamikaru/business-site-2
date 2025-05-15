"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/classNames";
import { useAnimationPreferences } from "@/components/core/Animations";

interface ZigzagDividerProps {
  className?: string;
  height?: number;
  color?: string;
  accentColor?: string;
  backgroundColor?: string;
  density?: "low" | "medium" | "high";
}

const ZigzagDivider: React.FC<ZigzagDividerProps> = ({
  className,
  height = 120,
  color,
  accentColor,
  backgroundColor,
  density = "medium",
}) => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: dividerRef,
    offset: ["start end", "end start"],
  });

  const isInView = useInView(dividerRef, {
    once: false,
    margin: "-10% 0px"
  });

  const { shouldAnimate } = useAnimationPreferences();
  const [renderDensity, setRenderDensity] = useState<number>(0);
  const [randomOffsets, setRandomOffsets] = useState<number[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [uniqueId] = useState(`zigzag-${Math.floor(Math.random() * 10000)}`);

  // Use color props or fallback to CSS variables
  const fillColor = color || "var(--color-bg-secondary)";
  const strokeColor = accentColor || "var(--color-accent-contrast)";
  const bgColor = backgroundColor || "var(--color-bg-tertiary)";

  // Dynamic opacity based on scroll
  const pathOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.7, 1, 0.7]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.9, 1]);

  // Set zigzag density based on prop
  useEffect(() => {
    switch (density) {
      case "low":
        setRenderDensity(7);
        break;
      case "high":
        setRenderDensity(24);
        break;
      case "medium":
      default:
        setRenderDensity(12);
        break;
    }

    // Generate random offsets for points
    const offsets = Array.from({ length: 24 }, () => Math.random() * 8 - 4);
    setRandomOffsets(offsets);
  }, [density]);

  // Calculate points based on density
  const segments = renderDensity;
  const segmentWidth = 1200 / segments;

  // Generate zigzag path based on density
  const generateZigzagPath = () => {
    let path = "M0,0 ";

    for (let i = 0; i <= segments; i++) {
      const x = i * segmentWidth;
      const y = i % 2 === 0 ? 0 : 40;
      path += `L${x},${y} `;
    }

    // Close the path
    path += `L1200,0 L1200,80 L0,80 Z`;
    return path;
  };

  // Generate zigzag line path (without fill)
  const generateZigzagLinePath = () => {
    let path = "M0,0 ";

    for (let i = 0; i <= segments; i++) {
      const x = i * segmentWidth;
      const y = i % 2 === 0 ? 0 : 40;
      const offset = randomOffsets[i] || 0;

      // Add slight randomness to some points
      path += `L${x},${y + offset} `;
    }

    return path;
  };

  // Create paths
  const zigzagPath = generateZigzagPath();
  const zigzagLinePath = generateZigzagLinePath();

  // Set up glitch effect
  useEffect(() => {
    if (!shouldAnimate()) return;

    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, [shouldAnimate]);

  // Calculate point positions for measurement markers
  const measurementPoints = [];
  for (let i = 0; i <= segments; i += 2) {
    const x = i * segmentWidth;
    const y = i % 2 === 0 ? 0 : 40;

    if (i % 2 === 0) {
      measurementPoints.push({ x, y, label: Math.round(i / segments * 100) });
    }
  }

  return (
    <div
      ref={dividerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        height: `${height}px`,
        backgroundColor: bgColor
      }}
      aria-hidden="true"
    >
      {/* Define gradient for data flow */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id={`${uniqueId}-dataGradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--color-accent-contrast)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
          </linearGradient>

          <filter id={`${uniqueId}-glitch`}>
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="original"
            />
            <feOffset dx="-3" dy="0" result="offsetRed" />
            <feColorMatrix
              in="offsetRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />
            <feOffset dx="3" dy="0" result="offsetBlue" />
            <feColorMatrix
              in="offsetBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />
            <feOffset dx="0" dy="3" result="offsetGreen" />
            <feColorMatrix
              in="offsetGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />
            <feBlend mode="screen" in="red" in2="blue" result="blend1" />
            <feBlend mode="screen" in="blend1" in2="green" result="blend" />
          </filter>
        </defs>
      </svg>

      {/* Main zigzag shape */}
      <motion.svg
        className="absolute w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: backgroundOpacity }}
      >
        <motion.path
          d={zigzagPath}
          fill={fillColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </motion.svg>

      {/* Technical grid overlay */}
      <div className="absolute inset-0 bg-dots opacity-10 pointer-events-none" />

      {/* Animated path traces */}
      <svg
        className="absolute top-0 left-0 w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 40"
      >
        {/* Base zigzag line */}
        <motion.path
          d={zigzagLinePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeDasharray="2200"
          style={{ opacity: pathOpacity }}
          initial={{ strokeDashoffset: 2200 }}
          animate={{
            strokeDashoffset: isInView ? 0 : 2200,
            filter: glitchActive ? `url(#${uniqueId}-glitch)` : 'none'
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            filter: { duration: 0.2 }
          }}
        />

        {/* Secondary animated path - data flow carrier */}
        <motion.path
          d={zigzagLinePath}
          fill="none"
          stroke={`url(#${uniqueId}-dataGradient)`}
          strokeWidth="3"
          strokeDasharray="40,60"
          initial={{ strokeDashoffset: 0, opacity: 0 }}
          animate={{
            strokeDashoffset: isInView ? -1000 : 0,
            opacity: isInView ? 0.7 : 0,
          }}
          transition={{
            strokeDashoffset: {
              duration: 10,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            },
            opacity: { duration: 1 }
          }}
        />

        {/* Measurement points and labels */}
        {measurementPoints.map((point, i) => (
          <motion.g key={`point-${i}`}>
            {/* Point circle */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={strokeColor}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isInView ? 1 : 0,
                scale: isInView ? [1, 1.2, 1] : 0,
                y: isInView ? [point.y, point.y - 2, point.y] : point.y
              }}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.1,
                y: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: i * 0.2
                }
              }}
            />

            {/* Vertical measurement line */}
            <motion.line
              x1={point.x}
              y1={point.y + 5}
              x2={point.x}
              y2={point.y + 15}
              stroke={strokeColor}
              strokeWidth="1"
              strokeOpacity="0.6"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: isInView ? 0.6 : 0, scaleY: isInView ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
              style={{ transformOrigin: `${point.x}px ${point.y + 5}px` }}
            />

            {/* Point label */}
            <motion.text
              x={point.x}
              y={point.y + 25}
              fontSize="10"
              fontFamily="monospace"
              fill={strokeColor}
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 0.8 : 0 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
            >
              {point.label}
            </motion.text>
          </motion.g>
        ))}

        {/* Data particles traveling along path */}
        {shouldAnimate() && isInView && [...Array(6)].map((_, i) => (
          <motion.circle
            key={`particle-${i}`}
            r="3"
            fill="var(--color-accent-primary)"
            opacity="0.8"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              offsetDistance: ["0%", "100%"],
            }}
            style={{
              offsetPath: `path("${zigzagLinePath}")`,
            }}
            transition={{
              duration: 3 + i * 0.5,
              delay: i * 1.5,
              repeat: Infinity,
              repeatDelay: i * 0.8,
            }}
          />
        ))}
      </svg>

      {/* Technical metadata display */}
      <motion.div
        className="absolute bottom-2 right-4 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
        <span className="text-[8px] font-mono text-accent-primary">SECTION.DIVIDER</span>
        <span className="text-[8px] font-mono text-accent-contrast">{segments}N</span>
      </motion.div>

      {/* Technical metadata - left side */}
      <motion.div
        className="absolute bottom-2 left-4 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <span className="text-[8px] font-mono text-accent-oceanic">
          {glitchActive ? "ERROR" : "STATUS"}
        </span>
        <span className="text-[8px] font-mono text-accent-primary">
          {glitchActive ? "RECALIBRATING..." : "NORMAL"}
        </span>
      </motion.div>
    </div>
  );
};

export default ZigzagDivider;