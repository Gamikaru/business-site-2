import React from "react";
import { cn } from "@/utils/classNames";

interface RichTextProps {
  content: string;
  className?: string;
}

/**
 * RichText component for rendering HTML content safely
 * This component allows the use of rich formatting like italics, underline, etc.
 */
const RichText: React.FC<RichTextProps> = ({ content, className }) => {
  return (
    <div
      className={cn("rich-text", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichText;
