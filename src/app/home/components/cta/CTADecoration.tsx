"use client";

import React from "react";
import { motion, AnimationControls, AnimatePresence } from "framer-motion";
import { AccentColors } from "../HomeHeroCTA";

export interface CTADecorationProps {
  accentColors: AccentColors;
  isAnimated: boolean;
  isHovered: boolean;
  energyLevel: number;
  glowControls: AnimationControls;
}

export const CircuitBoardEffect: React.FC<{
  accentColors: AccentColors;
  isHovered: boolean;
}> = ({ accentColors, isHovered }) => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg width="100%" height="100%" className="absolute inset-0">
        <motion.path
          d={`M10,${isHovered ? 25 : 15} L${isHovered ? 50 : 30},${isHovered ? 15 : 25} L${isHovered ? 90 : 60},${isHovered ? 35 : 25}`}
          stroke={accentColors.primary}
          strokeWidth="0.5"
          fill="none"
          initial={false}
          animate={{ pathLength: isHovered ? [0, 1, 1] : 1,
                     pathOffset: isHovered ? [0, 0, 1] : 0 }}
          transition={{ duration: isHovered ? 1.5 : 0.3,
                        times: isHovered ? [0, 0.5, 1] : [0, 1] }}
        />
        <motion.path
          d={`M20,${isHovered ? 85 : 65} L${isHovered ? 70 : 40},${isHovered ? 65 : 40} L${isHovered ? 90 : 70},${isHovered ? 25 : 15}`}
          stroke={accentColors.secondary}
          strokeWidth="0.5"
          fill="none"
          strokeDasharray="2 3"
          initial={false}
          animate={{ pathLength: isHovered ? [0, 1, 1] : 1,
                     pathOffset: isHovered ? [0, 0, 1] : 0 }}
          transition={{ duration: isHovered ? 1.8 : 0.3,
                        delay: 0.1,
                        times: isHovered ? [0, 0.6, 1] : [0, 1] }}
        />

        {/* Circuit nodes at junctions and ends */}
        {[
          { x: 10, y: isHovered ? 25 : 15 },
          { x: isHovered ? 50 : 30, y: isHovered ? 15 : 25 },
          { x: isHovered ? 90 : 60, y: isHovered ? 35 : 25 },
          { x: 20, y: isHovered ? 85 : 65 },
          { x: isHovered ? 70 : 40, y: isHovered ? 65 : 40 },
          { x: isHovered ? 90 : 70, y: isHovered ? 25 : 15 },
        ].map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.x}
            cy={node.y}
            r={i % 2 === 0 ? 1.5 : 1}
            fill={i % 2 === 0 ? accentColors.primary : accentColors.secondary}
            initial={false}
            animate={{
              r: isHovered && i % 3 === 0 ? [1, 2, 1] : (i % 2 === 0 ? 1.5 : 1),
              opacity: isHovered && i % 4 === 0 ? [0.5, 1, 0.5] : 1
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export const EnergyParticles: React.FC<{
  accentColors: AccentColors;
  energyLevel: number;
}> = ({ accentColors, energyLevel }) => {
  const particleCount = energyLevel / 5; // 20 particles at full energy

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = (Math.random() * 0.7 + 0.3) * 50;
        const duration = 0.5 + Math.random() * 1;
        const size = 1 + Math.random() * 2;

        return (
          <motion.div
            key={`energy-${i}`}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: i % 3 === 0 ? accentColors.primary :
                             i % 3 === 1 ? accentColors.secondary :
                             accentColors.tertiary,
              opacity: 0,
              left: '50%',
              top: '50%',
              x: '-50%',
              y: '-50%'
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
              x: ['-50%', `-50% + ${Math.cos(angle) * distance}px`],
              y: ['-50%', `-50% + ${Math.sin(angle) * distance}px`],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
          />
        );
      })}
    </div>
  );
};

