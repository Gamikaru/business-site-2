// src/components/core/Animations/components/ScrollLinkedAnimation.tsx
"use client";

import React, { ReactNode, useRef, useEffect, useState, useMemo, memo } from "react";
import { motion, useTransform, useMotionValue, MotionProps } from "framer-motion";
import { useAnimationPreferences } from "../hooks/useAnimationPreferences";
import { animationManager } from "../utils/AnimationManager";

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
  id?: string; // Optional ID for tracking
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
  id: providedId,
  ...motionProps
}) => {
  const { shouldAnimate } = useAnimationPreferences();

  // Create a unique ID for this animation
  const uniqueIdRef = useRef<string>(
    providedId || `scroll-linked-${Math.random().toString(36).substring(2, 9)}`
  );

  // Create mutable refs to hold measurements to avoid re-renders
  const elementRef = useRef<HTMLDivElement>(null);
  const measurementsRef = useRef({
    elementTop: 0,
    windowHeight: 0,
    scrollY: 0,
    progress: 0,
  });

  // Create motion values for all properties
  const progressValue = useMotionValue(0);
  const opacityValue = useTransform(progressValue, [0, 1], opacityRange ?? [1, 1]);
  const translateYValue = useTransform(progressValue, [0, 1], translateYRange ?? [0, 0]);
  const scaleValue = useTransform(progressValue, [0, 1], scaleRange ?? [1, 1]);
  const rotateValue = useTransform(progressValue, [0, 1], rotateRange ?? [0, 0]);
  const customValue = useTransform(
    progressValue,
    [0, 1],
    customProperty?.range ?? [0, 0]
  );

  // Take a measurement once on mount and on window resize
  const updateMeasurements = useMemo(() => () => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();

    measurementsRef.current = {
      ...measurementsRef.current,
      elementTop: rect.top + window.scrollY,
      windowHeight: window.innerHeight,
    };
  }, []);

  // Setup measurements
  useEffect(() => {
    updateMeasurements();

    const id = uniqueIdRef.current;

    // Register for resize events
    animationManager.subscribeToResize(id, () => {
      updateMeasurements();
    });

    // Cleanup on unmount
    return () => {
      animationManager.unsubscribeFromResize(id);
    };
  }, [updateMeasurements]);

  // Update scroll-linked animation on scroll
  useEffect(() => {
    if (!shouldAnimate()) return;

    const id = uniqueIdRef.current;

    // Function to update progress based on scroll position
    const updateProgress = (scrollY: number) => {
      if (!elementRef.current) return;

      const { elementTop, windowHeight } = measurementsRef.current;

      // Calculate scroll progress range
      const start = elementTop - windowHeight * scrubRange[0];
      const end = elementTop - windowHeight * scrubRange[1];
      const total = end - start;

      if (total === 0) return; // Avoid division by zero

      // Calculate progress (0 to 1)
      let progress = (scrollY - start) / total;

      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress));

      // Set the progress value for all motion transformations
      progressValue.set(progress);

      // Store current scroll position and progress for debugging
      measurementsRef.current.scrollY = scrollY;
      measurementsRef.current.progress = progress;
    };

    // Subscribe to scroll events
    animationManager.subscribeToScroll(id, updateProgress);

    // Register animation with manager for performance tracking
    animationManager.trackAnimation(id, 'scroll-linked');

    // Cleanup on unmount or when deps change
    return () => {
      animationManager.unsubscribeFromScroll(id);
      animationManager.untrackAnimation(id);
    };
  }, [progressValue, scrubRange, shouldAnimate]);

  // Generate transforms based on provided ranges
  const transforms: Record<string, unknown> = useMemo(() => {
    const result: Record<string, unknown> = {};

    if (opacityRange) {
      result.opacity = opacityValue;
    }
    if (translateYRange) {
      result.y = translateYValue;
    }
    if (scaleRange) {
      result.scale = scaleValue;
    }
    if (rotateRange) {
      result.rotate = rotateValue;
    }
    if (customProperty && customProperty.property && customProperty.range) {
      result[customProperty.property] = customValue;
    }

    return result;
  }, [
    opacityValue,
    translateYValue,
    scaleValue,
    rotateValue,
    customValue,
    opacityRange,
    translateYRange,
    scaleRange,
    rotateRange,
    customProperty
  ]);

  // If animations are disabled, just render children
  if (!shouldAnimate()) {
    return (
      <div ref={elementRef} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={elementRef}
      className={className}
      style={{
        ...transforms,
        willChange: Object.keys(transforms).join(', ') || 'auto',
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(ScrollLinkedAnimation);