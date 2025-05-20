"use client";

import React, { useEffect, useState } from 'react';
import Xarrow from 'react-xarrows';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface AboutConnectorsProps {
  count: number;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
  isVisible: boolean;
  scrollProgress: MotionValue<number>;
}

const AboutConnectors: React.FC<AboutConnectorsProps> = ({
  count,
  accentColors,
  isVisible,
  scrollProgress
}) => {
  const [arrowsVisible, setArrowsVisible] = useState(false);

  // Get animation progress for arrows
  const arrowOpacity = useTransform(scrollProgress, [0.1, 0.3], [0, 1]);

  // Animation to delay arrow appearance
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setArrowsVisible(true);
      }, 800);

      return () => clearTimeout(timer);
    } else {
      setArrowsVisible(false);
    }
  }, [isVisible]);

  // Generate colors based on index
  const getArrowColor = (index: number) => {
    switch (index % 3) {
      case 0: return accentColors.primary;
      case 1: return accentColors.secondary;
      case 2: return accentColors.tertiary;
      default: return accentColors.brand;
    }
  };

  if (!arrowsVisible) return null;

  return (
    <motion.div style={{ opacity: arrowOpacity }}>
      {/* Create arrows between consecutive cards */}
      {Array.from({ length: count - 1 }).map((_, i) => {
        // Configure arrow anchors to flow around cards
        let startAnchor, endAnchor;

        if (i % 2 === 0) {
          // From right edge of even card to top edge of odd card
          startAnchor = "right";
          endAnchor = "top";
        } else {
          // From left edge of odd card to top edge of even card
          startAnchor = "left";
          endAnchor = "top";
        }

        return (
          <Xarrow
            key={`connector-${i}`}
            start={`about-card-${i}-${startAnchor === "right" ? 'end' : 'start'}`}
            end={`about-card-${i + 1}-top`} // New anchor point for top edge
            color={getArrowColor(i)}
            strokeWidth={2}
            path="smooth"
            curveness={0.8}
            headSize={6}
            tailSize={2}
            animateDrawing={1.5}
            dashness={{ animation: 1 }}
            startAnchor={startAnchor}
            endAnchor={endAnchor}
            _debug={false}
            showHead={true}
          />
        );
      })}
    </motion.div>
  );
};

export default AboutConnectors;
