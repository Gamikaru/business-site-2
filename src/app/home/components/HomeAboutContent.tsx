import React from "react";
import { motion } from "framer-motion";
import { TextReveal, ScrollReveal } from "@/components/core/Animations";
import { Button } from "@/components/common/Button";
import { Heading, Text } from "@/components/common/Typography";
import RichText from "@/components/common/Typography/RichText";

interface HomeAboutContentProps {
  heading: string;
  content: React.ReactNode; // Accept ReactNode for rich text
  ctaText: string;
  ctaLink: string;
  isHeadingInView: boolean;
  techValues: {
    sectionRatio: number;
    contentWidth: number;
    imageScale: string;
  };
  mousePosition: {
    x: number;
    y: number;
  };
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

const HomeAboutContent: React.FC<HomeAboutContentProps> = ({
  heading,
  content,
  ctaText,
  ctaLink,
  isHeadingInView,
  techValues,
  mousePosition,
  accentColors
}) => {
  return (
    <div>
      {/* Technical measurement indicator */}
      <div className="flex items-center mb-2 text-xs font-mono">
        <div
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: accentColors.primary }}
        ></div>
        <span
          className="text-text-tertiary"
          style={{ color: accentColors.secondary }}
        >
          DATA/{techValues.sectionRatio}% WIDTH/{techValues.contentWidth}
        </span>
      </div>

      {/* Section heading with enhanced styling */}
      <TextReveal
        direction="up"
        delay={0.1}
        splitBy="words"
        staggerChildren={true}
        className="mb-6"
      >
        <Heading
          level={2}
          className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl relative inline-block"
        >
          {heading}
          <motion.div
            className="absolute -bottom-3 left-0 right-0 h-[3px]"
            initial={{ width: 0 }}
            animate={{ width: isHeadingInView ? "100%" : "0%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div
              className="h-full"
              style={{
                background: `linear-gradient(to right, transparent, ${accentColors.primary}, transparent)`
              }}
            ></div>
          </motion.div>
        </Heading>
      </TextReveal>

      {/* Content with rich text formatting */}
      <ScrollReveal direction="up" delay={0.3} className="mb-8">
        <div className="relative">
          {/* Enhanced decorative elements */}
          <div
            className="absolute -left-4 top-0 h-full w-1"
            style={{ background: `linear-gradient(to bottom, transparent, ${accentColors.secondary}, transparent)` }}
          ></div>

          {/* Render rich text content */}
          <div className="text-lg leading-relaxed text-text-primary">
            {content}
          </div>
        </div>
      </ScrollReveal>

      {/* Enhanced CTA button */}
      <ScrollReveal direction="up" delay={0.5}>
        <div className="relative group">
          {/* Button glow effect */}
          <div
            className="absolute inset-0 -m-1 rounded-lg opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, ${accentColors.secondary} 0%, transparent 70%)`
            }}
          ></div>

          <Button
            intent="outline"
            size="lg"
            href={ctaLink}
            className="relative z-10"
            style={{ borderColor: accentColors.primary }}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1L15 8L8 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 8H1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            iconPosition="right"
          >
            {ctaText}
          </Button>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default HomeAboutContent;
