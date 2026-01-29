
import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { FooterCTA, FooterNavGroup, FooterLegal } from './footer/Atoms.tsx';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer id="contact" className="footer bg-background pt-56 lg:pt-80 pb-20 border-t border-border transition-colors duration-500">
      <div className="max-w-8xl mx-auto px-10 lg:px-20">
        
        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-32 lg:gap-48 mb-64">
          
          <FooterCTA 
            title={t('footer.cta')} 
            email={t('footer.email')} 
            language={language} 
          />
          
          <div className="grid grid-cols-2 gap-x-32 gap-y-20 w-full lg:w-auto">
            <FooterNavGroup 
              label={t('footer.sitemap')} 
              items={['services', 'work', 'about']} 
              language={language}
              isI18n={true}
              t={t}
            />
            
            <FooterNavGroup 
              label={t('footer.socials')} 
              items={['Instagram', 'LinkedIn', 'Twitter']} 
              language={language}
              links={{
                'Instagram': 'https://instagram.com/soninewmedia',
                'LinkedIn': 'https://linkedin.com/company/soninewmedia',
                'Twitter': 'https://twitter.com/soninewmedia'
              }}
            />
          </div>
        </div>
        
        {/* Legal & Branding Foundation */}
        <FooterLegal 
          language={language}
          copyright={t('footer.copyright')}
          privacy={t('footer.privacy')}
          terms={t('footer.terms')}
        />

      </div>
    </footer>
  );
};

export default Footer;
