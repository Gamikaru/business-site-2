// src/components/common/Animations/context/AnimationContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AnimationPreferences {
  // Core animation preferences
  enabled: boolean; // Master toggle for animations
  reducedMotion: boolean; // Honor reduced motion OS setting
  performance: "low" | "medium" | "high"; // Performance level

  // Animation quality settings
  intensity: number; // Animation intensity scale (0.5-1.5)
  duration: number; // Scale for animation durations
  disableOnMobile: boolean; // Whether to disable complex animations on mobile
  enableParallax: boolean; // Enable parallax effects

  // Custom environment settings
  devicePixelRatio: number; // Device pixel ratio for performance calculations
  hasGPUAcceleration: boolean; // Whether device likely has GPU acceleration
}

interface AnimationContextType {
  preferences: AnimationPreferences;
  updatePreferences: (preferences: Partial<AnimationPreferences>) => void;
  resetPreferences: () => void;
}

// Default preferences
const defaultPreferences: AnimationPreferences = {
  enabled: true,
  reducedMotion: false,
  performance: "medium",
  intensity: 1.0,
  duration: 1.0,
  disableOnMobile: false,
  enableParallax: true,
  devicePixelRatio: 1,
  hasGPUAcceleration: true,
};

// Create context
const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] =
    useState<AnimationPreferences>(defaultPreferences);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    // Get device pixel ratio
    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    // Make a rough guess about GPU acceleration
    // This is a simplification - in a production app you might use more sophisticated detection
    const hasGPU =
      dpr > 1 ||
      (typeof navigator !== "undefined" &&
        navigator.userAgent.toLowerCase().indexOf("mac") > -1);

    // Set initial preferences based on device capabilities
    setPreferences((prev) => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      devicePixelRatio: dpr,
      hasGPUAcceleration: hasGPU,
      // Adjust performance for lower-end devices
      performance: dpr < 2 ? "low" : prev.performance,
    }));

    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPreferences((prev) => ({ ...prev, reducedMotion: e.matches }));
    };

    // Add event listener with compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleReducedMotionChange);
    } else if ("addListener" in mediaQuery) {
      mediaQuery.addListener(handleReducedMotionChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleReducedMotionChange);
      } else if ("removeListener" in mediaQuery) {
        mediaQuery.removeListener(handleReducedMotionChange);
      }
    };
  }, []);

  // Update preferences function
  const updatePreferences = (newPreferences: Partial<AnimationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  // Reset to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <AnimationContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

// Custom hook to use the animation context
export const useAnimationContext = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error(
      "useAnimationContext must be used within an AnimationProvider"
    );
  }
  return context;
};

export default AnimationContext;
