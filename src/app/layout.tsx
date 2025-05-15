import "@/styles/global/globals.css";


import type { Metadata } from "next";
import {
  Montserrat,
  Inter,
  JetBrains_Mono,
  Playfair_Display,
  Lato,
  Fira_Code,
  Roboto,
  Source_Sans_3,
  Inconsolata,
  Fraunces,
  Libre_Franklin,
  IBM_Plex_Mono,
  Space_Grotesk,
  DM_Sans,
  Rajdhani,
  Quantico,
  VT323
} from "next/font/google";
import Providers from "@/components/providers/Providers";
import MainLayout from "@/components/layout/MainLayout";

// Group fonts by theme, with loading priorities
// Modern theme (default, priority loading)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
});

// Other themes (lower priority)
// Elegant theme
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  preload: false,
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "optional", // Use optional for lower priority fonts
  preload: false,
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "optional",
  preload: false,
});

// Technical theme
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "optional",
  preload: false,
});

const sourceSansPro = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-sans-pro",
  display: "optional",
  preload: false,
});

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
  display: "optional",
  preload: false,
});

// Editorial theme
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "optional",
  preload: false,
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "optional",
  preload: false,
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "optional",
  preload: false,
});

// Neo Geometric theme
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "optional",
  preload: false,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "optional",
  preload: false,
});

// Cybervoid theme
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  display: "optional",
  preload: false,
});

const quantico = Quantico({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-quantico",
  display: "optional",
  preload: false,
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vt323",
  display: "optional",
  preload: false,
});

export const metadata: Metadata = {
  title: "Gavriel Rudolph - Tech Professional",
  description: "Full-stack developer specialized in web development, AI, and automation solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Optimized font loading strategy
              (function() {
                document.documentElement.classList.add('font-loading');

                // Check if we've already loaded fonts in this session
                if (sessionStorage.fontsLoaded) {
                  document.documentElement.classList.add('fonts-loaded');
                  document.documentElement.classList.remove('font-loading');
                  return;
                }

                // Priority fonts loaded first
                const priorityFonts = ['Montserrat', 'Inter', 'JetBrains Mono'];

                // Load only currently selected font theme initially
                const currentFontTheme = localStorage.getItem('fontSystem') || 'modern';

                // Use modern font performance API to control loading
                if ('fonts' in document) {
                  document.fonts.ready.then(function() {
                    document.documentElement.classList.add('fonts-loaded');
                    document.documentElement.classList.remove('font-loading');
                    sessionStorage.fontsLoaded = true;
                  });

                  // Load non-critical fonts after page load
                  if (window.requestIdleCallback) {
                    window.requestIdleCallback(() => {
                      // This runs when the browser is idle
                      const fontLink = document.createElement('link');
                      fontLink.rel = 'stylesheet';
                      fontLink.href = '/api/load-additional-fonts';
                      document.head.appendChild(fontLink);
                    }, { timeout: 5000 });
                  } else {
                    // Fallback for browsers without requestIdleCallback
                    setTimeout(() => {
                      const fontLink = document.createElement('link');
                      fontLink.rel = 'stylesheet';
                      fontLink.href = '/api/load-additional-fonts';
                      document.head.appendChild(fontLink);
                    }, 3000); // Wait 3 seconds before loading additional fonts
                  }
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Additional font application strategy
              (function() {
                function applyFonts() {
                  const fontSystem = localStorage.getItem('fontSystem') || 'modern';
                  const fontMap = {
                    modern: {
                      heading: 'var(--font-montserrat)',
                      body: 'var(--font-inter)',
                      code: 'var(--font-jetbrains-mono)'
                    },
                    elegant: {
                      heading: 'var(--font-playfair-display)',
                      body: 'var(--font-lato)',
                      code: 'var(--font-fira-code)'
                    },
                    technical: {
                      heading: 'var(--font-roboto)',
                      body: 'var(--font-source-sans-pro)',
                      code: 'var(--font-inconsolata)'
                    },
                    editorial: {
                      heading: 'var(--font-fraunces)',
                      body: 'var(--font-libre-franklin)',
                      code: 'var(--font-ibm-plex-mono)'
                    },
                    neoGeometric: {
                      heading: 'var(--font-space-grotesk)',
                      body: 'var(--font-dm-sans)',
                      code: 'var(--font-jetbrains-mono)'
                    },
                    cybervoid: {
                      heading: 'var(--font-rajdhani)',
                      body: 'var(--font-quantico)',
                      code: 'var(--font-vt323)'
                    }
                  };

                  if (fontMap[fontSystem]) {
                    const fonts = fontMap[fontSystem];
                    document.documentElement.style.setProperty('--font-heading', fonts.heading);
                    document.documentElement.style.setProperty('--font-body', fonts.body);
                    document.documentElement.style.setProperty('--font-code', fonts.code);
                  }
                }

                // Apply immediately and after content loads
                applyFonts();
                document.addEventListener('DOMContentLoaded', applyFonts);
              })();
            `
          }}
        />
      </head>
      <body
        className={`
          ${montserrat.variable}
          ${inter.variable}
          ${jetbrainsMono.variable}
          ${playfairDisplay.variable}
          ${lato.variable}
          ${firaCode.variable}
          ${roboto.variable}
          ${sourceSansPro.variable}
          ${inconsolata.variable}
          ${fraunces.variable}
          ${libreFranklin.variable}
          ${ibmPlexMono.variable}
          ${spaceGrotesk.variable}
          ${dmSans.variable}
          ${rajdhani.variable}
          ${quantico.variable}
          ${vt323.variable}
          font-body
        `}
      >
        <Providers>
          <MainLayout fullWidth withPadding={false}>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}