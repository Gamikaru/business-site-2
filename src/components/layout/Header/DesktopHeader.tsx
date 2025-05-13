"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import Icon from "@/components/common/Icons/Icon";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/classNames";
import ThemeSelector from "@/components/core/ThemeSelector";
import { FontSelector } from "@/components/common/Typography"; // Import FontSelector

const nav = [
  { n: "01", label: "Home",     href: "/" },
  { n: "02", label: "About",    href: "/about" },
  { n: "03", label: "Services", href: "/services" },
  { n: "04", label: "Work",     href: "/portfolio" },
  { n: "05", label: "Blog",     href: "/blog" },
];

export default function DesktopHeader() {
  const path = usePathname();
  const { mode, toggleMode } = useTheme();
  const { scrollY } = useScroll();

  /* glass & shrink */
  const h      = useTransform(scrollY, [0,120], [96,64]);
  const yPad   = useTransform(scrollY, [0,120], ["1.5rem","0.75rem"]);
  const bgOpa  = useTransform(scrollY, [0,120], [0,0.85]);
  const blur   = useTransform(scrollY, [0,120], ["blur(0)","blur(8px)"]);

  return (
    <motion.header style={{height: h, paddingTop: yPad, paddingBottom: yPad}}
      className="fixed inset-x-0 top-0 z-50">

      {/* glass surface */}
      <motion.div style={{opacity:bgOpa, backdropFilter:blur}}
        className="absolute inset-0 bg-transparent" /* <-- changed from bg-surface-primary */
      />

      <div className="relative z-10 container mx-auto grid grid-cols-12 items-center gap-6">
        {/* LEFT spacer for logo (kept bare per request) */}
        <div className="col-span-2" />

        {/* NAVIGATION */}
        <nav className="col-span-7">
          <ul className="flex items-center gap-8">
            {nav.map(({ n, label, href }) => {
              const active = path === href;
              return (
                <li key={href} className="relative">
                  <Link
                    href={href}
                    className={cn(
                      "group flex items-baseline gap-1 px-2 py-1",
                      active
                        ? "text-text-heading font-medium"
                        : "text-text-secondary hover:text-text-heading"
                    )}
                  >
                    {/* numeric index */}
                    <span className="font-mono text-xs tracking-wider opacity-50 group-hover:opacity-80 transition-opacity">
                      {n}
                    </span>
                    {label}
                  </Link>

                  {/* shared animated underline */}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 h-[2px] w-full rounded-md bg-brand-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ACTIONS */}
        <div className="col-span-3 flex justify-end items-center gap-4">
          {/* Font Selector with custom trigger */}
          <div className="relative">
            <FontSelector
              variant="dropdown"
              showPreview={false}
              className="hover:scale-105 transition-transform"
              customTrigger={
                <button
                  className="grid h-10 w-10 place-content-center rounded-full
                           bg-surface-alt-2 hover:scale-105 transition-transform
                           focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  aria-label="Change font"
                >
                  <span className="text-xl font-semibold">T</span>
                </button>
              }
            />
          </div>

          {/* Theme Selector */}
          <ThemeSelector
            variant="dropdown"
            showLabels={false}
            size="sm"
            className="hover:scale-105 transition-transform"
          />

          {/* Light/Dark Mode Toggle */}
          <button
            onClick={toggleMode}
            aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            aria-pressed={mode === "dark"}
            className="grid h-10 w-10 place-content-center rounded-full
                       bg-surface-alt-2 hover:scale-105 transition-transform
                       focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            <Icon
              name={mode === "light" ? "fi-moon" : "fi-sun"}
              size={18}
              className="text-text-primary"
            />
          </button>

          {/* Contact Button */}
          <Link
            href="/contact"
            className="btn-primary px-6 py-2 text-sm shadow-md hover:shadow-lg"
          >
            Book Call
          </Link>
        </div>
      </div>

      {/* measurement ticks (subtler, dashed) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3">
        <div className="border-t border-dashed border-divider-stroke/40 h-px w-full" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-px h-2 bg-divider-stroke/40"
            style={{ left: `${(i * 100) / 12}%` }}
          />
        ))}
      </div>
    </motion.header>
  );
}