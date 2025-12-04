import os
import json
import frontmatter
from markdown import markdown
from jinja2 import Environment, FileSystemLoader
from bs4 import BeautifulSoup
from pygments.formatters import HtmlFormatter
from pygments.styles import get_style_by_name
import re
import shutil


# Scan mdposts directory for all project folders
def scan_mdposts_directories():
    """Automatically discover all project directories in mdposts/"""
    mdposts_base = 'mdposts'
    discovered_projects = []
    
    if not os.path.exists(mdposts_base):
        print(f"Warning: {mdposts_base} directory does not exist")
        return discovered_projects
    
    # Find all subdirectories in mdposts/
    for item in os.listdir(mdposts_base):
        item_path = os.path.join(mdposts_base, item)
        if os.path.isdir(item_path):
            # Use directory name as slug
            slug = item
            
            # Try to get title and description from first MD file
            title = slug  # default to slug
            description = f"{slug} project"
            
            # Look for MD files to extract metadata
            md_files = [f for f in os.listdir(item_path) if f.endswith('.md')]
            if md_files:
                try:
                    first_md = os.path.join(item_path, md_files[0])
                    with open(first_md, 'r', encoding='utf-8') as f:
                        post = frontmatter.load(f)
                        # Try to get project info from frontmatter
                        title = post.metadata.get('project_title', slug)
                        description = post.metadata.get('project_description', f"{slug} project")
                except Exception as e:
                    print(f"Warning: Could not read metadata from {first_md}: {e}")
            
            discovered_projects.append({
                'slug': slug,
                'title': title,
                'description': description,
                'mdposts_dir': item_path,
                'output_dir': f'projects/{slug}'  # projects/ 하위에 생성
            })
    
    return discovered_projects

# Load project configurations from config file
def load_config_projects():
    """Load manually configured projects from projects-config.json"""
    config_path = 'json/projects-config.json'
    if not os.path.exists(config_path):
        return []
    
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('projects', [])
    except Exception as e:
        print(f"Warning: Could not load {config_path}: {e}")
        return []

# Merge configured and discovered projects
def load_projects_config():
    """Merge manually configured projects with auto-discovered ones"""
    config_projects = load_config_projects()
    discovered_projects = scan_mdposts_directories()
    
    # Create a map of configured projects by slug
    config_map = {p['slug']: p for p in config_projects}
    
    # Merge: prioritize config settings, add discovered projects not in config
    all_projects = list(config_projects)  # Start with configured projects
    
    for discovered in discovered_projects:
        if discovered['slug'] not in config_map:
            all_projects.append(discovered)
            print(f"Auto-discovered project: {discovered['slug']}")
    
    return all_projects

# Clean up old project files that no longer exist
def cleanup_old_projects(current_projects):
    """Remove output files for projects that no longer exist"""
    metadata_path = './json/projects-metadata.json'
    
    # Load previous metadata to find old projects
    old_projects = []
    if os.path.exists(metadata_path):
        try:
            with open(metadata_path, 'r', encoding='utf-8') as f:
                old_data = json.load(f)
                old_projects = [p['config']['slug'] for p in old_data]
        except Exception as e:
            print(f"Warning: Could not load previous metadata: {e}")
    
    current_slugs = {p['slug'] for p in current_projects}
    
    # 제거된 프로젝트 찾기
    removed_projects = [slug for slug in old_projects if slug not in current_slugs]
    
    for slug in removed_projects:
        print(f"Cleaning up removed project: {slug}")
        
        # 출력 디렉토리 제거
        output_dir = f'projects/{slug}'  # projects/ 하위 경로 사용
        if os.path.exists(output_dir):
            try:
                shutil.rmtree(output_dir)
                print(f"  - Removed directory: {output_dir}/")
            except Exception as e:
                print(f"  - Error removing {output_dir}: {e}")
        
        # Remove JSON file
        json_path = f"./json/{slug}-posts.json"
        if os.path.exists(json_path):
            try:
                os.remove(json_path)
                print(f"  - Removed JSON: {json_path}")
            except Exception as e:
                print(f"  - Error removing {json_path}: {e}")


# Slug generation
def create_slug(title):
    return title.strip().lower().replace(" ", "-").replace("%20", "-")

