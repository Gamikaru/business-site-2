// src/app/home/components/HomeHeroSubheadline.tsx
"use client";

import React, { memo, useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { AccentColors } from "./subheadline/SubheadlineTypes";
import { formatContent } from "./subheadline/ContentFormatter";
import {
  useAnimationPreferences,
  animationManager,
  useRevealEffect,
} from "@/components/core/Animations";
import BoxGridContainer from "./subheadline/BoxGridContainer";
import { useMouseInteraction } from "./subheadline/hooks/useMouseInteraction";
import { SubheadlineStyles } from "./subheadline/SubheadlineStyles";

interface HomeHeroSubheadlineProps {
  subheadline: string;
  isSubheadlineInView: boolean;
  accentColors?: AccentColors;
  heroAnimationComplete?: boolean;
  animationProgress?: number;
}

const HomeHeroSubheadline: React.FC<HomeHeroSubheadlineProps> = ({
  subheadline,
  isSubheadlineInView,
  accentColors = {
    primary: "var(--color-accent-primary)",
    secondary: "var(--color-accent-secondary)",
    tertiary: "var(--color-accent-tertiary)",
    brand: "var(--color-brand-primary)",
    oceanic: "var(--color-info)",
    warm: "var(--color-warning)",
    contrast: "var(--color-neutral)",
    cosmic: "var(--color-success)",
  },
  heroAnimationComplete = false,
  animationProgress = 0,
}) => {
  // Animation preferences
  const { shouldAnimate, reducedMotion } = useAnimationPreferences();

  // Animation ID for tracking
  const animationId = useRef(
    `hero-subheadline-${Math.random().toString(36).substring(2, 9)}`
  );

  // Container reference and state
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerInView, setContainerInView] = useState(false);

  // Use our extracted mouse interaction hook
  const {
    hoveredBox,
    setHoveredBox,
    mousePosition,
    handleMouseMove,
    setContainerRef,
  } = useMouseInteraction();

  // Parse subheadline content
  const { firstThreeWords, remainingWords } = React.useMemo(
    () => formatContent(subheadline),
    [subheadline]
  );

  // Only show when hero animation has reached this phase
  const shouldShowSubheadline =
    heroAnimationComplete || animationProgress > 0.7;

  // Use reveal effect for scroll detection
  const revealEffect = useRevealEffect({
    triggerOnce: true,
    threshold: 0.2,
    id: animationId.current,
  });

  // Safely access reveal ref and visibility
  const revealRef = revealEffect?.[0] || null;
  const isRevealed = revealEffect?.[1] || false;

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Simulate click/hover on focused box
      const boxIndex = parseInt((e.target as HTMLElement).getAttribute('data-box-index') || '0');
      setHoveredBox(boxIndex);
    } else if (e.key === 'Escape') {
      setHoveredBox(null);
    }
  }, [setHoveredBox]);

  // Combine refs - this handles both function refs and object refs safely
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      setContainerRef(node);

      if (revealRef && typeof revealRef === "function") {
        revealRef(node);
      } else if (
        revealRef &&
        typeof revealRef === "object" &&
        "current" in revealRef
      ) {
        revealRef.current = node;
      }

      if (node) {
        setContainerInView(true);
      }
    },
    [revealRef, setContainerRef]
  );

  // Animation step based on progress
  const currentStep =
    animationProgress < 0.2
      ? "prepare"
      : animationProgress < 0.5
        ? "boxes"
        : animationProgress < 0.8
          ? "content"
          : "details";

  // Animation controls for child components
  const animationControls = {
    isInitializing: animationProgress < 0.2,
    isAnimating: animationProgress >= 0.2 && animationProgress < 0.8,
    isComplete: animationProgress >= 0.8 || heroAnimationComplete,
    sequenceId: currentStep,
  };

  // Register with animation manager
  useEffect(() => {
    if (shouldShowSubheadline && shouldAnimate()) {
      animationManager.trackAnimation(animationId.current, "hero-subheadline");

      return () => {
        animationManager.untrackAnimation(animationId.current);
      };
    }
  }, [shouldShowSubheadline, shouldAnimate]);

  // For reduced motion, render simplified version
  if (!shouldAnimate() || reducedMotion) {
    return (
      <div
        className="relative z-10"
        ref={containerRef}
        role="region"
        aria-label="Information display"
      >
        <BoxGridContainer
          firstThreeWords={firstThreeWords}
          remainingWords={remainingWords}
          hoveredBox={null}
          onHover={() => {}}
          accentColors={accentColors}
          animationControls={{
            isInitializing: false,
            isAnimating: false,
            isComplete: true,
            sequenceId: "",
          }}
          currentStep="complete"
          animationProgress={1}
          mousePosition={{ x: 0.5, y: 0.5 }}
          containerInView={true}
        />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {shouldShowSubheadline && (
        <div
          ref={setRefs}
          className="relative perspective-1000 z-10"
          onMouseMove={handleMouseMove}
          onKeyDown={handleKeyDown}
          role="region"
          aria-label="Interactive information display"
        >
          <BoxGridContainer
            firstThreeWords={firstThreeWords}
            remainingWords={remainingWords}
            hoveredBox={hoveredBox}
            onHover={setHoveredBox}
            accentColors={accentColors}
            animationControls={animationControls}
            currentStep={currentStep}
            animationProgress={animationProgress}
            mousePosition={mousePosition}
            containerInView={containerInView}
          />

          {/* Use our extracted styles component */}
          <SubheadlineStyles />
        </div>
      )}
    </AnimatePresence>
  );
};

export default memo(HomeHeroSubheadline);