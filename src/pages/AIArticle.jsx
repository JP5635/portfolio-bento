import { Link } from 'react-router-dom';
import { aiArticles } from '../data/aiArticles';
import RelatedContent from '../components/RelatedContent';
import './ProjectDetail.css';
import './EngineeringArticle.css';
import './AIArticle.css';

const diagramDescriptions = {
  api: 'The application checks identity and permissions, calls a provider, validates its response and saves the result. A deadline can leave the provider outcome unknown.',
  context: 'Only eligible history and evidence enter selection and budgeting. The final request packet records what was sent, separately from stored conversation history.',
  retrieval: 'Indexing prepares versioned chunks and embeddings. Query-time retrieval selects permitted, current candidates before assembling answer context.',
  wiki: 'A model selects page references from an eligible index. The application validates and reads those pages before a second call answers with evidence.',
  sql: 'A governed calculation and current documentary evidence follow separate checks before their results support individual answer claims.',
  execution: 'A model proposal crosses a deterministic policy broker before execution in a bounded worker. The worker reaches data through a governed interface.',
};

function ContentSection({ section }) {
  return <section className="detail-section" id={section.id}>
    <h2>{section.title}</h2>
    {section.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    {section.code && <figure className="engineering-code">
      <figcaption>{section.codeCaption || 'Illustrative teaching example'}</figcaption>
      <pre tabIndex={0} aria-label={section.codeCaption || section.title}><code>{section.code}</code></pre>
    </figure>}
    {section.table && <div className="engineering-table-wrap" tabIndex={0} role="region" aria-label={section.title}>
      <table><thead><tr>{section.table.headings.map(heading => <th scope="col" key={heading}>{heading}</th>)}</tr></thead>
        <tbody>{section.table.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => column === 0
          ? <th scope="row" key={column}>{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody></table>
    </div>}
    {section.list && <ul className="detail-source-notes">{section.list.map(item => <li key={item}>{item}</li>)}</ul>}
    {section.after && <p>{section.after}</p>}
    {section.reference && <p className="ai-source-link"><a href={section.reference.href} target="_blank" rel="noreferrer">{section.reference.label} ↗</a></p>}
  </section>;
}

export default function AIArticle({ slug }) {
  const position = aiArticles.findIndex(article => article.slug === slug);
  const article = aiArticles[position];
  if (!article) return <main className="project-detail"><h1>Article not found</h1><Link to="/">Back to work</Link></main>;
  const diagram = `${import.meta.env.BASE_URL}diagrams/ai/${article.diagramKey}.html`;
  const previous = aiArticles[position - 1];
  const next = aiArticles[position + 1];

  return <main className="project-detail engineering-article ai-article">
    <Link className="detail-back" to="/">← Back to work</Link>
    <article>
      <header className="detail-heading">
        <p className="detail-eyebrow">AI systems · Part {position + 1} of {aiArticles.length} · {article.technology}</p>
        <h1>{article.title}</h1>
        <p className="detail-summary">{article.summary}</p>
        <p className="engineering-byline">Jongho Park · <time dateTime="2026-10-16">16 October 2026</time> · {article.readMinutes} min read</p>
      </header>
      <nav className="detail-toc" aria-label="On this page">
        <a href="#purpose">Purpose</a><a href="#diagram">Diagram</a>
        {article.sections.map(section => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}
        <a href="#references">References</a>
      </nav>
      <section className="detail-section" id="purpose">
        <h2>Purpose</h2><p>{article.purpose}</p>
        <div className="engineering-callout"><strong>Worked example</strong><p>{article.example}</p></div>
      </section>
      <section className="detail-section" id="diagram">
        <h2>The system at a glance</h2><p>{diagramDescriptions[article.diagramKey]}</p>
        <figure className="ai-diagram">
          <svg className="ai-diagram-mobile-preview" viewBox="0 106 480 174" role="img" aria-label={diagramDescriptions[article.diagramKey]}>
            <image href={`${import.meta.env.BASE_URL}covers/ai-${article.diagramKey}.svg`} width="480" height="286" />
          </svg>
          <iframe src={diagram} title={`${article.title}: interactive reference diagram`} loading="lazy" sandbox="allow-scripts allow-downloads" allowFullScreen />
          <figcaption><span>Original reference design · Archify</span><a href={diagram} target="_blank" rel="noreferrer">Open full diagram ↗</a></figcaption>
        </figure>
      </section>
      {article.sections.map(section => <ContentSection key={section.id} section={section} />)}
      <section className="detail-section" id="references">
        <h2>Technical references</h2>
        <ul className="detail-source-notes ai-references">{article.references.map(reference => <li key={reference.href}><a href={reference.href} target="_blank" rel="noreferrer">{reference.label} ↗</a></li>)}</ul>
      </section>
      <nav className="ai-series" aria-label="AI engineering series">
        <h2>AI systems with evidence and boundaries</h2>
        <ol>{aiArticles.map((entry, index) => <li key={entry.id} aria-current={entry.id === article.id ? 'page' : undefined}>
          <span>{String(index + 1).padStart(2, '0')}</span>{entry.id === article.id ? <strong>{entry.title}</strong> : <Link to={`/writing/${entry.slug}`}>{entry.title}</Link>}
        </li>)}</ol>
      </nav>
      <nav className="ai-pagination" aria-label="Adjacent articles">
        {previous && <Link to={`/writing/${previous.slug}`}><small>← Previous</small><span>{previous.title}</span></Link>}
        {next && <Link to={`/writing/${next.slug}`}><small>Next →</small><span>{next.title}</span></Link>}
      </nav>
    </article>
    <RelatedContent id={article.id} />
  </main>;
}
