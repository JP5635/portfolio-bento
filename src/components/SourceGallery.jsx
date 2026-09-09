import { media, projectMedia } from '../data/media';

export default function SourceGallery({ id }) {
  const entries = projectMedia[id];
  if (!entries?.length) return null;
  return <section className="source-gallery detail-section" aria-label="Screenshots and report figures">
    <h2>{id === 'researchq' ? 'Product screen' : 'Report figures'}</h2>
    {entries.map(key => {
      const entry = media[key];
      const url = `${import.meta.env.BASE_URL}${entry.src}`;
      return <figure key={key}>
        <a className="source-image-link" href={url} target="_blank" rel="noreferrer" aria-label={`Open full image: ${entry.title} (new tab)`}>
          <img src={url} width={entry.width} height={entry.height} alt={entry.alt} loading="lazy" decoding="async" />
        </a>
        <figcaption><div><strong>{entry.title}</strong><a href={url} target="_blank" rel="noreferrer" aria-label={`View full image: ${entry.title} (new tab)`}>View full image ↗</a></div><small>{entry.source}</small><p>{entry.note}</p></figcaption>
      </figure>;
    })}
  </section>;
}
