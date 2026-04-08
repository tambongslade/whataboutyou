import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import CountdownSection from '../components/CountdownSection';
import BoutiqueTicketsSection from '../components/BoutiqueTicketsSection';
import PartnersSection from '../components/PartnersSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import ConferenceRegistrationModal from '../components/ConferenceRegistrationModal';


const HomePage: React.FC = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  useSEO({
    title: 'What About You - WAY 2026 | Foire Entrepreneuriale & Innovation Jeunesse Cameroun',
    description: 'Rejoignez WAY 2026 - La plus grande foire entrepreneuriale du Cameroun. Conférences inspirantes, Miss & Master, tombola, boutique et networking pour jeunes entrepreneurs. Inscriptions ouvertes !',
    keywords: 'WAY 2026, What About You, entrepreneuriat Cameroun, foire entrepreneuriale, innovation jeunesse, conférence entrepreneuriat, événement startup Cameroun',
    image: 'https://whataboutyou.cm/Header.webp',
    url: 'https://whataboutyou.cm',
    type: 'website'
  });

  return (
    <div className="min-h-screen">
      <HeroSection onOpenRegistration={() => setIsRegistrationOpen(true)} />
      <ConferenceRegistrationModal isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} />
      <AboutSection />
      <CountdownSection />
      <BoutiqueTicketsSection />
      <PartnersSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
};

export default HomePage; 