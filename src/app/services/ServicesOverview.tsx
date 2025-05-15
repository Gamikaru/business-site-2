// app/services/ServicesOverview.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Heading, Text } from "@/components/common/Typography";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/core/Animations";
import { BlueprintCorner } from "@/components/common/VisualInterest";
import { useAnimationPreferences } from "@/components/core/Animations";
import { cn } from "@/utils/classNames";

interface Service {
  id: string;
  title: string;
  shortDescription: string;
  imageSrc: string;
  imageAlt: string;
}

interface ServicesOverviewProps {
  services: Service[];
  className?: string;
}

const ServicesOverview: React.FC<ServicesOverviewProps> = ({
  services,
  className,
}) => {
  const { shouldAnimate } = useAnimationPreferences();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [uniqueId] = useState(`overview-${Math.floor(Math.random() * 10000)}`);
  const [isFlashing, setIsFlashing] = useState<string | null>(null);

  // Random technical data for visual interest
  const [techData] = useState({
    gridDensity: Math.floor(Math.random() * 20) + 30,
    renderQuality: Math.floor(Math.random() * 10) + 90,
    timestamp: new Date().toISOString().split('T')[0],
  });

  // Create a serpentine layout for services
  const getLayoutClass = (index: number) => {
    if (index === 0) return "md:col-span-6 lg:col-span-8 row-span-1";
    if (index === 1) return "md:col-span-6 lg:col-span-4 row-span-1";
    if (index === 2) return "md:col-span-4 lg:col-span-4 row-span-1";
    if (index === 3) return "md:col-span-4 lg:col-span-4 row-span-1";
    if (index === 4) return "md:col-span-4 lg:col-span-4 row-span-1";
    return "";
  };

  // Periodic flash effect for tech aesthetic
  useEffect(() => {
    if (!shouldAnimate() || !isInView) return;

    const flashInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * services.length);
      const randomServiceId = services[randomIndex].id;

      setIsFlashing(randomServiceId);
      setTimeout(() => setIsFlashing(null), 150);
    }, 5000);

    return () => clearInterval(flashInterval);
  }, [services, shouldAnimate, isInView]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "py-24 relative overflow-hidden bg-bg-secondary border-t border-b border-divider",
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

      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-10"></div>

      {/* Diagonal stripes - neobrutalist element */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.02] pointer-events-none">
        <div className="absolute -inset-[100px] bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,var(--color-accent-primary)_20px,var(--color-accent-primary)_22px)]"></div>
      </div>

      {/* Blueprint corners */}
      <div className="absolute top-0 left-0 text-accent-primary/30">
        <BlueprintCorner size={40} />
      </div>
      <div className="absolute top-0 right-0 rotate-90 text-accent-primary/30">
        <BlueprintCorner size={40} />
      </div>
      <div className="absolute bottom-0 left-0 -rotate-90 text-accent-primary/30">
        <BlueprintCorner size={40} />
      </div>
      <div className="absolute bottom-0 right-0 rotate-180 text-accent-primary/30">
        <BlueprintCorner size={40} />
      </div>

      {/* Technical readout */}
      <motion.div
        className="absolute top-4 right-4 text-xs font-mono text-accent-oceanic/70 bg-bg-glass backdrop-blur-sm px-2 py-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 0.8 : 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        GRID/{techData.gridDensity} QUAL/{techData.renderQuality}
      </motion.div>

      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">
        <ScrollReveal>
          <Heading
            id="gridTitle"
            level={2}
            className="text-3xl font-bold mb-12 text-center relative inline-block"
          >
            ALL SERVICES AT A GLANCE
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-accent-primary"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </Heading>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 mt-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={`card-${service.id}`}
              className={cn(
                "relative transform transition-all duration-300",
                getLayoutClass(index)
              )}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : 30,
                scale: activeCard === service.id ? 1.02 : 1,
                filter: isFlashing === service.id ? `url(#${uniqueId}-glitch)` : 'none'
              }}
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.1,
                scale: { duration: 0.2 }
              }}
              onMouseEnter={() => setActiveCard(service.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <Link href={`#${service.id}`}>
                <div
                  className={cn(
                    "h-full overflow-hidden border-2 transition-all",
                    activeCard === service.id
                      ? "border-accent-primary shadow-[8px_8px_0px_0px_rgba(var(--color-accent-primary-rgb),0.2)]"
                      : "border-divider hover:border-accent-secondary"
                  )}
                >
                  {/* Bold service number - neobrutalist style */}
                  <div
                    className={cn(
                      "absolute top-0 right-0 z-10 text-4xl font-black px-3 py-1 border-b border-l",
                      activeCard === service.id
                        ? "bg-accent-primary text-bg-primary border-accent-primary"
                        : "bg-bg-tertiary text-accent-primary border-divider"
                    )}
                  >
                    {`0${index + 1}`}
                  </div>

                  {/* Image container with overlay effects */}
                  <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
                    {/* Technical grid overlay */}
                    <div className="absolute inset-0 bg-blueprint-grid opacity-30 z-10 mix-blend-multiply" />

                    {/* Image */}
                    <Image
                      src={service.imageSrc}
                      alt={service.imageAlt}
                      fill
                      className={cn(
                        "object-cover transition-all duration-700",
                        activeCard === service.id ? "scale-110 grayscale-0" : "scale-100 grayscale-[30%]"
                      )}
                    />

                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-primary/90 to-transparent z-10" />

                    {/* Measurement ticks - technical element */}
                    <div className="absolute top-2 left-2 right-2 flex justify-between z-20">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-1 w-1 bg-accent-primary/70" />
                      ))}
                    </div>

                    {/* Bottom title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <div className="text-sm font-mono text-accent-primary mb-1">
                        {`0${index + 1} ${service.id.toUpperCase()}`}
                      </div>
                      <Heading
                        level={3}
                        className={cn(
                          "text-xl md:text-2xl font-bold transition-colors",
                          activeCard === service.id ? "text-accent-primary" : "text-text-primary"
                        )}
                      >
                        {service.title}
                      </Heading>
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="p-6">
                    <Text className={cn(
                      "mb-4 leading-relaxed",
                      activeCard === service.id ? "text-text-primary" : "text-text-secondary"
                    )}>
                      {service.shortDescription}
                    </Text>

                    {/* Technical details - only show on active */}
                    <AnimatePresence>
                      {activeCard === service.id && (
                        <motion.div
                          className="mb-4 bg-bg-glass backdrop-blur-sm border-l-2 border-accent-oceanic/40 pl-3 py-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-xs font-mono grid grid-cols-2 gap-x-4 gap-y-2">
                            <span className="text-accent-oceanic">TYPE:</span>
                            <span>{service.id.toUpperCase()}</span>
                            <span className="text-accent-oceanic">STATUS:</span>
                            <span>ACTIVE</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* CTA with technical styling */}
                    <div
                      id={`cta-${service.id}`}
                      className={cn(
                        "flex items-center mt-6 font-medium transition-all",
                        activeCard === service.id ? "text-accent-primary" : "text-text-primary"
                      )}
                    >
                      <div className="mr-2">Learn more</div>
                      <motion.div
                        animate={{
                          x: activeCard === service.id ? 5 : 0
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        →
                      </motion.div>
                    </div>
                  </div>

                  {/* Bottom corner notch - architectural detail */}
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 w-8 h-8 transition-colors",
                      activeCard === service.id
                        ? "border-t-2 border-l-2 border-accent-primary"
                        : "border-t-2 border-l-2 border-divider"
                    )}
                  ></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Technical footer */}
        <motion.div
          className="mt-16 flex justify-between items-center text-xs font-mono text-accent-oceanic/60 border-t border-divider pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 0.7 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div>SERVICES.COUNT: {services.length}</div>
          <div className="flex items-center">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-accent-primary mr-2"
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
            <span>{techData.timestamp}</span>
          </div>
        </motion.div>
      </div>

      {/* Scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-accent-primary/10 pointer-events-none"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1.5
        }}
      />
    </section>
  );
};

export default ServicesOverview;