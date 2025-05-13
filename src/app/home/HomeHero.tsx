"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { cn } from "@/utils/classNames";

// Import the split components
import HomeHeroBackground from "./components/HomeHeroBackground";
import HomeHeroHeadline from "./components/HomeHeroHeadline";
import HomeHeroSubheadline from "./components/HomeHeroSubheadline";
import HomeHeroCTA from "./components/HomeHeroCTA";
import HomeHeroDataViz from "./components/HomeHeroDataViz";
import HomeHeroDivider from "./components/HomeHeroDivider";
import HomeHeroMeasurement from "./components/HomeHeroMeasurement";

interface HomeHeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

// Define the pulse click interface
interface PulseClick {
  id: number;
  x: number;
  y: number;
  timestamp: number;
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
  // Split headline into individual characters for extreme animation control
  const characters = headline.split('');

  // Refs and scroll tracking
  const heroRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const isSubheadlineInView = useInView(subheadlineRef, { once: true });

  // Mouse position tracking with smoothing
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // New state for tracking click pulses
  const [pulseClicks, setPulseClicks] = useState<PulseClick[]>([]);
  const [pulseIdCounter, setPulseIdCounter] = useState(0);

  // Scroll-driven animations
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 0.5], ["0%", "50%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], ["0%", "-30%"]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 0.8, 0]);

  // Interactive grid tracking
  const gridX = useTransform(mouseX, [0, 1], [-5, 5]);
  const gridY = useTransform(mouseY, [0, 1], [-5, 5]);

  // Random values for glitch effect positions
  const [glitchOffsets, setGlitchOffsets] = useState<number[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [intensiveGlitch, setIntensiveGlitch] = useState(false);

  // Terminal text simulation
  const [terminalText, setTerminalText] = useState("");
  const terminalFullText = "> init system; loading profile; status: ready";

  // Random technical values for displays
  const [randomData, setRandomData] = useState({
    coordinates: { x: 0, y: 0 },
    spectrumValue: 0,
    systemLoad: 0,
  });

  // Handle mouse movement with momentum
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x, y });

    // Update technical displays with mouse data
    setRandomData(prev => ({
      ...prev,
      coordinates: {
        x: Math.floor(x * 100),
        y: Math.floor(y * 100)
      },
      spectrumValue: Math.floor(x * y * 100),
    }));
  };

  // New handler for mouse clicks
  const handleMouseClick = (e: React.MouseEvent) => {
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Create a new pulse at the click position
    const newPulse = {
      id: pulseIdCounter,
      x,
      y,
      timestamp: Date.now()
    };

    // Add the new pulse to the state and increment the counter
    setPulseClicks(prev => [...prev, newPulse]);
    setPulseIdCounter(prev => prev + 1);

    // Update technical readout for the click
    setRandomData(prev => ({
      ...prev,
      systemLoad: Math.floor(Math.random() * 100),
    }));

    // Trigger a mild glitch effect on clicks
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 150);
  };

  // Cleanup old pulse effects after animation completes
  useEffect(() => {
    if (pulseClicks.length === 0) return;

    const cleanup = setTimeout(() => {
      // Remove pulses older than 2 seconds
      const now = Date.now();
      setPulseClicks(prev => prev.filter(pulse => now - pulse.timestamp < 2000));
    }, 2000);

    return () => clearTimeout(cleanup);
  }, [pulseClicks]);

  // Initialize glitch positions and terminal text animation
  useEffect(() => {
    // Create random offsets for each character in headline
    setGlitchOffsets(characters.map(() => Math.random() * 10 - 5));

    // Terminal typing effect
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < terminalFullText.length) {
        setTerminalText(terminalFullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);

    // Periodic glitch effects
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      // Play glitch sound if audio is enabled
      // if (audio) audio.play().catch(e => console.log(e));

      // Randomly trigger intensive glitch
      if (Math.random() > 0.7) {
        setIntensiveGlitch(true);
        setTimeout(() => setIntensiveGlitch(false), 150);
      }

      setTimeout(() => setGlitchActive(false), 120);

      // Occasionally update random technical values
      setRandomData(prev => ({
        ...prev,
        systemLoad: Math.floor(Math.random() * 100),
        spectrumValue: Math.floor(Math.random() * 100),
      }));

      // Regenerate glitch offsets
      setGlitchOffsets(characters.map(() => Math.random() * 20 - 10));
    }, 4000);

    return () => {
      clearInterval(typingInterval);
      clearInterval(glitchInterval);
    };
  }, [characters.length, terminalFullText]);

  return (
    <section
      ref={heroRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onClick={handleMouseClick}
    >
      {/* Dynamic background effects */}
      <HomeHeroBackground
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        backgroundY={backgroundY}
        backgroundScale={backgroundScale}
        gridX={gridX}
        gridY={gridY}
        mousePosition={mousePosition}
        glitchActive={glitchActive}
        intensiveGlitch={intensiveGlitch}
        glitchOffsets={glitchOffsets}
        terminalText={terminalText}
        randomData={randomData}
      />

      {/* Click pulse effects */}
      <AnimatePresence>
        {pulseClicks.map(pulse => (
          <motion.div
            key={`pulse-${pulse.id}`}
            className="absolute pointer-events-none"
            style={{
              left: `${pulse.x * 100}%`,
              top: `${pulse.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20
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
            {/* Pulse circles */}
            <div className="relative">
              {/* Inner pulse circle */}
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-brand-primary opacity-30"></div>

              {/* Outer pulse ring */}
              <div className="w-40 h-40 rounded-full border-2 border-accent-oceanic flex items-center justify-center">
                <div className="w-30 h-30 rounded-full border border-accent-primary"></div>
              </div>

              {/* Technical crosshair */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, rotate: 45 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <line x1="30" y1="0" x2="30" y2="60" stroke="var(--color-accent-primary)" strokeWidth="1" strokeDasharray="2 3" />
                  <line x1="0" y1="30" x2="60" y2="30" stroke="var(--color-accent-primary)" strokeWidth="1" strokeDasharray="2 3" />
                  <circle cx="30" cy="30" r="3" fill="var(--color-brand-primary)" />
                </svg>
              </motion.div>

              {/* Technical data readout */}
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/60 px-2 py-1 rounded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-[10px] font-mono text-accent-oceanic">
                  {`POS.X:${Math.floor(pulse.x * 100)} Y:${Math.floor(pulse.y * 100)}`}
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 py-16">
        <motion.div
          className="grid grid-cols-12 gap-x-4 gap-y-8 relative"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          {/* Hero title with extreme character-by-character treatment */}
          <HomeHeroHeadline
            headline={headline}
            glitchActive={glitchActive}
            intensiveGlitch={intensiveGlitch}
            glitchOffsets={glitchOffsets}
          />

          {/* Subheadline with advanced styling */}
          <div ref={subheadlineRef} className="col-span-12 md:col-span-8 md:col-start-4 lg:col-span-6 lg:col-start-6 mb-16">
            <HomeHeroSubheadline
              subheadline={subheadline}
              isSubheadlineInView={isSubheadlineInView}
              randomData={randomData}
            />
          </div>

          {/* CTA with advanced brutalist styling */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 md:col-start-2">
            <HomeHeroCTA ctaText={ctaText} ctaLink={ctaLink} />
          </div>

          {/* Technical data visualization sidebar */}
          <div className="hidden lg:block col-span-3 col-start-9 row-span-2">
            <HomeHeroDataViz
              mousePosition={mousePosition}
              randomData={randomData}
            />
          </div>
        </motion.div>

        {/* Measurement ticks with animation */}
        <HomeHeroMeasurement />
      </div>

      {/* Extremely enhanced angled divider */}
      <HomeHeroDivider />

      {/* Advanced glitch effects and styles */}
      <style jsx global>{`
        /* Base glitch filter */
        .glitch-filter {
          clip-path: inset(0);
        }

        .glitch-filter::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          background-image: inherit;
          background-size: inherit;
          background-position: inherit;
          transform: translateX(5px);
          clip-path: inset(20% 0 40% 0);
          mix-blend-mode: overlay;
        }

        .glitch-filter::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          background-image: inherit;
          background-size: inherit;
          background-position: inherit;
          transform: translateX(-5px);
          clip-path: inset(60% 0 10% 0);
          mix-blend-mode: difference;
        }

        /* Intensive glitch class for more extreme effects */
        .intensive-glitch::before {
          transform: translateX(15px) skewX(5deg);
          filter: hue-rotate(90deg);
        }

        .intensive-glitch::after {
          transform: translateX(-10px) skewY(-5deg);
          filter: hue-rotate(-90deg) brightness(1.2);
        }

        /* Color channel separation */
        .glitch-image-r {
          filter: brightness(1.2) sepia(0.3) hue-rotate(-50deg) saturate(3);
        }

        .glitch-image-g {
          filter: brightness(1.2) sepia(0.3) hue-rotate(50deg) saturate(3);
        }

        /* Text hover effect */
        .glitch-hover {
          position: relative;
        }

        .glitch-hover:hover {
          animation: glitch-text 0.4s linear both infinite;
        }

        @keyframes glitch-text {
          0% {
            transform: none;
            opacity: 1;
          }
          7% {
            transform: skew(-0.5deg, -0.9deg);
            opacity: 0.75;
          }
          10% {
            transform: none;
            opacity: 1;
          }
          27% {
            transform: none;
            opacity: 1;
          }
          30% {
            transform: skew(0.8deg, -0.1deg);
            opacity: 0.75;
          }
          35% {
            transform: none;
            opacity: 1;
          }
          52% {
            transform: none;
            opacity: 1;
          }
          55% {
            transform: skew(-1deg, 0.2deg);
            opacity: 0.75;
          }
          50% {
            transform: none;
            opacity: 1;
          }
          72% {
            transform: none;
            opacity: 1;
          }
          75% {
            transform: skew(0.4deg, 1deg);
            opacity: 0.75;
          }
          80% {
            transform: none;
            opacity: 1;
          }
          100% {
            transform: none;
            opacity: 1;
          }
        }

        /* 3D perspective effects */
        .perspective-effect {
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .translate-z-0 {
          transform: translateZ(0px);
        }
      `}</style>
    </section>
  );
};

export default HomeHero;