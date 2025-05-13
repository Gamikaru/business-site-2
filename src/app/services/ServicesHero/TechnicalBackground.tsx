// src/components/services/TechnicalBackground.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { MotionValue } from "framer-motion";

interface TechnicalBackgroundProps {
  mousePosition: { x: number; y: number };
  gridOpacity: MotionValue<number>;
  themeColors: {
    brandPrimary: string;
    accentOceanic: string;
    [key: string]: string;
  };
  reducedMotion?: boolean;
}

const TechnicalBackground: React.FC<TechnicalBackgroundProps> = ({
  mousePosition,
  gridOpacity,
  themeColors,
  reducedMotion = false,
}) => {
  // Animation controls for sequential animations
  const controls = useAnimation();
  const [rendered, setRendered] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Get actual opacity value from motion value
  const [opacity, setOpacity] = useState(0.15);
  useEffect(() => {
    const unsubscribe = gridOpacity.onChange(v => setOpacity(v));
    return unsubscribe;
  }, [gridOpacity]);

  // Animate elements sequentially on mount
  useEffect(() => {
    if (!reducedMotion) {
      const sequence = async () => {
        await controls.start("mainGrid");
        await controls.start("secondaryElements");
        await controls.start("dynamicElements");
        setRendered(true);
      };
      sequence();
    } else {
      controls.set("visible");
      setRendered(true);
    }
  }, [controls, reducedMotion]);

  // Ensure grid is visible across all themes
  const gridLineColor = themeColors.gridLines || themeColors.accentOceanic;
  const primaryColor = themeColors.brandPrimary;
  const textColor = themeColors.accentOceanic;
  const bgPrimary = "rgba(0, 0, 0, 0.3)"; // Semi-transparent background that works across themes

  // Calculate dynamic coordinates directly from mousePosition
  const getDynamicX1 = () => 30 + mousePosition.x * 40;
  const getDynamicY1 = () => 30 + mousePosition.y * 40;
  const getDynamicX2 = () => 70 - mousePosition.x * 40;
  const getDynamicY2 = () => 70 - mousePosition.y * 40;

  // Generate random data points for technical display
  const dataPoints = useRef(Array.from({ length: 8 }, (_, i) => ({
    x: 10 + i * 10 + Math.random() * 5,
    y: 20 + Math.random() * 60,
    value: Math.floor(Math.random() * 100),
  }))).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main grid blueprint */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: opacity * 1.5 }} // Increased base opacity
      >
        {/* Background pattern */}
        <defs>
          <pattern
            id="smallGrid"
            width="2"
            height="2"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 2 0 L 0 0 0 2"
              fill="none"
              stroke={gridLineColor}
              strokeWidth="0.2"
              strokeOpacity="0.5" // Increased opacity for better visibility
            />
          </pattern>
          <pattern
            id="grid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect width="10" height="10" fill="url(#smallGrid)" />
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke={gridLineColor}
              strokeWidth="0.5" // Increased from 0.3
              strokeOpacity="0.6" // Increased for better visibility
            />
          </pattern>
        </defs>

        {/* Main grid */}
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#grid)"
          variants={{
            hidden: { opacity: 0 },
            mainGrid: { opacity: 1 },
            visible: { opacity: 1 }
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 1 }}
        />

        {/* Major grid lines */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            mainGrid: { opacity: 1 },
            visible: { opacity: 1 }
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Vertical major lines */}
          {Array.from({ length: 11 }).map((_, i) => (
            <motion.line
              key={`v-${i}`}
              x1={`${i * 10}`}
              y1="0"
              x2={`${i * 10}`}
              y2="100"
              stroke={gridLineColor}
              strokeWidth={i % 5 === 0 ? "1" : "0.6"} // Increased for visibility
              strokeOpacity={i % 5 === 0 ? "0.8" : "0.6"} // Increased for visibility
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
            />
          ))}

          {/* Horizontal major lines */}
          {Array.from({ length: 11 }).map((_, i) => (
            <motion.line
              key={`h-${i}`}
              x1="0"
              y1={`${i * 10}`}
              x2="100"
              y2={`${i * 10}`}
              stroke={gridLineColor}
              strokeWidth={i % 5 === 0 ? "1" : "0.6"} // Increased for visibility
              strokeOpacity={i % 5 === 0 ? "0.8" : "0.6"} // Increased for visibility
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
            />
          ))}
        </motion.g>

        {/* Grid measurements and markers */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            secondaryElements: { opacity: 1 },
            visible: { opacity: 1 }
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          {/* X-axis measurements */}
          {Array.from({ length: 11 }).map((_, i) => (
            <g key={`xMark-${i}`}>
              <text
                x={`${i * 10}`}
                y="99"
                textAnchor="middle"
                fill={textColor}
                fontSize="2.2" // Increased size for visibility
                fontFamily="monospace"
                opacity="0.9" // Increased for visibility
              >
                {i * 10}
              </text>
              <line
                x1={`${i * 10}`}
                y1="97"
                x2={`${i * 10}`}
                y2="95"
                stroke={textColor}
                strokeWidth="0.5" // Increased for visibility
                strokeOpacity="0.9" // Increased for visibility
              />
            </g>
          ))}

          {/* Y-axis measurements */}
          {Array.from({ length: 11 }).map((_, i) => (
            <g key={`yMark-${i}`}>
              <text
                x="1.5"
                y={`${i * 10 + 0.6}`}
                textAnchor="start"
                fill={textColor}
                fontSize="2.2" // Increased size for visibility
                fontFamily="monospace"
                opacity="0.9" // Increased for visibility
              >
                {i * 10}
              </text>
              <line
                x1="3"
                y1={`${i * 10}`}
                x2="5"
                y2={`${i * 10}`}
                stroke={textColor}
                strokeWidth="0.5" // Increased for visibility
                strokeOpacity="0.9" // Increased for visibility
              />
            </g>
          ))}
        </motion.g>

        {/* Technical highlight areas */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            secondaryElements: { opacity: 1 },
            visible: { opacity: 1 }
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.8, delay: 2 }}
        >
          {/* Quadrant indicators */}
          <text
            x="5"
            y="5"
            fill={primaryColor}
            fontSize="2.8" // Increased size
            fontFamily="monospace"
            opacity="1" // Full opacity
          >
            Q1
          </text>
          <text
            x="95"
            y="5"
            textAnchor="end"
            fill={primaryColor}
            fontSize="2.8" // Increased size
            fontFamily="monospace"
            opacity="1" // Full opacity
          >
            Q2
          </text>
          <text
            x="5"
            y="95"
            fill={primaryColor}
            fontSize="2.8" // Increased size
            fontFamily="monospace"
            opacity="1" // Full opacity
          >
            Q3
          </text>
          <text
            x="95"
            y="95"
            textAnchor="end"
            fill={primaryColor}
            fontSize="2.8" // Increased size
            fontFamily="monospace"
            opacity="1" // Full opacity
          >
            Q4
          </text>

          {/* Corner decorations */}
          <path
            d="M0,10 L0,0 L10,0"
            fill="none"
            stroke={primaryColor}
            strokeWidth="0.8" // Increased width
            strokeOpacity="1" // Full opacity
          />
          <path
            d="M90,0 L100,0 L100,10"
            fill="none"
            stroke={primaryColor}
            strokeWidth="0.8" // Increased width
            strokeOpacity="1" // Full opacity
          />
          <path
            d="M0,90 L0,100 L10,100"
            fill="none"
            stroke={primaryColor}
            strokeWidth="0.8" // Increased width
            strokeOpacity="1" // Full opacity
          />
          <path
            d="M90,100 L100,100 L100,90"
            fill="none"
            stroke={primaryColor}
            strokeWidth="0.8" // Increased width
            strokeOpacity="1" // Full opacity
          />
        </motion.g>

        {/* Dynamic elements that respond to mouse movement */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            dynamicElements: { opacity: 1 },
            visible: { opacity: 1 }
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          {/* Main focus area */}
          <motion.rect
            x={getDynamicX1()}
            y={getDynamicY1()}
            width={getDynamicX2() - getDynamicX1()}
            height={getDynamicY2() - getDynamicY1()}
            fill="none"
            stroke={primaryColor}
            strokeWidth="1" // Increased width
            strokeOpacity="0.7" // Increased opacity
            strokeDasharray="2 1"
            animate={{
              x: getDynamicX1(),
              y: getDynamicY1(),
              width: getDynamicX2() - getDynamicX1(),
              height: getDynamicY2() - getDynamicY1(),
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Data points along path */}
          {dataPoints.map((point, i) => (
            <motion.g key={`dataPoint-${i}`} opacity="1"> {/* Full opacity */}
              <motion.circle
                cx={point.x}
                cy={point.y + (mousePosition.y * 5 * (i % 3 - 1))}
                r="1.2" // Increased size
                fill={i % 2 === 0 ? primaryColor : gridLineColor}
                animate={{
                  cy: point.y + (mousePosition.y * 5 * (i % 3 - 1)),
                }}
                transition={{ duration: 0.5 }}
              />
              <motion.text
                x={point.x + 1.5}
                y={point.y + (mousePosition.y * 5 * (i % 3 - 1)) - 1}
                fill={i % 2 === 0 ? primaryColor : gridLineColor}
                fontSize="2" // Increased size
                fontFamily="monospace"
                animate={{
                  y: point.y + (mousePosition.y * 5 * (i % 3 - 1)) - 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {point.value}
              </motion.text>
            </motion.g>
          ))}
        </motion.g>

        {/* Additional technical details */}
        {rendered && !reducedMotion && (
          <>
            {/* Origin marker */}
            <circle
              cx="0"
              cy="0"
              r="2" // Increased size
              fill={primaryColor}
              opacity="1" // Full opacity
            />
            <text
              x="2.5"
              y="3"
              fill={primaryColor}
              fontSize="2.5" // Increased size
              fontFamily="monospace"
              opacity="1" // Full opacity
            >
              (0,0)
            </text>

            {/* Technical labels */}
            <g opacity="1"> {/* Full opacity */}
              <rect
                x="45"
                y="2"
                width="10"
                height="3"
                fill={bgPrimary}
                stroke={gridLineColor}
                strokeWidth="0.5" // Increased width
              />
              <text
                x="50"
                y="4"
                textAnchor="middle"
                fill={textColor}
                fontSize="2.2" // Increased size
                fontFamily="monospace"
              >
                GRID
              </text>
            </g>

            {/* Animated measurement lines */}
            <motion.line
              x1="20"
              y1="80"
              x2="80"
              y2="80"
              stroke={gridLineColor}
              strokeWidth="0.5" // Increased width
              strokeDasharray="1 1"
              initial={{ opacity: 0.5 }} // Increased initial opacity
              animate={{
                opacity: [0.5, 1, 0.5], // Increased opacity range
                y1: [80, 80 + (mousePosition.y * 5), 80],
                y2: [80, 80 + (mousePosition.y * 5), 80],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
            <motion.line
              x1="20"
              y1="20"
              x2="20"
              y2="80"
              stroke={gridLineColor}
              strokeWidth="0.5" // Increased width
              strokeDasharray="1 1"
              initial={{ opacity: 0.5 }} // Increased initial opacity
              animate={{
                opacity: [0.5, 1, 0.5], // Increased opacity range
                x1: [20, 20 + (mousePosition.x * 5), 20],
                x2: [20, 20 + (mousePosition.x * 5), 20],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
          </>
        )}
      </svg>

      {/* Secondary animated elements */}
      {rendered && !reducedMotion && (
        <div className="absolute inset-0">
          {/* Upper right technical info */}
          <motion.div
            className="absolute top-8 right-8 font-mono text-xs border px-2 py-1 backdrop-blur-sm"
            style={{
              color: textColor,
              borderColor: `${textColor}80`, // 50% opacity version of the text color
              backgroundColor: bgPrimary,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }} // Full opacity
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            SYS.INIT
          </motion.div>

          {/* Lower left coordinates */}
          <motion.div
            className="absolute bottom-8 left-8 font-mono text-xs"
            style={{ color: textColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} // Full opacity
            transition={{ delay: 2.7, duration: 0.5 }}
          >
            GRID.COORD [
            {mousePosition.x.toFixed(2)}, {mousePosition.y.toFixed(2)}]
          </motion.div>

          {/* Center pulse beacon */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full" // Increased size
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 0 20px ${primaryColor}`, // Increased glow effect
            }}
            animate={{
              opacity: [0.3, 1, 0.3], // Increased opacity range
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        </div>
      )}

      {/* Animated floating particles - more visible */}
      {rendered && !reducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${(i % 3) + 2}px`, // Increased size
                height: `${(i % 3) + 2}px`, // Increased size
                backgroundColor: i % 2 === 0 ? primaryColor : gridLineColor,
                left: `${(i * 7) % 100}%`,
                top: `${(i * 11) % 100}%`,
              }}
              animate={{
                x: [0, (i % 5 - 2) * 50, 0],
                y: [0, (i % 3 - 1) * 30, 0],
                opacity: [0.5, 1, 0.5], // Increased opacity range
              }}
              transition={{
                duration: 15 + i,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
          ))}
        </div>
      )}

      {/* Noise overlay for texture with better visibility */}
      <div
        className="absolute inset-0 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.7'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          opacity: 0.25, // Increased opacity
        }}
      />
    </div>
  );
};

export default TechnicalBackground;