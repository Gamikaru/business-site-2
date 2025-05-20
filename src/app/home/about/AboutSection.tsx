"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import { cn } from "@/utils/classNames";
import AboutTitle from "./components/AboutTitle";
import AboutImage from "./components/AboutImage";
import AboutCard from "./components/AboutCard";
import AboutConnectors from "./components/AboutConnectors";
import AboutBackground from "./components/AboutBackground";
import { useViewportSize } from "@/hooks/useViewportSize";
import { useAnimationPreferences } from "@/components/core/Animations";
import { parseContentBlocks } from "./utils/contentParser";

interface AboutSectionProps {
  heading: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export default function AboutSection({
  heading,
  content,
  ctaText,
  ctaLink,
  imageSrc,
  imageAlt,
  className,
}: AboutSectionProps) {
  // Parse content into blocks
  const contentBlocks = parseContentBlocks(content);

  // References for cards and section
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [isVisible, setIsVisible] = useState(false);
  const updateXarrow = useXarrow();
  const { width } = useViewportSize();
  const { reducedMotion } = useAnimationPreferences();

  // Remove mouse tracking for parallax effects
  // const mouseX = useMotionValue(0);
  // const mouseY = useMotionValue(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scrollPercentage, setScrollPercentage] = useState(0);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth scroll progress with spring physics
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  // Transform values based on scroll and mouse position for parallax effect
  // const gridTranslateX = useTransform(mouseX, [-width / 2, width / 2], [-5, 5]);
  // const gridTranslateY = useTransform(mouseY, [-300, 300], [-5, 5]);
  const gridScale = useTransform(
    smoothScrollProgress,
    [0, 0.5, 1],
    [0.98, 1, 0.99]
  );

  // Color transitions based on scroll depth
  const primaryHue = useTransform(smoothScrollProgress, [0, 1], [210, 250]);
  const secondaryHue = useTransform(smoothScrollProgress, [0, 1], [160, 190]);
  const primaryColor = useMotionTemplate`hsl(${primaryHue}, 80%, 50%)`;
  const secondaryColor = useMotionTemplate`hsl(${secondaryHue}, 70%, 55%)`;

  // Dynamic accent colors based on scroll position
  const accentColors = useMemo(
    () => ({
      primary: "var(--color-accent-primary)",
      secondary: "var(--color-accent-secondary)",
      tertiary: "var(--color-accent-tertiary)",
      warm: "var(--color-accent-warm)",
      contrast: "var(--color-accent-contrast)",
      brand: "var(--color-brand-primary)",
    }),
    []
  );

  // Handle intersection observation for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Update section dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (sectionRef.current) {
        setDimensions({
          width: sectionRef.current.offsetWidth,
          height: sectionRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Update arrows and scroll percentage on resize or scroll
  useEffect(() => {
    const handleScroll = () => {
      updateXarrow();

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionHeight = rect.height;

        // Calculate percentage scrolled
        const visibleHeight = Math.min(windowHeight, sectionHeight);
        const scrolled = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - sectionTop) / (windowHeight + sectionHeight)
          )
        );
        setScrollPercentage(Math.round(scrolled * 100));
      }
    };

    window.addEventListener("resize", updateXarrow);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", updateXarrow);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateXarrow]);

  // Format dimension display
  const formattedDimensions = useMemo(() => {
    return `${Math.round(dimensions.width)} × ${Math.round(dimensions.height)}`;
  }, [dimensions]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "py-16 md:py-24 lg:py-32 relative overflow-hidden perspective-1000",
        className
      )}
      id="about"
      style={{ isolation: "isolate" }} // Create a new stacking context
    >
      {/* Enhanced Background */}
      <AboutBackground
        scrollProgress={smoothScrollProgress}
        isVisible={isVisible}
        accentColors={accentColors}
        reducedMotion={reducedMotion}
      />

      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-20 2xl:px-24 relative z-10"
        style={{
          // x: !reducedMotion ? gridTranslateX : 0,
          // y: !reducedMotion ? gridTranslateY : 0,
          scale: !reducedMotion ? gridScale : 1,
        }}
      >
        {/* Two-column header layout - reduced gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 lg:gap-4 mb-12 md:mb-16 relative">
          {/* Left column: Title with extending box */}
          <div
            ref={titleRef}
            id="about-title"
            className="flex items-center justify-start relative"
          >
            <div className="absolute h-full right-0 w-[150%] bg-bg-card/30 backdrop-blur-sm border-r-2 border-r-accent-primary/30 rounded-r-lg z-0"></div>
            <AboutTitle
              heading={heading}
              isVisible={isVisible}
              accentColors={accentColors}
              scrollProgress={smoothScrollProgress}
            />
          </div>

