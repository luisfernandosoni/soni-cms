import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { NavBranding, NavLinkItem, NavLanguageSwitcher, NavCTA } from './navbar/Atoms.tsx';
import { Magnetic } from './Magnetic.tsx';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['services', 'work', 'about'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      className={`fixed top-0 w-full z-50 transition-all duration-700 border-b ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-2xl border-white/10 py-4'
          : 'bg-transparent border-transparent py-8'
      }`}
    >
      {/* Changed to min-w-0 and gap-based layout for better overflow handling */}
      <div className="max-w-8xl mx-auto px-6 lg:px-20 flex items-center justify-between gap-4">
        {/* Identity Anchor - flex-shrink-0 prevents logo from shrinking */}
        <div className="flex-shrink-0">
          <NavBranding />
        </div>

        {/* Navigation container - uses flex-1 and min-w-0 to handle overflow */}
        <div className="flex items-center gap-6 lg:gap-12 min-w-0">
          {/* Navigation Matrix - hidden on smaller screens */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4 min-w-0">
            {navItems.map((item) => (
              <NavLinkItem 
                key={item} 
                item={item} 
                label={t(`nav.${item}`)} 
                language={language} 
              />
            ))}
            {/* Transmissions link */}
            <Magnetic strength={0.25} radius={80}>
              <a
                href="/transmissions"
                className="px-4 xl:px-6 py-2 text-secondary hover:text-text transition-colors relative group uppercase text-nano font-bold tracking-widest-3x block whitespace-nowrap"
              >
                <span className="block">Transmissions</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-accent transition-all duration-500 group-hover:w-1/2" />
              </a>
            </Magnetic>
          </div>
          
          {/* System Actions - reduced padding for better fit */}
          <div className="flex items-center gap-4 lg:gap-8 border-l border-white/10 pl-6 lg:pl-12">
            <NavLanguageSwitcher 
              current={language} 
              onSelect={setLanguage} 
            />
          </div>

          {/* Conversion Portal */}
          <NavCTA 
            label={t('nav.contact')} 
            language={language} 
          />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;