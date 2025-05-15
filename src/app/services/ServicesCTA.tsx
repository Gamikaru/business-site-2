// app/services/ServicesCTA.tsx
"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { Heading, Text } from "@/components/common/Typography";
import { Button } from "@/components/common/Button";
import { useAnimationPreferences } from "@/components/core/Animations";
import { BlueprintCorner } from "@/components/common/VisualInterest";
import { cn } from "@/utils/classNames";

interface ServicesCTAProps {
  position: "mid" | "footer";
  heading: string;
  content?: string;
  ctaText: string;
  ctaLink: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
  availabilityNote?: string;
  className?: string;
}

const ServicesCTA: React.FC<ServicesCTAProps> = ({
  position,
  heading,
  content,
  ctaText,
  ctaLink,
  secondaryCta,
  secondaryCtaLink,
  availabilityNote,
  className,
}) => {
  const { shouldAnimate } = useAnimationPreferences();
  const ctaRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ctaRef, { once: false, amount: 0.3 });
  const [uniqueId] = useState(`cta-${Math.floor(Math.random() * 10000)}`);
  const [buttonHovered, setButtonHovered] = useState(false);

  // Mouse movement effect for mid-page CTA
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Create a subtle parallax effect based on mouse position
  const backgroundX = useTransform(mouseX, [-300, 300], [10, -10]);
  const backgroundY = useTransform(mouseY, [-300, 300], [5, -5]);

  // Define data for tech elements
  const [techData] = useState({
    systemLoad: Math.floor(Math.random() * 30) + 70,
    responseTime: Math.floor(Math.random() * 100) + 150,
    status: "READY",
    timestamp: new Date().toISOString().split('T')[0],
  });

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctaRef.current || !shouldAnimate()) return;

    const rect = ctaRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  // Define styles based on position
  const isMid = position === "mid";

  return (
    <section
      ref={ctaRef}
      id={isMid ? "cta-mid" : "cta-footer"}
      className={cn(
        "py-12 relative overflow-hidden",
        isMid
          ? "bg-accent-primary sticky top-20 z-20 "
          : "py-20 bg-bg-secondary border-t border-b border-divider",
        className
      )}
      onMouseMove={handleMouseMove}
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

      {/* Background pattern with parallax effect */}
      <motion.div
        className="absolute inset-0"
        style={isMid ? { x: backgroundX, y: backgroundY } : {}}
      >
        {isMid ? (
          // Mid-page CTA background
          <>
            <div className="absolute inset-0 bg-blueprint-grid opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-dots opacity-10 mix-blend-overlay"></div>

            {/* Diagonal line pattern */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
              <svg width="100%" height="100%">
                <pattern id={`${uniqueId}-diagonals`} width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinecap="square"
                  />
                </pattern>
                <rect width="100%" height="100%" fill={`url(#${uniqueId}-diagonals)`} />
              </svg>
            </div>
          </>
        ) : (
          // Footer CTA background
          <>
            <div className="absolute inset-0 bg-blueprint-grid opacity-5"></div>
          </>
        )}
      </motion.div>

      {/* Blueprint corners */}
      {!isMid && (
        <>
          <div className="absolute top-0 left-0 text-accent-primary/20">
            <BlueprintCorner size={30} />
          </div>
          <div className="absolute top-0 right-0 rotate-90 text-accent-primary/20">
            <BlueprintCorner size={30} />
          </div>
          <div className="absolute bottom-0 left-0 -rotate-90 text-accent-primary/20">
            <BlueprintCorner size={30} />
          </div>
          <div className="absolute bottom-0 right-0 rotate-180 text-accent-primary/20">
            <BlueprintCorner size={30} />
          </div>
        </>
      )}

      {/* Technical readouts */}
      {!isMid && (
        <motion.div
          className="absolute top-4 right-4 text-xs font-mono flex items-center bg-bg-glass backdrop-blur-sm px-2 py-1 text-accent-oceanic/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 0.8 : 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-primary mr-2 animate-pulse"></span>
          <span>RESPONSE/{techData.responseTime}ms</span>
        </motion.div>
      )}

      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">
        <div className={cn(
          "flex flex-col items-center",
          isMid ? "md:flex-row md:justify-between gap-8" : "text-center"
        )}>
          {/* Heading */}
          <div className={isMid ? "mb-6 md:mb-0 md:w-1/2" : "mb-10"}>
            <Heading
              id={isMid ? "cta-mid-txt" : "cta-footer-hdr"}
              level={isMid ? 3 : 2}
              className={cn(
                "font-bold relative inline-block",
                isMid ? "text-2xl text-white" : "text-4xl mb-6"
              )}
            >
              {heading}
              {!isMid && (
                <motion.div
                  className="absolute -bottom-3 left-0 h-1 bg-accent-primary"
                  initial={{ width: 0 }}
                  animate={{ width: isInView ? "100%" : 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
              )}
            </Heading>

            {content && !isMid && (
              <Text className="max-w-2xl mx-auto mb-8 text-lg">
                {content}
              </Text>
            )}

            {availabilityNote && (
              <Text className={cn(
                "text-sm mt-4",
                isMid ? "text-white/80" : "text-text-secondary"
              )}>
                {availabilityNote}
              </Text>
            )}
          </div>

          {/* CTA Buttons with architectural styling */}
          <div className={cn(
            "flex flex-col sm:flex-row gap-4",
            !isMid && "justify-center"
          )}>
            {/* Primary CTA with technical frame */}
            <div className="relative group" onMouseEnter={() => setButtonHovered(true)} onMouseLeave={() => setButtonHovered(false)}>
              {/* Technical measurement frame */}
              <motion.div
                className={cn(
                  "absolute -left-3 -top-3 w-6 h-6 border-l-2 border-t-2 transition-opacity",
                  isMid ? "border-white/50" : "border-accent-primary/50"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: buttonHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />

              <Button
                id={isMid ? "cta-mid-btn" : "cta-footer-btn"}
                intent={isMid ? "secondary" : "primary"}
                size="lg"
                href={ctaLink}
                className="relative z-10"
              >
                {ctaText} →

                {/* Pulse effect on hover */}
                <AnimatedPulse active={buttonHovered} />
              </Button>

              <motion.div
                className={cn(
                  "absolute -right-3 -bottom-3 w-6 h-6 border-r-2 border-b-2 transition-opacity",
                  isMid ? "border-white/50" : "border-accent-primary/50"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: buttonHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Secondary CTA if provided */}
            {secondaryCta && secondaryCtaLink && (
              <Button
                intent="outline"
                size="lg"
                href={secondaryCtaLink}
              >
                {secondaryCta}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Technical status footer for mid CTA */}
      {isMid && (
        <motion.div
          className="absolute bottom-2 left-4 text-[10px] font-mono text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 0.7 : 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center gap-1">
            <motion.div
              className="h-1 w-1 rounded-full bg-white"
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <span>CTA.{position.toUpperCase()}/STATUS/{techData.status}</span>
          </div>
        </motion.div>
      )}

      {/* Scan line effect */}
      {!isMid && (
        <motion.div
          className="absolute left-0 right-0 h-[1px] bg-accent-primary/30 pointer-events-none"
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2
          }}
        />
      )}
    </section>
  );
};

// Helper component for animated pulse effect
const AnimatedPulse: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 rounded-md bg-accent-primary/20"
      initial={{ opacity: 0, scale: 1 }}
      animate={{
        opacity: [0, 0.2, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop"
      }}
    />
  );
};

export default ServicesCTA;