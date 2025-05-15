"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue } from "framer-motion";
import Image from "next/image";
import { TextReveal, ScrollReveal } from "@/components/core/Animations";
import { BlueprintCorner } from "@/components/common/VisualInterest";
import { TickStrip } from "@/components/common/Divider";
import RichText from "@/components/common/Typography/RichText";
import { cn } from "@/utils/classNames";

interface PortfolioIntroductionProps {
  introduction: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

const PortfolioIntroduction: React.FC<PortfolioIntroductionProps> = ({
  introduction,
  imageSrc,
  imageAlt,
  className,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [uniqueId] = useState(`intro-${Math.floor(Math.random() * 10000)}`);
  const isContentInView = useInView(contentRef, {
    once: true,
    margin: "-10% 0px",
  });
  const isImageInView = useInView(imageRef, {
    once: true,
    margin: "-10% 0px",
  });

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-5%"]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 0.05, 0.02]);

  // Mouse interaction for image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [2, -2]);
  const rotateY = useTransform(mouseX, [-300, 300], [-2, 2]);

  // Technical measurement data
  const [measurementData, setMeasurementData] = useState({
    textWidth: 0,
    textHeight: 0,
    imageRatio: "16:9",
    viewportWidth: 0,
    processingState: "READY",
  });

  // Update measurements
  useEffect(() => {
    if (contentRef.current && imageRef.current) {
      const updateMeasurements = () => {
        const textRect = contentRef.current?.getBoundingClientRect();
        const imgRect = imageRef.current?.getBoundingClientRect();

        setMeasurementData({
          textWidth: Math.round(textRect?.width || 0),
          textHeight: Math.round(textRect?.height || 0),
          imageRatio: `${Math.round((imgRect?.width || 600) / 10)}:${Math.round((imgRect?.height || 400) / 10)}`,
          viewportWidth: window.innerWidth,
          processingState: Math.random() > 0.8 ? "PROCESSING" : "READY",
        });
      };

      updateMeasurements();
      window.addEventListener('resize', updateMeasurements);

      return () => window.removeEventListener('resize', updateMeasurements);
    }
  }, [isContentInView, isImageInView]);

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        "py-20 md:py-32 bg-bg-secondary relative overflow-hidden border-b-8 border-accent-primary/40",
        className
      )}
    >
      {/* SVG defs */}
      <svg width="0" height="0">
        <defs>
          <pattern id={`${uniqueId}-grid`} patternUnits="userSpaceOnUse" width="40" height="40">
            <path d="M 0 0 L 40 0 40 40 0 40 z" fill="none" stroke="var(--color-accent-oceanic)" strokeWidth="0.5" strokeOpacity="0.2" />
          </pattern>

          <filter id={`${uniqueId}-distortion`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Background grid pattern with enhanced styling */}
      <motion.div
        className="absolute inset-0 bg-isometric-grid pointer-events-none"
        style={{ opacity: gridOpacity, y: parallaxY }}
      />

      {/* Neobrutalist background decorative elements */}
      <motion.div
        className="absolute top-40 right-20 w-40 h-40 bg-accent-primary/5 rounded-full mix-blend-multiply blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <motion.div
        className="absolute bottom-40 left-20 w-60 h-60 bg-accent-oceanic/5 rounded-full mix-blend-multiply blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Technical measurement markers - enhanced with more architectural styling */}
      <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none bg-bg-glass/5 border-r border-accent-primary/10">
        <motion.div
          className="h-full w-px bg-accent-primary/20 ml-6"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isContentInView ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          style={{ transformOrigin: "top" }}
        />

        {[10, 30, 50, 70, 90].map((pos) => (
          <div
            key={pos}
            className="absolute left-6 flex items-center"
            style={{ top: `${pos}%` }}
          >
            <div className="w-3 h-px bg-accent-primary/40" />
            <span className="text-[8px] font-mono text-accent-primary/70 ml-1">
              {pos}
            </span>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left column - Text content */}
          <motion.div
            ref={contentRef}
            style={{ y: contentY }}
            className="lg:col-span-5 relative order-2 lg:order-1"
          >
            {/* Section label with neobrutalist styling */}
            <motion.div
              className="flex items-center mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-px bg-accent-primary mr-3" />
              <span className="text-sm font-mono uppercase tracking-wider text-accent-primary bg-accent-primary/10 px-3 py-1 border-l-2 border-accent-primary">
                Introduction
              </span>
            </motion.div>

            {/* Technical measurements display - enhanced architectural styling */}
            <div className="absolute -left-4 top-0 bottom-0 w-px hidden lg:block">
              <motion.div
                className="h-full w-px bg-accent-primary/30"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: isContentInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ transformOrigin: "top" }}
              />

              <motion.div
                className="absolute -left-2 top-0 text-[10px] font-mono text-accent-primary/60 rotate-90 origin-top-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: isContentInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {measurementData.textHeight}px
              </motion.div>
            </div>

            {/* Main content with TextReveal - editorial formatting */}
            <div className="relative">
              {/* Neobrutalist marker bar */}
              <div className="absolute -left-4 top-0 h-full w-2 bg-accent-primary/20"></div>

