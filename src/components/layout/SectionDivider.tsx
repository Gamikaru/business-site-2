"use client";

import React from "react";
import { Divider, DividerType } from "@/components/common/Divider";
import { cn } from "@/utils/classNames";

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
}

/**
 * Section divider component for use between major page sections.
 * Wraps the common Divider component with layout-specific defaults.
 */
const SectionDivider: React.FC<SectionDividerProps> = ({
  type = "parallax-wave",
  height = 120,
  invert = false,
  color,
  animate = true,
  bgBottom,
  contrast = "medium",
  noiseTexture = false,
  className,
}) => {
  return (
    <Divider
      type={type}
      height={height}
      invert={invert}
      color={color}
      animate={animate}
      bgBottom={bgBottom}
      contrast={contrast}
      noiseTexture={noiseTexture}
      className={cn(className)}
    />
  );
};

export default SectionDivider;
