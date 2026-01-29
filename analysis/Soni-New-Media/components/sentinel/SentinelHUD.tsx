
import React from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';

export const SentinelHUD: React.FC<{ speed: MotionValue<number> }> = ({ speed }) => {
  // Calculate bar height mapping once at the top level
  const barBaseHeight = useTransform(speed, [0, 100], [2, 45]);

  return (
    <div className="absolute inset-0 z-[60] p-10 lg:p-14 flex flex-col justify-between pointer-events-none">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h4 className="text-[10px] font-black uppercase tracking-widest-3x text-white/90">SYSTEM_CORE_V16</h4>
          <p className="text-[6px] font-mono text-white/50 uppercase tracking-widest pl-0.5">UNIVERSE_PARALLAX_SYNC_ACTIVE</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-[8px] font-mono text-white/50 text-right uppercase tracking-widest tabular-nums font-bold">SPATIAL_SYNC: ENABLED</div>
           <motion.div 
             animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
             className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_15px_white]" 
           />
        </div>
      </div>
      
      <div className="w-full flex justify-between items-end">
        <div className="bg-white/[0.05] border border-white/15 px-10 py-5 rounded-[24px] backdrop-blur-3xl shadow-2xl">
          <span className="text-[7px] font-mono text-white/40 uppercase tracking-widest block mb-1.5">MULTI_PLANAR_SYNC</span>
          <h3 className="text-white font-mono text-[10px] font-black tracking-widest-2x uppercase leading-none">SENTINEL_26_V16_UNIVERSE</h3>
        </div>
        
        <div className="flex gap-2 items-end h-12 pr-6 opacity-30">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div 
              key={i} 
              style={{ height: barBaseHeight } as any}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.7 + Math.random(), ease: "easeInOut", delay: i * 0.015 }} 
              className="w-[1.2px] bg-white" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
