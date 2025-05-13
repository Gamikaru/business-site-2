"use client";

/**
 * HomeHero: Optimized for React 19 + Next.js 15
 * - Performance: Reduced re-renders with throttled events, moved animations outside render cycle
 * - Bundle size: Dynamically loaded non-critical components
 * - Accessibility: Added ARIA roles and reduced-motion support
 * - Responsiveness: Improved spacing and padding for all viewport sizes
 * - Enhanced: Added varied color palette to reduce pink dominance
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { useInView } from "framer-motion";
import { cn } from "@/utils/classNames";
import dynamic from "next/dynamic";

// Static imports for critical path
import HomeHeroBackground from "./components/HomeHeroBackground";
import HomeHeroHeadline from "./components/HomeHeroHeadline";
import HomeHeroSubheadline from "./components/HomeHeroSubheadline";
import HomeHeroCTA from "./components/HomeHeroCTA";
import HomeHeroDivider from "./components/HomeHeroDivider";

// Dynamic imports for non-critical components
const HomeHeroDataViz = dynamic(() => import("./components/HomeHeroDataViz"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-bg-tertiary h-full rounded-md"></div>
  ),
});

const HomeHeroMeasurement = dynamic(
  () => import("./components/HomeHeroMeasurement"),
  {
    ssr: false,
  }
);

interface HomeHeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

interface PulseClick {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  colorIndex: number; // Added to store which color to use
}

const HomeHero: React.FC<HomeHeroProps> = ({
  headline,
  subheadline,
  ctaText,
  ctaLink,
  imageSrc,
  imageAlt,
  className,
}) => {
  // Use React 19 compiler pragma for optimized rendering
  "use react-compiler";

  // Function to get a color based on index for more variety using theme colors
  const getColorByIndex = (index: number) => {
    // These color names match exactly with the CSS variables in the theme
    const colors = ['accent-secondary', 'accent-warm', 'accent-primary', 'accent-contrast'];
    return colors[index % colors.length];
  };

  // Check for reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  // Memoize static data
  const characters = useMemo(() => headline.split(""), [headline]);
  const terminalFullText = useMemo(
    () => "> init system; loading profile; status: ready",
    []
  );

  // Refs and view tracking
  const heroRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const isSubheadlineInView = useInView(subheadlineRef, { once: true });
  const lastMoveRef = useRef(0);

  // Motion values (outside React render cycle)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pulseClicks, setPulseClicks] = useState<PulseClick[]>([]);
  const [pulseIdCounter, setPulseIdCounter] = useState(0);
  const [glitchState, setGlitchState] = useState({
    offsets: Array(characters.length).fill(0),
    active: false,
    intensive: false,
  });
  const [terminalText, setTerminalText] = useState("");
  const [randomData, setRandomData] = useState({
    coordinates: { x: 0, y: 0 },
    spectrumValue: 0,
    systemLoad: 0,
  });

  // Create an object with theme color variables to pass to child components
  const accentColors = useMemo(() => ({
    primary: 'var(--color-accent-primary)',
    secondary: 'var(--color-accent-secondary)',
    tertiary: 'var(--color-accent-tertiary)',
    warm: 'var(--color-accent-warm)',
    contrast: 'var(--color-accent-contrast)',
    oceanic: 'var(--color-accent-oceanic)',
    cosmic: 'var(--color-accent-cosmic)',
    brand: 'var(--color-brand-primary)'
  }), []);

  // Scroll-driven animations (outside React render cycle)
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 0.5], ["0%", "50%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], ["0%", "-30%"]);
  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.4],
    [1, 0.8, 0]
  );

  // Grid animation from mouse movement
  const gridX = useTransform(mouseX, [0, 1], [-5, 5]);
  const gridY = useTransform(mouseY, [0, 1], [-5, 5]);

  // Throttled mouse move handler
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const now = Date.now();
      // Throttle to ~60fps
      if (now - lastMoveRef.current < 16) return;
      lastMoveRef.current = now;

      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Update motion values directly (no re-render)
      mouseX.set(x);
      mouseY.set(y);

      // Batch state updates
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

  // Optimized click handler with colors from the theme
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
        colorIndex: pulseIdCounter % 4 // Cycle through 4 different theme colors
      };

      setPulseClicks((prev) => [...prev, newPulse]);
      setPulseIdCounter((prev) => prev + 1);

      React.startTransition(() => {
        setRandomData((prev) => ({
          ...prev,
          systemLoad: Math.floor(Math.random() * 100),
        }));

        // Trigger glitch effect
        setGlitchState((prev) => ({ ...prev, active: true }));
        setTimeout(
          () => setGlitchState((prev) => ({ ...prev, active: false })),
          150
        );
      });
    },
    [pulseIdCounter]
  );

  // Cleanup old pulses
  useEffect(() => {
    if (pulseClicks.length === 0) return;

    const cleanup = setTimeout(() => {
      const now = Date.now();
      setPulseClicks((prev) =>
        prev.filter((pulse) => now - pulse.timestamp < 2000)
      );
    }, 2000);

    return () => clearTimeout(cleanup);
  }, [pulseClicks]);

  // Initialize glitch effects and animations
  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animations for reduced motion preference
      setTerminalText(terminalFullText);
      return () => {};
    }

    // Set initial glitch offsets
    setGlitchState((prev) => ({
      ...prev,
      offsets: characters.map(() => Math.random() * 10 - 5),
    }));

    // Terminal typing effect
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < terminalFullText.length) {
        setTerminalText((prev) =>
          terminalFullText.substring(0, prev.length + 1)
        );
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);

    // Periodic glitch effects - reduced frequency
    const glitchInterval = setInterval(() => {
      React.startTransition(() => {
        setGlitchState((prev) => ({
          ...prev,
          active: true,
          intensive: Math.random() > 0.7,
          offsets: characters.map(() => Math.random() * 20 - 10),
        }));

        setTimeout(() => {
          setGlitchState((prev) => ({
            ...prev,
            active: false,
            intensive: false,
          }));
        }, 120);

        setRandomData((prev) => ({
          ...prev,
          systemLoad: Math.floor(Math.random() * 100),
          spectrumValue: Math.floor(Math.random() * 100),
        }));
      });
    }, 4000);

    return () => {
      clearInterval(typingInterval);
      clearInterval(glitchInterval);
    };
  }, [characters, terminalFullText, prefersReducedMotion]);

  // Memoize pulse clicks rendering with theme colors
  const renderPulseClicks = useMemo(
    () => (
      <AnimatePresence>
        {pulseClicks.map((pulse) => {
          // Get the appropriate color name from theme system
          const colorKey = getColorByIndex(pulse.colorIndex);
          // Map to actual CSS variable name
          const pulseColor = colorKey === 'accent-primary' ? accentColors.primary :
                           colorKey === 'accent-secondary' ? accentColors.secondary :
                           colorKey === 'accent-warm' ? accentColors.warm :
                           accentColors.contrast;

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
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{
              opacity: 0,
              scale: [0, 0.5, 1, 1.5, 1.8],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="relative">
              <div
                className="absolute inset-0 w-20 h-20 rounded-full opacity-30"
                style={{ background: pulseColor }}
              ></div>
              <div
                className="w-40 h-40 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: pulse.colorIndex % 2 === 0 ? accentColors.oceanic : pulseColor }}
              >
                <div
                  className="w-30 h-30 rounded-full border"
                  style={{ borderColor: pulseColor }}
                ></div>
              </div>
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, rotate: 45 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  aria-hidden="true"
                >
                  <line
                    x1="30"
                    y1="0"
                    x2="30"
                    y2="60"
                    stroke={pulseColor}
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <line
                    x1="0"
                    y1="30"
                    x2="60"
                    y2="30"
                    stroke={pulseColor}
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="3"
                    fill={pulseColor}
                  />
                </svg>
              </motion.div>
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-bg-tooltip px-2 py-1 rounded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span
                  className="text-[10px] font-mono text-text-on-accent"
                  style={{ color: pulse.colorIndex % 2 === 0 ? accentColors.oceanic : pulseColor }}
                >
                  {`POS.X:${Math.floor(pulse.x * 100)} Y:${Math.floor(pulse.y * 100)}`}
                </span>
              </motion.div>
            </div>
          </motion.div>
        )})}
      </AnimatePresence>
    ),
    [pulseClicks, accentColors]
  );

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
        terminalText={terminalText}
        randomData={randomData}
        accentColors={accentColors}
      />

      {/* Only render pulse clicks if reduced motion is not preferred */}
      {!prefersReducedMotion && renderPulseClicks}

      {/* Improved container with responsive padding */}
      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">
        {/* Content grid with improved spacing */}
        <motion.div
          className="grid grid-cols-12 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 relative max-w-screen-2xl mx-auto w-full"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          {/* Headline with improved column placement */}
          <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2">
            <HomeHeroHeadline
              headline={headline}
              glitchActive={glitchState.active}
              intensiveGlitch={glitchState.intensive}
              glitchOffsets={glitchState.offsets}
              accentColors={accentColors}
            />
          </div>
          {/* Subheadline with improved responsive layout */}
          <div
            ref={subheadlineRef}
            className="col-span-12 md:col-span-8 md:col-start-4 lg:col-span-6 lg:col-start-6 xl:col-span-5 xl:col-start-7 mb-16"
          >
            <HomeHeroSubheadline
              subheadline={subheadline}
              isSubheadlineInView={isSubheadlineInView}
              randomData={randomData}
              accentColors={accentColors}
            />
          </div>
          {/* CTA with improved positioning */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 md:col-start-2 lg:col-start-3 xl:col-start-4">
            <HomeHeroCTA
              ctaText={ctaText}
              ctaLink={ctaLink}
              accentColors={accentColors}
            />
          </div>
          {/* Data visualization with better placement */}
          <div className="hidden lg:block col-span-3 col-start-9 xl:col-start-8 row-span-2">
            <HomeHeroDataViz
              mousePosition={mousePosition}
              randomData={randomData}
              accentColors={accentColors}
            />
          </div>
        </motion.div>

        {/* Measurements with proper spacing */}
        <div className="w-full max-w-screen-2xl mx-auto">
          <HomeHeroMeasurement accentColors={accentColors} />
        </div>
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

        .glitch-image-r {
          filter: brightness(1.2) sepia(0.3) hue-rotate(-50deg) saturate(3);
        }

        .glitch-image-g {
          filter: brightness(1.2) sepia(0.3) hue-rotate(50deg) saturate(3);
        }

        .glitch-hover {
          position: relative;
        }

        .glitch-hover:hover {
          animation: glitch-text 0.4s linear both infinite;
        }

        @keyframes glitch-text {
          0%,
          100% {
            transform: none;
            opacity: 1;
          }
          7% {
            transform: skew(-0.5deg, -0.9deg);
            opacity: 0.75;
          }
          30% {
            transform: skew(0.8deg, -0.1deg);
            opacity: 0.75;
          }
          55% {
            transform: skew(-1deg, 0.2deg);
            opacity: 0.75;
          }
          75% {
            transform: skew(0.4deg, 1deg);
            opacity: 0.75;
          }
        }

        .perspective-effect {
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .translate-z-0 {
          transform: translateZ(0px);
        }

        /* Theme-based color utilities */
        .accent-primary { color: var(--color-accent-primary); }
        .accent-secondary { color: var(--color-accent-secondary); }
        .accent-tertiary { color: var(--color-accent-tertiary); }
        .accent-warm { color: var(--color-accent-warm); }
        .accent-contrast { color: var(--color-accent-contrast); }
        .accent-oceanic { color: var(--color-accent-oceanic); }
        .accent-cosmic { color: var(--color-accent-cosmic); }

        .bg-accent-primary { background-color: var(--color-accent-primary); }
        .bg-accent-secondary { background-color: var(--color-accent-secondary); }
        .bg-accent-tertiary { background-color: var(--color-accent-tertiary); }
        .bg-accent-warm { background-color: var(--color-accent-warm); }
        .bg-accent-contrast { background-color: var(--color-accent-contrast); }
        .bg-accent-oceanic { background-color: var(--color-accent-oceanic); }
        .bg-accent-cosmic { background-color: var(--color-accent-cosmic); }

        @media (prefers-reduced-motion: reduce) {
          .glitch-hover:hover {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeHero;
