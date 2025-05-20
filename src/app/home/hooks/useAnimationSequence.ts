// src/app/home/hooks/useAnimationSequence.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { animationManager } from '@/components/core/Animations/utils/AnimationManager';

// Animation phases for coordinated sequencing
export type AnimationPhase = 'initial' | 'background' | 'headline' | 'subheadline' | 'complete';

// Animation intensity modes
export type AnimationIntensityMode = 'normal' | 'energetic' | 'subtle' | 'dramatic';

// Animation timing constants (in ms) - Adjusted to ensure proper sequence
export const BACKGROUND_PHASE_DURATION = 2500; // Increased to ensure background fully renders first
export const HEADLINE_PHASE_DELAY = 500;      // Increased delay between phases
export const HEADLINE_PHASE_DURATION = 1200;
export const SUBHEADLINE_PHASE_DURATION = 800;

export interface AnimationControls {
    isInitializing: boolean;
    isAnimating: boolean;
    isComplete: boolean;
    sequenceId: string;
    progress: number;
}

/**
 * Custom hook to manage animation sequences
 */
export function useAnimationSequence() {
    // Check for reduced motion preference
    const prefersReducedMotion = useReducedMotion();

    // Track animation phase for sequenced animations
    const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('initial');

    // Animation progress for each phase (0-1)
    const [phaseProgress, setPhaseProgress] = useState(0);

    // Animation intensity tracking
    const [intensityMode, setIntensityMode] = useState<AnimationIntensityMode>('normal');

    // Generate unique animation ID
    const animationIdRef = useRef(`animation-sequence-${Math.random().toString(36).substring(2, 9)}`);

    // Track if component has mounted to prevent SSR issues
    const isMountedRef = useRef(false);

    // Effect to set mounted state
    useEffect(() => {
        isMountedRef.current = true;
        return () => { isMountedRef.current = false };
    }, []);

    // Start the animation sequence
    const startAnimationSequence = useCallback(() => {
        // For reduced motion users, skip to complete state
        if (prefersReducedMotion) {
            setAnimationPhase('complete');
            return;
        }

        // Register with animation manager
        animationManager.trackAnimation(animationIdRef.current, 'animation-sequence-start');

        // Start with background phase
        setAnimationPhase('background');
        setPhaseProgress(0); // Reset progress

        // Progress through animation phases with proper cleanup
        let backgroundTimer: NodeJS.Timeout | null = null;
        let headlineTimer: NodeJS.Timeout | null = null;
        let subheadlineTimer: NodeJS.Timeout | null = null;

        // Start background phase - ensure it completes fully before moving on
        backgroundTimer = setTimeout(() => {
            // Only proceed if still mounted
            if (!isMountedRef.current) return;

            // Wait until background is fully loaded with explicit phase completion
            setPhaseProgress(1); // Ensure background reaches 100% completion

            // Add more significant delay between background and headline phases
            setTimeout(() => {
                if (!isMountedRef.current) return;

                // Background is now fully visible, THEN start headline
                setAnimationPhase('headline');
                setPhaseProgress(0); // Reset progress for new phase

                // After headline duration, move to subheadline
                headlineTimer = setTimeout(() => {
                    if (!isMountedRef.current) return;

                    setPhaseProgress(1); // Ensure headline is fully visible

                    // Brief pause before starting subheadline
                    setTimeout(() => {
                        if (!isMountedRef.current) return;

                        // Now start subheadline
                        setAnimationPhase('subheadline');
                        setPhaseProgress(0); // Reset progress for new phase

                        subheadlineTimer = setTimeout(() => {
                            if (!isMountedRef.current) return;

                            setPhaseProgress(1); // Ensure subheadline is fully visible

                            setTimeout(() => {
                                setAnimationPhase('complete');

                                // Untrack animation when complete
                                animationManager.untrackAnimation(animationIdRef.current);
                            }, 300);
                        }, SUBHEADLINE_PHASE_DURATION);
                    }, 200); // Small pause between headline completion and subheadline start
                }, HEADLINE_PHASE_DURATION);
            }, HEADLINE_PHASE_DELAY); // Added explicit delay between phases

        }, BACKGROUND_PHASE_DURATION);

        // Return cleanup function that handles all timers
        return () => {
            if (backgroundTimer) clearTimeout(backgroundTimer);
            if (headlineTimer) clearTimeout(headlineTimer);
            if (subheadlineTimer) clearTimeout(subheadlineTimer);
            animationManager.untrackAnimation(animationIdRef.current);
        };
    }, [prefersReducedMotion]);

    // Exit animation sequence (reverse animation)
    const exitAnimationSequence = useCallback(() => {
        if (prefersReducedMotion) {
            setAnimationPhase('initial');
            return undefined;
        }

        // Register with animation manager
        animationManager.trackAnimation(animationIdRef.current, 'animation-sequence-exit');

        // Reverse the animation phases
        if (animationPhase === 'complete' || animationPhase === 'subheadline') {
            setAnimationPhase('headline');

            const headlineTimer = setTimeout(() => {
                setAnimationPhase('background');

                const backgroundTimer = setTimeout(() => {
                    setAnimationPhase('initial');

                    // Untrack animation when complete
                    animationManager.untrackAnimation(animationIdRef.current);
                }, BACKGROUND_PHASE_DURATION / 2);

                return () => clearTimeout(backgroundTimer);
            }, HEADLINE_PHASE_DURATION / 2);

            return () => clearTimeout(headlineTimer);
        } else {
            // If we're already in an early phase, just go straight to initial
            setAnimationPhase('initial');

            const resetTimer = setTimeout(() => {
                animationManager.untrackAnimation(animationIdRef.current);
            }, 300);

            return () => clearTimeout(resetTimer);
        }
    }, [animationPhase, prefersReducedMotion]);

    // Update animation intensity
    const updateIntensity = useCallback((mode: AnimationIntensityMode = 'normal') => {
        setIntensityMode(mode);

        // Register intensity change with animation manager
        if (mode !== 'normal') {
            animationManager.trackAnimation(`${animationIdRef.current}-${mode}`, `animation-intensity-${mode}`);

            // Automatically revert to normal after a period unless it's already normal
            const resetTimer = setTimeout(() => {
                setIntensityMode('normal');
                animationManager.untrackAnimation(`${animationIdRef.current}-${mode}`);
            }, 3000);

            return () => clearTimeout(resetTimer);
        }

        return undefined;
    }, []);

    // Update phase progress for smooth transitions
    useEffect(() => {
        if (animationPhase === 'complete' || animationPhase === 'initial') {
            setPhaseProgress(animationPhase === 'complete' ? 1 : 0);
            return;
        }

        // Reset progress for new phase
        setPhaseProgress(0);

        // Animate progress from 0 to 1
        const startTime = Date.now();
        const duration =
            animationPhase === 'background' ? BACKGROUND_PHASE_DURATION :
                animationPhase === 'headline' ? HEADLINE_PHASE_DURATION :
                    SUBHEADLINE_PHASE_DURATION;

        // Apply intensity modifiers to duration
        let effectiveDuration = duration;
        if (intensityMode === 'energetic') effectiveDuration *= 0.8;
        if (intensityMode === 'subtle') effectiveDuration *= 1.2;
        if (intensityMode === 'dramatic') effectiveDuration *= 1.1;

        let lastUpdateTime = 0;
        const updateInterval = 100; // Reduce update frequency to prevent flickering (was 60)
        let animationFrameId: number | null = null;

        const animateProgress = (timestamp: number) => {
            if (!isMountedRef.current) return;

            // Throttle updates to reduce re-renders
            if (timestamp - lastUpdateTime < updateInterval && lastUpdateTime !== 0) {
                animationFrameId = requestAnimationFrame(animateProgress);
                return;
            }

            lastUpdateTime = timestamp;

            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / effectiveDuration);

            // Only update state if progress has changed significantly
            if (Math.abs(progress - phaseProgress) > 0.05) { // Increased threshold to reduce updates
                setPhaseProgress(progress);
            }

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animateProgress);
            } else {
                setPhaseProgress(1); // Ensure we reach exactly 1
            }
        };

        animationFrameId = requestAnimationFrame(animateProgress);

        return () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [animationPhase, intensityMode, phaseProgress]);

    // Create animation controls object for child components
    const animationControls: AnimationControls = {
        isInitializing: animationPhase === 'initial',
        isAnimating: ['background', 'headline', 'subheadline'].includes(animationPhase),
        isComplete: animationPhase === 'complete',
        sequenceId: animationPhase,
        progress: phaseProgress
    };

    // Check if component should be visible based on animation phase
    const isBackgroundVisible = animationPhase !== 'initial';
    const isHeadlineVisible = animationPhase === 'headline' ||
        animationPhase === 'subheadline' ||
        animationPhase === 'complete';
    const isSubheadlineVisible = animationPhase === 'subheadline' ||
        animationPhase === 'complete';

    return {
        animationPhase,
        phaseProgress,
        animationControls,
        isBackgroundVisible,
        isHeadlineVisible,
        isSubheadlineVisible,
        startAnimationSequence,
        exitAnimationSequence,
        updateIntensity,
        intensityMode
    };
}