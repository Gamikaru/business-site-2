"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/classNames";
import { useAnimationPreferences } from "@/components/core/Animations";

interface WaveDividerProps {
  className?: string;
  height?: number;
  bgColor?: string;
  waveColor?: string;
  accentColor?: string;
  dataPointCount?: number;
}

const WaveDivider: React.FC<WaveDividerProps> = ({
  className,
  height = 120,
  bgColor = "var(--color-bg-secondary)",
  waveColor = "var(--color-bg-tertiary)",
  accentColor = "var(--wave-accent-1)",
  dataPointCount = 5
}) => {
  const { shouldAnimate } = useAnimationPreferences();
  const dividerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(dividerRef, { once: false, margin: "-10% 0px" });

  // For scroll-based wave movement
  const { scrollYProgress } = useScroll({
    target: dividerRef,
    offset: ["start end", "end start"]
  });

  // Wave animation values
  const wave1Offset = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const wave2Offset = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const wave3Offset = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Generate data points along the wave
  const dataPoints = Array.from({ length: dataPointCount }, (_, i) => ({
    id: i,
    x: 120 + (1200 / (dataPointCount - 1)) * i,
    y: 30 + (i % 3) * 20,
    delay: 0.4 + i * 0.1
  }));

  // Data flow particles
  const [particles, setParticles] = useState<Array<{id: number, path: number, progress: number}>>([]);

  // Generate flowing particles
  useEffect(() => {
    if (!shouldAnimate() || !isInView) return;

    // Create initial particles
    const initialParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      path: i % 3, // Which wave path to follow (0, 1, or 2)
      progress: Math.random() // Random starting position
    }));

    setParticles(initialParticles);

    // Animation interval for particles
    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(particle => ({
          ...particle,
          // Move particles along path and loop when they reach the end
          progress: particle.progress >= 1 ? 0 : particle.progress + (0.005 + Math.random() * 0.015)
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [shouldAnimate, isInView]);

  // Technical coordinates for measurement lines
  const measurementPoints = [
    { x: "20%", y: "30%", label: "A.30", side: "top" },
    { x: "50%", y: "60%", label: "B.60", side: "bottom" },
    { x: "80%", y: "40%", label: "C.40", side: "top" }
  ];

  return (
    <div
      ref={dividerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: `${height}px`, backgroundColor: bgColor }}
      aria-hidden="true"
    >
      {/* Background layer - solid fill */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/20 to-bg-secondary/20" />

      {/* Measurement grid lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
      >
        {/* Horizontal grid lines */}
        {[20, 40, 60, 80].map((y, i) => (
          <motion.line
            key={`h-line-${i}`}
            x1="0"
            y1={y}
            x2="1440"
            y2={y}
            stroke={accentColor}
            strokeWidth="0.5"
            strokeDasharray="4 6"
            strokeOpacity="0.15"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: isInView ? 0 : 100 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* Vertical grid lines */}
        {[240, 480, 720, 960, 1200].map((x, i) => (
          <motion.line
            key={`v-line-${i}`}
            x1={x}
            y1="0"
            x2={x}
            y2="120"
            stroke={accentColor}
            strokeWidth="0.5"
            strokeDasharray="4 8"
            strokeOpacity="0.15"
            initial={{ strokeDashoffset: 50 }}
            animate={{ strokeDashoffset: isInView ? 0 : 50 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>

      {/* Wave graphics */}
      <svg
        className="absolute w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wave 1 - bottom layer */}
        <motion.path
          d="M0,120 L0,60 C120,40 240,20 360,30 C480,40 600,80 720,90 C840,100 960,80 1080,70 C1200,60 1320,50 1380,45 L1440,40 L1440,120 L0,120 Z"
          fill={waveColor}
          fillOpacity="0.9"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isInView ? 0.9 : 0,
            y: isInView ? wave1Offset : 20
          }}
          transition={{ duration: 0.8 }}
        />

        {/* Wave 2 - middle layer */}
        <motion.path
          d="M0,120 L0,70 C120,90 240,110 360,100 C480,90 600,50 720,40 C840,30 960,50 1080,60 C1200,70 1320,80 1380,85 L1440,90 L1440,120 L0,120 Z"
          fill={waveColor}
          fillOpacity="0.7"
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: isInView ? 0.7 : 0,
            y: isInView ? wave2Offset : 30
          }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        {/* Wave 3 - top accent layer */}
        <motion.path
          d="M0,120 L0,85 C160,75 280,95 440,90 C600,85 680,65 840,60 C1000,55 1120,75 1280,80 C1360,82.5 1400,81.25 1440,80 L1440,120 L0,120 Z"
          fill={accentColor}
          fillOpacity="0.15"
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: isInView ? 0.15 : 0,
            y: isInView ? wave3Offset : 40
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Wave path outlines for technical effect */}
        <motion.path
          d="M0,60 C120,40 240,20 360,30 C480,40 600,80 720,90 C840,100 960,80 1080,70 C1200,60 1320,50 1380,45 L1440,40"
          fill="none"
          stroke={accentColor}
          strokeWidth="1"
          strokeOpacity="0.3"
          strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isInView ? 1 : 0,
            opacity: isInView ? 0.3 : 0
          }}
          transition={{ duration: 1.5, delay: 0.4 }}
        />

        <motion.path
          d="M0,70 C120,90 240,110 360,100 C480,90 600,50 720,40 C840,30 960,50 1080,60 C1200,70 1320,80 1380,85 L1440,90"
          fill="none"
          stroke={accentColor}
          strokeWidth="1"
          strokeOpacity="0.2"
          strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isInView ? 1 : 0,
            opacity: isInView ? 0.2 : 0
          }}
          transition={{ duration: 1.5, delay: 0.6 }}
        />
      </svg>

      {/* Technical measurement markers */}
      <svg
        className="absolute w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
      >
        {measurementPoints.map((point, i) => (
          <g key={`measurement-${i}`}>
            <motion.line
              x1={point.x}
              y1={point.side === "top" ? 0 : 120}
              x2={point.x}
              y2={point.y}
              stroke={accentColor}
              strokeWidth="1"
              strokeDasharray="2 2"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isInView ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.2 }}
            />
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill={accentColor}
              fillOpacity="0.7"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isInView ? 0.7 : 0,
                scale: isInView ? [0.8, 1.2, 1] : 0
              }}
              transition={{
                duration: 1,
                delay: 1 + i * 0.2,
                times: [0, 0.5, 1]
              }}
            />
            <motion.text
              x={point.x}
              y={point.side === "top" ? "12" : "108"}
              textAnchor="middle"
              fill={accentColor}
              fillOpacity="0.8"
              fontSize="8"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 0.8 : 0 }}
              transition={{ duration: 0.4, delay: 1.2 + i * 0.2 }}
            >
              {point.label}
            </motion.text>
          </g>
        ))}
      </svg>

      {/* Data point markers */}
      <svg
        className="absolute w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
      >
        {dataPoints.map((point) => (
          <g key={`data-point-${point.id}`}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={accentColor}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isInView ? [0.6, 0.9, 0.6] : 0,
                scale: isInView ? 1 : 0
              }}
              transition={{
                opacity: {
                  repeat: Infinity,
                  duration: 2,
                  delay: point.delay
                },
                scale: {
                  duration: 0.5,
                  delay: point.delay
                }
              }}
            />
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="transparent"
              stroke={accentColor}
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isInView ? [0.3, 0, 0.3] : 0,
                scale: isInView ? [0.5, 1.5, 0.5] : 0
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                delay: point.delay
              }}
            />
          </g>
        ))}
      </svg>

      {/* Flowing data particles along wave paths */}
      <svg
        className="absolute w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
      >
        {shouldAnimate() && isInView && particles.map(particle => {
          // Calculate position along the path based on progress
          const pathProgress = particle.progress;
          const x = pathProgress * 1440;

          // Calculate y position based on which wave path and the progress
          let y;
          if (particle.path === 0) {
            // Follow wave 1 path - rough approximation
            y = 60 - 20 * Math.sin(pathProgress * Math.PI * 2);
          } else if (particle.path === 1) {
            // Follow wave 2 path
            y = 70 - 30 * Math.sin(pathProgress * Math.PI * 2 + Math.PI);
          } else {
            // Follow wave 3 path
            y = 80 - 10 * Math.sin(pathProgress * Math.PI * 3);
          }

          return (
            <motion.circle
              key={`particle-${particle.id}`}
              cx={x}
              cy={y}
              r="2"
              fill={accentColor}
              fillOpacity={0.7 - (0.3 * (particle.path % 2))}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.2 }}
            />
          );
        })}
      </svg>

      {/* Technical coordinates readout */}
      <motion.div
        className="absolute bottom-2 right-4 text-[10px] font-mono text-wave-accent-1/70 bg-bg-glass/40 px-2 py-1 rounded"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
        transition={{ duration: 0.4, delay: 1.2 }}
      >
        WAVE.SECTION | Y.COORD 30-90
      </motion.div>
    </div>
  );
};

export default WaveDivider;