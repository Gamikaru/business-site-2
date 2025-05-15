// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { motion, useInView, useScroll, useTransform } from "framer-motion";
// import Image from "next/image";
// import { Button } from "@/components/common/Button";
// import { Heading, Text } from "@/components/common/Typography";
// import { ScrollReveal, useAnimationPreferences } from "@/components/core/Animations";
// import { BlueprintCorner } from "@/components/common/VisualInterest/BlueprintCorner";
// import { TickStrip } from "@/components/common/Divider";
// import RichText from "@/components/common/Typography/RichText";
// import Icon from "@/components/common/Icons/Icon";
// import { cn } from "@/utils/classNames";

// interface Project {
//   id: string;
//   title: string;
//   shortDescription: string;
//   longDescription: string;
//   results: string[];
//   techStack: string[];
//   categories: string[];
//   imageSrc: string;
//   imageAlt: string;
//   ctaText: string;
//   ctaLink: string;
//   featured?: boolean;
// }

// interface FeaturedProjectCardProps {
//   project: Project;
//   className?: string;
// }

// const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({
//   project,
//   className,
// }) => {
//   const { shouldAnimate } = useAnimationPreferences();
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const imageRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);
//   const isInView = useInView(sectionRef, { once: false, margin: "-10% 0px" });
//   const isImageInView = useInView(imageRef, { once: true, amount: 0.3 });

//   // State for interactive elements
//   const [hoverPoint, setHoverPoint] = useState({ x: 0.5, y: 0.5 });
//   const [measurementPoint, setMeasurementPoint] = useState({ x: 50, y: 50 });
//   const [isHoveringImage, setIsHoveringImage] = useState(false);
//   const [activeTechIndex, setActiveTechIndex] = useState<number | null>(null);
//   const [hoveredResultIndex, setHoveredResultIndex] = useState<number | null>(null);
//   const [glitchActive, setGlitchActive] = useState(false);
//   const [projectMetrics] = useState({
//     complexity: Math.floor(Math.random() * 100),
//     development: Math.floor(Math.random() * 100),
//     innovation: Math.floor(Math.random() * 100),
//     performanceScore: Math.floor(Math.random() * 50) + 50,
//   });

//   // Generate unique ID for SVG filters
//   const [uniqueId] = useState(`project-${project.id}-${Math.floor(Math.random() * 1000)}`);

//   // Scroll animations
//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["start end", "end start"],
//   });

//   const contentOpacity = useTransform(
//     scrollYProgress,
//     [0, 0.2, 0.8, 1],
//     [0.6, 1, 1, 0.6]
//   );

//   const parallaxY = useTransform(
//     scrollYProgress,
//     [0, 1],
//     ["0%", "15%"]
//   );

//   const imageScale = useTransform(
//     scrollYProgress,
//     [0, 0.5, 1],
//     [1, 1.05, 1]
//   );

//   // Handle mouse move for interactive elements
//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!sectionRef.current || !shouldAnimate()) return;

//     const rect = sectionRef.current.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / rect.width;
//     const y = (e.clientY - rect.top) / rect.height;

//     setHoverPoint({ x, y });
//     setMeasurementPoint({
//       x: Math.round(x * 100),
//       y: Math.round(y * 100)
//     });
//   };

//   // Handle image hover state
//   const handleImageHover = (hovering: boolean) => {
//     setIsHoveringImage(hovering);
//   };

//   // Periodic glitch effect for neobrutalist touch
//   useEffect(() => {
//     if (!shouldAnimate() || !isInView) return;

//     const glitchInterval = setInterval(() => {
//       if (Math.random() > 0.7) {
//         setGlitchActive(true);
//         setTimeout(() => setGlitchActive(false), 200);
//       }
//     }, 4000);

//     return () => clearInterval(glitchInterval);
//   }, [shouldAnimate, isInView]);

//   // Periodically change active tech
//   useEffect(() => {
//     if (!shouldAnimate() || !isInView) return;

//     const interval = setInterval(() => {
//       const newIndex = Math.floor(Math.random() * project.techStack.length);
//       setActiveTechIndex(newIndex);

//       setTimeout(() => {
//         setActiveTechIndex(null);
//       }, 2000);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [project.techStack.length, shouldAnimate, isInView]);

