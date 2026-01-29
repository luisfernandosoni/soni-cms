
import React from 'react';
import { motion } from 'motion/react';
import { KineticLayer } from '../kinetic/KineticLayer.tsx';
import { WorkItem } from '../../types.ts';

/**
 * ArchiveMedia - Passive Edition
 * depth: -40 for inward parallax
 */
export const ArchiveMedia: React.FC<{ item: WorkItem }> = ({ item }) => (
  <KineticLayer depth={-40} className="absolute inset-0 h-full w-full">
    <motion.img
      src={item.image}
      alt={item.title}
      className="h-full w-full object-cover scale-[1.3] grayscale group-hover:grayscale-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
    />
  </KineticLayer>
);

/**
 * ArchiveOverlay - Passive Edition
 * depth: 60 for floating content
 */
export const ArchiveOverlay: React.FC<{ item: WorkItem }> = ({ item }) => (
  <KineticLayer 
    depth={60} 
    className="absolute inset-0 z-10 p-12 lg:p-16 flex flex-col justify-between pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/70"
  >
    <div className="flex justify-between items-start">
      <span className="text-[9px] font-black tracking-widest-3x text-white uppercase opacity-50 font-mono">
        Archive_{item.year}
      </span>
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 45 }}
        className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-xl bg-white/5 transition-colors group-hover:bg-white group-hover:text-black"
      >
        <span className="material-icons-outlined text-base">north_east</span>
      </motion.div>
    </div>
    
    <div className="space-y-4">
      <motion.h3 className="text-white font-display text-card-title-fluid font-medium tracking-tight">
        {item.title}
      </motion.h3>
      <p className="text-white/60 text-[13px] font-light max-w-sm uppercase tracking-widest-2x">
        {item.category}
      </p>
    </div>
  </KineticLayer>
);

export const ArchiveFooter: React.FC<{ item: WorkItem }> = ({ item }) => (
  <div className="mt-12 flex justify-between items-end px-4 group-hover:px-6 transition-all duration-1000">
    <div className="space-y-3">
      <h4 className="text-[11px] font-black text-text uppercase tracking-widest-3x opacity-80 group-hover:opacity-100 transition-opacity">
        {item.title}
      </h4>
      <p className="text-[9px] text-secondary font-bold uppercase tracking-widest-2x">
        {item.category}
      </p>
    </div>
    <div className="h-[1px] flex-grow mx-12 bg-white/5 group-hover:bg-white/15 transition-colors mb-3" />
    <span className="text-[10px] font-mono text-secondary tabular-nums font-black mb-1 opacity-40">
      ©{item.year}
    </span>
  </div>
);

/**
 * ArchiveSpecularity - Passive Surface Glint
 * Leverages the parent's --mx and --my CSS variables for dynamic masking.
 */
export const ArchiveSpecularity = () => (
  <KineticLayer depth={5} className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px]">
    <motion.div 
      className="absolute inset-0 border-[1.5px] border-white/20 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
      style={{
        maskImage: `radial-gradient(600px circle at var(--mx) var(--my), black, transparent 80%)`,
        WebkitMaskImage: `radial-gradient(600px circle at var(--mx) var(--my), black, transparent 80%)`
      } as any}
    />
  </KineticLayer>
);
