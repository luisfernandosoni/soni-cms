import { useEffect, useState, useRef } from 'react';
import { useMotionValue } from 'motion/react';

export const useMobileMagic = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [gyroAvailable, setGyroAvailable] = useState(false);

  // Inicializamos en el CENTRO para evitar que el aura se pegue en la esquina (0,0) al cargar
  const virtualX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const virtualY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  // Referencias para el algoritmo de "Centro Flotante"
  const refBeta = useRef<number | null>(null);
  const refGamma = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(isTouch);
      
      // Si redimensionan (rotan pantalla), recentramos
      if (isTouch) {
        virtualX.set(window.innerWidth / 2);
        virtualY.set(window.innerHeight / 2);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      setGyroAvailable(true);

      const currentBeta = event.beta; 
      const currentGamma = event.gamma;

      // 1. Inicialización (Primera lectura es el centro)
      if (refBeta.current === null || refGamma.current === null) {
        refBeta.current = currentBeta;
        refGamma.current = currentGamma;
        return;
      }

      // 2. Algoritmo "Soft Drift" (Recalibración silenciosa)
      // Si mantienes el cel inclinado, el centro se mueve hacia ti lentamente.
      const driftFactor = 0.02;
      refBeta.current += (currentBeta - refBeta.current) * driftFactor;
      refGamma.current += (currentGamma - refGamma.current) * driftFactor;

      // 3. Cálculo del Delta
      const deltaBeta = currentBeta - refBeta.current;
      const deltaGamma = currentGamma - refGamma.current;

      // 4. Sensibilidad (25 grados = Pantalla completa)
      const MAX_TILT = 25; 

      // Mapeo a Coordenadas de Pantalla
      const x = (window.innerWidth / 2) + ((deltaGamma / MAX_TILT) * (window.innerWidth / 2));
      const y = (window.innerHeight / 2) + ((deltaBeta / MAX_TILT) * (window.innerHeight / 2));

      // 5. Límites (Clamping)
      const clampedX = Math.max(0, Math.min(window.innerWidth, x));
      const clampedY = Math.max(0, Math.min(window.innerHeight, y));

      virtualX.set(clampedX);
      virtualY.set(clampedY);
    };

    if (isMobile) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isMobile, virtualX, virtualY]);

  const requestGyroAccess = async () => {
    // @ts-ignore
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') setGyroAvailable(true);
      } catch (e) {
        console.error("Gyro error:", e);
      }
    }
  };

  return { isMobile, gyroAvailable, virtualX, virtualY, requestGyroAccess };
};