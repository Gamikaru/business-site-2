// src/app/home/components/headline/animationStyles.ts
import { Variants, Variant, TargetAndTransition } from 'framer-motion';
import { useAnimationPreferences } from '@/components/core/Animations';

export type AnimationStyleName =
  | 'rise'
  | 'drop'
  | 'expand'
  | 'reveal'
  | 'spiral'
  | 'wave'
  | 'slide'
  | 'stagger'
  | 'flip'
  | 'glitch';

// Animation level - whether the animation applies to whole words or individual characters
export type AnimationLevel = 'word' | 'character';

// Pattern functions to determine which style to use for each word
export type PatternType = 'sequence' | 'alternate' | 'random' | 'emphasis' | 'gradient' | 'mixed';

interface StyleOptions {
  reducedMotion: boolean;
  duration: number;
  ease: [number, number, number, number];
  intensity: number;
  level?: AnimationLevel; // Add animation level option
}

// Define our custom variants type without extending Variants
interface EnhancedVariants {
  initial?: Variant;
  animate?: Variant;
  exit?: Variant;
  charVariant?: {
    initial?: any;
    animate?: any;
    exit?: any;
  };
  [key: string]: any; // Allow other variant keys
}

// Get animation variants based on style name and options
export const getAnimationStyle = (
  styleName: AnimationStyleName,
  options: StyleOptions
): EnhancedVariants => {
  const { reducedMotion, duration, ease, intensity, level = 'word' } = options;

  // Reduced motion variants - simple fade-in effect
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { duration: Math.min(0.3, duration * 0.5) }
      }
    };
  }

  // Define animation styles with modifiable properties based on options
  switch (styleName) {
    case 'rise':
      return {
        initial: {
          opacity: 0,
          y: 40 * intensity,
          rotateX: 10 * intensity,
          scale: 0.9
        },
        animate: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          transition: {
            duration: duration * 0.8,
            ease,
            opacity: { duration: duration * 0.5 }
          }
        }
      };

    case 'drop':
      return {
        initial: {
          opacity: 0,
          y: -30 * intensity,
          rotateZ: -3 * intensity,
          scale: 0.95
        },
        animate: {
          opacity: 1,
          y: 0,
          rotateZ: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 400 * intensity,
            damping: 30,
            mass: 1,
            opacity: { duration: duration * 0.5 }
          }
        }
      };

    case 'expand':
      return {
        initial: {
          opacity: 0,
          scaleX: 0.7 * Math.max(0.5, intensity),
          scaleY: 1.1 * Math.min(1.5, intensity)
        },
        animate: {
          opacity: 1,
          scaleX: 1,
          scaleY: 1,
          transition: {
            duration: duration * 0.9,
            ease,
            scaleX: { duration: duration * 0.8 },
            scaleY: { duration: duration * 0.7 }
          }
        }
      };

    case 'reveal':
      return {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.04 * duration * intensity,
            delayChildren: 0.1 * duration
          }
        }
      };

    case 'spiral':
      return {
        initial: {
          opacity: 0,
          scale: 0.8,
          rotateZ: -90 * intensity,
          rotateY: -45 * intensity
        },
        animate: {
          opacity: 1,
          scale: 1,
          rotateZ: 0,
          rotateY: 0,
          transition: {
            duration: duration * 1.1,
            ease: [0.34, 1.56, 0.64, 1], // Spring-like custom bezier
            opacity: { duration: duration * 0.6 }
          }
        }
      };

    case 'wave':
      return {
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.06 * duration * intensity,
            delayChildren: 0.05 * duration
          }
        },
        // Character-level animation defined separately
        charVariant: {
          initial: {
            opacity: 0,
            y: (i: number) => Math.sin(i * 0.5) * 20 * intensity,
            rotateZ: (i: number) => Math.sin(i * 0.5) * 10 * intensity
          } as unknown as TargetAndTransition, // Type casting to fix function property issue
          animate: {
            opacity: 1,
            y: 0,
            rotateZ: 0,
            transition: {
              duration: duration * 0.6,
              ease
            }
          }
        }
      };

    case 'slide':
      return {
        initial: {
          opacity: 0,
          x: (i: number) => (i % 2 === 0 ? -40 : 40) * intensity
        } as unknown as TargetAndTransition, // Type casting
        animate: {
          opacity: 1,
          x: 0,
          transition: {
            duration: duration * 0.7,
            ease
          }
        }
      };

    case 'stagger':
      return {
        initial: { opacity: 0, y: 30 * intensity },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: duration * 0.7,
            ease,
            // Apply stagger only for character-level animations
            ...(level === 'character' && {
              staggerChildren: 0.03 * duration * intensity,
              delayChildren: 0.05 * duration
            })
          }
        },
        // Add character-specific variants for character-level staggering
        charVariant: level === 'character' ? {
          initial: { opacity: 0, y: 15 * intensity },
          animate: {
            opacity: 1,
            y: 0,
            transition: {
              duration: duration * 0.5,
              ease
            }
          }
        } : undefined
      };

    case 'flip':
      return {
        initial: {
          opacity: 0,
          rotateX: 90 * intensity,
          scale: 0.9
        },
        animate: {
          opacity: 1,
          rotateX: 0,
          scale: 1,
          transition: {
            duration: duration * 0.8,
            ease: [0.16, 1, 0.3, 1], // Custom ease for flip
            opacity: { duration: duration * 0.5 }
          }
        }
      };

    case 'glitch':
      return {
        initial: {
          opacity: 0,
          x: 0,
          skewX: 0
        },
        animate: {
          opacity: 1,
          transition: {
            duration: duration * 0.5,
            ease,
            staggerChildren: 0.02 * duration * intensity
          }
        },
        // Glitch effect defined at character level
        charVariant: {
          initial: {
            opacity: 0,
            x: (i: number) => (Math.random() * 2 - 1) * 20 * intensity,
            y: (i: number) => (Math.random() * 2 - 1) * 10 * intensity,
            skewX: (i: number) => (Math.random() * 2 - 1) * 8 * intensity
          } as unknown as TargetAndTransition, // Type casting
          animate: {
            opacity: 1,
            x: 0,
            y: 0,
            skewX: 0,
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 20,
              opacity: { duration: duration * 0.3 }
            }
          }
        }
      };

    default:
      // Default fallback animation
      return {
        initial: { opacity: 0, y: 20 * intensity },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: duration * 0.6,
            ease
          }
        }
      };
  }
};

