"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Icon from "@/components/common/Icons/Icon";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

interface ThemeSelectorProps {
  className?: string;
  variant?: "dropdown" | "buttons" | "grid";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

type ThemeId = 'green' | 'blue' | 'red' | 'monochrome' | 'earth' | 'forest-mist' | 'mystic-forest' | 'sunset-oasis' |
  'winter' | 'yellow' | 'tropical-paradise' | 'urban-splash' | 'duotone' | 'nostalgia-pastel' | 'modern-pro' | 'cyber' |
  'concrete-jungle' | 'quantum-nebula' | 'cyber-punk-graffiti' | 'aurora-borealis';

interface DropdownPosition {
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  className = "",
  variant = "dropdown",
  size = "md",
  showLabels = true,
}) => {
  const { colorTheme, setColorTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, right: 0, left: 0 });

  // Close dropdown when clicking outside
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  // Close on ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  // Calculate dropdown position on open
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceRight = window.innerWidth - rect.right;

      // Determine vertical position based on available space
      const verticalPosition = spaceBelow < 350 ? { bottom: window.innerHeight - rect.top } : { top: rect.bottom };

      // Determine horizontal position based on available space
      let horizontalPosition;
      if (spaceRight < 260) {
        horizontalPosition = { right: 5 }; // Position from right edge of viewport with padding
      } else {
        horizontalPosition = { left: Math.max(5, rect.left) }; // Ensure it's not off-screen left
      }

      setDropdownPosition({
        ...verticalPosition,
        ...horizontalPosition,
      });
    }
  }, [isOpen]);

  // Enhanced theme options with better organization
  const themeCategories = [
    {
      name: "Standard",
      themes: [
        {
          id: "green",
          name: "Green",
          primary: "var(--green-500)",
          secondary: "var(--blue-500)",
        },
        {
          id: "blue",
          name: "Blue",
          primary: "#4d89e8",
          secondary: "#3ab0bf",
        },
        {
          id: "red",
          name: "Red",
          primary: "#BE2D44",
          secondary: "#345C80",
        },
        {
          id: "monochrome",
          name: "Monochrome",
          primary: "var(--platinum-600)",
          secondary: "var(--accent-500)",
        },
      ]
    },
    {
      name: "Nature",
      themes: [
        {
          id: "earth",
          name: "Earth",
          primary: "#2A7D4B",
          secondary: "#1A7D7C",
        },
        {
          id: "forest-mist",
          name: "Forest",
          primary: "#6abaa3",
          secondary: "#7da5c6",
        },
        {
          id: "mystic-forest",
          name: "Mystic",
          primary: "#84F7C7",
          secondary: "#B19FFF",
        },
        {
          id: "sunset-oasis",
          name: "Sunset",
          primary: "#E98755",
          secondary: "#4DBDAF",
        },
        {
          id: "winter",
          name: "Winter",
          primary: "#4CBFFF",
          secondary: "#B8A3FF",
        },
        {
          id: "yellow",
          name: "Golden",
          primary: "#FFB824",
          secondary: "#9F86FF",
        },
        {
          id: "tropical-paradise",
          name: "Tropical",
          primary: "#00CFC4",
          secondary: "#FF7361",
        },
      ]
    },
    {
      name: "Creative",
      themes: [
        {
          id: "urban-splash",
          name: "Urban",
          primary: "#ff2882",
          secondary: "#00e6ff",
        },
        {
          id: "duotone",
          name: "Duotone",
          primary: "#3BBDAA",
          secondary: "#5B56E0",
        },
        {
          id: "nostalgia-pastel",
          name: "Nostalgia",
          primary: "#8FCDFF",
          secondary: "#FFC178",
        },
        {
          id: "modern-pro",
          name: "Pro",
          primary: "#E94560",
          secondary: "#0F3460",
        },
      ]
    },
    {
      name: "Technical",
      themes: [
        {
          id: "cyber",
          name: "Cyber",
          primary: "#FF2B8C",
          secondary: "#00F2FF",
        },
        {
          id: "concrete-jungle",
          name: "Concrete",
          primary: "#AF7D41",
          secondary: "#699379",
        },
        {
          id: "quantum-nebula",
          name: "Quantum",
          primary: "#5D7AFF",
          secondary: "#00D4D0",
        },
        {
          id: "cyber-punk-graffiti",
          name: "Cyberpunk",
          primary: "#41FC03",
          secondary: "#03FCDA",
        },
      ]
    }
  ];

  // Flatten themes for certain operations
  const allThemes = themeCategories.flatMap(category => category.themes);

  // Function to handle theme selection
  const handleThemeChange = (themeId: string) => {
    setColorTheme(themeId as ThemeId);
    setIsOpen(false);
  };

  // Get current theme details
  const currentTheme = allThemes.find((theme) => theme.id === colorTheme) || allThemes[0];

  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const sizeTextClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const buttonSizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

  // Dropdown variants - enhanced with smoother animations
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Render dropdown variant - enhanced with better UI and positioning
  if (variant === "dropdown") {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center ${buttonSizeClasses[size]} rounded-md
                    bg-bg-tertiary/80 hover:bg-bg-tertiary transition-colors backdrop-blur-sm
                    focus-visible:ring-2 focus-visible:ring-accent-primary`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Select theme"
        >
          <span
            className="inline-block w-5 h-5 rounded-full overflow-hidden ring-1 ring-divider"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
            }}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed z-50 p-2 w-60 md:w-64 bg-bg-card rounded-md shadow-lg border border-divider"
              style={{
                ...dropdownPosition,
                maxHeight: "min(80vh, 400px)",
                overflowY: "auto"
              }}
            >
              {themeCategories.map(category => (
                <div key={category.name} className="mb-2 last:mb-0">
                  <div className="text-xs font-medium text-text-secondary px-2 py-1.5 mb-1">
                    {category.name}
                  </div>

                  <ul className="grid grid-cols-2 gap-1" role="listbox">
                    {category.themes.map((theme) => (
                      <li
                        key={theme.id}
                        role="option"
                        aria-selected={colorTheme === theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`px-2 py-1.5 rounded flex items-center space-x-2 cursor-pointer transition-colors
                                    hover:bg-bg-hover ${colorTheme === theme.id ? "bg-bg-active" : ""}`}
                      >
                        <span
                          className="block w-5 h-5 rounded-full overflow-hidden ring-1 ring-divider flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                          }}
                        />
                        <span className="text-sm truncate">{theme.name}</span>

                        {colorTheme === theme.id && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto flex-shrink-0"
                          >
                            <Icon name="fi:FiCheck" size={14} className="text-accent-primary" />
                          </motion.span>
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

  // Render buttons variant with improved styling
  if (variant === "buttons") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {allThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors border
                      ${colorTheme === theme.id
                ? "bg-bg-active border-accent-primary/50"
                : "bg-bg-tertiary/80 border-divider hover:bg-bg-hover"
              }`}
            aria-pressed={colorTheme === theme.id}
          >
            <span
              className="inline-block w-4 h-4 rounded-full overflow-hidden ring-1 ring-divider/30"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              }}
            />
            {showLabels && <span className="text-sm">{theme.name}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Render grid variant with improved styling
  return (
    <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 ${className}`}>
      {allThemes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => handleThemeChange(theme.id)}
          className={`flex flex-col items-center p-2 rounded-md transition-colors border
                    ${colorTheme === theme.id
              ? "bg-bg-active border-accent-primary/50"
              : "bg-bg-tertiary/80 border-divider hover:bg-bg-hover"
            }`}
          aria-pressed={colorTheme === theme.id}
        >
          <div
            className={`${sizeClasses[size]} rounded-full mb-1 overflow-hidden ring-1 ring-divider/30`}
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            }}
          />
          {showLabels && (
            <span className={`${sizeTextClasses[size]} truncate w-full text-center`}>{theme.name}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
