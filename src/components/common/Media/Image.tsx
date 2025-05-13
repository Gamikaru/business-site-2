// src/components/common/Media/Image.tsx
"use client";

import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/utils/classNames";

// Define fallback component directly
const ImagePlaceholder: React.FC<{
  alt?: string;
  className?: string;
  placeholderText?: string;
  loading?: boolean;
}> = ({ alt, className, placeholderText, loading }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-bg-tertiary/20 text-text-secondary w-full h-full",
        loading && "animate-pulse",
        className
      )}
      aria-label={alt || placeholderText || "Image placeholder"}
    >
      <span className="text-sm font-medium">{placeholderText || "Image"}</span>
    </div>
  );
};

// Image style variants
const imageVariants = cva("transition-all", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    },
    aspectRatio: {
      auto: "aspect-auto",
      square: "aspect-square",
      video: "aspect-video",
      portrait: "aspect-[3/4]",
      portraitTall: "aspect-[2/3]",
      standard: "aspect-[4/3]",
      wide: "aspect-[16/9]",
      ultraWide: "aspect-[21/9]",
      custom: "", // For manually specified aspect ratio
    },
    objectFit: {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      none: "object-none",
    },
    objectPosition: {
      center: "object-center",
      top: "object-top",
      bottom: "object-bottom",
      left: "object-left",
      right: "object-right",
      "top-left": "object-left-top",
      "top-right": "object-right-top",
      "bottom-left": "object-left-bottom",
      "bottom-right": "object-right-bottom",
    },
    hover: {
      none: "",
      zoom: "group-hover:scale-110 hover:scale-110 transition-transform duration-500",
      zoomFast: "group-hover:scale-105 hover:scale-105 transition-transform duration-300",
      brighter: "group-hover:brightness-110 hover:brightness-110 transition-filter duration-300",
      darker: "group-hover:brightness-90 hover:brightness-90 transition-filter duration-300",
      saturate: "group-hover:saturate-150 hover:saturate-150 transition-filter duration-300",
      desaturate: "group-hover:saturate-50 hover:saturate-50 transition-filter duration-300",
      blur: "group-hover:blur-sm hover:blur-sm transition-filter duration-300",
    },
    shadow: {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
    },
    border: {
      none: "border-0",
      thin: "border border-border",
      medium: "border-2 border-border",
      thick: "border-4 border-border",
    },
  },
  defaultVariants: {
    rounded: "md",
    aspectRatio: "auto",
    objectFit: "cover",
    objectPosition: "center",
    hover: "none",
    shadow: "none",
    border: "none",
  },
});

// Type for variants
type ImageVariantProps = VariantProps<typeof imageVariants>;

// Props Interface - simplified from the original
export interface ImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  fallback?: string | React.ReactNode;
  customAspectRatio?: string;
  animate?: boolean;
  showLoadingPlaceholder?: boolean;
  groupHover?: boolean;
  blurUp?: boolean;
  blurDataURL?: string;
  fallbackClassName?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  quality?: number;
  fill?: boolean;

  // Style variants
  aspectRatio?: ImageVariantProps["aspectRatio"];
  rounded?: ImageVariantProps["rounded"];
  hover?: ImageVariantProps["hover"];
  shadow?: ImageVariantProps["shadow"];
  border?: ImageVariantProps["border"];
  objectFit?: ImageVariantProps["objectFit"];
  objectPosition?: ImageVariantProps["objectPosition"];

  // Next.js image props
  priority?: boolean;
  unoptimized?: boolean;
  style?: React.CSSProperties;
  onLoadingComplete?: () => void;
}

export function Image({
  src,
  alt,
  width,
  height,
  rounded,
  aspectRatio,
  customAspectRatio,
  objectFit,
  objectPosition,
  hover,
  shadow,
  border,
  priority,
  unoptimized,
  className,
  containerClassName,
  fallback = "Image",
  animate = false,
  showLoadingPlaceholder = true,
  groupHover = false,
  blurUp = false,
  blurDataURL,
  fallbackClassName,
  fill = false,
  sizes,
  loading,
  quality,
  style,
  onLoadingComplete,
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset loading/error state when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  // Determine container style based on aspect ratio
  const containerStyle: React.CSSProperties = {
    ...style
  };

  if (aspectRatio === "custom" && customAspectRatio) {
    const [aspectWidth, aspectHeight] = customAspectRatio.split("/");
    if (aspectWidth && aspectHeight) {
      containerStyle.aspectRatio = `${aspectWidth}/${aspectHeight}`;
    }
  }

  const containerClasses = cn(
    "relative overflow-hidden",
    shadow && imageVariants({ shadow }),
    border && imageVariants({ border }),
    aspectRatio && imageVariants({ aspectRatio }),
    rounded && imageVariants({ rounded }),
    groupHover && "group",
    containerClassName
  );

  const imageClasses = cn(
    "transition-all duration-300",
    isLoading && blurUp ? "blur-sm scale-105" : "blur-0 scale-100",
    imageVariants({ objectFit, objectPosition, hover, rounded }),
    !isLoading && animate && "animate-fade-in",
    className
  );

  // Handle rendering error fallback
  if (hasError || !src) {
    return (
      <div
        className={cn(
          containerClasses,
          "bg-bg-secondary/20",
          fallbackClassName
        )}
        style={containerStyle}
        aria-label={`Failed to load image: ${alt}`}
      >
        {typeof fallback === "string" ? (
          <ImagePlaceholder
            alt={alt}
            placeholderText={fallback}
            className={className}
          />
        ) : (
          fallback
        )}
      </div>
    );
  }

  // Normal rendering with loading state
  return (
    <div className={containerClasses} style={containerStyle}>
      {/* Main image */}
      {animate ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 10 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <NextImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            sizes={sizes}
            loading={loading}
            quality={quality}
            priority={priority}
            unoptimized={unoptimized}
            onLoadingComplete={() => {
              setIsLoading(false);
              onLoadingComplete?.();
            }}
            onError={() => setHasError(true)}
            className={imageClasses}
            placeholder={blurUp && blurDataURL ? "blur" : undefined}
            blurDataURL={blurDataURL}
            style={{
              objectFit: objectFit || undefined,
              objectPosition: objectPosition?.replace('-', ' ') || undefined,
            }}
          />
        </motion.div>
      ) : (
        <NextImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          sizes={sizes}
          loading={loading}
          quality={quality}
          priority={priority}
          unoptimized={unoptimized}
          onLoadingComplete={() => {
            setIsLoading(false);
            onLoadingComplete?.();
          }}
          onError={() => setHasError(true)}
          className={cn(imageClasses, isLoading && !blurUp && "opacity-0")}
          placeholder={blurUp && blurDataURL ? "blur" : undefined}
          blurDataURL={blurDataURL}
          style={{
            objectFit: objectFit || undefined,
            objectPosition: objectPosition?.replace('-', ' ') || undefined,
          }}
        />
      )}

      {/* Loading placeholder */}
      {isLoading && showLoadingPlaceholder && !blurUp && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary/20">
          <ImagePlaceholder
            alt={`Loading: ${alt}`}
            className={className}
            loading={true}
          />
        </div>
      )}
    </div>
  );
}

export { imageVariants };