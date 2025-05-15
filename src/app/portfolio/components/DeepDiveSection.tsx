// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import { ScrollReveal, AnimatedPath, useAnimationPreferences } from "@/components/core/Animations";
// import { Heading, Text } from "@/components/common/Typography";
// import { BlueprintCorner } from "@/components/common/VisualInterest/BlueprintCorner";
// import { TickStrip } from "@/components/common/Divider";
// import Icon from "@/components/common/Icons/Icon";
// import { cn } from "@/utils/classNames";

// interface Project {
//   id: string;
//   title: string;
//   longDescription: string;
//   techStack: string[];
//   imageSrc: string;
//   imageAlt: string;
// }

// interface DeepDiveSectionProps {
//   project: Project;
//   className?: string;
// }

// // Technical Chart component for Results tab
// const TechnicalChart: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
//   const [dataPoints] = useState(() => {
//     // Generate realistic-looking data for charts
//     const generateData = (baseValue: number, volatility: number, uptrend: number) => {
//       return Array.from({ length: 12 }, (_, i) => {
//         return baseValue +
//           (Math.sin(i * 0.5) * volatility) +
//           (Math.random() * volatility * 0.5) +
//           (i * uptrend);
//       });
//     };

//     return {
//       engagement: generateData(70, 10, 2),
//       performance: generateData(50, 15, 3),
//       satisfaction: generateData(85, 5, 1)
//     };
//   });

//   // Calculate paths for the chart lines
//   const getLinePath = (data: number[], maxValue: number) => {
//     const width = 300;
//     const height = 150;
//     const pointSpacing = width / (data.length - 1);

//     return data.map((value, index) => {
//       const x = index * pointSpacing;
//       const y = height - (value / maxValue * height);
//       return `${index === 0 ? 'M' : 'L'}${x},${y}`;
//     }).join(' ');
//   };

//   const engagementPath = getLinePath(dataPoints.engagement, 100);
//   const performancePath = getLinePath(dataPoints.performance, 100);
//   const satisfactionPath = getLinePath(dataPoints.satisfaction, 100);

//   return (
//     <div className="relative h-[250px] bg-bg-tertiary/20 rounded-lg p-4 mb-6">
//       <div className="absolute top-2 left-3 text-xs font-mono text-accent-cosmic/70">
//         METRICS.VISUALIZATION
//       </div>

//       {/* Grid lines */}
//       <svg width="100%" height="100%" className="absolute inset-0">
//         {/* Horizontal grid lines */}
//         {[0, 25, 50, 75, 100].map((percent) => (
//           <g key={`grid-${percent}`}>
//             <line
//               x1="0"
//               y1={`${100 - percent}%`}
//               x2="100%"
//               y2={`${100 - percent}%`}
//               stroke="var(--color-divider)"
//               strokeWidth="1"
//               strokeDasharray="4,4"
//             />
//             <text
//               x="5"
//               y={`${100 - percent}%`}
//               dy="-5"
//               fontSize="8"
//               fill="var(--color-text-tertiary)"
//               fontFamily="monospace"
//             >
//               {percent}%
//             </text>
//           </g>
//         ))}

//         {/* Vertical grid lines - months */}
//         {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, i) => (
//           <g key={`month-${i}`}>
//             <line
//               x1={`${(i / 11) * 100}%`}
//               y1="0"
//               x2={`${(i / 11) * 100}%`}
//               y2="100%"
//               stroke="var(--color-divider)"
//               strokeWidth="1"
//               strokeDasharray="2,6"
//             />
//             <text
//               x={`${(i / 11) * 100}%`}
//               y="100%"
//               dy="12"
//               fontSize="8"
//               fill="var(--color-text-tertiary)"
//               fontFamily="monospace"
//               textAnchor="middle"
//             >
//               {month}
//             </text>
//           </g>
//         ))}
//       </svg>

//       {/* Chart data */}
//       <svg width="100%" height="100%" className="relative">
//         {/* Lines */}
//         <AnimatedPath
//           d={engagementPath}
//           stroke="var(--color-accent-primary)"
//           strokeWidth={2.5}
//           fill="none"
//           animate={isVisible}
//         />
//         <AnimatedPath
//           d={performancePath}
//           stroke="var(--color-accent-oceanic)"
//           strokeWidth={2.5}
//           fill="none"
//           delay={0.3}
//           animate={isVisible}
//         />
//         <AnimatedPath
//           d={satisfactionPath}
//           stroke="var(--color-accent-cosmic)"
//           strokeWidth={2.5}
//           fill="none"
//           delay={0.6}
//           animate={isVisible}
//         />

