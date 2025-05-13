// src/utils/errorHandling.ts
import { z } from 'zod';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    CRITICAL = 'critical',
}

/**
 * Standard application error structure
 */
export interface AppError {
    message: string;
    code?: string;
    severity: ErrorSeverity;
    context?: Record<string, unknown>;
    originalError?: unknown;
    userFriendlyMessage?: string;
    validationErrors?: Record<string, string[]>;
}

/**
 * Create a standardized application error
 *
 * @param message Error message
 * @param options Additional error options
 * @returns Standardized AppError object
 */
export function createAppError(
    message: string,
    options?: Partial<Omit<AppError, 'message' | 'severity'>> & { severity?: ErrorSeverity }
): AppError {
    return {
        message,
        severity: options?.severity || ErrorSeverity.ERROR,
        code: options?.code,
        context: options?.context,
        originalError: options?.originalError,
        userFriendlyMessage: options?.userFriendlyMessage || getFriendlyErrorMessage(message, options?.code),
        validationErrors: options?.validationErrors,
    };
}

/**
 * Handle Zod validation errors
 *
 * @param error Zod error
 * @returns Formatted AppError with validation details
 */
export function handleValidationError(error: z.ZodError): AppError {
    const validationErrors: Record<string, string[]> = {};

    // Format Zod errors into a more usable structure
    error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!validationErrors[path]) {
            validationErrors[path] = [];
        }
        validationErrors[path].push(err.message);
    });

    return createAppError(
        'Validation error',
        {
            code: 'VALIDATION_ERROR',
            severity: ErrorSeverity.WARNING,
            validationErrors,
            originalError: error,
            userFriendlyMessage: 'There was an issue with the provided information. Please check the form for errors.',
        }
    );
}

/**
 * Handle API fetch errors
 *
 * @param error Original error from fetch
 * @param endpoint API endpoint that was called
 * @returns Formatted AppError
 */
export function handleAPIError(error: unknown, endpoint: string): AppError {
    let message = 'API request failed';
    let code = 'API_ERROR';
    let severity = ErrorSeverity.ERROR;

    // Extract more specific error information if available
    if (error instanceof Response) {
        message = `API request failed with status ${error.status}`;
        code = `API_${error.status}`;

        // Classify error severity based on status code
        if (error.status >= 500) {
            severity = ErrorSeverity.CRITICAL;
        } else if (error.status === 429) {
            severity = ErrorSeverity.WARNING;
            message = 'Too many requests, please try again later';
        } else if (error.status === 404) {
            severity = ErrorSeverity.WARNING;
            message = 'The requested resource was not found';
        } else if (error.status === 401 || error.status === 403) {
            severity = ErrorSeverity.WARNING;
            message = 'Authentication or authorization error';
        }
    } else if (error instanceof Error) {
        message = error.message || message;
    }

    return createAppError(
        message,
        {
            code,
            severity,
            context: { endpoint },
            originalError: error,
        }
    );
}

/**
 * Convert technical error messages to user-friendly messages
 *
 * @param message Original error message
 * @param code Error code if available
 * @returns User-friendly error message
 */
function getFriendlyErrorMessage(message: string, code?: string): string {
    // Default message
    let friendlyMessage = 'Something went wrong. Please try again or contact support if the problem persists.';

    // Error code based messages
    if (code) {
        switch (code) {
            case 'VALIDATION_ERROR':
                friendlyMessage = 'Please check the information you provided and try again.';
                break;
            case 'API_404':
                friendlyMessage = 'We couldn\'t find what you were looking for. It may have been moved or deleted.';
                break;
            case 'API_401':
            case 'API_403':
                friendlyMessage = 'You don\'t have permission to access this resource. Please log in or contact support.';
                break;
            case 'API_429':
                friendlyMessage = 'You\'ve made too many requests. Please wait a moment and try again.';
                break;
            case 'API_500':
                friendlyMessage = 'Our servers encountered an error. Our team has been notified, and we\'re working to fix it.';
                break;
        }
        return friendlyMessage;
    }

    // Message content based fallbacks
    if (message.includes('network') || message.includes('offline') || message.includes('connection')) {
        friendlyMessage = 'Please check your internet connection and try again.';
    } else if (message.includes('timeout') || message.includes('timed out')) {
        friendlyMessage = 'The request took too long to complete. Please try again later.';
    } else if (message.includes('not found') || message.includes('404')) {
        friendlyMessage = 'We couldn\'t find what you were looking for. It may have been moved or deleted.';
    }

    return friendlyMessage;
}

/**
 * Log an error to the console and/or error tracking service
 *
 * @param error AppError or any error object
 * @param additionalContext Optional additional context
 */
export function logError(error: AppError | unknown, additionalContext?: Record<string, unknown>): void {
    // Normalize the error to AppError format
    const appError: AppError = isAppError(error)
        ? error
        : createAppError(
            error instanceof Error ? error.message : 'Unknown error',
            { originalError: error }
        );

    // Combined context
    const context = {
        ...appError.context,
        ...additionalContext,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
    };

    // Log to console
    console.error('Application error:', {
        message: appError.message,
        code: appError.code,
        severity: appError.severity,
        context,
        originalError: appError.originalError,
    });

    // Here you would add integration with error tracking services like Sentry
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(appError.originalError || appError, {
    //     level: getSentryLevel(appError.severity),
    //     tags: { code: appError.code },
    //     extra: context,
    //   });
    // }
}

/**
 * Type guard to check if an object is an AppError
 *
 * @param error Object to check
 * @returns Whether the object is an AppError
 */
function isAppError(error: unknown): error is AppError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        'severity' in error
    );
}

/**
 * Convert our severity levels to Sentry levels
 * For future Sentry integration
 *
 * @param severity ErrorSeverity
 * @returns Sentry level string
 */
export function getSentryLevel(severity: ErrorSeverity): string {
    switch (severity) {
        case ErrorSeverity.INFO:
            return 'info';
        case ErrorSeverity.WARNING:
            return 'warning';
        case ErrorSeverity.ERROR:
            return 'error';
        case ErrorSeverity.CRITICAL:
            return 'fatal';
        default:
            return 'error';
    }
}