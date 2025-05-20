// src/app/home/components/headline/HeadlineCharacter.tsx
'use client'

import React, { memo, useMemo, useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform, Variants } from 'framer-motion';
import { cn } from '@/utils/classNames';
import { CharacterProps, CharacterStyleOptions } from './HeadlineTypes';
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences';
import { animationManager } from '@/components/core/Animations/utils/AnimationManager';

const HeadlineCharacter: React.FC<CharacterProps> = ({
  char,
  wordIndex,
  charIndex,
  globalIndex,
  glitchActive,
  intensiveGlitch,
  glitchOffsets,
  getTextColor,
  isAnimated,
  shouldAnimate = true,
  animationDelay = 0,
  variants, // New prop for word-based animations
  influence = 0,
  energyLevel = 0,
  isHovered = false
}) => {
  // Get animation preferences from centralized system
  const { reducedMotion, shouldAnimate: systemShouldAnimate, getTransitionSettings } = useAnimationPreferences();

  // Animation settings from animation system
  const { duration: baseDuration, ease } = getTransitionSettings('default');

  // Unique animation ID for tracking
  const animationId = useRef(`headline-char-${globalIndex}-${Math.random().toString(36).substring(2, 9)}`);

  // Track if this character has finished its entrance animation
  const hasAnimatedRef = useRef(false);

  // References for element measuring and effects
  const characterRef = useRef<HTMLSpanElement>(null);

  // Track hover state independently for performance
  const [localHover, setLocalHover] = useState(false);
  const isHoveredFinal = isHovered || localHover;

  // Motion values for character transforms with optimized coordinate system
  const baseX = useMotionValue(0);
  const baseY = useMotionValue(0);
  const baseRotateZ = useMotionValue(0);
  const baseRotateY = useMotionValue(0);
  const baseRotateX = useMotionValue(0);

  // Springs for smoother animations
  const springConfig = useMemo(() => ({
    stiffness: 400,
    damping: 30,
    mass: 1
  }), []);

  const xSpring = useSpring(baseX, springConfig);
  const ySpring = useSpring(baseY, springConfig);
  const rotateZSpring = useSpring(baseRotateZ, springConfig);
  const rotateYSpring = useSpring(baseRotateY, springConfig);
  const rotateXSpring = useSpring(baseRotateX, springConfig);

  // Transform values for 3D effects
  const shadowBlur = useTransform(rotateYSpring, [-10, 0, 10], [6, 2, 6]);
  const shadowOpacity = useTransform(rotateYSpring, [-10, 0, 10], [0.4, 0.1, 0.4]);

  // Use memoized style calculations to prevent recalculations on every render
  const characterStyle = useMemo<CharacterStyleOptions>(() => {
    const isItalic = globalIndex % 9 === 0;
    const fontWeight = globalIndex % 13 === 0 ? 'medium' : 'black';
    const textColor = getTextColor(wordIndex, globalIndex);

    let glitchTransform = '';
    let glitchFilter = '';
    let glitchShadow = '';

    // Only calculate glitch effects if animations are enabled
    if (glitchActive && systemShouldAnimate() && !reducedMotion) {
      // Calculate glitch effects based on patterns for more intentional distortion
      if (globalIndex % 5 === 0) {
        glitchTransform = 'translateY(5px)';
      } else if (globalIndex % 3 === 0) {
        glitchTransform = 'rotate(-3deg)';
      } else if (globalIndex % 4 === 0) {
        glitchTransform = 'rotate(3deg) translateX(3px)';
      }

      if (glitchOffsets[globalIndex] || glitchOffsets[globalIndex + 1]) {
        glitchTransform += ` translate3d(${glitchOffsets[globalIndex] || 0}px, ${glitchOffsets[globalIndex + 1] || 0}px, 0)`;
      }

      // Add filter effects only to some characters for better performance
      if (globalIndex % 6 === 0) {
        glitchFilter = 'brightness(2)';
      }

      // Add text shadow only to some characters
      if (globalIndex % 5 === 0) {
        const shadowColor = globalIndex % 10 === 0 ? 'var(--color-accent-secondary)' : 'var(--color-accent-primary)';
        glitchShadow = `0 0 5px ${shadowColor}`;
      }
    }

    // Determine which CSS properties will change for hardware acceleration hints
    const willChangeProperties = [];
    if (glitchActive && !reducedMotion) willChangeProperties.push('transform');
    if (glitchFilter) willChangeProperties.push('filter');
    if (isAnimated || isHoveredFinal) willChangeProperties.push('opacity', 'transform');

    const willChange = willChangeProperties.length ? willChangeProperties.join(', ') : 'auto';

    return {
      textColor,
      italic: isItalic,
      fontWeight,
      glitchTransform,
      glitchFilter,
      glitchShadow,
      willChange,
      transform: systemShouldAnimate() ? 'translate3d(0,0,0)' : undefined // Force hardware acceleration only when animating
    };
  }, [wordIndex, globalIndex, glitchActive, glitchOffsets, intensiveGlitch, getTextColor, systemShouldAnimate, reducedMotion, isAnimated, isHoveredFinal]);

  // Enhanced variants with dynamic physics for better entrance animation
  const getCharacterVariants = useMemo(() => {
    // If we have word-provided variants, use them (with indexing support)
    if (variants) {
      // Handle variants that use functions to determine values based on index
      const processVariantProperty = (prop: any) => {
        if (typeof prop === 'function') {
          return prop(charIndex); // Pass character index to the function
        }
        return prop;
      };

      // Create properly processed variants
      if (variants.initial || variants.animate) {
        const processedVariants: Variants = {
          initial: {},
          animate: {}
        };

        // Process initial state if it exists
        if (variants.initial) {
          const initial = variants.initial as Record<string, any>;

          // Process each property
          Object.keys(initial).forEach(key => {
            (processedVariants.initial as Record<string, any>)[key] = processVariantProperty(initial[key]);
          });
        }

        // Process animate state if it exists
        if (variants.animate) {
          const animate = variants.animate as Record<string, any>;

          // Process each property
          Object.keys(animate).forEach(key => {
            if (key !== 'transition') {
              (processedVariants.animate as Record<string, any>)[key] = processVariantProperty(animate[key]);
            } else {
              // Preserve transition as is
              (processedVariants.animate as Record<string, any>).transition = animate.transition;
            }
          });
        }

        return processedVariants;
      }

      return variants;
    }

    // For reduced motion users, use simpler animations
    if (reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { duration: 0.3, delay: animationDelay * 0.5 }
        }
      };
    }

    // For standard motion users, use full 3D animation
    return {
      initial: {
        opacity: 0,
        y: 60,
        rotateX: 90,
        scale: 0.95,
      },
      animate: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 1,
          delay: animationDelay,
          opacity: { duration: baseDuration * 0.4 }
        }
      }
    };
  }, [reducedMotion, animationDelay, baseDuration, variants, charIndex]);

  // Handle mouse proximity effects
  useEffect(() => {
    if (reducedMotion || !systemShouldAnimate() || !characterRef.current) return;

    // Set base transforms based on influence from parent
    if (influence > 0) {
      // Calculate 3D effect based on influence
      const maxRotate = 15 * influence;
      const maxTranslate = 5 * influence;

      baseRotateY.set((Math.random() - 0.5) * maxRotate);
      baseRotateX.set((Math.random() - 0.5) * maxRotate * 0.5);
      baseRotateZ.set((Math.random() - 0.5) * maxRotate * 0.25);
      baseX.set((Math.random() - 0.5) * maxTranslate);
      baseY.set((Math.random() - 0.5) * maxTranslate);
    } else {
      // Reset to normal position when no influence
      baseRotateY.set(0);
      baseRotateX.set(0);
      baseRotateZ.set(0);
      baseX.set(0);
      baseY.set(0);
    }
  }, [influence, reducedMotion, systemShouldAnimate, baseRotateY, baseRotateX, baseRotateZ, baseX, baseY]);

  // Register animation completion with animation manager
  useEffect(() => {
    if (!shouldAnimate || !isAnimated || hasAnimatedRef.current || !systemShouldAnimate()) return;

    // Track this animation
    animationManager.trackAnimation(animationId.current, `headline-char-${globalIndex}`);

    // Set up completion timer based on animation delay
    const animationTimeout = setTimeout(() => {
      hasAnimatedRef.current = true;
      animationManager.untrackAnimation(animationId.current);
    }, (animationDelay + baseDuration) * 1000);

    return () => {
      clearTimeout(animationTimeout);
      animationManager.untrackAnimation(animationId.current);
    };
  }, [shouldAnimate, isAnimated, systemShouldAnimate, globalIndex, animationDelay, baseDuration]);

  // Handle hover interactions
  const handleMouseEnter = () => {
    if (reducedMotion) return;

    setLocalHover(true);

    // Track hover interaction
    animationManager.trackAnimation(`${animationId.current}-hover`, 'character-hover');

    // Set 3D transforms
    baseRotateY.set(15);
    baseRotateX.set(-5);
    baseY.set(-5);

    // Add subtle scale effect
    if (characterRef.current) {
      characterRef.current.style.scale = '1.1';
    }
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;

    setLocalHover(false);

    // Untrack hover animation
    animationManager.untrackAnimation(`${animationId.current}-hover`);

    // Reset transforms
    baseRotateY.set(0);
    baseRotateX.set(0);
    baseRotateZ.set(0);
    baseX.set(0);
    baseY.set(0);

    // Reset scale
    if (characterRef.current) {
      characterRef.current.style.scale = '1';
    }
  };

  // For whitespace characters, render a simpler element for better performance
  if (char === ' ') {
    return <span className="inline-block w-2 md:w-3 font-heading">&nbsp;</span>;
  }

  return (
    <motion.span
      ref={characterRef}
      className={cn(
        "inline-block character-3d text-[clamp(2.5rem,8vw,7.5rem)] leading-[0.85] font-heading",
        characterStyle.italic && "italic",
        characterStyle.fontWeight === 'medium' && "font-medium",
        characterStyle.fontWeight === 'bold' && "font-bold",
        characterStyle.fontWeight === 'black' && "font-black",
        intensiveGlitch && !reducedMotion && globalIndex % 2 === 0 && "opacity-0",
        isHoveredFinal && "character-hovered"
      )}
      style={{
        color: characterStyle.textColor,
        textShadow: isHoveredFinal ?
          `0 0 10px ${characterStyle.textColor}80` :
          (characterStyle.glitchShadow || 'none'),
        filter: characterStyle.glitchFilter || 'none',
        willChange: characterStyle.willChange,
        x: xSpring,
        y: ySpring,
        rotateY: rotateYSpring,
        rotateX: rotateXSpring,
        rotateZ: rotateZSpring,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center',
        backfaceVisibility: 'hidden',
        transition: 'scale 0.2s ease',
        zIndex: isHoveredFinal ? 10 : 'auto',
        WebkitFontSmoothing: 'subpixel-antialiased'
      }}
      variants={shouldAnimate && systemShouldAnimate() ? getCharacterVariants : undefined}
      initial={isAnimated ? "initial" : undefined}
      animate={isAnimated ? "animate" : undefined}
      custom={charIndex} // Use character index for more precise animations
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-hidden={wordIndex !== 0 && charIndex !== 0 ? "true" : undefined}
    >
      {char}

      {/* Only add shadow effect when needed */}
      {isHoveredFinal && !reducedMotion && (
        <motion.span
          className="absolute left-0 top-0 opacity-0 character-shadow font-heading"
          style={{
            color: characterStyle.textColor,
            filter: `blur(${shadowBlur.get()}px)`,
            opacity: shadowOpacity,
            transform: 'translateZ(-20px)',
            willChange: 'opacity, filter'
          }}
          aria-hidden="true"
        >
          {char}
        </motion.span>
      )}
    </motion.span>
  );
};

