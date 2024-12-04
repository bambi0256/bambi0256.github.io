import os
from jinja2 import Environment, FileSystemLoader

def update_page(output_dir, template_file):
    # 1. Jinja2 환경 설정
    env = Environment(loader=FileSystemLoader(searchpath="./"))
    template = env.get_template(template_file)
    
    # 2. 템플릿 렌더링
    output = template.render()
    
    # 3. 파일 생성
    output_path = os.path.join(output_dir, "index.html")
    with open(output_path, 'w') as f:
        f.write(output)

if __name__ == "__main__":
    update_page(
        output_dir="./",
        template_file="./temp-index.html"
    )
    update_page(
        output_dir="./about",
        template_file="./temp-about.html"
    )
    