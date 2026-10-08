"""빌드 스크립트 공통 설정. 경로는 모두 저장소 루트 기준이며, 스크립트는 루트에서 실행한다."""
import json
import os

from jinja2 import Environment, FileSystemLoader

# 입력
MDPOSTS_DIR = 'mdposts'
TEMPLATES_DIR = 'templates'
CONFIG_PATH = 'json/projects-config.json'

# 출력
JSON_DIR = 'json'
METADATA_PATH = 'json/projects-metadata.json'
PROJECTS_DIR = 'projects'
ABOUT_DIR = 'about'
WRITE_DIR = 'write'
HOME_PATH = 'index.html'

# 템플릿 파일명 (TEMPLATES_DIR 기준)
TEMPLATE_HOME = 'index.html'
TEMPLATE_ABOUT = 'about.html'
TEMPLATE_WRITE = 'write.html'
TEMPLATE_PROJECTS = 'projects.html'
TEMPLATE_PROJECT_PAGE = 'project-page.html'
TEMPLATE_PROJECT_POST = 'project-post.html'


def get_template(name):
    env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))
    return env.get_template(name)


def write_html(path, html):
    """상위 디렉토리를 만들며 HTML 파일을 쓴다."""
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)


def write_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


def read_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)
