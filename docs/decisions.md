# Decisions

사용자 피드백과 작업 중 확정된 결정을 기록한다. 새 결정은 아래에 추가하고, 번복 시 기존 항목을 지우지 않고 `번복` 표시와 함께 새 항목을 남긴다.

형식: **결정** / 이유 / 영향 범위

---

## 2026-10-08

### D-001. 주인 검증 방식: Fine-grained PAT + GitHub API (vision 권장안 A)
- **결정**: 블로그 주인이 발급한 Fine-grained PAT를 작성 페이지에 입력하고, GitHub API(`GET /user`)로 계정(`bambi0256`)과 저장소 쓰기 권한을 검증한다. 게시는 Contents API로 커밋한다. OAuth App + 프록시(B안)는 채택하지 않는다.
- **이유**: 정적 호스팅 유지, 별도 서버 불필요, 가장 단순.
- **영향**: MVP 2, 3. 토큰은 저장소에 커밋하지 않으며 브라우저 저장소에만 둔다(CLAUDE.md 보안 규칙). 토큰 보관 방식(세션/로컬)은 구현 시 확정한다.

### D-002. 방문자 통계(인사이트 페이지)는 MVP 이후로 연기
- **결정**: vision의 MVP 4번(페이지 인사이트)을 MVP 범위에서 제외하고 후속 작업으로 넘긴다. 수집 수단(GoatCounter/GA4/Cloudflare/자체 카운터)은 미결정 상태로 둔다.
- **이유**: 구현 우선도가 높지 않음.
- **영향**: MVP 종결 조건이 1~3번으로 줄어든다. 재개 시 수집 수단을 먼저 확정한다.

### D-003. 미사용 코드는 제거한다
- **결정**: 어떤 템플릿에서도 로드되지 않는 JS와 코드 내 불필요 코드를 삭제한다.
- **이유**: 사용자 승인("불필요한 파일들은 제거").
- **영향**: 삭제 — `assets/js/pagination-project.js`, `recent-posts.js`, `projects-page.js`. `temp-index` 의 중복 `set-current.js` 로드, 스크립트 내 중복 코드 정리.

### D-004. 템플릿을 `templates/` 로 묶는다
- **결정**: `temp-*.html`, `header.html`, `footer.html` 을 `templates/` (공통 조각은 `templates/partials/`)로 이동한다. 이름에서 `temp-` 접두사를 제거한다.
- **이유**: 소스/생성물 경계를 구조에 반영. include 깊이가 거의 늘지 않음.
- **영향**: 루트가 주소로 노출되어야 하는 파일은 이동하지 않는다 — `index.html`(생성물), `assets/`, `json/`(브라우저에서 `/assets/...`, `/json/...` 로 fetch), `about/`, `projects/`. 템플릿은 URL로 노출되지 않으므로 사이트 주소 변화는 없다. 별도 `404.html` 은 현재 없다.

### D-005. 경로 상수는 `assets/py/config.py` 에서 관리한다
- **결정**: 빌드 스크립트의 경로·템플릿명·공통 함수(Jinja 환경, JSON/HTML 입출력)를 `config.py` 에 둔다. 스크립트는 2개 그대로 유지한다.
- **이유**: 경로 하드코딩 중복 제거. 스크립트 통합은 이득이 작아 하지 않음.

### D-006. 리팩토링 검증 기준선은 "현재 템플릿으로 재빌드한 출력"
- **결정**: 저장소에 커밋되어 있던 생성물이 아니라, 작업 시작 시점의 템플릿으로 재빌드한 결과를 기준으로 동일성을 확인한다.
- **이유**: 커밋된 생성물이 템플릿보다 오래된 상태(예: `index.html` 의 `project-style.css` 링크)였음.
- **영향**: 리팩토링 후 출력 차이는 의도한 3건뿐 — `</header>` 닫기, `toc.js` defer, 홈의 중복 `set-current.js` 제거. JSON 출력은 동일.

### D-007. Actions 트리거에 `templates/**`, `assets/py/**` 를 포함한다
- **결정**: 워크플로우 트리거를 `mdposts/**`, `json/projects-config.json`, `templates/**`, `assets/py/**` 로 하고, 빌드 스텝에 `update-home-page.py` 와 `json/` 커밋을 추가한다.
- **이유**: 기존에는 홈/프로젝트 페이지가 자동 갱신되지 않고 `json/{slug}-posts.json` 이 커밋되지 않아 프로젝트 목록 페이지가 깨져 있었다. 템플릿만 바꿔도 생성물이 낡는 문제가 있었다.
- **영향**: 푸시 후 Actions 실행 결과는 GitHub에서 확인 필요(로컬 검증 불가).
