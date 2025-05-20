// src/app/home/components/background/GridOverlay.tsx
'use client'

import React, { memo, useEffect, useRef, useState, useMemo } from 'react'
import { motion, MotionValue, useTransform, useSpring } from 'framer-motion'
import { BackgroundBaseProps } from './BackgroundTypes'
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences'
import { animationManager } from '@/components/core/Animations/utils/AnimationManager'
import { AnimatedPath } from '@/components/core/Animations'

interface GridOverlayProps extends BackgroundBaseProps {
  gridX: MotionValue<number>
  gridY: MotionValue<number>
}

interface GridLine {
  id: string;
  path: string;
  strokeWidth: number;
  dashArray?: string;
  direction: 'horizontal' | 'vertical';
  position: number;
}

interface EnergyPulse {
  id: string;
  x: number;
  y: number;
  size: number;
  timestamp: number;
  duration: number;
}

// Simplified grid configuration with fewer lines
const getGridConfig = (performance: 'low' | 'medium' | 'high') => {
  const config = {
    horizontalLines: [20, 80],  // Just two horizontal lines by default
    verticalLines: [20, 80],    // Just two vertical lines by default
    maxActivePulses: 1,         // Only one pulse at a time
  };

  // Add one more line for better performance levels
  if (performance === 'high' || performance === 'medium') {
    config.horizontalLines.push(50);
    config.verticalLines.push(50);
  }

  return config;
};