//         {/* Area fills under the lines */}
//         <AnimatedPath
//           d={`${engagementPath} L300,150 L0,150 Z`}
//           fill="var(--color-accent-primary)"
//           fillOpacity={0.08}
//           stroke="none"
//           delay={0.2}
//           animate={isVisible}
//         />
//         <AnimatedPath
//           d={`${performancePath} L300,150 L0,150 Z`}
//           fill="var(--color-accent-oceanic)"
//           fillOpacity={0.08}
//           stroke="none"
//           delay={0.5}
//           animate={isVisible}
//         />
//         <AnimatedPath
//           d={`${satisfactionPath} L300,150 L0,150 Z`}
//           fill="var(--color-accent-cosmic)"
//           fillOpacity={0.08}
//           stroke="none"
//           delay={0.8}
//           animate={isVisible}
//         />

//         {/* Data points */}
//         {isVisible && dataPoints.engagement.map((value, index) => (
//           <motion.circle
//             key={`engagement-point-${index}`}
//             cx={(index / 11) * 300}
//             cy={150 - (value / 100 * 150)}
//             r="3"
//             fill="var(--color-accent-primary)"
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
//           />
//         ))}

//         {isVisible && dataPoints.performance.map((value, index) => (
//           <motion.circle
//             key={`performance-point-${index}`}
//             cx={(index / 11) * 300}
//             cy={150 - (value / 100 * 150)}
//             r="3"
//             fill="var(--color-accent-oceanic)"
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
//           />
//         ))}

//         {isVisible && dataPoints.satisfaction.map((value, index) => (
//           <motion.circle
//             key={`satisfaction-point-${index}`}
//             cx={(index / 11) * 300}
//             cy={150 - (value / 100 * 150)}
//             r="3"
//             fill="var(--color-accent-cosmic)"
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
//           />
//         ))}
//       </svg>

//       {/* Legend */}
//       <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-bg-glass backdrop-blur-sm p-2 rounded">
//         <div className="flex items-center gap-2 text-xs">
//           <div className="w-3 h-3 rounded-full bg-accent-primary"></div>
//           <span className="text-text-secondary font-mono">Engagement</span>
//         </div>
//         <div className="flex items-center gap-2 text-xs">
//           <div className="w-3 h-3 rounded-full bg-accent-oceanic"></div>
//           <span className="text-text-secondary font-mono">Performance</span>
//         </div>
//         <div className="flex items-center gap-2 text-xs">
//           <div className="w-3 h-3 rounded-full bg-accent-cosmic"></div>
//           <span className="text-text-secondary font-mono">Satisfaction</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main component
// const DeepDiveSection: React.FC<DeepDiveSectionProps> = ({
//   project,
//   className,
// }) => {
//   const { shouldAnimate } = useAnimationPreferences();
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const imageRef = useRef<HTMLDivElement>(null);
//   const isInView = useInView(sectionRef, { once: false, margin: "-10% 0px" });
//   const isImageInView = useInView(imageRef, { once: false, amount: 0.3 });
//   const [activeTab, setActiveTab] = useState("process");
//   const [blueprintMode, setBlueprintMode] = useState(true);
//   const [hoveredAnnotation, setHoveredAnnotation] = useState<number | null>(null);

//   // Unique ID for SVG effects
//   const [uniqueId] = useState(`deepdive-${Math.floor(Math.random() * 10000)}`);

//   // Random technical coordinates for annotations
//   const [annotations] = useState([
//     { x: 25, y: 35, label: "Interface component", type: "circle", size: 30 },
//     { x: 75, y: 65, label: "Data connection", type: "line", angle: 45 },
//     { x: 45, y: 80, label: "Responsive layout", type: "rect", width: 40, height: 25 },
//     { x: 80, y: 25, label: "Animation trigger", type: "point" }
//   ]);

//   // Scroll animations
//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["start end", "end start"],
//   });

//   const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.15, 0.05]);

//   // Toggle blueprint mode when image comes into view
//   useEffect(() => {
//     if (isImageInView && shouldAnimate()) {
//       const timer = setTimeout(() => {
//         setBlueprintMode(false);
//       }, 1200);

