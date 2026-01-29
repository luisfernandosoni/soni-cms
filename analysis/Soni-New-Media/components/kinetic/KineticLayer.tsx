
import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { KineticSurfaceContext } from './KineticSurface.tsx';

interface KineticLayerProps {
  children: React.ReactNode;
  depth: number; 
  className?: string;
}

/**
 * KINETIC LAYER V6 (2026) - Passive Coordinate Inheritance
 * This component no longer "listens" to motion values. 
 * It relies on CSS variables (--rx, --ry) injected by the KineticSurface parent.
 */
export const KineticLayer: React.FC<KineticLayerProps> = ({ children, depth, className = "" }) => {
  const context = useContext(KineticSurfaceContext);
  
  if (!context) {
    console.warn("KineticLayer must be used within a KineticSurface");
    return <>{children}</>;
  }

  // Multiplier for parallax leverage (0.2 matches original design intent)
  const leverage = depth * 0.2;

  return (
    <motion.div
      style={{ 
        // Zero-JS Parallax: Calculated by the browser's CSS engine
        transform: `translate3d(calc(var(--rx) * ${-leverage}px), calc(var(--ry) * ${-leverage}px), ${depth}px)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      } as any}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};
