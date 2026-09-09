import { Link } from 'react-router-dom';
import { getRelatedItems } from '../data/portfolio';

export default function RelatedContent({ id }) {
  const related = getRelatedItems(id);
  if (!related.length) return null;
  return <section className="detail-related" aria-label="Related content">
    <h2>Related</h2>
    <div>{related.map(item => <Link key={item.id} to={item.path}>
      <span><small>{item.collection === 'Experience' ? 'Résumé' : item.collection} · {item.status}</small><strong>{item.title}</strong></span>
      <span aria-hidden="true">↗</span>
    </Link>)}</div>
  </section>;
}