//       return () => clearTimeout(timer);
//     }
//   }, [isImageInView, shouldAnimate]);

//   return (
//     <section
//       ref={sectionRef}
//       className={cn("py-20 md:py-32 bg-bg-code relative overflow-hidden", className)}
//     >
//       {/* SVG Defs */}
//       <svg width="0" height="0">
//         <defs>
//           {/* Blueprint grid pattern */}
//           <pattern
//             id={`${uniqueId}-blueprint`}
//             width="40"
//             height="40"
//             patternUnits="userSpaceOnUse"
//           >
//             <path
//               d="M 40 0 L 0 0 0 40"
//               fill="none"
//               stroke="var(--color-accent-oceanic)"
//               strokeWidth="0.5"
//               strokeOpacity="0.3"
//             />
//           </pattern>

//           {/* Scanning effect filter */}
//           <filter id={`${uniqueId}-scanline`}>
//             <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
//             <feColorMatrix
//               in="blur"
//               type="matrix"
//               values="1 0 0 0 0
//                       0 1 0 0 0
//                       0 0 1 0 0
//                       0 0 0 18 -7"
//               result="glow"
//             />
//             <feComposite in="SourceGraphic" in2="glow" operator="atop" />
//           </filter>
//         </defs>
//       </svg>

//       {/* Circuit pattern background */}
//       <motion.div
//         className="absolute inset-0 bg-circuit pointer-events-none"
//         style={{ opacity: backgroundOpacity }}
//       />

//       {/* Blueprint corners */}
//       <div className="absolute top-0 left-0 text-accent-primary/30">
//         <BlueprintCorner size={60} />
//       </div>
//       <div className="absolute top-0 right-0 rotate-90 text-accent-primary/30">
//         <BlueprintCorner size={60} />
//       </div>
//       <div className="absolute bottom-0 left-0 -rotate-90 text-accent-primary/30">
//         <BlueprintCorner size={60} />
//       </div>
//       <div className="absolute bottom-0 right-0 rotate-180 text-accent-primary/30">
//         <BlueprintCorner size={60} />
//       </div>

//       <div className="container mx-auto px-4 md:px-8 relative z-10">
//         <ScrollReveal direction="up" delay={0.2}>
//           <div className="mb-16 text-center">
//             <div className="inline-block relative">
//               <motion.div
//                 className="absolute -inset-2 -z-10 rounded bg-bg-glass backdrop-blur-sm opacity-30"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 0.3, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.4 }}
//               />
//               <motion.div
//                 className="inline-block mb-3 px-4 py-1 border-l-2 border-accent-primary bg-bg-glass backdrop-blur-sm text-xs font-mono text-accent-primary"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//               >
//                 PROJECT.ARCHITECTURE
//               </motion.div>

//               <Heading
//                 level={2}
//                 className="text-3xl md:text-5xl font-heading font-bold text-heading relative"
//               >
//                 Technical Deep Dive
//                 <motion.div
//                   className="absolute -bottom-3 left-0 h-1 bg-accent-primary"
//                   initial={{ width: 0 }}
//                   animate={{ width: "100%" }}
//                   transition={{ duration: 0.8, delay: 0.5 }}
//                 />
//               </Heading>
//             </div>
//           </div>
//         </ScrollReveal>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
//           {/* Left column - Project visualization (5 columns) */}
//           <div className="lg:col-span-5 relative">
//             <motion.div
//               ref={imageRef}
//               className="relative rounded-lg overflow-hidden bg-bg-tertiary/20"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//             >
//               {/* Image measurement ticks */}
//               <div className="absolute top-0 left-0 right-0 z-20">
//                 <TickStrip height={16} segments={9} labelEvery={3} showCoordinateLines={false} />
//               </div>
//               <div className="absolute left-0 top-0 bottom-0 z-20">
//                 <div className="h-full w-4 flex flex-col justify-between items-center py-4">
//                   <span className="text-[8px] font-mono text-accent-oceanic/70 rotate-90">0%</span>
//                   <div className="flex-1 w-px bg-accent-oceanic/20 my-2" />
//                   <span className="text-[8px] font-mono text-accent-oceanic/70 rotate-90">100%</span>
//                 </div>
//               </div>

