import { aiPortfolioItems } from './aiArticles.js';

export const collections = ['All', 'Projects', 'Research', 'Blog'];

export const items = [
  { id: 'researchq', collection: 'Projects', title: 'ResearchQ', category: 'AI & full-stack engineering', status: 'Independent project', role: 'Independent developer', summary: 'An AI-assisted research publishing application combining React, Cloudflare APIs, retrieval evaluation and reliable background workflows.', path: '/researchq', related: 'writing-retrieval-evaluation' },
  { id: 'byoc', collection: 'Blog', title: 'Testing persisted application state with Playwright', category: 'Playwright & API testing', status: 'Engineering article', publicationStatus: 'published', sortDate: '2026-10-16', summary: 'Protect saved work with isolated fixtures, UI actions, API postconditions and a fresh browser context. An original project-management example.', path: '/writing/persisted-state', related: ['credential-access', 'lakehouse-sync'] },
  { id: 'credential-access', collection: 'Blog', title: 'Recoverable operations with a PostgreSQL outbox', category: 'PostgreSQL & reliability', status: 'Engineering article', publicationStatus: 'published', sortDate: '2026-10-16', summary: 'Coordinate database state and external work with an atomic outbox, short worker leases, idempotency and explicit recovery.', path: '/writing/retryable-operations', related: 'lakehouse-sync' },
  { id: 'lakehouse-sync', collection: 'Blog', title: 'Resumable multipart uploads in Amazon S3', category: 'S3 & data integrity', status: 'Engineering article', publicationStatus: 'published', sortDate: '2026-10-16', summary: 'Design a recoverable upload around a durable part manifest, source identity, completion reconciliation and checksum verification.', path: '/writing/resumable-uploads', related: 'byoc' },
  { id: 'sepsis', collection: 'Projects', title: 'Early Sepsis Detection', category: 'Applied ML', status: 'University team project', role: 'Team contributor', summary: 'An interpretable modelling study using MIMIC-IV time series, with a GAM dashboard and an explicit account of evaluation limits.', path: '/sepsis', related: 'sepsis-research' },
  { id: 'vationo', collection: 'Projects', title: 'Vationo', category: 'Quantitative research', status: 'Independent research', role: 'Independent researcher', summary: 'Exploring market regimes and exposure allocation through historical signals, clustering and a systematic research workflow.', path: '/vationo' },
  { id: 'sepsis-research', collection: 'Research', title: 'Interpretable Machine Learning for Early Sepsis Detection', category: 'Applied ML', status: 'Course report', summary: 'A university team report comparing logistic regression, GAM and XGBoost using early hospital-admission measurements from MIMIC-IV.', path: '/research/sepsis', related: 'sepsis' },
  { id: 'writing-retrieval-evaluation', collection: 'Blog', title: 'Diagnosing a multilingual retrieval failure', category: 'RAG engineering', status: 'Engineering note', publicationStatus: 'published', sortDate: '2026-10-16', summary: 'How a small self-retrieval evaluation exposed an embedding-language mismatch, and what the resulting improvement actually measures.', path: '/writing/retrieval-evaluation', related: 'researchq' },
  ...aiPortfolioItems,
  { id: 'writing-rag', collection: 'Blog', title: 'Designing retrieval that respects document structure', category: 'RAG systems', status: 'Proposed article', publicationStatus: 'planned', summary: 'Notes on hierarchical chunking, context assembly and measuring retrieval relevance.', path: '/writing/writing-rag', related: 'researchq' },
  { id: 'writing-ml', collection: 'Blog', title: 'Making early-warning models interpretable', category: 'Applied ML', status: 'Proposed article', publicationStatus: 'planned', summary: 'How additive models expose non-linear risk factors in noisy clinical time series.', path: '/writing/writing-ml', related: 'sepsis' },
  { id: 'writing-data', collection: 'Blog', title: 'Cleaning millions of spatial events in BigQuery', category: 'Data systems', status: 'Proposed article', publicationStatus: 'planned', summary: 'A practical look at clustering GPS traces without erasing real urban behaviour.', path: '/writing/writing-data', related: 'neighbourlytics' },
  { id: 'writing-dino-q-learning', collection: 'Blog', title: 'Teaching a Pixel Dinosaur with Q-learning', category: 'Reinforcement learning', status: 'Article', publicationStatus: 'published', sortDate: '2026-09-09', summary: 'How a small tabular agent learns to move, turn and jump from local vision, shaped rewards and repeated episodes.', path: '/writing/dino-q-learning' },
  { id: 'zetaris-role', collection: 'Experience', title: 'Junior Software Developer', category: 'Zetaris', status: 'Jul 2026 — Present', summary: 'Full-stack development, multi-cloud BYOC validation and Azure-based test infrastructure at Zetaris.', path: '/resume' },
  { id: 'army', collection: 'Experience', title: 'Signals Intelligence Sergeant', category: 'ROK Army', status: '2024 — 2025', summary: 'Led structured intelligence workflows and standardised reporting processes.', path: '/resume' },
  { id: 'neighbourlytics', collection: 'Experience', title: 'Data Science Intern', category: 'Neighbourlytics', status: '2023', summary: 'Developed spatial analytics pipelines and evaluated clustering approaches for noisy GPS event data.', path: '/resume' },
];

// Planned articles keep their direct URLs, but do not inflate published collections.
export const posts = items.filter(item => item.collection !== 'Experience' && item.publicationStatus !== 'planned');

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
  const relatedIds = item => Array.isArray(item?.related) ? item.related : item?.related ? [item.related] : [];
  return items.filter(item => item.id !== id && item.publicationStatus !== 'planned'
    && (relatedIds(item).includes(id) || relatedIds(current).includes(item.id)));
}

export function getRouteItem(pathname, search = '') {
  const path = pathname.replace(/\/+$/, '') || '/';
  const researchContext = path === '/sepsis' && new URLSearchParams(search).get('context') === 'research';
  if (researchContext) return items.find(item => item.id === 'sepsis-research');
  return items.find(item => item.collection !== 'Experience' && item.path === path);
}
