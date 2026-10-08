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

## 2026-10-09 (게시 403 대응)

### D-014. 로그인 시 토큰의 실제 쓰기 권한 확인 + 게시 오류에 단계·GitHub 사유 표시
- **문제**: 로그인은 통과했지만 게시에서 403("쓰기 권한 없음")이 발생. 저장소 응답의 `permissions.push` 는 **계정**의 권한이라 Fine-grained 토큰의 Contents 쓰기 권한을 보장하지 않는다(D-008 의 검증 공백).
- **결정**: 로그인 검증에 빈 내용 blob 생성(`POST /git/blobs`, 내용이 비어 있어 항상 같은 객체이고 어떤 ref 에도 연결되지 않음)을 추가해 토큰의 쓰기 권한을 확인한다. 게시 실패 메시지에는 실패 단계(`[파일 업로드]`, `[브랜치 갱신]` 등)와 GitHub 응답 메시지를 덧붙인다.
- **영향**: 읽기 전용 토큰은 게시 단계가 아니라 로그인 단계에서 거부된다. 브랜치 보호 규칙 등 다른 원인의 403 은 메시지로 구분할 수 있다.
- **검증**: 유닛 38건, `/write/` 모의 API 흐름 28건(읽기 전용 토큰 거부 포함) 통과.

## 2026-10-09 (v1.1)

### D-015. 자동 빌드·배포 조건을 새 글 게시 + 수동 실행으로 한정 (D-007 변경)
- **결정**: 워크플로우 트리거를 `push` 의 `mdposts/**` 와 `workflow_dispatch` 로 한정한다. `json/projects-config.json`, `templates/**`, `assets/py/**` 트리거는 제거한다.
- **이유**: 사용자 요청. 템플릿·스크립트 수정마다 빌드·배포가 도는 것을 원치 않음.
- **영향**: 템플릿/스크립트/CSS/JS 변경은 로컬에서 빌드한 생성물을 같이 커밋하거나 Actions를 수동 실행해야 생성물에 반영된다. 프로젝트 설정(`json/projects-config.json`)을 바꿀 때도 동일.

### D-016. 목록형 개편의 해석
- **목록 항목 구성**: 제목, 작성일, 내용 앞부분. "내용 앞부분"은 요약(`excerpt`)이 아니라 **본문 첫 부분(약 120자)** 을 빌드 시 추출한 `preview` 로 한다. `excerpt` 는 Front Matter 에 그대로 두되 목록에서는 쓰지 않는다. (요약을 쓰고 싶으면 템플릿 한 줄 변경)
- **프로젝트 페이지**: 사용자 요청에는 명시되지 않았으나, 카드형 CSS 를 제거하면 `/projects/<project>/` 도 깨지므로 같은 목록형으로 통일한다(대표 이미지 없음, 페이지네이션 유지).
- **Projects 탭**: 서버에서 모든 탭 패널을 렌더링하고 JS 로 전환한다. 탭 우측 Learn More 버튼은 활성 탭의 프로젝트 페이지로 연결된다. 탭 순서는 프로젝트의 최신 포스트 날짜 내림차순(포스트가 없는 프로젝트는 뒤).
- **Home**: 전체 프로젝트 통틀어 최신 3개. 항목에 프로젝트명을 함께 표시한다.
- **전역 링크 hover**: 어두운 배경에서 `a:hover` 가 어두운 글자색이라 사라지던 문제를 흰색으로 수정한다(디자인 일관성 범위).

### D-017. v1.1 구현 결과 및 시각 확인
- **구현**: 공통 CSS 는 `assets/css/list-style.css`(구 `project-style.css`)로 통합, 목록 항목은 `templates/partials/post-item.html` 매크로와 `project-posts.js` 가 같은 구조로 렌더링한다. `index-style.css` 에서는 카드·섹션 규칙을 제거하고 Intro·버튼만 남겼다. 탭은 `project-tabs.js`(ARIA tablist, 방향키·Home/End, `#slug` 지정).
- **함께 수정한 것**: `/write/` 글자·입력창·버튼 색을 노랑 기조로 통일(오류 메시지는 가독성을 위해 연한 빨강), 작성 영역 폭을 헤더와 같은 1200px 로 정렬, 전역 `a:hover`(어두운 배경에서 사라지던 `#343434`)를 흰색으로, 프로젝트 페이지의 인라인 스타일(breadcrumb)을 CSS 로 이동, 프로젝트 목록 JS 의 문자열을 HTML 이스케이프 처리.
- **시각 확인**: 헤드리스 Edge 스크린샷으로 확인 — 데스크톱(1400px) Home / Projects(탭 2개) / 프로젝트 / Write(로그인 전·후, 검증 오류 표시) / Post / About, 모바일(390px, iframe 뷰포트) Home / Projects / 프로젝트 / Write. 탭 다중 프로젝트는 임시 데모 프로젝트로 확인 후 삭제.
- **동작 테스트**: 탭 전환(클릭, ←/End 키, 활성 탭 표시, 패널 숨김, Learn More 링크 갱신, `#slug` 갱신, tabindex) 8건을 헤드리스 Edge 로 통과. `/write/` 유닛 38건과 모의 API UI 흐름은 통과(단 UI 테스트 3건은 "오늘 날짜 글이 이미 있어 slug 제안이 01이 아닌 02"라는 테스트 가정 문제이며 동작은 올바름).
- **확인하지 못한 것**: 실제 모바일 기기, 로그인 후 Write 의 모바일 세부 상호작용(레이아웃 스크린샷만 확인).
- **발견했으나 범위 밖이라 수정하지 않은 것**: (1) 모바일에서 헤더 로고가 오른쪽 끝에서 잘림(`header-footer-style.css` 모바일 규칙), (2) 모바일 Home 의 Intro 이미지(고정 450px 폭)가 잘림, (3) Post/Projects 의 대표 이미지 파일(`/assets/image/2025121501.png` 등) 누락으로 깨진 이미지, (4) 과거 프로젝트 출력 `projects/ProjectA/` 잔존.

