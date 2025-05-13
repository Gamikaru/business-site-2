// src/utils/contentConfig.ts
import { ContentSectionId } from '@/content/types';

/**
 * Device types for responsive content
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Content variation types (e.g., for A/B testing or personalization)
 */
export type ContentVariation = 'default' | 'variant-a' | 'variant-b' | 'seasonal';

/**
 * Content format configuration
 */
export interface ContentFormatConfig {
    sectionIds: ContentSectionId[];
    enabledVariations: ContentVariation[];
    defaultVariation: ContentVariation;
    renderDynamicContent: boolean;
    useStrictValidation: boolean;
    defaultImageQuality: number;
}

/**
 * Default content configuration
 */
export const DEFAULT_CONTENT_CONFIG: ContentFormatConfig = {
    sectionIds: [
        'home',
        'about',
        'services',
        'portfolio',
        'blog',
        'contact',
        'newsletter'
    ],
    enabledVariations: ['default'],
    defaultVariation: 'default',
    renderDynamicContent: true,
    useStrictValidation: true,
    defaultImageQuality: 90
};

/**
 * Content access options
 */
export interface ContentAccessOptions {
    deviceType?: DeviceType;
    variation?: ContentVariation;
    fallbackToDefault?: boolean;
}

/**
 * Content configuration class
 */
export class ContentConfig {
    private config: ContentFormatConfig;

    constructor(config?: Partial<ContentFormatConfig>) {
        this.config = {
            ...DEFAULT_CONTENT_CONFIG,
            ...config
        };
    }

    /**
     * Get the current configuration
     */
    getConfig(): ContentFormatConfig {
        return { ...this.config };
    }

    /**
     * Check if a section ID is valid
     */
    isValidSectionId(sectionId: string): boolean {
        return this.config.sectionIds.includes(sectionId as ContentSectionId);
    }

    /**
     * Check if a content variation is enabled
     */
    isVariationEnabled(variation: ContentVariation): boolean {
        return this.config.enabledVariations.includes(variation);
    }

    /**
     * Get the content key based on options
     */
    getContentKey(sectionId: ContentSectionId, options?: ContentAccessOptions): string {
        const deviceType = options?.deviceType || 'desktop';
        const variation = (options?.variation && this.isVariationEnabled(options.variation))
            ? options.variation
            : this.config.defaultVariation;

        return `${sectionId}_${deviceType}_${variation}`;
    }
}

/**
 * Interface for content that may have device-specific variations
 */
export interface DeviceSpecificContent {
    mobile?: Record<string, unknown>;
    tablet?: Record<string, unknown>;
    desktop?: Record<string, unknown>;
    [key: string]: unknown;
}

/**
 * Safely access a nested property in a content object
 *
 * @param obj The content object
 * @param path Path to the desired property (e.g., 'meta.title')
 * @param defaultValue Default value if property is not found
 * @returns The property value or default value
 */
export function getContentProperty<T>(
    obj: Record<string, unknown> | null | undefined,
    path: string,
    defaultValue: T
): T {
    if (!obj) return defaultValue;

    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
        if (current === null || current === undefined || typeof current !== 'object') {
            return defaultValue;
        }

        // Safe type casting since we've checked that current is an object
        current = (current as Record<string, unknown>)[key];
    }

    return (current === undefined || current === null) ? defaultValue : current as T;
}

/**
 * Create a content instance with specific options
 *
 * @param content The content object
 * @param deviceType Device type
 * @returns Device-specific content or original content
 */
export function getDeviceSpecificContent<T extends DeviceSpecificContent>(
    content: T | null | undefined,
    deviceType: DeviceType = 'desktop'
): T | Partial<T> {
    if (!content) return {} as Partial<T>;

    // If content has device-specific variations, type check them for safety
    if (deviceType === 'mobile' && content.mobile && typeof content.mobile === 'object') {
        return content.mobile as Partial<T>;
    }

    if (deviceType === 'tablet' && content.tablet && typeof content.tablet === 'object') {
        return content.tablet as Partial<T>;
    }

    if (deviceType === 'desktop' && content.desktop && typeof content.desktop === 'object') {
        return content.desktop as Partial<T>;
    }

    return content;
}

/**
 * Singleton instance of ContentConfig
 */
export const contentConfig = new ContentConfig();