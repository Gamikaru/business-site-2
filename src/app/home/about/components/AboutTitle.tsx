"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, MotionValue, useTransform, useSpring } from 'framer-motion';
import { Text, H1 } from '@/components/common/Typography';
import Icon from '@/components/common/Icons/Icon';
import { useAnimationPreferences } from '@/components/core/Animations';

interface AboutTitleProps {
  heading: string;
  isVisible: boolean;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
  scrollProgress?: MotionValue<number>;
}

const AboutTitle = ({ heading, isVisible, accentColors, scrollProgress }: AboutTitleProps) => {
  const { reducedMotion } = useAnimationPreferences();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Split heading into words and chars for animated reveal
  const words = heading.split(' ');

  // Handle mouse movement for interactive effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
  };

  // Create transforms based on scroll and mouse position
  const iconRotate = useTransform(scrollProgress || useSpring(0), [0, 1], [0, 15]);
  const iconScale = useTransform(scrollProgress || useSpring(0), [0, 0.5, 1], [1, 1.1, 1]);

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
        when: "beforeChildren",
      },
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 30
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.2 + (i * 0.05),
        staggerChildren: 0.02,
        delayChildren: 0.05 + (i * 0.03)
      }
    })
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      rotateX: 40,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const iconVariants = {
    hidden: {
      opacity: 0,
      scale: 0.7,
      rotate: -10
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.2
      }
    }
  };

  // Simplified variants for reduced motion
  const reducedVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Use appropriate variants based on user preferences
  const containerVariant = reducedMotion ? reducedVariants : containerVariants;
  const iconVariant = reducedMotion ? reducedVariants : iconVariants;

  return (
    <motion.div
      ref={containerRef}
      className="flex flex-col items-start text-left relative z-10 py-8 px-6 w-full"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariant}
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced 3D icon with glow effects */}
      <motion.div
        className="relative mb-6 flex items-center justify-start"
        variants={iconVariant}
        style={!reducedMotion ? {
          rotate: iconRotate,
          scale: iconScale
        } : {}}
      >
        {/* Layered glow effects */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0 blur-xl"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            background: `radial-gradient(circle at center, ${accentColors.primary}90, ${accentColors.secondary}40, transparent 70%)`
          }}
        />

        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-accent-primary/20 via-accent-secondary/20 to-accent-primary/20 rounded-full blur-md"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* 3D perspective container for the icon */}
        <motion.div
          className="relative z-10 bg-bg-card p-5 rounded-full shadow-lg border border-divider overflow-hidden"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d"
          }}
          whileHover={!reducedMotion ? {
            rotateY: [0, 15, -15, 0],
            scale: 1.05,
            transition: { duration: 1.5 }
          } : {}}
        >
          {/* Icon with 3D rotation */}
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              transform: !reducedMotion ? `rotateX(${mousePosition.y * 20 - 10}deg) rotateY(${mousePosition.x * 20 - 10}deg)` : undefined,
              transition: "transform 0.2s ease-out"
            }}
          >
            <Icon
              name="fa:FaLightbulb"
              size={36}
              className="text-accent-primary"
            />

            {/* Light source reflection */}
            <motion.div
              className="absolute inset-0 bg-white opacity-0 rounded-full mix-blend-screen"
              animate={{
                opacity: [0, 0.3, 0],
                x: ['0%', '100%'],
                y: ['0%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Advanced title with character animation but no measurements */}
      <motion.div
        variants={containerVariant}
        className="relative"
        ref={textRef}
      >
        {/* Title with animated words - aligned left */}
        <H1 className="text-4xl md:text-5xl lg:text-6xl mb-4 relative z-10 perspective-1000 text-left" weight="bold">
          <span className="sr-only">{heading}</span> {/* For screen readers */}
          <div aria-hidden="true" className="flex flex-wrap justify-start">
            {words.map((word, i) => (
              <motion.span
                key={`word-${i}`}
                className="inline-block mr-3 mb-1 relative"
                custom={i}
                variants={!reducedMotion ? wordVariants : reducedVariants}
                style={{ transformStyle: "preserve-3d" }}
              >
                {!reducedMotion ? (
                  Array.from(word).map((char, j) => (
                    <motion.span
                      key={`char-${i}-${j}`}
                      className="inline-block relative"
                      variants={charVariants}
                      style={{
                        transformStyle: "preserve-3d",
                        display: "inline-block"
                      }}
                    >
                      {char}
                    </motion.span>
                  ))
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </div>
        </H1>
      </motion.div>

      {/* Enhanced descriptive text with improved typography - aligned left */}
      <Text
        variant="secondary"
        size="lg"
        align="left"
        className="max-w-3xl mt-6 relative"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          A glimpse into my professional philosophy and approach to work
        </motion.span>
      </Text>

      {/* Connection line from title to image */}
      <motion.div
        className="absolute top-1/3 right-0 h-px w-12 bg-accent-primary"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 12, opacity: 0.7 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      />

      {/* Floating large technical text */}
      <motion.div
        className="absolute -right-8 -top-12 text-[160px] font-bold opacity-[0.03] select-none pointer-events-none z-0 font-heading"
        initial={{ x: 40, opacity: 0 }}
        animate={isVisible ? { x: 0, opacity: 0.03 } : { x: 40, opacity: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        style={{
          WebkitTextStroke: `1px ${accentColors.primary}20`,
          color: 'transparent'
        }}
      >
        ABOUT
      </motion.div>
    </motion.div>
  );
};

export default AboutTitle;