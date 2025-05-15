"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { cn } from "@/utils/classNames";

interface GridPoint {
  x: number;
  y: number;
  color: string;
  opacity: number;
  direction: "up" | "down" | "left" | "right";
  speed: number;
  size: number;
  length: number;
  startTime: number;
  duration: number;
}

interface AnimatedGridBackgroundProps {
  className?: string;
  density?: number; // Grid density (higher = more grid lines)
  particleCount?: number; // Number of moving particles
  colors?: string[]; // Array of color variables
  scroll?: boolean; // Whether to respond to scroll
  opacity?: number; // Base opacity of grid
}

const AnimatedGridBackground: React.FC<AnimatedGridBackgroundProps> = ({
  className,
  density = 20,
  particleCount = 15,
  colors = ["accent-primary", "accent-oceanic", "accent-warm", "brand-primary"],
  scroll = true,
  opacity = 0.1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  const animationStateRef = useRef({ isDrawing: false });
  const [uniqueId] = useState(`grid-${Math.floor(Math.random() * 10000)}`);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  // Generate particles once on mount
  const particles = useMemo(() => {
    const initialParticles = [];
    for (let i = 0; i < particleCount; i++) {
      // We'll create them with dummy values and update them when we have container dimensions
      initialParticles.push({
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.5 + Math.random() * 0.5, // Increased opacity for better visibility
        speed: 0.3 + Math.random() * 0.7,
        size: 2 + Math.random() * 2, // Increased size for better visibility
        initialDelay: Math.random() * 3000, // Stagger start times
        colorIndex: Math.floor(Math.random() * colors.length),
        isHorizontal: Math.random() > 0.5,
      });
    }
    return initialParticles;
  }, [particleCount, colors]);

  // Setup Intersection Observer to improve performance by pausing animations only when really out of view
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasIntersected(true);
          // Important: Ensure we resume drawing when back in view
          if (isPaused) {
            setIsPaused(false);
          }
        }
      },
      {
        // Larger rootMargin to keep rendering even slightly off-screen
        rootMargin: "500px",
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isPaused]);

  // Setup canvas and animation with performance optimizations
  useEffect(() => {
    // Exit early if canvas is not ready, but always proceed after first intersection
    if ((!canvasRef.current || !containerRef.current) && !hasIntersected) return;

    // We'll fall back to a basic grid if canvas context isn't available
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });

    // Safety check - if we can't get context, don't proceed
    if (!ctx && !canvas) return;

    // Setup canvas dimensions with device pixel ratio for crisp rendering
    if (canvas && containerRef.current) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = containerRef.current.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }

    // Set up particle states even if we don't have a context
    // This way we're ready when the canvas becomes available
    let particleStates = [];
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();

      particleStates = particles.map(particle => {
        const gridPosition = Math.floor(Math.random() * density);

        let x, y, endX, endY;
        if (particle.isHorizontal) {
          x = Math.random() > 0.5 ? 0 : rect.width;
          y = (rect.height / density) * gridPosition;
          endX = x === 0 ? rect.width : 0;
          endY = y;
        } else {
          x = (rect.width / density) * gridPosition;
          y = Math.random() > 0.5 ? 0 : rect.height;
          endX = x;
          endY = y === 0 ? rect.height : 0;
        }

        return {
          ...particle,
          x,
          y,
          endX,
          endY,
          startTime: performance.now() + particle.initialDelay,
          duration: 5000 + Math.random() * 5000
        };
      });
    }

    // Get actual CSS color values
    const getComputedColor = (colorName: string): string => {
      const colorVar = `--color-${colorName}`;
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue(colorVar).trim() || '#4DC8A4'; // Fallback
    };

    // Pre-compute colors for fast lookup
    const computedColors = colors.map(color => getComputedColor(color));

    // Draw base grid lines - optimized to reduce re-drawing
    const drawGrid = () => {
      if (!ctx || !canvas) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1),
                         canvas.height / (window.devicePixelRatio || 1));

      // Draw grid lines
      ctx.strokeStyle = 'currentColor';
      ctx.lineWidth = 0.7;
      ctx.globalAlpha = 0.3 * (opacity * 1.5);

      // Horizontal grid lines - using path batching for performance
      ctx.beginPath();
      for (let i = 0; i <= density; i++) {
        const y = (rect.height / density) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
      }
      ctx.stroke();

      // Vertical grid lines - using path batching for performance
      ctx.beginPath();
      for (let i = 0; i <= density; i++) {
        const x = (rect.width / density) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
      }
      ctx.stroke();

      ctx.globalAlpha = 1; // Reset global alpha
    };

    // Helper function to convert hex to rgb with caching
    const hexToRgb = (hex: string): string => {
      // Remove # if present
      hex = hex.replace(/^#/, '').trim();

      // Convert 3-digit hex to 6-digit
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }

      // Parse hex values
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;

      return `${r}, ${g}, ${b}`;
    };

    // Draw animated particles
    const drawParticles = (timestamp: number) => {
      if (!ctx || !canvas) return;

      // Draw particles
      particleStates.forEach(p => {
        if (timestamp < p.startTime) return;

        const elapsed = timestamp - p.startTime;
        let progress = Math.min(1, elapsed / p.duration);

        // If complete, reset the particle
        if (progress >= 1) {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;

          const gridPosition = Math.floor(Math.random() * density);

          if (p.isHorizontal) {
            p.x = Math.random() > 0.5 ? 0 : rect.width;
            p.y = (rect.height / density) * gridPosition;
            p.endX = p.x === 0 ? rect.width : 0;
            p.endY = p.y;
          } else {
            p.x = (rect.width / density) * gridPosition;
            p.y = Math.random() > 0.5 ? 0 : rect.height;
            p.endX = x;
            p.endY = y === 0 ? rect.height : 0;
          }

          p.startTime = timestamp;
          p.duration = 5000 + Math.random() * 5000;
          p.color = colors[Math.floor(Math.random() * colors.length)];
          p.colorIndex = colors.indexOf(p.color);
          p.opacity = 0.5 + Math.random() * 0.5; // Increased opacity
          p.size = 2 + Math.random() * 2; // Increased size
          return;
        }

        // Easing function for smooth animation
        progress = easeInOutQuad(progress);

        // Calculate current position
        const currentX = p.x + (p.endX - p.x) * progress;
        const currentY = p.y + (p.endY - p.y) * progress;

        // Calculate line endpoints with variable length based on progress
        // Lines are longest at middle of animation cycle
        const lengthFactor = 1 - Math.abs(progress - 0.5) * 2; // Peaks at progress=0.5
        const lineLength = 30 + 150 * lengthFactor; // Increased length for better visibility

        let x1, y1, x2, y2;

        if (p.isHorizontal) {
          x1 = currentX - (lineLength / 2);
          y1 = currentY;
          x2 = currentX + (lineLength / 2);
          y2 = currentY;
        } else {
          x1 = currentX;
          y1 = currentY - (lineLength / 2);
          x2 = currentX;
          y2 = currentY + (lineLength / 2);
        }

        // Create gradient for line
        const colorIndex = p.colorIndex % computedColors.length;
        const actualColor = computedColors[colorIndex];
        const rgbColor = hexToRgb(actualColor);

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, `rgba(${rgbColor}, 0)`);
        gradient.addColorStop(0.5, `rgba(${rgbColor}, ${p.opacity})`);
        gradient.addColorStop(1, `rgba(${rgbColor}, 0)`);

        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.size;
        ctx.globalAlpha = 1; // We use the gradient for opacity control
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
    };

    // Animation frame limiter for performance
    let lastFrameTime = 0;
    const frameThreshold = 1000 / 30; // 30fps target for better performance

    // Scroll event handler using the lastScrollY ref
    const handleScroll = () => {
      if (!scroll) return;

      // Update last scroll position
      lastScrollY.current = window.scrollY;

      // Instead of pausing, just reduce animation frequency during scroll
      // This keeps the grid visible while improving performance
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isVisible) {
          setIsPaused(false);
        }
      }, 150); // Resume full animation 150ms after scrolling stops
    };

    let scrollTimeout: ReturnType<typeof setTimeout>;
    if (scroll) {
      window.addEventListener('scroll', handleScroll);
    }

    // Animation loop with failsafe to prevent grid disappearance
    const animate = (timestamp: number) => {
      animationStateRef.current.isDrawing = true;

      // Draw the grid on every frame, regardless of timing
      // This ensures the grid is always visible
      drawGrid();

      // Only animate particles based on framerate limits and pause state
      const deltaTime = timestamp - lastFrameTime;
      if (deltaTime >= frameThreshold && !isPaused) {
        lastFrameTime = timestamp;
        drawParticles(timestamp);
      } else if (isPaused) {
        // Even when paused, draw static particles occasionally
        if (timestamp % 1000 < 20) {
          drawParticles(timestamp);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Handle resize with debouncing
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!containerRef.current || !canvasRef.current || !ctx) return;

        const rect = containerRef.current.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Update canvas size
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        // Update particle positions
        particleStates.forEach(p => {
          if (p.isHorizontal) {
            const gridPosition = Math.floor((p.y / rect.height) * density);
            p.y = (rect.height / density) * gridPosition;
            p.endY = p.y;

            // Maintain direction
            if (p.x < p.endX) { // Moving right
              p.x = Math.min(p.x, rect.width);
              p.endX = rect.width;
            } else { // Moving left
              p.x = Math.max(p.x, 0);
              p.endX = 0;
            }
          } else {
            const gridPosition = Math.floor((p.x / rect.width) * density);
            p.x = (rect.width / density) * gridPosition;
            p.endX = p.x;

            // Maintain direction
            if (p.y < p.endY) { // Moving down
              p.y = Math.min(p.y, rect.height);
              p.endY = rect.height;
            } else { // Moving up
              p.y = Math.max(p.y, 0);
              p.endY = 0;
            }
          }
        });
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    // Failsafe: If we haven't drawn for some reason, force a redraw
    const failsafeInterval = setInterval(() => {
      if (!animationStateRef.current.isDrawing && isVisible && !isPaused) {
        // If not drawing but should be visible, restart animation
        cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(animate);
      }
      animationStateRef.current.isDrawing = false;
    }, 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scroll) {
        window.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(scrollTimeout);
      clearTimeout(resizeTimeout);
      clearInterval(failsafeInterval);
      cancelAnimationFrame(animationRef.current);
    };
  }, [particles, density, colors, opacity, isVisible, hasIntersected, isPaused, scroll]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      style={{ zIndex: 0 }} // Ensure z-index is explicit
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Fallback grid when canvas isn't working */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-10"></div>
    </div>
  );
};

// Easing function for smooth animation
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default AnimatedGridBackground;
