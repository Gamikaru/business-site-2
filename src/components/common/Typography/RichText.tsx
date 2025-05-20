import React, { ElementType } from "react";
import { cn } from "@/utils/classNames";

interface RichTextProps {
  content: string;
  className?: string;
  as?: ElementType;
}

/**
 * RichText component for rendering HTML content safely
 * This component allows the use of rich formatting like italics, underline, etc.
 */
const RichText: React.FC<RichTextProps> = ({
  content,
  className,
  as: Component = "span" // Use span as default to safely nest within other elements
}) => {
  return (
    <Component
      className={cn("rich-text", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichText;
