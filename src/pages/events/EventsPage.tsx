import React from 'react';
import EventsHeroSection from './components/EventsHeroSection';
import EventsList from './components/EventsList';

const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <EventsHeroSection />
      <EventsList />
    </div>
  );
};

export default EventsPage; 