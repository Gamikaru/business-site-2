// src/utils/analytics.ts
export interface PerformanceMetrics {
    timeToFirstByte?: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    timeToInteractive?: number;
    firstInputDelay?: number;
    cumulativeLayoutShift?: number;
    navigationStart?: number;
    loadEventEnd?: number;
}

export interface PageViewEvent {
    path: string;
    title: string;
    referrer?: string;
    isFirstVisit?: boolean;
}

export interface UserInteractionEvent {
    action: string;
    category: string;
    label?: string;
    value?: number;
    nonInteraction?: boolean;
}

export interface ErrorEvent {
    message: string;
    source?: string;
    lineno?: number;
    colno?: number;
    error?: Error;
}

export interface AnalyticsConfig {
    enabled: boolean;
    debugMode: boolean;
    trackPageViews: boolean;
    trackPerformance: boolean;
    trackErrors: boolean;
    trackOutboundLinks: boolean;
    excludedPaths: string[];
    samplingRate: number;
}

/**
 * Analytics provider interface for handling different tracking implementations
 */
export interface AnalyticsProvider {
    pageView?: (event: PageViewEvent) => void;
    event?: (event: UserInteractionEvent) => void;
    error?: (event: ErrorEvent) => void;
    performance?: (metrics: PerformanceMetrics) => void;
    setUserId?: (userId: string) => void;
}

/**
 * Type for any analytics event data
 */
export type AnalyticsEventData = PageViewEvent | UserInteractionEvent | ErrorEvent | PerformanceMetrics | string;

/**
 * Type mapping between event types and their data types
 */
type ProviderEventMap = {
    pageView: PageViewEvent;
    event: UserInteractionEvent;
    error: ErrorEvent;
    performance: PerformanceMetrics;
    setUserId: string;
};

/**
 * Performance entry type definitions - moved outside class for better TypeScript support
 */
interface PerformanceEntryWithStartTime extends PerformanceEntry {
    startTime: number;
}

interface LayoutShiftEntry extends PerformanceEntryWithStartTime {
    hadRecentInput: boolean;
    value: number;
}

interface FirstInputEntry extends PerformanceEntryWithStartTime {
    processingStart: number;
}

/**
 * Default analytics configuration
 */
const defaultConfig: AnalyticsConfig = {
    enabled: process.env.NODE_ENV === 'production',
    debugMode: process.env.NODE_ENV === 'development',
    trackPageViews: true,
    trackPerformance: true,
    trackErrors: true,
    trackOutboundLinks: true,
    excludedPaths: ['/admin', '/preview'],
    samplingRate: 1.0, // 100% of users
};

/**
 * Analytics service class for tracking user behavior and performance
 */
export class Analytics {
    private config: AnalyticsConfig;
    private initialized: boolean = false;
    private providers: AnalyticsProvider[] = [];
    private sessionId: string;

    constructor(config?: Partial<AnalyticsConfig>) {
        this.config = { ...defaultConfig, ...config };
        this.sessionId = this.generateSessionId();
    }

    /**
     * Initialize analytics tracking
     */
    initialize(): void {
        if (this.initialized || !this.config.enabled || typeof window === 'undefined') {
            return;
        }

        // Register listeners and initialize tracking based on config
        if (this.config.trackPageViews) {
            this.initializePageViewTracking();
        }

        if (this.config.trackPerformance) {
            this.initializePerformanceTracking();
        }

        if (this.config.trackErrors) {
            this.initializeErrorTracking();
        }

        if (this.config.trackOutboundLinks) {
            this.initializeOutboundLinkTracking();
        }

        this.initialized = true;
        this.debug('Analytics initialized');
    }

    /**
     * Add an analytics provider
     */
    addProvider(provider: AnalyticsProvider): void {
        this.providers.push(provider);
    }

    /**
     * Track a page view
     */
    trackPageView(event: PageViewEvent): void {
        if (!this.shouldTrack(event.path)) {
            return;
        }

        this.debug('Page view', event);
        this.dispatchToProviders('pageView', event);
    }

    /**
     * Track a user interaction
     */
    trackEvent(event: UserInteractionEvent): void {
        this.debug('User event', event);
        this.dispatchToProviders('event', event);
    }

    /**
     * Track an error
     */
    trackError(event: ErrorEvent): void {
        this.debug('Error event', event);
        this.dispatchToProviders('error', event);
    }

    /**
     * Track performance metrics
     */
    trackPerformance(metrics: PerformanceMetrics): void {
        this.debug('Performance metrics', metrics);
        this.dispatchToProviders('performance', metrics);
    }

    /**
     * Get session ID
     */
    getSessionId(): string {
        return this.sessionId;
    }

    /**
     * Set user ID for identification
     */
    setUserId(userId: string): void {
        this.dispatchToProviders('setUserId', userId);
    }

    /**
     * Determine if analytics should track for a given path
     */
    private shouldTrack(path: string): boolean {
        // Check if path is excluded
        if (this.config.excludedPaths.some(excluded => path.startsWith(excluded))) {
            return false;
        }

        // Apply sampling if needed
        if (this.config.samplingRate < 1.0) {
            return Math.random() <= this.config.samplingRate;
        }

        return true;
    }

