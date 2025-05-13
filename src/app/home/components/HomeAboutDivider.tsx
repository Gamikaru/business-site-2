import React from "react";
import { motion } from "framer-motion";
import { Divider } from "@/components/common/Divider";

const HomeAboutDivider: React.FC = () => {
  return (
    <div className="relative">
      <Divider
        type="plane"
        height={80}
        bgBottom="var(--color-bg-secondary)"
        className="z-10"
      />

      {/* Technical grid overlay on divider */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 left-0 right-0 h-[80px] w-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
          <motion.line
            x1="25" y1="0" x2="75" y2="100"
            stroke="var(--color-accent-primary)"
            strokeWidth="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
          />
          <motion.line
            x1="70" y1="0" x2="30" y2="100"
            stroke="var(--color-brand-primary)"
            strokeWidth="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: 0.4 }}
          />

          <motion.text
            x="80" y="30"
            fill="var(--color-accent-oceanic)"
            fontSize="3"
            fontFamily="monospace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 1.2 }}
          >
            NEXT/SECTION
          </motion.text>
        </svg>
      </div>
    </div>
  );
};

export default HomeAboutDivider;
