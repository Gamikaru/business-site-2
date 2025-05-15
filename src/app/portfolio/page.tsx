import React from "react";
import { Metadata } from "next";
import portfolioContent from "./content";
import dynamic from "next/dynamic";

// Import components directly instead of using dynamic imports for now
import PortfolioHeader from "./components/PortfolioHeader";
import PortfolioIntroduction from "./components/PortfolioIntroduction";
import WaveDivider from "./components/dividers/WaveDivider";
// import PortfolioFilters from "./components/PortfolioFIlters";

// const FeaturedProject = dynamic(() => import("./components/FeaturedProject"), {
//   ssr: true,
// });

const ProjectTimeline = dynamic(() => import("./components/ProjectTimeline"), {
  ssr: true,
});

// const DeepDiveSection = dynamic(() => import("./components/DeepDiveSection"), {
//   ssr: true,
// });

// const ClientPartners = dynamic(() => import("./components/ClientPartners"), {
//   ssr: false,
// });

const PortfolioCTA = dynamic(() => import("./components/PortfolioCTA"), {
  ssr: true,
});

// // Dividers - with correct paths
// const WaveDivider = dynamic(() => import("./components/dividers/WaveDivider"), {
//   ssr: true,
// });

const ZigzagDivider = dynamic(
  () => import("./components/dividers/ZigZagDivider"),
  { ssr: true }
);

const SoundWaveDivider = dynamic(
  () => import("./components/dividers/SoundWaveDivider"),
  { ssr: true }
);

const StepsDivider = dynamic(
  () => import("./components/dividers/StepsDivider"),
  { ssr: true }
);

const CircularDivider = dynamic(
  () => import("./components/dividers/CircularDivider"),
  { ssr: true }
);

const BracketDivider = dynamic(
  () => import("./components/dividers/BracketDivider"),
  { ssr: true }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: portfolioContent.meta.title,
    description: portfolioContent.meta.description,
  };
}

export default function PortfolioPage() {
  // Define default CTA values in case callToAction is undefined
  const defaultCTA = {
    heading: "Let's work together",
    content: "Ready to bring your next digital project to life? I'm available for new opportunities.",
    ctaText: "Get in touch",
    ctaLink: "/contact",
    availabilityNote: "Currently available for new projects"
  };

  // Use the default values if callToAction doesn't exist in portfolioContent
  const ctaData = portfolioContent.callToAction || defaultCTA;

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Mount the PortfolioHeader with rich text heading */}
      <PortfolioHeader heading={portfolioContent.overview.headline} />

      {/* Portfolio Introduction component */}
      <PortfolioIntroduction
        introduction={portfolioContent.overview.introduction}
        imageSrc={portfolioContent.overview.imageSrc}
        imageAlt={portfolioContent.overview.imageAlt}
      />

      {/* Wave Divider component */}
      <WaveDivider />

      <ZigzagDivider />

      {/* Featured Project component
      <FeaturedProject project={portfolioContent.projects[0]} /> */}

      <SoundWaveDivider />

      {/* Project Timeline component - Now passes filters data */}
      <ProjectTimeline
        projects={portfolioContent.projects}
        filters={portfolioContent.filters}
      />

      <StepsDivider />

      <PortfolioCTA
        heading={ctaData.heading}
        content={ctaData.content}
        ctaText={ctaData.ctaText}
        ctaLink={ctaData.ctaLink}
        availabilityNote={ctaData.availabilityNote}
      />

      <CircularDivider />

      <BracketDivider />

      {/* Deep Dive Section component */}
      {/* <DeepDiveSection project={portfolioContent.projects[2]} /> */}
    </main>
  );
}
