import React from 'react';

export default function ContactCard() {
  return (
    <div id="ct" className="pebble">
      <div className="ct-bg" aria-hidden="true"></div>
      <div className="card-content ct-content">
        <h2 className="ct-headline">Let's build something together</h2>
        <p className="ct-desc">
          Interested in AI/ML solutions, quantitative research, or engineering collaborations? Let's connect.
        </p>
        <a href="mailto:jonghopark@example.com" className="ct-btn">
          <span>Get in touch</span>
          <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="1" y1="6" x2="13" y2="6"></line>
            <polyline points="8 1 13 6 8 11"></polyline>
          </svg>
        </a>
      </div>
    </div>
  );
}
