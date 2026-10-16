import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import './PortfolioExplorer.css';
import ProjectCover from '../components/ProjectCover';
import { projectCovers } from '../data/media';

import { collections, posts, items, getRouteItem, sortOptions, sortPortfolioItems } from '../data/portfolio';
import RelatedContent from '../components/RelatedContent';
import './ProjectDetail.css';

export default function PortfolioExplorer() {
  const [collection, setCollection] = useState('All');
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState('featured');
  const sortRef = useRef(null);
  const [view, setView] = useState(() => {
    try { return localStorage.getItem('portfolio-view') === 'list' ? 'list' : 'grid'; }
    catch { return 'grid'; }
  });
  useEffect(() => {
    try { localStorage.setItem('portfolio-view', view); }
    catch { /* Browsing still works when preference storage is unavailable. */ }
  }, [view]);
  useEffect(() => {
    function closeSort(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) sortRef.current.removeAttribute('open');
    }
    document.addEventListener('pointerdown', closeSort);
    return () => document.removeEventListener('pointerdown', closeSort);
  }, []);
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const navigate = useNavigate();
  const isList = location.pathname === '/';
  const detailRef = useRef(null);
  const routeItem = getRouteItem(location.pathname, location.search);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.pathname !== '/') detailRef.current?.focus({ preventScroll: true });
  }, [location.pathname, location.search]);
  useEffect(() => {
    const fallbackTitles = { '/': 'Software Engineer', '/resume': 'Résumé' };
    const title = `${routeItem?.title || fallbackTitles[pathname] || 'Page not found'} | Jongho Park`;
    const description = routeItem?.summary || 'Full-stack development, multi-cloud deployment validation and applied AI. Engineering work and technical writing by Jongho Park, Software Engineer in Melbourne.';
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    const canonical = `https://jp5635.github.io/portfolio-bento${pathname === '/' ? '/' : pathname}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
    const social = projectCovers[routeItem?.id]?.social || projectCovers[routeItem?.related]?.social || 'covers/portfolio-social.png';
    let image = document.querySelector('meta[property="og:image"]');
    if (!image) { image = document.createElement('meta'); image.setAttribute('property', 'og:image'); document.head.appendChild(image); }
    image.content = `https://jp5635.github.io/portfolio-bento/${social}`;
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.content = routeItem?.publicationStatus === 'planned' || (!routeItem && !fallbackTitles[pathname]) ? 'noindex, follow' : 'index, follow';
  }, [routeItem, pathname]);
  const activeCollection = isList ? collection : routeItem?.collection;
  const visible = sortPortfolioItems(posts.filter(item => (collection === 'All' || item.collection === collection) && `${item.title} ${item.category} ${item.collection} ${item.summary}`.toLowerCase().includes(query.toLowerCase())), sortMode);
  const sortLabel = sortOptions.find(option => option.value === sortMode)?.label || 'Featured';

  function openCollection(name) {
    setCollection(name);
    setQuery('');
    navigate('/');
  }

  return (
    <div className="explorer">
      <a className="explorer-skip" href="#portfolio-content">Skip to content</a>
      <header className="explorer-header">
        <h1><Link to="/">Jongho Park</Link></h1><span>Software Engineer</span>
        <nav className="explorer-social" aria-label="Social profiles"><a href="https://github.com/JP5635" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jongho-p/" target="_blank" rel="noreferrer">LinkedIn ↗</a></nav>
      </header>
      <div className="explorer-layout">
        <aside className="explorer-sidebar">
          <nav aria-label="Portfolio collections">
            {collections.map(name => <button key={name} aria-pressed={activeCollection === name} onClick={() => openCollection(name)}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M2.5 6V4.5h5L9 6h8.5v10h-15Z" /></svg>
              <span>{name}</span><small>{name === 'All' ? posts.length : posts.filter(item => item.collection === name).length}</small>
            </button>)}
          </nav>
          <div className="explorer-about"><span>Melbourne, Australia</span><p>Full-stack · Cloud · Applied AI</p><div><Link to="/resume">Résumé ↗</Link><a href="mailto:pjh5635@gmail.com">Email ↗</a></div></div>
        </aside>
        {isList ? <main id="portfolio-content" tabIndex={-1} className="explorer-main" aria-label="Portfolio items">
          <section className="explorer-introduction" aria-labelledby="portfolio-introduction">
            <p className="explorer-introduction-label">Melbourne-based software engineer</p>
            <h2 id="portfolio-introduction">Full-stack development,<br className="intro-desktop-break" /> cloud systems &amp; applied AI.</h2>
            <p>I build web applications, cloud test systems and AI workflows. At Zetaris, I contribute to React/TypeScript features, Java/Spring APIs and deployment validation across AWS, Azure and OCI.</p>
            <div className="explorer-introduction-links"><Link to="/resume">View résumé <span aria-hidden="true">↗</span></Link><a href="mailto:pjh5635@gmail.com">Get in touch <span aria-hidden="true">↗</span></a></div>
          </section>
          <div className="explorer-toolbar">
            <label className="explorer-search"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg><input aria-label="Search portfolio" placeholder="Search…" value={query} onChange={event => setQuery(event.target.value)} /></label>
            <div className="explorer-collection"><span>{collection}</span><small>{visible.length} items</small></div>
            <details className="explorer-sort-menu" ref={sortRef} onKeyDown={event => {
              if (event.key === 'Escape') { sortRef.current?.removeAttribute('open'); sortRef.current?.querySelector('summary')?.focus(); }
            }}>
              <summary aria-label={`Sort portfolio. Current: ${sortLabel}`} title={`Sort: ${sortLabel}`}>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true"><path d="M4 4h12M6 8h8M8 12h4M9 16h2"/><path d="m3 14 2 2 2-2M5 16V3"/></svg>
              </summary>
              <div className="explorer-sort-popover" role="menu" aria-label="Sort portfolio">
                <span role="presentation">Sort by</span>
                {sortOptions.map(option => <button type="button" role="menuitemradio" aria-checked={sortMode === option.value} key={option.value} onClick={() => {
                  setSortMode(option.value);
                  sortRef.current?.removeAttribute('open');
                  sortRef.current?.querySelector('summary')?.focus();
                }}><span>{option.label}</span><span aria-hidden="true">{sortMode === option.value ? '✓' : ''}</span></button>)}
              </div>
            </details>
            <div className="explorer-view-switch" role="group" aria-label="View mode">
              <button type="button" aria-label="List view" title="List view" aria-pressed={view === 'list'} onClick={() => setView('list')}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M7 5h10M7 10h10M7 15h10M3 5h1M3 10h1M3 15h1" /></svg></button>
              <button type="button" aria-label="Grid view" title="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="12" y="3" width="5" height="5" rx="1"/><rect x="3" y="12" width="5" height="5" rx="1"/><rect x="12" y="12" width="5" height="5" rx="1"/></svg></button>
            </div>
          </div>
          {view === 'grid' ? <div className="explorer-grid" role="group" aria-label="Portfolio cards">
            {visible.map(item => <Link key={item.id} className="explorer-card" to={item.path} aria-label={`${item.title} — ${item.status}`}>
              <ProjectCover id={item.id} />
              <div className="explorer-card-content">
                <div className="explorer-card-meta"><span>{item.collection}</span><span>{item.category}</span></div>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
                <div className="explorer-card-bottom"><span>{item.status}</span><span aria-hidden="true">↗</span></div>
              </div>
            </Link>)}
          </div> : <div className="explorer-table" role="group" aria-label="Portfolio details">
            <div className="explorer-columns" aria-hidden="true"><span>Title</span><span>Category</span><span>Type / period</span></div>
            {visible.map(item => <Link key={item.id} className="explorer-row" to={item.path} aria-label={`${item.title} — ${item.status}`}>
              <span className="explorer-row-title"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M5 2.5h6l4 4v11H5Z M11 2.5v4h4 M8 10h4 M8 13h4" /></svg><span>{item.title}</span></span>
              <span className="explorer-category">{item.category}</span><span className="explorer-status">{item.status}</span>
            </Link>)}
          </div>}
          {!visible.length && <div className="explorer-empty"><p>No matching items.</p><button onClick={() => setQuery('')}>Clear search</button></div>}
          <div className="explorer-list-end">{visible.length} items</div>
        </main> : <div id="portfolio-content" tabIndex={-1} ref={detailRef} className="explorer-detail"><Outlet /></div>}
      </div>
    </div>
  );
}

export function WritingDetail() {
  const { slug } = useParams();
  const item = items.find(entry => entry.id === slug && entry.collection === 'Blog');
  return <main className="explorer-writing-detail">
    <Link className="explorer-back" to="/">← Back to work</Link>
    {item ? <article><p className="explorer-caption">Proposed article · {item.category}</p><h1>{item.title}</h1><p>{item.summary}</p><p className="explorer-writing-status">This article is planned and is not included in the published collection. Explore the completed work below.</p><RelatedContent id={item.id} /></article> : <h1>Article not found</h1>}
  </main>;
}
