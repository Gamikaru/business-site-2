// src/components/HomeHeroCTA.tsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HomeHeroCTAProps {
  ctaText: string;
  ctaLink: string;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm: string;
    contrast: string;
    oceanic: string;
    cosmic: string;
    brand: string;
  };
  as?: "a" | "button"; // Add element type prop
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>; // Optional button props
}

export const HomeHeroCTA: React.FC<HomeHeroCTAProps> = ({
  ctaText,
  ctaLink,
  accentColors,
  as = "a", // Default to anchor
  buttonProps
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Common props shared between button and anchor
  const commonMotionProps = {
    className: "block relative px-8 py-4 font-medium text-lg rounded-md overflow-hidden",
    initial: { boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" },
    animate: {
      boxShadow: isHovered
        ? "0 8px 30px rgba(0, 0, 0, 0.18)"
        : "0 4px 20px rgba(0, 0, 0, 0.1)"
    },
    style: {
      clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)",
      backgroundColor: "var(--color-accent-primary)",
      color: "var(--color-text-on-accent)"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="relative"
    >
      <div className="relative">
        {/* Button glow effect that grows and intensifies on hover */}
        <motion.div
          className="absolute rounded-full blur-xl"
          initial={{ opacity: 0, inset: "-10%" }}
          animate={{
            opacity: isHovered ? 0.6 : 0.2,
            inset: isHovered ? "-15%" : "-10%",
            filter: `blur(${isHovered ? 24 : 16}px)`
          }}
          transition={{ duration: 0.6 }}
          style={{
            background: `radial-gradient(circle, ${accentColors.brand} 0%, ${accentColors.secondary} 70%, transparent 100%)`,
          }}
        />

        {/* Decorative corner accent */}
        <motion.div
          className="absolute -left-6 -top-6 w-12 h-12 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <motion.path
              d="M46,46 C18,46 2,30 2,2"
              stroke={accentColors.primary}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 1.5 }}
            />
            <motion.circle
              cx="2" cy="2" r="2"
              fill={accentColors.primary}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.7, duration: 0.3 }}
            />
          </svg>
        </motion.div>

        {/* Main button container */}
        <motion.div
          className="relative z-10"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {/* Main button */}
          <motion.a
            href={ctaLink}
            className="group flex items-center justify-between px-8 py-4 rounded-full relative overflow-hidden"
            style={{
              backgroundColor: "rgba(0,0,0,0.01)", // Nearly transparent base
              WebkitBackdropFilter: "blur(8px)",
              backdropFilter: "blur(8px)"
            }}
          >
            {/* Double border effect - outer */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid ${accentColors.primary}`,
                opacity: 0.5
              }}
              animate={{
                scale: isHovered ? 1 : 0.97,
                opacity: isHovered ? 0.8 : 0.5
              }}
              transition={{ duration: 0.4 }}
            />

            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden"
              animate={{
                scale: isHovered ? 1 : 0.95,
                opacity: isHovered ? 1 : 0.9
              }}
            >
              <motion.div
                className="absolute inset-0 w-[200%] h-full"
                style={{
                  background: `linear-gradient(90deg,
                    ${accentColors.brand},
                    ${accentColors.secondary},
                    ${accentColors.warm},
                    ${accentColors.brand}
                  )`,
                  backgroundSize: "200% 100%"
                }}
                animate={{
                  x: isHovered ? "-50%" : "0%"
                }}
                transition={{
                  duration: isHovered ? 3 : 0.6,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Inner border with animated dash effect */}
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                border: "1px dashed rgba(255,255,255,0.3)",
                margin: "2px",
                opacity: 0.8
              }}
              animate={{
                rotate: isHovered ? 360 : 0
              }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity
              }}
            />

            {/* Overlay to ensure text readability */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(0,0,0,0.2)"
              }}
              animate={{
                opacity: isHovered ? 0.3 : 0.2
              }}
            />

            {/* Content container */}
            <div className="relative flex items-center justify-between w-full">
              {/* Text wrapper */}
              <motion.span
                className="text-white font-medium text-lg tracking-wide z-10 pl-2"
                animate={{
                  x: isHovered ? -5 : 0,
                  textShadow: isHovered ? "0 0 10px rgba(255,255,255,0.5)" : "none"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {ctaText}
              </motion.span>

              {/* Arrow icon with animated circles */}
              <motion.div className="relative">
                {/* Pulsing circles behind arrow */}
                <AnimatePresence>
                  {isHovered && (
                    <>
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={`pulse-${i}`}
                          className="absolute inset-0 rounded-full"
                          initial={{
                            scale: 0.5,
                            opacity: 0.8,
                          }}
                          animate={{
                            scale: 1.5 + (i * 0.5),
                            opacity: 0
                          }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.2,
                            repeat: Infinity,
                            repeatDelay: 0.5
                          }}
                          style={{
                            border: "1px solid white",
                            opacity: 0.6
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* Arrow with sophisticated animation */}
                <motion.div
                  className="relative z-10 w-10 h-10 flex items-center justify-center"
                  animate={{
                    x: isHovered ? 5 : 0,
                    backgroundColor: isHovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0)",
                    borderRadius: "9999px",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0.6, pathOffset: 0 }}
                      animate={{
                        pathLength: isHovered ? 1 : 0.6,
                        pathOffset: isHovered ? 0 : 0,
                        strokeWidth: isHovered ? 2.5 : 2
                      }}
                      style={{
                        filter: isHovered ? "drop-shadow(0 0 3px rgba(255,255,255,0.7))" : "none"
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </div>
          </motion.a>
        </motion.div>

        {/* Interactive dots trail that follows the button */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div
                  key={`dot-${i}`}
                  className="w-1.5 h-1.5 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 1, 0],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: "loop",
                    times: [0, 0.2, 0.8, 1]
                  }}
                  style={{
                    backgroundColor: i % 2 === 0
                      ? accentColors.primary
                      : accentColors.secondary
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Extract button inner content to a separate component for reuse
const ButtonInnerContent: React.FC<{ isHovered: boolean; ctaText: string }> = ({ isHovered, ctaText }) => (
  // ...existing code...
);

// HomeCTA component
interface HomeCTAProps {
  heading: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  availability?: string;
  newsletter?: {
    title?: string;
    placeholder?: string;
    buttonText?: string;
    // Add any other newsletter properties that might be used
  };
}

const HomeCTA: React.FC<HomeCTAProps> = ({
  heading,
  content,
  ctaText,
  ctaLink,
  availability,
  newsletter
}) => {
  return (
    <section className="py-16 bg-bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">{heading}</h2>
          <p className="mb-8 text-lg">{content}</p>

          {availability && (
            <p className="text-accent-primary mb-8">{availability}</p>
          )}

          <div className="mb-8">
            <HomeHeroCTA
              ctaText={ctaText}
              ctaLink={ctaLink}
              accentColors={{
                primary: 'var(--color-accent-primary)',
                secondary: 'var(--color-accent-secondary)',
                tertiary: 'var(--color-accent-tertiary)',
                warm: 'var(--color-accent-warm)',
                contrast: 'var(--color-contrast)',
                oceanic: 'var(--color-accent-oceanic)',
                cosmic: 'var(--color-accent-cosmic)',
                brand: 'var(--color-brand-primary)'
              }}
            />
          </div>

          {newsletter && (
            <div className="mt-12 p-6 bg-bg-card rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">{newsletter.title}</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder={newsletter.placeholder}
                  className="flex-grow px-4 py-2 rounded-lg border border-border"
                />
                <button className="px-6 py-2 bg-accent-secondary text-white rounded-lg">
                  {newsletter.buttonText}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;