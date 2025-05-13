// src/components/common/Animations/components/ScrollLinkedAnimation.tsx
"use client";

import React, { ReactNode, useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, MotionProps } from "framer-motion";
import { useAnimationPreferences } from "../hooks/useAnimationPreferences";

interface ScrollLinkedAnimationProps extends Omit<MotionProps, "style"> {
  children: ReactNode;
  className?: string;
  scrubRange?: [number, number]; // Range as percentage of viewport height
  opacityRange?: [number, number]; // Range for opacity
  translateYRange?: [number, number]; // Range for Y translation in pixels
  scaleRange?: [number, number]; // Range for scaling
  rotateRange?: [number, number]; // Range for rotation in degrees
  customProperty?: {
    property: string;
    range: [number, number];
  };
}

const ScrollLinkedAnimation: React.FC<ScrollLinkedAnimationProps> = ({
  children,
  className = "",
  scrubRange = [0, 1], // Default is the full viewport height
  opacityRange,
  translateYRange,
  scaleRange,
  rotateRange,
  customProperty,
  ...motionProps
}) => {
  const { shouldAnimate } = useAnimationPreferences();
  const ref = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  // Update measurements
  useEffect(() => {
    if (!ref.current) return;

    const updateMeasurements = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setElementTop(rect.top + window.scrollY);
      setWindowHeight(window.innerHeight);
    };

    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);

    return () => window.removeEventListener("resize", updateMeasurements);
  }, [ref]);

  // Get scroll progress
  const { scrollY } = useScroll();

  // Calculate scroll progress range
  const start = elementTop - windowHeight * scrubRange[0];
  const end = elementTop - windowHeight * scrubRange[1];

  // Create transform values
  const scrollProgress = useTransform(scrollY, [start, end], [0, 1]);

  // Always call hooks, assign values conditionally
  const opacityValue = useTransform(scrollProgress, [0, 1], opacityRange ?? [1, 1]);
  const translateYValue = useTransform(scrollProgress, [0, 1], translateYRange ?? [0, 0]);
  const scaleValue = useTransform(scrollProgress, [0, 1], scaleRange ?? [1, 1]);
  const rotateValue = useTransform(scrollProgress, [0, 1], rotateRange ?? [0, 0]);
  const customValue = useTransform(
    scrollProgress,
    [0, 1],
    customProperty?.range ?? [0, 0]
  );

  // Generate transforms based on provided ranges
  const transforms: Record<string, unknown> = {};

  if (opacityRange) {
    transforms.opacity = opacityValue;
  }
  if (translateYRange) {
    transforms.y = translateYValue;
  }
  if (scaleRange) {
    transforms.scale = scaleValue;
  }
  if (rotateRange) {
    transforms.rotate = rotateValue;
  }
  if (customProperty && customProperty.property && customProperty.range) {
    transforms[customProperty.property] = customValue;
  }

  // If animations are disabled, just render children
  if (!shouldAnimate()) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={transforms}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default ScrollLinkedAnimation;
