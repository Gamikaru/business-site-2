import React, { useRef } from "react";
import { motion, useTransform, useInView } from "framer-motion";
import {
  ScrollReveal,
  TextReveal,
} from "@/components/core/Animations";
import { Heading, Text } from "@/components/common/Typography";

interface HomeBlogHeaderProps {
  heading: string;
  introduction: string;
  scrollYProgress: any;
  techData: {
    gridDensity: number;
    renderQuality: number;
    frameRate: number;
    signalStrength: number;
    nodeCount: number;
  };
}

const HomeBlogHeader: React.FC<HomeBlogHeaderProps> = ({
  heading,
  introduction,
  scrollYProgress,
  techData,
}) => {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: false, margin: "-10% 0px" });
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-5%"]);

  return (
    <motion.div
      ref={headingRef}
      className="max-w-3xl mx-auto mb-16 md:mb-24 relative"
      style={{ y: contentY }}
    >
      {/* Technical frame markers */}
      <motion.div
        className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-accent-oceanic hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHeadingInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono">SECTION.BLOG</span>
          <span className="inline-block w-2 h-2 bg-accent-oceanic animate-pulse"></span>
        </div>
      </motion.div>

      {/* Technical measurement guides */}
      <div className="absolute -left-10 top-0 bottom-0 hidden lg:flex flex-col justify-between py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`measure-left-${i}`}
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHeadingInView ? 1 : 0, x: isHeadingInView ? 0 : -10 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
          >
            <div className="w-6 h-px bg-accent-oceanic"></div>
            <span className="text-[10px] font-mono text-accent-oceanic ml-1">
              {(i * 50).toString().padStart(3, '0')}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="absolute -right-10 top-0 bottom-0 hidden lg:flex flex-col justify-between py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`measure-right-${i}`}
            className="flex items-center"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isHeadingInView ? 1 : 0, x: isHeadingInView ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
          >
            <span className="text-[10px] font-mono text-accent-oceanic mr-1">
              {(i * 50).toString().padStart(3, '0')}
            </span>
            <div className="w-6 h-px bg-accent-oceanic"></div>
          </motion.div>
        ))}
      </div>

      {/* Heading with animated text reveal */}
      <div className="text-center relative mb-6">
        <TextReveal
          direction="up"
          splitBy="chars"
          staggerChildren={true}
          delay={0.2}
        >
          <Heading
            level={2}
            className="text-[clamp(1.8rem,3.2vw+1rem,2.4rem)] font-heading font-bold text-heading uppercase inline-block relative"
          >
            {heading}
          </Heading>
        </TextReveal>

        {/* Animated underline */}
        <motion.div
          className="h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent mx-auto mt-4"
          initial={{ width: 0 }}
          animate={{ width: isHeadingInView ? 120 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>

      {/* Introduction text with technical framing */}
      <div className="relative">
        <ScrollReveal
          direction="up"
          delay={0.3}
          className="text-center relative z-10"
        >
          <Text size="xl" className="text-text-secondary">
            {introduction}
          </Text>
        </ScrollReveal>

        {/* Background data pattern */}
        <motion.div
          className="absolute -inset-4 -z-10 opacity-[0.04] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHeadingInView ? 0.04 : 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="h-full w-full bg-circuit"></div>
        </motion.div>

        {/* Technical data points */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHeadingInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="relative h-px w-full">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`datapoint-${i}`}
                className="data-point absolute bottom-0 w-1 h-1 rounded-full bg-brand-primary transition-transform duration-300"
                style={{ left: `${(i + 1) * 20 - 10}%`, transform: 'scale(1)' }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Technical system status displays */}
      <motion.div
        className="absolute -right-4 -bottom-8 text-[10px] font-mono text-accent-oceanic hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHeadingInView ? 0.8 : 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {`DENSITY:${techData.gridDensity} | QUAL:${techData.renderQuality}`}
      </motion.div>
    </motion.div>
  );
};

export default HomeBlogHeader;
