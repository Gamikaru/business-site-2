// src/app/home/components/subheadline/XArrowConnectors.tsx
"use client";

import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimationPreferences } from "@/components/core/Animations";
import { AccentColors } from "./SubheadlineTypes";
import { getConnectorColor } from "./utils/ConnectorUtils";
import ConnectorDataPoint from "./components/ConnectorDataPoint";
import { Text } from "@/components/common/Typography";

// Advanced connector configurations with technical aesthetic
const CONNECTOR_CONFIGS = [
  // Box 0 to Box 1 - Top connection
  {
    startId: 0,
    endId: 1,
    startAnchor: "left",
    endAnchor: "top",
    path: "grid",
    curveness: 0.8,
    labels: {
      middle: "data-node",
      startMiddle: "path-start",
      middleEnd: "path-end",
    },
    dashStyle: { strokeLen: 4, nonStrokeLen: 4, animation: 1 },
    dataPoints: [
      { position: 0.4, size: 6, pulseSize: 8 },
      { position: 0.7, size: 4, pulseSize: 6 },
    ],
  },
  // Box 1 to Box 2 - Diagonal connection
  {
    startId: 1,
    endId: 2,
    startAnchor: "bottom",
    endAnchor: "right",
    path: "grid",
    curveness: 0.8,
    labels: {
      middle: "data-node",
      startMiddle: null,
      middleEnd: "path-end",
    },
    dashStyle: { strokeLen: 6, nonStrokeLen: 3, animation: 0.8 },
    dataPoints: [
      { position: 0.3, size: 5, pulseSize: 7 },
      { position: 0.65, size: 3, pulseSize: 5 },
    ],
  },
  // Box 2 to Box 3 - Target connection
  {
    startId: 2,
    endId: 3,
    startAnchor: "left",
    endAnchor: {
      position: "top",
      offset: { x: -30 },
    },
    path: "grid",
    curveness: 0.8,
    labels: {
      middle: "data-node",
      startMiddle: "path-mid",
      middleEnd: "path-end",
    },
    dashStyle: { strokeLen: 5, nonStrokeLen: 4, animation: 1.2 },
    dataPoints: [
      { position: 0.2, size: 4, pulseSize: 6 },
      { position: 0.5, size: 6, pulseSize: 9 },
      { position: 0.8, size: 3, pulseSize: 5 },
    ],
  },
];

interface XArrowConnectorsProps {
  boxRefs: React.RefObject<HTMLDivElement>[];
  hoveredBox: number | null;
  accentColors: AccentColors;
  animationProgress: number;
}

