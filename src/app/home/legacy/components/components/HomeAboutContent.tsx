// src/app/home/components/HomeAboutContent.tsx
'use client'

import React, { memo, useEffect, useState, useRef } from 'react'
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/common/Button'
import { Heading } from '@/components/common/Typography'
import RichText from '@/components/common/Typography/RichText'
import Icon from '@/components/common/Icons/Icon'

interface AccentColors {
  primary: string
  secondary: string
  tertiary: string
  warm?: string
  contrast?: string
  oceanic?: string
  cosmic?: string
  brand: string
}

interface TechValues {
  sectionRatio: number
  contentWidth: number
  imageScale: string
  gridDensity?: number
  renderQuality?: number
}

interface MousePosition {
  x: number
  y: number
}

interface HomeAboutContentProps {
  heading: string
  content: string | React.ReactNode
  ctaText: string
  ctaLink: string
  isHeadingInView: boolean
  techValues: TechValues
  mousePosition: MousePosition
  uniqueId: string
  isActive: boolean
  accentColors: AccentColors
}

const HomeAboutContent: React.FC<HomeAboutContentProps> = ({
  heading,
  content,
  ctaText,
  ctaLink,
  isHeadingInView,
  techValues,
  mousePosition,
  uniqueId,
  isActive,
  accentColors
}) => {
  // Refs and state management
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightedWords, setHighlightedWords] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [contentSegments, setContentSegments] = useState<string[]>([]);
  const [activeSegment, setActiveSegment] = useState<number>(0);
  const buttonControls = useAnimation();

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [5, 0]);
  const translateY = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1]);

  // Split content into segments for animation
  useEffect(() => {
    if (typeof content === 'string') {
      const segments = content
        .replace(/<\/?[^>]+(>|$)/g, ' ') // Strip HTML tags for splitting
        .split(/(?<=[.!?])\s+/)
        .filter(segment => segment.trim().length > 0);
      setContentSegments(segments);
    }
  }, [content]);

  // Periodically highlight random words for visual interest
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      if (contentRef.current) {
        const spans = contentRef.current.querySelectorAll('.text-emphasis, strong, em, .underline-accent');
        if (spans.length > 0) {
          const randomIndices: number[] = [];
          // Select 1-3 random elements to highlight
          const count = Math.floor(Math.random() * 3) + 1;

          for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * spans.length);
            if (!randomIndices.includes(randomIndex)) {
              randomIndices.push(randomIndex);
            }
          }

          setHighlightedWords(randomIndices);

          // Reset after a short delay
          setTimeout(() => {
            setHighlightedWords([]);
          }, 800);
        }
      }
    }, 4000);

    // Cycle through content segments
    const segmentInterval = setInterval(() => {
      if (contentSegments.length > 1) {
        setActiveSegment(prev => (prev + 1) % contentSegments.length);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(segmentInterval);
    };
  }, [isActive, contentSegments]);

  // Add highlight class to selected words
  useEffect(() => {
    if (!contentRef.current) return;

    const spans = contentRef.current.querySelectorAll('.text-emphasis, strong, em, .underline-accent');

    // Remove any existing highlight classes
    spans.forEach(span => {
      span.classList.remove('about-highlight');
    });

    // Add highlight class to selected words
    highlightedWords.forEach(index => {
      if (index >= 0 && index < spans.length) {
        spans[index].classList.add('about-highlight');
      }
    });
  }, [highlightedWords]);

  // Handle button hover animations
  useEffect(() => {
    if (isHovered) {
      buttonControls.start({
        scale: 1.05,
        y: -5,
        boxShadow: `0px 10px 25px rgba(0,0,0,0.25), 0px 0px 15px ${accentColors.primary}70`,
        transition: { duration: 0.3 }
      });
    } else {
      buttonControls.start({
        scale: 1,
        y: 0,
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        transition: { duration: 0.3 }
      });
    }
  }, [isHovered, buttonControls, accentColors.primary]);

  // Calculate "heat map" intensity based on mouse position (for glass effect)
  const getHeatmapGradient = () => {
    const x = mousePosition.x * 100;
    const y = mousePosition.y * 100;
    return `radial-gradient(circle at ${x}% ${y}%,
      var(--color-bg-hover),
      var(--color-bg-glass) 70%
    )`;
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative perspective-1000 overflow-visible"
      style={{
        rotateX,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0 }}
      animate={isActive ? { opacity: 1 } : { opacity: 0 }}
    >
      {/* Main Content Container */}
      <motion.div
        className="relative grid grid-cols-12 gap-6 z-10"
        style={{ y: translateY }}
      >
        {/* Main Content Area */}
        <motion.div
          className="col-span-12 md:col-span-12 transform-gpu"
          style={{ opacity: contentOpacity }}
        >
          <motion.div
            className="bg-bg-glass backdrop-blur-md px-8 py-10 relative rounded-sm"
            style={{
              borderLeft: `2px solid ${accentColors.primary}`,
              borderBottom: `1px solid ${accentColors.secondary}40`,
              backgroundImage: getHeatmapGradient()
            }}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Header with Animated Decoration */}
            <motion.div className="mb-8 relative">
              {/* Animated accent bracket */}
              <motion.div
                className="absolute -left-4 -top-4 h-20 w-4 border-l-2 border-t-2 border-accent-primary"
                initial={{ opacity: 0, scaleX: 0, scaleY: 0 }}
                animate={isHeadingInView ? { opacity: 1, scaleX: 1, scaleY: 1 } : { opacity: 0, scaleX: 0, scaleY: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ transformOrigin: "top left" }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Heading
                  level={2}
                  className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl relative inline-block"
                >
                  {heading}

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{
                      background: `linear-gradient(to right,
                        ${accentColors.primary},
                        ${accentColors.secondary}
                      )`
                    }}
                    initial={{ width: 0 }}
                    animate={isHeadingInView ? { width: "100%" } : { width: 0 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    aria-hidden="true"
                  />
                </Heading>
              </motion.div>
            </motion.div>

            {/* Content Container with subtle Grid Background */}
            <div className="relative">
              {/* Content Grid Background */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--color-grid-lines) 1px, transparent 1px),
                                    linear-gradient(to bottom, var(--color-grid-lines) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Content with Animations */}
              <motion.div
                ref={contentRef}
                className="relative z-10 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="text-lg leading-relaxed text-text-primary">
                  {typeof content === 'string' ? <RichText content={content} /> : content}
                </div>
              </motion.div>

              {/* Animated Fact Carousel */}
              <motion.div
                className="mb-10 relative overflow-hidden rounded bg-bg-glass p-4 border border-secondary-bg"
                initial={{ opacity: 0, x: 30 }}
                animate={isHeadingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="relative h-10">
                  <AnimatedFacts
                    contentSegments={contentSegments}
                    activeSegment={activeSegment}
                    accentColors={accentColors}
                  />
                </div>
              </motion.div>

              {/* CTA Button with Enhanced Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                <motion.div
                  className="relative inline-block"
                  animate={buttonControls}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* Button glow effect */}
                  <motion.div
                    className="absolute -inset-2 rounded-sm opacity-0"
                    style={{
                      background: `linear-gradient(135deg, ${accentColors.primary}30, ${accentColors.secondary}30)`,
                      filter: "blur(10px)"
                    }}
                    animate={{ opacity: isHovered ? 0.8 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <Button
                    intent="primary"
                    size="lg"
                    href={ctaLink}
                    className="relative border bg-accent-primary text-white text-lg font-bold tracking-wider py-4 px-8 z-10"
                    style={{
                      background: `linear-gradient(135deg, ${accentColors.primary}, ${accentColors.brand})`,
                      clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)",
                    }}
                    icon={<Icon name="fi:FiArrowRight" size={24} aria-hidden="true" />}
                    iconPosition="right"
                  >
                    {ctaText}
                  </Button>

                  {/* Animated particles on hover */}
                  {isHovered && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={`particle-${i}`}
                          className="absolute rounded-full"
                          style={{
                            width: 1 + Math.random() * 2,
                            height: 1 + Math.random() * 2,
                            backgroundColor: i % 3 === 0 ? accentColors.primary :
                                          i % 3 === 1 ? accentColors.secondary :
                                          accentColors.brand,
                            x: `calc(${50 + (Math.random() * 100 - 50)}% - 1px)`,
                            y: `calc(${50 + (Math.random() * 100 - 50)}% - 1px)`,
                          }}
                          animate={{
                            x: [
                              `calc(${50 + (Math.random() * 100 - 50)}% - 1px)`,
                              `calc(${50 + (Math.random() * 100 - 50)}% - 1px)`,
                            ],
                            y: [
                              `calc(${50 + (Math.random() * 100 - 50)}% - 1px)`,
                              `calc(${50 + (Math.random() * 100 - 50)}% - 1px)`,
                            ],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 0.8 + Math.random() * 0.5,
                            repeat: Infinity,
                            repeatDelay: Math.random() * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Button shadow element - purely decorative */}
                <div
                  className="w-36 h-2 mt-2 ml-6 rounded-full opacity-20"
                  style={{
                    background: `linear-gradient(to right, ${accentColors.brand}, transparent)`,
                    filter: "blur(4px)"
                  }}
                ></div>
              </motion.div>

              {/* Animated Scan Effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  className="absolute left-0 right-0 h-[1px]"
                  style={{
                    background: `linear-gradient(to right, transparent, ${accentColors.primary}, transparent)`
                  }}
                  animate={{
                    top: ["0%", "100%"],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear"
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Style for highlighted words */}
      <style jsx global>{`
        .about-highlight {
          color: var(--color-accent-primary);
          position: relative;
          display: inline-block;
          animation: pulse 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </motion.div>
  )
}

// Animated Facts component for text cycling
const AnimatedFacts: React.FC<{
  contentSegments: string[];
  activeSegment: number;
  accentColors: AccentColors;
}> = ({ contentSegments, activeSegment, accentColors }) => {
  if (contentSegments.length === 0) return null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {contentSegments.map((segment, index) => (
        <motion.p
          key={`segment-${index}`}
          className="absolute top-0 left-0 right-0 text-secondary-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: activeSegment === index ? 1 : 0,
            y: activeSegment === index ? 0 : 20
          }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          "{segment.trim()}"
        </motion.p>
      ))}

      {/* Animated progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px]"
        style={{
          background: `linear-gradient(to right, ${accentColors.primary}, ${accentColors.secondary})`,
          width: "100%",
          scaleX: 0,
          transformOrigin: "left"
        }}
        animate={{
          scaleX: [0, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </div>
  );
};

export default memo(HomeAboutContent)