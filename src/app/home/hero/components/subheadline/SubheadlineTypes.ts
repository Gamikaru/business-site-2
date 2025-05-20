import { MotionValue } from 'framer-motion';

export interface TechnicalData {
  systemLoad: number;
  coordinates: { x: number; y: number };
  spectrumValue: number;
}

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

export interface FormattedSubheadline {
  firstThreeWords: string[];
  remainingWords: string;
}

export interface BoxProps {
  index: number;
  text: string;
  isLarge?: boolean;
  positionClass?: string;
  boxYPosition?: number | string;
  boxRotation?: number;
  boxScale?: number;
  isHovered?: boolean;
  onHover: (index: number | null) => void;
  accentColors: AccentColors;
  animationControls: {
    isInitializing: boolean;
    isAnimating: boolean;
    isComplete: boolean;
    sequenceId: string;
  };
  sequenceStep?: string;
  animationProgress?: number;
  isInView?: boolean;
}

// Particle configuration for animated elements
export interface ParticleConfig {
  id: string;
  size: number;
  color: string;
  top: string;
  left: string;
  opacity: number;
  xMovement: number;
  yMovement: number;
  duration: number;
  delay: number;
  shape: 'circle' | 'square' | 'diamond';
}

// Performance configuration
export interface PerformanceConfig {
  useHardwareAcceleration: boolean;
  reducedMotion: boolean;
  optimizeForMobile: boolean;
  optimizeForLowPower: boolean;
  enableParticles: boolean;
  maxParticles: number;
}
