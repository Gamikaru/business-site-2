// src/components/common/Animations/components/AnimationSequence.tsx
"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { useAnimationPreferences } from "../hooks/useAnimationPreferences";

export interface AnimationStep {
  id: string;
  duration: number;
  delayAfter?: number;
}

export interface AnimationChildProps {
  currentStep?: string;
  animationProgress?: number;
}

interface AnimationSequenceProps {
  children: ReactNode;
  steps: AnimationStep[];
  startDelay?: number;
  onComplete?: () => void;
  loop?: boolean;
  className?: string;
}

const AnimationSequence: React.FC<AnimationSequenceProps> = ({
  children,
  steps,
  startDelay = 0,
  onComplete,
  loop = false,
  className = "",
}) => {
  const { shouldAnimate, getTransitionSettings } = useAnimationPreferences();
  const [currentStepIndex, setCurrentStepIndex] = useState(-1); // -1 means not started yet
  const [startTime, setStartTime] = useState<number | null>(null);

  // Adjust durations based on animation preferences
  const adjustedSteps = steps.map((step) => {
    const { duration: calculatedDuration } = getTransitionSettings(
      "default",
      step.duration
    );
    return {
      ...step,
      duration: calculatedDuration,
      delayAfter: step.delayAfter
        ? getTransitionSettings("default", step.delayAfter).duration
        : 0,
    };
  });

  // Function to get the current step
  const getCurrentStep = () => {
    if (currentStepIndex < 0 || currentStepIndex >= adjustedSteps.length) {
      return null;
    }
    return adjustedSteps[currentStepIndex];
  };

  // Handle animation progression
  useEffect(() => {
    if (!shouldAnimate()) {
      // Skip to the end if animations are disabled
      setCurrentStepIndex(adjustedSteps.length - 1);
      if (onComplete) onComplete();
      return;
    }

    // Initialize the sequence after the start delay
    const startTimerId = setTimeout(() => {
      setCurrentStepIndex(0);
      setStartTime(Date.now());
    }, startDelay * 1000);

    return () => clearTimeout(startTimerId);
  }, [shouldAnimate, startDelay, adjustedSteps.length, onComplete]);

  // Progress through the sequence
  useEffect(() => {
    if (currentStepIndex < 0 || currentStepIndex >= adjustedSteps.length)
      return;

    const currentStep = adjustedSteps[currentStepIndex];
    const totalStepTime =
      (currentStep.duration + (currentStep.delayAfter || 0)) * 1000;

    const timerId = setTimeout(() => {
      if (currentStepIndex < adjustedSteps.length - 1) {
        // Move to next step
        setCurrentStepIndex((prevIndex) => prevIndex + 1);
        setStartTime(Date.now());
      } else {
        // End of sequence
        if (loop) {
          // Loop back to first step
          setCurrentStepIndex(0);
          setStartTime(Date.now());
        } else if (onComplete) {
          onComplete();
        }
      }
    }, totalStepTime);

    return () => clearTimeout(timerId);
  }, [currentStepIndex, adjustedSteps, loop, onComplete]);

  // Clone children with currentStep prop
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        currentStep: getCurrentStep()?.id,
        animationProgress: startTime
          ? Math.min(
              1,
              (Date.now() - startTime) /
                (getCurrentStep()?.duration || 1) /
                1000
            )
          : 0,
      } as AnimationChildProps);
    }
    return child;
  });

  return <div className={className}>{childrenWithProps}</div>;
};

export default AnimationSequence;
