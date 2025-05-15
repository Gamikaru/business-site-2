"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/common/Icons/Icon";
import { Text, Heading } from "@/components/common/Typography";
import { StaggerContainer, staggerItemVariants } from "@/components/core/Animations";
import { cn } from "@/utils/classNames";

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

interface ProjectTimelineGridProps {
  projects: Project[];
  activeFilter?: string;
}

const ProjectTimelineGrid: React.FC<ProjectTimelineGridProps> = ({
  projects,
  activeFilter = "all"
}) => {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [uniqueId] = useState(`grid-${Math.floor(Math.random() * 10000)}`);
  const [isFlashing, setIsFlashing] = useState<string | null>(null);

  // Random technical metrics for each project (for visual interest)
  const [projectMetrics] = useState(() =>
    projects.map(project => ({
      id: project.id,
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      complexity: Math.floor(Math.random() * 100),
      renderQuality: Math.floor(Math.random() * 10) + 90,
      systemStatus: Math.random() > 0.8 ? "TESTING" : "OPERATIONAL",
    }))
  );

  // Filter projects when activeFilter changes
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter(project => project.categories.includes(activeFilter))
      );
    }
  }, [activeFilter, projects]);

  // Occasional flash effect on a random project
  useEffect(() => {
    const interval = setInterval(() => {
      if (filteredProjects.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredProjects.length);
        const randomProjectId = filteredProjects[randomIndex].id;
        setIsFlashing(randomProjectId);
        setTimeout(() => setIsFlashing(null), 150);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [filteredProjects]);

  // SVG filter for glitch effect
  return (
    <StaggerContainer className="relative z-10">
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

      {/* Technical connection indicator */}
      {activeFilter !== "all" && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="text-xs font-mono text-accent-primary">
            FILTERING: {activeFilter.toUpperCase()}
          </div>
          <div className="h-4 w-px bg-accent-primary"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              data-project-id={project.id}
              variants={staggerItemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex"
            >
              <div
                className={cn(
                  "bg-bg-secondary border border-accent-oceanic/40 transform transition-all duration-300 flex-1",
                  isFlashing === project.id && "filter blur-[0.5px]",
                  activeProject === project.id
                    ? "shadow-[0px_0px_20px_0px_rgba(var(--color-accent-primary-rgb),0.2)]"
                    : "hover:shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)]"
                )}
                onMouseEnter={() => setActiveProject(project.id)}
                onMouseLeave={() => setActiveProject(null)}
                style={{
                  filter: isFlashing === project.id ? `url(#${uniqueId}-glitch)` : 'none'
                }}
              >
                {/* Project number indicator - architectural style */}
                <div className="absolute top-2 right-2 bg-bg-glass backdrop-blur-sm border border-accent-oceanic/40 px-3 py-1 font-bold text-xl z-10">
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

                  {/* Highlight categories that match active filter */}
                  {activeFilter !== "all" && project.categories.includes(activeFilter) && (
                    <div className="absolute top-0 left-0 bg-accent-primary text-bg-secondary px-3 py-1 font-mono text-xs font-bold">
                      {activeFilter.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content area */}
                <div className="p-5 md:p-8">
                  {/* Project metadata */}
                  <div className="flex justify-between items-center mb-2 text-[10px] font-mono text-text-tertiary">
                    <span>ID#{project.id}</span>
                    <span>{projectMetrics.find(p => p.id === project.id)?.timestamp}</span>
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
                      className="mb-6 text-[10px] font-mono text-accent-oceanic/80 bg-bg-glass backdrop-blur-sm border-l border-accent-oceanic/30 p-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-1">
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
                      <div className="flex items-center gap-3">
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
                  <div className="flex flex-wrap gap-2 mb-6">
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
                      <Icon name="fi:FiArrowRight" size={20} />
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </StaggerContainer>
  );
};

export default ProjectTimelineGrid;
