"use client";

import React, { forwardRef, useState } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import { RichText } from '@/components/common/Typography';
import { FloatingTitle } from './FloatingTitle';
import { GestureElement } from '@/components/core/Animations';
import { useAnimationPreferences } from '@/components/core/Animations';
import { useXarrow } from 'react-xarrows';

interface AboutCardProps {
  id: string;
  content: string;
  index: number;
  isLast: boolean;
  alignment: 'left' | 'right';
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
  isVisible: boolean;
  smooth: MotionValue<number>;
  ctaText?: string;
  ctaLink?: string;
}

const AboutCard = forwardRef<HTMLDivElement, AboutCardProps>(({
  id,
  content,
  index,
  isLast,
  alignment,
  accentColors,
  isVisible,
  smooth,
  ctaText,
  ctaLink
}, ref) => {
  const { reducedMotion } = useAnimationPreferences();
  const [isHovered, setIsHovered] = useState(false);
  const updateXarrow = useXarrow();

  // Generate card title based on index
  const cardTitles = [
    "Philosophy",
    "Experience",
    "Approach"
  ];

  // Animation variants for the card
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      x: alignment === 'left' ? -20 : 20
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 20,
        delay: 0.2 + (index * 0.1)
      }
    }
  };

  // Reduced motion variants
  const reducedVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, delay: 0.1 * index }
    }
  };

  // Transforms for parallax effect
  const yOffset = useTransform(
    smooth,
    [0, 1],
    [index * 30, -30 + (index * -10)]
  );

  // Hover animation for button
  const buttonVariants = {
    rest: {
      scale: 1,
      backgroundColor: 'var(--color-bg-card)',
      color: 'var(--color-text-primary)',
      borderColor: 'var(--color-border)',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    hover: {
      scale: 1.05,
      backgroundColor: accentColors.primary,
      color: 'var(--color-text-on-accent)',
      borderColor: accentColors.primary,
      y: -3,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  // Enhanced gradient animation for card background
  const gradientPosition = useTransform(
    smooth,
    [0, 1],
    ['0% 0%', '100% 100%']
  );

  return (
    <motion.div
      id={id}
      ref={ref}
      className={`mb-28 w-full flex ${alignment === 'left' ? 'justify-start' : 'justify-end'} relative`}
      onMouseEnter={() => updateXarrow()}
      onMouseLeave={() => updateXarrow()}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={reducedMotion ? reducedVariants : cardVariants}
      style={{ y: reducedMotion ? 0 : yOffset }}
      data-index={index}
    >
      {/* Floating Title */}
      <FloatingTitle
        title={cardTitles[index % cardTitles.length] || "About"}
        index={index}
        alignment={alignment}
        isVisible={isVisible}
        accentColors={accentColors}
      />

      {/* Card Container */}
      <GestureElement
        tiltEnabled={!reducedMotion}
        tiltFactor={3}
        scaleOnHover={true}
        scaleAmount={1.02}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`w-full md:w-[85%] lg:w-[80%] max-w-2xl`}
      >
        <div className="relative overflow-hidden">
          {/* Animated background gradient */}
          <motion.div
            className="absolute -inset-1 rounded-2xl opacity-70 blur-xl z-0"
            style={{
              background: `linear-gradient(120deg,
                ${accentColors.primary}20 0%,
                ${accentColors.secondary}30 50%,
                ${accentColors.tertiary}20 100%)`,
              backgroundSize: '200% 200%',
              backgroundPosition: isHovered ? '100% 100%' : '0% 0%'
            }}
            animate={{
              scale: isHovered ? 1.05 : 1,
              opacity: isHovered ? 0.8 : 0.7,
            }}
            transition={{ duration: 0.8 }}
          />

          <div
            className={`relative rounded-xl overflow-hidden backdrop-blur-sm bg-bg-card/90 shadow-xl border border-divider z-10 p-6 md:p-8`}
          >
            {/* Card ordinal */}
            <div className="absolute top-3 right-3">
              <motion.div
                className="text-5xl font-extrabold font-heading opacity-5 select-none"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? -5 : 0
                }}
                transition={{ duration: 0.4 }}
              >
                {(index + 1).toString().padStart(2, '0')}
              </motion.div>
            </div>

            {/* Glowing accent corner */}
            <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
              <motion.div
                className="absolute -top-10 -left-10 w-20 h-20 rounded-full blur-lg"
                style={{
                  backgroundColor: index % 3 === 0
                    ? accentColors.primary
                    : index % 3 === 1
                      ? accentColors.secondary
                      : accentColors.tertiary
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.4 : 0.2 }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Elegant corner border treatments */}
            <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none">
              <motion.div
                className="absolute top-0 left-0 w-full h-[2px]"
                style={{
                  background: `linear-gradient(90deg,
                    ${index % 3 === 0 ? accentColors.primary : index % 3 === 1 ? accentColors.secondary : accentColors.tertiary} 0%,
                    transparent 100%)`
                }}
                initial={{ width: 0 }}
                animate={{ width: isHovered ? '100%' : '40%' }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="absolute top-0 left-0 h-full w-[2px]"
                style={{
                  background: `linear-gradient(180deg,
                    ${index % 3 === 0 ? accentColors.primary : index % 3 === 1 ? accentColors.secondary : accentColors.tertiary} 0%,
                    transparent 100%)`
                }}
                initial={{ height: 0 }}
                animate={{ height: isHovered ? '100%' : '40%' }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none">
              <motion.div
                className="absolute bottom-0 right-0 w-full h-[2px]"
                style={{
                  background: `linear-gradient(90deg,
                    transparent 0%,
                    ${index % 3 === 0 ? accentColors.secondary : index % 3 === 1 ? accentColors.tertiary : accentColors.primary} 100%)`
                }}
                initial={{ width: 0 }}
                animate={{ width: isHovered ? '100%' : '40%' }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="absolute bottom-0 right-0 h-full w-[2px]"
                style={{
                  background: `linear-gradient(180deg,
                    transparent 0%,
                    ${index % 3 === 0 ? accentColors.secondary : index % 3 === 1 ? accentColors.tertiary : accentColors.primary} 100%)`
                }}
                initial={{ height: 0 }}
                animate={{ height: isHovered ? '100%' : '40%' }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Content Section - simplified without image */}
            <div className="flex flex-col relative z-10">
              {/* Text Content with improved typography */}
              <div className="w-full">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <RichText content={content} />
                </div>

                {/* Enhanced CTA Button (only on last card) */}
                {isLast && ctaText && ctaLink && (
                  <motion.div
                    className="mt-8"
                    initial="rest"
                    whileHover="hover"
                  >
                    <Link href={ctaLink}>
                      <motion.div
                        className="relative group inline-flex"
                        animate={isHovered ? "hover" : "rest"}
                      >
                        <motion.div
                          className="px-6 py-3 rounded-lg border-2 font-medium text-sm tracking-wide flex items-center gap-2 uppercase z-10 relative overflow-hidden"
                          variants={buttonVariants}
                        >
                          <motion.span
                            initial={{ x: 0 }}
                            animate={{ x: isHovered ? -5 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {ctaText}
                          </motion.span>
                          <motion.span
                            className="text-lg relative z-10"
                            initial={{ x: 0, opacity: 0.7 }}
                            animate={{
                              x: isHovered ? 5 : 0,
                              opacity: isHovered ? 1 : 0.7
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            →
                          </motion.span>

                          <motion.div
                            className="absolute inset-0 z-0"
                            initial={{ x: '-100%' }}
                            animate={{ x: isHovered ? '0%' : '-100%' }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            style={{
                              background: `linear-gradient(90deg, ${accentColors.primary}, ${accentColors.secondary})`
                            }}
                          />
                        </motion.div>

                        {/* Button shadow */}
                        <motion.div
                          className="absolute inset-0 rounded-lg blur-md opacity-0"
                          animate={{
                            opacity: isHovered ? 0.5 : 0,
                            y: isHovered ? 4 : 2,
                            scale: isHovered ? 0.95 : 0.9
                          }}
                          transition={{ duration: 0.4 }}
                          style={{
                            background: `linear-gradient(90deg, ${accentColors.primary}80, ${accentColors.secondary}80)`
                          }}
                        />
                      </motion.div>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Arrow connection points - invisible elements for arrow positioning */}
            <div id={`${id}-start`} className="absolute top-1/2 left-0 w-1 h-1 -translate-x-1/2" />
            <div id={`${id}-end`} className="absolute top-1/2 right-0 w-1 h-1 translate-x-1/2" />
            <div id={`${id}-top`} className="absolute top-0 left-1/2 w-1 h-1 -translate-y-1/2" />
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -bottom-4 -right-4 w-12 h-12 opacity-20 pointer-events-none z-0"
            animate={{ rotate: isHovered ? 45 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke={accentColors.primary} strokeWidth="2" />
              <circle cx="50" cy="50" r="20" stroke={accentColors.secondary} strokeWidth="2" />
            </svg>
          </motion.div>
        </div>
      </GestureElement>
    </motion.div>
  );
});

AboutCard.displayName = 'AboutCard';
export default AboutCard;
