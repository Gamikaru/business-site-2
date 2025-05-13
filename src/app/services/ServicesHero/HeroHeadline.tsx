import React, { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/classNames";
import { Heading } from "@/components/common/Typography/Heading";

interface HeroHeadlineProps {
  headline: string;
  activeHighlight: boolean;
  className?: string;
}

const HeroHeadline: React.FC<HeroHeadlineProps> = ({
  headline,
  activeHighlight,
  className,
}) => {
  const headlineRef = useRef<HTMLDivElement>(null);
  // Split headline by newlines for multi-line support
  const headlineChunks = useMemo(
    () => headline.split("\n"),
    [headline]
  );

  return (
    <motion.div
      className={cn(
        "w-full", // Take full width
        className
      )}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col items-start">
        <div ref={headlineRef} className="relative">
          <Heading
            level={1}
            className="text-[clamp(3rem,10vw,6.5rem)] font-bold leading-[0.92] tracking-tight" // Increased size
          >
            <div className="flex flex-col items-start">
              {headlineChunks.map((chunk, index) =>
                index < headlineChunks.length - 1 ? (
                  // Render intermediate lines as rich HTML
                  <span
                    key={index}
                    className="block mb-1 md:mb-3" // Increased spacing
                    dangerouslySetInnerHTML={{ __html: chunk }}
                  />
                ) : (
                  <div key={index} className="relative inline-block mt-3 md:mt-5"> {/* Increased margin */}
                    {/* Richly formatted last line */}
                    <span
                      className="relative z-10"
                      dangerouslySetInnerHTML={{ __html: chunk }}
                    />
                    <motion.div
                      className="absolute bottom-[5%] left-0 h-[35%] w-full" // Slightly higher highlight
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeHighlight ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                      style={{
                        originX: 0,
                        background:
                          "var(--color-accent-secondary, var(--color-accent-tertiary, var(--color-accent-primary)))",
                        opacity: 0.28,
                        borderRadius: "0.25rem",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </Heading>
          <motion.div
            className="absolute -left-8 top-0 h-full w-2 bg-accent-oceanic opacity-80" // Wider line
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ originY: 0 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HeroHeadline;
