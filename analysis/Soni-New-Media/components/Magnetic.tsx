
import React, { useRef } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { useKinetic } from '../context/KineticContext.tsx';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({ 
  children, 
  strength = 0.35, 
  radius = 180,
  className = "" 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { mouseX, mouseY } = useKinetic();
  
  const springConfig = { damping: 25, stiffness: 200, mass: 0.6 };

  // Reactive distance-based magnetism
  const magneticValues = useTransform([mouseX, mouseY], ([mx, my]) => {
    if (!ref.current) return { x: 0, y: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (mx as number) - centerX;
    const deltaY = (my as number) - centerY;
    const dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    
    if (dist < radius) {
      const power = (1 - dist / radius);
      return {
        x: deltaX * strength * power,
        y: deltaY * strength * power
      };
    }
    return { x: 0, y: 0 };
  });

  const magneticX = useTransform(magneticValues, (v) => v.x);
  const magneticY = useTransform(magneticValues, (v) => v.y);

  const springX = useSpring(magneticX, springConfig);
  const springY = useSpring(magneticY, springConfig);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
