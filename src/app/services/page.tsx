// app/services/page.tsx
import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

// Import static components
import ServicesHeader from "./ServicesHeader";
import ServicesOverview from "./ServicesOverview";
import ServicesTabs from "./ServicesTabs";
import ServicesProcess from "./ServicesProcess";
import ServicesCTA from "./ServicesCTA";

// Import dividers
const WaveDivider = dynamic(
  () => import("./dividers/WaveDivider"),
  {
    ssr: true,
  }
);
const SoundWaveDivider = dynamic(
  () => import("../portfolio/components/dividers/SoundWaveDivider"),
  {
    ssr: true,
  }
);
const CircularDivider = dynamic(
  () => import("../portfolio/components/dividers/CircularDivider"),
  {
    ssr: true,
  }
);
const BracketDivider = dynamic(
  () => import("../portfolio/components/dividers/BracketDivider"),
  {
    ssr: true,
  }
);

// // Dynamically import service detail sections
const AiService = dynamic(() => import("./AiService"), { ssr: true });
// const WebService = dynamic(() => import("./services/WebService"), { ssr: true });
// const SystemService = dynamic(() => import("./services/SystemService"), { ssr: true });
// const StrategyService = dynamic(() => import("./services/StrategyService"), { ssr: true });
// const MobileService = dynamic(() => import("./services/MobileService"), { ssr: true });

// // Xarrows wrapper for animation - dynamically imported to prevent SSR issues
// const ServicesArrows = dynamic(() => import("./ServicesArrows"), { ssr: false });

// Import content
import servicesContent from "./content";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Services | Professional Tech Solutions",
    description:
      "Practical digital solutions for real business challenges. Custom web development, AI automation, mobile apps, system optimization, and strategic consulting.",
  };
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Header Section */}
      <ServicesHeader
        headline={servicesContent.overview.headline}
        intro={servicesContent.overview.introduction}
      />
      {/*
      {/* All-at-a-Glance Services Overview */}
      <ServicesOverview services={servicesContent.services} />

      {/* Sticky Tab Navigation */}
      <ServicesTabs services={servicesContent.services} />

      {/* Wave Divider */}
      <WaveDivider />

      {/* Service Detail Sections */}
      <AiService content={servicesContent.services[0]} />

      <ServicesProcess
        processSteps={servicesContent.workingProcess.steps}
        principles={servicesContent.workingProcess.principles}
      />

      <ServicesCTA
        position="mid"
        heading="Need results fast?"
        ctaText="Book a Call"
        ctaLink="/contact"
      />

      {/* Mid-page CTA */}
      {/*

      {/* Working Process Section */}
      {/*  */}

      {/* Final Wave Divider */}
      <WaveDivider />

      {/* Footer CTA */}
      {/* <ServicesCTA
        position="footer"
        heading={servicesContent.callToAction.heading}
        content={servicesContent.callToAction.content}
        ctaText={servicesContent.callToAction.primaryCTA}
        ctaLink="/contact"
        secondaryCta={servicesContent.callToAction.secondaryCTA}
        secondaryCtaLink="/portfolio"
        availabilityNote={servicesContent.callToAction.availabilityNote}
      /> */}

      {/* Arrows wrapper - client-side only */}
      {/* <ServicesArrows /> */}
    </main>
  );
}
