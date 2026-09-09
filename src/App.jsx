import { Route, Routes } from 'react-router-dom';
import ProjectDetail from './pages/ProjectDetail';
import ResearchDetail from './pages/ResearchDetail';
import ResumePage from './pages/ResumePage';
import DataStackPost from './pages/DataStackPost';
import MLStackPost from './pages/MLStackPost';

import PortfolioExplorer, { WritingDetail } from './pages/PortfolioExplorer';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioExplorer />}>
        <Route path="researchq" element={<ProjectDetail id="researchq" />} />
        <Route path="resume" element={<ResumePage embedded />} />
        <Route path="vationo" element={<ProjectDetail id="vationo" />} />
        <Route path="sepsis" element={<ProjectDetail id="sepsis" />} />
        <Route path="research/sepsis" element={<ResearchDetail />} />
        <Route path="datastack" element={<DataStackPost />} />
        <Route path="mlstack" element={<MLStackPost />} />
        <Route path="writing/:slug" element={<WritingDetail />} />
        <Route path="*" element={<main className="project-detail"><h1>Page not found</h1><p>This page is not available.</p><Link className="detail-back" to="/">← Back to work</Link></main>} />
      </Route>
    </Routes>
  );
}
