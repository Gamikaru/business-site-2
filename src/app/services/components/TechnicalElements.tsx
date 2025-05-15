"use client";

import React from "react";
import { motion } from "framer-motion";
import { TickStrip } from "@/components/common/Divider";
import { BlueprintCorner } from "@/components/common/VisualInterest";

interface TechDataDisplay {
  density: number;
  renderQuality: number;
  protocol: string;
}

interface TechnicalElementsProps {
  isHeaderInView: boolean;
  techData: TechDataDisplay;
}

const TechnicalElements: React.FC<TechnicalElementsProps> = ({
  isHeaderInView,
  techData,
}) => {
  return (
    <>
      {/* Measurement lines */}
      <div className="absolute left-0 right-0 top-16 opacity-40">
        <TickStrip
          height={16}
          segments={21}
          labelEvery={5}
          darkLabels={true}
          glitchEffect={true}
        />
      </div>

      {/* Grid overlay with reduced opacity */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-[0.03] pointer-events-none" />

      {/* Blueprint corners */}
      <div className="absolute top-0 left-0 text-accent-primary/30 pointer-events-none">
        <BlueprintCorner size={50} />
      </div>
      <div className="absolute top-0 right-0 rotate-90 text-accent-primary/30 pointer-events-none">
        <BlueprintCorner size={50} />
      </div>
      <div className="absolute bottom-0 left-0 -rotate-90 text-accent-primary/30 pointer-events-none">
        <BlueprintCorner size={50} />
      </div>
      <div className="absolute bottom-0 right-0 rotate-180 text-accent-primary/30 pointer-events-none">
        <BlueprintCorner size={50} />
      </div>

      {/* Technical data display */}
      <motion.div
        className="absolute top-4 left-4 flex items-center gap-2 text-xs font-mono text-accent-primary/80"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isHeaderInView ? 1 : 0, x: isHeaderInView ? 0 : -20 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.div
          className="h-1.5 w-1.5 rounded-full bg-accent-primary"
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <span>GRID/{techData.density} QUAL/{techData.renderQuality}</span>
      </motion.div>

      <motion.div
        className="absolute top-4 right-4 text-xs font-mono text-accent-primary/80 flex items-center gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHeaderInView ? 1 : 0, x: isHeaderInView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <span>STATUS/{techData.protocol}</span>
        <motion.div
          className="h-1.5 w-1.5 rounded-full bg-accent-primary"
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>

      {/* Scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-accent-primary/20 pointer-events-none"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2
        }}
      />
    </>
  );
};

export default TechnicalElements;
