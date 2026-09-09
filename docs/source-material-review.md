# resume-create 자료 검토

검토일: 2026-09-08. 원본 폴더는 읽기 전용으로 검토했다. 웹사이트 콘텐츠와 공개 자산은 이번 검토에서 변경하지 않았다. 파일 안의 명령·계획은 참고 내용으로만 읽고 실행하지 않았다.

후속 반영(2026-09-09): ResearchQ 실제 화면, Sepsis의 개인별 데이터를 제외한 보고서 도표, 독립 Research 상세를 추가했다. 자세한 처리·미해결 사항은 [반영 미디어 출처](media-provenance.md)를 참조한다. 아래는 원자료 검토 당시 기록이다.

## 이전 평가의 정정

포트폴리오 코드에 자료가 연결되어 있지 않았던 것이지, 원자료가 없는 것은 아니다. ResearchQ 화면, Sepsis 연구 보고서·실제 대시보드 캡처·평가표를 확인했다. 이제 필요한 것은 새 도식 제작보다 출처·버전·공개 범위를 정리해서 연결하는 작업이다.

## 1. 스크린샷 분류

원본 이미지 위치: `/Users/jonghopark/Documents/Github/resume-create/resources/`

| 파일 | 확인된 내용 | 포트폴리오 활용 판단 |
| --- | --- | --- |
| p4.png | ResearchQ interactive 글 목록. Jongho Park 이름, 글 제목·날짜·조회수 표시 | ResearchQ 실제 UI 캡처 후보. 커버/상세 갤러리에 우선 활용. 현재 서비스 가용성·기능 작동까지 증명하지는 않음 |
| k4.png | ResearchQ 목록의 작은 이미지 | p4.png의 축소형으로 보임. 큰 원본 p4 우선 |
| p1.png / k1.png | CONTINOPLE Regional Sales, 매출 KPI·지도·상품 표 | 출처와 본인 제작 범위 확인 전에는 디자인 참고용. 화면의 매출 수치를 ResearchQ 성과로 사용하지 않음 |
| p2.png / k2.png | Supply Chain Management, 재고 KPI·카테고리별 추이·표 | Tableau Accelerator 원본 링크 표시. 템플릿 사용 및 본인 수정 범위 확인 필요 |
| p3.png / k3.png | Executive Overview / Profitability, 지도·시계열·필터 | 작성자·프로젝트 대응 미확인. Vationo의 투자 성과 화면으로 대체하지 않음 |
| e1.png | London Universities 지도 | Naresh Suglani 제작 표시. 레이아웃 참고만 |
| e2.png | Air Pollution 지도·지표·차트 | Naresh Suglani 제작 표시. 이력서 MD에도 해당 Tableau 프로필 링크가 있음. 본인 산출물로 표시하지 않음 |
| e3.png | Inventory Control Overview | Tableau Accelerator 원본 링크 표시. 참고/템플릿 관계 확인 필요 |
| e4.png | Nepal, 지형 지도·등반 정보 | Naresh Suglani 제작 표시. 레이아웃 참고만 |
| e5.png | Knife Crime 통계 지도·차트 | Naresh Suglani 제작 표시. 레이아웃 참고만 |

적용할 디자인 원리: 주제별 실제 대표 화면 1개, 차트의 읽을 수 있는 크기, 선택 상태가 명확한 필터, 숫자 옆 정의·기간, 상세에서 전체 화면 확대. 참고 이미지의 지도·숫자·브랜드를 다른 프로젝트로 옮기지 않는다.

### ResearchQ에서 확인한 실제 글 후보

p4.png에 다음 제목이 보인다. 이는 현재 포트폴리오의 예고 글 3편과 별개의 콘텐츠다. 목록에 보인다는 사실과 본문·URL 확인은 구분한다.

- How the modern security works? AES
- The Magic of the Fourier Transform
- Machine Learning for Sepsis Detection
- PV? FV? Interest rate?
- Means in Finance

실제 본문과 영구 URL을 확보하면 예고 글 대신 공개된 글을 소개할 수 있다. 조회수는 캡처 시점의 화면 값이며 전체 사용자 수·RAG 정확도·지연 개선을 입증하지 않는다.

