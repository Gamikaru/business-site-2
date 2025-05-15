// src/components/home/HomeBlog.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import {
  ScrollReveal,
  staggerContainerVariants,
  AnimatedPath,
  useAnimationPreferences
} from "@/components/core/Animations";
import { Button } from "@/components/common/Button";
import { Divider } from "@/components/common/Divider";
import { cn } from "@/utils/classNames";

// Import the split components
import HomeBlogHeader from "./components/HomeBlogHeader";
import FeaturedBlogPost from "./components/FeaturedBlogPost";
import SecondaryBlogPosts from "./components/SecondaryBlogPosts";
import MobileBlogPosts from "./components/MobileBlogPosts";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  imageSrc: string;
  link: string;
}

interface AnalyticsData {
  id: string;
  popularity: number;
  relevance: number;
  complexity: number;
  tags: number;
  wordCount: number;
  completionRate: number;
  readTime: number;
  lastUpdated: number;
}

interface TechData {
  gridDensity: number;
  renderQuality: number;
  frameRate: number;
  signalStrength: number;
  nodeCount: number;
}

interface HomeBlogProps {
  heading: string;
  introduction: string;
  posts: BlogPost[];
  ctaText: string;
  ctaLink: string;
  className?: string;
}

const HomeBlog: React.FC<HomeBlogProps> = ({
  heading,
  introduction,
  posts,
  ctaText,
  ctaLink,
  className,
}) => {
  // Animation preferences and customization
  const { shouldAnimate, getTransitionSettings } = useAnimationPreferences();

  // Refs and state for animations and interactions
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Scroll animation controls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Mouse interaction tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax motion values
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.1]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.05, 0.15, 0.15, 0.05]);

  // Simulate analytics data for each blog post
  const [analyticsData] = useState<AnalyticsData[]>(() =>
    posts.map(post => ({
      id: post.id,
      popularity: Math.floor(Math.random() * 100),
      relevance: Math.floor(Math.random() * 90) + 10,
      complexity: Math.floor(Math.random() * 70) + 30,
      tags: Math.floor(Math.random() * 8) + 2,
      wordCount: Math.floor(Math.random() * 1500) + 500,
      completionRate: Math.floor(Math.random() * 40) + 60,
      readTime: Math.floor(Math.random() * 12) + 3,
      lastUpdated: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    }))
  );

  // Technical system data
  const [techData] = useState<TechData>({
    gridDensity: Math.floor(Math.random() * 50) + 30,
    renderQuality: Math.floor(Math.random() * 30) + 70,
    frameRate: 60 - Math.floor(Math.random() * 10),
    signalStrength: Math.floor(Math.random() * 40) + 60,
    nodeCount: Math.floor(Math.random() * 100) + 50,
  });

  // Handle mouse/pointer movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x, y });
  };

  // Advance animation phases
  useEffect(() => {
    if (!shouldAnimate()) return;

    const timer = setTimeout(() => {
      setAnimationPhase(1);

      const timer2 = setTimeout(() => {
        setAnimationPhase(2);
      }, 1000);

      return () => clearTimeout(timer2);
    }, 500);

    return () => clearTimeout(timer);
  }, [shouldAnimate]);

  // Periodic animation for technical elements
  useEffect(() => {
    if (!shouldAnimate()) return;

    const interval = setInterval(() => {
      const elements = document.querySelectorAll('.data-point');
      elements.forEach(el => {
        if (Math.random() > 0.7) {
          (el as HTMLElement).style.transform = 'scale(1.5)';
          setTimeout(() => {
            (el as HTMLElement).style.transform = 'scale(1)';
          }, 300);
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [shouldAnimate]);

  return (
    <motion.section
      ref={sectionRef}
      className={cn("relative bg-bg-primary overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Technical background with data visualization elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Blueprint grid background */}
        <motion.div
          className="absolute inset-0 bg-blueprint-grid"
          style={{
            opacity: gridOpacity,
            scale: backgroundScale,
            y: backgroundY
          }}
        />

        {/* Data flow lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Dynamic data curve */}
          <motion.path
            d={`M0,${50 + mousePosition.y * 20} C${20 + mousePosition.x * 30},${70 - mousePosition.y * 40},${80 - mousePosition.x * 20},${30 + mousePosition.y * 50},100,${50 - mousePosition.y * 30}`}
            stroke="var(--color-brand-primary)"
            strokeWidth="1"
            strokeOpacity="0.15"
            fill="none"
            animate={{
              d: `M0,${50 + mousePosition.y * 20} C${20 + mousePosition.x * 30},${70 - mousePosition.y * 40},${80 - mousePosition.x * 20},${30 + mousePosition.y * 50},100,${50 - mousePosition.y * 30}`
            }}
            transition={{ duration: 0.5 }}
          />

          <motion.path
            d={`M0,${80 - mousePosition.y * 10} Q${50 + mousePosition.x * 20},${20 + mousePosition.y * 60},100,${70 - mousePosition.y * 20}`}
            stroke="var(--color-accent-secondary)"
            strokeWidth="0.5"
            strokeOpacity="0.1"
            strokeDasharray="5 3"
            fill="none"
            animate={{
              d: `M0,${80 - mousePosition.y * 10} Q${50 + mousePosition.x * 20},${20 + mousePosition.y * 60},100,${70 - mousePosition.y * 20}`
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 bg-dots-dense opacity-[0.07]"></div>
      </div>

<div className="container mx-auto py-16 md:py-32 px-4 md:px-8 max-w-7xl relative z-10">
        {/* Header Section */}
        <HomeBlogHeader
          heading={heading}
          introduction={introduction}
          scrollYProgress={scrollYProgress}
          techData={techData}
        />

        {/* Blog Posts Grid */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate={animationPhase >= 1 ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-16"
        >
          {/* Featured blog post */}
          <motion.div variants={staggerContainerVariants} className="lg:col-span-7 lg:row-span-2">
            <FeaturedBlogPost
              post={posts[0]}
              analytics={analyticsData[0]}
              activeCard={activeCard}
              setActiveCard={setActiveCard}
            />
          </motion.div>

          {/* Secondary blog posts */}
          <SecondaryBlogPosts
            posts={posts.slice(1)}
            analyticsData={analyticsData}
            activeCard={activeCard}
            setActiveCard={setActiveCard}
          />
        </motion.div>

        {/* Mobile blog posts carousel */}
        <MobileBlogPosts posts={posts} analyticsData={analyticsData} />

        {/* Enhanced CTA button with technical framing */}
        <div className="flex justify-center mt-10 md:mt-16 relative">
          <ScrollReveal direction="up" delay={0.5}>
            <div className="relative group perspective-effect">
              {/* Technical measurement frame */}
              <motion.div
                className="absolute -inset-6 border border-dashed border-accent-secondary/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />

              {/* Glowing background effect */}
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-accent-oceanic rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                animate={{
                  opacity: [0, 0.1, 0.2, 0.1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              <Button
                intent="secondary"
                size="lg"
                href={ctaLink}
                className="relative"
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1L15 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                iconPosition="right"
              >
                {ctaText}
              </Button>

              {/* Technical decoration */}
              <motion.div
                className="absolute -right-12 top-1/2 -translate-y-1/2 hidden md:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                  <AnimatedPath
                    d="M0,12 L40,12 M40,12 L30,6 M40,12 L30,18"
                    stroke="var(--color-accent-secondary)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                </svg>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>

        {/* Technical reading metrics display */}
        <motion.div
          className="absolute bottom-16 right-8 text-xs font-mono text-text-tertiary hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <div className="flex flex-col space-y-1">
            <div>FPS/{techData.frameRate}</div>
            <div>SIGNAL/{techData.signalStrength}%</div>
            <div>NODES/{techData.nodeCount}</div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced wave divider with data visualization styling */}
      <div className="relative">
        <Divider
          type="wave"
          height={120}
          bgBottom="var(--color-bg-secondary)"
          animate={true}
          className="z-10"
        />

        {/* Technical overlay on wave */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute bottom-0 left-0 right-0 h-[120px] w-full" preserveAspectRatio="none">
            {/* Data visualization paths */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.path
                key={`data-viz-${i}`}
                d={`M0,${20 + i * 30} C${20 + i * 10},${40 + i * 5} ${50 - i * 10},${15 + i * 20} 100,${30 + i * 10}`}
                stroke={i === 1 ? "var(--color-brand-primary)" : "var(--color-accent-secondary)"}
                strokeWidth={i === 1 ? "1" : "0.5"}
                strokeOpacity={i === 1 ? "0.3" : "0.2"}
                strokeDasharray={i === 1 ? "" : "2 2"}
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.2 + (i * 0.2) }}
              />
            ))}

            <motion.text
              x="85" y="30"
              fill="var(--color-accent-secondary)"
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

export default HomeBlog;