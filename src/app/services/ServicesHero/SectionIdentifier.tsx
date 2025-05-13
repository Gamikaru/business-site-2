// SectionIdentifier.tsx
import React from "react";
import { motion } from "framer-motion";

const SectionIdentifier: React.FC = () => {
  return (
    <div className="absolute top-8 left-8 md:top-12 md:left-12 z-30">
      <motion.div
        className="flex items-center space-x-2 opacity-70"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="h-3 w-3 bg-brand-primary" />
        <span className="font-mono text-xs uppercase tracking-widest">
          Services
        </span>
      </motion.div>
    </div>
  );
};

export default SectionIdentifier;
