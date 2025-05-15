"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useAnimationPreferences } from "@/components/core/Animations/hooks/useAnimationPreferences";
import Icon from "@/components/common/Icons/Icon";
import { RemoveScroll } from "react-remove-scroll";
import FocusTrap from "focus-trap-react";
import ThemeSelector from "@/components/core/ThemeSelector";
import { FontSelector } from "@/components/common/Typography";

// Updated navigation items with Contact as 06
const navItems = [
  { label: "Home", href: "/", number: "01" },
  { label: "About", href: "/about", number: "02" },
  { label: "Services", href: "/services", number: "03" },
  { label: "Work", href: "/portfolio", number: "04" },
  { label: "Blog", href: "/blog", number: "05" },
  { label: "Contact", href: "/contact", number: "06" },
];

const MobileHeader: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const { shouldAnimate } = useAnimationPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Enhanced scroll animations
  const headerOpacity = useTransform(scrollY, [0, 100], [0.6, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 8]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.7]);

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
        {/* Header Bar - Enhanced with better animations and styling */}
        <motion.header
          ref={headerRef}
          className="fixed top-0 left-0 w-full z-50 h-16"
          style={{
            backdropFilter: `blur(${headerBlur.get()}px)`,
          }}
        >
          <motion.div
            className="absolute inset-0 border-b bg-bg-secondary/70"
            style={{
              opacity: headerOpacity,
              borderColor: `rgba(var(--divider-rgb), ${borderOpacity.get()})`
            }}
          />

          <div className="flex items-center justify-between h-full relative px-4">
            {/* Blueprint grid background for tech effect */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2328B487' stroke-width='0.5'%3E%3Crect x='0.5' y='0.5' width='39' height='39'/%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat"
              }}
            />

            {/* Empty div to maintain space - removed logo */}
            <div></div>

            {/* Action buttons with improved styling */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle with enhanced styling */}
              <button
                className="w-9 h-9 rounded-md flex items-center justify-center bg-bg-tertiary/80 backdrop-blur-sm hover:bg-bg-tertiary
                          focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors duration-200"
                onClick={toggleMode}
                aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
              >
                {mode === "light" ? (
                  <Icon name="fi:FiMoon" size={18} className="text-text-primary" />
                ) : (
                  <Icon name="fi:FiSun" size={18} className="text-text-primary" />
                )}
              </button>

              {/* Menu Toggle with enhanced styling */}
              <button
                className="w-9 h-9 rounded-md flex items-center justify-center bg-bg-tertiary/80 backdrop-blur-sm hover:bg-bg-tertiary
                          focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors duration-200"
                onClick={toggleDrawer}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <Icon name={isOpen ? "fi:FiX" : "fi:FiMenu"} size={18} className="text-text-primary" />
              </button>
            </div>
          </div>

          {/* Technical tick marks at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 w-px h-1"
                style={{
                  left: `${(i * 100) / 12}%`,
                  background: "color-mix(in srgb, var(--color-accent-primary) 20%, transparent)"
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.05 * (i % 4), duration: 0.4 }}
              />
            ))}
          </div>
        </motion.header>
      </motion.div>

      {/* Drawer Navigation - Enhanced with better styling and animations */}
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

            {/* Drawer - Enhanced with better styling */}
            <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true }}>
              <RemoveScroll enabled={isOpen} forwardProps>
                <motion.nav
                  className="fixed top-0 right-0 w-[85vw] max-w-md h-full bg-bg-secondary z-50 shadow-lg border-l border-divider"
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
                    {/* Header with close button - Navigation text removed */}
                    <div className="px-6 py-5 flex justify-end items-center border-b border-divider">
                      <button
                        className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                      >
                        <Icon name="fi:FiX" size={20} className="text-text-primary" />
                      </button>
                    </div>

                    {/* Navigation links with enhanced styling */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                      <ul className="space-y-6">
                        {navItems.map((item, index) => (
                          <motion.li
                            key={item.href}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                          >
                            <Link
                              href={item.href}
                              className={`flex items-center py-3 focus-visible:ring-2 focus-visible:ring-accent-primary rounded-md transition-colors
                                ${activeItem === item.href
                                  ? "text-heading font-medium"
                                  : "text-text-secondary hover:text-heading"
                                }`}
                              onClick={() => setIsOpen(false)}
                            >
                              <span
                                className="mr-3 font-mono text-sm opacity-80"
                                style={{ color: "var(--color-accent-primary)" }}
                              >
                                {item.number}
                              </span>
                              <span className="text-lg">{item.label}</span>

                              {activeItem === item.href && (
                                <motion.span
                                  layoutId="mobile-nav-active"
                                  className="ml-auto w-1.5 h-6 rounded-full"
                                  style={{ background: "var(--color-accent-primary)" }}
                                  transition={{ type: "spring", stiffness: 600, damping: 35 }}
                                />
                              )}
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Settings section */}
                    <div className="px-6 py-5 border-t border-divider">
                      <p className="text-sm font-medium text-text-secondary mb-4">Settings</p>
                      <div className="flex flex-col gap-4">
                        {/* Theme selector */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Theme</span>
                          <ThemeSelector variant="dropdown" showLabels={false} size="sm" />
                        </div>

                        {/* Font selector */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Font</span>
                          <FontSelector variant="dropdown" showPreview={false} />
                        </div>
                      </div>
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