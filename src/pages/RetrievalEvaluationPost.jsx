import { Link } from 'react-router-dom';
import RelatedContent from '../components/RelatedContent';
import './ProjectDetail.css';
import './RetrievalEvaluationPost.css';

export default function RetrievalEvaluationPost() {
  return <main className="project-detail retrieval-note">
    <Link className="detail-back" to="/">← Back to work</Link>
    <article>
      <header className="detail-heading">
        <p className="detail-eyebrow">Engineering note · RAG systems · 16 October 2026</p>
        <h1>Diagnosing a multilingual retrieval failure</h1>
        <p className="detail-summary">A small evaluation exposed a mismatch between a Korean article corpus and an English embedding model. The useful result was a repeatable way to investigate retrieval.</p>
        <p className="retrieval-byline">Jongho Park · ResearchQ, an independent project</p>
      </header>
      <section className="detail-section">
        <h2>Start with a question the system should answer</h2>
        <p>ResearchQ combines a React/TypeScript publishing interface with a Cloudflare Workers backend. Its retrieval pipeline turns article content into chunks, embeds those chunks and queries a Vectorize index. Search results are grouped by article before being passed into the application’s wider authoring workflow.</p>
        <p>Implementing those steps was not enough to establish that retrieval worked. I needed a quick check of whether a query could find the document it came from. The first evaluation used published article titles as queries, then checked whether the source article appeared among the first five results.</p>
        <p>This is self-retrieval: the expected document is known because the query comes from it. It provides a narrow diagnostic signal without requiring a separately annotated relevance dataset.</p>
      </section>
      <section className="detail-section">
        <h2>The baseline revealed a language mismatch</h2>
        <p>The recorded baseline used an English embedding model, <code>bge-base-en</code>, against a corpus containing Korean content. Self-retrieval Recall@5 was 0.05 across 20 title-based queries: the source article appeared in the top five for one query.</p>
        <p>I switched to the multilingual <code>bge-m3</code> model, recreated the vector index for its 1,024-dimensional embeddings and backfilled the corpus. Query embeddings and stored document vectors then used the same model. After reindexing, I ran the evaluation again.</p>
        <div className="retrieval-results" aria-label="Recorded self-retrieval evaluation">
          <div><span>Baseline Recall@5</span><strong>0.05</strong><small>English embeddings</small></div>
          <div><span>After change</span><strong>0.95</strong><small>Multilingual embeddings</small></div>
          <div><span>Evaluation set</span><strong>20</strong><small>Article-title queries</small></div>
        </div>
        <p className="detail-evidence">Historical evaluation recorded on 3 June 2026. The latter run found the source article in the top five for 19 of 20 queries; recorded MRR was 0.89. The recorded index contained 213 chunks from 22 articles. These results have not been re-measured for this portfolio update.</p>
      </section>
      <section className="detail-section">
        <h2>Make the evaluation part of the workflow</h2>
        <p>The harness records Recall@k, reciprocal rank and mean rank, and persists evaluation runs for comparison. Article indexing and evaluation can run as background jobs, allowing the application to track work outside an interactive request.</p>
        <p>The important operational detail is the index state. Changing an embedding model also requires rebuilding the stored vectors; replacing only the query-side model would not create a consistent retrieval system. A comparison needs a completed backfill and known corpus version before its scores are interpretable.</p>
        <ol className="detail-source-notes">
          <li>Record the model, corpus snapshot and expected source article for each query.</li>
          <li>Embed the query and retrieve candidate chunks from the matching vector index.</li>
          <li>Group results by article, then check the expected article’s rank.</li>
          <li>Save aggregate scores and inspect missed queries before choosing the next change.</li>
        </ol>
      </section>
      <section className="detail-section">
        <h2>What this result measures</h2>
        <p>The improvement supports a specific conclusion: the multilingual change substantially improved source-article recovery on this small title-query test. It does not establish general search relevance, answer correctness or a user-experience improvement.</p>
        <p>Titles are unusually close to their source documents. Real users may ask paraphrased questions, combine ideas from several articles or ask something the corpus cannot answer. Twenty queries also leave considerable uncertainty about performance on a larger or changing collection.</p>
        <p>The next evaluation should use a separate, hand-labelled set of realistic questions, including paraphrases and questions with no supported answer. Retrieval quality and the quality of the final generated answer should be assessed separately. That extension is a next step, rather than a result claimed here.</p>
      </section>
      <section className="detail-section">
        <h2>The engineering lesson</h2>
        <p>A small, precisely defined evaluation can be more useful than a broad performance claim. In this case it turned an unclear retrieval problem into a concrete model-and-index change, while leaving the limits of the evidence visible.</p>
        <p className="detail-evidence">Source basis: ResearchQ’s dated implementation and evaluation records from June 2026. The related case study explains the application architecture, authoring workflow and background job processing.</p>
      </section>
    </article>
    <RelatedContent id="writing-retrieval-evaluation" />
  </main>;
}
