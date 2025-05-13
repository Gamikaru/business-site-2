// ServiceDetailExample.tsx
import React from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/core/Animations";
import RichText from "@/components/common/Typography/RichText";

interface ServiceDetailExampleProps {
  example: string;
  isExampleInView: boolean;
}

const ServiceDetailExample: React.FC<ServiceDetailExampleProps> = ({
  example,
  isExampleInView,
}) => {
  return (
    <>
      <div className="mb-6 flex items-center">
        <h3 className="text-xl font-semibold text-heading">Real Results</h3>
        <div className="ml-4 h-px flex-grow bg-divider"></div>
        <div className="ml-2 px-2 py-1 bg-bg-tertiary/30 text-xs font-mono text-accent-oceanic border border-accent-oceanic/30">
          CASE STUDY
        </div>
      </div>

      <ScrollReveal direction="up" delay={0.3} className="relative">
        <div className="bg-bg-glass backdrop-blur-sm border border-divider rounded-lg p-6 md:p-8">
          <RichText content={example} className="text-lg leading-relaxed" />

          <motion.div
            className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={isExampleInView ? { opacity: 0.7 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path
                d="M0,0 L80,80 M40,0 V20 M0,40 H20 M80,40 H60 M40,80 V60"
                stroke="var(--color-accent-oceanic)"
                strokeWidth="0.5"
                strokeOpacity="0.5"
                strokeDasharray="2 2"
              />
            </svg>
          </motion.div>
        </div>
      </ScrollReveal>
    </>
  );
};

export default ServiceDetailExample;
