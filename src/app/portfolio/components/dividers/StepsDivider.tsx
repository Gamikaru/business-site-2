"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/classNames";
import { useAnimationPreferences } from "@/components/core/Animations";
import { BlueprintCorner } from "@/components/common/VisualInterest/BlueprintCorner";

interface StepsDividerProps {
  className?: string;
  height?: number;
  color?: string;
  accentColor?: string;
  stepsCount?: number;
  showMeasurements?: boolean;
}

const StepsDivider: React.FC<StepsDividerProps> = ({
  className,
  height = 120,
  color,
  accentColor,
  stepsCount = 6,
  showMeasurements = true,
}) => {
  const { shouldAnimate } = useAnimationPreferences();
  const dividerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(dividerRef, { once: false, margin: "-10% 0px" });
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [dataFlowActive, setDataFlowActive] = useState(false);
  const [uniqueId] = useState(`steps-${Math.floor(Math.random() * 10000)}`);

  // Use color props or fallback to CSS variables
  const stepColor = color || "var(--color-bg-primary)";
  const stepAccentColor = accentColor || "var(--color-brand-primary)";

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: dividerRef,
    offset: ["start end", "end start"],
  });

  const pathOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);

  // Generate steps data with randomized heights
  const generateSteps = () => {
    const steps = [];
    const sectionWidth = 1200 / stepsCount;

    for (let i = 0; i < stepsCount; i++) {
      // Create randomized but visually pleasing step pattern
      // For the final step, ensure it connects properly to the end
      const isLastStep = i === stepsCount - 1;

      // Generate height variation between steps
      // Each step position can vary by up to 15px from the previous one
      const prevY = i > 0 ? steps[i-1].y : 0;
      const maxChange = 20;
      let y = prevY;

      // Ensure steps have visual variation but don't go too extreme
      if (i > 0) {
        // Determine if this step should go up or down from previous
        const direction = i % 2 === 0 ? 1 : -1;
        // Apply direction with some randomness but controlled range
        y = prevY + (direction * (5 + Math.floor(Math.random() * maxChange)));
      }

      // Keep y values within reasonable bounds (10-70px)
      y = Math.max(10, Math.min(70, y));

      // If it's the last step, make it go to 40px to match the original
      if (isLastStep) {
        y = 40;
      }

      steps.push({
        x: i * sectionWidth,
        y: y,
        width: isLastStep ? sectionWidth : sectionWidth * 0.9,
      });
    }

    return steps;
  };

  const steps = generateSteps();

  // Generate path strings from steps data
  const generateStepsPath = () => {
    let path = `M0,${height} L0,0 `;
    steps.forEach((step) => {
      path += `L${step.x},${step.y} L${step.x + step.width},${step.y} `;
    });
    path += `L1200,40 L1200,${height} Z`;
    return path;
  };

  const generateStepsOutline = () => {
    let path = "M0,0 ";
    steps.forEach((step) => {
      path += `L${step.x},${step.y} L${step.x + step.width},${step.y} `;
    });
    path += "L1200,40";
    return path;
  };

  const stepsPath = generateStepsPath();
  const stepsOutline = generateStepsOutline();

  // Calculate data flow path along the stairs
  const getDataFlowPath = () => {
    let path = "M0,5 ";
    steps.forEach((step) => {
      path += `L${step.x + 5},${step.y + 5} L${step.x + step.width - 5},${step.y + 5} `;
    });
    path += "L1200,45";
    return path;
  };

  const dataFlowPath = getDataFlowPath();

  // Add periodic animations for data flow and active steps
  useEffect(() => {
    if (!shouldAnimate() || !isInView) return;

    // Periodically trigger data flow animation
    const dataFlowInterval = setInterval(() => {
      setDataFlowActive(true);
      setTimeout(() => setDataFlowActive(false), 2000);
    }, 5000);

    // Periodically highlight different steps
    const stepHighlightInterval = setInterval(() => {
      const randomStep = Math.floor(Math.random() * steps.length);
      setActiveStepIndex(randomStep);

      setTimeout(() => {
        setActiveStepIndex(null);
      }, 2000);
    }, 3000);

    return () => {
      clearInterval(dataFlowInterval);
      clearInterval(stepHighlightInterval);
    };
  }, [shouldAnimate, isInView, steps.length]);

  return (
    <div
      ref={dividerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      {/* SVG definitions */}
      <svg width="0" height="0">
        <defs>
          {/* Gradient for data flow */}
          <linearGradient id={`${uniqueId}-data-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stepAccentColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--color-accent-oceanic)" stopOpacity="0.9" />
            <stop offset="100%" stopColor={stepAccentColor} stopOpacity="0.8" />
          </linearGradient>

          {/* Glow filter for active elements */}
          <filter id={`${uniqueId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-[0.05]" />

      {/* Blueprint corners */}
      <div className="absolute top-0 left-0 text-brand-primary/30 pointer-events-none">
        <BlueprintCorner size={24} />
      </div>
      <div className="absolute top-0 right-0 rotate-90 text-brand-primary/30 pointer-events-none">
        <BlueprintCorner size={24} />
      </div>

      {/* Main SVG for steps */}
      <svg
        className="absolute w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Steps fill path */}
        <motion.path
          d={stepsPath}
          fill={stepColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Steps outline */}
        <motion.path
          d={stepsOutline}
          stroke={stepAccentColor}
          strokeWidth="2"
          fill="none"
          style={{ opacity: pathOpacity }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isInView ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Vertical grid lines */}
        {steps.map((step, i) => (
          <motion.line
            key={`grid-${i}`}
            x1={step.x}
            y1="0"
            x2={step.x}
            y2={height}
            stroke={stepAccentColor}
            strokeWidth="1"
            strokeDasharray="4,4"
            strokeOpacity="0.2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 0.2 : 0 }}
            transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
          />
        ))}

        {/* Horizontal measurement line at bottom */}
        <motion.line
          x1="0"
          y1={height - 10}
          x2="1200"
          y2={height - 10}
          stroke={stepAccentColor}
          strokeWidth="1"
          strokeOpacity="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView && showMeasurements ? 0.3 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        />

        {/* Step corners with measurement text */}
        {steps.map((step, i) => {
          const isActive = activeStepIndex === i;

          return (
            <React.Fragment key={`step-${i}`}>
              {/* Starting corner marker */}
              <motion.g>
                <motion.circle
                  cx={step.x}
                  cy={step.y}
                  r="4"
                  fill={isActive ? "var(--color-accent-cosmic)" : stepAccentColor}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: isInView ? 1 : 0,
                    scale: isInView ? (isActive ? [1, 1.5, 1] : 1) : 0,
                    filter: isActive ? `url(#${uniqueId}-glow)` : 'none'
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.5 + i * 0.1,
                    scale: isActive ? { duration: 0.8, repeat: 1, repeatType: "reverse" } : {}
                  }}
                />

                {/* Vertical measurement line */}
                {showMeasurements && (
                  <>
                    <motion.line
                      x1={step.x}
                      y1={step.y}
                      x2={step.x}
                      y2={height - 10}
                      stroke={stepAccentColor}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      strokeOpacity="0.3"
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: isInView ? 0.3 : 0, scaleY: isInView ? 1 : 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                      style={{ transformOrigin: `${step.x}px ${step.y}px` }}
                    />

                    {/* Position text */}
                    <motion.text
                      x={step.x}
                      y={height - 15}
                      fontSize="8"
                      fontFamily="monospace"
                      fill={stepAccentColor}
                      textAnchor="middle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isInView ? 0.7 : 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                    >
                      {Math.round(step.x)}
                    </motion.text>
                  </>
                )}
              </motion.g>

              {/* Ending corner marker */}
              <motion.circle
                cx={step.x + step.width}
                cy={step.y}
                r="4"
                fill={isActive ? "var(--color-accent-cosmic)" : stepAccentColor}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isInView ? 1 : 0,
                  scale: isInView ? (isActive ? [1, 1.5, 1] : 1) : 0,
                  filter: isActive ? `url(#${uniqueId}-glow)` : 'none'
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.5 + i * 0.1 + 0.05,
                  scale: isActive ? { duration: 0.8, repeat: 1, repeatType: "reverse" } : {}
                }}
              />

              {/* Height measurement text */}
              {showMeasurements && (
                <motion.text
                  x={step.x + step.width / 2}
                  y={step.y - 6}
                  fontSize="8"
                  fontFamily="monospace"
                  fill={stepAccentColor}
                  textAnchor="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isInView ? 0.7 : 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                >
                  {step.y}px
                </motion.text>
              )}
            </React.Fragment>
          );
        })}

        {/* Data flow animation */}
        {shouldAnimate() && (
          <>
            {/* Base static data path */}
            <motion.path
              d={dataFlowPath}
              stroke={stepAccentColor}
              strokeWidth="1.5"
              strokeDasharray="2,6"
              strokeOpacity="0.3"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 0.3 : 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />

            {/* Animated data flow particle */}
            <AnimatePresence>
              {dataFlowActive && (
                <motion.circle
                  r="4"
                  fill={`url(#${uniqueId}-data-gradient)`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    offsetDistance: ["0%", "100%"],
                  }}
                  exit={{ opacity: 0 }}
                  style={{
                    offsetPath: `path("${dataFlowPath}")`,
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeOut"
                  }}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </svg>

      {/* Technical metadata readout */}
      {showMeasurements && (
        <>
          <motion.div
            className="absolute bottom-1 left-2 text-[8px] font-mono text-brand-primary/60 flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 0.8 : 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <div className={cn(
              "h-1 w-1 rounded-full",
              dataFlowActive ? "bg-accent-cosmic animate-pulse" : "bg-brand-primary/60"
            )} />
            <span>STEPS:{stepsCount}</span>
          </motion.div>

          <motion.div
            className="absolute bottom-1 right-2 text-[8px] font-mono text-brand-primary/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 0.8 : 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            WIDTH:1200px
          </motion.div>
        </>
      )}
    </div>
  );
};

export default StepsDivider;