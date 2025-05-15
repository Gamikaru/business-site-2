"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFontContext } from "@/context/FontContext";
import { cn } from "@/utils/classNames";
import Icon from "@/components/common/Icons/Icon";
import dynamic from 'next/dynamic';

// Dynamically import the FontInspector to avoid SSR issues
const FontInspector = dynamic(() => import('./FontInspector'), { ssr: false });

interface FontSelectorProps {
  className?: string;
  variant?: "dropdown" | "buttons" | "compact";
  showPreview?: boolean;
  align?: "left" | "center" | "right";
  maxItems?: number;
  customTrigger?: React.ReactNode;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  className = "",
  variant = "dropdown",
  showPreview = true,
  align = "left",
  maxItems = 4,
  customTrigger = null,
}) => {
  const { fontSystem, changeFontSystem, FONT_SYSTEMS, currentSystemData, fontsLoaded } =
    useFontContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get all available font systems as an array
  const fontSystems = Object.values(FONT_SYSTEMS);

  // Get name of current font system
  const currentFontName = currentSystemData?.name || "Modern";

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen]);

  // Handle toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle font selection
  const handleFontSelect = (fontId: string) => {
    changeFontSystem(fontId);
    setIsOpen(false);
  };

  // Alignment classes
  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  // State for managing dropdown position
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 0 });
  const triggerRef = useRef<HTMLDivElement | HTMLButtonElement>(null);

  // Calculate dropdown position on open
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceRight = window.innerWidth - rect.left;
      const spaceLeft = rect.right;

      // Determine if we have enough space below, otherwise position above
      const verticalPosition = spaceBelow < 320 ? { bottom: window.innerHeight - rect.top } : { top: rect.bottom };

      // Determine horizontal position based on available space
      let horizontalPosition;
      if (align === 'right') {
        horizontalPosition = { right: window.innerWidth - rect.right };
      } else if (align === 'center') {
        horizontalPosition = { left: rect.left + (rect.width / 2) - 120 }; // 240/2 = 120
      } else {
        // Default left alignment, but check if there's enough space
        if (spaceRight < 240 && spaceLeft >= 240) {
          horizontalPosition = { right: window.innerWidth - rect.left };
        } else {
          horizontalPosition = { left: rect.left };
        }
      }

      setDropdownPosition({
        ...verticalPosition,
        ...horizontalPosition,
      });
    }
  }, [isOpen, align]);

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Group fonts by category for better organization
  const fontCategories = {
    Modern: fontSystems.filter((f) =>
      ["modern", "clarity", "corporate"].some(
        (term) =>
          f.id.toLowerCase().includes(term) ||
          f.name.toLowerCase().includes(term)
      )
    ),
    Serif: fontSystems.filter((f) =>
      ["serif", "elegant", "classic"].some(
        (term) =>
          f.id.toLowerCase().includes(term) ||
          f.name.toLowerCase().includes(term)
      )
    ),
    Display: fontSystems.filter((f) =>
      ["display", "creative"].some(
        (term) =>
          f.id.toLowerCase().includes(term) ||
          f.name.toLowerCase().includes(term)
      )
    ),
    Other: fontSystems.filter(
      (f) =>
        ![
          "modern",
          "clarity",
          "corporate",
          "serif",
          "elegant",
          "classic",
          "display",
          "creative",
        ].some(
          (term) =>
            f.id.toLowerCase().includes(term) ||
            f.name.toLowerCase().includes(term)
        )
    ),
  };

  // Filter out empty categories
  const nonEmptyCategories = Object.entries(fontCategories).filter(
    ([_, fonts]) => fonts.length > 0
  );

  // Render variant: dropdown - enhanced with better UI and animations
  if (variant === "dropdown") {
    return (
      <div ref={dropdownRef} className={`relative font-body ${className}`}>
        {/* Custom or Default Trigger Button with improved styling */}
        {customTrigger ? (
          <div
            ref={triggerRef as React.RefObject<HTMLDivElement>}
            onClick={toggleDropdown}
            className="cursor-pointer"
          >
            {customTrigger}
          </div>
        ) : (
          <button
            ref={triggerRef as React.RefObject<HTMLButtonElement>}
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-bg-tertiary/80 hover:bg-bg-tertiary
                      backdrop-blur-sm border border-divider transition-colors
                      focus-visible:ring-2 focus-visible:ring-accent-primary"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span className="whitespace-normal text-sm">{currentFontName}</span>
            <Icon
              name={isOpen ? "fi:FiChevronUp" : "fi:FiChevronDown"}
              size={16}
              className="text-text-secondary"
            />
          </button>
        )}

        {/* Enhanced Dropdown Menu with better positioning */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed z-50 w-60 md:w-64 rounded-md shadow-lg bg-bg-card border border-divider"
              style={{
                ...dropdownPosition,
                maxHeight: "min(400px, 80vh)",
                overflowY: "auto"
              }}
            >
              {nonEmptyCategories.map(([category, fonts]) => (
                <div key={category} className="mb-2 last:mb-0">
                  <div className="text-xs font-medium text-text-secondary px-3 py-1.5">
                    {category}
                  </div>

                  <ul
                    role="listbox"
                    className="py-1"
                    aria-activedescendant={fontSystem}
                  >
                    {fonts.map((font) => (
                      <li
                        key={font.id}
                        id={font.id}
                        role="option"
                        aria-selected={fontSystem === font.id}
                        onClick={() => handleFontSelect(font.id)}
                        className={cn(
                          "px-4 py-2 cursor-pointer hover:bg-bg-hover whitespace-normal",
                          fontSystem === font.id && "bg-bg-active"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{font.name}</span>
                          {fontSystem === font.id && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto flex-shrink-0"
                            >
                              <Icon
                                name="fi:FiCheck"
                                size={14}
                                className="text-accent-primary ml-2"
                              />
                            </motion.span>
                          )}
                        </div>

                        {showPreview && (
                          <div className="mt-1 text-xs opacity-70 whitespace-normal">
                            <span
                              className="font-heading"
                              data-font-system={font.id}
                            >
                              Heading
                            </span>
                            {" + "}
                            <span
                              className="font-body"
                              data-font-system={font.id}
                            >
                              Body
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Render variant: buttons with improved styling
  if (variant === "buttons") {
    return (
      <div
        className={`flex flex-wrap gap-2 ${className} ${alignmentClasses[align]}`}
      >
        {fontSystems.slice(0, maxItems).map((font) => (
          <button
            key={font.id}
            onClick={() => changeFontSystem(font.id)}
            className={cn(
              "px-3 py-2 rounded-md border whitespace-normal text-sm transition-colors",
              fontSystem === font.id
                ? "bg-bg-active border-accent-primary"
                : "bg-bg-tertiary/80 border-divider hover:bg-bg-hover"
            )}
          >
            {font.name}
          </button>
        ))}

        {fontSystems.length > maxItems && (
          <button className="px-3 py-2 rounded-md bg-bg-tertiary/80 border border-divider hover:bg-bg-hover whitespace-normal text-sm">
            +{fontSystems.length - maxItems} more
          </button>
        )}
      </div>
    );
  }

  // Render variant: compact with improved styling and debugging
  return (
    <div className={`${className}`}>
      <select
        value={fontSystem}
        onChange={(e) => changeFontSystem(e.target.value)}
        className="px-2 py-1 text-sm rounded-md bg-bg-tertiary/80 border border-divider
                 focus:outline-none focus:ring-2 focus:ring-accent-primary whitespace-normal"
        style={{ fontFamily: currentSystemData?.body.family || 'inherit' }}
      >
        {fontSystems.map((font) => (
          <option
            key={font.id}
            value={font.id}
            style={{
              fontFamily: font.body.family,
              fontWeight: fontSystem === font.id ? 'bold' : 'normal'
            }}
          >
            {font.name}
          </option>
        ))}
      </select>

      {/* Add FontInspector in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4">
          <FontInspector />
        </div>
      )}
    </div>
  );
};

export default FontSelector;