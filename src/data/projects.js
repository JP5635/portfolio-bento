// Independent project and academic case studies. General engineering guides
// live separately and do not document employer or client implementations.
export const projects = {
  researchq: {
    type: 'Independent project', role: 'Full-stack & applied AI developer',
    overview: 'A research publishing application combining a React interface, cloud APIs, multilingual retrieval and LLM authoring workflows. I built the application and its evaluation, background processing and diagnostic mechanisms as an independent project.',
    problem: 'Turning research into useful reading involves more than generating text. The system needs relevant context, a consistent audience brief, a reviewable draft and a way to understand failures before publication.',
    contribution: 'I built the React/TypeScript application and Cloudflare Workers backend, a multilingual retrieval pipeline, a retrieval evaluation harness and custom OpenAI-based authoring workflows. I also implemented background job processing, persisted diagnostic records and a human-controlled publication path.',
    context: 'Independent engineering work, separate from my employment at Zetaris. Measurements below are recorded project snapshots from June 2026.',
    stack: ['React', 'TypeScript', 'OpenAI API', 'Cloudflare Workers', 'D1', 'Vectorize', 'Queues'],
    constraints: ['The corpus includes Korean content, so the embedding model must represent the actual content language.', 'Generation, indexing and evaluation can outlast an ordinary request and need explicit failure handling.', 'A generated draft must remain inspectable before a person decides to publish it.'],
    architecture: { title: 'Retrieval and authoring, with explicit state', caption: 'Simplified application flow. Retrieval evaluation and draft diagnostics are stored separately from published content.', steps: [
      { title: 'React application', body: 'Reading, administration and publication controls' },
      { title: 'Workers API', body: 'Request handling, relational state in D1 and queued work' },
      { title: 'Retrieve & generate', body: 'Vectorize context search; OpenAI plan, write and self-review steps' },
      { title: 'Inspect & publish', body: 'Persisted drafts and metrics; human-controlled publication' },
    ] },
    decisions: [
      { title: 'Use a small evaluation to diagnose retrieval', body: 'The harness uses article titles as proxy queries and records whether the source article appears in the top-k results. Persisted Recall@k, MRR and rank measurements made the model-language mismatch visible.', tradeoff: 'Self-retrieval is a fast regression signal, but it does not establish answer correctness or relevance for arbitrary reader questions.' },
      { title: 'Move heavy work into background jobs', body: 'Cloudflare Queues carries typed messages for generation, indexing and evaluation. Consumer retries and a dead-letter queue replace fire-and-forget execution; a scheduled handler enqueues recurring work.', tradeoff: 'The request can return before processing completes, so job state and failed work need their own inspection path.' },
      { title: 'Keep the audience brief consistent through the loop', body: 'A structured audience profile shapes planning, context retrieval, drafting and LLM self-review. Drafts and failed attempts are stored, and publication remains a separate human action.', tradeoff: 'A multi-step loop adds model calls and failure points. LLM self-review supplies feedback, but human editorial judgment is still needed.' },
    ],
    challenge: { title: 'Retrieval that ran successfully but found the wrong context', body: 'The first evaluation returned self-retrieval Recall@5 of 0.05. The embedding model was English-focused while the corpus included Korean content: successful indexing did not mean useful retrieval.', resolution: 'I switched from bge-base-en to multilingual bge-m3, recreated the vector index, backfilled the corpus and reran the evaluation. The recorded result improved to 0.95, with MRR 0.89, on a 20-query title-based evaluation.' },
    verification: [
      { title: 'Retrieval evaluation · 3 Jun 2026', body: 'Twenty title-based queries: self-retrieval Recall@5 improved from 0.05 to 0.95, with 19/20 source articles in the top five. Final MRR was 0.89. These are historical evaluation results.' },
      { title: 'Implementation scope · Jun 2026', body: 'The project ledger records 75 API endpoints, relational storage, vector search and a deployed producer/consumer queue configuration with retries and a dead-letter queue.' },
      { title: 'Maintainability checks', body: 'Refactored a 4,494-line React component into 13 focused modules, leaving 2,651 lines in the main file, across 11 build-verified increments.' },
      { title: 'Authoring inspection', body: 'Recorded per-stage latency and output metrics, persisted evaluation runs and captured failed drafts. A generated article was taken through the draft-to-publication path in the recorded project work.' },
    ],
    outcomes: [
      { value: '0.05 → 0.95', label: 'Self-retrieval Recall@5', note: '20 title-based queries · 3 Jun 2026; not a general answer-quality score.' },
      { value: '75', label: 'API endpoints', note: 'Recorded implementation snapshot · Jun 2026.' },
      { value: '13', label: 'Extracted React modules', note: 'A large component refactored through 11 build-verified increments.' },
    ],
    limitations: ['The evaluation uses titles as proxy queries. A labelled question set and grounded answer evaluation would be needed to assess broader user relevance.', 'The measurements describe June 2026 work, not a fresh benchmark of the current deployment. No traffic, adoption or latency claim is made.', 'The product capture shows the interface. It does not independently verify implementation or evaluation results.'],
    artifacts: [
      { title: 'Captured product interface', body: 'The article library shown below is an existing service capture.', asset: 'media/researchq-library.png', label: 'View full capture' },
      { title: 'Evaluation and implementation notes', body: 'This case records the query definition, date, baseline, final result and limits of the retrieval measurement.' },
    ],
  },
  sepsis: {
    type: 'University team research', role: 'Shared data science & ML contribution', roleLink: '/resume',
    overview: 'A team research prototype comparing logistic regression, a Generalised Additive Model (GAM) and XGBoost on early hospital-admission observations from MIMIC-IV. Predictive modelling is paired with an interface for inspecting feature contributions.',
    problem: 'Clinical observations are irregular, the positive class is small and a model score alone does not explain what drives a prediction. The study explores early observation windows and interpretable modelling.',
    contribution: 'The team table credits me with shared work on phenotyping, data collection, dataset creation, exploratory analysis, model development, results analysis, visualisation and report writing (report p.27).',
    context: 'COMP90089 team report at the University of Melbourne. A research prototype, not a clinically deployed early-warning system.',
    stack: ['Python', 'MIMIC-IV', 'Logistic regression', 'GAM', 'XGBoost', 'Streamlit'],
    constraints: ['The sample contains 2,000 patients and 262 septic cases (13.1%), creating class imbalance.', 'The first 1, 2 and 4 hours after admission are observation windows, not fixed lead times before onset.', 'Report tables and the separate dashboard capture use different experimental configurations.'],
    architecture: { title: 'From observations to interpretation', caption: 'Study workflow, not a clinical decision system. Dashboard demonstration and report comparisons remain separate.', steps: [
      { title: 'Cohort & observations', body: 'MIMIC-IV sample and early admission windows' },
      { title: 'Features & split', body: 'Statistical features and an 80:20 stratified split' },
      { title: 'Model comparison', body: 'Logistic regression, GAM and XGBoost experiments' },
      { title: 'Interpretation', body: 'Reported comparisons, GAM effects and dashboard exploration' },
    ] },
    decisions: [
      { title: 'Compare explicit observation windows', body: 'Early admission measurements are transformed into statistical features for comparison across model families.', tradeoff: 'Summarising irregular time series simplifies modelling but can lose temporal detail.' },
      { title: 'Inspect additive feature effects', body: 'A GAM and dashboard make non-linear feature effects inspectable alongside predictions.', tradeoff: 'Interpretable model terms do not establish causal relationships or clinical validity.' },
      { title: 'Keep experimental versions distinct', body: 'The report comparison tables and dashboard run are labelled separately, with sources for each figure.', tradeoff: 'The versions need reconciliation before claiming a single reproducible benchmark.' },
    ],
    challenge: { title: 'Interpretation needs a traceable experiment', body: 'The report and dashboard use different resampling and model configurations. Their numbers cannot be combined, and the source report has an unresolved F1-score inconsistency.', resolution: 'The research page reproduces report ROC-AUC comparisons with page references, omits inconsistent F1 values and labels the dashboard as a separate run. Reconciliation of preprocessing, code and model settings remains the next reproducibility step.' },
    verification: [
      { title: 'Study design', body: 'Report p.16 documents 2,000 sampled patients, 262 septic cases, length of stay below 500 hours and an 80:20 stratified split.' },
      { title: 'Results provenance', body: 'Research-page ROC-AUC comparisons are transcribed from Tables 7–8 on p.19; they have not been independently reproduced.' },
      { title: 'Contribution provenance', body: 'The shared contribution statement follows the team table on p.27. Selected aggregate figures exclude patient records and student identifiers.' },
    ],
    outcomes: [
      { value: '2,000', label: 'Patients in the reported sample', note: '262 septic cases · report p.16.' },
      { value: '3', label: 'Model families compared', note: 'Logistic regression, GAM and XGBoost; report and dashboard results remain separate.' },
    ],
    limitations: ['Single-hospital data, a small imbalanced sample and limited evaluation constrain generalisation. Clinical validity is not established.', 'Report and dashboard configurations differ. Model-term indexing needs reconciliation before interpreting the supplied feature-effect figures.', 'The PDF records November 2025; inconsistent project dates are not repeated. The original report contains student identifiers and is not a public download.'],
    artifacts: [
      { title: 'Study design and results', body: 'The research page includes reported ROC-AUC comparisons and source page references.', path: '/research/sepsis', label: 'Read research summary' },
      { title: 'Selected report figures', body: 'Aggregate interpretation and dashboard figures are shown below with their scope.' },
    ],
  },
  vationo: {
    type: 'Independent research', role: 'Independent quantitative research',
    overview: 'Exploring momentum, volatility and clustering-based market segmentation for a regime-aware exposure framework. This case explains the research questions and boundaries; verified investment performance is not presented.',
    problem: 'Market conditions change. A systematic research process needs an explicit representation of those conditions before an exposure rule can be evaluated meaningfully.',
    contribution: 'Historical equity-data analysis, clustering-based segmentation and a regime-switching exposure framework. Current public material describes the structure; a reproducible evaluation package is not yet linked.',
    context: 'Independent research. The public Vationo learning-engine animation illustrates the concept rather than a measured backtest.',
    stack: ['Historical equity data', 'Momentum', 'Volatility', 'Clustering', 'Research evaluation'],
    constraints: ['A market-state model needs evaluation on data not used to fit its structure.', 'Exposure rules need comparison with a benchmark, including costs and drawdown.', 'A concept animation cannot establish performance or execution reliability.'],
    architecture: { title: 'Conceptual research structure', caption: 'A research framework, not proof of a validated trading strategy.', steps: [
      { title: 'Historical observations', body: 'Price and volume data' },
      { title: 'Signal representation', body: 'Momentum and volatility characteristics' },
      { title: 'Market segmentation', body: 'Clustering-based regime representation' },
      { title: 'Exposure framework', body: 'Investigate allocation under changing conditions' },
    ] },
    decisions: [
      { title: 'Represent changing conditions explicitly', body: 'Clustering describes historical market states before exposure rules are studied.', tradeoff: 'A statistical grouping needs stability checks before it can be interpreted as a durable regime.' },
      { title: 'Separate framework and performance', body: 'This case describes the signal and segmentation approach without unverified return or outperformance figures.', tradeoff: 'A stronger conclusion depends on reproducible out-of-sample evaluation, data provenance and costs.' },
    ],
    challenge: { title: 'Turning a framework into a testable claim', body: 'A regime diagram or historical pattern suggests a research direction, but does not establish how exposure decisions perform on unseen data.', resolution: 'The next milestone is an evaluation package with exact dataset dates, split boundaries, a comparator, transaction costs and drawdown analysis. These are outstanding requirements rather than completed results.' },
    verification: [
      { title: 'Available artifact', body: 'The Vationo public site supplies the conceptual learning-engine animation below.' },
      { title: 'Evaluation status', body: 'A public notebook, project-specific repository and reproducible out-of-sample report are not attached. No verified investment-performance metric is shown.' },
    ],
    outcomes: [],
    limitations: ['Exact data coverage, provenance, out-of-sample performance, transaction costs and drawdown results remain undocumented here.', 'No profitable-trading, investment-outperformance or live-execution-readiness claim is made.'],
    artifacts: [{ title: 'Vationo public site', body: 'Source of the conceptual learning-engine animation.', href: 'https://vationo.com', label: 'Visit source site' }],
  },
};
