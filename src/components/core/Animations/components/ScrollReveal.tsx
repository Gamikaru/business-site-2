// src/components/core/Animations/components/ScrollReveal.tsx
"use client";

import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  memo,
  Fragment,
} from "react";
import { MotionProps } from "framer-motion";
import { useAnimationPreferences } from "../hooks/useAnimationPreferences";
import { animationManager } from "../utils/AnimationManager";
import { Motion } from "../providers/MotionProvider";

interface ScrollRevealProps
  extends Omit<
    MotionProps,
    | "transition"
    | "initial"
    | "animate"
    | "whileInView"
    | "viewport"
  > {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "opacity";
  distance?: number;
  once?: boolean;
  className?: string;
  threshold?: number;
  id?: string;
  margin?: string; // Viewport margin for earlier/later triggers
  transitionType?: "tween" | "spring";
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  layout?: boolean | "position"; // Support for layout animations
  layoutId?: string; // Support for shared element transitions
  stagger?: boolean;
  staggerDelay?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration,
  direction = "up",
  distance = 50,
  once = true,
  className = "",
  threshold = 0.2,
  id: providedId,
  margin = "0px",
  transitionType = "tween",
  springConfig,
  layout = false,
  layoutId,
  stagger = false,
  staggerDelay = 0.1,
  ...motionProps
}) => {
  const {
    getTransitionSettings,
    getIntensity,
    shouldAnimate,
  } = useAnimationPreferences();

  /* ------------------------------------------------------------------ */
  /*  Unique ID + completion tracking                                   */
  /* ------------------------------------------------------------------ */
  const uniqueIdRef = useRef<string>(
    providedId || `scroll-reveal-${Math.random().toString(36).slice(2, 9)}`
  );
  const [animating, setAnimating] = useState<boolean>(true);

  /* ------------------------------------------------------------------ */
  /*  Motion helpers                                                    */
  /* ------------------------------------------------------------------ */
  const effectiveDistance = distance * getIntensity();
  const { duration: calcDuration, ease } = getTransitionSettings(
    "default",
    duration
  );

  const initial = useMemo(() => {
    switch (direction) {
      case "up":
        return { y: effectiveDistance, opacity: 0 };
      case "down":
        return { y: -effectiveDistance, opacity: 0 };
      case "left":
        return { x: effectiveDistance, opacity: 0 };
      case "right":
        return { x: -effectiveDistance, opacity: 0 };
      case "scale":
        return { scale: 0.92, opacity: 0 };
      case "opacity":
      default:
        return { opacity: 0 };
    }
  }, [direction, effectiveDistance]);

  const visible = useMemo(() => {
    switch (direction) {
      case "up":
      case "down":
        return { y: 0, opacity: 1 };
      case "left":
      case "right":
        return { x: 0, opacity: 1 };
      case "scale":
        return { scale: 1, opacity: 1 };
      case "opacity":
      default:
        return { opacity: 1 };
    }
  }, [direction]);

  const transition = useMemo(
    () =>
      ({
        type: transitionType,
        delay,
        duration: transitionType === "tween" ? calcDuration : undefined,
        ease: transitionType === "tween" ? ease : undefined,
        staggerChildren: stagger ? staggerDelay : undefined,
        ...springConfig,
      }) as MotionProps["transition"],
    [
      transitionType,
      delay,
      calcDuration,
      ease,
      stagger,
      staggerDelay,
      springConfig,
    ]
  );

  /* ------------------------------------------------------------------ */
  /*  Global animation manager (DEV only)                               */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!shouldAnimate()) return;
    if (process.env.NODE_ENV === "development") {
      const id = uniqueIdRef.current;
      animationManager.trackAnimation(id, `scroll-reveal-${direction}`);
      return () => animationManager.untrackAnimation(id);
    }
  }, [shouldAnimate, direction]);

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                          */
  /* ------------------------------------------------------------------ */
  const handleAnimationComplete = () => {
    if (animating) setAnimating(false);
  };

  /* ------------------------------------------------------------------ */
  /*  Early‑exit when animations are disabled                           */
  /* ------------------------------------------------------------------ */
  if (!shouldAnimate()) {
    return <Fragment>{children}</Fragment>;
  }

  /* ------------------------------------------------------------------ */
  /*  Style with conditional will‑change                                */
  /* ------------------------------------------------------------------ */
  const style = useMemo(
    () => ({
      willChange: animating ? "transform, opacity" : undefined,
    }),
    [animating]
  );

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <Motion.div
      className={className}
      initial={initial}
      whileInView={visible}
      viewport={{ once, amount: threshold, margin }}
      transition={transition}
      onAnimationComplete={handleAnimationComplete}
      layout={layout}
      layoutId={layoutId}
      style={style}
      {...motionProps}
    >
      {children}
    </Motion.div>
  );
};

export default memo(ScrollReveal);
