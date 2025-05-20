"use client";

import React, { memo, useState, useRef, useEffect } from "react";
import {
  MotionValue,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useAnimationPreferences } from "@/components/core/Animations";
import ImageContainer from "./image/ImageContainer";
import ImageDisplay from "./image/ImageDisplay";
import ImageOverlays from "./image/ImageOverlays";
import ImageMetadata from "./image/ImageMetadata";
import ImageDecorations from "./image/ImageDecorations";

interface AboutImageProps {
  imageSrc: string;
  imageAlt: string;
  isRevealed: boolean;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
  scrollProgress?: MotionValue<number>;
}

const AboutImage: React.FC<AboutImageProps> = ({
  imageSrc,
  imageAlt,
  isRevealed,
  accentColors,
  scrollProgress = useSpring(0),
}) => {
  const { reducedMotion } = useAnimationPreferences();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // References for positioning
  const containerRef = useRef<HTMLDivElement>(null);

  // For mouse position tracking and hover effects
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // Dynamic measurement values
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    ratio: 0,
  });

  // Motion values for lighting effect
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(50);

  // Transform for highlight position
  const highlightX = useTransform(lightX, [0, 100], ["0%", "100%"]);
  const highlightY = useTransform(lightY, [0, 100], ["0%", "100%"]);

  // Transform values based on scroll for parallax effects
  const imageScale = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    [0.98, 1.03, 0.99]
  );
  const imageRotateX = useTransform(scrollProgress, [0, 0.5, 1], [-2, 0, 2]);
  const imageRotateY = useTransform(scrollProgress, [0, 0.5, 1], [2, 0, -2]);

  // Image metadata
  const [metadata, setMetadata] = useState({
    dimensions: "0×0",
    format: "JPEG",
    size: "0 KB",
    loaded: 0,
  });

  // Handle mouse move for lighting effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    lightX.set(x);
    lightY.set(y);
    setMousePosition({ x: x / 100, y: y / 100 });
  };

  // Calculate image dimensions for technical display
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.offsetWidth;
        const height = container.offsetHeight;

        setDimensions({
          width,
          height,
          ratio: width / height,
        });

        // Update metadata
        setMetadata((prev) => ({
          ...prev,
          dimensions: `${Math.round(width)}×${Math.round(height)}`,
        }));
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, [imageLoaded]);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
    updateImageMetadata();
  };

  // Handle image error
  const handleImageError = () => {
    console.error("Failed to load image:", imageSrc);
    setImageError(true);
    setImageLoaded(true);
  };

  // Update image metadata
  const updateImageMetadata = () => {
    const format = imageSrc.toLowerCase().endsWith(".png")
      ? "PNG"
      : imageSrc.toLowerCase().endsWith(".svg")
        ? "SVG"
        : imageSrc.toLowerCase().endsWith(".webp")
          ? "WEBP"
          : "JPEG";

    // Estimate file size based on dimensions (very rough approximation)
    const estimatedSize = Math.round((dimensions.width * dimensions.height * 3) / 1024); // KB

    setMetadata({
      dimensions: metadata.dimensions,
      format,
      size: `~${estimatedSize} KB`,
      loaded: 100,
    });
  };

  return (
    <ImageContainer
      ref={containerRef}
      isRevealed={isRevealed}
      scrollProgress={scrollProgress}
      onMouseMove={handleMouseMove}
      imageRotateX={imageRotateX}
      imageRotateY={imageRotateY}
      imageScale={imageScale}
    >
      <ImageDecorations
        isHovered={isHovered}
        accentColors={accentColors}
      />

      <ImageDisplay
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        isLoaded={imageLoaded}
        isError={imageError}
        accentColors={accentColors}
      />

      <ImageMetadata
        isHovered={isHovered}
        imageSrc={imageSrc}
        metadata={metadata}
        dimensions={dimensions}
        accentColors={accentColors}
        mousePosition={mousePosition}
      />
    </ImageContainer>
  );
};

export default memo(AboutImage);
