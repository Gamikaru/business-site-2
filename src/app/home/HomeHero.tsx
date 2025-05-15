// src/app/home/HomeHero.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/utils/classNames";
import dynamic from "next/dynamic";

// Static imports for critical components
import HomeHeroHeadline from "./components/HomeHeroHeadline";
import HomeHeroSubheadline from "./components/HomeHeroSubheadline";
import HomeHeroCTA from "./components/HomeHeroCTA";
import HomeHeroDivider from "./components/HomeHeroDivider";
import HomeHeroBackground from "./components/HomeHeroBackground";

// Lazy-loaded non-critical component
const HomeHeroDataViz = dynamic(() => import("./components/HomeHeroDataViz"), {
  ssr: false,
  loading: () => (
    <div
      className="animate-pulse bg-bg-tertiary h-full rounded-md"
      aria-hidden="true"
    />
  ),
});

const HomeHeroMeasurement = dynamic(
  () => import("./components/HomeHeroMeasurement"),
  {
    ssr: false,
  }
);

// Types
export interface PulseClick {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  colorIndex: number;
}

interface BubbleNetworkClick {
  x: number;
  y: number;
  timestamp: number;
}

interface HomeHeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

const MAX_PULSE_AGE_MS = 2500;
const GLITCH_INTERVAL_MS = 4500;
const THROTTLE_MS = 12; // ~83fps for smoother animations

