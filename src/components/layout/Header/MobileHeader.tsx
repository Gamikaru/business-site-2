"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useAnimationPreferences } from "@/components/core/Animations/hooks/useAnimationPreferences";
import Icon from "@/components/common/Icons/Icon";
import { RemoveScroll } from "react-remove-scroll";
import FocusTrap from "focus-trap-react";

// Define the navigation items
const navItems = [
  { label: "Home", href: "/", number: "01" },
  { label: "About", href: "/about", number: "02" },
  { label: "Services", href: "/services", number: "03" },
  { label: "Work", href: "/portfolio", number: "04" },
  { label: "Blog", href: "/blog", number: "05" },
];

const MobileHeader: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const { shouldAnimate } = useAnimationPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const headerRef = useRef<HTMLDivElement>(null);

  // Define animations
  const drawerVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "tween",
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    open: {
      x: 0,
      transition: {
        type: "tween",
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const pageScaleVariants = {
    open: {
      scale: 0.96,
      filter: "blur(3px)",
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    closed: {
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Update active navigation item based on pathname
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveItem(window.location.pathname);

      // Close drawer when navigation occurs
      const handleRouteChange = () => {
        setIsOpen(false);
      };

      window.addEventListener("popstate", handleRouteChange);
      return () => window.removeEventListener("popstate", handleRouteChange);
    }
  }, []);

  // Toggle the drawer state
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Page scaling container */}
      <motion.div
        className="min-h-screen"
        animate={isOpen && shouldAnimate() ? "open" : "closed"}
        variants={shouldAnimate() ? pageScaleVariants : undefined}
        initial={false}
      >
        {/* Header Bar */}
        <header
          ref={headerRef}
          className="fixed top-0 left-0 w-full bg-transparent z-50 h-16 px-4" // changed bg-bg-primary to bg-transparent, removed border
        >
          <div className="flex items-center justify-between h-full relative">
            {/* Blueprint grid background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2328B487' stroke-width='0.5'%3E%3Crect x='0.5' y='0.5' width='39' height='39'/%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat"
              }}
            />

            {/* Logo */}
            <Link
              href="/"
              className="font-heading text-heading font-bold flex items-center focus-visible-ring rounded-md relative z-10"
            >
              <div className="relative pr-2">
                <div className="absolute left-0 top-0 w-1 h-full bg-brand-primary" />
                <span className="pl-3 text-2xl">GAV</span>
              </div>
            </Link>

            {/* Action buttons */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center bg-bg-tertiary focus-visible-ring transition-colors duration-200"
                onClick={toggleMode}
                aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
              >
                {mode === "light" ? (
                  <Icon name="fi:FiMoon" size={18} className="text-text-primary" />
                ) : (
                  <Icon name="fi:FiSun" size={18} className="text-text-primary" />
                )}
              </button>

              {/* Menu Toggle */}
              <button
                className="w-10 h-10 rounded-md flex items-center justify-center bg-bg-tertiary focus-visible-ring transition-colors duration-200"
                onClick={toggleDrawer}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <Icon name={isOpen ? "fi:FiX" : "fi:FiMenu"} size={20} className="text-text-primary" />
              </button>
            </div>
          </div>
        </header>
      </motion.div>

      {/* Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-overlay z-40"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true }}>
              <RemoveScroll enabled={isOpen} forwardProps>
                <motion.nav
                  className="fixed top-0 right-0 w-[90vw] max-w-md h-full bg-bg-secondary z-50 shadow-lg"
                  variants={drawerVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  style={{
                    paddingTop: 'env(safe-area-inset-top)',
                    paddingBottom: 'env(safe-area-inset-bottom)'
                  }}
                >
                  <div className="flex flex-col h-full">
                    {/* Close button */}
                    <div className="px-6 py-4 flex justify-end">
                      <button
                        className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-bg-hover focus-visible-ring transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                      >
                        <Icon name="fi:FiX" size={24} className="text-text-primary" />
                      </button>
                    </div>

                    {/* Navigation links */}
                    <div className="flex-1 overflow-y-auto px-6">
                      <ul className="space-y-4">
                        {navItems.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={`flex items-center py-3 focus-visible-ring rounded-md transition-colors
                                ${activeItem === item.href
                                  ? "text-heading font-medium"
                                  : "text-text-secondary hover:text-heading"
                                }`}
                              onClick={() => setIsOpen(false)}
                            >
                              <span className="text-brand-primary mr-3 font-mono text-sm opacity-80">
                                {item.number}
                              </span>
                              <span className="text-lg">{item.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA button */}
                    <div className="p-6 border-t border-divider">
                      <Link
                        href="/contact"
                        className="w-full bg-gradient-button text-text-on-accent py-3 px-6 rounded-md font-medium text-center block shadow-button transition-all duration-150 hover:shadow-lg focus-visible-ring"
                        onClick={() => setIsOpen(false)}
                      >
                        Book a Strategy Call
                      </Link>
                    </div>
                  </div>
                </motion.nav>
              </RemoveScroll>
            </FocusTrap>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileHeader;