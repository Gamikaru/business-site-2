// src/app/about/page.tsx
import { Metadata } from "next";
import AboutHero from "./AboutHero";
import AboutBio from "./AboutBio";
import AboutSkills from "./AboutSkills";
import AboutValues from "./AboutValue";
import AboutTimeline from "./AboutTimeline";
import AboutCTA from "./AboutCTA";
import aboutContent from "./content";

export const metadata: Metadata = {
  title: aboutContent.meta.title,
  description: aboutContent.meta.description,
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero
        headline={aboutContent.hero.headline}
        subheadline={aboutContent.hero.subheadline}
        imageSrc={aboutContent.hero.imageSrc}
        imageAlt={aboutContent.hero.imageAlt}
      />

      <AboutBio
        heading={aboutContent.bio.heading}
        content={aboutContent.bio.content}
        stats={aboutContent.bio.stats}
      />

      <AboutSkills
        heading={aboutContent.skills.heading}
        introduction={aboutContent.skills.introduction}
        categories={aboutContent.skills.categories}
      />

      <AboutValues
        heading={aboutContent.values.heading}
        introduction={aboutContent.values.introduction}
        items={aboutContent.values.items}
      />

      <AboutTimeline
        heading={aboutContent.timeline.heading}
        introduction={aboutContent.timeline.introduction}
        events={aboutContent.timeline.events}
      />

      <AboutCTA
        heading={aboutContent.cta.heading}
        content={aboutContent.cta.content}
        ctaText={aboutContent.cta.ctaText}
        ctaLink={aboutContent.cta.ctaLink}
      />
    </main>
  );
}