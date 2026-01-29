
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

export const AboutTag: React.FC<{ label: string; language: string }> = React.memo(({ label, language }) => (
  <div className="relative min-h-[50px]">
    <AnimatePresence mode="wait">
      <motion.div key={language} {...variant} transition={transition}>
        <div className="inline-flex items-center gap-8 px-8 py-3.5 rounded-full border border-accent/10 bg-accent/[0.04]">
          <span className="text-nano font-black uppercase tracking-widest-3x text-accent/60">
            {label}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
));

export const AboutLead: React.FC<{ text: string; language: string }> = React.memo(({ text, language }) => (
  <div className="space-y-12">
    <div className="relative min-h-[120px]">
      <AnimatePresence mode="wait">
        <motion.p key={language} {...variant} transition={transition}>
          <span className="text-body-fluid text-secondary leading-relaxed font-light opacity-80 max-w-sm block">
            {text}
          </span>
        </motion.p>
      </AnimatePresence>
    </div>
    <div className="h-[2px] w-24 bg-accent/20" />
  </div>
));

export const AboutTitle: React.FC<{ text: string; language: string }> = React.memo(({ text, language }) => (
  <AnimatePresence mode="wait">
    <motion.h2 
      key={language} 
      {...variant} 
      transition={{ ...transition, duration: 0.5 }}
      className="font-display text-h2-fluid font-medium text-text mb-20 lg:mb-32"
    >
      {text}
    </motion.h2>
  </AnimatePresence>
));

export const AboutManifesto: React.FC<{ text: string; language: string }> = React.memo(({ text, language }) => (
  <AnimatePresence mode="wait">
    <motion.p 
      key={language} 
      {...variant} 
      transition={{ ...transition, duration: 0.5 }}
      className="text-h3-fluid text-secondary font-light leading-relaxed max-w-3xl opacity-80"
    >
      {text}
    </motion.p>
  </AnimatePresence>
));
