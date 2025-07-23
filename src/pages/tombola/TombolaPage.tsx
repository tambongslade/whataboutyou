import React, { useState } from 'react';
import { useSEO } from '../../hooks/useSEO';
import TombolaHeroSection from './components/TombolaHeroSection';
import TombolaPrizesSection from './components/TombolaPrizesSection';
import TombolaRegistrationModal from './components/TombolaRegistrationModal';

const TombolaPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useSEO({
    title: 'Tombola WAY 2025 | Jeux & Prix à Gagner - What About You',
    description: 'Participez à la tombola WAY 2025 et tentez de remporter des prix incroyables ! PS5, smartphones, bons d’achat et bien plus. Inscription gratuite et tirages exclusifs.',
    keywords: 'tombola WAY 2025, jeux concours Cameroun, prix à gagner, PS5, smartphones, tirages au sort, loterie',
    image: 'https://whataboutyou.cm/tombolahero.webp',
    url: 'https://whataboutyou.cm/tombola',
    type: 'website'
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <TombolaHeroSection onOpenModal={openModal} />

      {/* Prizes Section */}
      <TombolaPrizesSection onOpenModal={openModal} />

      {/* Registration Modal */}
      <TombolaRegistrationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default TombolaPage; 