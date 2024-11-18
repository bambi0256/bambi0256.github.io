document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const postsPerPage = 6;

    function loadBlogPosts(page) {
        fetch('/assets/js/blog-posts.json')
            .then(response => response.json())
            .then(data => {
                // Update Blog Page
                const blogGrid = document.querySelector("#blog-posts-container");
                if (blogGrid) {
                    blogGrid.innerHTML = ''; // Clear existing content
                    const start = (page - 1) * postsPerPage;
                    const end = start + postsPerPage;
                    data.slice(start, end).forEach(post => {
                        blogGrid.innerHTML += `
                            <div class="post-card">
                                <a href="/blog/${post.slug}/">
                                    <img src="${post.main_image}" alt="${post.title}">
                                    <div class="post-info">
                                        <h3>${post.title}</h3>
                                        <p>${post.tags.map(tag => `<span>${tag}</span>`).join(', ')}</p>
                                    </div>
                                </a>
                            </div>`;
                    });
                }

                // Update Homepage
                const homeGrid = document.querySelector("#recent-posts-container");
                if (homeGrid) {
                    homeGrid.innerHTML = ''; // Clear existing content
                    data.slice(0, postsPerPage).forEach(post => {
                        homeGrid.innerHTML += `
                            <div class="recent-post-card">
                                <a href="/blog/${post.slug}/">
                                    <img src="${post.main_image}" alt="${post.title}">
                                    <div class="card-content">
                                        <h3>${post.title}</h3>
                                        <p>${post.excerpt}</p>
                                    </div>
                                </a>
                            </div>`;
                    });
                }
            });
    }

    loadBlogPosts(currentPage);
});
