import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// #MCRD: Plugin de Saneamiento de Entorno
const stripFallbacks = () => {
  return {
    name: 'mcrd-strip-fallbacks',
    transformIndexHtml(html: string) {
      return html.replace(/<!-- ::FALLBACK_START:: -->[\s\S]*?<!-- ::FALLBACK_END:: -->/gi, '');
    },
  };
};

// Plugin 2: Inyecta el CSS nativo SOLO en el build (FIX PANTALLA NEGRA)
const injectCss = () => {
  return {
    name: 'mcrd-inject-css',
    transform(code: string, id: string) {
      // Si el archivo es index.tsx, le pegamos el import del CSS al principio
      if (id.endsWith('index.tsx')) {
        return "import './index.css';\n" + code;
      }
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    stripFallbacks(),
    injectCss()
  ],
  base: './',
  root: '.',
  build: {
    outDir: 'dist',
    // #MCRD OPTIMIZATION: Minificación agresiva
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: 'index.html',
      output: {
        // Estrategia de Cacheo de Largo Plazo
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'motion-engine': ['motion/react'], // Aislamos el motor de animación (es pesado)
          // Si usas otras librerías pesadas (ej. three.js), agrégalas aquí.
        }
      }
    },
  },
  server: {
    port: 3000,
    host: true,
    // Proxy para integración con Payload CMS
    // En desarrollo, redirige las rutas del CMS al servidor de producción
    proxy: {
      // API calls al CMS (latest transmissions, search, etc)
      '/api': {
        target: 'https://soni-cms.soniglf.workers.dev',
        changeOrigin: true,
        secure: true,
        // Reescribe cookies para desarrollo local
        cookieDomainRewrite: 'localhost',
      },
      // Admin panel del CMS - Optional for local dev
      '/admin': {
        target: 'https://soni-cms.soniglf.workers.dev',
        changeOrigin: true,
        secure: true,
      },
      // Next.js static assets for CMS admin/preview
      '/_next': {
        target: 'https://soni-cms.soniglf.workers.dev',
        changeOrigin: true,
        secure: true,
      }
    },
  },
});
