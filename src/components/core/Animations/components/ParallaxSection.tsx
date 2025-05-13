// src/components/common/Animations/components/ParallaxSection.tsx
"use client";

import React, { ReactNode, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useParallax } from "../hooks/useParallax";

interface ParallaxSectionProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: ReactNode;
  className?: string;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  speed?: number;
  easing?: [number, number, number, number];
  zIndex?: number;
}

const ParallaxSection = forwardRef<HTMLDivElement, ParallaxSectionProps>(
  (
    {
      children,
      className = "",
      offset = 100,
      direction = "up",
      speed = 1,
      easing = [0.42, 0, 0.58, 1],
      zIndex,
      ...motionProps
    },
    forwardedRef
  ) => {
    const {
      ref,
      transformValue,
      direction: finalDirection,
    } = useParallax({
      offset,
      direction,
      speed,
      easing,
    });

    // Set the ref using both the forwarded ref and the hook ref
    const setRefs = (element: HTMLDivElement) => {
      // Set the ref from useParallax
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;

      // Forward the ref if it exists
      if (forwardedRef) {
        if (typeof forwardedRef === "function") {
          forwardedRef(element);
        } else {
          (
            forwardedRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = element;
        }
      }
    };

    // Use the appropriate transform property based on direction
    const transform =
      finalDirection === "left" || finalDirection === "right"
        ? { x: transformValue }
        : { y: transformValue };

    return (
      <motion.div
        ref={setRefs}
        className={className}
        style={{
          ...transform,
          zIndex,
          willChange: "transform", // Performance optimization
        }}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

ParallaxSection.displayName = "ParallaxSection";

export default ParallaxSection;