          {/* Right column: Image */}
          <div
            ref={imageRef}
            id="about-image"
            className="flex justify-center items-center relative"
          >
            <AboutImage
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              isRevealed={isVisible}
              accentColors={accentColors}
              scrollProgress={smoothScrollProgress}
            />
            {/* Connection points for XArrows - updated for better flow */}
            <div
              id="about-image-left"
              className="absolute left-0 top-1/3 w-1 h-1 -translate-x-1/2"
            />
            <div
              id="about-image-bottom"
              className="absolute bottom-0 left-1/2 w-1 h-1 translate-y-1/2"
            />
          </div>

          {/* Connection point for title - repositioned */}
          <div
            id="about-title-right"
            className="absolute right-[-2px] top-1/3 w-1 h-1"
          />
        </div>

        <div className="mt-16 md:mt-24 relative z-10">
          <Xwrapper>
            {/* Cards with alternating layout */}
            {contentBlocks.map((block, index) => (
              <AboutCard
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                id={`about-card-${index}`}
                content={block}
                index={index}
                isLast={index === contentBlocks.length - 1}
                alignment={index % 2 === 0 ? "left" : "right"}
                accentColors={accentColors}
                isVisible={isVisible}
                smooth={smoothScrollProgress}
                // Only pass CTA to last card, not image
                ctaText={
                  index === contentBlocks.length - 1 ? ctaText : undefined
                }
                ctaLink={
                  index === contentBlocks.length - 1 ? ctaLink : undefined
                }
              />
            ))}

            {/* Arrows connecting the elements */}
            {!reducedMotion && width > 768 && (
              <>
                {/* Arrow from title to image - reversed direction and stops at image border */}
                <Xarrow
                  start="about-image-left"
                  end="about-title-right"
                  color={accentColors.primary}
                  strokeWidth={2}
                  path="straight"
                  curveness={0} // Straight line
                  headSize={6}
                  tailSize={2}
                  animateDrawing={1.5}
                  dashness={{ animation: 1 }}
                  startAnchor="left"
                  endAnchor="right"
                  _debug={false}
                  showHead={false} // No head at start point
                  showTail={true} // Show head at end point (reversed naming due to direction change)
                  zIndex={5} // Ensure it's below other elements
                  startAnchorOffset={{
                    rightness: 10, // Offset from image border
                    bottomness: 0,
                  }}
                  endAnchorOffset={{
                    leftness: 5, // Offset from title end
                    bottomness: 0,
                  }}
                />

                {/* Arrow from image to first card - unchanged */}
                <Xarrow
                  start="about-image-bottom"
                  end="about-card-0-top"
                  color={accentColors.secondary}
                  strokeWidth={2}
                  path="smooth"
                  curveness={0.8}
                  headSize={6}
                  tailSize={2}
                  animateDrawing={1.5}
                  dashness={{ animation: 1 }}
                  startAnchor="bottom"
                  endAnchor="top"
                  _debug={false}
                  showHead={true}
                />

                {/* Arrows between cards */}
                <AboutConnectors
                  count={contentBlocks.length}
                  accentColors={accentColors}
                  isVisible={isVisible}
                  scrollProgress={smoothScrollProgress}
                />
              </>
            )}
          </Xwrapper>
        </div>
      </motion.div>
    </section>
  );
}
