import React from "react";
import { ScrollReveal } from "@/components/core/Animations";
import { Heading } from "@/components/common/Typography";
import RichText from "@/components/common/Typography/RichText";

interface BlogIntroductionProps {
  introContent: {
    heading: string;
    description: string;
  };
}

const BlogIntroduction: React.FC<BlogIntroductionProps> = ({ introContent }) => {
  return (
    <section className="relative bg-bg-primary py-12 md:py-16">
<div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">        <ScrollReveal direction="up" delay={0.2}>
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={2} className="text-2xl md:text-3xl font-heading mb-6">
              <RichText content={introContent.heading} />
            </Heading>

            <div className="text-text-secondary">
              <RichText content={introContent.description} />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BlogIntroduction;
