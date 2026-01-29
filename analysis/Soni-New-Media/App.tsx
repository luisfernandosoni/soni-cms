import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

import { LanguageProvider } from './context/LanguageContext.tsx';
import { KineticProvider } from './context/KineticContext.tsx';
import Navbar from './components/Navbar.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';

// Lazy load pages
const Home = lazy(() => import('./src/pages/Home.tsx'));
const Transmissions = lazy(() => import('./src/pages/Transmissions.tsx'));
const TransmissionDetail = lazy(() => import('./src/pages/TransmissionDetail.tsx'));

const PageLoader = () => <div className="fixed inset-0 bg-background z-40" />;

const App: React.FC = () => {
  const location = useLocation();

  return (
    <LanguageProvider>
      <KineticProvider>
        <div className="relative w-full min-h-screen bg-background text-text selection:bg-accent selection:text-background transition-colors duration-500 overflow-x-hidden">
          <CustomCursor />
          <Navbar />

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <Suspense fallback={<PageLoader />}>
                  <Home />
                </Suspense>
              } />

              <Route path="/transmissions" element={
                <Suspense fallback={<PageLoader />}>
                  <Transmissions />
                </Suspense>
              } />

              <Route path="/transmissions/:slug" element={
                <Suspense fallback={<PageLoader />}>
                  <TransmissionDetail />
                </Suspense>
              } />
            </Routes>
          </AnimatePresence>
        </div>
      </KineticProvider>
    </LanguageProvider>
  );
};

export default App;