import os
from jinja2 import Environment, FileSystemLoader

def update_home_page():
    # 기존 데이터 처리 로직은 유지 가능 (추후 필요 시 추가)

    # 1. Jinja2 환경 설정
    env = Environment(loader=FileSystemLoader('./'))
    template = env.get_template('temp-index.html')
    
    # 2. 템플릿 렌더링
    output = template.render()  # 현재 데이터 없이 렌더링
    
    # 3. 파일 생성
    output_path = './index.html'
    with open(output_path, 'w') as f:
        f.write(output)
    
    print(f"Updated {output_path}")

if __name__ == "__main__":
    update_home_page()
