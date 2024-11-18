document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const postsPerPage = 6;

    function loadProjectPosts(page) {
        fetch('/assets/js/project-posts.json')
            .then(response => response.json())
            .then(data => {
                // Project 페이지에 포스트 표시
                const projectGrid = document.querySelector("#project-posts-container");
                if (projectGrid) {
                    projectGrid.innerHTML = ''; // 기존 내용 제거
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
                            <button ${page <= 1 ? "disabled" : ""} onclick="loadProjectPosts(${page - 1})">Previous</button>
                            <span>Page ${page} of ${totalPages}</span>
                            <button ${page >= totalPages ? "disabled" : ""} onclick="loadProjectPosts(${page + 1})">Next</button>`;
                    }
                }

                // Homepage Latest Works 표시
                const homeLatestWorks = document.querySelector("#latest-work-posts-container");
                if (homeLatestWorks) {
                    homeLatestWorks.innerHTML = ''; // 기존 내용 제거
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
            })
            .catch(error => console.error('Error loading project posts:', error));
    }

    loadProjectPosts(currentPage);
});
