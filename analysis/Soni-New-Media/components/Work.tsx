
import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { WorkItem } from '../types.ts';
import { WorkTag, WorkTitle, WorkLead, WorkAction } from './work/SectionAtoms.tsx';
import { WorkCard } from './work/GalleryAtoms.tsx';

const works: WorkItem[] = [
  { 
    id: '1', 
    title: 'Neural Cinema v.01', 
    category: 'Hybrid Filmmaking Prototype', 
    year: '2026', 
    image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1600', 
    wide: true 
  },
  { id: '2', title: 'Media Sovereignty', category: 'Autonomous New Media Engine', year: '2025', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', wide: false },
  { id: '3', title: 'Aetheric Archive', category: 'Spatial Cinematic Experience', year: '2026', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', wide: false },
  { id: '4', title: 'Cybernetic Fauna', category: 'Generative Creature Design', year: '2025', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800', wide: false }
];

const Work: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="work" className="py-24 lg:py-40 bg-background overflow-hidden scroll-mt-20">
      <div className="max-w-8xl mx-auto px-10 lg:px-20">
        
        {/* Archive Branding Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-48 border-l-[1px] border-white/20 pl-16">
          <div className="space-y-12 max-w-5xl">
            <WorkTag label={t('work.tag')} language={language} />
            <WorkTitle text={t('work.title')} language={language} />
          </div>
          
          <div className="mt-16 md:mt-0 text-right">
             <WorkLead text={t('work.desc')} language={language} />
             <WorkAction label={t('work.viewArchive')} language={language} />
          </div>
        </div>

        {/* Artifact Grid Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-32">
          {works.map((work) => (
            <WorkCard key={work.id} item={work} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
