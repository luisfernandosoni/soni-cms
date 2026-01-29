
import React, { createContext, useContext, useEffect, useMemo, useRef, useCallback } from 'react';
import { useMotionValue, MotionValue, useVelocity, useTransform, useSpring } from 'motion/react';
import { useMobileMagic } from '../hooks/useMobileMagic';

interface RectCache {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface KineticContextType {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  velX: MotionValue<number>;
  velY: MotionValue<number>;
  isMobile: boolean;
  registerElement: (id: string, ref: React.RefObject<HTMLElement | null>) => void;
  getRect: (id: string) => RectCache | null;
}

const KineticContext = createContext<KineticContextType | undefined>(undefined);

export const KineticProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobile, virtualX, virtualY, requestGyroAccess } = useMobileMagic();
  
  const desktopX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const desktopY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  const gyroSpringConfig = { damping: 30, stiffness: 100, mass: 0.5 };
  const smoothVirtualX = useSpring(virtualX, gyroSpringConfig);
  const smoothVirtualY = useSpring(virtualY, gyroSpringConfig);

  const finalX = useTransform(isMobile ? smoothVirtualX : desktopX, (v) => Math.round(v * 1000) / 1000);
  const finalY = useTransform(isMobile ? smoothVirtualY : desktopY, (v) => Math.round(v * 1000) / 1000);

  const velX = useVelocity(finalX);
  const velY = useVelocity(finalY);

  const rects = useRef<Map<string, RectCache>>(new Map());
  const elements = useRef<Map<string, React.RefObject<HTMLElement | null>>>(new Map());
  const visibleEntries = useRef<Set<string>>(new Set());

  const updateRects = useCallback(() => {
    // Phase 1: Batched Read
    const entriesToMeasure = visibleEntries.current.size > 0 
      ? Array.from(visibleEntries.current) 
      : Array.from(elements.current.keys()); // Fallback to all if observer hasn't fired yet

    entriesToMeasure.forEach((id) => {
      const ref = elements.current.get(id);
      if (ref?.current) {
        const r = ref.current.getBoundingClientRect();
        rects.current.set(id, {
          left: r.left + window.scrollX,
          top: r.top + window.scrollY,
          width: r.width,
          height: r.height
        });
      }
    });
  }, []);

  const observer = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = (entry.target as HTMLElement).dataset.kineticId;
        if (id) {
          if (entry.isIntersecting) {
            visibleEntries.current.add(id);
            // Trigger measurement immediately when entering viewport
            updateRects();
          } else {
            visibleEntries.current.delete(id);
          }
        }
      });
    }, { rootMargin: '400px' }); // Increased margin for smoother activation
  }, [updateRects]);

  useEffect(() => {
    if (!isMobile) {
      const handlePointerMove = (e: PointerEvent) => {
        desktopX.set(e.clientX);
        desktopY.set(e.clientY);
      };
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      return () => window.removeEventListener('pointermove', handlePointerMove);
    } else {
      const unlock = () => { requestGyroAccess(); window.removeEventListener('touchstart', unlock); };
      window.addEventListener('touchstart', unlock);
    }
  }, [isMobile, desktopX, desktopY, requestGyroAccess]);

  useEffect(() => {
    let frameId: number;
    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateRects);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    if (document.fonts) {
      document.fonts.ready.then(updateRects);
    }

    const timer = setTimeout(updateRects, 50); // Faster initial burst

    return () => {
      cancelAnimationFrame(frameId);
      observer?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
    };
  }, [observer, updateRects]);

  const registerElement = useCallback((id: string, ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      ref.current.dataset.kineticId = id;
      elements.current.set(id, ref);
      observer?.observe(ref.current);
      
      // CRITICAL FIX: Force immediate measurement on registration
      requestAnimationFrame(updateRects);
    }
  }, [observer, updateRects]);

  const value = useMemo(() => ({
    mouseX: finalX,
    mouseY: finalY,
    velX,
    velY,
    isMobile,
    registerElement,
    getRect: (id: string) => rects.current.get(id) || null
  }), [finalX, finalY, velX, velY, isMobile, registerElement]);

  return (
    <KineticContext.Provider value={value}>
      {children}
    </KineticContext.Provider>
  );
};

export const useKinetic = () => {
  const context = useContext(KineticContext);
  if (!context) throw new Error('useKinetic must be used within a KineticProvider');
  return context;
};

export const useRelativeMotion = (id: string, ref: React.RefObject<HTMLElement | null>) => {
  const { mouseX, mouseY, getRect, registerElement } = useKinetic();

  useEffect(() => {
    registerElement(id, ref);
  }, [id, ref, registerElement]);

  const relX = useTransform([mouseX], ([x]: any[]) => {
    const rect = getRect(id);
    if (!rect) return 0.5;
    const actualX = (x as number) - (rect.left - window.scrollX);
    return Math.max(0, Math.min(1, actualX / rect.width));
  });

  const relY = useTransform([mouseY], ([y]: any[]) => {
    const rect = getRect(id);
    if (!rect) return 0.5;
    const actualY = (y as number) - (rect.top - window.scrollY);
    return Math.max(0, Math.min(1, actualY / rect.height));
  });

  const isOver = useTransform([mouseX, mouseY], ([x, y]: number[]) => {
    const rect = getRect(id);
    if (!rect) return 1; // Default to active if rect not yet measured to prevent static frames
    const l = rect.left - window.scrollX;
    const t = rect.top - window.scrollY;
    const over = (
      x >= l &&
      x <= l + rect.width &&
      y >= t &&
      y <= t + rect.height
    );
    return (over ? 1 : 0) as number;
  });

  return { relX, relY, isOver };
};
