// src/app/layout.tsx
import "@/styles/global/globals.css"; // Now this one comes first (it imports font-themes.css)

// Remove this line - no longer needed:
// import '@/styles/global/tokens.theme.css';

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
  VT323,
  // New fonts
  Merriweather,
  Open_Sans,
  Poppins,
  Work_Sans,
  Quicksand,
  Nunito,
  Lora,
  Karla,
  IBM_Plex_Sans,
  IBM_Plex_Serif,
  Crimson_Pro,
  Cabin,
  Exo_2,
  Barlow,
  Caveat,
  Outfit,
} from "next/font/google";
import Providers from "@/components/providers/Providers";
import { cn } from "@/utils/classNames";

export const metadata: Metadata = {
  title: "Gavriel Rudolph - Tech Professional",
  description:
    "Full-stack developer specialized in web development, AI, and automation solutions.",
};

// Group fonts by theme, with loading priorities
// Modern theme (default, priority loading)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
  weight: ["400", "500", "700"],
});

// For other important font systems, set at least some to preload=true
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

// Other themes (lower priority)
// Elegant theme
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "optional",
  preload: false,
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "optional",
  preload: false,
  weight: ["400", "500", "700"],
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
  weight: ["400", "700"],
});

// Editorial theme
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "optional",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "optional",
  preload: false,
  weight: ["400", "500", "600", "700"],
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
  display: "swap", // Changed to swap for testing, was "optional"
  preload: true,  // Changed to true for testing
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap", // Changed to swap for testing, was "optional"
  preload: true,  // Changed to true for testing
  weight: ["400", "500", "700"],
});

// Cybervoid theme
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
  preload: true,
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

// New font pairings
// Humanist theme
const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
  preload: false,
  weight: ["400", "700"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

// Corporate theme
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

// Creative theme
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

// Academic theme
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

// Minimal theme
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

// Vintage theme
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson-pro",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

// Futuristic theme
const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

// Casual theme
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Move all font variables to HTML tag for proper CSS variable scope
  return (
    <html
      lang="en"
      className={cn(
        // Existing fonts
        montserrat.variable,
        inter.variable,
        jetbrainsMono.variable,
        playfairDisplay.variable,
        lato.variable,
        firaCode.variable,
        roboto.variable,
        sourceSansPro.variable,
        inconsolata.variable,
        fraunces.variable,
        libreFranklin.variable,
        ibmPlexMono.variable,
        spaceGrotesk.variable,
        dmSans.variable,
        rajdhani.variable,
        quantico.variable,
        vt323.variable,
        // New fonts
        merriweather.variable,
        openSans.variable,
        poppins.variable,
        workSans.variable,
        quicksand.variable,
        nunito.variable,
        lora.variable,
        karla.variable,
        ibmPlexSans.variable,
        ibmPlexSerif.variable,
        crimsonPro.variable,
        cabin.variable,
        exo2.variable,
        barlow.variable,
        caveat.variable,
        outfit.variable
      )}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}