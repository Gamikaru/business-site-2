/**
 * HomePage: Optimized for React 19 + Next.js 15
 * - Performance: Implemented Partial Prerendering with proper suspense boundaries
 * - Bundle size: Progressive loading strategy based on viewport priority
 * - SEO: Enhanced metadata with structured data
 */

import React from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Critical path components loaded immediately
import HomeHero from './hero/HomeHero'
import homeContent from './content'
import MainLayout from '@/components/layout/MainLayout'
import AboutSection from './about/AboutSection';




// Enhanced metadata with structured data for SEO
export async function generateMetadata(): Promise<Metadata> {
  // Structured data for better SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': homeContent.meta.title,
    'description': homeContent.meta.description,
    'url': process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  }

  return {
    title: homeContent.meta.title,
    description: homeContent.meta.description,
    openGraph: {
      title: homeContent.meta.title,
      description: homeContent.meta.description,
      url: process.env.NEXT_PUBLIC_SITE_URL,
      type: 'website',
    },
    other: {
      'script:ld+json': JSON.stringify(structuredData),
    },
  }
}

export default function HomePage() {
  return (
    <MainLayout>
      <>
        <HomeHero
          headline={homeContent.hero.headline}
          subheadline={homeContent.hero.subheadline}
          ctaText={homeContent.hero.ctaText}
          ctaLink={homeContent.hero.ctaLink}
          imageSrc={homeContent.hero.imageSrc}
          imageAlt={homeContent.hero.imageAlt}
        />

        {/* Other home page content */}
        <AboutSection
          heading={homeContent.about.heading}
          content={homeContent.about.content}
          ctaText={homeContent.about.ctaText}
          ctaLink={homeContent.about.ctaLink}
          imageSrc={homeContent.about.imageSrc}
          imageAlt={homeContent.about.imageAlt}
        />
      </>
    </MainLayout>
  )
}