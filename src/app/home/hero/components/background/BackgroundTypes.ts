// src/app/home/components/background/BackgroundTypes.ts
import { MotionValue } from 'framer-motion'

export interface AccentColors {
  primary: string
  secondary: string
  tertiary: string
  warm?: string
  contrast?: string
  oceanic?: string
  cosmic?: string
  brand: string
}

export interface MousePosition {
  x: number
  y: number
  clicked: boolean
}

export interface AnimationControls {
  isInitializing: boolean
  isAnimating: boolean
  isComplete: boolean
  sequenceId: string
  progress: number // Added progress for smoother transitions
}

export interface BackgroundBaseProps {
  accentColors: AccentColors
  mousePosition: MousePosition
  animationControls: AnimationControls
  highPerformanceMode?: boolean
}

export interface GlitchProps {
  glitchActive: boolean
  intensiveGlitch: boolean
  glitchOffsets: number[]
}

export interface ScrollEffectProps {
  scrollY: MotionValue<number>
  scrollYProgress: MotionValue<number>
  scrollVelocity?: MotionValue<number>
}