"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/classNames";
import { useAnimationPreferences } from "@/components/core/Animations";

interface SoundWaveDividerProps {
  className?: string;
  height?: number;
  color?: string;
  accentColor?: string;
  frequency?: "low" | "medium" | "high";
  showTechnicalReadouts?: boolean;
}

const SoundWaveDivider: React.FC<SoundWaveDividerProps> = ({
  className,
  height = 140,
  color,
  accentColor,
  frequency = "medium",
  showTechnicalReadouts = true,
}) => {
  const { shouldAnimate, getIntensity } = useAnimationPreferences();
  const dividerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(dividerRef, { once: false, margin: "-10% 0px" });
  const [uniqueId] = useState(`wave-${Math.floor(Math.random() * 10000)}`);
  const [amplitude, setAmplitude] = useState(0.8);
  const [pulseActive, setPulseActive] = useState(false);

  // Generate random technical values
  const [audioMetrics] = useState({
    frequency: Math.floor(Math.random() * 300) + 100,
    amplitude: Math.floor(Math.random() * 60) + 40,
    signalQuality: Math.floor(Math.random() * 30) + 70,
    channelDepth: Math.floor(Math.random() * 16) + 16,
    sampleRate: (Math.floor(Math.random() * 4) + 4) * 11025,
  });

  // Determine the number of bars based on frequency setting
  const getBarsCount = () => {
    switch (frequency) {
      case "low": return 30;
      case "high": return 90;
      case "medium":
      default: return 60;
    }
  };

  const barsCount = getBarsCount();

  // Calculate bar multipliers with varying patterns for realistic audio visualization
  const getBarHeights = () => {
    const heights = [];
    // Create a few sine waves with different frequencies
    for (let i = 0; i < barsCount; i++) {
      // Combine multiple sine waves for more realistic audio look
      const height = Math.sin(i * 0.2) * 0.5 +
                     Math.sin(i * 0.3) * 0.3 +
                     Math.sin(i * 0.1) * 0.2 +
                     // Add some constrained randomness
                     (Math.random() * 0.3 - 0.15);

      // Normalize to 0.0-1.0 range
      heights.push((height + 1) / 2);
    }
    return heights;
  };

  const barHeights = getBarHeights();

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: dividerRef,
    offset: ["start end", "end start"],
  });

  const waveOffset = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const waveOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);
  const rippleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  // Generate the fill and accent colors - either from props or using CSS variables
  const waveColor = color || "var(--wave-accent-1)"; // Changed from --color-accent-oceanic
  const waveFillColor = accentColor || "var(--wave-accent-2)"; // Changed from --color-accent-cosmic

  // Periodically update amplitude for animation effect
  useEffect(() => {
    if (!shouldAnimate() || !isInView) return;

    const interval = setInterval(() => {
      // Fix: Use prev parameter and apply intensity factor
      setAmplitude(prev => {
        // Apply the animation intensity to the amplitude variation
        const intensityFactor = getIntensity(1);
        const variationRange = 0.5 * intensityFactor;
        return 0.5 + Math.random() * variationRange;
      });

      // Occasionally trigger a pulse effect
      if (Math.random() > 0.7) {
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 800);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [shouldAnimate, isInView, getIntensity]);

  return (
    <div
      ref={dividerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      {/* SVG definitions */}
      <svg width="0" height="0">
        <defs>
          {/* Gradient for wave fills */}
          <linearGradient id={`${uniqueId}-wave-gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={waveColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={waveFillColor} stopOpacity="0.2" />
          </linearGradient>

          {/* Filter for glow effect */}
          <filter id={`${uniqueId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Enhanced glow for pulse effect */}
          <filter id={`${uniqueId}-pulse-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
            <feColorMatrix type="matrix" values="1 0 0 0 0.1  0 1 0 0 0.4  0 0 1 0 0.9  0 0 0 2 0" />
          </filter>
        </defs>
      </svg>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary via-bg-secondary to-bg-primary opacity-90" />

      {/* Sound wave bars visualization */}
      <motion.svg
        className="absolute w-full h-full"
        preserveAspectRatio="none"
        viewBox={`0 0 ${barsCount * 20} 100`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: waveOpacity as any }}
      >
        {/* Frequency ruler markers */}
        <line x1="0" y1="50" x2="100%" y2="50" stroke={waveColor} strokeDasharray="4,4" strokeWidth="0.5" strokeOpacity="0.5" />

        {/* Frequency markers */}
        {[0, 25, 50, 75, 100].map(percent => (
          <g key={`marker-${percent}`}>
            <line
              x1={`${percent}%`}
              y1="45"
              x2={`${percent}%`}
              y2="55"
              stroke={waveColor}
              strokeWidth="0.5"
              strokeOpacity="0.7"
            />
            <text
              x={`${percent}%`}
              y="42"
              fontSize="4"
              fontFamily="monospace"
              fill={waveColor}
              textAnchor="middle"
              opacity="0.8"
            >
              {percent === 0 ? "0Hz" : `${percent}%`}
            </text>
          </g>
        ))}

        {/* Dynamic audio bars */}
        {barHeights.map((heightMultiplier, i) => {
          // Calculate dynamic height based on position and amplitude
          const effectiveHeight = 70 * heightMultiplier * amplitude;
          const delay = 0.01 * (i % (barsCount / 3));

          return (
            <motion.rect
              key={`bar-${i}`}
              x={i * (1200 / barsCount)}
              y={50 - effectiveHeight / 2}
              width={Math.max(1, (1200 / barsCount) * 0.6)}
              height={effectiveHeight}
              fill={waveColor}
              fillOpacity={0.1 + (heightMultiplier * 0.6)}
              initial={{ scaleY: 0 }}
              animate={{
                scaleY: isInView ? 1 : 0,
                // Enhanced pulsing effect with variation
                opacity: pulseActive && i % (frequency === "high" ? 3 : frequency === "low" ? 5 : 4) === 0
                  ? [0.2, 1, 0.2]
                  : undefined
              }}
              transition={{
                duration: 0.4,
                delay: delay,
                opacity: { duration: 0.8, ease: "easeInOut" }
              }}
              style={{ transformOrigin: "center" }}
            />
          );
        })}
      </motion.svg>

      {/* Animated waveform ripple effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: waveOffset,
          scale: rippleScale
        }}
      >
        <svg
          className="absolute w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 100"
        >
          {/* Main wave oscillations - multiple layers for depth */}
          {[
            { delay: 0.2, opacity: 0.6, offset: 0 },
            { delay: 0.4, opacity: 0.4, offset: 5 },
            { delay: 0.6, opacity: 0.25, offset: -5 }
          ].map((wave, index) => (
            <motion.path
              key={`wave-${index}`}
              d={`M0,${50 + wave.offset} Q300,${20 + wave.offset * 1.5} 600,${50 + wave.offset} T1200,${50 + wave.offset}`}
              stroke={index === 0 ? waveColor : waveFillColor}
              strokeWidth={3 - index * 0.5}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: isInView ? 1 : 0,
                opacity: isInView ? wave.opacity : 0,
                filter: pulseActive && index === 0
                  ? `url(#${uniqueId}-${index === 0 ? 'pulse-glow' : 'glow'})`
                  : 'none'
              }}
              transition={{
                duration: 1.5,
                delay: wave.delay,
                filter: { duration: 0.3 }
              }}
            />
          ))}

          {/* Enhanced waveform fill areas with animated behavior */}
          <motion.path
            d="M0,50 Q300,15 600,50 T1200,50 L1200,100 L0,100 Z"
            fill={`url(#${uniqueId}-wave-gradient)`}
            fillOpacity="0.2"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isInView ? [0.1, 0.2, 0.15] : 0,
              y: isInView ? [0, 2, 0] : 0
            }}
            transition={{
              duration: 3,
              delay: 0.3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </svg>
      </motion.div>

      {/* Audio measurement readouts */}
      {showTechnicalReadouts && (
        <AnimatePresence>
          {isInView && (
            <>
              {/* Left technical readout */}
              <motion.div
                className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] font-mono text-wave-accent-1 bg-bg-glass backdrop-blur-sm px-2 py-1 rounded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.9, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex flex-col">
                  <span>FREQ: {audioMetrics.frequency}Hz</span>
                  <span>AMP: {Math.round(amplitude * 100)}%</span>
                </div>
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-wave-accent-1"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1, 0.8],
                    boxShadow: pulseActive ? ['0 0 0px rgba(var(--wave-accent-1-rgb), 0)', '0 0 5px rgba(var(--wave-accent-1-rgb), 0.8)', '0 0 0px rgba(var(--wave-accent-1-rgb), 0)'] : undefined
                  }}
                  transition={{
                    duration: pulseActive ? 0.8 : 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </motion.div>

              {/* Right technical readout */}
              <motion.div
                className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-mono text-accent-cosmic bg-bg-glass backdrop-blur-sm px-2 py-1 rounded"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.9, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-accent-cosmic"
                  animate={{
                    opacity: pulseActive ? [0.4, 1, 0.4] : [0.4, 0.6, 0.4],
                    scale: pulseActive ? [0.8, 1.2, 0.8] : [0.8, 1, 0.8],
                    boxShadow: pulseActive ? ['0 0 0px rgba(180, 100, 255, 0)', '0 0 5px rgba(180, 100, 255, 0.8)', '0 0 0px rgba(180, 100, 255, 0)'] : undefined
                  }}
                  transition={{
                    duration: pulseActive ? 0.8 : 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <div className="flex flex-col">
                  <span>SAMPLE: {audioMetrics.sampleRate / 1000}kHz</span>
                  <span>BIT: {audioMetrics.channelDepth}bit</span>
                </div>
              </motion.div>

              {/* Center technical label with enhanced animation */}
              <motion.div
                className="absolute top-4 left-1/2 transform -translate-x-1/2 text-[10px] font-mono text-accent-primary bg-bg-glass backdrop-blur-sm px-2 py-1 rounded"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 0.9,
                  y: 0,
                  boxShadow: pulseActive
                    ? ['0 0 0px rgba(255, 255, 255, 0)', '0 0 8px rgba(255, 255, 255, 0.3)', '0 0 0px rgba(255, 255, 255, 0)']
                    : undefined
                }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.5,
                  delay: 1,
                  boxShadow: {
                    duration: 0.8,
                    repeat: pulseActive ? 2 : 0
                  }
                }}
              >
                <motion.span
                  animate={{
                    color: pulseActive
                      ? ['var(--color-accent-primary)', 'var(--wave-accent-1)', 'var(--color-accent-primary)']
                      : undefined
                  }}
                  transition={{ duration: 0.8 }}
                >
                  AUDIO.PATTERN/{frequency.toUpperCase()}
                </motion.span>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Fill color for bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-bg-primary"></div>
    </div>
  );
};

export default SoundWaveDivider;