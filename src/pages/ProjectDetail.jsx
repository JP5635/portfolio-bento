import { Link, Navigate, useLocation } from 'react-router-dom';
import { items } from '../data/portfolio';
import { projects } from '../data/projects';
import RelatedContent from '../components/RelatedContent';
import SourceGallery from '../components/SourceGallery';
import VationoAnimation from '../components/VationoAnimation';
import { capturedArticles } from '../data/media';
import './ProjectDetail.css';

export default function ProjectDetail({ id }) {
  const item = items.find(entry => entry.id === id);
  const project = projects[id];
  const location = useLocation();
  const researchContext = id === 'sepsis' && new URLSearchParams(location.search).get('context') === 'research';
  if (researchContext) return <Navigate to="/research/sepsis" replace />;

  return <main className="project-detail">
    <Link className="detail-back" to="/">← Back to work</Link>
    <header className="detail-heading">
      <p className="detail-eyebrow">{project.type} · {item.category}</p>
      <h1>{item.title}</h1>
      <p className="detail-summary">{item.summary}</p>
      <dl className="detail-facts">
        <div><dt>Role</dt><dd>{project.roleLink ? <Link to={project.roleLink} aria-label={`${item.role} — view résumé`}>{item.role} ↗</Link> : item.role}</dd></div>
        {project.period && <div><dt>Period</dt><dd>{project.period}</dd></div>}
      </dl>
    </header>
    <SourceGallery id={id} />
    {id === 'vationo' && <section className="detail-section"><VationoAnimation detail /><p className="research-source">Animation adapted from <a href="https://vationo.com" target="_blank" rel="noreferrer">vationo.com ↗</a>. A visualisation of the learning engine, not measured investment performance.</p></section>}
    {id === 'researchq' && <section className="detail-section"><h2>From the captured library</h2><ul className="detail-source-notes">{capturedArticles.map(title => <li key={title}>{title}</li>)}</ul><p className="research-source">Titles visible in the supplied service capture. Article bodies and current permalinks have not been verified; these are separate from the proposed Blog articles.</p></section>}
    <section className="detail-section"><h2>Problem</h2><p>{project.problem}</p></section>
    <section className="detail-section"><h2>My contribution</h2><p>{project.contribution}</p></section>
    <section className="detail-section"><h2>Approach</h2><div className="detail-approach">{project.approach.map((step, index) => <div key={step.title}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></div>)}</div></section>
    <section className="detail-section"><h2>Results & scope</h2><dl className="detail-outcomes">{project.outcomes.map(outcome => <div key={outcome.label}><dt>{outcome.label}</dt><dd>{outcome.value}</dd><p>{outcome.note}</p></div>)}</dl>{project.scale && <p>{project.scale}</p>}<p className="detail-evidence">{project.evidence}</p></section>
    <section className="detail-section"><h2>Limitations</h2><p>{project.limitations}</p></section>
    <RelatedContent id={id} />
  </main>;
}
