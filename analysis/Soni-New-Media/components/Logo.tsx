
import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * SONÍ NEW MEDIA - Pure Identity (2026)
 * High-fidelity emblem integration featuring forced-white specularity 
 * and kinetic ambient occlusion.
 */
export const Logo: React.FC<LogoProps> = ({ className = "", size = 36 }) => {
  const logoUrl = 'https://assets.soninewmedia.com/SoniNewMedia.svg';

  return (
    <motion.div 
      className={`relative flex items-center justify-center group cursor-pointer ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <div 
        style={{ height: size }} 
        className="relative flex items-center justify-center"
      >
        {/* Master Identity Asset - Force White Specularity */}
        <motion.img
          src={logoUrl}
          alt="Soní New Media"
          style={{ height: '100%', width: 'auto' }}
          className="relative z-10 block pointer-events-none select-none"
          variants={{
            initial: { 
              // Force white: brightness(0) turns everything black, invert(1) turns black to white
              filter: "brightness(0) invert(1) opacity(0.85)",
              scale: 1 
            },
            hover: { 
              filter: "brightness(0) invert(1) opacity(1) drop-shadow(0 0 12px rgba(255,255,255,0.4))",
              scale: 1.08,
            }
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
        />

        {/* Ambient Neural Glow - Underlay Aesthetic */}
        <motion.div
          className="absolute inset-0 bg-white/10 blur-xl rounded-full -z-10"
          variants={{
            initial: { opacity: 0, scale: 0.8 },
            hover: { opacity: 0.6, scale: 1.5 }
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
};
