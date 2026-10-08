"""mdposts/ 의 Markdown을 포스트·프로젝트 HTML과 JSON 메타데이터로 변환한다."""
import os
import re
import shutil

import frontmatter
from bs4 import BeautifulSoup
from markdown import markdown
from pygments.formatters import HtmlFormatter
from pygments.styles import get_style_by_name

import config


def load_config_projects():
    """json/projects-config.json 에 수동 설정된 프로젝트"""
    if not os.path.exists(config.CONFIG_PATH):
        return []
    try:
        return config.read_json(config.CONFIG_PATH).get('projects', [])
    except Exception as e:
        print(f"Warning: Could not load {config.CONFIG_PATH}: {e}")
        return []


def scan_mdposts_directories():
    """mdposts/ 하위 디렉토리를 프로젝트로 자동 발견"""
    discovered = []
    if not os.path.exists(config.MDPOSTS_DIR):
        print(f"Warning: {config.MDPOSTS_DIR} directory does not exist")
        return discovered

    for slug in os.listdir(config.MDPOSTS_DIR):
        item_path = os.path.join(config.MDPOSTS_DIR, slug)
        if not os.path.isdir(item_path):
            continue

        # 첫 번째 md의 Front Matter에서 프로젝트 정보를 읽는다
        title = slug
        description = f"{slug} project"
        md_files = [f for f in os.listdir(item_path) if f.endswith('.md')]
        if md_files:
            first_md = os.path.join(item_path, md_files[0])
            try:
                metadata, _ = process_markdown(first_md)
                title = metadata.get('project_title', slug)
                description = metadata.get('project_description', description)
            except Exception as e:
                print(f"Warning: Could not read metadata from {first_md}: {e}")

        discovered.append({
            'slug': slug,
            'title': title,
            'description': description,
            'mdposts_dir': item_path,
            'output_dir': f'{config.PROJECTS_DIR}/{slug}'
        })
    return discovered


def load_projects_config():
    """수동 설정 프로젝트 + 자동 발견 프로젝트 (설정이 우선)"""
    projects = load_config_projects()
    configured = {p['slug'] for p in projects}
    for discovered in scan_mdposts_directories():
        if discovered['slug'] not in configured:
            projects.append(discovered)
            print(f"Auto-discovered project: {discovered['slug']}")
    return projects


def cleanup_old_projects(current_projects):
    """이전 빌드에는 있었으나 지금은 없는 프로젝트의 산출물을 제거"""
    if not os.path.exists(config.METADATA_PATH):
        return
    try:
        old_projects = [p['config'] for p in config.read_json(config.METADATA_PATH)]
    except Exception as e:
        print(f"Warning: Could not load previous metadata: {e}")
        return

    current_slugs = {p['slug'] for p in current_projects}
    for old in old_projects:
        if old['slug'] in current_slugs:
            continue
        print(f"Cleaning up removed project: {old['slug']}")

        output_dir = old['output_dir']
        if os.path.exists(output_dir):
            shutil.rmtree(output_dir)
            print(f"  - Removed directory: {output_dir}/")

        json_path = posts_json_path(old['slug'])
        if os.path.exists(json_path):
            os.remove(json_path)
            print(f"  - Removed JSON: {json_path}")


def posts_json_path(slug):
    return f"{config.JSON_DIR}/{slug}-posts.json"


def create_slug(title):
    return title.strip().lower().replace(" ", "-").replace("%20", "-")


def process_markdown(md_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)
    return post.metadata, post.content


def extract_toc_headers(markdown_content):
    """Markdown → (TOC 헤더 목록(H2/H3), 본문 HTML, Pygments CSS)"""
    html_content = markdown(markdown_content, extensions=["fenced_code", "codehilite"])
    soup = BeautifulSoup(html_content, "html.parser")

    headers = []
    for header in soup.find_all(["h2", "h3"]):
        header_text = header.get_text()
        header_id = re.sub(r'\s+', '-', header_text.lower())
        header_level = 2 if header.name == "h2" else 3
        headers.append({"id": header_id, "text": header_text, "level": header_level})
        header["id"] = header_id

    style = get_style_by_name("solarized-dark")
    pygments_css = HtmlFormatter(style=style).get_style_defs('.codehilite')

    return headers, str(soup), pygments_css


def render_post_html(metadata, html_content, toc_headers, pygments_css, output_dir):
    html = config.get_template(config.TEMPLATE_PROJECT_POST).render(
        metadata=metadata,
        content=html_content,
        toc_headers=toc_headers,
        pygments_css=pygments_css
    )
    config.write_html(os.path.join(output_dir, "index.html"), html)


def render_project_listing(project_config, posts_metadata):
    html = config.get_template(config.TEMPLATE_PROJECT_PAGE).render(
        project_title=project_config['title'],
        project_description=project_config.get('description', ''),
        project_slug=project_config['slug'],
        posts=posts_metadata
    )
    config.write_html(os.path.join(project_config['output_dir'], 'index.html'), html)


def process_project_posts(project_config):
    """프로젝트의 모든 포스트를 HTML로 렌더링하고 메타데이터를 최신순으로 반환"""
    md_dir = project_config['mdposts_dir']
    posts_metadata = []

    if not os.path.exists(md_dir):
        print(f"Warning: Directory {md_dir} does not exist. Skipping.")
        return posts_metadata

    for root, _, files in os.walk(md_dir):
        for file in files:
            if not file.endswith(".md"):
                continue

            metadata, markdown_content = process_markdown(os.path.join(root, file))
            toc_headers, html_content, pygments_css = extract_toc_headers(markdown_content)

            metadata['category'] = project_config['slug']
            metadata['category_title'] = project_config['title']

            output_dir = os.path.join(project_config['output_dir'], create_slug(metadata['slug']))
            render_post_html(metadata, html_content, toc_headers, pygments_css, output_dir)

            posts_metadata.append(metadata)
            print(f"Processed: {metadata['title']}")

    posts_metadata.sort(key=lambda x: x.get('date', ''), reverse=True)
    return posts_metadata


def main():
    projects = load_projects_config()
    cleanup_old_projects(projects)

    all_projects_data = []
    for project in projects:
        print(f"\nProcessing project: {project['title']}")

        posts_metadata = process_project_posts(project)
        config.write_json(posts_json_path(project['slug']), posts_metadata)
        render_project_listing(project, posts_metadata)

        all_projects_data.append({'config': project, 'posts': posts_metadata})

    config.write_json(config.METADATA_PATH, all_projects_data)
    print("\n✅ All projects processed successfully!")


if __name__ == "__main__":
    main()
