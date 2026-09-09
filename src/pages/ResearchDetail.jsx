import { Link } from 'react-router-dom';
import { sepsisReport as report } from '../data/research';
import RelatedContent from '../components/RelatedContent';
import SourceGallery from '../components/SourceGallery';
import './ProjectDetail.css';

export default function ResearchDetail() {
  return <main className="project-detail research-detail">
    <Link className="detail-back" to="/">← Back to work</Link>
    <header className="detail-heading">
      <p className="detail-eyebrow">Course report · Applied ML</p>
      <h1>{report.title}</h1>
      <p className="detail-summary">A team study comparing logistic regression, GAM and XGBoost on early hospital-admission measurements, with an emphasis on model interpretability.</p>
      <dl className="detail-facts"><div><dt>Authors</dt><dd>{report.authors.join(' · ')}</dd></div><div><dt>Source</dt><dd>{report.course}</dd></div></dl>
    </header>
    <section className="detail-section"><h2>Study design</h2><p>The report describes a sample of 2,000 MIMIC-IV patients, including 262 labelled septic cases (13.1%), with hospital length of stay below 500 hours. An 80:20 split was stratified by the sepsis label (p.16).</p><p>Models used the first 1, 2 or 4 hours of measurements after hospital admission. These are observation windows, not a claim of predicting sepsis a fixed number of hours before onset.</p></section>
    <section className="detail-section"><h2>My contribution</h2><p>The team contribution table credits Jongho Park with phenotyping, data collection, dataset creation, exploratory analysis, model development, results analysis, visualisation and report writing (p.27). These were shared contributions, not sole ownership of the study.</p></section>
    <section className="detail-section"><h2>Reported evaluation</h2>
      <div className="research-table-wrap" role="region" aria-label="Reported ROC-AUC by model and observation window" tabIndex={0}>
        <table className="research-table"><caption>ROC-AUC · Report p.19, Tables 7–8</caption><thead><tr><th scope="col">Model</th><th scope="col">2-hour window</th><th scope="col">4-hour window</th></tr></thead><tbody>{report.results.map(row => <tr key={row.model}><th scope="row">{row.model}</th><td>{row.twoHour}</td><td>{row.fourHour}</td></tr>)}</tbody></table>
      </div>
      <p className="detail-evidence">Transcribed from the submitted report, not independently reproduced. The source contains an unresolved F1-score inconsistency, so F1 values are not reproduced here. The dashboard capture below uses a different run and should not be combined with these results.</p>
    </section>
    <SourceGallery id="sepsis-research" />
    <section className="detail-section"><h2>Limitations & source notes</h2><ul className="detail-source-notes"><li>Single-hospital data, a small imbalanced sample and limited evaluation constrain generalisation. This is a research prototype, not a clinically validated system.</li><li>The supplied dashboard code uses a 2-hour dataset, SMOTE and GAM tuning; the report describes SMOTETomek and different model settings. Reproduction requires reconciling these versions.</li><li>The PDF metadata records November 2025; project dates in the résumé need confirmation. No journal or conference publication is claimed.</li><li>The original PDF includes student identifiers and is not offered as a public download. Only selected aggregate figures are included.</li></ul><p className="research-source">Source: {report.source}, 31 pages · Methods p.16–18 · Results p.19 · Figures p.22/26 · Contributions p.27.</p></section>
    <RelatedContent id="sepsis-research" />
  </main>;
}
