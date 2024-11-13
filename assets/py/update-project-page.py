import os
import markdown
import json
from jinja2 import Environment, FileSystemLoader
import yaml

PROJECT_MD_DIR = "./mdposts/project/"
PROJECT_HTML_DIR = "./project/"
PROJECT_TEMPLATE_DIR = os.path.abspath("./")
PROJECT_POST_TEMPLATE = "project/project-post-template.html"
PROJECT_JSON_FILE = "./assets/js/project-posts.json"

def load_metadata_and_content_from_md(filepath):
    """Extract metadata and content from markdown file."""
    with open(filepath, 'r') as file:
        content = file.read()
    
    if content.startswith('---'):
        _, meta_str, body = content.split('---', 2)
        metadata = yaml.safe_load(meta_str)
        html_content = markdown.markdown(body)
        return metadata, html_content
    return None, None

def write_html_from_template(metadata, content, template_file, output_dir):
    """Render HTML using a Jinja2 template and both metadata and content."""
    env = Environment(loader=FileSystemLoader(PROJECT_TEMPLATE_DIR))
    template = env.get_template(template_file)
    output_html = template.render(metadata=metadata, content=content)
    output_path = os.path.join(output_dir, metadata['slug'], 'index.html')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as output_file:
        output_file.write(output_html)

def update_project_json(project_posts):
    """Initialize and write the project posts to the JSON file."""
    with open(PROJECT_JSON_FILE, 'w') as json_file:
        json.dump(project_posts, json_file, indent=4)

def main():
    project_posts = []

    # Iterate over all markdown files in the project directory
    for filename in os.listdir(PROJECT_MD_DIR):
        if filename.endswith('.md'):
            filepath = os.path.join(PROJECT_MD_DIR, filename)
            metadata, content = load_metadata_and_content_from_md(filepath)
            if metadata:
                metadata['slug'] = filename[:-3]  # Assuming filename without extension as slug
                write_html_from_template(metadata, content, PROJECT_POST_TEMPLATE, PROJECT_HTML_DIR)
                project_posts.append(metadata)

    # Update JSON file
    update_project_json(project_posts)

if __name__ == "__main__":
    main()
