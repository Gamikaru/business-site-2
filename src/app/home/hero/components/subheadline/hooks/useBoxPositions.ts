import { useRef, useState, useCallback, useMemo } from 'react';

export interface BoxPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Custom hook to manage box positions within a container
 * @param boxCount Number of boxes to track
 * @returns Position tracking utilities and refs
 */
export const useBoxPositions = (boxCount: number = 4) => {
  // Initialize refs array only once with proper typing
  const boxRefs = useRef<Array<HTMLDivElement | null>>(
    Array(boxCount).fill(null)
  );

  // Container ref
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Box positions state with proper typing
  const [boxPositions, setBoxPositions] = useState<BoxPosition[]>(
    Array(boxCount).fill({ x: 0, y: 0, width: 0, height: 0 })
  );

  // Function to update box position - memoized with useCallback
  const updateBoxPosition = useCallback((index: number, element: HTMLDivElement | null) => {
    if (!element || index < 0 || index >= boxCount) return;

    // Store element reference in the appropriate ref
    boxRefs.current[index] = element;

    const rect = element.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };

    setBoxPositions(prev => {
      // Create a new array only if the position actually changed
      const newPosition = {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
        width: rect.width,
        height: rect.height
      };

      // Check if position actually changed before creating a new array
      const currentPos = prev[index];
      if (currentPos &&
          currentPos.x === newPosition.x &&
          currentPos.y === newPosition.y &&
          currentPos.width === newPosition.width &&
          currentPos.height === newPosition.height) {
        return prev;
      }

      // Only create a new array if needed
      const newPositions = [...prev];
      newPositions[index] = newPosition;
      return newPositions;
    });
  }, [boxCount]);

  // Memoized function to set container ref
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
  }, []);

  // Memoize return values to prevent unnecessary re-renders
  return useMemo(() => ({
    boxPositions,
    updateBoxPosition,
    setContainerRef,
    containerRef
  }), [boxPositions, updateBoxPosition, setContainerRef]);
};
