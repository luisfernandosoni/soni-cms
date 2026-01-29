
import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ServiceItem } from '../types.ts';
import { ServiceCard } from './ServiceCard.tsx';
import { ServicesTag, ServicesTitle, ServicesLead } from './services/SectionAtoms.tsx';

const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const services: ServiceItem[] = t('services.items') || [];

  return (
    <section id="services" className="py-24 lg:py-40 bg-background relative transition-colors duration-500 overflow-hidden scroll-mt-20">
      <div className="absolute top-0 right-0 w-[2000px] h-[2000px] bg-white/[0.01] blur-[300px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-8xl mx-auto px-10 lg:px-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-48">
          <div className="space-y-12 max-w-4xl">
            <ServicesTag 
              label={t('services.tag')} 
              language={language} 
            />
            
            <ServicesTitle 
              text={t('services.title')} 
              language={language} 
            />
          </div>
          
          <ServicesLead 
            text={t('services.desc')} 
            language={language} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              item={service} 
              index={index} 
            />
          ))}
          
          <ServiceCard 
            index={services.length}
            isCTA={true}
            ctaTitle={t('services.custom')}
            ctaDesc={t('services.customDesc')}
            ctaBtn={t('services.cta')}
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
