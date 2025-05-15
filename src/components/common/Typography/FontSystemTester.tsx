"use client";

import React, { useEffect, useState } from 'react';
import { useFontContext } from '@/context/FontContext';

const FontSystemTester: React.FC = () => {
  const { fontSystem, changeFontSystem, FONT_SYSTEMS, currentSystemData } = useFontContext();
  const [directHeading, setDirectHeading] = useState<string>("");
  const [directBody, setDirectBody] = useState<string>("");
  const [rootStyles, setRootStyles] = useState<Record<string, string>>({});

  // Update computed root styles when font system changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styles = getComputedStyle(document.documentElement);
      setRootStyles({
        '--font-heading': styles.getPropertyValue('--font-heading'),
        '--font-body': styles.getPropertyValue('--font-body'),
        '--font-code': styles.getPropertyValue('--font-code'),
        '--font-current-heading': styles.getPropertyValue('--font-current-heading'),
        '--font-current-body': styles.getPropertyValue('--font-current-body'),
        'data-font-system': document.documentElement.getAttribute('data-font-system') || '',
        'font-family': styles.fontFamily
      });

      setDirectHeading(currentSystemData?.heading.family || "");
      setDirectBody(currentSystemData?.body.family || "");
    }
  }, [fontSystem, currentSystemData]);

  // Function to apply fonts directly with brute force
  const applyFontDirectly = (id: string) => {
    if (FONT_SYSTEMS[id]) {
      const system = FONT_SYSTEMS[id];

      // Direct application to HTML element
      const htmlElement = document.documentElement;

      // Apply directly to document element
      htmlElement.style.setProperty('--font-heading', system.heading.family);
      htmlElement.style.setProperty('--font-body', system.body.family);
      htmlElement.style.setProperty('--font-code', system.code.family);

      // Set the current values too
      htmlElement.style.setProperty('--font-current-heading', system.heading.family);
      htmlElement.style.setProperty('--font-current-body', system.body.family);
      htmlElement.style.setProperty('--font-current-code', system.code.family);

      // Directly set the data attribute
      htmlElement.setAttribute('data-font-system', id);

      // Force repaint/reflow
      void htmlElement.offsetHeight;

      // Update our state
      setDirectHeading(system.heading.family);
      setDirectBody(system.body.family);

      // Apply directly to elements with font classes
      document.querySelectorAll('.font-heading').forEach((el: Element) => {
        (el as HTMLElement).style.fontFamily = system.heading.family;
      });

      document.querySelectorAll('.font-body').forEach((el: Element) => {
        (el as HTMLElement).style.fontFamily = system.body.family;
      });

      document.querySelectorAll('.font-code').forEach((el: Element) => {
        (el as HTMLElement).style.fontFamily = system.code.family;
      });

      // Let the context know (this would normally be called from the context)
      changeFontSystem(id);
    }
  };

  // Reset all direct styles - just for testing
  const resetDirectStyles = () => {
    document.querySelectorAll('.font-heading, .font-body, .font-code').forEach((el: Element) => {
      (el as HTMLElement).style.removeProperty('font-family');
    });
  };

  return (
    <div className="p-4 bg-bg-tertiary/20 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Font System Tester</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-md font-medium mb-2">Current Settings</h3>
          <ul className="space-y-1 text-xs bg-bg-code/50 p-2 rounded">
            <li>Current Font System: {currentSystemData?.name}</li>
            <li>Data Attribute: {rootStyles['data-font-system']}</li>
            <li>--font-heading: {rootStyles['--font-heading']}</li>
            <li>--font-body: {rootStyles['--font-body']}</li>
            <li>--font-current-heading: {rootStyles['--font-current-heading']}</li>
            <li>--font-current-body: {rootStyles['--font-current-body']}</li>
            <li>Root font-family: {rootStyles['font-family']}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-md font-medium mb-2">Direct Font Settings</h3>
          <ul className="space-y-1 text-xs bg-bg-code/50 p-2 rounded">
            <li>Direct Heading Font: {directHeading}</li>
            <li>Direct Body Font: {directBody}</li>
          </ul>
        </div>
      </div>

      <h3 className="text-md font-medium mb-2">Apply Fonts Directly</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.values(FONT_SYSTEMS).map((system) => (
          <button
            key={system.id}
            onClick={() => applyFontDirectly(system.id)}
            className={`px-2 py-1 text-sm rounded transition-colors ${
              fontSystem === system.id
                ? 'bg-accent-primary/20 border border-accent-primary'
                : 'bg-bg-tertiary border border-divider hover:bg-bg-hover'
            }`}
          >
            {system.name}
          </button>
        ))}
        <button
          onClick={resetDirectStyles}
          className="px-2 py-1 text-sm rounded bg-warning/20 border border-warning hover:bg-warning/30"
        >
          Reset Direct Styles
        </button>
      </div>

      <h3 className="text-md font-medium mb-2">Test Rendering</h3>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-text-tertiary mb-1">CSS Class Usage:</p>
          <p className="font-heading border border-dashed border-divider p-2 rounded">
            This text uses the font-heading class
          </p>
          <p className="font-body border border-dashed border-divider p-2 rounded mt-2">
            This text uses the font-body class
          </p>
        </div>

        <div>
          <p className="text-xs text-text-tertiary mb-1">Direct Style Usage:</p>
          <p className="border border-dashed border-divider p-2 rounded" style={{ fontFamily: directHeading }}>
            This text uses direct style with heading font
          </p>
          <p className="border border-dashed border-divider p-2 rounded mt-2" style={{ fontFamily: directBody }}>
            This text uses direct style with body font
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontSystemTester;