//               {/* Main image - transitions from blueprint to actual */}
//               <div className="relative aspect-video">
//                 <Image
//                   src={project.imageSrc}
//                   alt={project.imageAlt}
//                   fill
//                   className={cn(
//                     "object-cover transition-all duration-1000",
//                     blueprintMode ? "opacity-70 grayscale blur-[1px]" : "opacity-100"
//                   )}
//                 />
//               </div>

//               {/* Blueprint overlay that transitions to screenshot */}
//               <motion.div
//                 className="absolute inset-0 bg-blueprint-grid mix-blend-overlay"
//                 initial={{ opacity: 0.8 }}
//                 animate={{ opacity: blueprintMode ? 0.8 : 0 }}
//                 transition={{ duration: 1.2 }}
//               />

//               {/* Scan line effect */}
//               <motion.div
//                 className="absolute left-0 right-0 h-[2px] bg-accent-oceanic/50 pointer-events-none"
//                 initial={{ top: 0 }}
//                 animate={{
//                   top: blueprintMode ? ["0%", "100%"] : ["0%", "0%"],
//                   opacity: blueprintMode ? 1 : 0
//                 }}
//                 transition={{
//                   top: { duration: 3, repeat: Infinity },
//                   opacity: { duration: 0.5 }
//                 }}
//               />

//               {/* Technical annotations - on blueprint */}
//               <svg className="absolute inset-0 w-full h-full pointer-events-none">
//                 {blueprintMode && annotations.map((anno, index) => (
//                   <g key={`annotation-${index}`}>
//                     {/* Different annotation types */}
//                     {anno.type === "circle" && (
//                       <motion.circle
//                         cx={`${anno.x}%`}
//                         cy={`${anno.y}%`}
//                         r={anno.size}
//                         fill="none"
//                         stroke="var(--color-accent-oceanic)"
//                         strokeWidth={1}
//                         strokeDasharray="5,5"
//                         initial={{ pathLength: 0 }}
//                         animate={{ pathLength: isImageInView ? 1 : 0 }}
//                         transition={{ duration: 1.2, delay: 0.3 + index * 0.2 }}
//                       />
//                     )}

//                     {anno.type === "line" && (
//                       <motion.line
//                         x1={`${anno.x - 15}%`}
//                         y1={`${anno.y - 15}%`}
//                         x2={`${anno.x + 15}%`}
//                         y2={`${anno.y + 15}%`}
//                         stroke="var(--color-accent-primary)"
//                         strokeWidth={1.5}
//                         initial={{ pathLength: 0 }}
//                         animate={{ pathLength: isImageInView ? 1 : 0 }}
//                         transition={{ duration: 1, delay: 0.3 + index * 0.2 }}
//                       />
//                     )}

//                     {anno.type === "rect" && (
//                       <motion.rect
//                         x={`${anno.x - anno.width / 2}%`}
//                         y={`${anno.y - anno.height / 2}%`}
//                         width={`${anno.width}%`}
//                         height={`${anno.height}%`}
//                         fill="none"
//                         stroke="var(--color-accent-cosmic)"
//                         strokeWidth={1}
//                         initial={{ pathLength: 0 }}
//                         animate={{ pathLength: isImageInView ? 1 : 0 }}
//                         transition={{ duration: 1.3, delay: 0.3 + index * 0.2 }}
//                       />
//                     )}

//                     {anno.type === "point" && (
//                       <motion.circle
//                         cx={`${anno.x}%`}
//                         cy={`${anno.y}%`}
//                         r="4"
//                         fill="var(--color-accent-warm)"
//                         initial={{ scale: 0 }}
//                         animate={{ scale: isImageInView ? [0, 1.5, 1] : 0 }}
//                         transition={{
//                           duration: 0.6,
//                           delay: 0.3 + index * 0.2,
//                           times: [0, 0.6, 1]
//                         }}
//                       />
//                     )}

//                     {/* Measurement lines */}
//                     <motion.line
//                       x1={`${anno.x}%`}
//                       y1={`${anno.y}%`}
//                       x2={`${anno.x + 10}%`}
//                       y2={`${anno.y + 10}%`}
//                       stroke="var(--color-accent-oceanic)"
//                       strokeWidth={1}
//                       strokeDasharray="2,2"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: isImageInView ? 0.7 : 0 }}
//                       transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
//                     />

