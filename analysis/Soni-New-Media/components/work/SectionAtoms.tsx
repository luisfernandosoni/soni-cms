
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Magnetic } from '../Magnetic.tsx';

const transition = { 
  duration: 0.4, 
  ease: [0.16, 1, 0.3, 1] as const 
};

const variant = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 }
};

export const WorkTag: React.FC<{ label: string; language: string }> = React.memo(({ label, language }) => (
  <div className="relative min-h-[20px]">
    <AnimatePresence mode="wait">
      <motion.span 
        key={language} 
        {...variant} 
        transition={transition}
        className="text-nano font-black uppercase tracking-widest-3x text-secondary block"
      >
        {label}
      </motion.span>
    </AnimatePresence>
  </div>
));

export const WorkTitle: React.FC<{ text: string; language: string }> = React.memo(({ text, language }) => (
  <div className="relative min-h-[1.2em] mt-6">
    <AnimatePresence mode="wait">
      <motion.h2 
        key={language} 
        {...variant} 
        transition={{ ...transition, delay: 0.05 }}
        className="font-display text-h2-fluid font-medium text-text"
      >
        {text}
      </motion.h2>
    </AnimatePresence>
  </div>
));

export const WorkLead: React.FC<{ text: string; language: string }> = React.memo(({ text, language }) => (
  <div className="relative min-h-[60px]">
    <AnimatePresence mode="wait">
      <motion.p 
        key={language} 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -10 }} 
        transition={{ ...transition, delay: 0.1 }}
        className="text-secondary/60 max-w-sm text-body-fluid leading-relaxed mb-10 font-light"
      >
        {text}
      </motion.p>
    </AnimatePresence>
  </div>
));

export const WorkAction: React.FC<{ label: string; language: string }> = React.memo(({ label, language }) => (
  <Magnetic strength={0.15} radius={100}>
    <motion.button 
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,1)', color: 'rgba(0,0,0,1)' }}
      className="text-[10px] uppercase tracking-widest-3x font-black text-white px-8 py-3 rounded-full border border-white/15 transition-all duration-700"
    >
      <AnimatePresence mode="wait">
        <motion.span key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  </Magnetic>
));
