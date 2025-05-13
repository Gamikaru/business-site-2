import React, { useState } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/core/Animations";
import { Heading } from "@/components/common/Typography";
import RichText from "@/components/common/Typography/RichText";
import { cn } from "@/utils/classNames";

interface BlogCategoriesProps {
  categoriesContent: {
    heading: string;
    items: {
      id: string;
      name: string;
      description: string;
      icon: string;
    }[];
  };
  mousePosition: { x: number; y: number };
}

const BlogCategories: React.FC<BlogCategoriesProps> = ({
  categoriesContent,
  mousePosition,
}) => {
  const [activeCategory, setActiveCategory] = useState("web-development");

  return (
    <section className="relative bg-bg-secondary py-12 md:py-16 overflow-hidden">
      {/* Technical background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-dots-dense opacity-[0.05]"></div>
        <svg className="absolute inset-0 w-full h-full">
          <motion.path
            d={`M0,${50 + mousePosition.y * 0.3} Q${50 + mousePosition.x * 0.2},${20 + mousePosition.y * 0.5},100,${70 - mousePosition.y * 0.2}`}
            stroke="var(--color-accent-oceanic)"
            strokeWidth="1"
            strokeOpacity="0.05"
            strokeDasharray="5 3"
            fill="none"
          />
        </svg>
      </div>

      <div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">
        {" "}
        <div className="mb-10">
          <ScrollReveal direction="up" delay={0.1}>
            <Heading
              level={2}
              className="text-2xl md:text-3xl font-heading text-center"
            >
              {categoriesContent.heading}
            </Heading>
          </ScrollReveal>
        </div>
        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categoriesContent.items.map((category, index) => (
            <ScrollReveal
              key={category.id}
              direction="up"
              delay={0.2 + index * 0.1}
            >
              <button
                className={cn(
                  "h-full w-full text-left transition-all duration-300 group",
                  activeCategory === category.id
                    ? "scale-[1.02]"
                    : "scale-100 opacity-80 hover:opacity-100"
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                <div
                  className={cn(
                    "h-full border rounded-lg overflow-hidden transition-colors duration-300 bg-bg-card relative",
                    activeCategory === category.id
                      ? "border-brand-primary shadow-lg"
                      : "border-divider"
                  )}
                >
                  {/* Corner indicators */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 w-3 h-3 transition-colors duration-300",
                      activeCategory === category.id
                        ? "border-t-2 border-l-2 border-brand-primary"
                        : "border-t border-l border-divider"
                    )}
                  ></div>
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-3 h-3 transition-colors duration-300",
                      activeCategory === category.id
                        ? "border-t-2 border-r-2 border-brand-primary"
                        : "border-t border-r border-divider"
                    )}
                  ></div>
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 w-3 h-3 transition-colors duration-300",
                      activeCategory === category.id
                        ? "border-b-2 border-l-2 border-brand-primary"
                        : "border-b border-l border-divider"
                    )}
                  ></div>
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 w-3 h-3 transition-colors duration-300",
                      activeCategory === category.id
                        ? "border-b-2 border-r-2 border-brand-primary"
                        : "border-b border-r border-divider"
                    )}
                  ></div>

                  <div className="p-6 h-full flex flex-col">
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-full mb-4 transition-colors duration-300",
                        activeCategory === category.id
                          ? "bg-brand-primary/10"
                          : "bg-accent-oceanic/5"
                      )}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={
                          activeCategory === category.id
                            ? "var(--color-brand-primary)"
                            : "var(--color-accent-oceanic)"
                        }
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-colors duration-300"
                      >
                        {category.icon === "code-bracket" && (
                          <>
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                          </>
                        )}
                        {category.icon === "cpu-chip" && (
                          <>
                            <rect
                              x="4"
                              y="4"
                              width="16"
                              height="16"
                              rx="2"
                              ry="2"
                            ></rect>
                            <rect x="9" y="9" width="6" height="6"></rect>
                            <line x1="9" y1="1" x2="9" y2="4"></line>
                            <line x1="15" y1="1" x2="15" y2="4"></line>
                            <line x1="9" y1="20" x2="9" y2="23"></line>
                            <line x1="15" y1="20" x2="15" y2="23"></line>
                            <line x1="20" y1="9" x2="23" y2="9"></line>
                            <line x1="20" y1="14" x2="23" y2="14"></line>
                            <line x1="1" y1="9" x2="4" y2="9"></line>
                            <line x1="1" y1="14" x2="4" y2="14"></line>
                          </>
                        )}
                        {category.icon === "chart-bar" && (
                          <>
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                          </>
                        )}
                        {category.icon === "light-bulb" && (
                          <>
                            <path d="M9 18h6"></path>
                            <path d="M10 22h4"></path>
                            <path d="M12 2v5"></path>
                            <path d="M12 8a5 5 0 1 1-4 8"></path>
                          </>
                        )}
                      </svg>
                    </div>

                    {/* Category Name */}
                    <div
                      className={cn(
                        "font-heading font-bold text-lg mb-2 transition-colors duration-300",
                        activeCategory === category.id
                          ? "text-heading"
                          : "text-heading/80"
                      )}
                    >
                      <RichText content={category.name} />
                    </div>

                    {/* Category Description */}
                    <div className="text-text-secondary text-sm flex-grow">
                      <RichText content={category.description} />
                    </div>

                    {/* Status indicator */}
                    <div className="mt-4 flex justify-end">
                      <div
                        className={cn(
                          "flex items-center space-x-1.5",
                          activeCategory === category.id
                            ? "text-brand-primary"
                            : "text-accent-oceanic/50"
                        )}
                      >
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                            activeCategory === category.id
                              ? "bg-brand-primary animate-pulse"
                              : "bg-accent-oceanic/50"
                          )}
                        ></div>
                        <span className="text-[10px] font-mono">
                          {activeCategory === category.id
                            ? "ACTIVE"
                            : "STANDBY"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogCategories;
