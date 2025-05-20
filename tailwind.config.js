/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Add other paths if necessary
  ],
  theme: {
    extend: {
      fontFamily: {
        // Point Tailwind's default font families to your CSS variables
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'], // Changed to a standard serif stack
        mono: ['var(--font-code)', 'monospace'],
        // You can also define specific named families if needed by components
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        code: ['var(--font-code)'],
      },
      // ... other theme extensions
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ... other plugins
  ],
};
