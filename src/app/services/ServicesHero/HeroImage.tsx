// HeroImage.tsx
import React from "react";
import Image from "next/image";
import { motion, MotionValue } from "framer-motion";
import { Text } from "@/components/common/Typography";
import { cn } from "@/utils/classNames";

interface HeroImageProps {
  imageSrc: string;
  imageAlt: string;
  imageScale: MotionValue<number>;
  techData: {
    grid: number;
    render: number;
    nodes: Array<{ id: number; label: string }>;
  };
  className?: string; // Add className prop
}

const HeroImage: React.FC<HeroImageProps> = ({
  imageSrc,
  imageAlt,
  imageScale,
  techData,
  className, // Accept className prop
}) => {
  return (
    <motion.div
      className={cn(
        "relative h-[50vh] md:h-[80vh]", // Taller on desktop
        className
      )}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      {imageSrc && (
        <div className="relative w-full h-full rounded-lg overflow-hidden border border-divider">
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ scale: imageScale }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />

            {/* Enhanced overlay effect for better text readability */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-bg-primary/80 mix-blend-multiply"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />

            {/* Added grid overlay */}
            <div className="absolute inset-0 blueprint-overlay opacity-20"></div>
          </motion.div>

          {/* Technical data display moved to top left for better visibility with overlay */}
          <motion.div
            className="absolute top-4 left-4 px-4 py-3 bg-bg-glass backdrop-blur-md border-r-2 border-brand-primary font-mono text-xs rounded-tl-md rounded-bl-md shadow-md"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Text size="xs" family="code" className="text-text-tertiary">
              SYSTEM.{techData.grid}/{techData.render}
            </Text>

            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent-oceanic transform -translate-y-1 -translate-x-1"></div>
          </motion.div>

          {/* Grid markers on the right side */}
          <div className="absolute top-0 right-0 h-full w-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute right-0 w-2 border-t border-accent-oceanic/50"
                style={{ top: `${i * 25}%` }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HeroImage;
