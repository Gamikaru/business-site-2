"use client";

import React from "react";
import { motion } from "framer-motion";

interface ImageMetadataProps {
  isHovered: boolean;
  imageSrc: string;
  metadata: {
    dimensions: string;
    format: string;
    size: string;
    loaded: number;
  };
  dimensions: {
    width: number;
    height: number;
    ratio: number;
  };
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
  mousePosition: { x: number; y: number };
}

const ImageMetadata: React.FC<ImageMetadataProps> = ({
  isHovered,
  imageSrc,
  metadata,
  dimensions,
  accentColors,
  mousePosition,
}) => {
  return (
    <>
      {/* Enhanced technical image metadata display */}
      <motion.div
        className="absolute bottom-3 left-3 px-2 py-1 bg-bg-card/80 backdrop-blur-sm rounded text-xs font-mono flex items-center gap-2 z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 10,
        }}
        transition={{ duration: 0.3 }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: accentColors.primary }}
        ></span>
        <motion.span
          className="opacity-90"
          initial={{ width: "60px" }}
          animate={{ width: "auto" }}
        >
          {metadata.dimensions} • {metadata.format}
        </motion.span>
      </motion.div>

      {/* Technical filename - top right */}
      <motion.div
        className="absolute top-3 right-3 px-2 py-1 bg-bg-card/80 backdrop-blur-sm rounded text-xs font-mono z-20 max-w-[50%] truncate"
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : -10,
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="opacity-90">{imageSrc.split("/").pop()}</span>
      </motion.div>
    </>
  );
};

export default ImageMetadata;
