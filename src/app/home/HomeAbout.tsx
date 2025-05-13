// src/components/home/HomeAbout.tsx
"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useInView } from "framer-motion";
import { cn } from "@/utils/classNames";

// Import the split components
import HomeAboutImage from "./components/HomeAboutImage";
import HomeAboutContent from "./components/HomeAboutContent";
import HomeAboutDivider from "./components/HomeAboutDivider";

interface HomeAboutProps {
  heading: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

const HomeAbout: React.FC<HomeAboutProps> = ({
  heading,
  content,
  ctaText,
  ctaLink,
  imageSrc,
  imageAlt,
  className,
}) => {
  // Refs for scroll tracking and element visibility
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const isImageInView = useInView(imageRef, { once: false, margin: "-10% 0px" });
  const isHeadingInView = useInView(headingRef, { once: false, margin: "-10% 0px" });

  // Scroll animation values
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Transform values for parallax effects
  const imageTranslateY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const gridTranslateX = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const rotateValue = useTransform(scrollYProgress, [0, 1], [2, -2]);

  // Mouse movement tracking
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Technical display values
  const [techValues, setTechValues] = useState({
    sectionRatio: Math.floor(Math.random() * 100),
    contentWidth: Math.floor(Math.random() * 1000) + 400,
    imageScale: (Math.random() * 0.5 + 0.8).toFixed(2)
  });

  // Handle mouse movements for interactive elements
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x, y });

    // Update some technical readouts based on mouse position
    setTechValues(prev => ({
      ...prev,
      sectionRatio: Math.floor(y * 100),
      imageScale: (0.8 + x * 0.4).toFixed(2)
    }));
  };

  return (
    <motion.section
      ref={sectionRef}
      className={cn("relative bg-bg-primary overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Technical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated grid overlay */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{ x: gridTranslateX }}
        >
          <div className="h-full w-full bg-dots-dense"></div>
        </motion.div>

        {/* Animated lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <motion.line
            x1="0"
            y1="25%"
            x2="100%"
            y2="25%"
            stroke="var(--color-accent-oceanic)"
            strokeWidth="0.5"
            strokeDasharray="10,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.line
            x1="0"
            y1="75%"
            x2="100%"
            y2="75%"
            stroke="var(--color-accent-oceanic)"
            strokeWidth="0.5"
            strokeDasharray="10,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="container mx-auto py-16 md:py-28 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left column (image) with advanced styling */}
          <div ref={imageRef} className="md:col-span-5 relative">
            <HomeAboutImage
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              isImageInView={isImageInView}
              imageTranslateY={imageTranslateY}
              rotateValue={rotateValue}
              techValues={techValues}
            />
          </div>

          {/* Right column (content) with advanced styling */}
          <div ref={headingRef} className="md:col-span-6 md:col-start-7 relative z-10">
            <HomeAboutContent
              heading={heading}
              content={content}
              ctaText={ctaText}
              ctaLink={ctaLink}
              isHeadingInView={isHeadingInView}
              techValues={techValues}
              mousePosition={mousePosition}
            />
          </div>
        </div>
      </div>

      {/* Advanced angled divider with technical accents */}
      <HomeAboutDivider />
    </motion.section>
  );
};

export default HomeAbout;