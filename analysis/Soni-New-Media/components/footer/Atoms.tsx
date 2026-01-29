
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../Logo.tsx';

const textVariant = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 }
};

const textTransition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

export const FooterCTA: React.FC<{ title: string; email: string; language: string }> = React.memo(({ title, email, language }) => (
  <div className="max-w-5xl">
    <AnimatePresence mode="wait">
      <motion.div
        key={language}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <h2 className="font-display text-h2-fluid font-medium text-text mb-24">
          {title}
        </h2>
        <a 
          href={`mailto:${email}`}
          className="inline-flex items-center text-h3-fluid font-light border-b-[3px] border-text/15 pb-4 hover:text-text hover:border-text transition-all text-secondary"
        >
          {email}
        </a>
      </motion.div>
    </AnimatePresence>
  </div>
));

export const FooterNavGroup: React.FC<{ 
  label: string; 
  items: string[]; 
  language: string; 
  links?: Record<string, string>;
  isI18n?: boolean;
  t?: (key: string) => string;
}> = React.memo(({ label, items, language, links, isI18n, t }) => (
  <div className="min-w-[160px]">
    <div className="relative min-h-[2.5em] mb-12">
      <AnimatePresence mode="wait">
        <motion.h4 
          key={language} 
          {...textVariant} 
          transition={textTransition} 
          className="font-black text-label-fluid uppercase tracking-widest-3x text-secondary w-full"
        >
          {label}
        </motion.h4>
      </AnimatePresence>
    </div>
    <ul className="space-y-8 text-body-fluid text-secondary/80">
      {items.map((item, idx) => (
        <li key={item} className="relative min-h-[1.5em]">
          <AnimatePresence mode="wait">
            <motion.a 
              key={language}
              {...textVariant}
              transition={{ ...textTransition, delay: idx * 0.03 }}
              href={links?.[item] || `#${item.toLowerCase()}`} 
              className="hover:text-text transition-colors capitalize block w-full font-bold tracking-tight"
            >
              {isI18n && t ? t(`nav.${item}`) : item}
            </motion.a>
          </AnimatePresence>
        </li>
      ))}
    </ul>
  </div>
));

export const FooterLegal: React.FC<{ 
  language: string; 
  copyright: string; 
  privacy: string; 
  terms: string;
}> = React.memo(({ language, copyright, privacy, terms }) => (
  <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-border text-nano text-secondary/50">
    <div className="flex items-center gap-10 mb-10 md:mb-0">
      <Logo size={40} className="opacity-40 grayscale brightness-200 hover:opacity-100 hover:grayscale-0 transition-all duration-500" />
      <div className="relative min-w-[200px]">
        <AnimatePresence mode="wait">
          <motion.span 
            key={language} 
            {...textVariant} 
            transition={textTransition} 
            className="font-black tracking-widest-2x uppercase block"
          >
            {copyright}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
    <div className="flex gap-16 font-black uppercase tracking-widest-3x">
      <AnimatePresence mode="wait">
        <motion.div key={language} {...textVariant} transition={textTransition} className="flex gap-16">
          <a href="#" className="hover:text-text transition-colors">{privacy}</a>
          <a href="#" className="hover:text-text transition-colors">{terms}</a>
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
));
