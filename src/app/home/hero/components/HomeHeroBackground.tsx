// src/app/home/components/HomeHeroBackground.tsx
"use client";

import React, { memo, useEffect, useState } from 'react';
import { motion, MotionValue } from 'framer-motion';
import { MousePosition } from './background/BackgroundTypes';
import BaseBackground from './background/BaseBackground';
import GridOverlay from './background/GridOverlay';
import ImageLayer from './background/ImageLayer';
import SvgFilters from './background/SvgFilters';
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences';
import { animationManager } from "@/components/core/Animations/utils/AnimationManager";

interface HomeHeroBackgroundProps {
  imageSrc: string;
  imageAlt: string;
  backgroundY: MotionValue<string>;
  backgroundScale: MotionValue<number>;
  gridX: MotionValue<number>;
  gridY: MotionValue<number>;
  mousePosition: MousePosition;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    brand: string;
    [key: string]: string;
  };
  isVisible?: boolean;
  animationProgress?: number;
}

const HomeHeroBackground: React.FC<HomeHeroBackgroundProps> = ({
  imageSrc,
  imageAlt,
  backgroundY,
  backgroundScale,
  gridX,
  gridY,
  mousePosition,
  accentColors,
  isVisible = true,
  animationProgress = 0
}) => {
  // Animation preferences
  const { performance } = useAnimationPreferences();
  const useHighQuality = performance !== 'low';

  // Explicit layer mount states for precise control
  const [baseLayerMounted, setBaseLayerMounted] = useState(false);
  const [imageLayerMounted, setImageLayerMounted] = useState(false);
  const [gridLayerMounted, setGridLayerMounted] = useState(false);

  // Animation ID for tracking
  const animationId = React.useRef(`hero-background-${Math.random().toString(36).substring(2, 9)}`);

  // Progressive mounting of background layers
  useEffect(() => {
    if (!isVisible) return;

    // Track animation with animation manager
    animationManager.trackAnimation(animationId.current, "hero-background");

    // Mount base layer immediately
    setBaseLayerMounted(true);

    let timers: NodeJS.Timeout[] = [];

    // Mount image layer after a short delay
    const imageTimer = setTimeout(() => {
      setImageLayerMounted(true);

      // Mount grid layer last
      const gridTimer = setTimeout(() => {
        setGridLayerMounted(true);
      }, 300);

      timers.push(gridTimer);
    }, 200);

    timers.push(imageTimer);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      animationManager.untrackAnimation(animationId.current);
    };
  }, [isVisible]);

  // Main animation controls for the container
  const animationControls = {
    isInitializing: animationProgress < 0.2,
    isAnimating: animationProgress >= 0.2 && animationProgress < 0.9,
    isComplete: animationProgress >= 0.9,
    sequenceId: "background",
    progress: animationProgress
  };

  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{
        opacity: animationProgress,
        y: isVisible ? 0 : 10,
      }}
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        willChange: 'opacity, transform',
        pointerEvents: 'none',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        transform: 'translate3d(0,0,0)',
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      {/* SVG Filters */}
      <SvgFilters useHighQuality={useHighQuality} />

      {/* Base Background - mount first */}
      {baseLayerMounted && (
        <BaseBackground
          backgroundY={backgroundY}
          backgroundScale={backgroundScale}
          accentColors={accentColors}
          mousePosition={mousePosition}
          animationControls={animationControls}
        />
      )}

      {/* Image Layer - mount second */}
      {imageLayerMounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animationProgress }}
          transition={{
            duration: 0.8,
          }}
        >
          <ImageLayer
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            backgroundY={backgroundY}
            backgroundScale={backgroundScale}
            accentColors={accentColors}
            mousePosition={mousePosition}
            animationControls={animationControls}
          />
        </motion.div>
      )}

      {/* Grid Overlay - mount last */}
      {gridLayerMounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animationProgress * 0.8 }}
          transition={{
            duration: 0.8,
          }}
        >
          <GridOverlay
            gridX={gridX}
            gridY={gridY}
            accentColors={accentColors}
            mousePosition={mousePosition}
            animationControls={animationControls}
          />
        </motion.div>
      )}

      {/* Final overlay for cohesion */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            circle at 50% 50%,
            transparent 30%,
            rgba(0, 0, 0, 0.05) 100%
          )`,
          mixBlendMode: 'multiply',
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisible ? animationProgress * 0.5 : 0
        }}
        transition={{
          duration: 0.8,
        }}
      />
    </motion.div>
  );
};

export default memo(HomeHeroBackground);