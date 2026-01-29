
import React, { useRef, useId } from 'react';
import { motion, useInView } from 'motion/react';
import { WorkItem } from '../../types.ts';
import { KineticSurface } from '../kinetic/KineticSurface.tsx';
import { ArchiveMedia, ArchiveOverlay, ArchiveFooter, ArchiveSpecularity } from './WorkAtoms.tsx';

interface WorkCardProps {
  item: WorkItem;
}

const WorkCardEngine: React.FC<{ item: WorkItem; cardId: string }> = ({ item, cardId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      className="w-full h-full flex flex-col group cursor-none"
    >
      <KineticSurface
        id={cardId}
        strength={10}
        shineIntensity={0.12}
        className="overflow-hidden rounded-[40px] bg-[#0A0A0A] border border-white/5 shadow-2xl transition-shadow duration-1000 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
      >
        <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[480px] overflow-hidden">
          <ArchiveMedia item={item} />
          <ArchiveOverlay item={item} />
          <ArchiveSpecularity />
        </div>
      </KineticSurface>

      <ArchiveFooter item={item} />
    </motion.div>
  );
};

export const WorkCard: React.FC<WorkCardProps> = React.memo(({ item }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardId = useId();
  const isInView = useInView(scrollRef, { margin: "200px", once: false });

  return (
    <div
      ref={scrollRef}
      className={`relative min-h-[400px] ${item.wide ? 'col-span-1 lg:col-span-2' : 'col-span-1'}`}
    >
      {isInView ? (
        <WorkCardEngine item={item} cardId={cardId} />
      ) : (
        <div className="w-full h-[480px] bg-white/[0.02] border border-white/5 rounded-[40px] animate-pulse" />
      )}
    </div>
  );
});
