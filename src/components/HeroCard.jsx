import React from 'react';

export default function HeroCard() {
  return (
    <div id="hero" className="pebble">
      <div className="aurora" aria-hidden="true">
        <div className="a-blob a1"></div>
        <div className="a-blob a2"></div>
        <div className="a-blob a3"></div>
        <div className="a-blob a4"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-name">Jongho Park</h1>
        <p className="hero-role">AI Engineer · Data Scientist · Quant Developer</p>
        <div className="hero-pills">
          <span>Python</span>
          <span>LLM</span>
          <span>Deep Learning</span>
          <span>MLOps</span>
          <span>BigQuery</span>
        </div>
      </div>
    </div>
  );
}
