import React, { useState } from 'react';
import TombolaHeroSection from './components/TombolaHeroSection';
import TombolaPrizesSection from './components/TombolaPrizesSection';
import TombolaRegistrationModal from './components/TombolaRegistrationModal';

const TombolaPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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