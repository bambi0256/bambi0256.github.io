import os
import markdown
import json
from jinja2 import Environment, FileSystemLoader
import yaml

PROJECT_MD_DIR = "./mdposts/project/"
PROJECT_HTML_DIR = "./project/"
PROJECT_TEMPLATE_DIR = os.path.abspath("./")
PROJECT_POST_TEMPLATE = "project/project-post-template.html"
PROJECT_JSON_FILE = "./assets/js/project-posts.json"

def load_metadata_from_md(filepath):
    """Extract metadata from markdown file header."""
    with open(filepath, 'r') as file:
        content = file.read()
    
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

def generate_post_html(template_name, metadata, content):
    """Create HTML for a single post from metadata and content."""
    env = Environment(loader=FileSystemLoader(PROJECT_TEMPLATE_DIR))
    template = env.get_template(template_name)
    return template.render(metadata=metadata, content=content)

def load_existing_json(filepath):
    """Load existing JSON data from a file, or return an empty list if the file does not exist or is empty."""
    if not os.path.exists(filepath) or os.stat(filepath).st_size == 0:
        return []
    with open(filepath, 'r') as file:
        return json.load(file)

def update_project_page():
    # 디렉토리 생성 확인
    if not os.path.exists(PROJECT_HTML_DIR):
        os.makedirs(PROJECT_HTML_DIR)
    
    posts = load_existing_json(PROJECT_JSON_FILE)

    for md_file in os.listdir(PROJECT_MD_DIR):
        if md_file.endswith(".md"):
            filepath = os.path.join(PROJECT_MD_DIR, md_file)
            metadata = load_metadata_from_md(filepath)
            html_content = convert_md_to_html(filepath)
            
            # Create post directory and save index.html
            post_dir = os.path.join(PROJECT_HTML_DIR, metadata['slug'])
            if not os.path.exists(post_dir):
                os.makedirs(post_dir)
            output_path = os.path.join(post_dir, 'index.html')
            post_html = generate_post_html(PROJECT_POST_TEMPLATE, metadata, html_content)
            with open(output_path, 'w') as file:
                file.write(post_html)
            
            # Append post metadata
            if metadata not in posts:  # 중복 추가 방지
                posts.append(metadata)
    
    # 최신 글을 기준으로 정렬 후 JSON 파일로 저장
    posts = sorted(posts, key=lambda x: x['date'], reverse=True)
    with open(PROJECT_JSON_FILE, 'w') as json_file:
        json.dump(posts, json_file, indent=4)

update_project_page()