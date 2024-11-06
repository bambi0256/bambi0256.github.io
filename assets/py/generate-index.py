import os
import yaml
from jinja2 import Template

def generate_index_html():
    blog_posts = get_recent_posts('blog')
    project_posts = get_recent_posts('projects')
    
    # 템플릿 로드
    with open("index-template.html", 'r') as f:
        template = Template(f.read())

    # 인덱스 페이지를 생성
    html_content = template.render(
        blog_posts=blog_posts,
        project_posts=project_posts
    )

    with open("index.html", 'w', encoding='utf-8') as f:
        f.write(html_content)

def get_recent_posts(folder):
    posts = []
    for filename in os.listdir(folder):
        if filename.endswith('.html'):
            metadata = extract_metadata(os.path.join(folder, filename))[0]
            posts.append({
                'title': metadata['Title'],
                'date': metadata['Date'],
                'tags': metadata['Tags'],
                'image': metadata.get('Image', ''),
                'slug': metadata['Slug']
            })
    # 최근 3개의 포스트만 반환
    posts.sort(key=lambda x: x['date'], reverse=True)
    return posts[:3]

if __name__ == "__main__":
    generate_index_html()
