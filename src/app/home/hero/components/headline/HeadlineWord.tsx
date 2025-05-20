// src/app/home/components/headline/HeadlineWord.tsx
'use client'

import React, { memo, useEffect, useRef } from 'react';
import { motion, useAnimationControls, Variants } from 'framer-motion';
import { GlitchProps } from './HeadlineTypes';
import HeadlineCharacter from './HeadlineCharacter';
import { getTextColor } from './TextColorUtil';
import { AnimationStyleName, AnimationLevel } from './AnimationStyles';
import { animationManager } from '@/components/core/Animations/utils/AnimationManager';

interface HeadlineWordProps extends GlitchProps {
  word: string;
  wordIndex: number;
  globalCharsOffset: number;
  isAnimated: boolean;
  shouldAnimate?: boolean;
  animationDelay?: number;
  animationStyle: AnimationStyleName;
  variants: Variants;
  charVariants?: Variants;
  highPriority?: boolean;
  animationLevel?: AnimationLevel; // Add animation level prop
}

const HeadlineWord: React.FC<HeadlineWordProps> = ({
  word,
  wordIndex,
  globalCharsOffset,
  glitchActive,
  intensiveGlitch,
  glitchOffsets,
  isAnimated,
  shouldAnimate = true,
  animationDelay = 0,
  animationStyle,
  variants,
  charVariants,
  highPriority = false,
  animationLevel = 'word' // Default to word-level animation
}) => {
  // Animation controls for more precise timing control
  const controls = useAnimationControls();

  // Generate a unique ID for animation tracking
  const animationId = useRef(`headline-word-${wordIndex}-${Math.random().toString(36).substring(2, 9)}`);

  // Reference to track if this word has animated yet
  const hasAnimatedRef = useRef(false);

  // Start animation when appropriate
  useEffect(() => {
    if (isAnimated && shouldAnimate && !hasAnimatedRef.current) {
      // Track this animation with the system
      animationManager.trackAnimation(animationId.current, `word-animation-${animationStyle}`);

      // Delay animation start based on word position
      const timer = setTimeout(() => {
        controls.start("animate");

        // Mark complete after animation duration
        const completeTimer = setTimeout(() => {
          hasAnimatedRef.current = true;
          animationManager.untrackAnimation(animationId.current);
        }, (animationDelay + 1.2) * 1000); // Extra time to ensure completion

        return () => clearTimeout(completeTimer);
      }, animationDelay * 1000);

      return () => {
        clearTimeout(timer);
        animationManager.untrackAnimation(animationId.current);
      };
    }
  }, [isAnimated, shouldAnimate, animationDelay, controls, animationStyle]);

  // Set proper initial animation state
  useEffect(() => {
    if (isAnimated && shouldAnimate) {
      controls.set("initial");
    }
  }, [isAnimated, shouldAnimate, controls]);

  return (
    <motion.div
      className="relative inline-block perspective-effect"
      custom={wordIndex}
      variants={variants}
      initial="initial"
      animate={controls}
      style={{
        transformStyle: 'preserve-3d',
        marginRight: '0.3em',
        willChange: isAnimated && shouldAnimate ? 'transform, opacity' : 'auto',
        // Priority markers for dev debugging
        ...(process.env.NODE_ENV === 'development' && highPriority ?
          { outline: '1px solid rgba(0,255,0,0.1)' } : {})
      }}
      data-word-index={wordIndex}
      data-animation-style={animationStyle}
      data-animation-level={animationLevel}
    >
      {/* Word container with enhanced 3D effect */}
      <div className="relative inline-block translate-z-0">
        {word.split('').map((char, charIndex) => {
          // Calculate global character index
          const globalIndex = globalCharsOffset + charIndex;

          return (
            <HeadlineCharacter
              key={`char-${wordIndex}-${charIndex}`}
              char={char}
              wordIndex={wordIndex}
              charIndex={charIndex}
              globalIndex={globalIndex}
              glitchActive={glitchActive}
              intensiveGlitch={intensiveGlitch}
              glitchOffsets={glitchOffsets}
              getTextColor={getTextColor}
              isAnimated={isAnimated}
              shouldAnimate={shouldAnimate}
              // Only pass character variants if this is a character-level animation
              variants={animationLevel === 'character' ? charVariants : undefined}
              // Character delay is staggered within the word only for character-level animations
              animationDelay={animationLevel === 'character' ?
                animationDelay + (charIndex * 0.04) :
                animationDelay}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

// Custom equality check for better performance
function arePropsEqual(prev: HeadlineWordProps, next: HeadlineWordProps) {
  return (
    prev.word === next.word &&
    prev.wordIndex === next.wordIndex &&
    prev.globalCharsOffset === next.globalCharsOffset &&
    prev.glitchActive === next.glitchActive &&
    prev.intensiveGlitch === next.intensiveGlitch &&
    prev.isAnimated === next.isAnimated &&
    prev.shouldAnimate === next.shouldAnimate &&
    prev.animationDelay === next.animationDelay &&
    prev.animationStyle === next.animationStyle &&
    prev.highPriority === next.highPriority &&
    prev.animationLevel === next.animationLevel
  );
}

export default memo(HeadlineWord, arePropsEqual);