// src/app/home/hooks/useMouseInteraction.ts
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MotionValue } from 'framer-motion';
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences';
import { animationManager } from '@/components/core/Animations/utils/AnimationManager';

export interface MousePosition {
    x: number;
    y: number;
    absoluteX?: number;
    absoluteY?: number;
    velocity?: number;
    direction?: { x: number; y: number };
    clicked?: boolean;
}

export interface PulseClick {
    id: number;
    x: number;
    y: number;
    timestamp: number;
    colorIndex: number;
    intensity: number;
    velocity: number;
}

export interface FieldEffect {
    x: number;
    y: number;
    radius: number;
    strength: number;
    type: 'attract' | 'repel' | 'vortex';
}

// Settings for mouse interaction physics
interface MousePhysicsSettings {
    inertia: number;
    smoothing: number;
    velocityFactor: number;
    pulseDuration: number;
    maxPulses: number;
    fieldEffectRadius: number;
}

// Default physics settings
const DEFAULT_PHYSICS: MousePhysicsSettings = {
    inertia: 0.8,
    smoothing: 0.2,
    velocityFactor: 1.0,
    pulseDuration: 2500,
    maxPulses: 5,
    fieldEffectRadius: 0.2,
};

// Performance-based throttling thresholds
const THROTTLE_MS = {
    low: 24,
    medium: 12,
    high: 8,
};

/**
 * Consolidated hook for mouse interactions with optional simplified mode
 */
