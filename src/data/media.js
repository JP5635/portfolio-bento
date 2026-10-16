export const media = {
  'researchq-library': {
    src: 'media/researchq-library.png', width: 2354, height: 1382,
    title: 'ResearchQ · Interactive library',
    alt: 'ResearchQ article library with category filters and articles on encryption, Fourier transforms and sepsis modelling.',
    source: 'Provided service capture · resources/p4.png',
    note: 'A captured interface, not a live demo. View counts and dates belong to the captured version.',
  },
  'sepsis-effects': {
    src: 'media/sepsis-gam-figures.png', width: 800, height: 900,
    title: 'GAM interpretation figures',
    alt: 'Report Figures 21 and 22: GAM feature effect strengths and six partial-dependence plots.',
    source: 'COMP90089 final report · p.22 · Figures 21–22',
    note: 'Original report figures. Feature labels and model-term indexing require reconciliation with the supplied dashboard code; do not interpret these as validated clinical effects.',
  },
  'sepsis-dashboard': {
    src: 'media/sepsis-dashboard-evaluation.png', width: 540, height: 240,
    title: 'Dashboard · Evaluation panel',
    alt: 'Streamlit evaluation panel showing accuracy 0.721, AUROC 0.541, PR-AUC 0.140, ROC and precision-recall curves and a confusion matrix.',
    source: 'COMP90089 final report · p.26 · Figure 25, evaluation-panel excerpt',
    note: 'A separate dashboard demonstration run. These values are not the model-comparison results in Tables 7–8. Patient-level rows and inputs are excluded from this excerpt.',
  },
};

export const projectMedia = {
  researchq: ['researchq-library'],
  sepsis: ['sepsis-dashboard', 'sepsis-effects'],
  'sepsis-research': ['sepsis-effects', 'sepsis-dashboard'],
};

// Cover diagrams illustrate the technical topic. Screens remain sourced artifacts;
// their captions deliberately distinguish a historical capture from a live demo.
export const projectCovers = {
  'ai-api': {
    src: 'covers/ai-api.svg', social: 'covers/ai-api-social.png',
    alt: 'AI request lifecycle from application identity through a model API to a validated saved result, with deadline reconciliation.',
    label: 'Reference design', context: 'AI API reliability',
  },
  'ai-context': {
    src: 'covers/ai-context.svg', social: 'covers/ai-context-social.png',
    alt: 'Eligible history and evidence pass through selection and a context budget into a request packet with source identity.',
    label: 'Method diagram', context: 'Context assembly',
  },
  'ai-retrieval': {
    src: 'covers/ai-retrieval.svg', social: 'covers/ai-retrieval-social.png',
    alt: 'Versioned text chunks are embedded into a vector index and retrieved as permitted current evidence.',
    label: 'Method diagram', context: 'Vector retrieval',
  },
  'ai-wiki': {
    src: 'covers/ai-wiki.svg', social: 'covers/ai-wiki-social.png',
    alt: 'Wiki retrieval selects page references from an index, validates them and reads their content before answering.',
    label: 'Reference design', context: 'Index then read',
  },
  'ai-sql-evidence': {
    src: 'covers/ai-sql.svg', social: 'covers/ai-sql-social.png',
    alt: 'Governed SQL calculations and current documents converge through claim checks to support an answer.',
    label: 'Method diagram', context: 'SQL and evidence',
  },
  'ai-execution': {
    src: 'covers/ai-execution.svg', social: 'covers/ai-execution-social.png',
    alt: 'An untrusted model proposal passes a policy broker before a worker with resource, network and data-access limits.',
    label: 'Reference design', context: 'Bounded execution',
  },
  byoc: {
    src: 'covers/byoc-validation.svg',
    social: 'covers/byoc-validation-social.png',
    alt: 'Playwright test design: prepare a fixture through an API, perform a UI action, and verify saved state through an API read and a fresh browser session.',
    label: 'Method diagram', context: 'Persisted-state testing',
  },
  'credential-access': {
    src: 'covers/credential-access.svg',
    social: 'covers/credential-access-social.png',
    alt: 'Transactional outbox: commit application state and an outbox row in one PostgreSQL transaction, then deliver through a retrying worker to an idempotent external service.',
    label: 'Pattern diagram', context: 'Transactional outbox',
  },
  'lakehouse-sync': {
    src: 'covers/lakehouse-sync.svg',
    social: 'covers/lakehouse-sync-social.png',
    alt: 'S3 multipart-upload workflow: transfer parts, reconcile a part manifest, complete the upload, then verify object size and checksum.',
    label: 'Method diagram', context: 'Resumable uploads',
  },
  researchq: {
    media: 'researchq-library', title: 'ResearchQ',
    social: 'covers/researchq-social.png',
    eyebrow: 'Product interface / captured version',
    label: 'Captured interface', context: 'Historical version', crop: 'library',
  },
  sepsis: {
    media: 'sepsis-dashboard', title: 'Interpretable early warning',
    eyebrow: 'Sepsis research / evaluation panel',
    label: 'Report excerpt', context: 'Separate demo run', crop: 'evaluation',
  },
  'sepsis-research': {
    media: 'sepsis-effects', title: 'Interpretable clinical models',
    eyebrow: 'Course report / partial dependence',
    alt: 'Original report Figure 22: six GAM partial-dependence plots, preserved as a course-report excerpt rather than clinically validated effects.',
    label: 'Original report figure', context: 'Figure 22 · Cropped view', viewport: '0 490 800 410', crop: 'partial-effects',
  },
  vationo: {
    src: 'covers/vationo-framework.svg',
    alt: 'High-level research framework linking historical momentum and volatility signals, market regimes and exposure allocation; no performance values.',
    label: 'Framework diagram', context: 'Research overview',
  },
  'writing-retrieval-evaluation': {
    src: 'covers/retrieval-evaluation.svg',
    alt: 'Query, embed and retrieve workflow, followed by a top-five expected-source check for title-based retrieval evaluation.',
    label: 'Method diagram', context: 'Retrieval evaluation',
  },
  'writing-dino-q-learning': {
    src: 'covers/q-learning.svg',
    alt: 'Tabular Q-learning loop linking observations, actions, rewards and Q-value updates.',
    label: 'Method diagram', context: 'Q-learning',
  },
  'writing-rag': {
    src: 'covers/document-structure.svg',
    alt: 'Illustrative document-to-sections structure with ordered chunks.',
    label: 'Method illustration', context: 'Proposed article',
  },
  'writing-ml': {
    src: 'covers/additive-model.svg',
    alt: 'Illustrative additive feature curves, not fitted clinical results.',
    label: 'Method illustration', context: 'Proposed article',
  },
  'writing-data': {
    src: 'covers/spatial-workflow.svg',
    alt: 'Conceptual workflow from spatial events through BigQuery processing to clustering.',
    label: 'Method illustration', context: 'Proposed article',
  },
};

export const capturedArticles = [
  'How the modern security works? AES',
  'The Magic of the Fourier Transform',
  'Machine Learning for Sepsis Detection',
  'PV? FV? Interest rate?',
  'Means in Finance',
];
