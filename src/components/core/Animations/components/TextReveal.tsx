// src/components/core/Animations/components/TextReveal.tsx
"use client";

import React, {
  ReactNode,
  useState,
  useEffect,
  useMemo,
  memo,
  Fragment,
} from "react";
import { HTMLMotionProps, Variants, useAnimationControls } from "framer-motion";
import { useAnimationPreferences } from "../hooks/useAnimationPreferences";
import { animationManager } from "../utils/AnimationManager";
import { Motion } from "../providers/MotionProvider";

interface TextRevealProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
  splitBy?: "words" | "chars" | "none";
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  as?: React.ElementType;
  onAnimationComplete?: () => void;
  once?: boolean;
  threshold?: number;
  id?: string;
  maxNodes?: number;
  viewport?: {
    margin?: string;
    amount?: number | "some" | "all";
  };
  layout?: boolean | "position";
  layoutId?: string;
  transitionType?: "tween" | "spring";
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  preserveWhitespace?: boolean;
  fallbackInView?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

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
  once = true,
  threshold = 0.1,
  id: providedId,
  maxNodes = 300,
  viewport,
  layout = false,
  layoutId,
  transitionType = "tween",
  springConfig,
  preserveWhitespace = true,
  fallbackInView = true,
  ...motionProps
}) => {
  const { getTransitionSettings, getIntensity, shouldAnimate } =
    useAnimationPreferences();

  /* ------------------------------------------------------------------ */
  /*  IDs & animation controls                                          */
  /* ------------------------------------------------------------------ */
  const uniqueId = useMemo(
    () => providedId || `text-reveal-${Math.random().toString(36).slice(2, 9)}`,
    [providedId]
  );
  const controls = useAnimationControls();
  const [triggered, setTriggered] = useState(false);
  const [didFallback, setDidFallback] = useState(false);

  /* ------------------------------------------------------------------ */
  /*  Timing helpers                                                    */
  /* ------------------------------------------------------------------ */
  const { duration: calcDuration, ease } = getTransitionSettings(
    "default",
    duration
  );
  const effectiveStagger = staggerDelay * (1 / getIntensity());

  /* ------------------------------------------------------------------ */
  /*  Variants                                                          */
  /* ------------------------------------------------------------------ */
  const containerVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: staggerChildren ? 1 : 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerChildren ? effectiveStagger : 0,
          delayChildren: delay,
          duration: calcDuration,
          ease,
          when: "beforeChildren",
        },
      },
      exit: {
        opacity: 0,
        transition: {
          when: "afterChildren",
          duration: calcDuration * 0.7,
          ease,
        },
      },
    }),
    [staggerChildren, effectiveStagger, delay, calcDuration, ease]
  );

  const itemVariants: Variants = useMemo(() => {
    const base: Variants = {
      hidden: {
        opacity: 0,
        y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
        x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          type: transitionType,
          duration:
            transitionType === "tween"
              ? staggerChildren
                ? calcDuration * 0.8
                : calcDuration
              : undefined,
          ease: transitionType === "tween" ? ease : undefined,
          ...springConfig,
        },
      },
      exit: {
        opacity: 0,
        y: direction === "up" ? -10 : direction === "down" ? 10 : 0,
        x: direction === "left" ? -10 : direction === "right" ? 10 : 0,
        transition: {
          duration: calcDuration * 0.6,
          ease,
        },
      },
    };
    return base;
  }, [
    direction,
    staggerChildren,
    calcDuration,
    ease,
    transitionType,
    springConfig,
  ]);

  /* ------------------------------------------------------------------ */
  /*  Text splitting & node guards                                      */
  /* ------------------------------------------------------------------ */
  const splitText = (text: string): ReactNode[] => {
    let nodes = 0;
    const pushNode = (n: ReactNode) => {
      nodes += 1;
      if (maxNodes && nodes > maxNodes) {
        if (!didFallback) setDidFallback(true);
        return n; // raw text (no Motion span)
      }
      return n;
    };

    if (splitBy === "chars") {
      return text.split("").map((char, i) =>
        pushNode(
          <Motion.span
            key={i}
            variants={itemVariants}
            style={{
              display: "inline-block",
              whiteSpace: preserveWhitespace && char === " " ? "pre" : "normal",
            }}
          >
            {char}
          </Motion.span>
        )
      );
    }

    if (splitBy === "words") {
      return text.split(/(\s+)/).map((chunk, i) => {
        const isWS = /^\s+$/.test(chunk);
        if (isWS && preserveWhitespace) {
          return pushNode(
            <Motion.span
              key={i}
              variants={itemVariants}
              style={{ whiteSpace: "pre" }}
            >
              {chunk}
            </Motion.span>
          );
        }
        return pushNode(
          isWS ? (
            chunk
          ) : (
            <Motion.span
              key={i}
              variants={itemVariants}
              style={{ display: "inline-block" }}
            >
              {chunk}
            </Motion.span>
          )
        );
      });
    }

    return [text];
  };

  const processNode = (node: ReactNode): ReactNode => {
    if (typeof node === "string" && splitBy !== "none") return splitText(node);

    if (React.isValidElement(node)) {
      const maybeMotion =
        typeof node.type === "object" &&
        "render" in node.type &&
        ((node.type as any).name?.startsWith("motion") ||
          (node.type as any).displayName?.startsWith("motion"));

      return React.cloneElement(
        node,
        {
          ...(maybeMotion && staggerChildren ? { variants: itemVariants } : {}),
        } as React.HTMLAttributes<unknown>,
        React.Children.map(node.props.children, processNode)
      );
    }
    return node;
  };

  const processedChildren = useMemo(
    () => React.Children.map(children, processNode),
    [
      children,
      splitBy,
      staggerChildren,
      itemVariants,
      maxNodes,
      preserveWhitespace,
    ]
  );

  /* ------------------------------------------------------------------ */
  /*  AnimationManager (DEV only)                                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    animationManager.trackAnimation(
      uniqueId,
      `text-reveal-${splitBy}-${direction}`
    );
    return () => animationManager.untrackAnimation(uniqueId);
  }, [uniqueId, splitBy, direction]);

  /* ------------------------------------------------------------------ */
  /*  Trigger animation once view‑port hits                             */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!triggered && shouldAnimate()) {
      controls.start("visible").then(() => {
        setTriggered(true);
        onAnimationComplete?.();
      });
    }
  }, [controls, triggered, onAnimationComplete, shouldAnimate]);

  /* ------------------------------------------------------------------ */
  /*  Viewport config                                                   */
  /* ------------------------------------------------------------------ */
  const viewportOpts = { once, amount: threshold, ...viewport };

  /* ------------------------------------------------------------------ */
  /*  Reduced‑motion bypass                                             */
  /* ------------------------------------------------------------------ */
  if (!shouldAnimate()) {
    return <Fragment>{children}</Fragment>;
  }

  /* ------------------------------------------------------------------ */
  /*  Decide component & fail‑safe                                      */
  /* ------------------------------------------------------------------ */
  const MotionTag = (Motion as any)[as as keyof typeof Motion] || Motion.div;

  if (didFallback && fallbackInView) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0, y: direction === "up" ? 20 : -20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { delay, duration: calcDuration, ease },
        }}
        viewport={viewportOpts}
        layout={layout}
        layoutId={layoutId}
        style={{ willChange: "opacity, transform" }}
        {...motionProps}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      exit="exit"
      whileInView={!triggered ? "visible" : undefined}
      viewport={viewportOpts}
      layout={layout}
      layoutId={layoutId}
      style={{ willChange: "opacity, transform" }}
      {...motionProps}
    >
      {processedChildren}
    </MotionTag>
  );
};

export default memo(TextReveal);
