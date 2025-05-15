import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heading, RichText} from "@/components/common/Typography";
import { Button } from "@/components/common/Button";
import { cn } from "@/utils/classNames";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  imageSrc: string;
  link: string;
}

interface AnalyticsData {
  id: string;
  popularity: number;
  relevance: number;
  complexity: number;
  tags: number;
  wordCount: number;
  completionRate: number;
  readTime: number;
  lastUpdated: number;
}

interface FeaturedBlogPostProps {
  post: BlogPost;
  analytics: AnalyticsData;
  activeCard: string | null;
  setActiveCard: (id: string | null) => void;
}

const FeaturedBlogPost: React.FC<FeaturedBlogPostProps> = ({
  post,
  analytics,
  activeCard,
  setActiveCard,
}) => {
  return (
    <div
      className={cn(
        "group relative h-full border rounded-lg overflow-hidden transition-all duration-300",
        activeCard === post.id
          ? ""
          : "border-divider bg-bg-card/70"
      )}
      style={{
        border: activeCard === post.id
          ? "1.5px solid var(--color-accent-primary)"
          : undefined,
        boxShadow: activeCard === post.id
          ? "0 4px 24px 0 var(--color-active-bg)"
          : undefined
      }}
      onMouseEnter={() => setActiveCard(post.id)}
      onMouseLeave={() => setActiveCard(null)}
    >
      {/* Image section with enhanced overlay effects */}
      <div className="relative aspect-video md:aspect-[16/9] overflow-hidden">
        <Image
          src={post.imageSrc}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 58vw"
          className={cn(
            "object-cover transition-all duration-700",
            activeCard === post.id ? "scale-105" : "scale-100"
          )}
        />

        {/* Technical grid overlay */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-300",
          activeCard === post.id ? "opacity-70" : "opacity-80"
        )}>
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card/95 via-bg-card/70 to-transparent">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
              <div className="absolute inset-0 bg-blueprint-grid opacity-30" />
            </div>
          </div>

          {/* Grid measurement lines */}
          <svg className="absolute inset-0 w-full h-full">
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={`grid-h-${i}`}
                x1="0"
                y1={`${(i + 1) * 16.67}%`}
                x2="100%"
                y2={`${(i + 1) * 16.67}%`}
                stroke="var(--color-grid-lines)"
                strokeWidth="0.5"
                strokeDasharray="5 5"
              />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={`grid-v-${i}`}
                x1={`${(i + 1) * 16.67}%`}
                y1="0"
                x2={`${(i + 1) * 16.67}%`}
                y2="100%"
                stroke="var(--color-grid-lines)"
                strokeWidth="0.5"
                strokeDasharray="5 5"
              />
            ))}
          </svg>
        </div>

        {/* Reading time badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1.5 backdrop-blur-sm rounded-sm flex items-center space-x-2 z-10"
          style={{
            background: "var(--color-code-bg)",
            border: "1px solid var(--color-divider)"
          }}
        >
          <div className="flex items-center space-x-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
            <span className="text-xs text-primary-text font-medium">{post.readTime}</span>
          </div>
        </div>

        {/* Featured badge */}
        <div
          className="absolute top-4 right-4 px-3 py-1.5 backdrop-blur-sm rounded-sm z-10"
          style={{
            background: "var(--color-accent-primary)",
            border: "1px solid var(--color-accent-primary)"
          }}
        >
          <div className="flex items-center space-x-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-on-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className="text-xs text-text-on-accent font-semibold">FEATURED</span>
          </div>
        </div>
      </div>

      {/* Content area with enhanced technical styling */}
      <div className="p-6 md:p-8 relative">
        {/* Technical frame corners */}
        <div
          className="absolute top-0 left-0 w-4 h-4 pointer-events-none"
          style={{
            borderTop: "1px solid var(--color-divider)",
            borderLeft: "1px solid var(--color-divider)"
          }}
        ></div>
        <div
          className="absolute top-0 right-0 w-4 h-4 pointer-events-none"
          style={{
            borderTop: "1px solid var(--color-divider)",
            borderRight: "1px solid var(--color-divider)"
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none"
          style={{
            borderBottom: "1px solid var(--color-divider)",
            borderLeft: "1px solid var(--color-divider)"
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none"
          style={{
            borderBottom: "1px solid var(--color-divider)",
            borderRight: "1px solid var(--color-divider)"
          }}
        ></div>

        {/* Post title with technical measurement line */}
        <div className="mb-4 relative">
          <Heading level={3} className="text-2xl md:text-3xl font-heading font-bold">
            {post.title}
          </Heading>
          <motion.div
            className="absolute -left-4 top-0 bottom-0 w-px"
            style={{ background: "var(--color-divider)" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
        </div>

        {/* Post excerpt */}
        <div className="text-text-secondary mb-6 md:text-lg">
          <RichText content={post.excerpt} />
        </div>

        {/* Advanced metrics display */}
        <div className="border-t border-divider pt-4 mt-4">
          <div className="flex justify-between items-center text-xs font-mono text-text-tertiary mb-3">
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--color-accent-primary)" }}
              ></div>
              <span>METRICS/LIVE</span>
            </div>
            <span
              style={{ color: "var(--color-accent-contrast)" }}
            >
              {new Date(analytics.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Reading metrics visualization */}
          <div className="h-8 bg-bg-tertiary/20 rounded-sm overflow-hidden mb-4">
            <div className="h-full w-full flex">
              <motion.div
                className="h-full flex items-center justify-end px-2"
                style={{
                  background: "var(--color-accent-primary)"
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${analytics.popularity}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <span className="text-[10px] font-mono text-text-on-accent">
                  POP/{analytics.popularity}%
                </span>
              </motion.div>
              <motion.div
                className="h-full flex items-center justify-end px-2"
                style={{
                  background: "var(--color-accent-contrast)"
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${100 - analytics.popularity}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <span className="text-[10px] font-mono text-text-on-accent">
                  REL/{analytics.relevance}%
                </span>
              </motion.div>
            </div>

            {/* Data points */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`metric-${i}`}
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${(i + 1) * 16.67}%`,
                  background: "var(--color-divider-light)"
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
              />
            ))}
          </div>

          {/* Word count and reading time */}
          <div className="flex justify-between items-center text-xs font-mono">
            <div className="text-text-tertiary">
              WORDS/{analytics.wordCount}
            </div>
            <div
              style={{ color: "var(--color-accent-secondary)" }}
            >
              TIME/{analytics.readTime}min
            </div>
          </div>
        </div>

        {/* Read button with technical styling */}
        <div className="mt-6">
          <Button
            intent="primary"
            href={post.link}
            className="w-full justify-center group"
            icon={
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </motion.svg>
            }
            iconPosition="right"
          >
            Read Full Article
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlogPost;
