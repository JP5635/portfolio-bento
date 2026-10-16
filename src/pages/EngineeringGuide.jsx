import { Link } from 'react-router-dom';
import { engineeringGuides } from '../data/engineeringGuides';
import RelatedContent from '../components/RelatedContent';
import './ProjectDetail.css';
import './EngineeringArticle.css';

export default function EngineeringGuide({ id }) {
  const guide = engineeringGuides[id];
  if (!guide) return <main className="project-detail"><h1>Article not found</h1><Link to="/">Back to work</Link></main>;
  return <main className="project-detail engineering-article">
    <Link className="detail-back" to="/">← Back to work</Link>
    <article>
      <header className="detail-heading">
        <p className="detail-eyebrow">Engineering guide · {guide.technology} · 16 October 2026</p>
        <h1>{guide.title}</h1>
        <p className="detail-summary">{guide.summary}</p>
        <p className="engineering-byline">Jongho Park · General engineering knowledge</p>
      </header>
      <section className="detail-section"><h2>Purpose: {id === 'credential-access' ? 'keep accepted work recoverable' : 'preserve progress and verify the result'}</h2><p>{guide.purpose}</p><div className="engineering-callout"><strong>Original teaching example</strong><p>{guide.example}</p></div></section>
      {guide.sections.map(section => <section className="detail-section" key={section.title}>
        <h2>{section.title}</h2>
        {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {section.reference && <p className="detail-evidence"><a href={section.reference.href} target="_blank" rel="noreferrer">{section.reference.label} ↗</a></p>}
        {section.code && <figure className="engineering-code"><figcaption>{section.codeCaption}</figcaption><pre tabIndex={0} aria-label={section.codeCaption}><code>{section.code}</code></pre></figure>}
        {section.table && <div className="engineering-table-wrap" tabIndex={0} role="region" aria-label={section.title}><table><thead><tr>{section.table.headings.map(heading => <th scope="col" key={heading}>{heading}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>}
        {section.list && <ul className="detail-source-notes">{section.list.map(item => <li key={item}>{item}</li>)}</ul>}
        {section.after && <p>{section.after}</p>}
      </section>)}
    </article>
    <RelatedContent id={id} />
  </main>;
}