# 마크다운 파일 처리
def process_markdown(md_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)
    return post.metadata, post.content

# TOC 헤더 추출 (H2와 H3만, H1 제외)
def extract_toc_headers(markdown_content):
    html_content = markdown(markdown_content, extensions=["fenced_code", "codehilite"])
    soup = BeautifulSoup(html_content, "html.parser")

    # TOC 헤더 - H2와 H3만
    headers = []
    for header in soup.find_all(["h2", "h3"]):
        header_text = header.get_text()
        header_id = re.sub(r'\s+', '-', header_text.lower())
        header_level = 2 if header.name == "h2" else 3
        headers.append({"id": header_id, "text": header_text, "level": header_level})
        header["id"] = header_id

    # Pygments CSS style
    style = get_style_by_name("solarized-dark")
    pygments_css = HtmlFormatter(style=style).get_style_defs('.codehilite')

    return headers, str(soup), pygments_css

# Render HTML for individual post
def render_post_html(metadata, html_content, toc_headers, pygments_css, template_file, output_dir):
    env = Environment(loader=FileSystemLoader(searchpath="./"))
    template = env.get_template(template_file)

    rendered_html = template.render(
        metadata=metadata,
        content=html_content,
        toc_headers=toc_headers,
        pygments_css=pygments_css
    )

    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "index.html")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(rendered_html)

# 프로젝트 목록 페이지 렌더링 (개별 프로젝트 페이지)
def render_project_listing(project_config, posts_metadata):
    env = Environment(loader=FileSystemLoader('./'))
    template = env.get_template('temp-project-page.html')
    
    output = template.render(
        project_title=project_config['title'],
        project_description=project_config.get('description', ''),
        project_slug=project_config['slug'],
        posts=posts_metadata  # 포스트 목록 전달
    )
    
    output_dir = project_config['output_dir']
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'index.html')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output)

# Process all posts in a project category
def process_project_posts(project_config):
    md_dir = project_config['mdposts_dir']
    output_base = project_config['output_dir']
    posts_metadata = []
    
    if not os.path.exists(md_dir):
        print(f"Warning: Directory {md_dir} does not exist. Skipping.")
        return posts_metadata
    
    for root, _, files in os.walk(md_dir):
        for file in files:
            if file.endswith(".md"):
                md_file = os.path.join(root, file)
                
                # Process markdown
                metadata, markdown_content = process_markdown(md_file)
                toc_headers, html_content, pygments_css = extract_toc_headers(markdown_content)
                
                #Add project category to metadata
                metadata['category'] = project_config['slug']
                metadata['category_title'] = project_config['title']
                
                # Output directory for this post
                slug = create_slug(metadata['slug'])
                output_dir = os.path.join(output_base, slug)
                
                # Render HTML
                render_post_html(metadata, html_content, toc_headers, pygments_css, 
                               "./temp-project-post.html", output_dir)
                
                # Save metadata
                posts_metadata.append(metadata)
                print(f"Processed: {metadata['title']}")
    
    # Sort by date (newest first)
    posts_metadata.sort(key=lambda x: x.get('date', ''), reverse=True)
    
    return posts_metadata

# Main function
def main():
    projects = load_projects_config()
    
    # Clean up old projects first
    cleanup_old_projects(projects)
    
    all_projects_data = []
    
    for project in projects:
        print(f"\nProcessing project: {project['title']}")
        
        # Process all posts in this project
        posts_metadata = process_project_posts(project)
        
        # Save project-specific JSON
        project_json_path = f"./json/{project['slug']}-posts.json"
        with open(project_json_path, 'w', encoding='utf-8') as f:
            json.dump(posts_metadata, f, ensure_ascii=False, indent=4)
        
        # Render project listing page
        render_project_listing(project, posts_metadata)
        
        # Collect for global metadata
        all_projects_data.append({
            'config': project,
            'posts': posts_metadata
        })
    
    # Save global projects metadata
    with open('./json/projects-metadata.json', 'w', encoding='utf-8') as f:
        json.dump(all_projects_data, f, ensure_ascii=False, indent=4)
    
    print("\n✅ All projects processed successfully!")

if __name__ == "__main__":
    main()

