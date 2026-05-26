import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogPost.css';

export default function ResumePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-post-container split-layout">
      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Portfolio</Link>
      </div>

      <div className="blog-split-layout">
        {/* Left Column: Sticky Sidebar (Dark background) */}
        <aside className="blog-sidebar-col">
          <div className="blog-sidebar-sticky">
            {/* Header / Art */}
            <div className="sidebar-show-details">
              <div className="sidebar-header-art art-vat">💼</div>
              <span className="sidebar-show-tag">Professional Resume</span>
              <h1 className="sidebar-show-title">JONGHO PARK</h1>
              <p className="sidebar-show-meta">Machine Learning Engineer & Data Scientist</p>
            </div>

            {/* Contacts Section */}
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Contact Info</h3>
              <ul className="sidebar-contact-list">
                <li className="sidebar-contact-item">
                  <span>📍 Melbourne, Australia</span>
                </li>
                <li className="sidebar-contact-item">
                  <span>📞 +61 456 484 153</span>
                </li>
                <li className="sidebar-contact-item">
                  <span>📧 <a href="mailto:pjh5635@gmail.com">pjh5635@gmail.com</a></span>
                </li>
                <li className="sidebar-contact-item">
                  <span>🔗 <a href="https://www.linkedin.com/in/jongho-p/" target="_blank" rel="noreferrer">LinkedIn Profile</a></span>
                </li>
                <li className="sidebar-contact-item">
                  <span>🐙 <a href="https://github.com/JP5635" target="_blank" rel="noreferrer">GitHub Profile</a></span>
                </li>
              </ul>
            </div>

            {/* Core Skills Badge Cloud */}
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Core Skills</h3>
              <div className="badge-cloud">
                <span className="badge">RAG Systems</span>
                <span className="badge">LLM Prompting</span>
                <span className="badge">PyTorch</span>
                <span className="badge">TensorFlow</span>
                <span className="badge">Scikit-Learn</span>
                <span className="badge">AWS Cloud</span>
                <span className="badge">GCP / BigQuery</span>
                <span className="badge">ETL Pipelines</span>
                <span className="badge">Apache Spark</span>
                <span className="badge">Snowflake</span>
                <span className="badge">DBSCAN Clustering</span>
                <span className="badge">SQL & MySQL</span>
                <span className="badge">CouchDB</span>
                <span className="badge">Python</span>
                <span className="badge">R Language</span>
                <span className="badge">Java / TypeScript</span>
              </div>
            </div>

            {/* References Section */}
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Referees</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="ref-card-sidebar">
                  <h4>John Kim</h4>
                  <p>
                    Senior Analyst Engineer, NAB<br/>
                    Former DevOps, ResearchQ<br/>
                    +61 416 501 316<br/>
                    John.W.Kim@nab.com.au
                  </p>
                </div>
                <div className="ref-card-sidebar">
                  <h4>Taehoon Lee</h4>
                  <p>
                    Reliability Engineer, PHM Tech<br/>
                    Former PM, SNL-ICARUS<br/>
                    +61 403 557 390<br/>
                    johntee.lee@phmtechnology.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Main Content (Light background) */}
        <main className="blog-main-col">
          {/* Profile Section */}
          <section className="blog-section">
            <h2>Career Overview</h2>
            <p>
              Machine Learning Engineer and Master’s graduate in Data Science from the University of Melbourne.
              Specialized in designing low-latency AI-driven systems, custom machine learning workflows, and scalable Big Data ETL pipelines.
              Experienced in translating core business challenges into production-grade predictive models on cloud environments like AWS and GCP.
            </p>
          </section>

          {/* Professional Experience Section */}
          <section className="blog-section">
            <h2>Professional Experience</h2>
            <div className="episode-list">

              {/* Episode 3: ResearchQ */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">E3</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>Machine Learning Engineer — ResearchQ</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>Jul, 2025 - Present • Melbourne, Australia</span>
                  </div>
                </div>
                
                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Academic users required relevant and fast insights from dense scientific PDFs. 
                      Standard vector search was plagued by slow response times and high retrieval noise, causing incorrect context injections and model hallucination.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Re-architected the system as a custom **Retrieval-Augmented Generation (RAG)** pipeline. 
                      Implemented **Hierarchical Chunking** to preserve document structure, added **Vector Cache** indexing layers to skip repetitive lookups, and evaluated few-shot prompting templates for accurate synthesis.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Technical Concept Definitions</span>
                    <span className="tech-value">
                      <span className="tech-concept-tag">RAG</span> An AI pattern that queries structured/vector databases for facts to append to the LLM prompt, forcing factual answers.
                      <span className="tech-concept-tag">Hierarchical Chunking</span> Breaking a document into nested blocks (e.g. sections, subsections, and paragraphs) so vector search can retrieve precise targets while maintaining overall document context.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Served **2.7K+ active users** with end-to-end RAG API latency optimized to **~400ms** on serverless Workers.<br/>
                      • Improved retrieval relevance by **20% to 30%** on offline evaluation datasets.<br/>
                      • Designed user segmentation workflows across **10M+ interactions**, boosting targeting behavior lift by **+20%**.
                    </span>
                  </div>
                </div>
              </div>

              {/* Episode 2: ROK Army */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">E2</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>Signals Intelligence Sergeant — ROK Army</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>Jan, 2024 - Jul, 2025 • South Korea</span>
                  </div>
                </div>

                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Time-critical intelligence reporting was bottlenecked by unstructured, inconsistent inputs arriving under operational pressure.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Led a data workflow standardization effort. 
                      Redesigned data validation rules, created unified schema templates for report ingestion, and established validation checks to remove noise.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Technical Concept Definitions</span>
                    <span className="tech-value">
                      <span className="tech-concept-tag">Data Validation Check</span> Software constraints running against data inputs to ensure formatting, structure, and values strictly match reporting standards before compilation.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Directly managed **10+ personnel** workflows under high-pressure conditions.<br/>
                      • Standardized incoming information feeds, eliminating processing latency and guaranteeing report consistency.
                    </span>
                  </div>
                </div>
              </div>

              {/* Episode 1: Neighbourlytics */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">E1</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>Data Science Intern — Neighbourlytics</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>Mar, 2023 - Nov, 2023 • Melbourne, Australia</span>
                  </div>
                </div>

                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Mobile device GPS pings (2M+ events) were highly noisy, distorting urban behavioral segmentation and spatial analytics.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Built an automated spatial analytics pipeline on **Google BigQuery**. 
                      Developed a multi-stage spatial clustering framework evaluating **DBSCAN** and **Spectral Clustering** to filter GPS noise.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Technical Concept Definitions</span>
                    <span className="tech-value">
                      <span className="tech-concept-tag">DBSCAN</span> A density-based clustering algorithm. Unlike K-Means, it automatically infers the number of clusters and isolates anomalies as noise points, which is crucial for cleaning physical coordinates.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Reduced raw GPS ping coordinate noise by **35% to 45%**.<br/>
                      • Maintained and documented schema standards for **2M+ raw event points**, ensuring pipeline reproducibility.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Projects & Mentorship Section */}
          <section className="blog-section">
            <h2>Academic Projects & Mentorship</h2>
            <div className="episode-list">

              {/* Project 3 */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">P3</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>Technical Mentor — SNL-ICARUS</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>Apr, 2026 - May, 2026 • Melbourne, Australia</span>
                  </div>
                </div>
                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Structuring a secure, realistic training environment for cyber-security challenges without risking physical infrastructure details.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Mentorship</span>
                    <span className="tech-value">
                      Guided students in designing and deploying a multi-stage **Capture The Flag (CTF)** platform. 
                      Instructed them on setting up isolated containers representing vulnerable systems (web exploitation, auth bypass, injection vectors).
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Led mentoring for end-to-end sandbox challenges, training participants in secure engineering principles.
                    </span>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">P2</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>ML Researcher — Early Sepsis Detection</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>Jan, 2026 - Apr, 2026 • Melbourne, Australia</span>
                  </div>
                </div>
                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Sepsis risk rises rapidly in ICUs. High-frequency medical records contain noisy, missing, and non-linear patterns that standard linear models fail to interpret correctly.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Engineered a data modeling pipeline using the **MIMIC-IV** ICU dataset (~2,000 admissions). 
                      Constructed **Generalised Additive Models (GAMs)** to handle non-linear risk factors and built a decision-support dashboard highlighting feature contributions.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Technical Concept Definitions</span>
                    <span className="tech-value">
                      <span className="tech-concept-tag">GAM (Generalised Additive Model)</span> A statistical model that models non-linear relationships by sum of smooth curves, enabling clear clinical interpretability for risk factors.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Handled complex clinical time-series modeling for patient risk trajectories, providing clear feature contribution visuals.
                    </span>
                  </div>
                </div>
              </div>

              {/* Project 1 */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">P1</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>ML Engineer — Social Sentiment Analytics</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>Oct, 2025 - Jan, 2026 • Melbourne, Australia</span>
                  </div>
                </div>
                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Analyzing 270K+ social media posts across Twitter and Mastodon during critical periods, which required cleaning heavy slang and scale-friendly model inference.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Built automated NLP ingestion and cleaning pipelines. 
                      Utilized pretrained HuggingFace **Transformers** to extract embeddings and perform sentiment classification on unstructured social text.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Ingested and processed a massive corpus of **270K+ posts** to track public opinion trends over time.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Education Section */}
          <section className="blog-section">
            <h2>Education</h2>
            <div className="episode-list">

              <div className="episode-card">
                <span className="episode-num">ED2</span>
                <div className="episode-details">
                  <h3 className="episode-title">Master of Data Science — The University of Melbourne</h3>
                  <span className="blog-meta" style={{ margin: '2px 0 6px', fontSize: '0.75rem' }}>Mar, 2023 - Nov, 2025</span>
                  <p className="episode-desc">
                    Specialized coursework in Advanced Machine Learning, Statistical Modelling, Cloud & Distributed Computing, and Database Systems.
                  </p>
                </div>
              </div>

              <div className="episode-card">
                <span className="episode-num">ED1</span>
                <div className="episode-details">
                  <h3 className="episode-title">Bachelor of Science (Data Science) — The University of Melbourne</h3>
                  <span className="blog-meta" style={{ margin: '2px 0 6px', fontSize: '0.75rem' }}>Mar, 2020 - Nov, 2022</span>
                  <p className="episode-desc">
                    Core focus on Algorithms, Multivariate Statistics, Probability theory, and SQL database engines.
                  </p>
                </div>
              </div>

            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
