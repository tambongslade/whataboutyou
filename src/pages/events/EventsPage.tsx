import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import EventsHeroSection from './components/EventsHeroSection';
import EventsList from './components/EventsList';

const EventsPage: React.FC = () => {
  useSEO({
    title: 'Événements WAY 2025 | Conférences Entrepreneuriales - What About You',
    description: 'Découvrez les événements et conférences de WAY 2025. Rencontrez des entrepreneurs inspirants, participez à des ateliers pratiques et développez votre réseau professionnel au Cameroun.',
    keywords: 'événements WAY 2025, conférences entrepreneuriat Cameroun, ateliers business, networking entrepreneurs, formation startup',
    image: 'https://whataboutyou.cm/eventhero.webp',
    url: 'https://whataboutyou.cm/events',
    type: 'website'
  });

  return (
    <div className="min-h-screen">
      <EventsHeroSection />
      <EventsList />
    </div>
  );
};

export default EventsPage; 