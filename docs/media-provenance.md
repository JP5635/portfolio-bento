# 반영한 미디어 출처

2026-09-09 · 로컬 포트폴리오 반영. 외부 배포/원본 PDF 공개는 하지 않음.

| 자산 | 원본 | 처리 | 확인 |
| --- | --- | --- | --- |
| public/media/researchq-library.png | resume-create/resources/p4.png | 제공 PNG 원본 복사 | ResearchQ 이름·Jongho Park 글 목록. 현재 라이브 상태/성과 검증은 아님 |
| public/media/sepsis-gam-figures.png | resume-create/ML4Health_report_1.pdf p.22 | Figures 21–22 영역 PDF 렌더링 | aggregate 도표와 원래 캡션 보존. feature/term 대응 재검증 주의 표시 |
| public/media/sepsis-dashboard-evaluation.png | 동일 PDF p.26, Figure 25 | 왼쪽 classification report 패널만 PDF 렌더링 | 원본의 환자 행/입력 필드·학번·이메일 제외. 비교표와 다른 실행값임을 표시 |

PDF 원본 SHA-256: `28be626b81e05f5d168121588f74e7b6333f42de1386dd1efc701eceb816f1ed`.

PDF 렌더링: Poppler `pdftoppm`, single-page PNG. p.22는 `-scale-to 1600 -x 116 -y 128 -W 800 -H 900`, p.26은 `-scale-to 2000 -x 172 -y 850 -W 540 -H 240` 옵션 사용. 이미지 생성/도표 재작성 없이 원래 영역만 추출했다. 두 PNG를 시각 확인했으며 개인별 데이터는 포함하지 않았다.

자료 표기: COMP90089 Final Report, 대학 팀 프로젝트 보고서. Adam Mantello, Jongho Park, Ken Liu, Tina Cheng 공동 저자. 게재 논문 또는 임상 검증 결과라고 표시하지 않는다.

구현:

- Research 항목은 `/research/sepsis` 독립 상세로 이동한다. 이전 `/sepsis?context=research`는 새 상세로 연결한다.
- 프로젝트와 연구 상세는 같은 헤더·사이드바를 유지하며 상호 연결한다.
- Tables 7–8의 ROC-AUC만 모델별로 전사했다. F1 불일치, 코드/보고서 버전 차이, 대시보드 별도 실행은 명시했다.
- ResearchQ 캡처에서 보이는 글 5편은 프로젝트 상세의 captured library 목록으로 소개한다. 제목만으로 본문을 생성하거나 검증되지 않은 URL을 만들지 않았다.
- `https://www.continople.com`의 본문은 이번 웹 조회에서 열리지 않아 실제 글 URL을 확인하지 못했다. 서비스가 폐쇄됐다는 의미로 단정하지 않는다. 기존 Blog의 예고 상태는 유지한다.

추가 필요: 글별 실제 URL/본문, ResearchQ 역할·기간과 RAG 설명의 최신성, Vationo 실제 화면, 보고서 공개본(팀 공유 범위 및 개인 식별 정보 정리 후).

## Vationo 애니메이션 이식 · 2026-09-09

- 사용자가 지정한 공개 원본: https://vationo.com, 당시 번들 `/assets/index-BSdmkWc5.js`의 `Lt`, `Ct`, `At` 컴포넌트.
- 원본은 GIF/동영상이 아니라 Three.js 장면이다. 9개 층 × 12×12 검은 셀, 중앙으로 좁아지는 `0.2 + abs(layer - 4) * 0.2` 배율, 원래 회전각, 네 가지 회색 팔레트, 셀 두께 변화와 0.15초 간격으로 바뀌는 100개 금색 연결선을 로컬 컴포넌트로 이식했다.
- 원본의 장면 로직을 읽기 쉬운 이름으로 옮겼다. 페이지 전체·외부 스크립트·추적 코드를 삽입하지 않는다. Three.js는 npm의 MIT 배포본을 사용하며 의존성 라이선스를 유지한다. 사이트 자체 코드에 새 라이선스를 부여하지 않는다.
- 변경점: 카드 비율에 맞춰 전체 격자를 담는 카메라, 필요한 시점에만 로딩, 최대 24fps/DPR 1.5, 4.5초 재생 후 정지, hover/focus 및 상세 버튼으로 재생. 화면 밖/숨겨진 탭에서는 중단하고 reduced-motion에서는 정지한다. 언마운트 시 WebGL 자원을 해제한다.
- 카드와 `/vationo` 상세에 적용. 상세에서 원본 사이트 링크를 제공한다. 수익률·백테스트·실제 모델 출력의 증거로 사용하지 않는다.
- WebGL/로딩 실패 시 Vationo 이름과 “The learning engine” 텍스트를 유지한다. 외부 배포는 수행하지 않았다.

## Professional project covers · 2026-10-16

The portfolio covers use a shared 480:286 editorial frame, an off-white background, navy typography and restrained teal connections. The three engineering-article covers are original educational SVGs explaining general techniques. They contain no customer identifiers, private screenshots, measured workloads or employer-specific system diagrams. Existing independent-project and academic artifacts retain their source notes below.

