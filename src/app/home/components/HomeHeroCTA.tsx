// src/app/home/components/HomeHeroCTA.tsx
"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import CTAButton from "./cta/CTAButton";
import CTADecoration from "./cta/CTADecoration";

export interface AccentColors {
  primary: string;
  secondary: string;
  tertiary: string;
  warm?: string;
  contrast?: string;
  oceanic?: string;
  cosmic?: string;
  brand: string;
}

export interface HomeHeroCTAProps {
  initialText?: string;
  hoverText?: string;
  ctaLink: string;
  accentColors: AccentColors;
  as?: "a" | "button";
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  heroAnimationComplete?: boolean;
}

const HomeHeroCTA: React.FC<HomeHeroCTAProps> = ({
  initialText = "Curious?",
  hoverText = "Let's Talk",
  ctaLink,
  accentColors,
  as = "a",
  buttonProps,
  heroAnimationComplete = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const glowControls = useAnimation();
  const [energyLevel, setEnergyLevel] = useState(0);

  // Track the mouse position for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Create derived motion values for parallax effects
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  useEffect(() => {
    if (heroAnimationComplete && !isAnimated) {
      const timer = setTimeout(() => {
        setIsAnimated(true);
        // Start ambient energy pulse
        setEnergyLevel(20);
        glowControls.start({
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.05, 1],
          filter: ["blur(8px)", "blur(12px)", "blur(8px)"],
          transition: { duration: 5, repeat: Infinity, repeatType: "reverse" }
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [heroAnimationComplete, isAnimated, glowControls]);

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleHoverStart = () => {
    setIsHovered(true);
    setEnergyLevel(100);

    // Intensify all effects
    glowControls.start({
      opacity: 0.9,
      scale: 1.12,
      filter: "blur(15px)",
      transition: { duration: 0.5, ease: "easeOut" }
    });
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    setEnergyLevel(20);

    // Return to ambient animations
    glowControls.start({
      opacity: [0.4, 0.7, 0.4],
      scale: [1, 1.05, 1],
      filter: ["blur(8px)", "blur(12px)", "blur(8px)"],
      transition: { duration: 5, repeat: Infinity, repeatType: "reverse" }
    });
  };

  return (
    <motion.div
      ref={buttonRef}
      variants={{
        initial: { opacity: 0, y: 30, x: 15 },
        animate: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.3,
          },
        }
      }}
      initial="initial"
      animate={isAnimated ? "animate" : "initial"}
      className="relative"
      onMouseMove={handleMouseMove}
    >
      <div className="relative perspective-distant">
        {/* Decorative elements */}
        <CTADecoration
          accentColors={accentColors}
          isAnimated={isAnimated}
          isHovered={isHovered}
          energyLevel={energyLevel}
          glowControls={glowControls}
        />

        {/* Main CTA button */}
        <CTAButton
          initialText={initialText}
          hoverText={hoverText}
          ctaLink={ctaLink}
          accentColors={accentColors}
          as={as}
          isHovered={isHovered}
          rotateX={rotateX}
          rotateY={rotateY}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          buttonProps={buttonProps}
        />
      </div>
    </motion.div>
  );
};

export default memo(HomeHeroCTA);