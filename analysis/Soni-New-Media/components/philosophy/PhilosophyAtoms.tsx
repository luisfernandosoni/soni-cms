
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

const transition = { 
  duration: 0.8, 
  ease: [0.16, 1, 0.3, 1] as const 
};

export const PhilosophyIcon: React.FC = React.memo(() => (
  <motion.span 
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 0.3, scale: 1 }}
    viewport={{ once: true }}
    className="material-icons-outlined text-5xl mb-16 text-secondary/30 block"
  >
    format_quote
  </motion.span>
));

export const PhilosophyQuote: React.FC<{ text: string; language: string }> = React.memo(({ text, language }) => (
  <div className="relative min-h-[4em] md:min-h-[3em] flex items-center justify-center">
    <AnimatePresence mode="wait">
      <motion.blockquote 
        key={language}
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
        transition={transition}
        className="font-display text-4xl md:text-6xl font-light leading-[1.1] mb-16 text-text tracking-tight max-w-5xl mx-auto"
      >
        {text}
      </motion.blockquote>
    </AnimatePresence>
  </div>
));

export const PhilosophyCitation: React.FC<{ text: string; language: string }> = React.memo(({ text, language }) => (
  <div className="relative min-h-[1.5em]">
    <AnimatePresence mode="wait">
      <motion.cite 
        key={language}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ ...transition, delay: 0.1 }}
        className="not-italic text-nano font-black tracking-widest-3x uppercase text-secondary block"
      >
        {text}
      </motion.cite>
    </AnimatePresence>
  </div>
));
