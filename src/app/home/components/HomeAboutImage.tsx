import React from "react";
import { motion, MotionValue } from "framer-motion";
import Image from "next/image";

interface HomeAboutImageProps {
  imageSrc: string;
  imageAlt: string;
  isImageInView: boolean;
  imageTranslateY: MotionValue<number>;
  rotateValue: MotionValue<number>;
  techValues: {
    imageScale: string;
    sectionRatio: number;
    contentWidth: number;
  };
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

const HomeAboutImage: React.FC<HomeAboutImageProps> = ({
  imageSrc,
  imageAlt,
  isImageInView,
  imageTranslateY,
  rotateValue,
  techValues,
  accentColors
}) => {
  return (
    <>
      {/* Technical metadata display */}
      <div className="absolute -top-4 left-4 text-[10px] font-mono opacity-70 hidden md:block"
        style={{ color: accentColors.secondary }}
      >
        SCALE/{techValues.imageScale} • OPTIMIZED
      </div>

      {/* Image container with decorative elements */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isImageInView ? 1 : 0, y: isImageInView ? 0 : 20 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{ y: imageTranslateY, rotate: rotateValue }}
      >
        {/* Decorative frame */}
        <div className="absolute -inset-4 border border-dashed rounded-lg z-0 opacity-50"
          style={{ borderColor: accentColors.primary }}
        ></div>

        {/* Corner accents with varied colors */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 rounded-tl-md"
          style={{ borderColor: accentColors.primary }}
        ></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 rounded-tr-md"
          style={{ borderColor: accentColors.secondary }}
        ></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 rounded-bl-md"
          style={{ borderColor: accentColors.tertiary }}
        ></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 rounded-br-md"
          style={{ borderColor: accentColors.secondary }}
        ></div>

        {/* Technical measurement lines */}
        <div className="absolute -left-8 top-0 h-full flex flex-col justify-between py-4 opacity-60 hidden md:flex">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className="w-3 h-px"
                style={{ backgroundColor: i % 2 === 0 ? accentColors.primary : accentColors.secondary }}
              ></div>
              <span
                className="ml-1 text-[8px] font-mono"
                style={{ color: i % 2 === 0 ? accentColors.primary : accentColors.secondary }}
              >
                {i * 50}
              </span>
            </div>
          ))}
        </div>

        {/* Image with overlay effects */}
        <div className="relative overflow-hidden rounded-md">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={600}
            height={700}
            className="object-cover w-full aspect-[4/5]"
            priority
          />

          {/* Gradient overlay with multi-color scheme */}
          <div className="absolute inset-0 opacity-30"
            style={{
              background: `linear-gradient(135deg,
                ${accentColors.primary}33 0%,
                transparent 40%,
                ${accentColors.secondary}33 100%)`
            }}
          ></div>

          {/* Scan line effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-10"
            initial={{ y: "-100%" }}
            animate={{ y: "200%" }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear"
            }}
          ></motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default HomeAboutImage;
