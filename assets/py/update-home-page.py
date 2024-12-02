import os
from jinja2 import Environment, FileSystemLoader

def update_home_page():
    # 1. Jinja2 환경 설정
    env = Environment(loader=FileSystemLoader('./'))
    template = env.get_template('temp-index.html')
    
    # 2. 템플릿 렌더링
    output = template.render()
    
    # 3. 파일 생성
    output_path = './index.html'
    with open(output_path, 'w') as f:
        f.write(output)

if __name__ == "__main__":
    update_home_page()
