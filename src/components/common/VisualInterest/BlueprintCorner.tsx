// components/common/BlueprintCorner.tsx
"use client";

import React from "react";
import { cn } from "@/utils/classNames";

interface BlueprintCornerProps {
  /** width & height in px (square). Default 40 */
  size?: number;
  className?: string;
}

/**
 * Single blueprint L‑shaped corner line.
 * Stroke colour inherits from text currentColor,
 * so set `text-divider-stroke` on parent if needed.
 */
export const BlueprintCorner: React.FC<BlueprintCornerProps> = ({
  size = 40,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    className={cn("text-divider-stroke/50", className)}
    aria-hidden
  >
    <path
      d={`M0 0 H${size} V${size}`}
      stroke="currentColor"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);