// Get a style for a word based on pattern and position
export const getStyleForWord = (
  index: number,
  totalWords: number,
  pattern: PatternType = 'sequence'
): AnimationStyleName => {
  const styles: AnimationStyleName[] = [
    'rise', 'drop', 'expand', 'reveal', 'spiral',
    'wave', 'slide', 'stagger', 'flip', 'glitch'
  ];

  // Special handling for mixed pattern - first word gets 'stagger', others get unique animations
  if (pattern === 'mixed') {
    if (index === 0) return 'stagger';
    // Use more distinct animations for subsequent words
    const remainingStyles = ['rise', 'drop', 'expand', 'flip', 'spiral'];
    return remainingStyles[(index - 1) % remainingStyles.length];
  }

  switch (pattern) {
    case 'sequence':
      // Cycle through styles in order
      return styles[index % styles.length];

    case 'alternate':
      // Alternate between two styles
      return index % 2 === 0 ? 'rise' : 'drop';

    case 'random':
      // Pseudorandom but deterministic based on index
      return styles[(index * 13) % styles.length];

    case 'emphasis':
      // Emphasize first and last words, standard for others
      if (index === 0) return 'expand';
      if (index === totalWords - 1) return 'spiral';
      return 'stagger';

    case 'gradient':
      // Transition from one style family to another
      const position = index / (totalWords - 1);
      if (position < 0.33) return 'rise';
      if (position < 0.66) return 'reveal';
      return 'wave';

    default:
      return 'rise';
  }
};

// Hook to get animation styles with system preferences
export const useAnimationStyles = (pattern: PatternType = 'sequence') => {
  const { reducedMotion, getTransitionSettings, getIntensity } = useAnimationPreferences();
  const { duration, ease } = getTransitionSettings('default');

  const intensity = getIntensity(1);

  const options: StyleOptions = {
    reducedMotion,
    duration,
    ease: Array.isArray(ease) && ease.length === 4
      ? ease as [number, number, number, number]
      : [0.4, 0, 0.2, 1],
    intensity
  };

  return {
    getStyleForWord: (index: number, totalWords: number) =>
      getStyleForWord(index, totalWords, pattern),
    getAnimationStyle: (styleName: AnimationStyleName, level?: AnimationLevel) =>
      getAnimationStyle(styleName, { ...options, level }),
    getWordAnimationLevel: (index: number, pattern: PatternType): AnimationLevel => {
      // For mixed pattern, first word gets character-level animation
      if (pattern === 'mixed' && index === 0) return 'character';

      // For sequence pattern, make every 3rd word character-level for visual interest
      if (pattern === 'sequence' && index % 3 === 0) return 'character';

      // For emphasis pattern, first and last words get character-level animation
      if (pattern === 'emphasis' && (index === 0 || index === totalWords - 1)) return 'character';

      // For gradient pattern, add character animation at the transition points
      if (pattern === 'gradient' && (index % 4 === 0)) return 'character';

      // Default to word-level animation for better performance
      return 'word';
    }
  };
};