## 2026-10-09 (v1.2)

### D-018. 이미지 디렉토리 구조
- **결정**: `assets/image/common/`(logo, github-icon, instagram-icon), `home/`(intro-image.jpg), `about/`(profile-image.jpg 포함 기존 3종), `blog/<주제>/` 로 정리한다. `git mv` 로 이동하고 템플릿 참조를 수정했다. 게시물 이미지는 D-012 대로 `mdposts/<project>/<slug>/` 에 둔다.
- **미결**: `assets/image/blog/genre-analyze/Rampart_TD.jpg` 는 참조가 없는 예전 포스트용 이미지다. 삭제 지시가 없어 그대로 두었다.

### D-019. 기존 콘텐츠 제거와 빈 상태
- **결정**: `mdposts/Spell_Unlock_TCG`, `projects/ProjectA`, `projects/Spell_Unlock_TCG`, `json/Spell_Unlock_TCG-posts.json` 을 제거하고 `json/projects-config.json` 의 프로젝트 목록을 비웠다. `mdposts/.gitkeep` 으로 빈 디렉토리를 유지한다. 모든 파일은 git 이력에 있어 복구할 수 있다.
- **빈 상태**: Home "아직 포스트가 없습니다.", Projects "프로젝트가 없습니다." 를 표시한다.

### D-020. 빈 블로그에서 새 프로젝트 만들기 (v1.0 작성 툴 범위 확장, 목표 달성에 필수)
- **문제**: 프로젝트가 없으면 작성 툴의 프로젝트 선택이 비어 첫 글을 쓸 수 없다. (v1.0 에서는 새 프로젝트를 "디렉토리를 직접 만들어 자동 발견"하는 것으로 두었다.)
- **결정**: 작성 툴의 프로젝트 선택에 "+ 새 프로젝트 만들기"를 두고(프로젝트가 없으면 기본 선택), 프로젝트 slug·이름·설명(선택)을 입력받는다. 이 값은 첫 글의 Front Matter 에 `project_title`/`project_description` 으로 기록하며 별도 설정 파일을 수정하지 않는다. 게시 직전에 저장소에 같은 프로젝트 디렉토리가 있는지 확인한다.
- **빌드 변경**: 프로젝트 정보는 "첫 번째 md"가 아니라 `project_title` 이 있는 첫 번째 파일에서 읽는다(파일 순서 의존 제거, 검증됨). 설명이 없으면 빈 문자열(기존 `"<slug> project"` 기본값 제거).
- **한계**: 프로젝트 이름·설명 수정 UI 는 없다(첫 글 Front Matter 또는 `json/projects-config.json` 수정).

### D-021. 모바일 대응 규칙과 시각 확인
- **브레이크포인트**: 768px 이하 모바일 규칙(헤더·Intro·About·Post·목록), 600px 이하 Write 보정, 900px 이하 Write 2단→1단. 모바일에서 `html` 글자 크기 18px → 16px.
- **헤더**: 모바일에서 `width:100%` + 좌우 패딩이 화면을 넘어 로고가 잘리던 문제를 `box-sizing: border-box` 로 해결하고 햄버거 | 로고 | 아이콘을 한 줄로 배치.
- **Post**: 목차(`.toc-wrapper`)는 모바일에서 본문 위 정적 배치(최대 높이 40vh 스크롤), 표·코드 블록은 가로 스크롤, 이미지는 `max-width:100%`.
- **빌드**: Markdown `tables` 확장 추가 + 표 스타일. 작성 툴 미리보기(marked)와 결과를 맞춘다.
- **시각 확인 방법**: 헤드리스 Edge 는 창 최소 폭이 약 500px 라서 모바일 확인은 정확한 폭의 iframe 하네스(390/768px)로 한다. 서랍 메뉴는 헤드리스에서 CSS transition 이 진행되지 않아 transition 을 끈 임시 페이지로 확인했다.
- **확인한 화면**: 390px — Home, Projects, 프로젝트, Post(상단 844px 높이 포함), About, Write(로그인 전), Write 새 프로젝트 입력(모바일 레이아웃), 햄버거 서랍(열림). 768px — Home, Post. 1400px — Home, Projects, 프로젝트, Post, About, Write(로그인 후·새 프로젝트), 빈 상태 Home/Projects.
- **테스트**: 유닛 46건(검증·파일명·Front Matter·새 프로젝트·게시 로직·Auth), 빈 블로그 첫 글 UI 흐름 24건(읽기 전용 토큰 거부 → 새 프로젝트 → 이미지 → 미리보기 → 한 커밋 게시 → 다음 글 slug 제안 → 로그아웃) 모두 통과. 실제 GitHub 게시와 실기기는 확인하지 못함.
