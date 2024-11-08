import os
import yaml
from jinja2 import Template

INDEX_TEMPLATE = "./index-template.html"
INDEX_HTML = "./index.html"
BLOG_MD_DIR = "./mdposts/blog/"
PROJECTS_MD_DIR = "./mdposts/projects/"

def load_metadata_from_md(filepath):
    with open(filepath, 'r') as file:
        lines = file.readlines()
    metadata = yaml.safe_load("".join(lines[:lines.index('---', 1) + 1]))
    return metadata

def get_recent_posts(directory, num_posts=3):
    posts = []
    for md_file in os.listdir(directory):
        if md_file.endswith(".md"):
            filepath = os.path.join(directory, md_file)
            metadata = load_metadata_from_md(filepath)
            posts.append(metadata)
    # 최신 순으로 정렬 후 상위 n개만 반환
    return sorted(posts, key=lambda x: x['date'], reverse=True)[:num_posts]

def update_index_page():
    # 최신 게시물 가져오기
    recent_blog_posts = get_recent_posts(BLOG_MD_DIR)
    recent_project_posts = get_recent_posts(PROJECTS_MD_DIR)
    
    # 템플릿 렌더링
    with open(INDEX_TEMPLATE) as file:
        index_template = Template(file.read())
    
    index_html = index_template.render(
        blog_posts=recent_blog_posts,
        project_posts=recent_project_posts
    )
    
    # index.html에 쓰기
    with open(INDEX_HTML, 'w') as file:
        file.write(index_html)

update_index_page()
