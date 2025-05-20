import React from 'react';

/**
 * Global styles for the subheadline component
 */
export const SubheadlineStyles = () => (
  <style jsx global>{`
    :root {
      --rgb-accent-primary: 97, 218, 251;
      --rgb-accent-secondary: 241, 90, 36;
      --rgb-accent-tertiary: 80, 200, 120;
      --rgb-brand-primary: 64, 156, 255;
      --rgb-glass-bg: 15, 15, 22;
    }

    /* Improved perspective property with 3D-preserved children */
    .perspective-1000 {
      perspective: 1000px;
      transform-style: preserve-3d;
    }

    /* Enhanced glass effect with better cross-browser compatibility */
    .glass-effect {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background-color: rgba(var(--rgb-glass-bg, 15, 15, 22), 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    }

    /* Improved Firefox-specific fallback */
    @-moz-document url-prefix() {
      .glass-effect {
        background-color: var(--color-card-bg);
        opacity: 0.95;
        border: 1px solid var(--color-border-subtle);
      }
    }

    /* Support for browsers that don't support backdrop-filter */
    @supports not (backdrop-filter: blur(8px)) {
      .glass-effect {
        background-color: var(--color-card-bg);
        opacity: 0.95;
      }
    }

    /* Support for high-contrast mode */
    @media (forced-colors: active) {
      .glass-effect {
        border: 1px solid ButtonText;
      }
    }

    /* Triangle shape for particles */
    .triangle-shape {
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }

    /* Make boxed text more readable in any theme */
    .text-primary-text {
      color: var(--color-primary-text);
    }
  `}</style>
);
