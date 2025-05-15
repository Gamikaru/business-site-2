"use client";

import React from "react";
import { motion } from "framer-motion";
import CTATextEffect from "./CTATextEffect";
import { CircuitBoardEffect, EnergyParticles } from "./CTADecoration";
import CTAButtonBase from "./CTAButtonBAse";
import { AccentColors } from "../HomeHeroCTA";

export interface CTAButtonProps {
  initialText: string;
  hoverText: string;
  ctaLink: string;
  accentColors: AccentColors;
  as: "a" | "button";
  isHovered: boolean;
  rotateX: any; // from useTransform
  rotateY: any; // from useTransform
  onHoverStart: () => void;
  onHoverEnd: () => void;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  initialText,
  hoverText,
  ctaLink,
  accentColors,
  as,
  isHovered,
  rotateX,
  rotateY,
  onHoverStart,
  onHoverEnd,
  buttonProps
}) => {
  return (
    <CTAButtonBase
      ctaLink={ctaLink}
      as={as}
      accentColors={accentColors}
      buttonProps={buttonProps}
      rotateX={rotateX}
      rotateY={rotateY}
      isHovered={isHovered}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <ButtonContent
        initialText={initialText}
        hoverText={hoverText}
        isHovered={isHovered}
        accentColors={accentColors}
      />
    </CTAButtonBase>
  );
};

// Inner button content with advanced letter-by-letter text animation
const ButtonContent: React.FC<{
  initialText: string;
  hoverText: string;
  isHovered: boolean;
  accentColors: AccentColors;
}> = ({ initialText, hoverText, isHovered, accentColors }) => {
  return (
    <>
      {/* Button background layers with enhanced effects */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${accentColors.primary}, ${accentColors.brand})`,
          opacity: 0.9,
        }}
      />

      {/* Animated highlight sheen effect */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.35) 50%, transparent 75%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: isHovered ? "200% 200%" : "0% 0%",
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
      />

      {/* Enhanced geometric button inner border */}
      <motion.div
        className="absolute inset-0"
        style={{
          margin: "3px",
          border: "1px solid rgba(255,255,255,0.4)",
          clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)",
        }}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: isHovered ? 0.8 : 0.3 }}
      />

      {/* Advanced circuit board effect */}
      <CircuitBoardEffect accentColors={accentColors} isHovered={isHovered} />

      {/* Energy particles system */}
      <EnergyParticles accentColors={accentColors} energyLevel={isHovered ? 100 : 20} />

      {/* Technical annotations */}
      <div className="absolute top-0 left-0 font-mono text-[6px] px-1 opacity-60">01</div>
      <div className="absolute bottom-0 right-0 font-mono text-[6px] px-1 opacity-60">CTA-1</div>

      {/* Interactive text with letter-by-letter animation */}
      <div className="relative flex items-center justify-between z-10 px-2">
        <CTATextEffect
          initialText={initialText}
          hoverText={hoverText}
          isHovered={isHovered}
        />

        {/* Enhanced arrow icon with animation */}
        <motion.div
          className="ml-3 relative"
          animate={{
            x: isHovered ? 5 : 0,
            rotate: isHovered ? 0 : -45,
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <motion.path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.3, pathOffset: 0.3 }}
              animate={{
                pathLength: isHovered ? 1 : 0.3,
                pathOffset: isHovered ? 0 : 0.3,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Pulse circles around arrow tip */}
            {isHovered && (
              <>
                <motion.circle
                  cx="19"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="1"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{
                    scale: [0.5, 1.5, 0.5],
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                <motion.circle
                  cx="19"
                  cy="12"
                  r="5"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="0.5"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{
                    scale: [0.5, 2, 0.5],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.3,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </>
            )}
          </svg>
        </motion.div>
      </div>

      {/* Pixel noise texture overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay"
        }}
        animate={{ opacity: isHovered ? 0.3 : 0.1 }}
      />

      {/* Scan line effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-x-0 h-[2px] bg-white/30 pointer-events-none mix-blend-overlay"
          initial={{ top: '-5%', opacity: 0 }}
          animate={{
            top: ['0%', '100%'],
            opacity: [0, 0.3, 0.5, 0.3, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            times: [0, 0.2, 0.5, 0.8, 1]
          }}
        />
      )}
    </>
  );
};

export default CTAButton;
