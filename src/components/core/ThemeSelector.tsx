"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Icon from "@/components/common/Icons/Icon";

interface ThemeSelectorProps {
  className?: string;
  variant?: "dropdown" | "buttons" | "grid";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  className = "",
  variant = "dropdown",
  size = "md",
  showLabels = true,
}) => {
  const { colorTheme, setColorTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Available themes
  // Inside your ThemeSelector component
  // Inside your ThemeSelector component
  const themes = [
    {
      id: "green",
      name: "Green",
      primary: "var(--green-500)",
      secondary: "var(--blue-500)",
    },
    {
      id: "sunset-oasis",
      name: "Sunset Oasis",
      primary: "var(--sunset-500)",
      secondary: "var(--oasis-500)",
    },
    {
      id: "cyber-punk-graffiti",
      name: "Cyberpunk",
      primary: "var(--cyber-500)",
      secondary: "var(--cyan-500)",
    },
    {
      id: "monochrome",
      name: "Monochrome",
      primary: "var(--platinum-600)",
      secondary: "var(--accent-500)",
    },
    {
      id: "mystic-forest",
      name: "Mystic Forest",
      primary: "var(--mushroom-300)",
      secondary: "var(--wildflower-300)",
    },
    // Add other themes as needed
  ];

  // Function to handle theme selection
  const handleThemeChange = (themeId: string) => {
    setColorTheme(themeId as any);
    setIsOpen(false);
  };

  // Get current theme details
  const currentTheme =
    themes.find((theme) => theme.id === colorTheme) || themes[0];

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

  // Render dropdown variant
  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between space-x-2 px-3 py-2 rounded-md bg-bg-secondary hover:bg-bg-tertiary border border-border transition-colors`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="flex items-center space-x-2">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              }}
            />
            {showLabels && <span>{currentTheme.name}</span>}
          </span>
          <Icon
            name="fi:FiChevronDown"
            size={16}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 py-2 w-48 bg-bg-card rounded-md shadow-md border border-border"
          >
            <ul className="py-1" role="listbox">
              {themes.map((theme) => (
                <li
                  key={theme.id}
                  role="option"
                  aria-selected={colorTheme === theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`px-3 py-2 flex items-center space-x-3 cursor-pointer hover:bg-bg-hover ${
                    colorTheme === theme.id ? "bg-bg-active" : ""
                  }`}
                >
                  <span
                    className="block w-5 h-5 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    }}
                  />
                  <span>{theme.name}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    );
  }

  // Render buttons variant
  if (variant === "buttons") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              colorTheme === theme.id
                ? "bg-bg-active"
                : "bg-bg-tertiary hover:bg-bg-hover"
            }`}
            aria-pressed={colorTheme === theme.id}
          >
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              }}
            />
            {showLabels && <span>{theme.name}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Render grid variant
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => handleThemeChange(theme.id)}
          className={`flex flex-col items-center p-2 rounded-md transition-colors ${
            colorTheme === theme.id
              ? "bg-bg-active"
              : "bg-bg-tertiary hover:bg-bg-hover"
          }`}
          aria-pressed={colorTheme === theme.id}
        >
          <div
            className={`${sizeClasses[size]} rounded-full mb-1`}
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            }}
          />
          {showLabels && (
            <span className={sizeTextClasses[size]}>{theme.name}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
