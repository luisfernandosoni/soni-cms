
import React, { useMemo } from 'react';

/**
 * SpatialNodes V3 - Reactive Constellation
 * Balanced dividers for snappier deep-space parallax.
 */
export const SpatialNodes = React.memo(() => {
  const nodes = useMemo(() => Array.from({ length: 180 }).map((_, i) => {
    const seed = Math.random();
    let z, opacity, size, blur;

    if (seed > 0.7) { 
      z = Math.random() * -300 - 100;
      opacity = Math.random() * 0.4 + 0.3;
      size = Math.random() * 1.5 + 1;
      blur = 0;
    } else if (seed > 0.3) { 
      z = Math.random() * -600 - 400;
      opacity = Math.random() * 0.25 + 0.15;
      size = Math.random() * 1.2 + 0.5;
      blur = 1;
    } else { 
      z = Math.random() * -1200 - 1000;
      opacity = Math.random() * 0.15 + 0.05;
      size = Math.random() * 0.8 + 0.3;
      blur = 2;
    }
    
    return {
      id: i,
      top: `${Math.random() * 160 - 30}%`, 
      left: `${Math.random() * 160 - 30}%`,
      z,
      opacity,
      size,
      blur,
      // Optimized depth dividers for snappier response
      dividerX: (5.5 + Math.abs(z) / 220),
      dividerY: (7.5 + Math.abs(z) / 220)
    };
  }), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            position: 'absolute',
            top: node.top,
            left: node.left,
            translateZ: `${node.z}px`,
            opacity: node.opacity,
            width: `${node.size}px`,
            height: `${node.size}px`,
            backgroundColor: 'white',
            borderRadius: '50%',
            filter: node.blur > 0 ? `blur(${node.blur}px)` : 'none',
            // ZERO-JS GPU Transform
            transform: `translate3d(calc(var(--rx) * ${-node.z / node.dividerX}px), calc(var(--ry) * ${-node.z / node.dividerY}px), 0)`,
            willChange: 'transform'
          } as any}
        />
      ))}
    </div>
  );
});
