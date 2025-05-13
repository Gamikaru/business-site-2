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
      id: "blue",
      name: "Blue",
      primary: "#4d89e8", // Refined blue from blue theme
      secondary: "#3ab0bf", // Complementary teal from blue theme
    },
    {
      id: "concrete-jungle",
      name: "Concrete",
      primary: "#AF7D41", // Oxidized metal from concrete-jungle theme
      secondary: "#699379", // Urban moss from concrete-jungle theme
    },
    {
      id: "urban-splash",
      name: "Urban Splash",
      primary: "#ff2882", // Electric pink from urban-splash theme
      secondary: "#00e6ff", // Electric blue from urban-splash theme
    },
    {
      id: "forest-mist",
      name: "Forest Mist",
      primary: "#6abaa3", // Misty teal from forest-mist theme
      secondary: "#7da5c6", // Misty blue from forest-mist theme
    },
    {
      id: "modern-pro",
      name: "Modern Pro",
      primary: "#e94560", // Vibrant red from modern pro theme
      secondary: "#0f3460", // Deep blue from modern pro theme
    },
    {
      id: "duotone",
      name: "Duotone",
      primary: "#6923b0", // Rich purple from duotone theme
      secondary: "#4ad8bb", // Balanced teal from duotone theme
    },
    {
      id: "red",
      name: "Red",
      primary: "#BE2D44", // Refined deep crimson from red theme
      secondary: "#345C80", // Deep oceanic blue from red theme
    },
    {
      id: "sunset-oasis",
      name: "Sunset Oasis",
      primary: "var(--sunset-500)",
      secondary: "var(--oasis-500)",
    },
    {
      id: "cyber",
      name: "Cyber",
      primary: "#FF2B8C", // Neon magenta from cyber theme
      secondary: "#00F2FF", // Neon cyan from cyber theme
    },
    {
      id: "tropical-paradise",
      name: "Tropical",
      primary: "#00D1C6", // Vibrant teal from tropical theme
      secondary: "#FF7E6B", // Sunset coral from tropical theme
    },
    {
      id: "nostalgia-pastel",
      name: "Nostalgia",
      primary: "#8FCDFF", // Arcade blue from nostalgia theme
      secondary: "#FFC178", // Retro orange from nostalgia theme
    },
    {
      id: "quantum-nebula",
      name: "Quantum",
      primary: "#5D7AFF", // Quantum blue from quantum theme
      secondary: "#00D4D0", // Nebula teal from quantum theme
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
