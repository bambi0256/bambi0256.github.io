document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const postsPerPage = 6;

    function loadBlogPosts(page) {
        fetch('/assets/js/blog-posts.json')
            .then(response => response.json())
            .then(data => {
                // Blog 페이지에 포스트 표시
                const blogGrid = document.querySelector("#blog-posts-container");
                if (blogGrid) {
                    blogGrid.innerHTML = ''; // 기존 내용 제거
                    const start = (page - 1) * postsPerPage;
                    const end = start + postsPerPage;
                    const pagePosts = data.slice(start, end);

                    pagePosts.forEach(post => {
                        const postCard = `
                            <div class="blog-post-card">
                                <img src="${post.main_image}" alt="${post.title}">
                                <div class="card-text">
                                    <h3>${post.title}</h3>
                                    <p>${post.excerpt}</p>
                                </div>
                            </div>`;
                        blogGrid.innerHTML += postCard;
                    });

                    // Pagination Controls
                    const paginationControls = document.querySelector("#pagination-controls");
                    if (paginationControls) {
                        const totalPages = Math.ceil(data.length / postsPerPage);
                        paginationControls.innerHTML = `
                            <button ${page <= 1 ? "disabled" : ""} onclick="loadBlogPosts(${page - 1})">Previous</button>
                            <span>Page ${page} of ${totalPages}</span>
                            <button ${page >= totalPages ? "disabled" : ""} onclick="loadBlogPosts(${page + 1})">Next</button>`;
                    }
                }

                // Homepage 최근 포스트 표시
                const homeRecentPosts = document.querySelector("#recent-posts-container");
                if (homeRecentPosts) {
                    homeRecentPosts.innerHTML = ''; // 기존 내용 제거
                    const recentPosts = data.slice(0, postsPerPage);

                    recentPosts.forEach(post => {
                        const postCard = `
                            <div class="blog-post-card">
                                <img src="${post.main_image}" alt="${post.title}">
                                <div class="card-text">
                                    <h3>${post.title}</h3>
                                    <p>${post.excerpt}</p>
                                </div>
                            </div>`;
                        homeRecentPosts.innerHTML += postCard;
                    });
                }
            })
            .catch(error => console.error('Error loading blog posts:', error));
    }

    loadBlogPosts(currentPage);
});
