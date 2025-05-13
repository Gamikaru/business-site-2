// src/utils/contactFormHandler.ts
import { createAppError, ErrorSeverity, AppError } from './errorHandling';
import { defaultApiHandler } from './apiHandler';
import { useState, useEffect } from 'react';

/**
 * EmailJS configuration
 */
export interface EmailJSConfig {
    serviceId: string;
    templateId: string;
    userId: string;
    accessToken?: string;
}

/**
 * Contact form data structure
 */
export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    contactPref?: string;
    projectType?: string;
    projectScope?: string;
    budget?: string;
    timeframe?: string;
    details: string;
    company?: string;
    website?: string;
    industry?: string;
    referralSource?: string;
    goals?: string;
    [key: string]: unknown;
}

/**
 * Form submission result
 */
export interface FormSubmissionResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * Contact form submission configuration
 */
export interface ContactFormSubmissionConfig {
    emailjsConfig: EmailJSConfig;
    recaptchaToken?: string;
    honeypotField?: string;
    validateForm?: (data: ContactFormData) => string | null;
    onSuccess?: (result: FormSubmissionResult) => void;
    onError?: (error: Error | AppError) => void;
}

/**
 * Contact form validation options
 */
export interface ContactFormValidationOptions {
    requiredFields?: string[];
    maxMessageLength?: number;
    validateEmail?: boolean;
    validatePhone?: boolean;
}

/**
 * Validate a contact form submission
 *
 * @param data Form data
 * @param options Validation options
 * @returns Error message or null if valid
 */
export function validateContactForm(
    data: ContactFormData,
    options: ContactFormValidationOptions = {}
): string | null {
    const {
        requiredFields = ['name', 'email', 'details'],
        maxMessageLength = 5000,
        validateEmail = true,
        validatePhone = true,
    } = options;

    // Check required fields
    for (const field of requiredFields) {
        const value = data[field];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
    }

    // Validate email format
    if (validateEmail && data.email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
            return 'Please enter a valid email address';
        }
    }

    // Validate phone format if provided
    if (validatePhone && data.phone && data.phone.trim() !== '') {
        // Very basic phone validation - accept digits, spaces, and some special characters
        const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
        if (!phoneRegex.test(data.phone)) {
            return 'Please enter a valid phone number';
        }
    }

    // Check message length
    if (data.details && data.details.length > maxMessageLength) {
        return `Message is too long (maximum ${maxMessageLength} characters)`;
    }

    return null;
}

/**
 * Check if submission might be spam using basic heuristics
 *
 * @param data Form data
 * @param honeypotField Name of honeypot field
 * @returns Whether the submission is likely spam
 */
export function isLikelySpam(data: ContactFormData, honeypotField?: string): boolean {
    // Check honeypot field if provided
    if (honeypotField && data[honeypotField]) {
        return true;
    }

    // Check for URLs in message (common in spam)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlCount = (data.details.match(urlRegex) || []).length;
    if (urlCount > 2) {
        return true;
    }

    // Detect excessive capitalization (often used in spam)
    const uppercaseRatio = data.details
        .replace(/[^a-zA-Z]/g, '')
        .split('')
        .filter(char => char === char.toUpperCase())
        .length / data.details.replace(/[^a-zA-Z]/g, '').length;

    if (uppercaseRatio > 0.5 && data.details.length > 20) {
        return true;
    }

    return false;
}

/**
 * Load the EmailJS SDK dynamically
 *
 * @returns Promise that resolves when EmailJS is loaded
 */
async function loadEmailJSSDK(): Promise<void> {
    if (typeof window === 'undefined') {
        return;
    }

    // Skip if already loaded
    if (window.emailjs) {
        return;
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.emailjs.com/sdk/2.6.4/email.min.js';
        script.async = true;
        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
            reject(new Error('Failed to load EmailJS SDK'));
        };
        document.body.appendChild(script);
    });
}

/**
 * Submit a contact form using EmailJS
 *
 * @param data Form data
 * @param config Submission configuration
 * @returns Promise with submission result
 */
