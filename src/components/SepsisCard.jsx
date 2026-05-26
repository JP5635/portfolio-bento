import { useNavigate } from 'react-router-dom';

export default function SepsisCard() {
  const navigate = useNavigate();

  return (
    <div id="sep" className="featured-card" onClick={() => navigate('/sepsis')}>
      <div className="featured-thumb">
        <div className="aurora" aria-hidden="true" style={{ opacity: 0.5 }}>
          <div className="a-blob a1" style={{ background: '#ec4899', width: '100px', height: '100px', animationDuration: '8s' }}></div>
          <div className="a-blob a2" style={{ background: '#ef4444', width: '80px', height: '80px', animationDuration: '12s' }}></div>
        </div>
        <div className="featured-gradient" aria-hidden="true"></div>
      </div>
      <div className="featured-details">
        <span className="featured-meta">Healthcare AI</span>
        <h3 className="featured-title">Sepsis Detection</h3>
        <p className="featured-desc">Interpretable early-warning clinical model built using MIMIC-IV time-series data.</p>
      </div>
    </div>
  );
}
