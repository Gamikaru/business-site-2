// src/app/home/components/ContentFormatter.ts
import { FormattedSubheadline } from './SubheadlineTypes';

// Format the subheadline content with caching for better performance
let cachedSubheadline = '';
let cachedResult: FormattedSubheadline | null = null;

// Format subheadline content for the staggered box layout
export const formatContent = (
  subheadline: string
): { firstThreeWords: string[]; remainingWords: string } => {
  const words = subheadline.split(' ');
  const firstThree = words.slice(0, 3);
  const remaining = words.slice(3).join(' ');

  // Ensure we have exactly 3 elements in firstThreeWords
  while (firstThree.length < 3) {
    firstThree.push('');
  }

  return { firstThreeWords: firstThree, remainingWords: remaining };
};

// Preload content for better performance
export const preloadContent = (subheadline: string): void => {
  // This could be expanded to preload other resources
  formatContent(subheadline);
};

// Clear cache when needed (e.g., when subheadline might change)
export const clearContentCache = (): void => {
  cachedSubheadline = '';
  cachedResult = null;
};