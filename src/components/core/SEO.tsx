// src/components/core/SEO.tsx
"use client";

import { useEffect } from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";
import {
  createWebsiteSchema,
  createPersonSchema,
  createBlogPostSchema,
  createServiceSchema,
  createBreadcrumbSchema,
} from "@/utils/structuredData";
import { analytics } from "@/utils/analytics";
import { BlogPost } from "@/content/types";

export interface SEOProps {
  // Basic metadata
  title: string;
  description: string;
  canonicalUrl?: string;

  // Open Graph
  ogImage?: string;
  ogType?: "website" | "article" | "profile" | "book";

  // Twitter
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterCreator?: string;

  // Structured data
  structuredData?:
    | "website"
    | "person"
    | "blog"
    | "service"
    | "project"
    | "breadcrumb"
    | "none";

  // Content-specific props
  blogPost?: BlogPost;
  serviceName?: string;
  serviceDescription?: string;

  // Breadcrumb items
  breadcrumbItems?: Array<{ name: string; url: string }>;

  // Additional tags
  noIndex?: boolean;
  noFollow?: boolean;
  keywords?: string[];
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = "/images/og-default.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  twitterCreator = "@gavrielrudolph",
  structuredData = "website",
  blogPost,
  serviceName,
  serviceDescription,
  breadcrumbItems,
  noIndex = false,
  noFollow = false,
  keywords = [],
  children,
}) => {
  // Get current path for canonical URL
  const pathname = usePathname();

  // Build canonical URL if not provided
  const siteUrl = "https://gavrielrudolph.com";
  const fullCanonicalUrl = canonicalUrl || `${siteUrl}${pathname}`;

  // Track page view for analytics
  useEffect(() => {
    analytics.trackPageView({
      path: pathname,
      title: title,
    });
  }, [pathname, title]);

  // Generate structured data JSON-LD
  const generateStructuredData = () => {
    switch (structuredData) {
      case "website":
        return createWebsiteSchema();
      case "person":
        return createPersonSchema();
      case "blog":
        if (blogPost) {
          return createBlogPostSchema(blogPost);
        }
        return null;
      case "service":
        if (serviceName && serviceDescription) {
          return createServiceSchema(
            serviceName,
            serviceDescription,
            fullCanonicalUrl
          );
        }
        return null;
      case "breadcrumb":
        if (breadcrumbItems && breadcrumbItems.length > 0) {
          return createBreadcrumbSchema(breadcrumbItems);
        }
        return null;
      case "none":
      default:
        return null;
    }
  };

  const structuredDataJSON = generateStructuredData();

  // Build robots meta content
  const robotsContent = `${noIndex ? "noindex" : "index"},${noFollow ? "nofollow" : "follow"}`;

  // Keywords string
  const keywordsString = keywords.join(", ");

  return (
    <>
      <Head>
        {/* Basic Metadata */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords.length > 0 && (
          <meta name="keywords" content={keywordsString} />
        )}
        <link rel="canonical" href={fullCanonicalUrl} />

        {/* Robots */}
        <meta name="robots" content={robotsContent} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={fullCanonicalUrl} />
        <meta
          property="og:image"
          content={
            ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`
          }
        />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content="Gavriel Rudolph" />

        {/* Twitter Card */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content={
            ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`
          }
        />
        <meta name="twitter:creator" content={twitterCreator} />

        {/* Structured Data */}
        {structuredDataJSON && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredDataJSON),
            }}
          />
        )}
      </Head>

      {/* Any additional head elements */}
      {children}
    </>
  );
};

export default SEO;
