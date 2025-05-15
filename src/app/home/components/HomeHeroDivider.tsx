'use client'

import React, { memo, useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface AccentColors {
  primary: string;
  secondary: string;
  tertiary: string;
  brand: string;
  warm?: string;
  contrast?: string;
  oceanic?: string;
  cosmic?: string;
}

interface HomeHeroDividerProps {
  accentColors: AccentColors;
}

const HomeHeroDivider: React.FC<HomeHeroDividerProps> = ({ accentColors }) => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [uniqueId] = useState(() => `divider-${Math.floor(Math.random() * 10000)}`);

  // Scroll-based animations with enhanced ranges for more dynamic effects
  const { scrollYProgress } = useScroll({
    target: dividerRef,
    offset: ["start end", "end start"]
  });

  // Enhanced animated values based on scroll
  const wavePathOffset = useTransform(scrollYProgress, [0, 0.5], [0, 0.5]);
  const waveAmplitude = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);
  const waveOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3], [0, 1, 1]);
  const parallaxY = useTransform(scrollYProgress, [0, 0.8], ["0%", "30%"]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [0, 6]);
  const perspective = useTransform(scrollYProgress, [0, 0.5], [1000, 800]);

  // Detect when divider is in view with improved threshold
  useEffect(() => {
    if (!dividerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(dividerRef.current);
    return () => observer.disconnect();
  }, []);

  // Generate dynamic wave path based on scroll position
  const getWavePath = () => {
    const amplitude = waveAmplitude.get() * 25;
    return `M0,60
      C200,${60 + amplitude} 400,${60 - amplitude} 600,${60}
      C800,${60 + amplitude} 1000,${60 - amplitude} 1200,${60}
      L1200,120 L0,120 Z`;
  };

  return (
    <div
      ref={dividerRef}
      className="relative w-full overflow-hidden transform-gpu"
      style={{
        height: '160px',
        perspective: perspective.get(),
        transformStyle: 'preserve-3d'
      }}
      aria-hidden="true"
    >
      {/* Enhanced gradient background transition with semantic colors */}
      <motion.div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to bottom,
            var(--color-primary-bg) 0%,
            var(--color-tertiary-bg) 50%,
            var(--color-secondary-bg) 100%
          )`,
          y: parallaxY,
          rotateX
        }}
      />

      {/* Subtle noise texture overlay for richness */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence baseFrequency=%270.85%27 type=%27fractalNoise%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E')",
          mixBlendMode: "overlay"
        }}
      />

      {/* Main divider content with enhanced visuals */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: waveOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Create SVG defs for reusable gradients */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id={`${uniqueId}-wave-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent-tertiary)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="var(--color-accent-primary)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.3" />
            </linearGradient>

            <filter id={`${uniqueId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <linearGradient id={`${uniqueId}-line-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="var(--color-divider)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        {/* Main wave SVG with enhanced effects */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {/* Base wave with shadow */}
          <motion.path
            d={getWavePath()}
            fill="var(--color-secondary-bg)"
            style={{
              filter: 'drop-shadow(0 -8px 6px rgba(0,0,0,0.04))'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 30
            }}
            transition={{ duration: 0.8 }}
          />

          {/* Enhanced accent line with gradient */}
          <motion.path
            d="M0,60 C200,100 400,30 600,60 C800,90 1000,20 1200,60"
            fill="none"
            stroke={`url(#${uniqueId}-wave-gradient)`}
            strokeWidth="1.5"
            strokeDasharray="1 2"
            style={{
              pathOffset: wavePathOffset
            }}
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: isInView ? 1 : 0
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Secondary accent line - more subtle */}
          <motion.path
            d="M0,65 C250,35 450,85 650,55 C850,25 1050,75 1200,45"
            fill="none"
            stroke={accentColors.brand}
            strokeWidth="0.5"
            strokeOpacity="0.3"
            strokeDasharray="4 4"
            style={{
              pathOffset: useTransform(wavePathOffset, v => 1 - v).get()
            }}
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: isInView ? 1 : 0
            }}
            transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Dynamic accent dots along the wave - enhanced with different colors */}
          {[0.15, 0.3, 0.5, 0.7, 0.85].map((position, i) => {
            // Use different semantic colors for dots based on position
            const dotColor = i % 3 === 0 ? accentColors.primary :
                           i % 3 === 1 ? accentColors.secondary : accentColors.tertiary;

            const dotSize = i === 2 ? 3.5 : 2;
            const yPos = i % 2 === 0 ? 55 : 65;

            return (
              <motion.g key={`accent-dot-${i}`}>
                <motion.circle
                  cx={1200 * position}
                  cy={yPos}
                  r={dotSize}
                  fill={dotColor}
                  fillOpacity="0.7"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: isInView ? 1 : 0
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.7 + (i * 0.1)
                  }}
                />
                {/* Pulse effect for center dot */}
                {i === 2 && (
                  <motion.circle
                    cx={1200 * position}
                    cy={yPos}
                    r={dotSize + 3}
                    fill="none"
                    stroke={dotColor}
                    strokeWidth="0.5"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [0, 1.5, 2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1.2
                    }}
                  />
                )}
              </motion.g>
            );
          })}

          {/* Particle effects - subtle floating elements */}
          {[...Array(8)].map((_, i) => {
            const size = 1 + Math.random() * 2;
            const xPos = 200 + (i * 120) + (Math.random() * 80);
            const yPos = 30 + (Math.random() * 40);
            const particleColor = i % 4 === 0 ? accentColors.primary :
                               i % 4 === 1 ? accentColors.secondary :
                               i % 4 === 2 ? accentColors.tertiary : accentColors.brand;

            return (
              <motion.circle
                key={`particle-${i}`}
                cx={xPos}
                cy={yPos}
                r={size}
                fill={particleColor}
                fillOpacity="0.6"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isInView ? [0.2, 0.8, 0.2] : 0,
                  y: isInView ? [0, -15, 0] : 0
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            );
          })}
        </svg>

        {/* Enhanced gradient overlay with semantic color variables */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[100px]"
          style={{
            background: `linear-gradient(to bottom,
              transparent,
              var(--color-secondary-bg) 80%,
              var(--color-secondary-bg)
            )`
          }}
        />

        {/* Multiple decorative accent lines with varying opacity */}
        <div className="absolute left-0 right-0 bottom-0 flex flex-col items-center">
          {/* Primary divider line with gradient */}
          <motion.div
            className="h-[1px] w-[85%] max-w-[900px]"
            style={{
              background: `linear-gradient(to right,
                transparent, var(--color-divider) 20%,
                var(--color-border) 50%,
                var(--color-divider) 80%, transparent
              )`
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: isInView ? 1 : 0,
              opacity: isInView ? 0.7 : 0
            }}
            transition={{
              duration: 1.2,
              delay: 0.3
            }}
          />

          {/* Secondary thinner line */}
          <motion.div
            className="h-[1px] w-[60%] max-w-[700px] mt-4"
            style={{
              background: `linear-gradient(to right,
                transparent, var(--color-divider-light) 20%,
                var(--color-divider) 50%,
                var(--color-divider-light) 80%, transparent
              )`
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: isInView ? 1 : 0,
              opacity: isInView ? 0.5 : 0
            }}
            transition={{
              duration: 1,
              delay: 0.5
            }}
          />

          {/* Corner accents - geometric markers */}
          <div className="absolute bottom-[20px] left-[15%] opacity-70">
            <motion.div
              className="w-3 h-3"
              style={{
                borderLeft: `1px solid var(--color-accent-primary)`,
                borderBottom: `1px solid var(--color-accent-primary)`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 0.7 : 0 }}
              transition={{ delay: 0.7 }}
            />
          </div>

          <div className="absolute bottom-[20px] right-[15%] opacity-70">
            <motion.div
              className="w-3 h-3"
              style={{
                borderRight: `1px solid var(--color-accent-primary)`,
                borderBottom: `1px solid var(--color-accent-primary)`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 0.7 : 0 }}
              transition={{ delay: 0.7 }}
            />
          </div>
        </div>

        {/* Central accent glow - enhanced with color scheme */}
        <motion.div
          className="absolute left-1/2 top-[50px] w-[10px] h-[10px] rounded-full blur-[8px]"
          style={{
            background: `radial-gradient(
              circle at center,
              var(--color-accent-primary) 0%,
              ${accentColors.primary}80 40%,
              transparent 80%
            )`,
            transform: 'translateX(-50%)',
            filter: `drop-shadow(0 0 8px ${accentColors.primary}50)`
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isInView ? [0.4, 0.8, 0.4] : 0
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.8
          }}
        />

        {/* Animated scan line effect */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background: `linear-gradient(to right,
              transparent, var(--color-accent-primary) 50%, transparent
            )`,
            opacity: 0.3,
          }}
          animate={{
            y: [0, 120, 0],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* Technical measurement coordinates */}
      <motion.div
        className="absolute bottom-2 right-4 text-[8px] font-mono opacity-0 pointer-events-none"
        style={{ color: 'var(--color-tertiary-text)' }}
        animate={{
          opacity: isInView ? 0.6 : 0
        }}
        transition={{ delay: 1 }}
      >
        x:1200 y:120
      </motion.div>
    </div>
  )
}

export default memo(HomeHeroDivider)