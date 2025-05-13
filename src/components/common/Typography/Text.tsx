// src/components/common/Typography/Text.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/classNames';

// Define variants for the Text component using class-variance-authority
const textVariants = cva('text-text-primary whitespace-normal', { // Added whitespace-normal
  variants: {
    variant: {
      default: 'text-text-primary',
      secondary: 'text-text-secondary',
      tertiary: 'text-text-tertiary',
      muted: 'text-text-disabled opacity-80',
      accent: 'text-accent-primary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      info: 'text-info',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    family: {
      body: 'font-body',
      heading: 'font-heading',
      code: 'font-code',
    },
    leading: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    tracking: {
      tighter: 'tracking-tighter',
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider',
      widest: 'tracking-widest',
    },
    transform: {
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
      normalCase: 'normal-case',
    },
    wrap: {
      normal: 'whitespace-normal',
      nowrap: 'whitespace-nowrap',
      pre: 'whitespace-pre',
      preLine: 'whitespace-pre-line',
      preWrap: 'whitespace-pre-wrap',
    },
    decoration: {
      none: 'no-underline',
      underline: 'underline',
      lineThrough: 'line-through',
    },
    // Add word spacing variant
    wordSpacing: {
      normal: 'word-spacing-normal',
      wide: 'word-spacing-wide',
      wider: 'word-spacing-wider',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'base',
    weight: 'normal',
    family: 'body',
    leading: 'normal',
    align: 'left',
    wordSpacing: 'normal', // Default to normal word spacing
  },
});

// Define the component elements we support
type ElementType = 'p' | 'span' | 'div' | 'label';

// Props interface combining HTML attributes and our variants
export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'as'>,
    VariantProps<typeof textVariants> {
  as?: ElementType;
  truncate?: boolean;
  preserveSpacing?: boolean; // Add this option
}

// Create a more specific type for the ref based on the element type
const Text = React.forwardRef<HTMLElement, TextProps>(
  ({
    as = 'p',
    variant,
    size,
    weight,
    family,
    leading,
    align,
    tracking,
    transform,
    wrap,
    decoration,
    wordSpacing,
    truncate,
    preserveSpacing = true, // Default to preserve spacing
    className,
    children,
    ...props
  }, ref) => {
    // Combine all classes using the utility function
    // If preserveSpacing is true, add an additional class to ensure spacing
    const spacingClass = preserveSpacing && !wrap ? 'whitespace-normal word-break-normal preserve-whitespace' : '';

    const combinedClasses = cn(
      textVariants({
        variant,
        size,
        weight,
        family,
        leading,
        align,
        tracking,
        transform,
        wrap,
        decoration,
        wordSpacing,
      }),
      truncate && 'truncate',
      spacingClass,
      className
    );

    // Add inline style with word-spacing based on font family
    const inlineStyle = {
      wordSpacing: family === 'heading'
        ? 'var(--word-spacing-heading)'
        : family === 'body'
          ? 'var(--word-spacing-body)'
          : family === 'code'
            ? 'var(--word-spacing-code)'
            : 'var(--word-spacing-normal)'
    };

    // Render the appropriate element based on the 'as' prop
    switch (as) {
      case 'p':
        return (
          <p
            ref={ref as React.ForwardedRef<HTMLParagraphElement>}
            className={combinedClasses}
            style={inlineStyle}
            {...props}
          >
            {children}
          </p>
        );
      case 'span':
        return (
          <span
            ref={ref as React.ForwardedRef<HTMLSpanElement>}
            className={combinedClasses}
            style={inlineStyle}
            {...props}
          >
            {children}
          </span>
        );
      case 'div':
        return (
          <div
            ref={ref as React.ForwardedRef<HTMLDivElement>}
            className={combinedClasses}
            style={inlineStyle}
            {...props}
          >
            {children}
          </div>
        );
      case 'label':
        return (
          <label
            ref={ref as React.ForwardedRef<HTMLLabelElement>}
            className={combinedClasses}
            style={inlineStyle}
            {...props}
          >
            {children}
          </label>
        );
      default:
        return (
          <p
            ref={ref as React.ForwardedRef<HTMLParagraphElement>}
            className={combinedClasses}
            style={inlineStyle}
            {...props}
          >
            {children}
          </p>
        );
    }
  }
);

Text.displayName = 'Text';

export { Text, textVariants };