// src/app/home/components/subheadline/SubheadlineBox.tsx
"use client";

import React, {
  memo,
  useRef,
  useCallback,
  useState,
  forwardRef,
  useEffect,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { GestureElement } from "@/components/core/Animations";
import { AccentColors, BoxProps } from "./SubheadlineTypes";
import TechnicalMarkers from "./TechnicalMarkers";
import CircuitLines from "./CircuitLines";
import BoxContent from "./content/BoxContent";
import BoxParticles from "./effects/BoxParticles";
import BoxHighlightEffect from "./effects/BoxHighlightEffect";
import BoxDecorations from "./effects/BoxDecorations";
import { getBoxStyle, getBoxZIndex, getGradientColor } from "./utils/BoxStyles";
import { useBoxAnimations } from "./hooks/useBoxAnimations";
import { combineRefs } from "./utils/RefUtils";

// Enhanced border animation component
const AnimatedBorder = ({
  isActive,
  color,
  isFinalBox,
  index,
}: {
  isActive: boolean;
  color: string;
  isFinalBox: boolean;
  index: number;
}) => {
  // Skip if not active
  if (!isActive) return null;

  const borderWidth = isFinalBox ? "2px" : "1px";
  const cornerSize = isFinalBox ? "10px" : "8px";

  // Staggered animation based on index
  const startDelay = 0.1 + index * 0.05;

  return (
    <>
      {/* Top-left corner */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none"
        aria-hidden="true"
        initial={{ opacity: 0, width: 0, height: 0 }}
        animate={{
          opacity: 1,
          width: cornerSize,
          height: cornerSize,
        }}
        exit={{ opacity: 0 }}
        transition={{
          delay: startDelay,
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div
          className="absolute top-0 left-0"
          style={{
            width: cornerSize,
            height: borderWidth,
            background: color,
            boxShadow: `0 0 5px ${color}25`,
          }}
        />
        <div
          className="absolute top-0 left-0"
          style={{
            width: borderWidth,
            height: cornerSize,
            background: color,
            boxShadow: `0 0 5px ${color}25`,
          }}
        />
      </motion.div>

      {/* Bottom-right corner */}
      <motion.div
        className="absolute bottom-0 right-0 pointer-events-none"
        aria-hidden="true"
        initial={{ opacity: 0, width: 0, height: 0 }}
        animate={{
          opacity: 1,
          width: cornerSize,
          height: cornerSize,
        }}
        exit={{ opacity: 0 }}
        transition={{
          delay: startDelay + 0.1,
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: cornerSize,
            height: borderWidth,
            background: color,
            boxShadow: `0 0 5px ${color}25`,
          }}
        />
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: borderWidth,
            height: cornerSize,
            background: color,
            boxShadow: `0 0 5px ${color}25`,
          }}
        />
      </motion.div>
    </>
  );
};

// Technical grid background
const TechnicalGrid = ({
  isActive,
  color,
  isFinalBox,
}: {
  isActive: boolean;
  color: string;
  isFinalBox: boolean;
}) => {
  if (!isActive) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundImage: `
          linear-gradient(to right, ${color}10 1px, transparent 1px),
          linear-gradient(to bottom, ${color}10 1px, transparent 1px)
        `,
        backgroundSize: isFinalBox ? "20px 20px" : "15px 15px",
        opacity: 0.3,
        zIndex: 0,
      }}
    />
  );
};

// Technical measurement lines
const MeasurementLines = ({
  isActive,
  color,
  width,
  height,
}: {
  isActive: boolean;
  color: string;
  width: number;
  height: number;
}) => {
  if (!isActive || !width || !height) return null;

  return (
    <>
      {/* Horizontal measurement line */}
      <motion.div
        className="absolute -bottom-4 left-0 text-[7px] font-mono pointer-events-none flex items-center"
        aria-hidden="true"
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 0.6, width: width }}
        exit={{ opacity: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{ color }}
      >
        <div className="w-full h-px" style={{ backgroundColor: color }}></div>
        <div className="ml-1 whitespace-nowrap">{Math.round(width)}px</div>
      </motion.div>

      {/* Vertical measurement line */}
      <motion.div
        className="absolute -right-2 top-0 text-[7px] font-mono pointer-events-none flex flex-col items-center"
        aria-hidden="true"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 0.6, height: height }}
        exit={{ opacity: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{ color }}
      >
        <div className="h-full w-px" style={{ backgroundColor: color }}></div>
        <div className="mt-1 whitespace-nowrap rotate-90 origin-left translate-x-3">
          {Math.round(height)}px
        </div>
      </motion.div>
    </>
  );
};

