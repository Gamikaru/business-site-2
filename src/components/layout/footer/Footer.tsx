"use client";

import React, { useEffect, useState } from "react";
import DesktopFooter from "./footer/DesktopFooter";
import MobileFooter from "./footer/MobileFooter";

const Footer: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window exists (client-side)
    if (typeof window !== "undefined") {
      // Initial check
      setIsMobile(window.innerWidth < 768);

      // Add resize listener
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return isMobile ? <MobileFooter /> : <DesktopFooter />;
};

export default Footer;