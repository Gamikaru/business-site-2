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

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface AboutTimelineProps {
  heading: string;
  introduction: string;
  events: TimelineEvent[];
  className?: string;
}

const AboutTimeline: React.FC<AboutTimelineProps> = ({
  heading,
  introduction,
  events,
  className,
}) => {
  // Refs for animation and scroll tracking
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, {
    once: false,
    margin: "-10% 0px",
  });

  // Selected event tracking
  const [activeEvent, setActiveEvent] = useState<number>(0);

  // Technical data display
  const [techData] = useState({
    timelineVersion: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
    eventCount: events.length,
    dataIntegrity: Math.floor(Math.random() * 10) + 90, // 90-99%
    timeSpan:
      events.length > 0
        ? `${events[events.length - 1].year}-${events[0].year}`
        : "N/A",
  });

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
    [0.05, 0.1, 0.05]
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
      className={cn("relative bg-bg-primary overflow-hidden py-20", className)}
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
                TIMELINE.SECTION
              </span>
            </div>
            <div className="text-xs font-mono text-text-tertiary">
              SPAN/{techData.timeSpan}
            </div>
          </div>
          <div className="text-xs font-mono text-text-tertiary">
            EVENTS/{techData.eventCount} • INT/{techData.dataIntegrity}%
          </div>
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section heading with technical styling */}
        <div ref={headingRef} className="max-w-3xl mx-auto text-center mb-16">
          <TextReveal direction="up" delay={0.2} className="mb-6">
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

          <ScrollReveal direction="up" delay={0.3}>
            <Text className="text-center text-text-secondary text-lg md:text-xl">
              {introduction}
            </Text>
          </ScrollReveal>

          {/* Technical measurement overlay */}
          <motion.div
            className="absolute -right-16 top-1/2 -translate-y-1/2 hidden xl:block"
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
          </motion.div>
        </div>

        {/* Timeline display with technical styling */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate={isHeadingInView ? "visible" : "hidden"}
            className="relative"
          >
            {/* Vertical timeline line */}
            <div className="absolute left-[28px] lg:left-1/2 lg:ml-[-1px] top-0 bottom-0 w-[2px] bg-brand-primary/30"></div>

            {/* Timeline measurement markers */}
            <div className="absolute left-0 lg:left-1/2 lg:-ml-16 top-0 bottom-0 w-8 flex flex-col justify-between py-4 hidden md:flex">
              {events.map((_, index) => (
                <div
                  key={`time-marker-${index}`}
                  className="text-xs font-mono text-accent-oceanic"
                >
                  T{index}
                </div>
              ))}
            </div>

            {/* Timeline events */}
            {events.map((event, index) => (
              <motion.div
                key={index}
                variants={staggerItemVariants}
                className={cn(
                  "relative mb-12 last:mb-0 flex",
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                )}
                onMouseEnter={() => setActiveEvent(index)}
              >
                {/* Year and node indicator */}
                <div className="flex-none relative z-10 mr-8 lg:mx-auto lg:px-8">
                  <div
                    className={cn(
                      "flex items-center justify-center w-14 h-14 rounded-full border-2 bg-bg-primary transition-colors duration-300",
                      activeEvent === index
                        ? "border-brand-primary text-brand-primary"
                        : "border-accent-oceanic/30 text-text-secondary"
                    )}
                  >
                    <Text className="font-mono font-bold" weight="bold">
                      {event.year}
                    </Text>
                  </div>

                  {/* Circuit connector line */}
                  <svg
                    className={cn(
                      "absolute top-1/2 h-[2px] -mt-px transition-all duration-300",
                      index % 2 === 0
                        ? "right-full lg:left-full"
                        : "right-full lg:right-full",
                      activeEvent === index
                        ? "stroke-brand-primary"
                        : "stroke-accent-oceanic/30"
                    )}
                    width="40"
                    height="2"
                    viewBox="0 0 40 2"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 1L40 1" strokeWidth="2" strokeDasharray="4 2" />
                  </svg>
                </div>

                {/* Event content card with technical styling */}
                <div
                  className={cn(
                    "flex-1 lg:w-[calc(50%-50px)]",
                    index % 2 === 0 ? "lg:pr-8" : "lg:pl-8"
                  )}
                >
                  <div
                    className={cn(
                      "bg-bg-card/50 backdrop-blur-sm border rounded-lg p-6 transition-all duration-300",
                      activeEvent === index
                        ? "border-brand-primary shadow-md"
                        : "border-divider"
                    )}
                  >
                    {/* Technical frame corners */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent-oceanic/40"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent-oceanic/40"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-accent-oceanic/40"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent-oceanic/40"></div>

                    {/* Event title and description */}
                    <Heading
                      level={4}
                      className="mb-3 text-xl font-heading text-heading font-semibold"
                    >
                      {event.title}
                    </Heading>

                    <Text className="text-text-primary">
                      {event.description}
                    </Text>

                    {/* Technical data readout */}
                    <div className="mt-4 pt-3 border-t border-divider flex justify-between items-center text-[10px] font-mono text-text-tertiary">
                      <span>EVENT/{index + 1}</span>
                      <span>{event.year}</span>
                    </div>

                    {/* Technical data visualization bar */}
                    <div className="mt-2 h-1 w-full bg-bg-tertiary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent-oceanic"
                        initial={{ width: "0%" }}
                        animate={{
                          width: activeEvent === index ? "100%" : "30%",
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Technical timeline markers */}
            <div className="absolute -left-4 md:left-[-60px] top-0 bottom-0 hidden lg:flex flex-col justify-between py-4">
              {events.map((event, index) => (
                <div
                  key={`year-${index}`}
                  className={cn(
                    "flex items-center text-xs font-mono transition-colors duration-300",
                    activeEvent === index
                      ? "text-brand-primary"
                      : "text-text-tertiary"
                  )}
                >
                  <div
                    className={cn(
                      "w-3 h-px mr-2 transition-colors duration-300",
                      activeEvent === index
                        ? "bg-brand-primary"
                        : "bg-text-tertiary"
                    )}
                  ></div>
                  <span>{event.year}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Technical measurement readout */}
          <motion.div
            className="absolute bottom-8 right-8 bg-bg-card/70 backdrop-blur-sm border border-divider rounded px-4 py-2 hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="text-xs font-mono text-text-tertiary flex flex-col">
              <div className="flex justify-between mb-1">
                <span>TIMELINE/{techData.timelineVersion}</span>
                <span>EVENTS/{techData.eventCount}</span>
              </div>
              <div className="h-1 w-full bg-bg-tertiary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${techData.dataIntegrity}%` }}
                  transition={{ duration: 1, delay: 1.2 }}
                />
              </div>
              <div className="text-right mt-1">
                INTEGRITY/{techData.dataIntegrity}%
              </div>
            </div>
          </motion.div>
        </div>

        {/* Technical coordinate readout */}
        <motion.div
          className="absolute bottom-4 left-4 text-xs font-mono text-accent-oceanic hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {`POS/${Math.round(mousePosition.x * 100)}:${Math.round(mousePosition.y * 100)}`}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutTimeline;
