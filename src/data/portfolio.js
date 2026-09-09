export const collections = ['All', 'Projects', 'Research', 'Blog'];

export const items = [
  { id: 'researchq', collection: 'Projects', title: 'ResearchQ', category: 'Research tools', status: 'Project', role: 'Machine Learning Engineer', summary: 'An interactive study journal for exploring technical topics through articles, tutorials and research-based explanations.', path: '/researchq' },
  { id: 'sepsis', collection: 'Projects', title: 'Early Sepsis Detection', category: 'Healthcare AI', status: 'Project', role: 'ML Researcher', summary: 'An interpretable early-warning model built from irregular MIMIC-IV clinical time series, with a dashboard for exploring feature contributions.', path: '/sepsis' },
  { id: 'vationo', collection: 'Projects', title: 'Vationo', category: 'Quant research', status: 'Project', role: 'Independent research', summary: 'A systematic research framework for adapting portfolio exposure across market regimes.', path: '/vationo' },
  { id: 'sepsis-research', collection: 'Research', title: 'Interpretable Machine Learning for Early Sepsis Detection', category: 'Applied ML', status: 'Course report', summary: 'A team report comparing logistic regression, GAM and XGBoost using early hospital-admission measurements from MIMIC-IV.', path: '/research/sepsis', related: 'sepsis' },
  { id: 'writing-rag', collection: 'Blog', title: 'Designing retrieval that respects document structure', category: 'RAG systems', status: 'Proposed article', publicationStatus: 'planned', summary: 'Notes on hierarchical chunking, context assembly and measuring retrieval relevance.', path: '/writing/writing-rag', related: 'researchq' },
  { id: 'writing-ml', collection: 'Blog', title: 'Making early-warning models interpretable', category: 'Applied ML', status: 'Proposed article', publicationStatus: 'planned', summary: 'How additive models expose non-linear risk factors in noisy clinical time series.', path: '/writing/writing-ml', related: 'sepsis' },
  { id: 'writing-data', collection: 'Blog', title: 'Cleaning millions of spatial events in BigQuery', category: 'Data systems', status: 'Proposed article', publicationStatus: 'planned', summary: 'A practical look at clustering GPS traces without erasing real urban behaviour.', path: '/writing/writing-data', related: 'neighbourlytics' },
  { id: 'researchq-role', collection: 'Experience', title: 'Machine Learning Engineer', category: 'ResearchQ', status: '2025 — Present', summary: 'Building production RAG systems, evaluation workflows and cloud APIs at ResearchQ.', path: '/resume', related: 'researchq' },
  { id: 'army', collection: 'Experience', title: 'Signals Intelligence Sergeant', category: 'ROK Army', status: '2024 — 2025', summary: 'Led structured intelligence workflows and standardised reporting processes.', path: '/resume' },
  { id: 'neighbourlytics', collection: 'Experience', title: 'Data Science Intern', category: 'Neighbourlytics', status: '2023', summary: 'Developed spatial analytics pipelines and evaluated clustering approaches for noisy GPS event data.', path: '/resume' },
];

export const posts = items.filter(item => item.collection !== 'Experience');

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