const XArrowConnectors: React.FC<XArrowConnectorsProps> = ({
  boxRefs,
  hoveredBox,
  accentColors,
  animationProgress,
}) => {
  const { shouldAnimate, reducedMotion, performance } = useAnimationPreferences();
  const [isVisible, setIsVisible] = useState(false);
  const [activeConnections, setActiveConnections] = useState<number[]>([]);

  // Progressive reveal for connectors based on animation progress
  useEffect(() => {
    if (animationProgress <= 0.5) {
      setActiveConnections([]);
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // Calculate which connections should be active based on progress
    const newConnections = [];
    if (animationProgress > 0.6) newConnections.push(0);
    if (animationProgress > 0.7) newConnections.push(1);
    if (animationProgress > 0.8) newConnections.push(2);

    setActiveConnections(newConnections);
  }, [animationProgress]);

  // Skip rendering for reduced motion or low performance
  if (reducedMotion || performance === "low" || !shouldAnimate() || !isVisible) {
    return null;
  }

  // Helper to generate keyframe animation value
  const getAnimationDelay = (index: number) => {
    return 0.3 + index * 0.15; // Staggered animation
  };

  // Technical coordinate formatter for annotations
  const formatCoordinate = (val: number) => Math.round(val).toString();

  return (
    <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
      <Xwrapper>
        {CONNECTOR_CONFIGS.map((config, index) => {
          // Only render active connections
          if (!activeConnections.includes(index)) return null;

          // Determine if this connection is highlighted
          const isHighlighted =
            hoveredBox === config.startId ||
            hoveredBox === config.endId;

          // Get connection color based on status
          const connectionColor = getConnectorColor(
            config.startId,
            config.endId,
            hoveredBox,
            accentColors,
            animationProgress
          );

          // Get glow color (slightly transparent version of main color)
          const glowColor = connectionColor.replace(
            /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/,
            'rgba($1, $2, $3, 0.3)'
          );

          // Determine if dashes should be animated
          const dashAnimation = isHighlighted ? config.dashStyle.animation : 0;

          return (
            <React.Fragment key={`connector-${config.startId}-${config.endId}`}>
              {/* Glow layer for depth */}
              <Xarrow
                start={boxRefs[config.startId]}
                end={boxRefs[config.endId]}
                startAnchor={config.startAnchor}
                endAnchor={config.endAnchor}
                color={glowColor}
                strokeWidth={isHighlighted ? 6 : 4}
                path={config.path}
                curveness={config.curveness}
                showHead={false}
                animateDrawing={animationProgress > 0.6 ? getAnimationDelay(index) : 0}
                zIndex={9}
                SVGcanvasProps={{
                  className: "connector-glow-layer",
                  style: { filter: "blur(3px)" }
                }}
              />

              {/* Main connector */}
              <Xarrow
                start={boxRefs[config.startId]}
                end={boxRefs[config.endId]}
                startAnchor={config.startAnchor}
                endAnchor={config.endAnchor}
                color={connectionColor}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                headSize={isHighlighted ? 5 : 3}
                path={config.path}
                curveness={config.curveness}
                dashness={
                  isHighlighted
                    ? {
                        strokeLen: config.dashStyle.strokeLen,
                        nonStrokeLen: config.dashStyle.nonStrokeLen,
                        animation: dashAnimation
                      }
                    : false
                }
                showHead={isHighlighted}
                animateDrawing={animationProgress > 0.6 ? getAnimationDelay(index) : 0}
                zIndex={10}
                SVGcanvasProps={{ className: "connector-main-layer" }}

                // Add technical labels when highlighted
                labels={
                  isHighlighted
                    ? {
                        // Origin point annotation
                        start: (
                          <div className="connection-label origin-label">
                            <Text as="span" family="code" size="xs" className="text-[8px] opacity-70">
                              o:{formatCoordinate(config.startId * 10)}
                            </Text>
                          </div>
                        ),
                        // Data point with pulse animation
                        middle: (
                          <ConnectorDataPoint
                            color={connectionColor}
                            size={6}
                            pulseSize={9}
                            pulseOpacity={0.6}
                            duration={2}
                            active={isHighlighted}
                          />
                        ),
                        // Endpoint annotation
                        end: (
                          <div className="connection-label target-label">
                            <Text as="span" family="code" size="xs" className="text-[8px] opacity-70">
                              t:{formatCoordinate(config.endId * 12)}
                            </Text>
                          </div>
                        ),
                      }
                    : undefined
                }
              />

              {/* Data points along path */}
              {isHighlighted && config.dataPoints.map((point, dpIndex) => (
                <AnimatePresence key={`data-point-${index}-${dpIndex}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: 0.2 + dpIndex * 0.1, duration: 0.3 }}
                    className="absolute"
                    style={{
                      // These values would need to be dynamically calculated
                      // based on the actual path in a real implementation
                      top: `calc(50% + ${-50 + dpIndex * 30}px)`,
                      left: `calc(50% + ${-80 + config.startId * 40 + dpIndex * 45}px)`,
                      zIndex: 15
                    }}
                  >
                    <ConnectorDataPoint
                      color={connectionColor}
                      size={point.size}
                      pulseSize={point.pulseSize}
                      pulseOpacity={0.5}
                      duration={1.5 + dpIndex * 0.5}
                      active={true}
                    />
                  </motion.div>
                </AnimatePresence>
              ))}
            </React.Fragment>
          );
        })}
      </Xwrapper>
    </div>
  );
};

export default memo(XArrowConnectors);