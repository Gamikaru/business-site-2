"use client";

import React, { useState } from "react";
import ServicesHero from "./ServicesHero/ServicesHero";
import ServiceNavigator, { ServiceItem } from "./ServiceNavigator";
import ServiceDetail from "./ServiceDetail/ServiceDetail";
import WorkingProcess from "./WorkingProcess";
import CallToAction from "./CallToAction";
import servicesContent from "./content";

export default function ServicesPage() {
  // Set up state for active service
  const [activeServiceId, setActiveServiceId] = useState(servicesContent.services[0].id);

  // Get the active service data
  const activeService = servicesContent.services.find(service => service.id === activeServiceId) || servicesContent.services[0];

  // Create service items for navigator
  const serviceItems: ServiceItem[] = servicesContent.services.map(service => ({
    id: service.id,
    name: service.name,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {service.id === "ai-automation" ? (
          // AI icon
          <><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path><path d="M7 17l.72 1.45a3 3 0 0 0 5.56 0L14 17"></path><path d="M7 17h10"></path></>
        ) : service.id === "web-development" ? (
          // Web icon
          <><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></>
        ) : service.id === "system-optimization" ? (
          // Optimization icon
          <><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></>
        ) : service.id === "tech-consulting" ? (
          // Consulting icon
          <><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></>
        ) : (
          // Mobile icon
          <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></>
        )}
      </svg>
    )
  }));

  return (
    <main className="bg-bg-primary">
      {/* Hero Section */}
      <ServicesHero
        headline={servicesContent.overview.headline}
        introduction={servicesContent.overview.introduction}
        imageSrc={servicesContent.overview.imageSrc}
        imageAlt={servicesContent.overview.imageAlt}
      />

      {/* Services Navigator */}
      <ServiceNavigator
        services={serviceItems}
        activeServiceId={activeServiceId}
        onServiceChange={setActiveServiceId}
        className="sticky top-0 z-20"
      />

      {/* Service Detail */}
      <ServiceDetail
        id={activeService.id}
        headline={activeService.headline}
        introduction={activeService.introduction}
        imageSrc={activeService.imageSrc}
        imageDarkSrc={activeService.imageDarkSrc}
        benefits={activeService.benefits}
        process={activeService.process}
        example={activeService.example}
        pricing={activeService.pricing}
        ctaText={activeService.ctaText}
        ctaLink={activeService.ctaLink}
      />

      {/* Working Process */}
      <WorkingProcess
        heading={servicesContent.workingProcess.heading}
        introduction={servicesContent.workingProcess.introduction}
        steps={servicesContent.workingProcess.steps}
        principles={servicesContent.workingProcess.principles}
      />

      {/* Call to Action */}
      <CallToAction
        heading={servicesContent.callToAction.heading}
        content={servicesContent.callToAction.content}
        primaryCTA={servicesContent.callToAction.primaryCTA}
        secondaryCTA={servicesContent.callToAction.secondaryCTA}
        availabilityNote={servicesContent.callToAction.availabilityNote}
      />
    </main>
  );
}