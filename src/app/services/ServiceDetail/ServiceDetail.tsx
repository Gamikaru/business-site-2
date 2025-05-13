// ServiceDetail.tsx
"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/utils/classNames";

import ServiceDetailBackground from "./ServiceDetailBackground";
import ServiceDetailImage from "./ServiceDetailImage";
import ServiceDetailIntroduction from "./ServiceDetailIntroduction";
import ServiceDetailBenefits from "./ServiceDetailBenefits";
import ServiceDetailProcess from "./ServiceDetailProcess";
import ServiceDetailExample from "./ServiceDetailExample";
import ServiceDetailPricing from "./ServiceDetailPricing";

export interface ProcessStep {
  title: string;
  description: string;
}

export interface PricingOption {
  title: string;
  price: string;
  description?: string;
}

export interface ServiceDetailProps {
  id: string;
  headline: string;
  introduction: string;
  imageSrc: string;
  benefits: string[];
  process: string[];
  example: string;
  pricing: {
    starter: string;
    standard: string;
  };
  ctaText: string;
  ctaLink: string;
  className?: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({
  id,
  headline,
  introduction,
  imageSrc,
  benefits,
  process,
  example,
  pricing,
  ctaText,
  ctaLink,
  className
}) => {
  // References for scroll effects and animation triggers
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const exampleRef = useRef<HTMLDivElement>(null);

  const isTimelineInView = useInView(timelineRef, { once: false, margin: "-100px" });
  const isExampleInView = useInView(exampleRef, { once: false, margin: "-100px" });

  // Create technical data display values
  const [techValues] = React.useState({
    sectionIndex: Math.floor(Math.random() * 100),
    processDuration: Math.floor(Math.random() * 80) + 40,
    renderTime: Math.floor(Math.random() * 50) + 20,
  });

  return (
    <motion.section
      ref={sectionRef}
      className={cn(
        "relative bg-bg-primary overflow-hidden py-16 md:py-24",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Technical grid background */}
      <ServiceDetailBackground />

      <div className="container mx-auto py-16 md:py-32 px-4 md:px-8 max-w-7xl relative z-10">
        {/* Technical section indicator */}
        <motion.div
          className="absolute top-0 left-6 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center py-1 px-3 bg-bg-tertiary/30 backdrop-blur-sm border border-accent-oceanic/30">
            <div className="w-2 h-2 rounded-full bg-brand-primary mr-2 animate-pulse"></div>
            <span className="text-xs font-mono text-accent-oceanic">SERVICE.{id.slice(0, 2).toUpperCase()}</span>
          </div>
        </motion.div>

        {/* Main grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Service Image */}
          <div className="col-span-1 md:col-span-4 lg:col-span-5">
            <ServiceDetailImage
              imageSrc={imageSrc}
              headline={headline}
              renderTime={techValues.renderTime}
            />
          </div>

          {/* Service Content */}
          <div className="col-span-1 md:col-span-8 lg:col-span-7">
            {/* Introduction */}
            <ServiceDetailIntroduction introduction={introduction} />

            {/* Benefits */}
            <ServiceDetailBenefits benefits={benefits} />
          </div>
        </div>

        {/* Process Timeline */}
        <div ref={timelineRef} className="mt-16 mb-20">
          <ServiceDetailProcess
            process={process}
            isTimelineInView={isTimelineInView}
            processDuration={techValues.processDuration}
          />
        </div>

        {/* Example and Results */}
        <div ref={exampleRef} className="mb-16">
          <ServiceDetailExample
            example={example}
            isExampleInView={isExampleInView}
          />
        </div>

        {/* Pricing and CTA */}
        <div ref={pricingRef} className="mb-16">
          <ServiceDetailPricing
            pricing={pricing}
            ctaText={ctaText}
            ctaLink={ctaLink}
            techValues={techValues}
          />
        </div>
      </div>

      {/* Bottom section divider */}
      <div className="relative mt-16">
        <div className="absolute left-0 right-0 h-1 -skew-x-6 bg-divider"></div>
      </div>
    </motion.section>
  );
};

export default ServiceDetail;