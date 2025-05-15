"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { cn } from "@/utils/classNames";
import { BlueprintCorner } from "@/components/common/VisualInterest/BlueprintCorner";
import { TickStrip } from "@/components/common/Divider";
import { useAnimationPreferences } from "@/components/core/Animations";
import RichText from "@/components/common/Typography/RichText";
import { Heading } from "@/components/common/Typography";

interface PortfolioHeaderProps {
  heading: string;
  className?: string;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  heading,
  className,
}) => {
  // Animation preferences hook
  const { shouldAnimate } = useAnimationPreferences();

  // Refs and state
  const headerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [techData, setTechData] = useState({
    gridDensity: Math.floor(Math.random() * 20) + 30,
    renderQuality: Math.floor(Math.random() * 20) + 80,
    cpu: Math.floor(Math.random() * 30) + 40,
    memory: Math.floor(Math.random() * 40) + 30,
    systemStatus: "OPERATIONAL",
    debugMode: Math.random() > 0.5 ? "ENABLED" : "DISABLED",
  });
  const [isFlashing, setIsFlashing] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [uniqueId] = useState(`header-${Math.floor(Math.random() * 10000)}`);

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 0.5], ["0%", "10%"]);
  const gridX = useTransform(mouseX, [0, 1], [-5, 5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Split heading into lines
  const headingLines = heading.split("<br>");

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!headerRef.current) return;

    const rect = headerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x, y });
  };

  // Periodically update technical data
  useEffect(() => {
    if (!shouldAnimate()) return;

    const interval = setInterval(() => {
      setTechData(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 30) + 40,
        memory: Math.floor(Math.random() * 40) + 30,
        gridDensity: Math.floor(Math.random() * 20) + 30,
        renderQuality: Math.floor(Math.random() * 10) + 90,
      }));
    }, 3000);

    // Set content ready after a brief delay to ensure animations start properly
    const readyTimer = setTimeout(() => {
      setContentReady(true);
    }, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(readyTimer);
    };
  }, [shouldAnimate]);

  // Flash coordinates occasionally
  useEffect(() => {
    if (!shouldAnimate()) return;

    const flashInterval = setInterval(() => {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 150);
    }, 7000);

    return () => clearInterval(flashInterval);
  }, [shouldAnimate]);

  return (
    <motion.div
      ref={headerRef}
      className={cn(
        "relative h-[60vh] min-h-[450px] w-full overflow-hidden bg-bg-primary border-b-4 border-accent-primary",
        className
      )}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ opacity }}
    >
      {/* SVG filter for glitch effect */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id={`${uniqueId}-glitch`}>
            <feFlood floodColor="var(--color-accent-primary)" result="red" />
            <feFlood floodColor="var(--color-accent-oceanic)" result="blue" />
            <feComposite operator="in" in="red" in2="SourceAlpha" result="red-text" />
            <feComposite operator="in" in="blue" in2="SourceAlpha" result="blue-text" />
            <feOffset in="red-text" dx="-2" dy="0" result="red-text-moved" />
            <feOffset in="blue-text" dx="2" dy="0" result="blue-text-moved" />
            <feMerge>
              <feMergeNode in="red-text-moved" />
              <feMergeNode in="blue-text-moved" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Blueprint grid background */}
      <motion.div
        className="absolute inset-0 bg-blueprint-grid opacity-20"
        style={{
          y: backgroundY,
          x: gridX,
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.05]),
        }}
      />

      {/* Diagonal stripes - neobrutalist element */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -inset-[100px] bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,var(--color-accent-primary)_20px,var(--color-accent-primary)_22px)]"></div>
      </div>

      {/* Measurement lines */}
      <div className="absolute left-0 right-0 top-16 opacity-60">
        <TickStrip
          height={20}
          segments={21}
          labelEvery={5}
          darkLabels={true}
          glitchEffect={true}
        />
      </div>

      {/* Vertical measurement lines */}
      <div className="absolute left-12 top-0 bottom-0 opacity-60 w-px border-l border-accent-oceanic/40"></div>
      <div className="absolute right-12 top-0 bottom-0 opacity-60 w-px border-r border-accent-oceanic/40"></div>

      {/* Horizontal measurement lines */}
      <div className="absolute left-0 bottom-24 opacity-60 h-px w-20 border-t border-accent-oceanic/40"></div>
      <div className="absolute right-0 bottom-24 opacity-60 h-px w-20 border-t border-accent-oceanic/40"></div>

      {/* Blueprint corners - larger and more prominent */}
      <div className="absolute top-0 left-0 text-accent-primary/80">
        <BlueprintCorner size={60} />
      </div>
      <div className="absolute top-0 right-0 rotate-90 text-accent-primary/80">
        <BlueprintCorner size={60} />
      </div>
      <div className="absolute bottom-0 left-0 -rotate-90 text-accent-primary/80">
        <BlueprintCorner size={60} />
      </div>
      <div className="absolute bottom-0 right-0 rotate-180 text-accent-primary/80">
        <BlueprintCorner size={60} />
      </div>

      {/* Technical coordinates & system metrics */}
      <motion.div
        className={cn(
          "absolute top-4 left-4 text-xs font-mono flex items-center",
          isFlashing ? "text-accent-primary" : "text-accent-oceanic/70"
        )}
        animate={{
          opacity: isFlashing ? [0.7, 1, 0.7] : 0.7,
          filter: isFlashing ? `url(#${uniqueId}-glitch)` : 'none'
        }}
        transition={{ duration: 0.15, repeat: isFlashing ? 3 : 0 }}
      >
        <span className={cn(
          "inline-block h-2 w-2 rounded-full mr-2",
          isFlashing ? "bg-accent-primary animate-ping" : "bg-accent-oceanic/70"
        )} />
        <span>
          X:{Math.floor(mousePosition.x * 100).toString().padStart(3, '0')}&nbsp;
          Y:{Math.floor(mousePosition.y * 100).toString().padStart(3, '0')}
        </span>
      </motion.div>

      <div className="absolute top-4 right-4 text-xs font-mono text-accent-oceanic/70 flex items-center">
        <span>
          GRID/{techData.gridDensity} QUAL/{techData.renderQuality}
        </span>
        <span className="inline-block h-2 w-2 rounded-full ml-2 bg-accent-oceanic/70" />
      </div>

      {/* System metrics - redesigned with more neobrutalist style */}
      <motion.div
        className="absolute bottom-8 left-8 text-xs font-mono text-accent-oceanic/90 bg-bg-glass backdrop-blur-sm border-l-2 border-accent-oceanic/60 p-2"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <span>CPU: {techData.cpu}%</span>
          <div className="h-2 w-24 bg-bg-tertiary/40 overflow-hidden">
            <motion.div
              className="h-full bg-accent-oceanic/70"
              initial={{ width: 0 }}
              animate={{ width: `${techData.cpu}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span>MEM: {techData.memory}%</span>
          <div className="h-2 w-24 bg-bg-tertiary/40 overflow-hidden">
            <motion.div
              className="h-full bg-accent-oceanic/70"
              initial={{ width: 0 }}
              animate={{ width: `${techData.memory}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="text-accent-primary text-[8px]">DEBUG: {techData.debugMode}</span>
          <span className="text-[8px]">{new Date().toISOString().split('T')[0]}</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 right-8 text-xs font-mono text-accent-oceanic/90 bg-bg-glass backdrop-blur-sm border-r-2 border-accent-oceanic/60 p-2"
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="flex flex-col items-end">
          <span className="flex items-center">
            STATUS: <span className="text-accent-primary ml-1">{techData.systemStatus}</span>
            <motion.div
              className="h-2 w-2 rounded-full bg-accent-primary ml-2"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </span>
          <span className="mt-1">
            {new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </span>
        </div>
      </motion.div>

      {/* Content container */}
      <div className="container mx-auto h-full flex flex-col items-center justify-center px-4 relative z-10">
        {/* "Portfolio" label - editorial element */}
        <motion.div
          className="absolute top-20 left-1/2 transform -translate-x-1/2 text-sm font-mono uppercase tracking-wider text-accent-primary bg-bg-glass backdrop-blur-sm px-4 py-1"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: contentReady ? 0 : -20, opacity: contentReady ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Portfolio_Projects
        </motion.div>

        <div className="relative max-w-4xl">
          {/* Thick technical frame - neobrutalist element */}
          <motion.div
            className="absolute -inset-8 border-2 border-dashed border-accent-primary/30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: contentReady ? 0.6 : 0, scale: contentReady ? 1 : 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          {/* Technical elements above heading */}
          <motion.div
            className="absolute -top-16 -left-12 right-0 flex items-center gap-3 opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: contentReady ? 0.6 : 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="h-px w-8 bg-accent-oceanic/60"></div>
            <span className="text-[10px] font-mono text-accent-oceanic/90">SECTION.HEADER</span>
            <div className="h-px flex-1 bg-accent-oceanic/60"></div>
          </motion.div>

          {/* Heading container - editorial layout */}
          <div className="mb-4">
            {headingLines.map((line, index) => (
              <motion.div
                key={index}
                className="overflow-hidden relative mb-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: contentReady ? 1 : 0,
                  y: contentReady ? 0 : 30
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + index * 0.15,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
              >
                {/* Bold square behind text - neobrutalist element */}
                {index === 0 && (
                  <motion.div
                    className="absolute -left-4 top-0 w-8 h-12 bg-accent-primary z-0"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: contentReady ? 0.8 : 0, x: contentReady ? 0 : -10 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  />
                )}

                <Heading
                  level={1}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-heading rich-text-heading relative z-10"
                >
                  <RichText content={line} />
                </Heading>
              </motion.div>
            ))}
          </div>

          {/* Technical elements below heading */}
          <motion.div
            className="absolute -bottom-8 -right-8 flex items-center opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: contentReady ? 0.7 : 0 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            <span className="text-[10px] font-mono text-accent-oceanic mr-2">{techData.gridDensity}.REV</span>
            <div className="h-px w-20 bg-accent-oceanic/60"></div>
          </motion.div>
        </div>
      </div>

      {/* Add CSS for rich text highlight styling */}
      <style jsx global>{`
        .rich-text-heading strong {
          color: var(--color-accent-primary);
          font-weight: 700;
          position: relative;
        }
        .rich-text-heading em {
          color: var(--color-accent-oceanic);
          font-style: normal;
          position: relative;
        }
        .rich-text-heading .text-emphasis {
          color: var(--color-accent-primary);
          position: relative;
        }
        .rich-text-heading span.highlight {
          position: relative;
        }
        .rich-text-heading span.highlight::after {
          content: '';
          position: absolute;
          bottom: 0.1em;
          left: 0;
          width: 100%;
          height: 0.2em;
          background-color: var(--color-accent-primary);
          z-index: -1;
        }
        .rich-text-heading strong::after,
        .rich-text-heading .text-emphasis::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0.15em;
          background-color: var(--color-accent-primary);
          z-index: -1;
        }
      `}</style>

      {/* Multiple scan line effects - creating more technical aesthetic */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-accent-oceanic/10 pointer-events-none"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 5
        }}
      />

      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-accent-primary/20 pointer-events-none"
        initial={{ top: '20%' }}
        animate={{ top: '120%' }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2
        }}
      />
    </motion.div>
  );
};

export default PortfolioHeader;