
import React, { useRef } from 'react';
import { motion, useTime, useTransform, useInView } from 'motion/react';
import { ServiceItem } from '../types.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { KineticSurface } from './kinetic/KineticSurface.tsx';
import { KineticLayer } from './kinetic/KineticLayer.tsx';
import { ServiceCardHeader, ServiceCardBody, ServiceCardFooter } from './services/CardAtoms.tsx';

interface ServiceCardProps {
  item?: ServiceItem;
  index: number;
  isCTA?: boolean;
  ctaTitle?: string;
  ctaDesc?: string;
  ctaBtn?: string;
}

const ServiceCardEngine: React.FC<ServiceCardProps> = ({ 
  item, index, isCTA = false, ctaTitle, ctaDesc, ctaBtn
}) => {
  const time = useTime();
  const { language } = useLanguage();

  const idleBreathe = useTransform(time, (t: number) => 1 + Math.sin((t + index * 500) / 5000) * 0.003);
  
  const theme = isCTA ? {
    container: "text-black",
    bg: "bg-white",
    subtext: "text-black/70",
    line: "bg-black/10",
    shadow: "hover:shadow-[0_80px_160px_rgba(255,255,255,0.18)]",
    border: "border-white/20"
  } : {
    container: "text-white",
    bg: "bg-[#0E0E0E]",
    subtext: "text-white/60",
    line: "bg-white/10",
    shadow: "hover:shadow-[0_50px_100px_rgba(0,0,0,0.8)]",
    border: "border-white/15"
  };

  return (
    <KineticSurface 
      strength={16} 
      shineIntensity={isCTA ? 0.04 : 0.22}
      className={`w-full h-full p-12 lg:p-14 rounded-[52px] border ${theme.border} flex flex-col ${theme.container} ${theme.shadow} transition-shadow duration-1000 overflow-hidden relative shadow-2xl`}
    >
      {/* Background Plane with Physics */}
      <motion.div 
        style={{ scale: idleBreathe } as any} 
        className={`absolute inset-0 rounded-[52px] pointer-events-none ${theme.bg} shadow-[inset_0_0_60px_rgba(0,0,0,0.02)]`}
      />

      <ServiceCardHeader item={item} isCTA={isCTA} />

      <ServiceCardBody 
        title={isCTA ? ctaTitle! : item!.title}
        description={isCTA ? ctaDesc! : item!.description}
        language={language}
        isCTA={isCTA}
        subtextClass={theme.subtext}
      />

      <ServiceCardFooter 
        isCTA={isCTA}
        language={language}
        btnText={ctaBtn}
        lineClass={theme.line}
      />

      {/* Surface Specularity (Limited to Dark Cards for OLED depth) */}
      {!isCTA && (
        <KineticLayer depth={5} className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute inset-0 border-[1.5px] border-white/20 rounded-[52px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            style={{
              maskImage: `radial-gradient(500px circle at var(--mx) var(--my), black, transparent 75%)`,
              WebkitMaskImage: `radial-gradient(500px circle at var(--mx) var(--my), black, transparent 75%)`
            } as any}
          />
        </KineticLayer>
      )}
    </KineticSurface>
  );
};

export const ServiceCard: React.FC<ServiceCardProps> = (props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(scrollRef, { margin: "200px", once: false });

  return (
    <div
      ref={scrollRef}
      className="relative h-[560px] group transition-opacity duration-700"
    >
      {isInView ? (
        <ServiceCardEngine {...props} />
      ) : (
        <div className="w-full h-full rounded-[52px] border border-white/5 bg-white/[0.01]" />
      )}
    </div>
  );
};
