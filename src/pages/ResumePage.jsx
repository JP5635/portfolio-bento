import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Resume.css';

const resumeUrl = `${import.meta.env.BASE_URL}Jongho_Park_Software_Engineer_Resume.pdf`;

const experience = [
  {
    company: 'Zetaris', role: 'Junior Software Developer', period: 'Jul 2026 — Present',
    bullets: [
      'Operated and validated Bring Your Own Cloud (BYOC) deployments across AWS, Azure and OCI, tailoring test scenarios to customer environments and contributing bug fixes to support reliable releases.',
      'Built and enhanced Azure-based test systems and Azure DevOps CI pipelines, integrating backend-connected Playwright tests and Allure reporting to verify data persistence, permissions and release behaviour.',
      'Built Java/Spring Boot APIs and a React admin interface to control local deployment access and revoke Azure Container Registry credentials, with transaction locking, background retries and audit logging.',
      'Built merchant-risk scenarios and validation assets for an AI Data Steward demo for prospective customers, including Python-generated synthetic datasets, SQL reference answers, semantic models, graphs and supporting documents.',
      'Improved React/TypeScript data exploration and ingestion workflows through reusable table and form components, folder selection validation and predictable catalog navigation.',
      'Hardened deployment diagnostics with content-based secret redaction across Helm, Kubernetes and application logs; added unit and integration regression tests for failure paths.',
      'Built an Electron/DuckDB Lakehouse Sync prototype with resumable multipart uploads, change tracking and repair; validated a 14.8 GB Parquet load of 99,997,497 rows against a hosted test environment.',
    ],
  },
  {
    company: 'Neighbourlytics', role: 'Data Science Intern', period: 'Mar 2023 — Nov 2023', location: 'Melbourne',
    bullets: [
      'Built BigQuery geospatial processing workflows over approximately 2 million mobile-device pings, preparing data for spatial analysis and behavioural segmentation.',
      'Developed preprocessing and validation workflows, evaluated DBSCAN and spectral clustering, and documented schemas to support reproducible analysis.',
    ],
  },
];

const projects = [
  {
    title: 'ResearchQ AI Research Publishing Platform',
    context: 'Independent project',
    stack: 'React, TypeScript, OpenAI API, Cloudflare Workers, D1, Vectorize, Queues',
    path: '/researchq',
    bullets: [
      'Built a multilingual RAG pipeline and evaluation harness; diagnosed an embedding-language mismatch and improved self-retrieval Recall@5 from 0.05 to 0.95 on 20 title-based queries.',
      'Implemented custom agentic workflows with OpenAI APIs for planning, context retrieval, drafting and self-review, using structured audience instructions and human-controlled publication.',
      'Built and deployed a React/TypeScript application and Cloudflare Workers backend with 75 API endpoints, relational data storage and vector search.',
      'Implemented background job processing for generation, indexing and evaluation using Cloudflare Queues, typed messages, automatic retries and a dead-letter queue.',
      'Recorded per-stage latency and output metrics, persisted retrieval evaluation results and captured failed drafts to support diagnosis and comparison between runs.',
      'Refactored a 4,494-line React component into 13 focused modules, reducing the main file to 2,651 lines through 11 build-verified increments.',
    ],
  },
  {
    title: 'Cloud Social Sentiment Analytics Platform',
    context: 'University of Melbourne team project',
    stack: 'Python, Docker, Ansible, OpenStack, CouchDB',
    bullets: [
      'Contributed to a distributed cloud platform for ingesting and analysing Twitter and Mastodon posts, combining NLP workflows with time-series and geographic analysis.',
      'Used Docker and Ansible for repeatable multi-node deployment on Melbourne Research Cloud, with CouchDB storage and MapReduce views for distributed aggregation.',
    ],
  },
];

const skills = [
  ['Software engineering', 'Python, TypeScript/JavaScript, Java, SQL; React, Next.js, Spring Boot, REST APIs'],
  ['Generative and agentic AI', 'LLMs, OpenAI API, RAG, prompt and context engineering, custom agent workflows, retrieval evaluation'],
  ['Cloud platforms', 'AWS, Microsoft Azure (Container Registry), Oracle Cloud Infrastructure (OCI), GCP (BigQuery), Cloudflare Workers'],
  ['Testing and delivery', 'Azure-based test systems, Azure DevOps CI/CD, Playwright, JUnit, Allure, Docker; Git, Claude Code'],
  ['Reliability and security', 'Background job processing, retries and dead-letter queues, generation metrics, secret redaction, audit logging'],
];

