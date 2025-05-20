'use client'

import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface DataPointProps {
  position: { x: number; y: number };
  color: string;
  size?: number;
  delay?: number;
  duration?: number;
}

/**
 * Animated data point component for network-like visualizations
 */
const DataPoint: React.FC<DataPointProps> = ({
  position,
  color,
  size = 3,
  delay = 0,
  duration = 2.5,
}) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: position.x,
      top: position.y,
      width: size,
      height: size,
      backgroundColor: color,
      transform: "translate(-50%, -50%)",
      zIndex: 30,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.7, 0],
      scale: [0.5, 1.2, 0.5],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    }}
  />
);

export default memo(DataPoint);
