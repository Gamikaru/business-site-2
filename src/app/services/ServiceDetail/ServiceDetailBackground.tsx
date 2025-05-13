// ServiceDetailBackground.tsx
import React from "react";
import { motion } from "framer-motion";

const ServiceDetailBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 opacity-[0.04] bg-dots-dense"></div>

      {/* Technical vertical measurement lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <motion.line
            key={`grid-v-${i}`}
            x1={`${i * 10}%`}
            y1="0"
            x2={`${i * 10}%`}
            y2="100%"
            stroke="var(--color-accent-oceanic)"
            strokeWidth={i % 5 === 0 ? "0.5" : "0.2"}
            strokeOpacity={i % 5 === 0 ? "0.15" : "0.1"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.2 + i * 0.05 }}
          />
        ))}
      </svg>
    </div>
  );
};

export default ServiceDetailBackground;
