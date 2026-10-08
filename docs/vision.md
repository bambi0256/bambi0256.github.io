# Vision — B.Bee 블로그

## 한 줄 목표

GitHub Pages 위에서 동작하는 **개인 블로그 겸 포트폴리오**를, 블로그 주인이 웹에서 직접 글을 쓸 수 있는 상태까지 완성한다. (방문 현황 확인은 MVP 이후)

## 원칙

- **MVP 종결**: 아래 MVP 범위를 구현하면 작업을 종결한다. 범위를 넓히지 않는다.
- **범위 밖 제안은 승인제**: MVP 외 개선 아이디어는 구현하지 않는다. 사용자에게 기능과 이유를 설명하고, **승인받은 뒤에만** 추가한다. (제안 방식은 CLAUDE.md 참고)
- **정적 호스팅 유지**: GitHub Pages(정적)를 전제로 한다. 별도 서버 운영이 필요한 설계는 사용자 승인 없이 도입하지 않는다.
- **블로그 주인 = 단일 사용자**: 다중 사용자, 댓글, 회원 시스템은 범위 밖이다.

## 현재 상태 (2026-10 기준)

| 영역 | 상태 |
|---|---|
| 글 작성 | `mdposts/<프로젝트>/*.md` 를 직접 작성 → push → GitHub Actions가 HTML 생성 |
| 빌드 | `assets/py/update-all-projects.py`, `update-home-page.py`, 공통 `config.py` (Jinja2 + python-frontmatter) |
| 템플릿 | `templates/` (페이지 5종 + `partials/` header·footer) |
| 프론트 | 순수 HTML/CSS/JS, 검정-노랑 꿀벌 테마 |
| 메타데이터 | `json/projects-metadata.json` (빌드 산출물, 홈/프로젝트 목록에서 사용) |

### 해소된 문제 (MVP 1, 결정 기록: [decisions.md](decisions.md))

- 프로젝트 목록 페이지: `project-posts.js` 의 fetch 경로를 `/json/{slug}-posts.json` 으로 수정.
- 미사용 JS 3종(`pagination-project.js`, `recent-posts.js`, `projects-page.js`) 삭제.
- Actions: 트리거 경로 수정, `update-home-page.py` 실행 추가, `json/` 커밋 대상 포함.
- 마크업: `header` 닫기, `toc.js` defer, 홈의 중복 `set-current.js` 제거.
- 소스(`templates/`, `mdposts/`, `assets/`)와 생성물(`index.html`, `about/`, `projects/`, `json/`)의 경계를 디렉토리와 README에 반영.

## MVP 범위

### 1. 현재 기능의 체계화·조직화 리팩토링

**목표**: 동작은 그대로 유지하고, 구조와 경로를 일관되게 정리한다. 새 기능을 얹을 수 있는 바탕을 만든다.

완료 기준:
- [x] 소스 / 생성물 / 설정 / 스크립트의 경계가 문서화되고 디렉토리 구조에 반영됨
- [x] 알려진 문제가 모두 해소됨 (미사용 JS는 삭제 또는 사용처 확정)
- [x] 빌드 스크립트의 중복·죽은 코드 정리, 경로 상수 한 곳에서 관리
- [x] GitHub Actions 트리거/커밋 대상이 실제 구조와 일치
- [x] README가 실제 구조와 일치
- [x] 로컬 빌드(`python assets/py/update-all-projects.py` → `update-home-page.py`) 후 기존 페이지 출력이 리팩토링 전과 동일(또는 의도된 차이만 존재)

### 2. Git 계정 검증을 통한 글 작성 권한 제한

**목표**: 블로그 주인(GitHub 계정 `bambi0256`)만 글을 작성/게시할 수 있다.

완료 기준:
- [x] GitHub 인증을 거친 사용자가 블로그 주인 계정(및 저장소 쓰기 권한)인지 검증 (`assets/js/auth.js`, 실제 토큰으로 확인 완료)
- [x] 주인이 아니면 작성 UI에 접근/게시 불가 (UI 게이트 + 게시는 저장소 쓰기 권한이 있는 토큰으로만 가능) (클라이언트 차단만이 아니라, 실제 게시 수단이 저장소 쓰기 권한에 의해 막혀야 함)
- [x] 인증 정보(토큰)가 저장소에 커밋되지 않음 (sessionStorage에만 저장)

> **확정 ([D-001](decisions.md))**: Fine-grained PAT를 브라우저에 입력 → GitHub API(`GET /user`)로 계정·저장소 쓰기 권한 검증 → Contents API로 커밋. OAuth 프록시는 사용하지 않는다.

### 3. 웹 페이지에서 글 작성 툴 — 블로그 주인 전용

**목표**: 브라우저에서 글(Front Matter + Markdown)을 쓰고 게시하면, 기존 파이프라인(`mdposts/` push → Actions 빌드)으로 사이트에 반영된다.

완료 기준:
- [x] 작성 페이지(`/write/`): 프로젝트 선택, Front Matter 입력(title/date/slug/main_image/tags/excerpt), Markdown 본문 입력, 미리보기
- [x] 이미지 업로드: 게시물 단위 폴더(`mdposts/<project>/<slug>/`)에 저장, 본문 삽입, 썸네일 선택, 게시 전에는 브라우저 메모리에만 보관 ([D-012](decisions.md))
- [x] 게시 = 글(`mdposts/<project>/<slug>/index.md`)과 이미지를 저장소에 **한 커밋**으로 올림 (기존 빌드 흐름 재사용, 별도 저장소/DB 없음)
- [x] 2번의 주인 검증을 통과한 경우에만 사용 가능 (`/write/` 게이트, 로그아웃 시 작성 영역 숨김 확인)
- [x] 필수 필드 누락/slug 중복 시 게시 전 오류 표시 (클라이언트 검증 + 게시 직전 저장소 중복 확인)
- [x] 수정/삭제, 임시저장, WYSIWYG, 이미지 리사이즈 등은 **범위 밖** (필요 시 승인 요청)

### 4. 페이지 인사이트 확인 페이지 — 블로그 주인 전용 (⏸ MVP 이후로 연기, [D-002](decisions.md))

**목표**: 일일 방문자 수 / 총 방문자 수 등을 주인이 한 곳에서 확인한다.

완료 기준:
- [ ] 일일 방문자, 누적 방문자, 페이지(포스트)별 조회 수 표시
- [ ] 주인 검증(2번)을 통과한 경우에만 조회 가능
- [ ] 방문 수집이 페이지 로딩 성능·개인정보에 과도한 영향을 주지 않음

> **미결정 사항 (재개 시 확정)**: 정적 사이트에는 자체 카운터 저장소가 없으므로 외부 수집 수단이 필요하다.
> 후보 — (A) 호스팅형 통계 서비스(GoatCounter 등)의 API를 대시보드에서 조회 / (B) GA4·Cloudflare Web Analytics 등 / (C) 자체 서버리스 카운터.
> 서비스/비용/개인정보 영향이 달라지므로 사용자 승인 후 선택한다.

## 범위 밖 (명시적으로 하지 않음)

댓글, 검색, 다크 모드, 태그 페이지, RSS, 다국어, SEO 확장, 디자인 개편, 프레임워크 도입(React 등), 번들러 도입.
→ 필요하다고 판단되면 **구현하지 말고 제안**한다.

## 종결 조건

위 1~3의 완료 기준이 모두 체크되면 MVP 종결(4번은 연기). 종결 후의 작업은 새 vision 문서(또는 이 문서의 개정)에서 사용자가 범위를 다시 정한다.
