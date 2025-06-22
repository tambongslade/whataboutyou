import React from 'react';
import MissAndMasterHeroSection from './components/MissAndMasterHeroSection';
import CandidatesSection from './components/CandidatesSection';

const MissAndMasterPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <MissAndMasterHeroSection />

      {/* Candidates Section */}
      <CandidatesSection />
    </div>
  );
};

export default MissAndMasterPage; 