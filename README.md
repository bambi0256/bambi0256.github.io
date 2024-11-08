# bambi0256.github.io
Only myself homepage



# Updated Project File Structure and Explanation
(root)
├ .github
│   └ workflows
│       ├ update-blog-pages.yml          # 블로그 포스트 업데이트용 워크플로우
│       └ update-project-pages.yml       # 프로젝트 포스트 업데이트용 워크플로우
├ assets
│   ├ py
│   │   ├ update-blog-page.py            # 블로그 페이지 업데이트 Python 스크립트
│   │   ├ update-project-page.py         # 프로젝트 페이지 업데이트 Python 스크립트
│   │   └ update-index-page.py           # index 페이지 업데이트 Python 스크립트
│   ├ css
│   │   └ style.css                      # 공통 스타일 파일
│   └ image
│       └ ...                            # 이미지 파일들이 저장되는 폴더
├ mdposts                                # Markdown 파일이 저장되는 폴더
│   ├ blog
│   │   ├ sample-blog-post.md            # 블로그 포스트 더미 Markdown 파일
│   │   └ ...
│   └ projects
│       ├ sample-project.md              # 프로젝트 포스트 더미 Markdown 파일
│       └ ...
├ blog
│   ├ exploring-the-world-of-ai.html     # 변환된 블로그 포스트 HTML 파일
│   ├ blog-page-1.html                   # 블로그 페이지 목록 (최신 글 6개 표시)
│   └ ...
├ projects
│   ├ personal-portfolio-website.html    # 변환된 프로젝트 포스트 HTML 파일
│   ├ projects-page-1.html               # 프로젝트 페이지 목록 (최신 글 6개 표시)
│   └ ...
├ index.html                             # Home 페이지 (최종 결과 HTML 파일)
├ index-template.html                    # Home 페이지 템플릿 (동적 데이터 포함)
├ projects.html                          # Projects 페이지 (목록형)
├ blog.html                              # Blog 페이지 (목록형)
├ about.html                             # About 페이지
├ projects-template.html                 # Projects 페이지 개별 포스트 템플릿
├ blog-template.html                     # Blog 페이지 개별 포스트 템플릿
├ README.md                              # 프로젝트 설명 파일
└ requirements.txt                       # Python 패키지 의존성 목록 파일

### 설명

- **`.github/workflows`**:
  - `update-blog-pages.yml`: 블로그 포스트에 대한 Markdown 파일이 변경되면 이를 감지하여 HTML로 업데이트하는 워크플로우.
  - `update-project-pages.yml`: 프로젝트 포스트에 대한 Markdown 파일이 변경되면 이를 감지하여 HTML로 업데이트하는 워크플로우.

- **`assets/py`**:
  - `update-blog-page.py`, `update-project-page.py`, `update-index-page.py`: 각각 블로그, 프로젝트, 홈(index) 페이지를 업데이트하는 Python 스크립트.

- **`assets/css/style.css`**:
  - 페이지 전반에 적용되는 공통 스타일을 정의한 CSS 파일.

- **`mdposts/blog` 및 `mdposts/projects`**:
  - 블로그와 프로젝트 포스트의 원본 Markdown 파일이 저장되는 폴더.
  - `sample-blog-post.md`, `sample-project.md`는 더미 포스트로 테스트용으로 작성된 파일.

- **`blog` 및 `projects`**:
  - 변환된 HTML 파일을 저장하는 폴더로, 각각의 포스트에 해당하는 HTML 파일들이 저장됨.
  - `blog-page-1.html`, `projects-page-1.html`은 각각 최신 글 6개를 표시하는 목록 페이지.

- **`index-template.html` 및 `index.html`**:
  - `index-template.html`: Home 페이지 템플릿으로 동적 데이터를 포함함.
  - `index.html`: 실제 배포되는 정적 HTML 파일로, 템플릿에서 생성됨.

- **`projects.html` 및 `blog.html`**:
  - 각각 프로젝트와 블로그의 목록 페이지. 최신 글의 요약과 링크를 제공.

- **`projects-template.html` 및 `blog-template.html`**:
  - 각각 프로젝트와 블로그 포스트의 개별 HTML 템플릿 파일로, Markdown 파일을 변환할 때 사용됨.

- **`README.md`**: 프로젝트에 대한 설명 파일.

- **`requirements.txt`**: Python 의존성 파일로, `jinja2`, `markdown`, `PyYAML` 등 필요한 라이브러리들을 포함.
