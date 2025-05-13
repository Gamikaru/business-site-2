// src/components/home/HomeAbout.tsx
"use client";

/**
 * HomeAbout: Optimized for React 19 + Next.js 15
 * - Performance: Throttled events, enhanced animation performance
 * - Accessibility: Added reduced motion support and ARIA roles
 * - Bundle size: Optimized imports and animations off the render path
 * - Enhanced: Added rich text formatting and varied color palette
 */

import React, { useRef, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValue, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/classNames";
import RichText from "@/components/common/Typography/RichText";

// Static imports for critical components
import HomeAboutContent from "./components/HomeAboutContent";
import HomeAboutImage from "./components/HomeAboutImage";
import HomeAboutDivider from "./components/HomeAboutDivider";

interface HomeAboutProps {
  heading: string;
  content: string; // This will now contain HTML/rich formatting
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
  // Use React 19 compiler pragma for optimized rendering
  "use react-compiler";

  // Check for reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  // Refs for scroll tracking and element visibility
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lastMoveRef = useRef(0);

  // Motion values (outside React render cycle)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Component state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [techValues, setTechValues] = useState({
    sectionRatio: Math.floor(Math.random() * 100),
    contentWidth: Math.floor(Math.random() * 1000) + 400,
    imageScale: (Math.random() * 0.5 + 0.8).toFixed(2)
  });

  // Function to get a color based on index for more variety
  const getAccentColor = (index: number) => {
    const colors = ['accent-secondary', 'accent-warm', 'brand-primary', 'accent-contrast'];
    return colors[index % colors.length];
  };

  // Optimize tracking with useInView
  const isImageInView = useInView(imageRef, {
    once: false,
    margin: "-10% 0px",
    // Only track when element is actually visible in viewport
    amount: 0.1
  });

  const isHeadingInView = useInView(headingRef, {
    once: false,
    margin: "-10% 0px",
    amount: 0.1
  });

  // Scroll animation values - outside React render cycle
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Transform values for parallax effects - computed outside React render
  const imageTranslateY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const gridTranslateX = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const rotateValue = useTransform(scrollYProgress, [0, 1], [2, -2]);

  // Throttled mouse movement handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    // Throttle to ~60fps
    if (now - lastMoveRef.current < 16) return;
    lastMoveRef.current = now;

    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Update motion values directly (no re-render)
    mouseX.set(x);
    mouseY.set(y);

    // Batch state updates with startTransition
    React.startTransition(() => {
      setMousePosition({ x, y });
      setTechValues(prev => ({
        ...prev,
        sectionRatio: Math.floor(y * 100),
        imageScale: (0.8 + x * 0.4).toFixed(2)
      }));
    });
  }, [mouseX, mouseY]);

  // Memoize the animated grid for stable rendering
  const animatedGrid = useMemo(() => (
    <motion.div
      className="absolute inset-0 opacity-5"
      style={{ x: gridTranslateX }}
      aria-hidden="true"
    >
      <div className="h-full w-full bg-dots-dense"></div>
    </motion.div>
  ), [gridTranslateX]);

  // Memoize animated lines for stable rendering with varied colors
  const animatedLines = useMemo(() => (
    <svg
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.line
        x1="0"
        y1="25%"
        x2="100%"
        y2="25%"
        stroke="var(--color-accent-secondary)"
        strokeWidth="0.5"
        strokeDasharray="10,5"
        initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.line
        x1="0"
        y1="75%"
        x2="100%"
        y2="75%"
        stroke="var(--color-accent-warm)"
        strokeWidth="0.5"
        strokeDasharray="10,5"
        initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Additional decorative elements with varied colors */}
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx={`${15 + i * 25}%`}
          cy="50%"
          r="3"
          fill={`var(--color-${getAccentColor(i)})`}
          fillOpacity="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 * i, duration: 0.5 }}
        />
      ))}
    </svg>
  ), [prefersReducedMotion]);

  return (
    <motion.section
      ref={sectionRef}
      className={cn("relative bg-bg-primary overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      role="region"
      aria-label="About section"
    >
      {/* Technical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {animatedGrid}
        {animatedLines}
      </div>

<div className="container mx-auto py-16 md:py-32 px-4 md:px-8 max-w-7xl relative z-10">
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
              accentColors={{
                primary: 'var(--color-accent-secondary)',
                secondary: 'var(--color-accent-warm)',
                tertiary: 'var(--color-accent-contrast)'
              }}
            />
          </div>

          {/* Right column (content) with advanced styling */}
          <div ref={headingRef} className="md:col-span-6 md:col-start-7 relative z-10">
            <HomeAboutContent
              heading={heading}
              // Use RichText for content rendering
              content={<RichText content={content} />}
              ctaText={ctaText}
              ctaLink={ctaLink}
              isHeadingInView={isHeadingInView}
              techValues={techValues}
              mousePosition={mousePosition}
              accentColors={{
                primary: 'var(--color-accent-secondary)',
                secondary: 'var(--color-accent-warm)',
                tertiary: 'var(--color-accent-contrast)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Advanced angled divider with technical accents */}
      <HomeAboutDivider
        accentColors={{
          primary: 'var(--color-accent-secondary)',
          secondary: 'var(--color-accent-warm)',
          tertiary: 'var(--color-accent-contrast)'
        }}
      />

      {/* Utility styles for special effects */}
      <style jsx global>{`
        .accent-secondary { color: var(--color-accent-secondary); }
        .accent-warm { color: var(--color-accent-warm); }
        .accent-contrast { color: var(--color-accent-contrast); }
        .brand-primary { color: var(--color-brand-primary); }
        .underline-accent {
          text-decoration: underline;
          text-decoration-color: var(--color-accent-secondary);
          text-decoration-thickness: 2px;
          text-underline-offset: 2px;
        }
        .underline-warm {
          text-decoration: underline;
          text-decoration-color: var(--color-accent-warm);
          text-decoration-thickness: 2px;
          text-underline-offset: 2px;
        }
        .text-emphasis {
          font-weight: 600;
          letter-spacing: 0.02em;
        }
      `}</style>
    </motion.section>
  );
};

export default HomeAbout;