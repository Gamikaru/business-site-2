import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HomeHeroSubheadlineProps {
  subheadline: string;
  isSubheadlineInView: boolean;
  randomData: {
    systemLoad: number;
  };
}

const HomeHeroSubheadline: React.FC<HomeHeroSubheadlineProps> = ({
  subheadline,
  isSubheadlineInView,
  randomData,
}) => {
  return (
    <AnimatePresence>
      {isSubheadlineInView && (
        <motion.div
          className="bg-black/60 backdrop-blur-md p-6 border-l-[6px] border-brand-primary relative"
          initial={{ opacity: 0, x: 30, skewX: -5 }}
          animate={{ opacity: 1, x: 0, skewX: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          {/* Distorted subheadline text */}
          <motion.div className="overflow-hidden">
            <motion.p
              className="text-xl md:text-3xl font-light text-white leading-tight"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {subheadline}
            </motion.p>
          </motion.div>

          {/* Technical measurement markers */}
          <div className="absolute -top-7 left-6 flex text-[10px] text-accent-primary font-mono">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={`top-marker-${i}`}
                className="px-1 border-l border-t border-accent-primary pt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
              >
                {`${i+1}`.padStart(2, '0')}
              </motion.span>
            ))}
            <motion.span
              className="px-1 border-l border-t border-r border-accent-primary pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              06
            </motion.span>
          </div>

          {/* Data visualization element */}
          <div className="absolute -right-4 -bottom-4 w-20 h-20 hidden md:block">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Radial data visualization */}
              <motion.circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="var(--color-accent-primary)"
                strokeWidth="1"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * randomData.systemLoad / 100) }}
                transition={{ duration: 1 }}
              />
              <motion.text
                x="50" y="53"
                textAnchor="middle"
                fill="var(--color-accent-primary)"
                fontSize="12"
                fontFamily="monospace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {randomData.systemLoad}%
              </motion.text>
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeHeroSubheadline;
