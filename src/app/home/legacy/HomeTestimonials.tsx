// src/components/home/HomeTestimonials.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal, AnimatedPath } from "@/components/core/Animations";
import { Divider } from "@/components/common/Divider";
import { Heading } from "@/components/common/Typography";
import { processQuoteIntoSegments } from "@/utils/textUtils";
import { cn } from "@/utils/classNames";

import {
  TestimonialQuote,
  TestimonialAuthor,
  TestimonialResult,
  TestimonialBackground,
  TestimonialMeasurements,
  TestimonialPagination
} from "../components/testimonials";

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
  const opacityWave = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.6, 1, 1, 0.6]
  );

  // Check if quote is in view
  useEffect(() => {
    if (!quoteRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsQuoteVisible(true);
        } else {
          setIsQuoteVisible(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(quoteRef.current);
    return () => observer.disconnect();
  }, []);

  // Cycle through quote highlights for emphasis
  useEffect(() => {
    if (!isQuoteVisible) return;

    // Get the current testimonial
    const testimonial = items[activeIndex];
    // Split quote into segments for highlighting
    const segments = testimonial.quote
      .split(/\s*[,.]\s*/g)
      .filter((segment) => segment.trim().length > 0);

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
  const segments = processQuoteIntoSegments(testimonial.quote, 3);

  return (
    <motion.section
      ref={sectionRef}
      className={cn("relative bg-bg-tertiary overflow-hidden", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Enhanced technical background */}
      <TestimonialBackground
        backgroundY={backgroundY}
        opacityWave={opacityWave}
      />

      <div className="container mx-auto py-16 md:py-32 px-4 md:px-8 max-w-7xl relative z-10">
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
                  stroke="var(--color-accent-primary)"
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
                  stroke="var(--color-accent-primary)"
                  strokeWidth="2"
                />
              </svg>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Enhanced testimonial container */}
        <div className="max-w-4xl mx-auto relative">
          {/* Technical measurements */}
          <TestimonialMeasurements techValues={techValues} />

          {/* Main quote with dynamic highlighting */}
          <div ref={quoteRef} className="relative">
            <TestimonialQuote
              quote={testimonial.quote}
              segments={segments}
              highlightedText={highlightedText}
              isVisible={isQuoteVisible}
            />
          </div>

          {/* Author attribution with enhanced styling */}
          <TestimonialAuthor
            author={testimonial.author}
            role={testimonial.role}
          />

          {/* Result highlight with technical styling */}
          <TestimonialResult result={testimonial.result} />

          {/* Multi-testimonial indicator dots */}
          <TestimonialPagination
            totalItems={items.length}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
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
          <svg
            className="absolute bottom-0 left-0 right-0 h-[80px] w-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
            fill="none"
          >
            <motion.line
              x1="20"
              y1="0"
              x2="60"
              y2="100"
              stroke="var(--color-accent-primary)"
              strokeWidth="0.5"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            <motion.line
              x1="80"
              y1="0"
              x2="40"
              y2="100"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.3"
              strokeDasharray="4 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, delay: 0.4 }}
            />

            <motion.text
              x="10"
              y="30"
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