## 2. Sepsis: 가장 먼저 활용할 근거

원본: `/Users/jonghopark/Documents/Github/resume-create/ML4Health_report_1.pdf`

- 31페이지, COMP90089 Final Report. 제목: An Interpretable Machine Learning Approach for Early Sepsis Detection in ICUs.
- 저자는 Adam Mantello, Jongho Park, Ken Liu, Tina Cheng. 출판 논문이 확인된 것은 아니므로 대학 팀 프로젝트 보고서로 분류한다.
- 루트, `my_projects/`, `ML4Health_code_1-2/`의 동명 PDF 세 개는 SHA-256이 같다. 서로 다른 연구로 세지 않는다.
- PDF 생성 메타데이터는 2025-11-05. 현재 웹사이트의 Jan–Apr 2026과 차이가 있으므로 프로젝트 기간을 확인한다. 메타데이터만으로 정확한 수행 기간을 확정하지 않는다.

| PDF 페이지 | 확인 자료 | 활용 |
| --- | --- | --- |
| 1 | 팀원과 보고서 제목·초록 | Research 상세의 유형·저자 표기. 학번은 공개용에서 제외 |
| 16 | 2,000명 표본, 262명(13.1%) sepsis, 80:20 stratified split, LoS <500h | 기존의 대략적 표본 설명을 보고서 조건이 있는 설명으로 교체 |
| 18–19 | 1·2·4시간 관측창별 모델 비교표 | 결과 표에 모델·리샘플링·관측창·지표를 함께 표시 |
| 22, Figures 21–22 | GAM feature effect strength와 partial dependence plots | 설명 가능성 근거 후보. 코드의 feature/term 대응을 먼저 검증 |
| 26, Figure 25 | 실제 Streamlit 학습/해석 화면과 예측 화면 | Sepsis 커버·상세 갤러리 후보. 학습 데이터 미리보기 행은 공개 전 제외/마스킹 검토 |
| 27, Contributions | Jongho Park의 phenotyping, 수집, 데이터셋, EDA, 모델 개발, 결과 분석, 시각화, 집필 참여 | 개인 기여와 공동 작업을 분리해 설명. 프로젝트 총괄로 확대 해석하지 않음 |

보고서에 기록된 수치 예: Table 7의 2시간 GAM ROC-AUC 0.610, Table 8의 4시간 GAM 0.646, XGBoost 0.650. 이는 원자료 재실행으로 재현한 수치가 아닌 보고된 결과다. 관측창은 입원 후 측정 기간이며, ‘발병 4시간 전 예측 성능’으로 바꿔 쓰지 않는다.

### 그대로 공개하기 전에 풀어야 할 불일치

1. Figure 25는 4-hour cohort, AUROC 0.541 / PR-AUC 0.140 / accuracy 0.721을 보여준다. 보고서 비교표와 동일 실험으로 취급하지 않는다.
2. `app_gam_dashboard.py`는 2시간 데이터·SMOTE·GAM gridsearch를 사용한다. 보고서 본문은 SMOTETomek와 GAM 기본 설정을 설명한다. 대시보드 실행 버전과 보고서 평가 버전을 구분해야 한다.
3. Table 7의 Logistic Regression + SMOTETomek 행은 precision=0.364, recall=0.364, F1=0.205다. 같은 positive-class precision/recall로 계산한 F1과 맞지 않아 평균 방식·전사 오류를 확인해야 한다. 임의로 숫자를 고치지 않는다.
4. 코드의 Top Feature Effects는 중요도 순서로 feature 이름을 정렬한 뒤, 도표에서는 다시 `term=i`를 사용한다. 원래 모델 feature 인덱스와 이름이 달라질 수 있으므로 PDP 제목과 곡선 대응을 검증해야 한다.
5. 보고서 초록의 임상 활용 가능 표현과 Discussion의 낮은 성능·임상 적용 한계 표현이 다르다. 포트폴리오에서는 연구 프로토타입으로 설명하고 임상 검증/현장 배포 성공을 주장하지 않는다.

### 실행 자료 상태

