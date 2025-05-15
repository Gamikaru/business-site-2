// app/services/dividers/WaveDivider.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useAnimationPreferences } from "@/components/core/Animations";
import { cn } from "@/utils/classNames";

interface WaveDividerProps {
  height?: number;
  bgTop?: string;
  bgBottom?: string;
  waveColor?: string;
  accentColor?: string;
  className?: string;
  complexity?: "low" | "medium" | "high";
  invertY?: boolean;
  showGrid?: boolean;
}

const WaveDivider: React.FC<WaveDividerProps> = ({
  height = 120,
  bgTop = "var(--color-bg-primary)",
  bgBottom = "var(--color-bg-secondary)",
  waveColor = "var(--color-accent-primary)",
  accentColor = "var(--color-accent-oceanic)",
  className,
  complexity = "medium",
  invertY = false,
  showGrid = true,
}) => {
  const { shouldAnimate } = useAnimationPreferences();
  const dividerRef = useRef<HTMLDivElement>(null);
  const [uniqueId] = useState(`wave-${Math.floor(Math.random() * 10000)}`);
  const [randomData] = useState({
    waveFrequency: Math.floor(Math.random() * 5) + 2,
    waveAmplitude: Math.floor(Math.random() * 10) + 15,
    gridSize: Math.floor(Math.random() * 10) + 20,
    technicalNum: Math.floor(Math.random() * 9000) + 1000,
  });

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: dividerRef,
    offset: ["start end", "end start"],
  });

  // Wave animation parameters
  const waveCount = complexity === "low" ? 1 : complexity === "high" ? 3 : 2;
  const pathOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);

  // Parallax effects
  const wave1Offset = useTransform(
    scrollYProgress,
    [0, 1],
    invertY ? [10, -10] : [-10, 10]
  );
  const wave2Offset = useTransform(
    scrollYProgress,
    [0, 1],
    invertY ? [5, -15] : [-15, 5]
  );
  const wave3Offset = useTransform(
    scrollYProgress,
    [0, 1],
    invertY ? [15, -5] : [-5, 15]
  );

  // Spring for smoother motion
  const springConfig = { stiffness: 100, damping: 30 };
  const smoothWave1 = useSpring(wave1Offset, springConfig);
  const smoothWave2 = useSpring(wave2Offset, springConfig);
  const smoothWave3 = useSpring(wave3Offset, springConfig);

  // Generate wave paths with randomness
  const generateWavePath = (
    amplitude: number,
    frequency: number,
    yOffset: number = 0
  ): string => {
    const basePath = `M0,${height / 2 + yOffset} `;
    const points = 10; // Control points along the wave
    const width = 1000; // SVG viewBox width

    let path = basePath;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;

      // Add some controlled randomness to amplitude
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const adjustedAmplitude = amplitude * randomFactor;

      // Calculate y position using sine wave with random phase shift
      const y =
        height / 2 +
        Math.sin((i / points) * Math.PI * frequency + Math.random() * 0.2) *
          adjustedAmplitude +
        yOffset;

      // Add a curve point
      if (i === 0) {
        path += `C${x},${y} `;
      } else {
        path += `${x},${y} `;
      }
    }

    return path;
  };

  // Generate horizontal measurement ticks
  const generateMeasurementTicks = () => {
    const ticks = [];
    const tickCount = 10;

    for (let i = 0; i <= tickCount; i++) {
      const x = (i / tickCount) * 100;
      ticks.push(
        <React.Fragment key={`tick-${i}`}>
          <line
            x1={`${x}%`}
            y1="0"
            x2={`${x}%`}
            y2={i % 2 === 0 ? "6" : "4"}
            stroke={accentColor}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          {i % 2 === 0 && (
            <text
              x={`${x}%`}
              y="12"
              fontSize="4"
              fontFamily="monospace"
              fill={accentColor}
              textAnchor="middle"
              opacity="0.5"
            >
              {x}
            </text>
          )}
        </React.Fragment>
      );
    }

    return ticks;
  };

  // Dynamically calculate wave paths
  const [wavePaths, setWavePaths] = useState<string[]>([]);

  useEffect(() => {
    // Generate wave paths with slight variations
    const baseAmplitude = randomData.waveAmplitude;
    const baseFrequency = randomData.waveFrequency;

    const paths = [];
    paths.push(generateWavePath(baseAmplitude, baseFrequency));

    if (waveCount >= 2) {
      paths.push(
        generateWavePath(baseAmplitude * 0.7, baseFrequency * 1.3, -8)
      );
    }

    if (waveCount >= 3) {
      paths.push(
        generateWavePath(baseAmplitude * 0.5, baseFrequency * 0.8, 12)
      );
    }

    setWavePaths(paths);
  }, [waveCount, randomData.waveAmplitude, randomData.waveFrequency]);

  return (
    <div
      ref={dividerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        height: `${height}px`,
        background: invertY ? bgBottom : bgTop,
      }}
      aria-hidden="true"
    >
      {/* SVG filters */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient
            id={`${uniqueId}-wave-gradient`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={waveColor} stopOpacity="1" />
            <stop offset="50%" stopColor={accentColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={waveColor} stopOpacity="1" />
          </linearGradient>

          <filter
            id={`${uniqueId}-wave-glow`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* Fill color for bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 z-0"
        style={{
          height: "50%",
          background: invertY ? bgTop : bgBottom,
        }}
      />

      {/* Technical grid background */}
      {showGrid && (
        <div className="absolute inset-0 bg-blueprint-grid opacity-5 mix-blend-overlay" />
      )}

      {/* Technical measurement ticks */}
      <svg
        className="absolute top-0 left-0 w-full"
        height="15"
        preserveAspectRatio="none"
      >
        {generateMeasurementTicks()}
      </svg>

      {/* Waves SVG */}
      <svg
        className="absolute w-full h-full"
        preserveAspectRatio="none"
        viewBox={`0 0 1000 ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Technical coordinate system */}
        <line
          x1="0"
          y1={height / 2}
          x2="1000"
          y2={height / 2}
          stroke={accentColor}
          strokeWidth="0.5"
          strokeOpacity="0.2"
          strokeDasharray="4 4"
        />

        {/* Wave paths with parallax */}
        {wavePaths.length > 0 && (
          <>
            {/* Wave 1 - primary */}
            <motion.path
              d={wavePaths[0]}
              stroke={waveColor}
              strokeWidth="2"
              fill="none"
              style={{
                opacity: pathOpacity,
                y: smoothWave1,
              }}
            />

            {/* Fill below primary wave */}
            <motion.path
              d={`${wavePaths[0]} L1000,${height} L0,${height} Z`}
              fill={waveColor}
              fillOpacity="0.05"
              style={{ y: smoothWave1 }}
            />

            {/* Wave 2 - if enabled */}
            {waveCount >= 2 && wavePaths[1] && (
              <motion.path
                d={wavePaths[1]}
                stroke={accentColor}
                strokeWidth="1.5"
                strokeDasharray="1 2"
                fill="none"
                style={{
                  opacity: pathOpacity,
                  y: smoothWave2,
                }}
              />
            )}

            {/* Wave 3 - if enabled */}
            {waveCount >= 3 && wavePaths[2] && (
              <motion.path
                d={wavePaths[2]}
                stroke={`url(#${uniqueId}-wave-gradient)`}
                strokeWidth="1"
                fill="none"
                style={{
                  opacity: pathOpacity,
                  y: smoothWave3,
                  filter: shouldAnimate()
                    ? `url(#${uniqueId}-wave-glow)`
                    : "none",
                }}
              />
            )}
          </>
        )}

        {/* Technical data points along the wave */}
        {shouldAnimate() && wavePaths.length > 0 && (
          <>
            {[0.2, 0.5, 0.8].map((pos, i) => (
              <motion.circle
                key={`point-${i}`}
                cx={1000 * pos}
                cy={height / 2}
                r="3"
                fill={i % 2 === 0 ? waveColor : accentColor}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  y: smoothWave1,
                }}
                transition={{
                  opacity: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.7,
                  },
                }}
              />
            ))}
          </>
        )}
      </svg>

      {/* Technical data readouts */}
      <motion.div
        className="absolute top-2 right-4 text-[10px] font-mono bg-bg-glass/50 backdrop-blur-sm px-2 py-1"
        style={{ color: accentColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        WAVE/{randomData.waveFrequency}.{randomData.waveAmplitude}
      </motion.div>

      <motion.div
        className="absolute bottom-2 left-4 text-[10px] font-mono bg-bg-glass/50 backdrop-blur-sm px-2 py-1"
        style={{ color: waveColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        SECTION/{randomData.technicalNum}
      </motion.div>
    </div>
  );
};

export default WaveDivider;
