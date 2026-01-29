
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

const transition = { 
  duration: 0.4, 
  ease: [0.16, 1, 0.3, 1] as const 
};

const variant = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 }
};

export const ServicesTag: React.FC<{ label: string; language: string }> = React.memo(({ label, language }) => (
  <div className="relative min-h-[40px]">
    <AnimatePresence mode="wait">
      <motion.div 
        key={language}
        {...variant}
        transition={transition}
        className="inline-flex items-center gap-6 px-8 py-3 rounded-full border border-white/10 bg-white/[0.05]"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
        <span className="text-nano font-black uppercase tracking-widest-3x text-white/70">
          {label}
        </span>
      </motion.div>
    </AnimatePresence>
  </div>
));

export const ServicesTitle: React.FC<{ text: string; language: string }> = React.memo(({ text, language }) => (
  <div className="relative min-h-[1.2em]">
    <AnimatePresence mode="wait">
      <motion.h2 
        key={language}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ ...transition, duration: 0.5 }}
        className="font-display text-h2-fluid font-medium text-white"
      >
        {text}
      </motion.h2>
    </AnimatePresence>
  </div>
));

export const ServicesLead: React.FC<{ text: string; language: string }> = React.memo(({ text, language }) => (
  <div className="relative min-h-[80px]">
    <AnimatePresence mode="wait">
      <motion.p 
        key={language}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ ...transition, delay: 0.1 }}
        className="text-body-fluid text-white/50 max-w-md mt-16 md:mt-0 text-left leading-relaxed font-light"
      >
        {text}
      </motion.p>
    </AnimatePresence>
  </div>
));
