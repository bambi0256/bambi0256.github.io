import frontmatter
from jinja2 import Environment, FileSystemLoader
from markdown import markdown
from bs4 import BeautifulSoup
from pygments.formatters import HtmlFormatter
from pygments.styles import solarizeddark
import os
import json
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
    html_content = markdown(
        markdown_content, extensions=["fenced_code", "codehilite"]
    )
    soup = BeautifulSoup(html_content, "html.parser")
    headers = []
    for header in soup.find_all(["h1", "h2"]):
        header_text = header.get_text()
        header_id = re.sub(r'\s+', '-', header_text.lower())
        header_level = 1 if header.name == "h1" else 2
        headers.append({"id": header_id, "text": header_text, "level": header_level})
        header["id"] = header_id
    return headers, str(soup)

# JSON 업데이트 함수
def update_json(metadata, json_file):
    if os.path.exists(json_file):
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        data = []

    # 중복 항목 확인 및 제거
    data = [entry for entry in data if entry['title'] != metadata['title']]

    # 새로운 메타데이터 추가
    data.append(metadata)

    # JSON 파일 저장
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# HTML 렌더링 함수
def render_html(metadata, html_content, toc_headers, template_file, output_dir):
    env = Environment(loader=FileSystemLoader(searchpath="./"))
    template = env.get_template(template_file)

    # HTML 렌더링
    rendered_html = template.render(
        metadata=metadata,
        content=html_content,
        toc_headers=toc_headers
    )

    # 출력 디렉토리 생성
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "index.html")

    # HTML 파일 저장
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(rendered_html)

    print(f"Generated HTML: {output_path}")

# 모든 Markdown 파일 처리 함수
def process_all_posts(md_root_dir, template_file, output_base_dir, json_file):
    for root, _, files in os.walk(md_root_dir):
        for file in files:
            if file.endswith(".md"):
                md_file = os.path.join(root, file)
                metadata, markdown_content = process_markdown(md_file)

                # TOC 및 HTML 콘텐츠 생성
                toc_headers, html_content = extract_toc_headers(markdown_content)

                # 슬러그 생성 및 출력 디렉토리 설정
                slug = create_slug(metadata['title'])
                output_dir = os.path.join(output_base_dir, slug)

                # JSON 업데이트
                update_json(metadata, json_file)

                # HTML 렌더링
                render_html(metadata, html_content, toc_headers, template_file, output_dir)

# 실행
if __name__ == "__main__":
    md_root_dir = "./mdposts/project"
    template_file = "./temp-project-post.html"
    output_base_dir = "./project"
    json_file = "./assets/js/project-posts.json"
    process_all_posts(md_root_dir, template_file, output_base_dir, json_file)
