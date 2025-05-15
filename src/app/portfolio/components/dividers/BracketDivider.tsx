"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/classNames";
import { useAnimationPreferences } from "@/components/core/Animations";

interface BracketDividerProps {
  className?: string;
  height?: number;
  color?: string;
  accentColor?: string;
  codeSnippet?: string;
  codeSize?: "sm" | "md" | "lg";
}

const BracketDivider: React.FC<BracketDividerProps> = ({
  className,
  height = 120,
  color,
  accentColor,
  codeSnippet = "// Final section\nfunction initializePortfolio() {\n  return renderCTA();\n}",
  codeSize = "md",
}) => {
  const { shouldAnimate } = useAnimationPreferences();
  const dividerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(dividerRef, { once: false, margin: "-10% 0px" });
  const [uniqueId] = useState(`bracket-${Math.floor(Math.random() * 10000)}`);
  const [glitchActive, setGlitchActive] = useState(false);

  // Bracket colors
  const bracketColor = color || "var(--color-accent-tertiary)";
  const accentTextColor = accentColor || "var(--color-accent-warm)";

  // Code font size mapping
  const codeSizeClass = {
    sm: "text-xs md:text-sm",
    md: "text-sm md:text-base",
    lg: "text-base md:text-xl"
  }[codeSize];

  // Typewriter state
  const [displayedText, setDisplayedText] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);

  // Line numbers for code
  const lineCount = (codeSnippet.match(/\n/g) || []).length + 1;

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: dividerRef,
    offset: ["start end", "end start"]
  });

  const bracketScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.1, 0.9]);
  const codeBlockX = useTransform(scrollYProgress, [0, 0.5, 1], ["-2%", "0%", "2%"]);

  // Technical data for neobrutalist style
  const [techData] = useState({
    brackets: {
      left: "{ //OPEN",
      right: "} //CLOSE"
    },
    metrics: {
      width: Math.floor(Math.random() * 200) + 800,
      depth: Math.floor(Math.random() * 10) + 2,
      timestamp: Date.now()
    }
  });

  // Typewriter effect
  useEffect(() => {
    if (!isInView || !shouldAnimate()) {
      return;
    }

    let i = 0;
    const typing = setInterval(() => {
      if (i < codeSnippet.length) {
        setDisplayedText(codeSnippet.slice(0, i + 1));
        setCursorPosition(i + 1);
        i++;
      } else {
        clearInterval(typing);
      }
    }, 30);

    return () => clearInterval(typing);
  }, [isInView, codeSnippet, shouldAnimate]);

  // Glitch effect
  useEffect(() => {
    if (!isInView || !shouldAnimate()) return;

    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 6000);

    return () => clearInterval(glitchInterval);
  }, [isInView, shouldAnimate]);

  // Get cursor position in the visible text
  const getCursorCoordinates = () => {
    const textUpToCursor = displayedText.substring(0, cursorPosition);
    const lines = textUpToCursor.split('\n');
    return {
      line: lines.length,  // 1-based line number
      column: lines[lines.length - 1].length + 1  // 1-based column
    };
  };

  const cursorCoords = getCursorCoordinates();

  return (
    <div
      ref={dividerRef}
      className={cn(
        "relative w-full overflow-hidden bg-bg-code",
        className
      )}
      style={{
        height: `${height}px`,
        boxShadow: "0 0 40px rgba(0, 0, 0, 0.2) inset",
        borderTopWidth: "8px",
        borderBottomWidth: "8px",
        borderColor: bracketColor
      }}
      aria-hidden="true"
    >
      {/* SVG Defs for filters */}
      <svg width="0" height="0">
        <defs>
          {/* Glitch effect filter */}
          <filter id={`${uniqueId}-glitch`}>
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="original"
            />
            <feOffset dx="-3" dy="0" result="offsetRed" />
            <feColorMatrix
              in="offsetRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />
            <feOffset dx="3" dy="0" result="offsetBlue" />
            <feColorMatrix
              in="offsetBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />
            <feOffset dx="0" dy="3" result="offsetGreen" />
            <feColorMatrix
              in="offsetGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />
            <feBlend mode="screen" in="red" in2="blue" result="blend1" />
            <feBlend mode="screen" in="blend1" in2="green" result="blend" />
          </filter>
        </defs>
      </svg>

      {/* Top technical elements - neobrutalist style with bold elements */}
      <div
        className="absolute top-0 left-0 right-0 h-6 flex justify-between items-center px-4 z-10"
        style={{ backgroundColor: `${bracketColor}20` }} // 20 is hex for 12% opacity
      >
        <motion.div
          className="text-[10px] font-mono font-bold text-accent-warm"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          CODE::BLOCK #{techData.metrics.depth}
        </motion.div>

        <motion.div
          className="text-[10px] font-mono font-bold text-accent-oceanic"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          WIDTH: {techData.metrics.width}px
        </motion.div>
      </div>

      {/* Line numbers - brutalist style with offset */}
      <div
        className="absolute left-0 top-6 bottom-0 w-10 flex flex-col items-end pr-2 py-4"
        style={{
          backgroundColor: `${bracketColor}20`,
          borderRightWidth: "4px",
          borderRightColor: bracketColor
        }}
      >
        {Array.from({ length: lineCount }).map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className={cn(
              "text-xs font-mono font-bold",
              i + 1 <= cursorCoords.line ? "text-accent-warm" : "text-text-tertiary"
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: isInView ? 1 : 0,
              x: isInView ? 0 : -10,
              color: i + 1 === cursorCoords.line ? accentTextColor : undefined
            }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
          >
            {i + 1}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto h-full flex items-center justify-center px-4">
        <div className="flex items-stretch w-full max-w-3xl relative pl-10">
          {/* Opening bracket - brutalist oversized style */}
          <motion.div
            className="text-5xl sm:text-6xl md:text-7xl font-mono font-black mr-3 flex items-center"
            style={{
              scale: bracketScale,
              color: bracketColor
            }}
            initial={{ opacity: 0, x: -40, rotate: -10 }}
            animate={{
              opacity: isInView ? 1 : 0,
              x: isInView ? 0 : -40,
              rotate: isInView ? 0 : -10,
              filter: glitchActive ? `url(#${uniqueId}-glitch)` : 'none'
            }}
            transition={{
              duration: 0.5,
              rotate: { duration: 0.3 },
              filter: { duration: 0.2 }
            }}
          >
            <span className="drop-shadow-md transform -skew-y-2">{techData.brackets.left}</span>
          </motion.div>

          {/* Code content with brutalist styling */}
          <motion.div
            className={cn(
              "flex-1 font-mono font-bold overflow-hidden py-4",
              "transform -skew-x-1",
              codeSizeClass
            )}
            style={{
              x: codeBlockX,
              borderTopWidth: "4px",
              borderBottomWidth: "4px",
              borderColor: bracketColor
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isInView ? 1 : 0,
              filter: glitchActive ? `url(#${uniqueId}-glitch)` : 'none'
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              filter: { duration: 0.2 }
            }}
          >
            <pre className="px-4 whitespace-pre">
              <code className="text-text-code">
                {displayedText}
                <motion.span
                  className="inline-block w-3 h-4 bg-accent-warm translate-y-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </code>
            </pre>
          </motion.div>

          {/* Closing bracket - brutalist oversized style */}
          <motion.div
            className="text-5xl sm:text-6xl md:text-7xl font-mono font-black ml-3 flex items-center"
            style={{
              scale: bracketScale,
              color: bracketColor
            }}
            initial={{ opacity: 0, x: 40, rotate: 10 }}
            animate={{
              opacity: isInView ? 1 : 0,
              x: isInView ? 0 : 40,
              rotate: isInView ? 0 : 10,
              filter: glitchActive ? `url(#${uniqueId}-glitch)` : 'none'
            }}
            transition={{
              duration: 0.5,
              rotate: { duration: 0.3 },
              filter: { duration: 0.2 }
            }}
          >
            <span className="drop-shadow-md transform -skew-y-2">{techData.brackets.right}</span>
          </motion.div>

          {/* Brutalist angled corner element */}
          <div
            className="absolute -bottom-4 -right-4 w-20 h-10 transform rotate-12"
            style={{ backgroundColor: bracketColor }}
          ></div>
        </div>
      </div>

      {/* Status bar - brutalist style with bold elements */}
      <div
        className="absolute bottom-0 left-0 right-0 h-6 flex justify-between items-center px-4 z-10"
        style={{ backgroundColor: bracketColor }}
      >
        <motion.div
          className="text-[10px] font-mono font-bold text-bg-code uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          Ln {cursorCoords.line}, Col {cursorCoords.column}
        </motion.div>

        <motion.div
          className="text-[10px] font-mono font-bold text-bg-code uppercase flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="h-2 w-2 rounded-full bg-accent-warm mr-1"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          READY
        </motion.div>
      </div>
    </div>
  );
};

export default BracketDivider;