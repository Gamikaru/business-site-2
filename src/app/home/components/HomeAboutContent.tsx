import React from "react";
import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/components/core/Animations";
import { Button } from "@/components/common/Button";
import { Heading } from "@/components/common/Typography";

interface HomeAboutContentProps {
  heading: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  isHeadingInView: boolean;
  techValues: {
    sectionRatio: number;
  };
  mousePosition: {
    x: number;
    y: number;
  };
}

const HomeAboutContent: React.FC<HomeAboutContentProps> = ({
  heading,
  content,
  ctaText,
  ctaLink,
  isHeadingInView,
  techValues,
  mousePosition,
}) => {
  // Format the content to handle paragraphs
  const paragraphs = content.split("\n\n").filter((p) => p.trim() !== "");

  return (
    <>
      {/* Technical measurement line at top */}
      <motion.div
        className="absolute -top-6 left-0 right-0 flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHeadingInView ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex-1 h-px bg-accent-oceanic/50"></div>
        <div className="px-4 text-[10px] font-mono text-accent-oceanic tracking-wider">
          PROFILE_SECTION/{techValues.sectionRatio}
        </div>
        <div className="flex-1 h-px bg-accent-oceanic/50"></div>
      </motion.div>

      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate={isHeadingInView ? "visible" : "hidden"}
        className="relative z-10"
      >
        {/* Enhanced heading with blueprint styling */}
        <motion.div
          variants={staggerItemVariants}
          className="mb-6 relative"
        >
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-8 bg-brand-primary"></div>
          <Heading
            level={2}
            className="text-[clamp(1.8rem,3.2vw+1rem,2.4rem)] font-heading font-bold text-heading"
          >
            <span className="relative">
              {heading}
              <motion.div
                className="absolute -bottom-2 left-0 h-[3px] bg-brand-primary"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </Heading>
        </motion.div>

        {/* Enhanced content paragraphs */}
        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <motion.div
              key={index}
              variants={staggerItemVariants}
              className="relative bg-bg-primary/60 backdrop-blur-sm rounded p-4 border-l-2 border-brand-primary/70"
            >
              <p className="text-base md:text-lg text-text-primary leading-relaxed">{paragraph}</p>

              {/* Add decorative elements to first paragraph */}
              {index === 0 && (
                <div className="absolute -right-2 -top-2 w-6 h-6">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                      d="M2 22L22 2M12 2V6M6 2H2V6M22 18V22H18M22 12H18M2 12H6M12 22V18"
                      stroke="var(--color-brand-primary)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA button with technical styling */}
        <motion.div
          variants={staggerItemVariants}
          className="mt-8 relative"
        >
          <div className="relative group">
            <Button
              intent="primary"
              href={ctaLink}
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 1L15 8L8 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 8H1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              iconPosition="right"
              className="relative z-10"
            >
              {ctaText}
            </Button>

            {/* Button animation effects */}
            <motion.div
              className="absolute inset-0 bg-accent-oceanic rounded opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              animate={{
                boxShadow: ["0 0 0px rgba(var(--color-accent-oceanic-rgb), 0)", "0 0 15px rgba(var(--color-accent-oceanic-rgb), 0.5)", "0 0 0px rgba(var(--color-accent-oceanic-rgb), 0)"]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity
              }}
            />
          </div>

          {/* Technical coordinates */}
          <div className="absolute -right-5 -bottom-5 text-xs font-mono text-accent-oceanic opacity-80">
            {Math.round(mousePosition.x * 100)}/{Math.round(mousePosition.y * 100)}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default HomeAboutContent;
