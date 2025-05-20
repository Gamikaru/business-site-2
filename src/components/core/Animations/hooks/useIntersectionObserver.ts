// src/components/core/Animations/hooks/useIntersectionObserver.ts
"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { animationManager } from '../utils/AnimationManager';
import { useAnimationPreferences } from './useAnimationPreferences';

export type IntersectionOptions = {
  /**
   * Margin around the root element
   * Format similar to CSS margin: "10px 20px 30px 40px"
   */
  rootMargin?: string;

  /**
   * Element that is used as the viewport for checking visibility
   * (null = browser viewport)
   */
  root?: HTMLElement | null;

  /**
   * Either a single number or an array of numbers between 0.0 and 1.0
   * Percentage of element visible to trigger callback
   */
  threshold?: number | number[];

  /**
   * If true, callback will only be called once when element enters view
   */
  triggerOnce?: boolean;

  /**
   * If true, will also notify when element leaves the viewport
   */
  observeExit?: boolean;

  /**
   * Element ID for debugging (defaults to a generated ID)
   */
  id?: string;
};

export type IntersectionStatus = {
  /**
   * Whether the element is currently in the viewport
   */
  isIntersecting: boolean;

  /**
   * Percentage of the element that is visible (0 to 1)
   */
  intersectionRatio: number;

  /**
   * Whether the callback has been triggered at least once
   */
  hasTriggered: boolean;

  /**
   * The raw IntersectionObserverEntry from the most recent change
   */
  entry: IntersectionObserverEntry | null;
};

// Type for the hook's return value to handle ref properly
export type IntersectionResult = [
  React.RefObject<HTMLElement | null>,
  IntersectionStatus,
  boolean
];

/**
 * Hook that tracks when an element becomes visible in the viewport
 * using IntersectionObserver shared through AnimationManager
 */
export const useIntersectionObserver = (
  options: IntersectionOptions = {}
): IntersectionResult => {
  const { shouldAnimate } = useAnimationPreferences();

  // Create a unique ID for this hook instance if not provided
  const idRef = useRef<string>(
    options.id || `intersection-${Math.random().toString(36).substring(2, 9)}`
  );

  // Create a ref to attach to the element we want to observe
  const elementRef = useRef<HTMLElement | null>(null);

  // Track the intersection state
  const [status, setStatus] = useState<IntersectionStatus>({
    isIntersecting: false,
    intersectionRatio: 0,
    hasTriggered: false,
    entry: null
  });

  // Track whether animations are enabled
  const animationsEnabled = shouldAnimate();

  // Track if we've already triggered (for triggerOnce option)
  const hasTriggeredRef = useRef(false);

  // Process intersection changes
  const handleIntersection = useCallback((entry: IntersectionObserverEntry) => {
    const isIntersecting = entry.isIntersecting;
    const intersectionRatio = entry.intersectionRatio;

    // Update triggered state
    if (isIntersecting && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
    }

    // If triggerOnce is true and we've already triggered,
    // only update state if observeExit is true and element is exiting
    if (options.triggerOnce && hasTriggeredRef.current) {
      if (options.observeExit && !isIntersecting) {
        setStatus({
          isIntersecting,
          intersectionRatio,
          hasTriggered: hasTriggeredRef.current,
          entry
        });
      }
      return;
    }

    // Otherwise update state normally
    setStatus({
      isIntersecting,
      intersectionRatio,
      hasTriggered: hasTriggeredRef.current,
      entry
    });
  }, [options.triggerOnce, options.observeExit]);

  // Setup and cleanup intersection observer
  useEffect(() => {
    const element = elementRef.current;
    const id = idRef.current;

    if (!element || !animationsEnabled) {
      return;
    }

    // Determine threshold
    let threshold: number[] = [0];
    if (options.threshold !== undefined) {
      threshold = Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold];
    }

    // Subscribe to element visibility
    animationManager.observeElementVisibility(
      id,
      element,
      handleIntersection,
      {
        rootMargin: options.rootMargin,
        threshold,
        root: options.root
      }
    );

    // Cleanup
    return () => {
      animationManager.unobserveElementVisibility(id, element);
    };
  }, [
    animationsEnabled,
    handleIntersection,
    options.rootMargin,
    options.threshold,
    options.root
  ]);

  return [elementRef, status, animationsEnabled];
};

/**
 * Simplified hook for when you only care about whether an element is visible
 * or not, without needing the detailed intersection status.
 */
export const useIsVisible = (
  options: IntersectionOptions = {}
): [React.RefObject<HTMLElement | null>, boolean, boolean] => {
  const [ref, status, animationsEnabled] = useIntersectionObserver(options);
  return [ref, status.isIntersecting, animationsEnabled];
};

/**
 * Hook specifically for reveal-on-scroll animations
 */
export const useRevealEffect = (
  options: IntersectionOptions = {}
): [React.RefObject<HTMLElement | null>, boolean, boolean] => {
  // Default to triggerOnce for reveal effects
  const mergedOptions = {
    triggerOnce: true,
    threshold: 0.1,
    ...options
  };

  const [ref, status, animationsEnabled] = useIntersectionObserver(mergedOptions);

  // Either it's currently intersecting, or it has triggered in the past (for triggerOnce)
  const isRevealed = status.isIntersecting || status.hasTriggered;

  return [ref, isRevealed, animationsEnabled];
};