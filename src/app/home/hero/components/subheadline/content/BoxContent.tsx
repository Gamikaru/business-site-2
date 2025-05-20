// src/app/home/components/subheadline/content/BoxContent.tsx
'use client'

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import RichText from "@/components/common/Typography/RichText";

interface BoxContentProps {
  text: string;
  isFinalBox: boolean;
  isHovered: boolean;
}

// Animation variants for content with consistent behavior
const contentVariants = {
  normal: { scale: 1 },
  hover: (isFinalBox: boolean) => ({
    scale: isFinalBox ? 1.03 : 1.05,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
};

const BoxContent: React.FC<BoxContentProps> = ({ text, isFinalBox, isHovered }) => {
  return (
    <motion.div
      variants={contentVariants}
      animate={isHovered ? "hover" : "normal"}
      custom={isFinalBox}
      style={{
        willChange: isHovered ? 'transform' : 'auto',
        transformOrigin: 'center'
      }}
      // Explicitly use text-primary-text class to ensure proper color inheritance
      className={`text-primary-text ${isFinalBox
        ? "text-2xl md:text-3xl font-medium font-heading"
        : "text-xl md:text-2xl font-light font-heading"}`}
    >
      {isFinalBox ? (
        <RichText content={text} />
      ) : (
        text
      )}
    </motion.div>
  );
};

export default memo(BoxContent);