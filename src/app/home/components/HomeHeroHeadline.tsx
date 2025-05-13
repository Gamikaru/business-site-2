import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/classNames";

interface HomeHeroHeadlineProps {
  headline: string;
  glitchActive: boolean;
  intensiveGlitch: boolean;
  glitchOffsets: number[];
}

const HomeHeroHeadline: React.FC<HomeHeroHeadlineProps> = ({
  headline,
  glitchActive,
  intensiveGlitch,
  glitchOffsets,
}) => {
  // Split headline into individual characters for extreme animation control
  const characters = headline.split('');
  const words = headline.split(' ');

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
        {/* Animated position markers */}
        <div className="hidden md:flex absolute -top-8 right-0 space-x-1 font-mono text-[10px] text-accent-oceanic">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`marker-${i}`}
              className="w-5 flex flex-col items-center"
            >
              <div className="h-2 w-px bg-accent-oceanic"></div>
              <span>{(i+1) * 10}</span>
            </div>
          ))}
        </div>

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
                        wordIndex % 2 === 0 ? "text-white" : "text-brand-primary",
                        // Add different styles to some characters based on position
                        globalIndex % 7 === 0 && "text-accent-oceanic",
                        globalIndex % 9 === 0 && "italic",
                        glitchActive && globalIndex % 5 === 0 && "translate-y-[5px]",
                        glitchActive && globalIndex % 3 === 0 && "-rotate-3",
                        glitchActive && globalIndex % 4 === 0 && "rotate-3 translate-x-[3px]",
                        intensiveGlitch && globalIndex % 2 === 0 && "opacity-0"
                      )}
                      style={glitchActive ? {
                        transform: `translate3d(${glitchOffsets[globalIndex] || 0}px, ${glitchOffsets[globalIndex + 1] || 0}px, 0)`,
                        filter: globalIndex % 6 === 0 ? 'brightness(2)' : 'none',
                        textShadow: globalIndex % 5 === 0 ? '0 0 5px var(--color-brand-primary)' : 'none'
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
                    stroke="var(--color-accent-oceanic)"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                  <motion.circle
                    cx="42" cy="40" r="3"
                    fill="none"
                    stroke="var(--color-accent-oceanic)"
                    strokeWidth="1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.5 }}
                  />
                </svg>
              )}

              {wordIndex === 2 && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 -top-5 text-[8px] font-mono text-accent-cosmic hidden md:block"
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
        <div className="h-px w-[80%] bg-gradient-to-r from-transparent via-accent-oceanic to-transparent"></div>
        <div className="h-3 w-3 border border-accent-oceanic rotate-45"></div>
      </motion.div>
    </div>
  );
};

export default HomeHeroHeadline;
