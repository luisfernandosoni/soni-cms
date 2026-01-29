
import React, { useRef, useId } from 'react';
import { motion, useTransform, useTime, useSpring } from 'motion/react';
import { useKinetic, useRelativeMotion } from '../context/KineticContext.tsx';
import { SpatialNodes } from './sentinel/SentinelAtoms.tsx';
import { SentinelAssembly } from './sentinel/SentinelRings.tsx';
import { SentinelHUD } from './sentinel/SentinelHUD.tsx';
import { SentinelEnvironment } from './sentinel/SentinelEnvironment.tsx';

/**
 * SentinelCore - The Central Intelligence (2026)
 * Synchronized for ultra-responsive spatial feedback.
 */
export const SentinelCore: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardId = useId();
  const { isMobile, velX, velY } = useKinetic();
  const time = useTime();
  const { relX, relY } = useRelativeMotion(cardId, containerRef);

  // System Speed Calculation
  const speed = useTransform([velX, velY], ([vx, vy]) => 
    Math.min(100, Math.sqrt(Math.pow(vx as number, 2) + Math.pow(vy as number, 2)) / 50)
  );

  // COORDINATE BRIDGE: SNAPPY PARALLAX
  // Increased stiffness (600) ensures the "stars" move without visible delay.
  const springConfig = { stiffness: 600, damping: 50, mass: 0.1 };
  const smoothRX = useSpring(useTransform(relX, [0, 1], [-1, 1]), springConfig);
  const smoothRY = useSpring(useTransform(relY, [0, 1], [-1, 1]), springConfig);

  return (
    <motion.div 
      ref={containerRef} 
      style={{
        "--rx": smoothRX,
        "--ry": smoothRY
      } as any}
      className="w-full h-full relative group flex items-center justify-center perspective-[4500px] overflow-hidden bg-[#010101] border border-white/10 rounded-[40px] shadow-2xl"
    >
      <SentinelEnvironment relX={relX} relY={relY} />

      <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        <SpatialNodes />
        <SentinelAssembly 
          relX={relX}
          relY={relY}
          isMobile={isMobile}
          time={time}
        />
      </div>
      
      <SentinelHUD speed={speed} />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.98)_100%)]" />
    </motion.div>
  );
};
