"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { cn } from "@/utils/classNames";
import { Heading } from "@/components/common/Typography";
import RichText from "@/components/common/Typography/RichText";
import { Button } from "@/components/common/Button";
import { ScrollReveal, AnimatedPath } from "@/components/core/Animations";

interface CallToActionProps {
  heading: string;
  content: string;
  primaryCTA: {
    text: string;
    link: string;
  };
  secondaryCTA: {
    text: string;
    link: string;
  };
  availabilityNote: string;
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  heading,
  content,
  primaryCTA,
  secondaryCTA,
  availabilityNote,
  className,
}) => {
  // References for scroll effects and animation triggers
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isContentInView = useInView(contentRef, {
    once: false,
    margin: "-100px",
  });

  // Scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Transform values for parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const gridOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.05, 0.1, 0.05]
  );

  // Generate technical data for display
  const [techValues] = React.useState({
    responseTime: Math.floor(Math.random() * 50) + 10,
    conversionRate: Math.floor(Math.random() * 20) + 80,
    systemUptime: Math.floor(Math.random() * 10000) + 20000, // in minutes
  });

  return (
    <motion.section
      ref={sectionRef}
      className={cn(
        "relative bg-bg-primary overflow-hidden py-16 md:py-24",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Technical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Blueprint grid with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            y: backgroundY,
            opacity: gridOpacity,
          }}
        >
          <div className="absolute inset-0 bg-blueprint-grid"></div>
        </motion.div>

        {/* Technical pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-circuit"></div>

        {/* Technical measurement grid */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid measurement lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.line
              key={`grid-h-${i}`}
              x1="0"
              y1={`${(i + 1) * 12.5}%`}
              x2="100%"
              y2={`${(i + 1) * 12.5}%`}
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.3"
              strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.line
              key={`grid-v-${i}`}
              x1={`${(i + 1) * 12.5}%`}
              y1="0"
              x2={`${(i + 1) * 12.5}%`}
              y2="100%"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.3"
              strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))}
        </svg>
      </div>

      {/* Technical system status bar */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-divider bg-bg-tertiary/30 backdrop-blur-sm hidden md:block">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse mr-2"></div>
              <span className="text-xs font-mono text-text-secondary">
                SYS.ACTIVE
              </span>
            </div>
            <div className="text-xs font-mono text-text-tertiary">
              RESP/{techValues.responseTime}ms
            </div>
            <div className="text-xs font-mono text-text-tertiary">
              CONV/{techValues.conversionRate}%
            </div>
          </div>
          <div className="text-xs font-mono text-text-tertiary">
            UP/{Math.floor(techValues.systemUptime / 60)}h{" "}
            {techValues.systemUptime % 60}m
          </div>
        </div>
      </div>

<div className="container mx-auto py-16 md:py-32 px-4 md:px-8 max-w-7xl relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Technical section identifier */}
          <motion.div
            className="absolute -top-4 left-6 hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="px-2 py-1 bg-bg-primary text-xs font-mono text-accent-oceanic border border-accent-oceanic/50">
              SECTION.CTA
            </div>
          </motion.div>

          <div ref={contentRef} className="relative">
            {/* Main content frame */}
            <motion.div
              className="absolute -inset-6 border border-accent-oceanic/20 rounded-lg hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: isContentInView ? 0.8 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Corner measurement markers */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent-oceanic/50"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent-oceanic/50"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accent-oceanic/50"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent-oceanic/50"></div>
            </motion.div>

            {/* Heading with animated reveal */}
            <ScrollReveal
              direction="up"
              delay={0.2}
              className="text-center mb-8"
            >
              <Heading
                level={2}
                className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight"
              >
                <RichText content={heading} />
              </Heading>
            </ScrollReveal>

            {/* Content with technical styling */}
            <ScrollReveal
              direction="up"
              delay={0.3}
              className="text-center mb-12"
            >
              <div className="relative p-6 bg-bg-glass backdrop-blur-sm rounded-lg border border-divider max-w-2xl mx-auto">
                <RichText
                  content={content}
                  className="text-lg md:text-xl leading-relaxed"
                />

                {/* Technical decoration */}
                <motion.div
                  className="absolute -right-2 -bottom-2 w-6 h-6"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: isContentInView ? 1 : 0,
                    scale: isContentInView ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 22L22 2M12 2V6M6 2H2V6M22 18V22H18M22 12H18M2 12H6M12 22V18"
                      stroke="var(--color-brand-primary)"
                      strokeWidth="1"
                    />
                  </svg>
                </motion.div>
              </div>
            </ScrollReveal>

            {/* Call to action buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Primary CTA */}
              <ScrollReveal
                direction="left"
                delay={0.4}
                className="flex justify-center md:justify-end"
              >
                <div className="relative group perspective-effect">
                  {/* Animated technical frame */}
                  <motion.div
                    className="absolute -inset-3 border border-dashed border-brand-primary/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Glowing button background */}
                  <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-accent-oceanic rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    animate={{
                      opacity: [0, 0.1, 0.2, 0.1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />

                  <Button
                    intent="gradient"
                    size="lg"
                    href={primaryCTA.link}
                    className="relative w-full md:w-auto"
                    icon={
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
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    }
                    iconPosition="right"
                  >
                    {primaryCTA.text}
                  </Button>

                  {/* Technical decoration */}
                  <motion.div
                    className="absolute -right-16 top-1/2 -translate-y-1/2 hidden md:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                      <AnimatedPath
                        d="M0,12 L40,12 M40,12 L30,6 M40,12 L30,18"
                        stroke="var(--color-accent-oceanic)"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    </svg>
                  </motion.div>
                </div>
              </ScrollReveal>

              {/* Secondary CTA */}
              <ScrollReveal
                direction="right"
                delay={0.5}
                className="flex justify-center md:justify-start"
              >
                <div className="relative group perspective-effect">
                  {/* Hover effect */}
                  <motion.div
                    className="absolute -inset-3 border border-dashed border-accent-oceanic/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />

                  <Button
                    intent="outline"
                    size="lg"
                    href={secondaryCTA.link}
                    className="relative w-full md:w-auto"
                  >
                    {secondaryCTA.text}
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            {/* Availability note */}
            <ScrollReveal direction="up" delay={0.6} className="text-center">
              <div className="relative inline-block">
                <RichText
                  content={availabilityNote}
                  className="text-text-secondary text-sm"
                />

                {/* Technical indicator */}
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-2 hidden md:block"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-accent-oceanic"></div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Technical metrics display */}
        <motion.div
          className="absolute -bottom-4 right-8 text-[10px] font-mono text-accent-oceanic/70 hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          NEXT/CONTACT
        </motion.div>
      </div>

      {/* Technical grid markers at bottom */}
      <div className="absolute bottom-4 left-4 right-4 hidden lg:flex justify-between items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`marker-${i}`}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
          >
            <div className="w-px h-4 bg-accent-oceanic/50"></div>
            <span className="text-[10px] font-mono text-accent-oceanic/60">
              {i * 25}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CallToAction;
