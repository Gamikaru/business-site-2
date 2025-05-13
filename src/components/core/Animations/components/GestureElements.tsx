// src/components/core/Animations/components/GestureElements.tsx
"use client";

import React, { ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  MotionProps,
} from "framer-motion";
import { useAnimationPreferences } from "../hooks/useAnimationPreferences";

interface GestureElementProps extends Omit<MotionProps, "style"> {
  children: ReactNode;
  className?: string;
  dragEnabled?: boolean;
  dragConstraints?:
    | { top?: number; right?: number; bottom?: number; left?: number }
    | React.RefObject<Element>;
  tiltEnabled?: boolean;
  tiltFactor?: number;
  scaleOnHover?: boolean;
  scaleAmount?: number;
  onClick?: () => void;
}

const GestureElement: React.FC<GestureElementProps> = ({
  children,
  className = "",
  dragEnabled = false,
  dragConstraints,
  tiltEnabled = true,
  tiltFactor = 15,
  scaleOnHover = true,
  scaleAmount = 1.03,
  onClick,
  ...motionProps
}) => {
  const { shouldAnimate, reducedMotion } = useAnimationPreferences();

  // Motion values for the tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform mouse motion into rotation
  const rotateX = useTransform(y, [-100, 100], [tiltFactor, -tiltFactor]);
  const rotateY = useTransform(x, [-100, 100], [-tiltFactor, tiltFactor]);

  // Event handlers for tilt effect
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !shouldAnimate() || reducedMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Determine if animation features should be enabled
  const enableTilt = tiltEnabled && shouldAnimate() && !reducedMotion;
  const enableDrag = dragEnabled && shouldAnimate() && !reducedMotion;
  const enableHoverScale = scaleOnHover && shouldAnimate() && !reducedMotion;

  return (
    <motion.div
      className={className}
      style={{
        x: enableDrag ? undefined : 0,
        y: enableDrag ? undefined : 0,
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      whileHover={enableHoverScale ? { scale: scaleAmount } : undefined}
      whileTap={shouldAnimate() ? { scale: 0.98 } : undefined}
      drag={enableDrag}
      dragConstraints={enableDrag ? dragConstraints : false}
      onMouseMove={enableTilt ? handleMouseMove : undefined}
      onMouseLeave={enableTilt ? handleMouseLeave : undefined}
      onClick={onClick}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default GestureElement;