//                     {/* Annotation text */}
//                     <motion.text
//                       x={`${anno.x + 12}%`}
//                       y={`${anno.y + 12}%`}
//                       fontSize="8"
//                       fontFamily="monospace"
//                       fill="var(--color-accent-oceanic)"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: isImageInView ? 0.9 : 0 }}
//                       transition={{ duration: 0.6, delay: 0.7 + index * 0.2 }}
//                     >
//                       {anno.label}
//                     </motion.text>
//                   </g>
//                 ))}

//                 {/* Technical measurements when not in blueprint mode */}
//                 {!blueprintMode && annotations.map((anno, index) => (
//                   <motion.g
//                     key={`tech-marker-${index}`}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
//                     onMouseEnter={() => setHoveredAnnotation(index)}
//                     onMouseLeave={() => setHoveredAnnotation(null)}
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <circle
//                       cx={`${anno.x}%`}
//                       cy={`${anno.y}%`}
//                       r="6"
//                       fill={hoveredAnnotation === index ? "var(--color-accent-primary)" : "var(--color-brand-primary)"}
//                       fillOpacity="0.8"
//                     />

//                     {hoveredAnnotation === index && (
//                       <g>
//                         <rect
//                           x={`${anno.x + 10}%`}
//                           y={`${anno.y - 10}%`}
//                           width="100"
//                           height="24"
//                           rx="2"
//                           fill="var(--color-bg-glass)"
//                           fillOpacity="0.9"
//                         />
//                         <text
//                           x={`${anno.x + 15}%`}
//                           y={`${anno.y}%`}
//                           fontSize="10"
//                           fontFamily="monospace"
//                           fill="var(--color-text-primary)"
//                           dy="4"
//                         >
//                           {anno.label}
//                         </text>
//                       </g>
//                     )}
//                   </motion.g>
//                 ))}
//               </svg>

//               {/* Toggle button for blueprint mode */}
//               <motion.button
//                 className="absolute bottom-3 right-3 bg-bg-glass backdrop-blur-sm text-xs font-mono px-2 py-1 rounded flex items-center gap-1 border border-divider"
//                 onClick={() => setBlueprintMode(!blueprintMode)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.98 }}
//                 animate={{ opacity: isImageInView ? 1 : 0 }}
//                 initial={{ opacity: 0 }}
//                 transition={{ duration: 0.4, delay: 1 }}
//               >
//                 <div className={cn(
//                   "w-2 h-2 rounded-full",
//                   blueprintMode ? "bg-accent-cosmic" : "bg-accent-primary"
//                 )} />
//                 <span className="text-text-secondary">
//                   {blueprintMode ? "BLUEPRINT" : "PRODUCTION"}
//                 </span>
//               </motion.button>
//             </motion.div>

//             {/* Technical frame */}
//             <motion.div
//               className="absolute -inset-4 border border-dashed border-accent-oceanic/30 rounded-lg z-0 pointer-events-none overflow-hidden"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: isInView ? 0.5 : 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//             >
//               {/* Corner elements */}
//               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent-oceanic/60" />
//               <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent-oceanic/60" />
//               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent-oceanic/60" />
//               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent-oceanic/60" />
//             </motion.div>

//             {/* Technical metadata */}
//             <motion.div
//               className="mt-2 text-[10px] font-mono text-accent-primary/60 flex justify-between"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: isInView ? 1 : 0 }}
//               transition={{ duration: 0.4, delay: 0.8 }}
//             >
//               <span>MODE/{blueprintMode ? "BLUEPRINT" : "PRODUCTION"}</span>
//               <span>ANNOTATIONS/{annotations.length}</span>
//               <span>RENDER/HIGH</span>
//             </motion.div>
//           </div>

