"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ScrollReveal,
  TextReveal,
  AnimatedPath,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/core/Animations";
import { Heading, Text } from "@/components/common/Typography";
import { cn } from "@/utils/classNames";

interface StatItem {
  value: string;
  label: string;
}

interface AboutBioProps {
  heading: string;
  content: string;
  stats: StatItem[];
  className?: string;
}

const AboutBio: React.FC<AboutBioProps> = ({
  heading,
  content,
  stats,
  className,
}) => {
  // Format content to handle paragraphs
  const paragraphs = content.split("\n\n").filter((p) => p.trim() !== "");

  // Refs for animations and scroll tracking
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, {
    once: false,
    margin: "-10% 0px",
  });

  // Mouse tracking for interactive elements
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const gridOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.05, 0.1, 0.05]
  );

  // Technical data
  const [techValues] = useState({
    algorithmEfficiency: Math.floor(Math.random() * 20) + 80, // 80-99%
    processorLoad: Math.floor(Math.random() * 30) + 20, // 20-50%
    memoryUsage: Math.floor(Math.random() * 40) + 30, // 30-70%
    sectionWidth: Math.floor(Math.random() * 200) + 600, // 600-800px
  });

  // Handle mouse movements for interactive elements
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
      className={cn("relative bg-bg-secondary overflow-hidden", className)}
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

        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-circuit"></div>

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
            d={`M0,${50 + mousePosition.y * 20} C${20 + mousePosition.x * 30},${30 + mousePosition.y * 40},${60 + mousePosition.x * 20},${70 - mousePosition.y * 30},100,${50 - mousePosition.y * 20}`}
            stroke="var(--color-brand-primary)"
            strokeWidth="1"
            strokeOpacity="0.1"
            fill="none"
            animate={{
              d: `M0,${50 + mousePosition.y * 20} C${20 + mousePosition.x * 30},${30 + mousePosition.y * 40},${60 + mousePosition.x * 20},${70 - mousePosition.y * 30},100,${50 - mousePosition.y * 20}`,
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>

      {/* Technical system status bar */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-divider bg-bg-tertiary/30 backdrop-blur-sm hidden md:block">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse mr-2"></div>
              <span className="text-xs font-mono text-text-secondary">
                BIO.SECTION
              </span>
            </div>
            <div className="text-xs font-mono text-text-tertiary">
              CPU/{techValues.processorLoad}%
            </div>
            <div className="text-xs font-mono text-text-tertiary">
              MEM/{techValues.memoryUsage}%
            </div>
          </div>
          <div className="text-xs font-mono text-text-tertiary">
            EFFICIENCY/{techValues.algorithmEfficiency}%
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 md:py-24 relative z-10">
        {/* Section heading with technical styling */}
        <div
          ref={headingRef}
          className="mb-12 md:mb-16 max-w-4xl mx-auto relative"
        >
          {/* Technical frame markers */}
          <motion.div
            className="absolute -left-10 top-1/2 -translate-y-1/2 w-4 h-px bg-brand-primary hidden md:block"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHeadingInView ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ transformOrigin: "right" }}
          />

          <TextReveal direction="up" delay={0.2} className="relative">
            <Heading
              level={2}
              className="text-[clamp(1.8rem,3.2vw+1rem,2.4rem)] font-heading font-bold text-heading relative inline-block"
            >
              {heading}
              <motion.div
                className="absolute -bottom-3 left-0 right-0 h-[3px]"
                initial={{ width: 0 }}
                animate={{ width: isHeadingInView ? "100%" : "0%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="h-full bg-gradient-to-r from-transparent via-brand-primary to-transparent"></div>
              </motion.div>
            </Heading>
          </TextReveal>

          {/* Technical measurement readout */}
          <motion.div
            className="absolute -right-12 top-1/2 -translate-y-1/2 hidden md:block text-xs font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHeadingInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
              <AnimatedPath
                d="M0,12 L40,12 M40,12 L30,6 M40,12 L30,18"
                stroke="var(--color-accent-oceanic)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </svg>
            <div className="text-accent-oceanic mt-1">
              W/{techValues.sectionWidth}px
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Content column with technical styling */}
          <div className="lg:col-span-8 relative">
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate={isHeadingInView ? "visible" : "hidden"}
              className="space-y-6"
            >
              {/* Biography paragraphs with technical framing */}
              {paragraphs.map((paragraph, index) => (
                <motion.div
                  key={index}
                  variants={staggerItemVariants}
                  className="relative bg-bg-secondary/60 backdrop-blur-sm rounded p-6 border-l-2 border-brand-primary/70"
                >
                  <Text className="text-base md:text-lg text-text-primary leading-relaxed">
                    {paragraph}
                  </Text>

                  {/* Technical indicators for first paragraph */}
                  {index === 0 && (
                    <>
                      <div className="absolute -right-2 -top-2 w-6 h-6 hidden md:block">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <motion.path
                            d="M2 22L22 2M12 2V6M6 2H2V6M22 18V22H18M22 12H18M2 12H6M12 22V18"
                            stroke="var(--color-brand-primary)"
                            strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 1 }}
                          />
                        </svg>
                      </div>
                      <motion.div
                        className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-brand-primary hidden md:block"
                        animate={{
                          boxShadow: [
                            "0 0 0px rgba(var(--color-brand-primary-rgb), 0)",
                            "0 0 10px rgba(var(--color-brand-primary-rgb), 0.7)",
                            "0 0 0px rgba(var(--color-brand-primary-rgb), 0)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      />
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Technical coordinate readout */}
            <motion.div
              className="absolute -bottom-6 left-0 text-xs font-mono text-accent-oceanic hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              {`POS/${Math.round(mousePosition.x * 100)}:${Math.round(mousePosition.y * 100)}`}
            </motion.div>
          </div>

          {/* Stats column with technical styling */}
          <div className="lg:col-span-4 relative">
            <ScrollReveal direction="up" delay={0.3}>
              <div className="bg-bg-tertiary/30 border border-divider backdrop-blur-sm rounded-lg p-6 relative">
                {/* Technical corner details */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand-primary"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand-primary"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand-primary"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand-primary"></div>

                {/* Section heading with technical styling */}
                <div className="border-b border-divider pb-3 mb-6">
                  <div className="flex items-center justify-between">
                    <Text className="text-lg font-heading font-semibold tracking-tight">
                      Metrics
                    </Text>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-accent-oceanic mr-2 animate-pulse"></div>
                      <span className="text-xs font-mono text-accent-oceanic">
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats display with technical styling */}
                <div className="space-y-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
                    >
                      {/* Value with measurement tick */}
                      <div className="flex mb-2 items-end">
                        <Text className="text-4xl font-heading font-bold text-accent-primary">
                          {stat.value}
                        </Text>
                        {/* Technical measurement tick */}
                        <motion.div
                          className="h-8 ml-2 flex flex-col items-center justify-end"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 32 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.6 + index * 0.2,
                          }}
                        >
                          <div className="h-full w-px bg-accent-oceanic/50"></div>
                          <div className="flex space-x-px mt-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={`tick-${i}`}
                                className="w-px h-2 bg-accent-oceanic/50"
                              ></div>
                            ))}
                          </div>
                        </motion.div>
                      </div>

                      {/* Label with progress bar */}
                      <Text className="text-text-secondary font-medium">
                        {stat.label}
                      </Text>

                      {/* Technical data visualization bar */}
                      <div className="mt-2 h-1 w-full bg-bg-tertiary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-brand-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${70 + index * 10}%` }}
                          transition={{ duration: 1, delay: 0.7 + index * 0.2 }}
                        />
                      </div>

                      {/* Technical measurement values */}
                      <div className="flex justify-between mt-1 text-[10px] font-mono text-text-tertiary">
                        <span>0</span>
                        <span>
                          {index === 0 ? "10+" : index === 1 ? "30+" : "5+"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Technical data readout */}
                <div className="mt-6 pt-4 border-t border-divider">
                  <div className="flex justify-between text-[10px] font-mono text-text-tertiary">
                    <span>DATA/BIO.STATS</span>
                    <span>VER/2.4.1</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutBio;
