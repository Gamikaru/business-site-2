// HeroContent.tsx
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/classNames";
import RichText from "@/components/common/Typography/RichText";
import { Button } from "@/components/common/Button";

interface HeroContentProps {
  introduction: string;
  techData: {
    nodes: Array<{ id: number; label: string }>;
  };
  className?: string;
  isMobile?: boolean;
}

const HeroContent: React.FC<HeroContentProps> = ({
  introduction,
  techData,
  className,
  isMobile = false,
}) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col justify-center",
        className
      )}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {/* Enhanced intro text with more dramatic styling for overlay */}
      <div className="relative bg-bg-glass p-6 md:p-8 rounded-lg backdrop-blur-md shadow-lg border border-divider">
        <div className="md:text-xl lg:text-2xl leading-relaxed text-text-secondary max-w-prose">
          <RichText content={introduction} />
        </div>
        {/* Enhanced decorative elements */}
        <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-accent-oceanic opacity-70"></div>
        <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-accent-oceanic opacity-70"></div>

        {/* Enhanced CTA button moved inside the glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="relative mt-8"
        >
          <Button
            intent="gradient"
            size="lg"
            href="#services"
            className="relative group w-full md:w-auto"
          >
            <span className="font-medium tracking-wide flex items-center">
              Explore Services
              <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {!isMobile && (
              <motion.div
                className="absolute -bottom-2 -right-2 h-6 w-6 border-r-2 border-b-2 border-brand-primary opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{
                  x: [0, 5, 0],
                  y: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroContent;