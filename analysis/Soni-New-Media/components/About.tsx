
import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { AboutTag, AboutLead, AboutTitle, AboutManifesto } from './about/Atoms.tsx';

const About: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="about" className="py-32 lg:py-56 bg-background relative overflow-hidden scroll-mt-20">
      <div className="max-w-8xl mx-auto px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 items-start">
          
          {/* Narrative Column: The Context Stack */}
          <div className="lg:col-span-4 space-y-20">
            <AboutTag 
              label={t('about.tag')} 
              language={language} 
            />
            
            <AboutLead 
              text={t('about.desc')} 
              language={language} 
            />
          </div>

          {/* Vision Column: The Manifest Matrix */}
          <div className="lg:col-span-8">
            <AboutTitle 
              text={t('about.title')} 
              language={language} 
            />
            
            <AboutManifesto 
              text={t('about.manifesto')} 
              language={language} 
            />
          </div>
        </div>

        {/* Neural Depth Layer */}
        <div className="absolute bottom-0 right-0 w-[1200px] h-[1200px] bg-accent/[0.01] blur-[250px] rounded-full pointer-events-none -z-10" />
      </div>
    </section>
  );
};

export default About;
