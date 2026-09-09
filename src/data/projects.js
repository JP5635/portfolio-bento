// Existing portfolio claims, not independently verified results.
// Add a source URL and measurement conditions before treating a metric as verified.
export const projects = {
  researchq: {
    type: 'Work project',
    period: 'Jul 2025 — Present',
    roleLink: '/resume',
    problem: 'Academic papers are long and dense. Finding a specific answer should not require reading every document from beginning to end.',
    contribution: 'RAG pipeline development, retrieval evaluation, prompt benchmarking and cloud API deployment.',
    approach: [
      { title: 'Retrieve with document context', body: 'Semantic search, hierarchical chunking and context assembly bring relevant sections of a paper into the answer pipeline.' },
      { title: 'Evaluate each iteration', body: 'Offline evaluation sets, prompt benchmarks and model comparisons support iteration on retrieval and response quality.' },
      { title: 'Serve and analyse', body: 'Key-value caching and vector indexing support serving through Cloudflare Workers. Interaction segmentation and few-shot prompt experiments support further analysis.' },
    ],
    outcomes: [
      { value: '2.7K+', label: 'Reported users', note: 'User definition and measurement date are not documented here.' },
      { value: '20–30%', label: 'Reported relevance improvement', note: 'Offline evaluation; metric, baseline and evaluation set are not attached.' },
      { value: '~400ms', label: 'Reported inference latency', note: 'Latency scope, percentile and serving conditions need confirmation.' },
    ],
    scale: 'The existing project notes also report analysis of 10M+ interaction events and a +20% proxy behavioural lift. The proxy definition and experiment evidence are not yet attached.',
    evidence: 'The supplied screenshot documents an interactive article library. It does not verify the RAG implementation or the performance figures reported in the existing portfolio. Public evaluation records and current demo links are still unverified.',
    limitations: 'The relative contribution of retrieval, caching and prompting cannot be separated from the information currently available. Reported changes should not be interpreted as controlled causal effects.',
  },
  sepsis: {
    type: 'Research project',
    roleLink: '/resume',
    problem: 'Irregular ICU observations make early risk modelling difficult. A useful research workflow also needs to explain which features contribute to a prediction.',
    contribution: 'Shared work on phenotyping, data collection, dataset creation, exploratory analysis, model development, results analysis, visualisation and report writing, as recorded in the team contribution table (report p.27).',
    approach: [
      { title: 'Structure clinical time series', body: 'Transform MIMIC-IV observations from the first 1, 2 and 4 hours after hospital admission into statistical features. The report compares logistic regression, GAM and XGBoost.' },
      { title: 'Make model contributions visible', body: 'Use a Generalised Additive Model (GAM) dashboard to explore non-linear feature effects and patient risk trajectories.' },
    ],
    outcomes: [
      { value: '2,000', label: 'Sampled patients', note: 'Report p.16: 262 septic cases (13.1%), length of stay below 500 hours, 80:20 stratified split.' },
      { value: 'GAM', label: 'Model explanation dashboard', note: 'Explores feature contributions and risk trajectories.' },
    ],
    evidence: 'The course report, its comparison tables and selected dashboard/interpretation figures are documented in the related Research page. Reported results have not been independently reproduced. The original PDF is not publicly served because it includes student identifiers.',
    limitations: 'Single-hospital data and a small imbalanced sample limit generalisation. The report and dashboard use different experimental configurations; their results must not be merged. Clinical validity is not established. Project dates also need confirmation against the report metadata.',
  },
  vationo: {
    type: 'Independent research',
    problem: 'Market behaviour varies across regimes. The research explores how momentum, volatility and clustering can inform an exposure-allocation framework.',
    contribution: 'Historical equity data analysis, clustering-based market segmentation and a regime-switching allocation framework.',
    approach: [
      { title: 'Study historical signals', body: 'Analyse equity price and volume data to investigate momentum and volatility-driven signals across market regimes.' },
      { title: 'Represent changing market states', body: 'Use clustering-based segmentation to construct a regime-switching framework and adapt portfolio exposure to changing volatility conditions.' },
    ],
    outcomes: [
      { value: '20+ years', label: 'Reported data coverage', note: 'Exact dataset dates and provenance are not attached.' },
      { value: '12', label: 'Reported market states', note: 'Framework structure, not a return or outperformance measure.' },
    ],
    evidence: 'The learning-engine animation is adapted from the public Vationo website; it is not a measured backtest. A public notebook, evaluation report and project-specific repository are not yet linked.',
    limitations: 'Out-of-sample evaluation, benchmark comparisons, transaction costs and drawdown results are not documented here. No verified investment-performance claim is presented.',
  },
};
