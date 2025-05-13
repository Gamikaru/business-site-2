// src/components/home/HomeTestimonials.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ScrollReveal, TextReveal, AnimatedPath } from "@/components/core/Animations";
import { Divider } from "@/components/common/Divider";
import { Heading } from "@/components/common/Typography";
import { cn } from "@/utils/classNames";

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  result: string;
}

interface HomeTestimonialsProps {
  heading: string;
  items: TestimonialItem[];
  className?: string;
}

const HomeTestimonials: React.FC<HomeTestimonialsProps> = ({
  heading,
  items,
  className,
}) => {
  // Reference for animations and scroll effects
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  // Active testimonial state (for multiple testimonials)
  const [activeIndex, setActiveIndex] = useState(0);
  const [highlightedText, setHighlightedText] = useState<number | null>(null);
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);

  // Technical display values
  const [techValues] = useState({
    confidenceScore: Math.floor(Math.random() * 20) + 80, // 80-99%
    testimonialDimensions: {
      width: Math.floor(Math.random() * 200) + 400,
      height: Math.floor(Math.random() * 100) + 200,
    },
    alignmentFactor: (Math.random() * 0.2 + 0.9).toFixed(2), // 0.90-1.10
  });

  // Scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityWave = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  // Check if quote is in view
  useEffect(() => {
    if (!quoteRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsQuoteVisible(true);
      } else {
        setIsQuoteVisible(false);
      }
    }, { threshold: 0.5 });

    observer.observe(quoteRef.current);
    return () => observer.disconnect();
  }, []);

  // Cycle through quote highlights for emphasis
  useEffect(() => {
    if (!isQuoteVisible) return;

    // Get the current testimonial
    const testimonial = items[activeIndex];
    // Split quote into segments for highlighting
    const segments = testimonial.quote.split(/\s*[,.]\s*/g).filter(segment => segment.trim().length > 0);

    // Set up cycling through segments
    let currentSegmentIndex = 0;

    const intervalId = setInterval(() => {
      setHighlightedText(currentSegmentIndex);
      currentSegmentIndex = (currentSegmentIndex + 1) % segments.length;

      // Reset after going through all segments
      if (currentSegmentIndex === 0) {
        setTimeout(() => {
          setHighlightedText(null);
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [activeIndex, isQuoteVisible, items]);

  // Get the current testimonial
  const testimonial = items[activeIndex];

  // Process quote for highlighting
  const processQuote = () => {
    if (!testimonial) return null;

    const segments = testimonial.quote.split(/\s*[,.]\s*/g).filter(segment => segment.trim().length > 0);

    return (
      <>
        <span className="text-4xl text-brand-primary">&quot;</span>
        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            <motion.span
              className={cn(
                "inline-block transition-colors duration-300",
                highlightedText === index ? "text-brand-primary font-semibold" : "text-text-primary"
              )}
              animate={{
                scale: highlightedText === index ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {segment}
            </motion.span>
            {index < segments.length - 1 && ", "}
          </React.Fragment>
        ))}
        <span className="text-4xl text-brand-primary">&quot;</span>
      </>
    );
  };

  return (
    <motion.section
      ref={sectionRef}
      className={cn("relative bg-bg-tertiary overflow-hidden", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Enhanced technical background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated wave background patterns */}
        <motion.div
          className="absolute inset-0"
          style={{
            y: backgroundY,
            opacity: opacityWave
          }}
        >
          {/* Multiple wave layers with animation */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="absolute inset-0"
          >
            <motion.path
              d="M0 89L48 97.2C96 105.3 192 121.7 288 130.3C384 139 480 139 576 147.2C672 155.3 768 171.7 864 171.8C960 172 1056 156 1152 147.2C1248 138.3 1344 138.7 1392 139L1440 139L1440 401L1392 401C1344 401 1248 401 1152 401C1056 401 960 401 864 401C768 401 672 401 576 401C480 401 384 401 288 401C192 401 96 401 48 401L0 401L0 89Z"
              fill="var(--wave-accent-1)"
              opacity="0.25"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.25 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.path
              d="M0 209L48 201.2C96 193.3 192 177.7 288 168.8C384 160 480 160 576 168.5C672 177 768 193 864 209.2C960 225.3 1056 241.7 1152 250.7C1248 259.7 1344 260.3 1392 260.7L1440 261L1440 401L1392 401C1344 401 1248 401 1152 401C1056 401 960 401 864 401C768 401 672 401 576 401C480 401 384 401 288 401C192 401 96 401 48 401L0 401L0 209Z"
              fill="var(--wave-accent-2)"
              opacity="0.15"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.15 }}
              transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
            />
          </svg>

          {/* Technical measurement grid overlay */}
          <svg
            className="absolute inset-0 opacity-5"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          >
            {/* Horizontal lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.line
                key={`h-${i}`}
                x1="0"
                y1={`${i * 10}%`}
                x2="100%"
                y2={`${i * 10}%`}
                stroke="var(--color-accent-oceanic)"
                strokeWidth={i % 5 === 0 ? "0.5" : "0.2"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.2 + (i * 0.05) }}
              />
            ))}

            {/* Vertical lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.line
                key={`v-${i}`}
                x1={`${i * 10}%`}
                y1="0"
                x2={`${i * 10}%`}
                y2="100%"
                stroke="var(--color-accent-oceanic)"
                strokeWidth={i % 5 === 0 ? "0.5" : "0.2"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.2 + (i * 0.05) }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Technical dots pattern */}
        <div className="absolute inset-0 opacity-10 bg-dots-dense"></div>
      </div>

      <div className="container mx-auto py-16 md:py-32 relative z-10">
        {/* Enhanced section header with technical styling */}
        <ScrollReveal
          direction="up"
          delay={0.2}
          className="text-center mb-12 md:mb-20 relative"
        >
          <div className="relative inline-block">
            <Heading
              level={2}
              className="text-[clamp(1.8rem,3.2vw+1rem,2.4rem)] font-heading font-bold text-heading uppercase"
            >
              {heading}
            </Heading>

            {/* Decorative technical elements */}
            <motion.div
              className="absolute -left-8 top-1/2 -translate-y-1/2 hidden md:block"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <AnimatedPath
                  d="M0 12H24"
                  stroke="var(--color-brand-primary)"
                  strokeWidth="2"
                />
              </svg>
            </motion.div>

            <motion.div
              className="absolute -right-8 top-1/2 -translate-y-1/2 hidden md:block"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <AnimatedPath
                  d="M24 12H0"
                  stroke="var(--color-brand-primary)"
                  strokeWidth="2"
                />
              </svg>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Enhanced testimonial container */}
        <div className="max-w-4xl mx-auto relative">
          {/* Technical measurement frame */}
          <motion.div
            className="absolute -inset-6 border border-accent-oceanic/30 hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {/* Corner measurement markers */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent-oceanic/80"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent-oceanic/80"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-accent-oceanic/80"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent-oceanic/80"></div>

            {/* Dimension measurements */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent-oceanic">
              W:{techValues.testimonialDimensions.width}px
            </div>
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-[10px] font-mono text-accent-oceanic transform -rotate-90">
              H:{techValues.testimonialDimensions.height}px
            </div>

            {/* Technical readout */}
            <div className="absolute -top-6 right-0 text-[10px] font-mono text-accent-oceanic">
              ALIGN:{techValues.alignmentFactor}
            </div>
          </motion.div>

          {/* Quote verification badge */}
          <motion.div
            className="absolute -left-10 top-4 hidden md:block"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="bg-bg-glass backdrop-blur-sm p-2 rounded-full border border-brand-primary/30">
              <div className="relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary)" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-brand-primary animate-pulse"></div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-brand-primary mt-1 text-center">
              VERIFIED
            </div>
          </motion.div>

          {/* Confidence score indicator */}
          <motion.div
            className="absolute -right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <div className="h-32 w-4 bg-bg-glass backdrop-blur-sm border border-accent-oceanic/30 rounded-full overflow-hidden">
              <motion.div
                className="w-full bg-brand-primary rounded-full"
                initial={{ height: 0 }}
                animate={{ height: `${techValues.confidenceScore}%` }}
                transition={{ duration: 1, delay: 1.5 }}
              ></motion.div>
            </div>
            <div className="text-[10px] font-mono text-accent-oceanic mt-2">
              CONF:{techValues.confidenceScore}%
            </div>
          </motion.div>

          {/* Main quote with dynamic highlighting */}
          <div ref={quoteRef} className="relative">
            <TextReveal
              splitBy="words"
              staggerChildren={true}
              direction="up"
              className="mb-8 text-center"
            >
              <div className="text-xl md:text-2xl lg:text-3xl font-heading italic leading-relaxed">
                {processQuote()}
              </div>
            </TextReveal>

            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-px bg-brand-primary"
              initial={{ width: 0 }}
              animate={{ width: isQuoteVisible ? "60%" : "0%" }}
              transition={{ duration: 1, delay: 0.5 }}
            ></motion.div>
          </div>

          {/* Author attribution with enhanced styling */}
          <ScrollReveal
            direction="up"
            delay={0.4}
            className="text-center mt-10 relative"
          >
            <div className="relative inline-block">
              <p className="text-lg font-medium text-brand-primary">
                — {testimonial.author}, {testimonial.role}
              </p>

              {/* Technical measurement lines */}
              <motion.div
                className="absolute -left-10 top-1/2 -translate-y-1/2 hidden md:block"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                style={{ transformOrigin: "right" }}
              >
                <svg width="40" height="2" viewBox="0 0 40 2">
                  <rect width="40" height="2" fill="var(--color-brand-primary)" opacity="0.3" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute -right-10 top-1/2 -translate-y-1/2 hidden md:block"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                style={{ transformOrigin: "left" }}
              >
                <svg width="40" height="2" viewBox="0 0 40 2">
                  <rect width="40" height="2" fill="var(--color-brand-primary)" opacity="0.3" />
                </svg>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Result highlight with technical styling */}
          <ScrollReveal
            direction="up"
            delay={0.5}
            className="mt-12 text-center"
          >
            <motion.div
              className="bg-bg-glass backdrop-blur-sm p-6 rounded-lg inline-block relative max-w-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ boxShadow: "0 0 20px rgba(var(--color-brand-primary-rgb), 0.2)" }}
            >
              {/* Technical corner details */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand-primary"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand-primary"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand-primary"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand-primary"></div>

              <div className="relative z-10">
                <p className="text-text-primary italic">
                  <span className="text-brand-primary font-bold inline-block mr-2">↑</span> {testimonial.result}
                </p>
              </div>

              {/* Technical data readout */}
              <div className="absolute -bottom-1 right-3 transform translate-y-full text-[8px] font-mono text-accent-cosmic hidden md:block">
                IMPACT/ASSESSMENT
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Multi-testimonial indicator dots (if you have multiple testimonials) */}
          {items.length > 1 && (
            <div className="flex justify-center mt-10 space-x-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors duration-300",
                    i === activeIndex ? "bg-brand-primary" : "bg-divider"
                  )}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced angled divider with technical details */}
      <div className="relative">
        <Divider
          type="plane"
          height={80}
          bgBottom="var(--color-bg-primary)"
          className="z-10"
        />

        {/* Technical grid overlay on divider */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute bottom-0 left-0 right-0 h-[80px] w-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
            <motion.line
              x1="20" y1="0" x2="60" y2="100"
              stroke="var(--color-brand-primary)"
              strokeWidth="0.5"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            <motion.line
              x1="80" y1="0" x2="40" y2="100"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.3"
              strokeDasharray="4 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, delay: 0.4 }}
            />

            <motion.text
              x="10" y="30"
              fill="var(--color-accent-oceanic)"
              fontSize="3"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.2 }}
            >
              CTA/NEXT
            </motion.text>
          </svg>
        </div>
      </div>
    </motion.section>
  );
};

export default HomeTestimonials;