// Interface combining BoxProps with new props
interface ExtendedBoxProps extends BoxProps {
  boxRef?: (node: HTMLDivElement | null) => void;
  isInView?: boolean;
}

// Main SubheadlineBox component with forwardRef
const SubheadlineBox = forwardRef<HTMLDivElement, ExtendedBoxProps>(
  (
    {
      index,
      text,
      isLarge = false,
      positionClass,
      boxYPosition,
      boxRotation,
      boxScale,
      isHovered,
      onHover,
      accentColors,
      animationControls,
      sequenceStep,
      animationProgress = 0,
      boxRef,
      isInView = false,
      ...rest
    },
    forwardedRef
  ) => {
    const isFinalBox = index === 3;
    const boxElementRef = useRef<HTMLDivElement | null>(null);

    // Add local hover state for debugging and direct control
    const [localHovered, setLocalHovered] = useState(false);

    // Dimension tracking for measurement lines
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Mouse position tracking for hover effect
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Transform mouse position into lighting effect
    const lightX = useTransform(mouseX, [0, 1], ["-10%", "110%"]);
    const lightY = useTransform(mouseY, [0, 1], ["-10%", "110%"]);

    // Use our extracted animation hook
    const {
      animationId,
      isRevealed,
      variants,
      springConfig,
      reducedMotion,
      shouldAnimate,
    } = useBoxAnimations(index, isInView, animationControls.isComplete);

    // Combine refs for both animation tracking and position tracking
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        // Store the DOM node in our ref
        boxElementRef.current = node;

        // Update dimensions for measurement display
        if (node) {
          const rect = node.getBoundingClientRect();
          setDimensions({
            width: rect.width,
            height: rect.height,
          });
        }

        // Use our combineRefs utility
        combineRefs(boxRef, forwardedRef)(node);
      },
      [boxRef, forwardedRef]
    );

    // Enhanced hover handlers that use both local and parent state
    const handleMouseEnter = useCallback(() => {
      setLocalHovered(true);
      if (onHover) onHover(index);
    }, [onHover, index]);

    const handleMouseLeave = useCallback(() => {
      setLocalHovered(false);
      if (onHover) onHover(null);
    }, [onHover]);

    // Track mouse position within box for lighting effect
    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!boxElementRef.current) return;

        const rect = boxElementRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        mouseX.set(x);
        mouseY.set(y);
      },
      [mouseX, mouseY]
    );

    // Update dimensions on resize
    useEffect(() => {
      const updateDimensions = () => {
        if (!boxElementRef.current) return;

        const rect = boxElementRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      };

      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // Get gradient color based on index
    const gradientColor = getGradientColor(index, accentColors);

    // Determine if box should be visible based on animation state and scroll position
    const shouldShowBox =
      animationControls.isComplete ||
      (sequenceStep === "boxes" && index <= animationProgress * 4) ||
      isRevealed ||
      isInView;

    // Combine both the parent hover state and our local hover state
    const effectivelyHovered = isHovered || localHovered;

    // If using animations for better touch interactions
    if (shouldAnimate && !reducedMotion) {
      return (
        <motion.div
          ref={setRefs}
          className={positionClass}
          variants={variants}
          initial="hidden"
          animate={shouldShowBox ? "visible" : "hidden"}
          transition={springConfig}
          style={{
            y: boxYPosition,
            rotateX: boxRotation,
            scale: boxScale,
            zIndex: getBoxZIndex(index, effectivelyHovered),
            willChange: "transform, opacity",
            transformStyle: "preserve-3d",
          }}
          {...rest}
        >
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{ zIndex: 50 }}
          >
            <GestureElement
              className="relative"
              tiltEnabled={!reducedMotion && shouldAnimate}
              tiltFactor={isFinalBox ? 8 : 10}
              scaleOnHover={true}
              scaleAmount={isFinalBox ? 1.05 : 1.03}
              onHoverStart={handleMouseEnter}
              onHoverEnd={handleMouseLeave}
              perspective={800}
            >
              {/* Technical markers (numbers, coordinates, etc.) */}
              <div
                className="absolute -top-5 left-0 flex items-center gap-1 z-10"
                style={{ opacity: effectivelyHovered ? 0.9 : 0.7 }}
              >
                <motion.div
                  className="flex h-4 font-mono text-[9px] items-center overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: effectivelyHovered ? "auto" : 22 }}
                  transition={{ duration: 0.3 }}
                >
                  <TechnicalMarkers
                    index={index}
                    isLarge={isFinalBox}
                    accentColors={accentColors}
                    animationProgress={animationProgress}
                  />
                </motion.div>

                {/* Box index indicator */}
                <motion.div
                  className="flex items-center justify-center w-4 h-4 rounded-full font-mono text-[8px]"
                  style={{
                    backgroundColor: gradientColor + "20",
                    color: gradientColor,
                    border: `1px solid ${gradientColor}80`,
                  }}
                  animate={{
                    scale: effectivelyHovered ? [1, 1.1, 1] : 1,
                    opacity: effectivelyHovered ? 1 : 0.8,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: effectivelyHovered ? Infinity : 0,
                    repeatType: "reverse",
                  }}
                >
                  {index}
                </motion.div>
              </div>

              {/* Main box container with enhanced styling */}
              <motion.div
                className={`${isFinalBox ? "p-5" : "px-4 py-3"} relative overflow-hidden rounded-sm border border-transparent`}
                style={getBoxStyle(index, effectivelyHovered, accentColors)}
                animate={{
                  borderColor: effectivelyHovered
                    ? gradientColor + "40"
                    : "transparent",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Technical grid background */}
                <TechnicalGrid
                  isActive={effectivelyHovered}
                  color={gradientColor}
                  isFinalBox={isFinalBox}
                />

                {/* Dynamic lighting effect based on mouse position */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${lightX} ${lightY}, ${gradientColor}20 0%, transparent 70%)`,
                    opacity: effectivelyHovered ? 1 : 0,
                    zIndex: 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Animated borders */}
                <AnimatePresence>
                  {effectivelyHovered && (
                    <AnimatedBorder
                      isActive={effectivelyHovered}
                      color={gradientColor}
                      isFinalBox={isFinalBox}
                      index={index}
                    />
                  )}
                </AnimatePresence>

                {/* Box content component */}
                <div className="relative z-10">
                  <BoxContent
                    text={text}
                    isFinalBox={isFinalBox}
                    isHovered={effectivelyHovered}
                  />
                </div>

                {/* Highlight effect on hover */}
                {shouldShowBox && shouldAnimate && (
                  <BoxHighlightEffect
                    gradientColor={gradientColor}
                    isHovered={effectivelyHovered}
                    isFinalBox={isFinalBox}
                    index={index}
                  />
                )}

                {/* Decorations for final box */}
                {shouldShowBox && shouldAnimate && (
                  <BoxDecorations
                    accentColor={accentColors.brand}
                    animationProgress={animationProgress}
                    isFinalBox={isFinalBox}
                  />
                )}

                {/* Floating particles */}
                <BoxParticles
                  index={index}
                  isFinalBox={isFinalBox}
                  accentColors={accentColors}
                  isActive={Boolean(effectivelyHovered && shouldShowBox)}
                  isHovered={effectivelyHovered}
                />
              </motion.div>

              {/* Measurement lines that appear on hover */}
              <AnimatePresence>
                {effectivelyHovered && (
                  <MeasurementLines
                    isActive={effectivelyHovered}
                    color={gradientColor}
                    width={dimensions.width}
                    height={dimensions.height}
                  />
                )}
              </AnimatePresence>

              {/* Circuit line decoration */}
              {shouldShowBox && (
                <CircuitLines
                  index={index}
                  accentColors={accentColors}
                  animationProgress={animationProgress}
                  animationId={`${animationId}-circuit`}
                />
              )}
            </GestureElement>
          </div>
        </motion.div>
      );
    }

    // Simplified version for reduced motion or when animations disabled
    return (
      <div
        ref={setRefs}
        className={positionClass}
        style={{ zIndex: isFinalBox ? 20 : 10 }}
        {...rest}
      >
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`${isFinalBox ? "p-5" : "px-4 py-3"} relative overflow-hidden rounded-sm`}
            style={getBoxStyle(index, false, accentColors)}
          >
            <BoxContent text={text} isFinalBox={isFinalBox} isHovered={false} />
          </div>
        </div>
      </div>
    );
  }
);

SubheadlineBox.displayName = "SubheadlineBox";

export default memo(SubheadlineBox);
