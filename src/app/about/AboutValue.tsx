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
import RichText from "@/components/common/Typography/RichText";
import { cn } from "@/utils/classNames";

interface ValueItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

interface AboutValuesProps {
  heading: string;
  introduction: string;
  items: ValueItem[];
  className?: string;
}

const AboutValues: React.FC<AboutValuesProps> = ({
  heading,
  introduction,
  items,
  className,
}) => {
  // Refs for scroll and animation tracking
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  // Improve inView with once:true and more generous margins
  const isHeadingInView = useInView(headingRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });

  // Active value item tracking
  const [activeItem, setActiveItem] = useState<string>(items[0]?.id || "");

  // Technical display values
  const [techValues] = useState({
    systemEfficiency: Math.floor(Math.random() * 10) + 90, // 90-99%
    coreValues: items.length,
    operatingMode: ["ANALYTICAL", "STRATEGIC", "PRAGMATIC"][
      Math.floor(Math.random() * 3)
    ],
  });

  // Mouse tracking for interactive elements
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Scroll-driven animations
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

  // Handle mouse movement for interactive elements
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
  };

  // Custom stagger variants for better coordination
  const customStaggerVariants = {
    ...staggerContainerVariants,
    visible: {
      ...staggerContainerVariants.visible,
      transition: {
        ...staggerContainerVariants.visible.transition,
        delayChildren: 0.4, // Add delay for better coordination with heading
        staggerChildren: 0.15, // Slightly slower staggering
      }
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      className={cn(
        "relative bg-bg-secondary overflow-hidden py-20",
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

        {/* Technical measurement grid */}
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

      {/* Technical status bar */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-divider bg-bg-tertiary/30 backdrop-blur-sm hidden md:block">
        <div className="container mx-auto py-16 md:py-32 px-4 md:px-8 max-w-7xl relative z-10">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse mr-2"></div>
              <span className="text-xs font-mono text-text-secondary">
                VALUES.SECTION
              </span>
            </div>
            <div className="text-xs font-mono text-text-tertiary">
              SYS/{techValues.operatingMode}
            </div>
          </div>
          <div className="text-xs font-mono text-text-tertiary">
            PRINCIPLES/{techValues.coreValues} • EFF/
            {techValues.systemEfficiency}%
          </div>
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section header with technical styling */}
        <div ref={headingRef} className="max-w-3xl mx-auto text-center mb-16">
          <TextReveal direction="up" delay={0.2} className="mb-6" once={true}>
            <Heading
              level={2}
              className="text-[clamp(1.8rem,3.2vw+1rem,2.4rem)] font-heading font-bold text-heading relative inline-block"
            >
              <RichText content={heading} className="preserve-whitespace" />
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

          <ScrollReveal direction="up" delay={0.3} once={true}>
            <Text className="text-center text-text-secondary text-lg md:text-xl">
              <RichText content={introduction} className="preserve-whitespace" />
            </Text>
          </ScrollReveal>

          {/* Technical measurement overlay */}
          <motion.div
            className="absolute -left-16 top-1/2 -translate-y-1/2 hidden xl:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHeadingInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
              <AnimatedPath
                d="M48,12 L8,12 M8,12 L18,6 M8,12 L18,18"
                stroke="var(--color-accent-oceanic)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </svg>
          </motion.div>
        </div>

        {/* Values display with technical styling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Values sidebar - navigation with selected indicator */}
          <div className="lg:col-span-4 flex flex-col order-2 lg:order-1">
            <motion.div
              variants={customStaggerVariants}
              initial="hidden"
              animate={isHeadingInView ? "visible" : "hidden"}
              className="bg-bg-card/40 backdrop-blur-sm border border-divider rounded-lg p-6 relative"
            >
              {/* Technical frame corners */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand-primary"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand-primary"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand-primary"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand-primary"></div>

              {/* Technical header with values system */}
              <div className="border-b border-divider pb-3 mb-6">
                <div className="flex items-center justify-between">
                  <Text className="font-heading font-semibold">
                    Core Values
                  </Text>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-accent-oceanic mr-2 animate-pulse"></div>
                    <span className="text-xs font-mono text-accent-oceanic">
                      {techValues.coreValues}/4
                    </span>
                  </div>
                </div>
              </div>

              {/* Values navigation list with technical readouts */}
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.button
                    key={item.id}
                    variants={staggerItemVariants}
                    className={cn(
                      "w-full text-left p-4 rounded-sm border-l-4 relative transition-all duration-300",
                      activeItem === item.id
                        ? "bg-bg-hover border-brand-primary"
                        : "bg-bg-tertiary/30 border-transparent hover:bg-bg-tertiary/50"
                    )}
                    onClick={() => setActiveItem(item.id)}
                  >
                    {/* Technical value item structure */}
                    <div className="flex items-start">
                      <div className="text-brand-primary font-mono text-xl font-bold mr-3">
                        <RichText content={item.number} />
                      </div>
                      <div>
                        <Text
                          weight="medium"
                          className={cn(
                            activeItem === item.id
                              ? "text-brand-primary"
                              : "text-text-primary"
                          )}
                        >
                          <RichText content={item.title} />
                        </Text>
                        <div
                          className={cn(
                            "h-1 mt-2 bg-brand-primary/30 rounded-full overflow-hidden",
                            activeItem === item.id ? "w-full" : "w-0"
                          )}
                        >
                          <motion.div
                            className="h-full bg-brand-primary"
                            initial={{ width: "0%" }}
                            animate={{
                              width: activeItem === item.id ? "100%" : "0%",
                            }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Technical measurement indicator */}
                    {activeItem === item.id && (
                      <div className="absolute -right-2 -top-2 w-4 h-4">
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <motion.path
                            d="M1 8h14M8 1v14"
                            stroke="var(--color-brand-primary)"
                            strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Technical data panel */}
              <div className="mt-6 pt-4 border-t border-divider">
                <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                  <span>MODE/{techValues.operatingMode}</span>
                  <div className="flex items-center">
                    <div className="w-10 h-1 bg-bg-tertiary mr-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-brand-primary"
                        style={{ width: `${techValues.systemEfficiency}%` }}
                      />
                    </div>
                    <span>{techValues.systemEfficiency}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Value detail panel with technical styling */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            {items.map((item) => (
              <motion.div
                key={item.id}
                className={cn(
                  "relative bg-bg-card/50 backdrop-blur-sm border border-divider rounded-lg p-8 transition-all duration-500",
                  activeItem === item.id ? "opacity-100" : "opacity-0 absolute"
                )}
                style={{
                  display: activeItem === item.id ? "block" : "none",
                }}
              >
                {/* Technical frame markers */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-brand-primary/70"></div>
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-brand-primary/70"></div>
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-brand-primary/70"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-brand-primary/70"></div>

                {/* Technical scan line */}
                <motion.div
                  className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeItem === item.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"
                    style={{ top: "15%" }}
                    animate={{
                      top: ["0%", "100%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "linear",
                    }}
                  />
                </motion.div>

                {/* Value content with technical indicators */}
                <div className="mb-6 flex items-center">
                  <div className="flex items-center justify-center mr-4 w-12 h-12 rounded-sm bg-brand-primary text-white font-mono text-xl font-bold">
                    <RichText content={item.number} />
                  </div>
                  <Heading
                    level={3}
                    className="text-2xl md:text-3xl font-heading text-heading"
                  >
                    <RichText content={item.title} className="preserve-whitespace" />
                  </Heading>
                </div>

                <Text className="text-lg text-text-primary leading-relaxed">
                  <RichText content={item.description} className="preserve-whitespace" />
                </Text>

                {/* Technical coordinate readout */}
                <div className="mt-8 pt-4 border-t border-divider flex items-center justify-between">
                  <div className="text-xs font-mono text-text-tertiary">
                    VALUE.ID/{item.id} • PRIORITY/{item.number}
                  </div>
                  <div className="hidden md:flex items-center text-xs font-mono text-accent-oceanic">
                    <div className="flex gap-2 mr-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={`key-${i}`}
                          className={cn(
                            "w-1 h-4 rounded-sm",
                            i < parseInt(item.number) % 3
                              ? "bg-accent-oceanic"
                              : "bg-accent-oceanic/30"
                          )}
                        ></div>
                      ))}
                    </div>
                    <span>KEY PRINCIPLE</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical coordinate readout */}
        <motion.div
          className="absolute bottom-6 right-6 text-xs font-mono text-accent-oceanic hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {`LOC/${Math.round(mousePosition.x * 100)}:${Math.round(mousePosition.y * 100)}`}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutValues;
