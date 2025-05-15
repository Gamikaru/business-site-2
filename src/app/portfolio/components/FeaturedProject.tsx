"use client";

import React from "react";
import FeaturedProjectCard from "./FeaturedProjectCard";

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  results: string[];
  techStack: string[];
  categories: string[];
  imageSrc: string;
  imageAlt: string;
  ctaText: string;
  ctaLink: string;
}

interface FeaturedProjectProps {
  project: Project;
  className?: string;
}

const FeaturedProject: React.FC<FeaturedProjectProps> = ({ project, className }) => {
  return <FeaturedProjectCard project={project} className={className} />;
};

export default FeaturedProject;
