// src/app/home/components/subheadline/hooks/useMouseInteraction.ts
import { useState, useCallback, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Custom hook to handle mouse interactions with boxes
 */
export const useMouseInteraction = () => {
  // Track which box is being hovered
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);

  // Track mouse position for advanced effects
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0.5, y: 0.5 });

  // Container reference for relative positioning
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Handle mouse movements within container
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
  }, []);

  // Set container reference
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
  }, []);

  return {
    hoveredBox,
    setHoveredBox,
    mousePosition,
    handleMouseMove,
    setContainerRef
  };
};