# B.Bee GitHub Blog

## 개요

이 프로젝트는 개인 블로그를 제작해 보는 프로젝트입니다.
구성 페이지의 생성을 위해 Python 스크립트와 JavaScript를 활용하며, 페이지들은 작성한 포스트 내용에 따라 동적으로 생성됩니다.

---

## 디렉토리 구조

```
/(root)
|
├── ./.github/workflows/            # GitHub Actions 워크플로우 파일
|
├── assets/                        # 자산 파일들 (이미지, CSS, JS, Python)
|   ├── css/                       # 스타일시트
|   ├── js/                        # 자바스크립트 파일들
|   ├── py/                        # Python 스크립트 파일들
|   └── image/                     # 이미지 파일들
|
├── mdposts/                       # Markdown 파일들 (프로젝트 카테고리별)
|   ├── project1/                  # 프로젝트 1 Markdown 파일들
|   └── project2/                  # 프로젝트 2 Markdown 파일들 (확장 가능)
|
├── project1/                      # 프로젝트 1 생성된 HTML 페이지들
├── project2/                      # 프로젝트 2 생성된 HTML 페이지들
|
├── index.html                     # 홈페이지 HTML
├── header.html                    # 공통 헤더 템플릿
├── footer.html                    # 공통 푸터 템플릿
├── projects-config.json           # 프로젝트 카테고리 설정
├── requirements.txt               # 프로젝트 의존성
├── README.md                      # 프로젝트 설명 파일
|
├── temp-*                          # 템플릿 파일들 (홈페이지, 프로젝트용)
└── . . .
```

---

## 주요 파일 및 기능 설명

### 1. **`/root/.github/workflows/`**
- **`update-pages.yml`**: GitHub Actions 워크플로우 파일로, 페이지를 업데이트하는 작업을 자동화합니다.

### 2. **`/assets/`**
- **`/css/`**: 프로젝트의 스타일을 정의한 `style.css`가 포함됩니다. 블로그의 스타일을 정의합니다.
- **`/js/`**
  - **`pagination-blog.js`**: 블로그 페이지를 동적으로 업데이트하고 Pagination을 관리합니다.
  - **`pagination-project.js`**: 프로젝트 페이지를 동적으로 업데이트하고 Pagination을 관리합니다.
  - **`hamburger.js`**: 반응형 햄버거 메뉴 관리 및 작은 화면에서 메뉴를 토글하는 기능입니다.
  - **`set-current.js`**: 헤더의 현재 페이지 링크를 강조하는 기능입니다.
- **`/py/`**
  - **`update-blog-page.py`**: 블로그 Markdown 파일을 HTML로 변환하고, 블로그 페이지를 업데이트합니다.
  - **`update-project-page.py`**: 프로젝트 Markdown 파일을 HTML로 변환하고, 프로젝트 페이지를 업데이트합니다.
  - **`update-home-page.py`**: 홈페이지를 생성하는 Python 스크립트로, `temp-index.html` 템플릿을 사용하여 정적 HTML 페이지를 만듭니다.
- **`/image/`**

### 3. **`/mdposts/`**
이 디렉토리는 두 개의 서브 디렉토리, `blog/`와 `project/`를 포함하며, 각각 블로그와 프로젝트 콘텐츠의 Markdown 파일들이 포함됩니다.
- **`/blog/`**: 블로그 Markdown 파일들.
- **`/project/`**: 프로젝트 Markdown 파일들.

### 4. **`/temp-*` 템플릿 파일들**
템플릿 파일들은 HTML 페이지를 생성할 때 Jinja2 템플릿 엔진을 사용하여 동적으로 렌더링됩니다. 이를 통해 각 페이지에 필요한 데이터를 동적으로 삽입하고, 최종적인 HTML을 생성합니다.
- **`temp-index.html`**: 홈페이지 템플릿. Jinja2 템플릿 엔진을 통해 `index.html` 파일을 생성합니다.
- **`temp-blog.html`**: 블로그 페이지 템플릿. 블로그 포스트들을 리스트 형식으로 출력합니다.
- **`temp-project.html`**: 프로젝트 페이지 템플릿. 프로젝트 포스트들을 리스트 형식으로 출력합니다.
- **`temp-blog-post.html`**: 개별 블로그 포스트 템플릿. 각 블로그 포스트의 내용과 메타데이터를 렌더링합니다.
- **`temp-project-post.html`**: 개별 프로젝트 포스트 템플릿. 각 프로젝트 포스트의 내용과 메타데이터를 렌더링합니다.

### 5. **`index.html`, `header.html`, `footer.html`**
- **`index.html`**: 홈페이지를 구성하는 HTML 파일. 이 파일은 `temp-index.html` 템플릿을 사용하여 동적으로 생성됩니다.
- **`header.html`**: 모든 페이지에 공통으로 사용되는 헤더 템플릿. 로고, 네비게이션 메뉴 및 소셜 아이콘이 포함됩니다.
- **`footer.html`**: 모든 페이지에 공통으로 사용되는 푸터 템플릿. 사이트에 대한 간단한 정보와 네비게이션 링크가 포함됩니다.

---

## 부가 설명

이 프로젝트는 템플릿 없이 Github 블로그를 스스로 제작하고 향후 포트폴리오 및 블로그 공간으로 활용하는 것을 목표로 합니다. 

실제 사용을 고려하여 모든 html 파일을 해당하는 디렉토리를 생성하여 index.html로 제작하고, 링크를 깔끔하게 했습니다.

