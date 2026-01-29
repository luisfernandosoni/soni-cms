
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KineticLayer } from '../kinetic/KineticLayer.tsx';
import { ServiceItem } from '../../types.ts';

const textVariant = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 }
};

const textTransition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

export const ServiceCardHeader: React.FC<{ item?: ServiceItem; isCTA: boolean }> = React.memo(({ item, isCTA }) => (
  <div className="flex justify-between items-start mb-16 pointer-events-none relative z-20">
    <KineticLayer depth={120}>
      {isCTA ? (
        <span className="text-[10px] font-mono font-black text-black/50 tracking-widest-3x uppercase pt-2">System_Core</span>
      ) : (
        <div className="w-20 h-20 rounded-[32px] bg-[#1A1A1A] border border-white/10 flex items-center justify-center relative overflow-hidden group/icon shadow-inner">
           <span className="material-icons-outlined text-3xl text-white group-hover:scale-110 transition-transform duration-700">{item?.icon}</span>
        </div>
      )}
    </KineticLayer>
    
    <KineticLayer depth={180}>
      <span className={`text-[12px] font-mono font-bold tracking-[0.4em] transition-colors duration-700 ${isCTA ? 'text-black/40' : 'text-white/30'}`}>
        {isCTA ? '///' : item?.number.split('').join(' ')}
      </span>
    </KineticLayer>
  </div>
));

export const ServiceCardBody: React.FC<{ 
  title: string; 
  description: string; 
  language: string; 
  isCTA: boolean;
  subtextClass: string;
}> = React.memo(({ title, description, language, isCTA, subtextClass }) => (
  <div className="flex-grow flex flex-col pointer-events-none">
    <KineticLayer depth={100} className="mb-6">
      <AnimatePresence mode="wait">
        <motion.h3 
          key={language} 
          {...textVariant} 
          transition={textTransition} 
          className={`text-h3-fluid font-display leading-tight tracking-tight w-full ${isCTA ? 'font-bold' : 'font-medium'}`}
        >
          {title}
        </motion.h3>
      </AnimatePresence>
    </KineticLayer>
    
    <KineticLayer depth={60}>
      <AnimatePresence mode="wait">
        <motion.p 
          key={language} 
          {...textVariant} 
          transition={{ ...textTransition, delay: 0.1 }} 
          className={`text-body-fluid leading-relaxed transition-colors duration-1000 max-w-full w-full ${isCTA ? 'font-medium opacity-80' : 'font-light'} ${subtextClass}`}
        >
          {description}
        </motion.p>
      </AnimatePresence>
    </KineticLayer>
  </div>
));

export const ServiceCardFooter: React.FC<{ 
  isCTA: boolean; 
  language: string; 
  btnText?: string; 
  lineClass: string;
}> = React.memo(({ isCTA, language, btnText, lineClass }) => (
  <>
    <KineticLayer depth={20} className="mt-12">
       <div className={`w-full h-[1.5px] rounded-full mx-auto max-w-[90%] ${lineClass}`} />
    </KineticLayer>

    {isCTA && (
      <KineticLayer depth={220} className="relative pt-10 flex justify-center w-full">
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          className="inline-flex items-center gap-5 bg-black text-white px-12 py-5 rounded-full transition-all duration-700 shadow-2xl group/btn cursor-pointer pointer-events-auto"
        >
          <AnimatePresence mode="wait">
            <motion.span key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={textTransition} className="uppercase tracking-widest-3x text-[10px] font-black block">
              {btnText}
            </motion.span>
          </AnimatePresence>
          <span className="material-icons-outlined text-lg">bolt</span>
        </motion.div>
      </KineticLayer>
    )}
  </>
));
