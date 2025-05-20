import { useMemo } from 'react';
import { useAnimationPreferences } from '@/components/core/Animations';

/**
 * Custom hook for managing box grid animations and thresholds
 */
export const useBoxGridAnimations = (animationProgress: number) => {
  // Get animation preferences for timing calculations
  const { getIntensity } = useAnimationPreferences();

  // Animation thresholds for staged box appearance
  const boxAnimationStates = useMemo(() => {
    // Calculate animation thresholds with improved cascading effect
    const baseThreshold = 0.25;
    const stepGap = 0.12;
    const intensity = getIntensity(1);

    // Adjust animation timing based on intensity
    const adjustedBaseThreshold = baseThreshold / intensity;
    const adjustedStepGap = stepGap / intensity;

    return {
      box0: animationProgress > adjustedBaseThreshold,
      box1: animationProgress > adjustedBaseThreshold + adjustedStepGap,
      box2: animationProgress > adjustedBaseThreshold + adjustedStepGap * 2,
      box3: animationProgress > adjustedBaseThreshold + adjustedStepGap * 3,
      connector:
        animationProgress > adjustedBaseThreshold + adjustedStepGap * 4,
    };
  }, [animationProgress, getIntensity]);

  // Calculate per-box animation progress for smoother transitions
  const getBoxAnimationProgress = (index: number): number => {
    const threshold =
      index === 0 ? 0.25 : index === 1 ? 0.37 : index === 2 ? 0.49 : 0.61;

    // Create a normalized progress that goes from 0 to 1 as the box animates in
    if (animationProgress <= threshold) return 0;

    // 0.2 is the duration of each box's animation
    const boxProgress = Math.min(1, (animationProgress - threshold) / 0.2);
    return boxProgress;
  };

  return {
    boxAnimationStates,
    getBoxAnimationProgress
  };
};
