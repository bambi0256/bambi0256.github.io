document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const postsPerPage = 6;

    function loadProjectPosts(page) {
        fetch('/assets/js/project-posts.json')
            .then(response => response.json())
            .then(data => {
                // Update Project Page
                const projectGrid = document.querySelector("#project-posts-container");
                if (projectGrid) {
                    projectGrid.innerHTML = ''; // Clear existing content
                    const start = (page - 1) * postsPerPage;
                    const end = start + postsPerPage;
                    data.slice(start, end).forEach(post => {
                        projectGrid.innerHTML += `
                            <div class="post-card">
                                <a href="/project/${post.slug}/">
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
                const homeGrid = document.querySelector("#latest-work-posts-container");
                if (homeGrid) {
                    homeGrid.innerHTML = ''; // Clear existing content
                    data.slice(0, postsPerPage).forEach(post => {
                        homeGrid.innerHTML += `
                            <div class="post-card">
                                <a href="/project/${post.slug}/">
                                    <img src="${post.main_image}" alt="${post.title}">
                                    <div class="post-info">
                                        <h3>${post.title}</h3>
                                        <p>${post.tags.map(tag => `<span>${tag}</span>`).join(', ')}</p>
                                    </div>
                                </a>
                            </div>`;
                    });
                }
            });
    }

    loadProjectPosts(currentPage);
});
