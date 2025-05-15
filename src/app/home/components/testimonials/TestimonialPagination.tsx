"use client";

import React, { memo } from "react";
import { cn } from "@/utils/classNames";

interface TestimonialPaginationProps {
  totalItems: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

const TestimonialPagination: React.FC<TestimonialPaginationProps> = ({
  totalItems,
  activeIndex,
  onSelect,
}) => {
  if (totalItems <= 1) return null;

  return (
    <div className="flex justify-center mt-10 space-x-2">
      {Array.from({ length: totalItems }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={cn(
            "w-3 h-3 rounded-full transition-colors duration-300",
            i === activeIndex ? "" : ""
          )}
          style={{
            background:
              i === activeIndex
                ? "var(--color-accent-primary)"
                : "var(--color-divider)",
          }}
          aria-label={`View testimonial ${i + 1}`}
        />
      ))}
    </div>
  );
};

export default memo(TestimonialPagination);