//   return (
//     <section
//       ref={sectionRef}
//       className={cn(
//         "py-20 md:py-32 relative overflow-hidden",
//         "bg-bg-secondary border-y-8 border-accent-primary",
//         className
//       )}
//       onMouseMove={handleMouseMove}
//     >
//       {/* SVG Defs for filters and gradients */}
//       <svg width="0" height="0" className="absolute">
//         <defs>
//           {/* Highlight glow filter for active elements */}
//           <filter id={`${uniqueId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
//             <feGaussianBlur stdDeviation="8" result="blur" />
//             <feComposite in="SourceGraphic" in2="blur" operator="over" />
//           </filter>

//           {/* Neobrutalist glitch effect */}
//           <filter id={`${uniqueId}-glitch`}>
//             <feColorMatrix
//               type="matrix"
//               values="1 0 0 0 0
//                       0 1 0 0 0
//                       0 0 1 0 0
//                       0 0 0 1 0"
//               result="original"
//             />
//             <feOffset dx="-3" dy="0" result="offsetRed" />
//             <feColorMatrix
//               in="offsetRed"
//               type="matrix"
//               values="1 0 0 0 0
//                       0 0 0 0 0
//                       0 0 0 0 0
//                       0 0 0 1 0"
//               result="red"
//             />
//             <feOffset dx="3" dy="0" result="offsetBlue" />
//             <feColorMatrix
//               in="offsetBlue"
//               type="matrix"
//               values="0 0 0 0 0
//                       0 0 0 0 0
//                       0 0 1 0 0
//                       0 0 0 1 0"
//               result="blue"
//             />
//             <feBlend mode="screen" in="red" in2="blue" result="blend" />
//           </filter>

//           {/* Data flow gradient */}
//           <linearGradient id={`${uniqueId}-data-flow`} x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
//             <stop offset="50%" stopColor="var(--color-accent-oceanic)" stopOpacity="0.9" />
//             <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
//           </linearGradient>
//         </defs>
//       </svg>

//       {/* Technical backgrounds */}
//       <motion.div
//         className="absolute inset-0 bg-blueprint-grid opacity-[0.08] pointer-events-none"
//         style={{ y: parallaxY }}
//       />

//       {/* Brutalist grid overlay */}
//       <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none" />

//       {/* Left edge technical bar - neobrutalist vertical element */}
//       <div className="absolute left-0 top-0 bottom-0 w-4 bg-accent-primary/20" />

//       {/* Top technical elements */}
//       <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-8">
//         <motion.div
//           className="flex items-center gap-2"
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//         >
//           <div className="h-3 w-3 rounded-none bg-accent-primary animate-pulse" />
//           <span className="text-xs font-mono text-accent-primary uppercase font-bold tracking-wider">
//             Project.Details
//           </span>
//         </motion.div>

//         <motion.div
//           className="flex items-center gap-4 text-xs font-mono text-accent-cosmic bg-bg-glass px-3 py-1 border-l-4 border-accent-cosmic"
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 20 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           style={{ filter: glitchActive ? `url(#${uniqueId}-glitch)` : 'none' }}
//         >
//           <span>ID_PROJECT_{project.id}</span>
//           <span className="px-1 bg-accent-cosmic/20">SCORE:{projectMetrics.performanceScore}</span>
//         </motion.div>
//       </div>

//       <div className="container mx-auto px-4 md:px-8 relative z-10 mt-10">
//         {/* PROJECT HEADING - Neobrutalist oversized text */}
//         <motion.div
//           className="mb-16 relative"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="font-heading font-extrabold text-5xl md:text-7xl text-heading uppercase tracking-tight relative z-10 text-center">
//             FEATURED
//             <span className="text-accent-primary"> PROJECT</span>
//           </h2>
//           <div className="absolute -bottom-3 left-0 right-0 h-2 bg-accent-primary opacity-70 transform -skew-x-12"></div>
//           <div className="absolute -right-4 top-0 bottom-0 w-2 bg-accent-primary opacity-50 transform skew-y-12"></div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
//           {/* Left column - Project image (spans 7 columns on desktop) */}
//           <div className="lg:col-span-7 relative order-2 lg:order-1">
//             <motion.div
//               ref={imageRef}
//               className="relative overflow-hidden border-4 border-heading"
//               style={{
//                 opacity: contentOpacity,
//                 scale: imageScale,
//               }}
//               onMouseEnter={() => handleImageHover(true)}
//               onMouseLeave={() => handleImageHover(false)}
//             >
//               {/* Neobrutalist frame accents */}
//               <div className="absolute top-0 left-0 w-16 h-16 border-r-4 border-b-4 border-accent-primary z-20" />
//               <div className="absolute bottom-0 right-0 w-16 h-16 border-l-4 border-t-4 border-accent-primary z-20" />

