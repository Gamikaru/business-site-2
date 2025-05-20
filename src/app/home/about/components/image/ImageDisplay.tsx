"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ImageDisplayProps {
  imageSrc: string;
  imageAlt: string;
  onLoad: () => void;
  onError: () => void;
  isLoaded: boolean;
  isError: boolean;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
}

const ImageDisplay = ({
  imageSrc,
  imageAlt,
  onLoad,
  onError,
  isLoaded,
  isError,
  accentColors,
}: ImageDisplayProps) => {
  // Properly handle the image path
  const imageSource =
    imageSrc.startsWith("http") || imageSrc.startsWith("/")
      ? imageSrc
      : `/${imageSrc}`;

  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <>
      {/* Placeholder/loading state - made circular */}
      <div
        className="absolute inset-0 bg-bg-subtle flex items-center justify-center z-10 rounded-full"
        style={{ opacity: isLoaded ? 0 : 1 }}
      >
        <div className="animate-pulse rounded-full bg-bg-card/50 w-full h-full"></div>

        {/* Loading progress indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-16 h-16">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-border-subtle"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke={accentColors.primary}
                strokeWidth="4"
                fill="none"
                strokeDasharray="251"
                strokeDashoffset="251"
                className="text-accent-primary"
                animate={{ strokeDashoffset: [251, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
          </div>
          <div className="text-xs font-mono mt-2 text-text-secondary">
            LOADING IMAGE
          </div>
        </div>
      </div>

      {/* Error state - made circular */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-card/50 border border-dashed border-error rounded-full p-4 text-text-secondary z-10">
          <div className="text-center">
            <p>Image could not be loaded</p>
            <p className="text-xs mt-2 opacity-70">
              Source: {imageSource}
            </p>
          </div>
        </div>
      )}

      {/* The actual image - with circular object-fit */}
      {!isError && (
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            ref={imageRef}
            src={imageSource}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
            onLoad={onLoad}
            onError={onError}
          />
        </div>
      )}
    </>
  );
};

export default ImageDisplay;
