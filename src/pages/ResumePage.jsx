import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Resume.css';

const experience = [
  { company: 'ResearchQ', role: 'Machine Learning Engineer', period: 'Jul 2025 — Present', location: 'Melbourne, Australia', path: '/researchq', bullets: [
    'Built and optimised RAG pipelines using hierarchical chunking, vector indexing and caching for a platform serving 2.7K+ users.',
    'Improved retrieval relevance by approximately 20–30% in offline evaluations and developed prompt benchmarking workflows.',
    'Built segmentation workflows across 10M+ interaction events and deployed ML APIs on cloud infrastructure.',
  ] },
  { company: 'ROK Army', role: 'Signals Intelligence Sergeant', period: 'Jan 2024 — Jul 2025', location: 'South Korea', bullets: [
    'Led reporting workflows for 10+ personnel in time-critical operational environments.',
    'Standardised ingestion schemas, validation rules and report templates to improve consistency.',
  ] },
  { company: 'Neighbourlytics', role: 'Data Science Intern', period: 'Mar 2023 — Nov 2023', location: 'Melbourne, Australia', bullets: [
    'Built BigQuery spatial analytics pipelines for 2M+ GPS events.',
    'Evaluated DBSCAN and spectral clustering to filter noisy coordinates, reducing noise by approximately 35–45%.',
    'Documented schemas and data processing workflows for reproducibility.',
  ] },
];
const research = [
  { title: 'Technical Mentor · SNL-ICARUS', period: 'Apr — May 2026', description: 'Guided students in designing a multi-stage Capture The Flag platform using isolated containers and practical security challenges.' },
  { title: 'ML Researcher · Early Sepsis Detection', period: 'Jan — Apr 2026', description: 'Built a modelling pipeline for approximately 2,000 MIMIC-IV admissions and a GAM dashboard for exploring feature contributions and risk trajectories.', path: '/sepsis' },
  { title: 'ML Engineer · Social Sentiment Analytics', period: 'Oct 2025 — Jan 2026', description: 'Processed 270K+ social posts using NLP ingestion, cleaning and transformer-based sentiment classification.' },
];
const skills = [
  ['Machine learning', 'RAG · PyTorch · TensorFlow · scikit-learn · Transformers · Statistical modelling'],
  ['Data & infrastructure', 'BigQuery · SQL · Spark · ETL pipelines · AWS · GCP'],
  ['Languages', 'Python · R · SQL · Java · TypeScript'],
];

export default function ResumePage({ embedded = false }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className={`cv-page${embedded ? ' cv-embedded' : ''}`}>
      {!embedded && <header className="cv-topbar"><Link to="/">Jongho Park</Link><span>Data Scientist</span><Link className="cv-back" to="/">← All work</Link></header>}
      <div className="cv-layout">
        {!embedded && <aside className="cv-sidebar">
          <p className="cv-label">Résumé</p>
          <nav aria-label="Résumé sections">
            <a href="#cv-experience">Experience</a><a href="#cv-research">Research & mentorship</a><a href="#cv-education">Education</a><a href="#cv-skills">Skills</a>
          </nav>
          <div className="cv-contact"><span>Melbourne, Australia</span><a href="mailto:pjh5635@gmail.com">pjh5635@gmail.com</a><a href="https://github.com/JP5635" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jongho-p/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
        </aside>}
        <main className="cv-document">
          <div className="cv-introduction">
            {embedded && <Link className="cv-project-link" to="/">← Back to work</Link>}
            <p className="cv-label">Background & experience</p>
            <h1>Jongho Park</h1>
            <p>Data scientist and machine learning engineer working across production AI, applied research and data infrastructure. Master of Data Science graduate from the University of Melbourne.</p>
          </div>
          <section id="cv-experience" aria-labelledby="cv-experience-title">
            <h2 id="cv-experience-title">Experience</h2>
            {experience.map(job => <article key={job.company} className="cv-entry">
              <div className="cv-entry-heading"><div><h3>{job.role}</h3><p>{job.company} <span>· {job.location}</span></p></div><time>{job.period}</time></div>
              <ul>{job.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
              {job.path && <Link className="cv-project-link" to={job.path}>Go ↗</Link>}
            </article>)}
          </section>
          <section id="cv-research" aria-labelledby="cv-research-title">
            <h2 id="cv-research-title">Research & mentorship</h2>
            {research.map(project => <article key={project.title} className="cv-entry"><div className="cv-entry-heading"><h3>{project.title}</h3><time>{project.period}</time></div><p>{project.description}</p>{project.path && <Link className="cv-project-link" to={project.path}>Go ↗</Link>}</article>)}
          </section>
          <section id="cv-education" aria-labelledby="cv-education-title">
            <h2 id="cv-education-title">Education</h2>
            <article className="cv-entry"><div className="cv-entry-heading"><div><h3>Master of Data Science</h3><p>The University of Melbourne</p></div><time>Mar 2023 — Nov 2025</time></div><p>Advanced machine learning, statistical modelling, cloud and distributed computing, database systems.</p></article>
            <article className="cv-entry"><div className="cv-entry-heading"><div><h3>Bachelor of Science · Data Science</h3><p>The University of Melbourne</p></div><time>Mar 2020 — Nov 2022</time></div><p>Algorithms, multivariate statistics, probability and database systems.</p></article>
          </section>
          <section id="cv-skills" aria-labelledby="cv-skills-title"><h2 id="cv-skills-title">Skills</h2><dl className="cv-skills">{skills.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></section>
        </main>
      </div>
    </div>
  );
}
