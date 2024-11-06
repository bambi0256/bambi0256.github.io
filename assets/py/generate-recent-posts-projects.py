import os
from generate-index.py import get_recent_posts

def generate_recent_project_posts():
    project_posts = get_recent_posts('projects')
    for post in project_posts:
        print(f"Title: {post['title']}, Date: {post['date']}")
        
if __name__ == "__main__":
    generate_recent_project_posts()
