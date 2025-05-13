// src/utils/localization.ts
export type Locale = 'en' | 'fr' | 'es' | 'de' | 'ja';

export interface LocalizationConfig {
    defaultLocale: Locale;
    supportedLocales: Locale[];
    fallbackLocale: Locale;
    detectBrowserLocale: boolean;
    localizedPaths: boolean;
    autoRedirect: boolean;
    translationsPath: string;
}

export interface LocaleMetadata {
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
    dateFormat: string;
    currencySymbol: string;
    currencyCode: string;
}

/**
 * Default localization configuration
 */
export const DEFAULT_LOCALIZATION_CONFIG: LocalizationConfig = {
    defaultLocale: 'en',
    supportedLocales: ['en'],
    fallbackLocale: 'en',
    detectBrowserLocale: true,
    localizedPaths: false,
    autoRedirect: false,
    translationsPath: '/locales',
};

/**
 * Metadata for supported locales
 */
export const LOCALE_METADATA: Record<Locale, LocaleMetadata> = {
    en: {
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
        dateFormat: 'MM/DD/YYYY',
        currencySymbol: '$',
        currencyCode: 'USD',
    },
    fr: {
        name: 'French',
        nativeName: 'Francais',
        direction: 'ltr',
        dateFormat: 'DD/MM/YYYY',
        currencySymbol: '€',
        currencyCode: 'EUR',
    },
    es: {
        name: 'Spanish',
        nativeName: 'Espanol',
        direction: 'ltr',
        dateFormat: 'DD/MM/YYYY',
        currencySymbol: '€',
        currencyCode: 'EUR',
    },
    de: {
        name: 'German',
        nativeName: 'Deutsch',
        direction: 'ltr',
        dateFormat: 'DD.MM.YYYY',
        currencySymbol: '€',
        currencyCode: 'EUR',
    },
    ja: {
        name: 'Japanese',
        nativeName: '日本語',
        direction: 'ltr',
        dateFormat: 'YYYY/MM/DD',
        currencySymbol: '¥',
        currencyCode: 'JPY',
    },
};

/**
 * Type for translation content
 */
export type TranslationDictionary = Record<string, string | Record<string, string>>;

/**
 * Localization class for handling multilingual content
 */
export class Localization {
    private config: LocalizationConfig;
    private currentLocale: Locale;
    private translations: Record<Locale, TranslationDictionary> = {} as Record<Locale, TranslationDictionary>;
    private initialized = false;

    constructor(config?: Partial<LocalizationConfig>) {
        this.config = { ...DEFAULT_LOCALIZATION_CONFIG, ...config };
        this.currentLocale = this.config.defaultLocale;
    }

    /**
     * Initialize the localization system
     */
    async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        // Detect browser locale if enabled
        if (this.config.detectBrowserLocale && typeof navigator !== 'undefined') {
            const browserLocale = this.detectBrowserLocale();
            if (browserLocale && this.isSupportedLocale(browserLocale)) {
                this.currentLocale = browserLocale;
            }
        }

        // Load translations for current locale if not already loaded
        await this.loadTranslations(this.currentLocale);

