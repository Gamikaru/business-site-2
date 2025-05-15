"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AccentColors } from "../HomeHeroCTA";

export interface CTAButtonBaseProps {
  ctaLink: string;
  as: "a" | "button";
  accentColors: AccentColors;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  children: React.ReactNode;
  rotateX: any; // from useTransform
  rotateY: any; // from useTransform
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export const CTAButtonBase: React.FC<CTAButtonBaseProps> = ({
  ctaLink,
  as,
  accentColors,
  buttonProps,
  children,
  rotateX,
  rotateY,
  isHovered,
  onHoverStart,
  onHoverEnd
}) => {
  return (
    <motion.div
      className="relative z-10 overflow-hidden perspective-distant transform-3d-preserve"
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ scale: 1.05, z: 20 }}
      whileTap={{ scale: 0.97, z: -10, rotateX: 0, rotateY: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
    >
      {as === "button" ? (
        <motion.button
          type="button"
          onClick={() => (window.location.href = ctaLink)}
          className="block relative pl-8 pr-7 py-4 font-medium text-lg overflow-hidden"
          style={{
            clipPath: "polygon(0 0, 100% 0, 94% 100%, 6% 100%)",
            backgroundColor: accentColors.primary,
            color: "var(--color-text-on-accent)",
            transformStyle: "preserve-3d",
          }}
          {...buttonProps}
        >
          {children}
        </motion.button>
      ) : (
        <Link
          href={ctaLink}
          className="block relative pl-8 pr-7 py-4 font-medium text-lg overflow-hidden"
          style={{
            clipPath: "polygon(0 0, 100% 0, 94% 100%, 6% 100%)",
            backgroundColor: accentColors.primary,
            color: "var(--color-text-on-accent)",
          }}
        >
          {children}
        </Link>
      )}
    </motion.div>
  );
};

export default CTAButtonBase;
