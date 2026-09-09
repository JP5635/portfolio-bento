import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import './PortfolioExplorer.css';
import ProjectCover from '../components/ProjectCover';
import HeaderDino from '../components/HeaderDino';

import { collections, posts, items, getRouteItem } from '../data/portfolio';
import RelatedContent from '../components/RelatedContent';
import './ProjectDetail.css';

export default function PortfolioExplorer() {
  const [collection, setCollection] = useState('All');
  const [query, setQuery] = useState('');
  const [ascending, setAscending] = useState(false);
  const [view, setView] = useState(() => {
    try { return localStorage.getItem('portfolio-view') === 'list' ? 'list' : 'grid'; }
    catch { return 'grid'; }
  });
  useEffect(() => {
    try { localStorage.setItem('portfolio-view', view); }
    catch { /* Browsing still works when preference storage is unavailable. */ }
  }, [view]);
  const location = useLocation();
  const navigate = useNavigate();
  const isList = location.pathname === '/';
  const detailRef = useRef(null);
  const routeItem = getRouteItem(location.pathname, location.search);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.pathname !== '/') detailRef.current?.focus({ preventScroll: true });
  }, [location.pathname, location.search]);
  useEffect(() => {
    const fallbackTitles = { '/': 'Data Scientist', '/resume': 'Résumé', '/datastack': 'Data stack', '/mlstack': 'ML stack' };
    document.title = `${routeItem?.title || fallbackTitles[location.pathname] || 'Page not found'} | Jongho Park`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', routeItem?.summary || 'Projects, applied research and technical writing by Jongho Park, Data Scientist.');
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.content = routeItem?.publicationStatus === 'planned' || (!routeItem && !fallbackTitles[location.pathname]) ? 'noindex, follow' : 'index, follow';
  }, [routeItem, location.pathname]);
  const activeCollection = isList ? collection : routeItem?.collection;
  const visible = posts.filter(item => (collection === 'All' || item.collection === collection) && `${item.title} ${item.category} ${item.collection}`.toLowerCase().includes(query.toLowerCase()));
  if (ascending) visible.sort((a, b) => a.title.localeCompare(b.title));

  function openCollection(name) {
    setCollection(name);
    setQuery('');
    navigate('/');
  }

  return (
    <div className="explorer">
      <a className="explorer-skip" href="#portfolio-content">Skip to content</a>
      <header className="explorer-header">
        <h1><Link to="/">Jongho Park</Link></h1><span>Data Scientist</span>
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
          <div className="explorer-about"><span>Melbourne, Australia</span></div>
        </aside>
        <HeaderDino active={isList} />
        {isList ? <main id="portfolio-content" tabIndex={-1} className="explorer-main" aria-label="Portfolio items">
          <div className="explorer-toolbar">
            <label className="explorer-search"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg><input aria-label="Search portfolio" placeholder="Search…" value={query} onChange={event => setQuery(event.target.value)} /></label>
            <div className="explorer-collection"><span>{collection}</span><small>{visible.length} items</small></div>
            <button className="explorer-sort" onClick={() => setAscending(!ascending)} aria-pressed={ascending} aria-label="Sort by title">A–Z {ascending ? '↑' : '↕'}</button>
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
                <div className="explorer-card-bottom"><span>{item.collection === 'Projects' ? 'Go' : item.status}</span><span aria-hidden="true">↗</span></div>
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
    {item ? <article><p className="explorer-caption">Proposed article · {item.category}</p><h1>{item.title}</h1><p>{item.summary}</p><p className="explorer-writing-status">This article is planned; the full text is not available yet.</p><RelatedContent id={item.id} /></article> : <h1>Article not found</h1>}
  </main>;
}
