
import React from 'react';
import { motion, MotionValue, useSpring, useTransform } from 'motion/react';

interface SentinelEnvironmentProps {
  relX: MotionValue<number>;
  relY: MotionValue<number>;
}

/**
 * SentinelEnvironment - The Spatial Stage (2026)
 * Isolates the distal and proximal parallax grids from the central artifact logic.
 */
export const SentinelEnvironment: React.FC<SentinelEnvironmentProps> = React.memo(({ relX, relY }) => {
  // Distal Parallax Math (Subtle, Deep)
  const masterGridX = useSpring(useTransform(relX, [0, 1], [40, -40]), { stiffness: 80, damping: 25 });
  const masterGridY = useSpring(useTransform(relY, [0, 1], [40, -40]), { stiffness: 80, damping: 25 });

  // Proximal Parallax Math (Aggressive, Near)
  const detailGridX = useSpring(useTransform(relX, [0, 1], [80, -80]), { stiffness: 120, damping: 30 });
  const detailGridY = useSpring(useTransform(relY, [0, 1], [80, -80]), { stiffness: 120, damping: 30 });

  return (
    <>
      {/* TECHNICAL REGISTRY: SVG Filters */}
      <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0">
        <defs>
          <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="glow" />
            <feBlend in="SourceGraphic" in2="glow" mode="screen" />
          </filter>
          <filter id="pro-mist" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="diffusion" />
            <feColorMatrix in="diffusion" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.45 0" />
            <feBlend in="SourceGraphic" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* LAYER 1: Master Grid Underlay (Distal) */}
      <motion.div 
        style={{
          x: masterGridX,
          y: masterGridY,
          opacity: 0.3,
          scale: 1.15
        } as any}
        className="absolute inset-0 pointer-events-none"
      >
         <div className="w-full h-full" style={{ 
           backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.25) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1.5px, transparent 1.5px)',
           backgroundSize: '100px 100px'
         }} />
      </motion.div>

      {/* LAYER 2: Depth Detail Grid (Proximal) + Cinematic Scanline */}
      <motion.div 
        style={{
          translateZ: -180,
          x: detailGridX,
          y: detailGridY,
          rotateX: useTransform(relY, [0, 1], [15.0, -15.0]), 
          rotateY: useTransform(relX, [0, 1], [-15.0, 15.0]),
          opacity: 0.25,
          scale: 1.25,
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 95%)'
        } as any}
        className="absolute inset-[-60%] pointer-events-none"
      >
         <div className="w-full h-full" style={{ 
           backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)',
           backgroundSize: '40px 40px'
         }} />
         
         <motion.div 
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[4px] bg-white/40 blur-[5px] shadow-[0_0_25px_rgba(255,255,255,0.4)] mix-blend-screen"
         />
      </motion.div>
    </>
  );
});
