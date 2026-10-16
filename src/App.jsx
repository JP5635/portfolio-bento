import { Navigate, Route, Routes } from 'react-router-dom';
import ProjectDetail from './pages/ProjectDetail';
import ResearchDetail from './pages/ResearchDetail';
import ResumePage from './pages/ResumePage';
import DinoQPost from './pages/DinoQPost';
import RetrievalEvaluationPost from './pages/RetrievalEvaluationPost';
import PersistedStatePost from './pages/PersistedStatePost';
import EngineeringGuide from './pages/EngineeringGuide';
import AIArticle from './pages/AIArticle';
import { aiArticles } from './data/aiArticles';

import PortfolioExplorer, { WritingDetail } from './pages/PortfolioExplorer';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioExplorer />}>
        <Route path="byoc" element={<Navigate to="/writing/persisted-state" replace />} />
        <Route path="researchq" element={<ProjectDetail id="researchq" />} />
        <Route path="credential-access" element={<Navigate to="/writing/retryable-operations" replace />} />
        <Route path="lakehouse-sync" element={<Navigate to="/writing/resumable-uploads" replace />} />
        <Route path="resume" element={<ResumePage embedded />} />
        <Route path="vationo" element={<ProjectDetail id="vationo" />} />
        <Route path="sepsis" element={<ProjectDetail id="sepsis" />} />
        <Route path="research/sepsis" element={<ResearchDetail />} />
        <Route path="datastack" element={<Navigate to="/writing/resumable-uploads" replace />} />
        <Route path="mlstack" element={<Navigate to="/researchq" replace />} />
        <Route path="writing/retrieval-evaluation" element={<RetrievalEvaluationPost />} />
        <Route path="writing/persisted-state" element={<PersistedStatePost />} />
        <Route path="writing/retryable-operations" element={<EngineeringGuide id="credential-access" />} />
        <Route path="writing/resumable-uploads" element={<EngineeringGuide id="lakehouse-sync" />} />
        <Route path="writing/dino-q-learning" element={<DinoQPost />} />
        {aiArticles.map(article => <Route key={article.id} path={`writing/${article.slug}`} element={<AIArticle slug={article.slug} />} />)}
        <Route path="writing/:slug" element={<WritingDetail />} />
        <Route path="*" element={<main className="project-detail"><h1>Page not found</h1><p>This page is not available.</p><Link className="detail-back" to="/">← Back to work</Link></main>} />
      </Route>
    </Routes>
  );
}
