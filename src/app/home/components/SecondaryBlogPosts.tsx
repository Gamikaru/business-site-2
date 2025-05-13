import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heading, RichText } from "@/components/common/Typography";
import { Button } from "@/components/common/Button";
import { cn } from "@/utils/classNames";
import { staggerItemVariants } from "@/components/core/Animations";

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

interface SecondaryBlogPostsProps {
  posts: BlogPost[];
  analyticsData: AnalyticsData[];
  activeCard: string | null;
  setActiveCard: (id: string | null) => void;
}

const SecondaryBlogPosts: React.FC<SecondaryBlogPostsProps> = ({
  posts,
  analyticsData,
  activeCard,
  setActiveCard
}) => {
  return (
    <motion.div variants={staggerItemVariants} className="lg:col-span-5 space-y-6">
      {posts.map((post, index) => {
        const analytics = analyticsData.find(a => a.id === post.id);

        return (
          <div
            key={post.id}
            className={cn(
              "group relative border rounded-lg overflow-hidden transition-all duration-300",
              activeCard === post.id
                ? "border-brand-primary shadow-lg"
                : "border-divider bg-bg-card/70"
            )}
            onMouseEnter={() => setActiveCard(post.id)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className="flex flex-col md:flex-row">
              {/* Image container */}
              <div className="relative aspect-video md:w-1/3 overflow-hidden">
                <Image
                  src={post.imageSrc}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 16vw"
                  className={cn(
                    "object-cover transition-all duration-700",
                    activeCard === post.id ? "scale-105" : "scale-100"
                  )}
                />

                {/* Reading time badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded flex items-center space-x-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                  <span className="text-[10px] text-white">{post.readTime}</span>
                </div>

                {/* Technical scan line on hover */}
                {activeCard === post.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/30 to-transparent"
                    style={{ height: "200%", top: "-50%" }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                )}

                {/* Technical overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card/90 to-bg-card/30 opacity-60" />
              </div>

              {/* Content area */}
              <div className="p-4 md:p-5 md:w-2/3 flex flex-col">
                <Heading level={4} className="text-lg font-bold font-heading mb-2">
                  {post.title}
                </Heading>

                <div className="text-text-secondary mb-6 md:text-lg">
                  <RichText content={post.excerpt} />
                </div>

                {/* Technical metrics */}
                {analytics && (
                  <div className="flex justify-between items-center text-[10px] font-mono text-text-tertiary border-t border-divider mt-3 pt-3">
                    <div className="flex items-center space-x-1">
                      <div className="data-point w-1.5 h-1.5 rounded-full bg-accent-oceanic"></div>
                      <span>REL/{analytics.relevance}%</span>
                    </div>
                    <Button
                      intent="text"
                      href={post.link}
                      size="sm"
                      className="text-brand-primary p-0 h-auto"
                      icon={
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      }
                      iconPosition="right"
                    >
                      Read
                    </Button>
                  </div>
                )}

                {/* Reading progress animated bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-primary to-accent-oceanic"
                    initial={{ width: "0%" }}
                    animate={{ width: activeCard === post.id ? "100%" : `${analytics?.completionRate || 0}%` }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default SecondaryBlogPosts;
