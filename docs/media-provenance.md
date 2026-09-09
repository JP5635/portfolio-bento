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