export default function HomeHero({
  headline,
  subheadline,
  ctaText,
  ctaLink,
  imageSrc,
  imageAlt,
  className,
}: HomeHeroProps) {
  // Check for reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  // Memoize static data
  const characters = useMemo(() => headline.split(""), [headline]);

  // Refs for animations and throttling
  const heroRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const isSubheadlineInView = useRef(false);
  const lastMoveRef = useRef(0);

  // Motion values (outside React render cycle)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Component state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pulseClicks, setPulseClicks] = useState<PulseClick[]>([]);
  const [pulseIdCounter, setPulseIdCounter] = useState(0);
  const [glitchState, setGlitchState] = useState({
    offsets: Array(characters.length).fill(0),
    active: false,
    intensive: false,
  });
  const [randomData, setRandomData] = useState({
    coordinates: { x: 0, y: 0 },
    spectrumValue: 0,
    systemLoad: 0,
  });

  // Add state for bubble network clicks
  const [bubbleClicks, setBubbleClicks] = useState<BubbleNetworkClick[]>([]);

  // Track if the hero section has been fully loaded/animated
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);

  // Memoize accent colors to avoid object recreation
  const accentColors = useMemo(
    () => ({
      primary: "var(--color-accent-primary)",
      secondary: "var(--color-accent-secondary)",
      tertiary: "var(--color-accent-tertiary)",
      warm: "var(--color-accent-warm)",
      contrast: "var(--color-accent-contrast)",
      oceanic: "var(--color-info)",
      cosmic: "var(--color-accent-tertiary)",
      brand: "var(--color-brand-primary)",
    }),
    []
  );

  // Helper function to get color based on index
  const getColorByIndex = useCallback((index: number): string => {
    const colors = [
      "accent-secondary",
      "accent-warm",
      "accent-primary",
      "accent-contrast",
    ];
    return colors[index % colors.length];
  }, []);

  // Scroll-driven animations - enhanced parallax effects
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 0.5], ["0%", "40%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.12]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], ["0%", "-15%"]);
  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.4],
    [1, 0.9, 0]
  );

  // Additional parallax effects for more depth perception
  const headerRotateX = useTransform(scrollYProgress, [0, 0.3], [0, 3]);
  const headerPerspective = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1200, 900]
  );

  // Grid animation from mouse movement
  const gridX = useTransform(mouseX, [0, 1], [-7, 7]);
  const gridY = useTransform(mouseY, [0, 1], [-7, 7]);

  // Mark hero animation as complete after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroAnimationComplete(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Setup IntersectionObserver for subheadline
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isSubheadlineInView.current = entry.isIntersecting;
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    if (subheadlineRef.current) {
      observer.observe(subheadlineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initialize glitch effects and animations
  useEffect(() => {
    if (prefersReducedMotion) {
      return () => {};
    }

    // Set initial glitch offsets
    setGlitchState((prev) => ({
      ...prev,
      offsets: characters.map(() => Math.random() * 10 - 5),
    }));

    // Periodic glitch effects
    const glitchInterval = setInterval(() => {
      const shouldIntensify = Math.random() > 0.8;

      setGlitchState((prev) => ({
        ...prev,
        active: true,
        intensive: shouldIntensify,
        offsets: characters.map(() => Math.random() * 25 - 12),
      }));

      // Reset glitch after short duration
      const glitchDuration = shouldIntensify ? 180 : 130;
      const resetTimeout = setTimeout(() => {
        setGlitchState((prev) => ({
          ...prev,
          active: false,
          intensive: false,
        }));
      }, glitchDuration);

      // Update random technical data
      setRandomData((prev) => ({
        ...prev,
        systemLoad: Math.floor(Math.random() * 100),
        spectrumValue: Math.floor(Math.random() * 100),
      }));

      return () => clearTimeout(resetTimeout);
    }, GLITCH_INTERVAL_MS);

    return () => {
      clearInterval(glitchInterval);
    };
  }, [characters, prefersReducedMotion]);

  // Cleanup old pulses
  useEffect(() => {
    if (pulseClicks.length === 0) return;

    const cleanup = setTimeout(() => {
      const now = Date.now();
      setPulseClicks((prev) =>
        prev.filter((pulse) => now - pulse.timestamp < MAX_PULSE_AGE_MS)
      );
    }, MAX_PULSE_AGE_MS);

    return () => clearTimeout(cleanup);
  }, [pulseClicks]);

  // Throttled mouse move handler
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveRef.current < THROTTLE_MS) return;
      lastMoveRef.current = now;

      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Update motion values directly (no re-render)
      mouseX.set(x);
      mouseY.set(y);

      // Batch state updates with startTransition
      React.startTransition(() => {
        setMousePosition({ x, y });
        setRandomData((prev) => ({
          ...prev,
          coordinates: {
            x: Math.floor(x * 100),
            y: Math.floor(y * 100),
          },
          spectrumValue: Math.floor(x * y * 100),
        }));
      });
    },
    [mouseX, mouseY]
  );

  // Handle mouse clicks for interactive effects
  const handleMouseClick = useCallback(
    (e: React.MouseEvent) => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const newPulse = {
        id: pulseIdCounter,
        x,
        y,
        timestamp: Date.now(),
        colorIndex: pulseIdCounter % 4,
      };

      setPulseClicks((prev) => [...prev, newPulse]);
      setPulseIdCounter((prev) => prev + 1);

      // Also track this click for bubble network visualization
      setBubbleClicks((prev) => [
        ...prev.slice(-12),
        { x, y, timestamp: Date.now() },
      ]);

      // Trigger system load update and glitch
      React.startTransition(() => {
        setRandomData((prev) => ({
          ...prev,
          systemLoad: Math.floor(Math.random() * 100),
        }));

        setGlitchState((prev) => ({ ...prev, active: true }));
        setTimeout(
          () => setGlitchState((prev) => ({ ...prev, active: false })),
          150
        );
      });
    },
    [pulseIdCounter]
  );

  // Memoize pulse clicks rendering
  const renderPulseClicks = useMemo(() => {
    if (prefersReducedMotion || pulseClicks.length === 0) return null;

    return (
      <>
        {pulseClicks.map((pulse) => {
          const colorKey = getColorByIndex(pulse.colorIndex);
          const pulseColor =
            colorKey === "accent-primary"
              ? accentColors.primary
              : colorKey === "accent-secondary"
                ? accentColors.secondary
                : colorKey === "accent-warm"
                  ? accentColors.warm
                  : accentColors.contrast;

          return (
            <motion.div
              key={`pulse-${pulse.id}`}
              className="absolute pointer-events-none"
              style={{
                left: `${pulse.x * 100}%`,
                top: `${pulse.y * 100}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 20,
              }}
              initial={{ opacity: 0.9, scale: 0 }}
              animate={{
                opacity: 0,
                scale: [0, 0.6, 1.2, 1.8, 2.2],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.8,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 w-20 h-20 rounded-full opacity-30"
                  style={{ background: pulseColor }}
                />
                <div
                  className="w-40 h-40 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: pulseColor }}
                >
                  <div
                    className="w-30 h-30 rounded-full border"
                    style={{ borderColor: pulseColor }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </>
    );
  }, [pulseClicks, prefersReducedMotion, getColorByIndex, accentColors]);

  return (
    <section
      ref={heroRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onClick={handleMouseClick}
      role="region"
      aria-label="Hero section"
    >
      <HomeHeroBackground
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        backgroundY={backgroundY}
        backgroundScale={backgroundScale}
        gridX={gridX}
        gridY={gridY}
        mousePosition={mousePosition}
        glitchActive={glitchState.active}
        intensiveGlitch={glitchState.intensive}
        glitchOffsets={glitchState.offsets}
        accentColors={accentColors}
        heroAnimationComplete={heroAnimationComplete}
      />

      {renderPulseClicks}

      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">
        <motion.div
          className="grid grid-cols-12 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 relative max-w-screen-2xl mx-auto w-full"
          style={{
            y: headerY,
            opacity: headerOpacity,
            rotateX: headerRotateX,
            perspective: headerPerspective,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2">
            <HomeHeroHeadline
              headline={headline}
              glitchActive={glitchState.active}
              intensiveGlitch={glitchState.intensive}
              glitchOffsets={glitchState.offsets}
              accentColors={accentColors}
              heroAnimationComplete={heroAnimationComplete}
            />
          </div>

          {/* Subheadline wrapper - full width to allow for golden ratio cascade */}
          <div ref={subheadlineRef} className="col-span-12">
            <HomeHeroSubheadline
              subheadline={subheadline}
              isSubheadlineInView={isSubheadlineInView.current}
              randomData={randomData}
              accentColors={accentColors}
              heroAnimationComplete={heroAnimationComplete}
            />
          </div>

          {/* CTA positioned according to golden ratio - bottom right of the subheadline cascade */}
          <motion.div
            className="col-span-6 md:col-span-5 lg:col-span-4 col-start-7 md:col-start-8 mt-8 md:mt-12"
            initial={{ opacity: 0, y: 40, x: 10 }}
            animate={{
              opacity: heroAnimationComplete ? 1 : 0,
              y: heroAnimationComplete ? 0 : 40,
              x: heroAnimationComplete ? 0 : 10,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 1.8,
            }}
          >
            <HomeHeroCTA
              initialText="Curious?"
              hoverText="Let's Talk"
              ctaLink={ctaLink}
              accentColors={accentColors}
              heroAnimationComplete={heroAnimationComplete}
            />
          </motion.div>

          {/* {!prefersReducedMotion && (
            <div className="hidden lg:block col-span-3 col-start-2 xl:col-start-2 mt-6 row-span-2">
              <HomeHeroDataViz
                mousePosition={mousePosition}
                randomData={randomData}
                accentColors={accentColors}
                globalClicks={bubbleClicks}
                heroAnimationComplete={heroAnimationComplete}
              />
            </div>
          )} */}
        </motion.div>

        {/* <div className="w-full max-w-screen-2xl mx-auto">
          <HomeHeroMeasurement accentColors={accentColors} />
        </div> */}
      </div>

      <HomeHeroDivider accentColors={accentColors} />

      <style jsx global>{`
        .glitch-filter {
          clip-path: inset(0);
        }

        .glitch-filter::before,
        .glitch-filter::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          background-image: inherit;
          background-size: inherit;
          background-position: inherit;
        }

        .glitch-filter::before {
          transform: translateX(5px);
          clip-path: inset(20% 0 40% 0);
          mix-blend-mode: overlay;
        }

        .glitch-filter::after {
          transform: translateX(-5px);
          clip-path: inset(60% 0 10% 0);
          mix-blend-mode: difference;
        }

        .intensive-glitch::before {
          transform: translateX(15px) skewX(5deg);
          filter: hue-rotate(90deg);
        }

        .intensive-glitch::after {
          transform: translateX(-10px) skewY(-5deg);
          filter: hue-rotate(-90deg) brightness(1.2);
        }

        .perspective-effect {
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .translate-z-0 {
          transform: translateZ(0px);
        }

        @media (prefers-reduced-motion: reduce) {
          .glitch-hover:hover {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