//               {/* Blueprint measurement markers */}
//               <div className="absolute top-0 left-0 right-0 z-20">
//                 <TickStrip height={24} segments={11} labelEvery={5} showCoordinateLines={false} />
//               </div>

//               {/* Right side measurement - brutalist style */}
//               <div className="absolute top-0 bottom-0 right-0 w-12 flex flex-col justify-between items-end py-8 pr-2 z-20">
//                 <span className="text-xs font-mono text-accent-primary font-bold bg-bg-glass px-2">100%</span>
//                 <div className="h-full w-2 bg-accent-primary/20 mx-auto my-2"></div>
//                 <span className="text-xs font-mono text-accent-primary font-bold bg-bg-glass px-2">0%</span>
//               </div>

//               {/* Main image */}
//               <motion.div
//                 initial={{ filter: 'grayscale(100%)' }}
//                 animate={{
//                   filter: isImageInView
//                     ? isHoveringImage ? 'grayscale(0%)' : 'grayscale(30%)'
//                     : 'grayscale(100%)'
//                 }}
//                 transition={{ duration: 0.8 }}
//               >
//                 <Image
//                   src={project.imageSrc}
//                   alt={project.imageAlt}
//                   width={900}
//                   height={600}
//                   className="w-full h-auto object-cover"
//                   priority
//                 />
//               </motion.div>

//               {/* Interactive overlay - more pronounced for neobrutalist style */}
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-b from-transparent to-heading/60 pointer-events-none"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: isImageInView ? 0.8 : 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 {/* Technical measurement lines and intersection points */}
//                 <svg className="absolute inset-0 w-full h-full">
//                   {/* Main focus point */}
//                   <motion.circle
//                     cx={`${hoverPoint.x * 100}%`}
//                     cy={`${hoverPoint.y * 100}%`}
//                     r={6}
//                     fill="var(--color-accent-primary)"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: isHoveringImage ? 0.9 : 0 }}
//                     transition={{ duration: 0.2 }}
//                   />

//                   {/* Horizontal trace line - thicker for neobrutalist style */}
//                   <motion.line
//                     x1="0%"
//                     y1={`${hoverPoint.y * 100}%`}
//                     x2="100%"
//                     y2={`${hoverPoint.y * 100}%`}
//                     stroke="var(--color-accent-primary)"
//                     strokeWidth={3}
//                     strokeDasharray="8 4"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: isHoveringImage ? 0.8 : 0 }}
//                   />

//                   {/* Vertical trace line - thicker for neobrutalist style */}
//                   <motion.line
//                     x1={`${hoverPoint.x * 100}%`}
//                     y1="0%"
//                     x2={`${hoverPoint.x * 100}%`}
//                     y2="100%"
//                     stroke="var(--color-accent-primary)"
//                     strokeWidth={3}
//                     strokeDasharray="8 4"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: isHoveringImage ? 0.8 : 0 }}
//                   />

//                   {/* Coordinates text - larger for neobrutalist style */}
//                   <motion.text
//                     x={`${hoverPoint.x * 100}%`}
//                     y={`${hoverPoint.y * 100}%`}
//                     dx="15"
//                     dy="-15"
//                     fill="var(--color-accent-primary)"
//                     fontSize="14"
//                     fontFamily="monospace"
//                     fontWeight="bold"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: isHoveringImage ? 1 : 0 }}
//                   >
//                     {measurementPoint.x},{measurementPoint.y}
//                   </motion.text>
//                 </svg>
//               </motion.div>

