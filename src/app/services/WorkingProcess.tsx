"use client";

import React, { useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/utils/classNames";
import { Heading } from "@/components/common/Typography";
import RichText from "@/components/common/Typography/RichText";
import { ScrollReveal } from "@/components/core/Animations";

interface WorkingProcessProps {
  heading: string;
  introduction: string;
  steps: string[];
  principles: string[];
  className?: string;
}

const WorkingProcess: React.FC<WorkingProcessProps> = ({
  heading,
  introduction,
  steps,
  principles,
  className,
}) => {
  const reduceMotion = useReducedMotion();

  /* ── refs ──────────────────────────────────────────────────────────────── */
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLUListElement>(null);
  const principlesRef = useRef<HTMLUListElement>(null);

  /* ── viewport triggers ─────────────────────────────────────────────────── */
  const timelineInView = useInView(timelineRef, { margin: "-25% 0px" });
  const principlesInView = useInView(principlesRef, { margin: "-25% 0px" });

  /* ── scroll‑linked transforms ──────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.04, 0.08, 0.04]);

  /* ── static tech readouts (memoised) ───────────────────────────────────── */
  const tech = useMemo(
    () => ({
      len: steps.length,
      ver: (Math.random() * 2 + 1).toFixed(1),
      eff: Math.floor(Math.random() * 40) + 60,
      load: Math.floor(Math.random() * 30) + 20,
    }),
    [steps.length]
  );

  /* ── component ─────────────────────────────────────────────────────────── */
  return (
    <motion.section
      ref={sectionRef}
      className={cn(
        "relative overflow-hidden py-16 md:py-24 bg-bg-tertiary",
        className
      )}
      {...(!reduceMotion && { initial: { opacity: 0 }, animate: { opacity: 1 } })}
      transition={{ duration: 0.6 }}
    >
      {/* blueprint overlay */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={!reduceMotion ? { y: gridY, opacity: gridOpacity } : undefined}
      >
        <div className="absolute inset-0 bg-blueprint-grid" />
        <div className="absolute inset-0 bg-circuit opacity-[0.025]" />
      </motion.div>

<div className="container mx-auto py-16 md:py-32 px-4 md:px-8 max-w-7xl relative z-10">
        {/* header */}
        <header className="mb-16 text-center md:max-w-4xl md:mx-auto">
          <ScrollReveal asChild direction="up" delay={0.1}>
            <Heading level={2} className="mb-6 text-3xl md:text-4xl font-bold">
              {heading}
            </Heading>
          </ScrollReveal>
          <ScrollReveal asChild direction="up" delay={0.2}>
            <RichText
              content={introduction}
              className="mx-auto max-w-2xl text-lg md:text-xl text-text-secondary"
            />
          </ScrollReveal>
        </header>

        {/* timeline */}
        <section className="mb-20">
          <div className="mb-6 flex items-center">
            <h3 className="text-xl font-semibold">Working&nbsp;Process</h3>
            <span className="ml-4 flex-grow h-px bg-divider" />
            <span className="ml-2 px-2 py-1 text-xs font-mono border border-divider bg-bg-tertiary/40">
              STEPS/{steps.length}
            </span>
          </div>

          {/* desktop vertical timeline */}
          <div className="hidden md:block relative">
            <motion.span
              aria-hidden
              className="absolute left-8 top-0 bottom-0 w-0.5 bg-divider origin-top"
              {...(!reduceMotion && timelineInView && {
                initial: { scaleY: 0 },
                animate: { scaleY: 1 },
                transition: { duration: 0.8 },
              })}
            />
            <ul ref={timelineRef} className="space-y-12">
              {steps.map((step, i) => (
                <motion.li
                  key={i}
                  className="relative pl-20"
                  {...(!reduceMotion && {
                    initial: { opacity: 0, x: -20 },
                    animate: timelineInView ? { opacity: 1, x: 0 } : undefined,
                    transition: { duration: 0.4, delay: i * 0.15 },
                  })}
                >
                  <span
                    aria-hidden
                    className="absolute left-6 top-0 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-primary bg-bg-primary font-bold"
                  >
                    {i + 1}
                  </span>
                  <div className="relative p-6 rounded-lg border border-divider bg-bg-glass backdrop-blur-sm">
                    <RichText content={step} className="text-lg" />
                  </div>
                </motion.li>
              ))}
            </ul>
            <span className="absolute right-6 bottom-0 hidden lg:block text-xs font-mono text-accent-oceanic/70">
              LEN/{tech.len} · VER/{tech.ver} · EFF/{tech.eff}%
            </span>
          </div>

          {/* mobile stack */}
          <ul ref={timelineRef} className="md:hidden space-y-6">
            {steps.map((step, i) => (
              <li
                key={i}
                className="relative rounded-lg border border-divider bg-bg-glass p-5"
              >
                <span
                  aria-hidden
                  className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-primary bg-bg-primary font-bold"
                >
                  {i + 1}
                </span>
                <RichText content={step} />
              </li>
            ))}
          </ul>
        </section>

        {/* principles */}
        <section>
          <div className="mb-6 flex items-center">
            <h3 className="text-xl font-semibold">Working&nbsp;Principles</h3>
            <span className="ml-4 flex-grow h-px bg-divider" />
            <span className="ml-2 px-2 py-1 text-xs font-mono border border-divider bg-bg-tertiary/40">
              CORE
            </span>
          </div>

          <ul
            ref={principlesRef}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {principles.map((p, i) => (
              <motion.li
                key={i}
                className="relative rounded-r-lg border-l-4 border-accent-warm border t border-r border-b border-divider bg-bg-glass p-6"
                {...(!reduceMotion && {
                  initial: { opacity: 0, y: 20 },
                  animate: principlesInView ? { opacity: 1, y: 0 } : undefined,
                  transition: { duration: 0.4, delay: 0.15 * i },
                  whileHover: { x: 4 },
                })}
              >
                <RichText content={p} />
              </motion.li>
            ))}
          </ul>

          {/* load indicator */}
          <span className="absolute left-6 bottom-6 hidden lg:flex items-center space-x-2 text-xs font-mono text-accent-oceanic/70">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent-oceanic" />
            <span>LOAD/{tech.load}%</span>
          </span>
        </section>
      </div>

      {/* skew divider */}
      <div aria-hidden className="relative mt-16">
        <div className="-skew-x-6 h-px w-full bg-divider" />
      </div>
    </motion.section>
  );
};

export default WorkingProcess;
