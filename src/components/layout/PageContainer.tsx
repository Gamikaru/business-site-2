// src/components/layout/PageContainer.tsx
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  withGrid?: boolean;
  withBackground?: boolean;
}

export default function PageContainer({
  children,
  className = "",
  fullHeight = true,
  withGrid = false,
  withBackground = false,
}: PageContainerProps) {
  return (
    <section
      className={`
        w-full
        ${fullHeight ? "min-h-screen" : ""}
        relative overflow-hidden
        ${withBackground ? "bg-bg-secondary" : ""}
        ${className}
      `}
    >
      {/* Optional blueprint grid background */}
      {withGrid && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2328B487' stroke-width='0.5'%3E%3Crect x='0.5' y='0.5' width='39' height='39'/%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat"
          }}
        />
      )}

      {children}
    </section>
  );
}