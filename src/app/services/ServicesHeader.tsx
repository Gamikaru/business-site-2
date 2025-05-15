// app/services/ServicesHeader.tsx
"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Heading, Text } from "@/components/common/Typography";
import { TextReveal } from "@/components/core/Animations";
import { useAnimationPreferences } from "@/components/core/Animations";
import { cn } from "@/utils/classNames";

// Import new components
import NetworkBackground from "./components/NetworkBackground";
import TechnicalElements from "./components/TechnicalElements";

interface ServicesHeaderProps {
  headline: string;
  intro: string;
  className?: string;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  headline,
  intro,
  className,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [uniqueId] = useState(`header-${Math.floor(Math.random() * 10000)}`);
  const isHeaderInView = useInView(headerRef, { once: false, amount: 0.3 });
  const isIntroInView = useInView(introRef, { once: true, amount: 0.3 });
  const { shouldAnimate } = useAnimationPreferences();

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.8], [0, 100]);

  // Tech data for display
  const [techData] = useState({
    density: Math.floor(Math.random() * 10) + 15,
    renderQuality: Math.floor(Math.random() * 10) + 90,
    protocol: Math.random() > 0.5 ? "ACTIVE" : "STANDBY"
  });

  // Create a headline with line breaks for better typography
  const headlineWithBreaks = headline.replace(/\s{3,}/g, " ").replace(/\s(?=\S*$)/, "<br>");

  return (
    <motion.header
      ref={headerRef}
      id="hdr"
      className={cn(
        "relative min-h-[70vh] w-full overflow-hidden border-b-8 border-accent-primary/40",
        className
      )}
      style={{
        opacity: headerOpacity,
        y: headerY,
      }}
    >
      {/* Network background with nodes and connections */}
      <NetworkBackground
        scrollYProgress={scrollYProgress}
        uniqueId={uniqueId}
      />

      {/* Technical UI elements */}
      <TechnicalElements
        isHeaderInView={isHeaderInView}
        techData={techData}
      />

      {/* Content container */}
      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Headline with animated reveal */}
          <div className="relative mb-16 text-center">
            {/* Architectural frame */}
            <motion.div
              className="absolute -top-6 -left-6 w-20 h-20 border-l-4 border-t-4 border-accent-primary/60"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: isHeaderInView ? 1 : 0, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            <motion.div
              className="absolute -bottom-6 -right-6 w-20 h-20 border-r-4 border-b-4 border-accent-primary/60"
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: isHeaderInView ? 1 : 0, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />

            <TextReveal
              direction="up"
              delay={0.2}
              staggerChildren={true}
              className="relative"
            >
              <Heading
                level={1}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
                dangerouslySetInnerHTML={{ __html: headlineWithBreaks }}
              />
            </TextReveal>

            {/* Editorial underline */}
            <motion.div
              className="h-2 w-32 bg-accent-primary mx-auto mt-8"
              initial={{ width: 0 }}
              animate={{ width: isHeaderInView ? 128 : 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </div>

          {/* Introduction text with reveal and architectural styling */}
          <div
            ref={introRef}
            id="intro"
            className="relative mt-12 max-w-3xl mx-auto bg-bg-glass backdrop-blur-sm p-6 border-l-4 border-accent-primary"
          >
            <TextReveal direction="up" delay={0.4}>
              <Text className="text-xl md:text-2xl leading-relaxed">
                {intro}
              </Text>
            </TextReveal>

            {/* Technical measurement lines */}
            <motion.div
              className="absolute -left-2 top-0 bottom-0 w-px bg-accent-primary/50"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isIntroInView ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ transformOrigin: "top" }}
            />

            <motion.div
              className="absolute left-0 -bottom-8 text-xs font-mono text-accent-primary/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: isIntroInView ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              SERVICES.INTRODUCTION
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default ServicesHeader;