// src/app/home/hooks/useGlitchEffect.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { MousePosition } from '../components/background/BackgroundTypes';
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences';

// Types
interface GlitchState {
  active: boolean;
  intensive: boolean;
  type: 'static' | 'dynamic' | 'mild' | 'severe';
  offsets: number[];
  energy: number;
  lastTriggered: number;
}

interface TriggerOptions {
  intensive?: boolean;
  type?: 'static' | 'dynamic' | 'mild' | 'severe';
  duration?: number;
}

interface TechnicalData {
  coordinates: string[];
  dataPoints: string[];
  metrics: string[];
}

type TimerRef = ReturnType<typeof setTimeout> | null;

// Initial glitch state
const initialGlitchState: GlitchState = {
  active: false,
  intensive: false,
  type: 'static',
  offsets: [],
  energy: 0,
  lastTriggered: 0
};

// Generate technical-looking data for visual effect
const generateTechnicalData = (): TechnicalData => {
  const coordinates = Array.from({ length: 5 }, () =>
    `${(Math.random() * 100).toFixed(2)}:${(Math.random() * 100).toFixed(2)}`
  );

  const dataPoints = Array.from({ length: 8 }, () =>
    `${(Math.random() * 10).toFixed(1)}d${Math.floor(Math.random() * 99)}`
  );

  const metrics = Array.from({ length: 6 }, () =>
    `${(Math.random() * 100).toFixed(0)}%`
  );

  return { coordinates, dataPoints, metrics };
};

/**
 * Hook for managing glitch effects
 * Modified to only trigger on click, not automatically
 */
export const useGlitchEffect = (characters: string[]) => {
  const [glitchState, setGlitchState] = useState<GlitchState>(initialGlitchState);
  const [technicalData, setTechnicalData] = useState<TechnicalData>(generateTechnicalData());

  // Animation preferences
  const { shouldAnimate, reducedMotion, performance } = useAnimationPreferences();

  // Refs for timers to properly cleanup
  const glitchTimerRef = useRef<TimerRef>(null);
  const energyDecayTimerRef = useRef<TimerRef>(null);
  const offsetUpdateTimerRef = useRef<TimerRef>(null);

  // Generate glitch offsets based on intensity
  const generateOffsets = useCallback(() => {
    if (reducedMotion) return new Array(characters.length * 2).fill(0);

    const baseIntensity = glitchState.intensive ? 3 : 1.5;
    const energyFactor = glitchState.energy / 100; // 0-1 factor based on energy

    // Generate offsets with energy influence
    return Array.from({ length: characters.length * 2 }, () => {
      const offsetBase = (Math.random() - 0.5) * 2 * baseIntensity;
      return offsetBase * (0.5 + energyFactor * 0.5); // Scale by energy
    });
  }, [characters.length, glitchState.intensive, glitchState.energy, reducedMotion]);

  // Set glitch active state explicitly
  const setGlitchActive = useCallback((active: boolean, intensive: boolean = false) => {
    setGlitchState(prev => ({
      ...prev,
      active,
      intensive: active ? intensive : false,
      offsets: active ? generateOffsets() : prev.offsets,
      lastTriggered: active ? Date.now() : prev.lastTriggered
    }));
  }, [generateOffsets]);

  // Trigger a glitch effect - only called on click now
  const triggerGlitch = useCallback(({
    intensive = false,
    type = 'static',
    duration = 800 // Shorter default duration (was 1200+)
  }: TriggerOptions = {}) => {
    // Don't trigger if in reduced motion mode
    if (reducedMotion) return;

    // Don't re-trigger too quickly (debounce)
    const now = Date.now();
    if (now - glitchState.lastTriggered < 300) return;

    // Clear any previous timers
    if (glitchTimerRef.current) {
      clearTimeout(glitchTimerRef.current);
    }

    // Update offsets and activate glitch
    const newOffsets = generateOffsets();
    setGlitchState(prev => ({
      ...prev,
      active: true,
      intensive,
      type,
      offsets: newOffsets,
      lastTriggered: now
    }));

    // Set timeout to disable glitch after duration
    glitchTimerRef.current = setTimeout(() => {
      setGlitchState(prev => ({
        ...prev,
        active: false
      }));
    }, duration);

    // Generate new technical data at each glitch
    setTechnicalData(generateTechnicalData());

  }, [generateOffsets, glitchState.lastTriggered, reducedMotion]);

  // Update technical data when mouse position changes
  const updateTechnicalData = useCallback((mousePosition: MousePosition) => {
    if (Math.random() > 0.95) { // Only update occasionally
      setTechnicalData(prev => ({
        ...prev,
        coordinates: [
          `${(mousePosition.x * 100).toFixed(2)}:${(mousePosition.y * 100).toFixed(2)}`,
          ...prev.coordinates.slice(0, 4)
        ]
      }));
    }
  }, []);

  // Set energy level directly
  const setGlitchEnergy = useCallback((energy: number) => {
    setGlitchState(prev => ({
      ...prev,
      energy: Math.min(100, Math.max(0, energy))
    }));

    // Reset energy decay timer
    if (energyDecayTimerRef.current) {
      clearTimeout(energyDecayTimerRef.current);
    }

    // Set up energy decay
    energyDecayTimerRef.current = setTimeout(() => {
      setGlitchState(prev => ({
        ...prev,
        energy: Math.max(0, prev.energy - 10)
      }));
    }, 3000);
  }, []);

  // Energy decay effect - gradually reduce energy over time
  useEffect(() => {
    if (glitchState.energy <= 0) return;

    const decayInterval = setInterval(() => {
      setGlitchState(prev => ({
        ...prev,
        energy: Math.max(0, prev.energy - 5)
      }));
    }, 5000);

    return () => clearInterval(decayInterval);
  }, [glitchState.energy]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
      if (energyDecayTimerRef.current) clearTimeout(energyDecayTimerRef.current);
      if (offsetUpdateTimerRef.current) clearTimeout(offsetUpdateTimerRef.current);
    };
  }, []);

  return {
    glitchState,
    technicalData,
    setGlitchActive,
    updateTechnicalData,
    triggerGlitch,
    setGlitchEnergy
  };
};