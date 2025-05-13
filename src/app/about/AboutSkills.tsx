"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ScrollReveal,
  TextReveal,
  AnimatedPath,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/core/Animations";
import { Heading, Text } from "@/components/common/Typography";
import RichText from "@/components/common/Typography/RichText";
import { Divider } from "@/components/common/Divider";
import { cn } from "@/utils/classNames";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

interface AboutSkillsProps {
  heading: string;
  introduction: string;
  categories: SkillCategory[];
  className?: string;
}

const AboutSkills: React.FC<AboutSkillsProps> = ({
  heading,
  introduction,
  categories,
  className,
}) => {
  // Refs for animation and scroll tracking
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  // Use once: true to keep elements visible after appearing
  const isHeadingInView = useInView(headingRef, {
    once: true,
    margin: "-10% 0px -10% 0px", // More generous margins
  });

  // State for active category
  const [activeCategory, setActiveCategory] = useState<number>(0);

  // Technical data display
  const [techData, setTechData] = useState({
    analysisFactor: Math.floor(Math.random() * 20) + 80, // 80-99%
    renderTime: Math.floor(Math.random() * 100) + 50, // 50-150ms
    dataPoints: 0, // Will be calculated
    algorithmVersion: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
  });

  // Mouse position tracking
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Scroll animation values
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const gridOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.05, 0.1, 0.05]
  );

  // Calculate total data points
  useEffect(() => {
    let total = 0;
    categories.forEach((category) => {
      total += category.skills.length;
    });
    setTechData((prev) => ({ ...prev, dataPoints: total }));
  }, [categories]);

  // Handle mouse movements
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
  };

  // Custom stagger variants with better timing
  const customStaggerVariants = {
    ...staggerContainerVariants,
    visible: {
      ...staggerContainerVariants.visible,
      transition: {
        ...staggerContainerVariants.visible.transition,
        delayChildren: 0.2,
        staggerChildren: 0.12,
      }
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      className={cn("relative bg-bg-primary overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Technical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Blueprint grid with parallax motion */}
        <motion.div
          className="absolute inset-0"
          style={{
            y: backgroundY,
            opacity: gridOpacity,
          }}
        >
          <div className="absolute inset-0 bg-blueprint-grid"></div>
        </motion.div>

        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-circuit"></div>

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

        {/* Dynamic data flow line based on mouse position */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.path
            d={`M0,${50 + mousePosition.y * 20} C${20 + mousePosition.x * 30},${30 + mousePosition.y * 40},${60 + mousePosition.x * 20},${70 - mousePosition.y * 30},100,${50 - mousePosition.y * 20}`}
            stroke="var(--color-brand-primary)"
            strokeWidth="1"
            strokeOpacity="0.1"
            fill="none"
            animate={{
              d: `M0,${50 + mousePosition.y * 20} C${20 + mousePosition.x * 30},${30 + mousePosition.y * 40},${60 + mousePosition.x * 20},${70 - mousePosition.y * 30},100,${50 - mousePosition.y * 20}`,
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>

      {/* Technical status bar */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-divider bg-bg-tertiary/30 backdrop-blur-sm hidden md:block">
        <div className="container mx-auto py-16 md:py-32 px-4 md:px-8 max-w-7xl relative z-10">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse mr-2"></div>
              <span className="text-xs font-mono text-text-secondary">
                SKILLS.SECTION
              </span>
            </div>
            <div className="text-xs font-mono text-text-tertiary">
              RENDER/{techData.renderTime}ms
            </div>
          </div>
          <div className="text-xs font-mono text-text-tertiary">
            DATA/{techData.dataPoints} POINTS • ALG/{techData.algorithmVersion}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 md:py-24 relative z-10">
        {/* Section header with technical styling */}
        <div
          ref={headingRef}
          className="max-w-3xl mx-auto text-center mb-12 md:mb-20"
        >
          <TextReveal direction="up" delay={0.2} className="mb-8" once={true}>
            <Heading
              level={2}
              className="text-[clamp(1.8rem,3.2vw+1rem,2.4rem)] font-heading font-bold text-heading"
            >
              <RichText content={heading} className="preserve-whitespace" />
              <motion.div
                className="absolute -bottom-3 left-0 right-0 h-[3px] mx-auto w-20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHeadingInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="h-full bg-brand-primary"></div>
              </motion.div>
            </Heading>
          </TextReveal>

          <ScrollReveal direction="up" delay={0.3} once={true}>
            <Text
              size="xl"
              className="text-center text-text-secondary relative"
            >
              <RichText content={introduction} className="preserve-whitespace" />
            </Text>

            {/* Technical decorative elements */}
            <motion.div
              className="absolute -left-8 top-1/2 -translate-y-1/2 hidden lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHeadingInView ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <svg width="24" height="80" viewBox="0 0 24 80" fill="none">
                <AnimatedPath
                  d="M24 40H12M12 40V10M12 40V70"
                  stroke="var(--color-accent-oceanic)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </svg>
            </motion.div>

            <motion.div
              className="absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHeadingInView ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <svg width="24" height="80" viewBox="0 0 24 80" fill="none">
                <AnimatedPath
                  d="M0 40H12M12 40V10M12 40V70"
                  stroke="var(--color-accent-oceanic)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </svg>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Skill category tabs with technical styling */}
        <div className="max-w-5xl mx-auto mb-12">
          <motion.div
            variants={customStaggerVariants}
            initial="hidden"
            animate={isHeadingInView ? "visible" : "hidden"}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {categories.map((category, index) => (
              <motion.button
                key={index}
                variants={staggerItemVariants}
                className={cn(
                  "relative px-5 py-3 text-sm font-medium rounded-sm transition-colors duration-300",
                  activeCategory === index
                    ? "bg-brand-primary text-white shadow-md"
                    : "bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary"
                )}
                onClick={() => setActiveCategory(index)}
              >
                {/* Technical brackets for active tab */}
                {activeCategory === index && (
                  <>
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-white"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-white"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white"></div>
                  </>
                )}

                {/* Category name with technical indicator */}
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mr-2",
                      activeCategory === index
                        ? "bg-white"
                        : "bg-brand-primary/70"
                    )}
                  ></div>
                  <span><RichText content={category.name} /></span>
                </div>

                {/* Technical counter */}
                <div className="absolute -right-2 -top-2 text-[10px] font-mono bg-accent-oceanic/80 text-white w-5 h-5 rounded-full flex items-center justify-center">
                  {category.skills.length}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Skills visualization with technical styling */}
          <div className="relative bg-bg-card/40 backdrop-blur-sm border border-divider rounded-lg p-6 md:p-8">
            {/* Technical corner details */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent-oceanic"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent-oceanic"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accent-oceanic"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent-oceanic"></div>

            {/* Technical header with category info */}
            <div className="border-b border-divider pb-4 mb-8">
              <div className="flex flex-wrap items-center justify-between">
                <Text className="text-lg md:text-xl font-heading font-bold text-brand-primary">
                  <RichText content={categories[activeCategory]?.name} />
                </Text>
                <div className="flex items-center text-xs font-mono text-text-tertiary">
                  <div className="w-2 h-2 rounded-full bg-brand-primary mr-2 animate-pulse"></div>
                  <span>ANALYZING/{techData.analysisFactor}%</span>
                </div>
              </div>
            </div>

            {/* Skills progress bars with measurements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {categories[activeCategory]?.skills.map((skill, index) => (
                <div key={index} className="relative">
                  {/* Skill label with technical styling */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="h-4 w-1 bg-brand-primary mr-2"></div>
                      <Text weight="medium"><RichText content={skill.name} /></Text>
                    </div>
                    <Text className="text-brand-primary font-mono">
                      {skill.level}%
                    </Text>
                  </div>

                  {/* Progress bar with technical measurement ticks */}
                  <div className="relative h-8 bg-bg-tertiary/50 rounded-sm overflow-hidden">
                    <motion.div
                      className="h-full bg-brand-primary/90"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    />

                    {/* Technical measurement ticks */}
                    <div className="absolute top-0 left-0 right-0 flex justify-between px-1 pt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={`tick-${i}`}
                          className="h-2 w-px bg-white/40 relative"
                        >
                          {i % 2 === 0 && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/60">
                              {i * 25}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Technical scan line animation */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{ width: "100%", x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>

                  {/* Technical readouts */}
                  <div className="flex justify-between mt-1 text-[10px] font-mono text-text-tertiary">
                    <span>BEGINNER</span>
                    <span>INTERMEDIATE</span>
                    <span>EXPERT</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Technical data analysis overlay */}
            <div className="mt-10 pt-4 border-t border-divider">
              <div className="flex flex-wrap justify-between items-center text-xs font-mono text-text-tertiary">
                <div>
                  SKILLS/{categories[activeCategory]?.skills.length} • AVG/
                  {Math.round(
                    categories[activeCategory]?.skills.reduce(
                      (acc, skill) => acc + skill.level,
                      0
                    ) / categories[activeCategory]?.skills.length
                  )}
                  %
                </div>
                <div className="flex items-center">
                  <div className="relative mr-4 h-3 w-16 bg-bg-tertiary/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent-oceanic"
                      style={{ width: `${techData.analysisFactor}%` }}
                    />
                  </div>
                  <span>DATA.VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical measurement coordinates */}
        <motion.div
          className="absolute bottom-6 right-6 text-xs font-mono text-accent-oceanic hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {`X:${Math.round(mousePosition.x * 100)} Y:${Math.round(mousePosition.y * 100)}`}
        </motion.div>
      </div>

      {/* Technical divider with data visualization */}
      <div className="relative">
        <Divider
          type="wave"
          height={100}
          bgBottom="var(--color-bg-secondary)"
          className="z-10"
        />

        {/* Technical data overlay on divider */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute bottom-0 left-0 right-0 h-[100px] w-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
            fill="none"
          >
            <motion.line
              x1="25"
              y1="0"
              x2="75"
              y2="100"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            <motion.line
              x1="65"
              y1="0"
              x2="35"
              y2="100"
              stroke="var(--color-brand-primary)"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              strokeDasharray="4 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, delay: 0.4 }}
            />

            <motion.text
              x="80"
              y="30"
              fill="var(--color-accent-oceanic)"
              fontSize="3"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.2 }}
            >
              VALUES/NEXT
            </motion.text>
          </svg>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSkills;
