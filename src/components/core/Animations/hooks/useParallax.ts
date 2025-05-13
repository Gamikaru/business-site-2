// src/components/common/Animations/hooks/useParallax.ts
"use client";

import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useAnimationPreferences } from './useAnimationPreferences';

interface ParallaxOptions {
    offset?: number;       // Movement amount in pixels
    direction?: 'up' | 'down' | 'left' | 'right';
    speed?: number;        // Speed factor (1 is normal, higher is faster)
    easing?: [number, number, number, number]; // Cubic bezier easing
}

export const useParallax = (options: ParallaxOptions = {}) => {
    const {
        offset = 100,
        direction = 'up',
        speed = 1,
        easing = [0.42, 0, 0.58, 1] // Ease-in-out
    } = options;

    const { shouldEnableParallax, getIntensity } = useAnimationPreferences();
    const ref = useRef<HTMLElement>(null);

    // Use refs to track measurements without causing re-renders
    const measurementsRef = useRef({
        elementTop: 0,
        clientHeight: 0
    });

    // State for input/output ranges that affect the transform
    const [ranges, setRanges] = useState<{
        inputRange: [number, number];
        outputRange: [number, number];
    }>({
        inputRange: [0, 1],
        outputRange: [0, 0]
    });

    // Get scroll progress
    const { scrollY } = useScroll();

    // Update measurements and ranges
    useEffect(() => {
        if (!ref.current) return;

        const updateRanges = () => {
            const rect = ref.current?.getBoundingClientRect();
            if (!rect) return;

            // Store measurements in ref
            measurementsRef.current = {
                elementTop: rect.top + window.scrollY,
                clientHeight: window.innerHeight
            };

            // Calculate parallax range
            const finalOffset = shouldEnableParallax() ? offset * getIntensity() * speed : 0;
            let newOutputRange: [number, number] = [0, 0];

            // Direction-based calculations
            if (direction === 'up') {
                newOutputRange = [0, -finalOffset];
            } else if (direction === 'down') {
                newOutputRange = [0, finalOffset];
            } else if (direction === 'left') {
                newOutputRange = [0, -finalOffset];
            } else if (direction === 'right') {
                newOutputRange = [0, finalOffset];
            }

            // Calculate start and end scroll positions
            const { elementTop, clientHeight } = measurementsRef.current;
            const start = elementTop - clientHeight;
            const end = elementTop + finalOffset;

            // Set new ranges
            setRanges({
                inputRange: [start, end],
                outputRange: newOutputRange
            });
        };

        // Initial update
        updateRanges();

        // Add resize listener
        window.addEventListener('resize', updateRanges);

        // Cleanup
        return () => window.removeEventListener('resize', updateRanges);
    }, [ref, direction, offset, speed, shouldEnableParallax, getIntensity]);

    // Create motion value with current range values
    const transformValue: MotionValue<number> = useTransform(
        scrollY,
        ranges.inputRange,
        ranges.outputRange,
        { ease: (t: number) => cubicBezier(t, ...easing) }
    );

    return { ref, transformValue, direction };
};

// Cubic bezier function for custom easing
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
}