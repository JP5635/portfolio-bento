import { useState } from 'react';
import './ProjectCover.css';
import { media, projectCovers } from '../data/media';

const base = import.meta.env.BASE_URL;

function FallbackArtwork() {
  return <svg viewBox="0 0 480 286" role="img" aria-label="Technical project overview" className="project-cover-scene">
    <rect width="480" height="286" fill="#f2f3ef" />
    <rect width="480" height="7" fill="#193147" />
    <text x="28" y="51" fill="#677985" fontSize="11" letterSpacing="1.4">ENGINEERING NOTES</text>
    <text x="28" y="88" fill="#193147" fontSize="25" fontWeight="600">From problem to implementation</text>
    <path d="M125 171h55m120 0h55" fill="none" stroke="#6d928d" strokeWidth="2" />
    {[['Problem', 28], ['Decisions', 185], ['Validation', 342]].map(([label, x]) => <g key={label}>
      <rect x={x} y="143" width="110" height="56" rx="5" fill="#fff" stroke="#c8d2d7" />
      <text x={x + 55} y="177" textAnchor="middle" fill="#193147" fontSize="13">{label}</text>
    </g>)}
  </svg>;
}

export default function ProjectCover({ id }) {
  const cover = Object.hasOwn(projectCovers, id) ? projectCovers[id] : null;
  const asset = cover?.media ? media[cover.media] : null;
  const src = asset?.src || cover?.src;
  const [failedSrc, setFailedSrc] = useState(null);
  const canShowAsset = Boolean(src && failedSrc !== src);

  return <figure className={`project-cover${asset ? ' project-cover-capture' : ''}`}>
    <div className={`project-cover-art${cover?.crop ? ` cover-crop-${cover.crop}` : ''}`}>
      {!canShowAsset ? <FallbackArtwork /> : asset ? <>
        <div className="project-cover-heading"><span>{cover.eyebrow}</span><strong>{cover.title}</strong></div>
        <div className="project-cover-window">
          {cover.viewport ? <svg className="project-cover-photo" viewBox={cover.viewport} role="img" aria-label={cover.alt}>
            <image href={`${base}${src}`} width={asset.width} height={asset.height} onError={() => setFailedSrc(src)} />
          </svg> : <img className="project-cover-photo" src={`${base}${src}`} width={asset.width} height={asset.height} alt={asset.alt} loading="lazy" decoding="async" onError={() => setFailedSrc(src)} />}
        </div>
      </> : <img className="project-cover-scene" src={`${base}${src}`} width="480" height="286" alt={cover.alt} loading="lazy" decoding="async" onError={() => setFailedSrc(src)} />}
    </div>
    <figcaption className="project-cover-caption"><span>{cover?.label || 'Engineering overview'}</span><span>{canShowAsset ? cover?.context : 'Overview'}</span></figcaption>
  </figure>;
}
