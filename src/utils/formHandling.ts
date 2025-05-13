// src/utils/formHandling.ts
import { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
import { z } from 'zod';
import { createAppError, ErrorSeverity } from './errorHandling';

/**
 * Form field types
 */
export type FieldType = 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'tel' | 'number' | 'date';

/**
 * Field value types
 */
export type FieldValue = string | number | boolean | null | undefined;

/**
 * Form field configuration
 */
export interface FormFieldConfig<T extends Record<string, FieldValue>> {
    name: keyof T;
    type: FieldType;
    label: string;
    placeholder?: string;
    helperText?: string;
    options?: { value: string; label: string }[];
    initialValue?: FieldValue;
    required?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    validate?: (value: FieldValue, formValues: T) => string | null;
    transform?: (value: FieldValue) => FieldValue;
    deps?: (keyof T)[];
}

/**
 * Form configuration
 */
export interface FormConfig<T extends Record<string, FieldValue>> {
    id: string;
    fields: FormFieldConfig<T>[];
    onSubmit: (values: T) => Promise<void> | void;
    validationSchema?: z.ZodType<T>;
    resetAfterSubmit?: boolean;
    submitOnEnter?: boolean;
}

/**
 * Form status
 */
export type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

/**
 * Form field error state
 */
export interface FieldError {
    message: string;
    type: 'required' | 'format' | 'custom' | 'schema';
}

/**
 * Form state
 */
export interface FormState<T extends Record<string, FieldValue>> {
    values: T;
    errors: Record<keyof T, FieldError | null>;
    touched: Record<keyof T, boolean>;
    isValid: boolean;
    isDirty: boolean;
    status: FormStatus;
    submitCount: number;
    submitError: string | null;
}

/**
 * Form handler return value
 */
export interface FormHandler<T extends Record<string, FieldValue>> {
    formState: FormState<T>;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleBlur: (fieldName: keyof T) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    setFieldValue: (fieldName: keyof T, value: FieldValue) => void;
    setFieldError: (fieldName: keyof T, error: string | null) => void;
    resetForm: () => void;
    validateForm: () => boolean;
    validateField: (fieldName: keyof T) => boolean;
}

/**
 * Create a form handler with state management and validation
 *
 * @param config Form configuration
 * @returns Form handler object
 */
export function useFormHandler<T extends Record<string, FieldValue>>(config: FormConfig<T>): FormHandler<T> {
    // Initialize form values from field configs
    const initialValues = config.fields.reduce((values, field) => {
        // Fix type issue by ensuring the value is correctly typed for the specific key
        values[field.name] = (field.initialValue !== undefined ? field.initialValue : '') as T[keyof T];
        return values;
    }, {} as T);

    // Initialize form state
    const [formState, setFormState] = useState<FormState<T>>({
        values: initialValues,
        errors: Object.keys(initialValues).reduce((acc, key) => {
            acc[key as keyof T] = null;
            return acc;
        }, {} as Record<keyof T, FieldError | null>),
        touched: Object.keys(initialValues).reduce((acc, key) => {
            acc[key as keyof T] = false;
            return acc;
        }, {} as Record<keyof T, boolean>),
        isValid: false,
        isDirty: false,
        status: 'idle',
        submitCount: 0,
        submitError: null
    });

    /**
     * Set field value
     */
    const setFieldValue = useCallback((fieldName: keyof T, value: FieldValue) => {
        const field = config.fields.find(f => f.name === fieldName);

        // Apply transformation if configured
        let transformedValue = value;
        if (field?.transform) {
            transformedValue = field.transform(value);
        }

        setFormState(prevState => ({
            ...prevState,
            values: {
                ...prevState.values,
                // Fix type issue by ensuring the value is correctly typed for the specific key
                [fieldName]: transformedValue as T[keyof T]
            },
            isDirty: true
        }));
    }, [config.fields]);

    /**
     * Validate a single field
     */
    const validateField = useCallback((fieldName: keyof T): boolean => {
        const field = config.fields.find(f => f.name === fieldName);
        if (!field) return true;

        const value = formState.values[fieldName];
        let fieldError: FieldError | null = null;

        // Required validation
        if (field.required && (value === '' || value === null || value === undefined)) {
            fieldError = {
                message: `${field.label} is required`,
                type: 'required'
            };
        }
        // Field-specific validation
        else if (field.validate) {
            const errorMessage = field.validate(value, formState.values);
            if (errorMessage) {
                fieldError = {
                    message: errorMessage,
                    type: 'custom'
                };
            }
        }

        // Schema validation for this field (if provided)
        if (!fieldError && config.validationSchema) {
            try {
                // Fix Zod validation without using partial()
                // Create single field object for validation
                const singleFieldData = { [fieldName]: value } as unknown as T;

                // Try to validate - will throw if invalid
                config.validationSchema.parse(singleFieldData);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const fieldErrors = error.errors.filter(err =>
                        err.path[0] === fieldName
                    );

                    if (fieldErrors.length > 0) {
                        fieldError = {
                            message: fieldErrors[0].message,
                            type: 'schema'
                        };
                    }
                }
            }
        }

        // Update form state
        setFormState(prevState => {
            const newErrors = {
                ...prevState.errors,
                [fieldName]: fieldError
            };

            const isValid = Object.values(newErrors).every(err => err === null);

            return {
                ...prevState,
                errors: newErrors,
                isValid
            };
        });

        return fieldError === null;
    }, [config.fields, config.validationSchema, formState.values]);

    /**
     * Validate the entire form
     */
    const validateForm = useCallback((): boolean => {
        // Field-level validation
        const fieldErrors: Record<keyof T, FieldError | null> = { ...formState.errors };

        for (const fieldName of Object.keys(formState.values) as Array<keyof T>) {
            const field = config.fields.find(f => f.name === fieldName);
            if (!field) continue;

            const value = formState.values[fieldName];

            // Required validation
            if (field.required && (value === '' || value === null || value === undefined)) {
                fieldErrors[fieldName] = {
                    message: `${field.label} is required`,
                    type: 'required'
                };
                continue;
            }

            // Field-specific validation
            if (field.validate) {
                const errorMessage = field.validate(value, formState.values);
                if (errorMessage) {
                    fieldErrors[fieldName] = {
                        message: errorMessage,
                        type: 'custom'
                    };
                    continue;
                }
            }

            // Clear error if validation passes
            fieldErrors[fieldName] = null;
        }

        // Schema validation (if provided)
        if (config.validationSchema) {
            try {
                config.validationSchema.parse(formState.values);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    error.errors.forEach(err => {
                        const fieldName = err.path[0] as keyof T;
                        fieldErrors[fieldName] = {
                            message: err.message,
                            type: 'schema'
                        };
                    });
                }
            }
        }

        // Check if form is valid
        const isValid = Object.values(fieldErrors).every(error => error === null);

        // Update form state
        setFormState(prevState => ({
            ...prevState,
            errors: fieldErrors,
            isValid
        }));

        return isValid;
    }, [config.fields, config.validationSchema, formState.errors, formState.values]);

    // Validate form when values change
    useEffect(() => {
        if (formState.isDirty) {
            validateForm();
        }
    }, [formState.values, formState.isDirty, validateForm]);

    /**
     * Handle input changes
     */
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: FieldValue = value;

        // Handle checkbox inputs
        if (type === 'checkbox') {
            finalValue = (e.target as HTMLInputElement).checked;
        }

        setFieldValue(name as keyof T, finalValue);
    }, [setFieldValue]); // Fix missing dependency

    /**
     * Handle field blur (mark as touched)
     */
    const handleBlur = useCallback((fieldName: keyof T) => {
        setFormState(prevState => ({
            ...prevState,
            touched: {
                ...prevState.touched,
                [fieldName]: true
            }
        }));

        // Validate field on blur
        validateField(fieldName);
    }, [validateField]);

    /**
     * Set field error
     */
    const setFieldError = useCallback((fieldName: keyof T, error: string | null) => {
        setFormState(prevState => ({
            ...prevState,
            errors: {
                ...prevState.errors,
                [fieldName]: error ? { message: error, type: 'custom' } : null
            },
            isValid: error ? false : Object.values(prevState.errors).every(err => err === null)
        }));
    }, []);

    /**
     * Reset form to initial state
     */
    const resetForm = useCallback(() => {
        setFormState({
            values: initialValues,
            errors: Object.keys(initialValues).reduce((acc, key) => {
                acc[key as keyof T] = null;
                return acc;
            }, {} as Record<keyof T, FieldError | null>),
            touched: Object.keys(initialValues).reduce((acc, key) => {
                acc[key as keyof T] = false;
                return acc;
            }, {} as Record<keyof T, boolean>),
            isValid: false,
            isDirty: false,
            status: 'idle',
            submitCount: 0,
            submitError: null
        });
    }, [initialValues]);

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = Object.keys(formState.values).reduce((acc, key) => {
            acc[key as keyof T] = true;
            return acc;
        }, {} as Record<keyof T, boolean>);

        setFormState(prevState => ({
            ...prevState,
            touched: allTouched,
            status: 'validating',
            submitCount: prevState.submitCount + 1
        }));

        // Validate form before submission
        const isValid = validateForm();

        if (!isValid) {
            setFormState(prevState => ({
                ...prevState,
                status: 'error',
                submitError: 'Please fix the errors before submitting.'
            }));
            return;
        }

        // Form is valid, proceed with submission
        setFormState(prevState => ({
            ...prevState,
            status: 'submitting',
            submitError: null
        }));

        try {
            await config.onSubmit(formState.values);

            setFormState(prevState => ({
                ...prevState,
                status: 'success'
            }));

            // Reset form if configured to do so
            if (config.resetAfterSubmit) {
                resetForm();
            }
        } catch (error) {
            let errorMessage = 'An error occurred during submission.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            setFormState(prevState => ({
                ...prevState,
                status: 'error',
                submitError: errorMessage
            }));
        }
    }, [config, formState.values, resetForm, validateForm]);

    return {
        formState,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldError,
        resetForm,
        validateForm,
        validateField
    };
}

