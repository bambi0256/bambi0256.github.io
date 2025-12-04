// 메인 프로젝트 페이지에서 모든 프로젝트를 동적으로 로드하고 표시

const MAX_POSTS_PER_PROJECT = 6; // 각 프로젝트당 표시할 최대 포스트 수

// 프로젝트 메타데이터 로드 및 렌더링
async function loadAllProjects() {
    try {
        const response = await fetch('/assets/js/projects-metadata.json');
        if (!response.ok) {
            throw new Error(`Failed to load projects metadata: ${response.status}`);
        }

        const projectsData = await response.json();
        renderProjects(projectsData);
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-container').innerHTML =
            '<p style="text-align: center; color: #666;">프로젝트를 불러올 수 없습니다.</p>';
    }
}

// 프로젝트 섹션 렌더링
function renderProjects(projectsData) {
    const container = document.getElementById('projects-container');

    if (!projectsData || projectsData.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">프로젝트가 없습니다.</p>';
        return;
    }

    // 각 프로젝트마다 섹션 생성
    container.innerHTML = projectsData.map(projectData => {
        const config = projectData.config;
        const posts = projectData.posts || [];
        const displayPosts = posts.slice(0, MAX_POSTS_PER_PROJECT);

        // 포스트 카드 HTML 생성
        const postsHTML = displayPosts.map(post => `
            <a href="/projects/${config.slug}/${post.slug}/" class="post-card">
                <img src="${post.main_image}" alt="${post.title}">
                <div class="card-text">
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                </div>
            </a>
        `).join('');

        // 프로젝트 섹션 HTML 반환
        return `
            <section class="project-category section">
                <div class="container">
                    <div class="section-header">
                        <div class="text">
                            <h2 class="section-title">${config.title}</h2>
                            <p class="section-description">${config.description}</p>
                        </div>
                        <div class="button">
                            <a href="/projects/${config.slug}/" class="view-more">Learn More</a>
                        </div>
                    </div>
                    <div class="post-grid">
                        ${postsHTML || '<p style="text-align: center; color: #666;">포스트가 없습니다.</p>'}
                    </div>
                </div>
            </section>
        `;
    }).join('');
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', loadAllProjects);
