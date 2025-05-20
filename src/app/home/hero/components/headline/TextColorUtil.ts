// src/app/home/components/TextColorUtil.ts
import { useAnimationPreferences } from '@/components/core/Animations/hooks/useAnimationPreferences';

// Cache for color calculations to improve performance
const colorCache: Record<string, string> = {};

/**
 * Gets varied text colors from semantic variables with improved distribution
 * Now respects high contrast mode from animation preferences
 */
export const getTextColor = (
  wordIndex: number,
  globalIndex: number,
  highContrast: boolean = false
): string => {
  // Check cache first to avoid recalculation
  const cacheKey = `${wordIndex}-${globalIndex}-${highContrast ? 'high' : 'normal'}`;
  if (colorCache[cacheKey]) {
    return colorCache[cacheKey];
  }

  // In high contrast mode, use more limited palette with better contrast
  if (highContrast) {
    const color = globalIndex % 5 === 0
      ? 'var(--color-contrast-accent)'
      : 'var(--color-primary-text)';

    colorCache[cacheKey] = color;
    return color;
  }

  // Create a more intentional pattern rather than random distribution
  // This creates a more cohesive visual rhythm
  let color: string;

  if (globalIndex % 12 === 0) color = 'var(--color-accent-primary)';
  else if (globalIndex % 9 === 0) color = 'var(--color-accent-secondary)';
  else if (globalIndex % 7 === 0) color = 'var(--color-accent-tertiary)';
  else if (globalIndex % 11 === 0) color = 'var(--color-text-emphasis)';
  else if (globalIndex % 10 === 0) color = 'var(--color-heading-accent)';
  else if (globalIndex % 8 === 0) color = 'var(--color-brand-primary)';
  else {
    color = wordIndex % 3 === 0 ? 'var(--color-primary-text)' :
            wordIndex % 3 === 1 ? 'var(--color-accent-primary)' :
                                'var(--color-primary-text)';
  }

  // Save to cache
  colorCache[cacheKey] = color;

  return color;
};

// Hook to integrate with animation preferences
export const useTextColorSystem = () => {
  const { reducedMotion } = useAnimationPreferences();

  // Prefer higher contrast for reduced motion users
  const highContrast = reducedMotion;

  return {
    getTextColor: (wordIndex: number, globalIndex: number) =>
      getTextColor(wordIndex, globalIndex, highContrast),
    precomputeColors,
    clearColorCache
  };
};

// Precompute colors for common indices to improve first render performance
export const precomputeColors = (
  maxWordIndex: number = 10,
  maxGlobalIndex: number = 100,
  highContrast: boolean = false
): void => {
  for (let w = 0; w < maxWordIndex; w++) {
    for (let g = 0; g < maxGlobalIndex; g++) {
      getTextColor(w, g, highContrast);
    }
  }
};

// Clear cache if needed (e.g., theme change)
export const clearColorCache = (): void => {
  Object.keys(colorCache).forEach(key => {
    delete colorCache[key];
  });
};