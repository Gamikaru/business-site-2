// app/services/ServicesTabs.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useAnimationPreferences } from "@/components/core/Animations";
import { cn } from "@/utils/classNames";

interface Service {
  id: string;
  title: string;
}

interface ServicesTabsProps {
  services: Service[];
  className?: string;
}

const ServicesTabs: React.FC<ServicesTabsProps> = ({
  services,
  className,
}) => {
  const { shouldAnimate } = useAnimationPreferences();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isSticky, setIsSticky] = useState(false);
  const [uniqueId] = useState(`tabs-${Math.floor(Math.random() * 10000)}`);
  const [glitchTab, setGlitchTab] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  const { scrollY } = useScroll();

  // Random technical data
  const [techData] = useState({
    tabCount: services.length + 1,
    sectionDepth: Math.floor(Math.random() * 10) + 5,
    timestamp: new Date().toISOString().split('T')[0],
  });

  // Handle sticky behavior based on scroll
  useEffect(() => {
    const handleScrollChange = (latest: number) => {
      const servicesSection = document.getElementById('services-details');
      if (!servicesSection || !navRef.current) return;

      const servicesSectionTop = servicesSection.getBoundingClientRect().top + window.scrollY - 70;

      if (latest >= servicesSectionTop) {
        if (!isSticky) {
          setIsSticky(true);
          // Add this class to body to adjust other elements if needed
          document.body.classList.add('services-tabs-sticky');
        }
      } else if (isSticky) {
        setIsSticky(false);
        document.body.classList.remove('services-tabs-sticky');
      }
    };

    // Initialize
    handleScrollChange(window.scrollY);

    // Subscribe to scroll changes
    return scrollY.onChange(handleScrollChange);
  }, [scrollY, isSticky]);

  // Setup intersection observer to track which section is in view
  useEffect(() => {
    // Clean up previous observer
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
    }

    const observerOptions = {
      rootMargin: "-100px 0px -50% 0px", // Top margin accounts for the sticky header
      threshold: 0.1,
    };

    intersectionObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId !== activeTab) {
            setActiveTab(sectionId);

            // Scroll the tab into view if needed
            const tabElement = document.getElementById(`tab-${sectionId}`);
            if (tabElement && navRef.current) {
              const scrollRect = navRef.current.getBoundingClientRect();
              const tabRect = tabElement.getBoundingClientRect();

              // If tab is not visible in the scroll container
              if (tabRect.left < scrollRect.left || tabRect.right > scrollRect.right) {
                navRef.current.scrollLeft += tabRect.left - scrollRect.left - (scrollRect.width / 2) + (tabRect.width / 2);
              }
            }
          }
        }
      });
    }, observerOptions);

    // Observer all service sections
    services.forEach((service) => {
      const section = document.getElementById(service.id);
      if (section) {
        intersectionObserverRef.current?.observe(section);
      }
    });

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [services, activeTab]);

  // Handle tab click and smooth scroll to section
  const handleTabClick = (id: string) => {
    // Set active tab immediately for UI feedback
    setActiveTab(id);

    // Apply glitch effect
    if (shouldAnimate()) {
      setGlitchTab(id);
      setTimeout(() => setGlitchTab(null), 200);
    }

    // Scroll to the corresponding section
    if (id === "all") {
      // Scroll back to top if "ALL" is selected
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    const section = document.getElementById(id);
    if (section) {
      const yOffset = -100; // Adjust for sticky header
      const y = section.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  // Occasional glitch effect for tech aesthetic
  useEffect(() => {
    if (!shouldAnimate()) return;

    const glitchInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * (services.length + 1));
      const randomId = randomIndex === services.length ? "all" : services[randomIndex].id;

      setGlitchTab(randomId);
      setTimeout(() => setGlitchTab(null), 150);
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, [services, shouldAnimate]);

  return (
    <div
      ref={tabsRef}
      className={cn(
        "w-full transition-all duration-300 z-30",
        isSticky
          ? "sticky top-0 shadow-md border-b border-accent-primary/20"
          : "border-y border-divider",
        className
      )}
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

      {/* Background with subtle grid and blur */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-300",
        isSticky ? "opacity-90" : "opacity-100"
      )}>
        <div className="absolute inset-0 bg-blueprint-grid opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-bg-secondary backdrop-blur-sm"></div>
      </div>

      {/* Horizontal measurement ticks */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] flex justify-between">
        {Array.from({ length: services.length + 1 }).map((_, i) => (
          <motion.div
            key={`tick-${i}`}
            className={cn(
              "h-[3px] w-[1px] bg-accent-oceanic/40",
              i % 2 === 0 ? "h-[3px]" : "h-[2px]"
            )}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.2, delay: 0.05 * i }}
            style={{ marginLeft: `${(100 / (services.length + 1)) * i}%` }}
          />
        ))}
      </div>

      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">
        <div
          ref={navRef}
          role="tablist"
          className="flex items-center overflow-x-auto scrollbar-hide py-3 px-2"
        >
          {services.map((service, index) => (
            <motion.button
              key={service.id}
              id={`tab-${service.id}`}
              role="tab"
              aria-selected={activeTab === service.id}
              aria-controls={service.id}
              className={cn(
                "px-3 py-2 mx-1 text-sm font-medium transition-colors rounded-sm flex items-center whitespace-nowrap",
                activeTab === service.id
                  ? "text-accent-primary"
                  : "text-text-secondary hover:text-text-primary",
                glitchTab === service.id && "filter"
              )}
              style={glitchTab === service.id ? { filter: `url(#${uniqueId}-glitch)` } : {}}
              onClick={() => handleTabClick(service.id)}
              layout
            >
              <span className="font-mono text-xs opacity-70 mr-2">
                {`0${index + 1}`}
              </span>
              <span>{service.title}</span>

              {/* Active indicator line */}
              {activeTab === service.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* Technical dot indicator */}
              <AnimatePresence>
                {activeTab === service.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2 w-1.5 h-1.5 rounded-full bg-accent-primary"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          ))}

          {/* ALL tab */}
          <motion.button
            role="tab"
            id="tab-all"
            aria-selected={activeTab === "all"}
            className={cn(
              "px-3 py-2 mx-1 text-sm font-medium transition-colors rounded-sm whitespace-nowrap",
              activeTab === "all"
                ? "text-accent-primary"
                : "text-text-secondary hover:text-text-primary",
              glitchTab === "all" && "filter"
            )}
            style={glitchTab === "all" ? { filter: `url(#${uniqueId}-glitch)` } : {}}
            onClick={() => handleTabClick("all")}
            layout
          >
            ALL

            {/* Active indicator line */}
            {activeTab === "all" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Technical dot indicator */}
            <AnimatePresence>
              {activeTab === "all" && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2 w-1.5 h-1.5 rounded-full bg-accent-primary"
                />
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Technical readout data */}
      <motion.div
        className={cn(
          "absolute right-4 top-1/2 transform -translate-y-1/2 text-[10px] font-mono text-accent-oceanic/70 transition-opacity",
          isSticky ? "opacity-100" : "opacity-0"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: isSticky ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
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
          <span>NAV/{activeTab.toUpperCase()}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ServicesTabs;