"use client";

import React, { forwardRef, useState } from "react";
import { motion, MotionValue } from "framer-motion";
import { GestureElement } from "@/components/core/Animations";
import { useAnimationPreferences } from "@/components/core/Animations";

interface ImageContainerProps {
  children: React.ReactNode;
  isRevealed: boolean;
  scrollProgress?: MotionValue<number>;
  onMouseMove?: (e: React.MouseEvent) => void;
  imageRotateX?: MotionValue<number> | number;
  imageRotateY?: MotionValue<number> | number;
  imageScale?: MotionValue<number> | number;
}

const ImageContainer = forwardRef<HTMLDivElement, ImageContainerProps>(
  ({
    children,
    isRevealed,
    onMouseMove,
    imageRotateX = 0,
    imageRotateY = 0,
    imageScale = 1,
  }, ref) => {
    const { reducedMotion, shouldAnimate } = useAnimationPreferences();
    const [isHovered, setIsHovered] = useState(false);

    // Animation variants
    const imageVariants = {
      hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        rotateZ: 3,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateZ: 0,
        transition: {
          type: "spring",
          stiffness: 60,
          damping: 20,
          mass: 1,
          delay: 0.3,
        },
      },
    };

    // Simplified variants for reduced motion
    const reducedMotionVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.3 },
      },
    };

    // Select appropriate variants based on user preferences
    const variants = reducedMotion ? reducedMotionVariants : imageVariants;

    // Determine if we should animate or just show the content
    const shouldPerformAnimation = isRevealed && shouldAnimate();

    return (
      <motion.div
        ref={ref}
        initial={shouldPerformAnimation ? "hidden" : "visible"}
        animate="visible" // Always animate to visible
        variants={variants}
        className="relative z-10 ml-[-50px] perspective-effect" // Shifted left to be closer to title
        style={{
          maxWidth: "500px",
          perspective: "1000px",
        }}
        onMouseMove={onMouseMove}
      >
        <GestureElement
          tiltEnabled={!reducedMotion && shouldAnimate()}
          tiltFactor={6}
          scaleOnHover={true}
          scaleAmount={1.02}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          perspective={1000}
        >
          {/* Updated to circular shape with enhanced border effects */}
          <div className="relative overflow-hidden rounded-full shadow-xl">
            {/* Animated accent border */}
            <motion.div
              className="absolute -inset-1 rounded-full z-0"
              animate={{
                background: isHovered
                  ? [
                      "linear-gradient(120deg, var(--color-accent-primary), var(--color-accent-secondary), var(--color-accent-tertiary), var(--color-accent-primary))",
                      "linear-gradient(240deg, var(--color-accent-primary), var(--color-accent-tertiary), var(--color-accent-secondary), var(--color-accent-primary))"
                    ]
                  : "linear-gradient(120deg, var(--color-accent-primary), var(--color-accent-secondary), var(--color-accent-tertiary), var(--color-accent-primary))"
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
            />

            {/* Container for the image with 3D transforms */}
            <motion.div
              className="relative w-full rounded-full z-10 border-4 border-bg-card"
              style={{
                aspectRatio: "1/1", // Ensure perfect circle
                minHeight: "300px",
                transformStyle: "preserve-3d",
                rotateX: !reducedMotion ? imageRotateX : 0,
                rotateY: !reducedMotion ? imageRotateY : 0,
                scale: !reducedMotion ? imageScale : 1,
                overflow: "hidden", // Ensure content doesn't spill outside circle
              }}
            >
              {children}
            </motion.div>
          </div>
        </GestureElement>
      </motion.div>
    );
  }
);

ImageContainer.displayName = "ImageContainer";
export default ImageContainer;