function ExperienceEntry({ job }) {
  return (
    <article className="cv-entry">
      <div className="cv-entry-heading">
        <div><h3>{job.role}</h3><p>{job.company}{job.location && <span> · {job.location}</span>}</p></div>
        <span className="cv-period">{job.period}</span>
      </div>
      <ul>{job.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
      {job.links && <div className="cv-entry-links">{job.links.map(link => <Link className="cv-project-link" to={link.path} key={link.path}>{link.label} ↗</Link>)}</div>}
    </article>
  );
}

export default function ResumePage({ embedded = false }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className={`cv-page${embedded ? ' cv-embedded' : ''}`}>
      {!embedded && <header className="cv-topbar"><Link to="/">Jongho Park</Link><span>Software Engineer</span><Link className="cv-back" to="/">← All work</Link></header>}
      <div className="cv-layout">
        {!embedded && <aside className="cv-sidebar">
          <p className="cv-label">Résumé</p>
          <nav aria-label="Résumé sections">
            <a href="#cv-experience">Experience</a><a href="#cv-projects">Engineering projects</a><a href="#cv-skills">Skills</a><a href="#cv-education">Education</a><a href="#cv-additional">Additional experience</a>
          </nav>
          <a className="cv-download" href={resumeUrl} download>Download résumé PDF ↓</a>
        </aside>}
        <main className="cv-document">
          <div className="cv-introduction">
            {embedded && <Link className="cv-project-link" to="/">← Back to work</Link>}
            <p className="cv-label">Résumé · Software Engineer</p>
            <h1>Jongho Park</h1>
            <p className="cv-specialism">Full-stack development · Multi-cloud systems · Applied AI</p>
            <p>Software developer at Zetaris with commercial experience in React/TypeScript, Java/Spring REST APIs and Bring Your Own Cloud (BYOC) deployments across AWS, Azure and OCI. Builds Azure-based test systems and Azure DevOps CI pipelines to support customer-specific validation and reliable releases. Independently developed RAG and custom agentic LLM workflows using OpenAI APIs, prompt and context engineering, and retrieval evaluation. Holds a Master of Data Science from the University of Melbourne.</p>
            <div className="cv-contact"><span>Melbourne, VIC</span><a href="tel:+61456484153">+61 456 484 153</a><a href="mailto:pjh5635@gmail.com">pjh5635@gmail.com</a><a href="https://github.com/JP5635" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jongho-p/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
            <a className="cv-download" href={resumeUrl} download>Download résumé PDF ↓</a>
          </div>
          <section id="cv-experience" aria-labelledby="cv-experience-title">
            <h2 id="cv-experience-title">Professional experience</h2>
            {experience.map(job => <ExperienceEntry key={job.company} job={job} />)}
          </section>
          <section id="cv-projects" aria-labelledby="cv-projects-title">
            <h2 id="cv-projects-title">Selected engineering projects</h2>
            {projects.map(project => <article key={project.title} className="cv-entry">
              <div className="cv-entry-heading"><div><h3>{project.title}</h3><p>{project.context}</p></div></div>
              <p className="cv-stack">{project.stack}</p>
              <ul>{project.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
              {project.path && <Link className="cv-project-link" to={project.path}>Read the engineering case study ↗</Link>}
            </article>)}
          </section>
          <section id="cv-skills" aria-labelledby="cv-skills-title"><h2 id="cv-skills-title">Technical skills</h2><dl className="cv-skills">{skills.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></section>
          <section id="cv-education" aria-labelledby="cv-education-title">
            <h2 id="cv-education-title">Education</h2>
            <article className="cv-entry"><div className="cv-entry-heading"><div><h3>Master of Data Science</h3><p>The University of Melbourne</p></div><span className="cv-period">2023 — 2025</span></div><p>Machine learning, statistical modelling, cloud and distributed computing.</p></article>
            <article className="cv-entry"><div className="cv-entry-heading"><div><h3>Bachelor of Science in Data Science</h3><p>The University of Melbourne</p></div><span className="cv-period">2020 — 2022</span></div><p>Foundations in algorithms, probability, statistics and database systems.</p></article>
          </section>
          <section id="cv-additional" aria-labelledby="cv-additional-title">
            <h2 id="cv-additional-title">Additional experience</h2>
            <article className="cv-entry"><div className="cv-entry-heading"><div><h3>Signals Intelligence Sergeant</h3><p>Republic of Korea Army</p></div><span className="cv-period">Jan 2024 — Jul 2025</span></div><p>Led a team of 10+ personnel and standardised intelligence reporting workflows, maintaining data quality and consistency in time-sensitive operations.</p></article>
          </section>
          <section id="cv-certifications" aria-labelledby="cv-certifications-title"><h2 id="cv-certifications-title">Certifications</h2><p className="cv-certifications">AWS Cloud Practitioner · ADsP (Data Analytics Semi-Professional)</p></section>
        </main>
      </div>
    </div>
  );
}
