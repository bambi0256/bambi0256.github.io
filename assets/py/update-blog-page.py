import os
import json
import frontmatter
from markdown import markdown
from jinja2 import Environment, FileSystemLoader
from bs4 import BeautifulSoup
from pygments.formatters import HtmlFormatter
from pygments.styles import get_style_by_name
import re

# Slug 생성 함수
def create_slug(title):
    return title.strip().lower().replace(" ", "-").replace("%20", "-")

# Markdown 파일 처리 함수
def process_markdown(md_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)
    return post.metadata, post.content

# TOC 생성 함수
def extract_toc_headers(markdown_content):
    html_content = markdown(markdown_content, extensions=["fenced_code", "codehilite"])
    soup = BeautifulSoup(html_content, "html.parser")

    # TOC Headers 생성
    headers = []
    for header in soup.find_all(["h1", "h2"]):
        header_text = header.get_text()
        header_id = re.sub(r'\s+', '-', header_text.lower())
        header_level = 1 if header.name == "h1" else 2
        headers.append({"id": header_id, "text": header_text, "level": header_level})
        header["id"] = header_id

    # Pygments CSS 스타일 생성
    style = get_style_by_name("solarized-dark")  # 사용 가능한 스타일 이름 지정
    pygments_css = HtmlFormatter(style=style).get_style_defs('.codehilite')

    return headers, str(soup), pygments_css

# JSON 초기화 함수
def initialize_json(json_file):
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump([], f, ensure_ascii=False, indent=4)

# JSON 업데이트 함수
def update_json(metadata, json_file):
    #기존 메타데이터 읽기
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    #메타데이터 추가
    data.append(metadata)
    
    #JSON 업데이트
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# HTML 렌더링 함수
def render_html(metadata, html_content, toc_headers, pygments_css, template_file, output_dir):
    env = Environment(loader=FileSystemLoader(searchpath="./"))
    template = env.get_template(template_file)

    # 템플릿 렌더링
    rendered_html = template.render(
        metadata=metadata,
        content=html_content,
        toc_headers=toc_headers,
        pygments_css=pygments_css
    )

    # 출력 디렉토리 생성
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "index.html")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(rendered_html)

# 블로그 포스트 처리 함수
def process_blog_posts(md_root_dir, template_file, output_base_dir, json_file):
    for root, _, files in os.walk(md_root_dir):
        for file in files:
            if file.endswith(".md"):
                md_file = os.path.join(root, file)

                # Markdown 처리 및 TOC 생성
                metadata, markdown_content = process_markdown(md_file)
                toc_headers, html_content, pygments_css = extract_toc_headers(markdown_content)

                # 출력 디렉토리와 JSON 업데이트
                slug = create_slug(metadata['slug'])
                output_dir = os.path.join(output_base_dir, slug)
                update_json(metadata, json_file)

                # HTML 렌더링
                render_html(metadata, html_content, toc_headers, pygments_css, template_file, output_dir)

#블로그 페이지 갱신 함수
def update_blog_page():
    # 1. Jinja2 환경 설정
    env = Environment(loader=FileSystemLoader('./'))
    template = env.get_template('temp-blog.html')
    
    # 2. 템플릿 렌더링
    output = template.render()
    
    # 3. 파일 생성
    output_path = './blog/index.html'
    with open(output_path, 'w') as f:
        f.write(output)

if __name__ == "__main__":
    #JSON 파일 초기화
    json_file = "./assets/js/blog-posts.json"
    initialize_json(json_file)
    
    #블로그 포스트 처리
    process_blog_posts(
        md_root_dir="./mdposts/blog",
        template_file="./temp-blog-post.html",
        output_base_dir="./blog",
        json_file="./assets/js/blog-posts.json"
    )
    
    #블로그 페이지 갱신
    update_blog_page()
