"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

interface TechValues {
  confidenceScore: number;
  testimonialDimensions: {
    width: number;
    height: number;
  };
  alignmentFactor: string;
}

interface TestimonialMeasurementsProps {
  techValues: TechValues;
}

const TestimonialMeasurements: React.FC<TestimonialMeasurementsProps> = ({
  techValues,
}) => {
  return (
    <>
      {/* Technical measurement frame */}
      <motion.div
        className="absolute -inset-6 hidden md:block"
        style={{ border: "1px solid color-mix(in srgb, var(--color-accent-oceanic) 30%, transparent)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {/* Corner measurement markers */}
        <div
          className="absolute top-0 left-0 w-3 h-3"
          style={{
            borderTop: "1px solid color-mix(in srgb, var(--color-accent-oceanic) 80%, transparent)",
            borderLeft: "1px solid color-mix(in srgb, var(--color-accent-oceanic) 80%, transparent)"
          }}
        ></div>
        <div
          className="absolute top-0 right-0 w-3 h-3"
          style={{
            borderTop: "1px solid color-mix(in srgb, var(--color-accent-oceanic) 80%, transparent)",
            borderRight: "1px solid color-mix(in srgb, var(--color-accent-oceanic) 80%, transparent)"
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-3 h-3"
          style={{
            borderBottom: "1px solid color-mix(in srgb, var(--color-accent-oceanic) 80%, transparent)",
            borderLeft: "1px solid color-mix(in srgb, var(--color-accent-oceanic) 80%, transparent)"
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-3 h-3"
          style={{
            borderBottom: "1px solid color-mix(in srgb, var(--color-accent-oceanic) 80%, transparent)",
            borderRight: "1px solid color-mix(in srgb, var(--color-accent-oceanic) 80%, transparent)"
          }}
        ></div>

        {/* Dimension measurements */}
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono"
          style={{ color: "var(--color-accent-oceanic)" }}
        >
          W:{techValues.testimonialDimensions.width}px
        </div>
        <div
          className="absolute -left-6 top-1/2 -translate-y-1/2 text-[10px] font-mono transform -rotate-90"
          style={{ color: "var(--color-accent-oceanic)" }}
        >
          H:{techValues.testimonialDimensions.height}px
        </div>
        <div
          className="absolute -top-6 right-0 text-[10px] font-mono"
          style={{ color: "var(--color-accent-oceanic)" }}
        >
          ALIGN:{techValues.alignmentFactor}
        </div>
      </motion.div>

      {/* Quote verification badge */}
      <motion.div
        className="absolute -left-10 top-4 hidden md:block"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div
          className="bg-bg-glass backdrop-blur-sm p-2 rounded-full"
          style={{ border: "1px solid color-mix(in srgb, var(--color-accent-primary) 30%, transparent)" }}
        >
          <div className="relative">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent-primary)"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div
              className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full animate-pulse"
              style={{ background: "var(--color-accent-primary)" }}
            ></div>
          </div>
        </div>
        <div
          className="text-[10px] font-mono mt-1 text-center"
          style={{ color: "var(--color-accent-primary)" }}
        >
          VERIFIED
        </div>
      </motion.div>

      {/* Confidence score indicator */}
      <motion.div
        className="absolute -right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <div
          className="h-32 w-4 bg-bg-glass backdrop-blur-sm rounded-full overflow-hidden"
          style={{ border: "1px solid color-mix(in srgb, var(--color-accent-oceanic) 30%, transparent)" }}
        >
          <motion.div
            className="w-full rounded-full"
            style={{ background: "var(--color-accent-primary)" }}
            initial={{ height: 0 }}
            animate={{ height: `${techValues.confidenceScore}%` }}
            transition={{ duration: 1, delay: 1.5 }}
          ></motion.div>
        </div>
        <div
          className="text-[10px] font-mono mt-2"
          style={{ color: "var(--color-accent-oceanic)" }}
        >
          CONF:{techValues.confidenceScore}%
        </div>
      </motion.div>
    </>
  );
};

export default memo(TestimonialMeasurements);
