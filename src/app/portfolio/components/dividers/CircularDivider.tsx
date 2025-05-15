"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/classNames";
import { useAnimationPreferences } from "@/components/core/Animations";

interface CircularDividerProps {
  className?: string;
  height?: number;
  nodeColor?: string;
  lineColor?: string;
  backgroundColor?: string;
  density?: "low" | "medium" | "high";
}

const CircularDivider: React.FC<CircularDividerProps> = ({
  className,
  height = 160,
  nodeColor,
  lineColor,
  backgroundColor,
  density = "medium",
}) => {
  const { shouldAnimate } = useAnimationPreferences();
  const dividerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(dividerRef, { once: false, margin: "-10% 0px" });
  const [uniqueId] = useState(`circles-${Math.floor(Math.random() * 10000)}`);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);
  const [glitchActive, setGlitchActive] = useState(false);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: dividerRef,
    offset: ["start end", "end start"],
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const circleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  // Use props or fallback to CSS variables
  const primaryColor = nodeColor || "var(--color-accent-primary)";
  const secondaryColor = lineColor || "var(--color-accent-cosmic)";
  const bgColor = backgroundColor || "var(--color-bg-tertiary)";

  // Determine number of nodes based on density
  const getNodesCount = () => {
    switch (density) {
      case "low": return 8;
      case "high": return 18;
      case "medium":
      default: return 12;
    }
  };

  const nodesCount = getNodesCount();

  // Generate circle nodes with neobrutalist positioning
  const generateNodes = () => {
    const nodes = [];
    const centerY = 50;

    for (let i = 0; i < nodesCount; i++) {
      // Create deliberate offset pattern for neobrutalist style
      const isSpecialNode = i % 3 === 0;
      const horizontalSpacing = 1200 / (nodesCount - 1);

      // Create asymmetrical positioning
      const xPos = i * horizontalSpacing;
      const yOffset = isSpecialNode ? 25 : (i % 4 === 0 ? -20 : (i % 2 === 0 ? 15 : -10));
      const yPos = centerY + yOffset;

      // Vary sizes dramatically for neobrutalist effect
      const baseSize = isSpecialNode ? 22 : (i % 2 === 0 ? 12 : 8);
      const size = baseSize + (i % 5) * 2;

      // Intentionally irregular border thickness
      const strokeWidth = isSpecialNode ? 4 : (i % 4 === 0 ? 3 : 2);

      // Alternate colors in a non-uniform pattern
      const fillColor = i % 5 === 0 ? primaryColor :
                       (i % 3 === 0 ? secondaryColor :
                       (i % 2 === 0 ? "var(--color-accent-warm)" : "var(--color-accent-oceanic)"));

      // Deliberately offset and inconsistent labels
      const showLabel = i % 3 === 0 || i === 0 || i === nodesCount - 1;

      nodes.push({
        id: i,
        cx: xPos,
        cy: yPos,
        r: size,
        strokeWidth,
        fillColor,
        showLabel,
        specialNode: isSpecialNode,
        label: `N${i.toString().padStart(2, '0')}`,
        labelOffset: i % 2 === 0 ? -20 : 20
      });
    }

    return nodes;
  };

  const circleNodes = generateNodes();

  // Generate deliberately crude connectors between nodes
  const generateConnectors = () => {
    const connectors = [];

    for (let i = 0; i < circleNodes.length - 1; i++) {
      // Skip some connections for an unrefined look
      if (i % 4 === 3) continue;

      const start = circleNodes[i];
      const end = circleNodes[i + 1];

      // Create zigzag paths instead of straight lines for some connectors
      const isZigzag = i % 3 === 0;
      let path;

      if (isZigzag) {
        const midX = (start.cx + end.cx) / 2;
        const midY = (start.cy + end.cy) / 2 + (i % 2 === 0 ? 20 : -20);
        path = `M${start.cx},${start.cy} L${midX},${midY} L${end.cx},${end.cy}`;
      } else {
        path = `M${start.cx},${start.cy} L${end.cx},${end.cy}`;
      }

      const strokeWidth = i % 5 === 0 ? 3 : (i % 3 === 0 ? 2 : 1);
      const strokeDasharray = i % 2 === 0 ? "none" : (i % 3 === 0 ? "8 4" : "4 2");

      connectors.push({
        id: i,
        path,
        strokeWidth,
        strokeDasharray,
        isZigzag,
        strokeColor: i % 3 === 0 ? primaryColor :
                    (i % 2 === 0 ? secondaryColor : "var(--color-accent-warm)")
      });
    }

    // Add a few cross-connections for complexity
    const crossConnections = 3;
    for (let i = 0; i < crossConnections; i++) {
      const startIdx = Math.floor(Math.random() * (circleNodes.length / 2));
      const endIdx = Math.floor(Math.random() * (circleNodes.length / 2)) + Math.floor(circleNodes.length / 2);

      const start = circleNodes[startIdx];
      const end = circleNodes[endIdx];

      connectors.push({
        id: circleNodes.length + i,
        path: `M${start.cx},${start.cy} L${end.cx},${end.cy}`,
        strokeWidth: 1,
        strokeDasharray: "3 2 1 2",
        isZigzag: false,
        strokeColor: "var(--color-accent-oceanic)"
      });
    }

    return connectors;
  };

  const connectors = generateConnectors();

  // Periodically activate a random node and trigger glitch effect
  useEffect(() => {
    if (!shouldAnimate() || !isInView) return;

    const interval = setInterval(() => {
      setActiveNodeIndex(Math.floor(Math.random() * circleNodes.length));

      // Sometimes trigger glitch effect
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [shouldAnimate, isInView, circleNodes.length]);

  return (
    <div
      ref={dividerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: `${height}px`, backgroundColor: bgColor }}
      aria-hidden="true"
    >
      {/* SVG Defs for filters */}
      <svg width="0" height="0">
        <defs>
          {/* Noise texture filter for neobrutalist effect */}
          <filter id={`${uniqueId}-noise`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
            <feComposite operator="in" in2="SourceGraphic" result="monoNoise" />
            <feBlend in="SourceGraphic" in2="monoNoise" mode="overlay" />
          </filter>

          {/* Digital glitch filter */}
          <filter id={`${uniqueId}-glitch`}>
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="original"
            />
            <feOffset dx="-3" dy="0" result="offsetRed" />
            <feColorMatrix
              in="offsetRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />
            <feOffset dx="3" dy="0" result="offsetBlue" />
            <feColorMatrix
              in="offsetBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />
            <feOffset dx="0" dy="3" result="offsetGreen" />
            <feColorMatrix
              in="offsetGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />
            <feBlend mode="screen" in="red" in2="blue" result="blend1" />
            <feBlend mode="screen" in="blend1" in2="green" result="blend" />
          </filter>

          {/* Rough edge filter */}
          <filter id={`${uniqueId}-rough`}>
            <feTurbulence baseFrequency="0.05" numOctaves="2" seed="5" />
            <feDisplacementMap in="SourceGraphic" scale="5" />
          </filter>
        </defs>
      </svg>

      {/* Background texture */}
      <motion.div
        className="absolute inset-0 bg-dots"
        style={{ opacity: backgroundOpacity }}
      />

      {/* Horizontal axis line - deliberately imperfect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-divider z-10"
        style={{ top: '50%', filter: glitchActive ? `url(#${uniqueId}-rough)` : 'none' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* Main SVG container */}
      <motion.svg
        className="absolute w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 100"
        fill="none"
        style={{
          filter: glitchActive ? `url(#${uniqueId}-glitch)` : 'none',
          scale: circleScale
        }}
      >
        {/* Connection lines */}
        {connectors.map((connector) => (
          <motion.path
            key={`connector-${connector.id}`}
            d={connector.path}
            stroke={connector.strokeColor}
            strokeWidth={connector.strokeWidth}
            strokeDasharray={connector.strokeDasharray === "none" ? undefined : connector.strokeDasharray}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: isInView ? 1 : 0,
              opacity: isInView ? (glitchActive ? [0.4, 0.8, 0.4] : 0.6) : 0
            }}
            transition={{
              duration: connector.isZigzag ? 1.2 : 0.8,
              delay: 0.3 + connector.id * 0.05,
              opacity: { duration: 0.3 }
            }}
          />
        ))}

        {/* Circle nodes */}
        {circleNodes.map((node) => (
          <React.Fragment key={`node-${node.id}`}>
            {/* Main circle */}
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill="transparent"
              stroke={node.specialNode ? node.fillColor : "none"}
              strokeWidth={node.strokeWidth}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isInView ? (activeNodeIndex === node.id ? 1 : 0.8) : 0,
                scale: isInView ? (activeNodeIndex === node.id ? 1.1 : 1) : 0,
                strokeWidth: activeNodeIndex === node.id ? node.strokeWidth * 1.5 : node.strokeWidth
              }}
              transition={{
                duration: 0.5,
                delay: 0.1 + node.id * 0.04,
                scale: { duration: 0.3 }
              }}
            />

            {/* Filled circle with neobrutalist styling */}
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r={node.r - (node.specialNode ? node.strokeWidth : 0)}
              fill={node.fillColor}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isInView ? (activeNodeIndex === node.id ? 1 : 0.7) : 0,
                scale: isInView ? (activeNodeIndex === node.id ? 1.05 : 1) : 0
              }}
              transition={{
                duration: 0.5,
                delay: 0.15 + node.id * 0.04
              }}
              style={{
                filter: node.specialNode ? `url(#${uniqueId}-noise)` : 'none'
              }}
            />

            {/* Label with deliberately crude styling */}
            {node.showLabel && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 0.8 : 0 }}
                transition={{ duration: 0.3, delay: 0.5 + node.id * 0.05 }}
              >
                <rect
                  x={node.cx - 15}
                  y={node.cy + node.labelOffset - 10}
                  width="30"
                  height="16"
                  fill="black"
                  fillOpacity="0.7"
                />
                <text
                  x={node.cx}
                  y={node.cy + node.labelOffset}
                  fill="white"
                  fontFamily="monospace"
                  fontSize="10"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {node.label}
                </text>
              </motion.g>
            )}

            {/* Technical measurement line for special nodes */}
            {node.specialNode && (
              <motion.line
                x1={node.cx}
                y1={node.cy + node.r + 5}
                x2={node.cx}
                y2={node.cy + node.r + 15}
                stroke={node.fillColor}
                strokeWidth="2"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: isInView ? 0.8 : 0, scaleY: isInView ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.4 + node.id * 0.05 }}
                style={{ transformOrigin: `${node.cx}px ${node.cy + node.r + 5}px` }}
              />
            )}
          </React.Fragment>
        ))}

        {/* Data flow particles - deliberately crude and exaggerated */}
        {shouldAnimate() && isInView && connectors.filter(c => c.id % 3 === 0).map((connector, i) => {
          const parts = connector.path.split(" ");
          const startPoint = parts[0].substring(1).split(",");
          const endPoint = parts[parts.length - 1].split(",");

          const startX = parseFloat(startPoint[0]);
          const startY = parseFloat(startPoint[1]);
          const endX = parseFloat(endPoint[0]);
          const endY = parseFloat(endPoint[1]);

          return (
            <motion.circle
              key={`particle-${i}`}
              r={connector.id % 5 === 0 ? 6 : 4}
              fill={connector.strokeColor}
              fillOpacity="0.8"
              initial={{ x: startX, y: startY }}
              animate={{
                x: [startX, endX],
                y: [startY, endY],
              }}
              transition={{
                duration: 2,
                delay: 1 + i * 1.5,
                repeat: Infinity,
                repeatDelay: 3 + i,
                ease: "linear"
              }}
            />
          );
        })}
      </motion.svg>

      {/* Technical metadata - deliberately crude placement */}
      <motion.div
        className="absolute top-3 left-4 text-xs font-mono bg-black text-white px-2 py-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <span>NODE.SYSTEM/{nodesCount}</span>
      </motion.div>

      <motion.div
        className="absolute bottom-3 right-4 text-xs font-mono bg-black text-white px-2 py-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <span>{activeNodeIndex !== null ? `ACTIVE/N${activeNodeIndex.toString().padStart(2, '0')}` : "STANDBY"}</span>
      </motion.div>

      {/* Deliberately crude technical element */}
      <motion.div
        className="absolute bottom-0 left-0 w-20 h-20 border-t-4 border-r-4 border-secondary"
        style={{
          borderColor: secondaryColor,
          transform: 'rotate(180deg)',
          filter: glitchActive ? `url(#${uniqueId}-rough)` : 'none'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 0.8 : 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      />
    </div>
  );
};

export default CircularDivider;