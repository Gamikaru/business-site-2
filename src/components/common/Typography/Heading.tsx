// src/components/common/Typography/Heading.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/classNames';

// Define variants for the Heading component
const headingVariants = cva(
  'font-heading font-bold text-heading tracking-heading leading-heading whitespace-normal word-spacing-normal', // Added whitespace-normal and word-spacing-normal
  {
    variants: {
      level: {
        1: 'text-4xl md:text-5xl lg:text-6xl',
        2: 'text-3xl md:text-4xl lg:text-5xl',
        3: 'text-2xl md:text-3xl lg:text-4xl',
        4: 'text-xl md:text-2xl',
        5: 'text-lg md:text-xl',
        6: 'text-base md:text-lg',
      },
      variant: {
        default: 'text-heading',
        primary: 'text-heading',
        secondary: 'text-text-secondary',
        accent: 'text-accent-primary',
        gradient: 'text-transparent bg-clip-text bg-gradient-green',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      transform: {
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize',
        normal: 'normal-case',
      },
      // Add a new spacing variant
      spacing: {
        normal: 'word-spacing-normal',
        wide: 'word-spacing-wide',
        wider: 'word-spacing-wider',
      },
    },
    defaultVariants: {
      level: 2,
      variant: 'default',
      weight: 'bold',
      align: 'left',
      spacing: 'normal', // Default to normal spacing
    },
  }
);

// Update props interface to include the new spacing variant
export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  preserveSpacing?: boolean; // Add this option
}

// The Heading component
const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({
    as,
    level = 2,
    variant,
    weight,
    align,
    transform,
    spacing,
    className,
    children,
    preserveSpacing = true, // Default to preserve spacing
    ...props
  }, ref) => {
    // Determine heading element based on level prop or as prop
    const Component = as || (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');

    // If preserveSpacing is true, add an additional class to ensure spacing
    const spacingClass = preserveSpacing ? 'whitespace-normal word-break-normal' : '';

    return (
      <Component
        ref={ref}
        className={cn(
          headingVariants({ level, variant, weight, align, transform, spacing }),
          spacingClass,
          className
        )}
        style={{ wordSpacing: 'var(--word-spacing-heading)' }} // Ensure word spacing is applied
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

// Create specific heading components for convenience
const H1 = (props: Omit<HeadingProps, 'level' | 'as'>) => (
  <Heading level={1} as="h1" {...props} />
);

const H2 = (props: Omit<HeadingProps, 'level' | 'as'>) => (
  <Heading level={2} as="h2" {...props} />
);

const H3 = (props: Omit<HeadingProps, 'level' | 'as'>) => (
  <Heading level={3} as="h3" {...props} />
);

const H4 = (props: Omit<HeadingProps, 'level' | 'as'>) => (
  <Heading level={4} as="h4" {...props} />
);

const H5 = (props: Omit<HeadingProps, 'level' | 'as'>) => (
  <Heading level={5} as="h5" {...props} />
);

const H6 = (props: Omit<HeadingProps, 'level' | 'as'>) => (
  <Heading level={6} as="h6" {...props} />
);

export { Heading, H1, H2, H3, H4, H5, H6, headingVariants };