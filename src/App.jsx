import { Routes, Route } from 'react-router-dom';
import HeroCard from './components/HeroCard';
import ResearchQCard from './components/ResearchQCard';
import InterviewEasyCard from './components/InterviewEasyCard';
import VationoCard from './components/VationoCard';
import YoungRichCard from './components/YoungRichCard';
import SepsisCard from './components/SepsisCard';
import DataStackCard from './components/DataStackCard';
import PositionsCard from './components/PositionsCard';
import MLStackCard from './components/MLStackCard';
import ContactCard from './components/ContactCard';
import ResearchQPost from './pages/ResearchQPost';
import ResumePage from './pages/ResumePage';
import VationoPost from './pages/VationoPost';
import SepsisPost from './pages/SepsisPost';
import DataStackPost from './pages/DataStackPost';
import MLStackPost from './pages/MLStackPost';

function BentoGrid() {
  return (
    <main className="bento" id="bento-grid">
      <ResearchQCard />
      <HeroCard />
      <InterviewEasyCard />
      <VationoCard />
      <YoungRichCard />
      <SepsisCard />
      <DataStackCard />
      <PositionsCard />
      <MLStackCard />
      <ContactCard />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BentoGrid />} />
      <Route path="/researchq" element={<ResearchQPost />} />
      <Route path="/resume" element={<ResumePage />} />
      <Route path="/vationo" element={<VationoPost />} />
      <Route path="/sepsis" element={<SepsisPost />} />
      <Route path="/datastack" element={<DataStackPost />} />
      <Route path="/mlstack" element={<MLStackPost />} />
    </Routes>
  );
}


