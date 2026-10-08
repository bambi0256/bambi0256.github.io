// 개별 프로젝트 페이지의 포스트 목록을 동적으로 로드하고 표시

const POSTS_PER_PAGE = 10; // 페이지당 표시할 포스트 수
let currentPage = 1;
let allPosts = [];

// 텍스트를 HTML에 안전하게 삽입
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}

// 2025-12-15 → 2025.12.15
function formatDate(date) {
    return String(date).replace(/-/g, '.');
}

// 페이지 로드 시 포스트 데이터 불러오기
async function loadProjectPosts() {
    try {
        const response = await fetch(`/json/${projectSlug}-posts.json`);
        if (!response.ok) {
            throw new Error(`Failed to load posts: ${response.status}`);
        }

        allPosts = await response.json();
        renderPosts();
        updatePaginationControls();
    } catch (error) {
        console.error('Error loading project posts:', error);
        document.getElementById('project-posts-list').innerHTML =
            '<li class="post-list-empty">포스트를 불러올 수 없습니다.</li>';
    }
}

// 포스트 목록 렌더링 (templates/partials/post-item.html 과 같은 구조)
function renderPosts() {
    const list = document.getElementById('project-posts-list');
    const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
    const postsToShow = allPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

    if (postsToShow.length === 0) {
        list.innerHTML = '<li class="post-list-empty">포스트가 없습니다.</li>';
        return;
    }

    list.innerHTML = postsToShow.map(post => `
        <li>
            <a class="post-item" href="/projects/${encodeURIComponent(projectSlug)}/${encodeURIComponent(post.slug)}/">
                <div class="post-item-head">
                    <h3 class="post-item-title">${escapeHtml(post.title)}</h3>
                    <time class="post-item-date">${escapeHtml(formatDate(post.date))}</time>
                </div>
                <p class="post-item-preview">${escapeHtml(post.preview)}</p>
            </a>
        </li>
    `).join('');
}

// 페이지네이션 컨트롤 업데이트
function updatePaginationControls() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;
}

function changePage(delta) {
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    const next = currentPage + delta;
    if (next < 1 || next > totalPages) return;

    currentPage = next;
    renderPosts();
    updatePaginationControls();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProjectPosts();
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
});
