'use client'

import React, { memo, useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface MousePosition {
  x: number
  y: number
}

interface RandomData {
  coordinates?: { x: number; y: number }
  spectrumValue: number
  systemLoad?: number
}

interface AccentColors {
  primary: string
  secondary: string
  tertiary?: string
  warm?: string
  contrast?: string
  oceanic?: string
  cosmic?: string
  brand: string
}

interface HomeHeroDataVizProps {
  mousePosition: MousePosition
  randomData: RandomData
  accentColors: AccentColors
}

// Tech-inspired terminal commands for display
const techCommands = [
  "$ init system",
  "$ analyze data",
  "$ scanning network",
  "$ check status",
  "$ optimize code",
  "$ execute solution"
];

const HomeHeroDataViz: React.FC<HomeHeroDataVizProps> = ({
  mousePosition,
  randomData,
  accentColors
}) => {
  // State for animated elements
  const [activeCommand, setActiveCommand] = useState(0);
  const [nodeConnections, setNodeConnections] = useState<{from: number, to: number}[]>([]);
  const controls = useAnimation();

  // Create dynamic node connections when mouse position changes
  useEffect(() => {
    const generateConnections = () => {
      const newConnections = [];
      const nodeCount = 7;

      // Main dynamic connection influenced by mouse
      const targetNode = Math.floor(mousePosition.x * nodeCount);
      newConnections.push({from: nodeCount - 1, to: targetNode});

      // Additional static connections
      for (let i = 0; i < nodeCount - 2; i++) {
        if (Math.random() > 0.3) {
          newConnections.push({
            from: i,
            to: Math.min(i + 1 + Math.floor(Math.random() * 2), nodeCount - 1)
          });
        }
      }

      setNodeConnections(newConnections);
    };

    generateConnections();

    // Trigger animations
    controls.start({
      opacity: [0.2, 1, 0.2],
      transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
    });

  }, [mousePosition.x, mousePosition.y, controls]);

  // Cycle through terminal commands
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCommand(prev => (prev + 1) % techCommands.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="relative h-full"
    >
      {/* Main container with glass backdrop */}
      <div
        className="h-full rounded-sm relative border overflow-hidden"
        style={{
          borderColor: `${accentColors.secondary}40`,
          backgroundColor: "var(--color-glass-bg)",
          backdropFilter: "blur(8px)"
        }}
      >
        {/* Header bar */}
        <div className="px-3 py-2 border-b flex items-center justify-between"
             style={{ borderColor: `${accentColors.secondary}40` }}>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accentColors.primary }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accentColors.secondary }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            />
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: `${accentColors.tertiary || accentColors.warm}` }} />
          </div>
          <div className="text-[9px] font-mono" style={{ color: accentColors.primary }}>
            EXECUTION FLOW
          </div>
        </div>

        {/* Content area */}
        <div className="p-3 flex flex-col h-[calc(100%-38px)]">
          {/* Network graph */}
          <div className="relative flex-1 mb-3">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              {/* Grid background */}
              <motion.g opacity="0.2">
                {[0, 20, 40, 60, 80, 100].map((pos) => (
                  <React.Fragment key={`grid-${pos}`}>
                    <line
                      x1="0" y1={pos} x2="100" y2={pos}
                      stroke={accentColors.secondary}
                      strokeWidth="0.2"
                      strokeDasharray="1 2"
                    />
                    <line
                      x1={pos} y1="0" x2={pos} y2="100"
                      stroke={accentColors.secondary}
                      strokeWidth="0.2"
                      strokeDasharray="1 2"
                    />
                  </React.Fragment>
                ))}
              </motion.g>

              {/* Network connections */}
              {nodeConnections.map((connection, i) => {
                // Calculate node positions
                const fromX = 15 + (connection.from * 70 / 6);
                const fromY = 30 + (connection.from % 3) * 20;
                const toX = 15 + (connection.to * 70 / 6);
                const toY = 30 + (connection.to % 3) * 20;

                return (
                  <motion.line
                    key={`connection-${i}`}
                    x1={fromX} y1={fromY}
                    x2={toX} y2={toY}
                    stroke={i === 0 ? accentColors.brand : accentColors.secondary}
                    strokeWidth={i === 0 ? 0.8 : 0.4}
                    strokeDasharray={i === 0 ? "none" : "2 1"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                );
              })}

              {/* Network nodes */}
              {Array.from({ length: 7 }).map((_, i) => {
                const x = 15 + (i * 70 / 6);
                const y = 30 + (i % 3) * 20;

                return (
                  <motion.g key={`node-${i}`}>
                    <motion.circle
                      cx={x} cy={y} r={i === 3 ? 3 : 2}
                      fill="none"
                      stroke={i === 3 ? accentColors.brand : accentColors.secondary}
                      strokeWidth="0.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                    />
                    {i === 3 && (
                      <motion.circle
                        cx={x} cy={y} r={5}
                        fill="none"
                        stroke={accentColors.brand}
                        strokeWidth="0.2"
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          delay: 0.5,
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    )}
                  </motion.g>
                );
              })}

              {/* Mouse tracker */}
              <motion.circle
                cx={mousePosition.x * 100}
                cy={mousePosition.y * 50 + 50}
                r="3"
                fill="none"
                stroke={accentColors.tertiary || accentColors.warm}
                strokeWidth="0.4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
              />

              {/* Data paths */}
              <motion.path
                d={`M10,70 Q${30 + mousePosition.x * 40},${75 - mousePosition.y * 20} ${90},70`}
                stroke={accentColors.primary}
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="3 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />

              {/* Analytics representation */}
              <motion.path
                d="M15,80 L25,70 L35,75 L45,65 L55,72 L65,60 L75,68 L85,58"
                stroke={accentColors.secondary}
                strokeWidth="0.6"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />

              {/* Spectrum data representation */}
              {Array.from({ length: 10 }).map((_, i) => {
                const height = 10 + (Math.sin(i * 0.8) * 6) + (Math.sin(randomData.spectrumValue / 20 + i) * 5);

                return (
                  <motion.rect
                    key={`spectrum-${i}`}
                    x={15 + i * 8}
                    y={90 - height}
                    width="3"
                    height={height}
                    fill={accentColors.primary + "40"}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      delay: 0.8 + (i * 0.05),
                      duration: 0.4,
                      type: "spring"
                    }}
                    style={{ transformOrigin: "bottom" }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Terminal section */}
          <div className="h-24 border rounded-sm overflow-hidden"
               style={{ borderColor: `${accentColors.secondary}40` }}>
            <div className="bg-black bg-opacity-20 h-full p-2 font-mono text-[11px]" style={{ color: accentColors.primary }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {/* Terminal header */}
                <div className="opacity-70 mb-1">&#62; system.initialize()</div>
                <div className="opacity-70">&#62; connecting_modules...</div>

                {/* Dynamic command display */}
                <motion.div
                  className="mt-2"
                  key={activeCommand}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {techCommands[activeCommand]}
                </motion.div>

                {/* Current status display */}
                <div className="mt-2 flex items-center">
                  <span className="mr-2">STATUS:</span>
                  <motion.span
                    style={{ color: accentColors.brand }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    OPERATIONAL
                  </motion.span>
                </div>

                {/* Coordinates from mouse position */}
                <div className="opacity-70 mt-1">
                  POS: {randomData.coordinates?.x || 0},{randomData.coordinates?.y || 0}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute -right-2 -top-2 w-8 h-8 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <motion.path
            d="M32,0 L32,12 L20,0 Z"
            fill={accentColors.brand}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          />
          <motion.circle
            cx="20" cy="12" r="2"
            fill={accentColors.primary}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.6 }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute -left-1 -bottom-1 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.3 }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M0,20 L8,20 L0,12 Z"
            fill={accentColors.tertiary || accentColors.warm}
            opacity="0.7"
          />
        </svg>
      </motion.div>

      {/* Circuit line decorations */}
      <motion.div
        className="absolute -bottom-4 -right-2 h-4 w-24 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 16" fill="none">
          <motion.path
            d="M0,8 L70,8 L70,16 L100,16"
            stroke={accentColors.secondary}
            strokeWidth="1"
            strokeDasharray="3 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
          />
        </svg>
      </motion.div>
    </motion.div>
  )
}

export default memo(HomeHeroDataViz)