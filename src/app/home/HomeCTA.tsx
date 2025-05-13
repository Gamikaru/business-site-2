// src/components/home/HomeCTA.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ScrollReveal,
  TextReveal,
  AnimatedPath,
  staggerContainerVariants,
  staggerItemVariants
} from "@/components/core/Animations";
import { Button } from "@/components/common/Button";
import { Heading, Text } from "@/components/common/Typography";
import { cn } from "@/utils/classNames";

interface HomeCTAProps {
  heading: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  availability: string;
  newsletter: {
    heading: string;
    description: string;
    buttonText: string;
    privacyText: string;
  };
  className?: string;
}

const HomeCTA: React.FC<HomeCTAProps> = ({
  heading,
  content,
  ctaText,
  ctaLink,
  availability,
  newsletter,
  className,
}) => {
  // References for animations and visibility tracking
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const isLeftInView = useInView(leftColRef, { once: false, margin: "-10% 0px" });
  const isRightInView = useInView(rightColRef, { once: false, margin: "-10% 0px" });

  // State for form handling and technical display
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Technical display values
  const [techValues] = useState({
    processorLoad: Math.floor(Math.random() * 30) + 20, // 20-50%
    systemUptime: Math.floor(Math.random() * 10000) + 20000, // 20000-30000 minutes
    memoryUsage: Math.floor(Math.random() * 40) + 30, // 30-70%
    networkStrength: Math.floor(Math.random() * 30) + 70, // 70-100%
    renderTime: Math.floor(Math.random() * 200) + 100, // 100-300ms
  });

  // Scroll animation controls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.1, 0.05]);

  // Track mouse/pointer movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  // Form submission handling
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    // Simple email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call with technical visualization
    const startProgress = performance.now();

    setTimeout(() => {
      const endProgress = performance.now();
      const processingTime = Math.floor(endProgress - startProgress);

      console.log(`Newsletter signup processed in ${processingTime}ms`);

      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail("");

      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1000);
  };

  // Update system uptime counter
  useEffect(() => {
    const interval = setInterval(() => {
      setTechValues(prev => ({
        ...prev,
        systemUptime: prev.systemUptime + 1
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      className={cn("relative bg-bg-secondary overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Technical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Technical blueprint grid with parallax effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            y: backgroundY,
            opacity: gridOpacity
          }}
        >
          <div className="absolute inset-0 bg-blueprint-grid"></div>
        </motion.div>

        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-circuit"></div>

        {/* Technical grid measurement lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`grid-h-${i}`}
              x1="0"
              y1={`${(i + 1) * 12.5}%`}
              x2="100%"
              y2={`${(i + 1) * 12.5}%`}
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.3"
              strokeDasharray="5 5"
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`grid-v-${i}`}
              x1={`${(i + 1) * 12.5}%`}
              y1="0"
              x2={`${(i + 1) * 12.5}%`}
              y2="100%"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.3"
              strokeDasharray="5 5"
            />
          ))}
        </svg>

        {/* Dynamic data flow line */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <motion.path
            d={`M0,${50 + mousePosition.y * 0.2} C${20 + mousePosition.x * 0.3},${30 + mousePosition.y * 0.4},${60 + mousePosition.x * 0.2},${70 - mousePosition.y * 0.3},100,${50 - mousePosition.y * 0.2}`}
            stroke="var(--color-brand-primary)"
            strokeWidth="1"
            strokeOpacity="0.1"
            fill="none"
            animate={{
              d: `M0,${50 + mousePosition.y * 0.2} C${20 + mousePosition.x * 0.3},${30 + mousePosition.y * 0.4},${60 + mousePosition.x * 0.2},${70 - mousePosition.y * 0.3},100,${50 - mousePosition.y * 0.2}`
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>

      {/* Technical system status bar */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-divider bg-bg-tertiary/30 backdrop-blur-sm hidden md:block">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse mr-2"></div>
              <span className="text-xs font-mono text-text-secondary">SYS.ACTIVE</span>
            </div>
            <div className="text-xs font-mono text-text-tertiary">
              CPU/{techValues.processorLoad}%
            </div>
            <div className="text-xs font-mono text-text-tertiary">
              MEM/{techValues.memoryUsage}%
            </div>
          </div>
          <div className="text-xs font-mono text-text-tertiary">
            UP/{Math.floor(techValues.systemUptime / 60)}h {techValues.systemUptime % 60}m
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 md:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* Left column - Main CTA */}
          <div ref={leftColRef}>
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate={isLeftInView ? "visible" : "hidden"}
            >
              {/* Section heading with technical framing */}
              <motion.div variants={staggerItemVariants} className="mb-6">
                <div className="relative">
                  <TextReveal
                    direction="up"
                    delay={0.2}
                    splitBy="words"
                    staggerChildren={true}
                  >
                    <Heading
                      level={2}
                      className="text-[clamp(1.8rem,3.2vw+1rem,2.4rem)] font-heading font-bold text-heading"
                    >
                      {heading}
                    </Heading>
                  </TextReveal>

                  {/* Technical measurement frame */}
                  <motion.div
                    className="absolute -left-6 top-1/2 -translate-y-1/2 h-12 w-px bg-brand-primary/60 hidden md:block"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isLeftInView ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  />

                  {/* Decorative technical elements */}
                  <motion.div
                    className="absolute -bottom-4 left-0 right-0 h-px bg-divider hidden md:block"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isLeftInView ? 1 : 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </motion.div>

              {/* Main content */}
              <motion.div variants={staggerItemVariants} className="relative mb-8">
                <div className="relative bg-bg-tertiary/10 backdrop-blur-sm rounded-sm p-6 border-l-2 border-brand-primary/50">
                  <Text className="text-lg text-text-primary leading-relaxed">
                    {content}
                  </Text>

                  {/* Corner details */}
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand-primary/30"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand-primary/30"></div>

                  {/* Technical readout */}
                  <motion.div
                    className="absolute -right-2 -bottom-2 w-6 h-6"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: isLeftInView ? 1 : 0, scale: isLeftInView ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M2 22L22 2M12 2V6M6 2H2V6M22 18V22H18M22 12H18M2 12H6M12 22V18"
                        stroke="var(--color-brand-primary)"
                        strokeWidth="1"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced CTA button with technical framing */}
              <motion.div variants={staggerItemVariants} className="relative">
                <div className="relative group">
                  {/* Technical scan line */}
                  <motion.div
                    className="absolute inset-0 -z-10 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                  >
                    <motion.div
                      className="absolute -inset-[1px] bg-gradient-to-r from-brand-primary/20 to-accent-oceanic/20 blur-sm"
                      animate={{
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </motion.div>

                  <Button
                    intent="gradient"
                    size="lg"
                    href={ctaLink}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1L15 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    }
                    iconPosition="right"
                    className="relative z-10"
                  >
                    {ctaText}
                  </Button>
                </div>

                {/* Technical frame corner */}
                <motion.div
                  className="absolute -left-3 -bottom-3 hidden md:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLeftInView ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M0 24L0 12L12 24" stroke="var(--color-accent-oceanic)" strokeWidth="1" strokeOpacity="0.5" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Availability note with technical styling */}
              <motion.div variants={staggerItemVariants} className="mt-8">
                <div className="relative">
                  <p className="text-text-secondary text-sm pl-6 border-l border-accent-oceanic/30">
                    {availability}
                  </p>

                  {/* Technical status indicator */}
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-accent-oceanic"></div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right column - Newsletter */}
          <div ref={rightColRef} className="lg:pl-8">
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate={isRightInView ? "visible" : "hidden"}
              className="relative"
            >
              {/* Technical frame */}
              <motion.div
                className="absolute -inset-6 border border-accent-oceanic/20 rounded-lg hidden lg:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: isRightInView ? 0.8 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Corner measurement markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent-oceanic/50"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent-oceanic/50"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accent-oceanic/50"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent-oceanic/50"></div>
              </motion.div>

              {/* Newsletter section heading */}
              <motion.div variants={staggerItemVariants} className="mb-6">
                <div className="relative">
                  <TextReveal
                    direction="up"
                    delay={0.2}
                    splitBy="words"
                    staggerChildren={true}
                  >
                    <Heading
                      level={3}
                      className="text-xl md:text-2xl font-heading font-semibold text-heading"
                    >
                      {newsletter.heading}
                    </Heading>
                  </TextReveal>

                  {/* Technical measurement indicators */}
                  <motion.div
                    className="absolute -top-6 left-0 hidden md:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isRightInView ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <svg width="100" height="24" viewBox="0 0 100 24" fill="none">
                      <AnimatedPath
                        d="M0 12H60"
                        stroke="var(--color-accent-oceanic)"
                        strokeWidth="0.5"
                        strokeDasharray="4 2"
                      />
                      <AnimatedPath
                        d="M70 12H100"
                        stroke="var(--color-accent-oceanic)"
                        strokeWidth="0.5"
                        strokeDasharray="4 2"
                      />
                      <motion.text
                        x="65" y="8"
                        fill="var(--color-accent-oceanic)"
                        fontSize="6"
                        fontFamily="monospace"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ delay: 0.8 }}
                      >
                        NWS
                      </motion.text>
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              {/* Newsletter description */}
              <motion.div variants={staggerItemVariants} className="mb-8">
                <Text className="text-text-secondary relative">
                  {newsletter.description}
                </Text>
              </motion.div>

              {/* Newsletter form with technical styling */}
              <motion.div variants={staggerItemVariants} className="mb-3">
                <form onSubmit={handleSubmit} className="relative">
                  {/* Technical scan effect */}
                  {isSubmitting && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent pointer-events-none"
                      style={{ height: "200%", top: "-50%" }}
                      animate={{ top: ["0%", "100%"] }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      {/* Email input with technical styling */}
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          className="w-full px-4 py-3 rounded-lg border border-border-input bg-bg-input focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent pr-10"
                          disabled={isSubmitting || isSuccess}
                        />

                        {/* Technical status indicator */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                          <div className={cn(
                            "w-2 h-2 rounded-full transition-colors duration-300",
                            email.length > 0
                              ? email.includes('@') && email.includes('.')
                                ? "bg-brand-primary"
                                : "bg-warning"
                              : "bg-accent-oceanic/50"
                          )}></div>
                        </div>

                        {/* Technical measurement guides */}
                        <div className="absolute -left-2 top-0 bottom-0 hidden lg:flex flex-col justify-between py-2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <motion.div
                              key={`tick-${i}`}
                              className="w-1 h-px bg-accent-oceanic/50"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: isRightInView ? 1 : 0 }}
                              transition={{ duration: 0.3, delay: 0.5 + (i * 0.1) }}
                              style={{ transformOrigin: "left" }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Submit button with technical effects */}
                    <div className="relative">
                      <Button
                        type="submit"
                        intent="primary"
                        className="whitespace-nowrap relative z-10"
                        disabled={isSubmitting || isSuccess}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                          </div>
                        ) : isSuccess ? 'Subscribed!' : newsletter.buttonText}
                      </Button>

                      {/* Technical processing indicator */}
                      {isSubmitting && (
                        <motion.div
                          className="absolute -right-12 top-1/2 -translate-y-1/2 hidden md:block text-[10px] font-mono text-brand-primary"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          PROC/{techValues.renderTime}ms
                        </motion.div>
                      )}
                    </div>
                  </div>
                </form>
              </motion.div>

              {/* Error message with technical styling */}
              {errorMessage && (
                <motion.div
                  className="mt-2 text-error text-sm flex items-center space-x-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Success message with animation */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-success text-sm flex items-center space-x-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Thank you for subscribing!</span>
                </motion.div>
              )}

              {/* Privacy note with technical styling */}
              <motion.div variants={staggerItemVariants} className="mt-4">
                <div className="relative">
                  <p className="text-text-tertiary text-xs pl-4 border-l border-divider">
                    {newsletter.privacyText}
                  </p>
                </div>
              </motion.div>

              {/* Technical data display */}
              <motion.div
                className="absolute -bottom-10 right-0 text-[10px] font-mono text-accent-oceanic/60 hidden lg:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: isRightInView ? 0.8 : 0 }}
                transition={{ duration: 0.4, delay: 1 }}
              >
                NET/{techValues.networkStrength}% • RENDER/{techValues.renderTime}ms
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Technical grid markers */}
      <div className="absolute bottom-0 left-4 right-4 hidden lg:flex justify-between items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`marker-${i}`}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + (i * 0.1) }}
          >
            <div className="w-px h-4 bg-accent-oceanic/50"></div>
            <span className="text-[10px] font-mono text-accent-oceanic/60">
              {i * 25}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default HomeCTA;