// src/app/home/components/subheadline/effects/BoxParticles.tsx
'use client'

import React, { memo, useMemo, useEffect, useRef } from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { AccentColors, ParticleConfig } from '../SubheadlineTypes';
import { useAnimationPreferences } from '@/components/core/Animations';

interface BoxParticlesProps {
  index: number;
  isFinalBox: boolean;
  accentColors: AccentColors;
  isActive: boolean;
  isHovered?: boolean;
}

// Custom shapes for particles
const particleShapes = {
  triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
  diamond: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  pentagon: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  hexagon: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  cross: "polygon(33% 0%, 66% 0%, 66% 33%, 100% 33%, 100% 66%, 66% 66%, 66% 100%, 33% 100%, 33% 66%, 0% 66%, 0% 33%, 33% 33%)",
  dot: "circle(50% at 50% 50%)",
  square: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  line: "polygon(0% 40%, 100% 40%, 100% 60%, 0% 60%)",
  dataNode: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)"
};

// Technical symbols for data-like particles
const technicalSymbols = ['01', '10', '00', '11', '///', '|||', '[ ]', '{ }', '< >', '++', '--'];

// Generate particle system configuration
const useParticleSystem = (
  index: number,
  count: number,
  isFinalBox: boolean,
  accentColors: AccentColors,
  animationIntensity: number = 1,
  isHovered: boolean = false
): {
  particles: ParticleConfig[];
  technicalParticles: {
    id: string;
    symbol: string;
    x: string;
    y: string;
    rotation: number;
    color: string;
    scale: number;
    duration: number;
    delay: number;
  }[];
  emitters: {
    id: string;
    x: string;
    y: string;
    color: string;
    rate: number;
  }[];
} => {
  return useMemo(() => {
    // Create unique color palettes for each box
    const colorPalettes = [
      // Box 0 palette (primary focused)
      [accentColors.primary, accentColors.primary, accentColors.secondary, accentColors.tertiary],
      // Box 1 palette (secondary focused)
      [accentColors.secondary, accentColors.secondary, accentColors.primary, accentColors.oceanic || accentColors.brand],
      // Box 2 palette (tertiary focused)
      [accentColors.tertiary, accentColors.tertiary, accentColors.warm || accentColors.brand, accentColors.primary],
      // Box 3 palette (mixed with emphasis on brand)
      [accentColors.brand, accentColors.primary, accentColors.secondary, accentColors.tertiary]
    ];

    // Select palette based on box index
    const palette = colorPalettes[Math.min(index, colorPalettes.length - 1)];

    // Enhanced particles with more variety
    const particles: ParticleConfig[] = Array.from({ length: count }).map((_, i) => {
      const colorIndex = (i + index) % palette.length;
      const color = palette[colorIndex];

      // Determine type of particle - more variety when hovered
      const particleTypeRoll = Math.random() * 100;

      // Size pattern generation - different for each box to create distinction
      const patternSeed = (index + 1) * 0.2;
      const patternOffset = (i % 5) * 0.15;
      const sizeFactor = 0.6 + Math.sin(patternSeed + patternOffset) * 0.4;

      // Box-specific particle size variations
      const sizeMultiplier = isFinalBox ? 1.5 : 1.0;
      const hoverSizeFactor = isHovered ? 1.2 : 1.0;

      // More diverse size range
      const baseSize = 1 + (i % 5) * 0.8 * sizeFactor;
      const randomFactor = isHovered ? (Math.random() * 1.5) : (Math.random() * 0.8);
      const size = (baseSize + randomFactor) * sizeMultiplier * hoverSizeFactor;

      // Pattern-based movement for more interesting effects
      // Each box has a different dominant movement pattern
      let xMovement = 0;
      let yMovement = 0;

      // Generate interesting movement patterns based on box index
      const angle = (index * 30 + i * 20) * (Math.PI / 180);
      const distance = 15 + (i % 3) * 10;

      // Pattern 1: Circular-ish
      if (index === 0) {
        xMovement = Math.cos(angle) * distance * animationIntensity;
        yMovement = Math.sin(angle) * distance * animationIntensity;
      }
      // Pattern 2: Expanding outward
      else if (index === 1) {
        const direction = (i % 8) * 45 * (Math.PI / 180);
        xMovement = Math.cos(direction) * distance * animationIntensity;
        yMovement = Math.sin(direction) * distance * animationIntensity;
      }
      // Pattern 3: Converging/Diverging
      else if (index === 2) {
        const phase = i % 2 === 0 ? 1 : -1;
        xMovement = phase * (10 + (i % 3) * 10) * animationIntensity;
        yMovement = (i % 2 === 0 ? -1 : 1) * (15 + (i % 3) * 5) * animationIntensity;
      }
      // Pattern 4: Complex flow (for final box)
      else {
        // Create a data-flow like pattern
        const flowDirection = Math.floor(i / 3) % 4;
        if (flowDirection === 0) {
          xMovement = (15 + (i % 5) * 8) * animationIntensity;
          yMovement = ((i % 3) - 1) * 10 * animationIntensity;
        } else if (flowDirection === 1) {
          xMovement = ((i % 3) - 1) * 10 * animationIntensity;
          yMovement = (15 + (i % 5) * 8) * animationIntensity;
        } else if (flowDirection === 2) {
          xMovement = (-15 - (i % 5) * 8) * animationIntensity;
          yMovement = ((i % 3) - 1) * 10 * animationIntensity;
        } else {
          xMovement = ((i % 3) - 1) * 10 * animationIntensity;
          yMovement = (-15 - (i % 5) * 8) * animationIntensity;
        }
      }

      // Determine shape based on pattern and randomness
      let shape: string;

      if (particleTypeRoll < 30) { // 30% chance for circles/dots
        shape = particleShapes.dot;
      } else if (particleTypeRoll < 55) { // 25% chance for squares
        shape = particleShapes.square;
      } else if (particleTypeRoll < 75) { // 20% chance for diamonds
        shape = particleShapes.diamond;
      } else if (particleTypeRoll < 85) { // 10% chance for triangles
        shape = particleShapes.triangle;
      } else if (particleTypeRoll < 95) { // 10% chance for data nodes
        shape = particleShapes.dataNode;
      } else { // 5% chance for hexagons
        shape = particleShapes.hexagon;
      }

      // Movement duration varies by box and position
      const durationBase = isFinalBox ? 2.5 : 2;
      const durationVariance = Math.random() * (isFinalBox ? 1.5 : 2);

      // Delay sequence based on position and hover state
      const delayMultiplier = isHovered ? 0.7 : 1; // Faster sequence when hovered
      const delay = i * (isFinalBox ? 0.15 : 0.25) * delayMultiplier;

      return {
        id: `particle-${index}-${i}`,
        size,
        color,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: 0.3 + Math.random() * 0.6,
        xMovement,
        yMovement,
        duration: durationBase + durationVariance,
        delay,
        shape
      };
    });

    // Technical symbol text particles - only for hover state or final box
    const technicalParticles = (isHovered || isFinalBox) ? Array.from({ length: Math.min(isFinalBox ? 5 : 3, count / 5) }).map((_, i) => {
      const colorIndex = (i + index + 1) % palette.length;
      const color = palette[colorIndex];
      const symbol = technicalSymbols[(index + i) % technicalSymbols.length];

      return {
        id: `tech-${index}-${i}`,
        symbol,
        x: `${20 + Math.random() * 60}%`,
        y: `${20 + Math.random() * 60}%`,
        rotation: (Math.random() * 40) - 20, // -20 to +20 degrees
        color,
        scale: 0.7 + (Math.random() * 0.6),
        duration: 3 + Math.random() * 2,
        delay: i * 0.3 + 0.5
      };
    }) : [];

    // Particle emitters - small points that occasionally pulse and emit particles
    // Only for final box or hover state
    const emitters = (isFinalBox || isHovered) ? Array.from({ length: isHovered ? 2 : 1 }).map((_, i) => {
      const colorIndex = (i + index) % palette.length;
      const color = palette[colorIndex];

      // Position emitters strategically
      const x = isFinalBox
        ? `${25 + (i * 50)}%` // More spread out in final box
        : `${40 + (i * 20)}%`; // More centered in regular boxes

      const y = isFinalBox
        ? `${30 + (i * 40)}%` // Vertical spread in final box
        : `${50 + (i * 20) * (i % 2 ? 1 : -1)}%`; // Alternate top/bottom in regular boxes

      return {
        id: `emitter-${index}-${i}`,
        x,
        y,
        color,
        rate: isHovered ? 1.5 : 2.5 // Faster emission when hovered
      };
    }) : [];

    return { particles, technicalParticles, emitters };
  }, [index, count, isFinalBox, accentColors, animationIntensity, isHovered]);
};

