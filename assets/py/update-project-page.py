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

def update_project_page():
    # 1. Markdown 데이터 로드
    project_posts = load_markdown_posts('./mdposts/project/')
    
    # 2. JSON 업데이트
    with open('./assets/js/project-posts.json', 'w') as f:
        json.dump(project_posts, f, indent=4)
    
    # 3. Jinja2 환경 설정
    env = Environment(loader=FileSystemLoader('./'))
    template = env.get_template('temp-project.html')
    
    # 4. 템플릿 렌더링
    output = template.render(posts=project_posts)
    
    # 5. 파일 생성
    output_path = './project/index.html'
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        f.write(output)

if __name__ == "__main__":
    update_project_page()