//               {/* Technical corner elements */}
//               <div className="absolute top-12 left-12 text-accent-primary z-20 transform rotate-12">
//                 <BlueprintCorner size={28} />
//               </div>
//               <div className="absolute bottom-12 right-12 rotate-180 text-accent-primary z-20 transform -rotate-12">
//                 <BlueprintCorner size={28} />
//               </div>
//             </motion.div>

//             {/* Technical frame - exaggerated for neobrutalist style */}
//             <motion.div
//               className="absolute -inset-6 border-4 border-dashed border-accent-primary/70 z-0 pointer-events-none"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: isInView ? 0.8 : 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//             />

//             {/* Image metadata display - bold neobrutalist style */}
//             <motion.div
//               className="absolute -bottom-10 left-0 flex items-center gap-4 text-xs font-mono font-bold bg-bg-glass py-2 px-4 border-b-4 border-accent-primary"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
//               transition={{ duration: 0.5, delay: 0.6 }}
//             >
//               <span className="text-accent-primary uppercase">SCREEN CAPTURE</span>
//               <span className="text-accent-cosmic bg-bg-tertiary px-2">{isHoveringImage ? 'ACTIVE' : 'IDLE'}</span>
//             </motion.div>
//           </div>

//           {/* Right column - Project details (spans 5 columns on desktop) */}
//           <div
//             ref={contentRef}
//             className="lg:col-span-5 relative order-1 lg:order-2"
//           >
//             <ScrollReveal direction="up" delay={0.3}>
//               <div className="relative">
//                 {/* Neobrutalist header bar */}
//                 <motion.div
//                   className="h-4 w-full bg-accent-primary mb-8"
//                   initial={{ scaleX: 0 }}
//                   animate={{ scaleX: isInView ? 1 : 0 }}
//                   transition={{ duration: 0.7 }}
//                   style={{ transformOrigin: 'left' }}
//                 />

//                 {/* Project number with technical element - exaggerated for neobrutalist style */}
//                 <div className="flex items-center gap-2 mb-6">
//                   <motion.div
//                     className="relative flex items-center h-12 bg-heading text-white px-4 py-1 -skew-x-12 transform"
//                     initial={{ x: -20, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.2 }}
//                   >
//                     <span className="text-xl font-mono font-bold tracking-wider">
//                       PROJECT.01
//                     </span>
//                     <motion.div
//                       className="absolute -top-2 -right-2 h-4 w-4 rounded-none bg-accent-primary"
//                       animate={{
//                         opacity: [0.4, 1, 0.4],
//                       }}
//                       transition={{
//                         duration: 2,
//                         repeat: Infinity,
//                         repeatType: "reverse"
//                       }}
//                     />
//                   </motion.div>
//                   <motion.div
//                     className="h-1.5 flex-1 bg-heading"
//                     initial={{ scaleX: 0 }}
//                     animate={{ scaleX: 1 }}
//                     transition={{ duration: 0.5, delay: 0.4 }}
//                     style={{ transformOrigin: 'left' }}
//                   />
//                 </div>

//                 {/* Title with animated reveal - oversized neobrutalist style */}
//                 <div className="overflow-hidden mb-8 relative">
//                   <motion.div
//                     initial={{ y: 80 }}
//                     animate={{ y: 0 }}
//                     transition={{ duration: 0.6, delay: 0.3 }}
//                   >
//                     <Heading
//                       level={3}
//                       className="text-4xl md:text-5xl font-heading font-extrabold text-heading leading-tight tracking-tight"
//                     >
//                       <RichText content={project.title} />
//                     </Heading>
//                   </motion.div>
//                   {/* Neobrutalist accent line */}
//                   <div className="absolute -right-4 top-2 bottom-2 w-2 bg-accent-primary transform skew-y-12"></div>
//                 </div>

//                 {/* Description - editorial style with neobrutalist accents */}
//                 <motion.div
//                   className="mb-8 text-text-primary bg-bg-glass p-6 border-l-4 border-heading"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.5, delay: 0.5 }}
//                 >
//                   <RichText content={project.longDescription} />
//                 </motion.div>

//                 {/* Technical metrics visualization - bold neobrutalist style */}
//                 <motion.div
//                   className="mb-10 px-6 py-5 bg-bg-card border-4 border-heading"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.6 }}
//                 >
//                   <div className="text-sm font-mono text-accent-primary mb-3 uppercase font-bold tracking-wider flex items-center">
//                     <div className="w-3 h-3 bg-accent-primary mr-2"></div>
//                     Performance Metrics
//                   </div>

