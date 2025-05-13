import React from "react";
import { Metadata } from "next";
import HomeHero from "./HomeHero";
import HomeAbout from "./HomeAbout";
import HomeServices from "./HomeServices";
import HomePortfolio from "./HomePortfolio";
import HomeTestimonials from "./HomeTestimonials";
import HomeBlog from "./HomeBlog";
import HomeCTA from "./HomeCTA";
import homeContent from "./content";

export const metadata: Metadata = {
  title: homeContent.meta.title,
  description: homeContent.meta.description,
};

export default function HomePage() {
  return (
    <main>
      <HomeHero
        headline={homeContent.hero.headline}
        subheadline={homeContent.hero.subheadline}
        ctaText={homeContent.hero.ctaText}
        ctaLink={homeContent.hero.ctaLink}
        imageSrc={homeContent.hero.imageSrc}
        imageAlt={homeContent.hero.imageAlt}
      />

      <HomeAbout
        heading={homeContent.about.heading}
        content={homeContent.about.content}
        ctaText={homeContent.about.ctaText}
        ctaLink={homeContent.about.ctaLink}
        imageSrc={homeContent.about.imageSrc}
        imageAlt={homeContent.about.imageAlt}
      />

      <HomeServices
        heading={homeContent.services.heading}
        introduction={homeContent.services.introduction}
        items={homeContent.services.items}
        ctaText={homeContent.services.ctaText}
        ctaLink={homeContent.services.ctaLink}
      />

      <HomePortfolio
        heading={homeContent.portfolio.heading}
        introduction={homeContent.portfolio.introduction}
        projects={homeContent.portfolio.projects}
        ctaText={homeContent.portfolio.ctaText}
        ctaLink={homeContent.portfolio.ctaLink}
      />

      <HomeTestimonials
        heading={homeContent.testimonials.heading}
        items={homeContent.testimonials.items}
      />

      <HomeBlog
        heading={homeContent.blog.heading}
        introduction={homeContent.blog.introduction}
        posts={homeContent.blog.posts}
        ctaText={homeContent.blog.ctaText}
        ctaLink={homeContent.blog.ctaLink}
      />

      <HomeCTA
        heading={homeContent.cta.heading}
        content={homeContent.cta.content}
        ctaText={homeContent.cta.ctaText}
        ctaLink={homeContent.cta.ctaLink}
        availability={homeContent.cta.availability}
        newsletter={homeContent.newsletter}
      />
    </main>
  );
}