        this.initialized = true;
    }

    /**
     * Get a translated string by key
     *
     * @param key Translation key
     * @param params Optional parameters for interpolation
     * @param locale Optional locale to use (defaults to current)
     * @returns Translated string
     */
    translate(key: string, params?: Record<string, string>, locale?: Locale): string {
        const targetLocale = locale && this.isSupportedLocale(locale) ? locale : this.currentLocale;

        // Try to get translation from specified locale
        let translation = this.getTranslationFromKey(key, targetLocale);

        // Fall back to default locale if not found
        if (!translation && targetLocale !== this.config.fallbackLocale) {
            translation = this.getTranslationFromKey(key, this.config.fallbackLocale);
        }

        // Fall back to key itself if no translation found
        if (!translation) {
            translation = key;
        }

        // Apply parameter interpolation
        if (params) {
            translation = this.interpolate(translation, params);
        }

        return translation;
    }

    /**
     * Set the current locale
     *
     * @param locale New locale to use
     * @returns Promise that resolves when locale is changed
     */
    async setLocale(locale: Locale): Promise<void> {
        if (!this.isSupportedLocale(locale)) {
            throw new Error(`Locale ${locale} is not supported`);
        }

        // Load translations if needed
        if (!this.translations[locale]) {
            await this.loadTranslations(locale);
        }

        this.currentLocale = locale;

        // Update HTML lang attribute
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;

            // Update direction attribute for RTL support
            const direction = this.getLocaleMetadata(locale).direction;
            document.documentElement.dir = direction;
        }
    }

    /**
     * Get the current locale
     */
    getLocale(): Locale {
        return this.currentLocale;
    }

    /**
     * Get metadata for a specific locale
     *
     * @param locale The locale to get metadata for
     * @returns Locale metadata
     */
    getLocaleMetadata(locale: Locale): LocaleMetadata {
        return LOCALE_METADATA[locale] || LOCALE_METADATA[this.config.defaultLocale];
    }

    /**
     * Format a date according to the current locale
     *
     * @param date Date to format
     * @param options Formatting options
     * @param locale Optional locale to use
     * @returns Formatted date string
     */
    formatDate(
        date: Date,
        options?: Intl.DateTimeFormatOptions,
        locale?: Locale
    ): string {
        const targetLocale = locale || this.currentLocale;
        return new Intl.DateTimeFormat(targetLocale, options).format(date);
    }

    /**
     * Format a number according to the current locale
     *
     * @param number Number to format
     * @param options Formatting options
     * @param locale Optional locale to use
     * @returns Formatted number string
     */
    formatNumber(
        number: number,
        options?: Intl.NumberFormatOptions,
        locale?: Locale
    ): string {
        const targetLocale = locale || this.currentLocale;
        return new Intl.NumberFormat(targetLocale, options).format(number);
    }

    /**
     * Format currency according to the current locale
     *
     * @param amount Amount to format
     * @param currencyCode Currency code to use
     * @param locale Optional locale to use
     * @returns Formatted currency string
     */
    formatCurrency(
        amount: number,
        currencyCode?: string,
        locale?: Locale
    ): string {
        const targetLocale = locale || this.currentLocale;
        const targetCurrency = currencyCode || LOCALE_METADATA[targetLocale].currencyCode;

        return new Intl.NumberFormat(targetLocale, {
            style: 'currency',
            currency: targetCurrency,
        }).format(amount);
    }

    /**
     * Get localized URL for a path
     *
     * @param path Original path
     * @param locale Target locale
     * @returns Localized path
     */
    getLocalizedPath(path: string, locale?: Locale): string {
        const targetLocale = locale || this.currentLocale;

        // If localized paths are disabled or it's the default locale, return original path
        if (!this.config.localizedPaths || targetLocale === this.config.defaultLocale) {
            return path;
        }

        // Remove leading slash if present
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;

        // Add locale prefix
        return `/${targetLocale}/${cleanPath}`;
    }

    /**
     * Check if a locale is supported
     *
     * @param locale Locale to check
     * @returns Whether the locale is supported
     */
    isSupportedLocale(locale: string): locale is Locale {
        return this.config.supportedLocales.includes(locale as Locale);
    }

    /**
     * Detect browser locale
     *
     * @returns Detected locale or undefined
     */
    private detectBrowserLocale(): Locale | undefined {
        if (typeof navigator === 'undefined') {
            return undefined;
        }

        // Get browser language
        const browserLang = navigator.language.split('-')[0];

        // Check if it's supported
        if (this.isSupportedLocale(browserLang)) {
            return browserLang as Locale;
        }

        return undefined;
    }

    /**
     * Load translations for a locale
     *
     * @param locale Locale to load
     * @returns Promise that resolves when translations are loaded
     */
    private async loadTranslations(locale: Locale): Promise<void> {
        if (this.translations[locale]) {
            return;
        }

        try {
            // In a real application, you would load these from your API or static files
            // For this foundation, we'll use a simple placeholder
            this.translations[locale] = {};

            // Simulate loading translations (replace this with actual loading logic)
            if (typeof window !== 'undefined') {
                try {
                    // Example of loading translations from a JSON file
                    // const response = await fetch(`${this.config.translationsPath}/${locale}.json`);
                    // this.translations[locale] = await response.json();
                } catch (error) {
                    console.error(`Failed to load translations for ${locale}`, error);
                }
            }
        } catch (error) {
            console.error(`Error loading translations for ${locale}`, error);
        }
    }

    /**
     * Get a translation from a nested key path
     *
     * @param key Translation key (can be nested with dots)
     * @param locale Locale to get translation from
     * @returns Translation string or undefined if not found
     */
    private getTranslationFromKey(key: string, locale: Locale): string | undefined {
        const localeTranslations = this.translations[locale];
        if (!localeTranslations) {
            return undefined;
        }

        // Handle nested keys (e.g., 'home.hero.title')
        const parts = key.split('.');
        let result: TranslationDictionary | string = localeTranslations;

        for (const part of parts) {
            if (result && typeof result === 'object' && part in result) {
                result = result[part];
            } else {
                return undefined;
            }
        }

        return typeof result === 'string' ? result : undefined;
    }

    /**
     * Interpolate parameters into a translation string
     *
     * @param text Text with placeholders
     * @param params Parameter values
     * @returns Interpolated string
     */
    private interpolate(text: string, params: Record<string, string>): string {
        return Object.entries(params).reduce((result, [key, value]) => {
            const placeholder = `{{${key}}}`;
            return result.replace(new RegExp(placeholder, 'g'), value);
        }, text);
    }
}

// Export singleton instance
export const localization = new Localization();

/**
 * Utility function to translate a string
 * Shorthand for localization.translate
 */
export function t(key: string, params?: Record<string, string>, locale?: Locale): string {
    return localization.translate(key, params, locale);
}