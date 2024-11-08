import os
import markdown
from jinja2 import Template
import yaml

# 설정
BLOG_MD_DIR = "./mdposts/blog/"
BLOG_HTML_DIR = "./blog/"
BLOG_TEMPLATE = "./blog-template.html"
BLOG_PAGE = "./blog.html"
NUM_POSTS_PER_PAGE = 6  # 한 페이지에 보여질 게시물 수

def load_metadata_from_md(filepath):
    """Extract metadata from markdown file header."""
    with open(filepath, 'r') as file:
        content = file.read()
    
    # 메타데이터의 시작과 끝을 탐색하여 추출
    if content.startswith('---'):
        _, metadata_content, _ = content.split('---', 2)
        metadata = yaml.safe_load(metadata_content)
        return metadata
    else:
        raise ValueError("Markdown file does not contain metadata")

def convert_md_to_html(filepath):
    """Convert markdown to HTML."""
    with open(filepath, 'r') as file:
        content = file.read()
    return markdown.markdown(content)

def generate_blog_post_html(metadata, content):
    """Create HTML for a single blog post from metadata and content."""
    template = Template(open(BLOG_TEMPLATE).read())
    return template.render(metadata=metadata, content=content)

def update_blog_page():
    # 디렉토리 생성 확인
    if not os.path.exists(BLOG_HTML_DIR):
        os.makedirs(BLOG_HTML_DIR)
    
    # 마크다운 파일에서 메타데이터 추출 및 변환
    posts = []
    for md_file in os.listdir(BLOG_MD_DIR):
        if md_file.endswith(".md"):
            filepath = os.path.join(BLOG_MD_DIR, md_file)
            metadata = load_metadata_from_md(filepath)
            html_content = convert_md_to_html(filepath)
            post_html = generate_blog_post_html(metadata, html_content)
            
            # HTML 파일로 저장
            output_path = os.path.join(BLOG_HTML_DIR, f"{metadata['slug']}.html")
            with open(output_path, 'w') as file:
                file.write(post_html)
            
            # 메타데이터만 기록
            posts.append(metadata)
    
    # 최신 글을 기준으로 정렬 후 페이지 생성
    posts = sorted(posts, key=lambda x: x['date'], reverse=True)
    pages = [posts[i:i + NUM_POSTS_PER_PAGE] for i in range(0, len(posts), NUM_POSTS_PER_PAGE)]
    blog_index_template = Template(open(BLOG_PAGE).read())
    
    for page_num, page_posts in enumerate(pages):
        blog_html = blog_index_template.render(posts=page_posts, page=page_num + 1, total_pages=len(pages))
        page_output_path = os.path.join(BLOG_HTML_DIR, f"blog-page-{page_num + 1}.html")
        with open(page_output_path, 'w') as file:
            file.write(blog_html)

update_blog_page()