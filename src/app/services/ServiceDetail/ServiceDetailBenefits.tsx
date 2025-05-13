// ServiceDetailBenefits.tsx
import React from "react";
import { ScrollReveal, GestureElement } from "@/components/core/Animations";
import RichText from "@/components/common/Typography/RichText";

interface ServiceDetailBenefitsProps {
  benefits: string[];
}

const ServiceDetailBenefits: React.FC<ServiceDetailBenefitsProps> = ({
  benefits,
}) => {
  return (
    <ScrollReveal direction="up" delay={0.5} className="mb-12">
      <div className="mb-4 flex items-center">
        <h3 className="text-xl font-semibold text-heading">What You Get</h3>
        <div className="ml-4 h-px flex-grow bg-divider"></div>
        <div className="ml-2 px-2 py-1 bg-bg-tertiary/30 text-xs font-mono text-accent-oceanic border border-accent-oceanic/30">
          BENEFITS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <GestureElement
            key={`benefit-${index}`}
            tiltEnabled={true}
            tiltFactor={3}
            className="relative border border-divider rounded-lg p-5 bg-bg-tertiary/5 hover:bg-bg-glass transition-colors duration-300"
          >
            {/* Benefit number */}
            <div className="absolute -top-3 -left-3 w-6 h-6 flex items-center justify-center bg-bg-primary border border-accent-oceanic rounded-full">
              <span className="text-xs font-mono text-accent-oceanic">
                {index + 1}
              </span>
            </div>

            <RichText content={benefit} className="relative z-10" />

            {/* Technical detail */}
            <div className="absolute bottom-2 right-2 opacity-30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="var(--color-accent-oceanic)"
                  strokeWidth="0.5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  stroke="var(--color-accent-oceanic)"
                  strokeWidth="0.5"
                  strokeDasharray="1 2"
                />
              </svg>
            </div>
          </GestureElement>
        ))}
      </div>
    </ScrollReveal>
  );
};

export default ServiceDetailBenefits;
