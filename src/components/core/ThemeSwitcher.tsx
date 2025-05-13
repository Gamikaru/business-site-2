// src/components/core/ThemeSwitcher.tsx
"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import Icon from "@/components/common/Icons/Icon";
import ThemeSelector from "./ThemeSelector";

interface ThemeSwitcherProps {
  className?: string;
  showColorSelector?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = "",
  showColorSelector = true, // Changed default to true
}) => {
  const { mode, toggleMode } = useTheme();

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* Mode Toggle (Light/Dark) */}
      <button
        onClick={toggleMode}
        className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
        style={{
          backgroundColor: "var(--color-bg-tertiary)",
          color: "var(--color-text-primary)",
        }}
      >
        {mode === "light" ? (
          <Icon name="fi:FiMoon" size={18} />
        ) : (
          <Icon name="fi:FiSun" size={18} />
        )}
      </button>

      {/* Color Theme Selector */}
      {showColorSelector && (
        <ThemeSelector variant="dropdown" showLabels={false} />
      )}
    </div>
  );
};

export default ThemeSwitcher;