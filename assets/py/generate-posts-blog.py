import os
import yaml
from jinja2 import Template

def generate_blog_html(md_file):
    metadata, body = extract_metadata(md_file)  # extract-metadata.py에서 사용한 메소드
    template_file = "blog-template.html"
    output_dir = "blog"

    # HTML 템플릿을 로드하여 데이터를 삽입
    with open(template_file, 'r') as f:
        template = Template(f.read())

    html_content = template.render(
        title=metadata['Title'],
        date=metadata['Date'],
        content=body,
        tags=metadata['Tags'],
        image=metadata.get('Image', '')
    )

    # 포스트 HTML 파일 생성
    post_filename = os.path.join(output_dir, f"{metadata['Slug']}.html")
    with open(post_filename, 'w', encoding='utf-8') as f:
        f.write(html_content)

if __name__ == "__main__":
    md_file = "path_to_blog_post.md"
    generate_blog_html(md_file)
