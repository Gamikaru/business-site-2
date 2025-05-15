"use client";

import React, { useEffect, useState } from "react";
import { useFontContext } from "@/context/FontContext";

const FontDebugger = () => {
  const { currentSystemData, fontSystem, fontsLoaded } = useFontContext();
  const [computedStyles, setComputedStyles] = useState<{
    heading: string;
    body: string;
    code: string;
    trackingHeading: string;
    trackingBody: string;
    trackingCode: string;
    wordSpacingHeading: string;
    wordSpacingBody: string;
    wordSpacingCode: string;
  }>({
    heading: '',
    body: '',
    code: '',
    trackingHeading: '',
    trackingBody: '',
    trackingCode: '',
    wordSpacingHeading: '',
    wordSpacingBody: '',
    wordSpacingCode: ''
  });

  // Update computed styles when font system changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const styles = getComputedStyle(document.documentElement);
      setComputedStyles({
        heading: styles.getPropertyValue('--font-heading'),
        body: styles.getPropertyValue('--font-body'),
        code: styles.getPropertyValue('--font-code'),
        trackingHeading: styles.getPropertyValue('--tracking-heading'),
        trackingBody: styles.getPropertyValue('--tracking-body'),
        trackingCode: styles.getPropertyValue('--tracking-code'),
        wordSpacingHeading: styles.getPropertyValue('--word-spacing-heading'),
        wordSpacingBody: styles.getPropertyValue('--word-spacing-body'),
        wordSpacingCode: styles.getPropertyValue('--word-spacing-code')
      });
    }
  }, [fontSystem, fontsLoaded]);

  if (!currentSystemData) return null;

  return (
    <div className="p-4 bg-bg-secondary rounded-lg my-4 text-sm border border-border">
      <h3 className="font-semibold mb-2">Font Debugging Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium mb-1">Current Font System: {currentSystemData.name}</h4>
          <div>Font system ID: {currentSystemData.id}</div>
          <div>Fonts loaded: {fontsLoaded ? 'Yes' : 'No'}</div>
          <div>data-font-system: {document.documentElement.getAttribute('data-font-system')}</div>
          <div>data-fonts-loaded: {document.documentElement.getAttribute('data-fonts-loaded')}</div>
        </div>

        <div>
          <h4 className="font-medium mb-1">CSS Variables</h4>
          <div className="space-y-1 text-xs">
            <div>--font-heading: {computedStyles.heading}</div>
            <div>--font-body: {computedStyles.body}</div>
            <div>--font-code: {computedStyles.code}</div>
            <div>--tracking-heading: {computedStyles.trackingHeading}</div>
            <div>--tracking-body: {computedStyles.trackingBody}</div>
            <div>--tracking-code: {computedStyles.trackingCode}</div>
            <div>--word-spacing-heading: {computedStyles.wordSpacingHeading}</div>
            <div>--word-spacing-body: {computedStyles.wordSpacingBody}</div>
            <div>--word-spacing-code: {computedStyles.wordSpacingCode}</div>
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