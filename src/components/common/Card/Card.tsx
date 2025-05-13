"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import { motion } from "framer-motion";
import { Button } from "../Button";

// Card variant definitions using cva
const cardVariants = cva(
  // Base styles for all cards
  "relative flex flex-col overflow-hidden transition-all duration-300 rounded-xl",
  {
    variants: {
      variant: {
        default: "bg-bg-card border border-border hover:shadow-md",
        elevated: "bg-bg-card shadow-md hover:shadow-lg border border-transparent",
        outline: "bg-transparent border border-border hover:border-brand-primary",
        feature: "bg-bg-card border-t-4 border-brand-primary shadow-md hover:shadow-lg",
        gradient: "bg-gradient-card",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      hover: {
        transform: "hover:-translate-y-2",
        glow: "hover:shadow-lg hover:shadow-brand-primary/20",
        outline: "hover:border-brand-primary",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hover: "transform",
    },
  }
);

// Props interface extending variant props
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  href?: string;
  cardNumber?: string;
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  aspectRatio?: string;
  ctaText?: string;
  animate?: boolean;
  imagePosition?: "top" | "left" | "right" | "background" | "none";
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

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      hover,
      href,
      cardNumber,
      title,
      subtitle,
      imageSrc,
      imageAlt = "",
      aspectRatio = "auto",
      ctaText,
      animate = true,
      imagePosition = "top",
      children,
      ...props
    },
    ref
  ) => {
    // Card content
    const CardContent = (
      <div className="flex flex-col flex-grow">
        {/* Card number (for numbered cards like in services) */}
        {cardNumber && (
          <span className="font-mono text-sm text-brand-primary mb-2">{cardNumber}</span>
        )}

        {/* Title and subtitle */}
        {title && (
          <h3 className="font-heading text-lg font-semibold mb-2 text-heading">{title}</h3>
        )}
        {subtitle && (
          <p className="text-text-secondary text-sm mb-4">{subtitle}</p>
        )}

        {/* Main card content */}
        <div className="flex-grow">{children}</div>

        {/* CTA button if provided */}
        {ctaText && (
          <div className="mt-4">
            <Button
              intent="secondary"
              size="sm"
              href={href || "#"}
              className="mt-auto"
            >
              {ctaText}
            </Button>
          </div>
        )}
      </div>
    );

    // Render image based on position
    const renderImage = () => {
      if (!imageSrc || imagePosition === "none") return null;

      const imageClasses = cn("overflow-hidden", {
        "w-full rounded-t-xl mb-4": imagePosition === "top",
        "w-1/3 rounded-l-xl mr-4": imagePosition === "left",
        "w-1/3 rounded-r-xl ml-4 order-last": imagePosition === "right",
        "absolute inset-0 w-full h-full -z-10": imagePosition === "background",
      });

      return (
        <div
          className={imageClasses}
          style={{
            aspectRatio: imagePosition === "top" ? aspectRatio : "auto",
          }}
        >
          {/* Using Next.js Image component for optimization */}
          <div className="relative w-full h-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "object-cover",
                {
                  "w-full h-full": true,
                  "opacity-20": imagePosition === "background",
                }
              )}
            />

            {/* Gradient overlay for background images */}
            {imagePosition === "background" && (
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/80 to-transparent" />
            )}
          </div>
        </div>
      );
    };

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

    // Wrapper element with all styling
    const CardWrapper = (
      <motion.div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, hover }),
          {
            "flex-row": imagePosition === "left" || imagePosition === "right",
          },
          className
        )}
        whileHover={animate ? { y: hover === "transform" ? -8 : 0, scale: 1.01 } : {}}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        {...safeProps}
      >
        {renderImage()}
        {CardContent}

        {/* Blueprint corner accent for feature cards */}
        {variant === "feature" && (
          <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0L24 0L24 24" stroke="var(--color-divider)" strokeWidth="1" fill="none" />
            </svg>
          </div>
        )}
      </motion.div>
    );

    // If href is provided, wrap the card in a Link
    if (href) {
      return (
        <Link href={href} passHref className="no-underline">
          {CardWrapper}
        </Link>
      );
    }

    // Otherwise, return just the card
    return CardWrapper;
  }
);

Card.displayName = "Card";

export { Card, cardVariants };