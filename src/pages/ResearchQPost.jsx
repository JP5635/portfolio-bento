import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogPost.css';

export default function ResearchQPost() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-post-container">
      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Portfolio</Link>
      </div>

      <header className="blog-header">
        <div className="blog-header-art art-rq">🔍</div>
        <div className="blog-header-details">
          <span className="blog-header-tag">Project Episode</span>
          <h1 className="blog-title">ResearchQ</h1>
          <div className="blog-meta">
            <span>Jongho Park</span>
            <span className="blog-meta-separator">•</span>
            <span>Melbourne, Australia</span>
            <span className="blog-meta-separator">•</span>
            <span>5 min read</span>
          </div>
        </div>
      </header>

      <main className="blog-content">
        <section className="blog-section">
          <h2>Overview</h2>
          <p>
            <strong>ResearchQ</strong> is an AI-powered research platform focused on simplifying academic research discovery and insights.
            It serves 2.7K+ users by transforming scientific documents into interactive learning experiences using retrieval-augmented generation (RAG) pipelines.
          </p>
        </section>

        <section className="blog-section">
          <h2>The Problem & Approach</h2>
          <p>
            <strong>Problem:</strong> Academic research papers are often dense, long, and difficult to parse quickly. Users (students, researchers, professionals) struggled to find specific insights without reading entire documents.
          </p>
          <p>
            <strong>Solution:</strong> We decided to build a <em>Retrieval-Augmented Generation (RAG)</em> system. RAG combines information retrieval with a text-generator model, allowing the AI to search a database of documents and use the relevant snippets as context to answer user queries accurately.
          </p>
        </section>

        <section className="blog-section">
          <h2>Implementation Episodes</h2>
          <div className="episode-list">
            
            <div className="episode-card">
              <span className="episode-num">E1</span>
              <div className="episode-details">
                <h3 className="episode-title">Building & Optimising the RAG System</h3>
                <p className="episode-desc">
                  We built a RAG pipeline combining semantic search, hierarchical chunking, and context assembly. 
                  By refining how documents were chunked (broken into smaller pieces) and retrieved, we improved retrieval relevance by ~20–30% in offline evaluations. To handle real-time production workloads, we optimised the retrieval architecture using key-value caching and vector indexing, reducing end-to-end inference latency to ~400ms.
                </p>
              </div>
            </div>

            <div className="episode-card">
              <span className="episode-num">E2</span>
              <div className="episode-details">
                <h3 className="episode-title">Data-Driven Insights & Prompt Engineering</h3>
                <p className="episode-desc">
                  Based on 10M+ interaction events, we designed a data-driven segmentation pipeline to identify key user groups and improve content targeting efficiency (+20% proxy behavioural lift). We also designed and evaluated few-shot prompting and structured reasoning strategies to improve LLM response quality and consistency.
                </p>
              </div>
            </div>

            <div className="episode-card">
              <span className="episode-num">E3</span>
              <div className="episode-details">
                <h3 className="episode-title">Evaluation & Cloud Deployment</h3>
                <p className="episode-desc">
                  We built an end-to-end evaluation framework including offline evaluation sets, prompt benchmarking, and model comparison across iterations. Production ML/RAG APIs were deployed and served using Cloudflare Workers and cloud infrastructure, enabling highly scalable and low-latency inference serving.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
