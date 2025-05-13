"use client";

import React, { useEffect, useState } from "react";
import { useFontContext } from "@/context/FontContext";

const FontDebugger = () => {
  const { currentSystemData, fontSystem } = useFontContext();
  const [computedStyles, setComputedStyles] = useState<{
    heading: string;
    body: string;
    code: string;
  }>({ heading: '', body: '', code: '' });

  // Update computed styles when font system changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const styles = getComputedStyle(document.documentElement);
      setComputedStyles({
        heading: styles.getPropertyValue('--font-heading'),
        body: styles.getPropertyValue('--font-body'),
        code: styles.getPropertyValue('--font-code'),
      });
    }
  }, [fontSystem]);

  if (!currentSystemData) return null;

  return (
    <div className="p-4 bg-bg-secondary rounded-lg my-4 text-sm border border-border">
      <h3 className="font-semibold mb-2">Font Debugging Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium mb-1">Current Font System: {currentSystemData.name}</h4>
          <div>Font system ID: {currentSystemData.id}</div>
        </div>

        <div>
          <h4 className="font-medium mb-1">CSS Variables</h4>
          <div className="space-y-1 text-xs">
            <div>--font-heading: {computedStyles.heading}</div>
            <div>--font-body: {computedStyles.body}</div>
            <div>--font-code: {computedStyles.code}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 mt-4">
        <h4 className="font-medium mb-2">Direct Style Application (Test)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs mb-1 text-text-tertiary">Heading:</div>
            <div style={{ fontFamily: currentSystemData.heading.family }}>
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-text-tertiary">Body:</div>
            <div style={{ fontFamily: currentSystemData.body.family }}>
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-text-tertiary">Code:</div>
            <div style={{ fontFamily: currentSystemData.code.family }}>
              console.log("Test");
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 mt-4">
        <h4 className="font-medium mb-2">CSS Class Application (Demo)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs mb-1 text-text-tertiary">Heading:</div>
            <div className="font-heading">
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-text-tertiary">Body:</div>
            <div className="font-body">
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-text-tertiary">Code:</div>
            <div className="font-code">
              console.log("Test");
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontDebugger;
