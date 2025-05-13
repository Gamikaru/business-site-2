import React from "react";
import Image from "next/image";
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

interface MobileBlogPostsProps {
  posts: BlogPost[];
  analyticsData: AnalyticsData[];
}

const MobileBlogPosts: React.FC<MobileBlogPostsProps> = ({ posts, analyticsData }) => {
  return (
    <div className="md:hidden overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory scroll-px-4">
      <div className="flex space-x-4 w-max">
        {posts.map((post, index) => {
          const analytics = analyticsData.find(a => a.id === post.id);

          return (
            <div
              key={post.id}
              className="w-[85vw] max-w-sm flex-shrink-0 snap-center"
            >
              <div className="h-full border border-divider bg-bg-card/70 rounded-lg overflow-hidden">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.imageSrc}
                    alt={post.title}
                    fill
                    sizes="85vw"
                    className="object-cover"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card/90 to-transparent"></div>

                  {/* Reading time badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded flex items-center space-x-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                    <span className="text-xs text-white font-medium">{post.readTime}</span>
                  </div>

                  {index === 0 && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-brand-primary/90 rounded">
                      <span className="text-xs text-white font-medium">Featured</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-heading mb-2 font-heading">
                    {post.title}
                  </h3>

                  <p className="text-sm text-text-secondary mb-3">
                    {post.excerpt}
                  </p>

                  {/* Technical metrics */}
                  {analytics && (
                    <div className="flex justify-between items-center text-[10px] font-mono text-text-tertiary border-t border-divider pt-3">
                      <div>WORDS/{analytics.wordCount}</div>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-oceanic"></div>
                        <span>POP/{analytics.popularity}%</span>
                      </div>
                    </div>
                  )}

                  {/* Read button */}
                  <div className="mt-4">
                    <Button
                      intent="text"
                      href={post.link}
                      className="w-full justify-center text-brand-primary"
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      }
                      iconPosition="right"
                    >
                      Read Article
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {posts.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-colors duration-300",
              i === 0 ? "bg-brand-primary" : "bg-divider"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileBlogPosts;
