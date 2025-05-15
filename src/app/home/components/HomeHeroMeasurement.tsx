'use client'

import React, { memo } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface HomeHeroMeasurementProps {
  accentColors: {
    primary: string
    secondary: string
    tertiary: string
    warm: string
    contrast: string
    oceanic: string
    cosmic: string
    brand: string
  }
}

// Technical measurement labels
const measurementLabels = [
  "VIEW", "ANALYZE", "SOLVE", "EXECUTE", "ITERATE"
];

const HomeHeroMeasurement: React.FC<HomeHeroMeasurementProps> = ({ accentColors }) => {
  return (
    <motion.div
      className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      <div className="relative w-full h-full">
        {/* Main measurement line */}
        <div className="absolute bottom-6 left-0 right-0">
          {/* Main horizontal line */}
          <motion.div
            className="h-px w-full"
            style={{ background: `linear-gradient(to right, ${accentColors.secondary}, ${accentColors.brand}, ${accentColors.secondary})` }}
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 2.2, ease: "easeOut" }}
          />

          {/* Measurement markers along the line */}
          {measurementLabels.map((label, index) => {
            const position = `${(index + 1) * 20 - 10}%`;
            const isActive = index === 2; // "SOLVE" as active step

            return (
              <motion.div
                key={`marker-${index}`}
                className="absolute flex flex-col items-center"
                style={{ left: position }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 2.4 + (index * 0.1),
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                {/* Vertical line */}
                <motion.div
                  className={`h-3 w-px`}
                  style={{
                    backgroundColor: isActive ? accentColors.brand : accentColors.secondary,
                    opacity: isActive ? 1 : 0.7
                  }}
                  initial={{ scaleY: 0, transformOrigin: "bottom" }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 2.5 + (index * 0.1) }}
                />

                {/* Marker dot */}
                <motion.div
                  className="w-1.5 h-1.5 rounded-full mb-1.5"
                  style={{
                    backgroundColor: isActive ? accentColors.brand : accentColors.secondary,
                    filter: isActive ? `drop-shadow(0 0 3px ${accentColors.brand})` : 'none'
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 2.6 + (index * 0.1),
                    type: "spring"
                  }}
                />

                {/* Label text */}
                <motion.div
                  className="text-[9px] font-mono"
                  style={{
                    color: isActive ? accentColors.brand : accentColors.secondary,
                    fontWeight: isActive ? 500 : 400,
                    opacity: isActive ? 1 : 0.8
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0.7 }}
                  transition={{ delay: 2.7 + (index * 0.1) }}
                >
                  {label}
                </motion.div>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute top-[-24px]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 0.5 }}
                  >
                    <svg width="80" height="28" viewBox="0 0 80 28" fill="none">
                      {/* Connecting lines */}
                      <motion.path
                        d="M40,28 L40,20 L30,10 L10,10"
                        stroke={accentColors.brand}
                        strokeWidth="1"
                        strokeDasharray="3 2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 3.1, duration: 0.8 }}
                      />
                      <motion.path
                        d="M40,20 L50,10 L70,10"
                        stroke={accentColors.brand}
                        strokeWidth="1"
                        strokeDasharray="3 2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 3.2, duration: 0.8 }}
                      />

                      {/* Data points */}
                      <motion.circle
                        cx="10" cy="10" r="2"
                        fill={accentColors.secondary}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3.3 }}
                      />
                      <motion.circle
                        cx="70" cy="10" r="2"
                        fill={accentColors.primary}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3.4 }}
                      />
                    </svg>

                    {/* Current step label */}
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-[8px] font-mono whitespace-nowrap"
                      style={{ color: accentColors.brand }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.5 }}
                    >
                      CURRENT STEP
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Corner anchors */}
        <motion.div
          className="absolute bottom-0 left-0 w-6 h-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 2.3 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M0,24 L0,12 L12,24 Z"
              fill={accentColors.secondary}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 2.4, duration: 0.6 }}
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-0 right-0 w-6 h-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 2.3 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M24,24 L12,24 L24,12 Z"
              fill={accentColors.primary}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 2.4, duration: 0.6 }}
            />
          </svg>
        </motion.div>

        {/* Technical annotations */}
        <motion.div
          className="absolute top-6 left-8 text-[8px] font-mono flex items-center"
          style={{ color: accentColors.tertiary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 3 }}
        >
          <div className="w-12 h-px mr-2" style={{ backgroundColor: accentColors.tertiary }} />
          PROJECT WORKFLOW
        </motion.div>

        <motion.div
          className="absolute top-6 right-8 text-[8px] font-mono flex items-center"
          style={{ color: accentColors.primary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 3.1 }}
        >
          SYSTEM READY
          <div className="w-12 h-px ml-2" style={{ backgroundColor: accentColors.primary }} />
        </motion.div>

        {/* Technical grid points */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`grid-point-${i}`}
            className="absolute bottom-6 w-px h-px"
            style={{
              left: `${10 + i * 20}%`,
              backgroundColor: accentColors.secondary,
              boxShadow: `0 0 2px ${accentColors.secondary}`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2.5 + (i * 0.1) }}
          />
        ))}

        {/* Animated data flow pulse */}
        <motion.div
          className="absolute bottom-6 h-px w-16 rounded-full"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColors.brand}, transparent)`,
            filter: `blur(1px)`
          }}
          animate={{
            left: ["0%", "100%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1
          }}
        />
      </div>
    </motion.div>
  )
}

export default memo(HomeHeroMeasurement)