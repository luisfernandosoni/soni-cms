
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Magnetic } from '../Magnetic.tsx';
import { Logo } from '../Logo.tsx';
import { Language } from '../../types.ts';

const transition = { 
  duration: 0.4, 
  ease: [0.16, 1, 0.3, 1] as const 
};

export const NavBranding: React.FC = React.memo(() => (
  <Magnetic strength={0.15} radius={100}>
    <a href="#" className="flex items-center group cursor-pointer relative">
      <Logo size={40} />
    </a>
  </Magnetic>
));

export const NavLinkItem: React.FC<{ 
  item: string; 
  label: string; 
  language: string;
}> = React.memo(({ item, label, language }) => (
  <Magnetic strength={0.25} radius={80}>
    <a
      href={`#${item}`}
      className="px-6 py-2 text-secondary hover:text-text transition-colors relative group uppercase text-nano font-bold tracking-widest-3x block"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={transition}
          className="block"
        >
          {label}
        </motion.span>
      </AnimatePresence>
      <motion.span 
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-accent transition-all duration-500 group-hover:w-1/2" 
      />
    </a>
  </Magnetic>
));

export const NavLanguageSwitcher: React.FC<{
  current: Language;
  onSelect: (lang: Language) => void;
}> = React.memo(({ current, onSelect }) => (
  <div className="flex bg-subtle/50 rounded-full p-1.5 border border-white/5 backdrop-blur-md">
    {(['en', 'es'] as const).map((lang) => (
      <button
        key={lang}
        onClick={() => onSelect(lang)}
        className={`px-5 py-2 rounded-full text-[11px] font-black uppercase transition-all duration-500 ${
          current === lang 
          ? 'bg-accent text-accent-contrast shadow-xl' 
          : 'text-secondary hover:text-text'
        }`}
      >
        {lang}
      </button>
    ))}
  </div>
));

export const NavCTA: React.FC<{ 
  label: string; 
  language: string;
}> = React.memo(({ label, language }) => (
  <Magnetic strength={0.1} radius={120}>
    <a
      href="#contact"
      className="hidden md:block bg-accent text-accent-contrast px-10 py-4 rounded-full hover:shadow-2xl hover:shadow-accent/20 transition-all font-black text-nano uppercase tracking-widest-3x overflow-hidden relative"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={transition}
          className="block relative z-10"
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </a>
  </Magnetic>
));
