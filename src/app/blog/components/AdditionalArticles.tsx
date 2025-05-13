import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/common/Button";
import { Heading } from "@/components/common/Typography";
import { ScrollReveal } from "@/components/core/Animations";
import { cn } from "@/utils/classNames";
import RichText from "@/components/common/Typography/RichText";

interface AdditionalArticle {
  id: string;
  title: string;
  preview: string;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
  readTime: string;
  ctaText: string;
  ctaLink: string;
}

interface AdditionalArticlesProps {
  articles: AdditionalArticle[];
  hoveredArticle: string | null;
  setHoveredArticle: (id: string | null) => void;
}

const AdditionalArticles: React.FC<AdditionalArticlesProps> = ({
  articles,
  hoveredArticle,
  setHoveredArticle
}) => {
  return (
    <section className="relative bg-bg-secondary py-16 md:py-24 overflow-hidden">
      {/* Technical background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-blueprint-grid opacity-[0.05]"></div>
      </div>

<div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">        {/* Grid of articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article, index) => (
            <ScrollReveal
              key={article.id}
              direction="up"
              delay={0.2 + index * 0.1}
            >
              <div
                className="h-full"
                onMouseEnter={() => setHoveredArticle(article.id)}
                onMouseLeave={() => setHoveredArticle(null)}
              >
                <div className={cn(
                  "h-full border rounded-lg overflow-hidden transition-colors duration-300",
                  hoveredArticle === article.id
                    ? "border-brand-primary shadow-lg"
                    : "border-divider"
                )}>
                  {/* Image */}
                  <div className="relative">
                    <div className="aspect-video">
                      <Image
                        src={article.imageSrc}
                        alt={article.imageAlt}
                        fill
                        className={cn(
                          "object-cover transition-transform duration-700",
                          hoveredArticle === article.id ? "scale-105" : "scale-100"
                        )}
                      />
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card/90 via-bg-card/40 to-transparent opacity-80"></div>

                    {/* Reading time chip */}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-sm flex items-center space-x-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                      </svg>
                      <span className="text-xs text-white">{article.readTime}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 bg-bg-card">
                    <Heading level={3} className="text-lg md:text-xl font-heading mb-3">
                      {article.title}
                    </Heading>

                    <div className="text-text-secondary mb-6">
                      <RichText content={article.preview} />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.tags.map((tag, i) => (
                        <div
                          key={`${article.id}-tag-${i}`}
                          className={cn(
                            "px-2 py-1 text-xs rounded-md border",
                            hoveredArticle === article.id
                              ? "border-brand-primary/40 bg-brand-primary/5"
                              : "border-accent-oceanic/20 bg-accent-oceanic/5"
                          )}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      intent={hoveredArticle === article.id ? "primary" : "secondary"}
                      href={article.ctaLink}
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      }
                      iconPosition="right"
                      className="w-full justify-center"
                    >
                      {article.ctaText}
                    </Button>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-1 bg-divider">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-brand-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: hoveredArticle === article.id ? "100%" : "30%" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdditionalArticles;