export async function submitContactForm(
    data: ContactFormData,
    config: ContactFormSubmissionConfig
): Promise<FormSubmissionResult> {
    try {
        const { emailjsConfig, recaptchaToken, honeypotField, validateForm } = config;

        // Custom validation if provided
        if (validateForm) {
            const error = validateForm(data);
            if (error) {
                throw createAppError(error, {
                    code: 'FORM_VALIDATION_ERROR',
                    severity: ErrorSeverity.WARNING,
                });
            }
        }

        // Spam check
        if (isLikelySpam(data, honeypotField)) {
            // Return success but don't actually submit (quietly reject spam)
            return {
                success: true,
                messageId: 'spam-filtered',
            };
        }

        // Load EmailJS SDK if needed
        await loadEmailJSSDK();

        if (!window.emailjs) {
            throw createAppError('EmailJS SDK not available', {
                code: 'EMAILJS_NOT_LOADED',
                severity: ErrorSeverity.ERROR,
            });
        }

        // Initialize EmailJS
        window.emailjs.init(emailjsConfig.userId);

        // Prepare template parameters
        const templateParams = {
            ...data,
            'g-recaptcha-response': recaptchaToken,
        };

        // Send email using EmailJS
        const response = await window.emailjs.send(
            emailjsConfig.serviceId,
            emailjsConfig.templateId,
            templateParams,
            emailjsConfig.userId
        );

        // Handle success
        if (config.onSuccess) {
            config.onSuccess({
                success: true,
                messageId: response.messageId || 'sent',
            });
        }

        return {
            success: true,
            messageId: response.messageId || 'sent',
        };
    } catch (error) {
        // Handle error
        const appError = error instanceof Error
            ? createAppError(error.message, {
                code: 'FORM_SUBMISSION_ERROR',
                severity: ErrorSeverity.ERROR,
                originalError: error,
            })
            : createAppError('An unknown error occurred', {
                code: 'FORM_SUBMISSION_ERROR',
                severity: ErrorSeverity.ERROR,
            });

        if (config.onError) {
            config.onError(appError);
        }

        return {
            success: false,
            error: appError.message,
        };
    }
}

/**
 * Get the EmailJS configuration from content
 *
 * @returns EmailJS configuration
 */
export async function getEmailJSConfig(): Promise<EmailJSConfig> {
    try {
        // Try to fetch from API route (which would load from environment variables)
        const response = await defaultApiHandler.get<EmailJSConfig>('/api/emailjs-config');
        return response;
    } catch {
        // Fallback to public environment variables
        // These would be set in your .env.local file and exposed with NEXT_PUBLIC_ prefix
        return {
            serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
            templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
            userId: process.env.NEXT_PUBLIC_EMAILJS_USER_ID || '',
        };
    }
}

// Add EmailJS typings
declare global {
    interface Window {
        emailjs?: {
            init: (userId: string, accessToken?: string) => void;
            send: (
                serviceId: string,
                templateId: string,
                templateParams: Record<string, unknown>,
                userId: string
            ) => Promise<{ status: number; text: string; messageId?: string }>;
        };
    }
}

/**
 * React hook for contact form submission
 *
 * @param config Submission configuration
 * @returns Object with submission function and state
 */
export function useContactForm(config?: Partial<ContactFormSubmissionConfig>) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [emailjsConfig, setEmailjsConfig] = useState<EmailJSConfig | null>(null);

    // Load EmailJS config on mount
    useEffect(() => {
        let isMounted = true;

        const loadConfig = async () => {
            try {
                const config = await getEmailJSConfig();
                if (isMounted) {
                    setEmailjsConfig(config);
                }
            } catch (e) {
                console.error('Failed to load EmailJS config:', e);
            }
        };

        loadConfig();

        return () => {
            isMounted = false;
        };
    }, []);

    // Submit handler
    const submitForm = async (data: ContactFormData) => {
        if (!emailjsConfig) {
            setError('Email service configuration not loaded');
            return {
                success: false,
                error: 'Email service configuration not loaded',
            };
        }

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await submitContactForm(data, {
                emailjsConfig,
                ...config,
                onSuccess: (result) => {
                    setSuccess(true);
                    config?.onSuccess?.(result);
                },
                onError: (error) => {
                    setError(error.message);
                    config?.onError?.(error);
                },
            });

            setIsLoading(false);
            return result;
        } catch (e) {
            setIsLoading(false);
            setError(e instanceof Error ? e.message : 'An unknown error occurred');

            return {
                success: false,
                error: e instanceof Error ? e.message : 'An unknown error occurred',
            };
        }
    };

    return {
        submitForm,
        isLoading,
        error,
        success,
        isConfigLoaded: !!emailjsConfig,
    };
}