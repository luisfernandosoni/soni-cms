
import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { SentinelCore } from './SentinelCore.tsx';
import { HeroTag, HeroTitle, HeroDescription, HeroActions } from './hero/Atoms.tsx';

const Hero: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="relative w-full min-h-[100vh] flex flex-col items-center justify-center bg-background pt-32 lg:pt-40 pb-20 overflow-hidden">
       {/* Master Grid: Columna Coincidente Logic */}
       <div className="max-w-8xl w-full mx-auto px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-stretch relative z-10">
          
          {/* Columna Izquierda: Content Stack */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left h-full relative z-20">
            <div className="space-y-12 lg:space-y-16">
              <HeroTag 
                label={t('hero.tag')} 
                language={language} 
              />
              
              <HeroTitle 
                t1={t('hero.title1')} 
                t2={t('hero.title2')} 
                t3={t('hero.title3')} 
                language={language} 
              />

              <HeroDescription 
                text={t('hero.desc')} 
                language={language} 
              />
            </div>

            <HeroActions 
              btnLabel={t('hero.btn')} 
              reelLabel={t('hero.reel')} 
              language={language} 
            />
          </div>

          {/* Columna Derecha: Sentinel Core (Anchored to content height via Grid items-stretch) */}
          <div className="lg:col-span-7 relative min-h-[400px]">
             <SentinelCore />
          </div>
       </div>
    </section>
  );
};

export default Hero;
