"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define system font fallbacks
export const SYSTEM_FONTS = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

// Font definition interfaces
interface FontDefinition {
  family: string;
  weight: string;
  fallback: keyof typeof SYSTEM_FONTS;
}

export interface FontSystem {
  id: string;
  name: string;
  description: string;
  heading: FontDefinition;
  body: FontDefinition;
  code: FontDefinition;
  category?: string;
}

// Font system definitions
export const FONT_SYSTEMS: Record<string, FontSystem> = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary using Inter & Montserrat",
    category: "sans-serif",
    heading: {
      family: "var(--font-montserrat)",
      weight: "700",
      fallback: "sans",
    },
    body: {
      family: "var(--font-inter)",
      weight: "400",
      fallback: "sans",
    },
    code: {
      family: "var(--font-jetbrains-mono)",
      weight: "400",
      fallback: "mono",
    }
  },
  elegant: {
    id: "elegant",
    name: "Elegant",
    description: "Refined and classic look with Playfair Display & Lato",
    category: "serif",
    heading: {
      family: "var(--font-playfair-display)",
      weight: "700",
      fallback: "serif",
    },
    body: {
      family: "var(--font-lato)",
      weight: "400",
      fallback: "sans",
    },
    code: {
      family: "var(--font-fira-code)",
      weight: "400",
      fallback: "mono",
    }
  },
  technical: {
    id: "technical",
    name: "Technical",
    description: "Precise and functional using Roboto & Source Sans Pro",
    category: "sans-serif",
    heading: {
      family: "var(--font-roboto)",
      weight: "500",
      fallback: "sans",
    },
    body: {
      family: "var(--font-source-sans-pro)",
      weight: "400",
      fallback: "sans",
    },
    code: {
      family: "var(--font-inconsolata)",
      weight: "400",
      fallback: "mono",
    }
  },
  editorial: {
    id: "editorial",
    name: "Editorial",
    description: "Refined reading experience with Fraunces & Libre Franklin",
    category: "mixed",
    heading: {
      family: "var(--font-fraunces)",
      weight: "700",
      fallback: "serif",
    },
    body: {
      family: "var(--font-libre-franklin)",
      weight: "400",
      fallback: "sans",
    },
    code: {
      family: "var(--font-ibm-plex-mono)",
      weight: "400",
      fallback: "mono",
    }
  },
  neoGeometric: {
    id: "neoGeometric",
    name: "Neo Geometric",
    description: "Modern geometric style with Space Grotesk & DM Sans",
    category: "geometric",
    heading: {
      family: "var(--font-space-grotesk)",
      weight: "700",
      fallback: "sans",
    },
    body: {
      family: "var(--font-dm-sans)",
      weight: "400",
      fallback: "sans",
    },
    code: {
      family: "var(--font-jetbrains-mono)",
      weight: "400",
      fallback: "mono",
    }
  },
  cybervoid: {
    id: "cybervoid",
    name: "Cybervoid",
    description: "Futuristic look with Rajdhani & Quantico",
    category: "futuristic",
    heading: {
      family: "var(--font-rajdhani)",
      weight: "600",
      fallback: "sans",
    },
    body: {
      family: "var(--font-quantico)",
      weight: "400",
      fallback: "sans",
    },
    code: {
      family: "var(--font-vt323)",
      weight: "400",
      fallback: "mono",
    }
  }
};

// Font context type definition
interface FontContextType {
  fontSystem: string;
  changeFontSystem: (id: string) => void;
  FONT_SYSTEMS: Record<string, FontSystem>;
  currentSystemData: FontSystem | null;
  fontsLoaded: boolean;
}

// Create the context
const FontContext = createContext<FontContextType | undefined>(undefined);

