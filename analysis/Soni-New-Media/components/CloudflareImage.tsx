
import React, { useState } from 'react';
import { motion } from 'motion/react';

const ASSET_DOMAIN = 'https://assets.soninewmedia.com';

interface CloudflareImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  name: string;
  priority?: boolean;
  width?: number;
  quality?: number;
}

/**
 * CloudflareImage V2 - Fail-Safe Edition
 * Includes automatic error detection and fallback UI.
 */
export const CloudflareImage: React.FC<CloudflareImageProps> = ({
  name,
  className = '',
  priority = false,
  width,
  quality = 90,
  alt,
  ...props
}) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const transformOptions = [
    'format=auto',
    `quality=${quality}`,
    'metadata=none',
    width ? `width=${width}` : '',
  ].filter(Boolean).join(',');

  const src = `${ASSET_DOMAIN}/cdn-cgi/image/${transformOptions}/${name}`;

  return (
    <div className={`relative overflow-hidden bg-subtle/20 flex items-center justify-center ${className}`}>
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-subtle p-4 text-center">
          <span className="material-icons-outlined text-lg mb-2 opacity-20">image_not_supported</span>
          <span className="text-[8px] uppercase tracking-widest text-secondary/40">Asset_Unavailable</span>
        </div>
      )}
      
      {status === 'loading' && (
        <div className="absolute inset-0 bg-subtle/50 animate-pulse" />
      )}

      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: status === 'loaded' ? 1 : 0, 
          scale: status === 'loaded' ? 1 : 1.05,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-ignore
        fetchpriority={priority ? "high" : "auto"}
        className="w-full h-full object-cover"
        {...props}
      />
    </div>
  );
};
