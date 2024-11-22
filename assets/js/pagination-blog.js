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
    		// Create elements dynamically
                        const postCard = document.createElement("div");
                        postCard.classList.add("blog-post-card");

                        const postImage = document.createElement("img");
                        postImage.src = post.main_image;
                        postImage.alt = post.title;

                        const cardText = document.createElement("div");
                        cardText.classList.add("card-text");

                        const postTitle = document.createElement("h3");
                        postTitle.textContent = post.title;

                        const postExcerpt = document.createElement("p");
                        postExcerpt.textContent = post.excerpt;

                        // Assemble the card
                        cardText.appendChild(postTitle);
                        cardText.appendChild(postExcerpt);
                        postCard.appendChild(postImage);
                        postCard.appendChild(cardText);

                        // Add click event listener
                        postCard.addEventListener("click", () => {
                            window.location.href = `/blog/${post.title}`;
                        });

                        // Append to the grid
                        blogGrid.appendChild(postCard);
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
    		// Create elements dynamically
                        const postCard = document.createElement("div");
                        postCard.classList.add("blog-post-card");

                        const postImage = document.createElement("img");
                        postImage.src = post.main_image;
                        postImage.alt = post.title;

                        const cardText = document.createElement("div");
                        cardText.classList.add("card-text");

                        const postTitle = document.createElement("h3");
                        postTitle.textContent = post.title;

                        const postExcerpt = document.createElement("p");
                        postExcerpt.textContent = post.excerpt;

                        // Assemble the card
                        cardText.appendChild(postTitle);
                        cardText.appendChild(postExcerpt);
                        postCard.appendChild(postImage);
                        postCard.appendChild(cardText);

                        // Add click event listener
                        postCard.addEventListener("click", () => {
                            window.location.href = `/blog/${post.title}`;
                        });

                        // Append to the grid
                        homeRecentPosts.appendChild(postCard);
                    });
                }
            });
    }

    loadBlogPosts(currentPage);
});
