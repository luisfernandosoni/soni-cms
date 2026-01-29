
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Magnetic } from '../Magnetic.tsx';

const transition = { 
  duration: 0.5, 
  ease: [0.16, 1, 0.3, 1] as const 
};

const variant = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 }
};

export const HeroTag: React.FC<{ label: string; language: string }> = React.memo(({ label, language }) => (
  <div className="relative">
    <AnimatePresence mode="wait">
      <motion.div key={language} {...variant} transition={transition}>
        <div className="inline-flex items-center gap-5 px-5 py-2 rounded-full border border-white/10 bg-white/[0.04]">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest-3x text-white/50">
            {label}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
));

export const HeroTitle: React.FC<{ 
  t1: string; 
  t2: string; 
  t3: string; 
  language: string 
}> = React.memo(({ t1, t2, t3, language }) => (
  <div className="relative">
    <AnimatePresence mode="wait">
      <motion.h1
        key={language}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -25 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        className="font-display text-h1-fluid font-medium leading-[0.85] tracking-tighter text-text"
      >
        <span className="block">{t1}</span>
        <span className="block text-secondary italic">{t2}</span>
        <span className="block">{t3}</span>
      </motion.h1>
    </AnimatePresence>
  </div>
));

export const HeroDescription: React.FC<{ text: string; language: string }> = React.memo(({ text, language }) => (
  <div className="relative max-w-sm">
    <AnimatePresence mode="wait">
      <motion.p 
        key={language} 
        {...variant} 
        transition={transition}
        className="text-body-fluid text-secondary leading-relaxed opacity-50 font-light"
      >
        {text}
      </motion.p>
    </AnimatePresence>
  </div>
));

export const HeroActions: React.FC<{ 
  btnLabel: string; 
  reelLabel: string; 
  language: string 
}> = React.memo(({ btnLabel, reelLabel, language }) => (
  <div className="flex flex-wrap items-center gap-6 mt-16">
    <Magnetic strength={0.12} radius={120}>
      <motion.a 
        href="#work" 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative bg-white text-black px-8 py-3.5 lg:px-10 lg:py-4 rounded-full font-black text-[10px] uppercase tracking-widest-3x shadow-lg block"
      >
        <AnimatePresence mode="wait">
          <motion.span key={language} {...variant} transition={transition} className="relative z-10 block">
            {btnLabel}
          </motion.span>
        </AnimatePresence>
      </motion.a>
    </Magnetic>

    <Magnetic strength={0.08} radius={100}>
      <motion.button 
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
        className="px-8 py-3.5 lg:px-10 lg:py-4 rounded-full font-black text-[10px] uppercase tracking-widest-3x text-text border border-white/15 flex items-center gap-5 group"
      >
        <span className="material-icons-outlined text-lg opacity-60 group-hover:opacity-100 transition-opacity">play_circle</span>
        <AnimatePresence mode="wait">
          <motion.span key={language} {...variant} transition={transition} className="block">
            {reelLabel}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </Magnetic>
  </div>
));
