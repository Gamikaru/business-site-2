// src/app/home/components/HomeHeroSubheadline.tsx
"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import RichText from "@/components/common/Typography/RichText";

interface TechnicalData {
  systemLoad: number;
  coordinates?: { x: number; y: number };
  spectrumValue?: number;
}

interface AccentColors {
  primary: string;
  secondary: string;
  tertiary: string;
  brand: string;
  oceanic?: string;
  warm?: string;
  contrast?: string;
  cosmic?: string;
}

interface HomeHeroSubheadlineProps {
  subheadline: string;
  isSubheadlineInView: boolean;
  randomData: TechnicalData;
  accentColors?: AccentColors;
  heroAnimationComplete?: boolean;
}

// Technical symbols to replace numbers
const technicalSymbols = [
  { symbol: "<div>", type: "html" },
  { symbol: "{ }", type: "code" },
  { symbol: "=>", type: "function" },
  { symbol: "&&", type: "logic" },
  { symbol: "API", type: "data" },
  { symbol: "()", type: "method" },
  { symbol: "[]", type: "array" },
  { symbol: ".tsx", type: "file" },
  { symbol: "$_", type: "var" },
  { symbol: "</>", type: "component" },
  { symbol: "fn()", type: "function" },
  { symbol: "||", type: "or" },
];

// Animation variants for the cascading stair pattern
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.4,
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5 }
  }
};

