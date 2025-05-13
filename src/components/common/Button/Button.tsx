"use client";

import React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import { motion } from "framer-motion";

// Button variant definitions using cva
const buttonVariants = cva(
  // Base styles for all buttons
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      intent: {
        primary:
          "bg-brand-primary text-white hover:bg-interactive-hover active:bg-interactive-active",
        secondary:
          "bg-transparent border border-brand-primary text-brand-primary hover:bg-bg-hover active:bg-bg-active",
        tertiary:
          "bg-transparent text-text-primary hover:text-interactive-hover hover:bg-bg-hover active:bg-bg-active",
        accent:
          "bg-accent-oceanic text-white hover:bg-accent-oceanic/90 active:bg-accent-oceanic/80",
        gradient:
          "bg-gradient-button text-white hover:bg-gradient-button-hover active:bg-interactive-active",
      },
      size: {
        sm: "text-sm py-2 px-3",
        md: "text-base py-3 px-6",
        lg: "text-lg py-4 px-8",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      iconPosition: {
        left: "flex-row",
        right: "flex-row-reverse",
        none: "",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
      fullWidth: false,
      iconPosition: "none",
    },
  }
);

// Props interface extending variant props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  icon?: React.ReactNode;
  animate?: boolean;
}

// List of DOM-specific event handlers that conflict with Framer Motion
const domEventHandlers = [
  'onAnimationStart', 'onDrag', 'onDragEnd', 'onDragEnter',
  'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onMouseDown',
  'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOut', 'onMouseOver',
  'onMouseUp'
] as const;

// Type for the keys of conflicting DOM event handlers
type DOMEventHandlerKey = typeof domEventHandlers[number];

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      intent,
      size,
      fullWidth,
      iconPosition = "none",
      icon,
      href,
      animate = true,
      children,
      ...props
    },
    ref
  ) => {
    // Determine the icon position if an icon exists but no position is specified
    const effectiveIconPosition =
      icon && iconPosition === "none" ? "left" : iconPosition;

    // Separate conflicting event handlers from motion-compatible props
    const safeProps: Omit<typeof props, DOMEventHandlerKey> = {};
    const conflictingProps: Partial<Pick<typeof props, DOMEventHandlerKey>> = {};

    Object.entries(props).forEach(([key, value]) => {
      if (domEventHandlers.includes(key as DOMEventHandlerKey)) {
        // Type assertion is safe here because we check inclusion in domEventHandlers
        (conflictingProps as Record<string, unknown>)[key] = value;
      } else {
        (safeProps as Record<string, unknown>)[key] = value;
      }
    });

    // Base button element with all styling
    const ButtonElement = (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({
            intent,
            size,
            fullWidth,
            iconPosition: effectiveIconPosition,
          }),
          className
        )}
        whileHover={animate ? { scale: 1.03 } : {}}
        whileTap={animate ? { scale: 0.98 } : {}}
        {...safeProps}
      >
        {icon && effectiveIconPosition !== "none" && icon}
        <span>{children}</span>
      </motion.button>
    );

    // If href is provided, wrap the button in a Link
    if (href) {
      return (
        <Link href={href} passHref>
          {ButtonElement}
        </Link>
      );
    }

    // Otherwise, return just the button
    return ButtonElement;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