//           {/* Right column - Technical specifications (7 columns) */}
//           <div className="lg:col-span-7 relative">
//             {/* Tab navigation */}
//             <div className="flex mb-8 border-b border-divider overflow-x-auto no-scrollbar">
//               {[
//                 { id: "process", label: "DEVELOPMENT PROCESS", icon: "fi-git-branch" },
//                 { id: "technical", label: "TECHNICAL SPECS", icon: "fi-code" },
//                 { id: "results", label: "PERFORMANCE METRICS", icon: "fi-bar-chart-2" }
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   className={cn(
//                     "px-5 py-3 text-sm font-mono transition-all flex items-center gap-2 relative whitespace-nowrap",
//                     activeTab === tab.id
//                       ? "text-accent-primary border-b-2 border-accent-primary"
//                       : "text-text-secondary hover:text-text-primary"
//                   )}
//                   onClick={() => setActiveTab(tab.id)}
//                 >
//                   <Icon name={tab.icon} size={16} />
//                   {tab.label}

//                   {activeTab === tab.id && (
//                     <motion.div
//                       className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-accent-primary"
//                       layoutId="activeTabLine"
//                       transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                     />
//                   )}
//                 </button>
//               ))}
//             </div>

//             {/* Tab content with animated transitions */}
//             <div className="relative min-h-[300px]">
//               <AnimatePresence mode="wait">
//                 {activeTab === "process" && (
//                   <motion.div
//                     key="process-tab"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.4 }}
//                     className="bg-bg-glass backdrop-blur-sm rounded-lg border border-divider p-6"
//                   >
//                     <div className="flex items-center mb-6">
//                       <div className="h-8 w-1 bg-accent-primary mr-3" />
//                       <Heading level={3} className="text-2xl font-bold">
//                         Development Process
//                       </Heading>
//                     </div>

//                     <Text className="mb-6 text-text-primary">
//                       Our development approach combines agile methodology with technical excellence to deliver results that exceed expectations. The process followed these key phases:
//                     </Text>

//                     <div className="space-y-5">
//                       {[
//                         {
//                           title: "Discovery & Requirements",
//                           desc: "Comprehensive analysis of project needs, technical constraints, and user expectations.",
//                           icon: "fi-search"
//                         },
//                         {
//                           title: "Architecture & Design",
//                           desc: "Creating the information architecture, technical specifications, and visual design prototypes.",
//                           icon: "fi-layout"
//                         },
//                         {
//                           title: "Development & Testing",
//                           desc: "Iterative development with continuous testing and performance optimization.",
//                           icon: "fi-code"
//                         },
//                         {
//                           title: "Deployment & Optimization",
//                           desc: "Careful deployment process with post-launch monitoring and performance tuning.",
//                           icon: "fi-upload-cloud"
//                         },
//                         {
//                           title: "Maintenance & Evolution",
//                           desc: "Ongoing support with feature enhancements based on user feedback and analytics.",
//                           icon: "fi-refresh-cw"
//                         }
//                       ].map((step, index) => (
//                         <motion.div
//                           key={`process-step-${index}`}
//                           className="flex items-start gap-4"
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ duration: 0.4, delay: 0.1 * index }}
//                         >
//                           <div className="rounded-full p-2 bg-accent-primary/10 text-accent-primary mt-0.5">
//                             <Icon name={step.icon} size={16} />
//                           </div>
//                           <div>
//                             <Text as="h4" className="font-medium text-lg mb-1">
//                               {step.title}
//                             </Text>
//                             <Text className="text-text-secondary">
//                               {step.desc}
//                             </Text>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}

//                 {activeTab === "technical" && (
//                   <motion.div
//                     key="technical-tab"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.4 }}
//                     className="bg-bg-glass backdrop-blur-sm rounded-lg border border-divider p-6"
//                   >
//                     <div className="flex items-center mb-6">
//                       <div className="h-8 w-1 bg-accent-oceanic mr-3" />
//                       <Heading level={3} className="text-2xl font-bold">
//                         Technical Specifications
//                       </Heading>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
//                       <div>
//                         <div className="mb-4 border-b border-divider pb-2">
//                           <Text className="font-mono uppercase text-sm text-accent-oceanic">
//                             Frontend Technologies
//                           </Text>
//                         </div>
//                         <ul className="space-y-3">
//                           {project.techStack
//                             .filter(tech => !tech.includes("API") && !tech.includes("SQL") && !tech.includes("Node"))
//                             .map((tech, index) => (
//                               <motion.li
//                                 key={`frontend-${index}`}
//                                 className="flex items-center gap-3"
//                                 initial={{ opacity: 0, x: -10 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ duration: 0.3, delay: 0.1 * index }}
//                               >
//                                 <div className="w-3 h-3 border-2 border-accent-oceanic rounded-full flex-shrink-0" />
//                                 <Text className="text-text-primary">{tech}</Text>
//                               </motion.li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <div className="mb-4 border-b border-divider pb-2">
//                           <Text className="font-mono uppercase text-sm text-accent-cosmic">
//                             Backend & Infrastructure
//                           </Text>
//                         </div>
//                         <ul className="space-y-3">
//                           {project.techStack
//                             .filter(tech => tech.includes("API") || tech.includes("SQL") || tech.includes("Node"))
//                             .map((tech, index) => (
//                               <motion.li
//                                 key={`backend-${index}`}
//                                 className="flex items-center gap-3"
//                                 initial={{ opacity: 0, x: -10 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
//                               >
//                                 <div className="w-3 h-3 border-2 border-accent-cosmic rounded-full flex-shrink-0" />
//                                 <Text className="text-text-primary">{tech}</Text>
//                               </motion.li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>

