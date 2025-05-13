// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/context/**/*.{js,ts,jsx,tsx}",
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{css}', // Make sure PurgeCSS sees class names in CSS files
  ],
  darkMode: ["class", "[data-mode='dark']", '[data-theme="green-dark"]'],
  theme: {
    extend: {
      colors: {
        // Define base colors that can be used across themes
        "bg-primary": "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        "bg-tertiary": "var(--color-bg-tertiary)",
        "bg-card": "var(--color-bg-card)",
        "bg-input": "var(--color-bg-input)",
        "bg-hover": "var(--color-bg-hover)",
        "bg-active": "var(--color-bg-active)",
        "bg-disabled": "var(--color-bg-disabled)",
        "bg-glass": "var(--color-bg-glass)",
        "bg-code": "var(--color-bg-code)",

        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary": "var(--color-text-tertiary)",
        "text-disabled": "var(--color-text-disabled)",
        "text-on-accent": "var(--color-text-on-accent)",
        "heading": "var(--color-heading)",
        "heading-accent": "var(--color-heading-accent)",

        "border": "var(--color-border)",
        "border-focus": "var(--color-border-focus)",
        "border-input": "var(--color-border-input)",
        "divider": "var(--color-divider)",
        "divider-light": "var(--color-divider-light)",

        "interactive": "var(--color-interactive)",
        "interactive-hover": "var(--color-interactive-hover)",
        "interactive-active": "var(--color-interactive-active)",
        "interactive-focus": "var(--color-interactive-focus)",
        "interactive-disabled": "var(--color-interactive-disabled)",

        "accent-primary": "var(--color-accent-primary)",
        "accent-primary-hover": "var(--color-accent-primary-hover)",
        "accent-secondary": "var(--color-accent-secondary)",
        "accent-tertiary": "var(--color-accent-tertiary)",
        "accent-oceanic": "var(--color-accent-oceanic)",
        "accent-cosmic": "var(--color-accent-cosmic)",
        "accent-contrast": "var(--color-accent-contrast)",

        "brand-primary": "var(--color-brand-primary)",
        "brand-secondary": "var(--color-brand-secondary)",

        // Status colors
        "success": "var(--color-success)",
        "success-subtle": "var(--color-success-subtle)",
        "warning": "var(--color-warning)",
        "warning-subtle": "var(--color-warning-subtle)",
        "error": "var(--color-error)",
        "error-subtle": "var(--color-error-subtle)",
        "info": "var(--color-info)",
        "info-subtle": "var(--color-info-subtle)",
        "neutral": "var(--color-neutral)",
        "neutral-subtle": "var(--color-neutral-subtle)",

        // Link colors
        "link": "var(--color-link)",
        "link-hover": "var(--color-link-hover)",
        "link-visited": "var(--color-link-visited)",

        // Icon colors
        "icon-primary": "var(--color-icon-primary)",
        "icon-secondary": "var(--color-icon-secondary)",
        "icon-tertiary": "var(--color-icon-tertiary)",
        "icon-on-accent": "var(--color-icon-on-accent)",
        "icon-bg": "var(--color-icon-bg)",
        "icon-disabled": "var(--color-icon-disabled)",

        // Component specific colors
        "skill-item": "var(--color-skill-item)",
        "skill-item-hover": "var(--color-skill-item-hover)",
        "skill-item-active": "var(--color-skill-item-active)",
        "tooltip-bg": "var(--color-tooltip-bg)",
        "dropdown-bg": "var(--color-dropdown-bg)",
        "selection-bg": "var(--color-selection-bg)",
        "notification-badge": "var(--color-notification-badge)",

        // Additional design-focused colors
        "accent-indigo": "#6366f1",
        "accent-indigo-light": "#818cf8",
        "accent-indigo-dark": "#4f46e5",
        "accent-indigo-50": "#eef2ff",
        "accent-indigo-100": "#e0e7ff",
        "accent-indigo-200": "#c7d2fe",
        "accent-indigo-300": "#a5b4fc",
        "accent-indigo-400": "#818cf8",
        "accent-indigo-500": "#6366f1",
        "accent-indigo-600": "#4f46e5",
        "accent-indigo-700": "#4338ca",
        "accent-indigo-800": "#3730a3",
        "accent-indigo-900": "#312e81",
        "accent-indigo-950": "#1e1b4b",
        "accent-indigo-10": "rgba(99, 102, 241, 0.1)",
        "accent-indigo-20": "rgba(99, 102, 241, 0.2)",

        "accent-teal": "#14b8a6",
        "accent-teal-light": "#5eead4",
        "accent-teal-dark": "#0d9488",
        "accent-teal-50": "#f0fdfa",
        "accent-teal-100": "#ccfbf1",
        "accent-teal-200": "#99f6e4",
        "accent-teal-300": "#5eead4",
        "accent-teal-400": "#2dd4bf",
        "accent-teal-500": "#14b8a6",
        "accent-teal-600": "#0d9488",
        "accent-teal-700": "#0f766e",
        "accent-teal-800": "#115e59",
        "accent-teal-900": "#134e4a",
        "accent-teal-950": "#042f2e",
        "accent-teal-10": "rgba(20, 184, 166, 0.1)",
        "accent-teal-20": "rgba(20, 184, 166, 0.2)",

        "accent-amber": "#f59e0b",
        "accent-amber-light": "#fbbf24",
        "accent-amber-dark": "#d97706",

        "accent-rose": "#e11d48",
        "accent-rose-light": "#fb7185",
        "accent-rose-dark": "#be123c",

        "ui-info": "#3b82f6",
        "ui-success": "#10b981",
        "ui-warning": "#f59e0b",
        "ui-danger": "#ef4444",

        'divider-stroke': 'var(--divider-stroke)',
        'text-tertiary': 'var(--text-tertiary)',
      },
      fontFamily: {
        // variables to allow dynamic font switching
        sans: ["var(--font-body)"],
        serif: ["var(--font-heading)"],
        mono: ["var(--font-code)"],
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        code: ["var(--font-code)"],
      },
      fontSize: {
        // variables for dynamic type scale
        'scale-xs': 'var(--text-xs)',
        'scale-sm': 'var(--text-sm)',
        'scale-base': 'var(--text-base)',
        'scale-lg': 'var(--text-lg)',
        'scale-xl': 'var(--text-xl)',
        'scale-2xl': 'var(--text-2xl)',
        'scale-3xl': 'var(--text-3xl)',
        'scale-4xl': 'var(--text-4xl)',
        'scale-5xl': 'var(--text-5xl)',
        'scale-6xl': 'var(--text-6xl)',
      },
      lineHeight: {
        'heading': 'var(--line-height-tight)',
        'body': 'var(--line-height-normal)',
        'code': 'var(--line-height-code)',
      },
      letterSpacing: {
        'heading': 'var(--letter-spacing-heading)',
        'body': 'var(--letter-spacing-body)',
        'code': 'var(--letter-spacing-code)',
      },
      fontWeight: {
        'normal': 'var(--font-weight-normal)',
        'medium': 'var(--font-weight-medium)',
        'semibold': 'var(--font-weight-semibold)',
        'bold': 'var(--font-weight-bold)',
        'extrabold': 'var(--font-weight-extrabold)',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-text-primary)',
            '--tw-prose-headings': 'var(--color-heading)',
            '--tw-prose-lead': 'var(--color-text-secondary)',
            '--tw-prose-links': 'var(--color-link)',
            '--tw-prose-bold': 'var(--color-text-primary)',
            '--tw-prose-counters': 'var(--color-text-secondary)',
            '--tw-prose-bullets': 'var(--color-text-tertiary)',
            '--tw-prose-hr': 'var(--color-divider)',
            '--tw-prose-quotes': 'var(--color-text-primary)',
            '--tw-prose-quote-borders': 'var(--color-border)',
            '--tw-prose-captions': 'var(--color-text-tertiary)',
            '--tw-prose-code': 'var(--color-text-code)',
            '--tw-prose-pre-code': 'var(--color-text-code)',
            '--tw-prose-pre-bg': 'var(--color-bg-code)',
            '--tw-prose-th-borders': 'var(--color-border)',
            '--tw-prose-td-borders': 'var(--color-border-light)',
            fontFamily: 'var(--font-body)',
            h1: {
              fontFamily: 'var(--font-heading)',
              letterSpacing: 'var(--letter-spacing-heading)',
              fontWeight: 'var(--font-weight-bold)',
            },
            h2: {
              fontFamily: 'var(--font-heading)',
              letterSpacing: 'var(--letter-spacing-heading)',
              fontWeight: 'var(--font-weight-bold)',
            },
            h3: {
              fontFamily: 'var(--font-heading)',
              letterSpacing: 'var(--letter-spacing-heading)',
              fontWeight: 'var(--font-weight-bold)',
            },
            h4: {
              fontFamily: 'var(--font-heading)',
              letterSpacing: 'var(--letter-spacing-heading)',
              fontWeight: 'var(--font-weight-bold)',
            },
            code: {
              fontFamily: 'var(--font-code)',
              fontWeight: 'var(--font-weight-normal)',
            },
            pre: {
              fontFamily: 'var(--font-code)',
              fontWeight: 'var(--font-weight-normal)',
            },
            // Additional prose styles can be added here
          },
        },
        // Add dark mode variants if needed
        dark: {
          css: {
            // Place dark mode specific typography overrides here if needed
          }
        },
      }),
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        inner: "var(--shadow-inner)",
        focus: "var(--shadow-focus)",
        "elevation-1": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "elevation-2": "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "elevation-3": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "elevation-4": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "elevation-5": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        button: 'var(--shadow-button)',
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(var(--color-accent-primary-rgb), 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--color-accent-primary-rgb), 0.1) 1px, transparent 1px)",
        "circuit": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 304 304' width='304' height='304'%3E%3Cpath fill='%23000000' fill-opacity='0.1' d='M44.1 224a5 5 0 1 1 0 2H0v-2h44.1zm160 48a5 5 0 1 1 0 2H82v-2h122.1zm57.8-46a5 5 0 1 1 0-2H304v2h-42.1zm0 16a5 5 0 1 1 0-2H304v2h-42.1zm6.2-114a5 5 0 1 1 0 2h-86.2a5 5 0 1 1 0-2h86.2zm-256-48a5 5 0 1 1 0 2H0v-2h12.1zm185.8 34a5 5 0 1 1 0-2h86.2a5 5 0 1 1 0 2h-86.2zM258 12.1a5 5 0 1 1-2 0V0h2v12.1zm-64 208a5 5 0 1 1-2 0v-54.2a5 5 0 1 1 2 0v54.2zm48-198.2V80h62v2h-64V21.9a5 5 0 1 1 2 0zm16 16V64h46v2h-48V37.9a5 5 0 1 1 2 0zm-128 96V208h16v12.1a5 5 0 1 1-2 0V210h-16v-76.1a5 5 0 1 1 2 0zm-5.9-21.9a5 5 0 1 1 0 2H114v48H85.9a5 5 0 1 1 0-2H112v-48h12.1zm-6.2 130a5 5 0 1 1 0-2H176v-74.1a5 5 0 1 1 2 0V242h-60.1zm-16-64a5 5 0 1 1 0-2H114v48h10.1a5 5 0 1 1 0 2H112v-48h-10.1zM66 284.1a5 5 0 1 1-2 0V274H50v30h-2v-32h18v12.1zM236.1 176a5 5 0 1 1 0 2H226v94h48v32h-2v-30h-48v-98h12.1zm25.8-30a5 5 0 1 1 0-2H274v44.1a5 5 0 1 1-2 0V146h-10.1zm-64 96a5 5 0 1 1 0-2H208v-80h16v-14h-42.1a5 5 0 1 1 0-2H226v18h-16v80h-12.1zm86.2-210a5 5 0 1 1 0 2H272V0h2v32h10.1zM98 101.9V146H53.9a5 5 0 1 1 0-2H96v-42.1a5 5 0 1 1 2 0zM53.9 34a5 5 0 1 1 0-2H80V0h2v34H53.9zm60.1 3.9V66H82v64H69.9a5 5 0 1 1 0-2H80V64h32V37.9a5 5 0 1 1 2 0zM101.9 82a5 5 0 1 1 0-2H128V37.9a5 5 0 1 1 2 0V82h-28.1zm16-64a5 5 0 1 1 0-2H146v44.1a5 5 0 1 1-2 0V18h-26.1zm102.2 270a5 5 0 1 1 0 2H98v14h-2v-16h124.1zM242 149.9V160h16v34h-16v62h48v48h-2v-46h-48v-66h16v-30h-16v-12.1a5 5 0 1 1 2 0zM53.9 18a5 5 0 1 1 0-2H64V2H48V0h18v18H53.9zm112 32a5 5 0 1 1 0-2H192V0h50v2h-48v48h-28.1zm-48-48a5 5 0 0 1-9.8-2h2.07a3 3 0 1 0 5.66 0H178v34h-18V21.9a5 5 0 1 1 2 0V32h14V2h-58.1zm0 96a5 5 0 1 1 0-2H137l32-32h39V21.9a5 5 0 1 1 2 0V66h-40.17l-32 32H117.9zm28.1 90.1a5 5 0 1 1-2 0v-76.51L175.59 80H224V21.9a5 5 0 1 1 2 0V82h-49.59L146 112.41v75.69zm16 32a5 5 0 1 1-2 0v-99.51L184.59 96H300.1a5 5 0 0 1 3.9-3.9v2.07a3 3 0 0 0 0 5.66v2.07a5 5 0 0 1-3.9-3.9H185.41L162 121.41v98.69zm-144-64a5 5 0 1 1-2 0v-3.51l48-48V48h32V0h2v50H66v55.41l-48 48v2.69zM50 53.9v43.51l-48 48V208h26.1a5 5 0 1 1 0 2H0v-65.41l48-48V53.9a5 5 0 1 1 2 0zm-16 16V89.41l-34 34v-2.82l32-32V69.9a5 5 0 1 1 2 0zM12.1 32a5 5 0 1 1 0 2H9.41L0 43.41V40.6L8.59 32h3.51zm265.8 18a5 5 0 1 1 0-2h18.69l7.41-7.41v2.82L297.41 50H277.9zm-16 160a5 5 0 1 1 0-2H288v-71.41l16-16v2.82l-14 14V226h-28.1zm-208 32a5 5 0 1 1 0-2H64v-22.59L40.59 194H21.9a5 5 0 1 1 0-2H41.41L66 216.59V242H53.9zm150.2 14a5 5 0 1 1 0 2H96v-56.6L56.6 162H37.9a5 5 0 1 1 0-2h19.5L98 200.6V256h106.1zm-150.2 2a5 5 0 1 1 0-2H80v-46.59L48.59 178H21.9a5 5 0 1 1 0-2H49.41L82 208.59V258H53.9zM34 39.8v1.61L9.41 66H0v-2h8.59L32 40.59V0h2v39.8zM2 300.1a5 5 0 0 1 3.9 3.9H3.83A3 3 0 0 0 0 302.17V256h18v48h-2v-46H2v42.1zM34 241v63h-2v-62H0v-2h34v1zM17 18H0v-2h16V0h2v18h-1zm273-2h14v2h-16V0h2v16zm-32 273v15h-2v-14h-14v14h-2v-16h18v1zM0 92.1A5.02 5.02 0 0 1 6 97a5 5 0 0 1-6 4.9v-2.07a3 3 0 1 0 0-5.66V92.1zM80 272h2v32h-2v-32zm37.9 32h-2.07a3 3 0 0 0-5.66 0h-2.07a5 5 0 0 1 9.8 0zM5.9 0A5.02 5.02 0 0 1 0 5.9V3.83A3 3 0 0 0 3.83 0H5.9zm294.2 0h2.07A3 3 0 0 0 304 3.83V5.9a5 5 0 0 1-3.9-5.9zm3.9 300.1v2.07a3 3 0 0 0-1.83 1.83h-2.07a5 5 0 0 1 3.9-3.9zM97 100a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-48 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 96a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-144a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM49 36a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM33 68a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 240a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm80-176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm112 176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 180a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 84a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'%3E%3C/path%3E%3C/svg%3E\")",
        "dots": "radial-gradient(currentColor 1px, transparent 1px)",
        "waves": "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.24-.874 1.454-.874 1.454-.874 3.272-1.495 5.88-1.495 5.88-1.495 2.456 0 4.295.748 4.295.748 1.44.636 2.88.636 2.88.636 1.282.636.15 1.31.15 1.31h-6.4c-.336-.504-.504-.372-.504-.372-.178.14-.382.112-.382.112-.392.112-1.073.112-1.83.112-1.054 0-1.452 0-1.452 0C22.38 17.696 21.184 20 21.184 20zm33.28 0c.357-.13.72-.264.888-.14 1.24-.874 1.454-.874 1.454-.874 3.272-1.495 5.88-1.495 5.88-1.495 2.456 0 4.295.748 4.295.748 1.44.636 2.88.636 2.88.636 1.282.636.15 1.31.15 1.31h-6.4c-.336-.504-.504-.372-.504-.372-.178.14-.382.112-.382.112-.392.112-1.073.112-1.83.112-1.054 0-1.452 0-1.452 0C55.66 17.696 54.464 20 54.464 20zm33.28 0c.357-.13.72-.264.888-.14 1.24-.874 1.454-.874 1.454-.874 3.272-1.495 5.88-1.495 5.88-1.495 2.456 0 4.295.748 4.295.748 1.44.636 2.88.636 2.88.636 1.282.636.15 1.31.15 1.31h-6.4c-.336-.504-.504-.372-.504-.372-.178.14-.382.112-.382.112-.392.112-1.073.112-1.83.112-1.054 0-1.452 0-1.452 0C88.94 17.696 87.744 20 87.744 20z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        "gradient-cool": "linear-gradient(to right, var(--color-accent-primary), var(--color-accent-oceanic))",
        "gradient-warm": "linear-gradient(to right, var(--color-accent-primary), var(--color-accent-contrast))",
        "gradient-cosmic": "linear-gradient(to right, var(--color-accent-cosmic), var(--color-accent-primary))",
        "gradient-vibrant": "linear-gradient(135deg, #FF9D6C 0%, #BB4E75 50%, #6B3CFF 100%)",
        'blueprint-grid': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2339A0ED' stroke-width='0.5' stroke-opacity='0.15'%3E%3Cpath d='M0 0h60v60H0z' /%3E%3Cpath d='M30 0v60M0 30h60M15 0v60M45 0v60M0 15h60M0 45h60' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'isometric-grid': "url(\"data:image/svg+xml,%3Csvg width='56' height='28' viewBox='0 0 56 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2339A0ED' stroke-width='0.5' stroke-opacity='0.15'%3E%3Cpath d='M27 1L1 15m54 12L9 1M55 1L1 27m26 0l54-14m-54 0l54 14M27 1l28 14' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        blueprint: 'url("/svg/blueprint-grid.svg")',
      },
      textShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
        md: "0 2px 4px rgba(0, 0, 0, 0.12)",
        lg: "0 4px 8px rgba(0, 0, 0, 0.15)",
      },
      borderColor: {
        DEFAULT: "var(--color-border)",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "slide-down": "slide-down 0.5s ease-out forwards",
        "slide-left": "slide-left 0.5s ease-out forwards",
        "slide-right": "slide-right 0.5s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "bounce-sm": "bounce-sm 2s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-left": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-right": {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "bounce-sm": {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
          "50%": {
            transform: "translateY(-15%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      borderRadius: {
        DEFAULT: '8px',
        'full': '9999px',
      },
    },
  },
  plugins: [
    typography,
    require('@tailwindcss/typography'), // Add for blog/MDX content
  ],
};