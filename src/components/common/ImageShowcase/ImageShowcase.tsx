// src/components/sections/ImageShowcase/ImageShowcase.tsx
"use client";

import React from "react";
import ImagePlaceholder from "../../core/ImagePlaceholder";
import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "../../core/Animations";

interface ImageShowcaseProps {
  className?: string;
  title?: string;
}

const ImageShowcase: React.FC<ImageShowcaseProps> = ({
  className = "",
  title = "Image Gallery",
}) => {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-5 md:px-8">
        <h2 className="text-3xl md:text-4xl font-serif mb-10 text-center">
          {title}
        </h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Square placeholder with hover effect */}
          <motion.div variants={staggerItemVariants} custom={0}>
            <ImagePlaceholder
              alt="Portrait image"
              aspectRatio="1/1"
              rounded="md"
              hoverEffect
              className="shadow-md"
              placeholderText="Portrait Photo"
            />
          </motion.div>

          {/* Landscape placeholder */}
          <motion.div variants={staggerItemVariants} custom={1}>
            <ImagePlaceholder
              alt="Landscape image"
              aspectRatio="16/9"
              rounded="md"
              className="shadow-md"
              placeholderText="Landscape Photo"
            />
          </motion.div>

          {/* Vertical placeholder */}
          <motion.div variants={staggerItemVariants} custom={2}>
            <ImagePlaceholder
              alt="Vertical image"
              aspectRatio="9/16"
              rounded="md"
              className="shadow-md"
              placeholderText="Vertical Photo"
            />
          </motion.div>

          {/* Custom dimensions */}
          <motion.div variants={staggerItemVariants} custom={3}>
            <ImagePlaceholder
              alt="Custom dimensions"
              width={350}
              height={200}
              rounded="lg"
              className="shadow-md"
              placeholderText="Custom Size (350×200)"
            />
          </motion.div>

          {/* Circle placeholder */}
          <motion.div
            variants={staggerItemVariants}
            custom={4}
            className="flex justify-center"
          >
            <ImagePlaceholder
              alt="Profile picture"
              width={200}
              height={200}
              rounded="full"
              className="shadow-md"
              placeholderText="Profile Photo"
            />
          </motion.div>

          {/* Brand image placeholder */}
          <motion.div variants={staggerItemVariants} custom={5}>
            <ImagePlaceholder
              alt="Brand image"
              aspectRatio="3/2"
              rounded="md"
              className="shadow-md"
              placeholderText="Brand Image"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImageShowcase;