//                   {/* Metrics grid - enhanced for neobrutalist style */}
//                   <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//                     {/* Complexity metric */}
//                     <div>
//                       <div className="flex justify-between text-sm mb-1">
//                         <span className="font-mono text-heading font-bold">Complexity</span>
//                         <span className="font-mono text-accent-primary font-bold">{projectMetrics.complexity}%</span>
//                       </div>
//                       <div className="h-3 bg-bg-tertiary relative">
//                         <motion.div
//                           className="h-full bg-accent-primary"
//                           initial={{ width: '0%' }}
//                           animate={{ width: `${projectMetrics.complexity}%` }}
//                           transition={{ duration: 0.8, delay: 0.7 }}
//                         />
//                         <div className="absolute top-0 bottom-0 right-1/4 w-0.5 h-full bg-bg-glass"></div>
//                         <div className="absolute top-0 bottom-0 right-1/2 w-0.5 h-full bg-bg-glass"></div>
//                         <div className="absolute top-0 bottom-0 right-3/4 w-0.5 h-full bg-bg-glass"></div>
//                       </div>
//                     </div>

//                     {/* Development metric */}
//                     <div>
//                       <div className="flex justify-between text-sm mb-1">
//                         <span className="font-mono text-heading font-bold">Development</span>
//                         <span className="font-mono text-accent-oceanic font-bold">{projectMetrics.development}%</span>
//                       </div>
//                       <div className="h-3 bg-bg-tertiary relative">
//                         <motion.div
//                           className="h-full bg-accent-oceanic"
//                           initial={{ width: '0%' }}
//                           animate={{ width: `${projectMetrics.development}%` }}
//                           transition={{ duration: 0.8, delay: 0.8 }}
//                         />
//                         <div className="absolute top-0 bottom-0 right-1/4 w-0.5 h-full bg-bg-glass"></div>
//                         <div className="absolute top-0 bottom-0 right-1/2 w-0.5 h-full bg-bg-glass"></div>
//                         <div className="absolute top-0 bottom-0 right-3/4 w-0.5 h-full bg-bg-glass"></div>
//                       </div>
//                     </div>

//                     {/* Innovation metric */}
//                     <div>
//                       <div className="flex justify-between text-sm mb-1">
//                         <span className="font-mono text-heading font-bold">Innovation</span>
//                         <span className="font-mono text-accent-cosmic font-bold">{projectMetrics.innovation}%</span>
//                       </div>
//                       <div className="h-3 bg-bg-tertiary relative">
//                         <motion.div
//                           className="h-full bg-accent-cosmic"
//                           initial={{ width: '0%' }}
//                           animate={{ width: `${projectMetrics.innovation}%` }}
//                           transition={{ duration: 0.8, delay: 0.9 }}
//                         />
//                         <div className="absolute top-0 bottom-0 right-1/4 w-0.5 h-full bg-bg-glass"></div>
//                         <div className="absolute top-0 bottom-0 right-1/2 w-0.5 h-full bg-bg-glass"></div>
//                         <div className="absolute top-0 bottom-0 right-3/4 w-0.5 h-full bg-bg-glass"></div>
//                       </div>
//                     </div>

