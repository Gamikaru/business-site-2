// src/components/home/HomeServices.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ScrollReveal,
  GestureElement,
  TextReveal,
  AnimatedPath
} from "@/components/core/Animations";
import { Button } from "@/components/common/Button";
import { Divider } from "@/components/common/Divider";
import { Heading, Text } from "@/components/common/Typography";
import { cn } from "@/utils/classNames";
import Image from "next/image";

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  iconSrc: string;
  link: string;
}

interface HomeServicesProps {
  heading: string;
  introduction: string;
  items: ServiceItem[];
  ctaText: string;
  ctaLink: string;
  className?: string;
}

const HomeServices: React.FC<HomeServicesProps> = ({
  heading,
  introduction,
  items,
  ctaText,
  ctaLink,
  className,
}) => {
  // Reference for scroll effects and animation triggers
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: false, margin: "-10% 0px" });

  // Scroll animation values
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Transform values for parallax effects
  const backgroundPositionY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const gridRotate = useTransform(scrollYProgress, [0, 1], [0, 2]);

  // Generate random technical data for the service metrics
  const [serviceMetrics] = useState({
    efficiency: Math.floor(Math.random() * 40) + 60, // 60-99%
    uptime: (99 + Math.random()).toFixed(2), // 99.00-99.99%
    iterations: Math.floor(Math.random() * 10) + 1, // 1-10
    deployFreq: Math.floor(Math.random() * 12) + 1, // 1-12
  });

  // State for active service (hover effect)
  const [activeService, setActiveService] = useState<string | null>(null);

  // Simulate periodic data updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      const serviceDivs = document.querySelectorAll('[data-service-status]');
      serviceDivs.forEach(div => {
        const statusLight = div.querySelector('.status-indicator') as HTMLElement;
        if (statusLight) {
          // Randomly blink some status lights
          if (Math.random() > 0.7) {
            statusLight.style.opacity = '0.4';
            setTimeout(() => {
              statusLight.style.opacity = '1';
            }, 200);
          }
        }
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      className={cn("relative bg-bg-secondary overflow-hidden", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Enhanced blueprint grid background with parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: backgroundPositionY,
          rotate: gridRotate,
        }}
      >
        {/* Multiple layered backgrounds for depth */}
        <div className="absolute inset-0 opacity-[0.07] bg-blueprint-grid" />
        <div className="absolute inset-0 opacity-[0.05] bg-circuit" />

        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-bg-secondary/80" />
      </motion.div>

      {/* Technical measurement guides */}
      <div className="absolute left-0 h-full w-6 border-r border-accent-oceanic/20 hidden lg:block">
        <div className="h-full flex flex-col justify-between py-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative">
              <div className="absolute -right-1 w-2 h-px bg-accent-oceanic"></div>
              <div className="absolute -right-8 text-[8px] font-mono text-accent-oceanic">
                {(i * 20).toString().padStart(3, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-0 h-full w-6 border-l border-accent-oceanic/20 hidden lg:block">
        <div className="h-full flex flex-col justify-between py-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-1 w-2 h-px bg-accent-oceanic"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-16 md:py-28 relative z-10">
        {/* Technical status bar */}
        <div className="hidden md:flex justify-between items-center mb-8 text-xs font-mono">
          <div className="flex items-center space-x-4 text-accent-oceanic">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-accent-oceanic mr-2 animate-pulse"></div>
              <span>SYS.STATUS/ACTIVE</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-brand-primary mr-2"></div>
              <span>EFFICIENCY/{serviceMetrics.efficiency}%</span>
            </div>
          </div>
          <div className="text-accent-primary">
            UPTIME/{serviceMetrics.uptime}%
          </div>
        </div>

        {/* Enhanced section header */}
        <div ref={headingRef} className="max-w-3xl mx-auto text-center mb-12 md:mb-20 relative">
          {/* Decorative connectors */}
          <motion.div
            className="absolute -left-16 top-1/2 -translate-y-1/2 hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHeadingInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <svg width="50" height="80" viewBox="0 0 50 80" fill="none">
              <AnimatedPath
                d="M50 40H30L10 10M10 70L30 40"
                stroke="var(--color-brand-primary)"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <AnimatedPath
                d="M0 40H10"
                stroke="var(--color-brand-primary)"
                strokeWidth="1"
              />
              <AnimatedPath
                d="M15 10V70"
                stroke="var(--color-accent-oceanic)"
                strokeWidth="0.5"
                strokeDasharray="1 2"
              />
            </svg>
          </motion.div>

          <motion.div
            className="absolute -right-16 top-1/2 -translate-y-1/2 hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHeadingInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <svg width="50" height="80" viewBox="0 0 50 80" fill="none">
              <AnimatedPath
                d="M0 40H20L40 10M40 70L20 40"
                stroke="var(--color-brand-primary)"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <AnimatedPath
                d="M50 40H40"
                stroke="var(--color-brand-primary)"
                strokeWidth="1"
              />
              <AnimatedPath
                d="M35 10V70"
                stroke="var(--color-accent-oceanic)"
                strokeWidth="0.5"
                strokeDasharray="1 2"
              />
            </svg>
          </motion.div>

          <TextReveal
            direction="up"
            delay={0.2}
            splitBy="words"
            staggerChildren={true}
            className="mb-8 relative"
          >
            <Heading
              level={2}
              className="text-[clamp(1.8rem,3.2vw+1rem,2.4rem)] font-heading font-bold text-heading uppercase relative inline-block"
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

          <ScrollReveal direction="up" delay={0.3} className="relative">
            <div className="backdrop-blur-sm bg-bg-secondary/50 p-6 rounded-sm relative">
              {/* Technical corner details */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand-primary"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand-primary"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand-primary"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand-primary"></div>

              <Text size="xl" className="text-text-secondary">
                {introduction}
              </Text>
            </div>
          </ScrollReveal>

          {/* Data metrics */}
          <motion.div
            className="absolute -bottom-8 right-0 text-xs font-mono text-accent-oceanic hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHeadingInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            ITER/{serviceMetrics.iterations} DEP/{serviceMetrics.deployFreq}/mo
          </motion.div>
        </div>

        {/* Enhanced service cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
          {items.map((service, index) => (
            <ScrollReveal
              key={service.id}
              direction={index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right"}
              delay={0.2 + index * 0.1}
              className="h-full"
            >
              <GestureElement
                tiltEnabled={true}
                tiltFactor={3}
                scaleOnHover={true}
                scaleAmount={1.02}
                className="h-full"
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
              >
                <div
                  className={cn(
                    "relative h-full border rounded-lg overflow-hidden transition-all duration-300",
                    activeService === service.id
                      ? "border-brand-primary bg-bg-glass"
                      : "border-divider bg-bg-card/80"
                  )}
                  data-service-status={service.id}
                >
                  {/* Service number badge */}
                  <div className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center border border-accent-oceanic/70 text-accent-oceanic font-mono text-xs">
                    {service.number}
                  </div>

                  {/* Status indicator */}
                  <div className="absolute top-4 right-4 flex items-center">
                    <div className="status-indicator w-2 h-2 rounded-full bg-brand-primary mr-2 transition-opacity"></div>
                    <span className="text-xs font-mono text-text-secondary">READY</span>
                  </div>

                  {/* Blueprint corner detail */}
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <AnimatedPath
                        d="M64 0L64 16M64 0L48 0"
                        stroke="var(--color-accent-oceanic)"
                        strokeWidth="1"
                        strokeOpacity="0.5"
                      />
                    </svg>
                  </div>

                  <div className="p-8 pt-16">
                    {/* Animated service icon */}
                    <div className="mb-6 relative">
                      <div className="w-16 h-16 relative">
                        <div
                          className={cn(
                            "absolute inset-0 rounded-lg transition-opacity duration-300",
                            activeService === service.id
                              ? "opacity-20"
                              : "opacity-10"
                          )}
                          style={{
                            background: "radial-gradient(circle, var(--color-brand-primary) 0%, transparent 70%)"
                          }}
                        />

                        <Image
                          src={service.iconSrc}
                          alt=""
                          width={64}
                          height={64}
                          className="relative z-10"
                        />
                      </div>

                      {/* Technical scan line on hover */}
                      {activeService === service.id && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/30 to-transparent"
                          style={{
                            height: "200%",
                            top: "-50%"
                          }}
                          animate={{
                            top: ["0%", "100%"],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "linear"
                          }}
                        />
                      )}
                    </div>

                    {/* Service title */}
                    <Heading level={3} className="mb-4 text-xl font-heading font-semibold">
                      {service.title}
                    </Heading>

                    {/* Service description */}
                    <Text className="mb-6 text-text-secondary">
                      {service.description}
                    </Text>

                    {/* Learn more link */}
                    <div className="mt-auto">
                      <Button
                        intent="text"
                        href={service.link}
                        className={cn(
                          "px-0 font-medium transition-colors",
                          activeService === service.id
                            ? "text-brand-primary"
                            : "text-accent-cosmic"
                        )}
                        icon={
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        }
                        iconPosition="right"
                      >
                        Learn more
                      </Button>
                    </div>
                  </div>

                  {/* Bottom progress bar - random width for visual interest */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg-tertiary overflow-hidden">
                    <motion.div
                      className="h-full bg-accent-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: `${30 + Math.random() * 70}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                    />
                  </div>
                </div>
              </GestureElement>
            </ScrollReveal>
          ))}
        </div>

        {/* Enhanced CTA Button */}
        <div className="flex justify-center relative">
          <ScrollReveal direction="up" delay={0.5}>
            <div className="relative group perspective-effect">
              {/* Button glow effect */}
              <div className="absolute inset-0 -m-1 rounded-lg transition-opacity opacity-0 group-hover:opacity-100 duration-300 blur-md" style={{
                background: "radial-gradient(circle, var(--color-accent-primary) 0%, transparent 70%)"
              }}></div>

              <div className="relative z-10">
                <Button
                  intent="gradient"
                  size="lg"
                  href={ctaLink}
                  icon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 1L15 8L8 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 8H1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  iconPosition="right"
                >
                  {ctaText}
                </Button>
              </div>

              {/* Target indicator */}
              <div className="absolute -left-6 -bottom-6 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <AnimatedPath
                    d="M24 12V0M24 48V36M12 24H0M48 24H36"
                    stroke="var(--color-accent-oceanic)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <AnimatedPath
                    d="M24 28C26.2091 28 28 26.2091 28 24C28 21.7909 26.2091 20 24 20C21.7909 20 20 21.7909 20 24C20 26.2091 21.7909 28 24 28Z"
                    stroke="var(--color-accent-oceanic)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Enhanced measurement ticks */}
        <div className="mt-20 relative h-12 w-full hidden md:block">
          <motion.div
            className="absolute bottom-0 left-0 w-full border-t border-divider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {Array.from({ length: 11 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${i * 10}%`, transform: 'translateX(-50%)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1 + (i * 0.05) }}
              >
                <div className={cn(
                  "w-px bg-divider",
                  i % 5 === 0 ? "h-4" : "h-2"
                )}></div>
                {i % 5 === 0 && (
                  <span className="text-[10px] font-mono text-text-tertiary mt-1">
                    {i * 10}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Technical data matrix */}
        <motion.div
          className="absolute bottom-16 left-6 font-mono text-[10px] hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-accent-oceanic">
            {Array.from({ length: 6 }).map((_, i) => (
              <React.Fragment key={i}>
                <div>{`M${i+1}:${Math.floor(Math.random() * 999)}`}</div>
                <div>{`F${i+1}:${(Math.random() * 10).toFixed(2)}`}</div>
                <div>{`S${i+1}:${Math.floor(Math.random() * 99)}%`}</div>
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced angled divider with technical details */}
      <div className="relative">
        <Divider
          type="plane"
          height={120}
          bgBottom="var(--color-bg-primary)"
          className="z-10"
        />

        {/* Technical grid overlay on divider */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute bottom-0 left-0 right-0 h-[120px] w-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
            <motion.line
              x1="30" y1="0" x2="70" y2="100"
              stroke="var(--color-accent-primary)"
              strokeWidth="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            <motion.line
              x1="60" y1="0" x2="40" y2="100"
              stroke="var(--color-brand-primary)"
              strokeWidth="0.2"
              strokeDasharray="4 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, delay: 0.4 }}
            />

            <motion.text
              x="80" y="40"
              fill="var(--color-accent-oceanic)"
              fontSize="3"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.2 }}
            >
              PORT/SECT
            </motion.text>
          </svg>
        </div>
      </div>

      {/* Utility styles for special effects */}
      <style jsx global>{`
        .bg-radial-gradient {
          background: radial-gradient(circle at center, var(--from), var(--to));
        }

        .perspective-effect {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
      `}</style>
    </motion.section>
  );
};

export default HomeServices;