import os
import markdown
import json
from jinja2 import Environment, FileSystemLoader
import yaml

BLOG_MD_DIR = "./mdposts/blog/"
BLOG_HTML_DIR = "./blog/"
BLOG_TEMPLATE_DIR = os.path.abspath("./")
BLOG_POST_TEMPLATE = "blog/blog-post-template.html"
BLOG_JSON_FILE = "./assets/js/blog-posts.json"

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
    env = Environment(loader=FileSystemLoader(BLOG_TEMPLATE_DIR))
    template = env.get_template(template_file)
    output_html = template.render(metadata=metadata, content=content)
    output_path = os.path.join(output_dir, metadata['slug'], 'index.html')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as output_file:
        output_file.write(output_html)

def update_blog_json(blog_posts):
    """Initialize and write the blog posts to the JSON file."""
    with open(BLOG_JSON_FILE, 'w') as json_file:
        json.dump(blog_posts, json_file, indent=4)

def main():
    blog_posts = []

    # Iterate over all markdown files in the blog directory
    for filename in os.listdir(BLOG_MD_DIR):
        if filename.endswith('.md'):
            filepath = os.path.join(BLOG_MD_DIR, filename)
            metadata, content = load_metadata_and_content_from_md(filepath)
            if metadata:
                metadata['slug'] = filename[:-3]  # Assuming filename without extension as slug
                write_html_from_template(metadata, content, BLOG_POST_TEMPLATE, BLOG_HTML_DIR)
                blog_posts.append(metadata)

    # Update JSON file
    update_blog_json(blog_posts)

if __name__ == "__main__":
    main()