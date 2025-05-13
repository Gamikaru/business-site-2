import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/classNames";

interface HomeHeroHeadlineProps {
  headline: string;
  glitchActive: boolean;
  intensiveGlitch: boolean;
  glitchOffsets: number[];
  accentColors?: {
    primary: string;
    secondary: string;
    tertiary: string;
    brand: string;
    oceanic: string;
  };
}

const HomeHeroHeadline: React.FC<HomeHeroHeadlineProps> = ({
  headline,
  glitchActive,
  intensiveGlitch,
  glitchOffsets,
  accentColors
}) => {
  // Split headline into individual characters for extreme animation control
  const characters = headline.split('');
  const words = headline.split(' ');

  // Function to get varied colors
  const getTextColor = (wordIndex: number, globalIndex: number) => {
    if (globalIndex % 7 === 0) return "accent-oceanic";
    if (globalIndex % 8 === 0) return "accent-secondary";
    if (globalIndex % 9 === 0) return "accent-warm";
    return wordIndex % 3 === 0 ? "text-white" :
           wordIndex % 3 === 1 ? "accent-contrast" : "text-brand-primary";
  };

  return (
    <div className="col-span-12 mb-12 relative">
      {/* Raw brackets and technical framing */}
      <motion.div
        className="absolute -left-8 top-2 bottom-2 border-l-4 border-t-2 border-b-2 border-accent-oceanic w-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      <div className="relative">
        {/* Main headline with extreme styling */}
        <div className="flex flex-wrap gap-2 md:gap-4 items-baseline relative">
          {/* Using individual word styling for maximum control */}
          {words.map((word, wordIndex) => (
            <div
              key={`word-${wordIndex}`}
              className="relative perspective-effect"
            >
              {/* Word container with 3D effect */}
              <div className="relative inline-block translate-z-0">
                {/* Each character with individual animations */}
                {word.split('').map((char, charIndex) => {
                  // Calculate global character index
                  const globalIndex = characters.findIndex((_, i) =>
                    i === words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0) + charIndex
                  );

                  return (
                    <motion.span
                      key={`char-${wordIndex}-${charIndex}`}
                      className={cn(
                        "inline-block text-[clamp(2.5rem,8vw,7.5rem)] font-black leading-[0.85]",
                        getTextColor(wordIndex, globalIndex),
                        globalIndex % 9 === 0 && "italic",
                        glitchActive && globalIndex % 5 === 0 && "translate-y-[5px]",
                        glitchActive && globalIndex % 3 === 0 && "-rotate-3",
                        glitchActive && globalIndex % 4 === 0 && "rotate-3 translate-x-[3px]",
                        intensiveGlitch && globalIndex % 2 === 0 && "opacity-0"
                      )}
                      style={glitchActive ? {
                        transform: `translate3d(${glitchOffsets[globalIndex] || 0}px, ${glitchOffsets[globalIndex + 1] || 0}px, 0)`,
                        filter: globalIndex % 6 === 0 ? 'brightness(2)' : 'none',
                        textShadow: globalIndex % 5 === 0
                          ? `0 0 5px ${globalIndex % 10 === 0 ? accentColors?.secondary : accentColors?.primary}`
                          : 'none'
                      } : {}}
                      initial={{ opacity: 0, y: 50, rotateX: 90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + (globalIndex * 0.03),
                        ease: [0.23, 1, 0.32, 1]
                      }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </div>

              {/* Occasional technical annotations for words */}
              {wordIndex === 1 && (
                <svg
                  className="absolute -left-6 top-full mt-2 hidden md:block"
                  width="80" height="40"
                  viewBox="0 0 80 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.line
                    x1="0" y1="0" x2="40" y2="40"
                    stroke={accentColors?.secondary || "var(--color-accent-oceanic)"}
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                  <motion.circle
                    cx="42" cy="40" r="3"
                    fill="none"
                    stroke={accentColors?.primary || "var(--color-accent-oceanic)"}
                    strokeWidth="1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.5 }}
                  />
                </svg>
              )}

              {wordIndex === 2 && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 -top-5 text-[8px] font-mono accent-warm hidden md:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                >
                  VARIANT_B.04
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technical accent lines */}
      <motion.div
        className="absolute -bottom-6 left-[15%] right-20 flex justify-between items-center h-px"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <div
          className="h-px w-[80%]"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColors?.secondary || "var(--color-accent-oceanic)"}, transparent)`
          }}
        ></div>
        <div
          className="h-3 w-3 border rotate-45"
          style={{ borderColor: accentColors?.primary || "var(--color-accent-oceanic)" }}
        ></div>
      </motion.div>
    </div>
  );
};

export default HomeHeroHeadline;
