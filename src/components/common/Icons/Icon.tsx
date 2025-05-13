import React from "react";
import * as Fi from "react-icons/fi"; // Feather Icons
import * as Fa from "react-icons/fa"; // Font Awesome
import * as Hi from "react-icons/hi"; // Heroicons
import * as Ai from "react-icons/ai"; // Ant Design Icons
import * as Md from "react-icons/md"; // Material Design Icons
import { IconBaseProps } from "react-icons";
import { cn } from "@/utils/classNames";

// Map of icon libraries
const iconLibraries = {
  fi: Fi, // Feather Icons
  fa: Fa, // Font Awesome
  hi: Hi, // Heroicons
  ai: Ai, // Ant Design
  md: Md, // Material Design
};

// Map of library prefixes
const libraryIconPrefixes = {
  fi: "Fi", // Feather Icons use "Fi" prefix
  fa: "Fa", // Font Awesome uses "Fa" prefix
  hi: "Hi", // Heroicons use "Hi" prefix
  ai: "Ai", // Ant Design uses "Ai" prefix
  md: "Md", // Material Design uses "Md" prefix
};

interface IconProps extends Omit<IconBaseProps, "size"> {
  name: string;
  size?: number | string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, className = "", ...props }) => {
  // Parse icon name to determine library and specific icon
  // Support both formats: "fi-chevron-right" or "fi:FiChevronRight"
  let libraryPrefix, iconName;

  if (name.includes('-')) {
    [libraryPrefix, iconName] = name.split("-");
  } else if (name.includes(':')) {
    [libraryPrefix, iconName] = name.split(":");
  } else {
    console.warn(`Invalid icon name format: ${name}. Expected format: "prefix-iconName" or "prefix:IconName"`);
    return null;
  }

  if (!libraryPrefix || !iconName) {
    console.warn(`Invalid icon name format: ${name}. Expected format: "prefix-iconName" or "prefix:IconName"`);
    return null;
  }

  const lowercasePrefix = libraryPrefix.toLowerCase();
  const library = iconLibraries[lowercasePrefix as keyof typeof iconLibraries];

  if (!library) {
    console.warn(`Unknown icon library: ${libraryPrefix}`);
    return null;
  }

  // Get the correct prefix for this library
  const iconPrefix = libraryIconPrefixes[lowercasePrefix as keyof typeof libraryIconPrefixes] || '';

  // Handle both kebab-case and PascalCase icon names
  let iconKey: string;

  // If the name is already in PascalCase and includes the library prefix (e.g., "FiMoon")
  if (/^[A-Z]/.test(iconName) && iconName.startsWith(iconPrefix)) {
    iconKey = iconName;
  } else {
    // Convert from kebab-case to PascalCase without the prefix
    const pascalName = iconName
      .split("-")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");

    // Add the library prefix if it's not already there
    iconKey = pascalName.startsWith(iconPrefix) ? pascalName : `${iconPrefix}${pascalName}`;
  }

  // Try to get the icon component from the library
  const IconComponent = library[iconKey as keyof typeof library] as React.ComponentType<IconBaseProps>;

  if (!IconComponent) {
    console.warn(`Icon not found: ${iconKey} in ${libraryPrefix} library`);
    // Let's log some debug information to help troubleshoot
    console.debug(`Looking for "${iconKey}" in ${libraryPrefix} library`);
    console.debug(`Available icons in ${libraryPrefix}:`, Object.keys(library).slice(0, 10), '...');
    return null;
  }

  return (
    <IconComponent
      size={size}
      className={cn("inline-block align-middle", className)}
      {...props}
    />
  );
};

export default Icon;
