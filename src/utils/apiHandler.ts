// src/utils/apiHandler.ts
import { createAppError, ErrorSeverity } from './errorHandling';

/**
 * HTTP request methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Base type for API response data
 */
export interface ApiResponse {
  [key: string]: unknown;
}

/**
 * Base type for API error data
 */
export interface ApiErrorData {
  message?: string;
  code?: string;
  [key: string]: unknown;
}

/**
 * API request options
 */
export interface ApiRequestOptions<TData = unknown> {
    method?: HttpMethod;
    baseUrl?: string;
    endpoint: string;
    data?: TData;
    params?: Record<string, string | number | boolean | null | undefined>;
    headers?: Record<string, string>;
    timeout?: number;
    cache?: boolean | RequestCache;
    credentials?: RequestCredentials;
    mode?: RequestMode;
    next?: {
        revalidate?: number | false;
        tags?: string[];
    };
}

/**
 * Cache storage interface
 */
export interface CacheStorage {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}

/**
 * Cache storage entry
 */
interface CacheEntry<T> {
    value: T;
    expiry: number | null;
}

/**
 * In-memory cache implementation
 */
class MemoryCache implements CacheStorage {
    private cache: Map<string, CacheEntry<unknown>> = new Map();

    async get<T>(key: string): Promise<T | null> {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if entry has expired
        if (entry.expiry !== null && entry.expiry < Date.now()) {
            this.cache.delete(key);
            return null;
        }

        return entry.value as T;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const expiry = ttl ? Date.now() + ttl * 1000 : null;
        this.cache.set(key, { value, expiry });
    }

    async delete(key: string): Promise<void> {
        this.cache.delete(key);
    }

    async clear(): Promise<void> {
        this.cache.clear();
    }
}

/**
 * API configuration
 */
export interface ApiConfig {
    baseUrl: string;
    defaultHeaders?: Record<string, string>;
    timeout?: number;
    enableCache?: boolean;
    cacheTTL?: number;
    cacheStorage?: CacheStorage;
    retries?: number;
    retryDelay?: number;
}

/**
 * API handler for making HTTP requests
 */
export class ApiHandler {
    private config: ApiConfig;
    private cache: CacheStorage;
    private controller: AbortController | null = null;

    constructor(config: ApiConfig) {
        this.config = {
            ...config,
            defaultHeaders: config.defaultHeaders || {},
            timeout: config.timeout || 30000,
            enableCache: config.enableCache !== false,
            cacheTTL: config.cacheTTL || 300, // 5 minutes default
            retries: config.retries || 0,
            retryDelay: config.retryDelay || 1000
        };

        this.cache = config.cacheStorage || new MemoryCache();
    }

    /**
     * Get the current API configuration
     *
     * @returns Current API configuration
     */
    getConfig(): ApiConfig {
        return { ...this.config };
    }

    /**
     * Make an API request
     *
     * @param options Request options
     * @returns Promise with response data
     */
    async request<TData = unknown, TResponse = ApiResponse>(
        options: ApiRequestOptions<TData>
    ): Promise<TResponse> {
        const {
            method = 'GET',
            baseUrl = this.config.baseUrl,
            endpoint,
            data,
            params,
            headers = {},
            timeout = this.config.timeout,
            cache: cacheOption,
            credentials,
            mode,
            next
        } = options;

        // Build URL with endpoint and query parameters
        let url = `${baseUrl}${endpoint}`;
        if (params && Object.keys(params).length > 0) {
            const query = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value != null) {
                    query.append(key, String(value));
                }
            });
            url += `${url.includes('?') ? '&' : '?'}${query.toString()}`;
        }

        // Generate cache key
        const cacheKey = `${method}:${url}`;

        // Check cache for GET requests
        const useCache =
            method === 'GET' &&
            (cacheOption !== false && this.config.enableCache);

        if (useCache) {
            const cachedData = await this.cache.get<TResponse>(cacheKey);
            if (cachedData) {
                return cachedData;
            }
        }

        // Create abort controller for timeout
        this.controller = new AbortController();
        const { signal } = this.controller;

        // Set timeout
        const timeoutId = setTimeout(() => {
            if (this.controller) {
                this.controller.abort();
            }
        }, timeout);

        try {
            // Combine default headers with request headers
            const combinedHeaders = {
                'Content-Type': 'application/json',
                ...this.config.defaultHeaders,
                ...headers,
            };

            // Configure fetch options
            const fetchOptions: RequestInit = {
                method,
                headers: combinedHeaders,
                signal,
                credentials,
                mode,
                ...(next && { next }),
            };

            // Add body for non-GET requests
            if (method !== 'GET' && data !== undefined) {
                fetchOptions.body = JSON.stringify(data);
            }

            // Make the request with retries
            let response: Response | null = null;
            let error: Error | null = null;
            let retries = this.config.retries || 0;

            while (retries >= 0) {
                try {
                    response = await fetch(url, fetchOptions);
                    if (response.ok) {
                        break;
                    }

                    // Only retry on server errors (5xx)
                    if (!response.status.toString().startsWith('5')) {
                        break;
                    }

                    // Wait before retrying
                    if (retries > 0) {
                        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
                    }
                } catch (err) {
                    error = err as Error;

                    // Don't retry on aborted requests
                    if (error.name === 'AbortError') {
                        break;
                    }

                    // Wait before retrying
                    if (retries > 0) {
                        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
                    }
                }

                retries--;
            }

            // Clear timeout
            clearTimeout(timeoutId);

            // Handle aborted requests
            if (error && error.name === 'AbortError') {
                throw createAppError('Request timeout', {
                    code: 'REQUEST_TIMEOUT',
                    severity: ErrorSeverity.WARNING,
                });
            }

            // Handle other errors
            if (error) {
                throw createAppError(`Request failed: ${error.message}`, {
                    code: 'REQUEST_FAILED',
                    severity: ErrorSeverity.ERROR,
                    originalError: error,
                });
            }

            // Handle response errors
            if (!response?.ok) {
                let errorMessage = `Request failed with status ${response?.status}`;
                let errorData: ApiErrorData | null = null;

                try {
                    errorData = await response?.json() as ApiErrorData;
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch {
                    // Ignore JSON parsing errors in error response
                }

                throw createAppError(errorMessage, {
                    code: `API_ERROR_${response?.status}`,
                    context: { url, status: response?.status, errorData },
                    severity: ErrorSeverity.ERROR,
                });
            }

            // Parse response
            const responseData: TResponse = await response.json();

            // Cache successful GET responses
            if (useCache) {
                await this.cache.set(cacheKey, responseData, this.config.cacheTTL);
            }

            return responseData;
        } finally {
            clearTimeout(timeoutId);
            this.controller = null;
        }
    }

    /**
     * Abort the current request
     */
    abort(): void {
        if (this.controller) {
            this.controller.abort();
            this.controller = null;
        }
    }

    /**
     * Make a GET request
     *
     * @param endpoint API endpoint
     * @param params Query parameters
     * @param options Additional request options
     * @returns Promise with response data
     */
    async get<T = ApiResponse>(
        endpoint: string,
        params?: Record<string, string | number | boolean | null | undefined>,
        options?: Omit<ApiRequestOptions, 'method' | 'endpoint' | 'params'>
    ): Promise<T> {
        return this.request<unknown, T>({
            method: 'GET',
            endpoint,
            params,
            ...options,
        });
    }

    /**
     * Make a POST request
     *
     * @param endpoint API endpoint
     * @param data Request body data
     * @param options Additional request options
     * @returns Promise with response data
     */
    async post<TData = unknown, TResponse = ApiResponse>(
        endpoint: string,
        data?: TData,
        options?: Omit<ApiRequestOptions, 'method' | 'endpoint' | 'data'>
    ): Promise<TResponse> {
        return this.request<TData, TResponse>({
            method: 'POST',
            endpoint,
            data,
            ...options,
        });
    }

    /**
     * Make a PUT request
     *
     * @param endpoint API endpoint
     * @param data Request body data
     * @param options Additional request options
     * @returns Promise with response data
     */
    async put<TData = unknown, TResponse = ApiResponse>(
        endpoint: string,
        data?: TData,
        options?: Omit<ApiRequestOptions, 'method' | 'endpoint' | 'data'>
    ): Promise<TResponse> {
        return this.request<TData, TResponse>({
            method: 'PUT',
            endpoint,
            data,
            ...options,
        });
    }

    /**
     * Make a PATCH request
     *
     * @param endpoint API endpoint
     * @param data Request body data
     * @param options Additional request options
     * @returns Promise with response data
     */
    async patch<TData = unknown, TResponse = ApiResponse>(
        endpoint: string,
        data?: TData,
        options?: Omit<ApiRequestOptions, 'method' | 'endpoint' | 'data'>
    ): Promise<TResponse> {
        return this.request<TData, TResponse>({
            method: 'PATCH',
            endpoint,
            data,
            ...options,
        });
    }

    /**
     * Make a DELETE request
     *
     * @param endpoint API endpoint
     * @param options Additional request options
     * @returns Promise with response data
     */
    async delete<T = ApiResponse>(
        endpoint: string,
        options?: Omit<ApiRequestOptions, 'method' | 'endpoint'>
    ): Promise<T> {
        return this.request<unknown, T>({
            method: 'DELETE',
            endpoint,
            ...options,
        });
    }

    /**
     * Clear the cache
     */
    async clearCache(): Promise<void> {
        await this.cache.clear();
    }

    /**
     * Clear a specific cache entry
     *
     * @param endpoint API endpoint
     * @param params Query parameters
     */
    async clearCacheForEndpoint(
        endpoint: string,
        params?: Record<string, string | number | boolean | null | undefined>
    ): Promise<void> {
        let url = `${this.config.baseUrl}${endpoint}`;

        if (params && Object.keys(params).length > 0) {
            const query = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value != null) {
                    query.append(key, String(value));
                }
            });
            url += `${url.includes('?') ? '&' : '?'}${query.toString()}`;
        }

        const cacheKey = `GET:${url}`;
        await this.cache.delete(cacheKey);
    }
}

// Create a default API handler instance
export const defaultApiHandler = new ApiHandler({
    baseUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    enableCache: true,
    cacheTTL: 300, // 5 minutes
    timeout: 30000, // 30 seconds
    retries: 2,
    retryDelay: 1000
});

/**
 * React hook for using the API handler within components
 *
 * @param config API configuration
 * @returns API handler methods and state
 */
export function useApi(config?: Partial<ApiConfig>) {
    // Create a new handler if custom config is provided
    const handler = config
        ? new ApiHandler({ ...defaultApiHandler.getConfig(), ...config })
        : defaultApiHandler;

    return {
        get: handler.get.bind(handler),
        post: handler.post.bind(handler),
        put: handler.put.bind(handler),
        patch: handler.patch.bind(handler),
        delete: handler.delete.bind(handler),
        request: handler.request.bind(handler),
        abort: handler.abort.bind(handler),
        clearCache: handler.clearCache.bind(handler),
        clearCacheForEndpoint: handler.clearCacheForEndpoint.bind(handler)
    };
}