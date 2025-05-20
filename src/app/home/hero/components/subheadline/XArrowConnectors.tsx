// src/app/home/components/subheadline/XArrowConnectors.tsx
"use client";

import React, { memo, useEffect, useState, useMemo } from "react";
import Xarrow, { Xwrapper } from "react-xarrows";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimationPreferences } from "@/components/core/Animations";
import { AccentColors } from "./SubheadlineTypes";
import DataPoint from "./components/DataPoint";
import { getConnectorColor, getAnimationDelay } from "./utils/ConnectorUtils";

interface XArrowConnectorsProps {
  boxRefs: React.RefObject<HTMLDivElement>[];
  hoveredBox: number | null;
  accentColors: AccentColors;
  animationProgress: number;
}

// Pulse animation for data points
const pulseVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: [0, 0.8, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const XArrowConnectors: React.FC<XArrowConnectorsProps> = ({
  boxRefs,
  hoveredBox,
  accentColors,
  animationProgress,
}) => {
  const { shouldAnimate, reducedMotion, performance } =
    useAnimationPreferences();
  const [isVisible, setIsVisible] = useState(false);

  // Create an array of connection definitions for cleaner rendering
  const connections = useMemo(
    () => [
      // Connection 1: Box 0 to Box 1
      {
        id: "conn-0-1",
        start: 0,
        end: 1,
        startAnchor: "left",
        endAnchor: "top",
        curveness: 0.8,
        pointCount: hoveredBox === 0 || hoveredBox === 1 ? 3 : 1,
        dashAnimSpeed: hoveredBox === 0 || hoveredBox === 1 ? 1 : 0,
        label: "transfer",
        delay: getAnimationDelay(0),
      },
      // Connection 2: Box 1 to Box 2
      {
        id: "conn-1-2",
        start: 1,
        end: 2,
        startAnchor: "bottom",
        endAnchor: "right",
        curveness: 0.8,
        pointCount: hoveredBox === 1 || hoveredBox === 2 ? 3 : 1,
        dashAnimSpeed: hoveredBox === 1 || hoveredBox === 2 ? 1 : 0,
        label: "process",
        delay: getAnimationDelay(1),
      },
      // Connection 3: Box 2 to Box 3
      {
        id: "conn-2-3",
        start: 2,
        end: 3,
        startAnchor: "left",
        endAnchor: {
          position: "top",
          offset: { x: -30 }, // Offset to the left third
        },
        curveness: 0.8,
        pointCount: hoveredBox === 2 || hoveredBox === 3 ? 4 : 2,
        dashAnimSpeed: hoveredBox === 2 || hoveredBox === 3 ? 1 : 0,
        label: "output",
        delay: getAnimationDelay(2),
      },
    ],
    [hoveredBox]
  );

  // Function to create data flow points along an arrow
  const createDataPoints = (
    connection: (typeof connections)[0],
    color: string
  ) => {
    if (connection.pointCount <= 0) return null;

    // Create an array of points distributed along the path
    return Array.from({ length: connection.pointCount }).map((_, i) => {
      // Distribute points evenly, with first point at 20% and last at 80%
      const progress = 0.2 + (i / (connection.pointCount - 1)) * 0.6;

      // Size and delay vary based on position
      const size = i === Math.floor(connection.pointCount / 2) ? 6 : 4;
      const delay = i * 0.7 + connection.delay;

      return (
        <motion.div
          key={`point-${connection.id}-${i}`}
          className="absolute"
          style={{
            left: `calc(var(--x-arrow-${connection.id}-progress-${Math.floor(progress * 100)}))`,
            top: `calc(var(--y-arrow-${connection.id}-progress-${Math.floor(progress * 100)}))`,
            zIndex: 20,
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pulseVariants}
          custom={delay}
        >
          <div
            className="rounded-full"
            style={{
              backgroundColor: color,
              width: size,
              height: size,
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 6px ${color}`,
            }}
          />
        </motion.div>
      );
    });
  };

  // Technical measurements display for hover
  const renderTechnicalDisplay = (
    connection: (typeof connections)[0],
    color: string
  ) => {
    // Only show measurements when related boxes are hovered
    if (!(hoveredBox === connection.start || hoveredBox === connection.end)) {
      return null;
    }

    return (
      <motion.div
        className="absolute font-mono text-[8px] tracking-tight pointer-events-none"
        style={{
          left: `calc(var(--x-arrow-${connection.id}-progress-50))`,
          top: `calc(var(--y-arrow-${connection.id}-progress-50))`,
          color,
          transform: "translate(-50%, -100%)",
          zIndex: 30,
        }}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 0.9, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center bg-bg-card bg-opacity-80 backdrop-blur-sm px-1.5 py-0.5 rounded">
          <div
            className="w-2 h-2 rounded-full mr-1.5"
            style={{ backgroundColor: color }}
          ></div>
          <span>{connection.label}</span>
          <span className="ml-1.5 opacity-70">{connection.id}</span>
        </div>
      </motion.div>
    );
  };

  // Only show connections after animation threshold
  useEffect(() => {
    setIsVisible(animationProgress > 0.5);
  }, [animationProgress]);

  // Skip rendering for reduced motion or low performance
  if (
    reducedMotion ||
    performance === "low" ||
    !shouldAnimate() ||
    !isVisible
  ) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      aria-hidden="true"
    >
      <Xwrapper>
        {/* CSS Variables for storing path positions */}
        <style jsx global>{`
          :root {
            --x-arrow-conn-0-1-progress-20: 0%;
            --y-arrow-conn-0-1-progress-20: 0%;
            --x-arrow-conn-0-1-progress-50: 0%;
            --y-arrow-conn-0-1-progress-50: 0%;
            --x-arrow-conn-0-1-progress-80: 0%;
            --y-arrow-conn-0-1-progress-80: 0%;

            --x-arrow-conn-1-2-progress-20: 0%;
            --y-arrow-conn-1-2-progress-20: 0%;
            --x-arrow-conn-1-2-progress-50: 0%;
            --y-arrow-conn-1-2-progress-50: 0%;
            --x-arrow-conn-1-2-progress-80: 0%;
            --y-arrow-conn-1-2-progress-80: 0%;

            --x-arrow-conn-2-3-progress-20: 0%;
            --y-arrow-conn-2-3-progress-20: 0%;
            --x-arrow-conn-2-3-progress-50: 0%;
            --y-arrow-conn-2-3-progress-50: 0%;
            --x-arrow-conn-2-3-progress-80: 0%;
            --y-arrow-conn-2-3-progress-80: 0%;
          }
        `}</style>

        {/* Render each connection defined above */}
        <AnimatePresence>
          {connections.map((connection) => {
            const color = getConnectorColor(
              connection.start,
              connection.end,
              hoveredBox,
              accentColors,
              animationProgress
            );

            // Dynamic dashness based on hover state
            const dashness = connection.dashAnimSpeed
              ? {
                  strokeLen: 10,
                  nonStrokeLen: 6,
                  animation: connection.dashAnimSpeed,
                }
              : {
                  strokeLen: 5,
                  nonStrokeLen: 4,
                  animation: false,
                };

            return (
              <React.Fragment key={connection.id}>
                {/* Main Arrow */}
                <Xarrow
                  start={boxRefs[connection.start]}
                  end={boxRefs[connection.end]}
                  startAnchor={connection.startAnchor}
                  endAnchor={connection.endAnchor}
                  color={color}
                  strokeWidth={
                    hoveredBox === connection.start ||
                    hoveredBox === connection.end
                      ? 2.5
                      : 1.5
                  }
                  path="grid"
                  curveness={connection.curveness}
                  dashness={dashness}
                  showHead={false}
                  animateDrawing={
                    animationProgress > 0.6 ? connection.delay : 0
                  }
                  zIndex={10}
                  gridBreak={
                    hoveredBox === connection.start ||
                    hoveredBox === connection.end
                      ? "100%"
                      : "50%"
                  }
                  // Add custom props to track path coordinates as CSS variables
                  passProps={{
                    onPathChange: (pathRef: SVGPathElement) => {
                      if (!pathRef) return;

                      // Get total length of path
                      const totalLength = pathRef.getTotalLength();

                      // Calculate and store points at 20%, 50%, and 80% along the path
                      [0.2, 0.5, 0.8].forEach((progress) => {
                        const point = pathRef.getPointAtLength(
                          totalLength * progress
                        );
                        const progressKey = Math.floor(progress * 100);

                        // Update CSS variables to store path coordinates
                        document.documentElement.style.setProperty(
                          `--x-arrow-${connection.id}-progress-${progressKey}`,
                          `${point.x}px`
                        );
                        document.documentElement.style.setProperty(
                          `--y-arrow-${connection.id}-progress-${progressKey}`,
                          `${point.y}px`
                        );
                      });
                    },
                  }}
                  // Custom SVG styles
                  SVGcanvasStyle={{
                    filter:
                      hoveredBox === connection.start ||
                      hoveredBox === connection.end
                        ? `drop-shadow(0 0 3px ${color})`
                        : "none",
                  }}
                />

                {/* Data flow points along the path */}
                {createDataPoints(connection, color)}

                {/* Technical measurement display */}
                {renderTechnicalDisplay(connection, color)}
              </React.Fragment>
            );
          })}
        </AnimatePresence>
      </Xwrapper>
    </div>
  );
};

export default memo(XArrowConnectors);
