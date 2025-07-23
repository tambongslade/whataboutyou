import React from 'react';
import { useSEO } from '../hooks/useSEO';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import IdentitySection from '../components/IdentitySection';
import ValuesSection from '../components/ValuesSection';
import WAYShowcaseSection from '../components/WAYShowcaseSection';
import WAYStatsSection from '../components/WAYStatsSection';
import AdsSection from '../components/AdsSection';
import FoodSection from '../components/FoodSection';
import PartnersSection from '../components/PartnersSection';
import CountdownSection from '../components/CountdownSection';
import TeamSection from '../components/TeamSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import GuestStarsSection from '../components/GuestStarsSection';


const HomePage: React.FC = () => {
  useSEO({
    title: 'What About You - WAY 2025 | Foire Entrepreneuriale & Innovation Jeunesse Cameroun',
    description: 'Rejoignez WAY 2025 - La plus grande foire entrepreneuriale du Cameroun. Conférences inspirantes, Miss & Master, tombola, boutique et networking pour jeunes entrepreneurs. Inscriptions ouvertes !',
    keywords: 'WAY 2025, What About You, entrepreneuriat Cameroun, foire entrepreneuriale, innovation jeunesse, conférence entrepreneuriat, événement startup Cameroun',
    image: 'https://whataboutyou.cm/Header.webp',
    url: 'https://whataboutyou.cm',
    type: 'website'
  });

  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <IdentitySection />
      <ValuesSection />
      <WAYShowcaseSection />
      <WAYStatsSection />
      <AdsSection />
      <PartnersSection />
      <CountdownSection />
      <TeamSection />
      <TestimonialsSection />
      <FoodSection />
      <GuestStarsSection />
      <FAQSection />
    </div>
  );
};

export default HomePage; 