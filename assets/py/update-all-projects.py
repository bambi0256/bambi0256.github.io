import os
import json
import frontmatter
from markdown import markdown
from jinja2 import Environment, FileSystemLoader
from bs4 import BeautifulSoup
from pygments.formatters import HtmlFormatter
from pygments.styles import get_style_by_name
import re

# Load project configurations
def load_projects_config():
    with open('projects-config.json', 'r', encoding='utf-8') as f:
        return json.load(f)['projects']

# Slug generation
def create_slug(title):
    return title.strip().lower().replace(" ", "-").replace("%20", "-")

# Process markdown file
def process_markdown(md_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)
    return post.metadata, post.content

# Extract TOC headers (H2 and H3 only, excluding H1)
def extract_toc_headers(markdown_content):
    html_content = markdown(markdown_content, extensions=["fenced_code", "codehilite"])
    soup = BeautifulSoup(html_content, "html.parser")

    # TOC Headers - only H2 and H3
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

# Render project listing page
def render_project_listing(project_config, posts_metadata):
    env = Environment(loader=FileSystemLoader('./'))
    template = env.get_template('temp-project.html')
    
    output = template.render(
        project_title=project_config['title'],
        project_description=project_config.get('description', '')
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
    all_projects_data = []
    
    for project in projects:
        print(f"\nProcessing project: {project['title']}")
        
        # Process all posts in this project
        posts_metadata = process_project_posts(project)
        
        # Save project-specific JSON
        project_json_path = f"./assets/js/{project['slug']}-posts.json"
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
    with open('./assets/js/projects-metadata.json', 'w', encoding='utf-8') as f:
        json.dump(all_projects_data, f, ensure_ascii=False, indent=4)
    
    print("\n✅ All projects processed successfully!")

if __name__ == "__main__":
    main()
