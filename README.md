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
├── blog/                          # 블로그 관련 HTML 템플릿 및 페이지들
|
├── project/                       # 프로젝트 관련 HTML 템플릿 및 페이지들
|
├── mdposts/                       # Markdown 파일들 (블로그와 프로젝트)
|   ├── blog/                      # 블로그용 Markdown 파일들
|   └── project/                   # 프로젝트용 Markdown 파일들
|
├── index.html                     # 홈페이지 HTML
├── header.html                    # 공통 헤더 템플릿
├── footer.html                    # 공통 푸터 템플릿
├── requirements.txt               # 프로젝트 의존성
├── README.md                      # 프로젝트 설명 파일
|
├── temp-*                          # 템플릿 파일들 (홈페이지, 블로그, 프로젝트용)
└── . . .
```

---

## 주요 파일 및 기능 설명

### 1. **`/root/.github/workflows/`**
- **`update-pages.yml`**: GitHub Actions 워크플로우 파일로, 페이지를 업데이트하는 작업을 자동화합니다.

### 2. **`/assets/`**
- **`/css/`**: 프로젝트의 스타일을 정의한 `style.css`가 포함됩니다. 블로그의 스타일을 정의합니다.
- **`/js/`**: 자바스크립트 파일들이 포함되어 있습니다.
  - **`pagination-blog.js`**: 블로그 페이지를 동적으로 업데이트하고 Pagination을 관리합니다.
  - **`pagination-project.js`**: 프로젝트 페이지를 동적으로 업데이트하고 Pagination을 관리합니다.
  - **`hamburger.js`**: 반응형 햄버거 메뉴 관리 및 작은 화면에서 메뉴를 토글하는 기능입니다.
  - **`set-current.js`**: 헤더의 현재 페이지 링크를 강조하는 기능입니다.
- **`/py/`**: Python 스크립트 파일들이 포함되어 있습니다.
  - **`update-blog-page.py`**: 블로그 Markdown 파일을 HTML로 변환하고, 블로그 페이지를 업데이트합니다.
  - **`update-project-page.py`**: 프로젝트 Markdown 파일을 HTML로 변환하고, 프로젝트 페이지를 업데이트합니다.
  - **`update-home-page.py`**: 홈페이지를 생성하는 Python 스크립트로, `temp-index.html` 템플릿을 사용하여 정적 HTML 페이지를 만듭니다.
- **`/image/`**: 웹사이트에서 사용되는 이미지들이 포함됩니다. 로고 및 소셜 아이콘 등이 저장되어 있습니다.

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