/**
 * Get props for a form field
 *
 * @param fieldConfig Field configuration
 * @param formHandler Form handler object
 * @returns Props for the field
 */
export function getFieldProps<T extends Record<string, FieldValue>>(
    fieldConfig: FormFieldConfig<T>,
    formHandler: FormHandler<T>
) {
    const { formState, handleChange, handleBlur, setFieldValue } = formHandler;
    const name = fieldConfig.name as string;

    const baseProps = {
        id: `form-field-${name}`,
        name,
        value: formState.values[fieldConfig.name] ?? '',
        onChange: handleChange,
        onBlur: () => handleBlur(fieldConfig.name),
        placeholder: fieldConfig.placeholder,
        disabled: fieldConfig.disabled,
        required: fieldConfig.required,
        'aria-invalid': formState.errors[fieldConfig.name] ? 'true' : 'false',
        'aria-describedby': `${name}-error ${name}-helper`,
    };

    // Add type-specific props
    switch (fieldConfig.type) {
        case 'checkbox':
            return {
                ...baseProps,
                type: 'checkbox',
                checked: !!formState.values[fieldConfig.name],
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                    setFieldValue(fieldConfig.name, e.target.checked);
                },
            };
        case 'radio':
            return {
                ...baseProps,
                type: 'radio',
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                        setFieldValue(fieldConfig.name, e.target.value);
                    }
                },
            };
        case 'select':
            return {
                ...baseProps,
                options: fieldConfig.options,
            };
        case 'textarea':
            return {
                ...baseProps,
            };
        default:
            return {
                ...baseProps,
                type: fieldConfig.type,
            };
    }
}

/**
 * Check if a field has an error and should display it
 */
export function shouldShowError<T extends Record<string, FieldValue>>(
    formState: FormState<T>,
    fieldName: keyof T
): boolean {
    return !!(formState.errors[fieldName] && formState.touched[fieldName]);
}

/**
 * Submit form data to an API endpoint
 */
export async function submitFormData<T extends Record<string, FieldValue>, R = unknown>(
    endpoint: string,
    data: T,
    options?: RequestInit
): Promise<R> {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            ...options,
        });

        if (!response.ok) {
            // Try to parse error response
            let errorMessage: string;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
            } catch {
                errorMessage = `Error: ${response.status} ${response.statusText}`;
            }

            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw createAppError(error.message, {
                code: 'FORM_SUBMISSION_ERROR',
                severity: ErrorSeverity.ERROR,
                originalError: error,
            });
        }
        throw createAppError('An unknown error occurred while submitting the form', {
            code: 'FORM_SUBMISSION_ERROR',
            severity: ErrorSeverity.ERROR,
        });
    }
}