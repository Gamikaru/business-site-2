// ServiceDetailImage.tsx
import React from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/core/Animations";

interface ServiceDetailImageProps {
  imageSrc: string;
  headline: string;
  renderTime: number;
}

const ServiceDetailImage: React.FC<ServiceDetailImageProps> = ({
  imageSrc,
  headline,
  renderTime,
}) => {
  return (
    <ScrollReveal direction="left" delay={0.3} className="relative h-full">
      <div className="relative rounded-lg overflow-hidden h-full border border-divider">
        {/* Primary image */}
        <div className="aspect-[4/3] md:aspect-auto md:h-full">
          <Image src={imageSrc} alt={headline} fill className="object-cover" />

          {/* Technical overlay elements */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none">
              {/* Corner measurement marks */}
              <path
                d="M0,0 L20,0 M0,0 L0,20"
                stroke="var(--color-accent-primary)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M100%,0 L calc(100% - 20px),0 M100%,0 L100%,20"
                stroke="var(--color-accent-primary)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M0,100% L20,100% M0,100% L0,calc(100% - 20px)"
                stroke="var(--color-accent-primary)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M100%,100% L calc(100% - 20px),100% M100%,100% L100%,calc(100% - 20px)"
                stroke="var(--color-accent-primary)"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Technical label */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs font-mono px-2 py-1 rounded">
          RENDER/{renderTime}ms
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ServiceDetailImage;
