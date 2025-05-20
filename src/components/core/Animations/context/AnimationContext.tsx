// src/components/core/Animations/context/AnimationContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { animationManager } from "../utils/AnimationManager";

export interface AnimationPreferences {
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

export interface AnimationContextType {
  preferences: AnimationPreferences;
  updatePreferences: (preferences: Partial<AnimationPreferences>) => void;
  resetPreferences: () => void;
  getPreferenceValue: <K extends keyof AnimationPreferences>(
    key: K
  ) => AnimationPreferences[K];
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
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
const AnimationContext = createContext<AnimationContextType>({
  preferences: defaultPreferences,
  updatePreferences: () => {},
  resetPreferences: () => {},
  getPreferenceValue: (key) => defaultPreferences[key],
  isMobile: false,
  isTablet: false,
  isDesktop: true,
});

interface AnimationProviderProps {
  children: ReactNode;
  initialPreferences?: Partial<AnimationPreferences>;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({
  children,
  initialPreferences = {},
}) => {
  // Merge default preferences with any provided initial values
  const initialState = useMemo(
    () => ({ ...defaultPreferences, ...initialPreferences }),
    [initialPreferences]
  );

  const [preferences, setPreferences] =
    useState<AnimationPreferences>(initialState);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // Detect device type
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1280);
      setIsDesktop(width >= 1280);
    };

    // Initialize on mount
    checkDeviceType();

    // Set up listener for window resize
    window.addEventListener("resize", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    // Get device pixel ratio
    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    // Make a better guess about GPU acceleration
    const hasGPU =
      typeof window !== "undefined" &&
      (dpr > 1.5 ||
        window.matchMedia("(min-resolution: 2dppx)").matches ||
        // Test for WebGL which is a better indicator of GPU
        (() => {
          try {
            const canvas = document.createElement("canvas");
            return !!(
              window.WebGLRenderingContext &&
              (canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl"))
            );
          } catch (e) {
            // Intentionally ignore error
            return false;
          }
        })());

    // Set performance level based on device capabilities
    const determinePerformanceLevel = (): "low" | "medium" | "high" => {
      if (!hasGPU || dpr < 1) return "low";
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
        return "low";
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
        return "medium";
      return "high";
    };

    const performance = determinePerformanceLevel();

    // Update preferences with detected values
    setPreferences((prev) => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      devicePixelRatio: dpr,
      hasGPUAcceleration: hasGPU,
      performance,
    }));

    // Register media query for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleReducedMotionChange = () => {
      setPreferences((prev) => ({
        ...prev,
        reducedMotion: mediaQuery.matches,
      }));

      // Also update AnimationManager when reduced motion changes
      animationManager.setEnabled(!mediaQuery.matches);
    };

    // Add event listener (addEventListener is supported in all modern browsers)
    mediaQuery.addEventListener("change", handleReducedMotionChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleReducedMotionChange);
    };
  }, []);

  // When preferences change, update AnimationManager
  useEffect(() => {
    // Configure AnimationManager based on preferences
    animationManager.setEnabled(
      preferences.enabled && !preferences.reducedMotion
    );

    // Debug mode in development environment
    if (process.env.NODE_ENV === "development") {
      animationManager.setDebugMode(true);
    }

    // Configure ScrollObserver settings
    animationManager.configure({
      // More responsive scrolling for high performance devices
      throttleScrollMs: preferences.performance === "high" ? 8 : 16,
      // Less frequent resize calculations for better performance
      throttleResizeMs: preferences.performance === "low" ? 200 : 100,
    });
  }, [preferences.enabled, preferences.reducedMotion, preferences.performance]);

  // Update preferences function - memoized to prevent recreation
  const updatePreferences = useCallback(
    (newPreferences: Partial<AnimationPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...newPreferences }));
    },
    []
  );

  // Reset to defaults - memoized to prevent recreation
  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, []);

  // Get a specific preference value - useful for performance optimizations
  const getPreferenceValue = useCallback(
    <K extends keyof AnimationPreferences>(key: K): AnimationPreferences[K] => {
      return preferences[key];
    },
    [preferences]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      preferences,
      updatePreferences,
      resetPreferences,
      getPreferenceValue,
      isMobile,
      isTablet,
      isDesktop,
    }),
    [
      preferences,
      updatePreferences,
      resetPreferences,
      getPreferenceValue,
      isMobile,
      isTablet,
      isDesktop,
    ]
  );

  return (
    <AnimationContext.Provider value={contextValue}>
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
