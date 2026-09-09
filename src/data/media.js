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

export const capturedArticles = [
  'How the modern security works? AES',
  'The Magic of the Fourier Transform',
  'Machine Learning for Sepsis Detection',
  'PV? FV? Interest rate?',
  'Means in Finance',
];
