"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFontContext } from '@/context/FontContext';

const FontDiagnostic = () => {
  const { fontSystem, currentSystemData, fontsLoaded } = useFontContext();
  const [cssVariables, setCssVariables] = useState<Record<string, string>>({});
  const [fontStates, setFontStates] = useState<{
    documentFontsReady: boolean;
    allFontsLoaded: string[];
  }>({
    documentFontsReady: false,
    allFontsLoaded: [],
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('architecture');

  // Check font loading state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkFonts = async () => {
      try {
        await document.fonts.ready;

        // Get all loaded fonts
        const loadedFonts: string[] = [];
        document.fonts.forEach((font) => {
          if (font.status === 'loaded') {
            loadedFonts.push(`${font.family} - ${font.weight}`);
          }
        });

        setFontStates({
          documentFontsReady: true,
          allFontsLoaded: [...new Set(loadedFonts)].sort(),
        });
      } catch (error) {
        console.error('Error checking fonts:', error);
      }
    };

    checkFonts();

    // Also set an interval to recheck (font loading can change)
    const interval = setInterval(checkFonts, 2000);
    return () => clearInterval(interval);
  }, [fontSystem]);

  // Get CSS variables
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const styles = getComputedStyle(document.documentElement);
    const vars = {
      '--font-heading': styles.getPropertyValue('--font-heading').trim(),
      '--font-body': styles.getPropertyValue('--font-body').trim(),
      '--font-code': styles.getPropertyValue('--font-code').trim(),
    };
    setCssVariables(vars);
  }, [fontSystem, fontsLoaded]);

  if (!currentSystemData) return null;

  const fontLoadProgress = Math.min(
    100,
    fontStates.allFontsLoaded.length > 0
      ? (fontStates.documentFontsReady ? 100 : 85)
      : (fontStates.documentFontsReady ? 50 : 35)
  );

  const creativePhrases = [
    "Typography is the foundation of design",
    "Words shape experiences",
    "Letters build worlds",
    "Fonts speak without sound",
    "Design solves problems beautifully"
  ];

  const randomPhrase = creativePhrases[Math.floor(Math.random() * creativePhrases.length)];

  return (
    <motion.div
      className={`fixed bottom-4 right-4 z-50 ${isExpanded ? 'w-96' : 'w-16'} overflow-hidden`}
      layout
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <motion.div
        className="bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary text-text-primary rounded-lg shadow-xl border border-accent-secondary/30 backdrop-blur-md"
        style={{
          boxShadow: "0 10px 25px rgba(0,0,0,0.2), 0 0 15px rgba(var(--rgb-accent-primary), 0.2)"
        }}
        layout
      >
        {/* Header section */}
        <div className={`relative p-3 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} border-b border-accent-primary/20`}>
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center justify-center ${isExpanded ? 'w-auto' : 'w-10 h-10'} rounded-full hover:bg-accent-primary/10 transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {isExpanded && (
              <motion.span
                className="ml-2 font-heading text-sm font-medium tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                CREATOR'S BLUEPRINT
              </motion.span>
            )}
          </motion.button>

          {isExpanded && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-3 h-3 rounded-full bg-accent-primary animate-pulse"/>
              <div className="text-xs font-code opacity-80">
                TYPE.SYSTEM
              </div>
            </motion.div>
          )}
        </div>

        {isExpanded && (
          <>
            {/* Creative tab navigation */}
            <div className="flex border-b border-accent-secondary/20">
              <button
                onClick={() => setActiveTab('architecture')}
                className={`flex-1 py-2 text-xs font-medium ${activeTab === 'architecture' ? 'bg-accent-primary/10 text-accent-primary' : 'hover:bg-bg-tertiary/30'}`}
              >
                Architecture
              </button>
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`flex-1 py-2 text-xs font-medium ${activeTab === 'blueprint' ? 'bg-accent-secondary/10 text-accent-secondary' : 'hover:bg-bg-tertiary/30'}`}
              >
                Blueprint
              </button>
              <button
                onClick={() => setActiveTab('canvas')}
                className={`flex-1 py-2 text-xs font-medium ${activeTab === 'canvas' ? 'bg-accent-tertiary/10 text-accent-tertiary' : 'hover:bg-bg-tertiary/30'}`}
              >
                Canvas
              </button>
            </div>

            {/* Tab content */}
            <div className="p-4 max-h-[60vh] overflow-auto">
              {activeTab === 'architecture' && (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1 font-code">System Foundation</div>
                    <div className="font-medium">{currentSystemData.name}</div>
                    <div className="text-xs text-text-secondary mt-1">{currentSystemData.description}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1 font-code">Heading</div>
                      <div className="font-heading text-sm leading-tight">Aa Bb Cc</div>
                      <div className="text-xs opacity-50 mt-1">{currentSystemData.heading.family.split(',')[0].replace('var(--font-', '').replace(')', '')}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1 font-code">Body</div>
                      <div className="font-body text-sm leading-tight">Aa Bb Cc</div>
                      <div className="text-xs opacity-50 mt-1">{currentSystemData.body.family.split(',')[0].replace('var(--font-', '').replace(')', '')}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-accent-secondary/10">
                    <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1 font-code">Typography Quote</div>
                    <div className="italic text-sm text-accent-primary">{randomPhrase}</div>
                  </div>
                </div>
              )}

              {activeTab === 'blueprint' && (
                <div className="space-y-4">
                  <div className="bg-bg-tertiary/20 p-3 rounded border border-accent-secondary/20">
                    <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1 font-code">Font Loading Status</div>

                    <div className="mb-3">
                      <div className="h-1.5 w-full bg-bg-tertiary/30 rounded overflow-hidden">
                        <motion.div
                          className="h-full bg-accent-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${fontLoadProgress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>{fontLoadProgress}% complete</span>
                        <span>{fontStates.documentFontsReady ? 'Ready' : 'Loading'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className={`px-2 py-1 rounded text-xs ${fontStates.documentFontsReady ? 'bg-accent-tertiary/20 text-accent-tertiary' : 'bg-bg-tertiary/30 text-text-tertiary'}`}>
                        Font System
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${fontsLoaded ? 'bg-accent-secondary/20 text-accent-secondary' : 'bg-bg-tertiary/30 text-text-tertiary'}`}>
                        Context
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${document.documentElement.classList.contains('fonts-loaded') ? 'bg-accent-primary/20 text-accent-primary' : 'bg-bg-tertiary/30 text-text-tertiary'}`}>
                        DOM
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1 font-code">Loaded Typefaces</div>
                    <div className="max-h-32 overflow-y-auto bg-bg-tertiary/10 rounded p-2 text-xs font-code">
                      {fontStates.allFontsLoaded.length > 0 ? (
                        fontStates.allFontsLoaded.map((font, index) => (
                          <div key={index} className="text-text-secondary mb-1 last:mb-0">{font}</div>
                        ))
                      ) : (
                        <div className="text-text-tertiary italic">No fonts loaded yet</div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <motion.button
                      onClick={() => document.fonts.ready.then(() => console.log("Fonts ready!"))}
                      className="px-3 py-1.5 bg-accent-secondary/10 text-accent-secondary rounded text-xs flex-1 hover:bg-accent-secondary/20 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Verify Fonts
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        document.documentElement.classList.add('fonts-loaded');
                        sessionStorage.setItem('fontsLoaded', 'true');
                      }}
                      className="px-3 py-1.5 bg-accent-primary/10 text-accent-primary rounded text-xs flex-1 hover:bg-accent-primary/20 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Force Load
                    </motion.button>
                  </div>
                </div>
              )}

              {activeTab === 'canvas' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1 font-code">Heading Typography</div>
                      <div className="font-heading text-lg">The quick brown fox jumps over the lazy dog.</div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1 font-code">Body Typography</div>
                      <div className="font-body text-sm">The quick brown fox jumps over the lazy dog. The five boxing wizards jump quickly. Pack my box with five dozen liquor jugs.</div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1 font-code">Code Typography</div>
                      <div className="font-code text-xs bg-bg-tertiary/20 p-2 rounded">
                        function solveProblems() {<br />
                        &nbsp;&nbsp;return "creative solutions";<br />
                        }
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-accent-secondary/10">
                    <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1 font-code">Creative Solution</div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-accent-primary rounded-full"></div>
                      <div className="text-sm font-medium">Typography is the foundation of user experience</div>
                    </div>
                    <div className="text-xs text-text-secondary mt-1">This diagnostic tool helps you build digital solutions that actually work by ensuring your typography system loads correctly.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-accent-primary/20 flex justify-between items-center bg-gradient-to-r from-transparent via-accent-primary/5 to-transparent">
              <div className="text-[10px] font-code text-text-tertiary">TYPOGRAPHY SYSTEM v1.0</div>
              <div className="text-[10px] font-code">{fontSystem.toUpperCase()}</div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FontDiagnostic;