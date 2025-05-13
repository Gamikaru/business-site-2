import React, { useRef } from "react";
import { motion, useTransform } from "framer-motion"; // Added useTransform import here
import { TextReveal } from "@/components/core/Animations";
import { Heading, Text } from "@/components/common/Typography";
import RichText from "@/components/common/Typography/RichText";
import Image from "next/image";

interface BlogHeaderProps {
  headerContent: {
    title: string;
    subtitle: string;
    imageSrc: string;
    imageAlt: string;
  };
  mousePosition: { x: number; y: number };
  scrollYProgress: any;
  techData: {
    renderTime: number;
    density: number;
    nodes: number;
    viewportRatio: string;
    sectionIndex: number;
  };
}

const BlogHeader: React.FC<BlogHeaderProps> = ({
  headerContent,
  mousePosition,
  scrollYProgress,
  techData,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);

  const headerOpacity = useTransform(scrollYProgress,
    [0, 0.1],
    [1, 0]
  );

  const headerY = useTransform(scrollYProgress,
    [0, 0.1],
    [0, -50]
  );

  return (
    <motion.section
      ref={headerRef}
      className="relative bg-bg-tertiary overflow-hidden"
      style={{ opacity: headerOpacity, y: headerY }}
    >
      {/* Technical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Blueprint grid */}
        <motion.div
          className="absolute inset-0 bg-blueprint-grid"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.05, 0.1, 0.1, 0.05]) }}
        />

        {/* Circuit pattern */}
        <div className="absolute inset-0 bg-circuit opacity-[0.03]" />

        {/* Technical grid overlay */}
        <svg className="absolute inset-0 w-full h-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.line
              key={`grid-h-${i}`}
              x1="0"
              y1={`${(i + 1) * 20}%`}
              x2="100%"
              y2={`${(i + 1) * 20}%`}
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.15"
              strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.line
              key={`grid-v-${i}`}
              x1={`${(i + 1) * 20}%`}
              y1="0"
              x2={`${(i + 1) * 20}%`}
              y2="100%"
              stroke="var(--color-accent-oceanic)"
              strokeWidth="0.5"
              strokeOpacity="0.15"
              strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))}
        </svg>

        {/* Dynamic data flow line */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <motion.path
            d={`M0,${50 + mousePosition.y * 0.2} C${20 + mousePosition.x * 0.3},${30 + mousePosition.y * 0.4},${60 + mousePosition.x * 0.2},${70 - mousePosition.y * 0.3},100,${50 - mousePosition.y * 0.2}`}
            stroke="var(--color-brand-primary)"
            strokeWidth="1"
            strokeOpacity="0.1"
            fill="none"
            animate={{
              d: `M0,${50 + mousePosition.y * 0.2} C${20 + mousePosition.x * 0.3},${30 + mousePosition.y * 0.4},${60 + mousePosition.x * 0.2},${70 - mousePosition.y * 0.3},100,${50 - mousePosition.y * 0.2}`
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>

<div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          {/* Header content */}
          <div className="md:w-1/2 md:pr-8">
            {/* Section metadata */}
            <motion.div
              className="flex items-center mb-4 font-mono text-xs text-accent-oceanic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-px w-8 bg-accent-oceanic mr-2"></div>
              <span>SECT.{techData.sectionIndex.toString().padStart(2, '0')}/BLOG</span>
              <div className="ml-2 h-2 w-2 rounded-full bg-brand-primary animate-pulse"></div>
            </motion.div>

            {/* Main heading */}
            <TextReveal direction="up" delay={0.3} splitBy="words" staggerChildren={true}>
              <Heading level={1} className="text-[clamp(2.2rem,4vw,3.5rem)] font-heading font-bold">
                <RichText content={headerContent.title} />
              </Heading>
            </TextReveal>

            {/* Subtitle */}
            <motion.div
              className="mt-6 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Text size="xl" className="text-text-secondary">
                <RichText content={headerContent.subtitle} />
              </Text>
            </motion.div>

            {/* Technical measurement guides */}
            <motion.div
              className="absolute -bottom-4 left-4 md:left-8 right-4 md:right-8 hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.9 }}
            >
              <div className="relative h-px w-full bg-accent-oceanic/30">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`measure-${i}`}
                    className="absolute top-0 flex flex-col items-center"
                    style={{ left: `${i * 20}%` }}
                  >
                    <div className="h-2 w-px bg-accent-oceanic"></div>
                    <span className="text-[8px] font-mono text-accent-oceanic mt-1">
                      {(i * 20).toString().padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Header image with technical framing */}
          <div className="md:w-1/2 relative">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Technical frame */}
              <div className="absolute -inset-4 border border-dashed border-accent-oceanic/40 rounded-lg"></div>

              {/* Corner accents */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-accent-oceanic rounded-tl-md"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-accent-warm rounded-tr-md"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-accent-contrast rounded-bl-md"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-accent-oceanic rounded-br-md"></div>

              {/* Image with overlay effects */}
              <div className="relative rounded-lg overflow-hidden">
                <div className="aspect-video">
                  <Image
                    src={headerContent.imageSrc}
                    alt={headerContent.imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-bg-primary/80 via-transparent to-bg-primary/50"></div>

                {/* Scan line effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-10"
                  initial={{ y: "-100%" }}
                  animate={{ y: "200%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "linear"
                  }}
                ></motion.div>
              </div>

              {/* Technical readout */}
              <div className="absolute -bottom-3 -right-3 text-xs font-mono text-accent-oceanic">
                <span>{techData.viewportRatio}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Measurement markers at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 hidden md:block">
        <div className="h-full border-t border-accent-oceanic/10 relative">
          <div className="absolute -top-4 right-8 text-xs font-mono text-accent-oceanic/70">
            RENDER/{techData.renderTime}ms
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BlogHeader;