// Enhanced box variants for stair pattern
const boxVariants = {
  hidden: (index: number) => ({
    opacity: 0,
    y: -50 + (index * 15),
    x: 50 - (index * 20),
    scale: 0.9,
    rotateX: 15
  }),
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 180 - (index * 20),
      damping: 22,
      mass: 1.1,
      delay: 0.2 + (index * 0.18)
    }
  }),
  hover: {
    y: -10,
    scale: 1.03,
    boxShadow: "0px 15px 30px rgba(0,0,0,0.2)",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Special variant for the final box
const finalBoxVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    x: 80,
    scale: 0.92,
    rotateX: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1.5,
      delay: 0.8
    }
  },
  hover: {
    y: -12,
    scale: 1.05,
    boxShadow: "0px 20px 40px rgba(0,0,0,0.25)",
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

const HomeHeroSubheadline: React.FC<HomeHeroSubheadlineProps> = ({
  subheadline,
  isSubheadlineInView,
  randomData,
  accentColors = {
    primary: 'var(--color-accent-primary)',
    secondary: 'var(--color-accent-secondary)',
    tertiary: 'var(--color-accent-tertiary)',
    brand: 'var(--color-brand-primary)',
    oceanic: 'var(--color-info)',
    warm: 'var(--color-warning)',
    contrast: 'var(--color-neutral)',
    cosmic: 'var(--color-success)'
  },
  heroAnimationComplete = false
}) => {
  // Refs for animation management and scroll effects
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State for hover effects
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);

  // Track if animation has been triggered
  const [hasAnimated, setHasAnimated] = useState(false);

  // Animation trigger based on hero animation completion and view status
  useEffect(() => {
    if (heroAnimationComplete && isSubheadlineInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [heroAnimationComplete, isSubheadlineInView, hasAnimated]);

  // Scroll-based animations for parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create different transform values for each box for parallax effect
  const boxYPositions = [
    useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "-8%", "-20%"]),
    useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "-12%", "-28%"]),
    useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "-16%", "-32%"]),
    useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "-20%", "-40%"])
  ];

  // Box rotation on scroll - more dynamic
  const boxRotations = [
    useTransform(scrollYProgress, [0, 0.5, 1], [0, -2, -5]),
    useTransform(scrollYProgress, [0, 0.5, 1], [0, 3, 6]),
    useTransform(scrollYProgress, [0, 0.5, 1], [0, -2, -4]),
    useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 3])
  ];

  // Scale effect on scroll
  const boxScales = [
    useTransform(scrollYProgress, [0, 1], [1, 0.95]),
    useTransform(scrollYProgress, [0, 1], [1, 0.92]),
    useTransform(scrollYProgress, [0, 1], [1, 0.94]),
    useTransform(scrollYProgress, [0, 1], [1, 0.9])
  ];

  // Clear any pending animations on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  // Format the subheadline content
  const formatContent = useCallback(() => {
    // Replace HTML tags with placeholders to avoid splitting them
    const tempText = subheadline.replace(/<[^>]+>/g, match => `###${match}###`);
    const words = tempText.split(' ');

    // First three words in separate boxes
    const firstThreeWords = words.slice(0, 3).map(word =>
      word.replace(/###(.*?)###/g, '$1')
    );

    // Everything else in the final box
    const remainingWords = words.slice(3).join(' ').replace(/###(.*?)###/g, '$1');

    return { firstThreeWords, remainingWords };
  }, [subheadline]);

  const { firstThreeWords, remainingWords } = formatContent();

  // Render the technical markers for each box
  const renderTechnicalMarkers = useCallback((index: number, isLarge: boolean = false) => {
    const count = isLarge ? 6 : 3;
    const startIndex = index * 3; // Start from different parts of the array

    return Array.from({ length: count }).map((_, i) => {
      const isLast = i === count - 1;
      const symbolIndex = (startIndex + i) % technicalSymbols.length;
      const { symbol, type } = technicalSymbols[symbolIndex];

      // Alternate colors based on box index and position
      const colorKeys = ['accent-primary', 'accent-secondary', 'accent-tertiary', 'brand', 'oceanic'];
      const colorKey = colorKeys[(index + i) % colorKeys.length];
      const accentColorKey = colorKey === 'accent-primary' ? 'primary' :
                            colorKey === 'accent-secondary' ? 'secondary' :
                            colorKey === 'accent-tertiary' ? 'tertiary' :
                            colorKey === 'oceanic' ? 'oceanic' : 'brand';
      const accentColor = accentColors[accentColorKey];

      return (
        <motion.span
          key={`marker-${index}-${i}`}
          className="px-1 pt-1 text-[9px] tracking-tight font-mono"
          style={{
            borderLeft: `1px solid ${accentColor}`,
            borderTop: `1px solid ${accentColor}`,
            borderRight: isLast ? `1px solid ${accentColor}` : undefined,
            color: accentColor
          }}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 + (index * 0.15) + (i * 0.08) }}
          title={`Technical element: ${type}`}
        >
          {symbol}
        </motion.span>
      );
    });
  }, [accentColors]);

  // Render decorative circuit lines
  const renderCircuitLines = useCallback((index: number) => {
    const lineCount = index === 3 ? 4 : 2;
    const baseLength = 30 + (index * 10);

    // Get the appropriate accent color based on index
    const getLineColor = (lineIndex: number) => {
      const colorKey =
        index === 0 ? 'primary' :
        index === 1 ? 'secondary' :
        index === 2 ? 'tertiary' : 'brand';
      return accentColors[colorKey];
    };

    return (
      <div className="absolute -bottom-4 left-5 h-4">
        {Array.from({ length: lineCount }).map((_, i) => {
          const width = baseLength + (i * 25);
          const delay = 1.2 + (index * 0.15) + (i * 0.12);
          const color = getLineColor(i);

          const style = {
            width,
            borderLeft: `1px solid ${color}`,
            borderBottom: `1px solid ${color}`,
            borderStyle: i % 2 ? 'solid' : 'dashed',
            opacity: 0.8 - (i * 0.1),
            height: '100%',
            position: 'absolute' as const,
          };

          return (
            <motion.div
              key={`circuit-${index}-${i}`}
              style={style}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            />
          );
        })}
      </div>
    );
  }, [accentColors]);

  // Enhanced box styling with glass effect
  const getBoxStyle = (index: number, isHovered: boolean) => {
    // Golden ratio-based positioning - each box is placed according to golden ratio principles
    const goldenRatio = 1.618;

    // Get the appropriate color for the box border
    const getBorderColor = () => {
      switch (index) {
        case 0: return accentColors.primary;
        case 1: return accentColors.secondary;
        case 2: return accentColors.tertiary;
        case 3: return accentColors.brand;
        default: return accentColors.primary;
      }
    };

    // Get the appropriate shadow color for hover state
    const getShadowColor = () => {
      switch (index) {
        case 0: return 'var(--color-accent-primary)';
        case 1: return 'var(--color-accent-secondary)';
        case 2: return 'var(--color-accent-tertiary)';
        case 3: return 'var(--color-brand-primary)';
        default: return 'var(--color-accent-primary)';
      }
    };

    const borderColor = getBorderColor();
    const shadowColor = getShadowColor();

    const baseStyle: React.CSSProperties = {
      backgroundColor: "var(--color-glass-bg)",
      backdropFilter: "blur(8px)",
      borderLeft: `${index === 3 ? 6 : 3}px solid ${borderColor}`,
      boxShadow: isHovered
        ? `0px ${index === 3 ? 25 : 15}px ${index === 3 ? 40 : 30}px rgba(0,0,0,0.2),
           0px 0px 15px ${shadowColor}`
        : `0px ${index === 3 ? 8 : 4}px ${index === 3 ? 20 : 15}px rgba(0,0,0,0.1)`,
      transition: "box-shadow 0.4s ease, transform 0.4s ease",
      overflow: "hidden"
    };

    return baseStyle;
  };

  // Box positions for the cascading stair pattern - golden ratio based
  const getBoxPositionClasses = (index: number) => {
    switch (index) {
      case 0:
        return "col-span-5 md:col-span-4 lg:col-span-4 col-start-8 md:col-start-9 lg:col-start-9";
      case 1:
        return "col-span-6 md:col-span-5 lg:col-span-5 col-start-7 md:col-start-7 lg:col-start-7 mt-6";
      case 2:
        return "col-span-7 md:col-span-6 lg:col-span-6 col-start-5 md:col-start-5 lg:col-start-5 mt-6";
      case 3:
        return "col-span-8 md:col-span-8 lg:col-span-7 col-start-3 md:col-start-3 lg:col-start-3 mt-8";
      default:
        return "";
    }
  };

  return (
    <AnimatePresence>
      {isSubheadlineInView && (
        <motion.div
          ref={containerRef}
          className="relative perspective-1000 z-10"
          variants={containerVariants}
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
          exit="exit"
        >
          {/* Cascading word boxes - right to left, top to bottom */}
          <div className="grid grid-cols-12 gap-4">
            {firstThreeWords.map((word, index) => (
              <motion.div
                key={`word-${index}`}
                className={getBoxPositionClasses(index)}
                variants={boxVariants}
                custom={index}
                whileHover="hover"
                onMouseEnter={() => setHoveredBox(index)}
                onMouseLeave={() => setHoveredBox(null)}
                style={{
                  y: boxYPositions[index],
                  rotateX: boxRotations[index],
                  scale: boxScales[index],
                  zIndex: hoveredBox === index ? 20 : 10
                }}
              >
                <div className="relative">
                  <div className="absolute -top-5 left-0 flex text-[10px] font-mono" aria-hidden="true">
                    {renderTechnicalMarkers(index)}
                  </div>

                  <motion.div
                    className="px-4 py-3 relative overflow-hidden rounded-sm"
                    style={getBoxStyle(index, hoveredBox === index)}
                  >
                    <motion.p
                      className="text-xl md:text-2xl font-light text-primary-text font-heading"
                      animate={{
                        scale: hoveredBox === index ? 1.05 : 1,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {word}
                    </motion.p>

                    {/* Animated highlight effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 bg-gradient-to-r"
                      style={{
                        backgroundImage: `linear-gradient(120deg, transparent, ${accentColors[index === 0 ? 'primary' : index === 1 ? 'secondary' : 'tertiary']}20, transparent)`,
                        backgroundSize: "200% 100%"
                      }}
                      animate={{
                        opacity: hoveredBox === index ? 0.7 : 0,
                        backgroundPosition: hoveredBox === index ? ["0% 0%", "200% 0%"] : "0% 0%"
                      }}
                      transition={{ duration: 1.2, repeat: hoveredBox === index ? Infinity : 0 }}
                    />

                    {/* Floating particles */}
                    {hoveredBox === index && (
                      <motion.div className="absolute inset-0 pointer-events-none">
                        {[...Array(5)].map((_, i) => {
                          const particleShape = i % 3 === 0 ? "rounded-full" : i % 3 === 1 ? "rounded-sm" : "rotate-45";
                          const particleSize = i % 3 === 0 ? "w-2 h-2" : i % 3 === 1 ? "w-1 h-3" : "w-2 h-2";

                          return (
                            <motion.div
                              key={`particle-${index}-${i}`}
                              className={`absolute opacity-30 ${particleSize} ${particleShape}`}
                              style={{
                                backgroundColor: index === 0 ? accentColors.primary :
                                              index === 1 ? accentColors.secondary :
                                              accentColors.tertiary,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                              }}
                              animate={{
                                y: [0, -20, 0],
                                x: [0, i % 2 ? 15 : -15, 0],
                                opacity: [0, 0.5, 0],
                                scale: [0, 1, 0],
                                rotate: i % 2 ? [0, 180, 360] : [0, 0, 0]
                              }}
                              transition={{
                                duration: 2 + Math.random() * 2,
                                repeat: Infinity,
                                delay: i * 0.3
                              }}
                            />
                          );
                        })}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Circuit line decoration */}
                  {renderCircuitLines(index)}
                </div>
              </motion.div>
            ))}

            {/* Final box with remaining words */}
            <motion.div
              className={getBoxPositionClasses(3)}
              variants={finalBoxVariants}
              whileHover="hover"
              onMouseEnter={() => setHoveredBox(3)}
              onMouseLeave={() => setHoveredBox(null)}
              style={{
                y: boxYPositions[3],
                rotateX: boxRotations[3],
                scale: boxScales[3],
                zIndex: hoveredBox === 3 ? 30 : 20
              }}
            >
              <div className="relative">
                <div className="absolute -top-5 left-0 flex text-[10px] font-mono flex-wrap" aria-hidden="true">
                  {renderTechnicalMarkers(3, true)}
                </div>

                <motion.div
                  className="p-5 relative overflow-hidden rounded-sm"
                  style={getBoxStyle(3, hoveredBox === 3)}
                >
                  <motion.div
                    animate={{
                      scale: hoveredBox === 3 ? 1.03 : 1,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <p className="text-2xl md:text-3xl font-medium text-primary-text font-heading">
                      <RichText content={remainingWords} />
                    </p>
                  </motion.div>

                  {/* Animated highlight effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 bg-gradient-to-r"
                    style={{
                      backgroundImage: `linear-gradient(120deg, transparent, ${accentColors.brand}20, transparent)`,
                      backgroundSize: "200% 100%"
                    }}
                    animate={{
                      opacity: hoveredBox === 3 ? 0.7 : 0,
                      backgroundPosition: hoveredBox === 3 ? ["0% 0%", "200% 0%"] : "0% 0%"
                    }}
                    transition={{ duration: 1.5, repeat: hoveredBox === 3 ? Infinity : 0 }}
                  />

                  {/* Enhanced diagonal accent line */}
                  <motion.div
                    className="absolute right-0 top-0 w-24 h-24 overflow-hidden pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <motion.div
                      className="absolute right-0 top-0 w-48 h-1"
                      style={{
                        background: `linear-gradient(to right, transparent, ${accentColors.brand})`,
                        transformOrigin: "right top",
                        rotate: "135deg",
                        translateX: "50%"
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.6, duration: 0.8 }}
                    />
                  </motion.div>

                  {/* Animated corner accent */}
                  <motion.div
                    className="absolute -right-2 -bottom-2 w-20 h-20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                  >
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                      <motion.path
                        d="M80,80 L60,80 L80,60 Z"
                        fill={accentColors.brand}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.8, duration: 0.5 }}
                        style={{ transformOrigin: 'bottom right' }}
                      />
                    </svg>
                  </motion.div>

                  {/* Enhanced floating particles */}
                  {hoveredBox === 3 && (
                    <motion.div className="absolute inset-0 pointer-events-none">
                      {[...Array(8)].map((_, i) => {
                        const particleColors = [
                          accentColors.primary,
                          accentColors.secondary,
                          accentColors.tertiary,
                          accentColors.brand
                        ];
                        return (
                          <motion.div
                            key={`particle-3-${i}`}
                            className="absolute opacity-40"
                            style={{
                              backgroundColor: particleColors[i % 4],
                              width: 1 + (i % 3) * 1.5,
                              height: 1 + (i % 3) * 1.5,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              borderRadius: i % 2 ? '50%' : '0%',
                            }}
                            animate={{
                              x: [0, (i % 2 ? 25 : -25), 0],
                              y: [0, (i % 2 ? -25 : 25), 0],
                              opacity: [0, 0.7, 0],
                              scale: [0, 1.5, 0]
                            }}
                            transition={{
                              duration: 2.5 + Math.random() * 1.5,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        );
                      })}
                    </motion.div>
                  )}
                </motion.div>

                {/* Enhanced circuit lines */}
                {renderCircuitLines(3)}
              </div>
            </motion.div>
          </div>

          {/* CSS variables for RGB color values */}
          <style jsx global>{`
            :root {
              --rgb-accent-primary: 97, 218, 251; /* Example - adjust to your colors */
              --rgb-accent-secondary: 241, 90, 36;
              --rgb-accent-tertiary: 80, 200, 120;
              --rgb-brand-primary: 64, 156, 255;
            }

            .perspective-1000 {
              perspective: 1000px;
            }

            /* Enhanced box shadow and glass effect */
            .glass-effect {
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              border: 1px solid rgba(255, 255, 255, 0.08);
              background-color: rgba(var(--rgb-glass-bg, 15, 15, 22), 0.5);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(HomeHeroSubheadline);