"use client";

import React, { useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { blogContent } from "../content";

// Import component sections
import BlogHeader from "./BlogHeader";
import BlogIntroduction from "./BlogIntroduction";
import BlogCategories from "./BlogCategories";
import FeaturedArticles from "./FeaturedArticles";
import AdditionalArticles from "./AdditionalArticles";
import BlogNewsletter from "./BlogNewsletter";
import BlogTopicRequest from "./BlogTopicRequest";
import BlogFooterInfo from "./BlogFooterInfo";

export default function BlogClientPage() {
  // Refs for scroll animations
  const pageRef = useRef<HTMLDivElement>(null);

  // State for interactive elements
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Technical metadata for visual elements
  const [techData] = useState({
    renderTime: Math.floor(Math.random() * 100) + 100,
    density: Math.floor(Math.random() * 30) + 70,
    nodes: Math.floor(Math.random() * 100) + 100,
    viewportRatio: "16:9",
    sectionIndex: 2,
  });

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  // Track mouse position for interactive elements
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!pageRef.current) return;

    const rect = pageRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-bg-primary"
      onMouseMove={handleMouseMove}
    >
      {/* Hero Header Section */}
      <BlogHeader
        headerContent={blogContent.header}
        mousePosition={mousePosition}
        scrollYProgress={scrollYProgress}
        techData={techData}
      />

      {/* Introduction Section */}
      <BlogIntroduction
        introContent={blogContent.introduction}
      />

      {/* Categories Section */}
      <BlogCategories
        categoriesContent={blogContent.categories}
        mousePosition={mousePosition}
      />

      {/* Featured Articles Section */}
      <FeaturedArticles
        articles={blogContent.featuredArticles}
        hoveredArticle={hoveredArticle}
        setHoveredArticle={setHoveredArticle}
      />

      {/* Additional Articles Grid */}
      <AdditionalArticles
        articles={blogContent.additionalArticles}
        hoveredArticle={hoveredArticle}
        setHoveredArticle={setHoveredArticle}
      />

      {/* Newsletter Section */}
      <BlogNewsletter
        newsletterContent={blogContent.newsletter}
        newsletterPreviewContent={blogContent.newsletterPreview}
        mediumProfileContent={blogContent.mediumProfile}
        contentPolicyContent={blogContent.contentPolicy}
      />

      {/* Topic Request Section */}
      <BlogTopicRequest
        topicRequestContent={blogContent.topicRequest}
      />

      {/* Footer Info Section */}
      <BlogFooterInfo
        sharingPolicyContent={blogContent.sharingPolicy}
        conclusionContent={blogContent.conclusion}
      />
    </div>
  );
}