// Particle emitter component
const ParticleEmitter = ({ x, y, color, rate, isActive }: {
  x: string;
  y: string;
  color: string;
  rate: number;
  isActive: boolean;
}) => {
  const controls = useAnimationControls();

  // Trigger pulse animation on interval
  useEffect(() => {
    if (!isActive) return;

    let timeout: NodeJS.Timeout;

    const pulse = async () => {
      await controls.start({
        scale: [1, 1.8, 1],
        opacity: [0.3, 0.7, 0.3],
        boxShadow: [
          `0 0 0px ${color}80`,
          `0 0 4px ${color}`,
          `0 0 0px ${color}80`
        ],
        transition: { duration: 1.5 }
      });

      // Random interval between pulses
      timeout = setTimeout(pulse, (Math.random() * 2 + rate) * 1000);
    };

    pulse();

    return () => clearTimeout(timeout);
  }, [controls, isActive, color, rate]);

  if (!isActive) return null;

  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full z-20"
      style={{
        left: x,
        top: y,
        backgroundColor: color,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ scale: 1, opacity: 0.3 }}
      animate={controls}
    />
  );
};

const BoxParticles: React.FC<BoxParticlesProps> = ({
  index,
  isFinalBox,
  accentColors,
  isActive,
  isHovered = false
}) => {
  // Use animation system preferences
  const { shouldAnimate, reducedMotion, getIntensity, performance } = useAnimationPreferences();

  // Get animation settings from the system
  const animationIntensity = getIntensity();

  // Determine particle count based on box type, hover state, and performance setting
  const getParticleCount = () => {
    const baseCount = isFinalBox ? 12 : 8;
    let count = isHovered ? Math.floor(baseCount * 1.75) : baseCount;

    // Adjust based on performance setting
    if (performance === 'low') {
      count = Math.floor(count * 0.5);
    } else if (performance === 'medium') {
      count = Math.floor(count * 0.75);
    }

    return count;
  };

  // Generate particles with memoization
  const { particles, technicalParticles, emitters } = useParticleSystem(
    index,
    getParticleCount(),
    isFinalBox,
    accentColors,
    animationIntensity,
    isHovered
  );

  // Skip rendering if conditions not met
  if (!shouldAnimate || reducedMotion) {
    return null;
  }

  // Handle different shape rendering
  const getShapeStyles = (shape: string) => {
    if (shape.startsWith('polygon') || shape.startsWith('circle')) {
      return { clipPath: shape };
    }
    return {};
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <AnimatePresence>
        {isActive && (
          <>
            {/* Regular particles */}
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  left: particle.left,
                  top: particle.top,
                  filter: 'brightness(1.2)',
                  ...getShapeStyles(particle.shape),
                  willChange: 'transform, opacity',
                  transform: 'translate3d(0,0,0)' // Force hardware acceleration
                }}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  x: [0, particle.xMovement, 0],
                  y: [0, particle.yMovement, 0],
                  opacity: [0, particle.opacity, 0],
                  scale: [0, 1, 0],
                  rotate: particle.shape.includes('polygon') && !particle.shape.includes('circle')
                    ? [0, (Math.random() > 0.5 ? 180 : -180), 0]
                    : undefined
                }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 0.5,
                  delay: particle.delay,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Technical text symbols */}
            {technicalParticles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute font-mono text-[6px] whitespace-nowrap"
                style={{
                  color: particle.color,
                  left: particle.x,
                  top: particle.y,
                  transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
                  willChange: 'transform, opacity',
                  zIndex: 5
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, particle.scale, 0],
                }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  repeatDelay: Math.random() + 1,
                  delay: particle.delay,
                  ease: "easeInOut"
                }}
              >
                {particle.symbol}
              </motion.div>
            ))}

            {/* Particle emitters */}
            {emitters.map(emitter => (
              <ParticleEmitter
                key={emitter.id}
                x={emitter.x}
                y={emitter.y}
                color={emitter.color}
                rate={emitter.rate}
                isActive={isActive}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(BoxParticles);