블로그의 디자인은 자체적인 기획과 Chat-GPT를 활용한 스크립트 제작을 기반으로 합니다.

---

### **프로젝트 관리 및 유지보수**

1. Markdown 파일을 추가하거나 수정하면 자동으로 블로그에 업데이트됩니다.
2. Markdown 파일의 추가/수정 없이 디자인, 템플릿에 변경을 주는 경우 Github Actions에서 직접 Workflow를 실행해야 합니다.
3. 향후 css 파일을 해당하는 html 템플릿 별로 분리하여 수정 및 로드를 용이하게 할 것입니다.

---

## 📖 사용자 가이드

### 1. 새로운 프로젝트 카테고리 추가하기

프로젝트 카테고리는 확장 가능한 구조로 설계되어 있습니다. 새 카테고리를 추가하려면:

1. **프로젝트 설정 파일 수정** (`projects-config.json`):
   ```json
   {
     "projects": [
       {
         "slug": "project1",
         "title": "프로젝트 1: 디펜스",
         "description": "타워 디펜스 게임 프로젝트",
         "mdposts_dir": "mdposts/project1",
         "output_dir": "project1"
       },
       {
         "slug": "project2",
         "title": "프로젝트 2: 새 프로젝트",
         "description": "새로운 프로젝트 설명",
         "mdposts_dir": "mdposts/project2",
         "output_dir": "project2"
       }
     ]
   }
   ```

2. **마크다운 디렉토리 생성**:
   ```
   mkdir mdposts/project2
   ```

3. **빌드 스크립트 실행** (로컬 테스트 시):
   ```
   python assets/py/update-all-projects.py
   python assets/py/update-home-page.py
   ```

4. **GitHub에 Push**: 자동으로 배포됩니다.

### 2. 포스트 작성하기

#### Front Matter 형식

모든 마크다운 파일은 다음 Front Matter를 포함해야 합니다:

```markdown
---
title: "포스트 제목"
date: "2025-12-02"
slug: "url-friendly-slug"
main_image: "/assets/image/post-image.jpg"
tags: ["태그1", "태그2", "태그3"]
excerpt: "카드에 표시될 짧은 설명 (한 줄)"
---

## 첫 번째 섹션

본문 내용...

### 하위 섹션

더 많은 내용...
```

#### 필수 필드

- **title**: 포스트 제목
- **date**: 작성�일 (YYYY-MM-DD 형식)
- **slug**: URL에 사용될 식별자 (영문 소문자, 하이픈 사용)
- **main_image**: 썸네일 이미지 경로
- **tags**: 태그 배열
- **excerpt**: 포스트 카드에 표시될 짧은 설명

#### 목차 자동 생성

- H2 (`##`)와 H3 (`###`) 헤딩만 목차에 포함됩니다
- H1은 제목용이므로 본문에서는 사용하지 마세요
- 포스트 페이지 우측에 자동으로 목차가 생성됩니다

#### 작성 예시

```markdown
---
title: "타워 디펜스 게임 분석"
date: "2025-12-02"
slug: "tower-defense-analysis"
main_image: "/assets/image/tower-defense.jpg"
tags: ["게임 개발", "분석", "TD"]
excerpt: "타워 디펜스 장르의 핵심 요소 분석"
---

## 장르의 정의

타워 디펜스는...

### 핵심 메커니즘

주요 메커니즘으로는...

## 게임 사례 분석

실제 게임 사례를 통해...
```

### 3. 자동 빌드 및 배포

#### 로컬 테스트

```bash
# Python 환경 확인
python --version

# 의존성 설치
pip install -r requirements.txt

# 빌드 스크립트 실행
python assets/py/update-all-projects.py
python assets/py/update-home-page.py

# 로컬 서버 실행
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

#### GitHub Actions 자동 배포

1. **자동 트리거**: `mdposts/project*/` 디렉토리의 파일을 수정하고 Push하면 자동으로 빌드
2. **수동 실행**: 
   - GitHub 저장소 → Actions 탭
   - "Update Project Pages" 워크플로우 선택
   - "Run workflow" 버튼 클릭

#### 배포 확인

- GitHub Pages 설정: Settings → Pages
- 배포 URL: `https://[username].github.io`
- 배포 상태: Actions 탭에서 워크플로우 실행 상태 확인

### 4. 디자인 수정

현재 블로그는 **검정-노랑 꿀벌 테마**를 사용합니다.

#### CSS 파일

- `assets/css/header-footer-style.css`: 헤더/푸터 스타일
- `assets/css/index-style.css`: 홈페이지 스타일
- `assets/css/project-style.css`: 프로젝트 목록 페이지
- `assets/css/post-style.css`: 개별 포스트 페이지

#### 색상 변경

파일에서 다음 색상 코드를 찾아 변경:
- `#343434`: 검정 (배경, 텍스트)
- `#FFDE59`: 노랑 (액센트, 버튼)

변경 후 GitHub Actions에서 워크플로우를 수동 실행하여 배포하세요.

---

## 🐝 B.Bee 테마 특징

- **색상**: 검정-노랑 꿀벌 컨셉
- **폰트**: 데브시스터즈 쿠키런 폰트
- **구조**: 확장 가능한 다중 프로젝트 카테고리
- **자동화**: GitHub Actions 기반 자동 빌드/배포
- **반응형**: 모바일 햄버거 메뉴 지원


