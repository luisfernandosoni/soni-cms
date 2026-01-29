import React, { Suspense, lazy } from 'react';

// Lazy load components just like in App.tsx
const Hero = lazy(() => import('../../components/Hero.tsx'));
const Services = lazy(() => import('../../components/Services.tsx'));
const Work = lazy(() => import('../../components/Work.tsx'));
const About = lazy(() => import('../../components/About.tsx'));
const TransmissionsPreview = lazy(() => import('../../components/TransmissionsPreview.tsx'));
const DesignPhilosophy = lazy(() => import('../../components/DesignPhilosophy.tsx'));
const Footer = lazy(() => import('../../components/Footer.tsx'));

// Simple loader for sections
const SectionLoader = () => <div className="w-full h-20 bg-transparent" />;

export const Home: React.FC = () => {
    return (
        <main>
            <Suspense fallback={<SectionLoader />}>
                <Hero />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <Services />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <Work />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <About />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <TransmissionsPreview />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <DesignPhilosophy />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <Footer />
            </Suspense>
        </main>
    );
};

export default Home;
