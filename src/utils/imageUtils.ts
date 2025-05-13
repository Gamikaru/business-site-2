// src/utils/imageUtils.ts
import { StaticImageData } from 'next/image';

/**
 * Image dimensions configuration
 */
export interface ImageDimensions {
    width: number;
    height: number;
    aspectRatio?: number;
}

/**
 * Responsive image configuration
 */
export interface ResponsiveImageConfig {
    src: string | StaticImageData;
    alt: string;
    mobileDimensions: ImageDimensions;
    tabletDimensions?: ImageDimensions;
    desktopDimensions: ImageDimensions;
    priority?: boolean;
    quality?: number;
}

/**
 * Calculate image dimensions including aspect ratio
 *
 * @param dimensions Base dimensions (width, height)
 * @returns Dimensions with calculated aspect ratio
 */
export function calculateDimensions(dimensions: ImageDimensions): ImageDimensions {
    if (!dimensions.aspectRatio) {
        dimensions.aspectRatio = dimensions.width / dimensions.height;
    }
    return dimensions;
}

/**
 * Generate srcSet configuration for responsive images
 *
 * @param basePath Base image path
 * @param widths Array of widths for the srcSet
 * @param extension Image file extension
 * @returns srcSet string
 */
export function generateSrcSet(
    basePath: string,
    widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048],
    extension: string = 'jpg'
): string {
    // Remove file extension if present
    const cleanBasePath = basePath.replace(/\.\w+$/, '');

    return widths
        .map(width => `${cleanBasePath}-${width}.${extension} ${width}w`)
        .join(', ');
}

/**
 * Get image dimensions based on device type
 *
 * @param config Responsive image configuration
 * @param deviceType Device type (mobile, tablet, desktop)
 * @returns Appropriate dimensions for the device
 */
export function getImageDimensionsForDevice(
    config: ResponsiveImageConfig,
    deviceType: 'mobile' | 'tablet' | 'desktop'
): ImageDimensions {
    switch (deviceType) {
        case 'mobile':
            return calculateDimensions(config.mobileDimensions);
        case 'tablet':
            return calculateDimensions(config.tabletDimensions || config.mobileDimensions);
        case 'desktop':
            return calculateDimensions(config.desktopDimensions);
        default:
            return calculateDimensions(config.desktopDimensions);
    }
}

/**
 * Generate image sizes attribute for responsive images
 *
 * @returns Sizes attribute string
 */
export function getResponsiveSizes(): string {
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}

/**
 * Get image file format based on image path
 *
 * @param src Image source path
 * @returns Image format (jpg, png, webp, etc.)
 */
export function getImageFormat(src: string): string {
    // Extract the file extension
    const match = src.match(/\.(\w+)$/);
    return match ? match[1].toLowerCase() : 'jpg';
}

/**
 * Check if image needs to be optimized
 *
 * @param src Image source path
 * @returns Boolean indicating if image should be optimized
 */
export function shouldOptimizeImage(src: string): boolean {
    // Don't optimize SVGs or GIFs which are already optimized
    const format = getImageFormat(src);
    return !['svg', 'gif'].includes(format);
}

/**
 * Generate alt text if none provided
 *
 * @param imagePath Image path/filename
 * @returns Generated alt text
 */
export function generateAltText(imagePath: string): string {
    // Extract filename without extension and path
    const fileName = imagePath.split('/').pop()?.replace(/\.\w+$/, '') || '';

    // Convert camelCase or snake_case to spaces
    return fileName
        .replace(/([A-Z])/g, ' $1') // camelCase to spaces
        .replace(/_/g, ' ') // snake_case to spaces
        .replace(/-/g, ' ') // kebab-case to spaces
        .trim()
        .replace(/\s+/g, ' ') // remove extra spaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}