const GridOverlay: React.FC<GridOverlayProps> = ({
  gridX,
  gridY,
  accentColors,
  mousePosition,
  animationControls
}) => {
  // Animation system hooks
  const { shouldAnimate, getTransitionSettings, reducedMotion, performance } = useAnimationPreferences()
  const animationId = useRef(`grid-overlay-${Math.random().toString(36).substring(2, 9)}`)

  // Get configuration based on performance level
  const gridConfig = useMemo(() => getGridConfig(performance), [performance]);

  // Grid state management - greatly simplified
  const [energyPulses, setEnergyPulses] = useState<EnergyPulse[]>([]);
  const pulseIdCounter = useRef(0);

  // Very minimal grid movement - almost stationary
  const springConfig = { stiffness: 20, damping: 25, mass: 1 }; // Very stiff, heavily damped
  const smoothGridX = useSpring(gridX, springConfig);
  const smoothGridY = useSpring(gridY, springConfig);

  // Generate minimal grid lines with memoization
  const { gridLines } = useMemo(() => {
    const lines: GridLine[] = [];

    // Horizontal lines - all with consistent styling
    gridConfig.horizontalLines.forEach((position) => {
      lines.push({
        id: `h-${position}`,
        path: `M0 ${position} L100 ${position}`,
        strokeWidth: 0.15, // Consistently thin
        dashArray: undefined, // No dashes
        direction: 'horizontal',
        position,
      });
    });

    // Vertical lines - all with consistent styling
    gridConfig.verticalLines.forEach((position) => {
      lines.push({
        id: `v-${position}`,
        path: `M${position} 0 L${position} 100`,
        strokeWidth: 0.15, // Consistently thin
        dashArray: undefined, // No dashes
        direction: 'vertical',
        position,
      });
    });

    return { gridLines: lines };
  }, [gridConfig.horizontalLines, gridConfig.verticalLines]);

  // Register animation with AnimationManager
  useEffect(() => {
    if (!shouldAnimate()) return;

    animationManager.trackAnimation(animationId.current, 'grid-overlay');

    return () => {
      animationManager.untrackAnimation(animationId.current);
    };
  }, [shouldAnimate]);

  // Handle mouse click to create energy pulses - only respond to clicks, not hover
  // Greatly simplified to only create pulses occasionally
  useEffect(() => {
    if (reducedMotion || !mousePosition.clicked || !shouldAnimate()) return;

    // Only create a pulse 50% of the time to reduce visual noise
    if (Math.random() > 0.5) return;

    // Create a new energy pulse at mouse click position
    const createPulse = () => {
      // Generate unique ID
      const pulseId = `pulse-${pulseIdCounter.current++}`;

      // Create new pulse
      const newPulse: EnergyPulse = {
        id: pulseId,
        x: mousePosition.x * 100,
        y: mousePosition.y * 100,
        size: 0,
        timestamp: Date.now(),
        duration: 2000 // Slower animation
      };

      // Add to pulses - replacing any existing pulse
      setEnergyPulses([newPulse]);
    };

    createPulse();
  }, [reducedMotion, mousePosition.clicked, shouldAnimate, gridConfig.maxActivePulses]);

  // Animate energy pulses
  useEffect(() => {
    if (reducedMotion || !shouldAnimate() || energyPulses.length === 0) return;

    let lastUpdateTime = 0;
    const updateInterval = 200; // Reduced update frequency for better performance

    const updatePulses = (timestamp: number) => {
      // Only update every N ms for better performance
      if (timestamp - lastUpdateTime < updateInterval) return;
      lastUpdateTime = timestamp;

      const now = Date.now();

      setEnergyPulses(prev => {
        return prev
          .map(pulse => {
            // Calculate progress
            const elapsed = now - pulse.timestamp;
            const progress = Math.min(1, elapsed / pulse.duration);

            // Update pulse size based on progress (max size 20% of viewport - reduced)
            const newSize = 20 * progress; // Reduced size

            return {
              ...pulse,
              size: newSize
            };
          })
          .filter(pulse => now - pulse.timestamp < pulse.duration);
      });
    };

    animationManager.subscribeToAnimationTick(
      `${animationId.current}-pulses`,
      updatePulses
    );

    return () => {
      animationManager.unsubscribeFromAnimationTick(
        `${animationId.current}-pulses`
      );
    };
  }, [reducedMotion, shouldAnimate, energyPulses.length]);

  // Get system-appropriate transition settings
  const { duration } = getTransitionSettings('default');

  // Animation entry progress for coordinated reveal
  const entryProgress = animationControls.progress;
  const isVisible = animationControls.isComplete || entryProgress > 0.2;

  return (
    <motion.div
      className="absolute inset-0 opacity-10 mix-blend-soft-light" // Reduced overall opacity
      style={{
        // Almost completely eliminate motion response to mouse
        x: reducedMotion ? 0 : smoothGridX,
        y: reducedMotion ? 0 : smoothGridY,
        opacity: isVisible ? 0.1 * entryProgress : 0, // Reduced opacity
        willChange: shouldAnimate() && !reducedMotion ? 'transform, opacity' : 'auto'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 0.1 : 0 }} // Reduced opacity
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className="h-full w-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid Lines with AnimatedPath for coordinated animations */}
          {gridLines.map((line) => (
            <AnimatedPath
              key={line.id}
              d={line.path}
              stroke="var(--color-grid-lines)"
              strokeWidth={line.strokeWidth}
              strokeDasharray={line.dashArray}
              delay={line.position / 800} // Slower animation
              duration={duration * 0.6}
              animate={animationControls.isComplete}
              easing="easeInOut"
            />
          ))}

          {/* Energy Pulses - greatly simplified */}
          {!reducedMotion && shouldAnimate() && energyPulses.map(pulse => (
            <motion.circle
              key={pulse.id}
              cx={pulse.x}
              cy={pulse.y}
              r={pulse.size}
              fill="none"
              stroke={accentColors.primary}
              strokeWidth={0.15} // Thinner stroke
              strokeOpacity={(1 - pulse.size / 20) * 0.3} // Lower opacity
            />
          ))}
        </svg>
      </div>

      {/* Simpler highlight point at click location - minimal effect */}
      {!reducedMotion && shouldAnimate() && energyPulses.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {energyPulses.map(pulse => {
            const progress = Math.min(1, (Date.now() - pulse.timestamp) / pulse.duration);
            const opacity = (1 - progress) * 0.4; // Lower opacity

            return (
              <motion.div
                key={`glow-${pulse.id}`}
                className="absolute rounded-full"
                style={{
                  left: `${pulse.x}%`,
                  top: `${pulse.y}%`,
                  width: "10px", // Smaller
                  height: "10px", // Smaller
                  transform: "translate(-50%, -50%)",
                  background: `radial-gradient(circle, ${accentColors.primary}20 0%, transparent 70%)`, // Lower intensity
                  opacity: opacity,
                  filter: "blur(2px)" // Less blur
                }}
              />
            )
          })}
        </div>
      )}
    </motion.div>
  );
};

export default memo(GridOverlay);