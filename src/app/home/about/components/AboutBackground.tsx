"use client";

import React, { useRef, useEffect } from "react";
import { motion, MotionValue, useTransform, useSpring } from "framer-motion";

interface AboutBackgroundProps {
  scrollProgress: MotionValue<number>;
  isVisible: boolean;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    warm?: string;
    contrast?: string;
    brand: string;
  };
  reducedMotion: boolean;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
}

const AboutBackground: React.FC<AboutBackgroundProps> = ({
  scrollProgress,
  isVisible,
  accentColors,
  reducedMotion,
  mouseX = useSpring(0),
  mouseY = useSpring(0),
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<
    Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
    }>
  >([]);

  // Transform values based on scroll and mouse position
  const backgroundY = useTransform(scrollProgress, [0, 1], ["0%", "10%"]);
  const patternRotate = useTransform(scrollProgress, [0, 1], [0, 10]);
  const patternScale = useTransform(scrollProgress, [0, 0.5, 1], [1, 1.1, 1]);
  const gradientPosition = useTransform(
    scrollProgress,
    [0, 1],
    ["0% 0%", "100% 100%"]
  );

  // Background opacity transforms
  const noiseOpacity = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    [0.015, 0.03, 0.01]
  );
  const gridOpacity = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    [0.03, 0.05, 0.02]
  );

  // Mouse-based transforms for parallax effects
  const backgroundOffsetX = useTransform(mouseX, [-500, 500], ["5%", "-5%"]);
  const backgroundOffsetY = useTransform(mouseY, [-300, 300], ["5%", "-5%"]);
  const orb1OffsetX = useTransform(mouseX, [-500, 500], ["3%", "-3%"]);
  const orb1OffsetY = useTransform(mouseY, [-300, 300], ["3%", "-3%"]);
  const orb2OffsetX = useTransform(mouseX, [-500, 500], ["-3%", "3%"]);
  const orb2OffsetY = useTransform(mouseY, [-300, 300], ["-3%", "3%"]);

  // Color progression based on scroll
  const backgroundHue = useTransform(scrollProgress, [0, 1], [200, 250]);
  const contrastHue = useTransform(scrollProgress, [0, 1], [340, 30]);

  // Use reduced animations if needed
  const animations = reducedMotion
    ? {}
    : {
        y: backgroundY,
        rotate: patternRotate,
        scale: patternScale,
      };

  // Initialize particle system
  useEffect(() => {
    if (reducedMotion || !isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Initialize particles
    particles.current = [];
    const particleCount = Math.min(window.innerWidth / 10, 100); // Responsive particle count

    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() * 60 + 180, // Blue to cyan range
      });
    }

    // Animation loop
    let animationId: number;
    let lastScrollY = scrollProgress.get();

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentScrollY = scrollProgress.get();
      const scrollVelocity = (currentScrollY - lastScrollY) * 100;
      lastScrollY = currentScrollY;

      // Mouse position influence
      const mouseXValue = mouseX.get();
      const mouseYValue = mouseY.get();

      // Draw and update particles
      particles.current.forEach((particle) => {
        // Adjust for scroll velocity
        particle.y += particle.speedY + scrollVelocity * 0.2;
        particle.x += particle.speedX;

        // Influence by mouse (subtle attraction)
        if (Math.abs(mouseXValue) > 50 || Math.abs(mouseYValue) > 50) {
          const mouseInfluence = 0.02;
          const dx =
            (mouseXValue / window.innerWidth) * canvas.width - particle.x;
          const dy =
            (mouseYValue / window.innerHeight) * canvas.height - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            particle.x += (dx * mouseInfluence) / (distance * 10);
            particle.y += (dy * mouseInfluence) / (distance * 10);
          }
        }

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 70%, ${particle.opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [isVisible, reducedMotion, mouseX, mouseY, scrollProgress]);

  return (
    <>
      {/* Main background color */}
      <div className="absolute inset-0 bg-bg-primary -z-10" />

      {/* Enhanced gradient orbs with parallax */}
      <motion.div
        className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] rounded-full opacity-10 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, ${accentColors.primary}50, transparent 70%)`,
          backgroundSize: "200% 200%",
          backgroundPosition: gradientPosition,
          x: orb1OffsetX,
          y: orb1OffsetY,
        }}
      />

      <motion.div
        className="absolute -bottom-[30%] -left-[20%] w-[70%] h-[70%] rounded-full opacity-10 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, ${accentColors.secondary}50, transparent 70%)`,
          backgroundSize: "200% 200%",
          backgroundPosition: gradientPosition,
          x: orb2OffsetX,
          y: orb2OffsetY,
        }}
      />

      {/* Sophisticated multi-layer grid pattern */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-5"
        style={{
          opacity: isVisible ? gridOpacity : 0,
          x: backgroundOffsetX,
          y: backgroundOffsetY,
          ...animations,
        }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle cx="0" cy="0" r="1.5" fill="currentColor" opacity="0.5" />
              <circle
                cx="100"
                cy="0"
                r="1.5"
                fill="currentColor"
                opacity="0.5"
              />
              <circle
                cx="0"
                cy="100"
                r="1.5"
                fill="currentColor"
                opacity="0.5"
              />
            </pattern>
            <pattern
              id="smallGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                strokeOpacity="0.3"
              />
            </pattern>
            <pattern
              id="microGrid"
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 5 0 L 0 0 0 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.2"
                strokeOpacity="0.2"
                strokeDasharray="1,1"
              />
            </pattern>
            <pattern
              id="dots"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="10"
                cy="10"
                r="0.8"
                fill="currentColor"
                opacity="0.7"
              />
            </pattern>
            <pattern
              id="blueprint"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect width="100" height="100" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="30"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="2,2"
              />
              <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                stroke="currentColor"
                strokeWidth="0.3"
                strokeDasharray="1,2"
              />
              <line
                x1="50"
                y1="0"
                x2="50"
                y2="100"
                stroke="currentColor"
                strokeWidth="0.3"
                strokeDasharray="1,2"
              />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
          <rect width="100%" height="100%" fill="url(#microGrid)" />
          <rect width="100%" height="100%" fill="url(#dots)" opacity="0.3" />
          <rect
            width="100%"
            height="100%"
            fill="url(#blueprint)"
            opacity="0.15"
          />
        </svg>
      </motion.div>

      {/* Noise texture for depth */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay -z-4"
        style={{ opacity: isVisible ? noiseOpacity : 0 }}
        initial={{ opacity: 0 }}
      >
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#noise)"
            opacity="0.15"
          />
        </svg>
      </motion.div>

      {/* Ambient particle system canvas */}
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none -z-3"
          style={{ opacity: isVisible ? 0.2 : 0 }}
        ></canvas>
      )}
    </>
  );
};

export default AboutBackground;
