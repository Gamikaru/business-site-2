// src/app/home/components/MouseTracker.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { animationManager } from '@/components/core/Animations/utils/AnimationManager';
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences';

// Mouse state interface
export interface MouseState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isMoving: boolean;
  lastUpdate: number;
}

// Custom hook for efficient mouse tracking with velocity calculation
export const useMouseTracker = (throttleMs: number = 16) => {
  // Get animation preferences from the system
  const { shouldAnimate, performance } = useAnimationPreferences();

  // Adjust throttle based on performance level
  const actualThrottleMs = performance === 'low' ? 60 :
                           performance === 'medium' ? 30 :
                           throttleMs;

  // Unique ID for animation tracking
  const trackerId = useRef(`mouse-tracker-${Math.random().toString(36).substring(2, 9)}`);

  // Initialize with center position
  const [mouseState, setMouseState] = useState<MouseState>({
    x: 0.5,
    y: 0.5,
    velocityX: 0,
    velocityY: 0,
    isMoving: false,
    lastUpdate: Date.now()
  });

  const prevPositionRef = useRef({
    x: 0.5,
    y: 0.5,
    time: Date.now()
  });

  // Handle mouse movement through the animation manager
  useEffect(() => {
    if (!shouldAnimate()) {
      // Skip tracking for users who prefer reduced motion
      return;
    }

    // Function to update mouse position
    const updateMousePosition = (scrollY: number) => {
      // scrollY parameter is unused but required by animation manager
      // This is because we're reusing the scroll handler type

      // Get current mouse position from event
      const currentX = mouseState.x;
      const currentY = mouseState.y;
      const now = Date.now();

      const prevPosition = prevPositionRef.current;
      const timeDiff = Math.max(1, now - prevPosition.time);

      // Calculate velocity
      const velocityX = (currentX - prevPosition.x) * 1000 / timeDiff;
      const velocityY = (currentY - prevPosition.y) * 1000 / timeDiff;

      // Update state
      setMouseState({
        x: currentX,
        y: currentY,
        velocityX,
        velocityY,
        isMoving: true,
        lastUpdate: now
      });

      // Update reference
      prevPositionRef.current = {
        x: currentX,
        y: currentY,
        time: now
      };
    };

    // Set up a raw handler for mouse events
    const rawMouseHandler = (e: MouseEvent) => {
      if (!shouldAnimate()) return;

      const currentX = e.clientX / window.innerWidth;
      const currentY = e.clientY / window.innerHeight;

      // Update state directly for immediate use
      setMouseState(prev => ({
        ...prev,
        x: currentX,
        y: currentY
      }));
    };

    // Register with animation manager for coordinated updates
    animationManager.subscribeToScroll(trackerId.current, updateMousePosition);
    animationManager.trackAnimation(trackerId.current, 'mouse-tracking');

    // Also add a direct event listener with appropriate throttling
    window.addEventListener('mousemove', rawMouseHandler, { passive: true });

    return () => {
      animationManager.unsubscribeFromScroll(trackerId.current);
      animationManager.untrackAnimation(trackerId.current);
      window.removeEventListener('mousemove', rawMouseHandler);
    };
  }, [shouldAnimate, actualThrottleMs, mouseState.x, mouseState.y]);

  // Reset movement flag after brief period of inactivity
  useEffect(() => {
    if (mouseState.isMoving) {
      const inactivityTimer = setTimeout(() => {
        if (Date.now() - mouseState.lastUpdate > 100) {
          setMouseState(prev => ({ ...prev, isMoving: false }));
        }
      }, 100);

      return () => clearTimeout(inactivityTimer);
    }
    return undefined;
  }, [mouseState]);

  return mouseState;
};

export default useMouseTracker;