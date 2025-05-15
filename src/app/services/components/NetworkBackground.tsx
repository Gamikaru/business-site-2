"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useAnimationPreferences } from "@/components/core/Animations";

interface ConnectorNode {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
  direction: { x: number, y: number };
  pulse: number;
  pulseSpeed: number;
}

interface Connection {
  from: number;
  to: number;
  dashLength: number;
  dashGap: number;
  width: number;
  color: string;
  opacity: number;
  active: boolean;
  lifespan: number;
  maxLifespan: number;
  progress: number; // 0-1 for animation
  gradient?: string;
}

interface NetworkBackgroundProps {
  scrollYProgress: any;
  uniqueId: string;
}

const NetworkBackground: React.FC<NetworkBackgroundProps> = ({
  scrollYProgress,
  uniqueId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<ConnectorNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const { shouldAnimate } = useAnimationPreferences();

  // Mouse interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effect for background
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x, y });
    }
  };

  // Generate nodes and connections
  useEffect(() => {
    if (!shouldAnimate()) return;

    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight * 0.7 : 600;

    // Add event listener for mouse movement
    window.addEventListener('mousemove', handleMouseMove);

    // Generate connector nodes with improved properties
    const nodeCount = Math.min(windowWidth / 60, 40); // More nodes for better connectivity
    const newNodes: ConnectorNode[] = [];

    // Color palette for nodes - data-inspired soft colors
    const nodeColors = [
      'var(--color-accent-primary)',
      'var(--color-accent-secondary)',
      'var(--color-text-secondary)',
      'var(--color-accent-primary)'
    ];

    for (let i = 0; i < nodeCount; i++) {
      // Randomize initial position
      newNodes.push({
        id: i,
        x: Math.random() * windowWidth,
        y: Math.random() * windowHeight,
        size: Math.random() * 3.5 + 1.5, // Smaller nodes for subtlety
        color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
        opacity: Math.random() * 0.6 + 0.15, // Varied opacity
        speed: Math.random() * 0.15 + 0.05, // Very slow, gentle movement
        direction: {
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1
        },
        pulse: Math.random() * Math.PI * 2, // Random starting phase
        pulseSpeed: Math.random() * 0.01 + 0.005 // Very slow pulsation
      });
    }

    setNodes(newNodes);

    // Initial connections
    generateConnections(newNodes, windowWidth, windowHeight);

    // Animation intervals
    const nodeInterval = setInterval(() => {
      setNodes(prevNodes => {
        return prevNodes.map(node => {
          // Use gentle drift patterns for very subtle movement
          const time = Date.now() * 0.0005; // Very slow time scale
          const nodeSpeed = node.speed * 0.5; // Further reduce speed for gentleness

          // Apply very gentle movement with complex path
          const noise1 = Math.sin(time + node.id * 0.7) * nodeSpeed;
          const noise2 = Math.cos(time * 0.8 + node.id * 0.5) * nodeSpeed;

          // Calculate new position with very gentle movement
          const newX = node.x + noise1 + (node.direction.x * nodeSpeed * 0.3);
          const newY = node.y + noise2 + (node.direction.y * nodeSpeed * 0.3);

          // Ensure nodes stay within bounds
          const padding = 10;
          const paddedX = Math.max(padding, Math.min(windowWidth - padding, newX));
          const paddedY = Math.max(padding, Math.min(windowHeight - padding, newY));

          // Gradually change direction when near edges
          const newDirection = {
            x: paddedX !== newX ? -node.direction.x * 0.8 : node.direction.x,
            y: paddedY !== newY ? -node.direction.y * 0.8 : node.direction.y
          };

          // Subtle pulsation effect
          const newPulse = (node.pulse + node.pulseSpeed) % (Math.PI * 2);

          return {
            ...node,
            x: paddedX,
            y: paddedY,
            direction: newDirection,
            pulse: newPulse,
            opacity: node.opacity * (0.92 + 0.08 * Math.sin(newPulse)) // Very subtle opacity pulsation
          };
        });
      });
    }, 30); // More frequent updates for smoother animation

    // Connection update interval - more frequent for smoother transitions
    const connectionInterval = setInterval(() => {
      updateConnections();
    }, 1000); // Update connections every second

    return () => {
      clearInterval(nodeInterval);
      clearInterval(connectionInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [shouldAnimate]);

  // Update connections based on current node positions
  const updateConnections = () => {
    setConnections(prevConnections => {
      // Update existing connections
      const updatedConnections = prevConnections.map(conn => {
        // Progress existing connections (animate in/out)
        if (!conn.active) {
          return {
            ...conn,
            progress: Math.max(0, conn.progress - 0.1), // Fade out
            lifespan: conn.lifespan - 1
          };
        } else {
          return {
            ...conn,
            progress: Math.min(1, conn.progress + 0.1), // Fade in
            lifespan: conn.lifespan - 1,
            active: conn.lifespan > 0
          };
        }
      }).filter(conn => conn.progress > 0);

      // Occasionally generate new connections
      if (Math.random() > 0.5) {
        generateConnections(nodes,
          typeof window !== 'undefined' ? window.innerWidth : 1200,
          typeof window !== 'undefined' ? window.innerHeight * 0.7 : 600,
          updatedConnections
        );
        return updatedConnections;
      }

      return updatedConnections;
    });
  };

  // Dynamic connection generation function
  const generateConnections = (
    currentNodes: ConnectorNode[],
    width: number,
    height: number,
    existingConnections: Connection[] = connections
  ) => {
    // Filter active connections
    const activeConnections = existingConnections.filter(conn =>
      conn.active && conn.lifespan > conn.maxLifespan * 0.2
    );

    const maxConnections = Math.min(currentNodes.length * 0.7, 25); // Limit total connections
    const maxDistance = Math.min(width, height) * 0.25; // Connect nodes within this distance

    const newConnections: Connection[] = [...activeConnections];

    // Map existing connections to avoid duplicates
    const connectionMap = new Set(
      activeConnections.map(conn => `${conn.from}-${conn.to}`)
    );

    // Generate new connections based on proximity
    if (newConnections.length < maxConnections) {
      // Select some random nodes as starting points
      const possibleStartNodes = [...Array(currentNodes.length).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(5, currentNodes.length));

      for (const i of possibleStartNodes) {
        // Skip if we have enough connections already
        if (newConnections.length >= maxConnections) break;

        const nodeA = currentNodes[i];
        if (!nodeA) continue;

        // Find closest nodes to connect to
        const candidateConnections = [...Array(currentNodes.length).keys()]
          .filter(j => j !== i)
          .map(j => ({
            index: j,
            distance: Math.sqrt(
              Math.pow(nodeA.x - currentNodes[j].x, 2) +
              Math.pow(nodeA.y - currentNodes[j].y, 2)
            )
          }))
          .filter(item =>
            item.distance < maxDistance &&
            !connectionMap.has(`${i}-${item.index}`) &&
            !connectionMap.has(`${item.index}-${i}`)
          )
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 2); // Connect to at most 2 nearby nodes

        for (const candidate of candidateConnections) {
          if (Math.random() > 0.7) { // 30% chance to form connection
            const j = candidate.index;
            const isSpecial = Math.random() > 0.85; // Some connections are highlighted

            // Create gradient ID for special connections
            const gradientId = `connection-gradient-${i}-${j}-${uniqueId}`;

            // Add new connection
            newConnections.push({
              from: i,
              to: j,
              dashLength: isSpecial ? 0 : Math.random() * 4 + 1, // Some solid, some dashed
              dashGap: isSpecial ? 0 : Math.random() * 8 + 4,
              width: isSpecial ? Math.random() * 0.7 + 0.3 : Math.random() * 0.5 + 0.1, // Thinner lines
              color: isSpecial ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
              opacity: isSpecial ? Math.random() * 0.3 + 0.1 : Math.random() * 0.15 + 0.05, // More subtle
              active: true,
              lifespan: Math.floor(Math.random() * 10) + 5, // Connection lifetime
              maxLifespan: 15,
              progress: 0, // Start invisible and animate in
              gradient: isSpecial ? gradientId : undefined
            });

            // Mark as connected
            connectionMap.add(`${i}-${j}`);
          }
        }
      }
    }

    setConnections(newConnections);
  };

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ y: parallaxY }}
    >
      {/* SVG Defs for filters and gradients */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={`${uniqueId}-header-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.05" />
            <stop offset="50%" stopColor="var(--color-accent-secondary)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.05" />
          </linearGradient>

          <filter id={`${uniqueId}-glow`}>
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Add radial gradient for node glows */}
          <radialGradient id={`${uniqueId}-node-glow`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
          </radialGradient>

          {/* Create dynamic gradients for connections */}
          {connections.filter(c => c.gradient).map(connection => (
            <linearGradient
              key={connection.gradient}
              id={connection.gradient?.replace(`${uniqueId}-`, '')}
              gradientUnits="userSpaceOnUse"
              x1={nodes[connection.from]?.x / 12 || 0}
              y1={nodes[connection.from]?.y / 6 || 0}
              x2={nodes[connection.to]?.x / 12 || 0}
              y2={nodes[connection.to]?.y / 6 || 0}
            >
              <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--color-accent-secondary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.2" />
            </linearGradient>
          ))}
        </defs>
      </svg>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-secondary" />

      {/* Animated nodes background */}
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Background pattern fill */}
        <rect
          width="100%"
          height="100%"
          fill={`url(#${uniqueId}-header-gradient)`}
        />

        {/* Connections between nodes */}
        {shouldAnimate() && connections.map((connection, index) => {
          const fromNode = nodes[connection.from];
          const toNode = nodes[connection.to];

          if (!fromNode || !toNode) return null;

          // Calculate connection opacity based on lifespan and animation progress
          const opacityFactor = (connection.lifespan / connection.maxLifespan) * connection.progress;
          const finalOpacity = connection.opacity * opacityFactor;

          // Calculate distance to mouse for interactive glow effect (very subtle)
          const connectionCenterX = (fromNode.x + toNode.x) / 2;
          const connectionCenterY = (fromNode.y + toNode.y) / 2;
          const mouseDistanceFactor = mousePosition.x && mousePosition.y ?
            Math.max(0, 1 - Math.min(Math.sqrt(
              Math.pow(connectionCenterX - mousePosition.x, 2) +
              Math.pow(connectionCenterY - mousePosition.y, 2)
            ) / 400, 1)) * 0.5 : 0; // Reduced mouse effect by 50%

          // Apply subtle enhancement when mouse is nearby
          const enhancedWidth = connection.width * (1 + mouseDistanceFactor);
          const enhancedOpacity = finalOpacity * (1 + mouseDistanceFactor);

          return (
            <line
              key={`connection-${index}`}
              x1={fromNode.x / 12}
              y1={fromNode.y / 6}
              x2={toNode.x / 12}
              y2={toNode.y / 6}
              stroke={connection.gradient ? `url(#${connection.gradient.replace(`${uniqueId}-`, '')})` : connection.color}
              strokeWidth={enhancedWidth}
              strokeOpacity={enhancedOpacity}
              strokeDasharray={`${connection.dashLength} ${connection.dashGap}`}
              strokeLinecap="round"
              filter={mouseDistanceFactor > 0.3 ? `url(#${uniqueId}-glow)` : undefined}
            />
          );
        })}

        {/* Connector nodes (simple circles instead of triangles) */}
        {shouldAnimate() && nodes.map(node => {
          // Calculate distance to mouse for enhanced interaction (more subtle)
          const mouseDistanceFactor = mousePosition.x && mousePosition.y ?
            Math.max(0, 1 - Math.min(Math.sqrt(
              Math.pow(node.x - mousePosition.x, 2) +
              Math.pow(node.y - mousePosition.y, 2)
            ) / 250, 1)) * 0.6 : 0; // Reduced mouse effect by 40%

          // Apply subtle enhancement when mouse is nearby
          const enhancedSize = node.size * (1 + mouseDistanceFactor * 0.3);
          const enhancedOpacity = node.opacity * (1 + mouseDistanceFactor * 0.5);

          return (
            <g key={`node-${node.id}`}>
              {/* Optional subtle glow effect for nodes near mouse */}
              {mouseDistanceFactor > 0.2 && (
                <circle
                  cx={node.x / 12}
                  cy={node.y / 6}
                  r={enhancedSize * 2}
                  fill={`url(#${uniqueId}-node-glow)`}
                  opacity={mouseDistanceFactor * 0.4} // Very subtle glow
                />
              )}

              {/* Main connector node (circle) */}
              <circle
                cx={node.x / 12}
                cy={node.y / 6}
                r={enhancedSize}
                fill={node.color}
                fillOpacity={enhancedOpacity}
                filter={mouseDistanceFactor > 0.3 ? `url(#${uniqueId}-glow)` : undefined}
              />

              {/* For special larger nodes, add a small pulse ring */}
              {node.size > 2.5 && (
                <circle
                  cx={node.x / 12}
                  cy={node.y / 6}
                  r={enhancedSize * (1.5 + 0.5 * Math.sin(node.pulse))}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={0.1}
                  strokeOpacity={0.3 * (0.4 + 0.6 * Math.sin(node.pulse))}
                />
              )}
            </g>
          );
        })}

        {/* Optional data pulse effects - rare subtle pulses along connections */}
        {shouldAnimate() && connections
          .filter(conn => conn.active && Math.random() > 0.95) // Very rare effect
          .map((connection, index) => {
            const fromNode = nodes[connection.from];
            const toNode = nodes[connection.to];

            if (!fromNode || !toNode) return null;

            // Random position along the connection line
            const position = Math.random();
            const pulseX = fromNode.x / 12 + (toNode.x / 12 - fromNode.x / 12) * position;
            const pulseY = fromNode.y / 6 + (toNode.y / 6 - fromNode.y / 6) * position;

            return (
              <circle
                key={`pulse-${index}-${Date.now()}`}
                cx={pulseX}
                cy={pulseY}
                r={0.6}
                fill="var(--color-accent-primary)"
                fillOpacity={0.7}
                filter={`url(#${uniqueId}-glow)`}
              >
                <animate
                  attributeName="opacity"
                  values="0.7;0"
                  dur="1s"
                  begin="0s"
                  fill="freeze"
                />
                <animate
                  attributeName="r"
                  values="0.2;1"
                  dur="1s"
                  begin="0s"
                  fill="freeze"
                />
              </circle>
            );
          })}
      </svg>
    </motion.div>
  );
};

export default NetworkBackground;
