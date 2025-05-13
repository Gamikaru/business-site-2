"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useAnimationPreferences } from "@/components/core/Animations/hooks/useAnimationPreferences";
import Icon from "@/components/common/Icons/Icon";

// Define the navigation items
const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
];

const DesktopHeader: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const { shouldAnimate } = useAnimationPreferences();
  const [activeItem, setActiveItem] = useState("/");
  const { scrollY } = useScroll();

  // Define animated header height based on scroll position
  const headerHeight = useTransform(
    scrollY,
    [0, 120], // Scroll values
    [96, 64] // Height values (px)
  );

  const headerPadding = useTransform(
    scrollY,
    [0, 120],
    ["1.5rem", "0.75rem"] // Padding values
  );

  const logoScale = useTransform(scrollY, [0, 120], [1, 0.9]);

  // Update active navigation item based on pathname
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveItem(window.location.pathname);
    }
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 w-full bg-bg-primary z-50 border-b border-divider"
      style={{
        height: shouldAnimate() ? headerHeight : 64,
        paddingTop: shouldAnimate() ? headerPadding : "0.75rem",
        paddingBottom: shouldAnimate() ? headerPadding : "0.75rem",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container mx-auto grid grid-cols-12 gap-6 h-full items-center relative">
        {/* Blueprint measurement ticks */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-bg-primary overflow-hidden">
          <div className="w-full h-px border-t border-dashed border-accent-primary opacity-20"></div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-px bg-accent-primary opacity-30"
              style={{
                left: `${(i * 100) / 12}%`,
                bottom: 0,
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <motion.div
          className="col-span-2 flex items-center"
          style={{ scale: shouldAnimate() ? logoScale : 1 }}
        >
          <Link
            href="/"
            className="font-heading text-heading font-bold flex items-center focus-visible-ring rounded-md"
          >
            <div className="relative pr-2">
              <div className="absolute left-0 top-0 w-1 h-full bg-brand-primary" />
              <span className="pl-3 text-2xl">GAV</span>
            </div>
          </Link>
        </motion.div>

        {/* Navigation */}
        <nav className="col-span-7 h-full">
          <ul className="flex space-x-8 h-full items-center">
            {navItems.map((item) => (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={`flex items-center text-base transition-colors duration-200 focus-visible-ring rounded-md px-2 py-1 ${
                    activeItem === item.href
                      ? "text-heading font-medium"
                      : "text-text-secondary hover:text-heading"
                  }`}
                >
                  {item.label}
                  {activeItem === item.href && (
                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-primary" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="col-span-3 flex items-center justify-end space-x-4">
          {/* CTA Button */}
          <Link
            href="/contact"
            className="bg-gradient-button text-text-on-accent py-2 px-6 rounded-md font-medium text-sm shadow-button transition-all duration-150 hover:scale-103 hover:shadow-lg focus-visible-ring"
          >
            Book Call
          </Link>

          {/* Theme Toggle */}
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-bg-tertiary focus-visible-ring transition-colors duration-200"
            onClick={toggleMode}
            aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            aria-pressed={mode === "dark"}
          >
            {mode === "light" ? (
              <Icon name="fi:FiMoon" size={18} className="text-text-primary" />
            ) : (
              <Icon name="fi:FiSun" size={18} className="text-text-primary" />
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default DesktopHeader;
