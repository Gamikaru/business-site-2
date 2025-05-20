// src/components/core/Animations/components/StaggerContainer.tsx
"use client";

import React, {
  ReactNode,
  useEffect,
  useRef,
  useMemo,
  memo,
  Fragment,
  useState,
} from "react";
import { Variants, HTMLMotionProps } from "framer-motion";
import { useAnimationPreferences } from "../hooks/useAnimationPreferences";
import { animationManager } from "../utils/AnimationManager";
import { Motion } from "../providers/MotionProvider";

/* ------------------------------------------------------------------ */
/*  Shared constants                                                  */
/* ------------------------------------------------------------------ */

export type StaggerDirection = "forward" | "reverse" | "center" | "edges";

export const baseContainerVariants: Variants = {
  hidden: { opacity: 0 },
  exit: { opacity: 0 },
};

export const baseItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  exit: { opacity: 0, y: 20 },
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface StaggerContainerProps
  extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  direction?: StaggerDirection;
  duration?: number;
  childVariants?: Variants;
  onAnimationComplete?: () => void;
  threshold?: number;
  once?: boolean;
  id?: string;
  viewport?: {
    margin?: string;
    amount?: number | "some" | "all";
  };
  layout?: boolean | "position";
  layoutId?: string;
  customStaggerOrder?: number[];
  orchestration?: "parallel" | "sequence";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.1,
  direction = "forward",
  duration,
  childVariants,
  onAnimationComplete,
  threshold = 0.1,
  once = true,
  id: providedId,
  viewport,
  layout = false,
  layoutId,
  customStaggerOrder,
  orchestration = "sequence",
  ...motionProps
}) => {
  const { getTransitionSettings, getIntensity, shouldAnimate } =
    useAnimationPreferences();

  /* ------------------------------------------------------------ */
  /*  IDs & completion tracking                                   */
  /* ------------------------------------------------------------ */
  const uid = useRef(
    providedId || `stagger-container-${Math.random().toString(36).slice(2, 9)}`
  );
  const [isAnimating, setIsAnimating] = useState(true);

  /* ------------------------------------------------------------ */
  /*  Transition helpers                                          */
  /* ------------------------------------------------------------ */
  const { duration: calcDuration, ease } = getTransitionSettings(
    "default",
    duration
  );
  const effectiveStagger = staggerDelay * (1 / getIntensity());

  const dirValue = useMemo(() => {
    switch (direction) {
      case "reverse":
        return -1;
      case "forward":
      default:
        return 1;
    }
  }, [direction]);

  /* ------------------------------------------------------------ */
  /*  Container variants (memoised)                               */
  /* ------------------------------------------------------------ */
  const containerVariants = useMemo<Variants>(() => {
    const special = direction === "center" || direction === "edges";

    const shared = {
      transition: {
        staggerChildren: special ? 0 : effectiveStagger,
        delayChildren: delay,
        staggerDirection: dirValue,
        duration: calcDuration,
        ease,
      },
    };

    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          when: orchestration === "sequence" ? "beforeChildren" : undefined,
          ...shared.transition,
        },
      },
      exit: {
        opacity: 0,
        transition: {
          when: orchestration === "sequence" ? "afterChildren" : undefined,
          staggerChildren: special ? 0 : effectiveStagger / 2,
          staggerDirection: dirValue * -1,
          duration: calcDuration * 0.7,
          ease,
        },
      },
    };
  }, [
    delay,
    effectiveStagger,
    dirValue,
    calcDuration,
    ease,
    orchestration,
    direction,
  ]);

  /* ------------------------------------------------------------ */
  /*  Default child variants (memoised)                           */
  /* ------------------------------------------------------------ */
  const defaultChildVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: calcDuration, ease },
      },
      exit: {
        opacity: 0,
        y: 20,
        transition: { duration: calcDuration * 0.7, ease },
      },
    }),
    [calcDuration, ease]
  );

  /* ------------------------------------------------------------ */
  /*  Clone children with variants & custom delays                */
  /* ------------------------------------------------------------ */
  const processedChildren = useMemo(() => {
    const kids = React.Children.toArray(children);
    const count = kids.length;

    return kids.map((kid, idx) => {
      if (!React.isValidElement(kid)) return kid;

      let customDelay = 0;

      if (customStaggerOrder) {
        const order = customStaggerOrder[idx] ?? idx;
        customDelay = order * effectiveStagger;
      } else if (direction === "center") {
        const dist = Math.abs(idx - (count - 1) / 2);
        customDelay = dist * effectiveStagger;
      } else if (direction === "edges") {
        const dist = Math.min(idx, count - 1 - idx);
        customDelay = dist * effectiveStagger;
      }

      const finalVariants: Variants = {
        ...childVariants,
        ...defaultChildVariants,
        visible: {
          ...(childVariants?.visible ?? defaultChildVariants.visible),
          transition: {
            ...((childVariants?.visible ?? defaultChildVariants.visible) as any)?.transition || {},
            delay: customDelay + delay,
          },
        },
      };

      return React.cloneElement(kid, {
        ...(kid.props || {}),
        variants: finalVariants,
      } as any); // Type assertion to bypass the variants check
    });
  }, [
    children,
    childVariants,
    defaultChildVariants,
    delay,
    direction,
    effectiveStagger,
    customStaggerOrder,
  ]);

  /* ------------------------------------------------------------ */
  /*  Dev‑only animation tracking                                 */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    if (!shouldAnimate() || process.env.NODE_ENV !== "development") return;
    animationManager.trackAnimation(uid.current, `stagger-${direction}`);
    return () => animationManager.untrackAnimation(uid.current);
  }, [shouldAnimate, direction]);

  /* ------------------------------------------------------------ */
  /*  Completion handler                                          */
  /* ------------------------------------------------------------ */
  const handleComplete = () => {
    setIsAnimating(false);
    onAnimationComplete?.();
  };

  /* ------------------------------------------------------------ */
  /*  Reduced‑motion path                                         */
  /* ------------------------------------------------------------ */
  if (!shouldAnimate()) {
    return <Fragment>{children}</Fragment>;
  }

  /* ------------------------------------------------------------ */
  /*  will‑change optimisation                                    */
  /* ------------------------------------------------------------ */
  const style = useMemo(
    () => ({
      willChange: isAnimating ? "opacity, transform" : undefined,
    }),
    [isAnimating]
  );

  /* ------------------------------------------------------------ */
  /*  Render                                                      */
  /* ------------------------------------------------------------ */
  return (
    <Motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once, amount: threshold, ...viewport }}
      onAnimationComplete={handleComplete}
      layout={layout}
      layoutId={layoutId}
      style={style}
      {...motionProps}
    >
      {processedChildren}
    </Motion.div>
  );
};

export default memo(StaggerContainer);