`ML4Health_code_1-2/`에 README, 대시보드 Python, EDA/PCA 노트북이 있다. README가 가리키는 `main.ipynb`, SQL, CSV, 학습 모델, requirements 파일은 해당 폴더 파일 목록에서 확인하지 못했다. README의 실행 명령만으로 즉시 재현 가능한 완전한 패키지라고 할 수 없다. 원본 코드는 실행하거나 수정하지 않았다.

## 3. 추가 연구/프로젝트 후보

표지·초록 중심으로 확인했으며 전체 평가·기여도 검증은 별도다.

| 파일 (`my_projects/`) | 확인 내용 | 후보 분류 |
| --- | --- | --- |
| COMP90024_Report.pdf | A Cloud-based Solution to Social Media Sentiment Analysis. Jongho Park 공동 저자. Melbourne Research Cloud·Ansible·소셜 데이터 분석 | 데이터 시스템 팀 프로젝트/리포트 |
| COMP90086_final_project.pdf | Image-based food calories calculation. Jongho Park, Yuanjie Wang. Nutrition5K, RGB/depth, 분할·fusion 비교 | 컴퓨터 비전 팀 프로젝트/리포트 |
| COMP90050_CDM_Survey__Complete_Version_.pdf | Crowdsourced Data Management survey. Jongho Park 공동 저자. 품질·비용·지연·인센티브 비교 | 문헌 조사 리포트 |

세 파일 모두 학술지/학회 게재 여부는 확인하지 않았다. 인원 수나 표지 순서만으로 개인 단독 성과·제1저자 지위를 확대 해석하지 않는다. 원본에는 학번·학교 이메일이 포함돼 있으므로 그대로 공개 폴더로 복사하지 않는다.

## 4. 이력서와 현재 사이트의 차이

`resume_data_scientist.md`는 Vationo를 Founder & Quantitative Researcher (Jul 2025–Present)로, ResearchQ를 Interactive Study Journal로 설명한다. 현재 사이트는 같은 기간에 ResearchQ Machine Learning Engineer 경력을 전면에 둔다. 이력서 버전별 이력과 실제 관계를 확인한 뒤 수정해야 한다.

이력서에 Vationo의 TAM(Transformer Allocation Model), MULIY(주파수 영역 분해 도구)가 명시돼 있다. 현재 사이트의 12개 시장 상태 프레임워크와 연결되는 근거는 이번 읽은 자료에서 확정하지 못했다. 별도 모델/기능일 수도 있어 합치지 않는다.

이력서에 등장하는 주소 후보는 Vationo `https://www.vationo.com`, ResearchQ `https://www.continople.com`. 이번 작업에서 실시간 가용성·현재 내용은 조회하지 않았으므로 검증된 데모 링크로 표시하지 않는다.

검토한 MD와 이미지·보고서에서는 ResearchQ의 2.7K users, relevance +20–30%, ~400ms를 뒷받침하는 평가 기록을 확인하지 못했다. 이력서 전체 PDF 버전을 모두 조사한 것은 아니므로 폴더 전체에 없다고 단정하지 않는다.

## 5. 다음 반영 순서

1. ResearchQ 커버를 p4.png 기반 실제 UI로 교체하고 전체 캡처를 상세에 배치. 화면이 증명하는 Interactive Study Journal 기능과 현재 RAG 설명의 일치 여부 확인.
2. Sepsis의 실제 보고서를 독립 Research 상세로 연결. 팀원·기여·방법·조건·한계를 명확히 표시하고, 공개용 PDF 정리는 별도 승인 후 진행.
3. Sepsis Figure 25의 안전한 영역과 검증된 도표를 갤러리에 사용. 서로 다른 실행의 지표는 한 결과로 섞지 않음.
4. ResearchQ 캡처의 실제 글 본문/주소를 확인해 Blog 목록을 채움. 기존 예고 글을 자동으로 ‘게시됨’으로 바꾸지 않음.
5. Vationo·ResearchQ의 역할/기간과 화면 출처를 확인한 뒤 이력서 및 프로젝트 설명을 맞춤.

공개 전 확인할 것: p1–p3/e3의 본인 제작·수정 범위, 팀 보고서 공유 범위, 캡처에 포함된 데이터 행, 정확한 프로젝트 기간과 실제 글 URL.
