# CLAUDE.md

B.Bee 개인 블로그(`bambi0256.github.io`)의 작업 지침. 목표와 범위는 [docs/vision.md](docs/vision.md)가 기준이다. 두 문서가 충돌하면 vision.md를 따르고, 사용자에게 알린다.

## 작업 원칙 (가장 중요)

1. **MVP 범위만 구현한다.** 범위는 vision.md의 "MVP 범위" 항목(1~3; 4번 인사이트는 연기)이다. 과도한 확장 금지.
2. **범위 밖 아이디어는 구현하지 않고 제안한다.** 블로그 발전 포인트를 발견하면 ① 무엇인지 ② 왜 필요한지 ③ 대략의 작업량을 사용자에게 설명하고, **명시적 승인 후에만** 추가한다. 승인된 기능은 vision.md의 MVP 범위에 항목으로 추가한 뒤 구현한다.
3. **완료 기준을 지킨다.** 각 MVP 항목은 vision.md의 체크리스트가 모두 충족되면 끝이다. 그 이상 다듬지 않는다.
4. **미결정 사항은 구현 전에 사용자에게 확인한다.** (인증 방식, 통계 수집 수단 등. vision.md에 표시됨)
5. 리팩토링은 **동작 보존**이 원칙이다. 기능 변경과 구조 정리를 한 커밋에 섞지 않는다.
6. 커밋·푸시는 사용자가 요청할 때만 한다. 푸시하면 GitHub Actions가 실행되어 `Auto-update project pages` 커밋이 추가되므로, 푸시 전 `git pull`로 원격 변경을 확인한다.
7. 사용자 피드백 및 향후 추가 결정되는 사항은 [docs/decisions.md](docs/decisions.md)에 명시한다.

## 프로젝트 개요

- GitHub Pages 정적 사이트. 서버 없음. 순수 HTML/CSS/JS + Python 빌드 스크립트.
- 글 흐름: `mdposts/<project>/*.md` 작성 → push → Actions가 Python 스크립트 실행 → HTML/JSON 생성·커밋 → Pages 배포.
- 언어: 문서·주석·커밋 메시지는 **한국어** (기존 관례). 코드 식별자는 영어.

## 디렉토리 맵

| 경로 | 역할 | 편집 |
|---|---|---|
| `mdposts/<project>/*.md`, `mdposts/<project>/<slug>/index.md` + 이미지 | 글 원본 (Front Matter + Markdown). 폴더 글은 이미지를 같은 폴더에 둔다 | 사람/작성 툴(`/write/`) |
| `templates/*.html` | Jinja2 페이지 템플릿 (index/about/projects/project-page/project-post) | 직접 |
| `templates/partials/` | 공통 header/footer (템플릿에서 include) | 직접 |
| `assets/py/` | 빌드 스크립트 (`config.py`에 경로 상수) | 직접 |
| `docs/` | vision, decisions | 직접 |
| `assets/js/`, `assets/css/`, `assets/image/` | 프론트 자원 | 직접 |
| `json/projects-config.json` | 프로젝트 카테고리 수동 설정 | 직접 |
| `.github/workflows/update-pages.yml` | 빌드/배포 | 직접 |
| `index.html`, `about/`, `projects/`, `write/`, `json/projects-metadata.json`, `json/*-posts.json` | **생성물** | **직접 수정 금지** — 템플릿/스크립트를 고치고 재빌드 |

> 생성물을 손으로 고치면 다음 빌드에서 덮어써진다. 수정이 필요하면 항상 원본(템플릿·스크립트·md)을 고친다.
> 리팩토링으로 구조가 바뀌면 이 표와 README를 함께 갱신한다.

## 빌드 / 로컬 확인

```bash
pip install -r requirements.txt
python assets/py/update-all-projects.py   # md → 포스트/프로젝트 HTML, json 메타데이터
python assets/py/update-home-page.py      # index / projects / about 페이지
python -m http.server 8000                # http://localhost:8000
```

- 스크립트는 **저장소 루트에서** 실행한다 (상대 경로 사용).
- Windows에서 이모지 출력 오류(cp949)가 나면 `PYTHONIOENCODING=utf-8` 지정.
- `index.html`, `assets/`, `json/` 은 사이트 주소와 직접 대응하므로 루트에 둔다. 루트 URL로 노출되어야 하는 파일은 옮기지 않는다.
- 실행 순서 고정: `update-all-projects.py` → `update-home-page.py` (후자가 전자의 `projects-metadata.json`을 읽음).
- 테스트 프레임워크는 없다. 검증은 빌드 후 `git diff`로 생성물 변화 확인 + 로컬 서버에서 페이지 확인.
- 리팩토링 검증: 작업 전 재빌드한 결과를 기준으로 삼아, 작업 후 재빌드 출력과 비교해 의도하지 않은 변화가 없는지 본다. (저장소의 커밋된 생성물은 낡았을 수 있다.)

## 글 Front Matter 규격

필수: `title`, `date`(YYYY-MM-DD), `slug`(영문 소문자·숫자·하이픈), `main_image`, `tags`(배열), `excerpt`.
`main_image` 는 `/assets/image/...` 절대경로 또는 폴더 글의 이미지 파일명(빌드가 절대경로로 변환).
선택: `project_title`, `project_description` (프로젝트 첫 md에서 자동 발견 시 사용).
H1은 본문에서 쓰지 않고, 목차는 H2/H3만 포함된다.

## 코딩 규칙

- 기존 스타일을 따른다: JS는 바닐라 ES6+, 4칸 들여쓰기, 한국어 주석. 프레임워크·번들러·npm 의존성을 새로 들이지 않는다 (승인 필요).
- Python 의존성은 `requirements.txt`에만 추가하고, 추가 전 사용자에게 알린다.
- 프론트 경로는 루트 기준 절대경로(`/assets/...`, `/projects/...`). 페이지 URL은 `디렉토리/index.html` 형태로 유지.
- 디자인 토큰: 검정 `#343434`, 노랑 `#FFDE59`. 디자인 변경은 범위 밖.

## 보안 규칙 (인증·작성 툴 구현 시)

- 토큰·시크릿을 저장소에 커밋하지 않는다 (코드, 설정, 로그 포함). 필요하면 GitHub Secrets 또는 브라우저 로컬 저장소만 사용.
- 주인 검증은 클라이언트 UI 숨김만으로 끝내지 않는다. 실제 쓰기 동작이 저장소 권한에 의해 강제되어야 한다.
- 주인 계정: GitHub `bambi0256`. 검증 로직은 `assets/js/auth.js` 에 둔다 (D-008). 토큰은 `sessionStorage` 에만 보관한다.
- 외부 서비스(통계 등)를 연결하기 전에 어떤 데이터가 전송되는지 사용자에게 설명한다.

## 작업 방식

- 큰 작업(리팩토링, 인증, 작성 툴, 인사이트)은 시작 전 짧은 계획을 사용자에게 보여주고, 항목 단위로 진행한다. 진행 순서: 1(리팩토링) → 2(인증) → 3(작성 툴). 4(인사이트)는 MVP 이후.
- 항목 하나를 끝낼 때마다 vision.md의 체크박스를 갱신한다.
- 불확실한 요구는 추측하지 말고 질문한다. 단, 관례적 기본값이 있는 사소한 선택은 기본값으로 진행하고 알린다.
