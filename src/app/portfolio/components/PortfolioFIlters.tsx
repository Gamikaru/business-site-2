"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/classNames";
import Icon from "@/components/common/Icons/Icon";

interface Filter {
  id: string;
  label: string;
}

interface PortfolioFiltersProps {
  filters: Filter[];
  className?: string;
  onFilterChange?: (filterId: string) => void;
}

const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({
  filters,
  className,
  onFilterChange,
}) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoverFilter, setHoverFilter] = useState<string | null>(null);
  const [uniqueId] = useState(`filters-${Math.floor(Math.random() * 10000)}`);
  const [isFlashing, setIsFlashing] = useState<string | null>(null);

  // Technical data for visualization
  const [techData] = useState({
    filterCounts: filters.map((f) => ({
      id: f.id,
      count: Math.floor(Math.random() * 10) + 1,
    })),
    gridDensity: Math.floor(Math.random() * 20) + 30,
    renderQuality: Math.floor(Math.random() * 10) + 90,
  });

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

  // Occasional flash effect on a random filter
  useEffect(() => {
    const interval = setInterval(() => {
      if (filters.length > 0) {
        const randomIndex = Math.floor(Math.random() * filters.length);
        const randomFilterId = filters[randomIndex].id;
        setIsFlashing(randomFilterId);
        setTimeout(() => setIsFlashing(null), 150);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [filters]);

  return (
    <section className={cn("relative mb-10", className)}>
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

      {/* Blueprint grid background */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 bg-blueprint-grid"></div>
      </div>

      {/* Measurement lines */}
      <div className="absolute left-0 right-0 -top-8 opacity-30 hidden md:block">
        <div className="h-4 w-full border-t border-dashed border-accent-oceanic/40"></div>
      </div>

      <div className="relative">
        {/* Editorial-style header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-[1px] bg-accent-oceanic/60"></div>
          <div className="bg-bg-glass backdrop-blur-sm border border-accent-oceanic/40 px-4 py-2 inline-block">
            <div className="flex items-center gap-2 font-mono">
              <Icon name="fi:FiFilter" size={16} className="text-accent-primary" />
              <span className="text-sm uppercase tracking-wider">Filter Projects</span>
            </div>
          </div>
          <div className="flex-1 h-[1px] bg-accent-oceanic/60"></div>
          <div className="text-[10px] font-mono text-accent-oceanic/70 hidden md:block">
            FILTERS/{filters.length} GRID/{techData.gridDensity}
          </div>
        </div>

        <motion.div
          className="flex flex-wrap gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {filters.map((filter, index) => {
            // Is this filter active?
            const isActive = activeFilter === filter.id;
            // Find the count data for this filter
            const count = techData.filterCounts.find((f) => f.id === filter.id)?.count || 0;

            return (
              <motion.button
                key={filter.id}
                className={cn(
                  "relative px-4 py-2 font-mono text-sm md:text-base uppercase font-bold",
                  "border transition-all duration-200 transform",
                  isActive
                    ? "bg-accent-primary text-bg-primary border-accent-primary shadow-[0px_0px_15px_0px_rgba(var(--color-accent-primary-rgb),0.3)]"
                    : "border-accent-oceanic/40 bg-bg-glass backdrop-blur-sm text-text-primary hover:border-accent-oceanic/60"
                )}
                onClick={() => handleFilterClick(filter.id)}
                onMouseEnter={() => setHoverFilter(filter.id)}
                onMouseLeave={() => setHoverFilter(null)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                style={{
                  filter: isFlashing === filter.id ? `url(#${uniqueId}-glitch)` : 'none'
                }}
              >
                {/* Technical measurement line */}
                {isActive && (
                  <motion.div
                    className="absolute -left-2 h-full w-[1px] bg-accent-primary"
                    layoutId="activePill"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Filter label */}
                <span>{filter.label}</span>

                {/* Count badge */}
                <AnimatePresence>
                  {(isActive || hoverFilter === filter.id) && (
                    <motion.div
                      className={cn(
                        "absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center",
                        "text-[10px] font-mono border bg-bg-glass backdrop-blur-sm",
                        isActive
                          ? "border-accent-primary text-accent-primary"
                          : "border-accent-oceanic/40 text-text-secondary"
                      )}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {count}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Technical dots for visual interest */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 bg-accent-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.2 }}
                      />
                    ))}
                  </div>
                )}

                {/* Technical measurement overlay */}
                {isActive && (
                  <div className="absolute top-0 left-0 w-full overflow-hidden h-[1px] opacity-60">
                    <div className="flex justify-between items-center">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-[1px] w-[1px] bg-accent-primary" />
                      ))}
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Connection lines for active filter */}
        {activeFilter !== "all" && (
          <svg className="absolute -bottom-6 left-0 w-full h-6 overflow-visible pointer-events-none">
            <motion.path
              d="M 40,0 C 100,20 200,30 300,5"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="1"
              strokeDasharray="3,3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 0.8 }}
            />
            <motion.path
              d="M 140,0 C 200,15 300,25 400,2"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="1"
              strokeDasharray="3,3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            />

            {/* Animated data pulse */}
            <motion.circle
              r="4"
              fill="var(--color-accent-primary)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                offsetDistance: ["0%", "100%"],
              }}
              style={{
                offsetPath: `path("M 40,0 C 100,20 200,30 300,5")`,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          </svg>
        )}

        {/* Technical readout */}
        <motion.div
          className="absolute -bottom-8 right-0 text-[10px] font-mono text-accent-oceanic/70 hidden md:flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <span>STATUS/</span>
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
          <span>{activeFilter === "all" ? "ALL" : "FILTERED"}</span>
        </motion.div>
      </div>

      {/* Horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-accent-primary/10 pointer-events-none"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 5
        }}
      />
    </section>
  );
};

export default PortfolioFilters;
