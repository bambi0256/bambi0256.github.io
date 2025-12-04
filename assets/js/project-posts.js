// 개별 프로젝트 페이지의 포스트 목록을 동적으로 로드하고 표시

const POSTS_PER_PAGE = 9; // 페이지당 표시할 포스트 수
let currentPage = 1;
let allPosts = [];

// 페이지 로드 시 포스트 데이터 불러오기
async function loadProjectPosts() {
    try {
        const response = await fetch(`/assets/js/${projectSlug}-posts.json`);
        if (!response.ok) {
            throw new Error(`Failed to load posts: ${response.status}`);
        }

        allPosts = await response.json();
        renderPosts();
        updatePaginationControls();
    } catch (error) {
        console.error('Error loading project posts:', error);
        document.getElementById('project-posts-grid').innerHTML =
            '<p style="text-align: center; color: #666;">포스트를 불러올 수 없습니다.</p>';
    }
}

// 포스트 카드 렌더링
function renderPosts() {
    const grid = document.getElementById('project-posts-grid');
    const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
    const endIdx = startIdx + POSTS_PER_PAGE;
    const postsToShow = allPosts.slice(startIdx, endIdx);

    if (postsToShow.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666;">포스트가 없습니다.</p>';
        return;
    }

    grid.innerHTML = postsToShow.map(post => `
        <a href="/projects/${projectSlug}/${post.slug}/" class="post-card">
            <img src="${post.main_image}" alt="${post.title}">
            <div class="card-text">
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
            </div>
        </a>
    `).join('');
}

// 페이지네이션 컨트롤 업데이트
function updatePaginationControls() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    // 이전 버튼 상태
    prevBtn.disabled = currentPage === 1;
    prevBtn.style.opacity = currentPage === 1 ? '0' : '1';

    // 다음 버튼 상태
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.style.opacity = currentPage >= totalPages ? '0' : '1';
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    loadProjectPosts();

    // 페이지네이션 버튼 이벤트
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
            updatePaginationControls();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts();
            updatePaginationControls();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});
