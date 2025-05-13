// src/components/home/HomePortfolio.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ScrollReveal, GestureElement, AnimatedPath } from "@/components/core/Animations";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Divider } from "@/components/common/Divider";
import { Heading, Text } from "@/components/common/Typography";
import { cn } from "@/utils/classNames";
import Image from "next/image";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
}

interface HomePortfolioProps {
  heading: string;
  introduction: string;
  projects: ProjectItem[];
  ctaText: string;
  ctaLink: string;
  className?: string;
}

const HomePortfolio: React.FC<HomePortfolioProps> = ({
  heading,
  introduction,
  projects,
  ctaText,
  ctaLink,
  className,
}) => {
  // References for animation triggers
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  // State for interaction tracking
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 });
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Technical display values
  const [techValues] = useState({
    sectionIndex: Math.floor(Math.random() * 9) + 1,
    renderTime: Math.floor(Math.random() * 100) + 50, // 50-150ms
    aspectRatio: "16:9",
    focusPoint: { x: 50, y: 50 },
  });

  // Scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const gridOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.1, 0.2, 0.2, 0.1]);
  const gridScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-10%"]);

  // Update viewport dimensions for relative positioning
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse/pointer position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    setCursorPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  // Generate dynamic grid paths for technical background
  const generateGridPaths = () => {
    const horizontalLines = [];
    const verticalLines = [];

    // Create horizontal lines
    for (let i = 0; i <= 10; i++) {
      const y = i * 10;
      horizontalLines.push(
        <motion.line
          key={`h-${i}`}
          x1="0"
          y1={`${y}%`}
          x2="100%"
          y2={`${y}%`}
          stroke="var(--color-accent-oceanic)"
          strokeWidth={i % 5 === 0 ? "0.5" : "0.2"}
          strokeOpacity={i % 5 === 0 ? "0.15" : "0.1"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.2 + (i * 0.05) }}
        />
      );
    }

    // Create vertical lines
    for (let i = 0; i <= 10; i++) {
      const x = i * 10;
      verticalLines.push(
        <motion.line
          key={`v-${i}`}
          x1={`${x}%`}
          y1="0"
          x2={`${x}%`}
          y2="100%"
          stroke="var(--color-accent-oceanic)"
          strokeWidth={i % 5 === 0 ? "0.5" : "0.2"}
          strokeOpacity={i % 5 === 0 ? "0.15" : "0.1"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.2 + (i * 0.05) }}
        />
      );
    }

    return [...horizontalLines, ...verticalLines];
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
      {/* Technical background with dynamic grid */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: gridOpacity,
          scale: gridScale
        }}
      >
        {/* Technical grid overlay */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {generateGridPaths()}

          {/* Dynamic focus point that follows cursor */}
          {cursorPosition.x > 0 && (
            <>
              <motion.circle
                cx={`${cursorPosition.x}%`}
                cy={`${cursorPosition.y}%`}
                r="1"
                fill="var(--color-brand-primary)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.line
                x1={`${cursorPosition.x}%`}
                y1="0"
                x2={`${cursorPosition.x}%`}
                y2="100%"
                stroke="var(--color-brand-primary)"
                strokeWidth="0.5"
                strokeOpacity="0.3"
                strokeDasharray="2 4"
              />
              <motion.line
                x1="0"
                y1={`${cursorPosition.y}%`}
                x2="100%"
                y2={`${cursorPosition.y}%`}
                stroke="var(--color-brand-primary)"
                strokeWidth="0.5"
                strokeOpacity="0.3"
                strokeDasharray="2 4"
              />
            </>
          )}
        </svg>

        {/* Blueprint texture overlay */}
        <div className="absolute inset-0 opacity-5 bg-blueprint-grid"></div>

        {/* Circuit pattern for tech feel */}
        <div className="absolute inset-0 opacity-3 bg-circuit mix-blend-overlay"></div>
      </motion.div>

      <div className="container mx-auto py-16 md:py-28 relative z-10">
        {/* Technical header with measurement details */}
        <motion.div
          ref={headingRef}
          className="max-w-3xl mx-auto text-center mb-12 md:mb-20 relative"
          style={{ y: headerY }}
        >
          {/* Section number indicator */}
          <motion.div
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="px-4 py-1 bg-bg-secondary border border-accent-oceanic rounded-sm">
              <span className="text-xs font-mono text-accent-oceanic tracking-wider">
                SECTION.{techValues.sectionIndex.toString().padStart(2, '0')}
              </span>
            </div>
          </motion.div>

          <ScrollReveal
            direction="up"
            delay={0.2}
            className="mb-8 relative"
          >
            <Heading
              level={2}
              className="text-[clamp(1.8rem,3.2vw+1rem,2.4rem)] font-heading font-bold text-heading uppercase"
            >
              {heading}
            </Heading>

            {/* Animated underline */}
            <motion.div
              className="h-[3px] w-20 bg-brand-primary mx-auto mt-4"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.3}
            className="relative"
          >
            <Text size="xl" className="text-text-secondary">
              {introduction}
            </Text>

            {/* Technical measurement markers */}
            <motion.div
              className="absolute -right-8 -bottom-8 hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <AnimatedPath
                  d="M32 0V16M0 32H16M32 64V48M64 32H48"
                  stroke="var(--color-accent-oceanic)"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                />
                <AnimatedPath
                  d="M32 40C36.4183 40 40 36.4183 40 32C40 27.5817 36.4183 24 32 24C27.5817 24 24 27.5817 24 32C24 36.4183 27.5817 40 32 40Z"
                  stroke="var(--color-accent-oceanic)"
                  strokeWidth="0.5"
                />
                <AnimatedPath
                  d="M32 36C34.2091 36 36 34.2091 36 32C36 29.7909 34.2091 28 32 28C29.7909 28 28 29.7909 28 32C28 34.2091 29.7909 36 32 36Z"
                  stroke="var(--color-accent-oceanic)"
                  strokeWidth="0.5"
                />
              </svg>
            </motion.div>
          </ScrollReveal>
        </motion.div>

        {/* Enhanced project cards - desktop with 3D hover effects */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-16">
            {projects.map((project, index) => (
              <ScrollReveal
                key={project.id}
                direction={index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right"}
                delay={0.2 + index * 0.1}
                className="h-full"
              >
                <GestureElement
                  tiltEnabled={true}
                  tiltFactor={5}
                  scaleOnHover={true}
                  scaleAmount={1.03}
                  className="h-full cursor-pointer"
                  onMouseEnter={() => setActiveProject(project.id)}
                  onMouseLeave={() => setActiveProject(null)}
                  onClick={() => setShowDetails(project.id === showDetails ? null : project.id)}
                >
                  <div className="relative h-full">
                    {/* Base card */}
                    <div
                      className={cn(
                        "relative h-full rounded-lg overflow-hidden transition-all duration-300 border",
                        activeProject === project.id
                          ? "border-brand-primary shadow-lg"
                          : "border-divider"
                      )}
                    >
                      {/* Project image with overlay effects */}
                      <div className="relative aspect-video overflow-hidden bg-black">
                        <Image
                          src={project.imageSrc}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={cn(
                            "object-cover transition-all duration-700",
                            activeProject === project.id ? "scale-105 brightness-110" : "scale-100"
                          )}
                        />

                        {/* Interactive focus grid on hover */}
                        {activeProject === project.id && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <svg className="w-full h-full" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id={`overlay-${project.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="var(--color-brand-primary)" stopOpacity="0.1" />
                                  <stop offset="100%" stopColor="var(--color-accent-oceanic)" stopOpacity="0.2" />
                                </linearGradient>
                              </defs>
                              <rect
                                width="100%"
                                height="100%"
                                fill={`url(#overlay-${project.id})`}
                                fillOpacity="0.3"
                              />

                              {/* Grid overlay */}
                              {Array.from({ length: 5 }).map((_, i) => (
                                <React.Fragment key={`grid-${i}`}>
                                  <line
                                    x1={`${i * 25}%`}
                                    y1="0"
                                    x2={`${i * 25}%`}
                                    y2="100%"
                                    stroke="var(--color-accent-oceanic)"
                                    strokeWidth="0.5"
                                    strokeOpacity="0.3"
                                  />
                                  <line
                                    x1="0"
                                    y1={`${i * 25}%`}
                                    x2="100%"
                                    y2={`${i * 25}%`}
                                    stroke="var(--color-accent-oceanic)"
                                    strokeWidth="0.5"
                                    strokeOpacity="0.3"
                                  />
                                </React.Fragment>
                              ))}
                            </svg>
                          </motion.div>
                        )}

                        {/* Technical overlay indicators */}
                        <div className="absolute top-3 left-3 flex items-center space-x-2">
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            activeProject === project.id ? "bg-brand-primary animate-pulse" : "bg-accent-oceanic"
                          )}></div>
                          <span className="text-xs font-mono text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                            PRJ.{(index + 1).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="p-6 bg-bg-card">
                        <Heading level={3} className="mb-3 text-xl font-heading">
                          {project.title}
                        </Heading>

                        <Text className="text-text-secondary">
                          {project.description}
                        </Text>

                        {/* Animated call-to-action arrow */}
                        <div className="mt-4 flex justify-end">
                          <motion.div
                            className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-full border",
                              activeProject === project.id
                                ? "border-brand-primary text-brand-primary"
                                : "border-accent-primary/50 text-accent-primary/70"
                            )}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <motion.path
                                d={showDetails === project.id ? "M5 15l7-7 7 7" : "M5 12h14M12 5l7 7-7 7"}
                                animate={{
                                  d: showDetails === project.id ? "M5 15l7-7 7 7" : "M5 12h14M12 5l7 7-7 7"
                                }}
                                transition={{ duration: 0.3 }}
                              />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable project details panel */}
                    <AnimatePresence>
                      {showDetails === project.id && (
                        <motion.div
                          className="absolute left-0 right-0 top-full z-10 bg-bg-card border border-brand-primary rounded-b-lg shadow-lg overflow-hidden"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-heading">Project Details</h4>
                                <p className="text-sm text-text-secondary">
                                  Additional information about this project
                                </p>
                              </div>
                              <Button
                                intent="text"
                                href={project.link}
                                className="text-brand-primary font-medium"
                                icon={
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                }
                                iconPosition="right"
                              >
                                View Project
                              </Button>
                            </div>

                            {/* Technical specs */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-mono border-t border-divider pt-4">
                              <div className="text-text-tertiary">Type</div>
                              <div className="text-text-primary">Web Application</div>
                              <div className="text-text-tertiary">Tech Stack</div>
                              <div className="text-text-primary">React, Next.js, TypeScript</div>
                              <div className="text-text-tertiary">Role</div>
                              <div className="text-text-primary">Lead Developer</div>
                              <div className="text-text-tertiary">Duration</div>
                              <div className="text-text-primary">3 Months</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </GestureElement>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Mobile project carousel */}
        <div className="md:hidden overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory scroll-px-4">
          <div className="flex space-x-4 w-max">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="w-[85vw] max-w-sm flex-shrink-0 snap-center"
              >
                <Card
                  variant="elevated"
                  title={project.title}
                  imageSrc={project.imageSrc}
                  imageAlt={project.title}
                  imagePosition="top"
                  aspectRatio="16/9"
                  ctaText="View Details"
                  href={project.link}
                  className="h-full"
                >
                  <p className="text-text-secondary">{project.description}</p>
                </Card>
              </div>
            ))}
          </div>

          {/* Scroll indicator dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {projects.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  i === 0 ? "bg-brand-primary" : "bg-divider"
                )}
              />
            ))}
          </div>
        </div>

        {/* Enhanced CTA Button */}
        <div className="flex justify-center mt-12 relative">
          <ScrollReveal direction="up" delay={0.5}>
            <div className="relative">
              {/* Technical frame around button */}
              <div className="absolute -inset-3 border border-dashed border-accent-oceanic/40 -z-10"></div>

              {/* Enhanced glow effect */}
              <div className="group relative">
                <div className="absolute -inset-0.5 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500 bg-gradient-to-r from-brand-primary via-accent-cosmic to-accent-primary"></div>

                <Button
                  intent="secondary"
                  size="lg"
                  href={ctaLink}
                  className="relative z-10"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 1L15 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                  iconPosition="right"
                >
                  {ctaText}
                </Button>
              </div>

              {/* Technical measurement markers */}
              <div className="absolute left-1/2 -bottom-6 transform -translate-x-1/2 text-xs font-mono text-accent-oceanic hidden md:block">
                <span className="tracking-wider">RENDER.{techValues.renderTime}ms</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Technical corner details */}
        <div className="absolute bottom-10 right-10 hidden lg:block">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <AnimatedPath
              d="M0 0L100 100M50 0V20M0 50H20M100 50H80M50 100V80"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.5"
              strokeDasharray="2 2"
            />
          </svg>
        </div>
      </div>

      {/* Enhanced wave divider with technical details */}
      <div className="relative">
        <Divider
          type="wave"
          height={120}
          bgBottom="var(--color-bg-tertiary)"
          animate={true}
          className="z-10"
        />

        {/* Technical overlay on wave */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute bottom-0 left-0 right-0 h-[120px] w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-brand-primary)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="var(--color-accent-oceanic)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave-gradient)" />

            {/* Technical scan lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.line
                key={`scan-${i}`}
                x1="0"
                y1={`${10 + i * 8}%`}
                x2="100%"
                y2={`${10 + i * 8}%`}
                stroke="var(--color-accent-primary)"
                strokeWidth="0.5"
                strokeOpacity="0.2"
                strokeDasharray="1 2"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2
                }}
              />
            ))}

            <motion.text
              x="80" y="30"
              fill="var(--color-accent-oceanic)"
              fontSize="3"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.2 }}
            >
              DISPLAY/COMPLETE
            </motion.text>
          </svg>
        </div>
      </div>
    </motion.section>
  );
};

export default HomePortfolio;