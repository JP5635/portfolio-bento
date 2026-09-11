export const collections = ['All', 'Projects', 'Research', 'Blog'];

export const items = [
  { id: 'researchq', collection: 'Projects', title: 'ResearchQ', category: 'Research tools', status: 'Project', role: 'Machine Learning Engineer', sortDate: '2025-07-01', summary: 'An interactive study journal for exploring technical topics through articles, tutorials and research-based explanations.', path: '/researchq' },
  { id: 'sepsis', collection: 'Projects', title: 'Early Sepsis Detection', category: 'Healthcare AI', status: 'Project', role: 'ML Researcher', sortDate: '2026-04-01', summary: 'An interpretable early-warning model built from irregular MIMIC-IV clinical time series, with a dashboard for exploring feature contributions.', path: '/sepsis' },
  { id: 'vationo', collection: 'Projects', title: 'Vationo', category: 'Quant research', status: 'Project', role: 'Independent research', sortDate: '2025-07-01', summary: 'A systematic research framework for adapting portfolio exposure across market regimes.', path: '/vationo' },
  { id: 'sepsis-research', collection: 'Research', title: 'Interpretable Machine Learning for Early Sepsis Detection', category: 'Applied ML', status: 'Course report', sortDate: '2026-04-01', summary: 'A team report comparing logistic regression, GAM and XGBoost using early hospital-admission measurements from MIMIC-IV.', path: '/research/sepsis', related: 'sepsis' },
  { id: 'writing-rag', collection: 'Blog', title: 'Designing retrieval that respects document structure', category: 'RAG systems', status: 'Proposed article', publicationStatus: 'planned', summary: 'Notes on hierarchical chunking, context assembly and measuring retrieval relevance.', path: '/writing/writing-rag', related: 'researchq' },
  { id: 'writing-ml', collection: 'Blog', title: 'Making early-warning models interpretable', category: 'Applied ML', status: 'Proposed article', publicationStatus: 'planned', summary: 'How additive models expose non-linear risk factors in noisy clinical time series.', path: '/writing/writing-ml', related: 'sepsis' },
  { id: 'writing-data', collection: 'Blog', title: 'Cleaning millions of spatial events in BigQuery', category: 'Data systems', status: 'Proposed article', publicationStatus: 'planned', summary: 'A practical look at clustering GPS traces without erasing real urban behaviour.', path: '/writing/writing-data', related: 'neighbourlytics' },
  { id: 'writing-dino-q-learning', collection: 'Blog', title: 'Teaching a Pixel Dinosaur with Q-learning', category: 'Reinforcement learning', status: 'Article', publicationStatus: 'published', sortDate: '2026-09-09', summary: 'How a small tabular agent learns to move, turn and jump from local vision, shaped rewards and repeated episodes.', path: '/writing/dino-q-learning' },
  { id: 'researchq-role', collection: 'Experience', title: 'Machine Learning Engineer', category: 'ResearchQ', status: '2025 — Present', summary: 'Building production RAG systems, evaluation workflows and cloud APIs at ResearchQ.', path: '/resume', related: 'researchq' },
  { id: 'army', collection: 'Experience', title: 'Signals Intelligence Sergeant', category: 'ROK Army', status: '2024 — 2025', summary: 'Led structured intelligence workflows and standardised reporting processes.', path: '/resume' },
  { id: 'neighbourlytics', collection: 'Experience', title: 'Data Science Intern', category: 'Neighbourlytics', status: '2023', summary: 'Developed spatial analytics pipelines and evaluated clustering approaches for noisy GPS event data.', path: '/resume' },
];

export const posts = items.filter(item => item.collection !== 'Experience');

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'date-desc', label: 'Date: Newest first' },
  { value: 'date-asc', label: 'Date: Oldest first' },
];

export function sortPortfolioItems(entries, mode = 'featured') {
  return entries.map((item, index) => ({ item, index })).sort((a, b) => {
    if (mode === 'name-asc' || mode === 'name-desc') {
      const order = a.item.title.localeCompare(b.item.title, 'en', { sensitivity: 'base' });
      return mode === 'name-asc' ? order : -order;
    }
    if (mode === 'date-asc' || mode === 'date-desc') {
      if (Boolean(a.item.sortDate) !== Boolean(b.item.sortDate)) return a.item.sortDate ? -1 : 1;
      if (a.item.sortDate && b.item.sortDate) {
        const order = a.item.sortDate.localeCompare(b.item.sortDate);
        if (order) return mode === 'date-asc' ? order : -order;
      }
    }
    return a.index - b.index;
  }).map(entry => entry.item);
}

export function getRelatedItems(id) {
  const current = items.find(item => item.id === id);
  return items.filter(item => item.id !== id && (item.related === id || current?.related === item.id));
}

export function getRouteItem(pathname, search = '') {
  const path = pathname.replace(/\/+$/, '') || '/';
  const researchContext = path === '/sepsis' && new URLSearchParams(search).get('context') === 'research';
  if (researchContext) return items.find(item => item.id === 'sepsis-research');
  return posts.find(item => item.path === path);
}
