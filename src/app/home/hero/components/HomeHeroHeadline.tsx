// src/app/home/components/HomeHeroHeadline.tsx
'use client'

import React, { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AccentColors, GlitchProps } from './headline/HeadlineTypes'
import { useAnimationStyles, PatternType } from './headline/AnimationStyles'
import { containerVariants } from './headline/HeadlineAnimations'
import { getTextColor } from './headline/TextColorUtil'
import HeadlineWord from './headline/HeadlineWord'
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences'
import { animationManager } from '@/components/core/Animations/utils/AnimationManager'

interface HomeHeroHeadlineProps extends GlitchProps {
  headline: string
  accentColors?: AccentColors
  heroAnimationComplete?: boolean
  animationProgress?: number
  animationPattern?: PatternType
}

const HomeHeroHeadline: React.FC<HomeHeroHeadlineProps> = ({
  headline,
  glitchActive,
  intensiveGlitch,
  glitchOffsets,
  accentColors = {
    primary: 'var(--color-accent-primary)',
    secondary: 'var(--color-accent-secondary)',
    tertiary: 'var(--color-accent-tertiary)',
    brand: 'var(--color-brand-primary)'
  },
  heroAnimationComplete = false,
  animationProgress = 0,
  animationPattern = 'mixed'
}) => {
  // Get animation preferences
  const { reducedMotion, shouldAnimate } = useAnimationPreferences();
  const { getStyleForWord, getAnimationStyle, getWordAnimationLevel } = useAnimationStyles(animationPattern);

  // Component ID for animation tracking
  const componentId = React.useRef(`hero-headline-${Math.random().toString(36).slice(2, 9)}`);

  // Split headline into words
  const words = React.useMemo(() => headline.split(' '), [headline]);

  // Control animation state
  const [hasAnimated, setHasAnimated] = useState(false);

  // Start animation when component is ready
  useEffect(() => {
    if (animationProgress > 0.5 && !hasAnimated) {
      // Register animation with manager
      if (shouldAnimate()) {
        animationManager.trackAnimation(componentId.current, 'headline-animation');

        setHasAnimated(true);

        // Cleanup after animation completes
        const animationTimeout = setTimeout(() => {
          animationManager.untrackAnimation(componentId.current);
        }, 2500);

        return () => {
          clearTimeout(animationTimeout);
          animationManager.untrackAnimation(componentId.current);
        };
      }
    }
  }, [animationProgress, hasAnimated, shouldAnimate]);

  // Container variants for animation
  const enhancedContainerVariants = React.useMemo(() => {
    if (reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } }
      };
    }

    return {
      ...containerVariants,
      animate: {
        ...containerVariants.animate,
        transition: {
          ...containerVariants.animate.transition,
          staggerChildren: 0.12,
          delayChildren: 0.1
        }
      }
    };
  }, [reducedMotion]);

  // Calculate global character offset for indexing
  let globalCharsOffset = 0;

  return (
    <motion.div
      className="col-span-12 mb-12 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: animationProgress }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        willChange: 'opacity',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      <div className="relative">
        <motion.div
          className="flex flex-wrap gap-2 md:gap-4 items-baseline relative"
          variants={enhancedContainerVariants}
          initial="initial"
          animate={hasAnimated ? "animate" : "initial"}
        >
          {words.map((word, wordIndex) => {
            // Get animation style for this word
            const animationStyle = getStyleForWord(wordIndex, words.length);

            // Determine animation level (word or character)
            const animationLevel = getWordAnimationLevel(wordIndex, animationPattern);

            // Get variants based on style and level
            const variants = getAnimationStyle(animationStyle, animationLevel);

            // Calculate animation delay
            const animationDelay = wordIndex === 0 ? 0 : 0.1 + (wordIndex * 0.12);

            // Track character offset for consistent indexing
            const currentOffset = globalCharsOffset;
            globalCharsOffset += word.length + (wordIndex > 0 ? 1 : 0);

            return (
              <HeadlineWord
                key={`word-${wordIndex}`}
                word={word}
                wordIndex={wordIndex}
                globalCharsOffset={currentOffset}
                glitchActive={glitchActive}
                intensiveGlitch={intensiveGlitch}
                glitchOffsets={glitchOffsets}
                isAnimated={hasAnimated}
                shouldAnimate={animationProgress > 0.8}
                animationDelay={animationDelay}
                animationStyle={animationStyle}
                variants={variants}
                charVariants={variants.charVariant}
                highPriority={wordIndex === 0}
                animationLevel={animationLevel}
              />
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default memo(HomeHeroHeadline);