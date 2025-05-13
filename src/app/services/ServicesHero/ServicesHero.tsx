// ServicesHero.tsx
"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/utils/classNames";
import SectionDivider from "@/components/common/Divider/SectionDivider";

import TechnicalBackground from "./TechnicalBackground";
import SectionIdentifier from "./SectionIdentifier";
import HeroHeadline from "./HeroHeadline";
import HeroImage from "./HeroImage";
import HeroContent from "./HeroContent";

export interface ServiceCategory {
  id: string;
  name: string;
  shortCode: string;
}

export interface ServicesHeroProps {
  headline?: string;
  introduction: string;
  imageSrc?: string;
  imageAlt?: string;
  services?: ServiceCategory[];
  className?: string;
}

const ServicesHero: React.FC<ServicesHeroProps> = ({
  headline = "Practical digital solutions for real business challenges",
  introduction,
  imageSrc = "/images/abstract-lights-2.jpg",
  imageAlt = "Abstract technical visualization",
  className,
  // Removed unused 'services' parameter but kept in interface for future use
}) => {
  /* ── hooks & refs ────────────────────────────────── */
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /* ── state ────────────────────────────────────────── */
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeHighlight, setActiveHighlight] = useState(false);
  // Removed unused 'revealComplete' state but kept the setter for animation sequence
  const [, setRevealComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* ── scroll transforms ─────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const gridOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.04, 0.15, 0.15, 0.04]
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5],
    [1, 1.1]
  );

  /* ── theme color variables ────────────────────────── */
  const themeColors = useMemo(() => ({
    brandPrimary: 'var(--color-brand-primary)',
    accentWarm: 'var(--color-accent-warm)',
    accentContrast: 'var(--color-accent-contrast)',
    accentOceanic: 'var(--color-accent-oceanic)',
    divider: 'var(--color-divider)',
    bgPrimary: 'var(--color-bg-primary)',
    gridLines: 'var(--color-grid-lines, var(--color-accent-oceanic))' // Fallback to accent color if grid-lines not defined
  }), []);

  /* ── technical data ───────────────────────────────── */
  const techData = useMemo(
    () => ({
      grid: Math.floor(Math.random() * 50) + 30,
      render: Math.floor(Math.random() * 30) + 70,
      nodes: Array.from({ length: 3 }).map((_, i) => ({
        id: i + 1,
        label: ["BUILD", "IMPROVE", "LEVERAGE"][i],
      })),
    }),
    []
  );

  /* ── effect hooks ────────────────────────────────── */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Sequence the highlight animations
    const timer = setTimeout(() => {
      setActiveHighlight(true);

      const completeTimer = setTimeout(() => {
        setRevealComplete(true);
      }, 1200);

      return () => clearTimeout(completeTimer);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /* ── event handlers ───────────────────────────────── */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current || prefersReduced) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width);
    const y = ((e.clientY - rect.top) / rect.height);

    setMousePosition({ x, y });
  };

  /* ── component ─────────────────────────────────────── */
  return (
    <motion.section
      id="services-hero"
      ref={sectionRef}
      className={cn(
        "relative min-h-screen bg-bg-primary overflow-hidden",
        className
      )}
      onMouseMove={handleMouseMove}
      aria-label="Services hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Technical Background */}
      <TechnicalBackground
        mousePosition={isMobile ? { x: 0.5, y: 0.5 } : mousePosition}
        gridOpacity={gridOpacity}
        themeColors={themeColors}
      />

      {/* Section Identifier */}
      <SectionIdentifier />

      {/* Main Content Area - Left/Right Split Layout */}
      <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-32 md:pt-40 pb-24 md:pb-32 h-full">
        <div className="grid grid-cols-12 gap-6 md:gap-12 lg:gap-16 relative">
          {/* Left Column - Large Headline */}
          <div className="col-span-12 md:col-span-5 lg:col-span-5 flex flex-col justify-center md:sticky md:top-40 md:self-start">
            <HeroHeadline
              headline={headline}
              activeHighlight={activeHighlight}
              className="mb-8 md:mb-0"
            />
          </div>

          {/* Right Column - Image with Overlaid Content */}
          <div className="col-span-12 md:col-span-7 lg:col-span-7 relative">
            {/* Image Layer */}
            <div className="relative">
              <HeroImage
                imageSrc={imageSrc}
                imageAlt={imageAlt}
                imageScale={imageScale}
                techData={techData}
                className="w-full"
              />

              {/* Content Overlay - Staggered position */}
              <div className="relative md:absolute md:bottom-0 md:right-0 md:w-5/6 md:transform md:translate-y-1/4 md:translate-x-1/12 z-10 mt-8 md:mt-0">
                <HeroContent
                  introduction={introduction}
                  techData={techData}
                  className="md:shadow-lg"
                  isMobile={isMobile}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial-style wave divider */}
      <SectionDivider
        className="mt-16"
        type="parallax-wave"
        height={180}
        contrast="high"
        noiseTexture={true}
      />
    </motion.section>
  );
};

export default ServicesHero;