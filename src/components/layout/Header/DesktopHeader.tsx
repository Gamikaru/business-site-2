/* src/components/layout/Header/DesktopHeader.tsx */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import ThemeSelector from "@/components/core/ThemeSelector";
import { FontSelector } from "@/components/common/Typography";
import Icon from "@/components/common/Icons/Icon";
import { cn } from "@/utils/classNames";

const NAV = [
  { n: "01", label: "HOME",     href: "/" },
  { n: "02", label: "ABOUT",    href: "/about" },
  { n: "03", label: "SERVICES", href: "/services" },
  { n: "04", label: "WORK",     href: "/portfolio" },
  { n: "05", label: "BLOG",     href: "/blog" },
];

export default function DesktopHeader() {
  const pathname          = usePathname();
  const { mode, toggleMode } = useTheme();
  const { scrollY }       = useScroll();

  /* shrink + translucency */
  const h       = useTransform(scrollY, [0,120], [96,64]);
  const yPad    = useTransform(scrollY, [0,120], ["1.5rem","0.75rem"]);
  const glass   = useTransform(scrollY, [0,120], [0,0.9]);
  const blur    = useTransform(scrollY, [0,120], ["blur(0)","blur(10px)"]);

  return (
    <motion.header
      style={{ height: h, paddingTop: yPad, paddingBottom: yPad }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* translucent surface */}
      <motion.div
        style={{ opacity: glass, backdropFilter: blur }}
        className="absolute inset-0 bg-bg-secondary/70 border-b border-divider shadow-sm pointer-events-none"
      />

      {/* main row – everything pushed right */}
      <div className="relative z-10 container mx-auto flex items-center justify-end gap-10">

        {/* NAVIGATION */}
        <nav>
          <ul className="flex items-center gap-6">
            {NAV.map(({ n, label, href }) => {
              const active = pathname === href;
              return (
                <li key={href} className="relative">
                  <Link href={href} className="group flex items-center gap-2 px-2 py-1">
                    <span className="font-mono text-xs text-accent-secondary opacity-70 group-hover:opacity-100 transition-opacity">
                      {n}
                    </span>
                    <span
                      className={cn(
                        "text-sm tracking-widest transition-colors",
                        active ? "text-heading font-semibold"
                               : "text-text-secondary group-hover:text-text-primary"
                      )}
                    >
                      {label}
                    </span>

                    {/* brutalist pill highlight */}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-x-[-8px] top-0 h-full -z-[1]
                                   bg-accent-primary/10 border border-accent-primary"
                        transition={{ type: "spring", stiffness: 600, damping: 40 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}

            {/* CTA */}
            <li>
              <Link
                href="/contact"
                className="relative inline-flex items-center gap-2 px-6 py-[10px] text-sm font-medium
                           border-2 border-accent-primary bg-accent-primary/5
                           transition-colors duration-150 hover:bg-accent-primary/20
                           active:scale-95 focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-[var(--color-field-focus)]"
              >
                BOOK CALL
                <Icon name="fi:FiArrowRight" size={16} />
              </Link>
            </li>
          </ul>
        </nav>

        {/* CONTROLS */}
        <div className="flex items-center gap-3">
          <FontSelector
            variant="dropdown"
            showPreview={false}
            className="control-btn"
            customTrigger={<button className="control-btn" aria-label="Change font"><span className="text-lg font-semibold">T</span></button>}
          />

          <ThemeSelector variant="dropdown" showLabels={false} size="sm" className="control-btn" />

          <button
            onClick={toggleMode}
            aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            aria-pressed={mode === "dark"}
            className="control-btn"
          >
            <Icon name={mode === "light" ? "fi:FiMoon" : "fi:FiSun"} size={18} />
          </button>
        </div>
      </div>

      {/* baseline ticks */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3">
        <div className="w-full h-px border-t border-dashed border-divider/40" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-px h-2 bg-divider/40"
            style={{ left: `${(i * 100) / 12}%` }}
          />
        ))}
      </div>
    </motion.header>
  );
}

/* ---------- globals.css / @layer utilities ---------- */
/*
.control-btn {
  @apply grid place-content-center h-10 w-10 rounded-md bg-surface-alt-2
         backdrop-blur-sm transition-transform hover:scale-105 active:scale-95
         focus-visible:ring-2 focus-visible:ring-[var(--color-field-focus)];
}
*/
