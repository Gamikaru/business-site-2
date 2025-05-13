import React from "react";
import { motion } from "framer-motion";

interface HomeHeroDataVizProps {
  mousePosition: {
    x: number;
    y: number;
  };
  randomData: {
    coordinates: { x: number; y: number };
    spectrumValue: number;
  };
}

const HomeHeroDataViz: React.FC<HomeHeroDataVizProps> = ({
  mousePosition,
  randomData,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.7 }}
      className="border border-white/20 p-4 rounded-sm backdrop-blur-sm bg-black/30 h-full"
    >
      <div className="flex flex-col justify-between h-full">
        {/* Technical data readout header */}
        <div className="border-b border-white/20 py-2 text-xs font-mono text-white/80 flex justify-between">
          <span>SYSTEM//METRICS</span>
          <span className="text-brand-primary">LIVE</span>
        </div>

        {/* Animated data visualization */}
        <div className="py-4 flex-grow">
          <div className="relative aspect-square">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer circle */}
              <motion.circle
                cx="50" cy="50" r="45"
                stroke="var(--color-accent-oceanic)"
                strokeWidth="0.5"
                strokeDasharray="282.7"
                initial={{ strokeDashoffset: 282.7 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />

              {/* Cross axis */}
              <motion.path
                d="M50 5 L50 95 M5 50 L95 50"
                stroke="var(--color-accent-oceanic)"
                strokeWidth="0.2"
                strokeDasharray="4 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />

              {/* Tracking points */}
              <motion.circle
                cx="50" cy="50" r="5"
                fill="none"
                stroke="var(--color-brand-primary)"
                strokeWidth="0.5"
              />

              {/* Dynamic data point controlled by mouse */}
              <motion.circle
                cx={mousePosition.x * 90 + 5}
                cy={mousePosition.y * 90 + 5}
                r="2"
                fill="var(--color-brand-primary)"
              />

              {/* Connect to center with line */}
              <motion.line
                x1="50" y1="50"
                x2={mousePosition.x * 90 + 5}
                y2={mousePosition.y * 90 + 5}
                stroke="var(--color-brand-primary)"
                strokeWidth="0.3"
                strokeDasharray="3 2"
              />

              {/* Data points around perimeter */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * 40 + 50;
                const y = Math.sin(angle) * 40 + 50;

                return (
                  <motion.circle
                    key={`data-point-${i}`}
                    cx={x} cy={y} r="1"
                    fill={i % 3 === 0 ? "var(--color-accent-primary)" : "var(--color-accent-oceanic)"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2 + (i * 0.1) }}
                  />
                );
              })}

              {/* Live reading */}
              <motion.text
                x="50" y="75"
                fill="white"
                fontSize="3"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {`SIGNAL:${randomData.spectrumValue.toString().padStart(3, '0')}`}
              </motion.text>
            </svg>
          </div>
        </div>

        {/* Data metrics */}
        <div className="text-[10px] font-mono space-y-1">
          <div className="flex justify-between text-white/70">
            <span>X-SPECTRUM</span>
            <span className="text-brand-primary">{randomData.coordinates.x.toString().padStart(3, '0')}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Y-SPECTRUM</span>
            <span className="text-accent-oceanic">{randomData.coordinates.y.toString().padStart(3, '0')}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>SYNC-RATE</span>
            <span className="text-accent-cosmic">{Math.floor(Math.random() * 100)}Hz</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeHeroDataViz;
