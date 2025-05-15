"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define theme types - ensure we include all available themes
type ColorTheme =
  | "green"
  | "blue"
  | "aurora-borealis"
  | "concrete-jungle"
  | "cyber-punk-graffiti"
  | "cyber"
  | "duotone"
  | "earth"
  | "forest-mist"
  | "leather"
  | "modern-pro"
  | "monochrome"
  | "mystic-forest"
  | "nostalgia-pastel"
  | "quantum-nebula"
  | "red"
  | "royal-jewel"
  | "silver"
  | "sunset-oasis"
  | "tropical-paradise"
  | "urban-splash"
  | "winter" // Added winter
  | "yellow"; // Added yellow

type Mode = "light" | "dark";

interface ThemeContextType {
  colorTheme: ColorTheme;
  mode: Mode;
  setColorTheme: (theme: ColorTheme) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>("green");
  const [mode, setMode] = useState<Mode>("light");

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for stored theme preferences
      const storedColorTheme = localStorage.getItem("colorTheme") as ColorTheme | null;
      const storedMode = localStorage.getItem("mode") as Mode | null;

      if (storedColorTheme) {
        setColorTheme(storedColorTheme);
      }

      if (storedMode) {
        setMode(storedMode);
      } else {
        // Check for system preference for light/dark mode
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setMode(prefersDark ? "dark" : "light");
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Clear previous themes
      document.documentElement.className = "";

      // Set both color theme and mode
      document.documentElement.setAttribute("data-color-theme", colorTheme);
      document.documentElement.setAttribute("data-mode", mode);

      // Set combined theme attribute for CSS selectors
      document.documentElement.setAttribute("data-theme", `${colorTheme}-${mode}`);

      // Store preferences
      localStorage.setItem("colorTheme", colorTheme);
      localStorage.setItem("mode", mode);
    }
  }, [colorTheme, mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ colorTheme, mode, setColorTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for accessing the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;