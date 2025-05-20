// src/context/FontContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type FontSystem =
  | "modern"
  | "editorial"
  | "technical"
  | "elegant"
  | "neo-geometric"
  | "cybervoid"
  | "humanist"
  | "corporate"
  | "creative"
  | "academic"
  | "minimal"
  | "vintage"
  | "futuristic"
  | "casual";

interface FontSystemInfo {
  id: FontSystem;
  name: string;
  description: string;
  category?: string;
}

const FONT_SYSTEMS: Record<FontSystem, FontSystemInfo> = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary using Montserrat & Inter",
    category: "sans-serif",
  },
  editorial: {
    id: "editorial",
    name: "Editorial",
    description: "Refined and classic using Fraunces & Libre Franklin",
    category: "serif",
  },
  technical: {
    id: "technical",
    name: "Technical",
    description: "Clear and precise using Roboto & Source Sans Pro",
    category: "sans-serif",
  },
  elegant: {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated and stylish using Playfair Display & Lato",
    category: "serif",
  },
  "neo-geometric": {
    id: "neo-geometric",
    name: "Neo Geometric",
    description: "Contemporary and minimalist using Space Grotesk & DM Sans",
    category: "sans-serif",
  },
  cybervoid: {
    id: "cybervoid",
    name: "Cybervoid",
    description: "Futuristic and tech-inspired using Rajdhani & Quantico",
    category: "display",
  },
  humanist: {
    id: "humanist",
    name: "Humanist",
    description: "Warm and readable using Merriweather & Open Sans",
    category: "serif",
  },
  corporate: {
    id: "corporate",
    name: "Corporate",
    description: "Professional and clean using Poppins & Work Sans",
    category: "sans-serif",
  },
  creative: {
    id: "creative",
    name: "Creative",
    description: "Friendly and approachable using Quicksand & Nunito",
    category: "display",
  },
  academic: {
    id: "academic",
    name: "Academic",
    description: "Traditional scholarly look using Lora & Karla",
    category: "serif",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Clean systematic design using IBM Plex Sans & IBM Plex Serif",
    category: "mixed",
  },
  vintage: {
    id: "vintage",
    name: "Vintage",
    description: "Classic with modern touch using Crimson Pro & Cabin",
    category: "serif",
  },
  futuristic: {
    id: "futuristic",
    name: "Futuristic",
    description: "Forward-looking design using Exo 2 & Barlow",
    category: "display",
  },
  casual: {
    id: "casual",
    name: "Casual",
    description: "Relaxed and inviting using Caveat & Outfit",
    category: "handwritten",
  },
};

interface FontContextType {
  fontSystem: FontSystem;
  changeFontSystem: (id: FontSystem) => void;
  fontSystems: typeof FONT_SYSTEMS;
  currentSystemInfo: FontSystemInfo;
  fontsLoaded: boolean;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

/* Helper to get initial font system */
const getInitialFontSystem = (): FontSystem => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("font-system");
    if (stored && Object.keys(FONT_SYSTEMS).includes(stored)) {
      return stored as FontSystem;
    }
  }
  return "modern";
};

export const FontProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fontSystem, setFontSystemState] =
    useState<FontSystem>(getInitialFontSystem);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const effectTimeoutId = setTimeout(() => {
      const root = document.documentElement;
      const classList = root.classList;

      // Remove any existing font system classes first
      const fontSystemClasses = Array.from(classList).filter((cls) =>
        cls.startsWith("font-system-")
      );
      fontSystemClasses.forEach((cls) => classList.remove(cls));

      // Add the new class for the current font system
      classList.add(`font-system-${fontSystem}`);

      // Store the preference in localStorage
      localStorage.setItem("font-system", fontSystem);

      // --- TEMPORARILY REMOVE ANIMATION LOGIC FOR DIAGNOSTICS ---
      // let animationFrameId: number;
      // let animationTimeoutId: NodeJS.Timeout;

      // animationFrameId = requestAnimationFrame(() => {
      //   root.classList.add("font-switching");
      //   animationTimeoutId = setTimeout(() => {
      //     root.classList.remove("font-switching");
      //   }, 150);
      // });

      // // Cleanup for animation frame and its timeout
      // return () => {
      //   cancelAnimationFrame(animationFrameId);
      //   clearTimeout(animationTimeoutId);
      //   root.classList.remove("font-switching"); // Ensure removal on quick changes
      // };
      // --- END OF TEMPORARILY REMOVED ANIMATION LOGIC ---
    }, 0); // setTimeout with 0ms delay

    // Cleanup for the main effectTimeoutId
    return () => {
      clearTimeout(effectTimeoutId);
      // If animation was active, ensure its class is removed too
      // document.documentElement.classList.remove("font-switching");
    };
  }, [fontSystem]);

  // Change font system with validation
  const changeFontSystem = (id: FontSystem) => {
    if (Object.keys(FONT_SYSTEMS).includes(id)) {
      setFontSystemState(id);
    }
  };

  return (
    <FontContext.Provider
      value={{
        fontSystem,
        changeFontSystem,
        fontSystems: FONT_SYSTEMS,
        currentSystemInfo: FONT_SYSTEMS[fontSystem],
        fontsLoaded,
      }}
    >
      {children}
    </FontContext.Provider>
  );
};

export const useFontContext = (): FontContextType => {
  const ctx = useContext(FontContext);
  if (!ctx) {
    throw new Error("useFontContext must be used within a FontProvider");
  }
  return ctx;
};
