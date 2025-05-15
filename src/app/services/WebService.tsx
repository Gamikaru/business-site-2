// app/services/services/AiService.tsx
"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Heading, Text } from "@/components/common/Typography";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ScrollReveal, TextReveal } from "@/components/core/Animations";
import { cn } from "@/utils/classNames";

interface ServiceFeature {
  title: string;
  description: string;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface PricingTier {
  title: string;
  price: string;
}

interface ServiceContent {
  id: string;
  title: string;
  introduction: string;
  imageSrc: string;
  imageAlt: string;
  features: ServiceFeature[];
  process: ProcessStep[];
  pricing: PricingTier[];
  exampleProject: {
    title: string;
    description: string;
  };
  ctaText: string;
  ctaLink: string;
}

interface AiServiceProps {
  content: ServiceContent;
  className?: string;
}

const WebService: React.FC<AiServiceProps> = ({
  content,
  className,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      id={content.id}
      className={cn("py-20 relative", className)}
    >
      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">
        {/* Service header with number prefix */}
        <div id={`detail-${content.id}`} className="flex items-center mb-12">
          <div className="text-5xl font-bold text-accent-primary/20 mr-4">01</div>
          <Heading level={2} className="text-3xl md:text-4xl font-bold">
            {content.title}
          </Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          {/* Image column */}
          <div className="md:col-span-5 lg:col-span-4">
            <div id={`img-${content.id}`} className="relative aspect-[4/3] overflow-hidden">
              <div className="absolute inset-0 bg-blueprint-grid opacity-20 z-10" />
              <Image
                src={content.imageSrc}
                alt={content.imageAlt}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Introduction text */}
          <div className="md:col-span-7 lg:col-span-8">
            <ScrollReveal direction="up">
              <div id={`${content.id}-intro`} className="prose">
                <Text className="text-lg leading-relaxed">
                  {content.introduction}
                </Text>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Features section */}
        <div className="mb-20">
          <ScrollReveal>
            <Heading
              id={`${content.id}-getHead`}
              level={3}
              className="text-2xl font-bold mb-8"
            >
              WHAT YOU GET
            </Heading>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.features.map((feature, index) => (
              <ScrollReveal
                key={index}
                direction="up"
                delay={0.1 * index}
              >
                <Card
                  id={`${content.id}-get-${index + 1}`}
                  className="h-full"
                >
                  <div className="p-6">
                    <Heading level={4} className="text-xl font-bold mb-3">
                      {feature.title}
                    </Heading>
                    <Text className="text-text-secondary">
                      {feature.description}
                    </Text>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Process section */}
        <div className="mb-20">
          <ScrollReveal>
            <Heading
              id={`${content.id}-how`}
              level={3}
              className="text-2xl font-bold mb-10"
            >
              HOW IT WORKS
            </Heading>
          </ScrollReveal>

          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            {content.process.map((step, index) => (
              <div
                key={index}
                id={`${content.id}-s${index + 1}`}
                className="flex-1 relative"
              >
                <ScrollReveal delay={0.1 * index}>
                  <div className="border-l-4 border-accent-primary pl-4">
                    <div className="font-mono text-accent-primary mb-2">
                      STEP {index + 1}
                    </div>
                    <Heading level={4} className="text-lg font-bold mb-2">
                      {step.title}
                    </Heading>
                    <Text className="text-text-secondary text-sm">
                      {step.description}
                    </Text>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>

        {/* Example project */}
        <div className="mb-16 bg-bg-secondary p-6 border-l-4 border-accent-primary">
          <Heading level={3} className="text-xl font-bold mb-3">
            Example Project
          </Heading>
          <Text className="text-text-secondary">
            {content.exampleProject.description}
          </Text>
        </div>

        {/* Pricing section */}
        <div className="mb-12">
          <ScrollReveal>
            <Heading
              id={`${content.id}-price`}
              level={3}
              className="text-2xl font-bold mb-6"
            >
              PRICING STARTS AT
            </Heading>
          </ScrollReveal>

          <div className="space-y-4">
            {content.pricing.map((tier, index) => (
              <div key={index} className="flex items-center">
                <div className="text-xl md:text-2xl font-bold text-accent-primary mr-3">
                  {tier.price}
                </div>
                <div className="text-lg">{tier.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <ScrollReveal>
          <Button
            id={`${content.id}-cta`}
            intent="primary"
            size="lg"
            href={content.ctaLink}
            className="mt-8"
          >
            {content.ctaText}
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default WebService;