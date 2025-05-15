// src/app/home/HomeServices.tsx
'use client'

import React, { useRef, useState, useEffect, useCallback, memo } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/classNames'
import { Heading, Text } from '@/components/common/Typography'
import { Button } from '@/components/common/Button'
import RichText from '@/components/common/Typography/RichText'
import { ScrollReveal, TextReveal } from '@/components/core/Animations'
import AnimatedGridBackground from '@/components/common/VisualInterest/AnimatedGridBackground'
import { Divider } from '@/components/common/Divider'
import Link from 'next/link'
import Image from 'next/image'

// Types
interface ServiceItem {
  id: string
  number: string
  title: string
  description: string
  iconSrc: string
  link: string
}

interface HomeServicesProps {
  heading: string
  introduction: string
  items: ServiceItem[]
  ctaText: string
  ctaLink: string
  className?: string
}

interface PulsePoint {
  id: number
  x: number
  y: number
  color: number
}

interface SystemMetrics {
  efficiency: number
  connectivity: number
  pulseRate: number
}

// Constants
const GLITCH_INTERVAL_MS = 5000
const GLITCH_DURATION_MS = 120
const PULSE_CLEANUP_MS = 3000
const PULSE_LIMIT = 6

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8 }
  }
}

const decorationVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
}

const serviceItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (delay: number) => ({
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 50, damping: 9, delay }
  }),
  hover: {
    y: -5,
    transition: { duration: 0.3 }
  }
}

const progressBarVariants = {
  initial: { width: "30%" },
  active: { width: "100%", transition: { duration: 0.5 } }
}

const cornerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay }
  })
}

