// src/components/common/Typography/FontSelector.tsx
"use client";

import React, { useState } from "react";
import { useFontContext } from "@/context/FontContext";
import { cn } from "@/utils/classNames";
import Icon from "@/components/common/Icons/Icon";

interface FontSelectorProps {
  className?: string;
  variant?: "dropdown" | "buttons" | "compact";
  showPreview?: boolean;
  align?: "left" | "center" | "right";
  maxItems?: number;
  customTrigger?: React.ReactNode;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  className = "",
  variant = "dropdown",
  showPreview = true,
  align = "left",
  maxItems = 4,
  customTrigger = null,
}) => {
  const { fontSystem, changeFontSystem, FONT_SYSTEMS, currentSystemData } =
    useFontContext();
  const [isOpen, setIsOpen] = useState(false);

  // Get all available font systems as an array
  const fontSystems = Object.values(FONT_SYSTEMS);

  // Get name of current font system
  const currentFontName = currentSystemData?.name || "Modern";

  // Handle toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle font selection
  const handleFontSelect = (fontId: string) => {
    changeFontSystem(fontId);
    setIsOpen(false);
  };

  // Alignment classes
  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  // Render variant: dropdown
  if (variant === "dropdown") {
    return (
      <div className={`relative font-body ${className}`}>
        {/* Custom or Default Trigger Button */}
        {customTrigger ? (
          <div onClick={toggleDropdown}>
            {customTrigger}
          </div>
        ) : (
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-bg-tertiary hover:bg-bg-hover border border-border"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span className="whitespace-normal">{currentFontName}</span>
            <Icon name={isOpen ? "fi:FiChevronUp" : "fi:FiChevronDown"} size={16} />
          </button>
        )}

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-60 max-h-80 overflow-y-auto rounded-md shadow-lg bg-bg-dropdown border border-border animate-in fade-in-50 slide-in-from-top-5">
            <ul
              role="listbox"
              className="py-1"
              aria-activedescendant={fontSystem}
            >
              {fontSystems.map((font) => (
                <li
                  key={font.id}
                  id={font.id}
                  role="option"
                  aria-selected={fontSystem === font.id}
                  onClick={() => handleFontSelect(font.id)}
                  className={cn(
                    "px-4 py-2 cursor-pointer hover:bg-bg-hover whitespace-normal",
                    fontSystem === font.id && "bg-bg-active"
                  )}
                  // Apply the actual font to each option using the correct property paths
                  style={{
                    fontFamily: font.heading?.family || font.body?.family,
                    fontWeight: font.id === fontSystem ? 600 : 400
                  }}
                >
                  {font.name}

                  {showPreview && (
                    <div className="mt-1 text-xs opacity-70 whitespace-normal">
                      <span style={{ fontFamily: font.heading?.family }}>Heading</span>
                      {" + "}
                      <span style={{ fontFamily: font.body?.family }}>Body</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Render variant: buttons
  if (variant === "buttons") {
    return (
      <div
        className={`flex flex-wrap gap-2 ${className} ${alignmentClasses[align]}`}
      >
        {fontSystems.slice(0, maxItems).map((font) => (
          <button
            key={font.id}
            onClick={() => changeFontSystem(font.id)}
            className={cn(
              "px-3 py-2 rounded-md border whitespace-normal",
              fontSystem === font.id
                ? "bg-bg-active border-accent-primary"
                : "bg-bg-tertiary border-border hover:bg-bg-hover"
            )}
            style={{ fontFamily: font.heading?.family || font.body?.family }}
          >
            {font.name}
          </button>
        ))}

        {fontSystems.length > maxItems && (
          <button className="px-3 py-2 rounded-md bg-bg-tertiary border border-border hover:bg-bg-hover whitespace-normal">
            +{fontSystems.length - maxItems} more
          </button>
        )}
      </div>
    );
  }

  // Render variant: compact
  return (
    <div className={`${className}`}>
      <select
        value={fontSystem}
        onChange={(e) => changeFontSystem(e.target.value)}
        className="px-2 py-1 text-sm rounded-md bg-bg-tertiary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary whitespace-normal"
      >
        {fontSystems.map((font) => (
          <option
            key={font.id}
            value={font.id}
            style={{ fontFamily: font.body?.family }}
          >
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSelector;