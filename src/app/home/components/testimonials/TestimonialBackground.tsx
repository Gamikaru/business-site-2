"use client";

import React, { memo } from "react";
import { motion, MotionValue } from "framer-motion";

interface TestimonialBackgroundProps {
  backgroundY: MotionValue<string>;
  opacityWave: MotionValue<number>;
}

const TestimonialBackground: React.FC<TestimonialBackgroundProps> = ({
  backgroundY,
  opacityWave,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Animated wave background patterns */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: backgroundY,
          opacity: opacityWave,
        }}
      >
        {/* Multiple wave layers with animation */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute inset-0"
        >
          <motion.path
            d="M0 89L48 97.2C96 105.3 192 121.7 288 130.3C384 139 480 139 576 147.2C672 155.3 768 171.7 864 171.8C960 172 1056 156 1152 147.2C1248 138.3 1344 138.7 1392 139L1440 139L1440 401L1392 401C1344 401 1248 401 1152 401C1056 401 960 401 864 401C768 401 672 401 576 401C480 401 384 401 288 401C192 401 96 401 48 401L0 401L0 89Z"
            fill="var(--wave-accent-1)"
            opacity="0.25"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.25 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.path
            d="M0 209L48 201.2C96 193.3 192 177.7 288 168.8C384 160 480 160 576 168.5C672 177 768 193 864 209.2C960 225.3 1056 241.7 1152 250.7C1248 259.7 1344 260.3 1392 260.7L1440 261L1440 401L1392 401C1344 401 1248 401 1152 401C1056 401 960 401 864 401C768 401 672 401 576 401C480 401 384 401 288 401C192 401 96 401 48 401L0 401L0 209Z"
            fill="var(--wave-accent-2)"
            opacity="0.15"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.15 }}
            transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
          />
        </svg>

        {/* Technical measurement grid overlay */}
        <svg
          className="absolute inset-0 opacity-5"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          {/* Horizontal lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.line
              key={`h-${i}`}
              x1="0"
              y1={`${i * 10}%`}
              x2="100%"
              y2={`${i * 10}%`}
              stroke="var(--color-accent-oceanic)"
              strokeWidth={i % 5 === 0 ? "0.5" : "0.2"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 + i * 0.05 }}
            />
          ))}

          {/* Vertical lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.line
              key={`v-${i}`}
              x1={`${i * 10}%`}
              y1="0"
              x2={`${i * 10}%`}
              y2="100%"
              stroke="var(--color-accent-oceanic)"
              strokeWidth={i % 5 === 0 ? "0.5" : "0.2"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 + i * 0.05 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Technical dots pattern */}
      <div className="absolute inset-0 opacity-10 bg-dots-dense"></div>
    </div>
  );
};

export default memo(TestimonialBackground);
