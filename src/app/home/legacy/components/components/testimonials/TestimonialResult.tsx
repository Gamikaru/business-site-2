"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/core/Animations";
import RichText from "@/components/common/Typography/RichText";

interface TestimonialResultProps {
  result: string;
}

const TestimonialResult: React.FC<TestimonialResultProps> = ({ result }) => {
  return (
    <ScrollReveal
      direction="up"
      delay={0.5}
      className="mt-12 text-center"
    >
      <motion.div
        className="bg-bg-glass backdrop-blur-sm p-6 rounded-lg inline-block relative max-w-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{
          boxShadow: "0 0 20px color-mix(in srgb, var(--color-accent-primary) 20%, transparent)",
        }}
      >
        {/* Technical corner details */}
        <div
          className="absolute top-0 left-0 w-3 h-3"
          style={{
            borderTop: "1px solid var(--color-accent-primary)",
            borderLeft: "1px solid var(--color-accent-primary)"
          }}
        ></div>
        <div
          className="absolute top-0 right-0 w-3 h-3"
          style={{
            borderTop: "1px solid var(--color-accent-primary)",
            borderRight: "1px solid var(--color-accent-primary)"
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-3 h-3"
          style={{
            borderBottom: "1px solid var(--color-accent-primary)",
            borderLeft: "1px solid var(--color-accent-primary)"
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-3 h-3"
          style={{
            borderBottom: "1px solid var(--color-accent-primary)",
            borderRight: "1px solid var(--color-accent-primary)"
          }}
        ></div>

        <div className="relative z-10">
          <p className="text-text-primary italic">
            <span
              className="font-bold inline-block mr-2"
              style={{ color: "var(--color-accent-primary)" }}
            >
              ↑
            </span>{" "}
            <RichText content={result} />
          </p>
        </div>

        {/* Technical data readout */}
        <div
          className="absolute -bottom-1 right-3 transform translate-y-full text-[8px] font-mono hidden md:block"
          style={{ color: "var(--color-accent-tertiary)" }}
        >
          IMPACT/ASSESSMENT
        </div>
      </motion.div>
    </ScrollReveal>
  );
};

export default memo(TestimonialResult);
