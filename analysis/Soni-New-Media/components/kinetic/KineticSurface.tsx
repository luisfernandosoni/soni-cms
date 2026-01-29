
import React, { useRef, useMemo, useId } from 'react';
import { motion, useSpring, useTransform, useMotionTemplate, MotionValue } from 'motion/react';
import { useRelativeMotion } from '../../context/KineticContext.tsx';

interface KineticSurfaceProps {
  children: React.ReactNode;
  strength?: number;
  shineIntensity?: number;
  className?: string;
  id?: string;
}

/**
 * KINETIC SURFACE V5 (2026) - Atomic Coordinate Propagation
 * Calculates smoothed coordinates ONCE and propagates via CSS Variables.
 */
export const KineticSurface: React.FC<KineticSurfaceProps> = ({ 
  children, 
  strength = 16, 
  shineIntensity = 0.15,
  className = "",
  id: providedId 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalId = useId();
  const cardId = providedId || internalId;
  const { relX, relY, isOver } = useRelativeMotion(cardId, containerRef);

  const springConfig = useMemo(() => ({ 
    stiffness: 150, 
    damping: 22, 
    mass: 1.1 
  }), []);

  const smoothX = useSpring(useTransform([isOver, relX], ([over, rX]: any[]) => (over === 1 ? (rX as number) : 0.5)), springConfig) as MotionValue<number>;
  const smoothY = useSpring(useTransform([isOver, relY], ([over, rY]: any[]) => (over === 1 ? (rY as number) : 0.5)), springConfig) as MotionValue<number>;

  const rotateX = useTransform(smoothY, [0, 1], [strength, -strength]);
  const rotateY = useTransform(smoothX, [0, 1], [-strength, strength]);
  
  // Normalized variables for CSS-native Parallax (-1 to 1 range)
  const rx = useTransform(smoothX, [0, 1], [-1, 1]);
  const ry = useTransform(smoothY, [0, 1], [-1, 1]);
  
  const mouseXPercent = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const mouseYPercent = useTransform(smoothY, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      ref={containerRef}
      style={{ 
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1500,
        "--mx": mouseXPercent,
        "--my": mouseYPercent,
        "--rx": rx,
        "--ry": ry
      } as any}
      className={`relative group will-change-transform ${className}`}
    >
      {/* Precision Lumina Glow */}
      <motion.div 
        style={{ 
          opacity: useTransform(isOver, (over: number) => over === 1 ? 1 : 0),
          background: useMotionTemplate`radial-gradient(1000px circle at var(--mx) var(--my), rgba(255,255,255,${shineIntensity}), transparent 60%)`,
          transform: 'translateZ(2px)',
        } as any}
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-700 rounded-[inherit]"
      />

      <KineticSurfaceContext.Provider value={{ smoothX, smoothY }}>
        {children}
      </KineticSurfaceContext.Provider>
    </motion.div>
  );
};

export const KineticSurfaceContext = React.createContext<{
  smoothX: any;
  smoothY: any;
} | null>(null);
