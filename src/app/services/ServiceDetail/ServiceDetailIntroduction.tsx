// ServiceDetailIntroduction.tsx
import React from "react";
import { ScrollReveal } from "@/components/core/Animations";
import RichText from "@/components/common/Typography/RichText";

interface ServiceDetailIntroductionProps {
  introduction: string;
}

const ServiceDetailIntroduction: React.FC<ServiceDetailIntroductionProps> = ({
  introduction
}) => {
  return (
    <ScrollReveal
      direction="right"
      delay={0.4}
      className="mb-10"
    >
      <div className="relative">
        <div className="bg-bg-tertiary/10 backdrop-blur-sm p-6 border-l-2 border-brand-primary">
          {/* Directly applying text classes instead of using the Text component */}
          <div className="text-lg leading-relaxed">
            <RichText content={introduction} />
          </div>

          {/* Corner technical accents */}
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand-primary"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand-primary"></div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ServiceDetailIntroduction;