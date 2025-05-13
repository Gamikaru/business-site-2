"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define system font fallbacks
export const SYSTEM_FONTS = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

// Enhance Font System with structured definitions
export const FONT_SYSTEMS = {
  MODERN: {
    id: "modern",
    name: "Modern",
    heading: {
      family: `var(--font-montserrat), ${SYSTEM_FONTS.sans}`, // Using CSS variable
      weights: [600, 700],
      letterSpacing: -0.01,
      features: "'kern', 'liga', 'calt', 'pnum'",
    },
    body: {
      family: `var(--font-inter), ${SYSTEM_FONTS.sans}`,
      weights: [400, 500, 600],
      letterSpacing: 0.025,
      features: "'kern', 'liga', 'calt', 'onum'",
    },
    code: {
      family: `var(--font-jetbrains-mono), ${SYSTEM_FONTS.mono}`,
      weights: [400, 500],
      letterSpacing: 0,
      features: "'kern', 'zero'",
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.6,
      code: 1.5,
    },
    scale: 1.2,
  },
  ELEGANT: {
    id: "elegant",
    name: "Elegant",
    heading: {
      family: `var(--font-playfair-display), ${SYSTEM_FONTS.serif}`,
      weights: [600, 700],
      letterSpacing: -0.02,
      features: "'kern', 'liga', 'calt', 'pnum', 'ss01'",
    },
    body: {
      family: `var(--font-lato), ${SYSTEM_FONTS.sans}`,
      weights: [400, 700],
      letterSpacing: 0.02,
      features: "'kern', 'liga', 'calt', 'onum'",
    },
    code: {
      family: `var(--font-fira-code), ${SYSTEM_FONTS.mono}`,
      weights: [400, 500],
      letterSpacing: 0,
      features: "'kern', 'liga'",
    },
    lineHeight: {
      tight: 1.3,
      normal: 1.7,
      code: 1.5,
    },
    scale: 1.25,
  },
  TECHNICAL: {
    id: "technical",
    name: "Technical",
    heading: {
      family: `var(--font-roboto), ${SYSTEM_FONTS.sans}`,
      weights: [500, 700],
      letterSpacing: 0,
      features: "'kern', 'liga', 'calt', 'pnum'",
    },
    body: {
      family: `var(--font-source-sans-pro), ${SYSTEM_FONTS.sans}`, // Keep this variable name for compatibility
      weights: [400, 600],
      letterSpacing: 0.015,
      features: "'kern', 'liga', 'calt'",
    },
    code: {
      family: `var(--font-inconsolata), ${SYSTEM_FONTS.mono}`,
      weights: [400, 500],
      letterSpacing: 0,
      features: "'kern', 'zero'",
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      code: 1.4,
    },
    scale: 1.2,
  },
  EDITORIAL: {
    id: "editorial",
    name: "Editorial",
    heading: {
      family: `var(--font-fraunces), ${SYSTEM_FONTS.serif}`,
      weights: [600, 700, 900],
      letterSpacing: -0.02,
      features: "'kern', 'liga', 'calt', 'pnum', 'ss01'",
    },
    body: {
      family: `var(--font-libre-franklin), ${SYSTEM_FONTS.sans}`,
      weights: [400, 500, 600],
      letterSpacing: 0.01,
      features: "'kern', 'liga', 'calt', 'onum'",
    },
    code: {
      family: `var(--font-ibm-plex-mono), ${SYSTEM_FONTS.mono}`,
      weights: [400, 500],
      letterSpacing: 0,
      features: "'kern', 'zero'",
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.65,
      code: 1.5,
    },
    scale: 1.3,
  },
  NEO_GEOMETRIC: {
    id: "neo-geometric",
    name: "Neo Geometric",
    heading: {
      family: `var(--font-space-grotesk), ${SYSTEM_FONTS.sans}`,
      weights: [500, 700],
      letterSpacing: -0.03,
      features: "'kern', 'liga', 'calt', 'ss01'",
    },
    body: {
      family: `var(--font-dm-sans), ${SYSTEM_FONTS.sans}`,
      weights: [400, 500, 700],
      letterSpacing: 0.01,
      features: "'kern', 'liga', 'calt'",
    },
    code: {
      family: `var(--font-jetbrains-mono), ${SYSTEM_FONTS.mono}`,  // Using JetBrains as fallback for Recursive Mono
      weights: [400, 500],
      letterSpacing: 0,
      features: "'kern', 'ss01', 'ss02'",
    },
    lineHeight: {
      tight: 1.15,
      normal: 1.6,
      code: 1.5,
    },
    scale: 1.25,
  },
  CYBERVOID: {
    id: "cybervoid",
    name: "Cybervoid",
    heading: {
      family: `var(--font-rajdhani), ${SYSTEM_FONTS.sans}`,
      weights: [500, 600, 700],
      letterSpacing: 0.03,
      features: "'kern', 'liga', 'calt'",
    },
    body: {
      family: `var(--font-quantico), ${SYSTEM_FONTS.sans}`,
      weights: [400, 700],
      letterSpacing: 0.01,
      features: "'kern', 'liga', 'calt'",
    },
    code: {
      family: `var(--font-vt323), ${SYSTEM_FONTS.mono}`,
      weights: [400],
      letterSpacing: 0,
      features: "'kern'",
    },
    lineHeight: {
      tight: 1.15,
      normal: 1.5,
      code: 1.4,
    },
    scale: 1.5,
  },
  SYSTEM: {
    id: "system",
    name: "System",
    heading: {
      family: SYSTEM_FONTS.sans,
      weights: [600, 700],
      letterSpacing: -0.01,
      features: "'kern', 'liga', 'calt'",
    },
    body: {
      family: SYSTEM_FONTS.sans,
      weights: [400, 500, 600],
      letterSpacing: 0.01,
      features: "'kern', 'liga', 'calt'",
    },
    code: {
      family: SYSTEM_FONTS.mono,
      weights: [400, 500],
      letterSpacing: 0,
      features: "'kern'",
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      code: 1.5,
    },
    scale: 1.2,
  },
};

