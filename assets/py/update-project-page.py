import os
import json
import markdown
import yaml
from jinja2 import Environment, FileSystemLoader

def load_markdown_posts(directory):
    posts = []
    for filename in os.listdir(directory):
        if filename.endswith(".md"):
            with open(os.path.join(directory, filename), 'r') as f:
                content = f.read()
                # YAML 헤더와 본문 분리
                front_matter, body = content.split('---', 2)[1:]
                metadata = yaml.safe_load(front_matter)
                html_content = markdown.markdown(body)
                metadata['content'] = html_content
                posts.append(metadata)
    return posts

def create_post_pages(posts, template_file, output_dir):
    # Jinja2 환경 설정
    env = Environment(loader=FileSystemLoader('./'))
    template = env.get_template(template_file)
    
    for post in posts:
        slug = post.get('slug', post['title'].replace(' ', '-').lower())
        post_dir = os.path.join(output_dir, slug)
        os.makedirs(post_dir, exist_ok=True)
        
        # 템플릿 렌더링
        output = template.render(metadata=post, content=post['content'])
        
        # index.html 생성
        output_path = os.path.join(post_dir, 'index.html')
        with open(output_path, 'w') as f:
            f.write(output)

def update_project_page():
    # 1. Markdown 데이터 로드
    project_posts = load_markdown_posts('./mdposts/project/')
    
    # 2. JSON 업데이트
    with open('./assets/js/project-posts.json', 'w') as f:
        json.dump(project_posts, f, indent=4)
    
    # 3. Jinja2 환경 설정
    env = Environment(loader=FileSystemLoader('./'))
    template = env.get_template('temp-project.html')
    
    # 4. 개별 게시물 페이지 생성
    create_post_pages(project_posts, 'temp-project-post.html', './project/')
    
    # 5. 블로그 목록 페이지 생성
    output = template.render(posts=project_posts)
    output_path = './project/index.html'
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        f.write(output)

if __name__ == "__main__":
    update_project_page()
