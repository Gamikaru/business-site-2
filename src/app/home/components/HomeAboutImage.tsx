// src/app/home/components/HomeAboutImage.tsx
'use client'

import React, { memo, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, MotionValue, useAnimation } from 'framer-motion'

interface AccentColors {
  primary: string
  secondary: string
  tertiary: string
  warm?: string
  contrast?: string
  oceanic?: string
  brand: string
}

interface TechValues {
  sectionRatio: number
  contentWidth: number
  imageScale: string
  gridDensity?: number
  renderQuality?: number
}

interface HomeAboutImageProps {
  imageSrc: string
  imageAlt: string
  isImageInView: boolean
  imageTranslateY: MotionValue<number>
  rotateValue: MotionValue<number>
  techValues: TechValues
  uniqueId: string
  isFlashing: boolean
  accentColors: AccentColors
}

const HomeAboutImage: React.FC<HomeAboutImageProps> = ({
  imageSrc,
  imageAlt,
  isImageInView,
  imageTranslateY,
  rotateValue,
  techValues,
  uniqueId,
  isFlashing,
  accentColors
}) => {
  // State for interactive elements
  const [isHovered, setIsHovered] = useState(false);
  const [highlightFeature, setHighlightFeature] = useState<string | null>(null);
  const imageControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [glitchActive, setGlitchActive] = useState(false);

  // Features/data points to highlight on the image
  const imageFeatures = [
    { id: 'problem-solver', x: 30, y: 25, label: 'PROBLEM SOLVER' },
    { id: 'tech-stack', x: 70, y: 60, label: 'TECH STACK' },
    { id: 'ai-specialist', x: 20, y: 75, label: 'AI SPECIALIST' },
    { id: 'educator', x: 75, y: 35, label: 'EDUCATOR' },
  ];

  // Enhance image on hover
  useEffect(() => {
    if (isHovered) {
      imageControls.start({
        filter: 'brightness(1.1) contrast(1.05)',
        scale: 1.03,
        transition: { duration: 0.5 }
      });
    } else {
      imageControls.start({
        filter: 'brightness(1) contrast(1)',
        scale: 1,
        transition: { duration: 0.5 }
      });
    }
  }, [isHovered, imageControls]);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200 + Math.random() * 300);
      }
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative perspective-distant transform-gpu"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHighlightFeature(null);
      }}
    >
      {/* Subtle grid background */}
      <motion.div
        className="absolute -inset-6 pointer-events-none overflow-hidden opacity-10 z-0"
        initial={{ opacity: 0 }}
        animate={isImageInView ? { opacity: 0.1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <defs>
            <pattern id={`${uniqueId}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="var(--color-grid-lines)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${uniqueId}-grid)`} />
        </svg>
      </motion.div>

      {/* Image container with enhanced 3D and framing */}
      <motion.div
        className="relative z-10 transform-gpu"
        style={{
          y: imageTranslateY,
          rotateY: rotateValue,
          transformStyle: 'preserve-3d'
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: isImageInView ? 1 : 0,
          y: isImageInView ? 0 : 40
        }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Angled container with polygon clip path */}
        <motion.div
          className="overflow-hidden"
          style={{
            clipPath: "polygon(0 0, 100% 4%, 96% 100%, 4% 96%)",
            boxShadow: isHovered
              ? `0 25px 50px rgba(0,0,0,0.25), 0 0 30px ${accentColors.primary}40`
              : `0 20px 40px rgba(0,0,0,0.2), 0 0 30px ${accentColors.primary}20`
          }}
          animate={{
            transition: { duration: 0.5 }
          }}
        >
          {/* Main image wrapper with effects */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* Effects container */}
            <div className="absolute inset-0 z-10">
              {/* Scanline effect */}
              <motion.div
                className="absolute left-0 right-0 h-[2px] opacity-30 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColors.primary}, transparent)`,
                }}
                animate={{
                  top: ["0%", "100%"],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }}
              />

              {/* CRT pixel effect overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence baseFrequency=%270.9%27 type=%27fractalNoise%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E')",
                  mixBlendMode: "overlay",
                  opacity: 0.05
                }}
              />
            </div>

            {/* Main image with animation */}
            <motion.div
              className="absolute inset-0"
              animate={imageControls}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className={`object-cover transition-all duration-300 ${glitchActive ? 'glitch-active' : ''}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
                quality={95}
              />

              {/* Glitch effect */}
              {glitchActive && (
                <>
                  <div
                    className="absolute inset-0 z-10 opacity-70"
                    style={{
                      backgroundImage: `url(${imageSrc})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transform: 'translate3d(2px, 0, 0)',
                      mixBlendMode: 'screen',
                      filter: 'hue-rotate(90deg)'
                    }}
                  />
                  <div
                    className="absolute inset-0 z-10 opacity-70"
                    style={{
                      backgroundImage: `url(${imageSrc})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transform: 'translate3d(-2px, 0, 0)',
                      mixBlendMode: 'screen',
                      filter: 'hue-rotate(-90deg)'
                    }}
                  />
                </>
              )}
            </motion.div>

            {/* Feature highlight overlays */}
            {isHovered && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                {imageFeatures.map((feature) => (
                  <React.Fragment key={feature.id}>
                    <motion.div
                      className="absolute w-16 h-16"
                      style={{
                        top: `${feature.y}%`,
                        left: `${feature.x}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: highlightFeature === feature.id ? 0.9 : 0.6,
                        scale: highlightFeature === feature.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3 }}
                      onMouseEnter={() => setHighlightFeature(feature.id)}
                      onMouseLeave={() => setHighlightFeature(null)}
                    >
                      <svg width="100%" height="100%" viewBox="0 0 64 64">
                        <circle
                          cx="32" cy="32" r="30"
                          fill="none"
                          stroke={accentColors.secondary}
                          strokeWidth="1"
                          strokeDasharray="3 2"
                          opacity="0.6"
                        />
                        <circle
                          cx="32" cy="32" r="2"
                          fill={accentColors.primary}
                        />
                        <text
                          x="32" y="44"
                          fill={accentColors.primary}
                          fontSize="4"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {feature.label}
                        </text>
                      </svg>
                    </motion.div>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Vignette border overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "inset 0 0 100px rgba(0,0,0,0.6)",
                mixBlendMode: "multiply"
              }}
            />

            {/* Interactive overlay on hover */}
            {isHovered && (
              <motion.div
                className="absolute inset-0 z-10 bg-gradient-to-bl from-primary-bg/60 via-transparent to-transparent backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>
        </motion.div>

        {/* Secondary decorative frame */}
        <motion.div
          className="absolute -bottom-3 -right-3 w-[90%] h-[90%] border border-accent-primary/20 -z-10"
          initial={{ opacity: 0, x: -10, y: -10 }}
          animate={{
            opacity: isImageInView ? 1 : 0,
            x: isImageInView ? 0 : -10,
            y: isImageInView ? 0 : -10
          }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />

        {/* Dynamic circuit decoration */}
        <motion.div
          className="absolute bottom-4 right-4 w-20 h-20 pointer-events-none -z-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isImageInView ? 0.7 : 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          aria-hidden="true"
        >
          <svg width="100%" height="100%" viewBox="0 0 80 80">
            <motion.path
              d="M0,40 C15,30 40,45 60,20 L80,0"
              stroke={accentColors.primary}
              strokeWidth="0.5"
              strokeDasharray="3 2"
              fill="none"
              strokeOpacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
            />

            {/* Animated data point along the circuit */}
            {isImageInView && (
              <motion.circle
                r="1.5"
                fill={accentColors.primary}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  offsetDistance: ["0%", "100%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                style={{
                  offsetPath: "path('M0,40 C15,30 40,45 60,20 L80,0')"
                }}
              />
            )}

            <motion.path
              d="M80,80 L60,60 L40,70 L20,50 L0,60"
              stroke={accentColors.secondary}
              strokeWidth="0.5"
              strokeDasharray="3 2"
              fill="none"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 1.2 }}
            />

            {/* Animated data point along the second circuit */}
            {isImageInView && (
              <motion.circle
                r="1.5"
                fill={accentColors.secondary}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  offsetDistance: ["0%", "100%"]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: 0.5
                }}
                style={{
                  offsetPath: "path('M80,80 L60,60 L40,70 L20,50 L0,60')"
                }}
              />
            )}
          </svg>
        </motion.div>
      </motion.div>

      {/* Enhance image effect with ambient light glow */}
      <motion.div
        className="absolute -inset-4 opacity-0 blur-lg"
        style={{
          background: `radial-gradient(circle at center, 
            ${accentColors.primary}10 0%, 
            ${accentColors.secondary}05 50%, 
            transparent 70%)`,
          mixBlendMode: "screen"
        }}
        animate={{ 
          opacity: isHovered ? 0.8 : 0.3,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 1 }}
      />

      {/* Glitch effect styles */}
      <style jsx global>{`
        .glitch-active {
          animation: glitch 0.2s steps(2) infinite;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          25% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 2px); }
          75% { transform: translate(3px, -3px); }
          100% { transform: translate(0); }
        }

        .perspective-distant {
          perspective: 1200px;
        }

        .transform-gpu {
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
};

export default memo(HomeAboutImage);