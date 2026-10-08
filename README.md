# B.Bee GitHub Blog

GitHub Pages 위에서 동작하는 개인 블로그 겸 포트폴리오입니다. 템플릿 없이 직접 제작했으며, Python(빌드)과 순수 JavaScript(프론트)로 구성됩니다.

- 작업 지침: [CLAUDE.md](CLAUDE.md)
- 목표·범위: [docs/vision.md](docs/vision.md)
- 결정 기록: [docs/decisions.md](docs/decisions.md)

## 동작 방식

```
mdposts/<project>/*.md  ──push──▶  GitHub Actions  ──▶  Python 빌드  ──▶  HTML / JSON 생성·커밋  ──▶  Pages 배포
```

1. `mdposts/<project>/` 에 Markdown 글을 작성하고 push합니다.
2. Actions(`.github/workflows/update-pages.yml`)가 빌드 스크립트 2개를 순서대로 실행합니다.
3. 생성된 `index.html`, `about/`, `projects/`, `json/` 을 자동 커밋하고 배포합니다.

## 디렉토리 구조

```
/
├── mdposts/<project>/        # [소스] 글 원본 (Front Matter + Markdown)
├── templates/                # [소스] Jinja2 템플릿
│   ├── index.html            #   홈
│   ├── about.html            #   소개
│   ├── projects.html         #   전체 프로젝트 목록
│   ├── project-page.html     #   프로젝트별 포스트 목록
│   ├── project-post.html     #   개별 포스트
│   └── partials/             #   공통 header / footer
├── assets/
│   ├── py/                   # [소스] 빌드 스크립트
│   │   ├── config.py                #   경로 상수·공통 함수
│   │   ├── update-all-projects.py   #   md → 포스트/프로젝트 HTML + JSON
│   │   └── update-home-page.py      #   홈 / Projects / About 페이지
│   ├── js/                   # [소스] hamburger, set-current, toc, project-posts
│   ├── css/                  # [소스] 스타일
│   └── image/                # [소스] 이미지
├── json/
│   ├── projects-config.json  # [설정] 프로젝트 카테고리 수동 설정
│   ├── projects-metadata.json        # [생성물]
│   └── <project>-posts.json          # [생성물] 프로젝트별 포스트 목록 (project-posts.js가 fetch)
├── index.html                # [생성물] 홈
├── about/  projects/         # [생성물] 소개 / 프로젝트 / 포스트 페이지
├── docs/                     # 프로젝트 문서 (vision, decisions)
└── .github/workflows/        # 빌드·배포
```

**[생성물] 은 직접 수정하지 않습니다.** 다음 빌드에서 덮어써지므로 `templates/`, 스크립트, `mdposts/` 를 수정합니다.

> `index.html`, `json/`, `assets/` 는 사이트 주소(`/`, `/json/...`, `/assets/...`)와 직접 대응하므로 루트에 있어야 합니다. 템플릿은 주소로 노출되지 않아 `templates/` 로 옮겼습니다.

## 글 작성

`mdposts/<project>/<파일>.md` 에 아래 Front Matter를 포함합니다.

```markdown
---
title: "포스트 제목"
date: "2025-12-02"
slug: "url-friendly-slug"
main_image: "/assets/image/post-image.jpg"
tags: ["태그1", "태그2"]
excerpt: "카드에 표시될 짧은 설명"
---

## 첫 번째 섹션

본문...
```

| 필드 | 설명 |
|---|---|
| `title` | 포스트 제목 |
| `date` | 작성일 (YYYY-MM-DD) |
| `slug` | URL 식별자 (영문 소문자·숫자·하이픈). 주소는 `/projects/<project>/<slug>/` |
| `main_image` | 썸네일 이미지 경로 |
| `tags` | 태그 배열 |
| `excerpt` | 카드에 표시될 한 줄 설명 |

- 선택: `project_title`, `project_description` — 프로젝트 첫 글에서 프로젝트 이름/설명으로 사용됩니다.
- H1은 쓰지 않습니다. 목차는 H2/H3만 포함되며 포스트 우측에 자동 생성됩니다.
- 새 프로젝트는 `mdposts/` 하위에 디렉토리를 만들면 자동 발견됩니다. 제목·설명을 직접 지정하려면 `json/projects-config.json` 에 추가합니다.

```json
{
  "projects": [
    {
      "slug": "Spell_Unlock_TCG",
      "title": "Spell Unlock TCG",
      "description": "",
      "mdposts_dir": "mdposts/Spell_Unlock_TCG",
      "output_dir": "projects/Spell_Unlock_TCG"
    }
  ]
}
```

## 로컬 빌드·확인

저장소 루트에서 실행합니다.

```bash
pip install -r requirements.txt
python assets/py/update-all-projects.py   # 1) 먼저
python assets/py/update-home-page.py      # 2) 그 다음 (1의 json을 읽음)
python -m http.server 8000                # http://localhost:8000
```

Windows 콘솔에서 이모지 출력 오류가 나면 `PYTHONIOENCODING=utf-8` 을 지정합니다 (PowerShell: `$env:PYTHONIOENCODING="utf-8"`).

## 배포

- `mdposts/**`, `json/projects-config.json`, `templates/**`, `assets/py/**` 를 push하면 Actions가 자동 실행됩니다.
- 수동 실행: GitHub → Actions → "Update Project Pages" → Run workflow.
- JS/CSS만 수정한 경우에는 생성물이 바뀌지 않으므로 빌드가 필요 없습니다.

## 디자인

검정-노랑 꿀벌 테마(`#343434`, `#FFDE59`), 폰트는 데브시스터즈 쿠키런. 스타일은 `assets/css/` 에서 관리하며 모바일 햄버거 메뉴를 지원합니다.
