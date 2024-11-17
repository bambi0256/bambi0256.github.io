document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const postsPerPage = 6;

    function loadBlogPosts(page) {
        fetch('/assets/js/blog-posts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Loaded blog posts data:', data);

                // Update Blog Page
                const blogGrid = document.querySelector("#blog-posts-container");
                if (blogGrid) {
                    blogGrid.innerHTML = ''; // Clear existing content

                    const start = (page - 1) * postsPerPage;
                    const end = start + postsPerPage;
                    const pagePosts = data.slice(start, end);

                    pagePosts.forEach(post => {
                        const postCard = `
                            <div class="post-card">
                                <a href="/blog/${post.slug}/">
                                    <img src="${post.main_image}" alt="${post.title}">
                                    <div class="post-info">
                                        <h3>${post.title}</h3>
                                        <p>${post.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}</p>
                                    </div>
                                </a>
                            </div>
                        `;
                        blogGrid.innerHTML += postCard;
                    });

                    // Pagination Controls
                    const totalPages = Math.ceil(data.length / postsPerPage);
                    const paginationControls = document.querySelector("#pagination-controls");
                    if (paginationControls) {
                        paginationControls.innerHTML = `
                            <button ${page <= 1 ? "disabled" : ""} onclick="loadBlogPosts(${page - 1})">Previous</button>
                            <span>Page ${page} of ${totalPages}</span>
                            <button ${page >= totalPages ? "disabled" : ""} onclick="loadBlogPosts(${page + 1})">Next</button>
                        `;
                    }
                }

                // Update Home Page Recent Posts
                const homeRecentPosts = document.querySelector("#recent-posts-container");
                if (homeRecentPosts) {
                    homeRecentPosts.innerHTML = ''; // Clear existing content
                    const recentPosts = data.slice(0, postsPerPage); // Show latest 6 posts

                    recentPosts.forEach(post => {
                        const postCard = `
                            <div class="recent-post-card">
                                <a href="/blog/${post.slug}/">
                                    <img src="${post.main_image}" alt="${post.title}">
                                    <div class="card-content">
                                        <h3>${post.title}</h3>
                                        <p>${post.excerpt}</p>
                                    </div>
                                </a>
                            </div>
                        `;
                        homeRecentPosts.innerHTML += postCard;
                    });
                }
            })
            .catch(error => {
                console.error('Error loading blog posts:', error);
            });
    }

    loadBlogPosts(currentPage);
});
