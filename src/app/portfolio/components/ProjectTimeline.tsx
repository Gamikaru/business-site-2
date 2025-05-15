"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ScrollReveal } from "@/components/core/Animations";
import { BlueprintCorner } from "@/components/common/VisualInterest/BlueprintCorner";
import { Heading, Text } from "@/components/common/Typography";
import Icon from "@/components/common/Icons/Icon";
import { cn } from "@/utils/classNames";
import Link from "next/link";
import Image from "next/image";
import ProjectTimelineGrid from "./ProjectTimelineGrid";
import ProjectTimelineView from "./ProjectTimelineView";
import PortfolioFilters from "./PortfolioFIlters";
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

interface Filter {
  id: string;
  label: string;
}

interface ProjectTimelineProps {
  projects: Project[];
  className?: string;
  filters?: Filter[];
}

const ProjectTimelineCard: React.FC<{
  project: Project;
  index: number;
  active: boolean;
  onHover: (id: string | null) => void;
  side: "left" | "right";
  delay: number;
}> = ({ project, index, active, onHover, side, delay }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isCardInView = useInView(cardRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "group relative",
        side === "left" ? "md:text-right" : "md:text-left",
        active && "z-10"
      )}
      initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
      animate={{ opacity: isCardInView ? 1 : 0, x: isCardInView ? 0 : (side === "left" ? -50 : 50) }}
      transition={{ duration: 0.7, delay: delay }}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Neobrutalist card design */}
      <div
        className={cn(
          "bg-bg-secondary border-4 md:border-[6px] border-text-primary transform transition-all duration-300",
          active
            ? "border-accent-primary shadow-[12px_12px_0px_0px_rgba(var(--color-accent-primary-rgb),0.3)]"
            : "shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)]",
          side === "left" ? "md:mr-12 md:translate-x-3" : "md:ml-12 md:translate-x-[-3px]"
        )}
      >
        {/* Project number indicator - neobrutalist style */}
        <div className={cn(
          "absolute top-2 bg-text-primary text-bg-secondary px-3 py-1 font-bold text-xl",
          side === "left" ? "md:-right-2 right-2" : "md:-left-2 left-2"
        )}>
          {(index + 1).toString().padStart(2, '0')}
        </div>

        {/* Image area */}
        <div className="relative overflow-hidden w-full aspect-video">
          <Image
            src={project.imageSrc}
            alt={project.imageAlt}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              active ? "grayscale-0 scale-105" : "grayscale-[30%]"
            )}
          />

          {/* Image overlay */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary/70 transition-opacity duration-300",
            active ? "opacity-0" : "opacity-20"
          )} />

          {/* Technical grid overlay */}
          <div className="absolute inset-0 bg-isometric-grid opacity-10" />
        </div>

        {/* Content area */}
        <div className="p-5 md:p-8">
          <Heading
            level={4}
            className="text-xl md:text-2xl font-extrabold mb-4"
          >
            {project.title}
          </Heading>

          <Text
            className={cn(
              "mb-6 text-text-secondary",
              active && "text-text-primary"
            )}
          >
            {project.shortDescription}
          </Text>

          {/* Tags */}
          <div className={cn(
            "flex flex-wrap gap-2 mb-6",
            side === "left" ? "md:justify-end" : "justify-start"
          )}>
            {project.categories.map((category, idx) => (
              <span
                key={idx}
                className={cn(
                  "px-3 py-1 text-xs uppercase tracking-wider font-mono font-bold border-2 border-text-primary",
                  active
                    ? "bg-accent-primary text-white border-accent-primary"
                    : "bg-bg-secondary text-text-primary"
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
              "inline-block mt-2 font-bold text-lg border-b-4 border-current pb-1 transition-all group-hover:pr-6",
              active ? "text-accent-primary" : "text-text-primary"
            )}
          >
            {project.ctaText}
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-2">
              <Icon name="fi-arrow-right" size={20} />
            </span>
          </Link>
        </div>
      </div>

      {/* Connection line to timeline */}
      <div className={cn(
        "absolute top-1/2 w-0 md:w-14 border-t-4 border-text-primary hidden md:block",
        side === "left" ? "left-full" : "right-full"
      )}>
        {active && (
          <motion.div
            className="absolute inset-0 bg-accent-primary"
            layoutId="activeConnectionLine"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>
    </motion.div>
  );
};

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  projects,
  className,
  filters = [],
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-10% 0px" });
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [uniqueId] = useState(`timeline-${Math.floor(Math.random() * 10000)}`);
  const [activeFilter, setActiveFilter] = useState("all");
  const [techData] = useState({
    gridDensity: Math.floor(Math.random() * 20) + 30,
    renderQuality: Math.floor(Math.random() * 10) + 90,
  });

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.15, 0.05]);
  const bgParallax = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // Handler for filter changes
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  return (
    <section
      ref={sectionRef}
      className={cn("py-20 md:py-40 bg-bg-primary relative overflow-hidden", className)}
    >
      {/* SVG Definitions */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={`${uniqueId}-pulse-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--color-accent-cosmic)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
          </linearGradient>
          <filter id={`${uniqueId}-path-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
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

      {/* Technical background */}
      <motion.div
        className="absolute inset-0 bg-blueprint-grid opacity-20"
        style={{ opacity: backgroundOpacity, y: bgParallax }}
      />

      {/* Diagonal stripes - subtle element */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -inset-[100px] bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,var(--color-accent-primary)_20px,var(--color-accent-primary)_22px)]"></div>
      </div>

      {/* Measurement lines */}
      <div className="absolute left-0 right-0 top-16 opacity-60">
        <TickStrip
          height={20}
          segments={21}
          labelEvery={5}
          darkLabels={true}
          glitchEffect={true}
        />
      </div>

      {/* Blueprint corners */}
      <div className="absolute top-0 left-0 text-accent-primary/30">
        <BlueprintCorner size={60} />
      </div>
      <div className="absolute top-0 right-0 rotate-90 text-accent-primary/30">
        <BlueprintCorner size={60} />
      </div>
      <div className="absolute bottom-0 left-0 -rotate-90 text-accent-primary/30">
        <BlueprintCorner size={60} />
      </div>
      <div className="absolute bottom-0 right-0 rotate-180 text-accent-primary/30">
        <BlueprintCorner size={60} />
      </div>

      {/* Scan line effect */}
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

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="mb-20 relative">
            <div className="flex flex-col items-center text-center">
              {/* Technical element above heading */}
              <motion.div
                className="px-3 py-1.5 border border-accent-oceanic/60 bg-bg-glass backdrop-blur-sm mb-4 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
                <span className="text-xs font-mono text-accent-primary">
                  TIMELINE.PROJECTS/
                </span>
                <span className="text-xs font-mono text-text-secondary">
                  {projects.length} ITEMS
                </span>
              </motion.div>

              <div className="relative inline-block">
                <div className="absolute -top-4 -left-4 -right-4 -bottom-4 border border-accent-oceanic/30 -z-10 bg-bg-glass backdrop-blur-sm" />
                <Heading
                  level={2}
                  className="text-4xl md:text-5xl font-extrabold text-text-primary px-6 py-3 inline-block relative"
                >
                  Project Timeline
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-accent-primary" />
                </Heading>
              </div>

              <motion.div
                className="h-px w-20 bg-accent-primary mx-auto my-6"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />

              <Text className="max-w-2xl text-center text-text-secondary mb-6">
                Explore my project journey through an interactive timeline. Each project represents a unique challenge and solution.
              </Text>

              {/* View toggle - more architectural style */}
              <motion.div
                className="mt-6 flex items-center gap-2 border border-accent-oceanic/60 bg-bg-glass backdrop-blur-sm p-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <button
                  className={cn(
                    "px-4 py-1.5 text-sm font-bold transition-colors",
                    viewMode === 'grid'
                      ? "bg-accent-primary text-bg-secondary"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon name="fi:FiGrid" size={14} />
                    <span>Grid</span>
                  </span>
                </button>
                <button
                  className={cn(
                    "px-4 py-1.5 text-sm font-bold transition-colors",
                    viewMode === 'timeline'
                      ? "bg-accent-primary text-bg-secondary"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                  onClick={() => setViewMode('timeline')}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon name="fi:FiActivity" size={14} />
                    <span>Timeline</span>
                  </span>
                </button>
              </motion.div>
            </div>
          </div>
        </ScrollReveal>

        {/* Show filters only in grid view */}
        {viewMode === 'grid' && filters && filters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <PortfolioFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </motion.div>
        )}

        {/* Render either grid or timeline view based on viewMode */}
        {viewMode === 'grid' ? (
          <ProjectTimelineGrid projects={projects} activeFilter={activeFilter} />
        ) : (
          <ProjectTimelineView projects={projects} />
        )}

        {/* Bottom technical readout - architectural style */}
        <motion.div
          className="mt-16 flex justify-between items-center py-2 border-t border-accent-oceanic/60 text-[10px] font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="text-accent-primary">
            VIEW/{viewMode.toUpperCase()} GRID/{techData.gridDensity} QUAL/{techData.renderQuality}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-accent-primary"
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
              <span className="text-text-secondary">STATUS/ACTIVE</span>
            </div>
            <span className="text-accent-oceanic">{new Date().toISOString().split('T')[0]}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectTimeline;