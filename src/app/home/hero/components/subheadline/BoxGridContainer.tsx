// src/app/home/components/subheadline/BoxGridContainer.tsx
"use client";

import React, { memo, useRef } from "react";
import { getBoxPositionClasses } from "./BoxPosition";
import SubheadlineBox from "./SubheadlineBox";
import XArrowConnectors from "./XArrowConnectors";
import { AccentColors } from "./SubheadlineTypes";
import { useBoxGridAnimations } from "./hooks/useBoxGridAnimations";

interface BoxGridContainerProps {
  firstThreeWords: string[];
  remainingWords: string;
  hoveredBox: number | null;
  onHover: (index: number | null) => void;
  accentColors: AccentColors;
  animationControls: {
    isInitializing: boolean;
    isAnimating: boolean;
    isComplete: boolean;
    sequenceId: string;
  };
  currentStep: string;
  animationProgress: number;
  mousePosition: { x: number; y: number };
  containerInView: boolean;
}

const BoxGridContainer: React.FC<BoxGridContainerProps> = ({
  firstThreeWords,
  remainingWords,
  hoveredBox,
  onHover,
  accentColors,
  animationControls,
  currentStep,
  animationProgress,
  mousePosition,
  containerInView,
}) => {
  // Create a container ref for the grid
  const containerRef = useRef<HTMLDivElement>(null);

  // Create refs for each box to be used by XArrowConnectors
  const boxRefs = useRef<React.RefObject<HTMLDivElement>[]>(
    Array(4)
      .fill(null)
      .map(() => React.createRef<HTMLDivElement>())
  );

  // Use our extracted animation hook
  const { getBoxAnimationProgress } = useBoxGridAnimations(animationProgress);

  return (
    <div
      ref={containerRef}
      className="relative grid grid-cols-12 gap-4 md:gap-5 lg:gap-6"
      role="region"
      aria-label="Interactive information display"
      style={{ position: "relative", minHeight: "200px" }}
    >
      {/* XArrow connectors */}
      <XArrowConnectors
        boxRefs={boxRefs.current}
        hoveredBox={hoveredBox}
        accentColors={accentColors}
        animationProgress={animationProgress}
      />

      {/* First three word boxes */}
      {firstThreeWords.map((word, index) => (
        <SubheadlineBox
          key={`word-box-${index}`}
          ref={boxRefs.current[index]}
          index={index}
          text={word}
          positionClass={getBoxPositionClasses(index)}
          isHovered={hoveredBox === index}
          onHover={onHover}
          accentColors={accentColors}
          animationControls={animationControls}
          sequenceStep={currentStep}
          animationProgress={getBoxAnimationProgress(index)}
          isInView={containerInView}
          aria-label={`Concept box ${index + 1}: ${word}`}
          data-box-index={index}
        />
      ))}

      {/* Final box with remaining words */}
      <SubheadlineBox
        ref={boxRefs.current[3]}
        index={3}
        text={remainingWords}
        isLarge={true}
        positionClass={getBoxPositionClasses(3)}
        isHovered={hoveredBox === 3}
        onHover={onHover}
        accentColors={accentColors}
        animationControls={animationControls}
        sequenceStep={currentStep}
        animationProgress={getBoxAnimationProgress(3)}
        isInView={containerInView}
        aria-label={`Main concept: ${remainingWords}`}
        data-box-index={3}
      />
    </div>
  );
};

export default memo(BoxGridContainer);
