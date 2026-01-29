
import React from 'react';
import { motion, useSpring, useTransform, MotionValue } from 'motion/react';

interface RingProps {
  index: number;
  total: number;
  tx: MotionValue<number>;
  ty: MotionValue<number>;
  rotZ: MotionValue<number>;
}

/**
 * SentinelRing V9 (2026) - High-Definition Kinetic Agent
 * Focused on "Material Presence" and edge clarity.
 */
const SentinelRing = React.memo(({ index, total, tx, ty, rotZ }: RingProps) => {
  // Direct spatial mapping - sharper multipliers for tighter perspective
  const x = useTransform(tx, (v) => v * (index * 0.105));
  const y = useTransform(ty, (v) => v * (index * 0.105));

  return (
    <motion.div
      style={{
        "--i": index,
        "--total": total,
        width: `calc(var(--base-size) + (var(--i) * var(--size-step)))`,
        height: `calc(var(--base-size) + (var(--i) * var(--size-step)))`,
        x,
        y,
        z: `calc(var(--i) * var(--z-step))`,
        rotateZ: rotZ,
        // High-fidelity opacity curve: head is punchy, tail stays visible
        opacity: `calc(0.95 - (var(--i) / var(--total)) * 0.6)`,
        transformStyle: "preserve-3d",
        position: 'absolute',
        willChange: 'transform'
      } as any}
      className="flex items-center justify-center pointer-events-none"
    >
      <div 
        className="w-full h-full rounded-full border-[1.5px] border-white/60 relative shadow-[0_0_35px_rgba(255,255,255,0.08)]" 
        style={{
          // Subtle additive glow to make the rings "pop" against the dark grid
          boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05), 0 0 25px rgba(255,255,255,0.05)'
        }}
      />
    </motion.div>
  );
});

/**
 * SentinelChainLink: Critically Damped Container
 * Designed for instantaneous "Snap-to-Position" logic.
 */
const SentinelChainLink = React.memo(({ 
  targetX, 
  targetY, 
  targetRotZ, 
  index, 
  total 
}: { 
  targetX: MotionValue<number>; 
  targetY: MotionValue<number>; 
  targetRotZ: MotionValue<number>;
  index: number;
  total: number;
}) => {
  // CRITICAL DAMPING PHYSICS
  // Stiffness 1050 + Damping 75 = Extreme response with no overshoot.
  // The mass remains 0.1 to avoid physical "weight" lag.
  const config = { 
    stiffness: 1050 - (index * 25), 
    damping: 75 + (index * 1.5), 
    mass: 0.1,
    restDelta: 0.001 // Resolves the animation much faster
  };

  const sx = useSpring(targetX, config);
  const sy = useSpring(targetY, config);
  const srz = useSpring(targetRotZ, config);

  return (
    <>
      <SentinelRing 
        index={index} 
        total={total} 
        tx={sx} 
        ty={sy} 
        rotZ={srz} 
      />
      {index < total - 1 && (
        <SentinelChainLink 
          targetX={sx} 
          targetY={sy} 
          targetRotZ={srz} 
          index={index + 1} 
          total={total} 
        />
      )}
    </>
  );
});

export const SentinelAssembly: React.FC<{
  relX: MotionValue<number>;
  relY: MotionValue<number>;
  isMobile: boolean;
  time: MotionValue<number>;
}> = ({ relX, relY, isMobile, time }) => {
  const ringCount = isMobile ? 12 : 24;
  
  // Base targets - 1:1 Direct Input Bridge
  const targetX = useTransform(relX, [0, 1], [-145, 145]);
  const targetY = useTransform(relY, [0, 1], [-105, 105]);
  const targetRotZ = useTransform(relX, [0, 1], [-45, 45]);

  // Master orientation (High-speed resolution)
  const masterSpringConfig = { stiffness: 600, damping: 65, mass: 0.1 };
  const rotateX = useSpring(useTransform(relY, [0, 1], [30, -30]), masterSpringConfig);
  const rotateY = useSpring(useTransform(relX, [0, 1], [-30, 30]), masterSpringConfig);

  // Micro-Wander (Tightened for "Technical" feel)
  const wanderX = useTransform(time, (t) => Math.sin(t / 2200) * 4);
  const wanderY = useTransform(time, (t) => Math.cos(t / 2400) * 4);

  return (
    <motion.div 
      style={{ 
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        x: wanderX,
        y: wanderY,
        filter: "url(#pro-mist)",
        "--base-size": isMobile ? "85px" : "125px",
        "--size-step": isMobile ? "11px" : "15px",
        "--z-step": isMobile ? "-14px" : "-30px",
      } as any} 
      className="relative w-full h-full flex items-center justify-center"
    >
      <SentinelChainLink 
        targetX={targetX}
        targetY={targetY}
        targetRotZ={targetRotZ}
        index={0}
        total={ringCount}
      />
      
      {/* Central Singularity: High-Contrast Visual Anchor */}
      <motion.div 
        style={{ 
          translateZ: isMobile ? 130 : 270, 
          x: targetX,
          y: targetY,
          transformStyle: "preserve-3d"
        } as any} 
        className="relative z-50"
      >
        <div className="w-12 h-12 lg:w-18 lg:h-18 rounded-full bg-white flex items-center justify-center shadow-[0_0_250px_rgba(255,255,255,1)]">
           <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-white border border-black/10 flex items-center justify-center overflow-hidden">
              <motion.div 
                animate={{ scale: [0.4, 0.7, 0.4], opacity: [0.8, 1, 0.8], rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                className="w-5 h-5 rounded-xs bg-black" 
              />
           </div>
        </div>
        <div className="absolute inset-[-180%] rounded-full bg-white/10 blur-3xl -z-10" />
      </motion.div>
    </motion.div>
  );
};
