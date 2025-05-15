// app/services/ServicesProcess.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Heading, Text } from "@/components/common/Typography";
import { BlueprintCorner } from "@/components/common/VisualInterest";
import { ScrollReveal } from "@/components/core/Animations";
import { useAnimationPreferences } from "@/components/core/Animations";
import { cn } from "@/utils/classNames";

interface ProcessStep {
  title: string;
  description: string;
}

interface Principle {
  title: string;
  description: string;
}

interface ServicesProcessProps {
  processSteps: ProcessStep[];
  principles: Principle[];
  className?: string;
}

const ServicesProcess: React.FC<ServicesProcessProps> = ({
  processSteps,
  principles,
  className,
}) => {
  const { shouldAnimate } = useAnimationPreferences();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [uniqueId] = useState(`process-${Math.floor(Math.random() * 10000)}`);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [activePrinciple, setActivePrinciple] = useState<number | null>(null);
  const [glitchElement, setGlitchElement] = useState<string | null>(null);

  // Random technical data for UI embellishments
  const [techData] = useState({
    sectionDepth: Math.floor(Math.random() * 10) + 10,
    processingStatus: "ACTIVE",
    sequenceCount: processSteps.length + principles.length,
    timestamp: new Date().toISOString().split('T')[0],
  });

  // Sequential highlighting for process steps
  useEffect(() => {
    if (!shouldAnimate() || !isInView) return;

    let stepIndex = 0;
    const interval = setInterval(() => {
      // Highlight current step
      setActiveStep(stepIndex);

      // Move to next step after delay
      setTimeout(() => {
        setActiveStep(null);
        stepIndex = (stepIndex + 1) % processSteps.length;
      }, 1500);
    }, 3000);

    return () => clearInterval(interval);
  }, [shouldAnimate, isInView, processSteps.length]);

  // Occasional glitch effect
  useEffect(() => {
    if (!shouldAnimate() || !isInView) return;

    const glitchInterval = setInterval(() => {
      // Randomly select an element type to glitch
      const elementType = Math.random() > 0.5 ? "step" : "principle";
      const index = Math.floor(
        Math.random() * (elementType === "step" ? processSteps.length : principles.length)
      );

      // Apply glitch effect
      setGlitchElement(`${elementType}-${index}`);

      // Remove glitch effect after short delay
      setTimeout(() => {
        setGlitchElement(null);
      }, 150);
    }, 7000);

    return () => clearInterval(glitchInterval);
  }, [shouldAnimate, isInView, processSteps.length, principles.length]);

  return (
    <section
      ref={sectionRef}
      className={cn("py-24 relative overflow-hidden bg-bg-secondary", className)}
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

      {/* Background pattern */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-[0.03]" />

      {/* Diagonal stripes - subtle element */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.02] pointer-events-none">
        <div className="absolute -inset-[100px] bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,var(--color-accent-primary)_20px,var(--color-accent-primary)_22px)]"></div>
      </div>

      {/* Blueprint corners for architectural feel */}
      <div className="absolute top-0 left-0 text-accent-primary/20">
        <BlueprintCorner size={40} />
      </div>
      <div className="absolute top-0 right-0 rotate-90 text-accent-primary/20">
        <BlueprintCorner size={40} />
      </div>
      <div className="absolute bottom-0 left-0 -rotate-90 text-accent-primary/20">
        <BlueprintCorner size={40} />
      </div>
      <div className="absolute bottom-0 right-0 rotate-180 text-accent-primary/20">
        <BlueprintCorner size={40} />
      </div>

      {/* Technical readout */}
      <motion.div
        className="absolute top-4 right-4 text-xs font-mono text-accent-oceanic/70 bg-bg-glass backdrop-blur-sm px-2 py-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 0.8 : 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        PROCESS/SEQ.{techData.sequenceCount}
      </motion.div>

      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">
        <ScrollReveal>
          <div className="flex items-center justify-center mb-16">
            <div className="w-12 h-px bg-accent-primary/30"></div>
            <Heading
              id="wrkHead"
              level={2}
              className="text-3xl font-bold mx-6 relative"
            >
              HOW I WORK
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-[2px] bg-accent-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isInView ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ transformOrigin: "center" }}
              />
            </Heading>
            <div className="w-12 h-px bg-accent-primary/30"></div>
          </div>
        </ScrollReveal>

        {/* Process Steps - Timeline style with architectural elements */}
        <div className="mb-24">
          {/* Desktop version - horizontal timeline */}
          <div className="hidden md:flex justify-between items-stretch mb-12 relative">
            {/* Connecting timeline line */}
            <motion.div
              className="absolute top-[76px] left-0 right-0 h-1 bg-bg-tertiary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isInView ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ transformOrigin: "left" }}
            />

            {/* Process line progress indicator */}
            <motion.div
              className="absolute top-[76px] left-0 h-1 bg-accent-primary"
              initial={{ width: "0%" }}
              animate={{
                width: activeStep !== null
                  ? `${((activeStep + 1) / processSteps.length) * 100}%`
                  : "0%"
              }}
              transition={{ duration: 0.6 }}
            />

            {processSteps.map((step, index) => (
              <div
                key={index}
                id={`wrk${index + 1}`}
                className={cn(
                  "relative flex-1 max-w-[280px] transition-all duration-300",
                  glitchElement === `step-${index}` && "filter",
                  activeStep === index ? "z-10" : "z-0"
                )}
                style={glitchElement === `step-${index}` ? { filter: `url(#${uniqueId}-glitch)` } : {}}
              >
                <ScrollReveal delay={0.2 * index}>
                  <motion.div
                    className={cn(
                      "p-6 border-2 h-full bg-bg-tertiary/5 transition-all",
                      activeStep === index
                        ? "border-accent-primary shadow-[6px_6px_0px_0px_rgba(var(--color-accent-primary-rgb),0.15)]"
                        : "border-divider"
                    )}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Step number */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-2 mb-6 absolute top-[70px] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-secondary transition-colors",
                        activeStep === index
                          ? "border-accent-primary"
                          : "border-divider"
                      )}
                    >
                      <span className={cn(
                        "font-bold transition-colors",
                        activeStep === index
                          ? "text-accent-primary"
                          : "text-text-primary"
                      )}>
                        {index + 1}
                      </span>

                      {/* Pulse animation when active */}
                      <AnimatePresence>
                        {activeStep === index && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-accent-primary"
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ opacity: 0, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, repeat: 1 }}
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Content starts below the timeline */}
                    <div className="mt-8 pt-6">
                      <Heading level={4} className="text-xl font-bold mb-3">
                        {step.title}
                      </Heading>
                      <Text className={cn(
                        "transition-colors",
                        activeStep === index ? "text-text-primary" : "text-text-secondary"
                      )}>
                        {step.description}
                      </Text>
                    </div>

                    {/* Technical corner detail */}
                    <div
                      className={cn(
                        "absolute bottom-0 right-0 w-6 h-6 transition-colors",
                        activeStep === index
                          ? "border-t border-l border-accent-primary"
                          : "border-t border-l border-divider"
                      )}
                    ></div>
                  </motion.div>

                  {/* Step number indicator for mobile */}
                  <div className="absolute -left-2 top-0 text-xs font-mono text-accent-oceanic/70 md:hidden">
                    {`0${index + 1}`}
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>

          {/* Mobile version - vertical steps */}
          <div className="md:hidden space-y-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
                id={`wrk${index + 1}`}
                className={cn(
                  "relative transition-all duration-300 border-l-4 pl-6",
                  glitchElement === `step-${index}` && "filter",
                  activeStep === index
                    ? "border-accent-primary"
                    : "border-divider"
                )}
                style={glitchElement === `step-${index}` ? { filter: `url(#${uniqueId}-glitch)` } : {}}
              >
                <ScrollReveal delay={0.2 * index}>
                  {/* Step number */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center absolute -left-4 bg-bg-secondary transition-colors border",
                      activeStep === index
                        ? "border-accent-primary"
                        : "border-divider"
                    )}
                  >
                    <span className={cn(
                      "font-bold text-sm transition-colors",
                      activeStep === index
                        ? "text-accent-primary"
                        : "text-text-primary"
                    )}>
                      {index + 1}
                    </span>
                  </div>

                  <Heading level={4} className="text-xl font-bold mb-2">
                    {step.title}
                  </Heading>
                  <Text className={cn(
                    "transition-colors",
                    activeStep === index ? "text-text-primary" : "text-text-secondary"
                  )}>
                    {step.description}
                  </Text>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>

        {/* Principles section */}
        <ScrollReveal>
          <div className="flex items-center justify-center mb-16">
            <div className="w-12 h-px bg-accent-primary/30"></div>
            <Heading
              id="prnHead"
              level={3}
              className="text-2xl font-bold mx-6 relative"
            >
              PRINCIPLES I WORK BY
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-[2px] bg-accent-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isInView ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ transformOrigin: "center" }}
              />
            </Heading>
            <div className="w-12 h-px bg-accent-primary/30"></div>
          </div>
        </ScrollReveal>

        {/* Principles Grid - Neo-brutalist style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {principles.map((principle, index) => (
            <div
              key={index}
              id={`p${index + 1}`}
              className={cn(
                "relative transition-all duration-300 transform",
                glitchElement === `principle-${index}` && "filter",
                activePrinciple === index
                  ? "scale-[1.02] z-10"
                  : "scale-100 z-0"
              )}
              style={glitchElement === `principle-${index}` ? { filter: `url(#${uniqueId}-glitch)` } : {}}
              onMouseEnter={() => setActivePrinciple(index)}
              onMouseLeave={() => setActivePrinciple(null)}
            >
              <ScrollReveal delay={0.15 * index}>
                <motion.div
                  className={cn(
                    "relative h-full border-2 bg-bg-glass backdrop-blur-sm p-6 transition-all",
                    activePrinciple === index
                      ? "border-accent-primary shadow-[6px_6px_0px_0px_rgba(var(--color-accent-primary-rgb),0.2)]"
                      : "border-divider"
                  )}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Bold number label - architectural element */}
                  <div
                    className={cn(
                      "absolute -top-4 -left-4 flex items-center justify-center w-10 h-10 transition-colors",
                      activePrinciple === index
                        ? "bg-accent-primary text-bg-secondary"
                        : "bg-bg-tertiary text-text-primary border border-divider"
                    )}
                  >
                    <span className="font-bold">0{index + 1}</span>
                  </div>

                  <div className="mt-8">
                    <Heading level={4} className="text-xl font-bold mb-3">
                      {principle.title}
                    </Heading>
                    <Text className={cn(
                      "transition-colors",
                      activePrinciple === index ? "text-text-primary" : "text-text-secondary"
                    )}>
                      {principle.description}
                    </Text>
                  </div>

                  {/* Connection indicator on active state */}
                  <AnimatePresence>
                    {activePrinciple === index && (
                      <motion.div
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-8 bg-accent-primary"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ transformOrigin: "top" }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </ScrollReveal>
            </div>
          ))}
        </div>

        {/* Technical footer */}
        <motion.div
          className="mt-16 flex justify-between items-center text-xs font-mono text-accent-oceanic/60 border-t border-divider pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 0.7 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
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
            <span>STATUS/{techData.processingStatus}</span>
          </div>

          <div>{techData.timestamp}</div>
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

export default ServicesProcess;