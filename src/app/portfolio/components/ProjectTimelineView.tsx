"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/common/Icons/Icon";
import { Text, Heading } from "@/components/common/Typography";
import { cn } from "@/utils/classNames";
import { TickStrip } from "@/components/common/Divider";

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  imageSrc: string;
  imageAlt: string;
  ctaText: string;
  ctaLink: string;
  categories: string[];
}

interface ProjectTimelineViewProps {
  projects: Project[];
}

// We're using the AnimatedPath component directly in JSX so we need to keep it
const AnimatedPath: React.FC<{
  d: string;
  stroke: string;
  strokeWidth: number;
  fill: string;
  delay: number;
  strokeDasharray?: string;
}> = ({ d, stroke, strokeWidth, fill, delay, strokeDasharray }) => {
  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeDasharray={strokeDasharray}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, delay }}
    />
  );
};

const ProjectTimelineView: React.FC<ProjectTimelineViewProps> = ({ projects }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef, { once: false, margin: "-10% 0px" });
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [activePulse, setActivePulse] = useState<number | null>(null);
  const [connectionPaths, setConnectionPaths] = useState<{id: string, path: string}[]>([]);
  const [uniqueId] = useState(`timeline-${Math.floor(Math.random() * 10000)}`);
  const [isFlashing, setIsFlashing] = useState<string | null>(null);

  // Years for timeline markers
  const startYear = 2020;
  const endYear = 2025;

  // Random technical metrics for projects
  const [projectMetrics] = useState(() =>
    projects.map(project => ({
      id: project.id,
      complexity: Math.floor(Math.random() * 100),
      renderQuality: Math.floor(Math.random() * 10) + 90,
      systemStatus: Math.random() > 0.8 ? "TESTING" : "OPERATIONAL",
    }))
  );

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });

  const timelineOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.7, 1, 1, 0.7]
  );

  // Update timeline progress based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => {
      setTimelineProgress(Math.min(1, Math.max(0, (v - 0.1) / 0.5)));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  // Calculate connection paths for data pulses
  useEffect(() => {
    if (!timelineRef.current) return;

    // For simplicity, we'll use a fixed path pattern
    const newPaths = projects.map((project, index) => {
      const side = index % 2 === 0 ? "left" : "right";
      const direction = side === "left" ? -1 : 1;

      // Simple cubic bezier path from center to the side
      const path = `M0,${100 + index * 200} C${30 * direction},${100 + index * 200} ${60 * direction},${100 + index * 200 + 30} ${100 * direction},${100 + index * 200 + 50}`;

      return {
        id: project.id,
        path
      };
    });

    setConnectionPaths(newPaths);
  }, [projects, isInView]);

  // Periodic pulse animation
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      const nextPulse = Math.floor(Math.random() * projects.length);
      setActivePulse(nextPulse);

      setTimeout(() => {
        setActivePulse(null);
      }, 2000);
    }, 4000);

    return () => clearInterval(interval);
  }, [isInView, projects.length]);

  // Occasional flash effect on a random project
  useEffect(() => {
    if (!isInView) return;

    const flashInterval = setInterval(() => {
      if (projects.length > 0) {
        const randomIndex = Math.floor(Math.random() * projects.length);
        const randomProjectId = projects[randomIndex].id;
        setIsFlashing(randomProjectId);
        setTimeout(() => setIsFlashing(null), 150);
      }
    }, 7000);

    return () => clearInterval(flashInterval);
  }, [isInView, projects.length]);

  return (
    <div
      ref={timelineRef}
      className="relative"
      style={{ minHeight: `${projects.length * 320}px` }}
    >
      {/* SVG filter for glitch effect */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id={`${uniqueId}-glitch`}>
            <feFlood floodColor="var(--color-accent-primary)" result="red" />
            <feFlood floodColor="var(--color-accent-oceanic)" result="blue" />
            <feComposite operator="in" in="red" in2="SourceAlpha" result="red-text" />
            <feComposite operator="in" in="blue" in2="SourceAlpha" result="blue-text" />
            <feOffset in="red-text" dx="-2" dy="0" result="red-text-moved" />
            <feOffset in="blue-text" dx="2" dy="0" result="blue-text-moved" />
            <feMerge>
              <feMergeNode in="red-text-moved" />
              <feMergeNode in="blue-text-moved" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Timeline center line with year markers - more architectural style */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 flex flex-col items-center">
        {/* Main vertical line */}
        <motion.div
          className="h-full w-[2px] md:w-[4px] bg-accent-oceanic/40 relative"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isInView ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transformOrigin: "top" }}
        >
          {/* Horizontal measurement ticks */}
          <div className="absolute left-0 top-0 h-full w-1 flex flex-col justify-between">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-[1px] bg-accent-oceanic/30"
              />
            ))}
          </div>

          {/* Timeline measurement markers */}
          {projects.map((_, index) => (
            <motion.div
              key={`marker-${index}`}
              className="absolute left-0 right-0 h-4 flex justify-center items-center"
              style={{ top: `${(index + 1) * (100 / (projects.length + 1))}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <div className={cn(
                "absolute w-6 h-[1px] bg-accent-oceanic/60",
                index % 2 === 0 ? "-left-6" : "-right-6",
                "hidden md:block"
              )} />
              <div className="absolute text-[10px] font-mono text-text-secondary rotate-90 -right-8 md:hidden">
                {(index + 1).toString().padStart(2, '0')}
              </div>
            </motion.div>
          ))}

          {/* Year markers */}
          {Array.from({ length: endYear - startYear + 1 }).map((_, idx) => {
            const year = startYear + idx;
            const position = (idx / (endYear - startYear)) * 100;

            return (
              <div
                key={`year-${year}`}
                className="absolute left-1/2 transform -translate-x-1/2 flex items-center"
                style={{ top: `${position}%` }}
              >
                {/* Year label */}
                <motion.div
                  className="absolute left-6 md:left-12 text-xs font-mono text-accent-oceanic/70"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: isInView ? 1 : 0, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
                >
                  {year}
                </motion.div>
              </div>
            );
          })}

          {/* Timeline progress indicator */}
          <motion.div
            className="absolute left-0 right-0 top-0 bg-accent-primary"
            style={{
              height: `${timelineProgress * 100}%`,
              transformOrigin: "top",
              opacity: timelineOpacity
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Measurement ticks on the side */}
          <div className="absolute left-4 md:left-6 top-0 h-full flex flex-col justify-between">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center",
                  i % 5 === 0 ? "opacity-80" : "opacity-40"
                )}
              >
                <div className={cn(
                  "h-[1px] bg-accent-oceanic/60",
                  i % 5 === 0 ? "w-3" : "w-2"
                )} />
                {i % 5 === 0 && (
                  <span className="text-[8px] font-mono text-accent-oceanic/60 ml-1">
                    {((10 - i) * 10).toString().padStart(3, '0')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Glowing data pulse effect */}
          <AnimatePresence>
            {activePulse !== null && (
              <motion.div
                className="absolute left-0 right-0 h-8 -ml-1 -mr-1"
                style={{
                  top: `${activePulse * (100 / (projects.length))}%`,
                  background: "var(--color-accent-primary)",
                  boxShadow: "0 0 20px rgba(var(--color-accent-primary-rgb), 0.6)"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Connection paths for data flow visualization */}
      <svg className="absolute left-0 top-0 w-full h-full overflow-visible pointer-events-none">
        <g transform={`translate(${window.innerWidth > 768 ? window.innerWidth / 2 : 16}, 0)`}>
          {connectionPaths.map((conn, index) => (
            <React.Fragment key={`conn-${conn.id}`}>
              <AnimatePresence>
                {activePulse === index && (
                  <motion.circle
                    r="6"
                    fill={`url(#${uniqueId}-pulse-gradient)`}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      offsetDistance: ["0%", "100%"],
                    }}
                    exit={{ opacity: 0 }}
                    style={{
                      offsetPath: `path("${conn.path}")`,
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeOut"
                    }}
                  />
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </g>
      </svg>

      {/* Measurement lines */}
      <div className="absolute left-0 right-0 top-8 opacity-30">
        <TickStrip
          height={10}
          segments={21}
          labelEvery={5}
          darkLabels={true}
          glitchEffect={false}
        />
      </div>

      {/* Project cards */}
      <div className="md:ml-[calc(50%-21rem)] space-y-24 md:space-y-40 md:w-[42rem] relative z-10">
        {projects.map((project, index) => {
          const side = index % 2 === 0 ? "left" : "right";

          return (
            <motion.div
              key={project.id}
              data-project-id={project.id}
              className={cn(
                "group relative",
                side === "left" ? "md:text-right" : "md:text-left",
                activeProject === project.id && "z-10"
              )}
              initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : (side === "left" ? -50 : 50) }}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.1 }}
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
              style={{
                filter: isFlashing === project.id ? `url(#${uniqueId}-glitch)` : 'none'
              }}
            >
              {/* Architectural card design */}
              <div
                className={cn(
                  "bg-bg-secondary border border-accent-oceanic/40 transform transition-all duration-300",
                  activeProject === project.id
                    ? "shadow-[0px_0px_20px_0px_rgba(var(--color-accent-primary-rgb),0.2)]"
                    : "hover:shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)]",
                  side === "left" ? "md:mr-12 md:translate-x-3" : "md:ml-12 md:translate-x-[-3px]"
                )}
              >
                {/* Project number indicator - architectural style */}
                <div className={cn(
                  "absolute top-2 bg-bg-glass backdrop-blur-sm border border-accent-oceanic/40 px-3 py-1 font-bold text-xl z-10",
                  side === "left" ? "md:-right-2 right-2" : "md:-left-2 left-2"
                )}>
                  {(index + 1).toString().padStart(2, '0')}
                </div>

                {/* Technical grid overlay and measurements */}
                <div className="absolute top-0 left-0 w-full h-4 overflow-hidden opacity-70 pointer-events-none">
                  <div className="flex justify-between items-center px-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-1 w-1 bg-accent-oceanic/40" />
                    ))}
                  </div>
                </div>

                {/* Image area */}
                <div className="relative overflow-hidden w-full aspect-video">
                  <Image
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    fill
                    className={cn(
                      "object-cover transition-all duration-500",
                      activeProject === project.id ? "grayscale-0 scale-105" : "grayscale-[30%]"
                    )}
                  />

                  {/* Image overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary/70 transition-opacity duration-300",
                    activeProject === project.id ? "opacity-0" : "opacity-20"
                  )} />

                  {/* Technical grid overlay */}
                  <div className="absolute inset-0 bg-blueprint-grid opacity-10" />
                </div>

                {/* Content area */}
                <div className="p-5 md:p-8">
                  {/* Project metadata */}
                  <div className={cn(
                    "flex justify-between items-center mb-2 text-[10px] font-mono text-text-tertiary",
                    side === "left" ? "md:flex-row-reverse" : "flex-row"
                  )}>
                    <span>ID#{project.id}</span>
                    <span>{activeProject === project.id ? "ACTIVE" : "STANDBY"}</span>
                  </div>

                  <Heading
                    level={4}
                    className="text-xl md:text-2xl font-extrabold mb-4"
                  >
                    {project.title}
                  </Heading>

                  <Text
                    className={cn(
                      "mb-6 text-text-secondary",
                      activeProject === project.id && "text-text-primary"
                    )}
                  >
                    {project.shortDescription}
                  </Text>

                  {/* Technical metrics - only when active */}
                  {activeProject === project.id && (
                    <motion.div
                      className={cn(
                        "mb-6 text-[10px] font-mono text-accent-oceanic/80 bg-bg-glass backdrop-blur-sm p-2",
                        side === "left" ? "border-r border-accent-oceanic/30" : "border-l border-accent-oceanic/30"
                      )}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={cn(
                        "flex items-center gap-3 mb-1",
                        side === "left" ? "md:flex-row-reverse" : "flex-row"
                      )}>
                        <span>COMPL: {projectMetrics.find(p => p.id === project.id)?.complexity}%</span>
                        <div className="h-1 w-20 bg-bg-tertiary/40 overflow-hidden">
                          <motion.div
                            className="h-full bg-accent-oceanic/70"
                            initial={{ width: 0 }}
                            animate={{ width: `${projectMetrics.find(p => p.id === project.id)?.complexity || 0}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                      <div className={cn(
                        "flex items-center gap-3",
                        side === "left" ? "md:flex-row-reverse" : "flex-row"
                      )}>
                        <span>QUAL: {projectMetrics.find(p => p.id === project.id)?.renderQuality}%</span>
                        <div className="h-1 w-20 bg-bg-tertiary/40 overflow-hidden">
                          <motion.div
                            className="h-full bg-accent-oceanic/70"
                            initial={{ width: 0 }}
                            animate={{ width: `${projectMetrics.find(p => p.id === project.id)?.renderQuality || 0}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tags */}
                  <div className={cn(
                    "flex flex-wrap gap-2 mb-6",
                    side === "left" ? "md:justify-end" : "justify-start"
                  )}>
                    {project.categories.map((category, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          "px-3 py-1 text-xs uppercase tracking-wider font-mono font-bold border border-accent-oceanic/50",
                          activeProject === project.id
                            ? "bg-bg-glass text-accent-primary backdrop-blur-sm"
                            : "bg-bg-glass text-text-primary backdrop-blur-sm"
                        )}
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={project.ctaLink}
                    className={cn(
                      "inline-block mt-2 font-bold text-lg border-b border-current pb-1 transition-all hover:pr-6",
                      activeProject === project.id ? "text-accent-primary" : "text-text-primary"
                    )}
                  >
                    {project.ctaText}
                    <span className="inline-block ml-2 transition-transform group-hover:translate-x-2">
                      <Icon name="fi-arrow-right" size={20} />
                    </span>
                  </Link>
                </div>

                {/* Bottom status indicator */}
                {activeProject === project.id && (
                  <div className="absolute bottom-0 right-0 text-[9px] font-mono text-accent-oceanic/70 p-2 flex items-center gap-2">
                    <motion.div
                      className="h-1 w-1 rounded-full bg-accent-primary"
                      animate={{
                        opacity: [0.4, 1, 0.4],
                        scale: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    {projectMetrics.find(p => p.id === project.id)?.systemStatus}
                  </div>
                )}
              </div>

              {/* Connection line to timeline - more architectural */}
              <div className={cn(
                "absolute top-1/2 md:w-14 border-t border-accent-oceanic/60 hidden md:block",
                side === "left" ? "left-full" : "right-full"
              )}>
                {activeProject === project.id && (
                  <motion.div
                    className="absolute inset-0 bg-accent-primary"
                    layoutId="activeConnectionLine"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Technical year markers */}
      <div className="absolute bottom-0 left-4 text-xs font-mono text-accent-primary/70 hidden md:block">
        TIMELINE.START
      </div>
      <div className="absolute top-0 left-4 text-xs font-mono text-accent-primary/70 hidden md:block">
        TIMELINE.END
      </div>

      {/* Multiple scan line effects - similar to header */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-accent-oceanic/10 pointer-events-none"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 5
        }}
      />

      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-accent-primary/20 pointer-events-none"
        initial={{ top: '20%' }}
        animate={{ top: '120%' }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2
        }}
      />
    </div>
  );
};

export default ProjectTimelineView;
