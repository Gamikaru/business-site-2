"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { TextReveal } from "@/components/core/Animations";
import RichText from "@/components/common/Typography/RichText";

interface TestimonialQuoteProps {
  quote: string;
  highlightedText: number | null;
  isVisible: boolean;
  segments: string[];
}

const TestimonialQuote: React.FC<TestimonialQuoteProps> = ({
  quote,
  highlightedText,
  isVisible,
  segments
}) => {
  return (
    <div className="relative">
      <TextReveal
        splitBy="words"
        staggerChildren={true}
        direction="up"
        className="mb-8 text-center"
      >
        <div className="text-xl md:text-2xl lg:text-3xl font-heading italic leading-relaxed">
          <span
            className="text-4xl"
            style={{ color: "var(--color-accent-primary)" }}
          >&quot;</span>
          {segments.map((segment, index) => (
            <React.Fragment key={index}>
              <motion.span
                className={`inline-block whitespace-normal preserve-whitespace ${
                  highlightedText === index
                    ? "font-semibold word-spacing-wide"
                    : "word-spacing-normal"
                }`}
                style={{
                  color: highlightedText === index
                    ? "var(--color-accent-primary)"
                    : "var(--color-primary-text)"
                }}
                animate={{
                  scale: highlightedText === index ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {segment}
              </motion.span>
              {/* Explicit space between segments */}
              {index < segments.length - 1 && (
                <span className="inline-block whitespace-pre"> </span>
              )}
            </React.Fragment>
          ))}
          <span
            className="text-4xl"
            style={{ color: "var(--color-accent-primary)" }}
          >&quot;</span>
        </div>
      </TextReveal>

      {/* Animated underline */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-px"
        style={{ background: "var(--color-accent-primary)" }}
        initial={{ width: 0 }}
        animate={{ width: isVisible ? "60%" : "0%" }}
        transition={{ duration: 1, delay: 0.5 }}
      ></motion.div>
    </div>
  );
};

export default memo(TestimonialQuote);
