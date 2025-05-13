import React from "react";
import Image from "next/image";
import { motion, MotionValue } from "framer-motion";

interface HomeAboutImageProps {
  imageSrc: string;
  imageAlt: string;
  isImageInView: boolean;
  imageTranslateY: MotionValue<number>;
  rotateValue: MotionValue<number>;
  techValues: {
    imageScale: string;
    contentWidth: number;
  };
}

const HomeAboutImage: React.FC<HomeAboutImageProps> = ({
  imageSrc,
  imageAlt,
  isImageInView,
  imageTranslateY,
  rotateValue,
  techValues,
}) => {
  return (
    <motion.div
      className="relative rounded-lg overflow-hidden"
      style={{
        y: isImageInView ? imageTranslateY : 0,
        rotate: isImageInView ? rotateValue : 0
      }}
    >
      {/* Advanced image container with blueprint corner styles */}
      <div className="relative">
        {/* Blueprint corner markers */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-brand-primary"></div>
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-brand-primary"></div>
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-brand-primary"></div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-brand-primary"></div>

        {/* Measurement grid overlay */}
        <motion.div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="w-full h-full bg-blueprint-grid"></div>
        </motion.div>

        {/* Image with animated mask reveal */}
        <motion.div
          className="relative w-full h-0 pb-[125%] bg-bg-card overflow-hidden"
          initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
          animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover scale-105 hover:scale-110 transition-transform duration-700"
            priority
          />

          {/* Scan line effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent"
            style={{
              height: "200%",
              top: "-50%"
            }}
            animate={{
              top: ["0%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear"
            }}
          />
        </motion.div>
      </div>

      {/* Technical data indicators */}
      <div className="absolute top-3 left-3 flex items-center bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
        <div className="h-2 w-2 rounded-full bg-brand-primary mr-2 animate-pulse"></div>
        <span className="text-xs font-mono text-brand-primary">CAPTURE.{techValues.imageScale}</span>
      </div>

      <div className="absolute bottom-3 right-3 text-xs font-mono text-accent-cosmic bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          DIM/{techValues.contentWidth}x{Math.round(techValues.contentWidth * 1.25)}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default HomeAboutImage;
