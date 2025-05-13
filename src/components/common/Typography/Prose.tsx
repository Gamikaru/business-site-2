// src/components/common/Typography/Prose.tsx
import React from "react";
import { cn } from "@/utils/classNames";

interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "base" | "lg" | "xl";
  className?: string;
  preserveSpacing?: boolean; // Add this option
}

const Prose: React.FC<ProseProps> = ({
  size = "base",
  className,
  preserveSpacing = true, // Default to true
  children,
  ...props
}) => {
  // Map sizes to Tailwind's prose classes
  const sizeClasses = {
    sm: "prose-sm",
    base: "prose",
    lg: "prose-lg",
    xl: "prose-xl",
  };

  // Add spacing classes if preserveSpacing is true
  const spacingClasses = preserveSpacing
    ? "prose-p:whitespace-normal prose-p:word-break-normal prose-p:word-spacing-normal prose-headings:whitespace-normal prose-headings:word-spacing-normal"
    : "";

  return (
    <div
      className={cn(
        "prose max-w-none",
        sizeClasses[size],
        "prose-headings:font-heading prose-headings:tracking-heading prose-headings:text-heading",
        "prose-p:font-body prose-p:tracking-body prose-p:text-text-primary",
        "prose-strong:font-semibold",
        "prose-code:font-code prose-code:tracking-code prose-code:bg-bg-code prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        "prose-a:text-link prose-a:no-underline hover:prose-a:underline",
        "prose-blockquote:border-l-accent-primary prose-blockquote:font-body prose-blockquote:not-italic",
        "prose-img:rounded-md prose-img:shadow-md",
        "dark:prose-invert",
        spacingClasses, // Add spacing classes
        className
      )}
      style={{
        '--prose-word-spacing': 'var(--word-spacing-body)', // Add custom property
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
};

export { Prose };