// src/components/layout/MainLayout.tsx
import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  withPadding?: boolean;
  headerOffset?: boolean; // prop for header spacing
}

export default function MainLayout({
  children,
  className = "",
  fullWidth = false,
  withPadding = true,
  headerOffset = false, // Changed default to false
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main
        className={`
          ${withPadding ? "py-8 px-4 md:px-6 lg:px-8" : ""}
          ${headerOffset ? "pt-24 md:pt-28" : ""}
          ${className}
        `}
      >
        <div className={fullWidth ? "w-full" : "max-w-7xl mx-auto"}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}