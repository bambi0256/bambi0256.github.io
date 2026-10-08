"""홈(index.html), Projects, About, Write 페이지를 생성한다. update-all-projects.py 실행 후에 실행해야 한다."""
import os

import config

RECENT_POSTS_LIMIT = 9


def load_projects_metadata():
    """update-all-projects.py 가 생성한 전체 프로젝트 메타데이터"""
    if not os.path.exists(config.METADATA_PATH):
        print("Warning: projects-metadata.json not found. Run update-all-projects.py first.")
        return []
    return config.read_json(config.METADATA_PATH)


def get_all_recent_posts(projects_data, limit=RECENT_POSTS_LIMIT):
    """모든 프로젝트의 포스트 중 최신순 N개"""
    all_posts = []
    for project_data in projects_data:
        project_config = project_data['config']
        for post in project_data['posts']:
            post['category_slug'] = project_config['slug']
            post['category_output_dir'] = project_config['output_dir']
            all_posts.append(post)

    all_posts.sort(key=lambda x: x.get('date', ''), reverse=True)
    return all_posts[:limit]


def update_homepage(projects_data):
    html = config.get_template(config.TEMPLATE_HOME).render(
        recent_posts=get_all_recent_posts(projects_data)
    )
    config.write_html(config.HOME_PATH, html)
    print("✅ Homepage updated successfully!")


def update_projects_page(projects_data):
    html = config.get_template(config.TEMPLATE_PROJECTS).render(all_projects=projects_data)
    config.write_html(os.path.join(config.PROJECTS_DIR, 'index.html'), html)
    print("✅ Projects page updated successfully!")


def update_about_page():
    html = config.get_template(config.TEMPLATE_ABOUT).render()
    config.write_html(os.path.join(config.ABOUT_DIR, 'index.html'), html)
    print("✅ About page updated successfully!")


def update_write_page():
    html = config.get_template(config.TEMPLATE_WRITE).render()
    config.write_html(os.path.join(config.WRITE_DIR, 'index.html'), html)
    print("✅ Write page updated successfully!")


if __name__ == "__main__":
    projects_data = load_projects_metadata()
    update_homepage(projects_data)
    update_projects_page(projects_data)
    update_about_page()
    update_write_page()
