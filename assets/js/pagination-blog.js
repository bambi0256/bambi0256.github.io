document.addEventListener("DOMContentLoaded", function() {
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
                                    <div class="post-text">
                                        <p><strong>${post.title}</strong></p>
                                        <p>${post.excerpt}</p>
                                        <p class="post-tags">
                                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                        </p>
                                        <p class="post-date">Posted on ${post.date}</p>
                                    </div>
                                </a>
                            </div>
                        `;
                        blogGrid.innerHTML += postCard;
                    });

                    // Update pagination buttons
                    const totalPages = Math.ceil(data.length / postsPerPage);
                    document.querySelector("#pagination-controls").innerHTML = `
                        <button ${page <= 1 ? "disabled" : ""} onclick="loadBlogPosts(${page - 1})">Previous</button>
                        <span>Page ${page} of ${totalPages}</span>
                        <button ${page >= totalPages ? "disabled" : ""} onclick="loadBlogPosts(${page + 1})">Next</button>
                    `;
                }

                // Update Home Page Recent Posts
                const homeRecentPosts = document.querySelector("#recent-posts-container");
                if (homeRecentPosts) {
                    homeRecentPosts.innerHTML = ''; // Clear existing content
                    const recentPosts = data.slice(0, 3); // Show latest 3 posts

                    recentPosts.forEach(post => {
                        const postCard = `
                            <div class="post-card">
                                <a href="/blog/${post.slug}/">
                                    <div class="post-text">
                                        <p><strong>${post.title}</strong></p>
                                        <p>${post.excerpt}</p>
                                        <p class="post-tags">
                                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                        </p>
                                        <p class="post-date">Posted on ${post.date}</p>
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