// Map fonts to complementary color themes
export const FONT_THEME_RECOMMENDATIONS = {
  "neo-geometric": ["blue", "silver", "modern-pro"],
  cybervoid: ["cyber-punk-graffiti", "red", "duotone"],
  editorial: ["green", "earth", "royal-jewel"],
  technical: ["quantum-nebula", "monochrome", "silver"],
};

// TypeScript interfaces
interface FontSystem {
  id: string;
  name: string;
  heading: FontFamily;
  body: FontFamily;
  code: FontFamily;
  lineHeight: {
    tight: number;
    normal: number;
    code: number;
  };
  scale: number;
}

interface FontFamily {
  family: string;
  weights: number[];
  letterSpacing: number;
  features: string;
}

interface FontContextType {
  fontSystem: string;
  changeFontSystem: (newSystemId: string) => void;
  FONT_SYSTEMS: Record<string, FontSystem>;
  currentSystemData: FontSystem | undefined;
}

// Create context with a default undefined value
const FontContext = createContext<FontContextType | undefined>(undefined);

// Provider component
export const FontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get initial font system from localStorage or use default
  const getInitialFontSystem = () => {
    if (typeof window === "undefined") return FONT_SYSTEMS.MODERN.id;

    const savedFont = localStorage.getItem("fontSystem");
    return savedFont &&
      Object.values(FONT_SYSTEMS).some((system) => system.id === savedFont)
      ? savedFont
      : FONT_SYSTEMS.MODERN.id; // Default to MODERN font system
  };

  const [fontSystem, setFontSystem] = useState<string>(getInitialFontSystem);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update font system with enhanced properties
  const changeFontSystem = (newSystemId: string) => {
    const systemObj = Object.values(FONT_SYSTEMS).find(
      (system) => system.id === newSystemId
    );

    if (systemObj) {
      console.log(
        `Changing font system to: ${systemObj.name} (${systemObj.id})`
      );
      setFontSystem(systemObj.id);

      // Save to localStorage
      localStorage.setItem("fontSystem", systemObj.id);
    }
  };

  // Apply font system on initial load and changes
  useEffect(() => {
    if (!isMounted) return;

    const systemObj = Object.values(FONT_SYSTEMS).find(
      (system) => system.id === fontSystem
    );

    if (systemObj) {
      console.log(`Setting font system: ${systemObj.name} (${systemObj.id})`);

      // For debugging: examine actual family values
      console.log("Heading font:", systemObj.heading.family);
      console.log("Body font:", systemObj.body.family);
      console.log("Code font:", systemObj.code.family);

      // Apply font properties to CSS variables
      // We need to get *just* the actual font name part, e.g., 'Montserrat' not 'var(--font-montserrat)'
      const extractFontName = (fontFamily: string) => {
        // If it includes var(), extract just the font name
        if (fontFamily.includes('var(--font-')) {
          // Get the variable name inside var()
          const varName = fontFamily.match(/var\(([^)]+)\)/)?.[1];

          // Get the font name inside the variable - it will be something like '--font-montserrat'
          // We need to extract just 'Montserrat'
          if (varName) {
            const fontName = varName.replace('--font-', '').replace(/-/g, ' ');
            return fontName.charAt(0).toUpperCase() + fontName.slice(1);
          }
        }

        // If it's a direct font name with fallbacks, return the first one
        return fontFamily.split(',')[0].trim().replace(/['"]/g, '');
      };

      // Format font family properly with actual font name first, then fallbacks
      const formatFontFamily = (fontFamily: string, systemFallback: string) => {
        const fontName = extractFontName(fontFamily);
        return `"${fontName}", ${systemFallback}`;
      };

      document.documentElement.style.setProperty(
        "--font-heading",
        formatFontFamily(systemObj.heading.family, SYSTEM_FONTS.sans)
      );
      document.documentElement.style.setProperty(
        "--font-body",
        formatFontFamily(systemObj.body.family, SYSTEM_FONTS.sans)
      );
      document.documentElement.style.setProperty(
        "--font-code",
        formatFontFamily(systemObj.code.family, SYSTEM_FONTS.mono)
      );

      // Apply line heights
      document.documentElement.style.setProperty(
        "--line-height-tight",
        systemObj.lineHeight.tight.toString()
      );
      document.documentElement.style.setProperty(
        "--line-height-normal",
        systemObj.lineHeight.normal.toString()
      );
      document.documentElement.style.setProperty(
        "--line-height-code",
        systemObj.lineHeight.code.toString()
      );

      // Apply letter spacing
      document.documentElement.style.setProperty(
        "--letter-spacing-heading",
        `${systemObj.heading.letterSpacing}em`
      );
      document.documentElement.style.setProperty(
        "--letter-spacing-body",
        `${systemObj.body.letterSpacing}em`
      );
      document.documentElement.style.setProperty(
        "--letter-spacing-code",
        `${systemObj.code.letterSpacing}em`
      );

      // Apply font features
      document.documentElement.style.setProperty(
        "--font-feature-settings-heading",
        systemObj.heading.features
      );
      document.documentElement.style.setProperty(
        "--font-feature-settings-body",
        systemObj.body.features
      );
      document.documentElement.style.setProperty(
        "--font-feature-settings-code",
        systemObj.code.features
      );

      // Apply type scale
      document.documentElement.style.setProperty(
        "--font-scale-ratio",
        systemObj.scale.toString()
      );

      // Apply attributes for CSS selectors
      document.documentElement.setAttribute("data-font", systemObj.id);

      // Update classes for specific styling
      const currentFontClass = Array.from(
        document.documentElement.classList
      ).find((className) => className.startsWith("font-system-"));

      if (currentFontClass) {
        document.documentElement.classList.remove(currentFontClass);
      }

      document.documentElement.classList.add(`font-system-${systemObj.id}`);
    }
  }, [fontSystem, isMounted]);

  return (
    <FontContext.Provider
      value={{
        fontSystem,
        changeFontSystem,
        FONT_SYSTEMS,
        currentSystemData: Object.values(FONT_SYSTEMS).find(
          (system) => system.id === fontSystem
        ),
      }}
    >
      {children}
    </FontContext.Provider>
  );
};

// Custom hook for using the font context
export const useFontContext = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFontContext must be used within a FontProvider");
  }
  return context;
};
