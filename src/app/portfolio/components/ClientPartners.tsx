// "use client";

// import React, { useRef } from "react";
// import { motion, useInView } from "framer-motion";
// import { ScrollReveal } from "@/components/core/Animations";
// import { Heading, Text } from "@/components/common/Typography";
// import RichText from "@/components/common/Typography/RichText";
// import { cn } from "@/utils/classNames";

// interface Testimonial {
//   quote: string;
//   author: string;
//   role: string;
// }

// interface ClientPartnersProps {
//   industries: string[];
//   testimonial: Testimonial;
//   className?: string;
// }

// const ClientPartners: React.FC<ClientPartnersProps> = ({
//   industries,
//   testimonial,
//   className,
// }) => {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const isInView = useInView(sectionRef, { once: false, margin: "-10% 0px" });

//   return (
//     <section
//       ref={sectionRef}
//       className={cn("py-16 md:py-32 bg-bg-secondary relative", className)}
//     >
//       {/* Background pattern */}
//       <div className="absolute inset-0 bg-dots-dense opacity-[0.05] pointer-events-none"></div>

//       <div className="container mx-auto px-4 md:px-8 relative z-10">
//         <ScrollReveal direction="up" delay={0.2}>
//           <Heading
//             level={2}
//             className="text-3xl md:text-4xl font-heading font-bold text-heading text-center mb-16"
//           >
//             Working with clients across industries
//           </Heading>
//         </ScrollReveal>

//         {/* Industry grid with technical styling */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
//           {industries.map((industry, index) => (
//             <motion.div
//               key={industry}
//               className="bg-bg-glass backdrop-blur-sm p-4 rounded-lg border border-divider flex items-center justify-center text-center"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
//               transition={{ duration: 0.5, delay: 0.1 * index }}
//             >
//               <Text className="text-sm font-medium">{industry}</Text>
//             </motion.div>
//           ))}
//         </div>

//         {/* Technical connection lines */}
//         <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <motion.path
//               key={`line-${i}`}
//               d={`M ${20 + i * 15}% ${20 + i * 10}% C ${40 + i * 5}% ${30 + i * 5}%, ${60 - i * 5}% ${70 - i * 5}%, ${80 - i * 15}% ${80 - i * 10}%`}
//               stroke="var(--color-accent-oceanic)"
//               strokeWidth="1"
//               strokeOpacity="0.2"
//               strokeDasharray="4 2"
//               fill="none"
//               initial={{ pathLength: 0 }}
//               animate={{ pathLength: isInView ? 1 : 0 }}
//               transition={{ duration: 1, delay: 0.2 * i }}
//             />
//           ))}
//         </svg>

//         {/* Testimonial with technical frame */}
//         <div className="max-w-3xl mx-auto relative">
//           <motion.div
//             className="p-8 bg-bg-glass backdrop-blur-sm rounded-lg border border-accent-primary/30"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
//             transition={{ duration: 0.6, delay: 0.8 }}
//           >
//             {/* Quote */}
//             <div className="mb-6 text-xl italic text-text-primary">
//               <RichText content={testimonial.quote} />
//             </div>

//             {/* Author */}
//             <div className="flex items-center justify-end">
//               <div className="text-right">
//                 <Text weight="bold" className="text-brand-primary">
//                   {testimonial.author}
//                 </Text>
//                 <Text size="sm" className="text-text-secondary">
//                   {testimonial.role}
//                 </Text>
//               </div>
//             </div>

//             {/* Technical corner details */}
//             <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-primary transform -translate-x-1 -translate-y-1"></div>
//             <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-primary transform translate-x-1 -translate-y-1"></div>
//             <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-primary transform -translate-x-1 translate-y-1"></div>
//             <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-primary transform translate-x-1 translate-y-1"></div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ClientPartners;