              <TextReveal
                splitBy="words"
                staggerChildren={true}
                className="mb-8 space-y-6"
              >
                <div className="text-xl md:text-2xl text-text-primary leading-relaxed font-body pl-2 border-l-2 border-accent-primary">
                  <RichText content={introduction} />
                </div>
              </TextReveal>

              {/* Technical bottom measurement */}
              <motion.div
                className="h-px w-full bg-accent-primary/20 mt-10 relative hidden lg:block"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isContentInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ transformOrigin: "left" }}
              >
                <motion.div
                  className="absolute -bottom-4 right-0 text-[10px] font-mono text-accent-primary/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isContentInView ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  {measurementData.textWidth}px
                </motion.div>
              </motion.div>

              {/* Blueprint corner with enhanced size */}
              <div className="absolute -bottom-2 -left-2 text-accent-primary/60 hidden lg:block">
                <BlueprintCorner size={32} />
              </div>

              {/* Neobrutalist footer element */}
              <motion.div
                className="mt-8 py-1 px-3 bg-accent-primary/10 border-l-2 border-accent-primary hidden md:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isContentInView ? 0.9 : 0, x: isContentInView ? 0 : -20 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <div className="text-[10px] font-mono text-accent-primary/90 flex justify-between items-center">
                  <span>SECTION.INTRO</span>
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-1.5 animate-pulse"></span>
                    {measurementData.processingState}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - Image with technical treatment and neobrutalist framing */}
          <div
            className="lg:col-span-7 relative order-1 lg:order-2"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              mouseX.set(0);
              mouseY.set(0);
            }}
          >
            <ScrollReveal direction="up" delay={0.3}>
              {/* Neobrutalist background frame */}
              <div className="absolute -inset-4 -top-8 bg-accent-primary/10 -z-10 transform -rotate-1"></div>

              <motion.div
                ref={imageRef}
                className="relative rounded-none overflow-hidden border-4 border-accent-primary/80 bg-bg-tertiary/20"
                style={{
                  scale: imageScale,
                  rotateX: rotateX,
                  rotateY: rotateY,
                  transformStyle: "preserve-3d",
                }}
                whileHover={{
                  boxShadow: "10px 10px 0 rgba(var(--color-accent-primary-rgb), 0.2)",
                }}
              >
                {/* Technical overlay elements */}
                <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none z-30"></div>

                {/* Measurement tick strip */}
                <div className="absolute top-0 left-0 right-0 z-20">
                  <TickStrip height={16} segments={11} labelEvery={5} showCoordinateLines={false} />
                </div>

                {/* Image */}
                <div className="relative z-10 overflow-hidden">
                  <motion.div
                    initial={{ filter: "grayscale(100%) brightness(0.8)" }}
                    animate={{ filter: "grayscale(0%) brightness(1)" }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                  >
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      width={900}
                      height={600}
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
                </div>

                {/* Technical measurement metadata - neobrutalist styling */}
                <div className="absolute bottom-3 right-3 p-1 px-3 bg-accent-primary text-white text-[10px] font-mono z-20 flex items-center">
                  <span className="inline-block w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
                  <span>{measurementData.imageRatio}</span>
                </div>

                {/* Technical overlay */}
                <motion.div
                  className="absolute inset-0 pointer-events-none z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <div className="h-full w-full bg-blueprint-grid"></div>
                </motion.div>

                {/* Technical corner accents - architectural styling */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-accent-oceanic/80 z-20" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-accent-oceanic/80 z-20" />

                {/* Circuit board layer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  <div className="h-full w-full bg-circuit"></div>
                </motion.div>

                {/* Scan line - enhanced with randomness */}
                <motion.div
                  className="absolute left-0 right-0 h-[3px] bg-accent-primary/30 pointer-events-none z-20"
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 3
                  }}
                />
              </motion.div>
            </ScrollReveal>

            {/* Neobrutalist additional frame element */}
            <motion.div
              className="absolute -bottom-3 -right-3 w-3/4 h-6 bg-accent-primary/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isImageInView ? 1 : 0, x: isImageInView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />

            {/* Technical image metadata with architectural container */}
            <motion.div
              className="absolute -bottom-12 left-0 right-0 flex justify-between text-[10px] font-mono text-accent-oceanic/80 overflow-hidden border-t border-accent-oceanic/20 pt-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <span>FORMAT/JPG</span>
              <span>DIM/{measurementData.viewportWidth < 768 ? 'MOBILE' : 'DESKTOP'}</span>
              <span>FOCUS/AUTO</span>
            </motion.div>

            {/* Architectural line element */}
            <motion.div
              className="absolute -right-8 top-1/4 bottom-1/4 w-px bg-accent-primary/20"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isImageInView ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              style={{ transformOrigin: "top" }}
            />
          </div>
        </div>
      </div>

      {/* Bottom architectural elements */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-accent-primary/30"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        style={{ transformOrigin: "center" }}
      />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] font-mono text-accent-primary/50 text-center">
        * Introduction.Section.End *
      </div>
    </section>
  );
};

export default PortfolioIntroduction;