import React from 'react';
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