// Provider component
export const FontProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontSystem, setFontSystem] = useState<string>("modern");
  const [currentSystemData, setCurrentSystemData] = useState<FontSystem | null>(FONT_SYSTEMS.modern);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Check if fonts are loaded from sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if fonts are loaded
    setFontsLoaded(!!sessionStorage.getItem('fontsLoaded'));

    // Also listen for the fonts-loaded class
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const element = mutation.target as HTMLElement;
          if (element.classList.contains('fonts-loaded')) {
            setFontsLoaded(true);
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Apply font system when it changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Get the font system object
    const systemObj = FONT_SYSTEMS[fontSystem];
    if (!systemObj) return;

    // Update current system data
    setCurrentSystemData(systemObj);

    // Set data attribute for CSS
    document.documentElement.setAttribute("data-font-system", systemObj.id);

    // Debug logging to see if values are being set correctly
    console.log("Font system changed:", {
      id: systemObj.id,
      headingFont: systemObj.heading.family,
      bodyFont: systemObj.body.family,
      codeFont: systemObj.code.family,
      computedHeadingFont: getComputedStyle(document.documentElement).getPropertyValue('--font-heading'),
      computedBodyFont: getComputedStyle(document.documentElement).getPropertyValue('--font-body'),
      computedCodeFont: getComputedStyle(document.documentElement).getPropertyValue('--font-code')
    });

    // Force a style recalculation by toggling a dummy class
    document.documentElement.classList.add("font-switching");

    // Small timeout to ensure the browser applies the changes
    setTimeout(() => {
      document.documentElement.classList.remove("font-switching");
    }, 50);

    // Store the selected font system in local storage
    localStorage.setItem("fontSystem", fontSystem);

    console.log("Applied font system:", systemObj.id);
  }, [fontSystem]);

  // Load stored font preference on initial render
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Try to get stored font system
    const storedFont = localStorage.getItem("fontSystem");
    if (storedFont && FONT_SYSTEMS[storedFont]) {
      // Only set if it's different to avoid unnecessary re-renders
      if (storedFont !== fontSystem) {
        setFontSystem(storedFont);
      }
    }
  }, []);

  const changeFontSystem = (id: string) => {
    if (FONT_SYSTEMS[id]) {
      try {
        // Set the font system ID and update context state
        setFontSystem(id);
        const system = FONT_SYSTEMS[id];
        setCurrentSystemData(system);

        // Apply data attribute to document element
        document.documentElement.setAttribute("data-font-system", id);

        // STEP 1: Direct CSS Variable Application
        const root = document.documentElement;
        root.style.setProperty('--font-current-heading', system.heading.family);
        root.style.setProperty('--font-current-body', system.body.family);
        root.style.setProperty('--font-current-code', system.code.family);
        root.style.setProperty('--font-heading', system.heading.family);
        root.style.setProperty('--font-body', system.body.family);
        root.style.setProperty('--font-code', system.code.family);

        // STEP 2: Add dynamic style tag with !important rules
        // Remove any existing font-fix style tag
        const existingStyle = document.getElementById('font-system-fix');
        if (existingStyle) {
          existingStyle.remove();
        }

        // Create new style tag with !important rules
        const styleEl = document.createElement('style');
        styleEl.id = 'font-system-fix';
        styleEl.textContent = `
          .font-heading { font-family: ${system.heading.family} !important; }
          .font-body { font-family: ${system.body.family} !important; }
          .font-code { font-family: ${system.code.family} !important; }
        `;
        document.head.appendChild(styleEl);

        // STEP 3: Direct element manipulation (most aggressive)
        const applyDirectFonts = () => {
          document.querySelectorAll('.font-heading').forEach(el => {
            (el as HTMLElement).style.fontFamily = `${system.heading.family}`;
          });

          document.querySelectorAll('.font-body').forEach(el => {
            (el as HTMLElement).style.fontFamily = `${system.body.family}`;
          });

          document.querySelectorAll('.font-code').forEach(el => {
            (el as HTMLElement).style.fontFamily = `${system.code.family}`;
          });
        };

        // Apply direct styles immediately
        applyDirectFonts();

        // Reapply after a short delay to catch any newly rendered elements
        setTimeout(applyDirectFonts, 100);

        // STEP 4: Set other font properties
        root.style.setProperty('--tracking-heading',
          id === 'modern' ? '-0.02em' :
          id === 'elegant' ? '0em' :
          id === 'cybervoid' ? '0.02em' :
          '-0.01em'
        );

        root.style.setProperty('--tracking-body',
          id === 'modern' ? '-0.01em' :
          id === 'elegant' ? '0.01em' :
          id === 'cybervoid' ? '0.01em' :
          '0em'
        );

        // Force reflow
        void document.documentElement.offsetHeight;

        // Toggle transition class
        document.documentElement.classList.add('font-switching');
        setTimeout(() => {
          document.documentElement.classList.remove('font-switching');

          // Final pass to update any elements that might have been missed
          applyDirectFonts();
        }, 150);

        // Debug info
        console.log('Font system changed to:', {
          id,
          heading: system.heading.family,
          body: system.body.family,
          code: system.code.family
        });

        // Save to localStorage
        localStorage.setItem("fontSystem", id);
      } catch (error) {
        console.error("Error changing font system:", error);
      }
    }
  };

  return (
    <FontContext.Provider value={{
      fontSystem,
      changeFontSystem,
      FONT_SYSTEMS,
      currentSystemData,
      fontsLoaded
    }}>
      {children}
    </FontContext.Provider>
  );
};

// Custom hook for accessing the font context
export const useFontContext = (): FontContextType => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFontContext must be used within a FontProvider");
  }
  return context;
};