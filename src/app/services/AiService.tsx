// app/services/services/AiService.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useTransform, useScroll } from "framer-motion";
import Image from "next/image";
import { Heading, Text } from "@/components/common/Typography";
import { Button } from "@/components/common/Button";
import { ScrollReveal } from "@/components/core/Animations"; // Removed unused TextReveal
import { BlueprintCorner } from "@/components/common/VisualInterest";
import { useAnimationPreferences } from "@/components/core/Animations";
import { cn } from "@/utils/classNames";

interface ServiceFeature {
  title: string;
  description: string;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface PricingTier {
  title: string;
  price: string;
}

interface ServiceContent {
  id: string;
  title: string;
  introduction: string;
  imageSrc: string;
  imageAlt: string;
  features: ServiceFeature[];
  process: ProcessStep[];
  pricing: PricingTier[] | Record<string, string>; // Update to handle both array and object format
  exampleProject: {
    title: string;
    description: string;
  };
  ctaText: string;
  ctaLink: string;
}

interface AiServiceProps {
  content: ServiceContent;
  className?: string;
}

const AiService: React.FC<AiServiceProps> = ({
  content,
  className,
}) => {
  // Hooks first, before any conditional returns
  const { shouldAnimate } = useAnimationPreferences();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [uniqueId] = useState(`ai-${Math.floor(Math.random() * 10000)}`);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [processPulse, setProcessPulse] = useState<number | null>(null);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundParallax = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 1]);

  // Random technical data for UI elements
  const [techData] = useState({
    sectionDepth: Math.floor(Math.random() * 10) + 10,
    processingPower: Math.floor(Math.random() * 20) + 80,
    systemStatus: "OPERATIONAL",
    timestamp: new Date().toISOString().split('T')[0],
  });

  // Safely check if content exists after hooks
  if (!content) return null;

  // Animate process steps sequentially
  useEffect(() => {
    if (!shouldAnimate() || !isInView) return;

    const interval = setInterval(() => {
      setProcessPulse(prev => {
        const nextStep = prev === null
          ? 0
          : (prev + 1) % (content.process?.length ?? 1);
        return nextStep;
      });

      setTimeout(() => {
        setProcessPulse(null);
      }, 1500);
    }, 4000);

    return () => clearInterval(interval);
  }, [shouldAnimate, isInView, content.process?.length]);

  return (
    <section
      ref={sectionRef}
      id={content.id}
      className={cn("py-24 relative overflow-hidden", className)}
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

          {/* Gradient for process pulses */}
          <linearGradient id={`${uniqueId}-process-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-accent-oceanic)" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Background pattern with parallax */}
      <motion.div
        className="absolute inset-0 bg-blueprint-grid opacity-[0.03]"
        style={{ y: backgroundParallax }}
      />

      {/* Technical measurement guides */}
      <div className="absolute left-4 top-0 bottom-0 w-px border-l border-dashed border-accent-primary/10"></div>
      <div className="absolute right-4 top-0 bottom-0 w-px border-r border-dashed border-accent-primary/10"></div>

      {/* Blueprint corners for architectural feel */}
      <div className="absolute top-4 left-4 text-accent-primary/20">
        <BlueprintCorner size={30} />
      </div>
      <div className="absolute top-4 right-4 rotate-90 text-accent-primary/20">
        <BlueprintCorner size={30} />
      </div>

      {/* Technical readout */}
      <motion.div
        className="absolute top-4 right-10 text-xs font-mono text-accent-oceanic/70 bg-bg-glass backdrop-blur-sm px-2 py-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 0.8 : 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        SECTION/01 DEPTH/{techData.sectionDepth}
      </motion.div>

      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">
        {/* Service header with number prefix */}
        <div id={`detail-${content.id}`} className="flex items-center mb-16">
          <div className="relative">
            <div className="text-8xl font-black text-accent-primary/10">01</div>
            <motion.div
              className="absolute -right-6 -bottom-4 w-12 h-[3px]"
              style={{ background: "var(--color-accent-primary)" }}
              initial={{ width: 0 }}
              animate={{ width: isInView ? 48 : 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </div>
          <Heading
            level={2}
            className="text-3xl md:text-4xl font-bold ml-6 relative"
          >
            {content.title?.toUpperCase()}
            <motion.div
              className="absolute -bottom-2 left-0 h-[2px] w-full"
              style={{ background: "var(--color-accent-primary)", transformOrigin: "left" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isInView ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            />
          </Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          {/* Image column */}
          <div className="md:col-span-5 lg:col-span-5">
            <ScrollReveal>
              <div id={`img-${content.id}`} className="relative">
                {/* Architectural frame */}
                <div className="absolute -top-3 -left-3 right-12 h-12 border-t-2 border-l-2 border-accent-primary/30"></div>
                <div className="absolute -bottom-3 -right-3 left-12 h-12 border-b-2 border-r-2 border-accent-primary/30"></div>

                {/* Image container with tech-inspired overlay */}
                <motion.div
                  className="relative overflow-hidden"
                  style={{ scale: imageScale }}
                >
                  {/* Technical grid overlay */}
                  <div className="absolute inset-0 bg-blueprint-grid opacity-40 z-10 mix-blend-multiply" />

                  {/* Image */}
                  <Image
                    src={content.imageSrc}
                    alt={content.imageAlt}
                    width={600}
                    height={450}
                    className="w-full object-cover aspect-[4/3]"
                  />

                  {/* Measurement points for technical feel */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-accent-primary/50"></div>
                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-accent-primary/50"></div>
                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-accent-primary/50"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-accent-primary/50"></div>
                  </div>

                  {/* Technical data point with pulse */}
                  <motion.div
                    className="absolute bottom-3 right-3 bg-bg-glass backdrop-blur-sm border border-accent-oceanic/40 px-2 py-1 text-[10px] font-mono text-accent-oceanic"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isInView ? 0.9 : 0,
                      y: isInView ? [2, 0, 2] : 0
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.7,
                      y: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }
                    }}
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
                      <span>AI:ACTIVE</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>

          {/* Introduction text */}
          <div className="md:col-span-7 lg:col-span-7">
            <ScrollReveal direction="up">
              <div id={`${content.id}-intro`} className="relative">
                {/* Technical element beside text */}
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-accent-primary/30"></div>

                <Text className="text-lg leading-relaxed mb-6">
                  {content.introduction}
                </Text>

                {/* Technical metrics with animated bars */}
                <motion.div
                  className="mt-8 p-4 bg-bg-secondary border-l-4 border-accent-primary"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 30 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="text-xs font-mono mb-4 text-accent-primary">
                    SYSTEM METRICS
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Processing</span>
                        <span>{techData.processingPower}%</span>
                      </div>
                      <div className="h-2 bg-bg-tertiary/30 overflow-hidden">
                        <motion.div
                          className="h-full bg-accent-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${techData.processingPower}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Efficiency</span>
                        <span>{Math.floor(Math.random() * 20) + 75}%</span>
                      </div>
                      <div className="h-2 bg-bg-tertiary/30 overflow-hidden">
                        <motion.div
                          className="h-full bg-accent-oceanic"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.floor(Math.random() * 20) + 75}%` }}
                          transition={{ duration: 1, delay: 0.9 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Features section */}
        <div className="mb-24">
          <ScrollReveal>
            <div className="flex items-center mb-10">
              <Heading
                id={`${content.id}-getHead`}
                level={3}
                className="text-2xl font-bold relative inline-block"
              >
                WHAT YOU GET
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-accent-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isInView ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
              </Heading>

              {/* Technical indicator */}
              <motion.div
                className="ml-4 px-2 py-1 text-xs font-mono text-accent-oceanic/70 bg-bg-glass backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                {content.features?.length ?? 0} COMPONENTS
              </motion.div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.features?.map((feature, index) => (
              <ScrollReveal
                key={index}
                direction="up"
                delay={0.1 * index}
              >
                <motion.div
                  id={`${content.id}-get-${index + 1}`}
                  className={cn(
                    "relative h-full transition-all duration-300 transform",
                    activeFeature === index
                      ? "scale-[1.02] z-10"
                      : "scale-100 z-0"
                  )}
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(null)}
                >
                  {/* Neo-brutalist card styling */}
                  <div className={cn(
                    "h-full border-2 bg-bg-secondary p-6 transition-all",
                    activeFeature === index
                      ? "border-accent-primary shadow-[6px_6px_0px_0px_rgba(var(--color-accent-primary-rgb),0.2)]"
                      : "border-divider"
                  )}>
                    {/* Feature number */}
                    <div className={cn(
                      "text-4xl font-black mb-4 transition-colors",
                      activeFeature === index
                        ? "text-accent-primary"
                        : "text-accent-primary/20"
                    )}>
                      {`0${index + 1}`}
                    </div>

                    <Heading level={4} className="text-xl font-bold mb-3">
                      {feature.title}
                    </Heading>

                    <Text className={cn(
                      "transition-colors",
                      activeFeature === index
                        ? "text-text-primary"
                        : "text-text-secondary"
                    )}>
                      {feature.description}
                    </Text>

                    {/* Decorative corner */}
                    <div
                      className={cn(
                        "absolute bottom-0 right-0 w-4 h-4 transition-colors",
                        activeFeature === index
                          ? "border-t border-l border-accent-primary"
                          : "border-t border-l border-divider"
                      )}
                    ></div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Process section with animated connections */}
        <div className="mb-24">
          <ScrollReveal>
            <div className="flex items-center mb-10">
              <Heading
                id={`${content.id}-how`}
                level={3}
                className="text-2xl font-bold relative inline-block"
              >
                HOW IT WORKS
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-accent-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isInView ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
              </Heading>
            </div>
          </ScrollReveal>

          {/* Process steps in a timeline */}
          <div className="relative flex flex-col md:flex-row space-y-12 md:space-y-0 md:space-x-6">
            {/* Connecting line for desktop */}
            <div className="absolute top-12 left-0 hidden md:block">
              <motion.div
                className="absolute top-6 h-[2px] bg-accent-primary/50"
                style={{ left: "24px", right: "24px" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </div>

            {content.process?.map((step, index) => (
              <div
                key={index}
                id={`${content.id}-s${index + 1}`}
                className="flex-1 relative"
              >
                <ScrollReveal delay={0.2 * index}>
                  <div
                    className={cn(
                      "p-6 bg-bg-glass backdrop-blur-sm border-l-4 h-full transition-all",
                      processPulse === index
                        ? "border-accent-primary bg-bg-glass/80"
                        : "border-divider"
                    )}
                  >
                    {/* Step number circle */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-bg-tertiary mb-6 relative">
                      <span className={cn(
                        "text-xl font-bold transition-colors",
                        processPulse === index
                          ? "text-accent-primary"
                          : "text-text-primary"
                      )}>
                        {index + 1}
                      </span>

                      {/* Pulse animation when active */}
                      {processPulse === index && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          initial={{ opacity: 0.7, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.5 }}
                          transition={{
                            duration: 1.5,
                            repeat: 1,
                            repeatType: "reverse"
                          }}
                          style={{
                            background: `url(#${uniqueId}-process-gradient)`,
                            backgroundSize: "100% 100%"
                          }}
                        />
                      )}
                    </div>

                    <Heading level={4} className="text-xl font-bold mb-3">
                      {step.title}
                    </Heading>

                    <Text className="text-text-secondary">
                      {step.description}
                    </Text>

                    {/* Technical indicator dot */}
                    <div className="absolute top-6 md:top-0 left-6 md:left-1/2 md:-translate-x-6 w-1 h-1 bg-accent-primary"></div>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>

        {/* Example project */}
        <div className="mb-20">
          <ScrollReveal>
            <div
              className="relative p-8 border-l-4 border-accent-primary bg-bg-secondary"
            >
              {/* Technical corner elements */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent-primary/30"></div>
              <div className="absolute bottom-0 left-12 w-12 h-12 border-b-2 border-l-2 border-accent-primary/30"></div>

              <Heading level={3} className="text-2xl font-bold mb-4 flex items-center">
                <span className="text-accent-primary mr-3">/</span>
                Example Project
              </Heading>

              <Text className="text-lg leading-relaxed">
                {content.exampleProject?.description || "Example project details coming soon"}
              </Text>

              {/* Technical measurement tags */}
              {/* ...existing code... */}
            </div>
          </ScrollReveal>
        </div>

        {/* Pricing section with technical styling */}
        <div className="mb-16">
          <ScrollReveal>
            <div className="flex items-center mb-8">
              <Heading
                id={`${content.id}-price`}
                level={3}
                className="text-2xl font-bold relative inline-block"
              >
                PRICING STARTS AT
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-accent-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isInView ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
              </Heading>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(content.pricing)
              ? content.pricing?.map((tier, index) => (
                  <ScrollReveal key={index} delay={0.2 * index}>
                    <motion.div
                      className="flex items-stretch border-2 border-divider overflow-hidden"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Price column with accent background */}
                      <div className="w-1/3 bg-accent-primary/10 flex flex-col items-center justify-center p-6 text-center">
                        <div className="text-3xl font-bold text-accent-primary mb-2">
                          {tier.price}
                        </div>

                        {/* Diagonal line pattern - architectural element */}
                        <div className="w-full h-[1px] bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,var(--color-accent-primary)_2px,var(--color-accent-primary)_3px)]"></div>
                      </div>

                      {/* Title column */}
                      <div className="w-2/3 p-6 flex items-center">
                        <div className="text-xl">{tier.title}</div>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))
              : Object.entries(content.pricing || {}).map(([key, value], index) => (
                  <ScrollReveal key={key} delay={0.2 * index}>
                    <motion.div
                      className="flex items-stretch border-2 border-divider overflow-hidden"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Price column with accent background */}
                      <div className="w-1/3 bg-accent-primary/10 flex flex-col items-center justify-center p-6 text-center">
                        <div
                          className="text-3xl font-bold text-accent-primary mb-2"
                          dangerouslySetInnerHTML={{
                            __html: typeof value === 'string' && value.includes('$')
                              ? value.substring(0, value.indexOf('—')).trim()
                              : value
                          }}
                        />

                        {/* Diagonal line pattern - architectural element */}
                        <div className="w-full h-[1px] bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,var(--color-accent-primary)_2px,var(--color-accent-primary)_3px)]"></div>
                      </div>

                      {/* Title column */}
                      <div className="w-2/3 p-6 flex items-center">
                        <div
                          className="text-xl"
                          dangerouslySetInnerHTML={{
                            __html: typeof value === 'string' && value.includes('—')
                              ? value.substring(value.indexOf('—') + 1).trim()
                              : key
                          }}
                        />
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))
            }
          </div>
        </div>

        {/* CTA Button */}
        <ScrollReveal>
          <div className="flex justify-start mt-12">
            <div className="relative group">
              {/* Button with technical frame */}
              <div className="absolute -left-3 -top-3 w-8 h-8 border-l-2 border-t-2 border-accent-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <Button
                id={`${content.id}-cta`}
                intent="primary"
                size="lg"
                href={content.ctaLink}
              >
                {content.ctaText} →
              </Button>

              <div className="absolute -right-3 -bottom-3 w-8 h-8 border-r-2 border-b-2 border-accent-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Technical status and timestamp footer */}
      <motion.div
        className="absolute bottom-4 right-4 text-xs font-mono text-accent-oceanic/60 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
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
        <span>STATUS/{techData.systemStatus}</span>
        <span className="ml-2">{techData.timestamp}</span>
      </motion.div>

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

export default AiService;