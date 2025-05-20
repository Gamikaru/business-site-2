"use client";

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useAnimationPreferences } from "@/components/core/Animations";
import { cn } from "@/utils/classNames";

interface AboutContentProps {
  content: string;
  isRevealed: boolean;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
}

const AboutContent: React.FC<AboutContentProps> = ({
  content,
  isRevealed,
  accentColors,
}) => {
  const { reducedMotion, shouldAnimate } = useAnimationPreferences();

  // Parse content into paragraphs and handles HTML tags
  const paragraphs = useMemo(() => {
    // Split content by <p> tags or by double newlines
    return content
      .split(/<p>|<\/p>/)
      .filter((p) => p.trim())
      .map((p) => p.trim());
  }, [content]);

  // Animation variants for paragraph reveals
  const paragraphVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.19, 1, 0.22, 1],
        delay: 0.1 + i * 0.1, // Stagger paragraphs
      },
    }),
  };

  // Simplified variants for reduced motion
  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: 0.05 * i,
      },
    }),
  };

  // Define styles for text emphasis
  const textStyles = {
    "text-emphasis": "font-medium text-primary",
    "text-emphasis accent-secondary": cn("font-medium", {
      "bg-clip-text text-transparent bg-gradient-to-r from-accent-secondary to-accent-secondary/90":
        !reducedMotion,
      "text-accent-secondary": reducedMotion,
    }),
    "text-emphasis accent-warm": cn("font-medium", {
      "bg-clip-text text-transparent bg-gradient-to-r from-accent-warm to-accent-warm/90":
        !reducedMotion,
      "text-accent-warm": reducedMotion,
    }),
    "text-emphasis accent-contrast": cn("font-medium", {
      "bg-clip-text text-transparent bg-gradient-to-r from-accent-contrast to-accent-contrast/90":
        !reducedMotion,
      "text-accent-contrast": reducedMotion,
    }),
    "underline-accent": `relative after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-[3px] after:bg-accent-primary/30 after:rounded-full`,
    "underline-warm": `relative after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-[3px] after:bg-accent-warm/30 after:rounded-full`,
  };

  // Select appropriate variants based on user preferences
  const variants = reducedMotion ? reducedMotionVariants : paragraphVariants;

  // Determine if we should animate or just show the content
  const shouldPerformAnimation = isRevealed && shouldAnimate();

  return (
    <div className="text-lg md:text-xl text-text-secondary leading-relaxed space-y-4 relative">
      {/* Technical measurement marker */}
      <motion.div
        className="absolute -left-8 top-0 h-full w-4 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="h-full w-px bg-border-primary opacity-50"></div>
        <div className="absolute top-0 left-0 w-2 h-px bg-border-primary"></div>
        <div className="absolute top-1/3 left-0 w-3 h-px bg-border-primary"></div>
        <div className="absolute top-2/3 left-0 w-3 h-px bg-border-primary"></div>
        <div className="absolute bottom-0 left-0 w-2 h-px bg-border-primary"></div>
      </motion.div>

      {paragraphs.map((paragraph, index) => (
        <motion.div
          key={index}
          custom={index}
          initial={shouldPerformAnimation ? "hidden" : "visible"}
          animate="visible" // Always animate to visible to ensure content shows
          variants={variants}
          className={cn(
            index === 0 ? "text-xl md:text-2xl mb-6" : "",
            "text-text-primary relative" // Ensure text is visible regardless of theme
          )}
        >
          {/* First paragraph gets special styling */}
          {index === 0 && (
            <motion.div
              className="absolute -left-3 top-2 h-full w-1"
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                background: `linear-gradient(to bottom, ${accentColors.primary}, transparent)`,
                borderRadius: "4px",
              }}
            />
          )}

          {/* Content with HTML preserved */}
          <div
            className="relative"
            dangerouslySetInnerHTML={{
              __html: paragraph,
            }}
          />
        </motion.div>
      ))}

      {/* Decorative element */}
      <motion.div
        className="absolute -right-4 bottom-0 w-20 h-px bg-accent-secondary/30"
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      />
    </div>
  );
};

export default memo(AboutContent);
