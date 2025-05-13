import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/common/Button";

interface HomeHeroCTAProps {
  ctaText: string;
  ctaLink: string;
  accentColors?: {
    primary: string;
    secondary: string;
    tertiary: string;
    brand: string;
    oceanic: string;
  };
}

const HomeHeroCTA: React.FC<HomeHeroCTAProps> = ({
  ctaText,
  ctaLink,
  accentColors
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.6 }}
      className="flex flex-col gap-4 transform -rotate-1"
    >
      {/* Extremely styled CTA button */}
      <div className="relative">
        {/* Button technical frame */}
        <motion.div
          className="absolute -left-3 -top-3 w-12 h-12 border-l-2 border-t-2"
          style={{ borderColor: "rgba(255, 255, 255, 0.7)" }}
          initial={{ opacity: 0, rotate: -20 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 1.8 }}
        />

        <Button
          intent="gradient"
          size="lg"
          href={ctaLink}
          className="text-lg group relative overflow-hidden border-2 transition-all z-10"
          style={{ borderColor: accentColors?.secondary || "var(--color-brand-primary)" }}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L18 10L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 10H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          iconPosition="right"
        >
          {/* Text with glitch hover effect */}
          <span className="relative z-10 glitch-hover">{ctaText}</span>
          <span
            className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            style={{ background: accentColors?.secondary || "var(--color-accent-contrast)" }}
          ></span>
        </Button>

        {/* Cross target indicator */}
        <motion.div
          className="absolute -right-4 -bottom-3 pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center">
            <div
              className="w-6 h-px"
              style={{ backgroundColor: accentColors?.tertiary || "var(--color-accent-primary)" }}
            ></div>
            <div
              className="w-px h-6"
              style={{ backgroundColor: accentColors?.tertiary || "var(--color-accent-primary)" }}
            ></div>
            <div className="absolute h-1 w-1 bg-white rounded-full"></div>
            <div
              className="absolute top-3 text-[8px] font-mono"
              style={{ color: accentColors?.tertiary || "var(--color-accent-primary)" }}
            >01</div>
          </div>
        </motion.div>
      </div>

      {/* Terminal-style readout */}
      <motion.div
        className="flex items-center gap-2 text-sm text-white/70 font-mono ml-4 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <span
          className="h-4 w-px animate-pulse"
          style={{ backgroundColor: accentColors?.secondary || "var(--color-brand-primary)" }}
        ></span>
        <span>CMD://</span>
        <span style={{ color: accentColors?.secondary || "var(--color-brand-primary)" }}>initialize_project</span>
        <span className="text-xs bg-black/50 px-1 py-0.5 ml-auto">
          READY
        </span>
      </motion.div>
    </motion.div>
  );
};

export default HomeHeroCTA;
