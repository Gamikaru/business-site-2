"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
  showColorIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = "",
  showColorIcon = true,
  size = "md"
}) => {
  const { colorTheme, mode, toggleMode } = useTheme();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

  // Get current theme colors based on the active theme
  const getThemeColors = () => {
    // Default colors if theme isn't found
    let primary = "#4d89e8"; // Blue default

    // Map of theme IDs to their primary colors
    const themeColorMap: Record<string, string> = {
      green: "var(--green-500)",
      blue: "#4d89e8",
      red: "#BE2D44",
      monochrome: "var(--platinum-600)",
      earth: "#2A7D4B",
      "forest-mist": "#6abaa3",
      "mystic-forest": "#84F7C7",
      "sunset-oasis": "#E98755",
      winter: "#4CBFFF",
      yellow: "#FFB824",
      "tropical-paradise": "#00CFC4",
      "urban-splash": "#ff2882",
      duotone: "#3BBDAA",
      "nostalgia-pastel": "#8FCDFF",
      "modern-pro": "#E94560",
      cyber: "#FF2B8C",
      "concrete-jungle": "#AF7D41",
      "quantum-nebula": "#5D7AFF",
      "cyber-punk-graffiti": "#41FC03"
    };

    if (themeColorMap[colorTheme]) {
      primary = themeColorMap[colorTheme];
    }

    return { primary };
  };

  const { primary } = getThemeColors();

  return (
    <button
      onClick={toggleMode}
      className={`flex items-center justify-center ${sizeClasses[size]} rounded-md bg-bg-tertiary/80 hover:bg-bg-tertiary transition-colors backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-accent-primary ${className}`}
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? (
        // Moon icon for light mode (switch to dark)
        <div className="relative">
          {showColorIcon && (
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full ring-1 ring-divider"
              style={{ background: primary }}
            />
          )}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 11.32 20.96 10.65 20.87 10C19.92 10.63 18.82 11 17.66 11C14.38 11 11.74 8.36 11.74 5.08C11.74 3.91 12.11 2.82 12.74 1.87C12.09 1.77 11.42 1.74 10.74 1.74H10C6.13 1.74 3 4.87 3 8.74V9.26C3 15.26 8.22 20.26 15 20.26H15.5C19.36 20.26 22.26 17.36 22.26 13.5V13C22.26 9.3 20.22 6 17 4.32C15.53 3.44 13.82 3 12 3Z"
              fill="currentColor"
            />
          </svg>
        </div>
      ) : (
        // Sun icon for dark mode (switch to light)
        <div className="relative">
          {showColorIcon && (
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full ring-1 ring-divider"
              style={{ background: primary }}
            />
          )}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
              fill="currentColor"
            />
            <path
              d="M12 1V3M12 21V23M23 12H21M3 12H1M20.071 3.929L18.657 5.343M5.343 18.657L3.929 20.071M20.071 20.071L18.657 18.657M5.343 5.343L3.929 3.929"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
};

export default ThemeSwitcher;