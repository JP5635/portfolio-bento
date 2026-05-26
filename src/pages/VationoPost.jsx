import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogPost.css';

export default function VationoPost() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-post-container">
      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Portfolio</Link>
      </div>

      <header className="blog-header">
        <div className="blog-header-art art-vat">📈</div>
        <div className="blog-header-details">
          <span className="blog-header-tag">Project Episode</span>
          <h1 className="blog-title">Vationo</h1>
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
            <strong>Vationo</strong> is a systematic trading and quantitative research project focused on uncovering alpha generation signals across various market regimes. 
            It leverages extensive historical equity data and clustering-based market segmentation to dynamically adapt to changing volatility environments.
          </p>
        </section>

        <section className="blog-section">
          <h2>Implementation Episodes</h2>
          <div className="episode-list">

            <div className="episode-card">
              <span className="episode-num">E1</span>
              <div className="episode-details">
                <h3 className="episode-title">Systematic Trading Research</h3>
                <p className="episode-desc">
                  Conducted systematic trading research on 20+ years of equity price and volume data.
                  Identified momentum and volatility-driven signals for alpha generation across multiple market regimes.
                </p>
              </div>
            </div>

            <div className="episode-card">
              <span className="episode-num">E2</span>
              <div className="episode-details">
                <h3 className="episode-title">Regime-Switching Allocation Framework</h3>
                <p className="episode-desc">
                  Constructed a regime-switching portfolio allocation framework representing 12 distinct market states.
                  Used clustering-based market segmentation to adapt exposure dynamically under changing volatility environments.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
