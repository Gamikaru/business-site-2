// src/app/layout.tsx
import type { Metadata } from "next";
import {
  Montserrat,
  Inter,
  JetBrains_Mono,
  Playfair_Display,
  Lato,
  Fira_Code,
  Roboto,
  Source_Sans_3, // Changed from Source_Sans_Pro
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
import "@/styles/global/globals.css";

// Load fonts for Modern theme (default)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Load fonts for Elegant theme
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

// Load fonts for Technical theme
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const sourceSansPro = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-sans-pro",
  display: "swap",
});

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
  display: "swap",
});

// Load fonts for Editorial theme
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

// Load fonts for Neo Geometric theme
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Load fonts for Cybervoid theme
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"], // Added required weight property
  variable: "--font-rajdhani",
  display: "swap",
});

const quantico = Quantico({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-quantico",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vt323",
  display: "swap",
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
        {/* Add this script for better font loading */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
        // This script helps manage font loading
        (function() {
          document.documentElement.classList.add('font-loading');
          if (sessionStorage.fontsLoaded) {
            document.documentElement.classList.add('fonts-loaded');
            document.documentElement.classList.remove('font-loading');
            return;
          }

          document.fonts.ready.then(function () {
            document.documentElement.classList.add('fonts-loaded');
            document.documentElement.classList.remove('font-loading');
            sessionStorage.fontsLoaded = true;
          });
        })();
      `,
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
