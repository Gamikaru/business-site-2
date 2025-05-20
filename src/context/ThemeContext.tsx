"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

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
  | "winter"
  | "yellow";

type Mode = "light" | "dark";

interface ThemeContextType {
  colorTheme: ColorTheme;
  mode: Mode;
  setColorTheme: (theme: ColorTheme) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>("green");
  const [mode, setMode] = useState<Mode>("light");

  // Load saved preferences or system preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedColor = localStorage.getItem("colorTheme") as ColorTheme;
      const storedMode = localStorage.getItem("mode") as Mode;
      if (storedColor) setColorTheme(storedColor);
      if (storedMode) setMode(storedMode);
      else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setMode(prefersDark ? "dark" : "light");
      }
    }
  }, []);

  // Apply only the data-attributes—do NOT wipe out all classes
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Set data attributes
      document.documentElement.setAttribute("data-color-theme", colorTheme);
      document.documentElement.setAttribute("data-mode", mode);
      document.documentElement.setAttribute(
        "data-theme",
        `${colorTheme}-${mode}`
      );

      // Persist
      localStorage.setItem("colorTheme", colorTheme);
      localStorage.setItem("mode", mode);
    }
  }, [colorTheme, mode]);

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider
      value={{ colorTheme, mode, setColorTheme, toggleMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
