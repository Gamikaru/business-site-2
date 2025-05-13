/**
 * HomePage: Optimized for React 19 + Next.js 15
 * - Performance: Implemented Partial Prerendering with dynamic imports for below-fold content
 * - Bundle size: Progressive loading strategy based on viewport priority
 * - SEO: Enhanced metadata with structured data
 */

import React, { Suspense } from "react";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import dynamic from "next/dynamic";
import HomeHero from "./HomeHero";
import HomeAbout from "./HomeAbout";
import homeContent from "./content";
import RichText from "@/components/common/Typography/RichText";

// Dynamic imports with loading states for below-fold content
const HomeServices = dynamic(() => import("./HomeServices"), {
  loading: () => <div className="h-96 w-full animate-pulse bg-gray-100" aria-hidden="true" />
});

const HomePortfolio = dynamic(() => import("./HomePortfolio"), {
  ssr: true,
  loading: () => <div className="h-96 w-full animate-pulse bg-gray-100" aria-hidden="true" />
});

// Lowest priority content with lazy loading
const HomeTestimonials = dynamic(() => import("./HomeTestimonials"), {
  ssr: false,
  loading: () => <div className="h-80 w-full animate-pulse bg-gray-50" aria-hidden="true" />
});

const HomeBlog = dynamic(() => import("./HomeBlog"), {
  ssr: false,
  loading: () => <div className="h-80 w-full animate-pulse bg-gray-50" aria-hidden="true" />
});

const HomeCTA = dynamic(() => import("./HomeCTA"), {
  ssr: true
});

// Enhanced metadata with structured data for SEO
export async function generateMetadata(): Promise<Metadata> {
  const { isDraftMode } = draftMode();

  // Structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": homeContent.meta.title,
    "description": homeContent.meta.description,
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"
  };

  return {
    title: homeContent.meta.title,
    description: homeContent.meta.description,
    alternates: {
      canonical: "/"
    },
    openGraph: {
      title: homeContent.meta.title,
      description: homeContent.meta.description,
      url: "/",
      siteName: homeContent.meta.title,
      locale: "en_US",
      type: "website",
    },
    other: {
      "structured-data": JSON.stringify(structuredData)
    }
  };
}

export default function HomePage() {
  return (
    <main>
      {/* Critical path - loaded immediately */}
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
        // Pass content as string, HomeAbout will wrap with RichText
        content={homeContent.about.content}
        ctaText={homeContent.about.ctaText}
        ctaLink={homeContent.about.ctaLink}
        imageSrc={homeContent.about.imageSrc}
        imageAlt={homeContent.about.imageAlt}
      />

      {/* Start of Partial Prerendering boundary */}
      {/* @see https://nextjs.org/docs/app/api-reference/file-conventions/partial-prerendering */}
      <Suspense>
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

        {/* Lowest priority content - lazy loaded */}
        <Suspense fallback={<div className="h-80 w-full" />}>
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
        </Suspense>
      </Suspense>
    </main>
  );
}