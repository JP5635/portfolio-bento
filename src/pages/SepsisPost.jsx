import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogPost.css';

export default function SepsisPost() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-post-container">
      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Portfolio</Link>
      </div>

      <header className="blog-header">
        <div className="blog-header-art art-sep">🏥</div>
        <div className="blog-header-details">
          <span className="blog-header-tag">Project Episode</span>
          <h1 className="blog-title">Early Sepsis Detection</h1>
          <div className="blog-meta">
            <span>Jongho Park</span>
            <span className="blog-meta-separator">•</span>
            <span>Melbourne, Australia</span>
            <span className="blog-meta-separator">•</span>
            <span>4 min read</span>
          </div>
        </div>
      </header>

      <main className="blog-content">
        <section className="blog-section">
          <h2>Overview</h2>
          <p>
            <strong>Interpretable Machine Learning for Early Sepsis Detection</strong> is a healthcare AI project aimed at predicting sepsis onset before critical deterioration. 
            Using intensive care unit data, the system provides both accurate risk stratification and clinician-friendly interpretability.
          </p>
        </section>

        <section className="blog-section">
          <h2>Implementation Episodes</h2>
          <div className="episode-list">

            <div className="episode-card">
              <span className="episode-num">E1</span>
              <div className="episode-details">
                <h3 className="episode-title">Clinical Time-Series Feature Engineering</h3>
                <p className="episode-desc">
                  Developed an early-warning prediction system using the MIMIC-IV ICU dataset (~2,000 patient admissions).
                  Transformed raw, irregular clinical time-series data into structured ML-ready features for risk stratification.
                </p>
              </div>
            </div>

            <div className="episode-card">
              <span className="episode-num">E2</span>
              <div className="episode-details">
                <h3 className="episode-title">GAM-Based Decision Support Dashboard</h3>
                <p className="episode-desc">
                  Constructed a Generalized Additive Model (GAM) decision support dashboard to visualize feature contributions.
                  Tracks patient risk trajectories to facilitate clinician-facing explainability and real-time inference insights.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
