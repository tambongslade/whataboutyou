import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import BoutiqueTicketsSection from '../components/BoutiqueTicketsSection';
import PartnersSection from '../components/PartnersSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import ConferenceRegistrationModal from '../components/ConferenceRegistrationModal';
import Triangle from '../components/Triangle';


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

      <div className="relative overflow-hidden">
        <AboutSection />
        <Triangle className="top-6 left-2 w-9 h-12" color="yellow" shape="right" rotate={-18} opacity={0.55} />
        <Triangle className="top-4 right-8 w-10 h-7" color="red" shape="right" rotate={-12} opacity={0.5} />
        <Triangle className="bottom-6 left-10 w-7 h-10" color="yellow" shape="pointy" rotate={22} opacity={0.45} />
        <Triangle className="bottom-10 right-3 w-11 h-7 hidden sm:block" color="red" shape="left" rotate={14} opacity={0.5} />
      </div>

      <div className="relative overflow-hidden">
        <BoutiqueTicketsSection />
        <Triangle className="top-8 right-3 w-12 h-8" color="red" shape="right" rotate={-10} opacity={0.55} />
        <Triangle className="top-10 left-6 w-8 h-11 hidden md:block" color="yellow" shape="asym" rotate={15} opacity={0.5} />
        <Triangle className="bottom-6 right-14 w-9 h-12 hidden md:block" color="yellow" shape="pointy" rotate={-20} opacity={0.45} />
        <Triangle className="bottom-10 left-3 w-7 h-9" color="red" shape="pointy" rotate={8} opacity={0.5} />
      </div>

      <div className="relative overflow-hidden">
        <PartnersSection />
        <Triangle className="top-6 left-4 w-11 h-7" color="red" shape="left" rotate={8} opacity={0.55} />
        <Triangle className="top-10 right-6 w-9 h-12" color="yellow" shape="right" rotate={20} opacity={0.5} />
        <Triangle className="bottom-8 left-12 w-7 h-10 hidden sm:block" color="red" shape="pointy" rotate={-14} opacity={0.45} />
        <Triangle className="bottom-6 right-2 w-10 h-7" color="yellow" shape="left" rotate={18} opacity={0.5} />
      </div>

      <div className="relative overflow-hidden">
        <TestimonialsSection />
        <Triangle className="top-8 right-4 w-10 h-12" color="yellow" shape="right" rotate={12} opacity={0.55} />
        <Triangle className="top-12 left-3 w-12 h-8" color="red" shape="left" rotate={-8} opacity={0.5} />
        <Triangle className="bottom-6 left-1/4 w-7 h-9 hidden md:block" color="yellow" shape="asym" rotate={25} opacity={0.45} />
        <Triangle className="bottom-10 right-10 w-9 h-7 hidden sm:block" color="red" shape="right" rotate={-22} opacity={0.5} />
      </div>

      <div className="relative overflow-hidden">
        <FAQSection />
        <Triangle className="top-8 left-4 w-9 h-12" color="yellow" shape="pointy" rotate={-22} opacity={0.55} />
        <Triangle className="top-12 right-3 w-11 h-7" color="red" shape="right" rotate={18} opacity={0.5} />
        <Triangle className="bottom-12 right-12 w-7 h-10 hidden sm:block" color="yellow" shape="right" rotate={-15} opacity={0.45} />
        <Triangle className="bottom-6 left-8 w-10 h-7" color="red" shape="left" rotate={10} opacity={0.5} />
      </div>
    </div>
  );
};

export default HomePage; 