export function useMouseInteraction(
    mouseX?: MotionValue<number>,
    mouseY?: MotionValue<number>,
    containerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>,
    setGlitchActive?: (active: boolean, options?: any) => void,
    settings?: Partial<MousePhysicsSettings>,
    simpleMode = false // Flag to use simplified mode
) {
    // Get animation preferences for performance optimization
    const { shouldAnimate, reducedMotion, performance } = useAnimationPreferences();

    // Merge default settings with any provided options
    const physicsSettings = { ...DEFAULT_PHYSICS, ...settings };

    // Determine throttle rate based on performance mode
    const throttleRate = THROTTLE_MS[performance as keyof typeof THROTTLE_MS] || THROTTLE_MS.medium;

    // Generate a unique ID for this interaction instance
    const interactionId = useRef(`mouse-interaction-${Math.random().toString(36).substring(2, 9)}`);

    // State for tracking mouse position with enhanced physics
    const [mousePosition, setMousePosition] = useState<MousePosition>({
        x: 0.5,
        y: 0.5,
        absoluteX: 0,
        absoluteY: 0,
        velocity: 0,
        direction: { x: 0, y: 0 },
        clicked: false
    });

    // State for hover effects (used in simplified mode)
    const [hoveredBox, setHoveredBox] = useState<number | null>(null);

    // Track previous positions to calculate velocity
    const prevPositionRef = useRef({ x: 0.5, y: 0.5, timestamp: 0 });

    // State for pulse effects on click
    const [pulseClicks, setPulseClicks] = useState<PulseClick[]>([]);

    // Counter for generating unique pulse IDs
    const [pulseIdCounter, setPulseIdCounter] = useState(0);

    // Field effects that can attract or repel elements
    const [fieldEffects, setFieldEffects] = useState<FieldEffect[]>([]);

    // Reference for tracking last mouse move time for throttling
    const lastMoveRef = useRef(0);

    // Flag to track if mouse is moving
    const isMovingRef = useRef(false);

    // Track velocity data for smoother animations
    const velocityRef = useRef({ x: 0, y: 0, timestamp: 0, magnitude: 0 });

    // Track if user is clicking
    const isClickingRef = useRef(false);

    // Track accumulated movement for inertia
    const inertiaRef = useRef({ x: 0, y: 0 });

    // Memoize these values to prevent unnecessary recalculation
    const animationsEnabled = useMemo(() =>
        shouldAnimate() && !reducedMotion,
        [shouldAnimate, reducedMotion]);

    // Enhanced throttled mouse move handler with physics
    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            // Skip if reduced motion is preferred
            if (reducedMotion) return;

            const now = Date.now();

            // Apply throttling based on performance setting
            if (now - lastMoveRef.current < throttleRate) return;
            lastMoveRef.current = now;

            // Get container reference - handle both containerRef prop and argument
            const container = containerRef?.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const rawX = (e.clientX - rect.left) / rect.width;
            const rawY = (e.clientY - rect.top) / rect.height;
            const absoluteX = e.clientX;
            const absoluteY = e.clientY;

            // Simplified mode just updates position
            if (simpleMode) {
                setMousePosition({
                    x: Math.max(0, Math.min(1, rawX)),
                    y: Math.max(0, Math.min(1, rawY))
                });
                return;
            }

            // Calculate velocity components
            const timeDelta = Math.max(1, now - prevPositionRef.current.timestamp);
            const deltaX = rawX - prevPositionRef.current.x;
            const deltaY = rawY - prevPositionRef.current.y;

            // Calculate normalized direction (-1 to 1)
            const dirX = Math.abs(deltaX) < 0.001 ? 0 : Math.sign(deltaX);
            const dirY = Math.abs(deltaY) < 0.001 ? 0 : Math.sign(deltaY);

            // Calculate velocity (pixels per second)
            const velocityX = (deltaX * rect.width) / (timeDelta / 1000);
            const velocityY = (deltaY * rect.height) / (timeDelta / 1000);
            const velocityMagnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

            // Update velocity reference
            velocityRef.current = {
                x: velocityX,
                y: velocityY,
                timestamp: now,
                magnitude: velocityMagnitude
            };

            // Apply inertia for smoother movement
            const inertiaX = inertiaRef.current.x * physicsSettings.inertia + deltaX * (1 - physicsSettings.inertia);
            const inertiaY = inertiaRef.current.y * physicsSettings.inertia + deltaY * (1 - physicsSettings.inertia);
            inertiaRef.current = { x: inertiaX, y: inertiaY };

            // Apply smoothing to position
            const smoothX = prevPositionRef.current.x * physicsSettings.smoothing + rawX * (1 - physicsSettings.smoothing);
            const smoothY = prevPositionRef.current.y * physicsSettings.smoothing + rawY * (1 - physicsSettings.smoothing);

            // Update motion values directly (no re-render) if provided
            if (mouseX && mouseY) {
                mouseX.set(smoothX);
                mouseY.set(smoothY);
            }

            // Update previous position for next calculation
            prevPositionRef.current = {
                x: smoothX,
                y: smoothY,
                timestamp: now
            };

            // Set moving flag
            isMovingRef.current = true;

            // Update mouse position state
            setMousePosition({
                x: smoothX,
                y: smoothY,
                absoluteX,
                absoluteY,
                velocity: velocityMagnitude * physicsSettings.velocityFactor,
                direction: { x: dirX, y: dirY },
                clicked: isClickingRef.current
            });

            // Register activity with animation manager
            animationManager.trackAnimation(interactionId.current, 'mouse-interaction');
        },
        [
            mouseX,
            mouseY,
            containerRef,
            throttleRate,
            reducedMotion,
            simpleMode,
            physicsSettings.inertia,
            physicsSettings.smoothing,
            physicsSettings.velocityFactor
        ]
    );

    // Enhanced mouse click handler with physics-based effects
    const handleMouseClick = useCallback(
        (e: React.MouseEvent) => {
            if (!containerRef?.current || reducedMotion || !setGlitchActive) return;

            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            // Set clicking state
            isClickingRef.current = true;

            // Update mousePosition to reflect clicked state
            setMousePosition(prev => ({
                ...prev,
                clicked: true
            }));

            setTimeout(() => {
                isClickingRef.current = false;

                // Reset clicked state after delay
                setMousePosition(prev => ({
                    ...prev,
                    clicked: false
                }));
            }, 100);

            // Calculate click velocity based on recent mouse movement
            const clickVelocity = velocityRef.current.magnitude;
            const normalizedVelocity = Math.min(1, clickVelocity / 1000);

            // Intensity varies based on velocity and recent activity
            const baseIntensity = 0.7 + Math.random() * 0.3;
            const velocityIntensity = normalizedVelocity * 0.5;
            const totalIntensity = Math.min(1, baseIntensity + velocityIntensity);

            // Create a new pulse with physics properties
            const newPulse: PulseClick = {
                id: pulseIdCounter,
                x,
                y,
                timestamp: Date.now(),
                colorIndex: pulseIdCounter % 4,
                intensity: totalIntensity,
                velocity: normalizedVelocity
            };

            // Add to pulse collection with limit enforcement
            setPulseClicks(prev => {
                // Remove oldest pulses if we're over the limit
                if (prev.length >= physicsSettings.maxPulses) {
                    return [...prev.slice(-(physicsSettings.maxPulses - 1)), newPulse];
                }
                return [...prev, newPulse];
            });

            // Increment pulse counter
            setPulseIdCounter(prev => prev + 1);

            // Create a field effect at click location
            const newField: FieldEffect = {
                x,
                y,
                radius: physicsSettings.fieldEffectRadius * (0.8 + normalizedVelocity * 0.4),
                strength: 0.5 + normalizedVelocity * 0.5,
                type: Math.random() > 0.7 ? 'repel' : 'attract'
            };

            // Add field effect with automatic cleanup
            setFieldEffects(prev => [...prev, newField]);
            setTimeout(() => {
                setFieldEffects(curr => curr.filter(field => field !== newField));
            }, 3000);

            // Trigger glitch effect with intensity based on click velocity
            setGlitchActive(true, {
                intensive: normalizedVelocity > 0.6,
                type: 'static'
            });

            // Register click with animation manager
            animationManager.trackAnimation(`${interactionId.current}-click`, 'mouse-click');

            // Clean up after the glitch
            setTimeout(() => {
                setGlitchActive(false);
                animationManager.untrackAnimation(`${interactionId.current}-click`);
            }, 150 + Math.floor(normalizedVelocity * 100));
        },
        [
            containerRef,
            reducedMotion,
            pulseIdCounter,
            setGlitchActive,
            physicsSettings.maxPulses,
            physicsSettings.fieldEffectRadius
        ]
    );

    // Handle idle detection
    useEffect(() => {
        if (!shouldAnimate() || simpleMode) return;

        let idleTimer: NodeJS.Timeout;

        const checkIdle = () => {
            if (Date.now() - prevPositionRef.current.timestamp > 300) {
                isMovingRef.current = false;

                // Gradually reduce inertia when idle
                inertiaRef.current = {
                    x: inertiaRef.current.x * 0.95,
                    y: inertiaRef.current.y * 0.95
                };

                // Untrack animation to save resources
                animationManager.untrackAnimation(interactionId.current);
            }

            idleTimer = setTimeout(checkIdle, 200);
        };

        idleTimer = setTimeout(checkIdle, 200);

        return () => {
            clearTimeout(idleTimer);
            animationManager.untrackAnimation(interactionId.current);
        };
    }, [shouldAnimate, simpleMode]);

    // Cleanup old pulses
    useEffect(() => {
        if (pulseClicks.length === 0 || simpleMode) return;

        const cleanup = setTimeout(() => {
            const now = Date.now();
            setPulseClicks((prev) =>
                prev.filter((pulse) => now - pulse.timestamp < physicsSettings.pulseDuration)
            );
        }, 1000);

        return () => clearTimeout(cleanup);
    }, [pulseClicks, physicsSettings.pulseDuration, simpleMode]);

    // Return appropriate object based on mode
    if (simpleMode) {
        return useMemo(() => ({
            hoveredBox,
            setHoveredBox,
            mousePosition,
            handleMouseMove: (e: React.MouseEvent, ref?: React.RefObject<HTMLDivElement>) => {
                handleMouseMove(e);
            }
        }), [hoveredBox, mousePosition, handleMouseMove]);
    }

    // Return full interaction object for advanced mode
    return {
        mousePosition,
        pulseClicks,
        fieldEffects,
        handleMouseMove,
        handleMouseClick,
        hoveredBox,
        setHoveredBox,

        // Additional utility functions
        isMoving: isMovingRef.current,
        isClicking: isClickingRef.current,
        getVelocity: () => velocityRef.current,

        getFieldAtPosition: useCallback((x: number, y: number): FieldEffect | null => {
            // Find any field effect at this position
            for (const field of fieldEffects) {
                const dx = x - field.x;
                const dy = y - field.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < field.radius) {
                    return field;
                }
            }

            return null;
        }, [fieldEffects]),

        getInfluenceAtPosition: useCallback((x: number, y: number): { x: number; y: number; strength: number } => {
            let influenceX = 0;
            let influenceY = 0;
            let totalStrength = 0;

            // Calculate combined influence from all fields
            for (const field of fieldEffects) {
                const dx = x - field.x;
                const dy = y - field.y;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);

                if (dist < field.radius && dist > 0.001) {
                    // Calculate falloff based on distance (1 at center, 0 at edge)
                    const falloff = 1 - dist / field.radius;
                    const strength = field.strength * falloff;

                    // Normalize direction
                    const nx = dx / dist;
                    const ny = dy / dist;

                    // Apply direction based on field type
                    const multiplier = field.type === 'attract' ? -1 : 1;

                    influenceX += nx * strength * multiplier;
                    influenceY += ny * strength * multiplier;
                    totalStrength += strength;
                }
            }

            return {
                x: influenceX,
                y: influenceY,
                strength: totalStrength
            };
        }, [fieldEffects])
    };
}