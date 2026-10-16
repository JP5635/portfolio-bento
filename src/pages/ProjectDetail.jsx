import { Link, Navigate, useLocation } from 'react-router-dom';
import { items } from '../data/portfolio';
import { projects } from '../data/projects';
import RelatedContent from '../components/RelatedContent';
import SourceGallery from '../components/SourceGallery';
import VationoAnimation from '../components/VationoAnimation';
import './ProjectDetail.css';

function ArtifactLink({ artifact }) {
  if (artifact.path) return <Link to={artifact.path}>{artifact.label} <span aria-hidden="true">↗</span></Link>;
  const href = artifact.asset ? `${import.meta.env.BASE_URL}${artifact.asset}` : artifact.href;
  return href ? <a href={href} target="_blank" rel="noreferrer">{artifact.label} <span aria-hidden="true">↗</span><span className="detail-sr-only"> (opens in a new tab)</span></a> : null;
}

export default function ProjectDetail({ id }) {
  const item = items.find(entry => entry.id === id);
  const project = projects[id];
  const location = useLocation();
  const researchContext = id === 'sepsis' && new URLSearchParams(location.search).get('context') === 'research';
  if (researchContext) return <Navigate to="/research/sepsis" replace />;
  if (!item || !project) return <main className="project-detail"><Link className="detail-back" to="/">← Back to work</Link><header className="detail-heading"><h1>Project not found</h1><p className="detail-summary">Explore the selected work to find an available case study.</p></header></main>;

  const role = project.role || item.role;
  const sections = [['overview', 'Overview'], ['architecture', 'Architecture'], ['decisions', 'Decisions'], ['verification', 'Verification'], ['artifacts', 'Artifacts']];
  return <main className="project-detail">
    <Link className="detail-back" to="/">← Back to work</Link>
    <header className="detail-heading">
      <p className="detail-eyebrow">{project.type} · {item.category}</p>
      <h1>{item.title}</h1>
      <p className="detail-summary">{project.overview || item.summary}</p>
      <dl className="detail-facts">
        <div><dt>My role</dt><dd>{project.roleLink ? <Link to={project.roleLink} aria-label={`${role} — view résumé`}>{role} ↗</Link> : role}</dd></div>
        {project.period && <div><dt>Period</dt><dd>{project.period}</dd></div>}
      </dl>
      {project.stack?.length > 0 && <ul className="detail-stack" aria-label="Technologies and methods">{project.stack.map(technology => <li key={technology}>{technology}</li>)}</ul>}
    </header>
    <nav className="detail-toc" aria-label="In this case study">{sections.filter(([anchor]) => anchor === 'overview' || anchor === 'verification' || project[anchor]).map(([anchor, label]) => <a key={anchor} href={`#case-${anchor}`}>{label}</a>)}</nav>
    <section className="detail-section" id="case-overview" aria-labelledby="overview-heading">
      <p className="detail-section-label">01 / Context</p>
      <h2 id="overview-heading">The problem & my contribution</h2>
      <p>{project.problem}</p>
      <div className="detail-contribution"><h3>What I worked on</h3><p>{project.contribution}</p></div>
      {project.context && <p className="detail-context">{project.context}</p>}
      {project.constraints?.length > 0 && <div className="detail-constraints"><h3>Constraints that shaped the work</h3><ul className="detail-source-notes">{project.constraints.map(constraint => <li key={constraint}>{constraint}</li>)}</ul></div>}
    </section>
    {project.architecture && <section className="detail-section" id="case-architecture" aria-labelledby="architecture-heading">
      <p className="detail-section-label">02 / System</p>
      <h2 id="architecture-heading">{project.architecture.title}</h2>
      <figure className="detail-architecture"><ol>{project.architecture.steps.map((step, index) => <li key={step.title}><span className="architecture-step" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol><figcaption>{project.architecture.caption}</figcaption></figure>
    </section>}
    {project.decisions?.length > 0 && <section className="detail-section" id="case-decisions" aria-labelledby="decisions-heading">
      <p className="detail-section-label">03 / Engineering judgment</p>
      <h2 id="decisions-heading">Design decisions & trade-offs</h2>
      <div className="detail-decisions">{project.decisions.map((decision, index) => <article key={decision.title}><span className="decision-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{decision.title}</h3><p>{decision.body}</p>{decision.tradeoff && <p className="detail-tradeoff"><strong>Trade-off.</strong> {decision.tradeoff}</p>}</div></article>)}</div>
    </section>}
    {project.challenge && <section className="detail-section detail-challenge" aria-labelledby="challenge-heading">
      <p className="detail-section-label">04 / Challenge</p>
      <h2 id="challenge-heading">{project.challenge.title}</h2><p>{project.challenge.body}</p>
      <div className="detail-resolution"><h3>How I approached it</h3><p>{project.challenge.resolution}</p></div>
    </section>}
    <section className="detail-section" id="case-verification" aria-labelledby="verification-heading">
      <p className="detail-section-label">05 / Evidence</p>
      <h2 id="verification-heading">Validation & recorded results</h2>
      {project.outcomes?.length > 0 && <dl className="detail-outcomes">{project.outcomes.map(outcome => <div key={outcome.label}><dt>{outcome.label}</dt><dd>{outcome.value}</dd><p>{outcome.note}</p></div>)}</dl>}
      <div className="detail-verification">{project.verification?.map(check => <article key={check.title}><h3>{check.title}</h3><p>{check.body}</p></article>)}</div>
    </section>
    {project.limitations?.length > 0 && <section className="detail-section" aria-labelledby="limitations-heading"><h2 id="limitations-heading">Scope & limitations</h2><ul className="detail-source-notes">{project.limitations.map(limit => <li key={limit}>{limit}</li>)}</ul></section>}
    {project.artifacts?.length > 0 && <section className="detail-section" id="case-artifacts" aria-labelledby="artifacts-heading"><h2 id="artifacts-heading">Artifacts & further reading</h2><div className="detail-artifacts">{project.artifacts.map(artifact => <article key={artifact.title}><h3>{artifact.title}</h3><p>{artifact.body}</p><ArtifactLink artifact={artifact} /></article>)}</div></section>}
    <SourceGallery id={id} />
    {id === 'vationo' && <section className="detail-section"><h2>Concept animation</h2><VationoAnimation detail /><p className="research-source">Animation adapted from <a href="https://vationo.com" target="_blank" rel="noreferrer">vationo.com ↗</a>. A visualisation of the learning engine, not measured investment performance.</p></section>}
    <RelatedContent id={id} />
  </main>;
}