//                     {/* Performance metrics */}
//                     <div className="mt-8">
//                       <div className="mb-4 border-b border-divider pb-2">
//                         <Text className="font-mono uppercase text-sm text-accent-primary">
//                           Performance Optimization
//                         </Text>
//                       </div>

//                       <div className="space-y-5">
//                         {[
//                           { metric: "Core Web Vitals", value: "All Green", icon: "fi-check-circle" },
//                           { metric: "Lighthouse Score", value: "98/100", icon: "fi-zap" },
//                           { metric: "Initial Load Time", value: "< 1.5s", icon: "fi-clock" },
//                           { metric: "Accessibility", value: "WCAG 2.1 AA", icon: "fi-users" }
//                         ].map((metric, index) => (
//                           <motion.div
//                             key={`metric-${index}`}
//                             className="flex items-center justify-between"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.4, delay: 0.6 + 0.1 * index }}
//                           >
//                             <div className="flex items-center gap-2">
//                               <Icon name={metric.icon} size={16} className="text-accent-primary" />
//                               <Text className="text-text-primary">{metric.metric}</Text>
//                             </div>
//                             <Text className="font-mono font-bold">{metric.value}</Text>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}

//                 {activeTab === "results" && (
//                   <motion.div
//                     key="results-tab"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.4 }}
//                     className="bg-bg-glass backdrop-blur-sm rounded-lg border border-divider p-6"
//                   >
//                     <div className="flex items-center mb-6">
//                       <div className="h-8 w-1 bg-accent-cosmic mr-3" />
//                       <Heading level={3} className="text-2xl font-bold">
//                         Performance Metrics
//                       </Heading>
//                     </div>

//                     <Text className="mb-6 text-text-primary">
//                       Project implementation resulted in significant improvements across key performance indicators:
//                     </Text>

//                     {/* Advanced chart visualization */}
//                     <TechnicalChart isVisible={activeTab === "results"} />

//                     {/* Key results with icons */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//                       {[
//                         { result: "27% increase in user engagement", icon: "fi-users", color: "accent-primary" },
//                         { result: "45% improvement in load time", icon: "fi-clock", color: "accent-oceanic" },
//                         { result: "98% positive user feedback", icon: "fi-thumbs-up", color: "accent-cosmic" },
//                         { result: "62% reduction in bounce rate", icon: "fi-arrow-down", color: "accent-primary" }
//                       ].map((item, index) => (
//                         <motion.div
//                           key={`result-${index}`}
//                           className="flex items-start gap-3"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.4, delay: 0.5 + 0.1 * index }}
//                         >
//                           <div className={`rounded-full p-2 bg-${item.color}/10 text-${item.color} mt-0.5`}>
//                             <Icon name={item.icon} size={16} />
//                           </div>
//                           <Text className="text-text-primary">{item.result}</Text>
//                         </motion.div>
//                       ))}
//                     </div>

//                     {/* Quote */}
//                     <motion.div
//                       className="mt-8 border-l-4 border-accent-primary pl-4 py-2"
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.5, delay: 0.9 }}
//                     >
//                       <Text className="text-text-secondary italic">
//                         "The implementation exceeded our expectations in both technical performance and user satisfaction. The attention to detail in optimization has resulted in metrics that surpass industry standards."
//                       </Text>
//                       <Text className="text-text-primary font-semibold mt-2">
//                         — Client Feedback
//                       </Text>
//                     </motion.div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scan line effect */}
//       <motion.div
//         className="absolute left-0 right-0 h-[2px] bg-accent-primary/10 pointer-events-none"
//         initial={{ top: "0%" }}
//         animate={{ top: "100%" }}
//         transition={{
//           duration: 5,
//           repeat: Infinity,
//           ease: "linear",
//           repeatDelay: 1
//         }}
//       />
//     </section>
//   );
// };

// export default DeepDiveSection;