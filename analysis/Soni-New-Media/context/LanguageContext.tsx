import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved) {
      setLanguageState(saved);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'es') setLanguageState('es');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const t = (path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], translations[language] as any) || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};