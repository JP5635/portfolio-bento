import React from 'react';
import HeroCard from './components/HeroCard';
import ResearchQCard from './components/ResearchQCard';
import InterviewEasyCard from './components/InterviewEasyCard';
import VationoCard from './components/VationoCard';
import YoungRichCard from './components/YoungRichCard';
import DataStackCard from './components/DataStackCard';
import PositionsCard from './components/PositionsCard';
import MLStackCard from './components/MLStackCard';
import ContactCard from './components/ContactCard';

export default function App() {
  return (
    <main className="bento" id="bento-grid">
      <ResearchQCard />
      <HeroCard />
      <InterviewEasyCard />
      <VationoCard />
      <YoungRichCard />
      <DataStackCard />
      <PositionsCard />
      <MLStackCard />
      <ContactCard />
    </main>
  );
}
