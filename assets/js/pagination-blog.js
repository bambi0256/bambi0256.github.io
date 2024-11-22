document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const postsPerPage = 6;

    function convertToSlug(title) {
        return title
            .trim() // 양쪽 공백 제거
            .toLowerCase() // 대문자를 소문자로 변환
            .replace(/\s+/g, "-") // 공백(하나 이상)을 하이픈(-)으로 대체
            .replace(/%20/g, "-") // %20을 하이픈(-)으로 대체
            .replace(/[^a-z0-9\-]/g, ""); // 알파벳, 숫자, 하이픈만 남기고 제거
    }

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
                        const slug = convertToSlug(post.title);
                        postCard.addEventListener("click", () => {
                            window.location.href = `/blog/${slug}`;
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
                        const slug = convertToSlug(post.title);
                        postCard.addEventListener("click", () => {
                            window.location.href = `/blog/${slug}`;
                        });

                        // Append to the grid
                        homeRecentPosts.appendChild(postCard);
                    });
                }
            });
    }

    loadBlogPosts(currentPage);
});
