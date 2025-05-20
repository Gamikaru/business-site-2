// src/app/home/components/subheadline/utils/BoxStyles.ts
import { AccentColors } from '../SubheadlineTypes';

// Enhanced box styling with proper light/dark mode support
export const getBoxStyle = (index: number, isHovered: boolean, accentColors: AccentColors) => {
  // Get the appropriate color for the box border
  const borderColorMap = {
    0: accentColors.primary,
    1: accentColors.secondary,
    2: accentColors.tertiary,
    3: accentColors.brand
  };

  // Get the appropriate shadow color for hover state
  const shadowColorMap = {
    0: `rgba(var(--rgb-accent-primary, 97, 218, 251), ${isHovered ? 0.4 : 0.2})`,
    1: `rgba(var(--rgb-accent-secondary, 241, 90, 36), ${isHovered ? 0.4 : 0.2})`,
    2: `rgba(var(--rgb-accent-tertiary, 80, 200, 120), ${isHovered ? 0.4 : 0.2})`,
    3: `rgba(var(--rgb-brand-primary, 64, 156, 255), ${isHovered ? 0.5 : 0.25})`
  };

  const borderColor = borderColorMap[index as keyof typeof borderColorMap] || accentColors.primary;
  const shadowColor = shadowColorMap[index as keyof typeof shadowColorMap];

  // Enhanced style with proper light/dark mode support
  const baseStyle: React.CSSProperties = {
    // Use card-bg which will be light in light mode, dark in dark mode
    backgroundColor: `var(--color-card-bg)`,
    backdropFilter: `blur(${isHovered ? 12 : 8}px)`,
    WebkitBackdropFilter: `blur(${isHovered ? 12 : 8}px)`, // For Safari support
    borderLeft: `${index === 3 ? 6 : 3}px solid ${borderColor}`,
    boxShadow: isHovered
      ? `0px ${index === 3 ? 25 : 15}px ${index === 3 ? 40 : 30}px rgba(0,0,0,0.2),
         0px 0px 15px ${shadowColor},
         inset 0px 0px 5px rgba(255,255,255,0.05)`
      : `0px ${index === 3 ? 8 : 4}px ${index === 3 ? 20 : 15}px rgba(0,0,0,0.1)`,
    transition: "box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), backdrop-filter 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), background-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
    overflow: "hidden",
    willChange: 'transform, box-shadow', // Hardware acceleration hint
    transform: 'translate3d(0,0,0)', // Force hardware acceleration
    border: `1px solid ${isHovered ? 'var(--color-border)' : 'var(--color-border-subtle)'}`,
    borderRadius: '4px',
    // Ensure backface visibility is hidden for better 3D transforms
    backfaceVisibility: 'hidden'
  };

  return baseStyle;
};

// Function to get box z-index based on state
export const getBoxZIndex = (index: number, isHovered: boolean): number => {
  const isFinalBox = index === 3;
  return isHovered ? (isFinalBox ? 30 : 20) : (isFinalBox ? 20 : 10);
};

// Get gradient color based on index
export const getGradientColor = (index: number, accentColors: AccentColors) => {
  const isFinalBox = index === 3;

  return isFinalBox ? accentColors.brand :
         index === 0 ? accentColors.primary :
         index === 1 ? accentColors.secondary :
         accentColors.tertiary;
};