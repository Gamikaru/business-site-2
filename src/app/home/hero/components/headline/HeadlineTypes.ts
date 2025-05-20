// src/app/home/components/headline/HeadlineTypes.ts
import { MotionValue, Variants } from 'framer-motion';
import { AnimationLevel } from './AnimationStyles';

export interface AccentColors {
  primary: string;
  secondary: string;
  tertiary: string;
  warm?: string;
  contrast?: string;
  oceanic?: string;
  cosmic?: string;
  brand: string;
}

export interface GlitchProps {
  glitchActive: boolean;
  intensiveGlitch: boolean;
  glitchOffsets: number[];
}

export interface CharacterProps {
  char: string;
  wordIndex: number;
  charIndex: number;
  globalIndex: number;
  glitchActive: boolean;
  intensiveGlitch: boolean;
  glitchOffsets: number[];
  getTextColor: (wordIndex: number, globalIndex: number) => string;
  isAnimated: boolean;
  shouldAnimate?: boolean;
  animationDelay?: number;
  variants?: Variants; // Added for word-based animation system
  influence?: number; // Mouse proximity influence (0-1)
  energyLevel?: number; // Overall energy level of the headline (0-100)
  isHovered?: boolean; // Whether the character is hovered
}

// Character style options
export interface CharacterStyleOptions {
  textColor: string;
  italic: boolean;
  fontWeight: 'black' | 'bold' | 'medium' | 'normal';
  glitchTransform?: string;
  glitchFilter?: string;
  glitchShadow?: string;
  willChange: string;
  transform?: string;
  scale?: number; // Scale factor
  y?: number; // Y offset
  rotateY?: number; // 3D rotation
}

// Word animation options
export interface WordAnimationOptions {
  style: string;
  delay: number;
  intensity: number;
  charStagger?: number;
  level?: AnimationLevel; // Add animation level
  custom?: Record<string, any>;
}