//                     {/* Performance score */}
//                     <div>
//                       <div className="flex justify-between text-sm mb-1">
//                         <span className="font-mono text-heading font-bold">Performance</span>
//                         <span className="font-mono text-accent-warm font-bold">{projectMetrics.performanceScore}%</span>
//                       </div>
//                       <div className="h-3 bg-bg-tertiary relative">
//                         <motion.div
//                           className="h-full bg-accent-warm"
//                           initial={{ width: '0%' }}
//                           animate={{ width: `${projectMetrics.performanceScore}%` }}
//                           transition={{ duration: 0.8, delay: 1 }}
//                         />
//                         <div className="absolute top-0 bottom-0 right-1/4 w-0.5 h-full bg-bg-glass"></div>
//                         <div className="absolute top-0 bottom-0 right-1/2 w-0.5 h-full bg-bg-glass"></div>
//                         <div className="absolute top-0 bottom-0 right-3/4 w-0.5 h-full bg-bg-glass"></div>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Tech stack - modernist grid layout */}
//                 <motion.div
//                   className="mb-10"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.7 }}
//                 >
//                   <div className="flex items-center gap-2 mb-3">
//                     <div className="w-4 h-4 bg-heading"></div>
//                     <Text className="font-bold text-base text-heading uppercase tracking-wider">
//                       Technologies Used
//                     </Text>
//                   </div>
//                   <div className="flex flex-wrap gap-3">
//                     {project.techStack.map((tech, index) => (
//                       <motion.span
//                         key={tech}
//                         className={cn(
//                           "px-4 py-2 text-sm font-mono font-bold rounded-none border-2 transition-colors",
//                           activeTechIndex === index
//                             ? "bg-heading text-white border-heading shadow-lg"
//                             : "bg-bg-glass backdrop-blur-sm text-heading border-heading/50"
//                         )}
//                         whileHover={{ scale: 1.05, y: -3 }}
//                         animate={activeTechIndex === index ? {
//                           boxShadow: ["0 0 0 rgba(var(--color-heading-rgb), 0)", "0 0 20px rgba(var(--color-heading-rgb), 0.5)"],
//                         } : {}}
//                         transition={{ duration: 0.3 }}
//                       >
//                         {tech}
//                       </motion.span>
//                     ))}
//                   </div>
//                 </motion.div>

//                 {/* Results with interactive highlights - brutalist style */}
//                 <motion.div
//                   className="mb-10 bg-bg-glass"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.8 }}
//                 >
//                   <div className="bg-heading text-white px-4 py-2 flex items-center gap-2 mb-3">
//                     <Text className="font-bold text-base uppercase tracking-wider">
//                       Project Results
//                     </Text>
//                     <div className="h-px flex-1 bg-white/30"></div>
//                   </div>
//                   <ul className="space-y-0 text-text-primary border-2 border-heading">
//                     {project.results.map((result, index) => (
//                       <motion.li
//                         key={result}
//                         className={cn(
//                           "flex items-start gap-3 p-4 transition-colors border-b-2 border-heading/20 last:border-0",
//                           hoveredResultIndex === index
//                             ? "bg-bg-hover"
//                             : "hover:bg-bg-hover"
//                         )}
//                         onMouseEnter={() => setHoveredResultIndex(index)}
//                         onMouseLeave={() => setHoveredResultIndex(null)}
//                       >
//                         <span className="text-accent-primary mt-1 text-xl">
//                           <Icon name="fi-check-circle" size={20} />
//                         </span>
//                         <div className="flex-1 font-medium text-lg">
//                           <RichText content={result} />
//                         </div>
//                       </motion.li>
//                     ))}
//                   </ul>
//                 </motion.div>

//                 {/* CTA Button with neobrutalist style */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.9 }}
//                   className="relative"
//                 >
//                   <div className="absolute -inset-1 bg-heading transform rotate-1"></div>
//                   <Button
//                     intent="primary"
//                     size="lg"
//                     href={project.ctaLink}
//                     animate={true}
//                     iconPosition="right"
//                     className="relative z-10 bg-accent-primary text-white px-8 py-4 font-bold text-lg uppercase tracking-wider hover:translate-x-1 hover:-translate-y-1 transition-transform"
//                     icon={<Icon name="fi-arrow-right" size={20} />}
//                   >
//                     {project.ctaText}
//                   </Button>
//                 </motion.div>
//               </div>
//             </ScrollReveal>
//           </div>
//         </div>
//       </div>

//       {/* Bottom technical element - exaggerated for neobrutalist style */}
//       <motion.div
//         className="absolute bottom-0 left-0 right-0 h-4 bg-heading"
//         initial={{ scaleX: 0 }}
//         animate={{ scaleX: isInView ? 1 : 0 }}
//         transition={{ duration: 1, delay: 1 }}
//         style={{ transformOrigin: 'left' }}
//       />

//       {/* Brutalist corner accent */}
//       <div className="absolute bottom-8 right-8 w-20 h-20 border-8 border-accent-primary/50 transform rotate-12"></div>
//     </section>
//   );
// };

// export default FeaturedProjectCard;