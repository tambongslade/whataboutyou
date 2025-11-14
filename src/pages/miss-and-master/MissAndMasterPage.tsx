import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import MissAndMasterHeroSection from './components/MissAndMasterHeroSection';
import CandidatesSection from './components/CandidatesSection';

const MissAndMasterPage: React.FC = () => {
  useSEO({
    title: 'Miss & Master WAY 2025 | Compétition de Beauté et Talent - What About You',
    description: 'Participez ou votez pour vos candidats préférés au concours Miss & Master WAY 2025. Une compétition unique célébrant la beauté, le talent et l’intelligence au Cameroun.',
    keywords: 'Miss WAY 2025, Master WAY 2025, concours beauté Cameroun, compétition talent, miss master Cameroun, vote en ligne',
    image: 'https://whataboutyou.cm/missandmasterhero.webp',
    url: 'https://whataboutyou.cm/miss-and-master',
    type: 'website'
  });

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