    /**
     * Initialize page view tracking
     */
    private initializePageViewTracking(): void {
        if (typeof window !== 'undefined') {
            // Track initial page load
            const initialPath = window.location.pathname + window.location.search;
            this.trackPageView({
                path: initialPath,
                title: document.title,
                isFirstVisit: true,
            });

            // Set up route change tracking for client-side navigation
            // This is framework-agnostic; you'll need to adapt this for Next.js specifically
            // For Next.js, you would use the router events instead
            window.addEventListener('popstate', () => {
                const path = window.location.pathname + window.location.search;
                this.trackPageView({
                    path,
                    title: document.title,
                    referrer: document.referrer,
                });
            });
        }
    }

    /**
     * Initialize performance tracking
     */
    private initializePerformanceTracking(): void {
        if (typeof window !== 'undefined' && 'performance' in window) {
            // Core Web Vitals & Performance tracking
            if ('PerformanceObserver' in window) {
                try {
                    // LCP - Largest Contentful Paint
                    const lcpObserver = new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries() as PerformanceEntryWithStartTime[];
                        const lastEntry = entries[entries.length - 1];
                        if (lastEntry) {
                            const metrics: PerformanceMetrics = {
                                largestContentfulPaint: lastEntry.startTime,
                            };
                            this.trackPerformance(metrics);
                        }
                    });
                    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

                    // CLS - Cumulative Layout Shift
                    const clsObserver = new PerformanceObserver((entryList) => {
                        let clsValue = 0;
                        for (const entry of entryList.getEntries() as LayoutShiftEntry[]) {
                            if (!entry.hadRecentInput) {
                                clsValue += entry.value;
                            }
                        }
                        const metrics: PerformanceMetrics = {
                            cumulativeLayoutShift: clsValue,
                        };
                        this.trackPerformance(metrics);
                    });
                    clsObserver.observe({ type: 'layout-shift', buffered: true });

                    // FID - First Input Delay
                    const fidObserver = new PerformanceObserver((entryList) => {
                        for (const entry of entryList.getEntries() as FirstInputEntry[]) {
                            const metrics: PerformanceMetrics = {
                                firstInputDelay: entry.processingStart - entry.startTime,
                            };
                            this.trackPerformance(metrics);
                        }
                    });
                    fidObserver.observe({ type: 'first-input', buffered: true });

                    // Basic navigation timing
                    window.addEventListener('load', () => {
                        setTimeout(() => {
                            if (window.performance && window.performance.timing) {
                                const timing = window.performance.timing;
                                const metrics: PerformanceMetrics = {
                                    timeToFirstByte: timing.responseStart - timing.navigationStart,
                                    navigationStart: timing.navigationStart,
                                    loadEventEnd: timing.loadEventEnd,
                                };
                                this.trackPerformance(metrics);
                            }
                        }, 0);
                    });
                } catch (e) {
                    this.debug('Error setting up performance observers', e);
                }
            }
        }
    }

    /**
     * Initialize error tracking
     */
    private initializeErrorTracking(): void {
        if (typeof window !== 'undefined') {
            window.addEventListener('error', (event) => {
                this.trackError({
                    message: event.message,
                    source: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    error: event.error,
                });
            });

            window.addEventListener('unhandledrejection', (event) => {
                this.trackError({
                    message: `Unhandled Promise Rejection: ${event.reason}`,
                    error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
                });
            });
        }
    }

    /**
     * Initialize outbound link tracking
     */
    private initializeOutboundLinkTracking(): void {
        if (typeof window !== 'undefined') {
            document.addEventListener('click', (event) => {
                // Check if clicked element is a link
                const target = event.target as HTMLElement;
                const link = target.tagName === 'A'
                    ? target as HTMLAnchorElement
                    : target.closest('a') as HTMLAnchorElement;

                if (link && this.isExternalLink(link)) {
                    this.trackEvent({
                        action: 'click',
                        category: 'outbound',
                        label: link.href,
                    });
                }
            });
        }
    }

    /**
     * Check if a link points to an external domain
     */
    private isExternalLink(link: HTMLAnchorElement): boolean {
        return (
            link.hostname !== window.location.hostname &&
            link.protocol.startsWith('http')
        );
    }

    /**
     * Generate a unique session ID
     */
    private generateSessionId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }

    /**
     * Dispatch events to registered providers
     */
    private dispatchToProviders<T extends keyof ProviderEventMap>(
        eventType: T,
        data: ProviderEventMap[T]
    ): void {
        this.providers.forEach(provider => {
            const method = provider[eventType as keyof AnalyticsProvider];
            if (typeof method === 'function') {
                try {
                    // Safe type assertion using the event map
                    (method as (data: ProviderEventMap[T]) => void).call(provider, data);
                } catch (e) {
                    this.debug(`Error in provider for ${eventType}`, e);
                }
            }
        });
    }

    /**
     * Log debug information if debug mode is enabled
     */
    private debug(message: string, data?: unknown): void {
        if (this.config.debugMode && typeof console !== 'undefined') {
            console.log(`[Analytics] ${message}`, data !== undefined ? data : '');
        }
    }
}

// Export singleton instance
export const analytics = new Analytics();

/**
 * Next.js specific setup for analytics
 * Use this function in your _app.js or similar entry point
 */
export function initializeAnalytics(): void {
    if (typeof window !== 'undefined') {
        // Initialize after a short delay to not impact page load performance
        setTimeout(() => {
            analytics.initialize();
        }, 1000);
    }
}