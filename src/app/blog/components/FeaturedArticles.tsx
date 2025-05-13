import React, { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/common/Button";
import { Heading } from "@/components/common/Typography";
import { ScrollReveal, AnimatedPath } from "@/components/core/Animations";
import { cn } from "@/utils/classNames";
import RichText from "@/components/common/Typography/RichText";

interface FeaturedArticle {
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

interface FeaturedArticlesProps {
  articles: FeaturedArticle[];
  hoveredArticle: string | null;
  setHoveredArticle: (id: string | null) => void;
}

const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({
  articles,
  hoveredArticle,
  setHoveredArticle
}) => {
  const featuredRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={featuredRef}
      className="relative bg-bg-primary py-16 md:py-24">
<div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">        {/* Featured Articles */}
        <div className="space-y-12 md:space-y-16">
          {articles.map((article, index) => (
            <ScrollReveal
              key={article.id}
              direction={index % 2 === 0 ? "left" : "right"}
              delay={0.2}
            >
              <div
                className="relative group"
                onMouseEnter={() => setHoveredArticle(article.id)}
                onMouseLeave={() => setHoveredArticle(null)}
              >
                <div className={cn(
                  "grid grid-cols-1 md:grid-cols-12 gap-8 relative transition-all duration-300 rounded-lg",
                  hoveredArticle === article.id
                    ? "bg-bg-secondary/30 p-6"
                    : "bg-transparent p-0"
                )}>
                  {/* Technical frame that appears on hover */}
                  <div className={cn(
                    "absolute -inset-px border border-dashed rounded-lg transition-opacity duration-300",
                    hoveredArticle === article.id
                      ? "opacity-100 border-brand-primary/30"
                      : "opacity-0 border-accent-oceanic/20"
                  )}></div>

                  {/* Image */}
                  <div className="md:col-span-5 lg:col-span-5">
                    <div className="relative rounded-lg overflow-hidden">
                      {/* Technical scan line that appears on hover */}
                      {hoveredArticle === article.id && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent pointer-events-none"
                          style={{ height: "200%" }}
                          initial={{ top: "-100%" }}
                          animate={{ top: "100%" }}
                          transition={{ duration: 1.5, ease: "linear" }}
                        />
                      )}

                      {/* Image with overlay */}
                      <div className="aspect-video md:aspect-[4/3]">
                        <Image
                          src={article.imageSrc}
                          alt={article.imageAlt}
                          fill
                          className={cn(
                            "object-cover transition-transform duration-700",
                            hoveredArticle === article.id ? "scale-105" : "scale-100"
                          )}
                        />

                        {/* Overlay with grid */}
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-t from-bg-primary/80 to-transparent transition-opacity duration-300",
                          hoveredArticle === article.id ? "opacity-60" : "opacity-80"
                        )}></div>

                        {hoveredArticle === article.id && (
                          <svg className="absolute inset-0 w-full h-full">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <React.Fragment key={`grid-${article.id}-${i}`}>
                                <line
                                  x1="0"
                                  y1={`${(i + 1) * 25}%`}
                                  x2="100%"
                                  y2={`${(i + 1) * 25}%`}
                                  stroke="var(--color-accent-oceanic)"
                                  strokeWidth="0.5"
                                  strokeOpacity="0.3"
                                />
                                <line
                                  x1={`${(i + 1) * 25}%`}
                                  y1="0"
                                  x2={`${(i + 1) * 25}%`}
                                  y2="100%"
                                  stroke="var(--color-accent-oceanic)"
                                  strokeWidth="0.5"
                                  strokeOpacity="0.3"
                                />
                              </React.Fragment>
                            ))}
                          </svg>
                        )}
                      </div>

                      {/* Reading time chip */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-sm flex items-center space-x-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 6v6l4 2"></path>
                        </svg>
                        <span className="text-xs text-white">{article.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-7 lg:col-span-7 flex flex-col">
                    <Heading level={3} className="text-xl md:text-2xl font-heading mb-4">
                      <RichText content={article.title} />
                    </Heading>

                    <div className="text-text-secondary mb-6 flex-grow">
                      <RichText content={article.preview} />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag, i) => (
                        <div
                          key={`${article.id}-tag-${i}`}
                          className={cn(
                            "px-3 py-1 text-xs rounded-md border",
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
                    <div>
                      <Button
                        intent={hoveredArticle === article.id ? "primary" : "secondary"}
                        href={article.ctaLink}
                        icon={
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        }
                        iconPosition="right"
                      >
                        {article.ctaText}
                      </Button>
                    </div>

                    {/* Technical data points */}
                    <div className={cn(
                      "mt-4 text-[10px] font-mono text-accent-oceanic flex justify-end transition-opacity duration-300",
                      hoveredArticle === article.id ? "opacity-100" : "opacity-0"
                    )}>
                      <span>ID/{article.id} • TAGS/{article.tags.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Technical overlay */}
      <div className="absolute right-0 bottom-0 hidden md:block">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <AnimatedPath
            d="M0 0L200 200M100 0V40M0 100H40M200 100H160M100 200V160"
            stroke="var(--color-accent-oceanic)"
            strokeWidth="0.5"
            strokeOpacity="0.2"
            strokeDasharray="4 2"
          />
        </svg>
      </div>
    </section>
  );
};

export default FeaturedArticles;
