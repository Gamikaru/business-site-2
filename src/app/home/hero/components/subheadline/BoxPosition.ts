// src/app/home/components/subheadline/BoxPosition.ts

/**
 * Get position classes for each box based on index with enhanced responsive layouts
 *
 * @param index - Box index (0-3)
 * @returns Tailwind CSS classes for positioning
 */
export const getBoxPositionClasses = (index: number): string => {
    // Predefined positions for each box with improved responsive behavior
    const positions = [
        // First box (top right) - improved responsive behavior with better positioning
        'col-span-4 col-start-9 sm:col-span-4 sm:col-start-9 md:col-span-3 md:col-start-10 lg:col-start-10 xl:col-span-2 xl:col-start-10',

        // Second box (middle right) - improved staggering effect
        'col-span-4 col-start-7 sm:col-span-4 sm:col-start-7 md:col-span-3 md:col-start-8 lg:col-start-7 xl:col-span-2 xl:col-start-8',

        // Third box (bottom left) - improved positioning
        'col-span-4 col-start-5 sm:col-span-4 sm:col-start-5 md:col-span-3 md:col-start-6 lg:col-start-4 xl:col-span-2 xl:col-start-6',

        // Final large box - improved sizing and centering for better flow and focus
        'col-span-10 col-start-2 sm:col-span-10 sm:col-start-2 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4 xl:col-span-6 xl:col-start-4'
    ];

    return positions[Math.min(index, positions.length - 1)];
};

// Pre-calculated positions for performance optimization
export const PRECALCULATED_POSITIONS = [
    getBoxPositionClasses(0),
    getBoxPositionClasses(1),
    getBoxPositionClasses(2),
    getBoxPositionClasses(3)
];

/**
 * Get box z-index based on state with improved layering logic
 *
 * @param index - Box index (0-3)
 * @param isHovered - Whether the box is currently hovered
 * @returns z-index value
 */
export const getBoxZIndex = (index: number, isHovered: boolean): number => {
    const isFinalBox = index === 3;

    // Base z-index values
    const baseZIndex = isFinalBox ? 20 : 10 + index;

    // Additional z-index when hovered to ensure it appears on top
    const hoverBoost = isHovered ? 20 : 0;

    return baseZIndex + hoverBoost;
};

/**
 * Generate 3D transform styles for more sophisticated box positioning
 *
 * @param index - Box index (0-3)
 * @param isHovered - Whether the box is currently hovered
 * @returns CSS transform string for 3D positioning
 */
export const getBoxTransform = (index: number, isHovered: boolean): string => {
    // Base 3D position calculations
    const zTranslate = index === 3 ? 0 : 20 - (index * 5);
    const xRotate = index === 3 ? 0 : 2 - (index * 0.5);
    const yRotate = index === 3 ? 0 : (index - 1) * 2;

    // Enhanced hover effect with elevated z-position
    const hoverZ = isHovered ? 30 : 0;
    const hoverX = isHovered ? -1 : 0; // Slight tilt on x-axis when hovered
    const hoverY = isHovered ? (index % 2 ? 1 : -1) : 0; // Alternating y-axis tilt

    return `translateZ(${zTranslate + hoverZ}px) rotateX(${xRotate + hoverX}deg) rotateY(${yRotate + hoverY}deg)`;
};

/**
 * Calculate viewport-adapted positioning values
 * Adjusts box positioning based on viewport size
 *
 * @param index - Box index (0-3)
 * @param viewportWidth - Current viewport width
 * @returns Object with position adjustments
 */
export const getViewportAdjustedPosition = (
    index: number,
    viewportWidth: number
): { xOffset: number; yOffset: number; rotation: number } => {
    const isMobile = viewportWidth < 768;
    const isTablet = viewportWidth >= 768 && viewportWidth < 1024;

    // Default values
    let xOffset = 0;
    let yOffset = 0;
    let rotation = 0;

    if (isMobile) {
        // Mobile adjustments - more compact positioning
        xOffset = index === 3 ? 0 : (index - 1) * 10;
        yOffset = index === 3 ? 0 : (index * 5);
        rotation = 0; // Less rotation on mobile
    } else if (isTablet) {
        // Tablet adjustments - moderate positioning
        xOffset = index === 3 ? 0 : (index - 1) * 15;
        yOffset = index === 3 ? 0 : (index * 8);
        rotation = index === 3 ? 0 : (index - 1) * 1;
    } else {
        // Desktop adjustments - full positioning
        xOffset = index === 3 ? 0 : (index - 1) * 20;
        yOffset = index === 3 ? 0 : (index * 10);
        rotation = index === 3 ? 0 : (index - 1) * 2;
    }

    return { xOffset, yOffset, rotation };
};

/**
 * Get spacing adjustments based on box grid position
 *
 * @param index - Box index (0-3)
 * @returns Margin and padding adjustments
 */
export const getBoxSpacing = (index: number): { margin: string; padding: string } => {
    // Determine appropriate margins based on box position
    const margins = [
        'mb-4 md:mb-6', // First box
        'mb-4 md:mb-5', // Second box
        'mb-4 md:mb-4', // Third box
        'mt-2 md:mt-4'  // Final box
    ];

    // Determine appropriate padding based on box content and importance
    const paddings = [
        'px-3 py-2 md:px-4 md:py-3', // First box
        'px-3 py-2 md:px-4 md:py-3', // Second box
        'px-3 py-2 md:px-4 md:py-3', // Third box
        'p-4 md:p-5 lg:p-6'          // Final box (larger padding)
    ];

    return {
        margin: margins[Math.min(index, margins.length - 1)],
        padding: paddings[Math.min(index, paddings.length - 1)]
    };
};