// Fixed areEqual function to always return a boolean value
function areEqual(prevProps: CharacterProps, nextProps: CharacterProps): boolean {
  // Check primitive props first for better performance
  if (
    prevProps.char !== nextProps.char ||
    prevProps.wordIndex !== nextProps.wordIndex ||
    prevProps.charIndex !== nextProps.charIndex ||
    prevProps.globalIndex !== nextProps.globalIndex ||
    prevProps.glitchActive !== nextProps.glitchActive ||
    prevProps.intensiveGlitch !== nextProps.intensiveGlitch ||
    prevProps.isAnimated !== nextProps.isAnimated ||
    prevProps.shouldAnimate !== nextProps.shouldAnimate ||
    prevProps.influence !== nextProps.influence ||
    prevProps.energyLevel !== nextProps.energyLevel ||
    prevProps.isHovered !== nextProps.isHovered
  ) {
    return false;
  }

  // Check variants - need deeper comparison
  if (prevProps.variants !== nextProps.variants) {
    // If one has variants and the other doesn't, they're different
    if (!prevProps.variants || !nextProps.variants) {
      return false;
    }

    // Do a simple check on the variants structure
    const prevKeys = Object.keys(prevProps.variants);
    const nextKeys = Object.keys(nextProps.variants);

    if (prevKeys.length !== nextKeys.length) {
      return false;
    }

    // Check if keys are the same
    for (const key of prevKeys) {
      if (!nextKeys.includes(key)) {
        return false;
      }
    }

    // Deep equality check would be too expensive, so we'll consider them
    // equal if they have the same shape (heuristic)
  }

  // Only check glitchOffsets if glitch is active to avoid unnecessary work
  if (nextProps.glitchActive) {
    // Only check the relevant offsets for this character
    if (
      prevProps.glitchOffsets[prevProps.globalIndex] !== nextProps.glitchOffsets[nextProps.globalIndex] ||
      prevProps.glitchOffsets[prevProps.globalIndex + 1] !== nextProps.glitchOffsets[nextProps.globalIndex + 1]
    ) {
      return false;
    }
  }

  // If we got here, the props are considered equal
  return true;
}

export default memo(HeadlineCharacter, areEqual);