"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { useAnimationPreferences } from "../hooks/useAnimationPreferences";

interface TextRevealProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
  splitBy?: "words" | "chars" | "none";
  direction?: "up" | "down";
  className?: string;
  as?: React.ElementType;
  onAnimationComplete?: () => void;
  once?: boolean; // Add option to control if animation happens only once
}

const TextReveal: React.FC<TextRevealProps> = ({
  children,
  delay = 0,
  duration,
  staggerChildren = false,
  staggerDelay = 0.02,
  splitBy = "none",
  direction = "up",
  className = "",
  as = "div",
  onAnimationComplete,
  once = true, // Default to true to prevent disappearing
  ...motionProps
}) => {
  const { shouldAnimate, getTransitionSettings, getIntensity } =
    useAnimationPreferences();
  const Component = as;
  const [hasAnimated, setHasAnimated] = useState(false);

  // Get transition settings
  const { duration: calculatedDuration, ease } = getTransitionSettings(
    "default",
    duration
  );

  // Apply intensity to stagger delay
  const effectiveStaggerDelay = staggerDelay * (1 / getIntensity());

  // If animations are disabled, just render children
  if (!shouldAnimate()) {
    return <Component className={className}>{children}</Component>;
  }

  // If already animated and once is true, show the final state
  if (once && hasAnimated) {
    return <Component className={className}>{children}</Component>;
  }

  // Helper for splitting text
  const splitText = (text: string): ReactNode[] => {
    if (splitBy === "chars") {
      return text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </motion.span>
      ));
    } else if (splitBy === "words") {
      return text.split(/\s+/).map((word, index, array) => (
        <motion.span
          key={index}
          variants={itemVariants}
          style={{ display: "inline-block" }}
        >
          {word}
          {index !== array.length - 1 ? " " : ""}
        </motion.span>
      ));
    }

    return [text];
  };

  // Direction-based variants
  const containerVariants: Variants = {
    hidden: { opacity: staggerChildren ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren ? effectiveStaggerDelay : 0,
        delayChildren: delay,
        duration: calculatedDuration,
        ease,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 20 : -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: staggerChildren
          ? calculatedDuration * 0.8
          : calculatedDuration,
        ease,
      },
    },
  };

  // Process children based on type
  const processChildren = (child: ReactNode): ReactNode => {
    if (
      typeof child === "string" &&
      (splitBy === "words" || splitBy === "chars")
    ) {
      return splitText(child);
    }

    if (React.isValidElement(child)) {
      // Type guards for motion components
      const typeObj = child.type as { name?: string; displayName?: string; render?: unknown };
      const isMotionComponent =
        typeof child.type === "object" &&
        "render" in child.type &&
        (
          (typeof typeObj.name === "string" && typeObj.name.startsWith("motion")) ||
          (typeof typeObj.displayName === "string" && typeObj.displayName.startsWith("motion"))
        );

      return React.cloneElement(
        child as React.ReactElement<Record<string, unknown>>,
        {
          ...(isMotionComponent && staggerChildren ? { variants: itemVariants } : {}),
          children: React.Children.map(
            (child.props as { children?: ReactNode }).children,
            processChildren
          ),
        }
      );
    }

    return child;
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => {
        if (onAnimationComplete) onAnimationComplete();
        setHasAnimated(true);
      }}
      {...motionProps}
    >
      <Component>
        {staggerChildren
          ? React.Children.map(children, processChildren)
          : children}
      </Component>
    </motion.div>
  );
};

export default TextReveal;
