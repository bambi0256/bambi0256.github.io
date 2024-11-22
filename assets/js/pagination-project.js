document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const postsPerPage = 6;

    function loadProjectPosts(page) {
        fetch('/assets/js/project-posts.json')
            .then(response => response.json())
            .then(data => {
                const projectGrid = document.querySelector("#project-posts-container");
                const homeLatestWorks = document.querySelector("#latest-work-posts-container");

                // Project Page Updates
                if (projectGrid) {
                    projectGrid.innerHTML = '';
                    const start = (page - 1) * postsPerPage;
                    const end = start + postsPerPage;
                    const pagePosts = data.slice(start, end);

                    pagePosts.forEach(post => {
                        const postCard = `
                            <div class="project-post-card">
                                <img src="${post.main_image}" alt="${post.title}">
                                <div class="card-text">${post.title}</div>
                            </div>`;
                        projectGrid.innerHTML += postCard;
                    });

                    // Pagination Controls
                    const paginationControls = document.querySelector("#pagination-controls");
                    if (paginationControls) {
                        const totalPages = Math.ceil(data.length / postsPerPage);
                        paginationControls.innerHTML = `
                            <button ${page <= 1 ? "disabled" : ""} onclick="loadProjectPosts(${page - 1})"> ← </button>
                            <span>Page ${page} of ${totalPages}</span>
                            <button ${page >= totalPages ? "disabled" : ""} onclick="loadProjectPosts(${page + 1})"> → </button>`;
                    }
                }

                // Homepage Updates
                if (homeLatestWorks) {
                    homeLatestWorks.innerHTML = '';
                    const latestWorks = data.slice(0, postsPerPage);
                    latestWorks.forEach(post => {
                        const postCard = `
                            <div class="project-post-card">
                                <img src="${post.main_image}" alt="${post.title}">
                                <div class="card-text">${post.title}</div>
                            </div>`;
                        homeLatestWorks.innerHTML += postCard;
                    });
                }
            });
    }

    loadProjectPosts(currentPage);
});
