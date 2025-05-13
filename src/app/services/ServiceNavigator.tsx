"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/classNames";
import { ScrollReveal } from "@/components/core/Animations";

export interface ServiceItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface ServiceNavigatorProps {
  services: ServiceItem[];
  activeServiceId: string;
  onServiceChange: (id: string) => void;
  className?: string;
}

const ServiceNavigator: React.FC<ServiceNavigatorProps> = ({
  services,
  activeServiceId,
  onServiceChange,
  className
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Function to handle scrolling with smooth behavior
  const scrollToTab = (tabId: string) => {
    const container = scrollContainerRef.current;
    const tabElement = container?.querySelector(`[data-tab-id="${tabId}"]`) as HTMLElement;

    if (container && tabElement) {
      // Calculate position to scroll to
      const scrollLeft = tabElement.offsetLeft - container.offsetLeft;

      // Scroll to the tab
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Scroll active tab into view when it changes
  useEffect(() => {
    scrollToTab(activeServiceId);
  }, [activeServiceId]);

  // Update arrow visibility based on scroll position
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Handle arrow button clicks
  const handleArrowClick = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, serviceId: string, index: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = Math.min(index + 1, services.length - 1);
      onServiceChange(services[nextIndex].id);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = Math.max(index - 1, 0);
      onServiceChange(services[prevIndex].id);
      e.preventDefault();
    }
  };

  return (
    <ScrollReveal
      direction="up"
      delay={0.3}
      className={cn(
        "relative bg-bg-tertiary/30 backdrop-blur-sm border-y border-divider py-4",
        className
      )}
    >
      <div className="container mx-auto relative">
        {/* Technical label */}
        <div className="absolute -top-3 left-6 hidden md:block">
          <div className="px-2 py-1 bg-bg-primary text-xs font-mono text-accent-oceanic border border-accent-oceanic/50">
            NAV.SERVICES
          </div>
        </div>

        {/* Left scroll arrow */}
        {showLeftArrow && (
          <motion.button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-bg-primary border border-divider rounded-sm shadow-sm hidden md:flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleArrowClick('left')}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.button>
        )}

        {/* Right scroll arrow */}
        {showRightArrow && (
          <motion.button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-bg-primary border border-divider rounded-sm shadow-sm hidden md:flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleArrowClick('right')}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        )}

        {/* Tab List */}
        <ul
          ref={scrollContainerRef}
          role="tablist"
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 md:px-8 lg:px-12 py-2 -mx-4 md:-mx-8"
          onScroll={handleScroll}
        >
          {services.map((service, index) => (
            <li
              key={service.id}
              className="flex-shrink-0 snap-center mx-2 md:mx-4"
              role="presentation"
            >
              <motion.button
                role="tab"
                aria-selected={activeServiceId === service.id}
                aria-controls={`panel-${service.id}`}
                id={`tab-${service.id}`}
                tabIndex={activeServiceId === service.id ? 0 : -1}
                data-tab-id={service.id}
                className={cn(
                  "relative px-6 py-3 md:px-8 md:py-4 min-w-[160px] border-2 rounded",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                  "transition-all duration-300 ease-in-out hover:shadow-lg",
                  activeServiceId === service.id
                    ? "border-brand-primary bg-bg-glass"
                    : "border-divider bg-bg-tertiary/20 hover:border-accent-oceanic/50"
                )}
                onClick={() => onServiceChange(service.id)}
                onKeyDown={(e) => handleKeyDown(e, service.id, index)}
                whileHover={{ y: -4 }}
                whileTap={{ y: 0 }}
              >
                {/* Service name with technical styling */}
                <div className="flex flex-col items-center text-center">
                  {service.icon && (
                    <div className="mb-2 text-2xl">
                      {service.icon}
                    </div>
                  )}
                  <span className={cn(
                    "font-medium",
                    activeServiceId === service.id ? "text-brand-primary" : "text-text-primary"
                  )}>
                    {service.name}
                  </span>

                  {/* Technical indicator */}
                  <div className="flex justify-center mt-2">
                    <div
                      className={cn(
                        "h-1 w-8 transition-all duration-300",
                        activeServiceId === service.id
                          ? "bg-brand-primary"
                          : "bg-divider"
                      )}
                    />
                  </div>
                </div>

                {/* Technical number */}
                <div className="absolute top-2 right-2 text-xs font-mono opacity-70">
                  {(index + 1).toString().padStart(2, '0')}
                </div>

                {/* Active indicator */}
                {activeServiceId === service.id && (
                  <>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary"
                      layoutId="activeServiceIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b-2 border-r-2 border-brand-primary bg-bg-tertiary"></div>
                  </>
                )}
              </motion.button>
            </li>
          ))}
        </ul>

        {/* Technical measurement indicators */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-divider flex justify-between px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-px bg-accent-oceanic/70"
              style={{ left: `${(i + 1) * 20}%` }}
            />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ServiceNavigator;