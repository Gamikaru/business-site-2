// src/app/home/components/HomeHeroCTA.tsx
"use client";

import React, { memo } from "react";
import CTAButton from "./cta/CTAButton";

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
  ctaLink,
  accentColors,
  as = "a",
}) => {
  return (
    <div className="relative">
      <CTAButton
        ctaLink={ctaLink}
        as={as}
        accentColors={accentColors}
      />
    </div>
  );
};

export default memo(HomeHeroCTA);