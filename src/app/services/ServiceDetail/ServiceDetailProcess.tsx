// ServiceDetailProcess.tsx
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/classNames";
import RichText from "@/components/common/Typography/RichText";

interface ServiceDetailProcessProps {
  process: string[];
  isTimelineInView: boolean;
  processDuration: number;
}

const ServiceDetailProcess: React.FC<ServiceDetailProcessProps> = ({
  process,
  isTimelineInView,
  processDuration,
}) => {
  return (
    <>
      <div className="mb-6 flex items-center">
        <h3 className="text-xl font-semibold text-heading">How It Works</h3>
        <div className="ml-4 h-px flex-grow bg-divider"></div>
        <div className="ml-2 px-2 py-1 bg-bg-tertiary/30 text-xs font-mono text-accent-oceanic border border-accent-oceanic/30">
          PROCESS
        </div>
      </div>

      <div className="relative">
        {/* Desktop timeline (horizontal) */}
        <div className="hidden md:block relative">
          {/* SVG path connecting process steps */}
          <svg
            className="absolute top-16 left-0 w-full h-4"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,8 C50,8 50,16 100,16 C150,16 150,8 200,8 C250,8 250,16 300,16"
              stroke="var(--color-brand-primary)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="1000"
              strokeDashoffset={isTimelineInView ? 0 : 1000}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Timeline progress dots */}
            {process.map((_, index) => (
              <motion.circle
                key={`dot-${index}`}
                cx={`${index * (100 / (process.length - 1))}%`}
                cy="8"
                r="6"
                fill="var(--color-bg-primary)"
                stroke="var(--color-brand-primary)"
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0 }}
                animate={isTimelineInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
              />
            ))}
          </svg>

          {/* Process steps */}
          <div className="grid grid-cols-4 gap-4">
            {process.map((step, index) => (
              <motion.div
                key={`process-${index}`}
                className="pt-24 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.2 }}
              >
                <div className="bg-bg-glass border border-divider rounded-lg p-5 h-full">
                  {/* Step number */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center bg-bg-primary border-2 border-brand-primary rounded-full">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>

                  <RichText content={step} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile timeline (vertical scroll-snap carousel) */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
          <div className="flex space-x-4 w-max">
            {process.map((step, index) => (
              <div
                key={`process-mobile-${index}`}
                className="w-[85vw] max-w-sm flex-shrink-0 snap-center border border-divider rounded-lg p-5 bg-bg-tertiary/10 relative"
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center bg-bg-primary border-2 border-brand-primary rounded-full">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>

                <RichText content={step} />
              </div>
            ))}
          </div>

          {/* Scroll indicator dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {process.map((_, i) => (
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

        {/* Technical measurement indicator */}
        <div className="absolute -bottom-6 right-4 text-xs font-mono text-accent-oceanic/70 hidden md:block">
          DURATION/{processDuration}d
        </div>
      </div>
    </>
  );
};

export default ServiceDetailProcess;
