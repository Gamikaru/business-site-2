import React from "react";
import { motion, MotionValue } from "framer-motion";

interface HomeHeroBackgroundProps {
  imageSrc: string;
  imageAlt: string;
  backgroundY: MotionValue<string>;
  backgroundScale: MotionValue<number>;
  gridX: MotionValue<number>;
  gridY: MotionValue<number>;
  mousePosition: { x: number; y: number };
  glitchActive: boolean;
  intensiveGlitch: boolean;
  glitchOffsets: number[];
  terminalText: string;
  randomData: {
    coordinates: { x: number; y: number };
    spectrumValue: number;
    systemLoad: number;
  };
}

const HomeHeroBackground: React.FC<HomeHeroBackgroundProps> = ({
  imageSrc,
  imageAlt,
  backgroundY,
  backgroundScale,
  gridX,
  gridY,
  mousePosition,
  glitchActive,
  intensiveGlitch,
  glitchOffsets,
  terminalText,
  randomData,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base layer - dark gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"
        style={{ y: backgroundY, scale: backgroundScale }}
      />

      {/* Interactive blueprint grid - moves with mouse */}
      <motion.div
        className="absolute inset-0 opacity-25 mix-blend-screen"
        style={{ x: gridX, y: gridY }}
      >
        {/* Complex blueprint grid */}
        <div className="h-full w-full bg-blueprint-grid"></div>

        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 bg-circuit opacity-20"></div>

        {/* Technical measurement grid with animated drawing */}
        <svg className="absolute inset-0 w-full h-full opacity-70" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid matrix */}
          {Array.from({ length: 10 }).map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <motion.line
                x1="0" y1={i * 10} x2="100" y2={i * 10}
                stroke="var(--color-accent-oceanic)"
                strokeWidth="0.1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.1, ease: "easeInOut" }}
              />
              <motion.line
                x1={i * 10} y1="0" x2={i * 10} y2="100"
                stroke="var(--color-accent-oceanic)"
                strokeWidth="0.1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.1, ease: "easeInOut" }}
              />
            </React.Fragment>
          ))}

          {/* Data visualization lines */}
          <motion.path
            d={`M0,50 C20,${30 + mousePosition.y * 40},80,${70 - mousePosition.x * 40},100,50`}
            stroke="var(--color-accent-primary)"
            strokeWidth="0.4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          <motion.path
            d={`M0,80 Q50,${100 - mousePosition.y * 50},100,20`}
            stroke="var(--color-brand-primary)"
            strokeWidth="0.3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* Advanced image treatment */}
      <div className="absolute inset-0">
        <motion.div
          className={`absolute inset-0 transition-all duration-100 overflow-hidden ${
            glitchActive ? "glitch-filter" : ""
          } ${intensiveGlitch ? "intensive-glitch" : ""}`}
          style={{ y: backgroundY, scale: backgroundScale }}
        >
          {/* Base image with blend mode */}
          <div className="absolute inset-0 mix-blend-luminosity opacity-60">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Glitch image copies for effect */}
          <div className="absolute inset-0 glitch-image-r opacity-50 hidden md:block" style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate3d(${glitchActive ? '5px' : '0'}, 0, 0)`,
            mixBlendMode: 'screen'
          }}></div>

          <div className="absolute inset-0 glitch-image-g opacity-50 hidden md:block" style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate3d(${glitchActive ? '-3px' : '0'}, 0, 0)`,
            mixBlendMode: 'screen'
          }}></div>
        </motion.div>

        {/* Duotone color overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/30 via-transparent to-green-700/40 mix-blend-color"></div>

        {/* Noise texture */}
        <div className="absolute inset-0 bg-dots-dense opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Coordinate readout */}
      <div className="absolute bottom-20 right-6 hidden lg:block">
        <div className="border border-accent-oceanic/60 p-2 backdrop-blur-sm bg-black/30">
          <div className="flex text-[10px] font-mono text-accent-oceanic justify-between items-center">
            <div className="w-3 h-3 border border-accent-oceanic mr-2 flex items-center justify-center">
              <div className="w-1 h-1 bg-accent-oceanic"></div>
            </div>
            <motion.span
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              POS [{randomData.coordinates.x.toString().padStart(2, '0')},{randomData.coordinates.y.toString().padStart(2, '0')}]
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeroBackground;
