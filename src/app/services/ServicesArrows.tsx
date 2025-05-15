// app/services/ServicesArrows.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import { useTheme } from "@/context/ThemeContext";
import { useAnimationPreferences } from "@/components/core/Animations";
import { throttle } from "lodash";
import { motion, useScroll } from "framer-motion";

interface ActiveArrow {
  id: string;
  start: string;
  end: string;
  label?: string;
}


const ServicesArrows: React.FC = () => {
  const updateXarrow = useXarrow();
  const { mode } = useTheme();
  const { shouldAnimate, getIntensity } = useAnimationPreferences();
  const [mounted, setMounted] = useState(false);
  const [activeArrows, setActiveArrows] = useState<ActiveArrow[]>([]);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const { scrollY } = useScroll();

  // Throttled update function for performance
  const throttledUpdate = useCallback(
    throttle(() => {
      updateXarrow();
    }, 16),
    [updateXarrow]
  );

  // Setup intersection observers to determine when elements are in view
  useEffect(() => {
    if (!mounted) return;

    const observerOptions = {
      rootMargin: "-10% 0px -40% 0px",
      threshold: [0.1, 0.5],
    };

    // Observer for main sections
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;

        if (entry.isIntersecting) {
          setVisibleSections(prev => [...prev, id].filter((v, i, a) => a.indexOf(v) === i));
        } else {
          setVisibleSections(prev => prev.filter(v => v !== id));
        }
      });
    }, observerOptions);

    // Observe header
    const headerElement = document.getElementById('hdr');
    if (headerElement) sectionObserver.observe(headerElement);

    // Observe grid title
    const gridTitleElement = document.getElementById('gridTitle');
    if (gridTitleElement) sectionObserver.observe(gridTitleElement);

    // Observe service sections
    const serviceElements = document.querySelectorAll('[id^="detail-"]');
    serviceElements.forEach(el => sectionObserver.observe(el));

    // Observe process sections
    const processHeadingElement = document.getElementById('wrkHead');
    if (processHeadingElement) sectionObserver.observe(processHeadingElement);

    // Observe footer CTA
    const footerHeadingElement = document.getElementById('cta-footer-hdr');
    if (footerHeadingElement) sectionObserver.observe(footerHeadingElement);

    return () => {
      sectionObserver.disconnect();
    };
  }, [mounted]);

  // Dynamically build arrows based on visible sections
  useEffect(() => {
    if (!mounted || !shouldAnimate()) return;

    const arrows: ActiveArrow[] = [];

    // Add header to intro arrow if header is visible
    if (visibleSections.includes('hdr') && document.getElementById('intro')) {
      arrows.push({
        id: 'header-intro',
        start: 'hdr',
        end: 'intro',
        label: 'Start Here'
      });
    }

    // Add grid title to first card arrow if grid title is visible
    if (visibleSections.includes('gridTitle') && document.getElementById('card-ai')) {
      arrows.push({
        id: 'grid-first-card',
        start: 'gridTitle',
        end: 'card-ai',
        label: 'Browse services'
      });
    }

    // Add serpentine arrows between cards
    const serviceIds = ['ai', 'web', 'system', 'strategy', 'mobile'];
    for (let i = 0; i < serviceIds.length - 1; i++) {
      const startId = `card-${serviceIds[i]}`;
      const endId = `card-${serviceIds[i + 1]}`;

      if (document.getElementById(startId) && document.getElementById(endId)) {
        arrows.push({
          id: `card-connection-${i}`,
          start: startId,
          end: endId
        });
      }
    }

    // Add active tab to service detail arrow
    const activeTab = document.querySelector('[role="tab"][aria-selected="true"]');
    if (activeTab && activeTab.id.startsWith('tab-')) {
      const serviceId = activeTab.id.replace('tab-', '');
      if (serviceId !== 'all' && document.getElementById(`detail-${serviceId}`)) {
        arrows.push({
          id: 'tab-to-detail',
          start: activeTab.id,
          end: `detail-${serviceId}`,
          label: 'Jump to details'
        });
      }
    }

    // Add arrows between process steps
    if (visibleSections.some(id => id.startsWith('wrk'))) {
      for (let i = 1; i <= 3; i++) {
        const startId = `wrk${i}`;
        const endId = `wrk${i + 1}`;

        if (document.getElementById(startId) && document.getElementById(endId)) {
          arrows.push({
            id: `process-${i}`,
            start: startId,
            end: endId,
            label: i === 1 ? 'Process step' : undefined
          });
        }
      }
    }

    // Add arrows between principles
    if (visibleSections.includes('prnHead')) {
      for (let i = 1; i <= 2; i++) {
        const startId = `p${i}`;
        const endId = `p${i + 1}`;

        if (document.getElementById(startId) && document.getElementById(endId)) {
          arrows.push({
            id: `principle-${i}`,
            start: startId,
            end: endId
          });
        }
      }
    }

    // Add footer CTA arrow
    if (visibleSections.includes('cta-footer-hdr') && document.getElementById('cta-footer-btn')) {
      arrows.push({
        id: 'footer-cta',
        start: 'cta-footer-hdr',
        end: 'cta-footer-btn',
        label: "Let's talk"
      });
    }

    setActiveArrows(arrows);
  }, [visibleSections, mounted, shouldAnimate]);

  // Only render arrows on client-side
  useEffect(() => {
    setMounted(true);

    window.addEventListener("scroll", throttledUpdate);
    window.addEventListener("resize", throttledUpdate);

    return () => {
      window.removeEventListener("scroll", throttledUpdate);
      window.removeEventListener("resize", throttledUpdate);
    };
  }, [throttledUpdate]);

  if (!mounted || !shouldAnimate()) return null;

  // Arrow styling based on theme and animation preferences
  const arrowColor = mode === "dark"
    ? "var(--color-accent-primary)"
    : "var(--color-accent-primary)";

  const arrowPathDefault = "smooth";
  const arrowPathGrid = "grid";
  const animateDrawing = { duration: 0.6 };
  const dashness = { strokeLen: 6, gap: 4 };

  return (
    <Xwrapper>
      {activeArrows.map(arrow => {
        // Determine if this arrow should use grid path
        const isGridPath = arrow.id.startsWith('card-connection');

        // Determine opacity based on scroll position for some arrows
        let opacity = 1;
        if (arrow.id === 'header-intro') {
          const scrollPosition = scrollY.get();
          const headerElement = document.getElementById('hdr');
          if (headerElement) {
            const headerBottom = headerElement.getBoundingClientRect().bottom + window.scrollY;
            opacity = Math.max(0, 1 - (scrollPosition / headerBottom) * 2);
          }
        }

        return (
          <motion.div
            key={arrow.id}
            initial={{ opacity: 0 }}
            animate={{ opacity }}
            transition={{ duration: 0.3 }}
          >
            <Xarrow
              start={arrow.start}
              end={arrow.end}
              path={isGridPath ? arrowPathGrid : arrowPathDefault}
              color={arrowColor}
              strokeWidth={isGridPath ? 1.5 : 2}
              headSize={isGridPath ? 4 : 5}
              curveness={isGridPath ? 0.2 : 0.8}
              startAnchor={getAnchorPosition(arrow.start, arrow.end)}
              endAnchor={getAnchorPosition(arrow.end, arrow.start)}
              animateDrawing={isGridPath ? false : animateDrawing}
              dashness={isGridPath ? { strokeLen: 4, gap: 6 } : dashness}
              // Special case for principle arrows - make them bidirectional
              tailShape={arrow.id.startsWith('principle') ? "circle" : undefined}
              // Add labels where specified
              labels={arrow.label ? {
                middle: {
                  text: arrow.label,
                  style: {
                    fontSize: "12px",
                    fontFamily: "var(--font-mono)",
                    color: arrowColor,
                    padding: "4px 6px",
                    borderRadius: "2px",
                    backgroundColor: "var(--color-bg-glass)",
                    backdropFilter: "blur(2px)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                  }
                }
              } : undefined}
            />
          </motion.div>
        );
      })}
    </Xwrapper>
  );
};

