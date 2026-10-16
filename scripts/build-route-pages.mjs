import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { items } from '../src/data/portfolio.js';
import { projectCovers } from '../src/data/media.js';

// GitHub Pages serves physical directories; give direct project links their own
// entry document and share metadata while React still owns page rendering.
const output = fileURLToPath(new URL('../dist/', import.meta.url));
const template = await readFile(resolve(output, 'index.html'), 'utf8');
const site = 'https://jp5635.github.io/portfolio-bento/';
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const entries = [
  { path: '/', title: 'Software Engineer', summary: 'Full-stack development, multi-cloud deployment validation and applied AI. Engineering work and technical writing by Jongho Park, Software Engineer in Melbourne.' },
  { path: '/resume', title: 'Résumé', summary: 'Software engineering experience at Zetaris, independent AI projects, cloud skills and education. View and download Jongho Park’s current résumé.' },
  ...items.filter(item => item.collection !== 'Experience'),
  { path: '/byoc', title: 'Testing persisted application state with Playwright', summary: 'A general engineering guide to saved-state verification.', redirect: true },
  { path: '/credential-access', title: 'Recoverable operations with a PostgreSQL outbox', summary: 'A general engineering guide to atomic handoff and recovery.', redirect: true },
  { path: '/lakehouse-sync', title: 'Resumable multipart uploads in Amazon S3', summary: 'A general engineering guide to recoverable multipart transfers.', redirect: true },
  { path: '/datastack', title: 'Resumable multipart uploads in Amazon S3', summary: 'A general engineering guide to recoverable multipart transfers.', redirect: true },
  { path: '/mlstack', title: 'ResearchQ', summary: 'Explore ResearchQ’s AI workflows and retrieval evaluation.', redirect: true },
];

function pageFor(entry) {
  const canonical = new URL(entry.path.replace(/^\//, ''), site).href;
  const cover = projectCovers[entry.id]?.social || projectCovers[entry.related]?.social || 'covers/portfolio-social.png';
  let page = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(entry.title)} | Jongho Park</title>`);
  const meta = (key, value, property = false) => {
    const attribute = property ? 'property' : 'name';
    const tag = `<meta ${attribute}="${key}" content="${escape(value)}" />`;
    const pattern = new RegExp(`<meta ${attribute}="${key}"[^>]*>`);
    page = pattern.test(page) ? page.replace(pattern, tag) : page.replace('</head>', `    ${tag}\n  </head>`);
  };
  meta('description', entry.summary);
  meta('robots', entry.publicationStatus === 'planned' || entry.redirect ? 'noindex, follow' : 'index, follow');
  meta('og:title', `${entry.title} | Jongho Park`, true);
  meta('og:description', entry.summary, true);
  meta('og:url', canonical, true);
  meta('og:type', entry.collection === 'Blog' ? 'article' : 'website', true);
  meta('og:image', new URL(cover, site).href, true);
  meta('og:image:width', '1200', true);
  meta('og:image:height', '630', true);
  meta('twitter:card', 'summary_large_image');
  page = page.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${escape(canonical)}" />`);
  return page;
}

for (const cover of Object.values(projectCovers).filter(cover => cover.social)) await access(resolve(output, cover.social));
await access(resolve(output, 'covers/portfolio-social.png'));
for (const entry of entries) {
  const folder = resolve(output, entry.path.replace(/^\//, ''));
  await mkdir(folder, { recursive: true });
  await writeFile(resolve(folder, 'index.html'), pageFor(entry));
}
const notFound = pageFor({ path: '/', title: 'Page not found', summary: 'Explore Jongho Park’s engineering work and technical writing.', redirect: true });
await writeFile(resolve(output, '404.html'), notFound);
console.log(`Created ${entries.length} route entry documents with page-specific metadata and a 404 fallback.`);
