// src/utils/themeManagement.ts
import { useEffect, useState } from 'react';

export type ColorTheme =
    | 'green'
    | 'blue'
    | 'aurora-borealis'
    | 'cyber-punk-graffiti'
    | 'cyber'
    | 'duotone'
    | 'earth'
    | 'leather'
    | 'modern-pro'
    | 'monochrome'
    | 'mystic-forest'
    | 'nostalgia-pastel'
    | 'quantum-nebula'
    | 'red'
    | 'royal-jewel'
    | 'silver'
    | 'sunset-oasis'
    | 'tropical-paradise'
    | 'winter'
    | 'yellow';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
    colorTheme: ColorTheme;
    mode: ThemeMode;
    allowUserSelection: boolean;
    enableTransitions: boolean;
    storageKey: string;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
    colorTheme: 'modern-pro',
    mode: 'system',
    allowUserSelection: true,
    enableTransitions: true,
    storageKey: 'gavriel-rudolph-theme',
};

/**
 * Theme management class for handling theme related operations
 */
export class ThemeManager {
    private config: ThemeConfig;
    private listeners: Set<(theme: { colorTheme: ColorTheme; mode: 'light' | 'dark' }) => void>;
    private mediaQuery: MediaQueryList | null;
    private currentMode: 'light' | 'dark';

    constructor(config?: Partial<ThemeConfig>) {
        this.config = { ...DEFAULT_THEME_CONFIG, ...config };
        this.listeners = new Set();
        this.mediaQuery = typeof window !== 'undefined'
            ? window.matchMedia('(prefers-color-scheme: dark)')
            : null;

        this.currentMode = this.resolveMode();
        this.initialize();
    }

    /**
     * Initialize theme manager
     */
    private initialize(): void {
        if (typeof window === 'undefined') return;

        // Load saved theme from storage if available
        this.loadSavedTheme();

        // Add listener for system theme changes
        if (this.mediaQuery) {
            const handleChange = (e: MediaQueryListEvent) => {
                if (this.config.mode === 'system') {
                    this.currentMode = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            };

            // Use addEventListener for modern browsers, fallback to older method
            if (this.mediaQuery.addEventListener) {
                this.mediaQuery.addEventListener('change', handleChange);
            } else if ('addListener' in this.mediaQuery) {

                this.mediaQuery.addListener(handleChange);
            }
        }

        // Apply initial theme
        this.applyTheme();
    }

    /**
     * Set color theme
     *
     * @param colorTheme New color theme
     */
    setColorTheme(colorTheme: ColorTheme): void {
        if (!this.config.allowUserSelection) return;

        this.config.colorTheme = colorTheme;
        this.applyTheme();
        this.saveTheme();
    }

    /**
     * Set theme mode
     *
     * @param mode New theme mode
     */
    setMode(mode: ThemeMode): void {
        if (!this.config.allowUserSelection) return;

        this.config.mode = mode;
        this.currentMode = this.resolveMode();
        this.applyTheme();
        this.saveTheme();
    }

    /**
     * Toggle between light and dark mode
     */
    toggleMode(): void {
        if (!this.config.allowUserSelection) return;

        if (this.config.mode === 'system') {
            // If currently using system, switch to explicit mode opposite to current
            this.setMode(this.currentMode === 'dark' ? 'light' : 'dark');
        } else {
            // Toggle between light and dark
            this.setMode(this.config.mode === 'dark' ? 'light' : 'dark');
        }
    }

    /**
     * Get current theme configuration
     */
    getConfig(): ThemeConfig {
        return { ...this.config };
    }

    /**
     * Get current effective theme (resolved mode + color theme)
     */
    getCurrentTheme(): { colorTheme: ColorTheme; mode: 'light' | 'dark' } {
        return {
            colorTheme: this.config.colorTheme,
            mode: this.currentMode,
        };
    }

    /**
     * Resolve the effective mode based on config
     */
    private resolveMode(): 'light' | 'dark' {
        if (this.config.mode === 'light') return 'light';
        if (this.config.mode === 'dark') return 'dark';

        // Handle system mode
        if (typeof window !== 'undefined' && this.mediaQuery) {
            return this.mediaQuery.matches ? 'dark' : 'light';
        }

        // Fallback to light
        return 'light';
    }

    /**
     * Apply theme to the document
     */
    private applyTheme(): void {
        if (typeof document === 'undefined') return;

        const { colorTheme } = this.config;
        const mode = this.currentMode;

        // Clear previous themes
        document.documentElement.className = '';

        // Disable transitions temporarily if changing theme after initial load
        if (!this.config.enableTransitions) {
            document.documentElement.classList.add('disable-transitions');
        }

        // Set both color theme and mode
        document.documentElement.setAttribute('data-color-theme', colorTheme);
        document.documentElement.setAttribute('data-mode', mode);

        // Set combined theme attribute for CSS selectors
        document.documentElement.setAttribute('data-theme', `${colorTheme}-${mode}`);

        // Notify listeners
        this.notifyListeners();

        // Re-enable transitions after a brief delay
        if (!this.config.enableTransitions) {
            setTimeout(() => {
                document.documentElement.classList.remove('disable-transitions');
            }, 100);
        }
    }

    /**
     * Save theme preferences to storage
     */
    private saveTheme(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(
                this.config.storageKey,
                JSON.stringify({
                    colorTheme: this.config.colorTheme,
                    mode: this.config.mode,
                })
            );
        }
    }

