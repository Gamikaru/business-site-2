"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/common/Button";
import { Heading } from "@/components/common/Typography";
import { ScrollReveal } from "@/components/core/Animations";
import { BlueprintCorner } from "@/components/common/VisualInterest/BlueprintCorner";
import Icon from "@/components/common/Icons/Icon";
import RichText from "@/components/common/Typography/RichText";
import { cn } from "@/utils/classNames";

interface PortfolioCTAProps {
  heading: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  availabilityNote?: string;
  className?: string;
}

const PortfolioCTA: React.FC<PortfolioCTAProps> = ({
  heading,
  content,
  ctaText,
  ctaLink,
  availabilityNote,
  className,
}) => {
  // Refs and hooks
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-10% 0px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // State
  const [isCTAHovered, setIsCTAHovered] = useState(false);
  const [terminalText, setTerminalText] = useState("INITIALIZING...");
  const [glitchActive, setGlitchActive] = useState(false);
  const [uniqueId] = useState(`cta-${Math.floor(Math.random() * 10000)}`);
  const [techData] = useState({
    buildVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`,
    systemLoad: Math.floor(Math.random() * 40) + 60,
    efficiency: Math.floor(Math.random() * 30) + 70,
  });

  // Technical coordinates
  const [coords] = useState({
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
    z: Math.floor(Math.random() * 50),
  });

  // Animations based on scroll
  const backgroundParallax = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 1, 1, 0.7]);

  // Update terminal text periodically
  useEffect(() => {
    if (!isInView) return;

    const messages = [
      "READY FOR COLLABORATION",
      "PROJECT CAPACITY AVAILABLE",
      "AWAITING NEXT COMMAND...",
      "CONNECTION ESTABLISHED",
      "SYSTEM ONLINE",
    ];

    const interval = setInterval(() => {
      const newMessage = messages[Math.floor(Math.random() * messages.length)];
      setTerminalText(newMessage);

      // Occasionally trigger glitch effect
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className={cn("py-20 md:py-32 bg-bg-primary relative overflow-hidden", className)}
    >
      {/* SVG defs for filters and gradients */}
      <svg width="0" height="0" className="absolute">
        <defs>
          {/* Text glitch filter */}
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

          {/* Data flow gradient */}
          <linearGradient id={`${uniqueId}-data-flow`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--color-accent-oceanic)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Background layers */}
      <motion.div
        className="absolute inset-0 bg-blueprint-grid pointer-events-none"
        style={{
          y: backgroundParallax,
          opacity: opacityTransform
        }}
      />

      {/* Diagonal stripes - subtle element */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -inset-[100px] bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,var(--color-accent-primary)_20px,var(--color-accent-primary)_22px)]"></div>
      </div>

      {/* Blueprint corners */}
      <div className="absolute top-0 left-0 text-accent-primary/20">
        <BlueprintCorner size={60} />
      </div>
      <div className="absolute bottom-0 right-0 rotate-180 text-accent-primary/20">
        <BlueprintCorner size={60} />
      </div>

      {/* Technical measurement lines */}
      <div className="absolute left-0 top-12 h-px w-16 border-t border-accent-oceanic/60 hidden md:block" />
      <div className="absolute right-0 top-12 h-px w-16 border-t border-accent-oceanic/60 hidden md:block" />
      <div className="absolute left-12 top-0 bottom-0 w-px border-l border-accent-oceanic/60 hidden md:block" />
      <div className="absolute right-12 top-0 bottom-0 w-px border-r border-accent-oceanic/60 hidden md:block" />

      {/* Technical coordinate readout */}
      <motion.div
        className="absolute top-6 right-8 text-[10px] font-mono text-accent-oceanic/70 items-center gap-2 hidden md:flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
        <span>BUILD/{techData.buildVersion}</span>
        <span>SYS/{techData.systemLoad}%</span>
      </motion.div>

      {/* Main content container */}
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Modern architectural panel */}
          <motion.div
            className="relative bg-bg-glass backdrop-blur-sm border border-accent-oceanic/40 p-8 md:p-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 40,
              boxShadow: "0px 0px 30px 0px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 0.7 }}
          >
            {/* Terminal bar - tech element */}
            <motion.div
              className="absolute -top-2 left-8 right-8 h-6 flex items-center px-4 border-t border-l border-r border-accent-oceanic/60 bg-bg-glass backdrop-blur-sm"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isInView ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ transformOrigin: "left" }}
            >
              <motion.div
                className="text-[10px] font-mono text-accent-primary"
                animate={{
                  filter: glitchActive ? `url(#${uniqueId}-glitch)` : 'none'
                }}
              >
                {terminalText}
              </motion.div>

              <motion.div
                className="ml-auto h-2 w-2 rounded-full bg-accent-primary"
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
            </motion.div>

            {/* Editorial content area */}
            <div className="mt-8">
              <ScrollReveal direction="up" delay={0.4}>
                <Heading
                  level={2}
                  className="text-4xl md:text-5xl font-extrabold text-text-primary mb-8 relative"
                >
                  {/* Editorial heading decoration */}
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-accent-primary hidden md:block" />

                  {heading}

                  {/* Tech decoration */}
                  <div className="absolute -right-2 -bottom-2 w-6 h-6 border-b border-r border-accent-oceanic/60 hidden md:block" />
                </Heading>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.5}>
                <div className="mb-12 text-lg text-text-primary relative">
                  <RichText content={content} />

                  {/* Technical measurement line */}
                  <motion.div
                    className="absolute -left-6 top-1/2 w-4 border-t border-accent-oceanic/40 hidden md:block"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isInView ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </ScrollReveal>

              {/* Availability Note - modern architectural style */}
              {availabilityNote && (
                <ScrollReveal direction="up" delay={0.6}>
                  <div className="mb-8 text-sm text-accent-primary font-mono border-l border-accent-primary pl-4 py-2 bg-bg-glass backdrop-blur-sm">
                    {availabilityNote}
                  </div>
                </ScrollReveal>
              )}

              {/* CTA Button with architectural styling */}
              <div className="flex justify-center md:justify-start">
                <div
                  className="relative"
                  onMouseEnter={() => setIsCTAHovered(true)}
                  onMouseLeave={() => setIsCTAHovered(false)}
                >
                  <motion.div
                    className="relative"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    {/* Modern button */}
                    <Button
                      intent="primary"
                      size="lg"
                      href={ctaLink}
                      className={cn(
                        "relative border border-accent-primary bg-accent-primary text-white transition-all",
                        "shadow-[0px_0px_20px_rgba(var(--color-accent-primary-rgb),0.3)]",
                        "hover:shadow-[0px_0px_30px_rgba(var(--color-accent-primary-rgb),0.4)]",
                        "hover:-translate-y-1",
                        "text-lg md:text-xl font-bold tracking-wider py-4 px-8"
                      )}
                      icon={<Icon name="fi:FiArrowRight" size={24} />}
                      iconPosition="right"
                    >
                      {ctaText}
                    </Button>

                    {/* Data flow animation around button */}
                    <AnimatePresence>
                      {isCTAHovered && (
                        <motion.div
                          className="absolute -inset-3 pointer-events-none"
                          exit={{ opacity: 0 }}
                        >
                          <svg className="w-full h-full">
                            <rect
                              x="0"
                              y="0"
                              width="100%"
                              height="100%"
                              fill="none"
                              stroke={`url(#${uniqueId}-data-flow)`}
                              strokeWidth="1"
                              strokeDasharray="4 4"
                              className="opacity-70"
                            />

                            {/* Corner measurement markers */}
                            {[
                              {x: 0, y: 0},
                              {x: '100%', y: 0},
                              {x: '100%', y: '100%'},
                              {x: 0, y: '100%'}
                            ].map((pos, i) => (
                              <motion.circle
                                key={`corner-${i}`}
                                cx={pos.x}
                                cy={pos.y}
                                r="2"
                                fill="var(--color-accent-primary)"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * i }}
                              />
                            ))}

                            {/* Data flow pulse */}
                            <motion.circle
                              r="3"
                              fill={`url(#${uniqueId}-data-flow)`}
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: [0, 1, 0],
                                offsetDistance: ["0%", "100%"],
                              }}
                              exit={{ opacity: 0 }}
                              style={{
                                offsetPath: "path('M0,0 L100%,0 L100%,100% L0,100% Z')",
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "loop"
                              }}
                            />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Technical measurement readout */}
                  <motion.div
                    className="absolute -right-4 -bottom-8 text-[10px] font-mono text-accent-oceanic/70 flex items-center gap-2 whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isInView ? 0.8 : 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <span>EFF/{techData.efficiency}%</span>
                    <div className="h-1 w-1 rounded-full bg-accent-primary animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Multiple scan line effects */}
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
    </section>
  );
};

export default PortfolioCTA;