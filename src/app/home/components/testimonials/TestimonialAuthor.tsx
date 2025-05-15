"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/core/Animations";

interface TestimonialAuthorProps {
  author: string;
  role: string;
}

const TestimonialAuthor: React.FC<TestimonialAuthorProps> = ({
  author,
  role
}) => {
  return (
    <ScrollReveal
      direction="up"
      delay={0.4}
      className="text-center mt-10 relative"
    >
      <div className="relative inline-block">
        <p
          className="text-lg font-medium"
          style={{ color: "var(--color-accent-primary)" }}
        >
          — {author}, {role}
        </p>

        {/* Technical measurement lines */}
        <motion.div
          className="absolute -left-10 top-1/2 -translate-y-1/2 hidden md:block"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ transformOrigin: "right" }}
        >
          <svg width="40" height="2" viewBox="0 0 40 2">
            <rect
              width="40"
              height="2"
              fill="var(--color-accent-primary)"
              opacity="0.3"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute -right-10 top-1/2 -translate-y-1/2 hidden md:block"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ transformOrigin: "left" }}
        >
          <svg width="40" height="2" viewBox="0 0 40 2">
            <rect
              width="40"
              height="2"
              fill="var(--color-accent-primary)"
              opacity="0.3"
            />
          </svg>
        </motion.div>
      </div>
    </ScrollReveal>
  );
};

export default memo(TestimonialAuthor);
