import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogPost.css';

export default function MLStackPost() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-post-container split-layout">
      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Portfolio</Link>
      </div>

      <div className="blog-split-layout">
        {/* Left Column: Sticky Sidebar (Dark) */}
        <aside className="blog-sidebar-col">
          <div className="blog-sidebar-sticky">
            <div className="sidebar-show-details">
              <div className="sidebar-header-art art-rq">🧠</div>
              <span className="sidebar-show-tag">Skills Podcast Show</span>
              <h1 className="sidebar-show-title">Machine Learning & AI Stack</h1>
              <p className="sidebar-show-meta">AI Modeling & RAG Architecture • 4 Episodes</p>
            </div>

            {/* Sidebar Tools Cloud */}
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Core Stack & Tools</h3>
              <div className="badge-cloud">
                <span className="badge">RAG Systems</span>
                <span className="badge">Vector Databases</span>
                <span className="badge">PyTorch</span>
                <span className="badge">TensorFlow</span>
                <span className="badge">Scikit-Learn</span>
                <span className="badge">HuggingFace / NLP</span>
                <span className="badge">Transformers</span>
                <span className="badge">GAMs Modeling</span>
                <span className="badge">Prompt Engineering</span>
                <span className="badge">Few-Shot Prompting</span>
                <span className="badge">LLM Evaluation</span>
                <span className="badge">Semantic Search</span>
                <span className="badge">Multivariate Statistics</span>
                <span className="badge">Probability Theory</span>
                <span className="badge">Python ML</span>
              </div>
            </div>

            {/* Overview / Sidebar Card */}
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Show Host</h3>
              <div className="ref-card-sidebar">
                <h4>Jongho Park</h4>
                <p>
                  ML Engineer with a Master's in Data Science, focused on retrieval-augmented systems and neural modeling.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Main Content (Light) */}
        <main className="blog-main-col">
          <section className="blog-section">
            <h2>Overview</h2>
            <p>
              A comprehensive overview of my capabilities in training deep neural networks, building Large Language Model (LLM) applications, configuring vector database retrieval systems, and evaluating generative AI agents in production.
            </p>
          </section>

          <section className="blog-section">
            <h2>Detailed ML Episodes</h2>
            <div className="episode-list">

              {/* Episode 4 */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">E4</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>Generative AI, RAG, & Vector DBs</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>Large Language Models & Optimization</span>
                  </div>
                </div>

                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Generative models face context window limits and hallucination errors, making reliable fact-retrieval from dense academic sources difficult without context assembly.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Designed and optimized end-to-end **Retrieval-Augmented Generation (RAG)** systems combining semantic search, hierarchical chunking, and key-value caching. 
                      Configured few-shot prompting templates, structured reasoning techniques, and built evaluation scripts for prompt benchmarking.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Technical Concept Definitions</span>
                    <span className="tech-value">
                      <span className="tech-concept-tag">Vector DB</span> A specialized database engine that stores data as vector embeddings (lists of numbers), calculating cosine similarity to pull semantically matching rows.
                      <span className="tech-concept-tag">Context Assembly</span> The step where retrieved semantic chunks and system instructions are organized into a prompt template, grounding the LLM in reference texts.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Enhanced retrieval relevance by **20% to 30%** via hierarchical indexing.<br/>
                      • Lowered irrelevant context injections and reduced API latency down to **~400ms**.
                    </span>
                  </div>
                </div>
              </div>

              {/* Episode 3 */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">E3</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>Deep Learning & AI Frameworks</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>Neural Networks & Tabular Modeling</span>
                  </div>
                </div>

                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Modeling clinical ICU records requires capturing highly non-linear physiological risk relationships without sacrificing model interpretability, which is vital for clinical validation.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Built neural architectures utilizing **PyTorch** and **TensorFlow**. 
                      Trained tabular classification models on MIMIC-IV using **Scikit-learn**, and formulated **Generalised Additive Models (GAMs)** to extract interpretable risk curves.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Technical Concept Definitions</span>
                    <span className="tech-value">
                      <span className="tech-concept-tag">PyTorch / TensorFlow</span> Leading deep learning frameworks that calculate gradients automatically over tensor operations, enabling rapid training of complex neural graphs.
                      <span className="tech-concept-tag">GAM (Generalised Additive Model)</span> A statistical model that replaces linear terms with smooth functions of predictors, capturing non-linear patterns while maintaining coefficient-level explainability.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Constructed a clinical GAM-based decision support system visualising risk trajectories.<br/>
                      • Handled high-frequency time-series datasets of **~2,000 patient admissions** safely.
                    </span>
                  </div>
                </div>
              </div>

              {/* Episode 2 */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">E2</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>Natural Language Processing (NLP)</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>Text Mining & Embeddings</span>
                  </div>
                </div>

                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Public sentiment datasets (e.g. 270K+ Twitter/Mastodon posts) are highly informal, noisy, and contain shifting semantic meanings that standard bag-of-words classifiers fail to process.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Built text-processing pipelines using pretrained transformer models.
                      Ingested, cleaned, and embedded unstructured data using HuggingFace **Transformers** for downstream sentiment classification.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Technical Concept Definitions</span>
                    <span className="tech-value">
                      <span className="tech-concept-tag">Transformers</span> Deep learning architectures using self-attention mechanisms to weigh the importance of different words in a sentence, capturing long-range semantic dependencies.
                      <span className="tech-concept-tag">Embeddings</span> Vector representations of words or sentences in high-dimensional space, where geometric distance correlates with semantic similarity.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Ingested, cleaned, and categorized public sentiment over **270K+ social posts**.<br/>
                      • Tracked public opinion shifts using temporal embeddings.
                    </span>
                  </div>
                </div>
              </div>

              {/* Episode 1 */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">E1</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>Academic Foundation</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>The University of Melbourne</span>
                  </div>
                </div>

                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Applying ML models without understanding underlying statistics, probability limits, and computational constraints leads to brittle and non-scalable models.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Completed a **Master of Data Science** (Mar, 2023 - Nov, 2025) and a **Bachelor of Science** (Mar, 2020 - Nov, 2022).
                      Deepened mathematical foundations in multivariate statistics, probability, optimization, advanced algorithms, and distributed computing structures.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Technical Concept Definitions</span>
                    <span className="tech-value">
                      <span className="tech-concept-tag">Multivariate Statistics</span> Analyzing multiple variables simultaneously to understand covariance and dependency structures, essential for feature selection.
                      <span className="tech-concept-tag">Distributed Computing Theory</span> Principles governing how programs share computations across multiple machines, laying foundations for training large-scale models.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Built strong theoretical foundations supporting correct algorithm selection and model optimization.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
