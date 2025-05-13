// src/components/providers/Providers.tsx
"use client";

import React, { ReactNode } from 'react';
import { ThemeProvider } from "@/context/ThemeContext";
import { DeviceProvider } from "@/context/DeviceContext";
import { FontProvider } from "@/context/FontContext";
import { AnimationProvider } from "@/components/core/Animations/context/AnimationContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <DeviceProvider>
        <FontProvider>
          <AnimationProvider>
            {children}
          </AnimationProvider>
        </FontProvider>
      </DeviceProvider>
    </ThemeProvider>
  );
}