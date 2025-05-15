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

// Updated navigation array with CONTACT as 06
const NAV = [
  { n: "", label: "HOME",     href: "/" },
  { n: "", label: "ABOUT",    href: "/about" },
  { n: "", label: "SERVICES", href: "/services" },
  { n: "", label: "WORK",     href: "/portfolio" },
  { n: "", label: "BLOG",     href: "/blog" },
  { n: "", label: "CONTACT",  href: "/contact" },
];

export default function DesktopHeader() {
  const pathname = usePathname();
  const { mode, toggleMode } = useTheme();
  const { scrollY } = useScroll();

  /* Enhanced scroll animations */
  const h = useTransform(scrollY, [0, 120], [80, 70]);
  const yPad = useTransform(scrollY, [0, 120], ["1.25rem", "0.75rem"]);
  const glass = useTransform(scrollY, [0, 120], [0, 0.95]);
  const blur = useTransform(scrollY, [0, 120], ["blur(0)", "blur(10px)"]);
  const shadowOpacity = useTransform(scrollY, [0, 120], [0, 0.1]);
  const navSpacing = useTransform(scrollY, [0, 120], [6, 4]);

  return (
    <motion.header
      style={{ height: h, paddingTop: yPad, paddingBottom: yPad }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Enhanced translucent surface with gradient border */}
      <motion.div
        style={{
          opacity: glass,
          backdropFilter: blur,
          boxShadow: shadowOpacity.get() ? `0 4px 20px rgba(0, 0, 0, ${shadowOpacity.get()})` : 'none'
        }}
        className="absolute inset-0 bg-bg-secondary/70 border-b border-divider pointer-events-none"
      />

      <div className="relative z-10 container mx-auto flex items-center justify-between px-4 md:px-6">
        {/* CONTROLS - Now positioned on the left side */}
        <div className="flex items-center gap-2">
          {/* Font selector */}
          <div className="flex items-center">
            <FontSelector
              variant="dropdown"
              showPreview={false}
              className="control-btn"
              customTrigger={
                <button
                  className="flex items-center justify-center h-9 w-9 rounded-md
                            bg-bg-tertiary/80 hover:bg-bg-tertiary transition-colors
                            backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-accent-primary"
                  aria-label="Change font"
                >
                  <span className="text-lg font-semibold">T</span>
                </button>
              }
            />
          </div>

          {/* Theme selector */}
          <div className="mx-1">
            <ThemeSelector
              variant="dropdown"
              showLabels={false}
              size="sm"
            />
          </div>

          {/* Light/dark mode toggle */}
          <button
            onClick={toggleMode}
            aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            aria-pressed={mode === "dark"}
            className="flex items-center justify-center h-9 w-9 rounded-md
                      bg-bg-tertiary/80 hover:bg-bg-tertiary transition-colors
                      backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            <Icon name={mode === "light" ? "fi:FiMoon" : "fi:FiSun"} size={18} />
          </button>
        </div>

        {/* Main Navigation - Now positioned on the right side */}
        <motion.nav style={{ gap: navSpacing }} className="hidden lg:flex items-center">
          <ul className="flex items-center gap-6">
            {NAV.map(({ n, label, href }) => {
              const active = pathname === href;
              return (
                <li key={href} className="relative">
                  <Link href={href} className="group flex items-center gap-2 px-2 py-1">
                    <span
                      className="font-mono text-xs opacity-70 group-hover:opacity-100 transition-opacity"
                      style={{ color: "var(--color-accent-secondary)" }}
                    >
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

                    {/* Enhanced active indicator with animation */}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-x-[-8px] top-0 h-full -z-[1] rounded-sm"
                        style={{
                          background: "color-mix(in srgb, var(--color-accent-primary) 10%, transparent)",
                          border: "1px solid var(--color-accent-primary)"
                        }}
                        transition={{ type: "spring", stiffness: 600, damping: 40 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      </div>

    </motion.header>
  );
}
