import React from "react";
import { Button } from "@/components/common/Button";
import { Heading } from "@/components/common/Typography";
import { ScrollReveal } from "@/components/core/Animations";

interface BlogTopicRequestProps {
  topicRequestContent: {
    heading: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };
}

const BlogTopicRequest: React.FC<BlogTopicRequestProps> = ({
  topicRequestContent
}) => {
  return (
    <section className="relative bg-bg-secondary py-16 md:py-24">
<div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center mb-8">
            <Heading level={2} className="text-2xl md:text-3xl font-heading mb-4">
              {topicRequestContent.heading}
            </Heading>

            <p className="text-text-secondary">
              {topicRequestContent.description}
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              intent="secondary"
              size="lg"
              href={topicRequestContent.ctaLink}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              }
              iconPosition="right"
            >
              {topicRequestContent.ctaText}
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BlogTopicRequest;
