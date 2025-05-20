import { useState, useEffect, useCallback } from 'react';

// Simple throttle function
const throttle = (callback: Function, delay: number) => {
  let lastCall = 0;
  return function(...args: any[]) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
};

// Calculate velocity between two points
const calculateVelocity = (
  prev: { x: number, y: number, time: number },
  current: { x: number, y: number, time: number }
) => {
  const timeDiff = current.time - prev.time;
  if (timeDiff <= 0) return { x: 0, y: 0 };

  return {
    x: (current.x - prev.x) / timeDiff,
    y: (current.y - prev.y) / timeDiff
  };
};

export interface MouseState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isMoving: boolean;
}

// Hook for efficient mouse tracking with velocity calculation
export const useMouseTracker = (throttleMs = 16, decayFactor = 0.95) => {
  const [mouseState, setMouseState] = useState<MouseState>({
    x: 0.5,
    y: 0.5,
    velocityX: 0,
    velocityY: 0,
    isMoving: false
  });

  const [prevPosition, setPrevPosition] = useState({
    x: 0.5,
    y: 0.5,
    time: Date.now()
  });

  const [movementTimeout, setMovementTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle mouse movement with throttling
  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      const currentTime = Date.now();
      const currentX = e.clientX / window.innerWidth;
      const currentY = e.clientY / window.innerHeight;

      const velocity = calculateVelocity(
        prevPosition,
        { x: currentX, y: currentY, time: currentTime }
      );

      setMouseState({
        x: currentX,
        y: currentY,
        velocityX: velocity.x * 1000, // Scale for more usable values
        velocityY: velocity.y * 1000,
        isMoving: true
      });

      setPrevPosition({ x: currentX, y: currentY, time: currentTime });

      // Reset movement flag after delay
      if (movementTimeout) clearTimeout(movementTimeout);
      const timeout = setTimeout(() => {
        setMouseState(prev => ({ ...prev, isMoving: false }));
      }, 150); // Short timeout to detect when movement stops
      setMovementTimeout(timeout as unknown as NodeJS.Timeout);
    }, throttleMs),
    [prevPosition, movementTimeout, throttleMs]
  );

  useEffect(() => {
    // Initialize to center position
    setMouseState({
      x: 0.5,
      y: 0.5,
      velocityX: 0,
      velocityY: 0,
      isMoving: false
    });

    // Use passive listener for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (movementTimeout) clearTimeout(movementTimeout);
    };
  }, [handleMouseMove, movementTimeout]);

  return mouseState;
};

export default useMouseTracker;