export const CTADecoration: React.FC<CTADecorationProps> = ({
  accentColors,
  isAnimated,
  isHovered,
  energyLevel,
  glowControls
}) => {
  return (
    <>
      {/* Enhanced backdrop glow effect with animated energy aura */}
      <motion.div
        className="absolute -inset-3 rounded-lg"
        initial={{ opacity: 0 }}
        animate={glowControls}
        style={{
          background: `linear-gradient(135deg, ${accentColors.brand}, ${accentColors.secondary})`,
          filter: "blur(10px)",
        }}
      />

      {/* Pulsing energy ring */}
      <motion.div
        className="absolute -inset-5 rounded-full"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, isHovered ? 0.2 : 0.1, 0],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: isHovered ? 2 : 3,
          repeat: Infinity,
          repeatType: "loop"
        }}
        style={{
          border: `1px solid ${accentColors.primary}`,
          boxShadow: `0 0 20px ${accentColors.primary}50`
        }}
      />

      {/* Decorative accent lines with animated draw effect */}
      <motion.div
        className="absolute -left-8 -top-6 w-24 h-24 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAnimated ? 0.8 : 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        aria-hidden="true"
      >
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
          <motion.path
            d="M0,24 L24,0"
            stroke={accentColors.primary}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={isAnimated ? { pathLength: isHovered ? [1, 0.3, 1] : 1 } : { pathLength: 0 }}
            transition={{
              duration: isHovered ? 2 : 0.8,
              delay: 0.6,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          <motion.path
            d="M0,2 L32,2"
            stroke={accentColors.primary}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={isAnimated ? { pathLength: isHovered ? [1, 0.5, 1] : 1 } : { pathLength: 0 }}
            transition={{
              duration: isHovered ? 2.5 : 0.8,
              delay: 0.7,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          <motion.path
            d="M2,0 L2,32"
            stroke={accentColors.primary}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={isAnimated ? { pathLength: isHovered ? [1, 0.7, 1] : 1 } : { pathLength: 0 }}
            transition={{
              duration: isHovered ? 3 : 0.8,
              delay: 0.8,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse"
            }}
          />

          <motion.text
            x="36"
            y="12"
            fontSize="6"
            fontFamily="monospace"
            fill={accentColors.secondary}
            opacity="0.7"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.9 : 0.7 }}
          >
            x:143
          </motion.text>
          <motion.text
            x="36"
            y="22"
            fontSize="6"
            fontFamily="monospace"
            fill={accentColors.secondary}
            opacity="0.7"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.9 : 0.7 }}
          >
            y:287
          </motion.text>
        </svg>
      </motion.div>

      {/* Technical data visualization */}
      <motion.div
        className="absolute -right-10 -bottom-4 font-mono text-[6px] opacity-0"
        animate={{
          opacity: isHovered ? 0.7 : 0
        }}
        style={{ color: accentColors.tertiary }}
      >
        {`ENERGY:${Math.round(energyLevel)}%`}
      </motion.div>

      {/* Advanced decorative accent dots with physics behavior */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -bottom-6 right-0 flex space-x-1.5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={`dot-${i}`}
                className="w-1.5 h-1.5 rounded-full"
                initial={{ scale: 0, x: 0 }}
                animate={{
                  scale: 1,
                  x: isHovered ? [(i-2)*3, (i-2)*5, (i-2)*3] : 0
                }}
                exit={{
                  scale: 0,
                  x: (i-2)*10,
                  transition: { duration: 0.3, ease: "backIn" }
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.05 * i,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{
                  backgroundColor:
                    i % 5 === 0 ? accentColors.primary :
                    i % 5 === 1 ? accentColors.secondary :
                    i % 5 === 2 ? accentColors.tertiary :
                    i % 5 === 3 ? accentColors.warm || accentColors.secondary :
                    accentColors.contrast || accentColors.primary,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary geometric accent decoration */}
      <motion.div
        className="absolute -right-12 -bottom-12 w-32 h-32 opacity-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          rotate: isHovered ? 45 : 0,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.8 }}
        aria-hidden="true"
      >
        <svg width="128" height="128" viewBox="0 0 128 128" fill="none">
          <circle
            cx="64"
            cy="64"
            r="48"
            stroke={accentColors.oceanic || accentColors.secondary}
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="3 5"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="32"
            stroke={accentColors.tertiary}
            strokeWidth="0.5"
            fill="none"
            animate={{
              rotate: [0, 360],
              strokeDasharray: ["2 6", "6 2", "2 6"]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "loop" }}
          />
          <motion.path
            d="M64,28 L64,100"
            stroke={accentColors.primary}
            strokeWidth="0.5"
            strokeDasharray="2 4"
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "loop" }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.path
            d="M28,64 L100,64"
            stroke={accentColors.brand}
            strokeWidth="0.5"
            strokeDasharray="2 4"
            animate={{ rotate: [0, -180, -360] }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "loop" }}
            style={{ transformOrigin: 'center' }}
          />

          {/* Additional hexagonal element */}
          <motion.path
            d="M64,32 L84,48 L84,80 L64,96 L44,80 L44,48 Z"
            stroke={accentColors.warm || accentColors.primary}
            strokeWidth="0.3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: isHovered ? [0, 1, 0] : 0,
              opacity: isHovered ? [0, 0.5, 0] : 0
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </svg>
      </motion.div>
    </>
  );
};

export default CTADecoration;
