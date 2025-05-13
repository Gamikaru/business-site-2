import React from "react";
import { motion } from "framer-motion";

const HomeHeroMeasurement: React.FC = () => {
  return (
    <motion.div
      className="absolute bottom-12 left-12 right-12 hidden md:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      <div className="w-full border-t border-white/30 relative">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`tick-${i}`}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${i * 8.333}%`, transform: 'translateX(-50%)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 + (i * 0.05) }}
          >
            <div className={`w-px bg-white/60 ${i % 3 === 0 ? "h-4" : "h-2"}`}></div>
            {i % 3 === 0 && (
              <span className="text-[10px] font-mono text-white/60 mt-1">
                {i * 10}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HomeHeroMeasurement;
