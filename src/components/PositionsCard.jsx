import React, { useState, useEffect } from 'react';

const ROLES = [
  { label: 'Data Scientist', color: '#818cf8' },
  { label: 'AI Engineer', color: '#38bdf8' },
  { label: 'Quant Researcher', color: '#34d399' },
  { label: 'MLOps Engineer', color: '#fbbf24' },
  { label: 'Full-stack AI Dev', color: '#f472b6' }
];

export default function PositionsCard() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % ROLES.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="rl" className="pebble">
      <div className="card-content roles-content">
        <p className="section-label">Positions</p>
        <div id="role-list" className="role-list">
          {ROLES.map((role, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={i}
                className={`role-item ${isActive ? 'active' : ''}`}
              >
                <span
                  className="role-dot"
                  style={{
                    background: isActive ? role.color : 'rgba(255,255,255,0.15)',
                    boxShadow: isActive ? `0 0 9px ${role.color}` : ''
                  }}
                ></span>
                <span>{role.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
