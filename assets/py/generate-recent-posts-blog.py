import os
from generate-index.py import get_recent_posts

def generate_recent_blog_posts():
    blog_posts = get_recent_posts('blog')
    for post in blog_posts:
        print(f"Title: {post['title']}, Date: {post['date']}")
        
if __name__ == "__main__":
    generate_recent_blog_posts()
