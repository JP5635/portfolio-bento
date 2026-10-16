# Jongho Park — Software Engineering Portfolio

A personal portfolio of full-stack development, cloud engineering and applied AI work. Independent projects and university research sit alongside focused engineering articles. Employment history belongs in the résumé; the engineering guides teach general concepts through independently authored examples and public documentation.

Live site: [jp5635.github.io/portfolio-bento](https://jp5635.github.io/portfolio-bento/)

## Local development

Use Node.js 22, matching the existing GitHub Pages workflow.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, including the `/portfolio-bento/` base path. Run the existing checks before publishing:

```sh
npm run lint
node --test tests/*.test.js
npm run build
npm run preview
```

`npm run preview` serves the generated `dist/` build for a final route, image and responsive-layout check. The test suite uses Node's built-in test runner; there is no separate test script in `package.json`.

## Stack

- React 19 and React Router for the portfolio and case-study pages.
- Vite 5 for local development and static builds.
- CSS for the responsive portfolio explorer, project covers and résumé.
- Three.js and local JavaScript modules for the optional interactive project demonstrations.
- ESLint and Node's built-in tests for code and content validation.

## Content map

| Location | Purpose |
| --- | --- |
| `src/data/portfolio.js` | Portfolio cards, collections, routes, publication status and related items. |
| `src/data/projects.js` | Project case studies, engineering decisions, validation and limitations. |
| `src/data/engineeringGuides.js` | General PostgreSQL outbox and S3 multipart-upload articles with original examples and public references. |
| `src/data/aiArticles*.js` | Six general AI engineering articles: API reliability, context, vector retrieval, wiki selection, SQL evidence and bounded execution. |
| `src/pages/AIArticle.jsx` | Shared AI article view with section navigation, references and links through the series. |
| `public/diagrams/ai/` | Six self-contained Archify diagrams, loaded on their relevant article pages. |
| `src/data/research.js` | Course-report authorship, model comparisons and research source details. |
| `src/data/media.js` | Source-image dimensions, alt text, provenance and interpretation notes. |
| `src/pages/PortfolioExplorer.jsx` | Main portfolio, navigation, collection filters and article view. |
| `src/pages/ProjectDetail.jsx` | Shared project case-study presentation. |
| `src/pages/ResumePage.jsx` | Public résumé: commercial experience, independent projects, skills and education. |
| `src/pages/*Post.jsx` | Individual technical articles and interactive explanations. |
| `public/covers/` | Local vector cover illustrations for portfolio cards. |
| `scripts/build-route-pages.mjs` | GitHub Pages route entry documents, canonical URLs and page-specific social metadata. |
| `public/media/` | Captured interfaces, report excerpts and demonstration sprites. |
| `public/Jongho_Park_Software_Engineer_Resume.pdf` | Current downloadable two-page résumé. |
| `tests/` | Content contracts, media checks and interactive-demo tests. |

## Content and media conventions

The [technical blog series plan](docs/blog-depth-plan/index.html) defines the Lakehouse Sync depth benchmark, seven connected article topics, database comparison methodology and checked Archify reference diagrams. It is an editorial plan; it does not claim the planned examples or benchmarks have been executed. The [AI engineering series plan](docs/ai-engineering-plan/index.html) expands the AI area into six focused articles on APIs, context, vector retrieval, wiki selection, SQL grounding and controlled execution, with an original reference diagram. Private source-review notes remain outside this repository.

Keep employment, independent projects and team research distinct. Use verified role titles and dates. For quantitative results, include the measurement scope and conditions: for example, a title-based retrieval check is not a general quality score.

General engineering writing starts with its purpose, narrows to a specific technology and explains mechanisms, failure modes, verification and trade-offs. Use original fictional examples and authoritative public technical references. Do not publish client identities, account details, private business rules, internal architecture, endpoints, screenshots, incident records, workload measurements or supplied source attachments. Private reference material may inform topic selection, but must not become public examples, assets or citations. Teaching diagrams describe the article’s example, not an employer implementation.

Project covers should share a restrained visual style and communicate the actual engineering subject. Diagram covers are illustrations of the system; captured interfaces are identified through `src/data/media.js`. Preserve source notes, dimensions and accessible alt text when adding or replacing screenshots. Existing clinical figures are report excerpts and should retain their stated interpretation limits. Chromium sprite attribution is recorded in `public/media/chromium-LICENSE.txt`.

`public/covers/` also contains editable SVG masters and 1200×630 PNG social previews. `projectCovers[id].social` connects the main case studies to their previews; other pages use the neutral portfolio preview. Media origins and capture limits are recorded in `docs/media-provenance.md`.

The résumé download is referenced with `import.meta.env.BASE_URL` so it works under GitHub Pages. Replace the PDF and update the résumé page together when the professional history changes. The root-level `jonghopark_resume.pdf` mirrors the same current PDF for compatibility with older repository and raw-download links; keep both copies identical when replacing the résumé.

## GitHub Pages

Vite's base is `/portfolio-bento/` in `vite.config.js`, and `BrowserRouter` uses that base. Keep public asset links compatible with this prefix; prefer `import.meta.env.BASE_URL` when building an asset URL in JavaScript.

The build generates a physical `index.html` for each known route, plus a `404.html` fallback. Project URLs can therefore be opened directly on GitHub Pages. Each route entry contains its own title, description, canonical URL and sharing image before JavaScript runs. Planned articles retain `noindex` metadata; older engineering-work URLs redirect to the general teaching articles through React Router. Page content itself is rendered by React.

The `.github/workflows/deploy.yml` builds with Node.js 22, runs ESLint and Node tests, and deploys `dist/` to GitHub Pages on a push to `main`. Local changes and a successful local build do not publish the site. A completed Actions deployment and a check of the public routes are separate verification steps.
