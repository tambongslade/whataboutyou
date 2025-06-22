import React from 'react';
import TombolaHeroSection from './components/TombolaHeroSection';
import TombolaPrizesSection from './components/TombolaPrizesSection';

const TombolaPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <TombolaHeroSection />

      {/* Prizes Section */}
      <TombolaPrizesSection />
    </div>
  );
};

export default TombolaPage; 