// src/components/layout/MainLayout.tsx
import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  withPadding?: boolean;
  overlayHeader?: boolean; // New prop for controlling header overlay effect
}

export default function MainLayout({
  children,
  className = "",
  fullWidth = true, // Default to full width
  withPadding = false, // Default to no padding for full-bleed layouts
  overlayHeader = true, // Default to overlay header
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Header is absolutely positioned when overlay is true */}
      <div className={`${overlayHeader ? "absolute w-full z-50" : "relative"}`}>
        <Header />
      </div>

      {/* Main content area with conditional padding and width */}
      <main
        className={`flex-grow ${className}`}
        style={{
          paddingTop: overlayHeader ? 0 : 'var(--header-height, 80px)'
        }}
      >
        {/* Content wrapper with conditional max-width and padding */}
        <div
          className={`
            ${fullWidth ? "w-full" : "max-w-7xl mx-auto"}
            ${withPadding ? "px-4 md:px-6 lg:px-8 py-8" : ""}
          `}
        >
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}