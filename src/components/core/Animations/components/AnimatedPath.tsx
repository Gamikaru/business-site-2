// src/components/common/Animations/components/AnimatedPath.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAnimationPreferences } from "../hooks/useAnimationPreferences";

interface AnimatedPathProps {
  d: string;
  className?: string;
  delay?: number;
  duration?: number;
  strokeWidth?: number;
  stroke?: string;
  fill?: string;
  repeat?: number | boolean;
  animate?: boolean;
}

const AnimatedPath: React.FC<AnimatedPathProps> = ({
  d,
  className = "",
  delay = 0,
  duration = 2,
  strokeWidth = 2,
  stroke = "currentColor",
  fill = "none",
  repeat = false,
  animate = true,
}) => {
  const { shouldAnimate, getTransitionSettings } = useAnimationPreferences();

  // Get duration adjusted for preferences
  const { duration: calculatedDuration } = getTransitionSettings(
    "default",
    duration
  );

  // If animations are disabled, render static path
  if (!shouldAnimate() || !animate) {
    return (
      <path
        d={d}
        className={className}
        strokeWidth={strokeWidth}
        stroke={stroke}
        fill={fill}
      />
    );
  }

  // Calculate repeat values
  const repeatType =
    typeof repeat === "boolean" ? (repeat ? "loop" : undefined) : undefined;
  const repeatCount = typeof repeat === "number" ? repeat : undefined;

  return (
    <motion.path
      d={d}
      className={className}
      strokeWidth={strokeWidth}
      stroke={stroke}
      fill={fill}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        pathLength: {
          delay,
          duration: calculatedDuration,
          ease: "easeInOut",
          repeat: repeatCount,
          repeatType,
        },
        opacity: {
          delay,
          duration: calculatedDuration * 0.4,
        },
      }}
    />
  );
};

export default AnimatedPath;
