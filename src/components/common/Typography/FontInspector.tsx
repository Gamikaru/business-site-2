"use client";

import React, { useEffect, useState } from 'react';
import { useFontContext } from '@/context/FontContext';

const FontInspector = () => {
  const { fontSystem, currentSystemData } = useFontContext();
  const [actualFonts, setActualFonts] = useState<{
    heading: string;
    body: string;
    code: string;
  }>({
    heading: '',
    body: '',
    code: ''
  });
  const [fontFixApplied, setFontFixApplied] = useState(false);

  // Test and fix font application
  useEffect(() => {
    if (!currentSystemData) return;

    // Create test elements to check actual computed styles
    const headingTest = document.createElement('span');
    headingTest.className = 'font-heading';
    document.body.appendChild(headingTest);

    const bodyTest = document.createElement('span');
    bodyTest.className = 'font-body';
    document.body.appendChild(bodyTest);

    const codeTest = document.createElement('span');
    codeTest.className = 'font-code';
    document.body.appendChild(codeTest);

    // Get computed styles
    const computedHeading = window.getComputedStyle(headingTest).fontFamily;
    const computedBody = window.getComputedStyle(bodyTest).fontFamily;
    const computedCode = window.getComputedStyle(codeTest).fontFamily;

    // Clean up test elements
    document.body.removeChild(headingTest);
    document.body.removeChild(bodyTest);
    document.body.removeChild(codeTest);

    setActualFonts({
      heading: computedHeading,
      body: computedBody,
      code: computedCode
    });

  }, [fontSystem, currentSystemData]);

  const applyDirectFontFix = () => {
    if (!currentSystemData) return;

    // 1. Apply styles directly to all elements using these classes
    document.querySelectorAll('.font-heading').forEach(el => {
      (el as HTMLElement).style.fontFamily = `${currentSystemData.heading.family} !important`;
    });

    document.querySelectorAll('.font-body').forEach(el => {
      (el as HTMLElement).style.fontFamily = `${currentSystemData.body.family} !important`;
    });

    document.querySelectorAll('.font-code').forEach(el => {
      (el as HTMLElement).style.fontFamily = `${currentSystemData.code.family} !important`;
    });

    // 2. Add direct style rules to document
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .font-heading { font-family: ${currentSystemData.heading.family} !important; }
      .font-body { font-family: ${currentSystemData.body.family} !important; }
      .font-code { font-family: ${currentSystemData.code.family} !important; }
    `;
    document.head.appendChild(styleEl);

    // 3. Also update CSS variables
    document.documentElement.style.setProperty('--font-heading', currentSystemData.heading.family);
    document.documentElement.style.setProperty('--font-body', currentSystemData.body.family);
    document.documentElement.style.setProperty('--font-code', currentSystemData.code.family);

    setFontFixApplied(true);
  };

  return (
    <div className="p-4 bg-bg-tertiary/50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Font Inspector</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-md font-medium mb-2">Expected Fonts</h4>
          <ul className="space-y-2 text-sm">
            <li>Heading: <span className="font-mono">{currentSystemData?.heading.family}</span></li>
            <li>Body: <span className="font-mono">{currentSystemData?.body.family}</span></li>
            <li>Code: <span className="font-mono">{currentSystemData?.code.family}</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-md font-medium mb-2">Actual Computed Fonts</h4>
          <ul className="space-y-2 text-sm">
            <li>Heading: <span className="font-mono">{actualFonts.heading}</span></li>
            <li>Body: <span className="font-mono">{actualFonts.body}</span></li>
            <li>Code: <span className="font-mono">{actualFonts.code}</span></li>
          </ul>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Test with Direct Font Application</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-text-secondary mb-1">Heading direct style:</p>
            <p style={{ fontFamily: currentSystemData?.heading.family }}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>

          <div>
            <p className="text-xs text-text-secondary mb-1">Body direct style:</p>
            <p style={{ fontFamily: currentSystemData?.body.family }}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>

          <div>
            <p className="text-xs text-text-secondary mb-1">Code direct style:</p>
            <p style={{ fontFamily: currentSystemData?.code.family }}>
              console.log("Hello world");
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Test with Class Names</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-text-secondary mb-1">font-heading class:</p>
            <p className="font-heading">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>

          <div>
            <p className="text-xs text-text-secondary mb-1">font-body class:</p>
            <p className="font-body">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>

          <div>
            <p className="text-xs text-text-secondary mb-1">font-code class:</p>
            <p className="font-code">
              console.log("Hello world");
            </p>
          </div>
        </div>
      </div>

      {!fontFixApplied ? (
        <button
          onClick={applyDirectFontFix}
          className="px-4 py-2 bg-accent-primary text-text-on-accent rounded-md hover:bg-accent-primary-hover transition-colors"
        >
          Apply Direct Font Fix
        </button>
      ) : (
        <div className="px-4 py-2 bg-success/20 text-success border border-success rounded-md">
          Direct font fix applied!
        </div>
      )}
    </div>
  );
};

export default FontInspector;
