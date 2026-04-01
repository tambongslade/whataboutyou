import React from 'react';
import { useSEO } from '../hooks/useSEO';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import CountdownSection from '../components/CountdownSection';
import BoutiqueTicketsSection from '../components/BoutiqueTicketsSection';
import TeamSection from '../components/TeamSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';


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
      <CountdownSection />
      <BoutiqueTicketsSection />
      <TeamSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
};

export default HomePage; 