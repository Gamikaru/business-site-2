import { AccentColors } from '../SubheadlineTypes';

/**
 * Get connector color based on the boxes it connects
 *
 * @param fromIndex Source box index
 * @param toIndex Target box index
 * @param hoveredBox Currently hovered box index
 * @param accentColors Accent color configuration
 * @param animationProgress Current animation progress
 * @returns CSS color string with appropriate opacity
 */
export const getConnectorColor = (
  fromIndex: number,
  toIndex: number,
  hoveredBox: number | null,
  accentColors: AccentColors,
  animationProgress: number
): string => {
  // Base color based on source box
  const baseColor =
    fromIndex === 0
      ? accentColors.primary
      : fromIndex === 1
        ? accentColors.secondary
        : accentColors.tertiary;

  // Highlight connections to hovered box with full opacity
  if (hoveredBox === fromIndex || hoveredBox === toIndex) {
    return hoveredBox === fromIndex ? accentColors.brand : baseColor;
  }

  // For non-hovered connections, calculate opacity based on animation progress
  const progressFactor = Math.min(1, (animationProgress - 0.5) * 2);

  // Convert color to rgba with appropriate opacity
  return colorToRgba(baseColor, 0.65 * progressFactor);
};

/**
 * Calculate animation delay for staggered connector appearance
 *
 * @param index Connection index
 * @returns Animation delay in seconds
 */
export const getAnimationDelay = (index: number): number => {
  return 0.5 + index * 0.2;
};

/**
 * Helper function to convert any color format to RGBA
 *
 * @param color Color in hex, rgb, or rgba format
 * @param alpha Opacity value (0-1)
 * @returns RGBA color string
 */
export const colorToRgba = (color: string, alpha: number): string => {
  // Check if already rgba
  if (color.startsWith("rgba")) return color;

  // Check if rgb
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  }

  // Handle hex and other formats
  const rgb = hexToRgb(color);
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
};

/**
 * Convert hex color to RGB components
 *
 * @param hex Hex color string (with or without #)
 * @returns Array of RGB values [r, g, b]
 */
export const hexToRgb = (hex: string): [number, number, number] => {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse as RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
};
