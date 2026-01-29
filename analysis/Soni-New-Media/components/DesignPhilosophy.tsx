
import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { PhilosophyIcon, PhilosophyQuote, PhilosophyCitation } from './philosophy/PhilosophyAtoms.tsx';

/**
 * DesignPhilosophy - The Core Manifest (2026)
 * A high-fidelity typographic section focused on emotional resonance 
 * and structural minimalism.
 */
const DesignPhilosophy: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-48 lg:py-64 bg-surface border-y border-border transition-colors duration-500 overflow-hidden relative">
      {/* Visual Hook: Kinetic Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-10 text-center relative z-10">
        <PhilosophyIcon />
        
        <PhilosophyQuote 
          text={t('philosophy.quote')} 
          language={language} 
        />
        
        <PhilosophyCitation 
          text={t('philosophy.tag')} 
          language={language} 
        />
      </div>
    </section>
  );
};

export default DesignPhilosophy;
