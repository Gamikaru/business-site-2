'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { MousePosition } from './BackgroundTypes'
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences'

// Helper function to throttle function calls
const throttle = (fn: Function, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  };
};

// Returns click position data with optimization
export const useMouseTracker = () => {
  const { reducedMotion } = useAnimationPreferences();

  // Use ref to track previous position to avoid unnecessary state updates
  const prevPositionRef = useRef({ x: 0.5, y: 0.5 });

  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0.5,
    y: 0.5,
    clicked: false
  });

  // Handle clicks with throttling
  const handleClick = useCallback((e: MouseEvent) => {
    // Skip updates if reduced motion is preferred
    if (reducedMotion) return;

    // Get normalized position (0 to 1)
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    // Only update if position changed significantly (by at least 1%)
    if (
      Math.abs(x - prevPositionRef.current.x) > 0.01 ||
      Math.abs(y - prevPositionRef.current.y) > 0.01
    ) {
      prevPositionRef.current = { x, y };

      // Update state with click position
      setMousePosition({
        x,
        y,
        clicked: true
      });

      // Reset clicked state after a short delay
      const timeout = setTimeout(() => {
        setMousePosition(prev => ({
          ...prev,
          clicked: false
        }));
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [reducedMotion]);

  // Throttled click handler to improve performance
  const throttledClickHandler = useCallback(
    throttle(handleClick, 100),
    [handleClick]
  );

  useEffect(() => {
    // Set initial position to center
    setMousePosition({
      x: 0.5,
      y: 0.5,
      clicked: false
    });

    // Skip event listeners if reduced motion is preferred
    if (reducedMotion) return;

    // Add click event listener with passive flag for better performance
    window.addEventListener('click', throttledClickHandler, { passive: true });

    return () => {
      window.removeEventListener('click', throttledClickHandler);
    };
  }, [throttledClickHandler, reducedMotion]);

  return mousePosition;
};