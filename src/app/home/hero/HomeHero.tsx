// src/app/home/HomeHero.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/classNames";

// Import components
import HomeHeroHeadline from "./components/HomeHeroHeadline";
import HomeHeroSubheadline from "./components/HomeHeroSubheadline";
import HomeHeroCTA from "./components/HomeHeroCTA";
import HomeHeroBackground from "./components/HomeHeroBackground";
import PulseClickEffect from "./components/effects/PulseClickEffect";

// Import hooks
import { useMouseInteraction } from "../hooks/useMouseInteraction";
import { animationManager } from "@/components/core/Animations/utils/AnimationManager";
import { useAnimationPreferences } from "@/components/core/Animations/hooks/useAnimationPreferences";

interface HomeHeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export default function HomeHero({
  headline,
  subheadline,
  ctaText,
  ctaLink,
  imageSrc,
  imageAlt,
  className,
}: HomeHeroProps) {
  // Get animation preferences
  const { shouldAnimate, reducedMotion } = useAnimationPreferences();
  const prefersReducedMotion = useReducedMotion();

  // Track client-side rendering
  const [isClient, setIsClient] = useState(false);

  // Animation ID for tracking
  const heroAnimationId = useRef(`home-hero-${Math.random().toString(36).substring(2, 9)}`);

  // Refs for elements and interaction
  const heroRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const isSubheadlineInView = useRef(false);

  // Explicit render state for staged animation
  const [backgroundMounted, setBackgroundMounted] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [headlineMounted, setHeadlineMounted] = useState(false);
  const [headlineReady, setHeadlineReady] = useState(false);
  const [subheadlineMounted, setSubheadlineMounted] = useState(false);
  const [subheadlineReady, setSubheadlineReady] = useState(false);
  const [ctaMounted, setCtaMounted] = useState(false);

  // Explicit animation progress for child components
  const [backgroundProgress, setBackgroundProgress] = useState(0);
  const [headlineProgress, setHeadlineProgress] = useState(0);
  const [subheadlineProgress, setSubheadlineProgress] = useState(0);

  // Motion and interaction setup
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [interactionIntensity, setInteractionIntensity] = useState(0.3);

  // Spring config for subtle movements
  const springConfig = { stiffness: 20, damping: 30, mass: 1.5 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Minimal perspective transforms
  const perspectiveX = useTransform(mouseXSpring, [0, 1], [49, 51]);
  const perspectiveY = useTransform(mouseYSpring, [0, 1], [49, 51]);

  // Mouse interaction handling
  const {
    mousePosition,
    pulseClicks,
    handleMouseMove,
    handleMouseClick,
    isMoving,
    getVelocity,
  } = useMouseInteraction(mouseX, mouseY, heroRef);

  // Helper function to get color based on index
  const getColorByIndex = useCallback((index: number): string => {
    const colors = ["accent-secondary", "accent-warm", "accent-primary", "accent-contrast"];
    return colors[index % colors.length];
  }, []);

  // Memoize accent colors
  const accentColors = useMemo(() => ({
    primary: "var(--color-accent-primary)",
    secondary: "var(--color-accent-secondary)",
    tertiary: "var(--color-accent-tertiary)",
    warm: "var(--color-accent-warm)",
    contrast: "var(--color-accent-contrast)",
    oceanic: "var(--color-info)",
    cosmic: "var(--color-accent-tertiary)",
    brand: "var(--color-brand-primary)",
  }), []);

  // Scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Apply spring physics for smoother scrolling
  const scrollYProgressSpring = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 30,
    mass: 1,
  });

  // Transform values for scroll effects
  const backgroundY = useTransform(scrollYProgressSpring, [0, 0.5], ["0%", "15%"]);
  const backgroundScale = useTransform(scrollYProgressSpring, [0, 0.3], [1, 1.05]);
  const headerY = useTransform(scrollYProgressSpring, [0, 0.3], ["0%", "-5%"]);
  const headerOpacity = useTransform(scrollYProgressSpring, [0, 0.3, 0.4], [1, 0.97, 0]);
  const headerRotateX = useTransform(scrollYProgressSpring, [0, 0.3], [0, 1]);
  const gridX = useTransform(mouseXSpring, [0, 1], [-1.5, 1.5]);
  const gridY = useTransform(mouseYSpring, [0, 1], [-1.5, 1.5]);

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Staged animation sequence with explicit timeouts
  useEffect(() => {
    if (!isClient) return;

    // Register with animation manager
    animationManager.trackAnimation(heroAnimationId.current, "hero-component");

    // Stage 1: Mount background
    setBackgroundMounted(true);

    let timers: NodeJS.Timeout[] = [];

    // Setup animation timeline
    const backgroundAnimTimer = setTimeout(() => {
      // Stage 2: Animate background in
      setBackgroundProgress(1);

      const backgroundReadyTimer = setTimeout(() => {
        // Once background is fully visible
        setBackgroundReady(true);

        // Stage 3: Mount headline
        setHeadlineMounted(true);

        const headlineAnimTimer = setTimeout(() => {
          // Stage 4: Animate headline
          setHeadlineProgress(1);

          const headlineReadyTimer = setTimeout(() => {
            setHeadlineReady(true);

            // Stage 5: Mount subheadline
            setSubheadlineMounted(true);

            const subheadlineAnimTimer = setTimeout(() => {
              // Stage 6: Animate subheadline
              setSubheadlineProgress(1);

              const subheadlineReadyTimer = setTimeout(() => {
                setSubheadlineReady(true);

                // Stage 7: Mount CTA
                setCtaMounted(true);

              }, 300); // Small delay after subheadline is ready
              timers.push(subheadlineReadyTimer);

            }, 300); // Start subheadline animation
            timers.push(subheadlineAnimTimer);

          }, 500); // Wait for headline to be fully visible
          timers.push(headlineReadyTimer);

        }, 300); // Start headline animation
        timers.push(headlineAnimTimer);

      }, 1000); // Make sure background is fully visible before proceeding
      timers.push(backgroundReadyTimer);

    }, 100); // Start background animation
    timers.push(backgroundAnimTimer);

    return () => {
      // Clean up all timers
      timers.forEach(timer => clearTimeout(timer));
      animationManager.untrackAnimation(heroAnimationId.current);
    };
  }, [isClient]);

  // Setup IntersectionObserver for subheadline
  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isSubheadlineInView.current = entry.isIntersecting;
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    if (subheadlineRef.current) {
      observer.observe(subheadlineRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Mouse move handler
  const handleEnhancedMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMouseMove(e);

      if (isMoving && Math.random() > 0.9) {
        const velocity = getVelocity();
        const speed = Math.min(0.2, velocity.magnitude / 4000);
        setInteractionIntensity(0.3 + speed * 0.2);
      }
    },
    [handleMouseMove, isMoving, getVelocity]
  );

  // Click handler
  const handleEnhancedClick = useCallback(
    (e: React.MouseEvent) => {
      handleMouseClick(e);
      setInteractionIntensity(prev => Math.min(0.5, prev + 0.1));
      setTimeout(() => {
        setInteractionIntensity(0.3);
      }, 1000);
    },
    [handleMouseClick]
  );

  // Perspective style for 3D effect
  const perspectiveStyle = useMemo(() => {
    if (!isClient) {
      return {
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
      };
    }
    return {
      perspective: "1200px",
      perspectiveOrigin: `${perspectiveX.get()}% ${perspectiveY.get()}%`,
    };
  }, [isClient, perspectiveX, perspectiveY]);

  return (
    <section
      ref={heroRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleEnhancedMouseMove}
      onClick={handleEnhancedClick}
      role="region"
      aria-label="Hero section"
      style={perspectiveStyle}
    >
      {/* Background - only render when backgroundMounted is true */}
      {backgroundMounted && (
        <HomeHeroBackground
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          backgroundY={backgroundY}
          backgroundScale={backgroundScale}
          gridX={gridX}
          gridY={gridY}
          mousePosition={mousePosition}
          accentColors={accentColors}
          isVisible={true}
          animationProgress={backgroundProgress}
        />
      )}

      <PulseClickEffect
        pulseClicks={pulseClicks}
        getColorByIndex={getColorByIndex}
        accentColors={accentColors}
        intensity={interactionIntensity}
      />

      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">
        <motion.div
          className="grid grid-cols-12 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 relative max-w-screen-2xl mx-auto w-full"
          style={{
            y: headerY,
            opacity: headerOpacity,
            rotateX: headerRotateX,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Headline - only mount when it's time */}
          <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2">
            {headlineMounted && (
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: headlineProgress,
                  transition: {
                    duration: 0.8,
                    ease: [0.33, 1, 0.68, 1],
                  }
                }}
                style={{
                  willChange: 'opacity',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  visibility: headlineProgress > 0 ? 'visible' : 'hidden',
                }}
              >
                <HomeHeroHeadline
                  headline={headline}
                  accentColors={accentColors}
                  heroAnimationComplete={headlineReady}
                  animationProgress={headlineProgress}
                  animationPattern="mixed"
                  glitchActive={false}
                  intensiveGlitch={false}
                  glitchOffsets={[]}
                />
              </motion.div>
            )}
          </div>

          {/* Subheadline - only mount when it's time */}
          <div ref={subheadlineRef} className="col-span-12">
            {subheadlineMounted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: subheadlineProgress,
                  transition: {
                    duration: 0.8,
                    ease: [0.33, 1, 0.68, 1],
                  }
                }}
              >
                <HomeHeroSubheadline
                  subheadline={subheadline}
                  isSubheadlineInView={isSubheadlineInView.current}
                  accentColors={accentColors}
                  heroAnimationComplete={subheadlineReady}
                  animationProgress={subheadlineProgress}
                />
              </motion.div>
            )}
          </div>

          {/* CTA - only mount when it's time */}
          {ctaMounted && (
            <motion.div
              className="col-span-6 md:col-span-5 lg:col-span-4 col-start-7 md:col-start-8 mt-8 md:mt-12"
              initial={{ opacity: 0, y: 30, x: 5 }}
              animate={{
                opacity: 1,
                y: 0,
                x: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 15,
              }}
            >
              <HomeHeroCTA
                initialText="Curious?"
                hoverText="Let's Talk"
                ctaLink={ctaLink}
                accentColors={accentColors}
                heroAnimationComplete={subheadlineReady}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      <style jsx global>{`
        .character-3d {
          transform-style: preserve-3d;
          transform: perspective(1000px);
        }

        .character-hovered {
          animation: character-pulse 2.5s infinite alternate ease-in-out;
        }

        @keyframes character-pulse {
          0% { text-shadow: 0 0 4px currentColor; }
          100% { text-shadow: 0 0 8px currentColor; }
        }

        .perspective-effect {
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .translate-z-0 { transform: translateZ(0px); }

        @media (prefers-reduced-motion: reduce) {
          .character-hovered { animation: none; }
        }
      `}</style>
    </section>
  );
}