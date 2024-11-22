document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const postsPerPage = 6;

    function loadBlogPosts(page) {
        fetch('/assets/js/blog-posts.json')
            .then(response => response.json())
            .then(data => {
                const blogGrid = document.querySelector("#blog-posts-container");
                const homeRecentPosts = document.querySelector("#recent-posts-container");

                // Blog Page Updates
                if (blogGrid) {
                    blogGrid.innerHTML = '';
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
                            <button ${page <= 1 ? "disabled" : ""} onclick="loadBlogPosts(${page - 1})"> ← </button>
                            <span>Page ${page} of ${totalPages}</span>
                            <button ${page >= totalPages ? "disabled" : ""} onclick="loadBlogPosts(${page + 1})"> → </button>`;
                    }
                }

                // Homepage Updates
                if (homeRecentPosts) {
                    homeRecentPosts.innerHTML = '';
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
            });
    }

    loadBlogPosts(currentPage);
});
