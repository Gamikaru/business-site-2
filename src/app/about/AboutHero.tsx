"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { TextReveal, AnimatedPath } from "@/components/core/Animations";
import { Divider } from "@/components/common/Divider";
import { cn } from "@/utils/classNames";

interface AboutHeroProps {
  headline: string;
  subheadline: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({
  headline,
  subheadline,
  imageSrc,
  imageAlt,
  className,
}) => {
  // Split headline into words for granular animation control
  const words = headline.split(" ");

  // Refs and scroll tracking
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse position tracking
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Scroll-driven animations
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 0.5], ["0%", "50%"]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], ["0%", "-20%"]);
  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.4],
    [1, 0.8, 0]
  );

  // Technical display values
  const [techValues] = useState({
    imageScale: (Math.random() * 0.2 + 0.9).toFixed(2),
    frameRate: Math.floor(Math.random() * 10) + 55,
    gridDensity: Math.floor(Math.random() * 20) + 40,
  });

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={heroRef}
      className={cn("relative bg-bg-primary overflow-hidden", className)}
      onMouseMove={handleMouseMove}
    >
      {/* Technical background with blueprint grid */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base dark gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-secondary"
          style={{ y: backgroundY }}
        />

        {/* Blueprint grid overlay */}
        <div className="absolute inset-0 opacity-10 bg-blueprint-grid"></div>

        {/* Technical measurement grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {/* Horizontal lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.line
              key={`h-${i}`}
              x1="0"
              y1={`${(i + 1) * 12.5}%`}
              x2="100%"
              y2={`${(i + 1) * 12.5}%`}
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 + i * 0.1 }}
            />
          ))}

          {/* Vertical lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.line
              key={`v-${i}`}
              x1={`${(i + 1) * 12.5}%`}
              y1="0"
              x2={`${(i + 1) * 12.5}%`}
              y2="100%"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 + i * 0.1 }}
            />
          ))}
        </svg>

        {/* Dynamic data curve based on mouse position */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.path
            d={`M0,${50 + mousePosition.y * 20} C${30 + mousePosition.x * 30},${60 - mousePosition.y * 40},${70 + mousePosition.x * 20},${40 + mousePosition.y * 30},100,${50 - mousePosition.y * 20}`}
            stroke="var(--color-brand-primary)"
            strokeWidth="1"
            strokeOpacity="0.15"
            fill="none"
            animate={{
              d: `M0,${50 + mousePosition.y * 20} C${30 + mousePosition.x * 30},${60 - mousePosition.y * 40},${70 + mousePosition.x * 20},${40 + mousePosition.y * 30},100,${50 - mousePosition.y * 20}`,
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>

      <div className="container mx-auto min-h-[70vh] flex flex-col justify-center relative z-10 py-20">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          {/* Left column - Text content with technical styling */}
          <div className="lg:col-span-7 relative">
            {/* Technical section bracket */}
            <motion.div
              className="absolute -left-6 top-0 bottom-0 border-l-2 border-t-2 border-b-2 border-brand-primary/70 w-2 hidden lg:block"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />

            {/* Technical data readout */}
            <motion.div
              className="absolute -top-8 left-0 text-xs font-mono text-accent-oceanic hidden lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-accent-oceanic animate-pulse"></div>
                <span>SYS.ABOUT_PROFILE</span>
                <span>FPS/{techValues.frameRate}</span>
              </div>
            </motion.div>

            {/* Headline with word-by-word animation */}
            <div className="mb-6 relative">
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {words.map((word, i) => (
                  <motion.div
                    key={`word-${i}`}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2 + i * 0.1,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  >
                    <span
                      className={cn(
                        "text-4xl md:text-5xl lg:text-6xl font-heading font-bold",
                        i % 2 === 0 ? "text-white" : "text-brand-primary"
                      )}
                    >
                      {word}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Technical annotation on headline */}
              <motion.div
                className="absolute -right-6 top-0 h-full hidden lg:flex flex-col justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="h-8 w-px bg-accent-oceanic/50"></div>
                <div className="text-[10px] font-mono text-accent-oceanic mt-1">
                  {words.length} UNITS
                </div>
              </motion.div>
            </div>

            {/* Subheadline with reveal animation */}
            <TextReveal direction="up" delay={0.5} className="mb-10">
              <p className="text-xl md:text-2xl text-text-secondary font-light">
                {subheadline}
              </p>
            </TextReveal>

            {/* Technical grid coordinates */}
            <motion.div
              className="absolute -bottom-10 left-0 text-xs font-mono text-accent-oceanic hidden lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              GRID/{mousePosition.x.toFixed(2)}/{mousePosition.y.toFixed(2)}
            </motion.div>
          </div>

          {/* Right column - Profile image with technical framing */}
          <div className="lg:col-span-5 relative">
            <motion.div
              className="relative rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Technical frame */}
              <div className="relative border-2 border-accent-oceanic/50 rounded-lg">
                {/* Corner markers */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-brand-primary z-10"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-brand-primary z-10"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-brand-primary z-10"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-brand-primary z-10"></div>

                {/* Technical measurement overlay */}
                <div className="absolute inset-0 mix-blend-overlay pointer-events-none z-20">
                  <div className="w-full h-full bg-blueprint-grid opacity-30"></div>
                </div>

                {/* Image with mask animation reveal */}
                <motion.div
                  className="relative aspect-square overflow-hidden rounded-lg"
                  initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
                  animate={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.6,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                    priority
                  />

                  {/* Scan line effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent pointer-events-none"
                    style={{
                      height: "200%",
                      top: "-50%",
                    }}
                    animate={{
                      top: ["0%", "100%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                    }}
                  />
                </motion.div>

                {/* Technical readouts */}
                <div className="absolute top-3 left-3 flex items-center bg-black/50 backdrop-blur-sm px-2 py-1 rounded z-30">
                  <div className="h-2 w-2 rounded-full bg-brand-primary mr-2 animate-pulse"></div>
                  <span className="text-xs font-mono text-brand-primary">
                    SC.{techValues.imageScale}
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-accent-oceanic z-30">
                  ID/PROFILE_IMG
                </div>
              </div>

              {/* Technical cross marker */}
              <svg
                className="absolute -right-6 -bottom-6 w-12 h-12 hidden lg:block"
                viewBox="0 0 48 48"
                fill="none"
              >
                <AnimatedPath
                  d="M24 12V36M12 24H36"
                  stroke="var(--color-accent-oceanic)"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  delay={1}
                />
                <AnimatedPath
                  d="M24 24m-4 0a4 4 0 1 1 8 0a4 4 0 1 1 -8 0"
                  stroke="var(--color-accent-oceanic)"
                  strokeWidth="1"
                  delay={1.2}
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Technical measurement ticks */}
        <motion.div
          className="absolute bottom-12 left-12 right-12 hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="w-full border-t border-white/30 relative">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={`tick-${i}`}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${i * 10}%`, transform: "translateX(-50%)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + i * 0.05 }}
              >
                <div
                  className={cn(
                    "w-px bg-white/60",
                    i % 2 === 0 ? "h-4" : "h-2"
                  )}
                ></div>
                {i % 2 === 0 && (
                  <span className="text-[10px] font-mono text-white/60 mt-1">
                    {i * 10}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Angled divider with technical details */}
      <div className="relative">
        <Divider
          type="plane"
          height={80}
          invert={false}
          bgBottom="var(--color-bg-secondary)"
          className="z-10"
        />

        {/* Technical details on divider */}
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
              x2="80"
              y2="100"
              stroke="var(--color-brand-primary)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            <motion.line
              x1="70"
              y1="0"
              x2="30"
              y2="100"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeDasharray="4 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, delay: 0.4 }}
            />

            <motion.text
              x="85"
              y="30"
              fill="var(--color-accent-oceanic)"
              fontSize="3"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.2 }}
            >
              BIO/NEXT
            </motion.text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