| Cover | Source and treatment | Interpretation boundary |
| --- | --- | --- |
| `public/covers/byoc-validation.svg` | Original Playwright testing illustration: API fixture, UI action, then independent API and fresh-session reads. | A general persisted-state verification method. The legacy asset filename is retained for compatibility; the diagram does not portray a particular cloud deployment. |
| `public/covers/credential-access.svg` | Original PostgreSQL transactional-outbox illustration: one transaction commits state and intent, a worker delivers the operation, and the receiver deduplicates by a stable ID. | A general reliability pattern. Retries provide at-least-once delivery; idempotency remains an explicit receiver responsibility. |
| `public/covers/lakehouse-sync.svg` | Original S3 multipart-upload illustration: uploaded parts, a part manifest, completion and size/checksum verification, with reconciliation before resume. | A general transfer method. ETags identify parts for completion; a separate checksum verifies integrity. No workload result is asserted. |
| ResearchQ cover | Existing `public/media/researchq-library.png`, framed with an explicit captured-version heading. CSS displays the upper part of the original library capture; full source remains in SourceGallery. | A historical interface capture. Visible article dates are December 2025; the capture date is not independently known. Imported into this portfolio on 2026-09-09, not verified against the current service. |
| Sepsis project cover | Existing `public/media/sepsis-dashboard-evaluation.png`, fully contained inside the frame. | A report excerpt from a separate dashboard demonstration run, not the model-comparison results or a clinical validation claim. |
| Sepsis research cover | Existing `public/media/sepsis-gam-figures.png`, SVG-viewport-cropped to the complete lower partial-dependence figure (Figure 22), preserving axes and caption. The original Figures 21–22 remain available in SourceGallery. | Unmodified report pixels. The course report's feature/term mapping caveat remains applicable; cover is not independent reproduction of the research. |
| `public/covers/vationo-framework.svg` | Existing project description of signals, clustering-based regimes and exposure allocation. | A high-level research framework. Contains no return chart, simulated results or investment-performance values. Replaces the decorative WebGL scene on project cards. |
| `public/covers/retrieval-evaluation.svg` | Documented title-based self-retrieval diagnostic loop: query, embed, retrieve, expected document in top five. | A method diagram; it does not broaden the narrow evaluation into general relevance or answer-quality accuracy. |
| `public/covers/q-learning.svg` | The published explainer's observation/action/reward/Q-update loop. | A static teaching diagram, no invented Q values or training-performance results. |
| `public/covers/document-structure.svg`, `additive-model.svg`, `spatial-workflow.svg` | Conceptual method illustrations for the corresponding proposed articles. | They do not claim published article bodies, fitted clinical curves, or real mapped spatial outputs. |

The three engineering-article covers and ResearchQ also have matching `*-social.svg` editable masters and browser-rendered `*-social.png` previews at 1200×630. The diagram PNGs are raster exports of the authored vector artwork. The ResearchQ social preview frames the original screenshot, marks it as historical and preserves the original interface pixels. Its editable SVG references the existing local media asset; the exported PNG is self-contained.

`src/data/media.js` keeps the original source-gallery registry and adds a separate cover registry. `ProjectCover` resolves only known registry IDs, labels diagrams and captures, provides descriptive alternative text and shows a neutral overview for missing IDs or failed assets. Covers have no animation or remote dependency; reduced-motion preferences remain respected. The SourceGallery continues to offer the original figures and their full caveats.

Validation: targeted ESLint passed for `ProjectCover.jsx` and `media.js`; all nine new card SVGs passed XML parsing and 480:286/title/description checks. All four social PNGs are1200×630 and were visually reviewed. Visual review and whole-site build are recorded in the implementation handoff. External deployment is outside this media update.

The neutral `public/covers/portfolio-social.svg` brand preview and its 1200×630 PNG export use the same authored typography and palette for general portfolio routes. Copy: Jongho Park / Software Engineer / Full-stack · Cloud · Applied AI. It contains no project-specific illustration or performance claim.

### Engineering-article cover refresh · 2026-10-16

The three legacy commercial-cover filenames now contain general technical teaching diagrams for persisted-state testing, transactional outbox delivery and resumable multipart uploads. Each begins with its purpose and uses an invented, minimal flow rather than a company system. No supplied company document, customer capture, internal source file or measured workload was copied into these assets or this provenance record.

The matching social previews were regenerated directly from the refreshed SVG masters with headless Chrome. Validation passed for all six SVGs (XML parsing, declared dimensions and accessible title/description), all three PNGs (1200×630), and the updated media registry (ESLint). Card-size composites and all three social PNGs were visually checked for legibility and clipping. These assets explain methods; they do not substantiate employment implementation or deployment outcomes.

### AI engineering series · 2026-10-16

The six `ai-*.svg` cover illustrations and matching `ai-*-social.svg` / PNG variants are original, code-authored teaching diagrams. Their nodes illustrate API operations, context selection, vector retrieval, wiki navigation, SQL evidence and execution limits. They contain no employer screenshots, client data or measured performance. Social PNGs are 1200 × 630 rasterizations of the editable SVG masters.

The six self-contained HTML diagrams under `public/diagrams/ai/` were authored with Archify as fictional maintenance-assistant reference designs. They describe teaching responsibilities and required controls, rather than a private product deployment. The diagrams passed Archify showcase validation, delivery, provenance and real-browser checks; light and dark capture review was performed. Candidate specifications and validation receipts remain in the local working output, outside published assets.
