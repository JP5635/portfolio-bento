import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogPost.css';

export default function DataStackPost() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-post-container split-layout">
      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Portfolio</Link>
      </div>

      <div className="blog-split-layout">
        {/* Left Column: Sticky Sidebar (Dark) */}
        <aside className="blog-sidebar-col">
          <div className="blog-sidebar-sticky">
            <div className="sidebar-show-details">
              <div className="sidebar-header-art art-vat">📊</div>
              <span className="sidebar-show-tag">Skills Podcast Show</span>
              <h1 className="sidebar-show-title">Data Stack & Infrastructure</h1>
              <p className="sidebar-show-meta">Cloud & Data Pipelines • 3 Episodes</p>
            </div>

            {/* Sidebar Tools Cloud */}
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Core Stack & Tools</h3>
              <div className="badge-cloud">
                <span className="badge">GCP / BigQuery</span>
                <span className="badge">AWS Cloud</span>
                <span className="badge">Cloudflare Workers</span>
                <span className="badge">Apache Spark</span>
                <span className="badge">Snowflake</span>
                <span className="badge">Apache Airflow</span>
                <span className="badge">dbt (Data Build Tool)</span>
                <span className="badge">Docker Containers</span>
                <span className="badge">Apache Kafka</span>
                <span className="badge">MySQL Tuning</span>
                <span className="badge">CouchDB NoSQL</span>
                <span className="badge">ETL / ELT Pipelines</span>
                <span className="badge">Data Warehousing</span>
                <span className="badge">Serverless APIs</span>
                <span className="badge">CI/CD Workflows</span>
              </div>
            </div>

            {/* Overview / Sidebar Card */}
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Show Host</h3>
              <div className="ref-card-sidebar">
                <h4>Jongho Park</h4>
                <p>
                  ML & Data Engineer specializing in building reproducible, low-latency, scalable pipelines.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Main Content (Light) */}
        <main className="blog-main-col">
          <section className="blog-section">
            <h2>Overview</h2>
            <p>
              An in-depth look at my expertise in handling large-scale data engineering projects.
              Below are the details on how I construct robust ETL pipelines, administer database engines, and deploy cloud services to run production-grade analytical platforms.
            </p>
          </section>

          <section className="blog-section">
            <h2>Detailed Stack Episodes</h2>
            <div className="episode-list">

              {/* Episode 3 */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">E3</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>Cloud Infrastructure & Serverless Serving</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>Cloud Deployments & Devops</span>
                  </div>
                </div>

                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Traditional VM-based API hosting is subject to cold-start delays, scaling lag, and high overhead costs, making global low-latency serving of model outputs difficult.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Orchestrated cloud deployments across **Google Cloud Platform (GCP)** and **Amazon Web Services (AWS)**.
                      Built highly responsive, globally distributed serverless serving layers using **Cloudflare Workers**, packaged APIs with **Docker** for local test consistency, and configured automated CI/CD build scripts.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Technical Concept Definitions</span>
                    <span className="tech-value">
                      <span className="tech-concept-tag">Cloudflare Workers</span> A serverless execution environment based on V8 Isolates that compiles and deploys code globally to CDN edge locations, cutting cold starts to under 10ms.
                      <span className="tech-concept-tag">CI/CD</span> Continuous Integration/Continuous Deployment pipelines that automate compiling, running tests, lint checking, and uploading assets to target cloud nodes.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Achieved average server response times of **~400ms** at edge nodes.<br/>
                      • Zero infrastructure maintenance overhead using pay-as-you-go serverless setups.
                    </span>
                  </div>
                </div>
              </div>

              {/* Episode 2 */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">E2</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>Distributed Computing & Big Data Engineering</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>ETL Orchestration & Warehouse Optimization</span>
                  </div>
                </div>

                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Geospatial log datasets (2M+ pings) contain high-volume temporal and spatial records that exhaust typical relational database performance, leading to slow analytical queries and failing reporting pipelines.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Built scalable analytical schemas on **Google BigQuery** using spatial partitioning and clustering keys. 
                      Utilized **Apache Spark** and **Snowflake** to transform distributed query workloads, structured modular transformations with **dbt (data build tool)**, and orchestrated dependency triggers with **Apache Airflow**.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Technical Concept Definitions</span>
                    <span className="tech-value">
                      <span className="tech-concept-tag">dbt (data build tool)</span> A development framework that compiles SQL `select` queries into production tables and views in warehouses, validating data quality via pre-defined schema tests.
                      <span className="tech-concept-tag">BigQuery Partitioning</span> Dividing a massive table into segment blocks based on date or coordinates, letting queries scan specific partitions to optimize performance and lower query billing costs.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Handled continuous ETL pipelines for **2M+ event points** seamlessly.<br/>
                      • Reduced GPS query search latency through spatial partitioning.
                    </span>
                  </div>
                </div>
              </div>

              {/* Episode 1 */}
              <div className="episode-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <span className="episode-num">E1</span>
                  <div style={{ flexGrow: 1 }}>
                    <h3 className="episode-title" style={{ margin: 0 }}>Databases, Ingestion, & SQL Administration</h3>
                    <span className="blog-meta" style={{ margin: '2px 0 0', fontSize: '0.75rem' }}>Storage Engines & Queueing</span>
                  </div>
                </div>

                <div className="tech-block-container" style={{ width: '100%' }}>
                  <div className="tech-row">
                    <span className="tech-label">The Challenge</span>
                    <span className="tech-value">
                      Ingesting high-frequency transactional data streams directly into relational databases often triggers database locking, connection pool exhaustion, and raw data loss.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Solution & Engineering</span>
                    <span className="tech-value">
                      Introduced **Apache Kafka** event streaming as a buffer zone to queue streaming feeds.
                      Optimized **MySQL** database schemas by introducing composite indexes and query tuning, and administered distributed NoSQL **CouchDB** clusters to support multi-region replication.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Technical Concept Definitions</span>
                    <span className="tech-value">
                      <span className="tech-concept-tag">Apache Kafka</span> A distributed event-store and stream-processing platform that queues messages durably across topics, decoupling high-speed inputs from database writers.
                      <span className="tech-concept-tag">CouchDB Replication</span> A master-master or master-slave replication mechanism that synchronizes JSON documents across distributed databases, letting nodes operate offline and sync later.
                    </span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Key Metrics & Impact</span>
                    <span className="tech-value">
                      • Engineered buffered event streaming pipelines resolving data loss threats.<br/>
                      • Optimized queries to support high concurrency reads under heavy workload.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
