import React from "react";
import { ScrollReveal, AnimatedPath } from "@/components/core/Animations";
import { Heading } from "@/components/common/Typography";
import { Button } from "@/components/common/Button";
import RichText from "@/components/common/Typography/RichText";

interface BlogFooterInfoProps {
  sharingPolicyContent: {
    heading: string;
    description: string;
  };
  conclusionContent: {
    heading: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };
}

const BlogFooterInfo: React.FC<BlogFooterInfoProps> = ({
  sharingPolicyContent,
  conclusionContent
}) => {
  return (
    <section className="relative bg-bg-primary py-16 md:py-24 border-t border-divider">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sharing Policy */}
          <ScrollReveal direction="left" delay={0.2}>
            <div>
              <Heading level={3} className="text-xl font-heading mb-4">
                {sharingPolicyContent.heading}
              </Heading>

              <p className="text-text-secondary">
                {sharingPolicyContent.description}
              </p>
            </div>
          </ScrollReveal>

          {/* Conclusion */}
          <ScrollReveal direction="right" delay={0.3}>
            <div>
              <Heading level={3} className="text-xl font-heading mb-4">
                <RichText content={conclusionContent.heading} />
              </Heading>

              <p className="text-text-secondary mb-4">
                {conclusionContent.description}
              </p>

              <Button
                intent="secondary"
                href={conclusionContent.ctaLink}
              >
                {conclusionContent.ctaText}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Technical decorative elements */}
      <div className="absolute bottom-4 left-4 hidden md:block">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <AnimatedPath
            d="M100 0L0 100M50 100V80M100 50H80M0 50H20M50 0V20"
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

export default BlogFooterInfo;