const HomeServices: React.FC<HomeServicesProps> = ({
  heading,
  introduction,
  items,
  ctaText,
  ctaLink,
  className,
}) => {
  // Refs for section and animations
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const isHeadingInView = useInView(headingRef, { once: false, margin: "-10% 0px" })
  const [uniqueId] = useState(`services-${Math.floor(Math.random() * 10000)}`)

  // Interactive states
  const [activeService, setActiveService] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [glitchActive, setGlitchActive] = useState(false)
  const [pulsePoints, setPulsePoints] = useState<PulsePoint[]>([])
  const [pulseCounter, setPulseCounter] = useState(0)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    efficiency: Math.floor(Math.random() * 30) + 70,
    connectivity: Math.floor(Math.random() * 40) + 60,
    pulseRate: Math.floor(Math.random() * 200) + 800,
  })

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Scroll-driven transforms
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.8, 0.8, 0])
  const sectionScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.98])
  const sectionY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, 50])

  // Handle mouse movement for interactive effects
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return

    const rect = sectionRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setMousePosition({ x, y })
  }, [])

  // Handle clicks for interactive pulse effects
  const handleMouseClick = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return

    const rect = sectionRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const newPulse: PulsePoint = {
      id: pulseCounter,
      x,
      y,
      color: pulseCounter % 4
    }

    setPulsePoints((prev) => [...prev.slice(-PULSE_LIMIT + 1), newPulse])
    setPulseCounter((prev) => prev + 1)

    // Trigger glitch effect
    setGlitchActive(true)
    setTimeout(() => setGlitchActive(false), GLITCH_DURATION_MS)
  }, [pulseCounter])

  // Clean up old pulse points
  useEffect(() => {
    if (pulsePoints.length === 0) return

    const cleanup = setTimeout(() => {
      setPulsePoints((prev) => prev.slice(-PULSE_LIMIT))
    }, PULSE_CLEANUP_MS)

    return () => clearTimeout(cleanup)
  }, [pulsePoints])

  // Periodic effects to simulate system activity
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      // Random glitch effect
      if (Math.random() > 0.7) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), GLITCH_DURATION_MS)
      }

      // Update random metrics
      setSystemMetrics({
        efficiency: Math.floor(Math.random() * 15) + 85,
        connectivity: Math.floor(Math.random() * 20) + 80,
        pulseRate: Math.floor(Math.random() * 200) + 800,
      })
    }, GLITCH_INTERVAL_MS)

    return () => clearInterval(glitchInterval)
  }, [])

  // Get color class based on index
  const getColorClass = useCallback((index: number): string => {
    const colors = ['accent-primary', 'accent-secondary', 'accent-warm', 'accent-contrast']
    return colors[index % colors.length]
  }, [])

  return (
    <motion.div
      ref={sectionRef}
      className={cn("relative overflow-hidden py-24 sm:py-32", className)}
      onMouseMove={handleMouseMove}
      onClick={handleMouseClick}
      style={{
        y: sectionY,
        scale: sectionScale,
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SVG filter for glitch effects */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id={`${uniqueId}-glitch`}>
            <feFlood floodColor="var(--color-accent-primary)" result="red" />
            <feFlood floodColor="var(--color-accent-secondary)" result="blue" />
            <feComposite operator="in" in="red" in2="SourceAlpha" result="red-text" />
            <feComposite operator="in" in="blue" in2="SourceAlpha" result="blue-text" />
            <feOffset in="red-text" dx="-2" dy="0" result="red-text-moved" />
            <feOffset in="blue-text" dx="2" dy="0" result="blue-text-moved" />
            <feMerge>
              <feMergeNode in="red-text-moved" />
              <feMergeNode in="blue-text-moved" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Technical background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary"
          style={{ opacity: backgroundOpacity }}
        />

        <AnimatedGridBackground
          className="absolute inset-0"
          particleCount={25}
          density={20}
          opacity={0.2}
          colors={['accent-primary', 'accent-secondary', 'accent-warm', 'brand-primary']}
        />

        {/* Blueprint corner indicators */}
        <div className="absolute top-0 left-0 h-16 w-16 border-l-2 border-t-2 border-accent-secondary/30" aria-hidden="true" />
        <div className="absolute top-0 right-0 h-16 w-16 border-r-2 border-t-2 border-accent-secondary/30" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 h-16 w-16 border-l-2 border-b-2 border-accent-secondary/30" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 h-16 w-16 border-r-2 border-b-2 border-accent-secondary/30" aria-hidden="true" />
      </div>

      {/* Technical measurement overlays */}
      <div className="absolute left-8 top-0 bottom-0 w-px border-l border-accent-primary/20 hidden md:block" aria-hidden="true" />
      <div className="absolute right-8 top-0 bottom-0 w-px border-r border-accent-primary/20 hidden md:block" aria-hidden="true" />

      {/* Scan lines effect */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-accent-secondary/10 pointer-events-none"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2
        }}
        aria-hidden="true"
      />

      {/* Pulse interaction points */}
      <AnimatePresence>
        {pulsePoints.map((pulse) => (
          <motion.div
            key={`pulse-${pulse.id}`}
            className="absolute pointer-events-none z-10"
            style={{
              left: `${pulse.x * 100}%`,
              top: `${pulse.y * 100}%`,
              transform: "translate(-50%, -50%)"
            }}
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            aria-hidden="true"
          >
            <div className="relative">
              <div className={`absolute inset-0 w-20 h-20 rounded-full bg-${getColorClass(pulse.color)} opacity-20`}></div>
              <div className={`w-32 h-32 rounded-full border-2 border-${getColorClass(pulse.color)} flex items-center justify-center`}>
                <div className={`w-24 h-24 rounded-full border border-${getColorClass(pulse.color)}/60`}></div>
              </div>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <line x1="30" y1="0" x2="30" y2="60" className={`stroke-${getColorClass(pulse.color)}`} strokeWidth="1" strokeDasharray="2 3" />
                <line x1="0" y1="30" x2="60" y2="30" className={`stroke-${getColorClass(pulse.color)}`} strokeWidth="1" strokeDasharray="2 3" />
                <circle cx="30" cy="30" r="3" className={`fill-${getColorClass(pulse.color)}`} />
              </svg>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* System status indicator */}
      <motion.div
        className={cn(
          "absolute top-6 left-6 text-xs font-mono flex items-center z-20",
          glitchActive ? "text-accent-primary" : "text-accent-secondary"
        )}
        animate={{
          opacity: glitchActive ? [0.7, 1, 0.7] : 0.7,
          filter: glitchActive ? `url(#${uniqueId}-glitch)` : 'none'
        }}
        aria-hidden="true"
      >
        <span className={cn(
          "inline-block h-2 w-2 rounded-full mr-2",
          glitchActive ? "bg-accent-primary animate-ping" : "bg-accent-secondary"
        )} />
        <span>SYS/SERVICES/{systemMetrics.efficiency}%</span>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Technical status metrics */}
        <div className="flex justify-between items-center mb-12 text-xs font-mono text-accent-secondary" aria-hidden="true">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-accent-primary mr-2 animate-pulse"></div>
              <span>CONN/{systemMetrics.connectivity}%</span>
            </div>
            <div className="hidden sm:flex items-center">
              <div className="w-2 h-2 rounded-full bg-accent-warm/70 mr-2"></div>
              <span>SYNC/{systemMetrics.pulseRate}ms</span>
            </div>
          </div>
          <div className="text-accent-secondary">
            {`LOC//${Math.floor(mousePosition.x * 100)}.${Math.floor(mousePosition.y * 100)}`}
          </div>
        </div>

        {/* Section header */}
        <div
          ref={headingRef}
          className="max-w-3xl mx-auto text-center mb-16 relative"
        >
          {/* Terminal-style header bar */}
          <motion.div
            className="absolute -top-2 left-8 right-8 h-6 flex items-center px-4 border-t border-l border-r border-accent-secondary/60 bg-bg-glass backdrop-blur-sm mx-auto max-w-xl"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHeadingInView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ transformOrigin: "center" }}
            aria-hidden="true"
          >
            <div className="text-[10px] font-mono text-accent-primary">
              SERVICES.MODULE/INITIALIZED
            </div>

            <div className="ml-auto h-2 w-2 rounded-full bg-accent-primary animate-pulse" />
          </motion.div>

          <TextReveal
            direction="up"
            delay={0.2}
            splitBy="words"
            staggerChildren={true}
            className="mb-6 relative"
          >
            <Heading
              level={2}
              className={cn(
                "text-[clamp(2rem,5vw,3rem)] font-heading font-bold relative inline-block pt-6",
                glitchActive && "filter-glitch"
              )}
              style={{ filter: glitchActive ? `url(#${uniqueId}-glitch)` : 'none' }}
            >
              <RichText content={heading} />
            </Heading>
          </TextReveal>

          {/* Underline with architectural style */}
          <motion.div
            className="h-[1px] w-40 bg-accent-primary/60 mx-auto mb-10"
            initial={{ width: 0 }}
            animate={{ width: isHeadingInView ? 160 : 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />

          <ScrollReveal direction="up" delay={0.3} className="relative">
            <motion.div
              className="bg-bg-glass backdrop-blur-sm border border-accent-secondary/30 p-8 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHeadingInView ? 1 : 0, y: isHeadingInView ? 0 : 20 }}
            >
              {/* Corner brackets */}
              <div className="absolute -top-1.5 -left-1.5 h-3 w-3 border-l border-t border-accent-secondary/60" aria-hidden="true" />
              <div className="absolute -top-1.5 -right-1.5 h-3 w-3 border-r border-t border-accent-secondary/60" aria-hidden="true" />
              <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border-l border-b border-accent-secondary/60" aria-hidden="true" />
              <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border-r border-b border-accent-secondary/60" aria-hidden="true" />

              <Text as="div" size="xl" className="text-text-secondary">
                <RichText content={introduction} />
              </Text>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((service, index) => (
            <ScrollReveal
              key={service.id}
              direction={index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right"}
              delay={0.2 + index * 0.1}
            >
              <motion.div
                className={cn(
                  "group relative border backdrop-blur-sm bg-bg-glass transition-all duration-300 h-full",
                  activeService === service.id
                    ? "border-accent-primary shadow-glow"
                    : "border-white/10 hover:border-accent-secondary/60"
                )}
                variants={serviceItemVariants}
                initial="hidden"
                animate="visible"
                custom={index * 0.1}
                whileHover="hover"
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
              >
                {/* Technical grid overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden="true">
                  <div className="absolute inset-0 bg-blueprint-grid opacity-30" />
                </div>

                {/* Upper accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent-secondary to-transparent opacity-60" />

                {/* Technical coordinates */}
                <div className="absolute top-3 right-3 text-[10px] font-mono text-accent-secondary opacity-70" aria-hidden="true">
                  ID::{service.id.toUpperCase()}
                </div>

                {/* Status indicator */}
                <div className={cn(
                  "absolute top-3 left-3 flex items-center",
                  activeService === service.id ? "text-accent-primary" : "text-accent-secondary"
                )} aria-hidden="true">
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full mr-1",
                    activeService === service.id ? "bg-accent-primary animate-ping" : "bg-accent-secondary"
                  )}></div>
                  <span className="text-[10px] font-mono">ACTIVE</span>
                </div>

                {/* Content */}
                <div className="p-8 pt-12">
                  {/* Icon with technical styling */}
                  <div className="mb-6 relative w-16 h-16">
                    <motion.div
                      className={cn(
                        "absolute inset-0 rounded-md opacity-20",
                        activeService === service.id && "animate-pulse"
                      )}
                      style={{
                        background: `radial-gradient(circle, var(--color-${index % 2 ? 'accent-primary' : 'accent-secondary'}) 0%, transparent 70%)`
                      }}
                      aria-hidden="true"
                    />
                    <Image
                      src={service.iconSrc}
                      alt=""
                      width={64}
                      height={64}
                      className="relative z-10"
                    />

                    {/* Scan effect on hover */}
                    {activeService === service.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-secondary/30 to-transparent h-[200%] -top-[50%]"
                        animate={{
                          top: ["0%", "100%"],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "linear"
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Service title */}
                  <div className="mb-4">
                    <div className="font-mono text-[10px] text-accent-secondary mb-1" aria-hidden="true">SERVICE [{service.number}]</div>
                    <Heading level={3} className="text-xl font-heading font-bold">
                      <RichText content={service.title} />
                    </Heading>
                  </div>

                  {/* Service description */}
                  <Text as="div" className="mb-6 text-text-secondary">
                    <RichText content={service.description} />
                  </Text>

                  {/* Technical link */}
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <Link href={service.link} className="group flex justify-between items-center text-sm font-medium">
                      <span className={cn(
                        "transition-colors",
                        activeService === service.id ? "text-accent-primary" : "text-text-primary group-hover:text-accent-primary"
                      )}>
                        Learn more
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent-secondary" aria-hidden="true">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>

                  {/* Bottom system indicator */}
                  <div className="absolute bottom-2 right-2 text-[9px] font-mono text-accent-secondary/50 flex items-center gap-2" aria-hidden="true">
                    {activeService === service.id && (
                      <motion.div
                        className="h-1 w-1 rounded-full bg-accent-primary"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    {`SYS::${index + 1}`}
                  </div>
                </div>

                {/* Progress bar */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-accent-primary/50"
                  variants={progressBarVariants}
                  initial="initial"
                  animate={activeService === service.id ? "active" : "initial"}
                  aria-hidden="true"
                />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA with architectural styling */}
        <div className="mt-16 flex justify-center">
          <ScrollReveal direction="up" delay={0.5}>
            <div className="relative">
              {/* Technical frame */}
              <motion.div
                className="absolute -left-4 -top-4 border-l-2 border-t-2 border-accent-secondary/60 w-12 h-12 pointer-events-none"
                variants={cornerVariants}
                initial="hidden"
                animate="visible"
                custom={0.6}
                aria-hidden="true"
              />

              <Button
                intent="gradient"
                size="lg"
                href={ctaLink}
                className="relative border-2 border-accent-primary bg-transparent hover:bg-accent-primary/20 transition-all text-white font-bold tracking-wider"
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 1L15 8L8 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 8H1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                iconPosition="right"
              >
                {ctaText}
              </Button>

              {/* Technical measurement */}
              <motion.div
                className="absolute -right-4 -bottom-4 border-r-2 border-b-2 border-accent-secondary/60 w-12 h-12 pointer-events-none"
                variants={cornerVariants}
                initial="hidden"
                animate="visible"
                custom={0.7}
                aria-hidden="true"
              />

              {/* Technical readout */}
              <motion.div
                className="absolute -right-8 top-1/2 -translate-y-1/2 text-[10px] font-mono text-accent-secondary/70 hidden lg:flex items-center gap-2"
                variants={decorationVariants}
                initial="hidden"
                animate="visible"
                custom={0.8}
                aria-hidden="true"
              >
                <div className="h-1 w-1 rounded-full bg-accent-primary animate-pulse" />
                <span>CTA::READY</span>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Angled divider */}
      <div className="relative mt-20">
        <Divider
          type="plane"
          height={120}
          bgBottom="var(--color-bg-primary)"
          className="z-10"
        />
      </div>

      {/* Dynamic color classes for dynamic classNames */}
      <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 20px var(--color-active-bg);
        }

        .filter-glitch {
          animation: text-glitch 0.3s linear;
        }

        @keyframes text-glitch {
          0%, 100% { transform: none; opacity: 1; }
          7% { transform: skew(-0.5deg, -0.9deg); opacity: 0.75; }
          30% { transform: skew(0.8deg, -0.1deg); opacity: 0.75; }
          55% { transform: skew(-1deg, 0.2deg); opacity: 0.75; }
          75% { transform: skew(0.4deg, 1deg); opacity: 0.75; }
        }
      `}</style>
    </motion.div>
  )
}

export default memo(HomeServices)