import React, { useState, useEffect } from 'react';

const PILLS = [
  'Python', 'SQL', 'BigQuery', 'Spark', 'dbt',
  'Airflow', 'FastAPI', 'Docker', 'GCP', 'Kafka'
];

export default function DataStackCard() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let active = true;
    let indexInterval;
    let cycleTimeout;

    const startStagger = () => {
      if (!active) return;
      setVisibleCount(0);
      let count = 0;

      indexInterval = setInterval(() => {
        if (!active) return;
        count++;
        setVisibleCount(count);
        if (count >= PILLS.length) {
          clearInterval(indexInterval);
          // Wait 5 seconds, then animate out and repeat
          cycleTimeout = setTimeout(() => {
            if (!active) return;
            setVisibleCount(0);
            // Stagger in again after 600ms
            setTimeout(startStagger, 600);
          }, 5000);
        }
      }, 90);
    };

    startStagger();

    return () => {
      active = false;
      clearInterval(indexInterval);
      clearTimeout(cycleTimeout);
    };
  }, []);

  return (
    <div id="sd" className="pebble">
      <div className="card-content sd-content">
        <p className="section-label">Data &amp; Cloud Stack</p>
        <div className="pill-grid" id="data-pills">
          {PILLS.map((pill, idx) => (
            <span
              key={idx}
              className={`sk-pill ${idx < visibleCount ? 'vis' : ''}`}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
