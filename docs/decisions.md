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

### D-008. 주인 검증 구현: `assets/js/auth.js` + `/write/` 게이트
- **결정**: `GET /user` 의 `login` 이 `bambi0256` 이고 `GET /repos/bambi0256/bambi0256.github.io` 의 `permissions.push` 가 true 일 때만 통과한다. 토큰은 `sessionStorage` 에만 보관한다(탭 종료 시 삭제, 입력 필드는 제출 즉시 비움). `/write/` 는 `templates/write.html` 로 생성하고 `noindex` 를 둔다. 네비게이션에는 링크를 추가하지 않는다(주소 직접 접근).
- **이유**: D-001 의 토큰 보관 방식 미결 사항 확정. 로컬 저장소는 XSS·공용 PC에서 잔존 위험이 커서 세션 단위로 제한.
- **영향**: 클라이언트 검증은 UI 접근 제어이며, 실제 쓰기는 GitHub가 토큰 권한으로 강제한다(주인이 아닌 토큰은 커밋 불가). 사용자는 저장소에 한정된 Fine-grained 토큰(Contents: Read and write)을 발급해야 한다. 번복 시: 로그인 유지가 필요하면 localStorage 옵션을 별도 승인 후 추가.

## 2026-10-09 (MVP 3 설계)

### D-009. 클라이언트 Markdown 렌더링: `marked` 를 저장소에 포함(vendored)
- **결정**: 미리보기용으로 `marked@12.0.2`(MIT)를 `assets/js/vendor/marked.min.js` 로 포함한다. CDN은 사용하지 않는다.
- **이유**: 토큰을 다루는 페이지가 외부 스크립트를 로드하지 않도록 한다.
- **영향**: 미리보기는 서버 빌드(python-markdown + codehilite)와 완전히 같지 않은 근사 미리보기다. 라이브러리 업데이트는 수동.

### D-010. 미리보기는 sandbox iframe 에서 렌더링
- **결정**: 본문 HTML은 `sandbox` 속성(스크립트 불가)의 iframe `srcdoc` 으로 렌더링한다. 본문의 raw HTML은 기존 글과 동일하게 허용한다.
- **이유**: 미리보기 내용이 토큰(sessionStorage)에 접근하지 못하게 격리.

### D-011. slug 기본값은 현재 시각 기반, 수정 가능
- **결정**: `YYYYMMDDNN` 형식(NN은 같은 날짜의 기존 글 수 + 1)을 현재 날짜로 자동 제안하고, 사용자가 수정할 수 있다. date 기본값도 오늘.

### D-012. 이미지 업로드를 MVP 3에 포함 (범위 확대, 사용자 승인)
- **결정**: 작성 툴에 이미지 업로드를 포함한다. 이미지는 게시물 단위 폴더에 둔다.
- **저장 구조**: `mdposts/<project>/<slug>/index.md` + 같은 폴더의 이미지. 빌드가 이미지를 `projects/<project>/<slug>/` 로 복사하므로 본문에서 상대경로(`![](cover.png)`)를 쓴다. 기존 평면 글(`mdposts/<project>/*.md`)과 절대경로 `main_image` 는 그대로 동작(마이그레이션 없음).
- **썸네일**: `main_image` 에 파일명만 쓰면 빌드가 `/projects/<project>/<slug>/<파일명>` 으로 변환해 홈·목록 카드에서 쓴다.
- **임시 보관**: 게시 전 이미지는 저장소가 아닌 브라우저 메모리(File/Blob)에만 둔다. 미리보기는 Blob URL, 게시 성공 시 초기화. 새로고침하면 사라지며(임시저장 범위 밖) 창을 닫을 때 경고한다.
- **게시**: Git Data API(blob → tree → commit → ref)로 글+이미지를 **한 커밋**으로 올려 Actions 중복 실행·충돌을 피한다. 토큰 권한은 Contents: Read and write 로 충분.
- **제한**: jpg/png/gif/webp, 파일당 5MB 이하. SVG 제외(같은 도메인 스크립트 실행 위험). 파일명은 소문자·숫자·`-`·`_`·`.` 만 허용(자동 정리, 중복 시 번호).
- **빌드**: 포스트 출력 폴더를 렌더링 전에 비운 뒤 HTML과 이미지를 쓴다(삭제된 이미지 잔존 방지).
- **범위 밖 유지**: 이미지 자동 리사이즈/압축, 업로드한 이미지·글의 수정/삭제.

### D-013. MVP 3 구현 세부
- **파일 구성**: `post-lib.js`(검증·파일명 정리·Front Matter 생성 등 순수 로직), `publisher.js`(Git Data API 게시), `editor.js`(UI), `vendor/marked.min.js`. 모두 `/write/` 에서만 로드한다.
- **Front Matter**: 값을 `JSON.stringify` 로 직렬화(YAML 큰따옴표 문자열로 유효). 한글·따옴표·콜론·`#` 포함 값이 python-frontmatter 로 그대로 파싱됨을 확인.
- **중복 방지**: 게시 직전에 저장소에서 `mdposts/<project>/<slug>/` 와 `mdposts/<project>/<slug>.md` 존재를 확인한다. ref 갱신이 non-fast-forward(Actions 봇 커밋 등)로 거부되면 최신 커밋 위에 한 번 재시도한다.
- **미리보기**: 이미지는 data URL 로 치환해 sandbox iframe 에 넣는다(opaque origin 에서 blob URL 로딩 문제 회피).
- **필수 입력**: 프로젝트, 제목, 요약, 태그 1개 이상, 본문, 대표 이미지(업로드 이미지 선택 또는 `/assets/image/...` 직접 입력).
- **빌드 안전장치**: slug 는 `[a-z0-9][a-z0-9_-]*` 만 허용(빈 값·경로 이동 문자 차단). 포스트 출력 폴더를 비우고 재생성하므로 slug 오류가 프로젝트 폴더를 지우지 않도록 막는다.
- **알려진 한계**: 글을 소스에서 지워도 이미 생성된 `projects/<project>/<slug>/` 출력은 자동 삭제되지 않는다(글 삭제는 범위 밖). 프로젝트 단위 삭제만 정리된다.
- **검증 방법**: 헤드리스 Edge 로 순수 로직 34건 + 모의 GitHub API 로 `/write/` 전체 흐름 26건(인증→이미지 업로드→미리보기→한 커밋 게시→로그아웃) 통과. 실제 GitHub 게시는 사용자 확인 대기.
