import React from "react";
import { motion } from "framer-motion";
import { Divider } from "@/components/common/Divider";

interface HomeHeroDividerProps {
  accentColors?: {
    primary: string;
    secondary: string;
    tertiary: string;
    brand: string;
    oceanic: string;
  };
}

const HomeHeroDivider: React.FC<HomeHeroDividerProps> = ({ accentColors }) => {
  return (
    <div className="relative">
      <Divider
        type="plane"
        height={160}
        invert={true}
        bgBottom="var(--color-bg-secondary)"
        className="z-10"
      />

      {/* Technical grid overlay on divider */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Multiple crossing lines for increased visual complexity */}
        <svg className="absolute bottom-0 left-0 right-0 h-[160px] w-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
          <motion.line
            x1="0" y1="20" x2="100" y2="80"
            stroke={accentColors?.secondary || "var(--color-accent-primary)"}
            strokeWidth="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
          />
          <motion.line
            x1="0" y1="50" x2="100" y2="30"
            stroke={accentColors?.oceanic || "var(--color-accent-oceanic)"}
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          />
          <motion.line
            x1="100" y1="10" x2="0" y2="90"
            stroke={accentColors?.tertiary || "var(--color-brand-primary)"}
            strokeWidth="0.15"
            strokeDasharray="4 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, delay: 0.3 }}
          />

          {/* Technical measurement indicators */}
          <motion.text
            x="85" y="50"
            fill={accentColors?.oceanic || "var(--color-accent-oceanic)"}
            fontSize="3"
            fontFamily="monospace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 2 }}
          >
            GRID/SECT.03
          </motion.text>
        </svg>
      </div>
    </div>
  );
};

export default HomeHeroDivider;
