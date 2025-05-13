import React from "react";

interface ServiceDetailPricingProps {
  pricing: {
    starter: string;
    standard: string;
  };
  ctaText: string;
  ctaLink: string;
  techValues: {
    sectionIndex: number;
    processDuration: number;
    renderTime: number;
  };
}

const ServiceDetailPricing: React.FC<ServiceDetailPricingProps> = ({
  pricing,
  ctaText,
  ctaLink,
  techValues,
}) => {
  // TODO: Implement actual pricing UI
  return (
    <div>
      <h3 className="text-xl font-semibold text-heading mb-4">Pricing</h3>
      <div className="mb-2">
        <div dangerouslySetInnerHTML={{ __html: pricing.starter }} />
      </div>
      <div className="mb-4">
        <div dangerouslySetInnerHTML={{ __html: pricing.standard }} />
      </div>
      <a href={ctaLink} className="inline-block bg-brand-primary text-white px-4 py-2 rounded">
        {ctaText}
      </a>
      <div className="mt-2 text-xs text-accent-oceanic/70 font-mono">
        SECTION/{techValues.sectionIndex}
      </div>
    </div>
  );
};

export default ServiceDetailPricing;