    /**
     * Load saved theme from storage
     */
    private loadSavedTheme(): void {
        if (typeof localStorage !== 'undefined') {
            try {
                const savedTheme = localStorage.getItem(this.config.storageKey);
                if (savedTheme) {
                    const { colorTheme, mode } = JSON.parse(savedTheme);

                    if (colorTheme && this.isValidColorTheme(colorTheme)) {
                        this.config.colorTheme = colorTheme;
                    }

                    if (mode && this.isValidMode(mode)) {
                        this.config.mode = mode;
                        this.currentMode = this.resolveMode();
                    }
                }
            } catch (error) {
                console.error('Error loading saved theme:', error);
            }
        }
    }

    /**
     * Check if a color theme is valid
     */
    private isValidColorTheme(theme: unknown): theme is ColorTheme {
        const validThemes: ColorTheme[] = [
            'green', 'blue', 'aurora-borealis', 'cyber-punk-graffiti', 'cyber',
            'duotone', 'earth', 'leather', 'modern-pro', 'monochrome',
            'mystic-forest', 'nostalgia-pastel', 'quantum-nebula', 'red',
            'royal-jewel', 'silver', 'sunset-oasis', 'tropical-paradise',
            'winter', 'yellow'
        ];

        return typeof theme === 'string' && validThemes.includes(theme as ColorTheme);
    }

    /**
     * Check if a mode is valid
     */
    private isValidMode(mode: unknown): mode is ThemeMode {
        return typeof mode === 'string' && ['light', 'dark', 'system'].includes(mode as ThemeMode);
    }

    /**
     * Add a theme change listener
     */
    addListener(callback: (theme: { colorTheme: ColorTheme; mode: 'light' | 'dark' }) => void): () => void {
        this.listeners.add(callback);

        // Return function to remove listener
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Notify all listeners of theme change
     */
    private notifyListeners(): void {
        const theme = this.getCurrentTheme();

        this.listeners.forEach(listener => {
            try {
                listener(theme);
            } catch (error) {
                console.error('Error in theme change listener:', error);
            }
        });
    }
}

// Create singleton instance
export const themeManager = new ThemeManager();

/**
 * React hook for theme management
 */
export function useTheme() {
    const [theme, setTheme] = useState(themeManager.getCurrentTheme());

    useEffect(() => {
        // Subscribe to theme changes
        const unsubscribe = themeManager.addListener(newTheme => {
            setTheme(newTheme);
        });

        return unsubscribe;
    }, []);

    return {
        ...theme,
        setColorTheme: (colorTheme: ColorTheme) => themeManager.setColorTheme(colorTheme),
        setMode: (mode: ThemeMode) => themeManager.setMode(mode),
        toggleMode: () => themeManager.toggleMode(),
    };
}

/**
 * Get CSS variable value
 *
 * @param name CSS variable name
 * @param element Element to get variable from (defaults to documentElement)
 * @returns CSS variable value
 */
export function getCssVariable(name: string, element?: HTMLElement): string {
    if (typeof window === 'undefined') return '';

    const targetElement = element || document.documentElement;
    return getComputedStyle(targetElement).getPropertyValue(name).trim();
}

/**
 * Set CSS variable value
 *
 * @param name CSS variable name
 * @param value CSS variable value
 * @param element Element to set variable on (defaults to documentElement)
 */
export function setCssVariable(name: string, value: string, element?: HTMLElement): void {
    if (typeof document === 'undefined') return;

    const targetElement = element || document.documentElement;
    targetElement.style.setProperty(name, value);
}

/**
 * Generate a color shade palette from a base color
 *
 * @param baseColor Base color in hex format
 * @param name Base name for the shade variables
 */
export function generateColorPalette(baseColor: string, name: string = 'custom'): Record<string, string> {
    // This would normally use a library like chroma.js to generate proper shades
    // For our foundation, we'll keep it simple
    return {
        [`--color-${name}-50`]: lightenDarkenColor(baseColor, 80),
        [`--color-${name}-100`]: lightenDarkenColor(baseColor, 60),
        [`--color-${name}-200`]: lightenDarkenColor(baseColor, 40),
        [`--color-${name}-300`]: lightenDarkenColor(baseColor, 20),
        [`--color-${name}-400`]: lightenDarkenColor(baseColor, 10),
        [`--color-${name}-500`]: baseColor,
        [`--color-${name}-600`]: lightenDarkenColor(baseColor, -10),
        [`--color-${name}-700`]: lightenDarkenColor(baseColor, -20),
        [`--color-${name}-800`]: lightenDarkenColor(baseColor, -40),
        [`--color-${name}-900`]: lightenDarkenColor(baseColor, -60),
        [`--color-${name}-950`]: lightenDarkenColor(baseColor, -80),
    };
}

/**
 * Simple utility to lighten or darken a hex color
 *
 * @param hex Hex color
 * @param percent Percent to lighten (positive) or darken (negative)
 * @returns Modified hex color
 */
function lightenDarkenColor(hex: string, percent: number): string {
    // Remove # if present
    const color = hex.replace('#', '');

    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Modify the color
    const modifyColor = (value: number) => {
        return Math.max(0, Math.min(255, Math.round(value + (255 * percent / 100))));
    };

    // Convert back to hex
    const toHex = (value: number) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(modifyColor(r))}${toHex(modifyColor(g))}${toHex(modifyColor(b))}`;
}