// Helper function to determine anchor positions
function getAnchorPosition(startId: string, endId: string): string | { position: string; offset: { x: number; y: number } } {
  // Default anchor positions
  const defaultPositions = {
    'hdr': { position: 'bottom', offset: { x: 0, y: 10 } },
    'intro': { position: 'top', offset: { x: 0, y: 10 } },
    'gridTitle': { position: 'bottom', offset: { x: 0, y: 5 } },
  };

  // Card connection anchors
  if (startId.startsWith('card-') && endId.startsWith('card-')) {
    const startIndex = parseInt(startId.split('-')[1].replace(/[^\d]/g, ''), 10) || 0;
    const endIndex = parseInt(endId.split('-')[1].replace(/[^\d]/g, ''), 10) || 0;

    if (startIndex < endIndex) {
      return startIndex % 2 === 0 ? 'right' : 'bottom';
    } else {
      return startIndex % 2 === 0 ? 'bottom' : 'left';
    }
  }

  // Tab to detail anchors
  if (startId.startsWith('tab-') && endId.startsWith('detail-')) {
    return { position: 'bottom', offset: { x: 0, y: 5 } };
  }

  // Process step anchors
  if (startId.startsWith('wrk') && endId.startsWith('wrk')) {
    return 'right';
  }

  // Principle anchors
  if (startId.startsWith('p') && endId.startsWith('p')) {
    return 'right';
  }

  // CTA anchors
  if (startId === 'cta-footer-hdr') {
    return { position: 'right', offset: { x: 10, y: 0 } };
  }
  if (endId === 'cta-footer-btn') {
    return { position: 'left', offset: { x: -10, y: 0 } };
  }

  // Return from defaultPositions if defined
  if (defaultPositions[startId as keyof typeof defaultPositions]) {
    return defaultPositions[startId as keyof typeof defaultPositions];
  }

  // Default fallback
  return 'auto';
}

export default ServicesArrows;