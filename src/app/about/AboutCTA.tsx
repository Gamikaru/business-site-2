"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ScrollReveal,
  TextReveal,
  AnimatedPath,
} from "@/components/core/Animations";
import { Heading, Text } from "@/components/common/Typography";
import RichText from "@/components/common/Typography/RichText";
import { cn } from "@/utils/classNames";

interface AboutCTAProps {
  heading: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
}

const AboutCTA: React.FC<AboutCTAProps> = ({
  heading,
  content,
  ctaText,
  ctaLink,
  className,
}) => {
  // Refs for animation and scroll tracking
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, {
    once: false,
    margin: "-10% 0px",
  });

  // Technical data display
  const [techData] = useState({
    systemReadiness: Math.floor(Math.random() * 10) + 90, // 90-99%
    ctaVersion: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
    responseTime: Math.floor(Math.random() * 24) + 24, // 24-48 hours
  });

  // Button hover state
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Mouse tracking for technical displays
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Scroll animation values
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const gridOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.05, 0.15, 0.05]
  );

  // Handle mouse movements
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
  };

  return (
    <motion.section
      ref={sectionRef}
      className={cn(
        "relative bg-bg-tertiary overflow-hidden py-20 md:py-32",
        className
      )}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Technical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Blueprint grid with parallax motion */}
        <motion.div
          className="absolute inset-0"
          style={{
            y: backgroundY,
            opacity: gridOpacity,
          }}
        >
          <div className="absolute inset-0 bg-blueprint-grid"></div>
        </motion.div>

        {/* Angled background segments */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          fill="none"
        >
          <motion.path
            d="M0,0 L100,0 L100,30 L0,70 Z"
            fill="var(--color-brand-primary)"
            fillOpacity="0.05"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.path
            d="M0,30 L100,10 L100,60 L0,80 Z"
            fill="var(--color-accent-oceanic)"
            fillOpacity="0.03"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </svg>

        {/* Technical grid measurement lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`grid-h-${i}`}
              x1="0"
              y1={`${(i + 1) * 12.5}%`}
              x2="100%"
              y2={`${(i + 1) * 12.5}%`}
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.3"
              strokeDasharray="5 5"
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`grid-v-${i}`}
              x1={`${(i + 1) * 12.5}%`}
              y1="0"
              x2={`${(i + 1) * 12.5}%`}
              y2="100%"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.3"
              strokeDasharray="5 5"
            />
          ))}
        </svg>

        {/* Dynamic data flow line based on mouse position */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.path
            d={`M0,${50 + mousePosition.y * 20} C${20 + mousePosition.x * 30},${
              30 + mousePosition.y * 40
            },${60 + mousePosition.x * 20},${
              70 - mousePosition.y * 30
            },100,${50 - mousePosition.y * 20}`}
            stroke="var(--color-brand-primary)"
            strokeWidth="1"
            strokeOpacity="0.1"
            fill="none"
            animate={{
              d: `M0,${50 + mousePosition.y * 20} C${
                20 + mousePosition.x * 30
              },${30 + mousePosition.y * 40},${60 + mousePosition.x * 20},${
                70 - mousePosition.y * 30
              },100,${50 - mousePosition.y * 20}`,
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>

      {/* Technical system status bar */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-divider bg-bg-tertiary/50 backdrop-blur-sm hidden md:block">
        <div className="container mx-auto py-16 md:py-32 px-4 md:px-8 max-w-7xl relative z-10">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse mr-2"></div>
              <span className="text-xs font-mono text-text-secondary">
                CTA.SECTION
              </span>
            </div>
            <div className="text-xs font-mono text-text-tertiary">
              RESPONSE/{techData.responseTime}hrs
            </div>
          </div>
          <div className="text-xs font-mono text-text-tertiary">
            STATUS/READY • SYS/{techData.systemReadiness}%
          </div>
        </div>
      </div>

      <div className="container mx-auto relative z-10 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Content area with technical styling */}
          <div className="bg-bg-card/40 backdrop-blur-sm border border-divider rounded-lg p-8 md:p-12 relative">
            {/* Technical frame corners */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-brand-primary"></div>
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-brand-primary"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-brand-primary"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-brand-primary"></div>

            {/* Technical scan line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent pointer-events-none"
              style={{ top: "20%" }}
              animate={{
                top: ["0%", "100%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
              }}
            />

            {/* Content with animated reveals */}
            <div ref={headingRef} className="text-center mb-8">
              <TextReveal direction="up" delay={0.2} className="mb-6">
                <Heading
                  level={2}
                  className="text-[clamp(2rem,3.5vw+1rem,3rem)] font-heading font-bold text-heading"
                >
                  <RichText content={heading} className="preserve-whitespace" />
                </Heading>
              </TextReveal>

              <ScrollReveal direction="up" delay={0.4}>
                <Text className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto">
                  <RichText content={content} className="preserve-whitespace" />
                </Text>
              </ScrollReveal>
            </div>

            {/* CTA Button with technical styling */}
            <div className="flex justify-center mt-10">
              <div className="relative">
                {/* Technical indicators */}
                <div className="absolute -left-4 -top-4 w-3 h-3 border-t border-l border-brand-primary hidden md:block"></div>
                <div className="absolute -right-4 -top-4 w-3 h-3 border-t border-r border-brand-primary hidden md:block"></div>
                <div className="absolute -left-4 -bottom-4 w-3 h-3 border-b border-l border-brand-primary hidden md:block"></div>
                <div className="absolute -right-4 -bottom-4 w-3 h-3 border-b border-r border-brand-primary hidden md:block"></div>

                {/* Button with hover effects */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setIsButtonHovered(true)}
                  onHoverEnd={() => setIsButtonHovered(false)}
                >
                  <Link
                    href={ctaLink}
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium overflow-hidden group"
                  >
                    {/* Button background with angled corners */}
                    <span className="absolute inset-0 bg-gradient-button group-hover:bg-gradient-button-hover transition-colors duration-300 clip-polygon"></span>

                    {/* Pulse overlay on hover */}
                    <motion.span
                      className="absolute inset-0 bg-white rounded-sm"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isButtonHovered ? [0, 0.1, 0] : 0,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: isButtonHovered ? Infinity : 0,
                        repeatType: "loop",
                      }}
                    ></motion.span>

                    {/* Button text */}
                    <span className="relative text-white font-medium">
                      <RichText content={ctaText} />
                    </span>

                    {/* Technical arrow indicator */}
                    <svg
                      className="relative ml-2 w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                        initial={{ pathLength: 0.3, opacity: 0.8 }}
                        animate={{
                          pathLength: isButtonHovered ? 1 : 0.3,
                          opacity: isButtonHovered ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    </svg>
                  </Link>

                  {/* Technical measurement */}
                  <motion.div
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-[10px] font-mono text-text-tertiary whitespace-nowrap hidden md:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isButtonHovered ? 1 : 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    INTENT.EXECUTE • VER/{techData.ctaVersion}
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Technical data readout */}
            <div className="mt-16 pt-4 border-t border-divider">
              <div className="flex flex-wrap justify-between items-center">
                <div className="text-xs font-mono text-text-tertiary mb-2 md:mb-0">
                  DATA.TIMESTAMP • {new Date().toISOString().split("T")[0]}
                </div>
                <div className="flex items-center">
                  <div className="text-xs font-mono text-text-tertiary mr-3">
                    SYSTEM.READY
                  </div>
                  <div className="w-20 h-1 bg-bg-tertiary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-brand-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${techData.systemReadiness}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical annotation markers */}
          <div className="absolute bottom-4 left-8 hidden lg:block">
            <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
              <AnimatedPath
                d="M0,30 C40,30 60,60 120,60"
                stroke="var(--color-accent-oceanic)"
                strokeWidth="1"
                strokeDasharray="4 2"
                delay={0.8}
              />
              <motion.circle
                cx="120"
                cy="60"
                r="3"
                fill="var(--color-accent-oceanic)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1.2 }}
              />
              <motion.text
                x="85"
                y="45"
                fill="var(--color-accent-oceanic)"
                fontSize="10"
                fontFamily="monospace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1.4 }}
              >
                CONTACT.NEXT
              </motion.text>
            </svg>
          </div>
        </div>

        {/* Technical coordinate readout */}
        <motion.div
          className="absolute bottom-4 right-4 text-xs font-mono text-accent-oceanic hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {`LOC/${Math.round(mousePosition.x * 100)}:${Math.round(
            mousePosition.y * 100
          )}`}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutCTA;
